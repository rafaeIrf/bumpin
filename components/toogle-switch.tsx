import { useThemeColors } from "@/hooks/use-theme-colors";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  colors: ReturnType<typeof useThemeColors>;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  colors,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(value ? 24 : 0) }],
  }));

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={[
        styles.toggle,
        { backgroundColor: value ? colors.accent : colors.border },
      ]}
    >
      <Animated.View style={[styles.toggleThumb, animatedStyle]} />
    </Pressable>
  );
};

export default ToggleSwitch;

const styles = StyleSheet.create({
  toggle: {
    width: 56,
    height: 32,
    borderRadius: 16,
    padding: 4,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
});
