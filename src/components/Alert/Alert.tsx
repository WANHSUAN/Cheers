import React, {useEffect, useState} from "react";
import styled from "styled-components/macro";
import {Link} from "react-router-dom";

const Wrapper = styled.div`
  width: 400px;
  height: 130px;
  border: 1px solid #fff;
  background-color: #d19b18;
  color: #fff;
  border-radius: 10px;
  text-align: left;
  padding: 15px;
`;

const AlertMessage = styled.div`
  font-size: 15px;
  padding: 15px 0;
  line-height: 20px;
`;

const AlertCheck = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ButtonSection = styled.div``;

const CheckboxWrapper = styled.label`
  width: 120px;
  text-align: left;
`;

const CheckboxInput = styled.input`
  vertical-align: middle;
`;

const CheckboxLabel = styled.span`
  font-size: 10px;
  margin-left: 10px;
`;

const StyledEnterButton = styled.button`
  width: 60px;
  height: 20px;
  border: none;
  font-size: 10px;
  border-radius: 3px;

  &:hover {
    background-color: #cd863a;
  }
`;

const EnterButton = styled(Link)`
  text-decoration: none;
  color: #000;
  cursor: pointer;
`;

const CloseButton = styled.button`
  width: 60px;
  height: 20px;
  font-size: 10px;
  border: none;
  border-radius: 3px;
  margin-left: 5px;
  color: #000;
  cursor: pointer;

  &:hover {
    background-color: #cd863a;
  }
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

  useEffect(() => {
    const hideAlertToday = localStorage.getItem("hideAlertToday");
    if (hideAlertToday === "true") {
      setShowAlert(false);
    }
  }, []);

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
      localStorage.setItem("hideAlertToday", "true");
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
            <Wrapper key={index}>
              <AlertMessage>
                今日 {event.bar} 有特別活動！
                <br />
                邀請您來共襄盛舉～
              </AlertMessage>
              <AlertCheck>
                <CheckboxWrapper>
                  <CheckboxInput
                    type="checkbox"
                    checked={ischecked}
                    onChange={handleOnChange}
                  />
                  <CheckboxLabel>今日不再顯示</CheckboxLabel>
                </CheckboxWrapper>
                <ButtonSection>
                  <StyledEnterButton>
                    <EnterButton to={`/events/${event.id}`} key={event.id}>
                      Enter
                    </EnterButton>
                  </StyledEnterButton>
                  <CloseButton onClick={handleCloseClick}>Close</CloseButton>
                </ButtonSection>
              </AlertCheck>
            </Wrapper>
          ) : null;
        })}
    </>
  );
};

export default Alert;
