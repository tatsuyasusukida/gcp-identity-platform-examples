import { initializeApp } from "firebase/app";
import {
  User,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import { MouseEvent, useEffect, useState } from "react";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
});

const auth = getAuth(app);

export default function VerifyEmail() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onClick = async (event: MouseEvent) => {
    event.preventDefault();

    try {
      if (user !== null) {
        await sendEmailVerification(user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1>Update password</h1>
      {loading && <p>Loading...</p>}
      {!loading && user === null && <p>Sign out</p>}
      {!loading && user !== null && (
        <button type="button" onClick={onClick}>
          Verify Email
        </button>
      )}
    </>
  );
}
