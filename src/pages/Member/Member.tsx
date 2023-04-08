import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {db} from "../../App";
import {collection, getDocs} from "firebase/firestore";
import {getFCP} from "web-vitals";

const Wrapper = styled.div`
  width: 800px;
  margin: 0 auto;
  background-color: beige;
`;

const MemberTitle = styled.h1`
  margin: 0;
  padding: 50px 0;
`;

const LikeSection = styled.div`
  height: 500px;
  margin-bottom: 30px;
`;

const LikeTitle = styled.h2``;

const LikeCard = styled.div`
  width: 150px;
  height: 150px;
  background-color: #87c3e1;
  border-radius: 50%;
`;

const CollectionSection = styled.div`
  height: 500px;
`;

const CollectionTitle = styled.h2``;

const CollectionCard = styled.div``;

interface IMember {}

export interface IMemberProps {}

const MemberPage: React.FC<IMemberProps> = (props: IMemberProps) => {
  const [likes, setLikes] = useState<IMember[] | null>(null);
  const [collections, setCollections] = useState<IMember[] | null>(null);
  const likesCollectionRef = collection(db, "likes");
  const collectionsCollectionRef = collection(db, "collections");
  useEffect(() => {
    const getDatas = async () => {
      const like = await getDocs(likesCollectionRef);
      const collection = await getDocs(collectionsCollectionRef);
      setLikes(
        like.docs.map((doc) => ({...(doc.data() as IMember), id: doc.id}))
      );
      setCollections(
        collection.docs.map((doc) => ({...(doc.data() as IMember), id: doc.id}))
      );
    };

    getDatas();
  }, []);

  return (
    <>
      <Wrapper>
        <MemberTitle>Hi!Sharon~</MemberTitle>
        {likes === null ? (
          <p>Loading...</p>
        ) : (
          <LikeSection>
            <LikeTitle>{"\u2661"}您收藏的酒吧</LikeTitle>
            <LikeCard></LikeCard>
          </LikeSection>
        )}
        {collections === null ? (
          <p>Loading...</p>
        ) : (
          <CollectionSection>
            <CollectionTitle>{"\u2661"}您已去過的酒吧</CollectionTitle>
            <CollectionCard></CollectionCard>
          </CollectionSection>
        )}
      </Wrapper>
    </>
  );
};

export default MemberPage;
