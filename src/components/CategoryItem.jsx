import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

export default function CategoryItem({ category, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
    >
      <ImageBackground source={{ uri: category.image }} imageStyle={styles.image} style={styles.imageBox}>
        <View style={styles.overlay} />
        <Text numberOfLines={1} style={styles.title}>{category.title}</Text>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 152,
    height: 96,
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
  },
  pressed: {
    opacity: 0.86,
  },
  imageBox: {
    flex: 1,
    justifyContent: "flex-end",
  },
  image: {
    borderRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(23,32,38,0.38)",
  },
  title: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "800",
    padding: 12,
  },
});