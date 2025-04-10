# 🏋️ Midowz Gym - Frontend

Este é o **frontend do Gym App**, um aplicativo de treino com funcionalidades sociais, construído com **Next.js (App Router)**, **TailwindCSS** e **TypeScript**.

## 🔗 Projeto em Produção
- 🌐 [Acessar App](https://gym-frontend-gray.vercel.app)

## 🚀 Tecnologias Usadas
- **Next.js 15 (App Router)**
- **TailwindCSS**
- **TypeScript**
- **Framer Motion**
- **Lucide-react**
- **Vercel** (Deploy)

## ⚙️ Funcionalidades
- Autenticação (Login e Registro)
- Criação, edição e visualização de sessões de treino
- Adição e exclusão de exercícios e sets
- Marcação de sets como feitos (`done` ✅)
- Tipos de sets: `Warmup`, `Feeder`, `Work`, `Top`
- Comentários com exclusão permitida apenas para o autor
- Curtidas em sessões e comentários
- Sistema de seguidores (seguir/deixar de seguir + contadores)
- Perfis públicos e privados
- Busca global por usuário, sessão e exercício (em desenvolvimento)

## 💅 Design e Experiência
- Layout mobile-first com animações suaves (Framer Motion)
- Menu fixo no rodapé com navegação dinâmica
- Edição de sessão fluida (sem botão de salvar)
- Notas da sessão visíveis na tela de visualização

## 🔐 Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_API_URL=https://gym-backend-production-bce0.up.railway.app
```

## 🧪 Scripts
```bash
npm install        # Instala dependências
npm run dev        # Inicia ambiente de desenvolvimento
npm run build      # Compila para produção
```

## 🌍 Deploy
Feito via **Vercel** (com integração ao GitHub). Para customizar o domínio ou branches, use o painel da Vercel.

## 📁 Estrutura de Pastas
```
src/
├── app/                  # Páginas do App Router
├── components/           # Componentes reutilizáveis
├── services/             # Integração com a API
├── utils/                # Funções auxiliares (ex: storage do token)
```

---

Feito com 💪 por João Gabriel — [Midowz](https://github.com/joaomidowz)

