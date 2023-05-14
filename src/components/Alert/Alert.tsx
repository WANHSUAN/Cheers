import {ReactNode} from "react";
import {SlCheck} from "react-icons/sl";
import styled, {keyframes} from "styled-components/macro";

interface IAlertProps {
  color: string;
  children?: ReactNode;
}

const dropInFadeOut = keyframes`
0% {
    opacity: 0;
    visibility: visible;
    transform: translate3d(0, -200%, 0);
  }
  12% {
    transform: translate3d(0, 0, 0);
  }
  20% {
    opacity: 1;
  }
  70% {
    opacity: 1;
    visibility: visible;
    transform: translate3d(0, 0, 0);
  }
  80% {
    opacity: 0;
  }
  100% {
    visibility: hidden;
    transform: translate3d(25%, 0, 0);
  }
`;

const Flash = styled.div`
  display: block;
  position: fixed;
  top: 100px;
  right: 36%;
  width: 550px;
  height: 100px;
  padding: 20px 25px 20px 85px;
  font-size: 18px;
  font-weight: 400;
  color: ${(props) => props.color};
  background-color: #fff;
  border: 2px solid ${(props) => props.color};
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(255, 255, 255, 0.8);
  opacity: 0;
  align-items: center;
  animation: ${dropInFadeOut} 3.5s 0.4s cubic-bezier(0.32, 1.75, 0.65, 0.91);
`;

const FlashIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 1.8em;
  height: 100%;
  padding: 0 0.4em;
  background-color: ${(props) => props.color};
  color: #fff;
  font-size: 36px;
  font-weight: 300;
  transform: translate(0, -50%);
`;

const Icon = styled.div`
  position: absolute;
  top: 55%;
  left: 15%;
  transform: translate(0, -50%);
`;

export const CommentText = styled.div`
  display: flex;
  height: 60px;
  padding-left: 5px;
  align-items: center;
`;

export const Alert = ({color, children}: IAlertProps) => {
  return (
    <Flash color={color}>
      <FlashIcon color={color}>
        <Icon>
          <SlCheck />
        </Icon>
      </FlashIcon>
      <CommentText>{children}</CommentText>
    </Flash>
  );
};
