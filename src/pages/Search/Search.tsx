import styled from "styled-components";
import {Link} from "react-router-dom";
import algoliasearch from "algoliasearch/lite";
import {
  SearchBox,
  Hits,
  Index,
  Highlight,
  InstantSearch,
} from "react-instantsearch-hooks-web";

const searchClient = algoliasearch(
  "W1FJ2ENITZ",
  "2e0351bed6525d14fcf871febd4909f2"
);

const Wrapper = styled.div`
  width: 600px;
  text-align: center;
  margin: 0 auto;
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

const SearchBarSection = styled(Link)`
  text-decoration: none;
`;

const StyledSearchBarSection = styled.div`
  background-color: #ddd3f9;
  padding: 5px;
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
            />
          </BarAddress>
          <BarTel>
            <Highlight attribute="tel" hit={hit} nonHighlightedTagName="span" />
          </BarTel>
          <BarIntroduction>
            <Highlight
              attribute="introduction"
              hit={hit}
              nonHighlightedTagName="span"
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
            <Highlight
              attribute="content"
              hit={hit}
              nonHighlightedTagName="span"
            />
          </EventContent>
        </SearchEventSection>
      </StyledSearchEventSection>
    );
  };

  return (
    <>
      <SearchTitle>Search</SearchTitle>
      <InstantSearchContainer>
        <InstantSearch searchClient={searchClient} indexName="bars">
          <SearchBox
            placeholder="請輸入"
            searchAsYouType={true}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          />
          <p>Bars</p>
          <Hits hitComponent={BarsTemplate} />
          <Index indexName="events">
            <p>Events</p>
            <Hits hitComponent={EventsTemplate} />
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
