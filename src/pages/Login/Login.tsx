import React, {useContext} from "react";
// import styled from "styled-components";
// import {getAuth, GoogleAuthProvider} from "firebase/auth";
// import {AuthContext} from "../../Context/AuthContext";

// const Wrapper = styled.div`
//   width: 500px;
//   height: 500px;
//   margin: 50px auto;
//   padding: 10px;
//   text-align: center;
//   background-color: #9bafba;
//   border-radius: 5px;
// `;

// const LoginTitle = styled.p`
//   font-size: 50px;
// `;

// const LoginButton = styled.button`
//   width: 200px;
//   height: 50px;
//   border: 1px solid #87c3e1;
//   border-radius: 5px;
//   font-size: 18px;
// `;

// export interface ILoginPageProps {}

// const LoginPage: React.FC<ILoginPageProps> = (props) => {
//   const auth = getAuth();
//   const {signIn} = useContext(AuthContext);
//   const provider = new GoogleAuthProvider();

//   return (
//     <Wrapper>
//       <LoginTitle>Join Us!</LoginTitle>
//       <LoginButton onClick={() => signIn(auth, provider)}>
//         Sign In with Google
//       </LoginButton>
//     </Wrapper>
//   );
// };

// export default LoginPage;
