import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {db} from "../App";
import {collection, getDocs} from "firebase/firestore";

const Wrapper = styled.div``;

const BarSection = styled.div`
  width: 700px;
  margin: 0 auto;
  background-color: beige;
  text-align: center;
`;

const BarTitle = styled.h1`
  font-size: 40px;
  padding-top: 10px;
`;

const BarImg = styled.img`
  width: 500px;
  height: 350px;
  padding-bottom: 10px;
`;

interface IMainBar {
  id: string;
  name: string;
  img: string;
}

export interface IMainProps {}

const MainPage: React.FC<IMainProps> = (props: IMainProps) => {
  const [bars, setBars] = useState<IMainBar[]>([]);
  const barsCollectionRef = collection(db, "bars");

  useEffect(() => {
    const getBars = async () => {
      const data = await getDocs(barsCollectionRef);
      setBars(
        data.docs.map((doc) => ({...(doc.data() as IMainBar), id: doc.id}))
      );
    };

    getBars();
  }, []);
  return (
    <Wrapper>
      {bars.map((bar: IMainBar) => {
        return (
          <BarSection key={bar.id}>
            <BarTitle>{bar.name}</BarTitle>
            <BarImg src={bar.img[0]} />
          </BarSection>
        );
      })}
    </Wrapper>
  );
};

export default MainPage;
