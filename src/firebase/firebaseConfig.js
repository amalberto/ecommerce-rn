const firebaseDatabaseUrl = process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL;
const fallbackFirebaseDatabaseUrl = "https://demo-project-default-rtdb.firebaseio.com";

export const isFirebaseConfigured = Boolean(firebaseDatabaseUrl);

export const firebaseConfig = {
  databaseURL: firebaseDatabaseUrl || fallbackFirebaseDatabaseUrl,
};

export const firebaseRestBaseUrl = firebaseConfig.databaseURL.replace(/\/$/, "");