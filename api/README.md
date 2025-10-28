# Documentação da API

## Endpoint: POST /predict

### Formato esperado da resposta

A API Python deve retornar um JSON no seguinte formato:

```json
{
  "predicted_class": "glioma",
  "confidence": 0.95
}
```

ou

```json
{
  "class": "meningioma",
  "probability": 0.87
}
```

### Classes suportadas

O sistema reconhece as seguintes classes (case-insensitive):

- `glioma` - Tumor do tipo glioma
- `meningioma` - Tumor do tipo meningioma
- `pituitary` - Tumor da glândula pituitária
- `notumor` ou `no_tumor` - Sem tumor detectado

### Campos da resposta

- `predicted_class` ou `class` ou `prediction` (string, obrigatório): A classe predita pelo modelo
- `confidence` ou `probability` (number, opcional): Confiança da predição (entre 0 e 1)

### Exemplo de implementação Python (FastAPI)

```python
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Seu código de predição aqui
    # ...
    
    return {
        "predicted_class": "glioma",  # ou "meningioma", "pituitary", "notumor"
        "confidence": 0.95
    }
```

### Testando localmente

1. A API deve estar rodando em `http://127.0.0.1:8000`
2. O frontend fará uma requisição POST para `http://127.0.0.1:8000/predict`
3. O arquivo será enviado como FormData com a chave `file`
