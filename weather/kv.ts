const store = await Deno.openKv();

type Location = [string, string, string];

//Cache user:number => [locationId]
export async function cacheLastUserLocation(
	userId: number,
	locationId: string
) {
	const { value: locationIds } = await store.get<string[]>([
		"user",
		userId.toString(),
	]);
	if (Array.isArray(locationIds)) {
		if (!locationIds.includes(locationId)) {
			const cachedIds =
				locationIds.length < 5
					? locationIds
					: locationIds.slice(locationIds.length - 4, locationIds.length);
			await store.set(["user", userId.toString()], [locationId, ...cachedIds]);
		}
	} else {
		await store.set(["user", userId.toString()], [locationId]);
	}
}
export async function getUserLocations(userId: number) {
	const { value: locations } = await store.get<string[]>([
		"user",
		userId.toString(),
	]);
	return locations || [];
}

// Cache id:locationId => [name, region, country]
export function cachePlaceName(id: string, location: Location) {
	store.set(["id", id], location);
}
export async function getPlaceName(id: string) {
	const { value } = await store.get<Location>(["id", id]);
	return value;
}
