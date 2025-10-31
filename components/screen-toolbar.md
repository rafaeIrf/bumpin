# ScreenToolbar - Documentação

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
