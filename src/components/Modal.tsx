import { styled } from "goober";

import type { ComponentChildren } from "preact";

interface ModalProps {
	children: ComponentChildren;
}

/**
 * Renders a modal component.
 *
 * @param {ModalProps} props - The props for the modal component.
 * @returns {JSX.Element} The rendered modal component.
 */
export const Modal = (props: ModalProps) => {
	return (
		<ModalStyle class="pwa-modal">
			<ListStyle>{props.children}</ListStyle>
		</ModalStyle>
	);
};

const ModalStyle = styled("div")`
	max-width: 400px;
	width: 90%;
	transition: opacity 0.3s ease-in-out;
	display: flex;
	flex-direction: column;
	line-height: normal;
`;

const ListStyle = styled("div")`
	display: flex;
	flex-direction: column;
`;
