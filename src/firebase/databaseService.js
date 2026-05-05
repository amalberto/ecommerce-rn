import { equalTo, get, orderByChild, push, query, ref, set, update } from "firebase/database";
import { database, isFirebaseConfigured } from "./firebaseConfig";

const requireFirebase = () => {
  if (!isFirebaseConfigured) {
    throw new Error("Configura Firebase Realtime Database en .env para sincronizar datos remotos.");
  }
};

const snapshotToArray = (snapshot) => {
  if (!snapshot.exists()) {
    return [];
  }

  const value = snapshot.val();
  return Object.keys(value).map((key) => ({ id: key, ...value[key] }));
};

export const fetchCategoriesRemote = async () => {
  requireFirebase();
  const snapshot = await get(ref(database, "categories"));
  return snapshotToArray(snapshot);
};

export const fetchProductsRemote = async () => {
  requireFirebase();
  const snapshot = await get(ref(database, "products"));
  return snapshotToArray(snapshot).map((product) => ({
    ...product,
    categoryId: product.categoryId || product.category_id,
  }));
};

export const fetchOrdersRemote = async (userId) => {
  requireFirebase();
  const ordersQuery = query(ref(database, "orders"), orderByChild("userId"), equalTo(userId));
  const snapshot = await get(ordersQuery);
  return snapshotToArray(snapshot).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
};

export const createOrderRemote = async (userId, order) => {
  requireFirebase();
  const orderRef = push(ref(database, "orders"));
  const payload = {
    ...order,
    id: orderRef.key,
    userId,
    createdAt: new Date().toISOString(),
  };

  await set(orderRef, payload);
  return payload;
};

export const fetchProfileRemote = async (userId) => {
  requireFirebase();
  const snapshot = await get(ref(database, `profiles/${userId}`));
  return snapshot.exists() ? snapshot.val() : null;
};

export const saveProfileRemote = async (userId, profile) => {
  requireFirebase();
  const payload = {
    email: profile.email || null,
    displayName: profile.displayName || null,
    avatarUri: profile.avatarUri || null,
    updatedAt: new Date().toISOString(),
  };

  await update(ref(database, `profiles/${userId}`), payload);
  return { id: userId, ...payload };
};