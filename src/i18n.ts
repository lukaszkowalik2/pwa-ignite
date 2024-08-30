import i18next from "i18next";

import de from "./locales/de.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import pl from "./locales/pl.json";
import pt from "./locales/pt.json";
/**
 * Initializes the i18next instance with the specified configuration.
 * @param {object} config The configuration options for i18next.
 * @param {string} config.fallbackLng The fallback language to use.
 * @param {boolean} config.debug Whether to enable debug mode.
 * @param {object} config.resources The language resources to load.
 * @returns {object} - The initialized i18next instance.
 */
void i18next.init({
	debug: process.env.NODE_ENV === "development",
	fallbackLng: "en",
	resources: {
		de: {
			translation: de,
		},
		en: {
			translation: en,
		},
		fr: {
			translation: fr,
		},
		pl: {
			translation: pl,
		},
		pt: {
			translation: pt,
		},
	},
});
