import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "../../components/PrimaryButton";
import colors from "../../constants/colors";
import { ROUTES } from "../../constants/routes";
import { logoutUser } from "../../features/auth/authSlice";

function Avatar({ profile, user }) {
  if (profile?.avatarUri) {
    return <Image source={{ uri: profile.avatarUri }} style={styles.avatarImage} />;
  }

  const initial = (profile?.displayName || user?.email || "U").trim().charAt(0).toUpperCase();
  return (
    <View style={styles.avatarFallback}>
      <Text style={styles.avatarInitial}>{initial}</Text>
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.profile.data);
  const syncError = useSelector((state) => state.profile.syncError);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      Alert.alert("No se pudo cerrar sesion", String(error));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Avatar profile={profile} user={user} />
        <Text style={styles.name}>{profile?.displayName || user?.displayName || "Usuario"}</Text>
        <Text style={styles.email}>{profile?.email || user?.email}</Text>
        {syncError ? <Text style={styles.warning}>{syncError}</Text> : null}
        <PrimaryButton title="Editar perfil" onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)} style={styles.button} />
        <PrimaryButton title="Cerrar sesion" onPress={handleLogout} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  panel: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 20,
  },
  avatarImage: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: colors.surfaceMuted,
  },
  avatarFallback: {
    width: 118,
    height: 118,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 59,
    backgroundColor: colors.primary,
  },
  avatarInitial: {
    color: colors.surface,
    fontSize: 46,
    fontWeight: "900",
  },
  name: {
    marginTop: 16,
    color: colors.ink,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  email: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 15,
    textAlign: "center",
  },
  warning: {
    marginTop: 12,
    color: colors.warning,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  button: {
    alignSelf: "stretch",
    marginTop: 20,
    marginBottom: 10,
  },
});