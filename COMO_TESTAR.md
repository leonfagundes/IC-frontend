# Como Testar a Funcionalidade de Upload por Celular

## Pré-requisitos
- Servidor Next.js rodando (npm run dev)
- Celular com câmera e acesso à internet
- Desktop e celular na mesma rede (ou servidor acessível publicamente)

## Passo a Passo

### 1. Iniciar o Servidor
```bash
npm run dev
```

### 2. No Desktop
1. Acesse `http://localhost:3000` (ou seu domínio)
2. Na área de upload, clique no botão **"Enviar por celular"**
3. Um modal será aberto com um QR Code

### 3. No Celular
1. Abra a câmera do seu celular
2. Aponte para o QR Code na tela do computador
3. Toque na notificação que aparecer
4. Você será redirecionado para a página de upload móvel

### 4. Enviar Foto
Escolha uma das opções:
- **Tirar Foto**: Abre a câmera para capturar uma nova imagem
- **Escolher da Galeria**: Seleciona uma foto existente

### 5. Confirmação
- No celular: Aparecerá uma tela de sucesso
- No desktop: A imagem aparecerá automaticamente carregada no modal de upload
- O modal de QR Code fechará sozinho

## Observações

### Para Teste Local
Se estiver testando localmente, certifique-se de que:
- O celular está na mesma rede WiFi que o computador
- Use o IP local da máquina ao invés de `localhost`
  - Exemplo: `http://192.168.1.100:3000`
  - Para descobrir seu IP: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)

### Para Produção/Deploy
- O servidor precisa estar acessível publicamente (HTTPS)
- Configure CORS se necessário
- Considere usar Redis para armazenamento de sessões
- Implemente rate limiting para evitar abuso

## Estrutura de URLs

- Desktop: `http://SEU_DOMINIO/`
- Mobile: `http://SEU_DOMINIO/mobile-upload?session=SESSION_ID`
- API Session: `POST /api/mobile-session`
- API Check: `GET /api/check-upload?session=SESSION_ID`

## Troubleshooting

### QR Code não abre
- Verifique se a URL no QR Code está correta
- Tente escanear com um app de QR Code dedicado

### Imagem não aparece no desktop
- Verifique o console do navegador para erros
- Confirme que as rotas de API estão respondendo
- Verifique se o polling está funcionando (Network tab)

### Erro de sessão inválida
- O QR Code expira após 10 minutos
- Gere um novo QR Code clicando novamente no botão

### Imagem muito grande
- Considere adicionar compressão no lado do cliente
- Implemente validação de tamanho máximo

## Testando as APIs Manualmente

### Enviar Imagem
```bash
curl -X POST http://localhost:3000/api/mobile-session \
  -H "Content-Type: application/json" \
  -d '{"session":"test123","imageData":"data:image/png;base64,..."}'
```

### Verificar Upload
```bash
curl http://localhost:3000/api/check-upload?session=test123
```
