import styled from "styled-components/macro";

const ScrollButton = styled.button`
  width: 100px;
  height: 100px;
  position: fixed;
  bottom: 110px;
  right: 50px;
  z-index: 1;
  border: none;
  font-size: 1.5rem;
  background-color: #d19b18;
  color: #fff;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #fff;
    color: #d19b18;

    transition: ease 0.5s;
  }

  @media (max-width: 1280px) {
    width: 70px;
    height: 70px;
    font-size: 1rem;
    right: 40px;
  }

  @media (max-width: 1024px) {
    width: 60px;
    height: 60px;
    font-size: 1rem;
    right: 35px;
  }

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    padding: 0;
    font-size: 0.8rem;
  }
`;

const Scroll = () => {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return <ScrollButton onClick={handleScrollTop}>Top</ScrollButton>;
};

export default Scroll;
