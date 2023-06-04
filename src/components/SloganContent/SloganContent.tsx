import {useEffect, useState} from "react";
import styled, {keyframes} from "styled-components/macro";

const fadeInPosition = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SloganContent = styled.div<SloganContentProps>`
  width: 35%;
  margin: 4% 0 0 10%;
  font-size: 50px;
  color: #ffffffdd;
  line-height: 80px;
  opacity: 0;
  text-align: ${(props) => props.textAlign};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  animation: ${fadeInPosition} ease-in-out ${(props) => props.animationDuration};
`;

interface SloganContentProps {
  textAlign: "left" | "right";
  visible: boolean;
  animationDuration: string;
}

interface SloganContentAnimationProps {
  position: string;
  delay: number;
  content: string;
}

const SloganContentAnimation: React.FC<SloganContentAnimationProps> = ({
  position,
  delay,
  content,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SloganContent
      textAlign={position as "left" | "right"}
      animationDuration={`${delay / 1000}s`}
      visible={visible}
    >
      {content}
    </SloganContent>
  );
};

export default SloganContentAnimation;
