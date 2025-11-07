# Components Documentation

## Screen Structure Components

### BaseTemplateScreen

Base template for all screens. Provides automatic header spacing, scrolling, pull-to-refresh, and fixed bottom bar support.

**Location:** `components/base-template-screen.tsx`

**Key Features:**

- ✅ Automatic padding for status bar and header
- ✅ Built-in ScrollView with pull-to-refresh
- ✅ Fixed bottom bar for buttons/actions
- ✅ Smooth scroll animations via Reanimated
- ✅ Theme-aware and safe area aware

**Usage:**

```tsx
<BaseTemplateScreen
  TopHeader={<ScreenToolbar title="My Screen" />}
  BottomBar={<ScreenBottomBar primaryLabel="Save" onPrimaryPress={save} />}
>
  <YourContent />
</BaseTemplateScreen>
```

**Documentation:** See `screen-toolbar.md` for full API and examples.

---

### ScreenToolbar

Animated toolbar with blur effect and SVG icon support.

**Location:** `components/screen-toolbar.tsx`

**Key Features:**

- ✅ Blur animation on scroll
- ✅ Left/right action buttons
- ✅ Custom SVG icons support
- ✅ Optional title icon
- ✅ View toggle (list/map) support

**Usage:**

```tsx
<ScreenToolbar
  title="Places Nearby"
  titleIcon={MapPinIcon}
  leftAction={{
    icon: ArrowLeftIcon,
    onClick: () => router.back(),
    ariaLabel: "Back",
  }}
  rightActions={[
    { icon: SearchIcon, onClick: handleSearch, ariaLabel: "Search" },
  ]}
/>
```

**Documentation:** See `screen-toolbar.md` for full API and examples.

---

### ScreenBottomBar

Fixed bottom bar component for action buttons. Handles safe area insets automatically.

**Location:** `components/screen-bottom-bar.tsx`

**Key Features:**

- ✅ Automatic safe area bottom padding
- ✅ Single or dual button layouts
- ✅ Custom content support
- ✅ Optional top border separator
- ✅ Disabled state handling
- ✅ Theme-aware styling

**Usage:**

```tsx
// Single button (most common)
<ScreenBottomBar
  primaryLabel="Continue"
  onPrimaryPress={handleContinue}
  primaryDisabled={!isValid}
/>

// Dual buttons
<ScreenBottomBar
  variant="dual"
  secondaryLabel="Skip"
  onSecondaryPress={handleSkip}
  primaryLabel="Continue"
  onPrimaryPress={handleContinue}
/>

// Custom content
<ScreenBottomBar variant="custom">
  <YourCustomButtons />
</ScreenBottomBar>
```

**Documentation:** See `screen-toolbar.md` for full API and examples.

---

## Complete Screen Pattern

Here's the recommended pattern for building screens:

```tsx
import { BaseTemplateScreen } from "@/components/base-template-screen";
import { ScreenToolbar } from "@/components/screen-toolbar";
import { ScreenBottomBar } from "@/components/screen-bottom-bar";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function MyScreen() {
  const [isValid, setIsValid] = useState(false);

  return (
    <BaseTemplateScreen
      // Optional header
      TopHeader={
        <ScreenToolbar
          title="My Screen"
          leftAction={{
            icon: BackIcon,
            onClick: () => router.back(),
            ariaLabel: "Back",
          }}
        />
      }
      // Optional fixed bottom bar
      BottomBar={
        <ScreenBottomBar
          primaryLabel="Save"
          onPrimaryPress={handleSave}
          primaryDisabled={!isValid}
        />
      }
      // Optional pull-to-refresh
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >
      {/* Scrollable content */}
      <ThemedView>
        <ThemedText>Your content here</ThemedText>
      </ThemedView>
    </BaseTemplateScreen>
  );
}
```

---

## When to Use What

### Use BaseTemplateScreen + ScreenBottomBar when:

- ✅ Screen has scrollable content
- ✅ Need a fixed button that's always visible
- ✅ Building forms or multi-step flows
- ✅ Content length varies (short or long)

**Examples:** Onboarding forms, profile edit, settings

### Use inline buttons when:

- ✅ Screen has centered content (no scroll)
- ✅ Fixed layout that doesn't need scrolling
- ✅ Buttons are part of the visual composition

**Examples:** Welcome screens, permission requests, empty states

### Use ScreenToolbar when:

- ✅ Need navigation controls (back button)
- ✅ Want blur effect on scroll
- ✅ Need action buttons in header
- ✅ Title with optional icon

**Examples:** Most screens with navigation

---

## UI Components

### ThemedText & ThemedView

Theme-aware text and view components.

**Location:** `components/themed-text.tsx`, `components/themed-view.tsx`

**Usage:**

```tsx
<ThemedView>
  <ThemedText style={typography.heading}>Title</ThemedText>
  <ThemedText style={typography.body}>Body text</ThemedText>
</ThemedView>
```

### Button

Main button component with variants.

**Location:** `components/ui/button.tsx`

**Usage:**

```tsx
<Button onPress={handleClick} size="lg" fullWidth>
  Click Me
</Button>

<Button variant="outline" onPress={handleClick}>
  Secondary
</Button>

<Button variant="ghost" onPress={handleClick}>
  Tertiary
</Button>
```

---

## Best Practices

1. **Always use theme colors** - Import from `constants/theme.ts` and use `useThemeColors()` hook
2. **Always use typography tokens** - Import from `constants/theme.ts` for consistent text styles
3. **Always use spacing tokens** - Import from `constants/theme.ts` for margins/padding
4. **Use translation keys** - Import `t` from `@/modules/locales` for all user-facing text
5. **Use BaseTemplateScreen** - Don't create custom ScrollViews unless needed
6. **Use ScreenBottomBar** - Don't create custom bottom bars for buttons
7. **Handle safe areas** - Components handle this automatically, don't add extra padding

---

For more detailed documentation, see:

- `screen-toolbar.md` - Full API for screen structure components
- `@/constants/theme.ts` - Theme tokens and colors
- `.github/copilot-instructions.md` - Project guidelines and patterns
