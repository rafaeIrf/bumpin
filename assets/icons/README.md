# Guia de Uso dos Ícones SVG

## Setup Completo ✅

- ✅ `react-native-svg-transformer` instalado
- ✅ Metro config configurado para SVGs
- ✅ TypeScript declarations criadas
- ✅ Barrel exports em `assets/icons/index.ts`
- ✅ Componente wrapper opcional em `components/ui/icon.tsx`

## Como Usar

### Método 1: Importação Direta (Recomendado)

```tsx
import { BeerIcon, CoffeeIcon, HeartIcon } from "@/assets/icons";

function MyComponent() {
  return (
    <View>
      <BeerIcon width={24} height={24} fill="#1D9BF0" />
      <CoffeeIcon width={32} height={32} fill="#FF6B6B" />
      <HeartIcon width={20} height={20} fill="#E74C3C" stroke="#000" />
    </View>
  );
}
```

### Método 2: Com Wrapper (Opcional)

```tsx
import { Icon } from "@/components/ui/icon";
import { BeerIcon, CoffeeIcon } from "@/assets/icons";

function MyComponent() {
  return (
    <View>
      <Icon icon={BeerIcon} size={24} color="#1D9BF0" />
      <Icon icon={CoffeeIcon} size={32} color="#FF6B6B" />
    </View>
  );
}
```

### Método 3: Dinâmico

```tsx
import * as Icons from "@/assets/icons";

function MyComponent({ iconName }: { iconName: keyof typeof Icons }) {
  const IconComponent = Icons[iconName];
  return <IconComponent width={24} height={24} fill="#000" />;
}

// Uso:
<MyComponent iconName="BeerIcon" />;
```

## Props Disponíveis (SvgProps)

Todos os SVGs aceitam props padrão do `react-native-svg`:

- `width` / `height` - número ou string
- `fill` - cor de preenchimento
- `stroke` - cor da borda
- `opacity` - transparência (0-1)
- `style` - ViewStyle do React Native
- E todos os outros props SVG padrão

## Ícones Disponíveis

- `ArrowLeftIcon` / `ArrowRightIcon`
- `BeerIcon`
- `CalendarIcon`
- `CheckIcon`
- `CoffeeIcon`
- `CompassIcon`
- `CrownIcon`
- `DumbbellIcon`
- `EllipsisVerticalIcon`
- `HeartIcon`
- `ListIcon`
- `LockIcon`
- `LogOutIcon`
- `MapPinIcon` / `MapIcon`
- `MessageCircleIcon`
- `MusicIcon`
- `PencilIcon`
- `SearchIcon`
- `SettingsIcon`
- `ShoppingBagIcon`
- `SlidersHorizontalIcon`
- `StarIcon`
- `UserRoundIcon`
- `UtensilsCrossedIcon`
- `XIcon`

## Adicionar Novos Ícones

1. Adicione o arquivo `.svg` em `assets/icons/`
2. Adicione o export em `assets/icons/index.ts`:
   ```ts
   export { default as MeuIconeIcon } from "./meu-icone.svg";
   ```
3. Use normalmente: `import { MeuIconeIcon } from '@/assets/icons';`

## Exemplo Completo

```tsx
import { BeerIcon, MapPinIcon, StarIcon } from "@/assets/icons";
import { View, Text, StyleSheet } from "react-native";

export function PlaceCard() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <BeerIcon width={20} height={20} fill="#1D9BF0" />
        <Text style={styles.title}>Bar do Zé</Text>
      </View>

      <View style={styles.location}>
        <MapPinIcon width={16} height={16} fill="#666" />
        <Text style={styles.distance}>0.5 km</Text>
      </View>

      <View style={styles.rating}>
        <StarIcon width={16} height={16} fill="#FFD700" />
        <Text>4.5</Text>
      </View>
    </View>
  );
}
```

## Migração do IconSymbol

Para migrar componentes que usam `IconSymbol`:

**Antes:**

```tsx
import { IconSymbol } from "@/components/ui/icon-symbol";
<IconSymbol name="heart.fill" size={24} color="#E74C3C" />;
```

**Depois:**

```tsx
import { HeartIcon } from "@/assets/icons";
<HeartIcon width={24} height={24} fill="#E74C3C" />;
```

## Performance

- ✅ Tree-shaking automático (só importa SVGs usados)
- ✅ Bundle menor que font icons
- ✅ Renderização nativa via `react-native-svg`
- ✅ Suporte completo a animações Reanimated
