import { defineConfig } from "tsup";

export default defineConfig((options) => {
	return {
		bundle: true,
		clean: true,
		dts: true,
		entry: ["src/pwa.tsx"],
		format: ["esm", "cjs", "iife"],
		globalName: "PWA",
		injectStyle: true,
		minify: !options.watch,
		outDir: "lib",
		sourcemap: !!options.watch,
		splitting: false,
		treeshake: true,
	};
});
