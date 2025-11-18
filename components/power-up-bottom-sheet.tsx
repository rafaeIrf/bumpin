import { XIcon } from "@/assets/icons";
import { ThemedText } from "@/components/themed-text";
import Button from "@/components/ui/button";
import { spacing, typography } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { t } from "@/modules/locales";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";

export interface PowerUpOptionConfig {
  quantity: number;
  id: string;
  badgeId?: string;
  isHighlighted?: boolean;
}

interface PowerUpBottomSheetProps {
  readonly translationKey: string;
  readonly icon: React.ComponentType<SvgProps>;
  readonly options: PowerUpOptionConfig[];
  readonly onClose: () => void;
  readonly onPurchase: (quantity: number) => void;
  readonly onUpgradeToPremium: () => void;
  readonly iconColor?: string;
  readonly iconBackgroundColor?: string;
}

export function PowerUpBottomSheet({
  translationKey,
  icon: Icon,
  options,
  onClose,
  onPurchase,
  onUpgradeToPremium,
  iconColor,
  iconBackgroundColor,
}: PowerUpBottomSheetProps) {
  const colors = useThemeColors();

  const defaultQuantity = useMemo(() => {
    if (!options.length) {
      return 0;
    }
    return (
      options.find((option) => option.isHighlighted)?.quantity ??
      options[0].quantity
    );
  }, [options]);

  const [selectedQuantity, setSelectedQuantity] =
    useState<number>(defaultQuantity);

  const resolvedSelectedQuantity =
    selectedQuantity || options[0]?.quantity || 0;

  const resolvedOptions = options.map((option) => ({
    ...option,
    price: t(`${translationKey}.options.${option.id}.price`),
    subtitle: t(`${translationKey}.options.${option.id}.subtitle`),
    badge: option.badgeId
      ? t(`${translationKey}.badges.${option.badgeId}`)
      : undefined,
  }));

  const handlePurchase = () => {
    onPurchase(resolvedSelectedQuantity);
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onClose}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t(`${translationKey}.close`)}
        style={styles.closeButton}
      >
        <XIcon width={24} height={24} color={colors.textSecondary} />
      </Pressable>

      <View
        style={[
          styles.iconContainer,
          { backgroundColor: iconBackgroundColor ?? colors.accentBlueLight },
        ]}
      >
        <Icon
          width={32}
          height={32}
          color={iconColor ?? colors.accent}
          stroke={iconColor ?? colors.accent}
        />
      </View>

      <ThemedText
        style={[styles.title, typography.heading, { color: colors.text }]}
      >
        {t(`${translationKey}.title`)}
      </ThemedText>

      <ThemedText
        style={[
          styles.subtitle,
          typography.body,
          { color: colors.textSecondary },
        ]}
      >
        {t(`${translationKey}.subtitle`)}
      </ThemedText>

      <View style={styles.optionsList}>
        {resolvedOptions.map((option) => {
          const isSelected = option.quantity === resolvedSelectedQuantity;
          return (
            <Pressable
              key={`${option.id}-${option.quantity}`}
              onPress={() => setSelectedQuantity(option.quantity)}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  borderColor: isSelected ? colors.accent : colors.border,
                  backgroundColor: isSelected
                    ? colors.surfaceHover
                    : colors.surface,
                },
                option.isHighlighted &&
                  isSelected && {
                    shadowColor: colors.accent,
                    shadowOpacity: 0.35,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 0 },
                    elevation: 5,
                  },
                pressed && styles.optionPressed,
              ]}
            >
              {option.badge && (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: colors.accent,
                      shadowColor: colors.accent,
                    },
                  ]}
                >
                  <ThemedText
                    style={[typography.caption, { color: colors.background }]}
                  >
                    {option.badge}
                  </ThemedText>
                </View>
              )}

              <View style={styles.optionContent}>
                <View style={styles.optionTextContainer}>
                  <ThemedText
                    style={[
                      typography.body1,
                      { color: colors.text, marginBottom: spacing.xs },
                    ]}
                  >
                    {t(`${translationKey}.optionLabel`, {
                      quantity: option.quantity,
                    })}
                  </ThemedText>
                  <ThemedText
                    style={[
                      typography.caption,
                      {
                        color: option.isHighlighted
                          ? colors.accent
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {option.subtitle}
                  </ThemedText>
                </View>

                <View style={styles.priceColumn}>
                  <ThemedText
                    style={[typography.body1, { color: colors.text }]}
                  >
                    {option.price}
                  </ThemedText>
                  <View
                    style={[
                      styles.radioOuter,
                      {
                        borderColor: isSelected
                          ? colors.accent
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: colors.accent },
                        ]}
                      />
                    )}
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      <ThemedText
        style={[
          styles.premiumHint,
          typography.caption,
          { color: colors.textSecondary },
        ]}
      >
        {t(`${translationKey}.premiumHint`)}
      </ThemedText>

      <View style={styles.buttonsContainer}>
        <Button
          onPress={handlePurchase}
          fullWidth
          size="lg"
          label={t(`${translationKey}.purchaseCta`, {
            quantity: resolvedSelectedQuantity,
          })}
        />
        <Button
          onPress={onUpgradeToPremium}
          fullWidth
          size="lg"
          variant="secondary"
          label={t(`${translationKey}.upgradeCta`)}
          style={[
            styles.secondaryButton,
            { borderColor: colors.accent, backgroundColor: colors.surface },
          ]}
          textStyle={{ color: colors.accent }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  closeButton: {
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  title: {
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  optionsList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionCard: {
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
  },
  optionPressed: {
    opacity: 0.95,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  priceColumn: {
    alignItems: "flex-end",
    gap: spacing.sm,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  premiumHint: {
    textAlign: "center",
    marginBottom: spacing.md,
  },
  buttonsContainer: {
    gap: spacing.sm,
  },
  secondaryButton: {
    borderWidth: 1,
  },
});
