import { initializeApp } from "firebase/app";
import {
  EmailAuthProvider,
  User,
  deleteUser,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
} from "firebase/auth";
import { MouseEvent, useEffect, useState } from "react";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
});

const auth = getAuth(app);

export default function DeleteUser() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");

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
      if (user !== null && user.email !== null) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        await deleteUser(user);
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button type="button" onClick={onSubmit}>
            Delete
          </button>
        </form>
      )}
    </>
  );
}
