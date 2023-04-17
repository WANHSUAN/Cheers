import React, {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {db} from "../../App";
import {collection, getDocs, doc, updateDoc} from "firebase/firestore";
import {AuthContext} from "../../Context/AuthContext";

const LogOutButton = styled.button`
  width: 150px;
  height: 30px;
  border: 1px solid #87c3e1;
  border-radius: 5px;
  font-size: 15px;
  cursor: pointer;
`;

const Wrapper = styled.div`
  width: 500px;
  height: 800px;
  margin: 50px auto;
  padding: 10px;
  text-align: center;
  border: 1px solid #000;
  border-radius: 5px;
`;

const QuestionSection = styled.div``;

const QuestionTitle = styled.legend`
  font-size: 25px;
`;

const QuestionFieldset = styled.fieldset``;

const QuestionLabel = styled.label`
  display: flex;
  justify-content: center;
`;

const Checkbox = styled.input``;

const SubmitButton = styled.button``;

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

    // let userId = users[0]?.id;

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

  const {isLogin, user, logOut, signIn, userUID} = useContext(AuthContext);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  return (
    <>
      <LogOutButton onClick={() => logOut(auth)}>
        Sign out of Firebase
      </LogOutButton>
      {/* <button onClick={() => signIn(auth, provider)}>LogIn</button> */}
      <Wrapper>
        <QuestionSection>
          {Object.entries(groups).map(([key, label]) => (
            <QuestionFieldset key={key}>
              <QuestionTitle>{label}</QuestionTitle>
              {options
                .filter((option) => option.group === key)
                .map((option) => (
                  <div key={option.hashtag}>
                    <QuestionLabel>
                      <Checkbox
                        type="checkbox"
                        value={option.text}
                        checked={selectedOptions.some(
                          (o) => o.text === option.text
                        )}
                        onChange={handleOptionChange}
                      />
                      {option.hashtag}
                    </QuestionLabel>
                  </div>
                ))}
            </QuestionFieldset>
          ))}
          <SubmitButton onClick={handleButtonClick}>
            Show Selected Bars
          </SubmitButton>
        </QuestionSection>
      </Wrapper>
    </>
  );
};

export default QuestionPage;
