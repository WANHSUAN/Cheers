import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {useContext, useEffect, useState} from "react";
import {AiOutlineMinusCircle} from "react-icons/ai";
import {Link, useNavigate} from "react-router-dom";
import styled from "styled-components/macro";
import {AuthContext} from "../../Context/AuthContext";
import {db} from "../../utils/firebase";

const Like = styled.strong`
  color: #d19b18;
`;

const WelcomeTitle = styled.strong`
  color: #fff;
`;

const PageImg = styled.img`
  width: 100vw;
  height: 400px;
  object-fit: cover;
  padding-top: 60px;
`;

const Wrapper = styled.div`
  max-width: 1300px;
  width: 80%;
  margin: 0 auto;
  padding-top: 60px;
`;

const MemberTitle = styled.h1`
  margin-bottom: 50px;
  padding: 50px 0;
  color: #d19b18;
  font-size: 45px;

  @media (max-width: 768px) {
    font-size: 30px;
  }

  @media (max-width: 414px) {
    font-size: 20px;
  }
`;

const MemberSection = styled.div`
  display: flex;
  margin-bottom: 200px;
`;

const MemberImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #ffffff7c;
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 30px;
`;

const MemberName = styled.p`
  color: #fff;
  font-size: 30px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const MemberEmail = styled.p`
  color: #fff;
  font-size: 20px;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const RecommendationTitle = styled.h2`
  color: #fff;
  font-size: 30px;
  margin: 100px 0 40px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const RecommendationSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ImgList = styled.ul`
  list-style: none;
`;

const RecommendationName = styled(Link)`
  width: 300px;
  margin: 0 auto;
  text-decoration: none;
  color: #fff;
  font-size: 40px;
  padding: 5px;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

const RecommendationItem = styled.li`
  border: 5px solid transparent;
  box-sizing: border-box;
  width: 33.33%;
  float: left;
  position: relative;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 50%;
  }

  @media (max-width: 414px) {
    width: 100%;
  }

  &:before {
    transition: all 0.5s ease;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #333;
    transform: scale(0);
  }

  &:hover {
    ${RecommendationName} {
      opacity: 1;
    }
  }

  &:hover:before {
    opacity: 0.5;
    transform: scale(1);
  }

  &:after {
    transition: all 0.6s ease 0.2s;
    content: "";
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border: 1px solid #aaa;
    background: #000;
    opacity: 0;
    transform: scale(0);
  }

  &:hover:after {
    opacity: 0.6;
    transform: scale(1);
  }
`;

const StyledRecommendationImg = styled.img`
  max-width: 100%;
  vertical-align: middle;
  position: relative;
`;

const LikeTitle = styled.h2`
  color: #fff;
  font-size: 30px;
  margin: 100px 0 40px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const LikeDeleteButton = styled.button`
  width: 60px;
  height: 20px;
  border: none;
  background-color: rgba(255, 255, 255, 0);
  color: #ffffff93;
  font-size: 35px;
  padding-top: 5px;
  cursor: pointer;
  position: absolute;
  top: 2%;
  right: 0;
  z-index: 2;

  &:hover {
    color: #ffffffc4;
  }
`;
interface ILikes {
  name: string;
  link: string;
  img: string;
  score: number;
  address: string;
  id: string;
  barId: string;
  barImg: string;
  barName: string;
}

interface IUser {
  createdAt: string;
  displayName: string;
  email: string;
  id: string;
  matchingBars: [
    {
      name: string;
      img: string;
      id: string;
    }
  ];
  name: string;
  userImg: string;
  userUID: string;
}

const MemberPage = () => {
  const {user, userUID} = useContext(AuthContext);
  const [likes, setLikes] = useState<ILikes[]>([]);
  const [users, setUsers] = useState<IUser[] | undefined>();
  const [matchIndex, setMatchIndex] = useState<number | undefined>(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    let foundMatch = false;
    const getDatas = async () => {
      const usersCollectionRef = collection(db, "users");

      if (userUID === "") {
        return;
      }

      const userRef = doc(usersCollectionRef, userUID);
      const likesCollectionRef = collection(userRef, "likes");
      const like = await getDocs(likesCollectionRef);
      setLikes(
        like.docs.map((doc) => ({...(doc.data() as ILikes), id: doc.id}))
      );

      const getUsers = async () => {
        const user = await getDocs(usersCollectionRef);
        const loadedUsers = user.docs.map((doc) => ({
          ...(doc.data() as IUser),
          id: doc.id,
        }));
        setUsers(loadedUsers);

        loadedUsers.some((loadedUser, index) => {
          if (loadedUser.userUID === userUID) {
            setMatchIndex(index);
            foundMatch = true;
            return true;
          }
        });
      };
      getUsers();

      if (!foundMatch) {
        setMatchIndex(undefined);
      }
    };

    getDatas();
  }, [userUID]);

  if (users === undefined) {
    return <p>Loading...</p>;
  }

  const handleDeleteLikeClick = async (likeDocId: string) => {
    setIsDeleting(true);
    const likesRef = collection(db, "users", userUID, "likes");
    const q = query(likesRef, where("barId", "==", likeDocId));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      likeDocId = doc.id;
    });

    if (likeDocId) {
      const likeRef = doc(db, "users", userUID, "likes", likeDocId);
      await deleteDoc(likeRef);
      const updatedLikes = likes?.filter((like) => like.id !== likeDocId);
      setLikes(updatedLikes);
    }
    setIsDeleting(false);
  };

  if (matchIndex) {
    return (
      <>
        <PageImg
          src={
            "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          }
        />
        <Wrapper>
          <MemberTitle>
            <WelcomeTitle>Welcome,</WelcomeTitle> {user.name}!
          </MemberTitle>
          <MemberSection>
            <MemberImg src={user.userImg} />
            <MemberInfo>
              <MemberName>{user.name}</MemberName>
              <MemberEmail>{user.email}</MemberEmail>
            </MemberInfo>
          </MemberSection>
          <>
            {likes === undefined ? (
              <p>Loading...</p>
            ) : (
              <>
                <LikeTitle>
                  The Bars you <Like>LIKE</Like>
                </LikeTitle>
                <RecommendationSection>
                  {isDeleting && <p>Deleting...</p>}
                  <ImgList>
                    {likes.map((like, index) => (
                      <RecommendationItem key={index}>
                        <StyledRecommendationImg src={like.barImg} />
                        <RecommendationName to={`/bars/${like.id}`}>
                          {like.barName}
                        </RecommendationName>
                        <LikeDeleteButton
                          onClick={() => handleDeleteLikeClick(like.id)}
                        >
                          <AiOutlineMinusCircle />
                        </LikeDeleteButton>
                      </RecommendationItem>
                    ))}
                  </ImgList>
                </RecommendationSection>
              </>
            )}
          </>
          <RecommendationTitle>
            We <Like>RECOMMEND</Like> the bars for you
          </RecommendationTitle>
          <RecommendationSection>
            <ImgList>
              {users[matchIndex].matchingBars.map((matchingBar, index: any) => (
                <RecommendationItem key={index}>
                  <StyledRecommendationImg src={matchingBar.img[1]} />
                  <RecommendationName to={`/bars/${matchingBar.id}`}>
                    {matchingBar.name}
                  </RecommendationName>
                </RecommendationItem>
              ))}
            </ImgList>
          </RecommendationSection>
        </Wrapper>
      </>
    );
  }
  return <>{navigate("/question")}</>;
};
export default MemberPage;
