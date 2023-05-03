import {createContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {collection, setDoc, doc, getDoc} from "firebase/firestore";
import {db} from "../App";
import {DocumentData} from "firebase/firestore";

export interface User {
  name: string;
  email: string;
  userImg: string;
  userUID: string;
}

interface AuthContextType {
  isLogin: boolean;
  user: User;
  loading: boolean;
  userUID: string;
  signIn: (auth: Auth, provider: GoogleAuthProvider) => Promise<void>;
  logOut: (auth: Auth) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isLogin: false,
  user: {
    name: "",
    email: "",
    userImg: "",
    userUID: "",
  },
  loading: false,
  userUID: "",
  signIn: async () => {},
  logOut: async () => {},
});
const initialUserData: User = {
  name: "",
  email: "",
  userImg: "",
  userUID: "",
};
export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<User>(initialUserData);
  const [loading, setLoading] = useState<boolean>(true);
  const [userUID, setUserUID] = useState<string>("");
  const navigate = useNavigate();

  async function getUsers(userUID: string) {
    const docRef = doc(db, "users", userUID);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        const getUser = await getUsers(user.uid);
        setUserUID(user.uid);
        if (getUser) {
          setIsLogin(true);

          console.log("有此使用者");

          const data: User = {
            name: getUser.name || user.displayName || "",
            email: getUser.email || user.email || "",
            userImg: getUser.photoURL || user.photoURL || "",
            userUID: getUser.userUID || user.uid || "",
          };
          setUser(data);
          setUserUID(user.uid);
        } else {
          console.log("沒有此使用者");
          setIsLogin(true);

          const data: User = {
            name: user.displayName || "",
            email: user.email || "",
            userImg: user.photoURL || "",
            userUID: user.uid || "",
          };
          setUser(data);
        }
      } else {
        setIsLogin(false);
        console.log("登出");
      }
    });
  }, []);

  async function setUserDoc(data: DocumentData) {
    const docRef = doc(db, "users", `${data.userUID}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("帳戶已存在");
      navigate("/main");
      return;
    } else {
      console.log("帳戶不存在");
      const userRef = collection(db, "users");
      await setDoc(doc(userRef, data.userUID), data);
      navigate("/question");
    }
  }

  const signIn = async (
    auth: ReturnType<typeof getAuth>,
    provider: GoogleAuthProvider
  ) => {
    const res = await signInWithPopup(auth, provider);
    const user = res.user;
    const data: User = {
      name: user.displayName || "",
      email: user.email || "",
      userImg: user.photoURL || "",
      userUID: user.uid || "",
    };
    await setUserDoc(data);
    setUser(data);
    setUserUID(data.userUID);
    setIsLogin(true);
  };

  const logOut = async (auth: Auth): Promise<void> => {
    setLoading(false);
    await signOut(auth);
    setUser(initialUserData);
    setUserUID("");
    setIsLogin(false);
    setLoading(false);
    navigate(`/`, {replace: true});
  };

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        user,
        loading,
        userUID,
        signIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
