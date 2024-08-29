import "./i18n.js";

import i18n from "i18next";
import {
	Compass,
	Ellipsis,
	EllipsisVertical,
	Share as ShareIcon,
	SquarePlus,
} from "lucide-preact";
import { h, render, type ComponentChildren } from "preact";
import { setup } from "goober";

import { Modal } from "./components/Modal.js";
import { Container } from "./components/Container.js";
import { ListItem } from "./components/ListItem.js";
import { Description } from "./components/Description.js";
import { IOSSafariArrow } from "./components/Arrows/IOSSafariArrow.js";
import { IOSChromeArrow } from "./components/Arrows/IOSChromeArrow.js";
import { IOSOpenInSystemBrowser } from "./components/Arrows/IOSOpenInSystemBrowser.js";
import { IOSOpenInSafari } from "./components/Arrows/IOSOpenInSafari.js";
import { DownloadAndroid } from "./components/Svgs/DownloadAndroid.js";
import { AndroidChromeArrow } from "./components/Arrows/AndroidChromeArrow.js";

import type {
	BeforeInstallPromptEvent,
	IRelatedApp,
	Manifest,
} from "./types.js";

setup(h);

interface PWAOptions {
	manifest?: Manifest;
}

export class PWA {
	private _manifest!: Manifest;
	private deferredPrompt: BeforeInstallPromptEvent | null = null;
	private relatedApps: IRelatedApp[] = [];

	public isInstallAvailable = false;
	public isUnderStandaloneMode = false;
	public isRelatedAppsInstalled = false;

	constructor(options?: PWAOptions) {
		this._init(options);
	}

	private async _init(options?: PWAOptions) {
		if (options && options.manifest) {
			this._manifest = options.manifest;
			this.addManifestToPage();
		} else {
			await this.setManifest();
		}
		await this.setIsInstallAvailable();
		this.runDiagnostics();
	}

	private async setIsInstallAvailable() {
		window.addEventListener("beforeinstallprompt", (event) => {
			event.preventDefault();
			this.deferredPrompt = event as BeforeInstallPromptEvent;
			this.isInstallAvailable = true;
		});

		this.isUnderStandaloneMode = this.isStandaloneMode();
		this.relatedApps = await this.getRelatedAppsInstalled();

		if (this.relatedApps.length > 0) {
			this.isRelatedAppsInstalled = true;
		}

		if (
			(this.isRelatedAppsInstalled || this.isUnderStandaloneMode) &&
			!this.isInstallAvailable
		) {
			this.isInstallAvailable = false;
		}
	}

	private async getRelatedAppsInstalled(): Promise<IRelatedApp[]> {
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

	private async setManifest() {
		this._manifest = await this.getManifest();
	}

	public isStandaloneMode(): boolean {
		return (
			(window.navigator as any).standalone || // IOS
			window.matchMedia("(display-mode: standalone)").matches // Android
		);
	}

	public async install(): Promise<"accepted" | "dismissed" | null> {
		if (this.deferredPrompt) {
			this.deferredPrompt.prompt();
			const userChoice = await this.deferredPrompt.userChoice;
			return userChoice.outcome;
		} else {
			const modalToRender = this._renderInstallDialog();
			render(modalToRender, document.body);
			return null;
		}
	}

	private _renderInstallDialog(): ComponentChildren {
		if (this.isDeviceIOS()) {
			return this._renderIOSInstallDialog();
		} else if (this.isDeviceAndroid()) {
			return this._renderAndroidInstallDialog();
		}
	}

	private _renderIOSInstallDialog(): ComponentChildren {
		if (this.isBrowserIOSSafari()) {
			return this._genIOSSafari();
		} else if (this.isBrowserIOSChrome()) {
			return this._genIOSChrome();
		} else if (
			this.isBrowserIOSInAppFacebook() ||
			this.isBrowserIOSInAppLinkedin()
		) {
			return this._genInAppBrowserOpenInSystemBrowser();
		} else if (
			this.isBrowserIOSInAppInstagram() ||
			this.isBrowserIOSInAppThreads() ||
			this.isBrowserIOSInAppTwitter()
		) {
			return this._genIOSInAppBrowserOpenInSafariBrowser();
		}
	}

	private _renderAndroidInstallDialog(): ComponentChildren {
		if (this.isBrowserAndroidChrome()) {
			return this._genAndroidChrome();
		} else if (this.isBrowserAndroidFacebook()) {
			this._genInAppBrowserOpenInSystemBrowser();
		}
	}

	close(): void {
		render(null, document.body);
	}

	isDeviceAndroid(): boolean {
		return /Android/.test(navigator.userAgent);
	}

	isDeviceIOS(): boolean {
		return /iPhone|iPad|iPod/.test(navigator.userAgent);
	}

	isBrowserIOSSafari(): boolean {
		return (
			this.isDeviceIOS() &&
			/Safari/.test(navigator.userAgent) &&
			!this.isBrowserIOSChrome() &&
			!this.isBrowserIOSFirefox() &&
			!this.isBrowserIOSInAppFacebook() &&
			!this.isBrowserIOSInAppLinkedin() &&
			!this.isBrowserIOSInAppInstagram() &&
			!this.isBrowserIOSInAppThreads() &&
			!this.isBrowserIOSInAppTwitter()
		);
	}

	isBrowserIOSChrome(): boolean {
		return this.isDeviceIOS() && /CriOS/.test(navigator.userAgent);
	}

	isBrowserIOSFirefox(): boolean {
		return this.isDeviceIOS() && /FxiOS/.test(navigator.userAgent);
	}

	isBrowserIOSInAppFacebook(): boolean {
		return this.isDeviceIOS() && /FBAN|FBAV/.test(navigator.userAgent);
	}

	isBrowserIOSInAppLinkedin(): boolean {
		return this.isDeviceIOS() && /LinkedInApp/.test(navigator.userAgent);
	}

	isBrowserIOSInAppInstagram(): boolean {
		return (
			this.isDeviceIOS() &&
			window.document.referrer.includes("//l.instagram.com/")
		);
	}

	isBrowserIOSInAppThreads(): boolean {
		return this.isBrowserIOSInAppInstagram();
	}

	isBrowserIOSInAppTwitter(): boolean {
		return this.isDeviceIOS() && window.document.referrer.includes("//t.co/");
	}

	isBrowserAndroidChrome(): boolean {
		return (
			this.isDeviceAndroid() &&
			/Chrome/.test(navigator.userAgent) &&
			!this.isBrowserAndroidFacebook() &&
			!this.isBrowserAndroidSamsung() &&
			!this.isBrowserAndroidFirefox()
		);
	}

	isBrowserAndroidFacebook(): boolean {
		return this.isDeviceAndroid() && /FBAN|FBAV/.test(navigator.userAgent);
	}

	isBrowserAndroidSamsung(): boolean {
		return this.isDeviceAndroid() && /SamsungBrowser/.test(navigator.userAgent);
	}

	isBrowserAndroidFirefox(): boolean {
		return this.isDeviceAndroid() && /Firefox/.test(navigator.userAgent);
	}

	private _genIOSSafari(): ComponentChildren {
		return (
			<Container>
				<Description
					iconUrl={this._manifest.icons[0].src}
					name={this._manifest.name}
					description={this._manifest.description}
				/>
				<Modal>
					<ListItem
						icon={<ShareIcon size={32} />}
						text={`1) ${i18n.t("press_share_in_navigation_bar")}`}
					></ListItem>
					<ListItem
						icon={<SquarePlus size={32} />}
						text={`2) ${i18n.t("press_add_to_home_screen")}`}
						boldText={i18n.t("you_may_scroll_down_to_find_the_install_button")}
					></ListItem>
				</Modal>
				<IOSSafariArrow />
			</Container>
		);
	}

	private _genIOSChrome(): ComponentChildren {
		return (
			<Container>
				<Description
					iconUrl={this._manifest.icons[0].src}
					name={this._manifest.name}
					description={this._manifest.description}
				/>
				<Modal>
					<ListItem
						icon={<ShareIcon size={32} />}
						text={`1) ${i18n.t("press_share_in_navigation_bar")}`}
					></ListItem>
					<ListItem
						icon={<SquarePlus size={32} />}
						text={`2) ${i18n.t("press_add_to_home_screen")}`}
						boldText={i18n.t("you_may_scroll_down_to_find_the_install_button")}
					></ListItem>
				</Modal>
				<IOSChromeArrow />
			</Container>
		);
	}

	private _genInAppBrowserOpenInSystemBrowser(): ComponentChildren {
		return (
			<Container>
				<Description
					iconUrl={this._manifest.icons[0].src}
					name={this._manifest.name}
					description={this._manifest.description}
				/>
				<Modal>
					<ListItem
						icon={<Ellipsis size={32} />}
						text={`1) ${i18n.t("press_three_dots")}`}
					></ListItem>
					<ListItem text={`2) ${i18n.t("press_open_in_browser")}`}></ListItem>
				</Modal>
				<IOSOpenInSystemBrowser />
			</Container>
		);
	}

	private _genIOSInAppBrowserOpenInSafariBrowser(): ComponentChildren {
		return (
			<Container>
				<Description
					iconUrl={this._manifest.icons[0].src}
					name={this._manifest.name}
					description={this._manifest.description}
				/>
				<Modal>
					<ListItem
						icon={<Compass size={32} />}
						text={`1) ${i18n.t("press_compass_icon_to_open_in_system_browser")}`}
					></ListItem>
				</Modal>
				<IOSOpenInSafari />
			</Container>
		);
	}

	private _genAndroidChrome(): ComponentChildren {
		return (
			<Container>
				<Description
					iconUrl={this._manifest.icons[0].src}
					name={this._manifest.name}
					description={this._manifest.description}
				/>
				<Modal>
					<ListItem
						icon={<EllipsisVertical size={32} />}
						text={`1) ${i18n.t("press_three_dots")}`}
					></ListItem>
					<ListItem
						icon={<DownloadAndroid width={32} />}
						text={`2) ${i18n.t("press_add_to_home_screen")}`}
					></ListItem>
				</Modal>
				<AndroidChromeArrow />
			</Container>
		);
	}

	private addManifestToPage(): void {
		const manifestJson = JSON.stringify(this._manifest);
		const manifestBlob = new Blob([manifestJson], { type: "application/json" });
		const manifestURL = URL.createObjectURL(manifestBlob);

		const link = document.createElement("link");
		link.rel = "manifest";
		link.href = manifestURL;

		document.head.appendChild(link);
	}

	private getManifest(): Promise<Manifest> {
		const manifestLink = document.querySelector(
			'link[rel="manifest"]',
		) as HTMLLinkElement;
		if (manifestLink) {
			const manifestUrl = manifestLink.getAttribute("href");

			if (!manifestUrl) {
				return Promise.reject(new Error("Manifest URL not found"));
			}
			return fetch(manifestUrl)
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then((manifestData: Manifest) => {
					return manifestData;
				})
				.catch((error) => {
					// Handle and rethrow the error for the caller to handle
					console.error("Error fetching manifest:", error);
					return Promise.reject(error);
				});
		} else {
			return Promise.reject(new Error("No manifest link found on page"));
		}
	}

	public isManifestValid(manifest: Manifest): boolean {
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

	private runDiagnostics() {
		if (location.protocol !== "https:" && location.hostname !== "localhost") {
			throw new Error("Service Workers require a secure origin.");
		}

		if (!("serviceWorker" in navigator)) {
			throw new Error("Service Worker is not supported.");
		} else {
			navigator.serviceWorker.getRegistration().then((registration) => {
				if (!registration) {
					throw new Error("No Service Worker registered.");
				}
			});
		}

		const linkElement = document.querySelector<HTMLLinkElement>(
			'link[rel="manifest"]',
		);
		if (!linkElement) {
			throw new Error("No manifest link found on page.");
		} else {
			fetch(linkElement.href)
				.then((response) => response.json())
				.then((manifest) => {
					this.isManifestValid(manifest);
				})
				.catch(() => {
					throw new Error("Error fetching manifest.");
				});
		}

		setTimeout(() => {
			if (!this.deferredPrompt) {
				console.warn(
					"The 'beforeinstallprompt' event was not fired, so the app cannot be installed. Possible reasons:",
				);
				console.warn("- The site does not meet the PWA installation criteria.");
				console.warn("- The user has already installed the app.");
				console.warn(
					"- The user has dismissed the install prompt in the past.",
				);
			}
		}, 1000);
	}
}
