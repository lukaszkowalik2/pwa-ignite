import { styled } from "goober";
import type { ComponentChildren } from "preact";

interface ListItemProps {
	icon?: ComponentChildren;
	text: string;
	boldText?: string;
}

export const ListItem = (props: ListItemProps) => {
	return (
		<ListItemStyle class="pwa-list-item">
			<ListItemNumberContainerStyle class="pwa-number-container">
				<ListItemIconWrapper class="pwa-circle">
					{props.icon}
				</ListItemIconWrapper>
			</ListItemNumberContainerStyle>
			<ListItemInstructionStyle class="pwa-instruction">
				<p>
					{props.text}. <ListItemBoldStyle>{props.boldText}</ListItemBoldStyle>
				</p>
			</ListItemInstructionStyle>
		</ListItemStyle>
	);
};

const ListItemStyle = styled("div")`
	display: flex;
	flex-direction: row;
	align-items: start;
	justify-content: flex-start;
	margin: 0px 0px 10px 0px;
	align-items: center;
`;

const ListItemNumberContainerStyle = styled("div")`
	flex-direction: column;
	display: flex;
	margin: 0px 5px 0px 0px;
`;

const ListItemIconWrapper = styled("div")`
	height: 52px;
	width: 52px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ListItemInstructionStyle = styled("div")`
	font-size: 15px;
	font-weight: 500;
	text-align: left;
`;

const ListItemBoldStyle = styled("span")`
	font-weight: 700;
`;
