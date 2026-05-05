import { Image, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import PrimaryButton from "../../components/PrimaryButton";
import colors from "../../constants/colors";
import { ROUTES } from "../../constants/routes";

function Avatar({ profile }) {
  if (profile?.avatarUri) {
    return <Image source={{ uri: profile.avatarUri }} style={styles.avatarImage} />;
  }

  const initial = (profile?.displayName || "Invitado").trim().charAt(0).toUpperCase();
  return (
    <View style={styles.avatarFallback}>
      <Text style={styles.avatarInitial}>{initial}</Text>
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const profile = useSelector((state) => state.profile.data) || { displayName: "Invitado", avatarUri: null };
  const displayName = profile.displayName || "Invitado";

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Avatar profile={profile} />
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>Modo invitado</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Nombre</Text>
          <Text style={styles.infoValue}>{displayName}</Text>
          <Text style={styles.infoLabel}>Perfil</Text>
          <Text style={styles.infoValue}>Guardado en este dispositivo</Text>
        </View>
        <PrimaryButton title="Editar perfil" onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)} style={styles.button} />
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
  infoBox: {
    alignSelf: "stretch",
    marginTop: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: 14,
    gap: 4,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  infoValue: {
    marginBottom: 8,
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
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
  },
});