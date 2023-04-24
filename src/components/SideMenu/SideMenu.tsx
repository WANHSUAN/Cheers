import React, {useState} from "react";
import styled from "styled-components/macro";
import {Link} from "react-router-dom";
import side from "./side.png";
import {TfiClose} from "react-icons/tfi";
import {FiSearch} from "react-icons/fi";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url(${side}) no-repeat center center fixed;
  background-size: cover;
  z-index: 1;
`;

const Nav = styled.div`
  width: 100vw;
  height: 60px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  z-index: 2;
`;

const MenuName = styled.p`
  color: #fff;
  margin: 0;
  font-size: 20px;
`;

const MenuSection = styled.div`
  display: flex;
  gap: 20px;
`;

const NavButton = styled.button`
  width: 20px;
  height: 28px;
  border: none;
  color: #fff;
  background-color: rgba(255, 255, 255, 0);
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
  color: #fff;
  border: none;
  font-size: 20px;
  position: relative;
  background-color: rgba(255, 255, 255, 0);
`;

const SearchInput = styled.input`
  width: 250px;
  height: 40px;
  border: 1px solid #fff;
  border-radius: 5px;
  position: absolute;
  top: 100px;
  right: 35px;
  background-color: rgba(255, 255, 255, 0);
`;

const SearchButton = styled.button`
  width: 50px;
  height: 40px;
  border: 1px solid #fff;
  border-left: none;
  border-radius: 0 5px 5px 0;
  color: #fff;
  background-color: rgba(255, 255, 255, 0);
  position: absolute;
  top: 100px;
  right: 35px;
  font-size: 25px;
  padding: 5px;
`;

const Menu = styled.ul`
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 20px;
  text-align: center;
  margin: 10% auto;
  gap: 40px;
`;

const MenuItem = styled.li`
  width: 400px;
  list-style: none;
  font-size: 70px;
  margin: 20px 0;
  padding: 0 30px;
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 16px;
  color: #fff;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #fff;
`;

function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  function OpenSearch() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <Wrapper>
        <Nav>
          <MenuSection>
            <NavButton>
              <TfiClose />
            </NavButton>
            <MenuName>MENU</MenuName>
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
        <Menu>
          <MenuItem>
            <StyledLink to={"/member"}>Member</StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to={"/main"}>All Bars</StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to={"/category"}>Category</StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to={"/main"}>Log Out</StyledLink>
          </MenuItem>
        </Menu>
      </Wrapper>
    </>
  );
}

export default SideMenu;
