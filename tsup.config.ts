import { defineConfig } from "tsup";

export default defineConfig((options) => {
	return {
		minify: !options.watch,
		clean: true,
		dts: true,
		entry: ["src/index.ts"],
		format: "esm",
		outDir: "lib",
		sourcemap: true,
		injectStyle: true,
		splitting: false,
		treeshake: true,
	};
});
