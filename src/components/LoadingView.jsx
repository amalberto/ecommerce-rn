import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

export default function LoadingView({ message = "Cargando" }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: 24,
  },
  message: {
    marginTop: 14,
    color: colors.muted,
    fontSize: 15,
  },
});