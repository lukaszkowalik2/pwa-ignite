import { keyframes, styled } from "goober";
import { ArrowDown } from "lucide-preact";

const bouncingArrowAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

const Arrow = styled(ArrowDown)`
	height: 60px;
	position: absolute;
	top: calc(100dvh - 60px);
	left: 0;
	right: 0;
	margin: auto;
	display: flex;
	justify-content: center;
	align-items: center;
	animation: ${bouncingArrowAnimation} 1.5s infinite;
`;
/**
 * Renders an arrow component for iOS Safari.
 *
 * @returns The rendered arrow component.
 */
// @ts-expect-error - this is a valid size. Idk why it's not in the types
export const IOSSafariArrow = () => <Arrow size={60} color={"#3478F6"} />;
