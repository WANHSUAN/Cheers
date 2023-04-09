import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {db} from "../../App";
import {collection, getDocs, doc, deleteDoc} from "firebase/firestore";

const Wrapper = styled.div`
  width: 800px;
  margin: 0 auto;
  background-color: beige;
`;

const MemberTitle = styled.h1`
  margin: 0;
  padding: 50px 0;
`;

const LikeTitle = styled.h2``;

const LikeSection = styled.ul`
  margin-bottom: 30px;
  display: flex;
  gap: 5px;
  padding: 0;
`;

const LikeCard = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 10px;
`;

const LikeScoreSection = styled.div`
  display: flex;
`;

const LikeScore = styled.li`
  color: #fff;
  list-style: none;
  text-align: center;
`;

const LikeDeleteButton = styled.button`
  width: 60px;
  height: 20px;
`;

const CollectionTitle = styled.h2``;

const CollectionSection = styled.ul`
  margin-bottom: 30px;
  display: flex;
  gap: 5px;
  padding: 0;
`;

const CollectionCard = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 10px;
`;

const CollectionScoreSection = styled.div`
  display: flex;
`;

const CollectionScore = styled.li`
  color: #fff;
  list-style: none;
  text-align: center;
`;

const CollectionDeleteButton = styled.button`
  width: 60px;
  height: 20px;
`;

interface ILikes {
  name: string;
  link: string;
  img: string;
  score: number;
  address: string;
  id: string;
}

interface ICollections {
  name: string;
  link: string;
  img: string;
  score: number;
  address: string;
  id: string;
}

export interface IMemberProps {}

const MemberPage: React.FC<IMemberProps> = (props: IMemberProps) => {
  const [likes, setLikes] = useState<ILikes[] | null>(null);
  const [collections, setCollections] = useState<ICollections[] | null>(null);
  const likesCollectionRef = collection(db, "likes");
  const collectionsCollectionRef = collection(db, "collections");
  useEffect(() => {
    const getDatas = async () => {
      const like = await getDocs(likesCollectionRef);
      const collection = await getDocs(collectionsCollectionRef);
      setLikes(
        like.docs.map((doc) => ({...(doc.data() as ILikes), id: doc.id}))
      );
      setCollections(
        collection.docs.map((doc) => ({
          ...(doc.data() as ICollections),
          id: doc.id,
        }))
      );
    };

    getDatas();
  }, []);

  const handleDeleteLikeClick = async () => {
    const likesRef = collection(db, "likes");
    const likesSnapshot = await getDocs(likesRef);

    let likeDocId;
    likesSnapshot.forEach((doc) => {
      likeDocId = doc.id;
    });

    if (likeDocId) {
      const likeRef = doc(db, "likes", likeDocId);
      await deleteDoc(likeRef);
    }
  };

  const handleDeleteScoreClick = async () => {
    const collectionsRef = collection(db, "collections");
    const collectionsSnapshot = await getDocs(collectionsRef);

    let collectionDocId;
    collectionsSnapshot.forEach((doc) => {
      collectionDocId = doc.id;
    });

    if (collectionDocId) {
      const collectionRef = doc(db, "collections", collectionDocId);
      await deleteDoc(collectionRef);
    }
  };

  return (
    <Wrapper>
      <MemberTitle>Hi!Sharon~</MemberTitle>
      {likes === null ? (
        <p>Loading...</p>
      ) : (
        <>
          {console.log(likes)}

          <LikeTitle>{"\u2661"}您收藏的酒吧</LikeTitle>
          <LikeSection>
            {likes.map((like, index) => (
              <LikeCard
                key={index}
                style={{
                  backgroundImage: `url(${like.img})`,
                  backgroundSize: "cover",
                }}
              >
                <LikeScoreSection>
                  {[...Array(parseInt(like.score.toString()))].map((_, i) => (
                    <LikeScore key={i.toString()}>{"\u2605"}</LikeScore>
                  ))}
                </LikeScoreSection>
                <LikeDeleteButton onClick={handleDeleteLikeClick}>
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
          {console.log(collections)}
          <CollectionTitle>{"\u2661"}您已去過的酒吧</CollectionTitle>
          <CollectionSection>
            {collections.map((collection, index) => (
              <CollectionCard
                key={index}
                style={{
                  backgroundImage: `url(${collection.img})`,
                  backgroundSize: "cover",
                }}
              >
                <CollectionScoreSection>
                  {[...Array(parseInt(collection.score.toString()))].map(
                    (_, i) => (
                      <CollectionScore key={i.toString()}>
                        {"\u2605"}
                      </CollectionScore>
                    )
                  )}
                </CollectionScoreSection>
                <CollectionDeleteButton onClick={handleDeleteScoreClick}>
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