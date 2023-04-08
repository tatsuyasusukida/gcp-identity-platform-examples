import { initializeApp } from "firebase/app";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { FC, ReactNode, useContext, useEffect, useState } from "react";
import { createContext } from "react";

initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
});

type AuthContextProps = {
  loading: boolean;
  user: User | null;
  error: Error | null;
};

const AuthContext = createContext<AuthContextProps | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [value, setValue] = useState<AuthContextProps>({
    loading: true,
    user: null,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      getAuth(),
      (user) => setValue({ loading: false, user, error: null }),
      (error) => setValue({ loading: false, user: null, error })
    );

    return unsubscribe;
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

function useAuth() {
  const auth = useContext(AuthContext);

  if (auth === null) {
    throw new Error("auth === null");
  }

  return auth;
}

export default function UserContext() {
  return (
    <AuthProvider>
      <UserContextChild></UserContextChild>
    </AuthProvider>
  );
}

const UserContextChild: FC = () => {
  const auth = useAuth();

  return (
    <>
      <h1>User Context</h1>
      {auth.loading && <p>Loading...</p>}
      {!auth.loading && auth.user === null && <p>Signed out</p>}
      {!auth.loading && auth.user !== null && <p>User ID = {auth.user.uid}</p>}
    </>
  );
};
