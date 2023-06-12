import styled from "styled-components";

const Wrapper = styled.div`
  width: 100vw;
  height: 80px;
  text-align: center;
  background-color: #000;
`;

const FooterContent = styled.p`
  font-size: 15px;
  color: #d1cfca;
  padding: 30px 0 33px 0;

  @media (max-width: 768px) {
    height: 40px;
    font-size: 10px;
  }
`;

const Footer = () => {
  return (
    <Wrapper>
      <FooterContent>© 2023 Cheers. All Rights Reserved</FooterContent>
    </Wrapper>
  );
};

export default Footer;
