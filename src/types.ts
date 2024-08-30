import type { SetRequired } from "type-fest";
import type { WebAppManifest } from "web-app-manifest";

export interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	prompt(): Promise<void>;
	readonly userChoice: Promise<{
		outcome: "accepted" | "dismissed";
		platform: string;
	}>;
}

export interface IRelatedApp {
	id: string;
	platform: string;
	url: string;
}
export type Manifest = SetRequired<
	WebAppManifest,
	"icons" | "name" | "short_name"
>;
