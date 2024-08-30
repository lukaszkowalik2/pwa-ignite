import { defineConfig } from "tsup";

export default defineConfig((options) => {
	return {
		bundle: !options.watch,
		clean: true,
		dts: true,
		entry: ["src/index.ts"],
		format: ["esm", "cjs"],
		globalName: "PWALibrary",
		injectStyle: true,
		minify: !options.watch,
		outDir: "lib",
		sourcemap: true,
		splitting: false,
		treeshake: true,
	};
});
