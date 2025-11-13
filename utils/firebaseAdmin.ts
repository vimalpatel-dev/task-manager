import * as admin from "firebase-admin";

const {
  FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
  FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
} = process.env;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
      clientEmail: FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      privateKey: FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
