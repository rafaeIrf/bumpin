import { Platform } from "react-native";

/**
 * Platform detection utilities
 */

export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

/**
 * Get platform-specific value
 * @example
 * const fontSize = platformSelect({ ios: 16, android: 14, default: 15 })
 */
export function platformSelect<T>(options: {
  ios?: T;
  android?: T;
  web?: T;
  default: T;
}): T {
  if (isIOS && options.ios !== undefined) return options.ios;
  if (isAndroid && options.android !== undefined) return options.android;
  return options.default;
}

/**
 * Platform-specific styles helper
 * @example
 * const styles = StyleSheet.create({
 *   text: {
 *     ...platformStyles({
 *       ios: { fontFamily: 'SF Pro' },
 *       android: { fontFamily: 'Roboto' },
 *     })
 *   }
 * })
 */
export function platformStyles<T>(styles: {
  ios?: T;
  android?: T;
  web?: T;
}): T | Record<string, never> {
  if (isIOS && styles.ios) return styles.ios;
  if (isAndroid && styles.android) return styles.android;
  return {};
}
