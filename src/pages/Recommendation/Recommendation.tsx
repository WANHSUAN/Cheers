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

const HomePageLink = styled(Link)`
  width: 150px;
  height: 50px;
  padding: 5px;
  background-color: #60add3;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
`;

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
  const recommendationsRef = collection(db, "users");

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
      <HomePageLink to={"/main"}>Go to HomePage</HomePageLink>
    </Wrapper>
  );
};

export default RecommendationPage;
