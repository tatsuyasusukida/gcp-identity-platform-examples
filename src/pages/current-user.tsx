import { initializeApp } from "firebase/app";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
});

const auth = getAuth(app);

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      setUser(user);

      console.log(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <h1>Current User</h1>
      {loading && <p>Loading...</p>}
      {!loading && user === null && <p>Sign out</p>}
      {!loading && user !== null && (
        <dl>
          <dt>User Id</dt>
          <dd>{user !== null ? user.uid : "-"}</dd>

          <dt>Email Verified</dt>
          <dd>
            {user !== null
              ? user.emailVerified
                ? "Verified"
                : "Not verified"
              : "-"}
          </dd>
        </dl>
      )}
    </>
  );
}
