import type { WebAppManifest } from "web-app-manifest";
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
export interface Manifest extends WebAppManifest {}
