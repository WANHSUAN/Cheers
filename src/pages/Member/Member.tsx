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
import {RiDeleteBin5Line} from "react-icons/ri";

const PageImg = styled.img`
  width: 100vw;
  height: 400px;
  object-fit: cover;
  padding-top: 60px;
`;

const Wrapper = styled.div`
  width: 1000px;
  margin: 0 auto;
  padding-top: 60px;
`;

const MemberTitle = styled.h1`
  margin: 0;
  padding: 50px 0;
  color: #d19b18;
  font-size: 45px;
`;

const RecommendationTitle = styled.h2`
  color: #fff;
  font-size: 30px;
  margin: 40px 0;
`;

const OuterDiv = styled.div`
  width: 100%;
  /* height: 400px; */
  border: 2px solid white;
  margin: 0 auto;
  padding: 10px;
`;

const InnerDiv = styled.div`
  width: 100%;
  /* height: 430px; */
  border: 2px solid white;
  padding: 40px 0 10px 40px;
  margin-top: -25px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const RecommendationSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const RecommendationImg = styled(Link)`
  width: 170px;
  height: 170px;
  border-radius: 10px;
  text-decoration: none;
  /* border: 1px solid #fff; */
`;

const RecommendationName = styled.p`
  text-decoration: none;
  color: #fff;
  font-size: 15px;
  padding: 5px;
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
  color: #fff;
  font-size: 20px;
  padding-top: 5px;
  cursor: pointer;
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

  const {user, userUID} = useContext(AuthContext);

  const usersCollectionRef = collection(db, "users");
  const likesCollectionRef = collectionGroup(db, "likes");
  const collectionsCollectionRef = collectionGroup(db, "collections");

  useEffect(() => {
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
        <MemberTitle>Welcome, {user.name}!</MemberTitle>
        <RecommendationTitle>
          We <strong style={{color: "#D19B18"}}>RECOMMEND</strong> the bars for
          you
        </RecommendationTitle>
        <OuterDiv>
          <InnerDiv>
            <RecommendationSection>
              {users[0].matchingBars.map((matchingBar, index) => (
                <RecommendationImg
                  to={`/bars/${matchingBar.id}`}
                  key={index}
                  style={{
                    backgroundImage: `url(${matchingBar.img[1]})`,
                    backgroundSize: "cover",
                  }}
                >
                  <RecommendationName>{matchingBar.name}</RecommendationName>
                </RecommendationImg>
              ))}
            </RecommendationSection>
          </InnerDiv>
        </OuterDiv>

        {likes === null ? (
          <p>Loading...</p>
        ) : (
          <>
            <LikeTitle>
              The Bars you <strong style={{color: "#D19B18"}}>LIKE</strong>
            </LikeTitle>
            <OuterDiv>
              <InnerDiv>
                <LikeSection>
                  {likes.map((like, index) => (
                    <LikeImg
                      to={`/bars/${like.barId}`}
                      key={like.id}
                      style={{
                        backgroundImage: `url(${like.img})`,
                        backgroundSize: "cover",
                      }}
                    >
                      <>
                        {/* <LikeScoreSection>
                  {[...Array(parseInt(like.score.toString()))].map((_, i) => (
                    <LikeScore key={i.toString()}>{"\u2605"}</LikeScore>
                  ))}
                </LikeScoreSection> */}
                        <LikeHeader>
                          <LikeBarName>{like.name}</LikeBarName>
                          <LikeDeleteButton
                            onClick={() => handleDeleteLikeClick(like.id)}
                          >
                            <RiDeleteBin5Line />
                          </LikeDeleteButton>
                        </LikeHeader>
                      </>
                    </LikeImg>
                  ))}
                </LikeSection>
              </InnerDiv>
            </OuterDiv>
          </>
        )}
        {collections === null ? (
          <p>Loading...</p>
        ) : (
          <>
            <CollectionTitle>
              The Bars you want to
              <strong style={{color: "#D19B18"}}>VISIT</strong> in the future
            </CollectionTitle>
            <OuterDiv>
              <InnerDiv>
                <CollectionSection>
                  {collections.map((collection, index) => (
                    <CollectionImg
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
                      <CollectionHeader>
                        <CollectionBarName>{collection.name}</CollectionBarName>
                        <CollectionDeleteButton
                          onClick={() =>
                            handleDeleteCollectionClick(collection.id)
                          }
                        >
                          <RiDeleteBin5Line />
                        </CollectionDeleteButton>
                      </CollectionHeader>
                    </CollectionImg>
                  ))}
                </CollectionSection>
              </InnerDiv>
            </OuterDiv>
          </>
        )}
      </Wrapper>
    </>
  );
};

export default MemberPage;
