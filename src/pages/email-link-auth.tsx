import { initializeApp } from "firebase/app";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { MouseEvent, useEffect, useState } from "react";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
});

const auth = getAuth(app);

export default function VerifyEmail() {
  const [email, setEmail] = useState("");

  const onSubmit = async (event: MouseEvent) => {
    event.preventDefault();

    try {
      await sendSignInLinkToEmail(auth, email, {
        url: "http://localhost:3000/current-user",
        handleCodeInApp: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1>Email Link</h1>
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
        <button type="submit" onClick={onSubmit}>
          Send signin link
        </button>
      </form>
    </>
  );
}
