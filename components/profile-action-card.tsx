import { ThemedText } from "@/components/themed-text";
import { spacing, typography } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface ProfileActionCardProps {
  readonly icon: React.ComponentType<{
    width: number;
    height: number;
    color: string;
  }>;
  readonly titleKey: string;
  readonly onPress: () => void;
}

export function ProfileActionCard({
  icon: Icon,
  titleKey,
  onPress,
}: ProfileActionCardProps) {
  const colors = useThemeColors();

  return (
    <Pressable onPress={onPress} style={styles.actionCard}>
      <LinearGradient
        colors={["#1C1C1C", "#0F0F0F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.actionCardGradient}
      >
        <View
          style={[
            styles.actionCardIcon,
            { backgroundColor: "rgba(41, 151, 255, 0.15)" },
          ]}
        >
          <Icon width={20} height={20} color={colors.accent} />
        </View>
        <ThemedText style={[typography.caption, { color: colors.text }]}>
          {titleKey}
        </ThemedText>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionCard: {
    flex: 1,
    height: 100,
  },
  actionCardGradient: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: spacing.sm,
    paddingStart: spacing.sm,
    shadowColor: "#2997FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(41, 151, 255, 0.2)",
  },
  actionCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
});
