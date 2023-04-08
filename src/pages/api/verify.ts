import { apps, auth, credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import type { NextApiRequest, NextApiResponse } from "next";

if (apps.length === 0) {
  initializeApp({
    credential: credential.cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID,
    }),
  });
}

type Data = {
  ok: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (typeof req.headers.authorization == "undefined") {
    res.status(401).end();
    return;
  }

  const idToken = req.headers.authorization.split(" ")[1];

  try {
    const user = await auth().verifyIdToken(idToken);
    console.log(JSON.stringify(user, null, 2));
  } catch (err) {
    console.error(err);
  }

  res.send({ ok: true });
}
