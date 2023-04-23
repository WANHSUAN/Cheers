import React, {useContext} from "react";
import styled from "styled-components";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {AuthContext} from "../../Context/AuthContext";
import side from "../../components/SideMenu/side.png";

const Wrapper = styled.div`
  padding-top: 60px;
  width: 100vw;
  height: 100vh;
  background-image: url(${side});
  background-size: cover;
  background-position: center;
`;

const LoginCard = styled.div`
  width: 350px;
  height: 400px;
  margin: 60px auto;
  padding: 10px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(3px);
  border: 1px solid #fff;
  border-radius: 10px;
`;

const LoginTitle = styled.p`
  font-size: 50px;
  margin-top: 30px;
  color: #fff;
`;

const LoginContent = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 40px auto;
`;

const UserName = styled.input`
  height: 40px;
  border: 1px solid #fff;
  border-radius: 5px;
  padding: 10px;
`;

const PassWord = styled.input`
  height: 40px;
  border: 1px solid #fff;
  border-radius: 5px;
  padding: 10px;
`;

const NativeButtonSection = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NativeLogin = styled.button`
  width: 49%;
  height: 30px;
  border: 1px solid #fff;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    color: #fff;
    background-color: #000;
  }
`;

const NativeRegister = styled.button`
  width: 49%;
  height: 30px;
  border: 1px solid #fff;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    color: #fff;
    background-color: #000;
  }
`;

const GoogleLoginButton = styled.button`
  height: 30px;
  border: none;
  border-radius: 5px;
  border: 1px solid #fff;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    color: #fff;
    background-color: #000;
  }
`;

export interface ILoginPageProps {}

const LoginPage: React.FC<ILoginPageProps> = (props) => {
  const auth = getAuth();
  const {signIn} = useContext(AuthContext);
  const provider = new GoogleAuthProvider();

  return (
    <Wrapper>
      <LoginCard>
        <LoginTitle>Join Us!</LoginTitle>
        <LoginContent>
          <UserName placeholder="Username" />
          <PassWord placeholder="Password" />
          <NativeButtonSection>
            <NativeLogin>LogIn</NativeLogin>
            <NativeRegister>Register</NativeRegister>
          </NativeButtonSection>
          <GoogleLoginButton onClick={() => signIn(auth, provider)}>
            LogIn with Google
          </GoogleLoginButton>
        </LoginContent>
      </LoginCard>
    </Wrapper>
  );
};

export default LoginPage;
