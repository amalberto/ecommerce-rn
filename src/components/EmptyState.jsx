import { StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

export default function EmptyState({ title, message }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
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
    color: colors.ink,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  message: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});