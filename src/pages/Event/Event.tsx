import {Timestamp, doc, getDoc} from "firebase/firestore";
import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import styled from "styled-components/macro";
import {BtnText, Button} from "../../components/Button/Button";
import {db} from "../../utils/firebase";

const PageImg = styled.img`
  padding-top: 60px;
  width: 100vw;
  height: 400px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 300px;
  }

  @media (max-width: 414px) {
    height: 200px;
  }
`;

const Wrapper = styled.div`
  max-width: 1000px;
  width: 80%;
  margin: 0 auto;
`;

const EventTitle = styled.h2`
  color: #d19b18;
  font-size: 40px;
  margin: 70px 80px 20px 50px;

  @media (max-width: 1024px) {
    margin-left: 0;
  }

  @media (max-width: 768px) {
    font-size: 30px;
  }
`;

const EventTime = styled.div`
  width: 100px;
  font-size: 30px;
  color: #fff;
  margin: 0 0 50px 50px;

  @media (max-width: 1024px) {
    margin-left: 0;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const InnerDiv = styled.div`
  max-width: 900px;
  width: 100%;
  height: 530px;
  border: 2px solid white;
  padding: 70px;
  margin-top: -25px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  @media (max-width: 1024px) {
    height: 450px;
    padding: 50px;
  }

  @media (max-width: 880px) {
    padding: 50px 20px;
  }
`;

const OuterDiv = styled.div`
  max-width: 900px;
  width: 100%;
  height: 500px;
  border: 2px solid white;
  padding: 10px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    height: 420px;
  }
`;

const EventContent = styled.div`
  width: 80%;
  color: #fff;
  font-size: 25px;
  line-height: 40px;
  align-items: center;

  @media (max-width: 1024px) {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    font-size: 18px;
    line-height: 30px;
  }

  @media (max-width: 580px) {
    font-size: 15px;
    line-height: 20px;
  }

  @media (max-width: 414px) {
    font-size: 12px;
  }
`;

const StyledEventButton = styled.button`
  max-width: 870px;
  width: 80%;
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

  useEffect(() => {
    window.scrollTo(0, 0);
    const getEvent = async () => {
      if (eventCollectionRef) {
        const barSnapshot = await getDoc(eventCollectionRef);
        setEvent({
          bar: barSnapshot.data()?.bar,
          content: barSnapshot.data()?.content,
          time: barSnapshot.data()?.time,
          id: barSnapshot.data()?.id,
          img: barSnapshot.data()?.img,
        });
      }
    };

    getEvent();
  }, [id]);

  if (event === undefined) {
    return <p>Loading...</p>;
  }
  const dateObj = new Date(event.time.seconds * 1000);
  const dateStr = dateObj.toLocaleDateString();

  return (
    <>
      <PageImg src={event.img} />
      <Wrapper>
        <EventTitle>{event.bar}</EventTitle>
        <EventTime>{dateStr}</EventTime>
        <OuterDiv>
          <InnerDiv>
            <EventContent>{event.content}</EventContent>
          </InnerDiv>
        </OuterDiv>
        <StyledEventButton>
          <EventButton to={`/bars/${event.id}`} key={event.id}>
            <Button fontSize="20px" marginLeft="0px">
              <BtnText fontSize="20px" marginLeft="0px">
                Go to the Bar Event!
              </BtnText>
            </Button>
          </EventButton>
        </StyledEventButton>
      </Wrapper>
    </>
  );
};

export default EventPage;
