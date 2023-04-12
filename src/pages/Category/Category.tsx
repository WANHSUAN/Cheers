import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {db} from "../../App";
import {collection, getDocs} from "firebase/firestore";

const Wrapper = styled.div`
  width: 300px;
  height: 500px;
`;

function Category() {
  return <Wrapper>Category Page</Wrapper>;
}

export default Category;
