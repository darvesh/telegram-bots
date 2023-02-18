import { Context } from "https://deno.land/x/grammy@v1.14.1/context.ts";
import { Filter } from "https://deno.land/x/grammy@v1.14.1/filter.ts";
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.14.1/mod.ts";

import {
	formatAstronomy,
	formatCurrentWeather,
	formatForecast,
} from "./formatter.ts";
import { Astronomy, Forecast, SearchLocation, Weather } from "./type.ts";

const API_URL = "https://api.weatherapi.com/v1";

const API_KEY = Deno.env.get("API_KEY");
if (!API_KEY) throw new Error("API KEY is not set in the env!");

type APICallsType = "weather" | "astronomy" | "forecast" | "search";
export async function api<Type extends APICallsType>(
	type: Type,
	query: string,
	extra = ""
) {
	const url: Record<APICallsType, string> = {
		weather: `${API_URL}/current.json?key=${API_KEY}&q=${query}&${extra}`,
		astronomy: `${API_URL}/astronomy.json?key=${API_KEY}&q=${query}&${extra}`,
		forecast: `${API_URL}/forecast.json?key=${API_KEY}&q=${query}&days=3&aqi=no&alerts=no&${extra}`,
		search: `${API_URL}/search.json?key=${API_KEY}&q=${query}`,
	} as const;
	const response = await fetch(url[type]);
	if (response.ok) {
		const result = await response.json();
		return result as {
			forecast: Forecast;
			weather: Weather;
			astronomy: Astronomy;
			search: SearchLocation[];
		}[Type];
	}
	return null;
}

export async function weather(
	ctx:
		| Filter<Context, "callback_query:data">
		| Filter<Context, "chosen_inline_result">,
	location: string,
	messageId: string,
	userId?: number
) {
	const weather = await api("weather", location);
	if (!weather) return null;

	return ctx.api.editMessageTextInline(
		messageId,
		formatCurrentWeather(weather),
		{
			parse_mode: "HTML",
			reply_markup: new InlineKeyboard()
				.text(
					"Astronomy",
					`${JSON.stringify({
						t: "astronomy",
						lc: location,
						uid: userId,
					})}`
				)
				.text(
					"Forecast",
					`${JSON.stringify({
						t: "forecast",
						lc: location,
						uid: userId,
					})}`
				),
		}
	);
}

export async function astronomy(
	ctx: Filter<Context, "callback_query:data">,
	location: string,
	messageId: string,
	userId?: number
) {
	const result = await api("astronomy", location);
	if (!result) return null;
	return ctx.api.editMessageTextInline(messageId, formatAstronomy(result), {
		parse_mode: "HTML",
		reply_markup: new InlineKeyboard()
			.text(
				"Forecast",
				`${JSON.stringify({ t: "forecast", lc: location, uid: userId })}`
			)
			.text(
				"Weather",
				`${JSON.stringify({ t: "weather", lc: location, uid: userId })}`
			),
	});
}

export async function forecast(
	ctx: Filter<Context, "callback_query:data">,
	location: string,
	messageId: string,
	userId?: number
) {
	const result = await api("forecast", location);
	if (!result) return null;
	return ctx.api.editMessageTextInline(messageId, formatForecast(result), {
		parse_mode: "HTML",
		reply_markup: new InlineKeyboard()
			.text(
				"Astronomy",
				`${JSON.stringify({ t: "astronomy", lc: location, uid: userId })}`
			)
			.text(
				"Weather",
				`${JSON.stringify({ t: "weather", lc: location, uid: userId })}`
			),
	});
}
