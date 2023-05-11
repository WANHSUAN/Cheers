import {
  Auth,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import {createContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {db} from "../utils/firebase";

export interface Bar {
  id: string;
  name: string;
  img: string;
  description: string;
  type: string[];
}

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
  bars: Bar[];
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
  bars: [],
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
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<User>(initialUserData);
  const [loading, setLoading] = useState<boolean>(true);
  const [userUID, setUserUID] = useState<string>("");
  const [bars, setBars] = useState<Bar[]>([]);
  const barsCollectionRef = collection(db, "bars");

  const navigate = useNavigate();

  const getUsers = async (userUID: string) => {
    const docRef = doc(db, "users", userUID);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const getUser = await getUsers(user.uid);
        const data = {
          name: getUser?.name || user.displayName || "",
          email: getUser?.email || user.email || "",
          userImg: getUser?.photoURL || user.photoURL || "",
          userUID: getUser?.userUID || user.uid || "",
        };
        setUser(data);
        setUserUID(user.uid);
        setIsLogin(true);
        console.log(getUser ? "有此使用者" : "沒有此使用者");
        const barsData = await getDocs(barsCollectionRef);
        const newData = barsData.docs.map((doc) => {
          const bar = doc.data() as Bar;
          return {...bar, id: doc.id};
        });
        setBars(newData);
      } else {
        setIsLogin(false);
        navigate("/");
        console.log("登出");
      }
    });
  }, []);

  const setUserDoc = async (data: DocumentData) => {
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
  };

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
        bars,
        signIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
