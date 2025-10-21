import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function WelcomeScreen() {
  const [saving, setSaving] = useState(false);

  const completeOnboarding = useCallback(async () => {
    try {
      setSaving(true);
      await AsyncStorage.setItem("hasOnboarded", "true");
      router.replace("/(tabs)");
    } catch (e) {
      console.warn("Failed to persist onboarding flag", e);
    } finally {
      setSaving(false);
    }
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">Bem-vindo ao Tiviu</ThemedText>
        <ThemedText style={styles.subtitle}>
          Uma breve introdução do app pode ir aqui. Toque em Continuar para
          começar.
        </ThemedText>
      </View>
      <Pressable
        onPress={completeOnboarding}
        disabled={saving}
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.8 },
          saving && { opacity: 0.6 },
        ]}
      >
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          {saving ? "Aguarde…" : "Continuar"}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    marginTop: 48,
    gap: 8,
    alignItems: "center",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.8,
  },
  button: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignSelf: "stretch",
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "white",
  },
});
