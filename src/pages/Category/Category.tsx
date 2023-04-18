import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {db} from "../../App";
import {Link} from "react-router-dom";
import {collection, getDocs} from "firebase/firestore";
import SideMenu from "../../components/SideMenu/SideMenu";

const Wrapper = styled.div`
  width: 1000px;
`;

const MenuButton = styled.button`
  width: 50px;
  height: 30px;
`;

const CategoryTitle = styled.div`
  font-size: 30px;
`;

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
  const [showMenu, setShowMenu] = useState(false);

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

  function handleMenuClick() {
    setShowMenu(!showMenu);
  }

  return (
    <Wrapper>
      <MenuButton onClick={handleMenuClick}>Menu</MenuButton>
      {showMenu && <SideMenu />}
      {hashtags.map((hashtag, index) => (
        <div key={index}>
          <CategoryTitle style={{color: hashtag.colorCode}}>
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
        </div>
      ))}
    </Wrapper>
  );
};

export default CategoryPage;
