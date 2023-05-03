import {useState, useContext} from "react";
import styled from "styled-components/macro";
import "./styles.css";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import algoliasearch from "algoliasearch/lite";
import {
  SearchBox,
  Hits,
  Index,
  Highlight,
  InstantSearch,
  Snippet,
  CurrentRefinements,
} from "react-instantsearch-hooks-web";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {AuthContext} from "../../Context/AuthContext";
import side from "./side.png";

const searchClient = algoliasearch(
  "W1FJ2ENITZ",
  "2e0351bed6525d14fcf871febd4909f2"
);

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
  margin: 5px 0;
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
  align-items: center;
`;

const SearchItem = styled.button`
  width: 100px;
  height: 30px;
  background-color: #000;
  color: #fff;
  border: none;
  font-size: 20px;
  position: relative;
  cursor: pointer;
`;

const SideMenuWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url(${side}) no-repeat center center fixed;
  background-size: cover;
  z-index: 1;
`;

const SideMenuList = styled.ul`
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 20px;
  text-align: center;
  margin: 16% auto;
  gap: 40px;
`;

const MenuItem = styled.li`
  width: 480px;
  list-style: none;
  font-size: 90px;
  margin: 50px 0;
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

const LogOutButton = styled.button`
  background-color: transparent;
  border: none;
  width: 480px;
  font-size: 90px;
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 16px;
  color: #fff;
  cursor: pointer;
`;

const SearchWrapper = styled.div`
  text-align: center;
  margin: 0 auto;
`;

const InstantSearchContainer = styled.div`
  width: 400px;
  position: absolute;
  top: 30px;
  right: 0;
  ul,
  ol {
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
    top: 0;
    right: 11%;
  }
`;

const SelectBarsButton = styled.button`
  width: 97px;
  height: 30px;
  border: 1px solid #ffffff7c;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(3px);
  color: #fff;
  position: absolute;
  top: 80px;
  right: 145px;
  cursor: pointer;

  &:hover {
    background-color: #d19b18;
    border: #d19b18;
  }
`;

const SelectEventsButton = styled.button`
  width: 97px;
  height: 30px;
  border: 1px solid #ffffff7c;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(3px);
  color: #fff;
  position: absolute;
  top: 80px;
  right: 45px;
  cursor: pointer;

  &:hover {
    background-color: #d19b18;
    border: #d19b18;
  }
`;

const SearchBarSection = styled(Link)`
  text-decoration: none;
`;

const StyledSearchBarSection = styled.div`
  padding: 30px;
  text-align: left;
  line-height: 25px;
`;

const BarName = styled.p`
  color: #d19b18;
  font-size: 35px;
  padding: 0 5px;
`;

const BarTel = styled.p`
  color: #c3c1c4;
  font-size: 15px;
  padding: 5px;
`;

const BarAddress = styled.p`
  color: #fff;
  font-size: 13px;
  padding: 0 5px;
`;

const BarIntroduction = styled.p`
  color: #be7808;
  font-size: 17px;
  padding: 30px 5px 0 5px;
  text-align: left;
`;

const StyledSearchEventSection = styled.div`
  padding: 30px;
`;

const SearchEventSection = styled(Link)`
  text-decoration: none;
`;

const EventBar = styled.p`
  color: #d19b18;
  font-size: 35px;
  padding: 0 5px;
  text-align: left;
`;

const EventContent = styled.p`
  color: #be7808;
  font-size: 18px;
  padding: 20px 5px 0;
  text-align: left;
`;

type HandleSideMenuType = () => void;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isToggle, setIsToggle] = useState(false);

  const auth = getAuth();
  const {logOut} = useContext(AuthContext);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  function handleLogOut() {
    logOut(auth);
    handleSideMenu();
    navigate("/");
  }

  const handleSideMenu: HandleSideMenuType = () => {
    setIsToggle(!isToggle);
  };

  const canvasStyle = {
    display: "flex",
    width: "100vw",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
  };

  const menuButtonStyle = {
    marginLeft: "2rem",
    cursor: "pointer",
  };

  function OpenSearch() {
    setIsOpen(!isOpen);
  }

  return (
    <Wrapper>
      <Nav>
        <MenuSection>
          <div className="menu-toggle" onClick={() => setIsToggle(!isToggle)}>
            <div className={isToggle ? "hamBox hamBoxOpen" : "hamBox"}>
              <span className={isToggle ? "lineTop spin" : "lineTop"}></span>
              <span
                className={isToggle ? "lineBottom spin" : "lineBottom"}
              ></span>
              <div
                className="nav-overlay"
                style={{
                  top: isToggle ? "0" : "-100%",
                  transitionDelay: isToggle ? "0s" : "0s",
                }}
              >
                <SideMenuList>
                  <MenuItem>
                    <StyledLink onClick={handleSideMenu} to={"/member"}>
                      Member
                    </StyledLink>
                  </MenuItem>
                  <MenuItem>
                    <StyledLink onClick={handleSideMenu} to={"/main"}>
                      All Bars
                    </StyledLink>
                  </MenuItem>
                  <MenuItem>
                    <StyledLink onClick={handleSideMenu} to={"/category"}>
                      Category
                    </StyledLink>
                  </MenuItem>
                  <LogOutButton onClick={handleLogOut}>Log Out</LogOutButton>
                </SideMenuList>
              </div>
            </div>
          </div>
          <Menu>MENU</Menu>
        </MenuSection>
        <Title to={"./main"}>CHEERS</Title>
        <SearchSection>
          <SearchItem onClick={OpenSearch}>SEARCH</SearchItem>
          {isOpen && <Search />}
        </SearchSection>
      </Nav>
    </Wrapper>
  );
};

const MySearchComponent = () => {
  const [showBars, setShowBars] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [searchBoxVisible, setSearchBoxVisible] = useState(true); // 新增一個狀態用來控制 SearchBox 的顯示

  const BarsTemplate = ({
    hit,
  }: {
    hit: {
      objectID: string;
      name: string;
      address: string;
      tel: string;
      introduction: string;
      __position: number;
    };
  }) => {
    return (
      <StyledSearchBarSection onClick={() => setSearchBoxVisible(false)}>
        <SearchBarSection to={`/bars/${hit.objectID}`}>
          <BarName>
            <Highlight
              attribute="name"
              hit={hit}
              nonHighlightedTagName="span"
            />
          </BarName>
          <BarTel>
            <Highlight attribute="tel" hit={hit} nonHighlightedTagName="span" />
          </BarTel>
          <BarAddress>
            <Highlight
              attribute="address"
              hit={hit}
              nonHighlightedTagName="span"
              highlightedTagName="mark"
            />
          </BarAddress>
          <BarIntroduction>
            <Snippet
              attribute="introduction"
              hit={hit}
              nonHighlightedTagName="span"
              highlightedTagName="mark" // 指定 highlight 顯示的標籤
            />
          </BarIntroduction>
        </SearchBarSection>
      </StyledSearchBarSection>
    );
  };

  const EventsTemplate = ({
    hit,
  }: {
    hit: {objectID: string; bar: string; content: string; __position: number};
  }) => {
    return (
      <StyledSearchEventSection onClick={() => setSearchBoxVisible(false)}>
        <SearchEventSection to={`/events/${hit.objectID}`}>
          <EventBar>
            <Highlight attribute="bar" hit={hit} nonHighlightedTagName="span" />
          </EventBar>
          <EventContent>
            <Snippet
              attribute="content"
              hit={hit}
              nonHighlightedTagName="span"
            />
          </EventContent>
        </SearchEventSection>
      </StyledSearchEventSection>
    );
  };

  const handleBarsClick = () => {
    setShowBars(true);
    setShowEvents(false);
    setSearchBoxVisible(true); // 當切換到 Bars 時，顯示 SearchBox
  };

  const handleEventsClick = () => {
    setShowBars(false);
    setShowEvents(true);
    setSearchBoxVisible(true); // 當切換到 Bars 時，顯示 SearchBox
  };
  return (
    <>
      <InstantSearchContainer>
        <InstantSearch searchClient={searchClient} indexName="bars">
          <CurrentRefinements />
          {searchBoxVisible && (
            <>
              <SearchBox
                placeholder="Search"
                searchAsYouType={true}
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowBars(!showBars);
                  setShowEvents(!showEvents);
                }}
              />
              <SelectBarsButton onClick={handleBarsClick}>
                Bars
              </SelectBarsButton>
              <SelectEventsButton onClick={handleEventsClick}>
                Events
              </SelectEventsButton>
              {showBars ? <Hits hitComponent={BarsTemplate} /> : null}
              <Index indexName="events">
                {showEvents ? <Hits hitComponent={EventsTemplate} /> : null}
              </Index>
            </>
          )}
        </InstantSearch>
      </InstantSearchContainer>
    </>
  );
};

const Search = () => {
  return (
    <SearchWrapper>
      <MySearchComponent />
    </SearchWrapper>
  );
};

export default Header;
