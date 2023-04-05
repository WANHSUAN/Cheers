import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {getAuth, signOut} from "firebase/auth";
// import {useNavigate} from "react-router-dom";
import {db} from "../App";
import {collection, getDocs} from "firebase/firestore";

const LogOutButton = styled.button`
  width: 150px;
  height: 30px;
  border: 1px solid #87c3e1;
  border-radius: 5px;
  font-size: 15px;
`;

const Wrapper = styled.div`
  width: 500px;
  height: 500px;
  margin: 50px auto;
  padding: 10px;
  text-align: center;
  border: 1px solid #000;
  border-radius: 5px;
`;

const QuestionForm = styled.form``;

const QuestionTitle = styled.legend`
  font-size: 25px;
`;

const QuestionLabel = styled.label`
  display: flex;
  justify-content: center;
`;

const Checkbox = styled.input``;

const SubmitButton = styled.button``;

const Hashtags = styled.div``;

const HashtagList = styled.ul`
  list-style: none;
`;

const HashtagItem = styled.li``;

const NoMatch = styled.div``;

// interface IBars {
//   id: string;
//   name: string;
//   img: string;
//   type: string;
// }

// export interface IBarsProps {}

// const Bars: React.FC<IBarsProps> = (props: IBarsProps) => {
//   const [bars, setBars] = useState<IBars[] | null>(null);
//   const barsCollectionRef = collection(db, "bars");

//   useEffect(() => {
//     const getBars = async () => {
//       const data = await getDocs(barsCollectionRef);
//       setBars(data.docs.map((doc) => ({...(doc.data() as IBars), id: doc.id})));
//     };

//     getBars();
//   }, []);
//   return (
//     <Wrapper>
//       {bars === null ? <p>Loading...</p> : <p>{bars[0].type[0]}</p>}
//     </Wrapper>
//   );
// };

interface IBar {
  id: string;
  name: string;
  img: string;
  type: string[];
}

interface IOption {
  text: string;
  hashtag: string;
}

export interface IQuestionProps {}

const QuestionPage: React.FC<IQuestionProps> = (props: IQuestionProps) => {
  const auth = getAuth();
  // const navigate = useNavigate();
  const [bars, setBars] = useState<IBar[] | null>(null);
  const barsCollectionRef = collection(db, "bars");

  useEffect(() => {
    const getBars = async () => {
      const data = await getDocs(barsCollectionRef);
      setBars(data.docs.map((doc) => ({...(doc.data() as IBar), id: doc.id})));
    };

    getBars();
  }, []);

  const [options, setOptions] = useState<IOption[]>([
    {text: "Afternoon", hashtag: "afternoon"},
    {text: "Night", hashtag: "night"},
    {text: "Alone", hashtag: "alone"},
    {text: "Together", hashtag: "together"},
    {text: "Classic", hashtag: "classic"},
    {text: "Special", hashtag: "special"},
    {text: "Simple", hashtag: "simple"},
    {text: "Vision", hashtag: "vision"},
    {text: "Couple", hashtag: "couple"},
    {text: "Friend", hashtag: "friend"},
  ]);
  const [selectedOption, setSelectedOption] = useState<IOption[]>([]);
  const [showHashtag, setShowHashtag] = useState<boolean>(false);
  const [matchingBars, setMatchingBars] = useState<IBar[]>([]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const option = options.find((option, index) => option.text === value);

    setSelectedOption((prevSelectedOptions: IOption[]) => {
      if (prevSelectedOptions.includes(option as IOption)) {
        return prevSelectedOptions.filter(
          (selectedOption) => selectedOption !== option
        );
      } else {
        return [...prevSelectedOptions, option as IOption];
      }
    });
    setShowHashtag(false);
  };
  const handleButtonClick = (e: React.FormEvent<HTMLButtonElement>) => {
    const matchingBars = bars
      ? bars.filter((bar) => {
          return selectedOption.some((option) => {
            return bar.type.includes(option.hashtag);
          });
        })
      : [];
    console.log(matchingBars);
    setMatchingBars(matchingBars);
    e.preventDefault();
    setShowHashtag(true);
  };

  return (
    <>
      <LogOutButton onClick={() => signOut(auth)}>
        Sign out of Firebase
      </LogOutButton>
      <Wrapper>
        <QuestionForm>
          <QuestionTitle>Select Your Favorite Bar Category!</QuestionTitle>

          {options.map((option) => (
            <QuestionLabel key={option.text}>
              <Checkbox
                type="checkbox"
                name={option.text}
                value={option.text}
                onChange={handleOptionChange}
                checked={selectedOption.includes(option)}
              />
              {option.text}
            </QuestionLabel>
          ))}

          <SubmitButton onClick={handleButtonClick}>Submit</SubmitButton>

          {showHashtag && (
            <Hashtags>
              {matchingBars.length > 0 ? (
                <HashtagList>
                  {matchingBars.map((bar) => (
                    <HashtagItem key={bar.name}>{bar.name}</HashtagItem>
                  ))}
                </HashtagList>
              ) : (
                <NoMatch>No matching bars found.</NoMatch>
              )}
            </Hashtags>
          )}
        </QuestionForm>
      </Wrapper>
      <div>{bars === null ? <p>Loading...</p> : <p>{bars[0].type}</p>}</div>
    </>
  );
};

export default QuestionPage;
