import { styled } from "goober";

interface DescriptionProps {
	iconUrl: string;
	name: string;
	description?: string;
}

export const Description = (props: DescriptionProps) => {
	return (
		<DescriptionStyle>
			<DescriptionIconStyle>
				<DescriptionIconImgStyle src={props.iconUrl} alt="logo" />
			</DescriptionIconStyle>
			<DescriptionTextContainerStyle>
				<DescriptionTextNameStyle>{props.name}</DescriptionTextNameStyle>
				<DescriptionTextDescriptionStyle>
					{props.description}
				</DescriptionTextDescriptionStyle>
			</DescriptionTextContainerStyle>
		</DescriptionStyle>
	);
};

const DescriptionStyle = styled("div")`
	display: flex;
	flex-direction: row;
	align-items: start;
	justify-content: flex-start;
	align-items: center;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const DescriptionIconStyle = styled("div")`
	flex-direction: column;
	display: flex;
	margin: 0px 5px 0px 0px;
	width: 64px;
	height: 64px;
	padding: 5px;
	min-width: 64px;
	min-height: 64px;
`;

const DescriptionIconImgStyle = styled("img")`
	width: 100%;
	height: 100%;
	border-radius: 12px;
`;

const DescriptionTextContainerStyle = styled("div")`
	display: flex;
	flex-direction: column;
	gap: 0;
`;

const DescriptionTextNameStyle = styled("h1")`
	font-weight: 600;
	padding-right: 10px;
	line-height: 15px;
	align-items: flex-start;
	display: flex;
	margin: 3px 0;
`;

const DescriptionTextDescriptionStyle = styled("p")`
	font-size: 12px;
	line-height: 15px;
	margin-bottom: 15px;
	color: #333;
	height: fit-content;
`;
