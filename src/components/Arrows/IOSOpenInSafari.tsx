import { keyframes, styled } from "goober";
import { ArrowDown } from "lucide-preact";

const bouncingArrowAnimation = keyframes`
	0%,
	20%,
	50%,
	80%,
	100% {
		transform: translateY(0);
	}

	40% {
		transform: translateY(-20px);
	}

	60% {
		transform: translateY(-5px);
	}
`;

const Arrow = styled(ArrowDown)`
	height: 40px;
	position: absolute;
	top: calc(100dvh - 40px);
	right: 15px;
	animation: ${bouncingArrowAnimation} 1.5s infinite;
`;
export const IOSOpenInSafari = () => (
	// @ts-expect-error - this is a valid size. Idk why it's not in the types
	<Arrow size={60} color={"#3478F6"} />
);
