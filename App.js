import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { store } from "./src/app/store";
import { loadCartFromSQLite } from "./src/features/cart/cartSlice";
import { loadProfile } from "./src/features/profile/profileSlice";
import { initDatabase } from "./src/db/database";
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
        dispatch(loadProfile()),
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
