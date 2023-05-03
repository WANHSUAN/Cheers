import React, {useState, useEffect} from "react";
import styled from "styled-components/macro";
import {Link} from "react-router-dom";
import {db} from "../../App";
import {collection, getDocs} from "firebase/firestore";

const Wrapper = styled.div`
  width: 700px;
  margin: 0 auto;
  padding-top: 100px;
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
        {recommendations[0].matchingBars
          .slice(0, 8)
          .map((recommendation: IRecommendation, index) => {
            return (
              <>
                <div
                  style={{
                    width: "120px",
                    height: "180px",
                    transform: `rotate(${
                      index * 60
                    }deg) translateX(200px) rotate(${-index * 60}deg)`,
                  }}
                  key={index}
                ></div>
                <RecItem
                  to={`/bars/${recommendation.id}`}
                  style={{display: index === 7 ? "none" : "block"}}
                >
                  <RecName>{recommendation.name}</RecName>
                  <ReLink>
                    <RecImg
                      src={recommendation.img[1]}
                      alt={recommendation.name}
                    />
                  </ReLink>
                </RecItem>
              </>
            );
          })}
      </RecSection>
    </Wrapper>
  );
};

export default RecommendationPage;
