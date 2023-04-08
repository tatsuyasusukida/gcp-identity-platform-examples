import { FirebaseError, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  getRedirectResult,
  signInWithRedirect,
} from "firebase/auth";
import { MouseEvent, useEffect } from "react";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
});

const auth = getAuth(app);

export default function GoogleRedirect() {
  useEffect(() => {
    (async () => {
      const userCredential = await getRedirectResult(auth);
      console.log(userCredential);
    })();
  }, []);

  const onClick = async (event: MouseEvent) => {
    event.preventDefault();

    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (err) {
      if (err instanceof FirebaseError) {
        console.error(err.code);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <>
      <h1>Google Redirect</h1>
      <button type="button" onClick={onClick}>
        Continue with Google
      </button>
    </>
  );
}
