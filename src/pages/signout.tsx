import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { MouseEvent } from "react";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
});

const auth = getAuth(app);

export default function Signout() {
  const onSubmit = async (event: MouseEvent) => {
    event.preventDefault();

    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1>Signout</h1>
      <button type="button" onClick={onSubmit}>
        Signout
      </button>
    </>
  );
}
