import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {db} from "../../App";
import {Link} from "react-router-dom";
import {collection, getDocs} from "firebase/firestore";

const PageImg = styled.img`
  width: 100vw;
  height: 400px;
  object-fit: cover;
  padding-top: 60px;
`;
const Wrapper = styled.div`
  width: 1000px;
  margin: 0 auto;
`;

const CategorySection = styled(Link)`
  text-decoration: none;
`;

const CategoryTitle = styled.div`
  font-size: 40px;
  margin: 60px 0;
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

interface IHashtag {
  type: [];
  colorCode: string;
  bars: Array<{img: string; name: string; id: string}>;
}

export interface ICategoryProps {}

const CategoryPage: React.FC<ICategoryProps> = (props: ICategoryProps) => {
  const [hashtags, setHashtags] = useState<IHashtag[]>([]);
  const hashtagsCollectionRef = collection(db, "hashtags");

  useEffect(() => {
    const getHashtags = async () => {
      const data = await getDocs(hashtagsCollectionRef);
      setHashtags(
        data.docs.map((doc) => ({...(doc.data() as IHashtag), id: doc.id}))
      );
    };

    getHashtags();
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
          <div key={index}>
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
      </Wrapper>
    </>
  );
};

export default CategoryPage;
