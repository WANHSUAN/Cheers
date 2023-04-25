import React, {useState, useEffect, useContext} from "react";
import {useParams} from "react-router-dom";
import styled from "styled-components/macro";
import {db} from "../../App";
import {
  collection,
  getDoc,
  getDocs,
  deleteDoc,
  addDoc,
  doc,
  where,
  query,
} from "firebase/firestore";
import MemberScore from "./MemberScore";
import BarMap from "./BarMap";
import {AuthContext} from "../../Context/AuthContext";
import {BsBookmarkFill, BsBookmark} from "react-icons/bs";
import {BsSuitHeartFill, BsSuitHeart} from "react-icons/bs";
import {TiStarFullOutline} from "react-icons/ti";
import {FiExternalLink} from "react-icons/fi";
import {MdArrowBackIosNew, MdArrowForwardIos} from "react-icons/md";

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
  margin: 15px;
  color: #d19b18;
`;

const Collection = styled.span`
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
  margin: 130px 0;
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

  /* white-space: pre-wrap;

  &:after {
    content: "";
    display: block;
    margin-top: 0.5em; // 设置上边距为 0.5em，可根据需要自行调整
  } */
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
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #fff;
  border-radius: 5px;
  margin-top: 50px;
  padding: 50px;
`;

// const LeftArrow = styled.button`
//   font-size: 30px;
//   color: #fff;
//   background-color: rgba(255, 255, 255, 0);
//   border: none;
//   height: 473px;
//   padding: 0 10px;
//   display: flex;
//   align-items: center;
//   cursor: pointer;
// `;

// const RightArrow = styled.button`
//   font-size: 30px;
//   color: #fff;
//   background-color: rgba(255, 255, 255, 0);
//   border: none;
//   height: 473px;
//   padding: 0 10px;
//   display: flex;
//   align-items: center;
//   cursor: pointer;
// `;

const CommentBox = styled.div`
  display: flex;
  overflow: auto;
  width: 1000px;
`;

const CommentItem = styled.div`
  width: 1000px;
  border: 1px solid #000;
  color: #fff;
`;

const Comment = styled.li`
  list-style: none;
  font-size: 20px;
  margin: 30px;
`;

const MemberScores = styled.div`
  display: flex;
  justify-content: center;
  font-size: 10px;
  color: #d19b18;
  margin: 10px;
`;

const UserName = styled.p`
  font-size: 15px;
  margin-bottom: 30px;
`;

const Page = styled.p`
  font-size: 10px;
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
  margin-bottom: 350px;
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

const BarRecContentItem = styled.div``;

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
  margin: 0 auto;
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
  member_comment: ICommentArray;
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

function CollectionButton(name: any) {
  const {id} = useParams();
  const {userUID} = useContext(AuthContext);

  const likeStorageKey = `isLike_${id}`;
  const collectionStorageKey = `isCollection_${id}`;

  const [isLike, setIsLike] = useState(
    JSON.parse(localStorage.getItem(likeStorageKey) || "false")
  );

  const [isCollection, setIsCollection] = useState(
    JSON.parse(localStorage.getItem(collectionStorageKey) || "false")
  );

  useEffect(() => {
    const storedIsLike = localStorage.getItem(likeStorageKey);
    if (storedIsLike) {
      setIsLike(JSON.parse(storedIsLike));
    }
    const storedIsCollection = localStorage.getItem(collectionStorageKey);
    if (storedIsCollection) {
      setIsCollection(JSON.parse(storedIsCollection));
    }
  }, []);

  const handleHeartButtonClick = async () => {
    const newIsLike = !isLike;

    localStorage.setItem(likeStorageKey, JSON.stringify(newIsLike));
    setIsLike(newIsLike);
    try {
      if (newIsLike) {
        alert("已收藏！");
        const userRef = doc(db, "users", userUID);
        await addDoc(collection(userRef, "likes"), {
          name: name.name,
          address: name.address,
          link: name.link,
          img: name.img,
          barId: name.barId,
          // score: name.score,
        });
      } else {
        alert("我沒興趣了，取消收藏！");
        const likesRef = collection(db, "users", userUID, "likes");
        const q = query(likesRef, where("barId", "==", name.barId));

        let likeDocId;
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          likeDocId = doc.id;
        });

        if (likeDocId) {
          const likeRef = doc(db, "users", userUID, "likes", likeDocId);
          await deleteDoc(likeRef);
        }
      }
    } catch (error) {
      console.error("Error adding bar data to Firestore:", error);
    }
  };

  const handleCollectionButtonClick = async () => {
    const newIsCollection = !isCollection;

    localStorage.setItem(collectionStorageKey, JSON.stringify(newIsCollection));
    setIsCollection(newIsCollection);
    try {
      if (newIsCollection) {
        alert("已去過！");
        const userRef = doc(db, "users", userUID);
        await addDoc(collection(userRef, "collections"), {
          name: name.name,
          address: name.address,
          link: name.link,
          img: name.img,
          barId: name.barId,
          // score: name.score,
        });
      } else {
        alert("其實沒去過，我要取消！！");

        const collectionsRef = collection(db, "users", userUID, "collections");
        const q = query(collectionsRef, where("barId", "==", name.barId));

        let collectionDocId;
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          collectionDocId = doc.id;
        });

        if (collectionDocId) {
          const collectionsRef = doc(
            db,
            "users",
            userUID,
            "collections",
            collectionDocId
          );
          await deleteDoc(collectionsRef);
        }
      }
    } catch (error) {
      console.error("Error adding bar data to Firestore:", error);
    }
  };

  return (
    <>
      <Collection onClick={handleCollectionButtonClick}>
        {isCollection ? <BsBookmarkFill /> : <BsBookmark />}
      </Collection>
      <Like onClick={handleHeartButtonClick}>
        {isLike ? <BsSuitHeartFill /> : <BsSuitHeart />}
      </Like>
    </>
  );
}

interface IMenuArray extends Array<IMenu> {}

export interface IMainProps {}

const MainPage: React.FC<IMainProps> = (props: IMainProps) => {
  const [bar, setBar] = useState<IBar>();
  const {id} = useParams();
  const [formattedText, setFormattedText] = useState("");

  const barCollectionRef = id ? doc(db, "bars", id) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    async function getBar() {
      if (barCollectionRef) {
        const barSnapshot = await getDoc(barCollectionRef);
        setBar(barSnapshot.data() as any);
      }
    }

    getBar();
  }, [id]);

  if (bar === undefined) {
    return <p>Loading...</p>;
  }

  const scoreArray = [
    ...Array(
      Math.round(
        bar.member_comment
          .map((item, index) => item.score)
          .reduce((total, score) => total + score, 0) /
          bar.member_comment.length
      )
    ),
  ];

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
            <BarText>{formattedText}</BarText>
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
            <BarRecContentItem>
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
            </BarRecContentItem>
          </BarRecContent>
        </BarRecContentSection>
      </BarRec>
      <CommentSection>
        <CommentTitle>WHAT THEY'RE SAYING</CommentTitle>
        <CommentContent>
          {/* <LeftArrow>
              <MdArrowBackIosNew />
            </LeftArrow> */}
          <CommentBox>
            {bar.member_comment.map((item, index) => (
              <CommentItem key={index}>
                <Comment>{item.comment}</Comment>
                <MemberScores>
                  {[...Array(item.score)].map((_, i) => (
                    <CommentScore key={i}>
                      <TiStarFullOutline />
                    </CommentScore>
                  ))}
                </MemberScores>
                <UserName>{item.userName}</UserName>
                <Page>1 / 1</Page>
              </CommentItem>
            ))}
          </CommentBox>
          {/* <RightArrow>
              <MdArrowForwardIos />
            </RightArrow> */}
        </CommentContent>
      </CommentSection>
      <MemberScoreSection>
        <MemberScoreTitle>YOUR COMMENT</MemberScoreTitle>
        <MemberScore />
      </MemberScoreSection>
      <BarSection>
        <BarMapTitle>BAR'S LOCATION</BarMapTitle>
        <BarMap />
      </BarSection>
    </>
  );
};

export default MainPage;
