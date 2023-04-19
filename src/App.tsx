import React from "react";
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Question from "./pages/Question/Question";
import Login from "./pages/Login/Login";
import Main from "./pages/Main/Main";
import Bar from "./pages/Bar/Bar";
import {initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore";
import {config} from "./config/config";
import {AuthContextProvider} from "./Context/AuthContext";
import RecommendationPage from "./pages/Recommendation/Recommendation";
import Event from "./pages/Event/Event";
import Member from "./pages/Member/Member";
import Category from "./pages/Category/Category";
import Search from "./pages/Search/Search";

const app = initializeApp(config.firebaseConfig);
export const db = getFirestore(app);

export interface IAppProps {}

const App: React.FC<IAppProps> = (props) => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/question" element={<Question />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/main" element={<Main />} />
          <Route path="/bars/:id" element={<Bar />} />
          <Route path="/events/:id" element={<Event />} />
          <Route path="/member" element={<Member />} />
          <Route path="/category" element={<Category />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
