import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "../../components/PrimaryButton";
import colors from "../../constants/colors";
import { signupUser } from "../../features/auth/authSlice";
import { getErrorMessage, validateEmail, validatePassword } from "../../utils/validators";

export default function SignupScreen({ navigation }) {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!displayName.trim()) {
      Alert.alert("Nombre requerido", "Ingresa tu nombre para crear el perfil.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Correo invalido", "Ingresa un correo con formato valido.");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert("Contrasena incompleta", "La contrasena debe tener al menos 6 caracteres.");
      return;
    }

    try {
      await dispatch(signupUser({ displayName, email, password })).unwrap();
    } catch (error) {
      Alert.alert("No se pudo crear la cuenta", getErrorMessage(error));
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Crea tu cuenta</Text>
        <TextInput
          placeholder="Nombre"
          placeholderTextColor={colors.muted}
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.input}
        />
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Correo electronico"
          placeholderTextColor={colors.muted}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Contrasena"
          placeholderTextColor={colors.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <PrimaryButton title="Registrarme" onPress={handleSubmit} loading={authStatus === "loading"} />
        <Pressable onPress={() => navigation.goBack()} style={styles.linkButton}>
          <Text style={styles.link}>Ya tengo cuenta</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  form: {
    gap: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 18,
  },
  title: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 8,
  },
  input: {
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    color: colors.text,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 6,
  },
  link: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },
});