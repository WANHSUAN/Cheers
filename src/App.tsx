import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Question from "./pages/Question";
import LoginPage from "./pages/Login";
import {initializeApp} from "firebase/app";
import {config} from "./config/config";
import AuthRoute from "./components/AuthRoute";

initializeApp(config.firebaseConfig);

export interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (props) => {
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
