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

import type { BeforeInstallPromptEvent, Manifest } from "./types.js";
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

setup(h);

interface PWAOptions {
	manifest?: Manifest;
}

export class PWA {
	private _manifest!: Manifest;
	private deferredPrompt: BeforeInstallPromptEvent | null = null;

	constructor(options?: PWAOptions) {
		if (options && options.manifest) {
			this._manifest = options.manifest;
			this.addManifestToPage();
		} else {
			this.setManifest();
		}
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

	install() {
		const modalToRender = this._renderInstallDialog();
		render(modalToRender, document.body);
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
}
