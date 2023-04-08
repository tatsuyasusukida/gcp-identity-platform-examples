import { initializeApp } from "firebase/app";
import {
  EmailAuthProvider,
  User,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updateEmail,
} from "firebase/auth";
import { MouseEvent, useEffect, useState } from "react";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
});

const auth = getAuth();

export default function UpdateEmail() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [password, setPassword] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");

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

  const onSubmit = async (event: MouseEvent) => {
    try {
      event.preventDefault();

      if (user?.email) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        await updateEmail(user, newEmail);

        console.log("OK");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1>Update email</h1>
      {loading && <p>Loading...</p>}
      {!loading && error !== null && <p>Error: {error.message}</p>}
      {!loading && user !== null && (
        <>
          <dl>
            <dt>User ID</dt>
            <dd>{user.uid}</dd>
          </dl>
          <form>
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
            <div>
              <label htmlFor="newEmail">New email</label>
              <input
                type="email"
                name="newEmail"
                id="newEmail"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
              />
            </div>
            <button type="submit" onClick={onSubmit}>
              Update email
            </button>
          </form>
        </>
      )}
    </>
  );
}
