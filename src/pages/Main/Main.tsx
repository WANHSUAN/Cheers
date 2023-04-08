import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {db} from "../../App";
import {collection, getDocs} from "firebase/firestore";
import Calendar from "../Calendar/Calendar";
import MainMap from "./MainMap";

const Wrapper = styled.div`
  text-align: center;
  width: 1100px;
  margin: 0 auto;
`;

const AllBar = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const AllBarTitle = styled.h2``;

const BarSection = styled.div``;

const BarTitle = styled.h1`
  font-size: 20px;
  padding-top: 10px;
`;

const BarImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  padding: 10px;
`;

const CalendarTitle = styled.h2``;

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
      <AllBarTitle>All Bar</AllBarTitle>
      <AllBar>
        {bars.map((bar: IMainBar) => {
          return (
            <BarSection key={bar.id}>
              <BarTitle>{bar.name}</BarTitle>
              <BarImg src={bar.img[0]} />
            </BarSection>
          );
        })}
      </AllBar>
      <MainMap />
      <CalendarTitle>Calendar</CalendarTitle>

      <Calendar />
    </Wrapper>
  );
};

export default MainPage;
