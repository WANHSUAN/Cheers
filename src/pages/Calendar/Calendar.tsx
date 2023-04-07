import React from "react";
import styled from "styled-components/macro";
import {useState, useEffect} from "react";
// import {useNavigate} from "react-router-dom";
import {db} from "../../App";
import {collection, getDocs} from "firebase/firestore";
import "./Calendar.css";

const CalendarWrapper = styled.div`
  width: 350px;
  margin: 0 auto;
`;

const CalendarSection = styled.div`
  font-family: Arial, sans-serif;
  width: 350px;
  height: 380px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const CalendarSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #eee;
  border-radius: 8px 8px 0 0;
`;

const CalendarWeekdaysSection = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #eee;
  padding: 8px;
  border-bottom: 1px solid #ccc;
`;

const CalendarButton = styled.button`
  background-color: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 16px;
`;

const CalendarMonth = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const CalendarDay = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
`;

const CalendarDaysSection = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 8px;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
`;

const CalendarDayEmpty = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #f5f5f5;
  cursor: default;
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
  color: #666;
`;

const EventSection = styled.div`
  padding-top: 50px;
  height: 200px;
`;

const EventBar = styled.h2``;

const EventContent = styled.p``;

const EventButton = styled.button`
  border: 1px solid #839102;
  border-radius: 5px;
  padding: 10px;
  background-color: #759402;
  color: #fff;
  cursor: pointer;
`;

interface IEvent {
  content: string;
  time: {
    seconds: number;
  };
  bar: string;
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
      <CalendarButton onClick={prevMonth}>&lt;</CalendarButton>
      <CalendarMonth>{monthYear}</CalendarMonth>
      <CalendarButton onClick={nextMonth}>&gt;</CalendarButton>
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
  const [bar, setBar] = useState("");
  const [content, setContent] = useState("");
  // const navigate = useNavigate();

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

    const handleClick = () => {
      setSelectedDate(date);
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0); // 將時間設定為 0
      const targetSeconds = Math.floor(targetDate.getTime() / 1000);
      events.forEach((event) => {
        const daySeconds = event.time.seconds;
        if (targetSeconds < daySeconds && daySeconds < targetSeconds + 86400) {
          setBar(event.bar);
          setContent(event.content);
        }
      });
    };

    days.push(
      <CalendarDay
        key={`day-${i}`}
        className={`${isToday ? "calendar__day--today" : ""} ${
          isSelected ? "calendar__day--selected" : ""
        }`}
        onClick={handleClick}
      >
        {i}
      </CalendarDay>
    );
  }

  // function HandleToBarPage () {
  //   navigate("/event");
  // };

  return (
    <>
      <CalendarDaysSection>{days}</CalendarDaysSection>
      <EventSection>
        <EventBar>{bar}</EventBar>
        <EventContent>{content}</EventContent>
        {/* <EventButton onClick={HandleToBarPage}>
          Go to the Bar Event!
        </EventButton> */}
      </EventSection>
    </>
  );
}

export default Calendar;
