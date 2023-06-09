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

  @media (max-width: 1440px) {
    font-size: 40px;
  }

  @media (max-width: 1280px) {
    font-size: 30px;
  }

  @media (max-width: 1024px) {
    font-size: 28px;
    line-height: 60px;
  }

  @media (max-width: 768px) {
    font-size: 25px;
    line-height: 50px;
  }

  @media (max-width: 414px) {
    font-size: 20px;
    line-height: 30px;
  }
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
