import styled from "styled-components/macro";
import {Link, useNavigate} from "react-router-dom";
import {useState, useEffect, useContext} from "react";
import {AuthContext} from "../../Context/AuthContext";
import {useParams} from "react-router-dom";
import {db} from "../../App";
import {getDoc, doc, Timestamp} from "firebase/firestore";

const Wrapper = styled.div`
  padding: 10px;
  padding-top: 60px;
`;

const PageImg = styled.img`
  width: 100vw;
  height: 400px;
  object-fit: cover;
`;

const EventTitle = styled.h2`
  color: #d19b18;
  font-size: 40px;
  margin: 70px 80px 20px 0;
`;

const InnerDiv = styled.div`
  width: 100%;
  height: 430px;
  border: 2px solid white;
  padding: 70px;
  margin-top: -25px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const OuterDiv = styled.div`
  width: 100%;
  height: 400px;
  border: 2px solid white;
  padding: 10px;
  margin: 0 auto;
`;

const EventSection = styled.div`
  width: 1000px;
  margin: 0 auto;
`;

const EventContent = styled.div`
  width: 80%;
  color: #fff;
  font-size: 25px;
  line-height: 40px;
  align-items: center;
`;

const EventTime = styled.div`
  width: 100px;
  height: 100px;
  font-size: 30px;
  color: #fff;
  margin-bottom: 50px;
`;

const StyledEventButton = styled.button`
  width: 870px;
  border: none;
  padding: 50px;
  background-color: rgba(255, 255, 255, 0);
  cursor: pointer;
  text-align: right;
`;

const EventButton = styled(Link)`
  text-decoration: none;
  color: #d19b18;
  font-size: 30px;
`;

interface IEvent {
  bar: string;
  content: string;
  time: Timestamp;
  id: string;
  img: string;
}

export interface IEventProps {}

const EventPage: React.FC<IEventProps> = (props: IEventProps) => {
  const [event, setEvent] = useState<IEvent>();
  const {id} = useParams();
  const eventCollectionRef = id ? doc(db, "events", id) : undefined;
  const {user, userUID, isLogin, signIn} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    async function getEvent() {
      if (eventCollectionRef) {
        const barSnapshot = await getDoc(eventCollectionRef);
        setEvent(barSnapshot.data() as any);
      }
    }

    getEvent();
  }, [id]);

  if (event === undefined) {
    return <p>Loading...</p>;
  }
  const dateObj = new Date(
    event.time.seconds * 1000 + event.time.nanoseconds / 1000000
  );
  const dateStr = dateObj.toLocaleDateString(); // 格式為 YYYY/MM/DD
  if (isLogin) {
    console.log("登入");
  } else {
    console.log("登出");
    navigate("/");
  }
  return (
    <Wrapper>
      <PageImg src={event.img} />
      <EventSection>
        <EventTitle>{event.bar}</EventTitle>
        <EventTime>{dateStr}</EventTime>
        <OuterDiv>
          <InnerDiv>
            <EventContent>{event.content}</EventContent>
          </InnerDiv>
        </OuterDiv>
        <StyledEventButton>
          <EventButton to={`/bars/${event.id}`} key={event.id}>
            <div className="btn">
              <span className="btn__circle"></span>
              <span className="btn__white-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="icon-arrow-right"
                  viewBox="0 0 21 12"
                >
                  <path d="M17.104 5.072l-4.138-4.014L14.056 0l6 5.82-6 5.82-1.09-1.057 4.138-4.014H0V5.072h17.104z"></path>
                </svg>
              </span>
              <span className="btn__text">Go to the Bar Event!</span>
            </div>
          </EventButton>
        </StyledEventButton>
      </EventSection>
    </Wrapper>
  );
};

export default EventPage;
