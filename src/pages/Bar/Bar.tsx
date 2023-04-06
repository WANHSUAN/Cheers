import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {db} from "../../App";
import {collection, getDocs} from "firebase/firestore";
import MemberScore from "./MemberScore";
import Address from "./BarMap";

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

const BarContent = styled.div`
  /* background-color: lightgrey; */
`;

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

const CommentArea = styled.ul``;

const CommentScore = styled.li`
  list-style: none;
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
              <BarScore>{"\u2605"}</BarScore>
              <BarScore>{"\u2605"}</BarScore>
              <BarScore>{"\u2605"}</BarScore>
              <BarScore>{"\u2605"}</BarScore>
              <BarScore>{"\u2605"}</BarScore>
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
                  bars[0].type.map((bar: string) => (
                    <BarHashtagLink href={"/hashtag"}>
                      <BarHashTag key={bar}>#{bar}</BarHashTag>
                    </BarHashtagLink>
                  ))}
              </BarHashTagSection>
              <BarIntroText>{bars[0].introduction}</BarIntroText>
            </BarContent>
            <CommentSection>
              <CommentTitle>會員評分和留言</CommentTitle>
              <CommentArea>
                <CommentScore>
                  {/* {bars[0].member_comment[0].score} */}
                  <BarScore>{"\u2605"}</BarScore>
                  <BarScore>{"\u2605"}</BarScore>
                  <BarScore>{"\u2605"}</BarScore>
                  <BarScore>{"\u2605"}</BarScore>
                  <BarScore>{"\u2606"}</BarScore>
                </CommentScore>
                <Comment>{bars[0].member_comment[0].comment}</Comment>
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
            <Address />
          </>
        )}
      </Wrapper>
    </>
  );
};

export default MainPage;
