import {doc, updateDoc} from "firebase/firestore";
import React, {useContext, useEffect, useState} from "react";
import {MdOutlineLiquor} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import styled from "styled-components/macro";
import {AuthContext} from "../../Context/AuthContext";
import {Alert, CommentText} from "../../components/Alert/Alert";
import {BtnText, Button} from "../../components/Button/Button";
import {db} from "../../utils/firebase";
import "../Bar/Bar.css";
import "./Question.css";

const Wrapper = styled.div`
  width: 1000px;
  margin: 0 auto;
  padding-top: 60px;
`;

const TestTitleSection = styled.div`
  margin-bottom: 50px;
`;

const TestTitle = styled.p`
  font-size: 70px;
  color: #fff;
  margin: 270px 0 50px 0;
`;

const TestSection = styled.div`
  margin: 200px auto 50px;
  display: flex;
  flex-direction: column;
`;

const SelectItemSection = styled.div``;

const SelectItem = styled.div`
  padding: 10px 0;
  text-align: left;
`;

const RadLabel = styled.label`
  display: flex;
  align-items: center;
  border-radius: 100px;
  padding: 30px 25px;
  cursor: pointer;
  transition: 0.3s;

  &:focus-within {
    background: hsla(0, 0%, 80%, 0.14);
  }
`;

const RadInput = styled.input`
  width: 1px;
  height: 1px;
  opacity: 0;
  z-index: -1;
`;

const RadDesign = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 100px;
  background: linear-gradient(
    to right bottom,
    hsla(40, 67%, 79%, 0.808),
    #d19b18
  );
  position: relative;

  &::before {
    content: "";
    display: inline-block;
    width: inherit;
    height: inherit;
    border-radius: inherit;

    background: hsl(0, 0%, 90%);
    transform: scale(1.1);
    transition: 0.3s;
  }
`;

const RadText = styled.div`
  color: hsl(0, 0%, 60%);
  margin-left: 14px;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-size: 25px;
  font-weight: 900;
  transition: 0.3s;
`;

const SelectTime = styled.p`
  font-size: 40px;
  color: #d19b18;
  margin: 20px 0;
`;

const Submit = styled.div`
  width: 90%;
  text-align: center;
  padding: 50px;
  margin-bottom: 50px;
`;

const EventButton = styled.button`
  text-decoration: none;
  color: #d19b18;
  font-size: 50px;
  width: 200px;
  border: none;
  background-color: rgba(255, 255, 255, 0);
  cursor: pointer;
  text-align: left;
`;

interface IBar {
  id: string;
  name: string;
  img: string;
  type: string[];
}
interface IOption {
  text: string;
  hashtag: string;
  group: string;
}

const options = [
  {text: "Afternoon", hashtag: "afternoon", group: "time"},
  {text: "Night", hashtag: "night", group: "time"},
  {text: "Alone", hashtag: "alone", group: "situation"},
  {text: "Together", hashtag: "together", group: "situation"},
  {text: "Couple", hashtag: "couple", group: "relationship"},
  {text: "Friend", hashtag: "friend", group: "relationship"},
  {text: "Special", hashtag: "special", group: "category"},
  {text: "Classic", hashtag: "classic", group: "category"},
  {text: "Simple", hashtag: "simple", group: "visual"},
  {text: "Vision", hashtag: "vision", group: "visual"},
];

const groups = {
  time: "What is your preferred time?",
  situation: "Alone or with others?",
  relationship: "Who will be joining you?",
  category: "Do you prefer something special or classic?",
  visual: "Do you prefer simplicity or visual appeal?",
};

export interface IQuestionProps {}

const QuestionPage: React.FC<IQuestionProps> = (props: IQuestionProps) => {
  const [showFlash, setShowFlash] = useState(false);
  const [finalBars, setFinalBars] = useState<IBar[]>([]);
  const {userUID, bars} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedOptions, setSelectedOptions] = useState<IOption[]>([]);
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const option = options.find((option) => option.text === value)!;

    const existingOptionIndex = selectedOptions.findIndex(
      (o) => o.text === option.text
    );

    let newSelectedOptions: IOption[] = [];

    if (existingOptionIndex > -1) {
      newSelectedOptions = [...selectedOptions];
      newSelectedOptions.splice(existingOptionIndex, 1);
    } else {
      const selectedGroupOptions = selectedOptions.filter(
        (o) => o.group === option.group
      );
      if (selectedGroupOptions.length > 0) {
        newSelectedOptions = selectedOptions.filter(
          (o) => o.group !== option.group
        );
      } else {
        newSelectedOptions = [...selectedOptions];
      }
      newSelectedOptions.push(option);
    }
    setSelectedOptions(newSelectedOptions);

    const selectedGroupOptionHashtags = newSelectedOptions.map(
      (o) => o.hashtag
    );
    const selectedBars = bars?.filter((bar) =>
      selectedGroupOptionHashtags.every((hashtag) =>
        bar?.type?.includes(hashtag)
      )
    );
    setFinalBars(selectedBars);
  };

  console.log(finalBars);

  const handleButtonClick = async () => {
    const selectedHashtags = selectedOptions.map((option) => option.hashtag);
    const updatedBars = bars.filter((bar) =>
      selectedHashtags.every((hashtag) => bar.type.includes(hashtag))
    );

    const matchingBars = updatedBars.map((bar) => {
      return {name: bar.name, img: bar.img, id: bar.id};
    });

    if (matchingBars.length > 0) {
      const userRef = doc(db, "users", userUID);
      await updateDoc(userRef, {
        matchingBars: matchingBars,
      });

      navigate("/recommendation");
    } else {
      setShowFlash(true);
      setTimeout(() => {
        setShowFlash(false);
      }, 3500);
      setSelectedOptions([]);
    }
  };

  return (
    <>
      <Wrapper>
        <TestTitleSection>
          <TestTitle>Select Your Favorite Type!</TestTitle>
        </TestTitleSection>

        <TestSection>
          {Object.entries(groups).map(([key, label]) => (
            <SelectItemSection key={key}>
              <SelectTime>
                <MdOutlineLiquor />
                {label}
              </SelectTime>
              {options
                .filter((option) => option.group === key)
                .map((option) => (
                  <SelectItem key={option.hashtag}>
                    <RadLabel>
                      <input
                        type="radio"
                        className="rad-input"
                        name={option.group}
                        value={option.text}
                        checked={selectedOptions.some(
                          (o) => o.text === option.text
                        )}
                        onChange={handleOptionChange}
                      />
                      <div className="rad-design"></div>
                      <RadText> {option.hashtag}</RadText>
                    </RadLabel>
                  </SelectItem>
                ))}
            </SelectItemSection>
          ))}
        </TestSection>
        <Submit>
          {showFlash && (
            <Alert color="#fba78d">
              <CommentText>No matching Bar!</CommentText>
            </Alert>
          )}
          <EventButton onClick={handleButtonClick}>
            <Button fontSize="40px" marginLeft="25px">
              <BtnText fontSize="40px" marginLeft="25px">
                Find the bars you like!
              </BtnText>
            </Button>
          </EventButton>
        </Submit>
      </Wrapper>
    </>
  );
};

export default QuestionPage;
