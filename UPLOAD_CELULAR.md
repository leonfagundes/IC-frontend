# Upload por Celular - Funcionalidade QR Code

Esta branch implementa a funcionalidade de upload de imagens através do celular usando QR Code.

## Funcionalidades Implementadas

### 1. Botão "Enviar por celular"
- Adicionado botão na área de upload do desktop
- Ao clicar, abre um modal com QR Code

### 2. Modal de QR Code
- Exibe QR Code gerado dinamicamente
- Instruções passo a passo de como usar
- Polling automático para detectar quando a imagem é enviada do celular
- Fecha automaticamente quando a imagem é recebida

### 3. Página de Upload Móvel (`/mobile-upload`)
- Interface otimizada para dispositivos móveis
- Duas opções de envio:
  - **Tirar Foto**: Abre a câmera do celular diretamente
  - **Escolher da Galeria**: Permite selecionar foto existente
- Preview da imagem antes de enviar
- Feedback visual de sucesso ao enviar
- Validação de sessão

### 4. Sistema de Sessões
- Cada QR Code possui um ID de sessão único
- Armazenamento temporário em memória (Map)
- Limpeza automática de sessões antigas (> 10 minutos)
- Em produção, deve ser substituído por Redis ou banco de dados

### 5. APIs Criadas

#### `/api/mobile-session` (POST)
- Recebe a imagem do celular
- Armazena na sessão correspondente
- Parâmetros: `{ session: string, imageData: string }`

#### `/api/check-upload` (GET)
- Verifica se há imagem para uma sessão
- Usado pelo polling no modal de QR Code
- Parâmetro: `?session=SESSION_ID`

## Arquivos Criados/Modificados

### Novos Arquivos
- `components/qrcode-upload-modal.tsx` - Modal com QR Code
- `app/mobile-upload/page.tsx` - Página de upload móvel
- `app/api/mobile-session/route.ts` - API para receber imagem do celular
- `app/api/check-upload/route.ts` - API para verificar upload
- `lib/session-storage.ts` - Armazenamento compartilhado de sessões

### Arquivos Modificados
- `components/photo-upload.tsx` - Adicionado botão e integração
- `components/index.ts` - Exportação do novo componente
- `messages/pt.json` - Traduções em português
- `messages/en.json` - Traduções em inglês
- `messages/es.json` - Traduções em espanhol

## Dependências Adicionadas
```json
{
  "dependencies": {
    "qrcode.react": "^3.1.0"
  },
  "devDependencies": {
    "@types/qrcode.react": "^1.0.5"
  }
}
```

## Como Funciona

1. **Desktop**: Usuário clica em "Enviar por celular"
2. **Modal**: Abre com QR Code único para aquela sessão
3. **Celular**: Usuário escaneia o QR Code com a câmera
4. **Celular**: É redirecionado para `/mobile-upload?session=XXX`
5. **Celular**: Tira foto ou escolhe da galeria
6. **Celular**: Imagem é enviada via POST para `/api/mobile-session`
7. **Desktop**: Polling detecta a imagem via GET em `/api/check-upload`
8. **Desktop**: Modal fecha e imagem aparece carregada no upload

## Melhorias Futuras

- [ ] Substituir armazenamento em memória por Redis
- [ ] Adicionar WebSocket para comunicação em tempo real
- [ ] Implementar compressão de imagem no mobile
- [ ] Adicionar limite de tamanho de arquivo
- [ ] Implementar retry automático em caso de falha
- [ ] Adicionar analytics de uso
- [ ] Melhorar feedback visual de progresso
- [ ] Adicionar suporte para múltiplas imagens

## Observações de Segurança

⚠️ **Importante**: O armazenamento atual é em memória e será perdido ao reiniciar o servidor. Para produção:
- Implementar Redis ou banco de dados
- Adicionar autenticação de sessões
- Implementar rate limiting
- Validar e sanitizar imagens no servidor
- Adicionar HTTPS obrigatório
