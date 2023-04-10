import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {db} from "../../App";
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

const RecItem = styled(Link)`
  text-decoration: none;
`;

const RecName = styled.h3``;

const RecImg = styled.img`
  width: 260px;
  height: 250px;
  border-radius: 50%;
`;

const ReLink = styled.div``;

interface IRecommendation {
  matchingBars: [];
  id: string;
  name: string;
  img: string[];
}

export interface IRecommendationProps {}

const RecommendationPage: React.FC<IRecommendationProps> = (
  props: IRecommendationProps
) => {
  const [recommendations, setRecommendations] = useState<IRecommendation[]>([]);
  const recommendationsRef = collection(db, "recommendations");

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

  if (recommendations[0] === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <Wrapper>
      <RecSection>
        {recommendations[0].matchingBars.map(
          (recommendation: IRecommendation, index) => {
            return (
              <RecItem to={`/bars/${recommendation.id}`} key={index}>
                <RecName>{recommendation.name}</RecName>
                <ReLink>
                  <RecImg
                    src={recommendation.img[1]}
                    alt={recommendation.name}
                  />
                </ReLink>
              </RecItem>
            );
          }
        )}
      </RecSection>
      {/* {recommendations.map((recommendation: IRecommendation, index) => {
        return (
          <RecSection key={index}>
            {recommendation.matchingBars.map((bar: IBar, index) => (
              <RecItem to={`/bars/${bar.id}`} key={index}>
                <RecName>{bar.name}</RecName>
                <ReLink>
                  <RecImg src={bar.img[1]} alt={bar.name} />
                </ReLink>
              </RecItem>
            ))}
          </RecSection>
        );
      })} */}
    </Wrapper>
  );
};

export default RecommendationPage;
