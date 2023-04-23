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

// const SearchButton = styled(Link)`
//   text-decoration: none;
// `;

// const StyledSearchButton = styled.button`
//   width: 60px;
//   height: 30px;
// `;

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

const AllBarTitleSection = styled.div`
  text-align: left;
`;

const AllBarSubTitle = styled.p`
  color: #d19b18;
  font-size: 20px;
  margin-bottom: 20px;
`;

const AllBarTitle = styled.h2`
  color: #fff;
  font-size: 40px;
  margin-bottom: 20px;
`;

const AllBarSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin: 100px 0;
  justify-content: center;
`;

const BarSection = styled(Link)`
  text-decoration: none;
`;

const BarTitle = styled.h1`
  width: 250px;
  font-size: 20px;
  padding-top: 10px;
  color: #fff;
  margin: 20px 0;
`;

const BarImg = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  padding: 10px;
  border: 1px solid #fff;
  margin-right: 10px;
`;

const MoreBarsButton = styled.button`
  padding: 13px 40px;
  border: 1px solid #fff;
  background-color: #000;
  color: #fff;
  border-radius: 5px;
  font-size: 15px;
  margin-top: 80px;
  cursor: pointer;

  &:hover {
    background-color: #d19b18;
    color: #000;
  }
`;

const CalendarSubTitle = styled.p`
  color: #d19b18;
  margin: 200px 0 10px 0;
  font-size: 20px;
`;

const CalendarTitle = styled.h2`
  color: #fff;
  margin-bottom: 150px;
  font-size: 40px;
`;

interface IMainBar {
  id: string;
  name: string;
  img: string;
  description: string;
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
  const [showMore, setShowMore] = useState(false);
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

  if (bars.length === 0) {
    return <p>Loading...</p>;
  }

  const slicedData = bars.slice(0, 8);

  // 當按鈕被點擊時，將 showMore 設為 true
  const handleShowMore = () => {
    setShowMore(true);
  };

  return (
    <Wrapper>
      <Alert events={events} />
      {/* <StyledSearchButton>
        <SearchButton to={"/search"}>Search</SearchButton>
      </StyledSearchButton> */}
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
      <AllBarTitleSection>
        <AllBarSubTitle>ALL BARS LIST</AllBarSubTitle>
        <AllBarTitle>
          The adventure <br />
          starts now
        </AllBarTitle>
      </AllBarTitleSection>
      <AllBarSection>
        {slicedData.map((item) => (
          <BarSection to={`/bars/${item.id}`} key={item.id}>
            <BarTitle>{item.name}</BarTitle>
            <BarImg src={item.img[2]} />
          </BarSection>
        ))}
        {!showMore && (
          <MoreBarsButton onClick={handleShowMore}>More Bars</MoreBarsButton>
        )}
        {showMore && (
          <>
            {bars.slice(8).map((bar) => (
              <BarSection to={`/bars/${bar.id}`} key={bar.id}>
                <BarTitle>{bar.name}</BarTitle>
                <BarImg src={bar.img[2]} />
              </BarSection>
            ))}
          </>
        )}
      </AllBarSection>
      <MainMap />
      <CalendarSubTitle>EVENTS</CalendarSubTitle>
      <CalendarTitle>It's time to join the Event</CalendarTitle>
      <Calendar />
    </Wrapper>
  );
};

export default MainPage;
