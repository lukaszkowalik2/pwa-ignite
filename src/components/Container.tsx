import { styled } from "goober";
import type { ComponentChildren } from "preact";

interface ContainerProps {
	children: ComponentChildren;
}

/**
 * Renders a container component.
 *
 * @param {ContainerProps} props - The props for the container component.
 * @returns {JSX.Element} The rendered container component.
 */
export const Container = (props: ContainerProps) => {
	return (
		<ContainerStyle>
			<ASideStyle id="pwa-install-element">{props.children}</ASideStyle>
		</ContainerStyle>
	);
};

const ASideStyle = styled("aside")`
	user-select: none;
	max-width: 400px;
	margin-left: auto;
	margin-right: auto;
	background-color: #f5f5f5;
	border-radius: 7px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	padding: 10px 19px 10px 19px;
`;

const ContainerStyle = styled("div")`
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0);
	z-index: 9999;
	transition:
		opacity 0.3s ease-in-out,
		background-color 0.3s ease-in-out;
	font-family: "Roboto", sans-serif;
	backdrop-filter: blur(5px);
	-webkit-backdrop-filter: blur(5px);
`;
