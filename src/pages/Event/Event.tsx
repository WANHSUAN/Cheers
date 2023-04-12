import styled from "styled-components/macro";
import {useState, useEffect} from "react";
import {db} from "../../App";
import {collection, getDocs} from "firebase/firestore";
import party from "./EventImg/party.jpg";

const Wrapper = styled.div`
  padding: 10px;
`;

const PageImg = styled.img`
  width: 100vw;
  height: 10%;
`;

const EventTitle = styled.h2``;

interface IEvent {
  bar: string;
  content: string;
  time: Timestamp;
}

export interface IEventProps {}

const EventPage: React.FC<IEventProps> = (props: IEventProps) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const eventsRef = collection(db, "events");

  useEffect(() => {
    const getEvents = async () => {
      const data = await getDocs(eventsRef);
      setEvents(
        data.docs.map((doc) => ({
          ...(doc.data() as IEvent),
          id: doc.id,
        }))
      );
    };
    getEvents();
  }, []);

  if (events.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <Wrapper>
      <PageImg src={party} />
      {events.map((event, index) => {
        // console.log(event.bar);
        return <EventTitle key={index}>{event.bar}</EventTitle>;
      })}
    </Wrapper>
  );
};

export default EventPage;
