import {ReactNode} from "react";
import styled from "styled-components/macro";

interface IButtonProps {
  fontSize?: string;
  marginLeft?: string;
  children?: ReactNode;
}

const BtnCircle = styled.span`
  position: absolute;
  top: 0;
  right: 95%;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  box-shadow: 0 0 1px 1px #d19b18;
  transition: 0.3s linear;
  color: #fff;

  @media (max-width: 768px) {
    width: 80%;
    height: 80%;
    top: 10%;
  }
`;

const BtnWhiteCircle = styled.span`
  position: absolute;
  top: 50%;
  right: 55%;
  transform: translate(-50%, -50%) scale(0);
  width: 28px;
  height: 28px;
  border-radius: 100%;
  background: #d19b18;
  display: flex;
  transition: 0.3s ease-in-out;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }

  svg {
    width: 12px;
    height: 12px;
    margin: auto;
  }
`;

export const BtnText = styled.span<IButtonProps>`
  position: absolute;
  font-size: ${(props) => props.fontSize};
  top: 50%;
  left: -50%;
  transform: translateY(-50%);
  white-space: nowrap;
  z-index: 2;
  padding: 24px 0;
  transition: 0.3s linear;
  margin-left: ${(props) => props.marginLeft};

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 580px) {
    font-size: 15px;
  }
`;

export const Btn = styled.div<IButtonProps>`
  display: inline-block;
  color: #d19b18;
  padding: 16px;
  position: relative;
  letter-spacing: 1px;

  &:hover {
    ${BtnCircle} {
      transform: scale(0);
    }

    ${BtnWhiteCircle} {
      transform: translate(-50%, -50%) scale(1);
    }

    ${BtnText} {
      transform: translate(15px, -50%);
    }
  }
`;

export const Button = ({fontSize, marginLeft, children}: IButtonProps) => {
  return (
    <Btn>
      <BtnCircle />
      <BtnWhiteCircle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="icon-arrow-right"
          viewBox="0 0 21 12"
        >
          <path d="M17.104 5.072l-4.138-4.014L14.056 0l6 5.82-6 5.82-1.09-1.057 4.138-4.014H0V5.072h17.104z"></path>
        </svg>
      </BtnWhiteCircle>
      <BtnText fontSize={fontSize} marginLeft={marginLeft}>
        {children}
      </BtnText>
    </Btn>
  );
};
