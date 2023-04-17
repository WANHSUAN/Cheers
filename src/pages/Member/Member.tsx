import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components";
import {db} from "../../App";
import {collection, getDocs, getDoc, doc, deleteDoc} from "firebase/firestore";
import {Link} from "react-router-dom";
import SideMenu from "../../components/SideMenu/SideMenu";
import {AuthContext} from "../../Context/AuthContext";

const Wrapper = styled.div`
  width: 800px;
  margin: 0 auto;
  background-color: beige;
`;
const MenuButton = styled.button`
  width: 50px;
  height: 30px;
  position: absolute;
  top: 70px;
  right: 100px;
`;

const MemberTitle = styled.h1`
  margin: 0;
  padding: 50px 0;
`;

const LikeTitle = styled.h2``;

const LikeSection = styled.div`
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const LikeCard = styled(Link)`
  width: 190px;
  height: 200px;
  border-radius: 10px;
  text-decoration: none;
`;

// const LikeScoreSection = styled.div`
//   display: flex;
// `;

// const LikeScore = styled.li`
//   color: #fff;
//   list-style: none;
//   text-align: center;
// `;

const LikeDeleteButton = styled.button`
  width: 60px;
  height: 20px;
`;

const LikeBarName = styled.p`
  color: #fff;
`;

const RecommendationTitle = styled.h2``;

const RecommendationSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const RecommendationCard = styled(Link)`
  width: 190px;
  height: 200px;
  border-radius: 10px;
  text-decoration: none;
`;

const RecommendatioName = styled.p`
  text-decoration: none;
  color: #fff;
`;

const CollectionTitle = styled.h2``;

const CollectionSection = styled.ul`
  margin-bottom: 30px;
  display: flex;
  gap: 5px;
  padding: 0;
`;

const CollectionCard = styled(Link)`
  width: 190px;
  height: 200px;
  border-radius: 10px;
  text-decoration: none;
`;

// const CollectionScoreSection = styled.div`
//   display: flex;
// `;

// const CollectionScore = styled.li`
//   color: #fff;
//   list-style: none;
//   text-align: center;
// `;

const CollectionDeleteButton = styled.button`
  width: 60px;
  height: 20px;
`;

const CollectionBarName = styled.p`
  color: #fff;
`;

interface ILikes {
  name: string;
  link: string;
  img: string;
  score: number;
  address: string;
  id: string;
  barId: string;
}

interface IUser {
  createdAt: string;
  displayName: string;
  email: string;
  id: string;
  matchingBars: [
    {
      name: string;
      img: string;
      id: string;
    }
  ];
  name: string;
  img: [];
}

interface ICollections {
  name: string;
  link: string;
  img: string;
  score: number;
  address: string;
  id: string;
  barId: string;
}

export interface IMemberProps {}

const MemberPage: React.FC<IMemberProps> = (props: IMemberProps, element) => {
  const [likes, setLikes] = useState<ILikes[] | null>(null);
  const [collections, setCollections] = useState<ICollections[] | null>(null);
  const [users, setUsers] = useState<IUser[] | undefined>();
  const [showMenu, setShowMenu] = useState(false);

  const likesCollectionRef = collection(db, "likes");
  const collectionsCollectionRef = collection(db, "collections");
  const usersCollectionRef = collection(db, "users");
  const {isLogin, user, logOut, signIn, userUID} = useContext(AuthContext);

  useEffect(() => {
    const getDatas = async () => {
      const like = await getDocs(likesCollectionRef);
      const collection = await getDocs(collectionsCollectionRef);
      const user = await getDocs(usersCollectionRef);
      console.log(user);

      // if (user.exists()) {
      //   console.log("Document data:", user.data());
      // } else {
      //   // docSnap.data() will be undefined in this case
      //   console.log("No such document!");
      // }

      setLikes(
        like.docs.map((doc) => ({...(doc.data() as ILikes), id: doc.id}))
      );
      setCollections(
        collection.docs.map((doc) => ({
          ...(doc.data() as ICollections),
          id: doc.id,
        }))
      );
      setUsers(
        user.docs.map((doc) => ({
          ...(doc.data() as IUser),
          id: doc.id,
        }))
      );
    };

    getDatas();
  }, []);

  const handleDeleteLikeClick = async (likeDocId: string) => {
    const likeRef = doc(db, "likes", likeDocId);
    let confirmDelete = window.confirm("確定要刪除嗎？");

    if (confirmDelete === true) {
      await deleteDoc(likeRef);
      setLikes(
        (likes) => likes?.filter((like) => like.id !== likeDocId) ?? null
      );
    }
  };

  const handleDeleteCollectionClick = async (collectionDocId: string) => {
    const collectionRef = doc(db, "collections", collectionDocId);
    let confirmDelete = window.confirm("確定要刪除嗎？");

    if (confirmDelete === true) {
      await deleteDoc(collectionRef);
      setCollections(
        (collections) =>
          collections?.filter(
            (collection) => collection.id !== collectionDocId
          ) ?? null
      );
    }
  };

  function handleMenuClick() {
    setShowMenu(!showMenu);
  }

  if (users === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <Wrapper>
      <MenuButton onClick={handleMenuClick}>Menu</MenuButton>
      {showMenu && <SideMenu />}
      <MemberTitle>Hi!{user.name}~</MemberTitle>
      <RecommendationTitle>推薦給您的酒吧</RecommendationTitle>
      <RecommendationSection>
        {users[0].matchingBars.map((matchingBar, index) => (
          <RecommendationCard
            to={`/bars/${matchingBar.id}`}
            key={index}
            style={{
              backgroundImage: `url(${matchingBar.img[1]})`,
              backgroundSize: "cover",
            }}
          >
            <RecommendatioName>{matchingBar.name}</RecommendatioName>
          </RecommendationCard>
        ))}
      </RecommendationSection>
      {likes === null ? (
        <p>Loading...</p>
      ) : (
        <>
          <LikeTitle>{"\u2661"}您收藏的酒吧</LikeTitle>
          <LikeSection>
            {likes.map((like, index) => (
              <LikeCard
                to={`/bars/${like.barId}`}
                key={like.id}
                style={{
                  backgroundImage: `url(${like.img})`,
                  backgroundSize: "cover",
                }}
              >
                {/* <LikeScoreSection>
                  {[...Array(parseInt(like.score.toString()))].map((_, i) => (
                    <LikeScore key={i.toString()}>{"\u2605"}</LikeScore>
                  ))}
                </LikeScoreSection> */}
                <LikeBarName>{like.name}</LikeBarName>
                <LikeDeleteButton
                  onClick={() => handleDeleteLikeClick(like.id)}
                >
                  Delete
                </LikeDeleteButton>
              </LikeCard>
            ))}
          </LikeSection>
        </>
      )}
      {collections === null ? (
        <p>Loading...</p>
      ) : (
        <>
          <CollectionTitle>{"\u263A"}您已去過的酒吧</CollectionTitle>
          <CollectionSection>
            {collections.map((collection, index) => (
              <CollectionCard
                to={`/bars/${collection.barId}`}
                key={collection.id}
                style={{
                  backgroundImage: `url(${collection.img})`,
                  backgroundSize: "cover",
                }}
              >
                {/* <CollectionScoreSection>
                  {[...Array(parseInt(collection.score.toString()))].map(
                    (_, i) => (
                      <CollectionScore key={i.toString()}>
                        {"\u2605"}
                      </CollectionScore>
                    )
                  )}
                </CollectionScoreSection> */}
                <CollectionBarName>{collection.name}</CollectionBarName>
                <CollectionDeleteButton
                  onClick={() => handleDeleteCollectionClick(collection.id)}
                >
                  Delete
                </CollectionDeleteButton>
              </CollectionCard>
            ))}
          </CollectionSection>
        </>
      )}
    </Wrapper>
  );
};

export default MemberPage;
