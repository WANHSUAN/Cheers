import React, {useEffect, useState} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {db} from "../../App";
import {doc, getDoc, setDoc} from "firebase/firestore";

export interface IAuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const {children} = props;
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const AuthCheck = onAuthStateChanged(auth, async (user) => {
      // 已經登入，可以在這裡進行 Firestore 資料的讀取和寫入操作
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);
        if (!userSnapshot.exists()) {
          const {displayName, email} = user;
          const createdAt = new Date();
          await setDoc(userDocRef, {
            displayName,
            email,
            createdAt,
          });
        }
        setLoading(false);
        // 如果使用者存在直接回傳 userDocRef
        return userDocRef;
      } else {
        console.log("unauthorized");
        navigate("/login");
      }
    });
    return () => AuthCheck();
  }, [auth]);

  if (loading) return <p>loading...</p>;
  return <>{children}</>;
};

export default AuthRoute;
