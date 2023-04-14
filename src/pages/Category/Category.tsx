import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {db} from "../../App";
import {Link} from "react-router-dom";
import {collection, getDocs} from "firebase/firestore";

const Wrapper = styled.div`
  width: 1000px;
`;

const CategoryTitle = styled.h2``;

const CategoryItem = styled.div`
  display: flex;
  margin: 10px;
  gap: 10px;
`;

const CategoryName = styled.p``;

const CategoryImg = styled.img`
  width: 300px;
`;

const CategoryButton = styled(Link)`
  text-decoration: none;
`;

const StyledCategoryButton = styled.button`
  width: 100px;
  height: 50px;
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
    <Wrapper>
      {hashtags.map((hashtag, index) => (
        <>
          <CategoryTitle key={index} style={{color: hashtag.colorCode}}>
            #{hashtag.type}
          </CategoryTitle>
          {hashtag.bars.map((type, index) => (
            <CategoryItem key={index}>
              <CategoryImg src={type.img} />
              <CategoryName>{type.name}</CategoryName>
              <StyledCategoryButton>
                <CategoryButton to={`/bars/${type.id}`}>
                  Go to Bar!
                </CategoryButton>
              </StyledCategoryButton>
            </CategoryItem>
          ))}
        </>
      ))}
    </Wrapper>
  );
};

export default CategoryPage;
