import { ArrowLeftIcon } from "@/assets/icons";
import { BaseTemplateScreen } from "@/components/base-template-screen";
import { useCustomBottomSheet } from "@/components/BottomSheetProvider/hooks";
import { GenderSelectionBottomSheetContent } from "@/components/gender-selection-bottom-sheet";
import { ScreenToolbar } from "@/components/screen-toolbar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import ToggleSwitch from "@/components/toogle-switch";
import { AgeRangeSlider } from "@/components/ui/age-range-slider";
import { Button } from "@/components/ui/button";
import { spacing, typography } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { t } from "@/modules/locales";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export interface FilterValues {
  genderPreferences: string[];
  ageRange: [number, number];
  connectionTypes: string[];
  verifiedOnly: boolean;
}

export default function FiltersScreen() {
  const colors = useThemeColors();
  const bottomSheet = useCustomBottomSheet();

  const [genderPreferences, setGenderPreferences] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 35]);
  const [connectionTypes, setConnectionTypes] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Connection types with translations
  const CONNECTION_TYPES = [
    { value: "friends", label: t("filters.connectionType.friends") },
    { value: "dating", label: t("filters.connectionType.dating") },
    { value: "serious", label: t("filters.connectionType.serious") },
    { value: "networking", label: t("filters.connectionType.networking") },
    { value: "casual", label: t("filters.connectionType.casual") },
  ];

  // Gender options with translations
  const GENDER_OPTIONS = [
    { value: "male", label: t("screens.onboarding.connectWithMale") },
    { value: "female", label: t("screens.onboarding.connectWithFemale") },
    {
      value: "nonbinary",
      label: t("screens.onboarding.connectWithNonBinary"),
    },
  ];

  // Auto-save filters whenever they change
  useEffect(() => {
    // Filters are automatically saved when changed
    // In the future, this will persist to AsyncStorage or Redux
    console.log("Filters updated:", {
      genderPreferences,
      ageRange,
      connectionTypes,
      verifiedOnly,
    });
  }, [genderPreferences, ageRange, connectionTypes, verifiedOnly]);

  const toggleConnectionType = (type: string) => {
    setConnectionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const getGenderLabel = () => {
    if (genderPreferences.length === 0) return "";
    if (genderPreferences.length === GENDER_OPTIONS.length)
      return t("filters.gender.all");
    return genderPreferences
      .map((val) => GENDER_OPTIONS.find((opt) => opt.value === val)?.label)
      .join(", ");
  };

  const handleGenderConfirm = (selection: string[]) => {
    setGenderPreferences(selection);
    bottomSheet?.close();
  };

  const handleOpenGenderSheet = () => {
    bottomSheet?.expand({
      content: () => (
        <GenderSelectionBottomSheetContent
          initialSelection={genderPreferences}
          onConfirm={handleGenderConfirm}
        />
      ),
    });
  };

  return (
    <BaseTemplateScreen
      TopHeader={
        <ScreenToolbar
          leftAction={{
            icon: ArrowLeftIcon,
            onClick: () => router.back(),
            ariaLabel: t("common.back"),
          }}
          title={t("filters.title")}
        />
      }
    >
      <ThemedView>
        {/* Section 1: Gender */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            {t("filters.gender.title")}
          </ThemedText>
          <ThemedText
            style={[styles.sectionDescription, { color: colors.textSecondary }]}
          >
            {t("filters.gender.description")}
          </ThemedText>
          <Pressable
            onPress={handleOpenGenderSheet}
            style={[
              styles.selectButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.selectButtonText,
                {
                  color:
                    genderPreferences.length === 0
                      ? colors.textSecondary
                      : colors.text,
                },
              ]}
            >
              {getGenderLabel()}
            </ThemedText>
            <ThemedText style={{ color: colors.textSecondary }}>→</ThemedText>
          </Pressable>
        </View>

        {/* Section 2: Age Range */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            {t("filters.age.title")}
          </ThemedText>
          <ThemedText
            style={[styles.sectionDescription, { color: colors.textSecondary }]}
          >
            {t("filters.age.description")}
          </ThemedText>
          <View style={styles.ageRangeContainer}>
            <AgeRangeSlider
              min={18}
              max={80}
              value={ageRange}
              onValueChange={setAgeRange}
            />
          </View>
        </View>

        {/* Section 3: Connection Type */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            {t("filters.connectionType.title")}
          </ThemedText>
          <ThemedText
            style={[styles.sectionDescription, { color: colors.textSecondary }]}
          >
            {t("filters.connectionType.description")}
          </ThemedText>
          <View style={styles.connectionTypesContainer}>
            {CONNECTION_TYPES.map((type) => (
              <Button
                key={type.value}
                label={type.label}
                variant={
                  connectionTypes.includes(type.value) ? "default" : "outline"
                }
                size="sm"
                onPress={() => toggleConnectionType(type.value)}
              />
            ))}
          </View>
        </View>

        {/* Section 4: Verified Profiles */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            {t("filters.verified.title")}
          </ThemedText>
          <ThemedText
            style={[styles.sectionDescription, { color: colors.textSecondary }]}
          >
            {t("filters.verified.description")}
          </ThemedText>
          <View style={styles.toggleContainer}>
            <ThemedText style={[styles.toggleLabel, { color: colors.text }]}>
              {t("filters.verified.title")}
            </ThemedText>
            <ToggleSwitch
              value={verifiedOnly}
              onValueChange={setVerifiedOnly}
              colors={colors}
            />
          </View>
        </View>
      </ThemedView>
    </BaseTemplateScreen>
  );
}

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  colors: ReturnType<typeof useThemeColors>;
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    ...typography.subheading,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
  },
  selectButtonText: {
    ...typography.body,
  },
  ageRangeContainer: {
    gap: spacing.lg,
  },
  connectionTypesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleLabel: {
    ...typography.body,
  },
});
