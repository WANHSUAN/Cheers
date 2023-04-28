import React, {useState, useEffect, useContext} from "react";
import styled, {keyframes} from "styled-components/macro";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {AuthContext} from "../../Context/AuthContext";
import {Link} from "react-scroll";
import relax from "./relax.png";
import cocktail from "./cocktail.png";
import "./Login.css";
import {
  SlSocialGoogle,
  SlSocialFacebook,
  SlSocialTwitter,
} from "react-icons/sl";

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

const SloganSection = styled.div``;

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
  justify-content: center;
  align-items: center;
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
    transition: ease 0.5s;'
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

const OtherButtonSection = styled.div`
  display: flex;
`;

const LoginButton = styled.button`
  width: 50px;
  height: 50px;
  font-size: 35px;
  padding: 10px;
  border: none;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0);
  color: #ffffff7c;

  &:hover {
    color: #fff;
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
    // 檢查當前位置是否已到達指定部分
    const section2 = document.getElementById("section2");
    if (!section2) return; // 如果 section2 不存在，不做任何處理
    if (
      section2 &&
      section2.getBoundingClientRect().top <= window.innerHeight
    ) {
      setShowButton(false); // 隱藏按鈕
    } else if (section2 && window.scrollY < section2.offsetTop) {
      setShowButton(true); // 顯示按鈕
    }
    if (window.scrollY === 0) {
      setShowButton(true); // 畫面到頂部時顯示按鈕
    }
  };

  const scrollToSection2 = () => {
    // 捲動到指定部分
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
    // 綁定事件監聽器
    window.addEventListener("scroll", handleScroll);

    // 獲取 section2 元素
    const section2El = document.getElementById("section2");
    if (!section2El) return; // 如果 section2 不存在，不做任何處理
    setSection2(section2El);

    return () => {
      // 在元件解除掛載前，取消事件監聽器
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Wrapper>
      <FirstSection>
        <SloganSection>
          <SloganContentAnimation />
          <SecondSloganContentAnimation />
          {showButton && (
            <Link to="section2" smooth={true} onClick={scrollToSection2}>
              <div className="encircle bounce animated">
                <div className="arrow"></div>
              </div>
            </Link>
          )}
        </SloganSection>
      </FirstSection>
      <SecondSection id="section2">
        <LoginTextSection>
          <LoginContent>
            <LoginTitle>Let's Start Exploring!</LoginTitle>
            <SubTitle>Please fill in your basic info</SubTitle>
            <UserName placeholder="Username" />
            <PassWord placeholder="Password" />
            <NativeButtonSection>
              <NativeLogin>Log In</NativeLogin>
              <NativeSignUp>Sign Up</NativeSignUp>
            </NativeButtonSection>
            <OtherButtonSection>
              <LoginButton onClick={() => signIn(auth, provider)}>
                <SlSocialGoogle />
              </LoginButton>
              <LoginButton>
                <SlSocialFacebook />
              </LoginButton>
              <LoginButton>
                <SlSocialTwitter />
              </LoginButton>
            </OtherButtonSection>
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
