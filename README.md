<h1 align="center">PWA Ignite</h1>

<p align="center">Kickstart your Progressive Web App development with a blazing-fast setup. PWA Ignite simplifies the process, making it easier than ever to launch your PWA.</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 0" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-0-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/lukaszkowalik2/pwa-ignite/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/lukaszkowalik2/pwa-ignite" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/lukaszkowalik2/pwa-ignite?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/lukaszkowalik2/pwa-ignite/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg"></a>
	<a href="http://npmjs.com/package/pwa-ignite"><img alt="📦 npm version" src="https://img.shields.io/npm/v/pwa-ignite?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

# PWA Class Documentation

# Overview

The PWA class provides a streamlined way to manage the installation and running state of a Progressive Web App (PWA). It offers methods for checking if the PWA is installed, determining if it’s running in standalone mode, and handling installation prompts across various platforms and browsers.

## Usage

```shell
npm i pwa-ignite
```

## Quick Start

Here’s a quick example of how to use the PWA class:

```typescript
import { PWA } from "pwa-ignite";

// Initialize the PWA with optional configuration
const pwa = new PWA({
	manifest: {
		name: "My PWA",
		short_name: "PWA",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#000000",
		icons: [
			{
				src: "/icons/icon-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
		],
	},
});

// Check if the app is installable
if (pwa.isInstallAvailable) {
	console.log("App is installable.");
	pwa.install().then((outcome) => {
		console.log(`User choice: ${outcome}`);
	});
}

// Check if the app is running in standalone mode
if (pwa.isUnderStandaloneMode) {
	console.log("App is running in standalone mode.");
}
```

## API Documentation

### `PWA` Class

#### Constructor

```typescript
constructor(options?: PWAOptions)
```

- **`options`** (Optional): An object of type `PWAOptions` to configure the PWA. The `manifest` field in the options allows you to specify the PWA manifest directly.

#### Properties

- **`isInstallAvailable: boolean`**  
  Indicates if the app is ready to be installed. It becomes `true` when the `beforeinstallprompt` event is fired.

- **`isUnderStandaloneMode: boolean`**  
  Indicates if the app is running in standalone mode, such as when it's installed and launched as a separate application.

- **`isRelatedAppsInstalled: boolean`**  
  Indicates if any related apps specified in the manifest are installed.

#### Methods

- **`install(): Promise<"accepted" | "dismissed" | null>`**  
  Prompts the user to install the PWA if the installation prompt is available. Returns a promise that resolves to the user's choice (`"accepted"` or `"dismissed"`), or `null` if the prompt isn’t available.

- **`close(): void`**  
  Closes any open installation dialog by unmounting it from the DOM.

- **`isStandaloneMode(): boolean`**  
  Checks if the app is running in standalone mode. Returns `true` if it is, otherwise `false`.

- **`isDeviceAndroid(): boolean`**  
  Checks if the current device is running Android.

- **`isDeviceIOS(): boolean`**  
  Checks if the current device is running iOS.

- **`isBrowserIOSSafari(): boolean`**  
  Checks if the current browser is Safari on an iOS device.

- **`isBrowserIOSChrome(): boolean`**  
  Checks if the current browser is Chrome on an iOS device.

- **`isBrowserIOSFirefox(): boolean`**  
  Checks if the current browser is Firefox on an iOS device.

- **`isBrowserIOSInAppFacebook(): boolean`**  
  Checks if the current browser is Facebook's in-app browser on an iOS device.

- **`isBrowserIOSInAppLinkedin(): boolean`**  
  Checks if the current browser is LinkedIn's in-app browser on an iOS device.

- **`isBrowserIOSInAppInstagram(): boolean`**  
  Checks if the current browser is Instagram's in-app browser on an iOS device.

- **`isBrowserIOSInAppThreads(): boolean`**  
  Checks if the current browser is Threads' in-app browser on an iOS device.

- **`isBrowserIOSInAppTwitter(): boolean`**  
  Checks if the current browser is Twitter's in-app browser on an iOS device.

- **`isBrowserAndroidChrome(): boolean`**  
  Checks if the current browser is Chrome on an Android device.

- **`isBrowserAndroidFacebook(): boolean`**  
  Checks if the current browser is Facebook's in-app browser on an Android device.

- **`isBrowserAndroidSamsung(): boolean`**  
  Checks if the current browser is Samsung Internet on an Android device.

- **`isBrowserAndroidFirefox(): boolean`**  
  Checks if the current browser is Firefox on an Android device.

## Error Handling

If any method encounters an issue, such as failing to fetch the manifest or determining if the app is running in standalone mode, it will throw an error or log a warning in the console. Always ensure to catch and handle these errors appropriately in your application.

## Contributing

If you'd like to contribute to the development of this class, please fork the repository and submit a pull request. Contributions are welcome!

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->
