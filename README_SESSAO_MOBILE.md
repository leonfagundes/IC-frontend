# Brain Tumor Detection - Frontend

Aplicação web React + TypeScript para upload e análise de imagens de ressonância magnética cerebral usando IA, com funcionalidade de upload via celular através de QR Code.

## 🚀 Stack Tecnológica

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Estado**: React Hooks (useState, useEffect, useReducer)
- **Backend as a Service**: Firebase Firestore
- **Componentes UI**: Radix UI + shadcn/ui
- **QR Code**: qrcode.react
- **Ícones**: Lucide React

## 📋 Funcionalidades

### Upload de Imagens
- Upload drag-and-drop de imagens
- Preview de imagens antes do envio
- Integração com API de IA para detecção de tumores
- Feedback visual com modais de resultado

### Sessão Desktop ↔ Celular
- **Desktop**: Botão "Enviar pelo Celular" que gera QR Code
- **QR Code**: Modal com QR Code e URL para acesso mobile
- **Celular**: Página otimizada para upload de múltiplas imagens
- **Sincronização em tempo real**: Firebase Firestore sincroniza status entre dispositivos
- **Card de status**: Mostra conexão mobile no canto superior direito
- **Expiração automática**: Sessão expira em 5 minutos
- **Encerramento manual**: Pode ser encerrado pelo desktop ou celular

## 🔧 Configuração

### 1. Pré-requisitos

- Node.js 18+ instalado
- Conta no Firebase (gratuita)

### 2. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Dê um nome ao projeto e siga os passos
4. No painel do projeto, clique em "Web" (ícone `</>`)
5. Registre seu app e copie as credenciais

### 3. Configurar Firestore

1. No Firebase Console, vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha modo de produção ou teste
4. Selecione a localização (escolha a mais próxima)

### 4. Regras de Segurança do Firestore

Configure as regras em `Firestore Database > Regras`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura e escrita em sessões
    match /sessions/{sessionId} {
      allow read, write: if true; // Para desenvolvimento
      // Em produção, adicione regras mais restritas
    }
  }
}
```

⚠️ **Atenção**: As regras acima são permissivas. Em produção, restrinja o acesso.

### 5. Configurar Variáveis de Ambiente

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env.local
   ```

2. Edite `.env.local` com suas credenciais do Firebase:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
   ```

### 6. Instalar Dependências

```bash
npm install
```

### 7. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 📱 Como Usar a Funcionalidade Mobile

### Desktop:

1. Acesse a página principal
2. Clique em "Enviar pelo Celular"
3. Um modal com QR Code aparecerá
4. Mantenha a janela aberta
5. Um card de status aparecerá no canto superior direito quando o celular conectar

### Celular:

1. Escaneie o QR Code com a câmera do celular
2. Você será direcionado para a página de upload mobile
3. Selecione uma ou mais imagens
4. As imagens serão processadas pela IA
5. Você pode enviar múltiplas imagens durante a sessão de 5 minutos

### Encerrar Sessão:

- **Desktop**: Clique no X no card de status
- **Celular**: Clique em "Encerrar Sessão"
- **Automático**: Após 5 minutos

## 🗂️ Estrutura do Projeto

```
frontend/
├── app/
│   ├── layout.tsx                    # Layout principal com SessionManager
│   ├── page.tsx                      # Página inicial
│   ├── globals.css                   # Estilos globais
│   └── mobile-upload/
│       └── [sessionId]/
│           └── page.tsx              # Página de upload mobile
│
├── components/
│   ├── photo-upload.tsx              # Componente de upload (desktop)
│   ├── qrcode-modal.tsx              # Modal com QR Code
│   ├── session-card.tsx              # Card de status da sessão
│   ├── session-manager.tsx           # Gerenciador global de sessões
│   ├── result-modal.tsx              # Modal de resultados
│   ├── error-modal.tsx               # Modal de erros
│   └── ui/                           # Componentes base (shadcn/ui)
│
├── lib/
│   ├── firebase.ts                   # Configuração do Firebase
│   ├── hooks/
│   │   └── useSession.ts             # Hook para gerenciar sessões
│   ├── types/
│   │   └── session.ts                # Tipos TypeScript
│   └── services/
│       └── ai-service.ts             # Serviço simulado de IA
│
└── public/                           # Arquivos estáticos
```

## 🔄 Fluxo de Sessão

### Estrutura de Dados no Firestore

**Coleção**: `sessions`

**Documento** (`sessionId`):
```typescript
{
  status: 'pending' | 'active' | 'closed' | 'expired',
  createdAt: Timestamp,
  expiresAt: Timestamp,      // 5 minutos após criação
  desktopConnected: boolean,
  mobileConnected: boolean,
  lastUpdateAt: Timestamp
}
```

### Estados da Sessão

- **pending**: QR Code gerado, aguardando celular
- **active**: Celular conectado, pronto para uploads
- **closed**: Encerrado manualmente
- **expired**: Tempo limite atingido (5 minutos)

### Sincronização em Tempo Real

O hook `useSession` usa `onSnapshot` do Firestore para:
- Atualizar status em tempo real
- Detectar conexão/desconexão de dispositivos
- Verificar expiração automaticamente
- Notificar mudanças para ambos os dispositivos

## 🧪 API de IA (Simulada)

A aplicação inclui um serviço simulado de IA em `lib/services/ai-service.ts`.

Para integrar uma API real:

```typescript
// lib/services/ai-service.ts
export async function uploadToAI(file: File): Promise<AIResult> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('https://sua-api.com/predict', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
}
```

## 🎨 Customização

### Tempo de Expiração

Edite em `lib/hooks/useSession.ts`:
```typescript
const SESSION_DURATION_MS = 5 * 60 * 1000; // Altere aqui
```

### Posição do SessionCard

Edite em `components/session-card.tsx`:
```tsx
<Card className="fixed top-20 right-4 ..."> {/* Altere aqui */}
```

### Tipos de Tumor

A API simulada retorna:
- `glioma`
- `meningioma`
- `notumor`
- `pituitary`

Customize em `lib/services/ai-service.ts`

## 🚀 Deploy

### Vercel (Recomendado para Next.js)

1. Instale Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Configure variáveis de ambiente no painel da Vercel

3. Deploy:
   ```bash
   vercel --prod
   ```

### Outras Plataformas

- **Netlify**: Compatível com Next.js
- **Firebase Hosting**: Requer configuração adicional
- **AWS Amplify**: Suporte nativo para Next.js

## 📝 Notas de Desenvolvimento

### Modo de Desenvolvimento

- Logs detalhados no console
- Credenciais Firebase podem ser hardcoded (apenas dev)
- Hot reload ativo

### Modo de Produção

1. Configure regras de segurança do Firestore
2. Use variáveis de ambiente
3. Adicione autenticação (opcional)
4. Configure rate limiting
5. Build otimizado:
   ```bash
   npm run build
   npm start
   ```

## 🐛 Troubleshooting

### Firebase não conecta
- Verifique as credenciais em `.env.local`
- Confirme que o Firestore está criado
- Verifique as regras de segurança

### QR Code não abre no celular
- Certifique-se de que ambos estão na mesma rede (dev)
- Use ngrok para expor localhost em desenvolvimento
- Em produção, use HTTPS

### Sessão expira muito rápido
- Aumente `SESSION_DURATION_MS`
- Verifique fuso horário do servidor

### Imagens não são enviadas
- Verifique o serviço de IA em `lib/services/ai-service.ts`
- Confirme que o arquivo é uma imagem válida
- Veja logs de erro no console

## 📄 Licença

Este projeto é parte de um trabalho de iniciação científica.

## 👥 Contribuindo

Para contribuir:
1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação do Firebase
- Verifique os logs do console

---

Desenvolvido com ❤️ usando React, TypeScript e Firebase
