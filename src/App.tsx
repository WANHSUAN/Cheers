import {createGlobalStyle} from "styled-components";
import {initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore";
import {config} from "./config/config";
import {AuthContextProvider} from "./Context/AuthContext";
import {Outlet} from "react-router-dom";
import Header from "./components/Header/Header";
import "../src/css/globalStyle.css";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Forum', cursive;
    background-color: #000;
  }

`;

const app = initializeApp(config.firebaseConfig);
export const db = getFirestore(app);

export interface IAppProps {}

const App: React.FC<IAppProps> = (props) => {
  return (
    <>
      <GlobalStyle />
      <AuthContextProvider>
        <Header />
        <Outlet />
      </AuthContextProvider>
    </>
  );
};

export default App;
