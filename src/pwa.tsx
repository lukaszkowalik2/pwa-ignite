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
// Setup `goober` for styling with Preact's `h` function.
setup(h);

/**
 * Options for configuring a Progressive Web App (PWA).
 *
 * @remarks
 * This interface defines the available options for configuring a Progressive Web App (PWA).
 *
 * @public
 * @argument manifest - The manifest for the PWA. This is an object that contains metadata about the PWA, such as the name, short name, start URL, display mode, background color, theme color, icons, and related applications. If not provided, the PWA will attempt to fetch the manifest from the page.
 */
interface PWAOptions {
	manifest?: Manifest;
}
/**
 * Class representing a Progressive Web App (PWA) and its related functionalities. This class provides methods for installing the PWA, checking if the PWA is installed, and checking if the PWA is running in standalone mode.
 */
export class PWA {
	private _manifest!: Manifest;
	private deferredPrompt: BeforeInstallPromptEvent | null = null;
	private relatedApps: IRelatedApp[] = [];

	/**
	 * Indicates whether the installation is available.
	 */
	public isInstallAvailable = false;

	/**
	 * Indicates whether the application is running in standalone mode.
	 */
	public isUnderStandaloneMode = false;
	/**
	 * Indicates whether the related apps are installed.
	 */
	public isRelatedAppsInstalled = false;

	/**
	 * Initializes a new instance of the PWA class.
	 * @param options - The options for configuring the PWA.
	 */
	constructor(options?: PWAOptions) {
		this._init(options);
	}

	/**
	 * Private method to initialize the PWA.
	 * This method sets up the manifest, checks for install availability, and runs diagnostics.
	 * @param options Optional PWA configuration options.
	 */
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

	/**
	 * Sets whether the app is installable, based on various criteria such as
	 * whether the app is running in standalone mode or whether related apps are installed.
	 */
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

	/**
	 * Checks if related apps are installed on the user's device.
	 * Uses the `getInstalledRelatedApps` API if available.
	 * @returns A promise that resolves to an array of installed related apps.
	 */
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

	/**
	 * Retrieves and sets the manifest file for the PWA.
	 */
	private async setManifest() {
		this._manifest = await this.getManifest();
	}

	/**
	 * Checks if the app is running in standalone mode.
	 * Standalone mode is when the app is installed and opened as a separate application
	 * rather than in a web browser tab.
	 * @returns True if the app is running in standalone mode, false otherwise.
	 */
	public isStandaloneMode(): boolean {
		return (
			(window.navigator as any).standalone || // IOS
			window.matchMedia("(display-mode: standalone)").matches // Android
		);
	}

	/**
	 * Triggers the installation process for the PWA if the install prompt is available.
	 * @returns A promise that resolves to the user's choice (accepted or dismissed) or null if the prompt isn't available.
	 */
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

	/**
	 * Renders the appropriate installation dialog based on the device type (iOS or Android).
	 * @returns The rendered Preact component tree for the installation dialog.
	 */
	private _renderInstallDialog(): ComponentChildren {
		if (this.isDeviceIOS()) {
			return this._renderIOSInstallDialog();
		} else if (this.isDeviceAndroid()) {
			return this._renderAndroidInstallDialog();
		}
	}

	/**
	 * Renders the installation dialog for iOS devices.
	 * The specific dialog rendered depends on the browser (Safari, Chrome, etc.).
	 * @returns The rendered Preact component tree for the iOS installation dialog.
	 */
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

	/**
	 * Renders the installation dialog for Android devices.
	 * The specific dialog rendered depends on the browser (Chrome, Facebook, etc.).
	 * @returns The rendered Preact component tree for the Android installation dialog.
	 */
	private _renderAndroidInstallDialog(): ComponentChildren {
		if (this.isBrowserAndroidChrome()) {
			return this._genAndroidChrome();
		} else if (this.isBrowserAndroidFacebook()) {
			this._genInAppBrowserOpenInSystemBrowser();
		}
	}

	/**
	 * Closes any open installation dialog by unmounting it from the DOM.
	 */
	public close(): void {
		render(null, document.body);
	}

	/**
	 * Checks if the current device is running Android.
	 * @returns True if the device is Android, false otherwise.
	 */
	public isDeviceAndroid(): boolean {
		return /Android/.test(navigator.userAgent);
	}

	/**
	 * Checks if the current device is running iOS.
	 * @returns True if the device is iOS, false otherwise.
	 */
	public isDeviceIOS(): boolean {
		return /iPhone|iPad|iPod/.test(navigator.userAgent);
	}

	/**
	 * Checks if the current browser is Safari on an iOS device.
	 * @returns True if the browser is Safari on iOS, false otherwise.
	 */
	public isBrowserIOSSafari(): boolean {
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

	/**
	 * Checks if the current browser is Chrome on an iOS device.
	 * @returns True if the browser is Chrome on iOS, false otherwise.
	 */
	public isBrowserIOSChrome(): boolean {
		return this.isDeviceIOS() && /CriOS/.test(navigator.userAgent);
	}

	/**
	 * Checks if the current browser is Firefox on an iOS device.
	 * @returns True if the browser is Firefox on iOS, false otherwise.
	 */
	public isBrowserIOSFirefox(): boolean {
		return this.isDeviceIOS() && /FxiOS/.test(navigator.userAgent);
	}

	/**
	 * Checks if the current browser is Facebook's in-app browser on an iOS device.
	 * @returns True if the browser is Facebook's in-app browser on iOS, false otherwise.
	 */
	public isBrowserIOSInAppFacebook(): boolean {
		return this.isDeviceIOS() && /FBAN|FBAV/.test(navigator.userAgent);
	}

	/**
	 * Checks if the current browser is LinkedIn's in-app browser on an iOS device.
	 * @returns True if the browser is LinkedIn's in-app browser on iOS, false otherwise.
	 */
	public isBrowserIOSInAppLinkedin(): boolean {
		return this.isDeviceIOS() && /LinkedInApp/.test(navigator.userAgent);
	}

	/**
	 * Checks if the current browser is Instagram's in-app browser on an iOS device.
	 * @returns True if the browser is Instagram's in-app browser on iOS, false otherwise.
	 */
	public isBrowserIOSInAppInstagram(): boolean {
		return (
			this.isDeviceIOS() &&
			window.document.referrer.includes("//l.instagram.com/")
		);
	}

	/**
	 * Checks if the current browser is Threads' in-app browser on an iOS device.
	 * @returns True if the browser is Threads' in-app browser on iOS, false otherwise.
	 */
	public isBrowserIOSInAppThreads(): boolean {
		return this.isBrowserIOSInAppInstagram();
	}

	/**
	 * Checks if the current browser is Twitter's in-app browser on an iOS device.
	 * @returns True if the browser is Twitter's in-app browser on iOS, false otherwise.
	 */
	public isBrowserIOSInAppTwitter(): boolean {
		return this.isDeviceIOS() && window.document.referrer.includes("//t.co/");
	}

	/**
	 * Checks if the current browser is Chrome on an Android device.
	 * @returns True if the browser is Chrome on Android, false otherwise.
	 */
	public isBrowserAndroidChrome(): boolean {
		return (
			this.isDeviceAndroid() &&
			/Chrome/.test(navigator.userAgent) &&
			!this.isBrowserAndroidFacebook() &&
			!this.isBrowserAndroidSamsung() &&
			!this.isBrowserAndroidFirefox()
		);
	}

	/**
	 * Checks if the current browser is Facebook's in-app browser on an Android device.
	 * @returns True if the browser is Facebook's in-app browser on Android, false otherwise.
	 */
	public isBrowserAndroidFacebook(): boolean {
		return this.isDeviceAndroid() && /FBAN|FBAV/.test(navigator.userAgent);
	}

	/**
	 * Checks if the current browser is Samsung Internet on an Android device.
	 * @returns True if the browser is Samsung Internet on Android, false otherwise.
	 */
	public isBrowserAndroidSamsung(): boolean {
		return this.isDeviceAndroid() && /SamsungBrowser/.test(navigator.userAgent);
	}

	/**
	 * Checks if the current browser is Firefox on an Android device.
	 * @returns True if the browser is Firefox on Android, false otherwise.
	 */
	public isBrowserAndroidFirefox(): boolean {
		return this.isDeviceAndroid() && /Firefox/.test(navigator.userAgent);
	}

	/**
	 * Generates the Preact component tree for the iOS Safari installation dialog.
	 * @returns The rendered Preact component tree for the iOS Safari installation dialog.
	 */
	private _genIOSSafari(): ComponentChildren {
		return (
			<Container onClick={this.close}>
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

	/**
	 * Generates the Preact component tree for the iOS Chrome installation dialog.
	 * @returns The rendered Preact component tree for the iOS Chrome installation dialog.
	 */
	private _genIOSChrome(): ComponentChildren {
		return (
			<Container onClick={this.close}>
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

	/**
	 * Generates the Preact component tree for an in-app browser dialog on iOS that guides the user to open in Safari.
	 * @returns The rendered Preact component tree for the in-app browser dialog.
	 */
	private _genInAppBrowserOpenInSystemBrowser(): ComponentChildren {
		return (
			<Container onClick={this.close}>
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

	/**
	 * Generates the Preact component tree for an in-app browser dialog on iOS that guides the user to open in Safari.
	 * @returns The rendered Preact component tree for the in-app browser dialog on iOS.
	 */

	private _genIOSInAppBrowserOpenInSafariBrowser(): ComponentChildren {
		return (
			<Container onClick={this.close}>
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

	/**
	 * Generates the Preact component tree for the Android Chrome installation dialog.
	 * @returns The rendered Preact component tree for the Android Chrome installation dialog.
	 */
	private _genAndroidChrome(): ComponentChildren {
		return (
			<Container onClick={this.close}>
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

	/**
	 * Adds the manifest to the page's `<head>` as a `<link>` element.
	 */
	private addManifestToPage(): void {
		const manifestJson = JSON.stringify(this._manifest);
		const manifestBlob = new Blob([manifestJson], { type: "application/json" });
		const manifestURL = URL.createObjectURL(manifestBlob);

		const link = document.createElement("link");
		link.rel = "manifest";
		link.href = manifestURL;

		document.head.appendChild(link);
	}

	/**
	 * Fetches the manifest file from the page.
	 * @returns A promise that resolves to the manifest JSON object.
	 */
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

	/**
	 * Checks if the provided manifest object is valid.
	 *
	 * @param {Manifest} manifest - The manifest object to validate.
	 * @returns {boolean} - Returns true if the manifest is valid, otherwise false.
	 */
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

	/**
	 * Runs diagnostics to check if the environment meets the requirements for running the service worker and installing the app as a Progressive Web App (PWA).
	 *
	 * @throws {Error} If the current origin is not secure (https) and not localhost.
	 * @throws {Error} If the browser does not support service workers.
	 * @throws {Error} If no service worker is registered.
	 * @throws {Error} If no manifest link is found on the page.
	 * @throws {Error} If there is an error fetching the manifest.
	 *
	 * @remarks
	 * This function performs the following checks:
	 * - Checks if the current origin is secure (https) and not localhost.
	 * - Checks if the browser supports service workers.
	 * - Checks if a service worker is registered.
	 * - Checks if a manifest link is present on the page.
	 * - Fetches the manifest and checks if it is valid.
	 * - Logs a warning if the 'beforeinstallprompt' event was not fired.
	 *
	 * @example
	 * runDiagnostics();
	 */
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
