import React, {useState} from "react";

function Star({marked, starId}) {
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

function StarRating(props) {
  const [rating, setRating] = useState(
    typeof props.rating === "number" ? props.rating : 0
  );
  const [selection, setSelection] = useState(0);
  const hoverOver = (e) => {
    let val = 0;
    if (e && e.target && e.target.getAttribute("star-id"))
      val = e.target.getAttribute("star-id");
    setSelection(val);
  };
  return (
    <div
      onMouseOut={() => hoverOver(null)}
      onClick={(e) => {
        setRating(e.target.getAttribute("star-id") || rating);
        props.onRatingChange(parseInt(e.target.getAttribute("star-id")));
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
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [ratings, setRatings] = useState([]);

  const handleSubmit = (e) => {
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
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
        </label>
        <br />
        <label>
          您的評分：
          <StarRating
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
