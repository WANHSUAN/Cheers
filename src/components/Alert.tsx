import React, {useState, useEffect} from "react";
import styled from "styled-components";

const AlertMessage = styled.p`
  font-size: 20px;
`;

const Alert = ({
  message,
  type,
  duration,
}: {
  message: string;
  type: string;
  duration: number;
}) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setShowAlert(true);

    // 如果设置了 duration，则在 duration 后隐藏 Alert
    if (duration) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  return showAlert ? (
    <>
      <div className={`alert ${type}`}>
        <p>{message}</p>
      </div>
      <AlertMessage>有活動！！！！！</AlertMessage>
    </>
  ) : null;
};

export default Alert;
