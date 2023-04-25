/* eslint-disable array-callback-return */
import React from "react";
import styled from "styled-components/macro";
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {db} from "../../App";
import {collection, getDocs} from "firebase/firestore";
import {SlArrowLeft, SlArrowRight} from "react-icons/sl";
import {RxEnter} from "react-icons/rx";

const CalendarWrapper = styled.div`
  width: 1000px;
  margin: 0 auto 250px;
  position: relative;
`;

const CalendarSection = styled.div`
  width: 490px;
  height: 510px;
  border-radius: 8px;
  background-color: #4c4a49;
  border: 1px solid #ffffff7c;
`;

const CalendarSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #4c4a49;
  border-radius: 8px 8px 0 0;
  color: #ffffff7c;
`;

const CalendarWeekdaysSection = styled.div`
  display: flex;
  justify-content: space-around;
  color: #fff;
  padding: 8px;
`;

const CalendarButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 25px;
  color: #ffffff7c;
  margin: 0 20px;
`;

const CalendarMonth = styled.div`
  font-size: 30px;
  font-weight: bold;
`;

const Arrow = styled.div`
  display: flex;
`;

const CalendarDay = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  padding-left: 10%;

  &.calendar__day--today {
    background-color: #d19b18;
    color: #fff;
  }
  &.calendar__day--event {
    background-color: #ee8270;
    color: #fff;
  }
  &.calendar__day--selected {
    background-color: #a291c5;
    color: #fff;
  }
`;

const CalendarDaysSection = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  padding: 10px;
  background-color: #4c4a49;
  border-radius: 0 0 8px 8px;
  color: #fff;
`;

const CalendarDayEmpty = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #f5f5f55c;
  cursor: pointer;
  margin-left: 8px;
`;

const CalendarDayHeader = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
`;

const OuterDiv = styled.div`
  width: 90%;
  height: 480px;
  border: 2px solid white;
  padding: 10px;
  margin: 0 auto;
  position: relative;
`;

const InnerDiv = styled.div`
  width: 100%;
  height: 510px;
  border: 2px solid white;
  padding: 10px;
  margin-top: -25px;
`;

const EventSection = styled.div`
  width: 400px;
  height: 500px;
  position: absolute;
  top: 2%;
  left: 55%;
  border-radius: 10px;
`;

const EventTitle = styled.p`
  color: #d19b18;
  font-size: 30px;
  margin: 40px 0;
`;

const EventName = styled.p`
  color: #fff;
  font-size: 20px;
  margin-bottom: 40px;
`;

const EventContent = styled.p`
  color: #fff;
  font-size: 15px;
  line-height: 20px;
  text-align: left;
`;

const StyledEventButton = styled.button`
  border: none;
  border-radius: 5px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0);
  position: absolute;
  bottom: 3%;
  right: 5%;

  cursor: pointer;
`;
const EventButton = styled(Link)`
  text-decoration: none;
  color: #d19b18;
  font-size: 30px;
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

function CalendarHeader({
  selectedDate,
  prevMonth,
  nextMonth,
}: {
  selectedDate: Date;
  prevMonth: () => void;
  nextMonth: () => void;
}) {
  const monthYear = selectedDate.toLocaleString("default", {
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
}

function CalendarWeekdays() {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <CalendarWeekdaysSection>
      {weekdays.map((weekday) => (
        <CalendarDayHeader key={weekday}>{weekday}</CalendarDayHeader>
      ))}
    </CalendarWeekdaysSection>
  );
}

function CalendarDays({
  selectedDate,
  setSelectedDate,
  events,
}: {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: IEvent[];
}) {
  const [seconds, setSeconds] = useState(0);

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
      const eventDate = new Date(event.time.seconds * 1000); // 將時間戳記轉換為日期
      return eventDate.toDateString() === date.toDateString();
    });

    const handleClick = () => {
      setSelectedDate(date);
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0); // 將時間設定為 0
      const targetSeconds = Math.floor(targetDate.getTime() / 1000);
      setSeconds(targetSeconds);
    };

    days.push(
      <CalendarDay
        key={`day-${i}`}
        className={`
        ${isToday ? "calendar__day--today" : ""} 
        ${isSelected ? "calendar__day--selected" : ""}
        ${hasEvent ? "calendar__day--event" : ""}
        `}
        onClick={handleClick}
      >
        {i}
      </CalendarDay>
    );
  }

  return (
    <>
      <CalendarDaysSection>{days}</CalendarDaysSection>
      {events.map((event, index) => {
        const daySeconds = event.time.seconds;
        if (seconds < daySeconds && daySeconds <= seconds + 86400) {
          return (
            <EventSection key={index}>
              <OuterDiv>
                <InnerDiv>
                  <EventTitle>Today's Event</EventTitle>
                  <EventName>{event.bar}</EventName>
                  <EventContent>{event.content}</EventContent>
                  <StyledEventButton>
                    <EventButton to={`/events/${event.id}`}>
                      <RxEnter />
                    </EventButton>
                  </StyledEventButton>
                </InnerDiv>
              </OuterDiv>
            </EventSection>
          );
        }
      })}
    </>
  );
}

export default Calendar;
