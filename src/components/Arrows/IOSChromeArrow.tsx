import { keyframes, styled } from "goober";
import { ArrowUp } from "lucide-preact";

const bouncingArrow = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(20px);
  }
  60% {
    transform: translateY(5px);
  }
`;

const Arrow = styled(ArrowUp)`
	height: 40px;
	position: absolute;
	top: 0;
	right: 18px;
	animation: ${bouncingArrow} 1.5s infinite;
`;
/**
 * Renders an arrow component for iOS Chrome.
 * @returns The rendered arrow component.
 */
// @ts-expect-error - this is a valid size. Idk why it's not in the types
export const IOSChromeArrow = () => <Arrow size={60} color={"#3478F6"} />;
