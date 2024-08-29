import "./styles.css";
import "./i18n.js";

import i18n from "i18next";

import type { BeforeInstallPromptEvent, Manifest } from "./types.js";

interface PWAOptions {
	manifest?: Manifest;
}

export class PWA {
	private _manifest!: Manifest;
	private deferredPrompt: BeforeInstallPromptEvent | null = null;

	private closeEventListener: ((e: Event) => void) | null | undefined;
	private domElement: HTMLDivElement;

	constructor(options?: PWAOptions) {
		this.domElement = document.createElement("div");
		this.domElement.classList.add("pwa-container");

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
		document.body.appendChild(this.domElement);
		this.domElement.classList.add("visible");
		// if (this.isDeviceIOS()) {
		this.renderIOSInstallDialog();
		// }
		// i18n.setLocale(locale);
		// let shouldShowModal = false;
		// if (this.isStandaloneMode()) {
		// 	shouldShowModal = false;
		// } else if (this._hasReachedMaxModalDisplayCount()) {
		// 	shouldShowModal = false;
		// } else {
		// 	shouldShowModal = true;
		// 	this._incrModalDisplayCount();
		// 	const container = document.createElement("div");
		// 	container.classList.add("adhs-container");
		// 	container.style.height = document.body.clientHeight + "px";
		// 	container.style.width = window.innerWidth + "px";
		// 	if (this.isDeviceIOS()) {
		// 		if (this.isBrowserIOSSafari()) {
		// 			this._genIOSSafari(container);
		// 		} else if (this.isBrowserIOSChrome()) {
		// 			this._genIOSChrome(container);
		// 		} else if (
		// 			this.isBrowserIOSInAppFacebook() ||
		// 			this.isBrowserIOSInAppLinkedin()
		// 		) {
		// 			this._genIOSInAppBrowserOpenInSystemBrowser(container);
		// 		} else if (
		// 			this.isBrowserIOSInAppInstagram() ||
		// 			this.isBrowserIOSInAppThreads() ||
		// 			this.isBrowserIOSInAppTwitter()
		// 		) {
		// 			this._genIOSInAppBrowserOpenInSafariBrowser(container);
		// 		} else {
		// 			shouldShowModal = false;
		// 		}
		// 	} else if (this.isDeviceAndroid()) {
		// 		if (this.isBrowserAndroidChrome()) {
		// 			this._genAndroidChrome(container);
		// 		} else if (this.isBrowserAndroidFacebook()) {
		// 			this._genIOSInAppBrowserOpenInSystemBrowser(container);
		// 		} else {
		// 			shouldShowModal = false;
		// 		}
		// 	} else {
		// 		shouldShowModal = false;
		// 	}
		// 	if (shouldShowModal) {
		// 		document.body.appendChild(container);
		// 		this._registerCloseListener();
		// 		setTimeout(() => {
		// 			container.classList.add("visible");
		// 		}, 50);
		// 	}
		// }
	}

	private renderIOSInstallDialog(): void {
		// if (this.isBrowserIOSSafari()) {
		this._genIOSSafari();
		// }
	}

	close(): void {
		this.domElement.classList.remove("visible");
		setTimeout(() => {
			document.body.removeChild(this.domElement);
			// if (this.closeEventListener) {
			// 	window.removeEventListener("touchstart", this.closeEventListener);
			// 	window.removeEventListener("click", this.closeEventListener);
			// 	this.closeEventListener = null;
			// }
		}, 300);
	}

	/**** Device Detection Functions ****/

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

	/**** Internal Functions ****/

	private _genLogo(): string {
		return `
	    <div class="pwa-logo">
	      <img src="${this._manifest.icons[0].src}" alt="logo" />
	    </div>
	    `;
	}

	// private _genErrorMessage(
	// 	container: HTMLElement,
	// 	title: string,
	// 	body: string,
	// ): void {
	// 	const containerInnerHTML =
	// 		this._genLogo() +
	// 		this._genModalStart() +
	// 		`<div class="adhs-error-title">${title}</div>` +
	// 		`<div class="adhs-error-body">${body}</div>` +
	// 		`<button class="adhs-error-copy-link-button" onclick="PWA.copyToClipboard();" ontouchstart="PWA.copyToClipboard();">${i18n.t("Copy Website Link to Clipboard")}</button>` +
	// 		this._genModalEnd();
	// 	container.innerHTML = containerInnerHTML;
	// }

	// private _genTitleWithMessage(message: string): string {
	// 	return `
	//     <div class="adhs-title">${message}</div>
	//     `;
	// }

	private _genTitle(): string {
		return `<div class="pwa-title">
				${i18n.t("install_app", { app_name: this._manifest.name })}
		</div>`;
	}

	// private _genModalStart(): string {
	// 	return `<div class="adhs-modal">`;
	// }

	// private _genModalEnd(): string {
	// 	return `</div>`;
	// }

	// private _genListStart(): string {
	// 	return `<div class="adhs-list">`;
	// }

	// private _genListEnd(): string {
	// 	return `</div>`;
	// }

	private _genListItem({
		number,
		icon,
	}: {
		number: number;
		icon: string;
	}): string {
		return `
	  <div class="pwa-list-item">
	    <div class="pwa-number-container">
	      <div class="pwa-circle">
	        <div class="pwa-number">${number}</div>
	      </div>
	    </div>
	    <div class="pwa-instruction">${icon}</div>
	  </div>`;
	}

	// private _genAssetUrl(fileName: string): string {
	// 	return `${fileName}`;
	// }

	private _genIOSSafari(): void {
		const containerInnerHTML = `
			${this._genLogo()}
			<div class="pwa-modal">
				${this._genTitle()}
				<div class="pwa-list">

				</div>
			</div>
		`;
		this.domElement.innerHTML = containerInnerHTML;
		// const containerInnerHTML =
		// 	this._genLogo() +
		// 	this._genModalStart() +
		// 	this._genTitle() +
		// 	this._genListStart() +
		// 	this._genListItem(
		// 		"1",
		// 		i18n.t(
		// 			"Tap the %s button bellow.",
		// 			`<img class="adhs-ios-safari-sharing-api-button" src="${this._genAssetUrl("ios-safari-sharing-api-button.svg")}" />`,
		// 		),
		// 	) +
		// 	this._genListItem(
		// 		"2",
		// 		i18n.t(
		// 			"Select %s from the menu that pops up.",
		// 			`<img class="adhs-ios-safari-add-to-home-screen-button" src="${this._genAssetUrl("ios-safari-add-to-home-screen-button.svg")}" />`,
		// 		) +
		// 			` <span class="adhs-emphasis">${i18n.t("You may need to scroll down to find this menu item.")}</span>`,
		// 	) +
		// 	this._genListItem(
		// 		"3",
		// 		i18n.t(
		// 			"Open the %s app.",
		// 			`<img class="adhs-your-app-icon" src="${this._manifest.icons[0].src}"/>`,
		// 		),
		// 	) +
		// 	this._genListEnd() +
		// 	this._genModalEnd() +
		// 	`<div class="adhs-ios-safari-bouncing-arrow-container">
		//   <img src="${this._genAssetUrl("ios-safari-bouncing-arrow.svg")}" alt="arrow" />
		// </div>`;
		// container.innerHTML = containerInnerHTML;
		// container.classList.add("adhs-ios");
		// container.classList.add("adhs-safari");
	}

	// private _genIOSChrome(container: HTMLElement): void {
	// 	const containerInnerHTML =
	// 		this._genLogo() +
	// 		this._genModalStart() +
	// 		this._genTitle() +
	// 		this._genListStart() +
	// 		this._genListItem(
	// 			"1",
	// 			i18n.t(
	// 				"Tap the %s button in the upper right corner.",
	// 				`<img class="adhs-ios-chrome-more-button" src="${this._genAssetUrl("ios-chrome-more-button.svg")}"/>`,
	// 			),
	// 		) +
	// 		this._genListItem(
	// 			"2",
	// 			i18n.t(
	// 				"Select %s from the menu that pops up.",
	// 				`<img class="adhs-ios-chrome-add-to-home-screen-button" src="${this._genAssetUrl("ios-chrome-add-to-home-screen-button.svg")}"/>`,
	// 			) +
	// 				` <span class="adhs-emphasis">${i18n.t("You may need to scroll down to find this menu item.")}</span>`,
	// 		) +
	// 		this._genListItem(
	// 			"3",
	// 			i18n.t(
	// 				"Open the %s app.",
	// 				`<img class="adhs-your-app-icon" src="${this._manifest.icons[0].src}"/>`,
	// 			),
	// 		) +
	// 		this._genListEnd() +
	// 		this._genModalEnd() +
	// 		`<div class="adhs-ios-chrome-bouncing-arrow-container">
	//     <img src="${this._genAssetUrl("ios-chrome-bouncing-arrow.svg")}" alt="arrow" />
	//   </div>`;
	// 	container.innerHTML = containerInnerHTML;
	// 	container.classList.add("adhs-ios");
	// 	container.classList.add("adhs-chrome");
	// }

	// private _genIOSInAppBrowserOpenInSystemBrowser(container: HTMLElement): void {
	// 	const containerInnerHTML =
	// 		this._genLogo() +
	// 		this._genModalStart() +
	// 		this._genTitle() +
	// 		this._genListStart() +
	// 		this._genListItem(
	// 			"1",
	// 			i18n.t(
	// 				"Tap the %s button above.",
	// 				`<img class="adhs-more-button" src="${this._genAssetUrl("generic-more-button.svg")}"/>`,
	// 			),
	// 		) +
	// 		this._genListItem(
	// 			"2",
	// 			`${i18n.t("Tap")} <span class="adhs-emphasis">${i18n.t("Open in browser")}</span>.`,
	// 		) +
	// 		this._genListEnd() +
	// 		this._genModalEnd() +
	// 		`<div class="adhs-inappbrowser-openinsystembrowser-bouncing-arrow-container">
	//     <img src="${this._genAssetUrl("generic-vertical-up-bouncing-arrow.svg")}" alt="arrow" />
	//   </div>`;
	// 	container.innerHTML = containerInnerHTML;
	// 	container.classList.add("adhs-ios");
	// 	container.classList.add("adhs-inappbrowser-openinsystembrowser");
	// }

	// private _genIOSInAppBrowserOpenInSafariBrowser(container: HTMLElement): void {
	// 	const containerInnerHTML =
	// 		this._genLogo() +
	// 		this._genModalStart() +
	// 		this._genTitle() +
	// 		this._genListStart() +
	// 		this._genListItem(
	// 			"1",
	// 			i18n.t(
	// 				"Tap the %s button below to open your system browser.",
	// 				`<img class="adhs-more-button" src="${this._genAssetUrl("openinsafari-button.png")}"/>`,
	// 			),
	// 		) +
	// 		this._genListEnd() +
	// 		this._genModalEnd() +
	// 		`<div class="adhs-inappbrowser-openinsafari-bouncing-arrow-container">
	//     <img src="${this._genAssetUrl("generic-vertical-down-bouncing-arrow.svg")}" alt="arrow" />
	//   </div>`;
	// 	container.innerHTML = containerInnerHTML;
	// 	container.classList.add("adhs-ios");
	// 	container.classList.add("adhs-inappbrowser-openinsafari");
	// }

	// private _genAndroidChrome(container: HTMLElement): void {
	// 	const containerInnerHTML =
	// 		this._genLogo() +
	// 		this._genModalStart() +
	// 		this._genTitle() +
	// 		this._genListStart() +
	// 		this._genListItem(
	// 			"1",
	// 			i18n.t(
	// 				"Tap the %s button in the browser bar.",
	// 				`<img class="adhs-android-chrome-more-button" src="${this._genAssetUrl("android-chrome-more-button.svg")}"/>`,
	// 			),
	// 		) +
	// 		this._genListItem(
	// 			"2",
	// 			i18n.t(
	// 				//@ts-expect-error
	// 				"Tap the %s or %s button.",
	// 				`<img class="adhs-android-chrome-add-to-homescreen-button" src="${this._genAssetUrl("android-chrome-add-to-home-screen-button.svg")}"/>`,
	// 				`<img class="adhs-android-chrome-install-app" src="${this._genAssetUrl("android-chrome-install-app.svg")}"/>`,
	// 			),
	// 		) +
	// 		this._genListItem(
	// 			"3",
	// 			i18n.t(
	// 				"Open the %s app.",
	// 				`<img class="adhs-your-app-icon" src="${this._manifest.icons[0].src}"/>`,
	// 			),
	// 		) +
	// 		this._genListEnd() +
	// 		this._genModalEnd() +
	// 		`<div class="adhs-android-chrome-bouncing-arrow-container">
	//     <img src="${this._genAssetUrl("android-chrome-bouncing-arrow.svg")}" alt="arrow" />
	//   </div>`;
	// 	container.innerHTML = containerInnerHTML;
	// 	container.classList.add("adhs-android");
	// 	container.classList.add("adhs-chrome");
	// }

	// private _registerCloseListener(): void {
	// 	const self = this;
	// 	this.closeEventListener = function (e: Event) {
	// 		const modal = document.querySelector(".adhs-container .adhs-modal");
	// 		if (modal && !modal.contains(e.target as Node)) {
	// 			self.close();
	// 		}
	// 	};
	// 	window.addEventListener("touchstart", this.closeEventListener);
	// 	window.addEventListener("click", this.closeEventListener);
	// }

	// clearModalDisplayCount(): void {
	// 	if (this._isEnabledModalDisplayCount()) {
	// 		window.localStorage.removeItem("adhs-modal-display-count");
	// 	}
	// }

	// private _isEnabledModalDisplayCount(): boolean {
	// 	return (
	// 		typeof this.maxModalDisplayCount === "number" &&
	// 		this.maxModalDisplayCount >= 0 &&
	// 		!!window.localStorage
	// 	);
	// }

	// private _hasReachedMaxModalDisplayCount(): boolean {
	// 	return (
	// 		this._isEnabledModalDisplayCount() &&
	// 		this._getModalDisplayCount() >= this.maxModalDisplayCount
	// 	);
	// }

	// private _incrModalDisplayCount(): boolean {
	// 	if (!this._isEnabledModalDisplayCount()) {
	// 		return false;
	// 	}

	// 	let count = this._getModalDisplayCount();
	// 	count++;
	// 	window.localStorage.setItem("adhs-modal-display-count", count.toString());
	// 	return true;
	// }

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

	private _getModalDisplayCount(): number {
		let count = window.localStorage.getItem("adhs-modal-display-count");
		if (count === null) {
			count = "0";
			window.localStorage.setItem("adhs-modal-display-count", count);
		}
		return parseInt(count, 10);
	}

	static copyToClipboard(): void {
		const currentUrl = window.location.href;
		try {
			navigator.clipboard.writeText(currentUrl);
			const button = document.querySelector(".adhs-error-copy-link-button");

			if (button) {
				button.innerHTML = i18n.t("Link Copied to Clipboard!");
			}
		} catch (err) {
			const button = document.querySelector(".adhs-error-copy-link-button");

			if (button) {
				button.innerHTML = i18n.t(
					'Failed to Copy to Clipboard! (Try Again from "https://" Link)',
				);
			}
		}
	}
}
