import { defineConfig } from "tsup";

export default defineConfig((options) => {
	return {
		bundle: !options.watch,
		clean: true,
		dts: true,
		entry: ["src/pwa.tsx"],
		format: ["esm", "cjs", "iife"],
		globalName: "PWA",
		injectStyle: true,
		minify: !options.watch,
		outDir: "lib",
		sourcemap: true,
		splitting: false,
		treeshake: true,
	};
});
