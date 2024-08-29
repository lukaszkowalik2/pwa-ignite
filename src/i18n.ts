import i18next from "i18next";

import en from "./locales/en.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import pt from "./locales/pt.json";

export const i18n = i18next.init({
	fallbackLng: "en",
	debug: process.env.NODE_ENV === "development",
	resources: {
		en: {
			translation: en,
		},
		de: {
			translation: de,
		},
		fr: {
			translation: fr,
		},
		pt: {
			translation: pt,
		},
	},
});
