import type { WebAppManifest } from "web-app-manifest";
import type { IRelatedApp } from "./types.js";

export function isStandaloneMode(): boolean {
	return window.matchMedia("(display-mode: standalone)").matches;
}

export async function getRelatedAppsInstalled(): Promise<IRelatedApp[]> {
	if (!("getInstalledRelatedApps" in navigator)) {
		console.warn(
			"The 'getInstalledRelatedApps' API is not supported in this browser.",
		);
		return [];
	}

	try {
		const relatedApps = await (navigator as any).getInstalledRelatedApps();

		if (relatedApps.length > 0) {
			relatedApps.forEach((app: any) => {
				console.log(
					`- Platform: ${app.platform}, ID: ${app.id}, URL: ${app.url}`,
				);
			});
			return relatedApps;
		}
	} catch (error) {
		console.error("Failed to check for installed related apps:", error);
	}
	return [];
}

export function isManifestValid(manifest: WebAppManifest): boolean {
	if (!manifest) {
		console.error("Manifest is undefined or null.");
		return false;
	}

	const requiredFields: (
		| "name"
		| "short_name"
		| "start_url"
		| "icons"
		| "display"
	)[] = ["name", "short_name", "start_url", "icons", "display"];

	for (const field of requiredFields) {
		if (!manifest[field]) {
			console.error(`Manifest is missing required field: ${field}`);
			return false;
		}
	}

	if (manifest.icons === undefined) {
		console.error("Manifest must contain at least one icon.");
		return false;
	}

	const validIcon = manifest.icons.some((icon: any) => {
		return icon.src && icon.sizes && icon.type;
	});

	if (!validIcon) {
		console.error(
			"Manifest must contain at least one valid icon with src, sizes, and type.",
		);
		return false;
	}

	return true;
}
