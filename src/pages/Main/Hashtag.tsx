import {collection, getDocs} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import {HashLink} from "react-router-hash-link";
import styled from "styled-components/macro";
import {db} from "../../utils/firebase";

const Wrapper = styled.div`
  width: 1100px;
`;

const HashTagSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 300px auto 500px;
`;

const HashtagType = styled(HashLink)`
  text-decoration: none;
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
                className="hashtag"
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
