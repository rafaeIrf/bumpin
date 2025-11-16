import { useLocationPermission } from "./use-location-permission";
import { useNotificationPermission } from "./use-notification-permission";

/**
 * Hook to calculate the total number of onboarding steps
 * based on permissions that need to be requested.
 *
 * Base steps (8):
 * 1. phone-auth
 * 2. verify-code
 * 3. user-name
 * 4. user-age
 * 5. user-gender
 * 6. user-photos
 * 7. connect-with
 * 8. intention
 *
 * Optional steps (+2):
 * 9. location (if permission not granted)
 * 10. notifications (if permission not granted)
 */
export function useOnboardingSteps() {
  const { shouldShowScreen: shouldShowLocation } = useLocationPermission();
  const { shouldShowScreen: shouldShowNotifications } =
    useNotificationPermission();

  const baseSteps = 8;
  const locationStep = shouldShowLocation ? 1 : 0;
  const notificationStep = shouldShowNotifications ? 1 : 0;

  const totalSteps = baseSteps + locationStep + notificationStep;

  return {
    totalSteps,
    shouldShowLocation,
    shouldShowNotifications,
  };
}
