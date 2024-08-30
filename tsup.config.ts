import { defineConfig } from "tsup";

export default defineConfig((options) => {
	return {
		clean: true,
		dts: true,
		entry: ["src/index.ts"],
		format: ["esm", "cjs"],
		injectStyle: true,
		minify: !options.watch,
		outDir: "lib",
		sourcemap: true,
		splitting: false,
		treeshake: true,
	};
});
