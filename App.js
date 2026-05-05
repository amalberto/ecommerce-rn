import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { store } from "./src/app/store";
import { loadCartFromSQLite } from "./src/features/cart/cartSlice";
import { setAuthReady, setAuthUser } from "./src/features/auth/authSlice";
import { fetchCatalog } from "./src/features/products/productsSlice";
import { loadProfile } from "./src/features/profile/profileSlice";
import { fetchOrders } from "./src/features/orders/ordersSlice";
import { initDatabase } from "./src/db/database";
import { subscribeToAuthChanges } from "./src/firebase/authService";
import AppNavigator from "./src/navigation/AppNavigator";
import LoadingView from "./src/components/LoadingView";

function Bootstrap() {
  const dispatch = useDispatch();
  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    let active = true;

    const prepareApp = async () => {
      await initDatabase();
      await Promise.all([
        dispatch(loadCartFromSQLite()),
        dispatch(fetchCatalog()),
      ]);

      if (active) {
        setDatabaseReady(true);
      }
    };

    prepareApp().catch(() => {
      if (active) {
        setDatabaseReady(true);
      }
    });

    return () => {
      active = false;
    };
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      dispatch(setAuthUser(user));
      dispatch(setAuthReady());

      if (user?.uid) {
        dispatch(loadProfile(user));
        dispatch(fetchOrders(user.uid));
      }
    });

    return unsubscribe;
  }, [dispatch]);

  if (!databaseReady) {
    return <LoadingView message="Preparando la tienda" />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Bootstrap />
    </Provider>
  );
}
