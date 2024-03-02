import { findBand } from "./aqi-scale.ts";
import { airQualityBandsUK, airQualityBandsUS } from "./aqi-scale.ts";
import { AQI } from "./type.ts";
import { Astronomy, Forecast, Weather } from "./type.ts";

export function escape(text: string) {
	return text
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll("&", "&amp;");
}

export function formatNames<T extends string | undefined>(names: T[]) {
	return names.filter(Boolean).join(", ");
}

export function formatCurrentWeather(weather: Weather) {
	const weatherTime = weather.current.last_updated_epoch;
	const localTime = weather.location.localtime_epoch;
	return (
		`<b>🌡️ ${escape(
			formatNames([
				weather.location.name,
				weather.location.region,
				weather.location.country,
			])
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
			formatNames([
				astronomy.location.name,
				astronomy.location.region,
				astronomy.location.country,
			])
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
		`<b>Moon Illumination</b>: <code>${astronomy.astronomy.astro.moon_illumination}%</code>\n`
	);
}

export function formatForecast(forecast: Forecast) {
	return (
		`<b>🌠 ${escape(
			formatNames([
				forecast.location.name,
				forecast.location.region,
				forecast.location.country,
			])
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
					`<b>UV Index</b>: <code>${ele.day.uv}</code>\n`
			)
			.join("\n")}`
	);
}

export function formatAQI(aqi: AQI) {
	const weatherTime = aqi.current.last_updated_epoch;
	const localTime = aqi.location.localtime_epoch;
	const ukIndex = aqi.current.air_quality["gb-defra-index"];
	const usIndex = aqi.current.air_quality["us-epa-index"];
	const ukAQI = `${ukIndex} - ${airQualityBandsUK[ukIndex].Band} [${airQualityBandsUK[ukIndex].Range}]`;
	const usAQI = `${usIndex} - ${airQualityBandsUS[usIndex].Band} [${airQualityBandsUS[usIndex].Range} AQI]`;
	return (
		`<b>⛺ ${escape(
			formatNames([
				aqi.location.name,
				aqi.location.region,
				aqi.location.country,
			])
		)}</b>\n\n` +
		`<b>Time</b>: <code>${aqi.location.localtime}</code>\n\n` +
		`<b>PM10</b>: <code> ${findBand("pm10", aqi.current.air_quality.pm10)} [${
			aqi.current.air_quality.pm10
		}μg/m³]</code>\n` +
		`<b>PM2.5</b>: <code>${findBand("pm2_5", aqi.current.air_quality.pm2_5)} [${
			aqi.current.air_quality.pm2_5
		}μg/m³]</code>\n` +
		`<b>Ozone</b>: <code>${findBand("ozone", aqi.current.air_quality.o3)} [${
			aqi.current.air_quality.o3
		}μg/m³]</code>\n` +
		`<b>Sulphur dioxide</b>: <code>${findBand(
			"sulphur",
			aqi.current.air_quality.so2
		)} [${aqi.current.air_quality.so2}μg/m³]</code>\n` +
		`<b>Nitrogen dioxide</b>: <code>${findBand(
			"nitrogen",
			aqi.current.air_quality.no2
		)} [${aqi.current.air_quality.no2}μg/m³]</code>\n` +
		`<b>Carbon Monoxide</b>: <code>${aqi.current.air_quality.co}μg/m³</code>\n\n` +
		`<b>GB DEFRA Index</b>: <code>${ukAQI}</code>\n` +
		`<b>US EPA Index</b>: <code>${usAQI}</code>\n\n` +
		`<b>Last Updated</b>: <code>${Math.ceil(
			(localTime - weatherTime) / 60
		)} minutes ago</code>`
	);
}
