import { StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";
import PrimaryButton from "./PrimaryButton";

export default function ErrorState({ title = "No se pudo cargar", message, onRetry }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {onRetry ? <PrimaryButton title="Reintentar" onPress={onRetry} variant="secondary" style={styles.button} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  title: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  message: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  button: {
    marginTop: 16,
  },
});