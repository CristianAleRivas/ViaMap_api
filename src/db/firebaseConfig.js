import admin from "firebase-admin";
import dotenv from "dotenv";
import { readFileSync } from "fs";

dotenv.config();

const serviceAccount = JSON.parse(
  readFileSync(process.env.FIREBASE_ADMIN_KEY, "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { db, bucket };
