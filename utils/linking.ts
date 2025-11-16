import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

/**
 * External links and URLs
 */

const BUMPTI_URLS = {
  terms: "https://www.bumpti.com/terms",
  privacy: "https://www.bumpti.com/privacy",
  website: "https://www.bumpti.com",
  support: "https://www.bumpti.com/support",
  instagram: "https://instagram.com/bumptiapp",
} as const;

/**
 * Open URL in in-app browser
 * Uses expo-web-browser for better UX (stays in app context)
 */
async function openInAppBrowser(url: string): Promise<void> {
  try {
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      controlsColor: "#1D9BF0",
      toolbarColor: "#000000",
    });
  } catch (error) {
    console.error("Failed to open browser:", error);
    // Fallback to system browser
    await Linking.openURL(url);
  }
}

/**
 * Open Terms of Use
 */
export async function openTermsOfUse(): Promise<void> {
  return openInAppBrowser(BUMPTI_URLS.terms);
}

/**
 * Open Privacy Policy
 */
export async function openPrivacyPolicy(): Promise<void> {
  return openInAppBrowser(BUMPTI_URLS.privacy);
}

/**
 * Open Bumpti website
 */
export async function openWebsite(): Promise<void> {
  return openInAppBrowser(BUMPTI_URLS.website);
}

/**
 * Open support page
 */
export async function openSupport(): Promise<void> {
  return openInAppBrowser(BUMPTI_URLS.support);
}

/**
 * Open Instagram profile
 */
export async function openInstagram(): Promise<void> {
  const instagramUrl = BUMPTI_URLS.instagram;

  try {
    // Try to open in Instagram app first
    const canOpen = await Linking.canOpenURL("instagram://");
    if (canOpen) {
      await Linking.openURL("instagram://user?username=bumptiapp");
      return;
    }
  } catch {
    // If Instagram app not available, open in browser
  }

  return openInAppBrowser(instagramUrl);
}

/**
 * Open email client
 */
export async function openEmail(
  email: string = "support@bumpti.com",
  subject?: string,
  body?: string
): Promise<void> {
  let url = `mailto:${email}`;
  const params: string[] = [];

  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);

  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }

  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  } else {
    console.error("Cannot open email client");
  }
}

/**
 * Share content using native share sheet
 */
export async function share(options: {
  message?: string;
  url?: string;
  title?: string;
}): Promise<void> {
  const { Share } = await import("react-native");

  try {
    await Share.share({
      message: options.message || options.url || "",
      url: options.url,
      title: options.title,
    });
  } catch (error) {
    console.error("Failed to share:", error);
  }
}

/**
 * Open phone dialer
 */
export async function openPhone(phoneNumber: string): Promise<void> {
  const url = `tel:${phoneNumber}`;
  const canOpen = await Linking.canOpenURL(url);

  if (canOpen) {
    await Linking.openURL(url);
  } else {
    console.error("Cannot open phone dialer");
  }
}

/**
 * Open SMS app
 */
export async function openSMS(
  phoneNumber: string,
  body?: string
): Promise<void> {
  let url = `sms:${phoneNumber}`;

  if (body) {
    url += `?body=${encodeURIComponent(body)}`;
  }

  const canOpen = await Linking.canOpenURL(url);

  if (canOpen) {
    await Linking.openURL(url);
  } else {
    console.error("Cannot open SMS app");
  }
}

/**
 * Get all Bumpti URLs
 */
export function getBumptiUrls() {
  return BUMPTI_URLS;
}
