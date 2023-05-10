import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import styled, {keyframes} from "styled-components/macro";
import {AuthContext} from "../../Context/AuthContext";
// import {Link} from "react-scroll";
import {collection, getDocs, Timestamp} from "firebase/firestore";
import {db} from "../../utils/firebase";
import Calendar from "../Calendar/Calendar";
import main from "../Question/main.png";
import Hashtag from "./Hashtag";
import MainMap from "./MainMap";
import "./styles.css";

const Wrapper = styled.div`
  text-align: center;
  width: 1100px;
  margin: 0 auto;
  padding-top: 60px;
  font-size: 16px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const ArrowWrapper = styled.div`
  cursor: pointer;
  margin-top: 50px;
  display: table;
  width: 100%;
  height: 100%;
`;

const WrapperInner = styled.div`
  display: table-cell;
  vertical-align: middle;
  width: 100%;
  height: 100%;
`;

const elasticus = keyframes`
  0% {
    transform-origin: 0% 0%;
    transform: scale(1, 0);
  }
  50% {
    transform-origin: 0% 0%;
    transform: scale(1, 1);
  }
  50.1% {
    transform-origin: 0% 100%;
    transform: scale(1, 1);
  }
  100% {
    transform-origin: 0% 100%;
    transform: scale(1, 0);
  }
`;

const ScrollDown = styled.div`
  display: block;
  position: relative;
  padding-top: 79px;
  text-align: center;

  &::before {
    content: " ";
    animation: ${elasticus} 1.2s cubic-bezier(1, 0, 0, 1) infinite;
    position: absolute;
    top: 0px;
    left: 50%;
    margin-left: -1px;
    width: 2px;
    height: 90px;
    background: #d19b18;
  }
`;

const ArrowDown = styled.span`
  display: block;
  margin: 0 auto;
  width: 10px;
  height: 80px;

  &::after {
    content: "";
    display: block;
    margin: 0;
    padding: 0;
    width: 8px;
    height: 8px;
    border-top: 2px solid #d19b18;
    border-right: 2px solid #d19b18;
    behavior: url(-ms-transform.htc);
    transform: rotate(135deg);
  }
`;

const ScrollTitle = styled.span`
  display: block;
  text-transform: uppercase;
  color: #d19b18;
  font-size: 2rem;
  font-weight: bold;
`;

const Jump = keyframes`
  from, to { transform: scale(1, 1); }
  25% { transform: scale(0.95, 1.05); }
  50% { transform: scale(1.05, 0.95); }
  75% { transform: scale(0.955, 1.055); }
`;

const Test = styled(Link)`
  width: 100px;
  height: 100px;
  position: fixed;
  bottom: 250px;
  right: 50px;
  z-index: 1;
  border: none;
  font-size: 0.5rem;
  background-color: #d19b18;
  color: #fff;
  border-radius: 50%;
  padding-top: 20px;
  cursor: pointer;
  overflow: hidden;
  animation: ${Jump} 1s infinite;

  &:hover {
    background-color: #fff;
    color: #d19b18;
    transition: ease 0.5s;
  }
`;

const ScrollButton = styled.button`
  width: 100px;
  height: 100px;
  position: fixed;
  bottom: 110px;
  right: 50px;
  z-index: 1;
  border: none;
  font-size: 1.5rem;
  background-color: #d19b18;
  color: #fff;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #fff;
    color: #d19b18;

    transition: ease 0.5s;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Slogan = styled.p`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  font-size: 8rem;
  color: #fff;
  letter-spacing: 10px;
  text-align: center;
  animation: ${fadeIn} 1.5s ease-in-out;
`;

const MainImg = styled.img`
  width: 100%;
  height: 550px;
  margin-top: 270px;
  vertical-align: bottom;
  object-fit: cover;
`;

const fadeInPosition = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Title = styled.div`
  font-size: 4rem;
  color: #fff;
  padding: 50px;
  text-align: center;
  margin: 300px 0;

  animation: ${fadeInPosition} 1s ease-in-out;
`;

const AllBarTitleSection = styled.div`
  text-align: left;
`;

const AllBarSubTitle = styled.p`
  color: #d19b18;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const AllBarTitle = styled.h2`
  color: #fff;
  font-size: 4rem;
  margin-bottom: 20px;
`;

const AllBarSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin: 100px 0;
  justify-content: center;
`;

const BarSection = styled(Link)`
  text-decoration: none;
`;

const BarTitle = styled.div`
  width: 250px;
  font-size: 1rem;
  font-family: "Noto Sans TC", sans-serif;
  padding-top: 10px;
  color: #ffffffb9;
  margin: 20px 0;
`;

const CalendarSection = styled.div``;

const CalendarSubTitle = styled.p`
  color: #d19b18;
  margin: 200px 0 10px 0;
  font-size: 2rem;
`;

const CalendarTitle = styled.h2`
  color: #fff;
  margin-bottom: 150px;
  font-size: 4rem;
`;

const CalendarColorSection = styled.div`
  width: 800px;
  display: flex;
  justify-content: right;
  margin-left: 50px;
`;

const ColorItem = styled.div`
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ColorToday = styled.div`
  width: 30px;
  height: 30px;
  background-color: #c48370;
  border-radius: 50%;
`;
const ColorEvent = styled.div`
  width: 30px;
  height: 30px;
  background-color: #ff8800a0;
  border-radius: 50%;
`;
const ColorSelected = styled.div`
  width: 30px;
  height: 30px;
  background-color: #e6af70b7;
  border-radius: 50%;
`;

const ColorName = styled.div`
  color: #fff;
  font-size: 1.5rem;
  padding: 20px;
`;

const MapSubTitle = styled.p`
  font-size: 2rem;
  margin: 200px 0 10px 0;
  color: #d19b18;
`;

const MapTitle = styled.p`
  font-size: 4rem;
  color: #fff;
`;

const AlertWrapper = styled.div`
  position: absolute;
  top: 35%;
  left: 32%;
  z-index: 3;
  animation: ${fadeIn} 1s ease-in-out;
`;

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #0000009d;
  position: fixed;
  z-index: 2;
`;

const AlertSection = styled.div`
  width: 700px;
  height: 400px;
  background-color: #d19a18df;
  box-shadow: 5px 5px 5px #ffffff50;
  color: #ffffffe3;
  border-radius: 20px;
  text-align: left;
  padding: 40px;
  position: absolute;
  top: 50%;
  left: 20%;
`;

const AlertMessage = styled.div`
  font-size: 2rem;
  padding: 40px 20px;
  line-height: 60px;
`;

const AlertCheck = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
`;

const ButtonSection = styled.div``;

const CheckboxWrapper = styled.label`
  display: flex;
  width: 250px;
  text-align: left;
  margin: 30px;
`;

// const CheckboxInput = styled.input`
//   vertical-align: middle;
//   width: 30px;
//   height: 30px;
// `;

const CheckboxLabel = styled.span`
  font-size: 30px;
  margin-left: 10px;
`;

const StyledEnterButton = styled.button`
  width: 120px;
  height: 50px;
  border: none;
  font-size: 20px;
  border-radius: 8px;
  box-shadow: 3px 3px 8px #605d5d82;
  background-color: #ffffffe3;

  &:hover {
    background-color: #edb06e;
    transform: translateY(-3px);
    transition: ease 0.5s;
    cursor: pointer;
  }
`;

const EnterButton = styled(Link)`
  text-decoration: none;
  color: #000;

  &:hover {
    color: #000;
  }
`;

const CloseButton = styled.button`
  width: 120px;
  height: 50px;
  font-size: 20px;
  border: none;
  border-radius: 8px;
  margin-left: 20px;
  color: #000;
  box-shadow: 3px 3px 8px #605d5d82;
  background-color: #ffffffe3;

  &:hover {
    background-color: #edb06e;
    transform: translateY(-3px);
    transition: ease 0.5s;
    cursor: pointer;
  }
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

interface IAlertEvent {
  time: {
    seconds: number;
  };
  bar: string;
  id: string;
}

export interface IMainProps {}

const MainPage: React.FC<IMainProps> = (props: IMainProps) => {
  const [bars, setBars] = useState<IMainBar[]>([]);
  const [events, setEvents] = useState<IMainEvent[]>([]);
  const [showMore, setShowMore] = useState(false);
  const barsCollectionRef = collection(db, "bars");
  const eventsCollectionRef = collection(db, "events");
  const [showButton, setShowButton] = useState(false);
  // const [showScrollButton, setShowScrollButton] = useState(true);
  // const [section2, setSection2] = useState<HTMLElement | undefined>(undefined);
  const {isLogin} = useContext(AuthContext);
  const navigate = useNavigate();

  // const handleScroll = () => {
  //   // 檢查當前位置是否已到達指定部分
  //   const section2 = document.getElementById("section2");
  //   if (!section2) return; // 如果 section2 不存在，不做任何處理
  //   if (
  //     section2 &&
  //     section2.getBoundingClientRect().top <= window.innerHeight
  //   ) {
  //     setShowScrollButton(false); // 隱藏按鈕
  //   } else if (section2 && window.scrollY < section2.offsetTop) {
  //     setShowScrollButton(true); // 顯示按鈕
  //   }
  //   if (window.scrollY === 0) {
  //     setShowScrollButton(true); // 畫面到頂部時顯示按鈕
  //   }
  // };

  // const scrollToSection2 = () => {
  //   // 捲動到指定部分
  //   const section2 = document.getElementById("section2");
  //   if (section2) {
  //     window.scrollTo({
  //       top: section2.offsetTop,
  //       behavior: "smooth",
  //     });
  //   }
  // };

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

    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

    // window.addEventListener("scroll", handleScroll);

    // 獲取 section2 元素
    // const section2El = document.getElementById("section2");
    // if (!section2El) return; // 如果 section2 不存在，不做任何處理
    // setSection2(section2El);

    // return () => {
    //   // 在元件解除掛載前，取消事件監聽器
    //   window.removeEventListener("scroll", handleScroll);
    // };
  }, []);

  if (bars.length === 0) {
    return <p>Loading...</p>;
  }

  const slicedData = bars.slice(0, 8);

  const handleShowMore = () => {
    setShowMore(true);
  };

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (isLogin) {
    console.log("登入");
  } else {
    console.log("登出");
    navigate("/");
  }

  return (
    <>
      <Wrapper>
        <Alert events={events} />
        <ImageContainer>
          <Slogan>
            YOUR
            <br />
            HAPPINESS
          </Slogan>
          <MainImg src={main} />
        </ImageContainer>
        {/* {showButton && (
          <Link to="section2" smooth={true} onClick={scrollToSection2}>
            <div className="encircle bounce animated">
              <div className="arrow"></div>
            </div>
          </Link>
        )} */}
        <ArrowWrapper>
          <WrapperInner>
            <ScrollDown>
              <ArrowDown></ArrowDown>
              <ScrollTitle>Scroll down</ScrollTitle>
            </ScrollDown>
          </WrapperInner>
        </ArrowWrapper>
        <div id="section2"></div>

        <Title>
          <div className="sign">
            <span className="flicker">We've</span>
            <span className="flicker">prepared</span>
            <span className="flicker">various</span>
          </div>
          <div className="signSecond">
            <span className="fast-flicker">Types of BARS</span>
            <span className="flicker">for You!</span>
          </div>
        </Title>
        <Test to={"/question"} className="selectBar">
          <span>Select Your Type!</span>
          <div className="liquid"></div>
        </Test>

        {showButton && (
          <ScrollButton onClick={handleScrollTop}>Scroll To Top</ScrollButton>
        )}
        <Hashtag />
        <AllBarTitleSection>
          <AllBarSubTitle id="allbars" style={{scrollMarginTop: "-96vh"}}>
            ALL BARS LIST
          </AllBarSubTitle>
          <AllBarTitle>
            The adventure <br />
            starts now
          </AllBarTitle>
        </AllBarTitleSection>
        <AllBarSection>
          {slicedData.map((item) => (
            <BarSection to={`/bars/${item.id}`} key={item.id}>
              <BarTitle>
                <div className="link">
                  <svg
                    viewBox="0 0 200 200"
                    width="100"
                    height="100"
                    xmlns="http://www.w3.org/2000/svg"
                    className="link__svg"
                    aria-labelledby="link1-title link1-desc"
                  >
                    <defs>
                      <clipPath id="circle-clip">
                        <path d="M 20, 100 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />
                      </clipPath>
                    </defs>
                    <image
                      className="link__image"
                      xlinkHref={item.img[2]}
                      clipPath="url(#circle-clip)"
                      height="100%"
                      width="100%"
                      preserveAspectRatio="xMidYMid slice"
                    />
                    <path
                      id="link-circle"
                      className="link__path"
                      d="M 20, 100 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                      stroke="none"
                      fill="none"
                    />
                    <text className="link__text" textLength="480" dy="-8px">
                      <textPath href="#link-circle" stroke="none">
                        {`${item.name.toUpperCase()}   ${item.name.toUpperCase()}`}
                      </textPath>
                    </text>
                  </svg>
                </div>
              </BarTitle>
            </BarSection>
          ))}
          {!showMore && (
            <button className="more" onClick={handleShowMore}>
              More
            </button>
          )}
          {showMore && (
            <>
              {bars.slice(8).map((bar) => (
                <BarSection to={`/bars/${bar.id}`} key={bar.id}>
                  <BarTitle>
                    <div className="link">
                      <svg
                        viewBox="0 0 200 200"
                        width="100"
                        height="100"
                        xmlns="http://www.w3.org/2000/svg"
                        className="link__svg"
                        aria-labelledby="link1-title link1-desc"
                      >
                        <defs>
                          <clipPath id="circle-clip">
                            <path d="M 20, 100 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />
                          </clipPath>
                        </defs>
                        <image
                          className="link__image"
                          xlinkHref={bar.img[2]}
                          clipPath="url(#circle-clip)"
                          height="100%"
                          width="100%"
                          preserveAspectRatio="xMidYMid slice"
                        />
                        <path
                          id="link-circle"
                          className="link__path"
                          d="M 20, 100 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                          stroke="none"
                          fill="none"
                        />
                        <text className="link__text" textLength="480" dy="-8px">
                          <textPath href="#link-circle" stroke="none">
                            {bar.name.toUpperCase()} {bar.name.toUpperCase()}
                          </textPath>
                        </text>
                      </svg>
                    </div>
                  </BarTitle>
                </BarSection>
              ))}
            </>
          )}
        </AllBarSection>
        <CalendarSection>
          <CalendarSubTitle>BAR EVENTS</CalendarSubTitle>
          <CalendarTitle>It's time to join the Bar Event!</CalendarTitle>
          <CalendarColorSection>
            <ColorItem>
              <ColorToday />
              <ColorName>Today</ColorName>
            </ColorItem>
            <ColorItem>
              <ColorEvent />
              <ColorName>Event</ColorName>
            </ColorItem>
            <ColorItem>
              <ColorSelected />
              <ColorName>Selected</ColorName>
            </ColorItem>
          </CalendarColorSection>
          <Calendar />
        </CalendarSection>
        <MapSubTitle>LOCATION</MapSubTitle>
        <MapTitle>Where is the Bar?</MapTitle>
        <MainMap />
      </Wrapper>
    </>
  );
};

const Alert = ({events}: {events: IAlertEvent[]}) => {
  const [showAlert, setShowAlert] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [showBackground, setShowBackground] = useState(true);

  function shouldShowAlert() {
    const cookies = document.cookie.split("; ");
    const hideAlertCookie = cookies.find((cookie) =>
      cookie.startsWith("hideAlert=")
    );
    return !hideAlertCookie || hideAlertCookie.split("=")[1] !== "true";
  }

  if (!shouldShowAlert()) {
    return null;
  }

  if (events.length === 0) {
    return null;
  }

  const isToday = new Date().toDateString();

  const hasEvent = events.map((event) => {
    const eventDate = new Date(event.time.seconds * 1000);
    return eventDate.toDateString() === isToday;
  });

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsChecked(!isChecked);
    document.cookie = `hideAlert=true; expires=${new Date(
      Date.now() + 86400000
    ).toUTCString()};`;
  }

  function handleCloseClick() {
    setShowAlert(false);
    setShowBackground(false);
  }

  return (
    <>
      {showBackground && <Background />}
      <AlertWrapper>
        {showAlert &&
          events.map((event, index) => {
            return hasEvent[index] ? (
              <AlertSection key={index}>
                <AlertMessage>
                  今日{" "}
                  <span style={{color: "black", fontWeight: "700"}}>
                    {event.bar}
                  </span>{" "}
                  有特別活動！
                  <br />
                  邀請您來共襄盛舉～
                </AlertMessage>
                <AlertCheck>
                  <CheckboxWrapper>
                    {/* <CheckboxInput */}
                    {/* type="checkbox"
                      checked={ischecked}
                      onChange={handleOnChange}
                    > */}
                    <link
                      rel="stylesheet"
                      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
                    />
                    <div className="center">
                      <label className="label">
                        <input
                          className="label__checkbox"
                          type="checkbox"
                          checked={isChecked}
                          onChange={handleOnChange}
                        />
                        <span className="label__text">
                          <span className="label__check">
                            <i className="fa fa-check icon"></i>
                          </span>
                        </span>
                      </label>
                    </div>
                    {/* </CheckboxInput> */}
                    <CheckboxLabel>今日不再顯示</CheckboxLabel>
                  </CheckboxWrapper>
                  <ButtonSection>
                    <StyledEnterButton>
                      <EnterButton to={`/events/${event.id}`} key={event.id}>
                        Enter
                      </EnterButton>
                    </StyledEnterButton>
                    <CloseButton onClick={handleCloseClick}>Close</CloseButton>
                  </ButtonSection>
                </AlertCheck>
              </AlertSection>
            ) : null;
          })}
      </AlertWrapper>
    </>
  );
};

export default MainPage;
