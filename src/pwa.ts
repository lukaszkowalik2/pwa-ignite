import {
	getRelatedAppsInstalled,
	isManifestValid,
	isStandaloneMode,
} from "./utils.js";

import type { BeforeInstallPromptEvent, IRelatedApp } from "./types.js";
import type { WebAppManifest } from "web-app-manifest";

export class PWA {
	private _manifest: WebAppManifest | undefined;
	private deferredPrompt: BeforeInstallPromptEvent | null = null;

	public isAppleDesktopPlatform = false;
	public isAppleMobilePlatform = false;
	public isDialogHidden = false;
	public isInstallAvailable = false;

	public isUnderStandaloneMode = false;
	public isInstallAvaiable = false;

	public relatedApps: IRelatedApp[] = [];
	public isRelatedAppsInstalled = false;

	constructor(manifest?: WebAppManifest) {
		if (manifest) {
			this._manifest = manifest;
			this.addManifestToPage();
		}
		this._init();

		this.runDiagnostics();
	}

	private addManifestToPage() {
		const manifestJson = JSON.stringify(this._manifest);
		const manifestBlob = new Blob([manifestJson], { type: "application/json" });
		const manifestURL = URL.createObjectURL(manifestBlob);

		const link = document.createElement("link");
		link.rel = "manifest";
		link.href = manifestURL;

		document.head.appendChild(link);
	}

	public async install(): Promise<"accepted" | "dismissed" | undefined> {
		if (this.deferredPrompt) {
			this.deferredPrompt.prompt();
			const userChoice = await this.deferredPrompt.userChoice;
			return userChoice.outcome;
		}
	}

	private runDiagnostics() {
		if (location.protocol !== "https:" && location.hostname !== "localhost") {
			console.error("PWA installation requires HTTPS.");
		}

		if (!("serviceWorker" in navigator)) {
			console.error("Service Worker is not supported or not registered.");
		} else {
			navigator.serviceWorker.getRegistration().then((registration) => {
				if (!registration) {
					console.error("No Service Worker registered.");
				}
			});
		}

		const linkElement = document.querySelector<HTMLLinkElement>(
			'link[rel="manifest"]',
		);
		if (!linkElement) {
			console.error("No manifest found on the page.");
		} else {
			fetch(linkElement.href)
				.then((response) => response.json())
				.then((manifest) => {
					isManifestValid(manifest);
				})
				.catch(() => {
					console.error("Failed to fetch the manifest.");
				});
		}

		if (window.matchMedia("(display-mode: standalone)").matches) {
			console.warn("App is already installed.");
		}

		if (!this.deferredPrompt) {
			console.warn(
				"The 'beforeinstallprompt' event was not fired, so the app cannot be installed. Possible reasons:",
			);
			console.warn("- The site does not meet the PWA installation criteria.");
			console.warn("- The user has already installed the app.");
			console.warn("- The user has dismissed the install prompt in the past.");
		}
	}

	private async _init() {
		this.isUnderStandaloneMode = isStandaloneMode();
		this.relatedApps = await getRelatedAppsInstalled();

		if (this.relatedApps.length > 0) {
			this.isRelatedAppsInstalled = true;
		}

		if (this.isRelatedAppsInstalled || this.isUnderStandaloneMode) {
			this.isInstallAvailable = false;
		}

		window.addEventListener("beforeinstallprompt", (event) => {
			event.preventDefault();
			this.deferredPrompt = event as BeforeInstallPromptEvent;
			this.isInstallAvailable = true;
		});
	}
}
