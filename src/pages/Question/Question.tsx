import React, {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components/macro";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {db} from "../../App";
import {collection, getDocs, doc, updateDoc} from "firebase/firestore";
import {AuthContext} from "../../Context/AuthContext";
import main from "./main.png";
import {RxDoubleArrowDown, RxDoubleArrowRight} from "react-icons/rx";

// const LogOutButton = styled.button`
//   width: 150px;
//   height: 30px;
//   border: 1px solid #87c3e1;
//   border-radius: 5px;
//   font-size: 15px;
//   cursor: pointer;
// `;

const Wrapper = styled.div`
  width: 83.5%;
  margin: 0 auto;
  padding-top: 95px;
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
`;

const OuterDiv = styled.div`
  width: 70%;
  height: 400px;
  border: 2px solid white;
  padding: 10px;
  margin: 0 auto;
`;

const InnerDiv = styled.div`
  width: 100%;
  height: 430px;
  border: 2px solid white;
  padding: 10px;
  margin-top: -25px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const SelectItem = styled.div`
  width: 280px;
  text-align: center;
`;

const SelectTime = styled.p`
  font-size: 25px;
  color: #d19b18;
  margin-top: 30px;
`;

const Checkbox = styled.input`
  margin: 10px;
`;

const SelectContent = styled.div`
  width: 150px;
  height: 30px;
  color: #fff;
  margin: 0 auto;
  font-size: 20px;
`;

const Submit = styled.div`
  width: 100%;
  text-align: center;
  padding: 50px;
`;

const SubmitButton = styled.button`
  width: 300px;
  color: #fff;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0);
  border: none;
  font-size: 40px;
`;

const StyledDoubleArrow = styled.button`
  height: 50px;
  color: #fff;
  font-size: 50px;
  background-color: rgba(255, 255, 255, 0);
  border: none;
  text-align: center;
  cursor: pointer;
  justify-content: center;
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
  category: "Liquor Category",
  visual: "Visual",
  relationship: "Relationship",
};

export interface IQuestionProps {}

const QuestionPage: React.FC<IQuestionProps> = (props: IQuestionProps) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [bars, setBars] = useState<IBar[]>([]);
  const [users, setUsers] = useState<IUser[] | undefined>();
  const barsCollectionRef = collection(db, "bars");
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
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

    if (option.group in groups) {
      const existingOption = selectedOptions.find(
        (o) => o.group === option.group
      );

      if (existingOption) {
        if (existingOption.text === option.text) {
          return;
        }

        setSelectedOptions((prev) =>
          prev.filter((o) => o.group !== option.group)
        );
      }
    }

    setSelectedOptions((prev) => [
      ...prev.filter((o) => o.group !== option.group),
      option,
    ]);

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
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  return (
    <>
      {/* <LogOutButton onClick={() => logOut(auth)}>
        Sign out of Firebase
      </LogOutButton> */}
      {/* <button onClick={() => signIn(auth, provider)}>LogIn</button> */}
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
          <OuterDiv>
            <InnerDiv>
              {Object.entries(groups).map(([key, label]) => (
                <SelectItem key={key}>
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
                </SelectItem>
              ))}
            </InnerDiv>
          </OuterDiv>
        </TestSection>

        <Submit>
          <SubmitButton onClick={handleButtonClick}>
            FIND YOUR TYPE
          </SubmitButton>
          <StyledDoubleArrow>
            <RxDoubleArrowRight />
          </StyledDoubleArrow>
        </Submit>
      </Wrapper>
    </>
  );
};

export default QuestionPage;
