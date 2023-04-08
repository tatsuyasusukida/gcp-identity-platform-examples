import { FirebaseError, initializeApp } from "firebase/app";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  User,
  getAuth,
  linkWithCredential,
  onAuthStateChanged,
  reauthenticateWithRedirect,
} from "firebase/auth";
import { MouseEvent, ReactNode, useEffect, useState } from "react";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
});

const auth = getAuth(app);

export default function Link() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    const unsubscrbie = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );

    return unsubscrbie;
  }, []);

  const onClick = async (event: MouseEvent) => {
    try {
      event.preventDefault();

      if (user !== null && user.email !== null) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await linkWithCredential(user, credential);
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        console.log(err.code);
        if (err.code === "auth/requires-recent-login") {
          if (user !== null) {
            const provider = new GoogleAuthProvider();
            reauthenticateWithRedirect(user, provider);
          }
        }
      }

      console.error(err);
    }
  };

  let main: ReactNode;
  user?.providerData[0]?.providerId;
  if (isLoading) {
    main = <p>Loading...</p>;
  } else if (error) {
    main = <p>Error: {error.message}</p>;
  } else if (!user) {
    main = <p>Sign out</p>;
  } else {
    main = (
      <>
        <dl>
          <dt>User ID</dt>
          <dd>{user.uid}</dd>

          <dt>Email</dt>
          <dd>{user.email}</dd>
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
          <button type="submit" onClick={onClick}>
            Link
          </button>
        </form>
      </>
    );
  }

  return (
    <main>
      <h1>Link</h1>
      {main}
    </main>
  );
}
