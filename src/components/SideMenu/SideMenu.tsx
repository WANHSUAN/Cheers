import styled from "styled-components";
import {Link} from "react-router-dom";

const Wrapper = styled.div`
  width: 200px;
  height: 1000px;
  background-color: #60add3;
  position: absolute;
  top: 0;
  left: 0;
`;

const Menu = styled.ul`
  padding: 0;
`;

const MenuItem = styled.li`
  padding: 20px;
  text-decoration: none;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

function SideMenu() {
  return (
    <Wrapper>
      <Menu>
        <MenuItem>
          <StyledLink to={"/member"}>會員專區</StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink to={"/category"}>酒吧分類</StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink to={"/main"}>酒吧總覽</StyledLink>
        </MenuItem>
      </Menu>
    </Wrapper>
  );
}

export default SideMenu;
