# 🚀 GitHub Actions - EAS Build & Deploy

Este workflow automatiza o build e deploy do app usando Expo Application Services (EAS).

## 📋 Pré-requisitos

Antes de usar o workflow, você precisa configurar o projeto EAS e as secrets no GitHub:

### 0. Configurar EAS Build (Primeira vez)

Se esta é a primeira vez configurando o EAS Build:

```bash
# Faça login no EAS CLI
eas login

# Configure o projeto (isso criará o eas.json se não existir)
eas build:configure

# Gere a keystore Android (escolha "Yes" quando perguntado)
# O EAS irá gerar e armazenar a keystore automaticamente na nuvem
eas build --platform android --profile preview
```

Durante a configuração, o EAS vai:

- Criar automaticamente uma keystore Android
- Armazenar com segurança na nuvem
- Associar ao seu projeto Expo

**Importante**: Você só precisa fazer isso uma vez. A keystore será reutilizada em todos os builds futuros.

### 1. EXPO_TOKEN

Gere um token de autenticação do Expo para o GitHub Actions:

```bash
# Acesse o dashboard do Expo e crie um token:
# https://expo.dev/accounts/[your-account]/settings/access-tokens
```

Ou gere via CLI (se disponível na sua versão):

```bash
npx expo login
# Depois acesse o dashboard para gerar o token
```

Adicione o token em: **Settings > Secrets and variables > Actions > New repository secret**

- Nome: `EXPO_TOKEN`
- Valor: o token gerado

### 2. GOOGLE_SERVICE_ACCOUNT_KEY (Opcional - apenas para deploy automático)

Para deploy automático no Google Play Console:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto ou selecione um existente
3. Ative a **Google Play Android Developer API**
4. Vá em **IAM & Admin > Service Accounts**
5. Crie uma service account
6. Gere uma chave JSON
7. No [Google Play Console](https://play.google.com/console), adicione a service account com permissões de **Release Manager**

Adicione o conteúdo do JSON como secret:

- Nome: `GOOGLE_SERVICE_ACCOUNT_KEY`
- Valor: conteúdo completo do arquivo JSON

## 🎯 Como o Workflow Funciona

### Triggers (Quando executa)

1. **Push na branch `main`**: Build automático em preview (Android)
2. **Push de tag `v*`** (ex: `v1.0.0`): Build de produção e deploy no Google Play
3. **Pull Request**: Valida mas não faz build
4. **Manual (workflow_dispatch)**: Permite escolher plataforma, perfil e se deve fazer deploy

### Perfis de Build

- **development**: Build de desenvolvimento (sem otimizações)
- **preview**: Build de teste (APK para distribuição interna)
- **production**: Build de produção (AAB para Google Play)

## 🔧 Execução Manual

Para executar o workflow manualmente:

1. Vá em **Actions** no GitHub
2. Selecione **EAS Build & Submit**
3. Clique em **Run workflow**
4. Escolha:
   - **Platform**: android, ios ou all
   - **Profile**: development, preview ou production
   - **Submit**: se deve fazer deploy após build

## 📱 Builds Automáticos

### Preview (Push na main)

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

→ Build automático de preview para Android

### Produção (Release tag)

```bash
git tag v1.0.0
git push origin v1.0.0
```

→ Build de produção e deploy no Google Play

## 📦 Perfis EAS (eas.json)

Certifique-se de que o arquivo `eas.json` está configurado corretamente:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json"
      }
    }
  }
}
```

## 🔍 Verificar Status do Build

Após disparar o workflow:

1. Vá em **Actions** no GitHub para ver o progresso
2. Acesse [Expo Dashboard](https://expo.dev) para detalhes do build
3. Quando concluído, baixe o APK/AAB do Expo Dashboard

## 🐛 Troubleshooting

### Erro: "EXPO_TOKEN is not set"

- Verifique se a secret `EXPO_TOKEN` está configurada corretamente no GitHub

### Erro: "Build failed"

- Verifique os logs no GitHub Actions
- Confira se `eas.json` está configurado
- Verifique se as dependências estão corretas no `package.json`

### Erro: "Submit failed"

- Certifique-se de que `GOOGLE_SERVICE_ACCOUNT_KEY` está configurada
- Verifique se a service account tem permissões no Play Console
- Confirme que o app já foi criado no Play Console

## 📚 Recursos

- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Expo EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
