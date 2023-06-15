import {collection, getDocs} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components/macro";
import Scroll from "../../components/Scroll/Scroll";
import {db} from "../../utils/firebase";

const PageImg = styled.img`
  width: 100vw;
  height: 400px;
  object-fit: cover;
  padding-top: 60px;
`;

const Wrapper = styled.div`
  max-width: 1000px;
  width: 80%;
  margin: 0 auto 80px;
`;

const Hashtag = styled.div`
  scroll-margin-top: 30vh;
`;

const CategorySection = styled(Link)`
  text-decoration: none;
`;

const CategoryTitle = styled.div<{colorCode: string}>`
  font-size: 40px;
  margin-top: 60px;
  margin-left: 10px;
  color: ${(props) => props.colorCode};

  @media (max-width: 1024px) {
    font-size: 30px;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const CategoryCollection = styled.div`
  display: flex;
  max-width: 1000px;
  width: 100%;
  overflow: auto;
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  gap: 10px;
  text-align: center;
`;

const CategoryName = styled.p`
  color: #fff;
  font-size: 20px;

  @media (max-width: 1024px) {
    font-size: 15px;
  }

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const CategoryImg = styled.img`
  width: 320px;
  height: 400px;
  object-fit: cover;
  padding: 5px;

  @media (max-width: 1024px) {
    width: 250px;
    height: 330px;
  }

  @media (max-width: 768px) {
    width: 200px;
    height: 280px;
  }

  @media (max-width: 414px) {
    height: 200px;
  }
`;

interface IHashtag {
  type: string;
  colorCode: string;
  bars: Array<{img: string; name: string; id: string}>;
}

export interface ICategoryProps {}

const CategoryPage: React.FC<ICategoryProps> = (props: ICategoryProps) => {
  const [hashtags, setHashtags] = useState<IHashtag[]>([]);
  const hashtagsCollectionRef = collection(db, "hashtags");
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getHashtags = async () => {
      const data = await getDocs(hashtagsCollectionRef);
      setHashtags(
        data.docs.map((doc) => ({...(doc.data() as IHashtag), id: doc.id}))
      );
    };

    getHashtags();

    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (hashtags.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <PageImg
        src={
          "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        }
      />
      <Wrapper>
        {hashtags.map((hashtag, index) => (
          <Hashtag key={index} id={hashtag.type}>
            <CategoryTitle colorCode={hashtag.colorCode}>
              #{hashtag.type}
            </CategoryTitle>

            <CategoryCollection>
              {hashtag.bars.map((type, index) => (
                <CategorySection key={index} to={`/bars/${type.id}`}>
                  <CategoryItem>
                    <CategoryImg src={type.img} />
                    <CategoryName>{type.name}</CategoryName>
                  </CategoryItem>
                </CategorySection>
              ))}
            </CategoryCollection>
          </Hashtag>
        ))}
        {showButton && <Scroll />}
      </Wrapper>
    </>
  );
};

export default CategoryPage;
