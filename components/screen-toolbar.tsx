import { IconSymbol } from "@/components/ui/icon-symbol";
import { typography } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export interface ToolbarAction {
  icon: string; // SF Symbol name
  onClick: () => void;
  ariaLabel: string;
}

export type ViewMode = "list" | "map";

interface ScreenToolbarProps {
  // Basic toolbar props
  leftAction?: ToolbarAction;
  title: string;
  titleIcon?: string; // SF Symbol name
  rightActions?: ReactNode;

  // View toggle props
  showViewToggle?: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  viewToggleVariant?: "default" | "compact";

  // Scroll animation
  scrollY?: SharedValue<number>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export function ScreenToolbar({
  leftAction,
  title,
  titleIcon,
  rightActions,
  showViewToggle = false,
  viewMode = "list",
  onViewModeChange,
  viewToggleVariant = "compact",
  scrollY,
}: ScreenToolbarProps) {
  const animatedBlurStyle = useAnimatedStyle(() => {
    if (!scrollY) return { opacity: 0 };

    const opacity = interpolate(scrollY.value, [0, 50], [0, 1], "clamp");

    return {
      opacity,
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};

    const backgroundColor = interpolate(
      scrollY.value,
      [0, 50],
      [0, 0.4],
      "clamp"
    );

    return {
      backgroundColor: `rgba(0, 0, 0, ${backgroundColor})`,
    };
  });

  const renderViewToggle = () => {
    if (!showViewToggle || !onViewModeChange) return null;

    if (viewToggleVariant === "compact") {
      return (
        <>
          <ViewToggleButton
            mode="list"
            currentMode={viewMode}
            onPress={() => onViewModeChange("list")}
            icon="list.bullet"
            label="Vista em lista"
            compact
          />
          <ViewToggleButton
            mode="map"
            currentMode={viewMode}
            onPress={() => onViewModeChange("map")}
            icon="map"
            label="Vista em mapa"
            compact
          />
        </>
      );
    }

    // Default variant (full width buttons)
    return (
      <>
        <ViewToggleButton
          mode="list"
          currentMode={viewMode}
          onPress={() => onViewModeChange("list")}
          icon="list.bullet"
          label="Lista"
        />
        <ViewToggleButton
          mode="map"
          currentMode={viewMode}
          onPress={() => onViewModeChange("map")}
          icon="map"
          label="Mapa"
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      {/* Animated background overlay */}
      <Animated.View
        style={[StyleSheet.absoluteFill, animatedBackgroundStyle]}
      />

      {/* Animated blur layer */}
      <AnimatedBlurView
        intensity={80}
        tint="systemMaterialDark"
        experimentalBlurMethod="dimezisBlurView"
        style={[StyleSheet.absoluteFill, animatedBlurStyle]}
      />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.row}>
          {/* Left Action */}
          {leftAction && (
            <ActionButton
              icon={leftAction.icon}
              onPress={leftAction.onClick}
              ariaLabel={leftAction.ariaLabel}
            />
          )}

          {/* Title */}
          <View style={styles.titleContainer}>
            {titleIcon && (
              <IconSymbol name={titleIcon as any} size={20} color="#1D9BF0" />
            )}
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Right Actions */}
          <View style={styles.rightActions}>
            {renderViewToggle()}
            {rightActions}
          </View>
        </View>
      </View>
    </View>
  );
}

function ActionButton({
  icon,
  onPress,
  ariaLabel,
}: {
  icon: string;
  onPress: () => void;
  ariaLabel: string;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.actionButton, animatedStyle]}
      accessibilityLabel={ariaLabel}
    >
      <IconSymbol name={icon as any} size={20} color="#E7E9EA" />
    </AnimatedPressable>
  );
}

function ViewToggleButton({
  mode,
  currentMode,
  onPress,
  icon,
  label,
  compact = false,
}: {
  mode: ViewMode;
  currentMode: ViewMode;
  onPress: () => void;
  icon: string;
  label: string;
  compact?: boolean;
}) {
  const isActive = mode === currentMode;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(compact ? 0.95 : 0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  if (compact) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.compactToggleButton,
          isActive
            ? styles.compactToggleButtonActive
            : styles.compactToggleButtonInactive,
          animatedStyle,
        ]}
        accessibilityLabel={label}
      >
        <IconSymbol
          name={icon as any}
          size={20}
          color={isActive ? "#fff" : "#8B98A5"}
        />
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.defaultToggleButton,
        isActive
          ? styles.defaultToggleButtonActive
          : styles.defaultToggleButtonInactive,
        animatedStyle,
      ]}
    >
      <IconSymbol
        name={icon as any}
        size={20}
        color={isActive ? "#fff" : "#8B98A5"}
      />
      <Text
        style={[
          styles.defaultToggleButtonText,
          isActive
            ? styles.defaultToggleButtonTextActive
            : styles.defaultToggleButtonTextInactive,
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(47, 51, 54, 0.5)",
  },
  content: {
    padding: 16,
    paddingTop: 64, // Account for status bar (48px) + extra spacing
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#16181C",
    borderWidth: 1,
    borderColor: "#2F3336",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    ...typography.body,
    color: "#E7E9EA",
    // fontSize: 18,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  compactToggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  compactToggleButtonActive: {
    backgroundColor: "#1D9BF0",
  },
  compactToggleButtonInactive: {
    backgroundColor: "#16181C",
    borderWidth: 1,
    borderColor: "#2F3336",
  },
  defaultToggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  defaultToggleButtonActive: {
    backgroundColor: "#1D9BF0",
  },
  defaultToggleButtonInactive: {
    backgroundColor: "#16181C",
    borderWidth: 1,
    borderColor: "#2F3336",
  },
  defaultToggleButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  defaultToggleButtonTextActive: {
    color: "#fff",
  },
  defaultToggleButtonTextInactive: {
    color: "#8B98A5",
  },
});
