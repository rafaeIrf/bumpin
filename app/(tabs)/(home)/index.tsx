import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { BaseTemplateScreen } from "@/components/base-template-screen";
import { HelloWave } from "@/components/hello-wave";
import { PlaceCardCompact } from "@/components/place-card-compact";
import { PlaceCardFavorite } from "@/components/place-card-favorite";
import { PlaceCardLarge } from "@/components/place-card-large";
import { ScreenToolbar } from "@/components/screen-toolbar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { typography } from "@/constants/theme";
import { getUserPosition } from "@/modules/places";
import { getFeaturedPlaces, getNearbyPlaces } from "@/modules/places/api";
import { Place, PlaceType } from "@/modules/places/types";

export default function HomeScreen() {
  const [featuredPlaces, setFeaturedPlaces] = useState<Place[] | null>(null);
  const [firstNearbyPlaces, setFirstNearbyPlaces] = useState<Place[] | null>(
    null
  );
  const [secondNearbyPlaces, setSecondNearbyPlaces] = useState<Place[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Lista fixa de placeIds para a seção "Em Destaque"
  const featuredPlaceIds = [
    "ChIJBwa1_Hfk3JQRxQoUhQVJOow", // exemplo Sydney Opera House
    "ChIJLWF2Z-2QmQARB24HTMRoIGU", // exemplo Sydney Opera House
    "ChIJZ_y9EKDl3JQRFQX_OqqYD9U", // exemplo Sydney Opera House
    "ChIJZ_y9EKDl3JQRFQX_OqqYD9U", // exemplo Sydney Opera House
    "ChIJZ_y9EKDl3JQRFQX_OqqYD9U", // exemplo Sydney Opera House
  ];

  const fetchNearbyPlaces = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const { latitude, longitude } = await getUserPosition();
      setUserLocation({ latitude, longitude });
      const firstPlaceList = await getNearbyPlaces(
        latitude,
        longitude,
        [PlaceType.bar, PlaceType.night_club, PlaceType.cafe],
        "POPULARITY",
        10
      );
      const secondPlaceList = await getNearbyPlaces(
        latitude,
        longitude,
        [PlaceType.university, PlaceType.gym],
        "DISTANCE",
        10
      );
      setFirstNearbyPlaces(firstPlaceList);
      setSecondNearbyPlaces(secondPlaceList);
      // Busca lugares em destaque em paralelo (se ainda não foram carregados)
      if (!featuredPlaces) {
        const featured = await getFeaturedPlaces(featuredPlaceIds);
        setFeaturedPlaces(featured);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch places");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    return 1;
  };

  return (
    <BaseTemplateScreen
      TopHeader={
        <ScreenToolbar
          leftAction={{
            icon: "arrow.left",
            onClick: () => {},
            ariaLabel: "Voltar",
          }}
          title="Lugares Próximos"
          titleIcon="mappin.circle.fill"
          showViewToggle
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode)}
          viewToggleVariant="compact"
          rightActions={
            <Pressable>
              <IconSymbol
                name="slider.horizontal.3"
                size={20}
                color="#8B98A5"
              />
            </Pressable>
          }
        />
      }
      refreshing={refreshing}
      onRefresh={() => fetchNearbyPlaces(true)}
    >
      <ThemedView style={styles.header}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ ...typography.heading }}>
            Lugares Próximos
          </ThemedText>
          <HelloWave />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.content}>
        {!firstNearbyPlaces && !loading && !error && (
          <ThemedView style={styles.emptyState}>
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              Descubra lugares ao seu redor
            </ThemedText>
            <ThemedText style={styles.emptyText}>
              Puxe para baixo para buscar bares, restaurantes e cafés próximos
            </ThemedText>
          </ThemedView>
        )}

        {loading && !refreshing && (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1D9BF0" />
            <ThemedText style={styles.loadingText}>
              Buscando lugares...
            </ThemedText>
          </ThemedView>
        )}

        {error && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
          </ThemedView>
        )}

        {firstNearbyPlaces && firstNearbyPlaces.length === 0 && (
          <ThemedView style={styles.emptyState}>
            <ThemedText>Nenhum lugar encontrado nas proximidades.</ThemedText>
          </ThemedView>
        )}

        {(featuredPlaces || firstNearbyPlaces || secondNearbyPlaces) && (
          <View style={styles.placesContainer}>
            {/* Featured places - Large cards horizontal from getPlacesByIds */}
            {featuredPlaces && featuredPlaces.length > 0 && (
              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Em Destaque
                </ThemedText>
                <FlatList
                  horizontal
                  data={featuredPlaces}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.placeId}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }) => (
                    <View style={styles.largeCardWrapper}>
                      <PlaceCardLarge
                        place={{
                          id: item.placeId,
                          name: item.name,
                          type: String(item.type || "default"),
                          category: "Featured",
                          categoryIcon: "⭐",
                          distance:
                            item.location && userLocation
                              ? calculateDistance(
                                  userLocation.latitude,
                                  userLocation.longitude,
                                  item.location.lat,
                                  item.location.lng
                                )
                              : 0,
                          activeUsers: Math.floor(Math.random() * 10),
                          isFavorite: false,
                        }}
                        onClick={() => console.log("Place clicked:", item.name)}
                        onToggleFavorite={() => console.log("Favorite toggled")}
                      />
                    </View>
                  )}
                />
              </View>
            )}

            {/* Sua Vibe - Horizontal grid with two columns from firstNearbyPlaces */}
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Sua Vibe
              </ThemedText>
              <ThemedText style={styles.sectionDescription} numberOfLines={1}>
                Onde o dia a dia também vira encontro.
              </ThemedText>
              {firstNearbyPlaces && firstNearbyPlaces.length > 0 && (
                <FlatList
                  data={firstNearbyPlaces}
                  numColumns={2}
                  keyExtractor={(item) => item.placeId}
                  renderItem={({ item, index }) => (
                    <View style={styles.favoriteCardWrapper}>
                      <PlaceCardFavorite
                        place={{
                          id: item.placeId,
                          name: item.name,
                          type: String(item.type || "default"),
                          category: "Rolê",
                          activeUsers: Math.floor(Math.random() * 10),
                          isFavorite: false,
                        }}
                        onClick={() => console.log("Place clicked:", item.name)}
                        onToggleFavorite={() => console.log("Favorite toggled")}
                      />
                    </View>
                  )}
                />
              )}
            </View>

            {/* Rolê & Conexões - Compact cards horizontal from secondNearbyPlaces */}
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Rolê & Conexões
              </ThemedText>
              <ThemedText style={styles.sectionDescription} numberOfLines={1}>
                Lugares pra viver o momento e conhecer gente nova.
              </ThemedText>
              {secondNearbyPlaces && secondNearbyPlaces.length > 0 && (
                <FlatList
                  data={secondNearbyPlaces}
                  keyExtractor={(item) => item.placeId}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item, index }) => (
                    <View>
                      <PlaceCardCompact
                        place={{
                          id: item.placeId,
                          name: item.name,
                          type: String(item.type || "default"),
                          category: "Rolê",
                          categoryIcon: "🎉",
                          distance:
                            item.location && userLocation
                              ? calculateDistance(
                                  userLocation.latitude,
                                  userLocation.longitude,
                                  item.location.lat,
                                  item.location.lng
                                )
                              : 0,
                          activeUsers: Math.floor(Math.random() * 10),
                          isFavorite: false,
                        }}
                        onClick={() => console.log("Place clicked:", item.name)}
                        onToggleFavorite={() => console.log("Favorite toggled")}
                      />
                    </View>
                  )}
                />
              )}
            </View>
          </View>
        )}
      </ThemedView>
    </BaseTemplateScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerImage: {
    width: 290,
    height: 178,
    marginBottom: 16,
    alignSelf: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.7,
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    opacity: 0.7,
  },
  errorContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 69, 58, 0.1)",
    borderRadius: 12,
    marginVertical: 16,
  },
  errorText: {
    color: "#FF453A",
    textAlign: "center",
  },
  placesContainer: {
    gap: 24,
  },
  section: {
    gap: 4,
  },
  horizontalList: {
    paddingRight: 16,
    gap: 16,
  },
  largeCardWrapper: {
    width: 320,
    marginRight: 16,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  sectionDescription: {
    color: "#8B98A5",
  },
  favoriteCardWrapper: {
    flex: 1,
    margin: 8,
  },
});
