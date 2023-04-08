import { initializeApp } from "firebase/app";
import { EmailAuthProvider, getAuth, linkWithCredential } from "firebase/auth";
import { MouseEvent, useState } from "react";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
});

const auth = getAuth(app);

export default function AnonymousLink() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onClick = async (event: MouseEvent) => {
    event.preventDefault();

    try {
      if (auth.currentUser !== null) {
        const credential = EmailAuthProvider.credential(email, password);
        linkWithCredential(auth.currentUser, credential);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1>Anonymous link</h1>
      <form>
        <div>
          <label htmlFor="email">Email</label>]
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>]
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit" onClick={onClick}>
          Link
        </button>
      </form>
    </>
  );
}
