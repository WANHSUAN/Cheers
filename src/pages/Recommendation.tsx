import React, {useState, useEffect} from "react";
// import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {db} from "../App";
import {collection, getDocs} from "firebase/firestore";

const Wrapper = styled.div`
  width: 700px;
  margin: 0 auto;
`;

const RecSection = styled.div`
  width: 700px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  text-align: center;
`;

const RecItem = styled.div``;

const RecName = styled.h3``;

const RecImg = styled.img`
  width: 260px;
  height: 250px;
  border-radius: 50%;
`;

const ReLink = styled.a`
  text-decoration: none;
`;

interface IRecommendation {
  matchingBars: IBar[];
  id: string;
}

interface IBar {
  id: number;
  name: string;
  img: string[];
}

export interface IRecommendationProps {}

const RecommendationPage: React.FC<IRecommendationProps> = (
  props: IRecommendationProps
) => {
  // const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<IRecommendation[]>([]);
  const recommendationsRef = collection(db, "recommendation");

  useEffect(() => {
    const getRecommendations = async () => {
      const data = await getDocs(recommendationsRef);
      setRecommendations(
        data.docs.map((doc) => ({
          ...(doc.data() as IRecommendation),
          id: doc.id,
        }))
      );
    };

    getRecommendations();
  }, []);

  return (
    <Wrapper>
      {recommendations.map((recommendation: IRecommendation) => {
        return (
          <RecSection key={recommendation.id}>
            {recommendation.matchingBars.map((bar: IBar, index) => (
              <RecItem key={index}>
                <RecName>{bar.name}</RecName>
                <ReLink href={"/bar"}>
                  <RecImg src={bar.img[1]} alt={bar.name} />
                </ReLink>
              </RecItem>
            ))}
          </RecSection>
        );
      })}
    </Wrapper>
  );
};

export default RecommendationPage;
