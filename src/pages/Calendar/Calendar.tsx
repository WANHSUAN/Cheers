import React from "react";
import styled from "styled-components";
import {useState} from "react";
// import {db} from "../../App";
// import {collection, getDocs} from "firebase/firestore";
import "./Calendar.css";

const CalendarSection = styled.div`
  font-family: Arial, sans-serif;
  width: 350px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin: 0 auto;
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
  cursor: pointer;
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

export interface ICalendarProps {}

const Calendar: React.FC<ICalendarProps> = (props: ICalendarProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

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
      />
    </CalendarSection>
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
}: {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}) {
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
    };
    days.push(
      <CalendarDay
        key={`day-${i}`}
        className={`${isToday ? "calendar__day--today" : ""} ${
          isSelected ? "calendar__day--selected" : ""
        }`}
        onClick={handleClick}
        style={{cursor: "pointer"}}
      >
        {i}
      </CalendarDay>
    );
  }

  return <CalendarDaysSection>{days}</CalendarDaysSection>;
}

export default Calendar;
