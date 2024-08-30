import type { SVGProps } from "preact/compat";

/**
 * DownloadAndroid component.
 *
 * @component
 * @param {SVGProps<SVGSVGElement>} props - The props for the SVG element.
 * @returns {JSX.Element} The rendered DownloadAndroid component.
 */
export const DownloadAndroid = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="3.366 0 21.42 28.381"
		>
			<g clipPath="url(#a)">
				<path
					fill="#000"
					d="M20.25 1.136 9 1.125a2.257 2.257 0 0 0-2.25 2.25V6.75H9V5.625h11.25v15.75H9V20.25H6.75v3.375A2.257 2.257 0 0 0 9 25.875h11.25a2.257 2.257 0 0 0 2.25-2.25V3.375a2.247 2.247 0 0 0-2.25-2.239Zm-9 15.739h2.25V9H5.625v2.25h4.039l-6.289 6.289 1.586 1.586 6.289-6.289v4.039Z"
				/>
			</g>
			<defs>
				<clipPath id="a">
					<path fill="#fff" d="M0 0h27v27H0z" />
				</clipPath>
			</defs>
		</svg>
	);
};
