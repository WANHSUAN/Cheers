import {getFirestore} from "@firebase/firestore";
import {initializeApp} from "firebase/app";
import {Outlet} from "react-router-dom";
import styled, {createGlobalStyle} from "styled-components";
import "../src/css/globalStyle.css";
import {AuthContextProvider} from "./Context/AuthContext";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import {config} from "./config/config";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Forum', 'Noto Sans TC', sans-serif;
    background-color: #000;
    letter-spacing: 3px;
  }
`;

const Wrapper = styled.div`
  min-height: calc(100vh - 80px);
`;

const app = initializeApp(config.firebaseConfig);
export const db = getFirestore(app);

export interface IAppProps {}

const App: React.FC<IAppProps> = (props) => {
  return (
    <>
      <GlobalStyle />
      <AuthContextProvider>
        <Wrapper>
          <Header />
          <Outlet />
        </Wrapper>
        <Footer />
      </AuthContextProvider>
    </>
  );
};

export default App;
