import {
  Auth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
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
import {Alert, CommentText} from "../components/Alert/Alert";
import {db} from "../utils/firebase";

export interface IBar {
  id: string;
  name: string;
  img: string;
  description: string;
  type: string[];
}

export interface IUser {
  name: string;
  email: string;
  userImg: string;
  userUID: string;
}

interface IAuthContextType {
  isLogin: boolean;
  user: IUser;
  loading: boolean;
  userUID: string;
  signIn: (auth: Auth, provider: GoogleAuthProvider) => Promise<void>;
  logOut: (auth: Auth) => Promise<void>;
  bars: IBar[];
  nativeSignIn: (auth: Auth, email: string, password: string) => Promise<void>;
  nativeSignUp: (auth: Auth, email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<IAuthContextType>({
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
  nativeSignIn: async (auth: Auth, email: string, password: string) => {},
  nativeSignUp: async (auth: Auth, email: string, password: string) => {},
});

const initialUserData: IUser = {
  name: "",
  email: "",
  userImg: "",
  userUID: "",
};

export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>(initialUserData);
  const [loading, setLoading] = useState<boolean>(true);
  const [userUID, setUserUID] = useState<string>("");
  const [bars, setBars] = useState<IBar[]>([]);
  const [showAlert, setShowAlert] = useState(true);
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
        const barsData = await getDocs(barsCollectionRef);
        const newData = barsData.docs.map((doc) => {
          const bar = doc.data() as IBar;
          return {...bar, id: doc.id};
        });
        setBars(newData);
      } else {
        setIsLogin(false);
        navigate("/");
      }
    });
  }, []);

  const setUserDoc = async (data: DocumentData) => {
    const docRef = doc(db, "users", `${data.userUID}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      navigate("/main");
      return;
    } else {
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
    const data: IUser = {
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
    navigate("/", {replace: true});
  };

  const showNativeAuthErrorMessage = (errorCode: any) => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3500);

    return (
      <>
        {showAlert && (
          <Alert color="#fba78d">
            <CommentText>{errorCode}</CommentText>
          </Alert>
        )}
      </>
    );
  };

  const nativeSignIn = async (auth: Auth, email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: any) => {
        const user = userCredential.user;
        if (user) {
          getUsers(user);
          navigate("/main");
          return;
        } else {
          navigate("/question");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        showNativeAuthErrorMessage(errorCode);
      });
  };

  const nativeSignUp = async (auth: Auth, email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: any) => {
        const user = userCredential.user;
        const data: any = {
          name: user.email.split("@")[0] || "",
          email: user.email || "",
          userUID: user.uid || "",
          matchingBars: [],
        };
        setUserDoc(data);
        setUser(data);
        setUserUID(data.userUID);
        setIsLogin(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        showNativeAuthErrorMessage(errorCode);
      });
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
        nativeSignIn,
        nativeSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
