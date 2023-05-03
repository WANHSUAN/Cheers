import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components/macro";
import {db} from "../../App";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../../Context/AuthContext";
import {collection, getDocs} from "firebase/firestore";

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
const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 4% 2%;
  box-sizing: border-box;
  height: 50vh;
  overflow: auto;
`;

const Box = styled.div`
  flex: 1;
  overflow: hidden;
  transition: 0.5s;
  margin: 0 2%;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
  line-height: 0;

  &:hover {
    flex: 1 1 50%;
  }
  &:hover > img {
    width: 300%;
    height: 300%;
  }
`;

const BoxImg = styled.img`
  width: 200%;
  height: calc(100% - 10vh);
  object-fit: cover;
  transition: 0.5s;
`;

const BoxSpan = styled.span`
  font-size: 20px;
  display: block;
  text-align: center;
  height: 30px;
  line-height: 2.6;
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
  const {user, userUID, isLogin, signIn} = useContext(AuthContext);

  const navigate = useNavigate();

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

  if (isLogin) {
    console.log("登入");
  } else {
    console.log("登出");
    navigate("/");
  }

  return (
    <>
      <PageImg
        src={
          "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        }
      />
      <Wrapper>
        {/* <Container>
          <Box>
            <BoxImg src="https://source.unsplash.com/1000x800" />
            <BoxSpan>CSS</BoxSpan>
          </Box>
          <Box>
            <BoxImg src="https://source.unsplash.com/1000x802" />
            <BoxSpan>Image</BoxSpan>
          </Box>
          <Box>
            <BoxImg src="https://source.unsplash.com/1000x804" />
            <BoxSpan>Hover</BoxSpan>
          </Box>
          <Box>
            <BoxImg src="https://source.unsplash.com/1000x806" />
            <BoxSpan>Effect</BoxSpan>
          </Box>
        </Container> */}
        {hashtags.map((hashtag, index) => (
          <div key={index} id={hashtag.type} style={{scrollMarginTop: "30vh"}}>
            <CategoryTitle style={{color: hashtag.colorCode}}>
              #{hashtag.type}
            </CategoryTitle>

            {/* <Container>
              {hashtag.bars.map((type, index) => (
                <CategorySection key={index} to={`/bars/${type.id}`}>
                  <Box>
                    <BoxImg src={type.img} />
                    <BoxSpan>{type.name}</BoxSpan>
                  </Box>
                </CategorySection>
              ))}
            </Container> */}

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
