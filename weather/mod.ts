
import { webhookCallback } from "npm:grammy";

import b from "./bot.ts";
const bot = b.bot;

const handleUpdate = webhookCallback(bot, "std/http");
const SECRET = Deno.env.get("SECRET");

Deno.serve(async (req) => {
	if (req.method === "POST") {
		const url = new URL(req.url);
		if (url.pathname.slice(1) === SECRET) {
			try {
				return await handleUpdate(req);
			} catch (err) {
				console.error(err);
			}
		}
	}
	return new Response("Weather bot is up and running!");
});
