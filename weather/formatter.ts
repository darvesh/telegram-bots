import { Astronomy, Forecast, Weather } from "./type.ts";

export function escape(text: string) {
	return text
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll("&", "&amp;");
}

export function formatCurrentWeather(weather: Weather) {
	const weatherTime = weather.current.last_updated_epoch;
	const localTime = weather.location.localtime_epoch;
	return (
		`<b>🌡️ ${escape(
			`${weather.location.name}, ${weather.location.region}, ${weather.location.country}`
		)}</b>\n\n` +
		`<b>Time</b>: <code>${weather.location.localtime}</code>\n\n` +
		`<b>Temperature</b>: <code>${weather.current.temp_c}°C</code>\n` +
		`<b>Feels Like</b>: <code>${weather.current.feelslike_c}°C</code>\n` +
		`<b>Humidity</b>: <code>${weather.current.humidity}%</code>\n` +
		`<b>Condition</b>: <code>${escape(
			weather.current.condition.text
		)}</code>\n` +
		`<b>Cloud Coverage</b>: <code>${weather.current.cloud}%</code>\n` +
		`<b>Wind</b>: <code>${weather.current.wind_kph}km/h</code>\n` +
		`<b>UV Index</b>: <code>${weather.current.uv}</code>\n` +
		`<b>Visibility</b>: <code>${weather.current.vis_km}km</code>\n` +
		`<b>Last Updated</b>: <code>${Math.ceil(
			(localTime - weatherTime) / 60
		)} minutes ago</code>`
	);
}

export function formatAstronomy(astronomy: Astronomy) {
	return (
		`<b>🌠 ${escape(
			`${astronomy.location.name}, ${astronomy.location.region}, ${astronomy.location.country}`
		)}</b>\n\n` +
		`<b>Time</b>: <code>${astronomy.location.localtime}</code>\n\n` +
		`<b>Astronomy</b>\n\n` +
		`<b>Sunrise</b>: <code>${astronomy.astronomy.astro.sunrise}</code>\n` +
		`<b>Sunset</b>: <code>${astronomy.astronomy.astro.sunset}</code>\n` +
		`<b>Moonrise</b>: <code>${astronomy.astronomy.astro.moonrise}</code>\n` +
		`<b>Moonset</b>: <code>${astronomy.astronomy.astro.moonset}</code>\n` +
		`<b>Moon Phase</b>: <code>${escape(
			astronomy.astronomy.astro.moon_phase
		)}</code>\n` +
		`<b>Moon Illumination</b>: <code>${astronomy.astronomy.astro.moon_illumination}%</code>\n` +
		`<b>Is Moon Up</b>: <code>${
			astronomy.astronomy.astro.is_moon_up ? "Yes" : "No"
		}</code>\n`
	);
}

export function formatForecast(forecast: Forecast) {
	return (
		`<b>🌠 ${escape(
			`${forecast.location.name}, ${forecast.location.region}, ${forecast.location.country}`
		)}</b>\n\n` +
		`<b>Time</b>: <code>${forecast.location.localtime}</code>\n\n` +
		`<b>Forecast</b>\n\n` +
		`${forecast.forecast.forecastday
			.map(
				(ele) =>
					`<b>${ele.date}</b>\n` +
					`<b>Max 🌡</b>: <code>${ele.day.maxtemp_c}°C</code>\n` +
					`<b>Min 🌡</b>: <code>${ele.day.mintemp_c}°C</code>\n` +
					`<b>Chance of rain</b>: <code>${ele.day.daily_chance_of_rain}%</code>\n` +
					`<b>Chance of snow</b>: <code>${ele.day.daily_chance_of_snow}%</code>\n` +
					`<b>UV Index</b>: <code>${ele.day.uv}%</code>\n`
			)
			.join("\n")}`
	);
}
