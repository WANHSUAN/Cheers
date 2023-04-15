import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {db} from "../../App";
import {collection, getDocs} from "firebase/firestore";

const Wrapper = styled.div`
  width: 700px;
  display: flex;
  margin: 20px auto;
`;

const HashtagType = styled(Link)`
  text-decoration: none;
`;

const StyledHashtagType = styled.p`
  margin: 5px;
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
      {hashtags.map((hashtag, index) => {
        return (
          <StyledHashtagType key={index}>
            <HashtagType to={"/category"} style={{color: hashtag.colorCode}}>
              #{hashtag.type}
            </HashtagType>
          </StyledHashtagType>
        );
      })}
    </Wrapper>
  );
};

export default HashtagPage;
