import React, {useState} from "react";
import styled from "styled-components";

const SearchBoxContainer = styled.div`
  display: flex;
  width: 300px;
`;

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

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    console.log(e);
    setSearchTerm(e.target.value);
  };

  return (
    <SearchBoxContainer>
      <SearchInput
        type="text"
        placeholder="請輸入關鍵字..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <SearchButton>搜尋</SearchButton>
    </SearchBoxContainer>
  );
};

export default Search;
