import React, {useState} from "react";
import styled from "styled-components";
// import {Link} from "react-router-dom";

const Wrapper = styled.div`
  position: fixed;
`;

const Nav = styled.div`
  width: 100vw;
  height: 95px;
  background-color: #000;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
`;

const Menu = styled.p`
  color: #fff;
  margin: 0;
  font-size: 25px;
`;

const MenuSection = styled.div`
  display: flex;
  gap: 20px;
`;

const NavImg = styled.button`
  width: 28px;
  height: 28px;
`;

const Title = styled.h1`
  font-size: 40px;
  color: #fff;
`;

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Search = styled.button`
  width: 100px;
  height: 30px;
  background-color: #000;
  color: #fff;
  border: none;
  font-size: 25px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 200px;
  height: 50px;
  border: 2px solid #fff;
  border-radius: 5px;
  background-color: #000;
  position: absolute;
  top: 100px;
  right: 35px;
`;

const SearchButton = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  position: absolute;
  top: 100px;
  right: 35px;
`;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  function OpenSearch() {
    setIsOpen(!isOpen);
  }

  return (
    <Wrapper>
      <Nav>
        <MenuSection>
          <NavImg />
          <Menu>MENU</Menu>
        </MenuSection>
        <Title>CHEERS</Title>
        <SearchSection>
          <Search onClick={OpenSearch}>SEARCH</Search>
          {isOpen && (
            <>
              <SearchInput />
              <SearchButton></SearchButton>
            </>
          )}
        </SearchSection>
      </Nav>
    </Wrapper>
  );
};

export default Header;
