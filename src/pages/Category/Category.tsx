import {collection, getDocs} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components/macro";
import {db} from "../../utils/firebase";

const PageImg = styled.img`
  width: 100vw;
  height: 400px;
  object-fit: cover;
  padding-top: 60px;
`;

const Wrapper = styled.div`
  width: 1000px;
  margin: 0 auto 80px;
`;

const CategorySection = styled(Link)`
  text-decoration: none;
`;

const CategoryTitle = styled.div`
  font-size: 40px;
  margin-top: 60px;
`;

const CategoryCollection = styled.div`
  display: flex;
  width: 1000px;
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
`;

const CategoryImg = styled.img`
  width: 320px;
  height: 400px;
  object-fit: cover;
  padding: 5px;
`;

const ScrollButton = styled.button`
  width: 80px;
  height: 80px;
  position: fixed;
  bottom: 110px;
  right: 50px;
  z-index: 999;
  border: none;
  font-size: 18px;
  background-color: #fff;
  color: #d19b18;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #d19b18;
    color: #fff;

    transition: ease 0.5s;
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

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <PageImg
        src={
          "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        }
      />
      <Wrapper>
        {hashtags.map((hashtag, index) => (
          <div key={index} id={hashtag.type} style={{scrollMarginTop: "30vh"}}>
            <CategoryTitle style={{color: hashtag.colorCode}}>
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
          </div>
        ))}
        {showButton && (
          <ScrollButton onClick={handleScrollTop}>Scroll To Top</ScrollButton>
        )}
      </Wrapper>
    </>
  );
};

export default CategoryPage;
