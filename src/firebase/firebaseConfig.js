import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";

const firebaseApiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const firebaseAuthDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
const firebaseDatabaseUrl = process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL;
const firebaseProjectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const firebaseStorageBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
const firebaseMessagingSenderId = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const firebaseAppId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;

export const isFirebaseConfigured = Boolean(
  firebaseApiKey
    && firebaseAuthDomain
    && firebaseDatabaseUrl
    && firebaseProjectId
    && firebaseAppId,
);

export const firebaseConfig = {
  apiKey: firebaseApiKey || "demo-api-key",
  authDomain: firebaseAuthDomain || "demo-project.firebaseapp.com",
  databaseURL: firebaseDatabaseUrl || "https://demo-project-default-rtdb.firebaseio.com",
  projectId: firebaseProjectId || "demo-project",
  storageBucket: firebaseStorageBucket || "demo-project.appspot.com",
  messagingSenderId: firebaseMessagingSenderId || "000000000000",
  appId: firebaseAppId || "1:000000000000:web:demo",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let authInstance;

try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const database = getDatabase(app);