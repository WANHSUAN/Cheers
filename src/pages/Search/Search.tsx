import styled from "styled-components";
import {SearchBox, Hits} from "react-instantsearch-hooks-web";

const Wrapper = styled.div`
  width: 1000px;
  height: 600px;
  background-color: #a1bbed;
  text-align: center;
`;

const SearchTitle = styled.h2``;
const SearchInput = styled.input`
  flex: 1;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SearchButton = styled.button`
  width: 100px;
  padding: 8px 16px;
  font-size: 16px;
  background-color: #a1bbed;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

function Hit({hit}) {
  return JSON.stringify(hit);
}

const MySearchComponent = () => {
  const handleSearch = (searchTerm) => {
    // 在此處理搜尋邏輯，例如呼叫 Algolia 搜尋 API
    console.log("搜尋關鍵字:", searchTerm);
  };

  return (
    <div>
      <h1>Search</h1>
      <SearchBox
        placeholder="請輸入"
        searchAsYouType={true}
        onSubmit={(e) => {
          e.preventDefault();
          console.log(e.target);
          // const searchTerm = e.target.elements.searchTerm.value;
          // handleSearch(searchTerm);
        }}
      />
      <Hits hitComponent={({hit}) => hit.objectID} />
    </div>
  );
};

const Search = () => {
  return (
    <Wrapper>
      <MySearchComponent />
    </Wrapper>
  );
};

export default Search;
