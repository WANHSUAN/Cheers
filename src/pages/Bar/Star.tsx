export interface IStarProps {
  marked: boolean;
  starId: number;
}

export const Star = ({marked, starId}: IStarProps) => {
  return (
    <span
      star-id={starId}
      style={{
        color: "#D19B18",
        cursor: "pointer",
      }}
      role="button"
    >
      {marked ? "\u2605" : "\u2606"}
    </span>
  );
};
