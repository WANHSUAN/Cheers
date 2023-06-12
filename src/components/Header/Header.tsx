import algoliasearch from "algoliasearch/lite";
import {GoogleAuthProvider, getAuth} from "firebase/auth";
import {useContext, useEffect, useRef, useState} from "react";
import {
  CurrentRefinements,
  Highlight,
  Hits,
  Index,
  InstantSearch,
  SearchBox,
  Snippet,
} from "react-instantsearch-hooks-web";
import {Link, useNavigate} from "react-router-dom";
import {HashLink} from "react-router-hash-link";
import styled from "styled-components/macro";
import {AuthContext} from "../../Context/AuthContext";
import side from "./side.png";
import "./styles.css";

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID!,
  process.env.REACT_APP_ALGOLIA_API_KEY!
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

const NavCenter = styled.div`
  width: 100vw;
  height: 60px;
  background-color: #000;
  padding: 0 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Menu = styled.p`
  color: #fff;
  margin: 5px 0;
  font-size: 20px;

  &:hover {
    color: #d19b18;
    transition: ease 0.5s;
  }
`;

const MenuSection = styled.div`
  display: flex;
  gap: 20px;
  padding-top: 5px;
`;

const MenuToggle = styled.div`
  cursor: pointer;
  display: flex;
  gap: 10px;
`;

const HamBox = styled.div<IToggleProps>`
  position: relative;
  width: 30px;
  height: 30px;
  cursor: pointer;
  border-radius: 50%;
  transition: 0.3s ease;
  ${({isToggle}) =>
    isToggle &&
    `
  background: #2a2a2f;
  `}

  &:hover {
    background: #2a2a2f;
    color: #d19b18;
  }
`;

const TopLine = styled.span<IToggleProps>`
  margin: 0 auto;
  position: absolute;
  top: 1em;
  display: block;
  width: 14px;
  height: 2px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5);
  left: 0;
  right: 0;
  transform: rotate(0deg);
  transition: all 0.4s;
  ${({isToggle}) =>
    isToggle &&
    `top: 0.875em;
  transform: rotate(135deg);
  background: #fff;
  `}
`;

const BottomLine = styled.span<IToggleProps>`
  margin: 0 auto;
  position: absolute;
  bottom: 1em;
  display: block;
  width: 14px;
  height: 2px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5);
  left: 0;
  right: 0;
  transform: rotate(0deg);
  transition: all 0.4s;
  ${({isToggle}) =>
    isToggle &&
    `bottom: 0.875em;
  transform: rotate(225deg);
  background: #fff;
  `}
`;

const Title = styled(Link)`
  font-size: 35px;
  color: #fff;
  text-decoration: none;
`;

const NavOverlay = styled.div<IToggleProps>`
  position: fixed;
  background: url(${side}) no-repeat center center;
  background-size: cover;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(3px);
  color: #fff;
  z-index: -1;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: auto;
  padding: 4em;
  transition: all 2s cubic-bezier(0.16, 1, 0.3, 1);
  top: ${({isToggle}) => (isToggle ? "0" : "-100%")};
  transition-delay: ${({isToggle}) => (isToggle ? "0s" : "0s")};
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

  :hover {
    color: #d19b18;
    transition: ease 0.5s;
  }
`;

const SideMenuList = styled.ul`
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 20px;
  margin: 12% auto;
  gap: 40px;
  text-align: center;
`;

const MenuItem = styled.li`
  width: 42%;
  list-style: none;
  font-size: 90px;
  margin: 50px 0;
  padding: 0 30px;
  position: relative;
`;

const StyledLink = styled(HashLink)`
  color: #fff;
  text-decoration: none;
  display: inline-block;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    display: block;
    background: none repeat scroll 0 0 transparent;
    height: 2px;
    width: 0;
    background: #fff;
    transition: width 0.3s ease 0s, left 0.3s ease 0s;
  }

  &:hover::after {
    width: 100%;
    left: 0;
  }
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
  width: 195px;
  height: 40px;
  border: 1px solid #ffffff7c;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(3px);
  color: #fff;
  position: absolute;
  top: 90px;
  right: 250px;
  cursor: pointer;

  &:hover {
    background-color: #d19b18;
    border: #d19b18;
    transition: ease 0.5s;
  }

  &:active {
    background-color: #d19b18;
    border: #d19b18;
  }
`;

const SelectEventsButton = styled.button`
  width: 195px;
  height: 40px;
  border: 1px solid #ffffff7c;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(3px);
  color: #fff;
  position: absolute;
  top: 90px;
  right: 45px;
  cursor: pointer;

  &:hover {
    background-color: #d19b18;
    border: #d19b18;
    transition: ease 0.5s;
  }

  &:active {
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
  font-size: 30px;
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
  font-size: 15px;
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
  font-size: 30px;
  padding: 0 5px;
  text-align: left;
`;

const EventContent = styled.p`
  color: #be7808;
  font-size: 15px;
  padding: 20px 5px 0;
  text-align: left;
`;

interface IToggleProps {
  isToggle: boolean;
}

interface ISearchProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type HandleSideMenuType = () => void;

const Header = () => {
  const auth = getAuth();
  const {logOut, isLogin} = useContext(AuthContext);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const [isOpen, setIsOpen] = useState(false);
  const [isToggle, setIsToggle] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [isOpen]);

  provider.setCustomParameters({
    prompt: "select_account",
  });

  const handleLogOut = () => {
    logOut(auth);
    handleSideMenu();
    navigate("/");
  };

  const handleSideMenu: HandleSideMenuType = () => {
    setIsToggle(!isToggle);
  };

  if (!isLogin)
    return (
      <Wrapper>
        <NavCenter>
          <Title to={"./login"}>CHEERS</Title>
        </NavCenter>
      </Wrapper>
    );

  return (
    <Wrapper>
      <Nav>
        <MenuSection>
          <MenuToggle onClick={() => setIsToggle(!isToggle)}>
            <HamBox isToggle={isToggle}>
              <TopLine isToggle={isToggle} />
              <BottomLine isToggle={isToggle} />
              <NavOverlay isToggle={isToggle}>
                <SideMenuList>
                  <MenuItem>
                    <StyledLink onClick={handleSideMenu} to={"/member"}>
                      Member
                    </StyledLink>
                  </MenuItem>
                  <MenuItem>
                    <StyledLink
                      onClick={handleSideMenu}
                      smooth
                      to={"/main#allbars"}
                    >
                      All Bars
                    </StyledLink>
                  </MenuItem>
                  <MenuItem>
                    <StyledLink onClick={handleSideMenu} to={"/category"}>
                      Category
                    </StyledLink>
                  </MenuItem>
                  <MenuItem>
                    <StyledLink onClick={handleLogOut} to={"/"}>
                      Log Out
                    </StyledLink>
                  </MenuItem>
                </SideMenuList>
              </NavOverlay>
            </HamBox>

            <Menu>MENU</Menu>
          </MenuToggle>
        </MenuSection>
        <Title to={"./main"}>CHEERS</Title>
        <SearchSection>
          <div ref={ref}>
            <SearchItem onClick={() => setIsOpen(!isOpen)}>SEARCH</SearchItem>
            {isOpen && <Search isOpen={isOpen} setIsOpen={setIsOpen} />}
          </div>
        </SearchSection>
      </Nav>
    </Wrapper>
  );
};

const MySearchComponent = ({isOpen, setIsOpen}: ISearchProps) => {
  const [showBars, setShowBars] = useState(false);
  const [showEvents, setShowEvents] = useState(false);

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
      <StyledSearchBarSection onClick={() => setIsOpen(false)}>
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
              highlightedTagName="mark"
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
      <StyledSearchEventSection onClick={() => setIsOpen(false)}>
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
    setIsOpen(true);
  };

  const handleEventsClick = () => {
    setShowBars(false);
    setShowEvents(true);
    setIsOpen(true);
  };
  return (
    <>
      <InstantSearchContainer>
        <InstantSearch searchClient={searchClient} indexName="bars">
          <CurrentRefinements />
          {isOpen && (
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

const Search = ({isOpen, setIsOpen}: ISearchProps) => {
  return (
    <SearchWrapper>
      <MySearchComponent isOpen={isOpen} setIsOpen={setIsOpen} />
    </SearchWrapper>
  );
};

export default Header;
