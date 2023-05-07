import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components/macro";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../../Context/AuthContext";
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
  const {isLogin, userUID} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const getRecommendations = async () => {
      const data = await getDocs(recommendationsRef);
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
        setMatchIndex(null); // 如果找不到匹配的项，就将 matchIndex 设置为 null
      }
    };

    getRecommendations();
  }, []);

  if (recommendations === undefined || matchIndex === null) {
    return <p>Loading...</p>;
  }

  if (isLogin) {
    console.log("登入");
  } else {
    console.log("登出");
    navigate("/");
  }
  console.log(matchIndex);

  return (
    <Wrapper>
      {matchIndex !== null && (
        <RecSection>
          {recommendations[matchIndex].matchingBars
            .slice(0, 8)
            .map((recommendation: IRecommendation, index: any) => {
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
      )}
    </Wrapper>
  );
};

export default RecommendationPage;
