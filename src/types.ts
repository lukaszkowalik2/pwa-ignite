import type { WebAppManifest } from "web-app-manifest";
import type { SetRequired } from "type-fest";
export interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{
		outcome: "accepted" | "dismissed";
		platform: string;
	}>;
	prompt(): Promise<void>;
}

export interface IRelatedApp {
	id: string;
	platform: string;
	url: string;
}
export type Manifest = SetRequired<WebAppManifest, "icons" | "name">;
