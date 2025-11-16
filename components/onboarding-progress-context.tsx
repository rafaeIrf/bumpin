import React, { createContext, useContext, useRef } from "react";
import { useSharedValue } from "react-native-reanimated";

interface OnboardingProgressContextValue {
  progress: any; // SharedValue<number>
  prevStepRef: React.MutableRefObject<number>;
}

const OnboardingProgressContext =
  createContext<OnboardingProgressContextValue | null>(null);

export function OnboardingProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const progress = useSharedValue(0);
  const prevStepRef = useRef(0);

  return (
    <OnboardingProgressContext.Provider value={{ progress, prevStepRef }}>
      {children}
    </OnboardingProgressContext.Provider>
  );
}

export function useOnboardingProgress() {
  const context = useContext(OnboardingProgressContext);
  if (!context) {
    throw new Error(
      "useOnboardingProgress must be used within OnboardingProgressProvider"
    );
  }
  return context;
}
