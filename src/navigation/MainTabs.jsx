import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { ROUTES } from "../constants/routes";
import HomeScreen from "../screens/shop/HomeScreen";
import CategoryScreen from "../screens/shop/CategoryScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import colors from "../constants/colors";
import { selectCartCount } from "../features/cart/cartSlice";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ShopStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} options={{ title: "Tienda" }} />
      <Stack.Screen name={ROUTES.CATEGORY} component={CategoryScreen} options={({ route }) => ({ title: route.params?.title || "Categoria" })} />
      <Stack.Screen name={ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} options={{ title: "Detalle" }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} options={{ title: "Perfil" }} />
      <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfileScreen} options={{ title: "Editar perfil" }} />
    </Stack.Navigator>
  );
}

const stackOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTitleStyle: { color: colors.ink, fontWeight: "800" },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.background },
};

export default function MainTabs() {
  const cartCount = useSelector(selectCartCount);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
      }}
    >
      <Tab.Screen name={ROUTES.SHOP_TAB} component={ShopStack} options={{ title: "Tienda" }} />
      <Tab.Screen
        name={ROUTES.CART_TAB}
        component={CartScreen}
        options={{ title: "Carrito", tabBarBadge: cartCount || undefined }}
      />
      <Tab.Screen name={ROUTES.ORDERS_TAB} component={OrdersScreen} options={{ title: "Ordenes" }} />
      <Tab.Screen name={ROUTES.PROFILE_TAB} component={ProfileStack} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  );
}