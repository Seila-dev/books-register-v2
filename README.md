# 📚 BooksRegister

![Next.js](https://img.shields.io/badge/Next.js-13+-000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![JWT Auth](https://img.shields.io/badge/Auth-JWT%20%7C%20OAuth2-blueviolet?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

> Um espaço para guardar seus livros, filmes e séries favoritos — vistos ou que pretende ver — com organização por categorias e autenticação moderna.

---

## ✨ Visão Geral

**BooksRegister** é uma aplicação full stack onde você pode registrar obras que já leu/assistiu ou deseja consumir futuramente. Funciona como uma **galeria multimídia pessoal**, com recursos de autenticação, organização por categorias e uma interface moderna.

Ideal para quem gosta de manter um histórico cultural organizado.

---

## 🧩 Funcionalidades

- 📚 **Cadastro de livros, filmes e séries**
- 🏷️ **Gerenciamento de categorias personalizadas**
- 🖼️ **Upload de capa da obra**
- 🔐 **Login com JWT e Google OAuth 2.0**
- 🌓 **Tema escuro e design responsivo**
- 📱 **Menu mobile com navegação fluida**
- 🗃️ **Dashboard com progresso mensal e controle visual**

---

## ⚙️ Tecnologias Utilizadas

### Frontend
- [Next.js 13+ (App Router)](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React Icons](https://lucide.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

### Backend
- [Express.js](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Cloudinary](https://cloudinary.com/) (upload de imagens)
- [JWT](https://jwt.io/)
- [Google OAuth 2.0](https://developers.google.com/identity)

---

## 🚀 Como rodar o projeto

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/books-register-v2.git
cd books-register-v2
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
```

3. **Configure variáveis de ambiente**

Crie um .env.local no frontend e .env no backend com base nos arquivos .env.example (ainda não disponível).

4. **Inicie os serviços**

# Backend
cd backend
npx prisma migrate dev
npm run dev

# Frontend
cd ../frontend
npm run dev

## 📌 Futuras Melhorias
### 🔍 Filtro e busca por obras

📈 Estatísticas detalhadas de leitura/visualização

📲 Instalação como PWA

🗂️ Tags múltiplas por obra

🔔 Notificações e lembretes

## 🧑‍💻 Autor
Desenvolvido por Erick Rodrigues

https://www.linkedin.com/in/erickrodrigues-dev
https://github.com/Seila-dev/

## 📄 Licença
Este projeto está sob a licença MIT.
Sinta-se à vontade para usar, estudar e contribuir.

