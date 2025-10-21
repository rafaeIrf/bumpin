import { StyleSheet, Text, TextStyle, type TextProps } from "react-native";

import { typography } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

export type TextVariant = "heading" | "subheading" | "body" | "caption";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  /** Legacy prop kept for backward compatibility */
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  /** Preferred prop: uses design-system tokens */
  variant?: TextVariant;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  variant,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  const variantStyle: TextStyle | undefined = variant
    ? typography[variant]
    : mapTypeToStyle(type);

  return (
    <Text
      style={[
        { color },
        variantStyle,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

function mapTypeToStyle(type: ThemedTextProps["type"]): TextStyle | undefined {
  switch (type) {
    case "default":
      return typography.body;
    case "defaultSemiBold":
      return { ...typography.body, fontFamily: "Poppins-SemiBold" };
    case "title":
      // Preserve larger title size while applying Poppins
      return { fontFamily: "Poppins-SemiBold", fontSize: 32, lineHeight: 32 };
    case "subtitle":
      return { fontFamily: "Poppins-Medium", fontSize: 20 };
    case "link":
      return typography.body;
    default:
      return typography.body;
  }
}

const styles = StyleSheet.create({
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
    fontFamily: "Poppins-Regular",
  },
});
