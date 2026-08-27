# FLASHCARD_RPG

Frontend da central de estudos em React + TypeScript + Vite. A interface usa a runa `𐦉`, estilo TUI/RPG e conversa com uma API REST.

## 1. Antes de começar

Instale Node.js LTS em https://nodejs.org/. Abra o terminal na pasta do projeto e rode:

```bash
npm install
npm run dev
```

Abra `http://localhost:5173` no navegador. Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

O comando `build` verifica o TypeScript e cria a pasta `dist`.

## 2. Mapa da pasta

| Arquivo | Para que serve |
| --- | --- |
| `src/App.tsx` | Lógica das telas, navegação, formulários e chamadas da API |
| `src/App.css` | Visual TUI/RPG, cores, painéis, botões, arena e responsividade |
| `src/index.css` | Configurações globais, fonte e reset básico |
| `src/main.tsx` | Ponto de entrada que renderiza o React |
| `api.json` | Contrato OpenAPI do backend |
| `package.json` | Comandos e dependências do frontend |
| `dist/` | Arquivos gerados para publicação; não edite manualmente |

## 3. Como pensar no código

O componente `App` controla a aplicação por estados. A variável `screen` indica a tela atual:

```text
materias -> temas -> tema -> setup -> arena -> victory
```

As entidades são:

```text
Materia: id, nome
Tema: id, nome, materiaId
Flashcard: id, titulo, frente, verso, materiaId, temaId
```

`materiaId` liga um tema à matéria. `temaId` liga um flashcard ao tema. Não remova esses relacionamentos ao alterar a interface.

Para mudar um texto ou botão, procure o texto em `src/App.tsx`. Para mudar cor, borda, sombra ou tamanho, procure as classes em `src/App.css`. As cores ficam no começo do arquivo, dentro de `:root`:

```css
--cyan: #42e8e0;
--yellow: #f4cc55;
--green: #62e886;
--red: #f06475;
```

Para adicionar uma tela, inclua o nome no tipo `Screen`, crie um componente e adicione uma condição no retorno de `App`.

## 4. Integração com o backend

O backend publicado usa `https://flashcardsystem-production.up.railway.app`. A URL é definida em `src/App.tsx`:

```ts
const API = import.meta.env.VITE_API_URL || 'https://flashcardsystem-production.up.railway.app'
```

Em desenvolvimento, crie `.env.local` na raiz do projeto:

```env
VITE_API_URL=https://flashcardsystem-production.up.railway.app
```

Depois de criar ou alterar `.env.local`, reinicie `npm run dev`. Variáveis do Vite precisam começar com `VITE_`. Nunca coloque senhas ou tokens secretos nelas.

### Endpoints usados

| Ação | Método | Endpoint |
| --- | --- | --- |
| Listar matérias | GET | `/api/materias` |
| Criar matéria | POST | `/api/materias` |
| Listar temas | GET | `/api/temas` |
| Criar tema | POST | `/api/temas` |
| Editar tema | PUT | `/api/temas/{id}` |
| Excluir tema | DELETE | `/api/temas/{id}` |
| Listar cards | GET | `/api/flashcards` |
| Criar card | POST | `/api/flashcards` |
| Editar card | PUT | `/api/flashcards/{id}` |
| Excluir card | DELETE | `/api/flashcards/{id}` |
| Iniciar estudo filtrado | GET | `/api/flashcards/estudo?materiaId=1&temaId=1` |

Exemplos de corpos enviados:

```json
{ "nome": "História" }
```

```json
{ "nome": "Roma", "materiaId": 1 }
```

```json
{
  "titulo": "República Romana",
  "frente": "Quando começou a República Romana?",
  "verso": "Em 509 a.C.",
  "materiaId": 1,
  "temaId": 2
}
```

O carregamento inicial faz três requisições GET em paralelo. Se o backend falhar, a tela mostra um alerta e usa dados demonstrativos. Dados criados com a API desligada não serão persistidos no banco.

### CORS

O backend precisa aceitar a origem do frontend. Em desenvolvimento, é `http://localhost:5173`. Em produção, inclua também o domínio publicado, por exemplo `https://seu-dominio.com`.

Permita os métodos `GET`, `POST`, `PUT`, `DELETE` e `OPTIONS`, além do header `Content-Type`. Erro de CORS no console normalmente indica configuração do backend, não problema no botão do frontend.

## 5. Teste manual

1. Confirme que o backend Railway está acessível em `https://flashcardsystem-production.up.railway.app`.
2. Configure `VITE_API_URL=https://flashcardsystem-production.up.railway.app` no `.env.local`.
3. Inicie o frontend com `npm run dev`.
3. Crie uma matéria.
4. Abra a matéria e crie um tema.
5. Abra o tema e crie dois flashcards.
6. Clique em `INICIAR ESTUDOS`.
7. Teste embaralhamento e modo reverso.
8. Revele uma resposta e marque `ERREI`.
9. Confirme que o card reaparece na rodada de recuperação.
10. Acerte todos e confirme `ESTUDOS CONCLUÍDOS`.
11. Edite e exclua um card.

Para investigar, abra `F12` no navegador. Use `Console` para erros JavaScript e `Network` para conferir URL, método, status e corpo das requisições.

## 6. Deploy na Vercel

1. Envie o projeto para o GitHub sem incluir `node_modules`, `.env.local` ou segredos.
2. Em https://vercel.com/, importe o repositório.
3. Use `Vite` como framework, `npm run build` como build command e `dist` como output directory.
4. Em `Settings > Environment Variables`, crie `VITE_API_URL` com a URL pública do backend, por exemplo `https://api.seu-dominio.com`.
5. Faça um novo deploy depois de salvar a variável.

## 7. Deploy na Netlify

1. Importe o repositório em https://www.netlify.com/.
2. Use `npm run build` como build command e `dist` como publish directory.
3. Em `Site configuration > Environment variables`, adicione `VITE_API_URL` com a URL pública do backend.
4. Publique novamente após salvar a variável.

Se no futuro forem adicionadas rotas do navegador, como `/tema/1`, será necessário configurar fallback para `index.html`.

## 8. Deploy no Railway

O projeto já contém `railway.json` e o script `npm start` configurado para escutar a porta `$PORT` do Railway.

1. Envie o projeto para um repositório GitHub. O arquivo `.env.local` não é enviado porque está no `.gitignore`.
2. Em https://railway.app/, crie um novo projeto e escolha `Deploy from GitHub repo`.
3. Selecione este repositório. O Railway detectará Node.js e usará:

```text
Build command: npm run build
Start command: npm start
```

4. No serviço do frontend, abra `Variables` e adicione:

```text
VITE_API_URL=https://flashcardsystem-production.up.railway.app
```

5. Gere um domínio público em `Settings > Networking > Generate Domain`.
6. Aguarde o deploy e abra o domínio gerado.
7. No backend, configure CORS permitindo o domínio público do frontend.

Importante: variáveis `VITE_*` são incorporadas durante o build. Sempre que alterar `VITE_API_URL` no Railway, faça um novo deploy para gerar os arquivos do frontend novamente.

## 9. Publicar manualmente

Rode:

```bash
npm run build
```

Publique apenas o conteúdo de `dist/` em um servidor de arquivos estáticos. O backend fica publicado separadamente. Configure `VITE_API_URL` antes do build.

## 10. Cuidados importantes

- Não coloque senhas, chaves privadas ou tokens no frontend.
- Não troque `materiaId` e `temaId` por nomes: a API trabalha com IDs.
- Não edite `dist`; ele é recriado pelo build.
- Depois de qualquer alteração, rode `npm run build`.
- Antes de publicar, teste a URL real da API e o CORS do domínio final.
- O endpoint `/api/flashcards/estudo` existe no backend e pode substituir futuramente o filtro local usado pela arena.

## 11. Próximos aprimoramentos

Os próximos aprimoramentos naturais são carregar a arena pelo endpoint `/api/flashcard/estudo`, adicionar edição e exclusão de matérias e temas, e substituir o `confirm()` por um modal TUI próprio.
