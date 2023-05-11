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
import {SlCheck} from "react-icons/sl";
import {TiStarFullOutline} from "react-icons/ti";
import {useParams} from "react-router-dom";
import styled, {keyframes} from "styled-components/macro";
import {AuthContext} from "../../Context/AuthContext";
import {db} from "../../utils/firebase";
import BarMap from "../Bar/BarMap";
import "./Bar.css";
import {Star} from "./Star";

const Wrapper = styled.div`
  text-align: center;
  width: 1000px;
  margin: 0 auto;
`;

const BarInfoSection = styled.div`
  padding-top: 120px;
  display: flex;
`;

const Score = styled.div`
  display: flex;
`;

const CommentScore = styled.li`
  list-style: none;
  padding: 3px;
`;

const BarTitle = styled.h1`
  font-size: 50px;
  color: #d19b18;
  padding-bottom: 10px;
`;

const Like = styled.span`
  font-size: 25px;
  cursor: pointer;
  color: #d19b18;
`;

const BarImg = styled.img`
  width: 50%;
  border-radius: 0 280px 280px 0;
  border: 1px solid #ffffff7c;
  border-left: 0;
`;

const BarInfo = styled.div`
  padding-left: 100px;
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
`;

const BarItem = styled.p`
  font-size: 23px;
  padding-top: 15px;
`;

const BarLink = styled.a`
  width: 10px;
  height: 10px;
  font-size: 30px;
  text-decoration: none;
  color: #fff;
`;

const BarContent = styled.div`
  height: 500px;
  margin: 200px 0 300px 0;
`;

const ScrollButton = styled.button`
  width: 80px;
  height: 80px;
  position: fixed;
  bottom: 110px;
  right: 50px;
  z-index: 3;
  border: none;
  font-size: 18px;
  background-color: #fff;
  color: #d19b18;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #d19b18;
    color: #fff;

    transition: ease 0.5s;
  }
`;

const BarIntro = styled.h2`
  color: #d19b18;
  font-size: 40px;
  position: relative;
  display: inline-block;
  line-height: 1;
  margin: 60px 10px;
  letter-spacing: 5px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    width: 40%;
    height: 1px;
    background-color: #d19b18;
  }

  &::before {
    top: 20px;
    right: -100px;
  }

  &::after {
    top: 20px;
    left: -100px;
  }
`;

const BarHashTagSection = styled.div`
  height: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 15px;
  font-size: 25px;
`;

const BarHashtagLink = styled.a`
  text-decoration: none;
  color: #d19b18;
`;

const BarHashTag = styled.p`
  margin-left: 10px;
`;

const BarIntroTextSection = styled.div`
  border: 1px solid #d19b18;
  padding: 50px;
  border-radius: 0 50px 0 50px;
  text-align: left;
`;

const BarText = styled.p`
  width: 90%;
  color: #fff;
  line-height: 30px;
  margin: 0 auto;
  white-space: pre-wrap;
`;

const CommentSection = styled.div`
  width: 1000px;
  height: 500px;
  margin: 300px auto 200px;
  text-align: center;
`;

const CommentTitle = styled.h2`
  color: #fff;
  font-size: 30px;
`;

const CommentContent = styled.div`
  display: flex;
  align-items: center;
  margin: 50px 0;
  padding: 50px;
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
`;

const CommaLeft = styled.div`
  font-size: 30px;
  position: absolute;
  bottom: -6%;
  left: 10%;
`;

const Comment = styled.li`
  list-style: none;
  font-size: 20px;
  margin: 30px;
  width: 720px;
  padding: 50px 70px 0;
  height: 100px;
  line-height: 28px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

const MemberScores = styled.div`
  display: flex;
  justify-content: center;
  font-size: 18px;
  color: #d19b18;
  margin: 80px 10px 10px 10px;
`;

const UserName = styled.p`
  font-size: 20px;
  margin-bottom: 30px;
`;

const Page = styled.p`
  font-size: 15px;
`;

const BarRec = styled.div`
  background-color: #d19b18;
  border-radius: 300px 0 0 0;
  padding: 30px;
`;

const BarRecContentSection = styled.div`
  width: 1000px;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
`;

const BarRecTitle = styled.h2`
  color: #fff;
  font-size: 40px;
  margin: 450px 0 200px;
`;

const BarTitleContent = styled.div``;

const BarRecImg = styled.img`
  width: 400px;
  height: 400px;
  padding-bottom: 10px;
  border-radius: 50%;
  margin-top: -40%;
`;

const BarRecName = styled.div`
  height: 300px;
  color: #fff;
  font-size: 60px;
  display: flex;
  align-items: center;
  margin-top: 50px;
`;

const BarRecContent = styled.div`
  width: 45%;
`;

const BarRecContentTitle = styled.h2`
  color: #fff;
  padding: 30px 0;
  font-size: 30px;
`;

const BarRecContentText = styled.p`
  color: #fff;
  line-height: 30px;
  font-size: 18px;
  margin-bottom: 30px;
`;

const BarRecGarnishItem = styled.li`
  list-style: none;
`;

const BarRecIngredientsItem = styled.li`
  list-style: none;
`;

const MemberScoreSection = styled.div`
  width: 1000px;
  height: 500px;
  margin: 100px auto;
  text-align: center;
`;

const MemberScoreTitle = styled.h2`
  color: #fff;
  font-size: 30px;
  margin: 100px 0;
`;

const BarSection = styled.div`
  width: 1000px;
  margin: 0 auto;
  text-align: center;
`;

const BarMapTitle = styled.h2`
  color: #fff;
  margin: 110px 0 50px 0;
  font-size: 30px;
`;

const ScoreForm = styled.form`
  position: relative;
`;

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

const StarSection = styled.div`
  font-size: 25px;
`;

const StarCollection = styled.div``;

const CommentAlert = styled.div``;

const MainContainer = styled.button`
  display: flex;
  background-color: transparent;
  border: none;
`;

const CommentButton = styled.a`
  position: relative;
  z-index: 0;
  width: 130px;
  height: 40px;
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  color: #ffffffbd;
  letter-spacing: 2px;
  transition: all 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    height: 3px;
    border-radius: 2px;
    background: #ffffffbd;
    transition: all 0.5s ease;
    top: 0;
    left: 54px;
    width: calc(100% - 56px * 2 - 16px);
  }
  &::after {
    content: "";
    position: absolute;
    height: 3px;
    border-radius: 2px;
    background: #ffffffbd;
    transition: all 0.5s ease;
    top: 0;
    right: 54px;
    width: 8px;
  }
`;

const CommentButtonLine = styled.div``;

const CommentButtonText = styled.div``;

const InputTextArea = styled.textarea`
  width: 600px;
  height: 250px;
  border: 3px solid #ffffff7c;
  background-color: #000;
  border-radius: 10px;
  padding: 60px 20px;
  font-size: 20px;
  color: #ffffffc1;

  &:focus {
    outline-color: #d19b18;
  }
`;

const dropInFadeOut = keyframes`
0% {
    opacity: 0;
    visibility: visible;
    transform: translate3d(0, -200%, 0);
  }
  12% {
    transform: translate3d(0, 0, 0);
  }
  20% {
    opacity: 1;
  }
  70% {
    opacity: 1;
    visibility: visible;
    transform: translate3d(0, 0, 0);
  }
  80% {
    opacity: 0;
  }
  100% {
    visibility: hidden;
    transform: translate3d(25%, 0, 0);
  }


`;

const Flash = styled.div`
  display: block;
  position: fixed;
  top: 100px;
  right: 36%;
  width: 550px;
  height: 100px;
  padding: 20px 25px 20px 85px;
  font-size: 18px;
  font-weight: 400;
  color: ${(props) => props.color};
  background-color: #fff;
  border: 2px solid ${(props) => props.color};
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(255, 255, 255, 0.8);
  opacity: 0;
  align-items: center;
  animation: ${dropInFadeOut} 3.5s 0.4s cubic-bezier(0.32, 1.75, 0.65, 0.91);
`;

const FlashAlert = styled.div`
  display: block;
  position: fixed;
  top: 100px;
  right: 36%;
  width: 550px;
  height: 100px;
  padding: 20px 25px 20px 85px;
  font-size: 18px;
  font-weight: 400;
  color: #fba78d;
  background-color: #fff;
  border: 2px solid #fba78d;
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(255, 255, 255, 0.8);
  opacity: 0;
  align-items: center;
  animation: ${dropInFadeOut} 3.5s 0.4s cubic-bezier(0.32, 1.75, 0.65, 0.91);
`;

const FlashIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 1.8em;
  height: 100%;
  padding: 0 0.4em;
  background-color: ${(props) => props.color};
  color: #fff;
  font-size: 36px;
  font-weight: 300;
  transform: translate(0, -50%);
`;

const FlashIconAlert = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 1.8em;
  height: 100%;
  padding: 0 0.4em;
  background-color: #fba78d;
  color: #fff;
  font-size: 36px;
  font-weight: 300;
  transform: translate(0, -50%);
`;

const Icon = styled.div`
  position: absolute;
  top: 55%;
  left: 15%;
  transform: translate(0, -50%);
`;

const CommentText = styled.div`
  display: flex;
  height: 60px;
  padding-left: 5px;
  align-items: center;
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

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating = (props: StarRatingProps) => {
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
    <StarCollection
      onMouseOut={hoverOver}
      onClick={(e) => {
        setIsHoverDisabled(true);

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
    </StarCollection>
  );
};

const MemberScore = (props: {getBar: () => Promise<void>}) => {
  const {id} = useParams();
  const {user} = useContext(AuthContext);
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [ratings, setRatings] = useState<number>(0);
  const [showFlash, setShowFlash] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [key, setKey] = useState(0);

  const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    if (!inputValue || !ratings) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3500);
      return;
    }
    const commentRef = doc(db, `bars/${id}`);
    await updateDoc(commentRef, {
      memberComment: arrayUnion({
        userName: user.name,
        comment: inputValue,
        score: ratings,
      }),
    });
    setMessages([`${user.name}: ${inputValue}`, ...messages]);
    setInputValue("");
    setRatings(0);
    setKey(key + 1);

    props.getBar();
    setShowFlash(true);
    setTimeout(() => {
      setShowFlash(false);
    }, 3500);
  };

  return (
    <ScoreForm>
      <MemberImg src={user.userImg} />
      <InputTextArea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        maxLength={100}
        placeholder="Leave a message..."
      ></InputTextArea>
      <SubmitSection>
        <StarSection>
          <StarRating
            key={key}
            rating={ratings}
            onRatingChange={(rating) => setRatings(rating)}
          />
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
            <Flash color="#d19b18">
              <FlashIcon color="#d19b18">
                <Icon>
                  <SlCheck />
                </Icon>
              </FlashIcon>
              <CommentText>
                Your comment was successfully published!
              </CommentText>
            </Flash>
          )}
          {showAlert && (
            <Flash color="#fba78d">
              <FlashIcon color="#fba78d">
                <Icon>
                  <SlCheck />
                </Icon>
              </FlashIcon>
              <CommentText>Please fill out the complete content!</CommentText>
            </Flash>
          )}
        </div>
      </SubmitSection>
    </ScoreForm>
  );
};

const CollectionButton = (name: any) => {
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
        <Flash>
          <FlashIcon>
            <Icon>
              <SlCheck />
            </Icon>
          </FlashIcon>
          <CommentText>Add this bar to Your Page!</CommentText>
        </Flash>
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

  console.log(bar?.memberComment);

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

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
            address={bar.address}
            link={bar.link}
            img={bar.img[1]}
            barId={bar.barId}
            score={scoreArray}
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
              <BarLink href={bar.link}>
                <FiExternalLink />
              </BarLink>
            </BarItem>
          </BarItemSection>
        </BarInfo>
      </BarInfoSection>
      <Wrapper>
        {showButton && (
          <ScrollButton onClick={handleScrollTop}>Scroll To Top</ScrollButton>
        )}
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
            style={isFirstComment ? {cursor: "not-allowed"} : {}}
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
            style={isLastComment ? {cursor: "not-allowed"} : {}}
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
