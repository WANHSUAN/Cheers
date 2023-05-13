import {collection, getDocs} from "firebase/firestore";
import React, {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components/macro";
import {AuthContext} from "../../Context/AuthContext";
import {db} from "../../utils/firebase";

const Circle = styled.div`
  width: 120px;
  height: 180px;
  transform: rotate(deg) translateX(200px) rotate(deg);
`;

const Wrapper = styled.div`
  width: 700px;
  margin: 0 auto;
  padding-top: 200px;
`;

const RecSection = styled.div`
  width: 700px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  text-align: center;
  margin: 50px 0;
`;

const RecItem = styled(Link)`
  text-decoration: none;
  margin-bottom: 30px;
  display: ${(props) => (props.hidden ? "none" : "block")};

  &:hover {
    transition: ease 0.5s;
    transform: translateY(-10px);
  }
`;

const RecName = styled.h3`
  color: #fff;
  margin-bottom: 10px;
  width: 150px;
`;

const RecImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px solid #ffffff7c;

  &:hover {
    box-shadow: 3px 3px 10px #ffffff7c;
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
      {matchIndex !== null && (
        <RecSection>
          {recommendations[matchIndex].matchingBars
            .slice(0, 8)
            .map((recommendation: IRecommendation, index: any) => {
              return (
                <React.Fragment key={index}>
                  <Circle key={index} />
                  <RecItem
                    to={`/bars/${recommendation.id}`}
                    hidden={index === 7}
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
