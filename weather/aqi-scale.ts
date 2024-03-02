const pm2_5 = [
	{ low: 0, high: 35, label: "Low" },
	{ low: 36, high: 53, label: "Moderate" },
	{ low: 54, high: 70, label: "High" },
	{ low: 71, high: Infinity, label: "Very High" },
];

const pm10 = [
	{ low: 0, high: 50, label: "Low" },
	{ low: 51, high: 75, label: "Moderate" },
	{ low: 76, high: 100, label: "High" },
	{ low: 101, high: Infinity, label: "Very High" },
];

const ozone = [
	{ low: 0, high: 100, label: "Low" },
	{ low: 101, high: 160, label: "Moderate" },
	{ low: 161, high: 240, label: "High" },
	{ low: 241, high: Infinity, label: "Very High" },
];

const nitrogen = [
	{ low: 0, high: 200, label: "Low" },
	{ low: 201, high: 400, label: "Moderate" },
	{ low: 401, high: 600, label: "High" },
	{ low: 601, high: Infinity, label: "Very High" },
];

const sulphur = [
	{ low: 0, high: 266, label: "Low" },
	{ low: 267, high: 532, label: "Moderate" },
	{ low: 533, high: 1064, label: "High" },
	{ low: 1065, high: Infinity, label: "Very High" },
];

export const airQualityBandsUK = {
	1: { Band: "Low", Range: "0-11 µgm⁻³" },
	2: { Band: "Low", Range: "12-23 µgm⁻³" },
	3: { Band: "Low", Range: "24-35 µgm⁻³" },
	4: { Band: "Moderate", Range: "36-41 µgm⁻³" },
	5: { Band: "Moderate", Range: "42-47 µgm⁻³" },
	6: { Band: "Moderate", Range: "48-53 µgm⁻³" },
	7: { Band: "High", Range: "54-58 µgm⁻³" },
	8: { Band: "High", Range: "59-64 µgm⁻³" },
	9: { Band: "High", Range: "65-70 µgm⁻³" },
	10: { Band: "Very High", Range: "71 or more µgm⁻³" },
} satisfies Record<number, { Band: string; Range: string }>;

export const airQualityBandsUS = {
	1: { Band: "Good", Range: "0-50 " },
	2: { Band: "Moderate", Range: "51-100" },
	3: { Band: "Unhealthy for Sensitive Groups", Range: "101-150 " },
	4: { Band: "Unhealthy", Range: "151 to 200" },
	5: { Band: "Very Unhealthy", Range: "201 to 300 " },
	6: { Band: "Hazardous", Range: "301 to 500" },
} satisfies Record<number, { Band: string; Range: string }>;

export function findBand(
	type: "pm2_5" | "pm10" | "ozone" | "nitrogen" | "sulphur",
	value: number
) {
	const bands = { pm2_5, pm10, ozone, nitrogen, sulphur } as const;
	const band = bands[type].find((ele) => value >= ele.low && value <= ele.high);
	return band?.label || "Unknown";
}
