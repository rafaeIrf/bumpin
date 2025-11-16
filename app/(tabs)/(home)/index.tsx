import {
  BeerIcon,
  CoffeeIcon,
  DumbbellIcon,
  FlameIcon,
  HeartIcon,
  MapPinIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from "@/assets/icons";
import { BaseTemplateScreen } from "@/components/base-template-screen";
import { useCustomBottomSheet } from "@/components/BottomSheetProvider/hooks";
import { CategoryCard } from "@/components/category-card";
import { ConnectionBottomSheet } from "@/components/connection-bottom-sheet";
import PlaceSearchContent from "@/components/place-search-content";
import { ScreenToolbar } from "@/components/screen-toolbar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { typography } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface ActivePlace {
  id: string;
  name: string;
  type: string;
  category: string;
  distance: number;
  activeUsers: number;
}

interface Category {
  id: string;
  icon: React.ComponentType<{ width: number; height: number; color: string }>;
  title: string;
  description: string;
  iconColor: string;
  iconBgColor: string;
  types: string[];
}

const categories: Category[] = [
  {
    id: "hightlighted",
    icon: FlameIcon,
    title: "Movimentados Agora",
    description: "Lugares cheios e com gente se conectando.",
    iconColor: "#FF6B35",
    iconBgColor: "rgba(41, 151, 255, 0.12)",
    types: ["bar", "night_club"],
  },
  {
    id: "favorites",
    icon: HeartIcon,
    title: "Locais Favoritos",
    description: "Seus lugares preferidos para se conectar.",
    iconColor: "#FFFFFF",
    iconBgColor: "rgba(41, 151, 255, 0.12)",
    types: ["bar", "night_club"],
  },
  {
    id: "nightlife",
    icon: BeerIcon,
    title: "Bares & Baladas",
    description: "Pra sair e conhecer gente nova.",
    iconColor: "#FF8A33",
    iconBgColor: "rgba(255, 138, 51, 0.12)",
    types: ["bar", "night_club"],
  },
  {
    id: "cafes",
    icon: CoffeeIcon,
    title: "Cafés & Bate-Papo",
    description: "Lugares pra conversar e relaxar.",
    iconColor: "#9B6C4A",
    iconBgColor: "rgba(155, 108, 74, 0.12)",
    types: ["cafe"],
  },
  {
    id: "university",
    icon: MapPinIcon,
    title: "Vida Universitária",
    description: "Onde os encontros acontecem na rotina.",
    iconColor: "#3DAAFF",
    iconBgColor: "rgba(61, 170, 255, 0.12)",
    types: ["university"],
  },
  {
    id: "fitness",
    icon: DumbbellIcon,
    title: "Bem-estar & Movimento",
    description: "Conexões que começam no treino.",
    iconColor: "#1DB954",
    iconBgColor: "rgba(29, 185, 84, 0.12)",
    types: ["gym"],
  },
];

// Mock de lugares com pessoas conectadas agora
const mockActivePlaces: ActivePlace[] = [
  {
    id: "place-1",
    name: "Bar do Zeca",
    type: "bar",
    category: "bar",
    distance: 0.8,
    activeUsers: 12,
  },
  {
    id: "place-2",
    name: "Café Aurora",
    type: "cafe",
    category: "cafe",
    distance: 1.2,
    activeUsers: 7,
  },
  {
    id: "place-3",
    name: "Universidade Mackenzie",
    type: "university",
    category: "university",
    distance: 2.5,
    activeUsers: 23,
  },
  {
    id: "place-4",
    name: "Balada Fusion",
    type: "nightclub",
    category: "nightclub",
    distance: 1.8,
    activeUsers: 34,
  },
  {
    id: "place-5",
    name: "Academia Smart Fit",
    type: "gym",
    category: "gym",
    distance: 0.5,
    activeUsers: 15,
  },
];

export default function HomeScreen() {
  const colors = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const bottomSheet = useCustomBottomSheet();

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category.id);
    router.push({
      pathname: "/main/category-results",
      params: {
        categoryName: category.title,
        placeTypes: category.types.join(","),
        isPremium: "false", // TODO: Get from user premium status
      },
    });
    setSelectedCategory(null);
  };

  const handlePlaceClick = (place: ActivePlace) => {
    if (!bottomSheet) return;

    bottomSheet.expand({
      content: () => (
        <ConnectionBottomSheet
          venueName={place.name}
          venueState="active"
          onConnect={() => {
            bottomSheet.close();
            router.push({
              pathname: "/main/place-people",
              params: {
                placeId: place.id,
                placeName: place.name,
                distance: place.distance,
              },
            });
          }}
          onCancel={() => {
            bottomSheet.close();
          }}
          onClose={() => {
            bottomSheet.close();
          }}
        />
      ),
      draggable: true,
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch real data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleOpenSearch = () => {
    if (!bottomSheet) return;
    bottomSheet.expand({
      content: () => (
        <PlaceSearchContent
          onBack={() => bottomSheet.close()}
          onPlaceSelect={() => bottomSheet.close()}
          isPremium={false}
        />
      ),
      draggable: true,
      snapPoints: ["100%"],
    });
  };

  return (
    <BaseTemplateScreen
      TopHeader={
        <ScreenToolbar
          leftAction={{
            icon: SlidersHorizontalIcon,
            onClick: () => router.push("main/filters" as any),
            ariaLabel: "Filtros",
            color: colors.icon,
          }}
          title={"Explorar"}
          titleIcon={MapPinIcon}
          titleIconColor={colors.accent}
          rightActions={[
            {
              icon: SearchIcon,
              onClick: handleOpenSearch,
              ariaLabel: "Pesquisar",
              color: colors.icon,
            },
          ]}
        />
      }
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >
      <ThemedView>
        {/* Title Section */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <ThemedView style={[styles.section, { paddingTop: 8 }]}>
            <ThemedText style={[styles.mainTitle, { color: colors.text }]}>
              Onde você quer se conectar hoje?
            </ThemedText>
            <ThemedText
              style={[styles.mainSubtitle, { color: colors.textSecondary }]}
            >
              Escolha o tipo de lugar e descubra quem está por lá.
            </ThemedText>
          </ThemedView>
        </Animated.View>

        {/* Categories List */}
        <ThemedView style={styles.categoriesContainer}>
          {categories.map((category, index) => {
            const isSelected = selectedCategory === category.id;

            return (
              <Animated.View
                key={category.id}
                entering={FadeInDown.delay(300 + index * 100).springify()}
              >
                <CategoryCard
                  category={category}
                  isSelected={isSelected}
                  onClick={() => handleCategoryClick(category)}
                />
              </Animated.View>
            );
          })}
        </ThemedView>

        {/* Info Card */}
        <Animated.View entering={FadeInDown.delay(700).springify()}>
          <ThemedView style={styles.section}>
            <ThemedView
              style={[
                styles.infoCard,
                {
                  borderColor: colors.border,
                },
              ]}
            >
              <ThemedView style={styles.infoContent}>
                <ThemedView
                  style={[
                    styles.infoIconContainer,
                    { backgroundColor: `${colors.accent}10` },
                  ]}
                >
                  <MapPinIcon width={20} height={20} color={colors.accent} />
                </ThemedView>
                <ThemedView style={styles.infoTextContainer}>
                  <ThemedText
                    style={[styles.infoTitle, { color: colors.text }]}
                  >
                    Como funciona?
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.infoDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Escolha uma categoria e veja lugares próximos onde você pode
                    se conectar com outras pessoas.
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Animated.View>
      </ThemedView>
    </BaseTemplateScreen>
  );
}

const styles = StyleSheet.create({
  headerSubtitle: {
    fontSize: 14,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  section: {
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    ...typography.subheading,
    fontSize: 18,
    fontWeight: "600",
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
  },
  emptyText: {
    textAlign: "center",
    lineHeight: 22,
  },
  mainTitle: {
    ...typography.subheading,
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  mainSubtitle: {
    ...typography.caption,
    paddingHorizontal: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 24,
  },
  infoContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
