import React, {useState} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import SideMenu from "../SideMenu/SideMenu";
import {FiSearch} from "react-icons/fi";
import {HiBars3CenterLeft} from "react-icons/hi2";

const Wrapper = styled.div`
  position: fixed;
  z-index: 4;
`;

const Nav = styled.div`
  width: 100vw;
  height: 60px;
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
  font-size: 20px;
`;

const MenuSection = styled.div`
  display: flex;
  gap: 20px;
  padding-top: 5px;
`;

const NavButton = styled.button`
  width: 20px;
  height: 25px;
  border: none;
  color: #fff;
  background-color: #000;
  cursor: pointer;
`;

const Title = styled(Link)`
  font-size: 35px;
  color: #fff;
  text-decoration: none;
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
  font-size: 20px;
  position: relative;
  cursor: pointer;
`;

const SearchInput = styled.input`
  width: 250px;
  height: 40px;
  border: 1px solid #fff;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0);
  position: absolute;
  top: 100px;
  right: 35px;
`;

const SearchButton = styled.button`
  width: 50px;
  height: 40px;
  border: 1px solid #fff;
  border-left: none;
  border-radius: 0 5px 5px 0;
  color: #fff;
  background-color: #000;
  position: absolute;
  top: 100px;
  right: 35px;
  font-size: 25px;
  padding: 5px;
  cursor: pointer;
`;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isToggle, setIsToggle] = useState(false);

  function handleSideMenu() {
    setIsToggle(!isToggle);
  }

  function OpenSearch() {
    setIsOpen(!isOpen);
  }

  return (
    <Wrapper>
      <Nav>
        <MenuSection>
          <NavButton onClick={handleSideMenu}>
            <HiBars3CenterLeft />
          </NavButton>
          {isToggle && <SideMenu />}
          <Menu>MENU</Menu>
        </MenuSection>
        <Title to={"./main"}>CHEERS</Title>
        <SearchSection>
          <Search onClick={OpenSearch}>SEARCH</Search>
          {isOpen && (
            <>
              <SearchInput />
              <SearchButton>
                <FiSearch />
              </SearchButton>
            </>
          )}
        </SearchSection>
      </Nav>
    </Wrapper>
  );
};

export default Header;
