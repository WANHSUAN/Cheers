import {collection, getDocs} from "firebase/firestore";
import React, {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import styled, {keyframes} from "styled-components/macro";
import {AuthContext} from "../../Context/AuthContext";
import {db} from "../../utils/firebase";

const Wrapper = styled.div`
  max-width: 900px;
  width: 90%;
  margin: 0 auto;
  padding-top: 160px;

  @media (max-width: 414px) {
    padding-top: 110px;
  }
`;

const RecommendationTitle = styled.h1`
  color: #fff;
  text-align: center;
  margin-bottom: 160px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 100px;
  }

  @media (max-width: 580px) {
    font-size: 1.1rem;
  }

  @media (max-width: 414px) {
    font-size: 0.9rem;
  }
`;

const Strong = styled.strong`
  color: #d19b18;
`;

const RecSection = styled.div`
  max-width: 900px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  text-align: center;
  margin: 50px 0;
  gap: 50px;

  @media (max-width: 1024px) {
    gap: 30px;
  }

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const Flow = keyframes`
from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-20px);
  }
`;

const RecItem = styled(Link)`
  width: 250px;
  text-decoration: none;
  margin-bottom: 30px;
  display: ${(props) => (props.hidden ? "none" : "block")};
  animation: ${Flow} 1s alternate infinite;

  @media (max-width: 580px) {
    width: 180px;
  }

  @media (max-width: 414px) {
    width: 150px;
  }

  &:nth-child(odd) {
    animation-delay: 0.2s;
  }

  &:nth-child(even) {
    animation-delay: 0.4s;
  }

  &:hover {
    transition: ease 0.5s;
    transform: translateY(-10px);
  }
`;

const RecName = styled.h3`
  color: #fff;
  margin-bottom: 10px;

  @media (max-width: 580px) {
    font-size: 0.9rem;
  }
`;

const RecImg = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px solid #ffffff7c;
  box-shadow: 3px 3px 10px #ffffff7c;

  @media (max-width: 580px) {
    width: 150px;
    height: 150px;
  }

  &:hover {
    transition: ease 1s;
    box-shadow: 5px 5px 5px #ffffff7c;
  }
`;

interface IRecommendation {
  matchingBars: [];
  id: string;
  name: string;
  img: string[];
  userUID: string;
}

export interface IRecommendationProps {}

const RecommendationPage: React.FC<IRecommendationProps> = (
  props: IRecommendationProps
) => {
  const [recommendations, setRecommendations] = useState<
    IRecommendation[] | undefined
  >(undefined);
  const recommendationsRef = collection(db, "users");
  const [matchIndex, setMatchIndex] = useState<number | null>(null);
  const {userUID} = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getRecommendations = async () => {
      const data = await getDocs(recommendationsRef);

      if (userUID === "") {
        return;
      }

      const loadedRecommendations = data.docs.map((doc) => ({
        ...(doc.data() as IRecommendation),
        id: doc.id,
      }));
      setRecommendations(loadedRecommendations);

      const index = loadedRecommendations.findIndex(
        (recommendation) => recommendation.userUID === userUID
      );
      if (index >= 0) {
        setMatchIndex(index);
      } else {
        setMatchIndex(null);
      }
    };

    getRecommendations();
  }, [userUID]);

  if (recommendations === undefined || matchIndex === null) {
    return <p>Loading...</p>;
  }

  return (
    <Wrapper>
      <RecommendationTitle>
        We recommend <Strong>THESE BARS</Strong> to you!
      </RecommendationTitle>
      {matchIndex !== null && (
        <RecSection>
          {recommendations[matchIndex].matchingBars
            .slice(0, 7)
            .map((recommendation: IRecommendation, index: any) => {
              return (
                <React.Fragment key={index}>
                  <RecItem
                    to={`/bars/${recommendation.id}`}
                    hidden={index === 6}
                  >
                    <RecName>{recommendation.name}</RecName>
                    <RecImg
                      src={recommendation.img[1]}
                      alt={recommendation.name}
                    />
                  </RecItem>
                </React.Fragment>
              );
            })}
        </RecSection>
      )}
    </Wrapper>
  );
};

export default RecommendationPage;
