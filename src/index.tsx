import ReactDOM from "react-dom/client";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import "../src/css/normalize.css";
import App from "./App";
import Bar from "./pages/Bar/Bar";
import Category from "./pages/Category/Category";
import Event from "./pages/Event/Event";
import Login from "./pages/Login/Login";
import Main from "./pages/Main/Main";
import Member from "./pages/Member/Member";
import Question from "./pages/Question/Question";
import RecommendationPage from "./pages/Recommendation/Recommendation";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/question" element={<Question />} />
        <Route path="/recommendation" element={<RecommendationPage />} />
        <Route path="/bars/:id" element={<Bar />} />
        <Route path="/events/:id" element={<Event />} />
        <Route path="/member" element={<Member />} />
        <Route path="/category" element={<Category />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
