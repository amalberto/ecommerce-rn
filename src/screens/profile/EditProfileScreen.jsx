import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "../../components/PrimaryButton";
import colors from "../../constants/colors";
import { saveProfile } from "../../features/profile/profileSlice";
import { getErrorMessage } from "../../utils/validators";

export default function EditProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.data);
  const status = useSelector((state) => state.profile.status);
  const [displayName, setDisplayName] = useState("");
  const [avatarUri, setAvatarUri] = useState(null);

  useEffect(() => {
    setDisplayName(profile?.displayName || "");
    setAvatarUri(profile?.avatarUri || null);
  }, [profile]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu camara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert("Nombre requerido", "Ingresa un nombre para tu perfil.");
      return;
    }

    try {
      await dispatch(saveProfile({
        displayName: displayName.trim(),
        avatarUri,
      })).unwrap();
      navigation.goBack();
    } catch (error) {
      Alert.alert("No se pudo guardar", getErrorMessage(error));
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarBox}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>Foto</Text>
            </View>
          )}
        </View>
        <View style={styles.actions}>
          <PrimaryButton title="Galeria" onPress={pickImage} variant="secondary" style={styles.actionButton} />
          <PrimaryButton title="Camara" onPress={takePhoto} variant="secondary" style={styles.actionButton} />
        </View>
        <TextInput
          placeholder="Nombre"
          placeholderTextColor={colors.muted}
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.input}
        />
        <Text style={styles.email}>La foto y el nombre se guardan localmente con SQLite.</Text>
        <PrimaryButton title="Guardar cambios" onPress={handleSave} loading={status === "loading"} style={styles.saveButton} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  avatarBox: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.surfaceMuted,
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 75,
    backgroundColor: colors.surfaceMuted,
  },
  avatarText: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: "900",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
  },
  input: {
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  email: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 14,
  },
  saveButton: {
    marginTop: 22,
  },
});