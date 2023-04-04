import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Question from "./pages/Question";
import LoginPage from "./pages/Login";
import Main from "./pages/Main";
import Bar from "./pages/Bar/Bar";
import {initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore";
import {config} from "./config/config";
import AuthRoute from "./components/AuthRoute";
import RecommendationPage from "./pages/Recommendation";

const app = initializeApp(config.firebaseConfig);
export const db = getFirestore(app);

export interface IAppProps {}

const App: React.FC<IAppProps> = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute>
              <Question />
            </AuthRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recommendation" element={<RecommendationPage />} />
        <Route path="/main" element={<Main />} />
        <Route path="/bar" element={<Bar />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
