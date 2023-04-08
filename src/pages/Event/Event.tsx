import React from "react";
import styled from "styled-components/macro";
// import {useState, useEffect} from "react";
// import {db} from "../../App";
// import {collection, getDocs} from "firebase/firestore";

const Wrapper = styled.div`
  background-color: #834923;
  color: #fff;
  padding: 10px;
`;

const EventTitle = styled.h1`
  text-align: center;
`;

function Event() {
  return (
    <Wrapper>
      <EventTitle>This is Event Page!</EventTitle>
    </Wrapper>
  );
}

export default Event;
