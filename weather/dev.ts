import { bot } from "./bot.ts";

bot.catch(console.error);

bot.start({
	drop_pending_updates: true,
	allowed_updates: ["chosen_inline_result", "inline_query", "callback_query"],
	onStart: () => console.log("Bot started"),
});
