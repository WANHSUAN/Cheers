import {initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore";
import {config} from "./config/config";
import {AuthContextProvider} from "./Context/AuthContext";
import {Outlet} from "react-router-dom";
import Header from "./components/Header/Header";

const app = initializeApp(config.firebaseConfig);
export const db = getFirestore(app);

export interface IAppProps {}

const App: React.FC<IAppProps> = (props) => {
  return (
    <AuthContextProvider>
      <Header />
      <Outlet />
    </AuthContextProvider>
  );
};

export default App;
