import {
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, {MouseEventHandler, useContext, useEffect, useState} from "react";
import {BsSuitHeart, BsSuitHeartFill} from "react-icons/bs";
import {FaQuoteLeft, FaQuoteRight} from "react-icons/fa";
import {FiExternalLink} from "react-icons/fi";
import {TiStarFullOutline} from "react-icons/ti";
import {useParams} from "react-router-dom";
import styled from "styled-components/macro";
import {AuthContext} from "../../Context/AuthContext";
import {Alert, CommentText} from "../../components/Alert/Alert";
import Scroll from "../../components/Scroll/Scroll";
import {db} from "../../utils/firebase";
import BarMap from "../Bar/BarMap";
import "./Bar.css";
import {Star} from "./Star";

const Wrapper = styled.div`
  text-align: center;
  max-width: 1000px;
  width: 80%;
  margin: 0 auto;
`;

const BarInfoSection = styled.div`
  padding-top: 120px;
  display: flex;

  @media (max-width: 640px) {
    padding-top: 60px;
    flex-direction: column;
    text-align: center;
  }
`;

const Score = styled.div`
  display: flex;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const CommentScore = styled.li`
  list-style: none;
  padding: 3px;
`;

const BarTitle = styled.h1`
  font-size: 50px;
  color: #d19b18;
  padding: 20px 0;

  @media (max-width: 1024px) {
    font-size: 40px;
  }
`;

const Like = styled.span`
  font-size: 25px;
  cursor: pointer;
  color: #d19b18;

  @media (max-width: 1024px) {
    font-size: 20px;
  }
`;

const BarImg = styled.img`
  width: 50%;
  border-radius: 0 280px 280px 0;
  border: 1px solid #ffffff7c;
  border-left: 0;

  @media (max-width: 640px) {
    border: none;
    width: 100%;
    border-radius: 0;
  }
`;

const BarInfo = styled.div`
  padding-left: 100px;

  @media (max-width: 640px) {
    padding-left: 0;
    padding-top: 50px;
  }
`;

const BarScore = styled.span`
  color: #d19b18;
`;

const BarItemSection = styled.div`
  color: #fff;
`;

const BarItemTitle = styled.p`
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 10px;
  font-size: 20px;
  padding-top: 20px;

  @media (max-width: 1024px) {
    font-size: 15px;
  }
`;

const BarItem = styled.p`
  font-size: 23px;
  padding-top: 15px;

  @media (max-width: 1024px) {
    font-size: 18px;
  }
`;

const BarLink = styled.a`
  width: 10px;
  height: 10px;
  font-size: 30px;
  text-decoration: none;
  color: #fff;

  @media (max-width: 1024px) {
    font-size: 20px;
  }
`;

const BarContent = styled.div`
  height: 500px;
  margin: 200px 0;
`;

const BarIntro = styled.h2`
  color: #d19b18;
  font-size: 40px;
  position: relative;
  display: inline-block;
  line-height: 1;
  margin: 60px 10px;
  letter-spacing: 5px;

  @media (max-width: 1024px) {
    font-size: 30px;
  }

  @media (max-width: 768px) {
    font-size: 20px;
    margin: 40px 10px;
    padding: 10px 0;
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    width: 40%;
    height: 1px;
    background-color: #d19b18;

    @media (max-width: 414px) {
      width: 30%;
    }
  }

  &::before {
    top: 20px;
    right: -100px;

    @media (max-width: 414px) {
      right: -81px;
    }
  }

  &::after {
    top: 20px;
    left: -100px;

    @media (max-width: 414px) {
      left: -81px;
    }
  }
`;

const BarHashTagSection = styled.div`
  height: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 15px;
  font-size: 25px;

  @media (max-width: 1024px) {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    font-size: 15px;
  }

  @media (max-width: 414px) {
    justify-content: left;
  }
`;

const BarHashtagLink = styled.a`
  text-decoration: none;
  color: #d19b18;
`;

const BarHashTag = styled.p`
  margin-left: 10px;
`;

const BarIntroTextSection = styled.div`
  height: 350px;
  border: 1px solid #d19b18;
  padding: 50px;
  border-radius: 0 50px 0 50px;
  text-align: left;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const BarText = styled.p`
  width: 90%;
  color: #fff;
  line-height: 30px;
  font-size: 18px;
  margin: 0 auto;
  white-space: pre-wrap;

  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 25px;
  }
`;

const CommentSection = styled.div`
  max-width: 1000px;
  width: 80%;
  height: 500px;
  margin: 300px auto 200px;
  text-align: center;

  @media (max-width: 414px) {
    margin: 200px auto;
  }
`;

const CommentTitle = styled.h2`
  color: #fff;
  font-size: 30px;

  @media (max-width: 1024px) {
    font-size: 25px;
  }

  @media (max-width: 800px) {
    font-size: 20px;
  }
`;

const CommentContent = styled.div`
  display: flex;
  align-items: center;
  margin: 50px 0;
  padding: 50px;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const LeftArrow = styled.a`
  width: 30px;
  height: 30px;
  margin-top: 35px;
  background: transparent;
  border-top: 10px solid white;
  border-right: 10px solid white;
  box-shadow: 0 0 0 lightgray;
  transition: all 200ms ease;
  transform: translate3d(0, -50%, 0) rotate(-135deg);

  @media (max-width: 1024px) {
    width: 25px;
    height: 25px;
  }

  &:hover {
    border-color: orange;
    box-shadow: 5px -5px 0 white;
    cursor: pointer;
  }

  &:after {
    content: "";
    transform: translate(-40%, -60%) rotate(45deg);
    width: 200%;
    height: 200%;
  }
`;

const RightArrow = styled.a`
  width: 30px;
  height: 30px;
  margin-top: 50px;
  background: transparent;
  border-top: 10px solid white;
  border-right: 10px solid white;
  box-shadow: 0 0 0 lightgray;
  transition: all 200ms ease;
  transform: translate3d(0, -50%, 0) rotate(45deg);

  @media (max-width: 1024px) {
    width: 25px;
    height: 25px;
  }

  &:hover {
    border-color: orange;
    box-shadow: 5px -5px 0 white;
    cursor: pointer;
  }

  &:after {
    content: "";
    transform: translate(-40%, -60%) rotate(45deg);
    width: 200%;
    height: 200%;
  }
`;

const CommentBox = styled.div`
  height: 400px;
  display: flex;
  align-items: center;
`;

const CommentItem = styled.div`
  max-width: 1000px;
  width: 100%;
  height: 350px;
  color: #fff;
  flex-direction: column;
  margin: 10px;
  border-radius: 50px;
  text-align: center;
  border-top: 1px solid #ffffff7c;
  border-bottom: 1px solid #ffffff7c;
  position: relative;
  box-shadow: 1px 1px 8px #ffffff7c;
`;

const CommaRight = styled.div`
  font-size: 30px;
  position: absolute;
  top: -4%;
  right: 10%;

  @media (max-width: 414px) {
    font-size: 15px;
    top: -2%;
  }
`;

const CommaLeft = styled.div`
  font-size: 30px;
  position: absolute;
  bottom: -6%;
  left: 10%;

  @media (max-width: 414px) {
    font-size: 15px;
    bottom: -3%;
  }
`;

const Comment = styled.li`
  list-style: none;
  font-size: 20px;
  margin: 20px 0;
  max-width: 850px;
  width: 100%;
  padding: 50px 70px 0;
  height: 100px;
  line-height: 28px;
  white-space: pre-wrap;
  overflow-wrap: break-word;

  @media (max-width: 1280px) {
    font-size: 18px;
  }

  @media (max-width: 1024px) {
    font-size: 15px;
  }

  @media (max-width: 768px) {
    height: 200px;
    line-height: 22px;
    overflow-y: auto;

    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  @media (max-width: 414px) {
    padding: 30px 20px;
  }
`;

const MemberScores = styled.div`
  display: flex;
  justify-content: center;
  font-size: 18px;
  color: #d19b18;
  margin: 100px 10px 10px;

  @media (max-width: 1024px) {
    font-size: 13px;
    margin: 140px 10px 10px;
  }

  @media (max-width: 768px) {
    margin: 10px 10px 10px;
  }

  @media (max-width: 414px) {
    margin: 10px 10px 5px;
  }
`;

const UserName = styled.p`
  font-size: 20px;
  margin-bottom: 10px;

  @media (max-width: 1024px) {
    font-size: 15px;
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }

  @media (max-width: 414px) {
    margin-bottom: 10px;
  }
`;

const Page = styled.p`
  font-size: 15px;

  @media (max-width: 1024px) {
    font-size: 12px;
  }
`;

const BarRec = styled.div`
  background-color: #d19b18;
  border-radius: 300px 0 0 0;
  padding: 30px;

  @media (max-width: 768px) {
    border-radius: 350px 350px 0 0;
    padding: 0;
  }
`;

const BarRecContentSection = styled.div`
  max-width: 1000px;
  width: 80%;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const BarRecTitle = styled.h2`
  color: #fff;
  font-size: 40px;
  margin: 0 0 200px;

  @media (max-width: 1024px) {
    font-size: 30px;
  }

  @media (max-width: 800px) {
    font-size: 20px;
  }
`;

const BarTitleContent = styled.div`
  text-align: center;
`;

const BarRecImg = styled.img`
  width: 400px;
  height: 400px;
  padding-bottom: 10px;
  border-radius: 50%;
  margin-top: -40%;

  @media (max-width: 1024px) {
    width: 300px;
    height: 300px;
    margin-left: 6%;
  }

  @media (max-width: 800px) {
    margin-top: -25%;
    margin-left: 0;
  }

  @media (max-width: 414px) {
    width: 200px;
    height: 200px;
  }
`;

const BarRecName = styled.div`
  height: 300px;
  color: #fff;
  font-size: 60px;
  align-items: center;
  margin-top: 150px;

  @media (max-width: 1024px) {
    font-size: 45px;
    margin-left: 6%;
  }

  @media (max-width: 800px) {
    height: 100px;
    font-size: 35px;
    margin-top: 80px;
    margin-left: 0;
  }
`;

const BarRecContent = styled.div`
  width: 45%;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const BarRecContentTitle = styled.h2`
  color: #fff;
  padding: 30px 0;
  font-size: 30px;

  @media (max-width: 1024px) {
    font-size: 25px;
  }
`;

const BarRecContentText = styled.p`
  color: #fff;
  line-height: 30px;
  font-size: 18px;
  margin-bottom: 30px;

  @media (max-width: 1024px) {
    font-size: 15px;
  }

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const BarRecGarnishItem = styled.li`
  list-style: none;
`;

const BarRecIngredientsItem = styled.li`
  list-style: none;
`;

const MemberScoreSection = styled.div`
  max-width: 1000px;
  width: 80%;
  height: 500px;
  margin: 100px auto;
  text-align: center;
`;

const MemberScoreTitle = styled.h2`
  color: #fff;
  font-size: 30px;
  margin: 100px 0;

  @media (max-width: 1024px) {
    font-size: 25px;
  }

  @media (max-width: 800px) {
    font-size: 20px;
  }
`;

const BarSection = styled.div`
  max-width: 1000px;
  width: 80%;
  margin: 0 auto;
  text-align: center;
`;

const BarMapTitle = styled.h2`
  color: #fff;
  margin: 110px 0 50px 0;
  font-size: 30px;

  @media (max-width: 1024px) {
    font-size: 25px;
  }

  @media (max-width: 800px) {
    font-size: 20px;
  }
`;

const ScoreForm = styled.form`
  position: relative;
`;

const SubmitSection = styled.div`
  max-width: 600px;
  width: 80%;
  margin: 15px auto;
  display: flex;
  justify-content: space-between;
`;

const StarSection = styled.div`
  font-size: 25px;
  padding-top: 5px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const StarCollection = styled.div``;

const InputTextArea = styled.textarea`
  max-width: 600px;
  width: 80%;
  height: 250px;
  border: 3px solid #ffffff7c;
  background-color: #000;
  border-radius: 10px;
  padding: 60px 20px;
  font-size: 20px;
  color: #ffffffc1;

  @media (max-width: 414px) {
    padding: 30px;
  }

  &:focus {
    outline-color: #d19b18;
  }
`;
interface IBar {
  id: string;
  name: string;
  img: string;
  address: string;
  link: string;
  opening_time: IOpeningTime;
  tel: string;
  introduction: string;
  type: string;
  memberComment: ICommentArray;
  menu: IMenuArray;
  score: number;
  barId: string;
}

interface IOpeningTime {
  opening_date: string;
  opening_hours: string;
}

interface IComment {
  userName: string;
  comment: string;
  score: number;
}

interface ICommentArray extends Array<IComment> {}

interface IMenu {
  img: string;
  name: string;
  concept: string;
  garnish: string[];
  ingredients: string[];
}

interface IStarRatingProps {
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
}

export const StarRating = (props: IStarRatingProps) => {
  const [selection, setSelection] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const hoverOver = (index: number) => {
    setSelection((prev) => {
      const newSelection = [...prev];
      const newNewSelection = newSelection.map((select, q) => {
        if (q <= index) {
          select = true;
        }
        return select;
      });
      return newNewSelection;
    });
  };
  const hoverOut = () => {
    setSelection((prev) => {
      const newSelection = [...prev];
      newSelection.fill(false);
      return newSelection;
    });
  };

  return (
    <StarCollection>
      {Array.from({length: 5}, (_, i) => (
        <Star
          onMouseOver={() => hoverOver(i)}
          onMouseOut={hoverOut}
          key={`star_${i + 1} `}
          marked={props.rating > 0 ? props.rating >= i + 1 : selection[i]}
          onClick={() => {
            props.setRating(i + 1);
          }}
        />
      ))}
    </StarCollection>
  );
};

const MemberScore = (props: {getBar: () => Promise<void>}) => {
  const {id} = useParams();
  const {user} = useContext(AuthContext);
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [showFlash, setShowFlash] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [key, setKey] = useState(0);
  const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    if (!inputValue || !rating) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3500);
      return;
    } else if (inputValue.length < 30) {
      alert("請輸入至少 30 個字");
      return;
    }
    const commentRef = doc(db, `bars/${id}`);
    await updateDoc(commentRef, {
      memberComment: arrayUnion({
        userName: user.name,
        comment: inputValue,
        score: rating,
      }),
    });
    setMessages([`${user.name}: ${inputValue}`, ...messages]);
    setInputValue("");
    setRating(0);
    setKey(key + 1);

    props.getBar();
    setShowFlash(true);
    setTimeout(() => {
      setShowFlash(false);
    }, 3500);
  };

  return (
    <ScoreForm>
      <InputTextArea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        maxLength={100}
        placeholder="Leave a message..."
      ></InputTextArea>
      <SubmitSection>
        <StarSection>
          <StarRating key={key} rating={rating} setRating={setRating} />
        </StarSection>
        <div>
          <button className="mainContainer" type="submit" onClick={handleClick}>
            <a href="#" className="commentButton">
              <div className="commentButton__line"></div>
              <div className="commentButton__line"></div>
              <span className="commentButton__text">Confirm</span>
            </a>
          </button>
          {showFlash && (
            <Alert color="#d19b18">
              <CommentText>
                Your comment was successfully published!
              </CommentText>
            </Alert>
          )}
          {showAlert && (
            <Alert color="#fba78d">
              <CommentText>Please fill out the complete content!</CommentText>
            </Alert>
          )}
        </div>
      </SubmitSection>
    </ScoreForm>
  );
};

const CollectionButton = (name: {barId: string; img: string; name: string}) => {
  const {userUID} = useContext(AuthContext);
  const [isLike, setIsLike] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const userRef = doc(db, "users", userUID);
        const likeDocRef = doc(userRef, "likes", name.barId);
        const likeDoc = await getDoc(likeDocRef);
        if (likeDoc.exists()) {
          setIsLike(likeDoc.data().isLike);
        }
      } catch (error) {
        console.error("Error getting like data from Firestore:", error);
      }
    };

    fetchLikeStatus();
  }, []);

  const handleHeartButtonClick = async () => {
    const newIsLike = !isLike;
    setIsLike(newIsLike);

    try {
      const userRef = doc(db, "users", userUID);
      const likeDocRef = doc(userRef, "likes", name.barId);

      if (newIsLike) {
        setShowFlash(true);
        await setDoc(likeDocRef, {
          isLike: true,
          barImg: name.img,
          barName: name.name,
        });
      } else {
        setShowFlash(false);
        await deleteDoc(likeDocRef);
      }
    } catch (error) {
      console.error("Error adding bar data to Firestore:", error);
    }
  };

  return (
    <>
      {showFlash && (
        <Alert color="#d19b18">
          <CommentText>Add this bar to Your Page!</CommentText>
        </Alert>
      )}
      <Like onClick={handleHeartButtonClick}>
        {isLike ? <BsSuitHeartFill /> : <BsSuitHeart />}
      </Like>
    </>
  );
};

interface IMenuArray extends Array<IMenu> {}

export interface IMainProps {}

const MainPage: React.FC<IMainProps> = (props: IMainProps) => {
  const [bar, setBar] = useState<IBar>();
  const {id} = useParams();
  const [showButton, setShowButton] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const WINDOW_HEIGHT = 500;
  const barCollectionRef = id && doc(db, "bars", id);

  const getBar = async () => {
    if (barCollectionRef) {
      const barSnapshot = await getDoc(barCollectionRef);
      const barData = barSnapshot.data() as IBar | undefined;
      if (barData) {
        setBar(barData);
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    getBar();

    const handleScroll = () => {
      if (window.scrollY > WINDOW_HEIGHT) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [id]);

  if (bar === undefined) {
    return <p>Loading...</p>;
  }

  const scoreArray = [
    ...Array(
      Math.round(
        bar.memberComment
          .map((item, index) => item.score)
          .reduce((total, score) => total + score, 0) / bar.memberComment.length
      )
    ),
  ];

  const introductionWithLineBreaks = bar.introduction.replace(/。/g, "。\n");

  const goToPrevComment = () => {
    setCurrentIdx(currentIdx > 0 ? currentIdx - 1 : 0);
  };

  const goToNextComment = () => {
    setCurrentIdx(
      currentIdx < bar.memberComment.length - 1
        ? currentIdx + 1
        : bar.memberComment.length - 1
    );
  };

  const isFirstComment = currentIdx === 0;
  const isLastComment = currentIdx === bar.memberComment.length - 1;

  return (
    <>
      <BarInfoSection>
        <BarImg src={bar.img[2]} />
        <BarInfo>
          <BarScore>
            <Score>
              {scoreArray.map((_, i) => (
                <CommentScore key={i}>
                  <TiStarFullOutline />
                </CommentScore>
              ))}
            </Score>
          </BarScore>
          <BarTitle>{bar.name}</BarTitle>
          <CollectionButton
            name={bar.name}
            img={bar.img[1]}
            barId={bar.barId}
          />
          <BarItemSection>
            <BarItemTitle>ADDRESS</BarItemTitle>
            <BarItem>{bar.address}</BarItem>
            <BarItemTitle>OPENING TIME</BarItemTitle>
            <BarItem>
              {bar.opening_time.opening_date} {bar.opening_time.opening_hours}
            </BarItem>
            <BarItemTitle>TEL</BarItemTitle>
            <BarItem>{bar.tel}</BarItem>
            <BarItemTitle>WEBSITE</BarItemTitle>
            <BarItem>
              <BarLink href={bar.link} target="_blank">
                <FiExternalLink />
              </BarLink>
            </BarItem>
          </BarItemSection>
        </BarInfo>
      </BarInfoSection>
      <Wrapper>
        {showButton && <Scroll />}
        <BarContent>
          <BarIntro>ABOUT US</BarIntro>
          <BarHashTagSection>
            {Array.isArray(bar.type) &&
              bar.type.map((bar: string, index) => (
                <BarHashtagLink href={"/hashtag"} key={index}>
                  <BarHashTag key={bar}>#{bar}</BarHashTag>
                </BarHashtagLink>
              ))}
          </BarHashTagSection>
          <BarIntroTextSection>
            <BarText>{introductionWithLineBreaks}</BarText>
          </BarIntroTextSection>
        </BarContent>
        <BarRecTitle>SPECIAL MENU</BarRecTitle>
      </Wrapper>
      <BarRec>
        <BarRecContentSection>
          <BarTitleContent>
            <BarRecImg src={bar.menu[0].img} />
            <BarRecName>{bar.menu[0].name}</BarRecName>
          </BarTitleContent>
          <BarRecContent>
            <BarRecContentTitle>Concept</BarRecContentTitle>
            <BarRecContentText>{bar.menu[0].concept}</BarRecContentText>
            <BarRecContentTitle>Garnish</BarRecContentTitle>
            <BarRecContentText>
              {bar.menu[0].garnish.map((gar: string) => (
                <BarRecGarnishItem key={gar}>{gar}</BarRecGarnishItem>
              ))}
            </BarRecContentText>
            <BarRecContentTitle>Ingredients</BarRecContentTitle>
            <BarRecContentText>
              {bar.menu[0].ingredients.map((gar: string) => (
                <BarRecIngredientsItem key={gar}>{gar}</BarRecIngredientsItem>
              ))}
            </BarRecContentText>
          </BarRecContent>
        </BarRecContentSection>
      </BarRec>
      <CommentSection>
        <CommentTitle>WHAT THEY'RE SAYING</CommentTitle>
        <CommentContent>
          <LeftArrow
            onClick={isFirstComment ? undefined : goToPrevComment}
            style={isFirstComment ? {visibility: "hidden"} : {}}
          />
          <CommentBox>
            <CommentItem key={currentIdx}>
              <CommaRight>
                <FaQuoteRight />
              </CommaRight>
              <Comment>{bar.memberComment[currentIdx].comment}</Comment>
              <MemberScores>
                {[...Array(bar.memberComment[currentIdx].score)].map((_, i) => (
                  <CommentScore key={i}>
                    <TiStarFullOutline />
                  </CommentScore>
                ))}
              </MemberScores>
              <UserName>{bar.memberComment[currentIdx].userName}</UserName>
              <Page>{`${currentIdx + 1} / ${bar.memberComment.length}`}</Page>
              <CommaLeft>
                <FaQuoteLeft />
              </CommaLeft>
            </CommentItem>
          </CommentBox>

          <RightArrow
            onClick={isLastComment ? undefined : goToNextComment}
            style={isLastComment ? {visibility: "hidden"} : {}}
          />
        </CommentContent>
      </CommentSection>
      <MemberScoreSection>
        <MemberScoreTitle>YOUR COMMENT</MemberScoreTitle>
        <MemberScore getBar={getBar} />
      </MemberScoreSection>
      <BarSection>
        <BarMapTitle>BAR'S LOCATION</BarMapTitle>
        <BarMap />
      </BarSection>
    </>
  );
};

export default MainPage;
