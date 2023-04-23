import styled from "styled-components/macro";
import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {db} from "../../App";
import {getDoc, doc} from "firebase/firestore";
import {RxDoubleArrowRight} from "react-icons/rx";

const Wrapper = styled.div`
  padding: 10px;
  padding-top: 60px;
  letter-spacing: 3px;
`;

const PageImg = styled.img`
  width: 100vw;
  height: 400px;
  object-fit: cover;
`;

const EventTitle = styled.h2`
  color: #d19b18;
  font-size: 40px;
  margin: 70px 80px 80px 0;
`;

const InnerDiv = styled.div`
  width: 100%;
  height: 430px;
  border: 2px solid white;
  padding: 10px;
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
  font-size: 23px;
  margin-top: 130px;
  line-height: 30px;
`;

// const EventTime = styled.div``;

const StyledBarEnterButton = styled.div`
  width: 1000px;
  height: 30px;
  border: none;
  background-color: rgba(255, 255, 255, 0);
  cursor: pointer;
  border: none;
  font-size: 30px;
  margin: 80px 0 150px 0;
  display: flex;
  justify-content: right;
`;

const BarEnterButton = styled(Link)`
  text-decoration: none;
  color: #fff;
`;

const StyledDoubleArrow = styled.button`
  height: 50px;
  color: #fff;
  font-size: 30px;
  background-color: rgba(255, 255, 255, 0);
  border: none;
  text-align: center;
  cursor: pointer;
  justify-content: center;
`;

interface IEvent {
  bar: string;
  content: string;
  // time: {};
  id: string;
  img: string;
}

export interface IEventProps {}

const EventPage: React.FC<IEventProps> = (props: IEventProps) => {
  const [event, setEvent] = useState<IEvent>();

  const {id} = useParams();
  const eventCollectionRef = id ? doc(db, "events", id) : undefined;

  useEffect(() => {
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

  return (
    <Wrapper>
      <PageImg src={event.img} />
      <EventSection>
        <EventTitle>{event.bar}</EventTitle>
        {/* <EventTime>{event.time}</EventTime> */}
        <OuterDiv>
          <InnerDiv>
            <EventContent>{event.content}</EventContent>
          </InnerDiv>
        </OuterDiv>

        <StyledBarEnterButton>
          <BarEnterButton to={`/bars/${event.id}`} key={event.id}>
            EXPLORE THE BAR
          </BarEnterButton>
          <StyledDoubleArrow>
            <RxDoubleArrowRight />
          </StyledDoubleArrow>
        </StyledBarEnterButton>
      </EventSection>
    </Wrapper>
  );
};

export default EventPage;
