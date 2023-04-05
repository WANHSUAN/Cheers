import React, {useState} from "react";
import {db} from "../../App";
import {collection} from "firebase/firestore";

interface StarProps {
  marked: boolean;
  starId: number;
}

function Star({marked, starId}: StarProps) {
  return (
    <span
      star-id={starId}
      style={{color: "#ff9933", cursor: "pointer"}}
      role="button"
    >
      {/* 空星，實星 */}
      {marked ? "\u2605" : "\u2606"}
    </span>
  );
}

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

function StarRating(props: StarRatingProps) {
  const [rating, setRating] = useState<number>(
    typeof props.rating === "number" ? props.rating : 0
  );
  const [selection, setSelection] = useState(0);
  const hoverOver = (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let val = 0;
    if (e && e.target && (e.target as HTMLElement).getAttribute("star-id"))
      val = parseInt((e.target as HTMLElement).getAttribute("star-id") ?? "");
    setSelection(val);
  };
  return (
    <div
      onMouseOut={() => hoverOver()}
      onClick={(e) => {
        setRating(
          (prevRating) =>
            parseInt(
              (e.target as HTMLElement)?.getAttribute("star-id") ?? ""
            ) || prevRating
        );
        props.onRatingChange(
          parseInt((e.target as HTMLElement)?.getAttribute("star-id") ?? "0")
        );
      }}
      onMouseOver={hoverOver}
    >
      {Array.from({length: 5}, (_, i) => (
        <Star
          starId={i + 1}
          key={`star_${i + 1} `}
          marked={selection ? selection >= i + 1 : rating >= i + 1}
        />
      ))}
    </div>
  );
}

function MemberScore() {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [ratings, setRatings] = useState<number[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessages([...messages, inputValue]);
    setRatings([...ratings, 0]);
    setInputValue("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          您的留言
          <br />
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          ></textarea>
        </label>
        <br />
        <label>
          您的評分
          <StarRating
            rating={0}
            onRatingChange={(rating) => setRatings([...ratings, rating])}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            {message} (Rating: {ratings[index]})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MemberScore;
