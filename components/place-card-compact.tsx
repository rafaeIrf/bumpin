import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface PlaceCardCompactProps {
  place: {
    id: string;
    name: string;
    type: string;
    category: string;
    categoryIcon: string;
    distance: number;
    activeUsers: number;
    image?: string;
    isFavorite?: boolean;
  };
  plansCount?: number;
  onClick: () => void;
  onPlansClick?: () => void;
  onToggleFavorite?: () => void;
}

const GRADIENTS: Record<string, [string, string]> = {
  restaurant: ["#E74C3C", "#C0392B"],
  bar: ["#F39C12", "#D35400"],
  cafe: ["#8E6E53", "#5C4033"],
  night_club: ["#8E44AD", "#2C3E50"],
  gym: ["#27AE60", "#145A32"],
  default: ["#1D9BF0", "#16181C"],
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PlaceCardCompact({
  place,
  plansCount = 0,
  onClick,
  onPlansClick,
  onToggleFavorite,
}: PlaceCardCompactProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const gradient = GRADIENTS[place.type] || GRADIENTS.default;

  return (
    <AnimatedPressable
      onPress={onClick}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, animatedStyle]}
    >
      <View style={styles.cardInner}>
        <View style={styles.content}>
          {/* Icon with gradient background */}
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <IconSymbol
              name={getIconForType(place.type) as any}
              size={40}
              color="#fff"
            />
          </LinearGradient>

          {/* Content */}
          <View style={styles.textContent}>
            <View style={styles.headerRow}>
              <View style={styles.titleContainer}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.placeName}
                  numberOfLines={1}
                >
                  {place.name}
                </ThemedText>
                <Text style={styles.categoryText}>
                  {place.categoryIcon} {place.type}
                </Text>
              </View>

              {/* Favorite button */}
              {onToggleFavorite && (
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                  }}
                  style={styles.favoriteButton}
                >
                  <IconSymbol
                    name={place.isFavorite ? "heart.fill" : "heart"}
                    size={16}
                    color={place.isFavorite ? "#FF453A" : "#8B98A5"}
                  />
                </Pressable>
              )}
            </View>

            <View style={styles.metaRow}>
              {place.activeUsers > 0 && (
                <View style={styles.activeUsersContainer}>
                  <IconSymbol name="person.2.fill" size={14} color="#1D9BF0" />
                  <Text style={styles.activeUsersText}>
                    {place.activeUsers}
                  </Text>
                </View>
              )}
              <View style={styles.distanceContainer}>
                <IconSymbol name="mappin" size={14} color="#8B98A5" />
                <Text style={styles.metaText}>
                  {place.distance.toFixed(1)}km
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

function getIconForType(type: string): string {
  const icons: Record<string, string> = {
    restaurant: "fork.knife",
    bar: "wineglass",
    cafe: "cup.and.saucer.fill",
    night_club: "music.note.house.fill",
    gym: "figure.walk",
    park: "tree.fill",
    shopping_mall: "bag.fill",
    default: "mappin.circle.fill",
  };
  return icons[type] || icons.default;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  cardInner: {
    backgroundColor: "#16181C",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2F3336",
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textContent: {
    flex: 1,
    minWidth: 0,
    flexDirection: "column",
    justifyContent: "center",
    gap: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  titleContainer: {
    flex: 1,
    minWidth: 0,
  },
  placeName: {
    color: "#E7E9EA",
    fontSize: 16,
  },
  categoryText: {
    color: "#8B98A5",
    fontSize: 14,
    marginTop: 2,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  activeUsersContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  activeUsersText: {
    fontSize: 12,
    color: "#1D9BF0",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#8B98A5",
  },
});
