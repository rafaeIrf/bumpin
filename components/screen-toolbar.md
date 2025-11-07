# Screen Structure Components

## BaseTemplateScreen

Base template for all screens in the app. Provides automatic header spacing, scrolling, pull-to-refresh, and fixed bottom bar support.

### Features

- ✅ Automatic padding for status bar and header
- ✅ Built-in ScrollView with pull-to-refresh
- ✅ Fixed bottom bar for buttons/actions
- ✅ Smooth scroll animations via Reanimated
- ✅ Theme-aware and safe area aware

### Props

| Prop                           | Type         | Required | Description                                                |
| ------------------------------ | ------------ | -------- | ---------------------------------------------------------- |
| `TopHeader`                    | `ReactNode`  | No       | Header component rendered at top (usually `ScreenToolbar`) |
| `BottomBar`                    | `ReactNode`  | No       | Bottom bar component (great for fixed buttons)             |
| `children`                     | `ReactNode`  | Yes      | Main scrollable content                                    |
| `refreshing`                   | `boolean`    | No       | Whether refresh indicator is active                        |
| `onRefresh`                    | `() => void` | No       | Callback for pull-to-refresh                               |
| `scrollEnabled`                | `boolean`    | No       | Enable/disable scrolling (default: true)                   |
| `showsVerticalScrollIndicator` | `boolean`    | No       | Show/hide scroll indicator (default: true)                 |
| `containerStyle`               | `ViewStyle`  | No       | Style for main wrapper View                                |
| `contentContainerStyle`        | `ViewStyle`  | No       | Style for ScrollView content container                     |

### Examples

#### Basic Screen with Header

```tsx
<BaseTemplateScreen
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
>
  <ThemedView>
    <ThemedText>Screen content goes here</ThemedText>
  </ThemedView>
</BaseTemplateScreen>
```

#### Screen with Fixed Bottom Button

```tsx
import { useSafeAreaInsets } from "@/hooks/use-safe-area-insets";
import { spacing } from "@/constants/theme";

const insets = useSafeAreaInsets();

<BaseTemplateScreen
  TopHeader={<ScreenToolbar title="Form" />}
  BottomBar={
    <View
      style={[
        styles.bottomBar,
        { paddingBottom: Math.max(spacing.xl, insets.bottom + spacing.md) },
      ]}
    >
      <Button onPress={handleSubmit} fullWidth>
        Submit
      </Button>
    </View>
  }
>
  <ThemedView>{/* Long scrollable form content */}</ThemedView>
</BaseTemplateScreen>;

// Styles
const styles = StyleSheet.create({
  bottomBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});
```

#### Screen with Pull-to-Refresh

```tsx
const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
  setRefreshing(true);
  await fetchData();
  setRefreshing(false);
};

<BaseTemplateScreen refreshing={refreshing} onRefresh={handleRefresh}>
  <ThemedView>{/* Content */}</ThemedView>
</BaseTemplateScreen>;
```

#### Screen without Header (Full Screen)

```tsx
<BaseTemplateScreen>
  <ThemedView>
    {/* No TopHeader = no automatic top padding */}
    <ThemedText>Fullscreen content</ThemedText>
  </ThemedView>
</BaseTemplateScreen>
```

---

## ScreenBottomBar

Fixed bottom bar component for action buttons. Handles safe area insets automatically and provides consistent styling across screens.

### Features

- ✅ Automatic safe area bottom padding
- ✅ Single or dual button layouts
- ✅ Custom content support
- ✅ Optional top border separator
- ✅ Theme-aware styling
- ✅ Disabled state handling

### Props

| Prop                | Type                             | Required | Description                                           |
| ------------------- | -------------------------------- | -------- | ----------------------------------------------------- |
| `primaryLabel`      | `string`                         | No       | Label for primary action button                       |
| `onPrimaryPress`    | `() => void`                     | No       | Callback when primary button is pressed               |
| `primaryDisabled`   | `boolean`                        | No       | Disable primary button (default: false)               |
| `secondaryLabel`    | `string`                         | No       | Label for secondary action button (dual variant only) |
| `onSecondaryPress`  | `() => void`                     | No       | Callback when secondary button is pressed             |
| `secondaryDisabled` | `boolean`                        | No       | Disable secondary button (default: false)             |
| `variant`           | `"single" \| "dual" \| "custom"` | No       | Layout variant (default: "single")                    |
| `children`          | `ReactNode`                      | No       | Custom content (used with `variant="custom"`)         |
| `style`             | `ViewStyle`                      | No       | Additional styles for container                       |
| `showBorder`        | `boolean`                        | No       | Show top border separator (default: false)            |
| `backgroundColor`   | `string`                         | No       | Custom background color (default: theme background)   |

### Examples

#### Single Button (Most Common)

```tsx
import { ScreenBottomBar } from "@/components/screen-bottom-bar";

<BaseTemplateScreen
  BottomBar={
    <ScreenBottomBar
      primaryLabel="Continue"
      onPrimaryPress={handleContinue}
      primaryDisabled={!isFormValid}
    />
  }
>
  {/* Screen content */}
</BaseTemplateScreen>;
```

#### Dual Buttons (Skip + Continue)

```tsx
<ScreenBottomBar
  variant="dual"
  secondaryLabel="Skip"
  onSecondaryPress={handleSkip}
  primaryLabel="Continue"
  onPrimaryPress={handleContinue}
  primaryDisabled={!isValid}
/>
```

#### With Top Border

```tsx
<ScreenBottomBar
  primaryLabel="Save Changes"
  onPrimaryPress={handleSave}
  showBorder
/>
```

#### Custom Content

```tsx
<ScreenBottomBar variant="custom">
  <View style={styles.customActions}>
    <Button onPress={handleDelete} variant="danger">
      Delete
    </Button>
    <Button onPress={handleSave}>Save</Button>
  </View>
</ScreenBottomBar>
```

#### Complete Screen Example

```tsx
import { BaseTemplateScreen } from "@/components/base-template-screen";
import { ScreenToolbar } from "@/components/screen-toolbar";
import { ScreenBottomBar } from "@/components/screen-bottom-bar";

export default function FormScreen() {
  const [isValid, setIsValid] = useState(false);

  return (
    <BaseTemplateScreen
      TopHeader={
        <ScreenToolbar
          title="Edit Profile"
          leftAction={{
            icon: BackIcon,
            onClick: () => router.back(),
            ariaLabel: "Back",
          }}
        />
      }
      BottomBar={
        <ScreenBottomBar
          primaryLabel="Save"
          onPrimaryPress={handleSave}
          primaryDisabled={!isValid}
          showBorder
        />
      }
    >
      <ThemedView>{/* Form fields */}</ThemedView>
    </BaseTemplateScreen>
  );
}
```

### Best Practices

- ✅ Use `variant="single"` for most screens (default)
- ✅ Use `variant="dual"` for skip/continue flows
- ✅ Use `variant="custom"` only when you need complex layouts
- ✅ Always disable buttons when actions aren't valid
- ✅ Add `showBorder` for visual separation when needed
- ✅ Safe area insets are handled automatically - no need to add extra padding

---

## ScreenToolbar

Toolbar animada com blur effect e suporte a ícones SVG customizados.

## Props

### Basic Props

- `title` (string) - Título da toolbar
- `titleIcon?` (ComponentType<SvgProps>) - Ícone SVG ao lado do título
- `titleIconColor?` (string) - Cor do ícone do título (default: `#1D9BF0`)
- `leftAction?` (ToolbarAction) - Ação do botão esquerdo
- `rightActions?` (ToolbarAction | ToolbarAction[]) - Uma ou mais ações no lado direito

### View Toggle Props

- `showViewToggle?` (boolean) - Mostrar botões de alternância list/map
- `viewMode?` ("list" | "map") - Modo de visualização atual
- `onViewModeChange?` (mode => void) - Callback ao mudar modo
- `viewToggleVariant?` ("default" | "compact") - Estilo dos botões de alternância

### Animation Props

- `scrollY?` (SharedValue<number>) - Shared value do scroll para animação de blur

## Interfaces

### ToolbarAction

```typescript
{
  icon: ComponentType<SvgProps>; // Componente SVG do ícone
  onClick: () => void;
  ariaLabel: string;
  color?: string; // Cor do ícone (default: #FFF)
}
```

## Exemplo de Uso

### Com ação única à direita

```tsx
import { ScreenToolbar } from "@/components/screen-toolbar";
import {
  ArrowLeftIcon,
  MapPinIcon,
  SlidersHorizontalIcon,
} from "@/assets/icons";

<ScreenToolbar
  leftAction={{
    icon: ArrowLeftIcon,
    onClick: () => router.back(),
    ariaLabel: "Voltar",
  }}
  title="Lugares Próximos"
  titleIcon={MapPinIcon}
  titleIconColor="#1D9BF0"
  rightActions={{
    icon: SlidersHorizontalIcon,
    onClick: () => console.log("Filtros"),
    ariaLabel: "Filtros",
    color: "#8B98A5",
  }}
/>;
```

### Com múltiplas ações à direita

```tsx
import { SearchIcon, SettingsIcon, BellIcon } from "@/assets/icons";

<ScreenToolbar
  title="Explorar"
  rightActions={[
    {
      icon: SearchIcon,
      onClick: () => handleSearch(),
      ariaLabel: "Buscar",
      color: "#8B98A5",
    },
    {
      icon: BellIcon,
      onClick: () => handleNotifications(),
      ariaLabel: "Notificações",
      color: "#1D9BF0",
    },
    {
      icon: SettingsIcon,
      onClick: () => handleSettings(),
      ariaLabel: "Configurações",
      color: "#8B98A5",
    },
  ]}
/>;
```

### Com view toggle

### Com view toggle

```tsx
<ScreenToolbar
  leftAction={{
    icon: ArrowLeftIcon,
    onClick: () => router.back(),
    ariaLabel: "Voltar",
  }}
  title="Lugares Próximos"
  titleIcon={MapPinIcon}
  titleIconColor="#1D9BF0"
  showViewToggle
  viewMode={viewMode}
  onViewModeChange={(mode) => setViewMode(mode)}
  viewToggleVariant="compact"
  rightActions={{
    icon: SlidersHorizontalIcon,
    onClick: () => handleFilter(),
    ariaLabel: "Filtros",
    color: "#8B98A5",
  }}
/>
```

## Animação de Blur

A toolbar reage ao scroll quando usada com `BaseTemplateScreen`:

```tsx
<BaseTemplateScreen TopHeader={<ScreenToolbar {...props} />}>
  {/* Conteúdo que scrollará */}
</BaseTemplateScreen>
```

O `BaseTemplateScreen` automaticamente injeta o `scrollY` shared value na toolbar.

## Variantes do View Toggle

### Compact (apenas ícones)

```tsx
viewToggleVariant = "compact";
```

### Default (ícones + texto)

```tsx
viewToggleVariant = "default";
```

## Cores dos Ícones

- **Left Action**: Configurável via `color` prop (default: #FFF)
- **Title Icon**: Configurável via `titleIconColor` prop (default: #1D9BF0)
- **View Toggle Active**: Branco (#FFF) no compact, #1D9BF0 no default
- **View Toggle Inactive**: #8B98A5
- **Right Actions**: Configurável via `color` prop em cada ação (default: #FFF)

## Efeitos de Animação

- **Blur**: Opacidade 0→1 ao scrollar 0-50px
- **Background**: rgba(0,0,0,0)→rgba(0,0,0,0.4) ao scrollar 0-50px
- **Press**: Scale animation com spring (0.95 para botões)
