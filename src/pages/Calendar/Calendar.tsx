import {collection, getDocs} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import {SlArrowLeft, SlArrowRight} from "react-icons/sl";
import {TiDeleteOutline} from "react-icons/ti";
import {Link} from "react-router-dom";
import styled from "styled-components/macro";
import {BtnText, Button} from "../../components/Button/Button";
import {db} from "../../utils/firebase";

const CalendarWrapper = styled.div`
  max-width: 800px;
  width: 100%;
  margin-left: 50px;
  position: relative;
  border-radius: 5px;
  font-size: 16px;
  margin: 0 auto;
`;

const CalendarSection = styled.div`
  max-width: 800px;
  width: 85%;
  height: 720px;
  background-color: #ffffff33;
  border: 1px solid #ffffff7c;
  box-shadow: 2px 3px 10px #a27610;
  margin: 0 auto;
  border-radius: 10px;

  @media (max-width: 1024px) {
    height: 620px;
  }

  @media (max-width: 580px) {
    height: 310px;
  }
`;

const CalendarSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px;
  border-radius: 8px 8px 0 0;
  color: #fff;

  @media (max-width: 580px) {
    padding: 20px;
  }
`;

const CalendarWeekdaysSection = styled.div`
  display: flex;
  justify-content: space-between;
  color: #fff;
`;

const CalendarButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #fff;
  margin: 0 20px;
  padding-top: 15px;

  @media (max-width: 580px) {
    padding-top: 5px;
  }
`;

const CalendarMonth = styled.div`
  font-weight: bold;
  font-size: 4rem;

  @media (max-width: 1024px) {
    font-size: 2rem;
  }

  @media (max-width: 580px) {
    font-size: 1rem;
  }
`;

const Arrow = styled.div`
  display: flex;
  font-size: 2rem;

  @media (max-width: 1024px) {
    font-size: 1.5rem;
  }

  @media (max-width: 580px) {
    font-size: 1rem;
  }
`;

const CalendarDay = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  padding-left: 3px;
  margin: 10px auto;

  @media (max-width: 1024px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  @media (max-width: 580px) {
    width: 20px;
    height: 20px;
    font-size: 0.5rem;
    margin: 0 auto;
  }

  &.calendar__day--event {
    background-color: #ff8800a0;
    color: #fff;

    &:hover {
      background-color: #e39b489f;
      transition: ease 0.5s;
      transform: translateY(-5px);
    }
  }
  &.calendar__day--selected {
    background-color: #e6af70b7;
    color: #fff;
  }

  &.calendar__day--today {
    background-color: #c48370;
    color: #fff;
  }
`;

const CalendarDaysSection = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  padding: 10px;
  border-radius: 0 0 8px 8px;
  color: #fff;

  @media (max-width: 768px) {
    gap: 15px;
  }

  @media (max-width: 580px) {
    gap: 10px;
  }
`;

const CalendarDayEmpty = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  border-radius: 50%;
  background-color: #f5f5f55c;
  cursor: pointer;
  margin: 10px auto;

  @media (max-width: 1024px) {
    width: 40px;
    height: 40px;
    padding-left: 3px;
  }

  @media (max-width: 580px) {
    width: 20px;
    height: 20px;
    font-size: 0.5rem;
    margin: 0 auto;
  }
`;

const CalendarDayHeader = styled.div`
  max-width: 140px;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;

  @media (max-width: 1024px) {
    padding-left: 15px;
    font-size: 1rem;
    padding-left: 0;
  }

  @media (max-width: 580px) {
    font-size: 0.5rem;
  }
`;

const OuterDiv = styled.div`
  width: 90%;
  height: 480px;
  border: 1px solid #ffffff7c;
  padding: 10px;
  margin: 0 auto;
  position: relative;
  background-color: #ffffffbb;
  box-shadow: 5px 3px 10px #ffffff7c;

  @media (max-width: 1024px) {
    height: 400px;
  }

  @media (max-width: 580px) {
    height: 250px;
  }
`;

const InnerDiv = styled.div`
  width: 100%;
  height: 510px;
  border: 1px solid #ffffff7c;
  margin-top: -25px;
  background-color: #ffffffbb;
  padding: 40px;
  box-shadow: 5px 3px 10px #ffffff7c;

  @media (max-width: 1024px) {
    height: 430px;
  }

  @media (max-width: 580px) {
    height: 280px;
    padding: 20px;
  }
`;

const Delete = styled.div`
  height: 40px;
  font-size: 2rem;
  color: #d19b18;
  text-align: right;

  @media (max-width: 1024px) {
    height: 20px;
    font-size: 1.5rem;
  }

  @media (max-width: 580px) {
    height: 10px;
    font-size: 1rem;
  }

  &:hover {
    cursor: pointer;
    color: #d19a18a5;
    transition: ease 0.5s;
  }
`;

const EventSection = styled.div`
  width: 600px;
  height: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;

  @media (max-width: 1024px) {
    width: 450px;
    height: 350px;
  }

  @media (max-width: 580px) {
    width: 350px;
    height: 250px;
  }
`;

const EventTitle = styled.p`
  color: #d19b18;
  font-size: 2rem;
  margin: 20px 0 30px;
  font-weight: 700;

  @media (max-width: 1024px) {
    font-size: 1.5rem;
    margin: 10px 0 20px;
  }

  @media (max-width: 580px) {
    font-size: 1rem;
  }
`;

const EventName = styled.p`
  color: #000;
  font-size: 1.5rem;
  margin-bottom: 40px;

  @media (max-width: 1024px) {
    font-size: 1rem;
    margin-bottom: 20px;
  }

  @media (max-width: 580px) {
    font-size: 0.8rem;
    margin-bottom: 10px;
  }
`;

const EventContent = styled.p`
  height: 150px;
  color: #000000ac;
  font-size: 1rem;
  line-height: 25px;
  text-align: left;
  white-space: pre-wrap;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1024px) {
    height: 150px;
    font-size: 0.8rem;
  }

  @media (max-width: 580px) {
    height: 80px;
    line-height: 20px;
    font-size: 0.5rem;
  }
`;

const StyledEventButton = styled.button`
  border: none;
  border-radius: 5px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0);
  position: absolute;
  bottom: 5%;
  left: 35%;
  cursor: pointer;

  @media (max-width: 1024px) {
    left: 30%;
  }
`;

const EventButton = styled(Link)`
  text-decoration: none;
  color: #d19b18;
  font-size: 1.5rem;

  @media (max-width: 1024px) {
    font-size: 1rem;
  }
`;

interface IEvent {
  content: string;
  time: {
    seconds: number;
  };
  bar: string;
  id: string;
}

export interface ICalendarProps {}

const Calendar: React.FC<ICalendarProps> = (props: ICalendarProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<IEvent[]>([]);
  const eventsCollectionRef = collection(db, "events");

  useEffect(() => {
    const getEvents = async () => {
      const data = await getDocs(eventsCollectionRef);
      setEvents(
        data.docs.map((doc) => ({...(doc.data() as IEvent), id: doc.id}))
      );
    };

    getEvents();
  }, []);

  const prevMonth = () => {
    setSelectedDate((prevDate) => {
      const prevMonth = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() - 1,
        1
      );
      return prevMonth;
    });
  };

  const nextMonth = () => {
    setSelectedDate((prevDate) => {
      const nextMonth = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() + 1,
        1
      );
      return nextMonth;
    });
  };

  return (
    <CalendarWrapper>
      <CalendarSection>
        <CalendarHeader
          selectedDate={selectedDate}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
        />
        <CalendarWeekdays />
        <CalendarDays
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          events={events}
        />
      </CalendarSection>
    </CalendarWrapper>
  );
};

const CalendarHeader = ({
  selectedDate,
  prevMonth,
  nextMonth,
}: {
  selectedDate: Date;
  prevMonth: () => void;
  nextMonth: () => void;
}) => {
  const monthYear = selectedDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <CalendarSectionHeader>
      <CalendarMonth>{monthYear}</CalendarMonth>
      <Arrow>
        <CalendarButton onClick={prevMonth}>
          <SlArrowLeft />
        </CalendarButton>
        <CalendarButton onClick={nextMonth}>
          <SlArrowRight />
        </CalendarButton>
      </Arrow>
    </CalendarSectionHeader>
  );
};

export const CalendarWeekdays = () => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <CalendarWeekdaysSection>
      {weekdays.map((weekday) => (
        <CalendarDayHeader key={weekday}>{weekday}</CalendarDayHeader>
      ))}
    </CalendarWeekdaysSection>
  );
};

const CalendarDays = ({
  selectedDate,
  setSelectedDate,
  events,
}: {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: IEvent[];
}) => {
  const [isEventVisible, setIsEventVisible] = useState(false);
  const [targetEvent, setTargetEvent] = useState<IEvent | undefined>(undefined);

  if (events.length === 0) {
    return <p>Loading...</p>;
  }

  const startOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  );

  const endOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  );

  const startWeekday = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const days = [];
  for (let i = 1; i <= startWeekday; i++) {
    days.push(<CalendarDayEmpty key={`empty-${i}`} />);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      i
    );

    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = date.toDateString() === selectedDate.toDateString();
    const hasEvent = events.some((event) => {
      const eventDate = new Date(event.time.seconds * 1000);
      return eventDate.toDateString() === date.toDateString();
    });

    const handleClick = () => {
      setSelectedDate(date);
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const targetSeconds = Math.floor(targetDate.getTime() / 1000);
      const newEvents = events.filter(
        (event) =>
          targetSeconds + 86400 > event.time.seconds &&
          targetSeconds < event.time.seconds
      );
      if (newEvents.length === 0) {
        return;
      }
      setTargetEvent(newEvents[0]);
      setIsEventVisible(!isEventVisible);
    };

    days.push(
      <CalendarDay
        key={`day-${i}`}
        className={`
        ${isToday ? "calendar__day--today" : ""} 
        ${isSelected ? "calendar__day--selected" : ""}
        ${hasEvent ? "calendar__day--event" : ""}
        `}
        onClick={() => handleClick()}
      >
        {i}
      </CalendarDay>
    );
  }

  const handleDeleteClick = () => {
    setIsEventVisible(!isEventVisible);
  };

  return (
    <>
      <CalendarDaysSection>{days}</CalendarDaysSection>
      {isEventVisible && targetEvent && (
        <EventSection>
          <OuterDiv>
            <InnerDiv>
              <Delete onClick={handleDeleteClick}>
                <TiDeleteOutline />
              </Delete>
              <EventTitle>Today's Event</EventTitle>
              <EventName>{targetEvent?.bar}</EventName>
              <EventContent>
                {targetEvent?.content.replace(/。/g, "。\n")}
              </EventContent>
              <StyledEventButton>
                <EventButton to={`/events/${targetEvent?.id}`}>
                  <Button fontSize="18px" marginLeft="0px">
                    <BtnText fontSize="18px" marginLeft="0px">
                      Go to the Bar Event!
                    </BtnText>
                  </Button>
                </EventButton>
              </StyledEventButton>
            </InnerDiv>
          </OuterDiv>
        </EventSection>
      )}
    </>
  );
};

export default Calendar;
