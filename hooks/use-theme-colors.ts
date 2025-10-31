import { Colors } from "@/constants/theme";
import { useColorScheme } from "react-native";

/**
 * Hook para obter cores do tema atual (light/dark) automaticamente.
 *
 * @example
 * ```tsx
 * const colors = useThemeColors();
 * <View style={{ backgroundColor: colors.background }}>
 *   <Text style={{ color: colors.text }}>Hello</Text>
 * </View>
 * ```
 */
export function useThemeColors() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme ?? "dark"];
}
