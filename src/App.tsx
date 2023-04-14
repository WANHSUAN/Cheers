import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Question from "./pages/Question";
import LoginPage from "./pages/Login";
import Main from "./pages/Main/Main";
import Bar from "./pages/Bar/Bar";
import {initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore";
import {config} from "./config/config";
import AuthRoute from "./components/AuthRoute";
import RecommendationPage from "./pages/Recommendation/Recommendation";
import Event from "./pages/Event/Event";
import Member from "./pages/Member/Member";
import Category from "./pages/Category/Category";
import Search from "./pages/Search/Search";

import algoliasearch from "algoliasearch/lite";
import {InstantSearch} from "react-instantsearch-hooks-web";

const searchClient = algoliasearch(
  "W1FJ2ENITZ",
  "2e0351bed6525d14fcf871febd4909f2"
);

const app = initializeApp(config.firebaseConfig);
export const db = getFirestore(app);

export interface IAppProps {}

const App: React.FC<IAppProps> = (props) => {
  return (
    <BrowserRouter>
      <InstantSearch searchClient={searchClient} indexName="bars">
        <AuthRoute>
          <Routes>
            <Route path="/" element={<Question />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/recommendation" element={<RecommendationPage />} />
            <Route path="/main" element={<Main />} />
            <Route path="/bars/:id" element={<Bar />} />
            <Route path="/events/:id" element={<Event />} />
            <Route path="/member" element={<Member />} />
            <Route path="/category" element={<Category />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </AuthRoute>
      </InstantSearch>
    </BrowserRouter>
  );
};

export default App;
