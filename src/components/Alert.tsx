import React, {useState} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";

const AlertMessage = styled.p`
  font-size: 15px;
`;

const Wrapper = styled.div`
  width: 300px;
  height: 130px;
  border: 1px solid #5d4317;
`;

const CheckboxWrapper = styled.label`
  width: 100px;
  height: 100px;
`;

const CheckboxInput = styled.input``;

const CheckboxLabel = styled.span``;

const StyledEnterButton = styled.button`
  width: 50px;
  height: 30px;
`;

const EnterButton = styled(Link)`
  text-decoration: none;
`;

const CloseButton = styled.button`
  width: 50px;
  height: 30px;
`;

interface IAlertEvent {
  time: {
    seconds: number;
  };
  bar: string;
  id: string;
}

const Alert = ({events}: {events: IAlertEvent[]}) => {
  const [showAlert, setShowAlert] = useState(true);
  const [ischecked, setIsChecked] = useState(false);

  if (events.length === 0) {
    return null;
  }

  const isToday = new Date().toDateString();
  const hasEvent = events.map((event) => {
    const eventDate = new Date(event.time.seconds * 1000);
    return eventDate.toDateString() === isToday;
  });

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setIsChecked(true);
    }
    return;
  }

  function handleCloseClick() {
    setShowAlert(false);
  }

  return (
    <>
      {showAlert &&
        events.map((event, index) => {
          return hasEvent[index] ? (
            <Wrapper>
              <AlertMessage key={index}>
                今日 {event.bar} 有特別活動！
                <br />
                邀請您來共襄盛舉～
              </AlertMessage>
              <CheckboxWrapper>
                <CheckboxInput
                  type="checkbox"
                  checked={ischecked}
                  onChange={handleOnChange}
                />
                <CheckboxLabel>今日不再顯示</CheckboxLabel>
              </CheckboxWrapper>
              <StyledEnterButton>
                <EnterButton to={`/events/${event.id}`} key={event.id}>
                  Enter
                </EnterButton>
              </StyledEnterButton>
              <CloseButton onClick={handleCloseClick}>Close</CloseButton>
            </Wrapper>
          ) : null;
        })}
    </>
  );
};

export default Alert;
