import {GoogleAuthProvider, getAuth} from "firebase/auth";
import React, {useContext, useEffect, useState} from "react";
import {Link} from "react-scroll";
import styled, {keyframes} from "styled-components/macro";
import {AuthContext} from "../../Context/AuthContext";
import cocktail from "../Login/img/cocktail.png";
import relax from "../Login/img/relax.png";

const Arrow = styled.div`
  margin: 0 auto;
  margin-top: 13px;
  width: 30px;
  height: 30px;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0yOTMuNzUxLDQ1NS44NjhjLTIwLjE4MSwyMC4xNzktNTMuMTY1LDE5LjkxMy03My42NzMtMC41OTVsMCwwYy0yMC41MDgtMjAuNTA4LTIwLjc3My01My40OTMtMC41OTQtNzMuNjcyICBsMTg5Ljk5OS0xOTBjMjAuMTc4LTIwLjE3OCw1My4xNjQtMTkuOTEzLDczLjY3MiwwLjU5NWwwLDBjMjAuNTA4LDIwLjUwOSwyMC43NzIsNTMuNDkyLDAuNTk1LDczLjY3MUwyOTMuNzUxLDQ1NS44Njh6Ii8+DQo8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMjIwLjI0OSw0NTUuODY4YzIwLjE4LDIwLjE3OSw1My4xNjQsMTkuOTEzLDczLjY3Mi0wLjU5NWwwLDBjMjAuNTA5LTIwLjUwOCwyMC43NzQtNTMuNDkzLDAuNTk2LTczLjY3MiAgbC0xOTAtMTkwYy0yMC4xNzgtMjAuMTc4LTUzLjE2NC0xOS45MTMtNzMuNjcxLDAuNTk1bDAsMGMtMjAuNTA4LDIwLjUwOS0yMC43NzIsNTMuNDkyLTAuNTk1LDczLjY3MUwyMjAuMjQ5LDQ1NS44Njh6Ii8+DQo8L3N2Zz4=);
  background-size: contain;
`;

const Bounce = keyframes`
0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }`;

const Encircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 60px;
  border: solid 2px white;
  position: fixed;
  bottom: 3%;
  left: 48%;
  cursor: pointer;
  animation: ${Bounce} 2s infinite;
`;

const EncircleFadeout = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 60px;
  border: solid 2px white;
  position: fixed;
  bottom: 3%;
  left: 48%;
  cursor: pointer;
  animation: ${Bounce} 2s infinite;
  opacity: 0;
  transition: opacity 0.3s ease-out;
`;

const Wrapper = styled.div`
  width: 100vw;
`;

const FirstSection = styled.div`
  padding-top: 60px;
  width: 100vw;
  height: 100vh;
  background-image: url(${relax});
  background-size: cover;
  background-position: center;
`;

const fadeInPosition = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SloganContent = styled.div`
  width: 35%;
  margin: 7% 0 0 10%;
  font-size: 50px;
  color: #ffffffdd;
  line-height: 80px;
  text-align: left;
  opacity: 0;
  animation: ${fadeInPosition} ease-in-out 2s;
`;

const SecondSloganContent = styled.div`
  width: 35%;
  margin: 8% 0 5% 50%;
  font-size: 50px;
  color: #ffffffdd;
  line-height: 80px;
  text-align: right;
  opacity: 0;
  animation: ${fadeInPosition} ease-in-out 3.5s;
  display: flex;
`;

const SecondSection = styled.div`
  height: 100vh;
  background-color: #d19b18;
  display: flex;
  margin: auto;
`;

const LoginTextSection = styled.div`
  width: 50%;
`;

const LoginImgSection = styled.div`
  width: 50%;
  background-image: url(${cocktail});
  background-size: cover;
  background-position: center;
`;

const LoginTitle = styled.p`
  font-size: 50px;
  font-weight: bold;
  color: #fff;
`;

const SubTitle = styled.p`
  margin-bottom: 50px;
  font-size: 20px;
`;

const LoginContent = styled.div`
  width: 500px;
  height: 78vh;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin: 15% auto;
  justify-content: center;
`;

const GoogleLogin = styled.button`
  height: 60px;
  border: 1px solid #ffffffbd;
  border-radius: 35px;
  font-size: 30px;
  padding: 13px 20px;
  cursor: pointer;
  background-color: #ffffff7c;
  display: flex;
  color: #fff;
  justify-content: space-around;

  &:hover {
    color: #d19b18;
    background-color: #fff;
    transition: ease 0.5s;
  }
`;

const GoogleText = styled.p`
  text-align: center;
`;

const UserName = styled.input`
  height: 60px;
  border: 1px solid #ffffffbd;
  border-radius: 35px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0);
  font-size: 25px;

  &::placeholder {
    color: #ffffffbd;
    letter-spacing: 2px;
  }
`;

const PassWord = styled.input`
  height: 60px;
  border: 1px solid #ffffffbd;
  border-radius: 35px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0);
  font-size: 25px;

  &::placeholder {
    color: #ffffffbd;
    letter-spacing: 2px;
  }
`;

const NativeButtonSection = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NativeLogin = styled.button`
  width: 49%;
  height: 50px;
  font-size: 20px;
  border: 1px solid #ffffff7c;
  border-radius: 25px;
  cursor: pointer;
  background-color: #ffffff7c;
  letter-spacing: 2px;

  &:hover {
    color: #d19b18;
    background-color: #fff;
    transition: ease 0.5s;
  }
`;

const NativeSignUp = styled.button`
  width: 49%;
  height: 50px;
  font-size: 20px;
  border: 1px solid #ffffff7c;
  border-radius: 25px;
  cursor: pointer;
  background-color: #ffffff7c;
  letter-spacing: 2px;

  &:hover {
    color: #d19b18;
    background-color: #fff;
    transition: ease 0.5s;
  }
`;

export interface ILoginPageProps {}

const LoginPage: React.FC<ILoginPageProps> = (props) => {
  const auth = getAuth();
  const {signIn} = useContext(AuthContext);
  const provider = new GoogleAuthProvider();

  const [showButton, setShowButton] = useState(true);
  const [section2, setSection2] = useState<HTMLElement | undefined>(undefined);

  const handleScroll = () => {
    const section2 = document.getElementById("section2");
    if (!section2) return;
    if (
      section2 &&
      section2.getBoundingClientRect().top <= window.innerHeight
    ) {
      setShowButton(false);
    } else if (section2 && window.scrollY < section2.offsetTop) {
      setShowButton(true);
    }
    if (window.scrollY === 0) {
      setShowButton(true);
    }
  };

  const scrollToSection2 = () => {
    const section2 = document.getElementById("section2");
    if (section2) {
      window.scrollTo({
        top: section2.offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    window.addEventListener("scroll", handleScroll);

    const section2El = document.getElementById("section2");
    if (!section2El) return;
    setSection2(section2El);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Wrapper>
      <FirstSection>
        <SloganContentAnimation />
        <SecondSloganContentAnimation />
        {showButton ? (
          <Link to="section2" smooth={true} onClick={scrollToSection2}>
            <Encircle>
              <Arrow />
            </Encircle>
          </Link>
        ) : (
          <Link to="section2" smooth={true} onClick={scrollToSection2}>
            <EncircleFadeout>
              <Arrow />
            </EncircleFadeout>
          </Link>
        )}
      </FirstSection>
      <SecondSection id="section2">
        <LoginTextSection>
          <LoginContent>
            <LoginTitle>Let's Start Exploring!</LoginTitle>
            <SubTitle>Please fill in your basic info</SubTitle>
            <GoogleLogin onClick={() => signIn(auth, provider)}>
              <GoogleText>continue with Google</GoogleText>
            </GoogleLogin>
            <UserName placeholder="Name" />
            <PassWord placeholder="Password" />
            <NativeButtonSection>
              <NativeLogin>Log In</NativeLogin>
              <NativeSignUp>Sign Up</NativeSignUp>
            </NativeButtonSection>
          </LoginContent>
        </LoginTextSection>
        <LoginImgSection />
      </SecondSection>
    </Wrapper>
  );
};

const SloganContentAnimation = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SloganContent style={{opacity: visible ? 1 : 0}}>
      Have you spent a lot of time searching for a suitable bar?
    </SloganContent>
  );
};

const SecondSloganContentAnimation = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SecondSloganContent style={{opacity: visible ? 1 : 0}}>
      No matter what style you prefer, you can find a good bar here!
    </SecondSloganContent>
  );
};

export default LoginPage;
