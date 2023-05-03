import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components/macro";
import {db} from "../../App";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  query,
  where,
  collectionGroup,
} from "firebase/firestore";
import {Link} from "react-router-dom";
import {AuthContext} from "../../Context/AuthContext";
import {AiOutlineMinusCircle} from "react-icons/ai";
import "./Member.css";

const PageImg = styled.img`
  width: 100vw;
  height: 400px;
  object-fit: cover;
  padding-top: 60px;
`;

const Wrapper = styled.div`
  width: 1300px;
  margin: 0 auto;
  padding-top: 60px;
`;

const MemberTitle = styled.h1`
  margin-bottom: 50px;
  padding: 50px 0;
  color: #d19b18;
  font-size: 45px;
`;

const MemberSection = styled.div`
  display: flex;
  margin-bottom: 200px;
`;

const MemberImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #ffffff7c;
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 30px;
`;

const MemberName = styled.p`
  color: #fff;
  font-size: 30px;
  margin-bottom: 20px;
`;

const MemberEmail = styled.p`
  color: #fff;
  font-size: 20px;
`;

const RecommendationTitle = styled.h2`
  color: #fff;
  font-size: 30px;
  margin: 40px 0;
`;

const RecommendationSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ImgList = styled.ul`
  list-style: none;
`;

const RecommendationItem = styled.li`
  border: 5px solid transparent;
  box-sizing: border-box;
  width: 33.33%;
  float: left;
  position: relative;
  cursor: pointer;

  &:before {
    transition: all 0.5s ease;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #333;
    transform: scale(0);
  }

  &:hover:before {
    opacity: 0.5;
    transform: scale(1);
  }

  &:after {
    transition: all 0.6s ease 0.2s;
    content: "";
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border: 1px solid #aaa;
    background: #000;
    opacity: 0;
    transform: scale(0);
  }

  &:hover:after {
    opacity: 0.6;
    transform: scale(1);
  }
`;

const StyledRecommendationImg = styled.img`
  max-width: 100%;
  vertical-align: middle;
  position: relative;
`;

const RecommendationName = styled(Link)`
  width: 300px;
  margin: 0 auto;
  text-decoration: none;
  color: #fff;
  font-size: 40px;
  padding: 5px;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
  z-index: 2;

  &:hover {
    opacity: 1;
  }
`;

const LikeTitle = styled.h2`
  color: #fff;
  font-size: 30px;
  margin: 100px 0;
`;

const LikeSection = styled.div`
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const LikeImg = styled(Link)`
  width: 170px;
  height: 170px;
  border-radius: 10px;
  text-decoration: none;
  /* border: 1px solid #fff; */
`;

const LikeHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LikeDeleteButton = styled.button`
  width: 60px;
  height: 20px;
  border: none;
  background-color: rgba(255, 255, 255, 0);
  color: #ffffff93;
  font-size: 35px;
  padding-top: 5px;
  cursor: pointer;
  position: absolute;
  top: 2%;
  right: 0;
  z-index: 2;

  &:hover {
    color: #ffffffc4;
  }
`;

const LikeBarName = styled.p`
  text-decoration: none;
  color: #fff;
  font-size: 15px;
  padding: 5px;
`;

// const LikeScoreSection = styled.div`
//   display: flex;
// `;

// const LikeScore = styled.li`
//   color: #fff;
//   list-style: none;
//   text-align: center;
// `;

const CollectionTitle = styled.h2`
  color: #fff;
  font-size: 30px;
  margin: 100px 0;
`;

const CollectionSection = styled.ul`
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const CollectionImg = styled(Link)`
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

const CollectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CollectionDeleteButton = styled.button`
  width: 60px;
  height: 20px;
  border: none;
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
  font-size: 20px;
  padding-top: 5px;
  cursor: pointer;
`;

const CollectionBarName = styled.p`
  text-decoration: none;
  color: #fff;
  font-size: 15px;
  padding: 5px;
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
  img: string;
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

  const {user, userUID} = useContext(AuthContext);

  const usersCollectionRef = collection(db, "users");
  const likesCollectionRef = collectionGroup(db, "likes");
  const collectionsCollectionRef = collectionGroup(db, "collections");

  useEffect(() => {
    window.scrollTo(0, 0);
    const getDatas = async () => {
      const like = await getDocs(likesCollectionRef);
      const collection = await getDocs(collectionsCollectionRef);
      const user = await getDocs(usersCollectionRef);

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

  if (users === undefined) {
    return <p>Loading...</p>;
  }

  const handleDeleteLikeClick = async (likeDocId: string) => {
    let confirmDelete = window.confirm("確定要刪除嗎？");

    if (confirmDelete === true) {
      const likesRef = collection(db, "users", userUID, "likes");
      const q = query(likesRef, where("barId", "==", likeDocId));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        likeDocId = doc.id;
      });

      if (likeDocId) {
        const likeRef = doc(db, "users", userUID, "likes", likeDocId);
        const docSnap = await getDoc(likeRef);
        if (docSnap.exists()) {
          const targetBarId = docSnap.data().barId;
          await deleteDoc(likeRef);
          if (likes) {
            likes.forEach((like) => {
              if (like.barId === targetBarId) {
                const localStorageKey = `isLike_${like.barId}`;
                localStorage.removeItem(localStorageKey);
              }
            });
          }
        }
      }
    }
  };

  const handleDeleteCollectionClick = async (collectionDocId: string) => {
    let confirmDelete = window.confirm("確定要刪除嗎？");

    if (confirmDelete === true) {
      const collectionsRef = collection(db, "users", userUID, "collections");
      const q = query(collectionsRef, where("barId", "==", collectionDocId));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        collectionDocId = doc.id;
      });

      if (collectionDocId) {
        const collectionRef = doc(
          db,
          "users",
          userUID,
          "collections",
          collectionDocId
        );
        const docSnap = await getDoc(collectionRef);
        if (docSnap.exists()) {
          const targetBarId = docSnap.data().barId;
          await deleteDoc(collectionRef);
          if (collections) {
            collections.forEach((collection) => {
              if (collection.barId === targetBarId) {
                const localStorageKey = `isCollection_${collection.barId}`;
                localStorage.removeItem(localStorageKey);
              }
            });
          }
        }
      }
    }
  };

  return (
    <>
      <PageImg
        src={
          "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        }
      />
      <Wrapper>
        <MemberTitle>
          <strong style={{color: "#fff"}}>Welcome,</strong> {user.name}!
        </MemberTitle>
        <MemberSection>
          <MemberImg src={user.userImg} />
          <MemberInfo>
            <MemberName>{user.name}</MemberName>
            <MemberEmail>{user.email}</MemberEmail>
          </MemberInfo>
        </MemberSection>
        <RecommendationTitle>
          We <strong style={{color: "#D19B18"}}>RECOMMEND</strong> the bars for
          you
        </RecommendationTitle>
        <RecommendationSection>
          <ImgList>
            {users[0].matchingBars.map((matchingBar, index) => (
              <RecommendationItem key={index}>
                <StyledRecommendationImg src={matchingBar.img[1]} />
                <RecommendationName to={`/bars/${matchingBar.id}`}>
                  {matchingBar.name}
                </RecommendationName>
              </RecommendationItem>
            ))}
          </ImgList>
        </RecommendationSection>
        {likes === null ? (
          <p>Loading...</p>
        ) : (
          <>
            <LikeTitle>
              The Bars you <strong style={{color: "#D19B18"}}>LIKE</strong>
            </LikeTitle>
            <RecommendationSection>
              <ImgList>
                {likes.map((like, index) => (
                  <RecommendationItem key={index}>
                    <StyledRecommendationImg src={like.img} />
                    <RecommendationName to={`/bars/${like.id}`}>
                      {like.name}
                    </RecommendationName>
                    {/* <LikeScoreSection>
                     {[...Array(parseInt(like.score.toString()))].map(
                       (_, i) => (
                         <LikeScore key={i.toString()}>{"\u2605"}</LikeScore>
                       )
                     )}
                   </LikeScoreSection> */}
                    <LikeDeleteButton
                      onClick={() => handleDeleteLikeClick(like.id)}
                    >
                      <AiOutlineMinusCircle />
                    </LikeDeleteButton>
                  </RecommendationItem>
                ))}
              </ImgList>
            </RecommendationSection>
          </>
        )}
      </Wrapper>
    </>
  );
};

export default MemberPage;
