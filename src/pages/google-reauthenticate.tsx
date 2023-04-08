import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  User,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  reauthenticateWithRedirect,
} from "firebase/auth";
import { MouseEvent, useEffect, useState } from "react";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
});

const auth = getAuth();

export default function GoogleDelete() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setUser(null);
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const credential = await getRedirectResult(auth);
        console.log(credential);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const onSubmit = async (event: MouseEvent) => {
    try {
      event.preventDefault();

      if (user !== null) {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithRedirect(user, provider);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1>Google delete</h1>
      {loading && <p>Loading...</p>}
      {!loading && error !== null && <p>Error: {error.message}</p>}
      {!loading && user === null && <p>Signed out</p>}
      {!loading && user !== null && (
        <>
          <dl>
            <dt>User ID</dt>
            <dd>{user.uid}</dd>
          </dl>
          <button type="submit" onClick={onSubmit}>
            Reauthenticate
          </button>
        </>
      )}
    </>
  );
}
