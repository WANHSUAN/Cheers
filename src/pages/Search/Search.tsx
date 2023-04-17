import {useState} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import SideMenu from "../../components/SideMenu/SideMenu";

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

const searchClient = algoliasearch(
  "W1FJ2ENITZ",
  "2e0351bed6525d14fcf871febd4909f2"
);

const Wrapper = styled.div`
  width: 400px;
  text-align: center;
  margin: 0 auto;
`;

const MenuButton = styled.button`
  width: 50px;
  height: 30px;
`;

const SearchTitle = styled.p``;

const InstantSearchContainer = styled.div`
  ul,
  ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

const BarTitle = styled.h2``;

const EventTitle = styled.h2``;

const SearchBarSection = styled(Link)`
  text-decoration: none;
`;

const StyledSearchBarSection = styled.div`
  background-color: #ddd3f9;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
`;

const BarName = styled.p`
  color: #000;
`;

const BarAddress = styled.p`
  color: #b9770e;
`;

const BarTel = styled.p`
  color: #e08069;
`;

const BarIntroduction = styled.p`
  color: #b06464;
`;

const StyledSearchEventSection = styled.div`
  background-color: #fad4b5;
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
`;

const SearchEventSection = styled(Link)`
  text-decoration: none;
`;

const EventBar = styled.p`
  color: #000;
`;

const EventContent = styled.p`
  color: #b06464;
`;

const MySearchComponent = () => {
  const [showBars, setShowBars] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
      <StyledSearchBarSection>
        <SearchBarSection to={`/bars/${hit.objectID}`}>
          <BarName>
            <Highlight
              attribute="name"
              hit={hit}
              nonHighlightedTagName="span"
            />
          </BarName>
          <BarAddress>
            <Highlight
              attribute="address"
              hit={hit}
              nonHighlightedTagName="span"
              highlightedTagName="mark"
            />
          </BarAddress>
          <BarTel>
            <Highlight attribute="tel" hit={hit} nonHighlightedTagName="span" />
          </BarTel>
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
      <StyledSearchEventSection>
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

  function handleMenuClick() {
    setShowMenu(!showMenu);
  }

  return (
    <>
      <MenuButton onClick={handleMenuClick}>Menu</MenuButton>
      {showMenu && <SideMenu />}
      <SearchTitle>Search</SearchTitle>
      <InstantSearchContainer>
        <InstantSearch searchClient={searchClient} indexName="bars">
          <CurrentRefinements />
          <SearchBox
            placeholder="請輸入"
            searchAsYouType={true}
            onSubmit={(e) => {
              e.preventDefault();
              setShowBars(!showBars);
              setShowEvents(!showEvents);
            }}
          />

          {showBars ? (
            <>
              <BarTitle>All Bars</BarTitle>
              <Hits hitComponent={BarsTemplate} />
            </>
          ) : null}
          <Index indexName="events">
            {showEvents ? (
              <>
                <EventTitle>All Events</EventTitle>
                <Hits hitComponent={EventsTemplate} />
              </>
            ) : null}
          </Index>
        </InstantSearch>
      </InstantSearchContainer>
    </>
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
