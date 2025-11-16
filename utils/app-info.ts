import * as Application from "expo-application";
import Constants from "expo-constants";

/**
 * App version and build information
 */

/**
 * Get app version (e.g., "1.0.0")
 */
export function getAppVersion(): string {
  return Constants.expoConfig?.version || "1.0.0";
}

/**
 * Get build number
 * iOS: CFBundleVersion
 * Android: versionCode
 */
export function getBuildNumber(): string {
  return Application.nativeBuildVersion || "1";
}

/**
 * Get full app version with build number
 * @example "1.0.0 (123)"
 */
export function getFullVersion(): string {
  const version = getAppVersion();
  const build = getBuildNumber();
  return `${version} (${build})`;
}

/**
 * Get bundle identifier / package name
 * iOS: com.bumpti.app
 * Android: com.bumpti
 */
export function getBundleId(): string {
  return (
    Application.applicationId ||
    Constants.expoConfig?.ios?.bundleIdentifier ||
    "com.bumpti"
  );
}

/**
 * Get app name
 */
export function getAppName(): string {
  return Constants.expoConfig?.name || "Bumpti";
}

/**
 * Check if app is running in development mode
 */
export function isDevelopment(): boolean {
  return __DEV__;
}
