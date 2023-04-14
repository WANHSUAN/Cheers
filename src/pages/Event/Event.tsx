import styled from "styled-components/macro";
import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {db} from "../../App";
import {getDoc, doc} from "firebase/firestore";

const Wrapper = styled.div`
  padding: 10px;
`;

const PageImg = styled.img`
  width: 100vw;
  height: 10%;
`;

const EventTitle = styled.h2``;

const EventContent = styled.p``;

// const EventTime = styled.div``;

const BarEnterButton = styled(Link)`
  text-decoration: none;
`;

const StyledBarEnterButton = styled.button`
  width: 150px;
  height: 30px;
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
  // const eventsRef = collection(db, "events");
  const {id} = useParams();
  const eventCollectionRef = id ? doc(db, "events", id) : undefined;
  // console.log(eventCollectionRef);

  useEffect(() => {
    // const getEvents = async () => {
    //   const data = await getDocs(eventsRef);
    //   setEvents(
    //     data.docs.map((doc) => ({
    //       ...(doc.data() as IEvent),
    //       id: doc.id,
    //     }))
    //   );
    // };
    // getEvents();
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
      <EventTitle>{event.bar}</EventTitle>
      {/* <EventTime>{event.time}</EventTime> */}
      <EventContent>{event.content}</EventContent>
      <StyledBarEnterButton>
        <BarEnterButton to={`/bars/${event.id}`} key={event.id}>
          Enter Event Bar
        </BarEnterButton>
      </StyledBarEnterButton>
    </Wrapper>
  );
};

export default EventPage;
