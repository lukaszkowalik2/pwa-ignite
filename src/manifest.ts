import type { ImageResource } from "web-app-manifest";

export class Manifest {
	public description: string;
	public icons: ImageResource[];
	public name: string;
	public screenshots?: ImageResource[];
	public short_name: string;

	constructor() {
		this.icons = [{ src: "" }];
		this.screenshots = undefined;
		this.short_name = "PWA";
		this.name = "Progressive web application";
		this.description = "Progressive web application";
	}
}
