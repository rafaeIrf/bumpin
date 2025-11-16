# Onboarding Progress Bar - Guia de Implementação

## Componente Criado

`components/onboarding-progress-bar.tsx` - Barra de progresso animada para onboarding

## Ordem das Telas de Onboarding

1. **welcome.tsx** - Tela inicial (sem barra de progresso)
2. **phone-auth.tsx** - Autenticação (Step 1/10) ✅ IMPLEMENTADO
3. **verify-code.tsx** - Verificação de código (Step 2/10)
4. **user-name.tsx** - Nome do usuário (Step 3/10)
5. **user-age.tsx** - Idade (Step 4/10)
6. **user-gender.tsx** - Gênero (Step 5/10)
7. **user-photos.tsx** - Fotos (Step 6/10)
8. **connect-with.tsx** - Com quem conectar (Step 7/10)
9. **intention.tsx** - Intenção (Step 8/10)
10. **location.tsx** - Localização (Step 9/10)
11. **notifications.tsx** - Notificações (Step 10/10)
12. **complete.tsx** - Conclusão (sem barra de progresso)

## Como Implementar

### 1. Remover ScreenToolbar e adicionar OnboardingProgressBar

**Antes:**

```tsx
import { ScreenToolbar } from "@/components/screen-toolbar";

<BaseTemplateScreen
  TopHeader={
    <ScreenToolbar
      leftAction={{
        icon: ArrowLeftIcon,
        onClick: handleBack,
        ariaLabel: t("common.back"),
      }}
    />
  }
>
```

**Depois:**

```tsx
import { OnboardingProgressBar } from "@/components/onboarding-progress-bar";

<BaseTemplateScreen
  TopHeader={
    <OnboardingProgressBar currentStep={STEP_NUMBER} totalSteps={10} />
  }
>
```

### 2. Remover imports não utilizados

- Remover `ArrowLeftIcon` dos imports
- Remover `ScreenToolbar` dos imports
- Remover função `handleBack` se não for mais usada

### 3. Ajustar currentStep

Cada tela deve ter seu número de passo correspondente:

- phone-auth.tsx: `currentStep={1}`
- verify-code.tsx: `currentStep={2}`
- user-name.tsx: `currentStep={3}`
- user-age.tsx: `currentStep={4}`
- user-gender.tsx: `currentStep={5}`
- user-photos.tsx: `currentStep={6}`
- connect-with.tsx: `currentStep={7}`
- intention.tsx: `currentStep={8}`
- location.tsx: `currentStep={9}`
- notifications.tsx: `currentStep={10}`

## Exemplo Completo

```tsx
import { SmartphoneIcon } from "@/assets/icons";
import { BaseTemplateScreen } from "@/components/base-template-screen";
import { OnboardingProgressBar } from "@/components/onboarding-progress-bar";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
// ... outros imports

export default function YourOnboardingScreen() {
  // ... seu código

  return (
    <BaseTemplateScreen
      TopHeader={<OnboardingProgressBar currentStep={X} totalSteps={10} />}
    >
      {/* Conteúdo da tela */}
    </BaseTemplateScreen>
  );
}
```

## Features da Barra de Progresso

- ✅ Animação suave com spring animation
- ✅ Cores do tema (accent/border)
- ✅ Altura de 4px (discreta)
- ✅ Responsiva (100% width)
- ✅ Sem labels de texto (apenas visual)
- ✅ Padding horizontal e vertical adequados

## Telas que NÃO devem ter barra de progresso

- `welcome.tsx` - Tela inicial
- `complete.tsx` - Tela de conclusão
