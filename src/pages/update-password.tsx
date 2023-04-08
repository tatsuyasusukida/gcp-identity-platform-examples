import { initializeApp } from "firebase/app";
import {
  EmailAuthProvider,
  User,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { MouseEvent, useEffect, useState } from "react";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
});

const auth = getAuth(app);

export default function UpdatePassword() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );

        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);

        console.log("OK");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1>Update Password</h1>
      {loading && <p>Loading...</p>}
      {!loading && user === null && <p>Sign out</p>}
      {!loading && user !== null && (
        <form>
          <div>
            <label htmlFor="currentPassword">Current password</label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="newPassword">New password</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
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
