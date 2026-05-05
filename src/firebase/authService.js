import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebaseConfig";

const requireFirebase = () => {
  if (!isFirebaseConfigured) {
    throw new Error("Configura Firebase en .env antes de usar autenticacion remota.");
  }
};

export const mapFirebaseUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => callback(mapFirebaseUser(user)));
};

export const loginWithEmail = async ({ email, password }) => {
  requireFirebase();
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return mapFirebaseUser(credential.user);
};

export const signupWithEmail = async ({ email, password, displayName }) => {
  requireFirebase();
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);

  if (displayName) {
    await updateProfile(credential.user, { displayName: displayName.trim() });
  }

  return mapFirebaseUser(auth.currentUser || credential.user);
};

export const logout = async () => {
  await signOut(auth);
};