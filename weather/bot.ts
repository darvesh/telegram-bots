import {
	Bot,
	Context,
	InlineKeyboard,
	NextFunction,
} from "https://deno.land/x/grammy@v1.14.1/mod.ts";

import { escape, formatNames } from "./formatter.ts";
import {
	api,
	aqi,
	astronomy,
	emptyResult,
	forecast,
	weather,
} from "./handler.ts";
import {
	cacheLastUserLocation,
	cachePlaceName,
	getPlaceName,
	getUserLocations,
} from "./kv.ts";

const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
if (!BOT_TOKEN) throw new Error("Bot Token is not set!");

const bot = new Bot(BOT_TOKEN);

async function responseTime(ctx: Context, next: NextFunction): Promise<void> {
	if (!ctx.inlineQuery?.query) return await next();
	console.log(ctx.inlineQuery?.query);
	const before = Date.now(); // milliseconds
	await next();
	const after = Date.now(); // milliseconds
	console.log(`Response time: ${after - before} ms`);
}

bot.use(responseTime);

bot.inlineQuery(/^[\w\s'-]+$/, async (ctx) => {
	const query = ctx.inlineQuery.query?.trim();
	if (!query) return;
	const locations = await api("search", query);
	if (!locations || !locations.length)
		return ctx.answerInlineQuery(emptyResult(query), {
			cache_time: Number(Deno.env.get("CACHE_TIME")) || 0,
		});
	await ctx.answerInlineQuery(
		locations.map((location) => ({
			type: "article",
			id: `id:${location.id}`,
			title: escape(`${location.name}`),
			description: escape(formatNames([location.region, location.country])),
			input_message_content: {
				message_text: "Crunching weather data for you...",
			},
			reply_markup: new InlineKeyboard().switchInlineCurrent(
				"Try another location",
				query.slice(0, -1)
			),
		})),
		{
			cache_time: Number(Deno.env.get("CACHE_TIME")) || 0,
		}
	);
	await Promise.all(
		locations.map((location) =>
			cachePlaceName(`id:${location.id}`, [
				location.name,
				location.region,
				location.country,
			])
		)
	);
});

bot.inlineQuery(/.*/, async (ctx) => {
	const query = ctx.inlineQuery.query?.trim();
	if (!query) {
		const locationIds = await getUserLocations(ctx.from.id);
		if (!locationIds.length) return;
		const locations = await Promise.all(
			locationIds.map(async (locationId) => {
				const location = await getPlaceName(locationId);
				if (!location) return null;
				return [locationId, ...location];
			})
		);
		return ctx.answerInlineQuery(
			locations
				.filter((location): location is NonNullable<typeof location> =>
					Boolean(location)
				)
				.map((location) => {
					const [locationId, name, region, country] = location;
					return {
						type: "article",
						id: `${locationId}`,
						title: escape(`${name}`),
						description: escape(formatNames([region, country])),
						input_message_content: {
							message_text: "Crunching weather data for you...",
						},
						reply_markup: new InlineKeyboard().switchInlineCurrent(
							"Try another location",
							name.slice(0, -1)
						),
					};
				}),
			{
				cache_time: Number(Deno.env.get("CACHE_TIME")) || 0,
			}
		);
	}
});

bot.on("chosen_inline_result", async (ctx) => {
	const location = ctx.chosenInlineResult.result_id;
	const messageId = ctx.inlineMessageId;
	if (!messageId) return;
	const place = await getPlaceName(location);
	await weather(ctx, location, messageId, ctx.from.id);
	if (place) await cacheLastUserLocation(ctx.from.id, location);
});

bot.on("callback_query:data", async (ctx) => {
	const messageId = ctx.inlineMessageId;
	if (!messageId) return;
	const data = JSON.parse(ctx.callbackQuery.data) as {
		t: string;
		lc: string;
		uid?: number;
	};
	if (ctx.callbackQuery?.from?.id !== data.uid) {
		return ctx.answerCallbackQuery(
			"Only the person who sent the above message can use this button."
		);
	}
	if (data.t === "astronomy") {
		return await astronomy(ctx, data.lc, messageId, data.uid);
	}
	if (data.t === "weather") {
		return await weather(ctx, data.lc, messageId, data.uid);
	}
	if (data.t === "aqi") {
		return await aqi(ctx, data.lc, messageId, data.uid);
	}
	if (data.t === "forecast") {
		return await forecast(ctx, data.lc, messageId, data.uid);
	}
	return ctx.api.editMessageTextInline(messageId, "Something went wrong!", {
		parse_mode: "HTML",
		reply_markup: new InlineKeyboard()
			.text(
				"Astronomy",
				`${JSON.stringify({ t: "astronomy", lc: data.lc, uid: data.uid })}`
			)
			.text(
				"Weather",
				`${JSON.stringify({ t: "weather", lc: data.lc, uid: data.uid })}`
			)
			.text(
				"Forecast",
				`${JSON.stringify({ t: "forecast", lc: data.lc, uid: data.uid })}`
			),
	});
});
export { bot };
