import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../constants/routes";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import colors from "../constants/colors";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.ink, fontWeight: "800" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} options={{ title: "Ingresar" }} />
      <Stack.Screen name={ROUTES.SIGNUP} component={SignupScreen} options={{ title: "Crear cuenta" }} />
    </Stack.Navigator>
  );
}