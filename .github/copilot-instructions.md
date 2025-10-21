# Copilot Instructions for this repo

These guidelines steer GitHub Copilot (Chat and inline suggestions) when generating code and docs in this project.

## Project overview

- Mobile app with Expo (SDK ~54), React Native 0.81, React 19, TypeScript.
- Navigation via Expo Router v6 (file-based routing) — already set up with:
  - Main group: `app/(tabs)` (Tabs)
  - Modal: `app/modal.tsx`
  - Onboarding: `app/(onboarding)` with `welcome.tsx`
  - Flow decision in `app/index.tsx` using AsyncStorage (`hasOnboarded`).
- Theming/style: `ThemedText` and `ThemedView` components, colors in `constants/theme.ts`, icons via `components/ui/icon-symbol`.
- Import alias: use `@/` for internal paths (e.g., `@/components/...`).

## Language and tone

- Write UI strings, comments, and docs in English (US).
- Keep messages short, clear, and consistent with the app’s tone.

## Code standards

- Prefer strict TypeScript (explicit types for props and returns).
- Functional components with hooks; avoid classes.
- Follow existing ESLint/Prettier configs (don’t reformat unrelated code).
- Avoid unnecessary dependencies; prefer Expo/React Native APIs already present.
- Handle errors safely and quietly when appropriate (concise logs, don’t break UI).

## Navigation (Expo Router)

- Prefer Expo Router over direct React Navigation use.
- Rules:
  - To create a screen: add a file under `app/...` and, if needed, a `_layout.tsx` with `<Stack>`/`<Tabs>`.
  - Use `router.push`, `router.replace`, `router.back` for imperative navigation.
  - Modals: files at root (e.g., `app/modal.tsx`) with `options={{ presentation: 'modal' }}` at the root stack.
  - New flows (e.g., auth): create `app/(auth)/...` group and register in `app/_layout.tsx` if needed.
- Initial redirects:
  - Keep logic in `app/index.tsx` to choose between `/(onboarding)` and `/(tabs)` via AsyncStorage (`hasOnboarded`).

### Examples

- Navigate to modal: `router.push('/modal')`
- Go to a specific tab: `router.replace('/(tabs)')`
- Open a screen in a group: `router.push('/(onboarding)/welcome')`

## State and persistence

- Simple persistence: `@react-native-async-storage/async-storage` (already installed).
- Onboarding flag: key `hasOnboarded` with values `'true'`/absent.
- For more complex global state, suggest Zustand only when necessary; avoid Redux by default.

## UI and style

- Use `ThemedView`/`ThemedText` to respect light/dark themes.
- Colors from `constants/theme.ts` (e.g., `Colors.light.tint`).
- Icons with `IconSymbol`; haptics with `HapticTab` in tabs.
- Images via `expo-image` and assets in `assets/images`.

## Folder structure (suggestions)

- `app/` — file-based routes. Group segments with parentheses: `(tabs)`, `(onboarding)`, `(auth)`, etc.
- `components/` — shared components. Prefer domain-based subfolders as it grows.
- `hooks/` — reusable hooks (e.g., `use-color-scheme`, `use-theme-color`).
- `constants/` — themes, tokens, and simple configs.

## Testing (when requested)

- Unit: React Native Testing Library + Jest (only when asked).
- E2E: Detox (optional; do not auto-configure without a request).

## Builds and scripts

- Do not change existing EAS Build scripts unless necessary.
- Development: prefer `npm run android/ios/web` and `npm run start`.

## Generation best practices

- Do not leak secrets or credentials.
- Do not reference native APIs unavailable in Expo Managed without plugin/config.
- Prefer Expo APIs (Linking, Image, Haptics, WebBrowser, SplashScreen, etc.).
- For animations, use `react-native-reanimated` v4 as already installed.
- Export as default in new components when there’s a single primary entity per file.

## Quick Do/Don’t

- Do: use `@/` for internal imports, type routes/params, keep style consistency.
- Do: create new route groups with `_layout.tsx` when needed.
- Don’t: use raw React Navigation if Expo Router suffices.
- Don’t: add heavy libs without justification.

## Prompts to ask Copilot

- "Create a new screen in `(onboarding)` named `permissions.tsx` with a continue button and update the flow."
- "Add a `Profile` tab in `(tabs)` with an icon and a link to `modal`."
- "Implement a `useOnboarding` hook that reads/writes the `hasOnboarded` flag."

These instructions apply to this repository. When proposing larger changes (structure, dependencies), Copilot should explain the impact and propose atomic commits.
