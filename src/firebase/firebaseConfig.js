const firebaseDatabaseUrl = process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL;
const fallbackFirebaseDatabaseUrl = "https://demo-project-default-rtdb.firebaseio.com";

export const isFirebaseConfigured = Boolean(firebaseDatabaseUrl);

if (!isFirebaseConfigured) {
  console.warn("Falta EXPO_PUBLIC_FIREBASE_DATABASE_URL. La app usará una URL demo; configurá .env para usar tu Realtime Database.");
}

export const firebaseConfig = {
  databaseURL: firebaseDatabaseUrl || fallbackFirebaseDatabaseUrl,
};

export const firebaseRestBaseUrl = firebaseConfig.databaseURL.replace(/\/$/, "");