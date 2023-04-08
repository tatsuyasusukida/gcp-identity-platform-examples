import { initializeApp } from "firebase/app";
import {
  User,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
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
  const [email, setEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onSubmit = async (event: MouseEvent) => {
    event.preventDefault();

    try {
      if (user !== null) {
        await sendPasswordResetEmail(auth, email);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1>Delete User</h1>
      {loading && <p>Loading...</p>}
      {!loading && user === null && <p>Sign out</p>}
      {!loading && user !== null && (
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
            Send Password Reset Email
          </button>
        </form>
      )}
    </>
  );
}
