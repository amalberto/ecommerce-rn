import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AuthNavigator from "./AuthNavigator";
import MainTabs from "./MainTabs";
import LoadingView from "../components/LoadingView";

export default function AppNavigator() {
  const { user, isReady } = useSelector((state) => state.auth);

  if (!isReady) {
    return <LoadingView message="Cargando sesion" />;
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}