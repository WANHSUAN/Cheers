import React, {useState, useEffect, useContext} from "react";
import {useNavigate, Link} from "react-router-dom";
import styled from "styled-components/macro";
import {db} from "../../App";
import {collection, getDocs, doc, updateDoc} from "firebase/firestore";
import {AuthContext} from "../../Context/AuthContext";
import main from "./main.png";
import {RxDoubleArrowDown, RxDoubleArrowRight} from "react-icons/rx";
import "../Calendar/Calendar.css";

const Wrapper = styled.div`
  width: 83.5%;
  margin: 0 auto;
  padding-top: 60px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const Slogan = styled.p`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  font-size: 130px;
  color: #fff;
  letter-spacing: 10px;
  text-align: center;
`;

const MainImg = styled.img`
  width: 100%;
  height: 550px;
  margin-top: 270px;
  vertical-align: bottom;
  object-fit: cover;
`;

const TestTitleSection = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const TestTitle = styled.p`
  font-size: 70px;
  color: #fff;
  padding: 50px;
  margin: 270px 0 50px 0;
  text-align: center;
`;

const DoubleArrow = styled.button`
  height: 100px;
  color: #d19b18;
  font-size: 80px;
  background-color: rgba(255, 255, 255, 0);
  border: none;
  text-align: center;
  cursor: pointer;
`;

const TestSection = styled.div`
  margin: 200px auto 50px;
  display: flex;
  justify-content: space-around;
`;

const SelectItemSection = styled.div`
  width: 230px;
  height: 230px;
  border: 1px solid #fff;
  border-radius: 3%;
  padding: 40px;
  text-align: left;
`;

const SelectItem = styled.div`
  width: 280px;
`;

const SelectTime = styled.p`
  font-size: 25px;
  color: #d19b18;
  margin: 10px 0;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const SelectContent = styled.div`
  width: 130px;
  height: 20px;
  color: #fff;
  font-size: 20px;
  margin: 20px 0;
`;

const Submit = styled.div`
  width: 100%;
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

interface IUser {
  createdAt: string;
  displayName: string;
  email: string;
  id: string;
}

const options = [
  {text: "Afternoon", hashtag: "afternoon", group: "time"},
  {text: "Night", hashtag: "night", group: "time"},
  {text: "Alone", hashtag: "alone", group: "situation"},
  {text: "Together", hashtag: "together", group: "situation"},
  {text: "Classic", hashtag: "classic", group: "category"},
  {text: "Special", hashtag: "special", group: "category"},
  {text: "Simple", hashtag: "simple", group: "visual"},
  {text: "Vision", hashtag: "vision", group: "visual"},
  {text: "Couple", hashtag: "couple", group: "relationship"},
  {text: "Friend", hashtag: "friend", group: "relationship"},
];

const groups = {
  time: "Time",
  situation: "Situation",
  category: "Category",
  visual: "Visual",
  relationship: "Relationship",
};

export interface IQuestionProps {}

const QuestionPage: React.FC<IQuestionProps> = (props: IQuestionProps) => {
  const navigate = useNavigate();
  const [bars, setBars] = useState<IBar[]>([]);
  const [users, setUsers] = useState<IUser[] | undefined>();
  const barsCollectionRef = collection(db, "bars");
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    window.scrollTo(0, 0);
    const getBars = async () => {
      const data = await getDocs(barsCollectionRef);
      setBars(data.docs.map((doc) => ({...(doc.data() as IBar), id: doc.id})));
    };

    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(
        data.docs.map((doc) => ({...(doc.data() as IUser), id: doc.id}))
      );
    };

    getBars();
    getUsers();
  }, []);

  const [selectedOptions, setSelectedOptions] = useState<IOption[]>([]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const option = options.find((option) => option.text === value)!;

    const existingOptionIndex = selectedOptions.findIndex(
      (o) => o.text === option.text
    );

    if (existingOptionIndex > -1) {
      // 從 selectedOptions 中刪除選項
      setSelectedOptions((prev) =>
        prev.filter((o, index) => index !== existingOptionIndex)
      );
    } else {
      // 將選項加入 selectedOptions
      setSelectedOptions((prev) => [...prev, option]);
    }

    const selectedGroupOptions = selectedOptions.filter(
      (o) => o.group === option.group
    );
    const selectedGroupOptionHashtags = selectedGroupOptions.map(
      (o) => o.hashtag
    );
    const selectedBars = bars?.filter((bar) =>
      selectedGroupOptionHashtags.every((hashtag) =>
        bar?.type?.includes(hashtag)
      )
    );
    setBars(selectedBars);
  };

  const handleButtonClick = async () => {
    const selectedHashtags = selectedOptions.map((option) => option.hashtag);
    const selectedBars = bars
      ? bars.filter((bar) =>
          selectedHashtags.every((hashtag) => bar.type.includes(hashtag))
        )
      : [];

    const matchingBars = selectedBars.map((bar) => {
      return {name: bar.name, img: bar.img, id: bar.id};
    });

    if (users === undefined) {
      return <p>Loading...</p>;
    }

    if (matchingBars.length > 0) {
      const userRef = doc(db, "users", userUID);
      await updateDoc(userRef, {
        matchingBars: matchingBars,
      });

      navigate("/recommendation");
    } else {
      alert("No matching Bar!");
    }
  };

  const {userUID} = useContext(AuthContext);

  return (
    <>
      <Wrapper>
        <ImageContainer>
          <Slogan>
            YOUR
            <br />
            HAPPINESS
          </Slogan>
          <MainImg src={main} />
        </ImageContainer>
        <TestTitleSection>
          <TestTitle>Choose your Favorite Type!</TestTitle>
          <DoubleArrow>
            <RxDoubleArrowDown />
          </DoubleArrow>
        </TestTitleSection>

        <TestSection>
          {Object.entries(groups).map(([key, label]) => (
            <SelectItemSection key={key}>
              <SelectTime>{label}</SelectTime>
              {options
                .filter((option) => option.group === key)
                .map((option) => (
                  <SelectItem key={option.hashtag}>
                    <SelectContent>
                      <Checkbox
                        type="checkbox"
                        value={option.text}
                        checked={selectedOptions.some(
                          (o) => o.text === option.text
                        )}
                        onChange={handleOptionChange}
                      />
                      {option.hashtag}
                    </SelectContent>
                  </SelectItem>
                ))}
            </SelectItemSection>
          ))}
        </TestSection>
        <Submit>
          <EventButton onClick={handleButtonClick}>
            <div className="btn">
              <span className="btn__circle"></span>
              <span className="btn__white-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="icon-arrow-right"
                  viewBox="0 0 21 12"
                >
                  <path d="M17.104 5.072l-4.138-4.014L14.056 0l6 5.82-6 5.82-1.09-1.057 4.138-4.014H0V5.072h17.104z"></path>
                </svg>
              </span>
              <span
                className="btn__text"
                style={{fontSize: "40px", marginLeft: "25px"}}
              >
                Go to the Bar Event!
              </span>
            </div>
          </EventButton>
        </Submit>
      </Wrapper>
    </>
  );
};

export default QuestionPage;
