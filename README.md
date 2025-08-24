# vercel-ia-api (CORS + Hobby-safe)
API serverless para gerar música com IA.

## Deploy rápido
1. Crie um repositório no GitHub e suba estes ficheiros.
2. No Vercel, crie um novo projeto a partir desse repositório.
3. Adicione Environment Variables:
   - `STABILITY_API_KEY` (obrigatório)
   - `DEFAULT_FORMAT` = `wav` ou `mp3` (opcional)
   - `PROMPTS` = estilos separados por `|` (opcional)
   - `CORS_ALLOW_ORIGIN` = URL do seu site frontend (ex: https://usuario.github.io)
4. Deploy.

## Endpoints
- `GET /api/autogen` → gera faixa aleatória.
- `POST /api/music` → body JSON `{ "prompt": "ambient, 100 bpm", "duration": 50, "format": "wav" }`
