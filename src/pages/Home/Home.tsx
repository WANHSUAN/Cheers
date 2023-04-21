import styled from "styled-components/macro";
import main from "./main.png";

const Wrapper = styled.div`
  width: 83.5%;
  margin: 0 auto;
  padding-top: 95px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const Slogan = styled.p`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  font-size: 130px;
  color: #fff;
  letter-spacing: 10px;
  text-align: center;
`;

const MainImg = styled.img`
  width: 100%;
  height: 550px;
  margin-top: 275px;
  vertical-align: bottom;
  object-fit: cover;
`;

function HomePage() {
  return (
    <Wrapper>
      <ImageContainer>
        <Slogan>
          YOUR
          <br />
          HAPPINESS
        </Slogan>
        <MainImg src={main} />
      </ImageContainer>
    </Wrapper>
  );
}

export default HomePage;
