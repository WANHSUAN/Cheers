import React, {useState, useEffect} from "react";
import styled from "styled-components/macro";
import {Link} from "react-router-dom";
import {db} from "../../App";
import {collection, getDocs, Timestamp} from "firebase/firestore";
import Calendar from "../Calendar/Calendar";
import MainMap from "./MainMap";
import Alert from "../../components/Alert/Alert";
import Hashtag from "./Hashtag";
import main from "../Question/main.png";
import {RxDoubleArrowDown} from "react-icons/rx";

const Wrapper = styled.div`
  text-align: center;
  width: 1100px;
  margin: 0 auto;
  padding-top: 60px;
`;

const SearchButton = styled(Link)`
  text-decoration: none;
`;

const StyledSearchButton = styled.button`
  width: 60px;
  height: 30px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const Slogan = styled.p`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  font-size: 130px;
  color: #fff;
  letter-spacing: 10px;
  text-align: center;
`;

const MainImg = styled.img`
  width: 100%;
  height: 550px;
  margin-top: 270px;
  vertical-align: bottom;
  object-fit: cover;
`;

const TitleSection = styled.div`
  text-align: center;
  margin-bottom: 50px;
  margin: 350px 0;
`;

const Title = styled.p`
  font-size: 70px;
  color: #fff;
  padding: 50px;
  text-align: center;
`;

const DoubleArrow = styled.button`
  height: 100px;
  color: #d19b18;
  font-size: 80px;
  background-color: rgba(255, 255, 255, 0);
  border: none;
  text-align: center;
  cursor: pointer;
`;

const AllBar = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const AllBarTitle = styled.h2``;

const BarSection = styled(Link)`
  text-decoration: none;
`;

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

interface IMainEvent {
  bar: string;
  content: string;
  time: Timestamp;
  id: string;
}

export interface IMainProps {}

const MainPage: React.FC<IMainProps> = (props: IMainProps) => {
  const [bars, setBars] = useState<IMainBar[]>([]);
  const [events, setEvents] = useState<IMainEvent[]>([]);
  const barsCollectionRef = collection(db, "bars");
  const eventsCollectionRef = collection(db, "events");

  useEffect(() => {
    const getBars = async () => {
      const data = await getDocs(barsCollectionRef);
      setBars(
        data.docs.map((doc) => ({...(doc.data() as IMainBar), id: doc.id}))
      );
    };

    const getEvents = async () => {
      const data = await getDocs(eventsCollectionRef);
      setEvents(
        data.docs.map((doc) => ({
          ...(doc.data() as IMainEvent),
          id: doc.id,
        }))
      );
    };

    getBars();
    getEvents();
  }, []);

  return (
    <Wrapper>
      <Alert events={events} />
      <StyledSearchButton>
        <SearchButton to={"/search"}>Search</SearchButton>
      </StyledSearchButton>
      <ImageContainer>
        <Slogan>
          YOUR
          <br />
          HAPPINESS
        </Slogan>
        <MainImg src={main} />
      </ImageContainer>
      <TitleSection>
        <Title>
          We've prepared various <br />
          types of bars for You!
        </Title>
        <DoubleArrow>
          <RxDoubleArrowDown />
        </DoubleArrow>
      </TitleSection>
      <Hashtag />
      <AllBarTitle>All Bar</AllBarTitle>

      <AllBar>
        {bars.map((bar: IMainBar) => {
          return (
            <BarSection to={`/bars/${bar.id}`} key={bar.id}>
              <BarTitle>{bar.name}</BarTitle>
              <BarImg src={bar.img[2]} />
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
