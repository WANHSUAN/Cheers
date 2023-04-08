// import React, {useState, useEffect} from "react";
import styled from "styled-components";
// import {db} from "../../App";
// import {collection, getDocs} from "firebase/firestore";

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

function Member() {
  return (
    <Wrapper>
      <MemberTitle>Hi!Sharon~</MemberTitle>
      <LikeSection>
        <LikeTitle>{"\u2661"}您收藏的酒吧</LikeTitle>
        <LikeCard></LikeCard>
      </LikeSection>
      <CollectionSection>
        <CollectionTitle>{"\u263A"}您去過的酒吧</CollectionTitle>
        <CollectionCard></CollectionCard>
      </CollectionSection>
    </Wrapper>
  );
}

export default Member;
