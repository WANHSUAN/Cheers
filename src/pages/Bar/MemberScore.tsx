import React, {useState, useContext} from "react";
import styled from "styled-components/macro";
import {db} from "../../App";
import {doc, updateDoc, arrayUnion} from "firebase/firestore";
import {useParams} from "react-router-dom";
import {AuthContext} from "../../Context/AuthContext";
import {TiStarFullOutline, TiStarOutline} from "react-icons/ti";

const ScoreForm = styled.form`
  position: relative;
`;

const LabelSectionInput = styled.label``;

const MemberImg = styled.img`
  position: absolute;
  top: -17%;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #ffffff7c;
  background-color: #000;
`;

const SubmitSection = styled.div`
  width: 600px;
  margin: 15px auto;
  display: flex;
  justify-content: space-between;
`;

const LabelSection = styled.label``;

const StarSection = styled.div`
  font-size: 25px;
`;

const InputTextArea = styled.textarea`
  width: 600px;
  height: 250px;
  border: 2px solid #ffffff7c;
  background-color: #000;
  border-radius: 10px;
  padding: 60px 20px;
  font-size: 30px;
  color: #ffffffc1;
`;

const SubmitButton = styled.button`
  width: 130px;
  height: 30px;
  font-size: 20px;
  background-color: #000;
  color: #fff;
  border: 1px solid #ffffff7c;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d18b19;
    border: 1px solid #d18b19;
  }
`;

interface StarProps {
  marked: boolean;
  starId: number;
}

function Star({marked, starId}: StarProps) {
  return (
    <span
      star-id={starId}
      style={{color: "#D19B18", cursor: "pointer"}}
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
  const [isHoverDisabled, setIsHoverDisabled] = useState(false);

  const hoverOver = (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isHoverDisabled) return;
    let val = 0;
    if (e && e.target && (e.target as HTMLElement).getAttribute("star-id"))
      val = parseInt((e.target as HTMLElement).getAttribute("star-id") ?? "");
    setSelection(val);
  };
  return (
    <div
      onMouseOut={() => hoverOver()}
      onClick={(e) => {
        setIsHoverDisabled(true); // 禁用 hover

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
  const [ratings, setRatings] = useState<number>(0);
  const {id} = useParams();
  const [currentDocId, setCurrentDocId] = useState(id);
  const [key, setKey] = useState(0);
  const {user} = useContext(AuthContext);
  console.log(user.userImg);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const commentRef = doc(db, `bars/${currentDocId}`); // 使用 currentDocId 獲取檔案引用
    await updateDoc(commentRef, {
      member_comment: arrayUnion({
        userName: user.name,
        comment: inputValue,
        score: ratings,
      }),
    });
    setMessages([...messages, `${user.name}: ${inputValue}`]);
    setInputValue("");
    setRatings(0);
    setKey(key + 1); // 每次 handleSubmit 後將 key 狀態加 1
  };

  return (
    <ScoreForm onSubmit={handleSubmit}>
      <LabelSectionInput>
        <MemberImg />
        {/* src={user.userImg}  */}
        <InputTextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Leave a message..."
        ></InputTextArea>
      </LabelSectionInput>
      <br />
      <SubmitSection>
        <LabelSection>
          <StarSection>
            <StarRating
              key={key} // 將 key 綁定到 ratings 狀態
              rating={ratings}
              onRatingChange={(rating) => setRatings(rating)}
            />
          </StarSection>
        </LabelSection>
        <br />
        <SubmitButton type="submit">SUBMIT</SubmitButton>
      </SubmitSection>
    </ScoreForm>
  );
}

export default MemberScore;
