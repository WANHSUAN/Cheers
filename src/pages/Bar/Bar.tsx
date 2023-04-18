import React, {useState, useEffect, useContext} from "react";
import {useParams} from "react-router-dom";
import styled from "styled-components";
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
import SideMenu from "../../components/SideMenu/SideMenu";
import {AuthContext} from "../../Context/AuthContext";

const Wrapper = styled.div`
  text-align: center;
  width: 800px;
  margin: 0 auto;
`;
const MenuButton = styled.button`
  width: 50px;
  height: 30px;
`;

const BarInfoSection = styled.div`
  background-color: beige;
`;

const BarTitle = styled.h1`
  font-size: 30px;
  padding-top: 10px;
`;

const Like = styled.span`
  font-size: 25px;
  cursor: pointer;
  margin: 10px;
`;

const Collection = styled.span`
  font-size: 25px;
  cursor: pointer;
`;

const BarImg = styled.img`
  width: 350px;
  height: 300px;
  border-radius: 50%;
  padding: 10px;
`;

const BarScore = styled.span``;

const BarAddress = styled.p``;

const BarLink = styled.a`
  width: 10px;
  height: 10px;
  text-decoration: none;
  color: #230498;
`;

const BarOpeningTime = styled.div``;

const BarOpeningDate = styled.p``;

const BarOpeninghours = styled.p``;

const BarTel = styled.p``;

const BarContent = styled.div``;

const BarIntro = styled.h2``;

const BarHashTagSection = styled.div`
  height: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  background-color: beige;
`;

const BarHashtagLink = styled.a`
  text-decoration: none;
  color: #398102;
`;

const BarHashTag = styled.p`
  margin-right: 5px;
`;

const BarIntroText = styled.p``;

const CommentSection = styled.div``;

const CommentTitle = styled.h2``;

const CommentArea = styled.ul`
  border: 1px solid #000;
  padding-left: 0;
`;

const CommentItem = styled.div`
  border: 1px solid #000;
`;

const Score = styled.div`
  display: flex;
  justify-content: center;
`;

const CommentScore = styled.li`
  list-style: none;
  text-align: center;
  padding: 10px;
`;

const Comment = styled.li`
  list-style: none;
`;

const BarRec = styled.div``;

const BarRecTitle = styled.h2``;

const BarRecImg = styled.img`
  width: 400px;
  height: 400px;
  padding-bottom: 10px;
`;

const BarRecName = styled.h2``;

const BarRecConceptTitle = styled.h2``;

const BarRecConcept = styled.p``;

const BarRecGarnishTitle = styled.h2``;

const BarRecGarnish = styled.ul``;

const BarRecGarnishItem = styled.li`
  list-style: none;
`;

const BarRecIngredientsTitle = styled.h2``;

const BarRecIngredients = styled.ul``;

const BarRecIngredientsItem = styled.li`
  list-style: none;
`;

const MemberScoreSection = styled.div``;

const MemberScoreTitle = styled.h2``;

const BarMapTitle = styled.h2``;

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
  score: string;
  barId: string;
}

interface IOpeningTime {
  opening_date: string;
  opening_hours: string;
}

interface IComment {
  comment: string;
  score: string;
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
      <Like onClick={handleHeartButtonClick}>
        {isLike ? "\u2665" : "\u2661"}
      </Like>
      <Collection onClick={handleCollectionButtonClick}>
        {isCollection ? "\u263B" : "\u263A"}
      </Collection>
    </>
  );
}

interface IMenuArray extends Array<IMenu> {}

export interface IMainProps {}

const MainPage: React.FC<IMainProps> = (props: IMainProps) => {
  const [bar, setBar] = useState<IBar>();
  const [showMenu, setShowMenu] = useState(false);
  const {id} = useParams();
  const barCollectionRef = id ? doc(db, "bars", id) : undefined;

  useEffect(() => {
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
          .map((item, index) => parseInt(item.score))
          .reduce((total, score) => total + score, 0) /
          bar.member_comment.length
      )
    ),
  ];

  // bar.score = scoreArray;
  // console.log(bar.score);

  function handleMenuClick() {
    setShowMenu(!showMenu);
  }

  return (
    <>
      <Wrapper>
        <MenuButton onClick={handleMenuClick}>Menu</MenuButton>
        {showMenu && <SideMenu />}
        <BarInfoSection>
          <BarImg src={bar.img[0]} />
          <BarTitle>{bar.name}</BarTitle>
          <CollectionButton
            name={bar.name}
            address={bar.address}
            link={bar.link}
            img={bar.img[1]}
            barId={bar.barId}
            // score={bar.score}
          />
          <BarScore>
            <Score>
              {scoreArray.map((_, i) => (
                <CommentScore key={i}>{"\u2605"}</CommentScore>
              ))}
            </Score>
          </BarScore>
          <BarAddress>地址：{bar.address}</BarAddress>
          <BarLink href={bar.link}>Go to the Website!</BarLink>
          <BarOpeningTime>
            營業時間：
            <BarOpeningDate>{bar.opening_time.opening_date}</BarOpeningDate>
            <BarOpeninghours>{bar.opening_time.opening_hours}</BarOpeninghours>
          </BarOpeningTime>
          <BarTel>聯絡電話：{bar.tel}</BarTel>
        </BarInfoSection>
        <BarContent>
          <BarIntro>店家介紹</BarIntro>
          <BarHashTagSection>
            {Array.isArray(bar.type) &&
              bar.type.map((bar: string, index) => (
                <BarHashtagLink href={"/hashtag"} key={index}>
                  <BarHashTag key={bar}>#{bar}</BarHashTag>
                </BarHashtagLink>
              ))}
          </BarHashTagSection>
          <BarIntroText>{bar.introduction}</BarIntroText>
        </BarContent>
        <CommentSection>
          <CommentTitle>會員評分和留言</CommentTitle>
          <CommentArea>
            {bar.member_comment.map((item, index) => (
              <CommentItem key={index}>
                <Score>
                  {[...Array(item.score)].map((_, i) => (
                    <CommentScore key={i}>{"\u2605"}</CommentScore>
                  ))}
                </Score>
                <Comment>{item.comment}</Comment>
              </CommentItem>
            ))}
          </CommentArea>
        </CommentSection>
        <BarRec>
          <BarRecTitle>店家主推飲品</BarRecTitle>
          <BarRecImg src={bar.menu[0].img} />
          <BarRecName>{bar.menu[0].name}</BarRecName>
          <BarRecConceptTitle>Concept</BarRecConceptTitle>
          <BarRecConcept>{bar.menu[0].concept}</BarRecConcept>
          <BarRecGarnishTitle>Garnish</BarRecGarnishTitle>
          <BarRecGarnish>
            {bar.menu[0].garnish.map((gar: string) => (
              <BarRecGarnishItem key={gar}>{gar}</BarRecGarnishItem>
            ))}
          </BarRecGarnish>
          <BarRecIngredientsTitle>Ingredients</BarRecIngredientsTitle>
          <BarRecIngredients>
            {bar.menu[0].ingredients.map((gar: string) => (
              <BarRecIngredientsItem key={gar}>{gar}</BarRecIngredientsItem>
            ))}
          </BarRecIngredients>
        </BarRec>
        <MemberScoreSection>
          <MemberScoreTitle>您的評分 & 留言</MemberScoreTitle>
          <MemberScore />
        </MemberScoreSection>
        <BarMapTitle>店家位置</BarMapTitle>
        <BarMap />
      </Wrapper>
    </>
  );
};

export default MainPage;
