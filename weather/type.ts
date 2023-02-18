export interface Weather {
	location: Location;
	current: Current;
}
export interface SearchLocation {
	id: number;
	name: string;
	region: string;
	country: string;
	lat: number;
	lon: number;
	url: number;
}

export interface Astronomy {
	location: Location;
	astronomy: {
		astro: Astro;
	};
}

export interface Forecast extends Weather {
	forecast: {
		forecastday: {
			date: string;
			date_epoch: number;
			day: {
				maxtemp_c: number;
				maxtemp_f: number;
				mintemp_c: number;
				mintemp_f: number;
				avgtemp_c: number;
				avgtemp_f: number;
				maxwind_mph: number;
				maxwind_kph: number;
				totalprecip_mm: number;
				totalprecip_in: number;
				totalsnow_cm: number;
				avgvis_km: number;
				avgvis_miles: number;
				avghumidity: number;
				daily_will_it_rain: number;
				daily_chance_of_rain: number;
				daily_will_it_snow: number;
				daily_chance_of_snow: number;
				condition: Condition;
				uv: number;
			};
		}[];
	};
}

interface Astro {
	sunrise: string;
	sunset: string;
	moonrise: string;
	moonset: string;
	moon_phase: string;
	moon_illumination: string;
	is_moon_up: number;
	is_sun_up: number;
}

interface Current {
	last_updated_epoch: number;
	last_updated: string;
	temp_c: number;
	temp_f: number;
	is_day: number;
	condition: Condition;
	wind_mph: number;
	wind_kph: number;
	wind_degree: number;
	wind_dir: string;
	pressure_mb: number;
	pressure_in: number;
	precip_mm: number;
	precip_in: number;
	humidity: number;
	cloud: number;
	feelslike_c: number;
	feelslike_f: number;
	vis_km: number;
	vis_miles: number;
	uv: number;
	gust_mph: number;
	gust_kph: number;
}

interface Condition {
	text: string;
	icon: string;
	code: number;
}

interface Location {
	name: string;
	region: string;
	country: string;
	lat: number;
	lon: number;
	tz_id: string;
	localtime_epoch: number;
	localtime: string;
}
