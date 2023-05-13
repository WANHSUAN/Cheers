import {collection, getDocs} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import {HashLink} from "react-router-hash-link";
import styled, {keyframes} from "styled-components/macro";
import {db} from "../../utils/firebase";

const Wrapper = styled.div`
  width: 1100px;
`;

const HashTagSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 300px auto 500px;
`;

const Lights = keyframes`
  0% {
    color: hsl(42, 79%, 46%);
    text-shadow: 0 0 1em hsla(27, 85%, 45%, 0.2),
      0 0 0.125em hsla(10, 77%, 52%, 0.3),
      -1em -0.125em 0.5em hsla(40, 100%, 60%, 0),
      1em 0.125em 0.5em hsla(200, 100%, 60%, 0);
  }

  30% {
    color: hsl(42, 79%, 46%);
    text-shadow: 0 0 1em hsla(27, 85%, 45%, 0.5),
      0 0 0.125em hsla(10, 77%, 52%, 0.3),
      -0.5em -0.125em 0.25em hsla(40, 100%, 60%, 0.2),
      0.5em 0.125em 0.25em hsla(212, 66%, 63%, 0.4);
  }

  40% {
    color: hsl(42, 79%, 46%);
    text-shadow: 0 0 1em hsla(27, 85%, 45%, 0.5),
      0 0 0.125em hsla(10, 77%, 52%, 0.5),
      -0.25em -0.125em 0.125em hsla(40, 100%, 60%, 0.2),
      0.25em 0.125em 0.125em hsla(212, 66%, 63%, 0.4);
  }

  70% {
    color: hsl(42, 79%, 46%);
    text-shadow: 0 0 1em hsla(27, 85%, 50%, 0.5),
      0 0 0.125em hsla(10, 77%, 52%, 0.5),
      0.5em -0.125em 0.25em hsla(40, 100%, 60%, 0.2),
      -0.5em 0.125em 0.25em hsla(212, 66%, 63%, 0.4);
  }

  100% {
    color: hsl(42, 79%, 46%);
    text-shadow: 0 0 1em hsla(27, 85%, 50%, 0.3),
      0 0 0.125em hsla(10, 77%, 52%, 0.3),
      1em -0.125em 0.5em hsla(40, 100%, 60%, 0),
      -1em 0.125em 0.5em hsla(200, 100%, 60%, 0);
  }

`;

const HashtagType = styled(HashLink)`
  text-decoration: none;
  display: flex;
  flex-wrap: wrap;
  font-size: 35px;
  font-weight: 300;
  justify-content: center;
  animation: ${Lights} 5s 750ms linear infinite;

  &:hover {
    transform: translateY(-10px);
    transition: ease 0.5s;
  }
`;

const StyledHashtagType = styled.p`
  width: 220px;
  font-size: 30px;
  margin: 30px 0;
`;

interface IHashtag {
  type: [];
  colorCode: string;
  id: string;
}

export interface IHashtagProps {}

const HashtagPage: React.FC<IHashtagProps> = (props: IHashtagProps) => {
  const [hashtags, setHashtags] = useState<IHashtag[]>([]);
  const hashtagsCollectionRef = collection(db, "hashtags");

  useEffect(() => {
    const getHashtags = async () => {
      const data = await getDocs(hashtagsCollectionRef);
      setHashtags(
        data.docs.map((doc) => ({...(doc.data() as IHashtag), id: doc.id}))
      );
    };

    getHashtags();
  }, []);

  if (hashtags.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <Wrapper>
      {/* <HashTagSection>
        {hashtags.map((hashtag, index) => {
          return (
            <StyledHashtagType key={index}>
              <HashtagType
                key={index}
                smooth
                to={`/category#${hashtag.type}`}
                style={{color: hashtag.colorCode}}
              >
                #{hashtag.type}
              </HashtagType>
            </StyledHashtagType>
          );
        })}
      </HashTagSection> */}
    </Wrapper>
  );
};

export default HashtagPage;
