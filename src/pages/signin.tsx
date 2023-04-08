import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { MouseEvent, useEffect, useState } from "react";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
});

const auth = getAuth(app);

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit = async (event: MouseEvent) => {
    event.preventDefault();

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);

      console.log(user);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1>Signin</h1>
      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit" onClick={onSubmit}>
          Signin
        </button>
      </form>
    </>
  );
}
