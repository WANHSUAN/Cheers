import styled from "styled-components/macro";

const StarStyle = styled.span`
  color: #d19b18;
  cursor: pointer;
`;

export interface IStarProps {
  marked: boolean;
  onMouseOver: () => void;
  onMouseOut: () => void;
  onClick: () => void;
}

export const Star = ({
  marked,
  onMouseOver,
  onMouseOut,
  onClick,
}: IStarProps) => {
  return (
    <StarStyle
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={onClick}
      role="button"
    >
      {marked ? "\u2605" : "\u2606"}
    </StarStyle>
  );
};
