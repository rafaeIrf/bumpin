import { OnboardingProgressBar } from "@/components/onboarding-progress-bar";
import { OnboardingProgressProvider } from "@/components/onboarding-progress-context";
import { useOnboardingSteps } from "@/hooks/use-onboarding-steps";
import { Stack, usePathname } from "expo-router";
import React from "react";

export const unstable_settings = {
  initialRouteName: "welcome",
};

// Map of routes to their step numbers (support multiple formats)
const ROUTE_STEPS: Record<string, number> = {
  "/user-name": 1,
  "/user-age": 2,
  "/user-gender": 3,
  "/connect-with": 4,
  "/intention": 5,
  "/user-photos": 6,
  "/location": 7,
  "/notifications": 8,
};

// Routes that should NOT show the progress bar
const ROUTES_WITHOUT_PROGRESS = new Set(["/welcome", "/complete"]);

const OnboardingHeader = React.memo(() => {
  const pathname = usePathname();
  const { totalSteps } = useOnboardingSteps();

  console.log("OnboardingHeader render:", { pathname, totalSteps });

  // Don't show progress bar on welcome and complete screens
  if (ROUTES_WITHOUT_PROGRESS.has(pathname)) {
    console.log("Skipping progress bar for:", pathname);
    return null;
  }

  const currentStep = ROUTE_STEPS[pathname];

  // Don't show if we can't determine the step
  if (!currentStep) {
    console.log("No step found for pathname:", pathname);
    return null;
  }

  console.log("Rendering progress bar:", { currentStep, totalSteps });
  return (
    <OnboardingProgressBar currentStep={currentStep} totalSteps={totalSteps} />
  );
});

OnboardingHeader.displayName = "OnboardingHeader";

// Render function for the header
const renderOnboardingHeader = () => <OnboardingHeader />;

export default function OnboardingLayout() {
  return (
    <OnboardingProgressProvider>
      <Stack
        screenOptions={{
          header: renderOnboardingHeader,
          headerShown: true,
          animation: "none",
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="phone-auth" />
        <Stack.Screen name="verify-code" />
        <Stack.Screen name="user-name" />
        <Stack.Screen name="user-age" />
        <Stack.Screen name="user-gender" />
        <Stack.Screen name="connect-with" />
        <Stack.Screen name="intention" />
        <Stack.Screen name="user-photos" />
        <Stack.Screen name="location" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="complete" />
      </Stack>
    </OnboardingProgressProvider>
  );
}
