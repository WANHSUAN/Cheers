import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {db} from "../../App";
import {collection, getDocs, addDoc, doc, deleteDoc} from "firebase/firestore";
import MemberScore from "./MemberScore";
// import BarMap from "./BarMap";

const Wrapper = styled.div`
  text-align: center;
  width: 800px;
  margin: 0 auto;
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

function CollectionButton(name: any, address: any, link: any) {
  const [isLike, setIsLike] = useState(
    JSON.parse(localStorage.getItem("isLike") || "false")
  );
  const [isCollection, setIsCollection] = useState(
    JSON.parse(localStorage.getItem("isCollection") || "false")
  );

  useEffect(() => {
    const storedIsLike = localStorage.getItem("isLike");
    const storedIsCollection = localStorage.getItem("isCollection");
    if (storedIsLike && storedIsCollection) {
      setIsLike(JSON.parse(storedIsLike));
      setIsCollection(JSON.parse(storedIsCollection));
    }
  }, []);

  const handleHeartButtonClick = async () => {
    const newIsLike = !isLike;
    localStorage.setItem("isLike", JSON.stringify(newIsLike));
    setIsLike(newIsLike);
    try {
      if (newIsLike) {
        alert("已收藏！");
        await addDoc(collection(db, "likes"), {
          name: name.name,
          address: name.address,
          link: name.link,
        });
        console.log("Likes data has been added to Firestore");
      } else {
        alert("我沒興趣了，取消收藏！");

        const likesRef = collection(db, "likes");
        const likesSnapshot = await getDocs(likesRef);

        let likeDocId;
        likesSnapshot.forEach((doc) => {
          likeDocId = doc.id;
        });

        if (likeDocId) {
          const likeRef = doc(db, "likes", likeDocId);
          await deleteDoc(likeRef);
        }
        console.log("Likes data has been deleted from Firestore");
      }
    } catch (error) {
      console.error("Error adding bar data to Firestore:", error);
    }
  };

  const handleCollectionButtonClick = async () => {
    if (!isCollection) {
      alert("已去過！");
    } else {
      alert("其實沒去過，我要取消！！");
    }
    const newIsCollection = !isCollection;
    localStorage.setItem("isCollection", JSON.stringify(newIsCollection));
    setIsCollection(newIsCollection);
    try {
      await addDoc(collection(db, "collections"), {
        name: name.name,
        address: name.address,
        link: name.link,
      });
      console.log("Collections data has been added to Firestore");
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
  const [bars, setBars] = useState<IBar[] | null>(null);
  const barsCollectionRef = collection(db, "bars");
  useEffect(() => {
    const getBars = async () => {
      const data = await getDocs(barsCollectionRef);
      setBars(data.docs.map((doc) => ({...(doc.data() as IBar), id: doc.id})));
    };

    getBars();
  }, []);

  return (
    <>
      <Wrapper>
        {bars === null ? (
          <p>Loading...</p>
        ) : (
          <>
            <BarInfoSection>
              <BarImg src={bars[0].img[0]} />
              <BarTitle>{bars[0].name}</BarTitle>
              <CollectionButton
                name={bars[0].name}
                address={bars[0].address}
                link={bars[0].link}
              />
              <BarScore>
                <Score>
                  {[
                    ...Array(
                      Math.round(
                        bars[0].member_comment
                          .map((item, index) => parseInt(item.score))
                          .reduce((total, score) => total + score, 0) /
                          bars[0].member_comment.length
                      )
                    ),
                  ].map((_, i) => (
                    <CommentScore key={i}>{"\u2605"}</CommentScore>
                  ))}
                </Score>
              </BarScore>
              <BarAddress>地址：{bars[0].address}</BarAddress>
              <BarLink href={bars[0].link}>Go to the Website!</BarLink>
              <BarOpeningTime>
                營業時間：
                <BarOpeningDate>
                  {bars[0].opening_time.opening_date}
                </BarOpeningDate>
                <BarOpeninghours>
                  {bars[0].opening_time.opening_hours}
                </BarOpeninghours>
              </BarOpeningTime>
              <BarTel>聯絡電話：{bars[0].tel}</BarTel>
            </BarInfoSection>
            <BarContent>
              <BarIntro>店家介紹</BarIntro>
              <BarHashTagSection>
                {Array.isArray(bars[0].type) &&
                  bars[0].type.map((bar: string, index) => (
                    <BarHashtagLink href={"/hashtag"} key={index}>
                      <BarHashTag key={bar}>#{bar}</BarHashTag>
                    </BarHashtagLink>
                  ))}
              </BarHashTagSection>
              <BarIntroText>{bars[0].introduction}</BarIntroText>
            </BarContent>
            <CommentSection>
              <CommentTitle>會員評分和留言</CommentTitle>
              <CommentArea>
                {bars[0].member_comment.map((item, index) => (
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
              <BarRecImg src={bars[0].menu[0].img} />
              <BarRecName>{bars[0].menu[0].name}</BarRecName>
              <BarRecConceptTitle>Concept</BarRecConceptTitle>
              <BarRecConcept>{bars[0].menu[0].concept}</BarRecConcept>
              <BarRecGarnishTitle>Garnish</BarRecGarnishTitle>
              <BarRecGarnish>
                {bars[0].menu[0].garnish.map((gar: string) => (
                  <BarRecGarnishItem key={gar}>{gar}</BarRecGarnishItem>
                ))}
              </BarRecGarnish>
              <BarRecIngredientsTitle>Ingredients</BarRecIngredientsTitle>
              <BarRecIngredients>
                {bars[0].menu[0].ingredients.map((gar: string) => (
                  <BarRecIngredientsItem key={gar}>{gar}</BarRecIngredientsItem>
                ))}
              </BarRecIngredients>
            </BarRec>
            <MemberScoreSection>
              <MemberScoreTitle>您的評分 & 留言</MemberScoreTitle>
              <MemberScore />
            </MemberScoreSection>
            <BarMapTitle>店家位置</BarMapTitle>
            {/* <BarMap /> */}
          </>
        )}
      </Wrapper>
    </>
  );
};

export default MainPage;
