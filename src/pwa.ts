import { Manifest } from "./manifest.js";

export class PWA {
	private _manifest: Manifest = new Manifest();

	public isAppleDesktopPlatform = false;
	public isAppleMobilePlatform = false;
	public isDialogHidden = false;
	public isInstallAvailable = false;
	public isRelatedAppsInstalled = false;
	public isUnderStandaloneMode = false;

	constructor() {
		console.log("PWA constructor");
	}
}
