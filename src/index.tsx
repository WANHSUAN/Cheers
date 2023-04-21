import ReactDOM from "react-dom/client";
import React from "react";
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import "../src/css/normalize.css";
import App from "./App";
import Question from "./pages/Question/Question";
// import Login from "./pages/Login/Login";
import Main from "./pages/Main/Main";
import Bar from "./pages/Bar/Bar";
import RecommendationPage from "./pages/Recommendation/Recommendation";
import Event from "./pages/Event/Event";
import Member from "./pages/Member/Member";
import Category from "./pages/Category/Category";
import Search from "./pages/Search/Search";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        {/* <Route index element={<Login />} /> */}
        <Route path="/question" element={<Question />} />
        <Route path="/recommendation" element={<RecommendationPage />} />
        <Route path="/main" element={<Main />} />
        <Route path="/bars/:id" element={<Bar />} />
        <Route path="/events/:id" element={<Event />} />
        <Route path="/member" element={<Member />} />
        <Route path="/category" element={<Category />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
