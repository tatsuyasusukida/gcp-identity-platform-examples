import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { MouseEvent } from "react";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
});

const auth = getAuth(app);

export default function AnonymousAuth() {
  const onClick = async (event: MouseEvent) => {
    event.preventDefault();

    try {
      const userCredential = await signInAnonymously(auth);
      console.log(userCredential);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1>Anonymous auth</h1>
      <button type="button" onClick={onClick}>
        Signin anonymously
      </button>
    </>
  );
}
