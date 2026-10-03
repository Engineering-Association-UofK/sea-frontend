<div align="center">

# 🏛️ Engineering Association — University of Khartoum

### Frontend Web Application

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://association-website-frontend.vercel.app)

[🌐 Live Demo](https://association-website-frontend.vercel.app) · [🐛 Report a Bug](https://github.com/Engineering-Association-UofK/association-website-frontend/issues) · [💡 Request a Feature](https://github.com/Engineering-Association-UofK/association-website-frontend/issues)

</div>

---

## 📋 Table of Contents

- [🏛️ Engineering Association — University of Khartoum](#️-engineering-association--university-of-khartoum)
  - [Frontend Web Application](#frontend-web-application)
  - [📋 Table of Contents](#-table-of-contents)
  - [🔭 Overview](#-overview)
  - [✨ Features](#-features)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [📁 Project Structure](#-project-structure)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [🔧 Environment Variables](#-environment-variables)
  - [📜 Available Scripts](#-available-scripts)
  - [🤝 Contributing](#-contributing)
  - [📚 Resources](#-resources)

---

## 🔭 Overview

This is the **React-based frontend** for the Steering Engineering Association at the University of Khartoum. It serves as a bilingual (English 🇬🇧 / Arabic 🇸🇩) platform with full RTL support, providing both a public-facing website and a feature-rich admin dashboard.

The application integrates with a **Go** backend API, uses **SeaweedFS** for image/documents management, and includes an options-tree-based **chat bot** for visitor assistance.

---

## ✨ Features

| Area                  | Highlights                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------- |
| **Public Pages**      | Home, About, Blogs, And Events with bilingual content                                    |
| **Authentication**    | JWT-based login, email verification, role-based access                                   |
| **Blog Management**   | Full CRUD with Markdown editor, live preview, image upload, draft/publish/archive status |
| **Admin Dashboard**   | Manage users, bot commands, images, and editable site content                            |
| **Chat Bot**          | Floating widget with options-based conversation tree, multi-language                     |
| **Image Storage**     | SeaweedFS integration with metadata management and reusable image picker                 |
| **System Monitoring** | Real-time CPU, memory, disk usage with auto-refresh every 30 seconds                     |
| **i18n & RTL**        | Full English/Arabic support, direction auto-switching, JSON-based translations           |

---

## 🛠️ Tech Stack

| Category            | Technology                                      |
| ------------------- | ----------------------------------------------- |
| **UI Framework**    | React 19                                        |
| **Build Tool**      | Vite 7                                          |
| **Routing**         | React Router DOM 7                              |
| **UI Components**   | React Bootstrap 5, Bootstrap Icons, FontAwesome |
| **Server State**    | TanStack React Query 5                          |
| **HTTP Client**     | Axios (with interceptors)                       |
| **Markdown**        | React Markdown + custom editor component        |
| **Authentication**  | JWT stored in `localStorage` / `sessionStorage` |
| **Styling**         | CSS Modules, Bootstrap, custom CSS              |
| **Linting**         | ESLint                                          |
| **Package Manager** | pnpm                                            |

---

## 📁 Project Structure

```
association-website-frontend/
├── public/                     # Static assets
├── src/
│   ├── api/                    # Core API configuration
│   │   ├── axiosClient.js      # Axios instance with auth interceptors
│   │   └── upload.service.js   # Cloudinary upload service
│   │
│   ├── components/             # Reusable UI components
│   │   ├── AdminSidebar.jsx
│   │   ├── EditContentButton.jsx
│   │   ├── Footer.jsx
│   │   ├── Gallery.jsx
│   │   ├── ImageUpload.jsx / ImageUpload2.jsx
│   │   ├── ImagePickerModal/   # Select from existing images
│   │   ├── LoginForm.jsx / RegisterForm.jsx
│   │   ├── NavBar.jsx
│   │   ├── ProtectedRoute.jsx / PublicOnlyRoute.jsx
│   │   ├── TeamSection.jsx
│   │   ├── bot/                # Chat bot widget
│   │   ├── feedback/           # Feedback widget
│   │   ├── home/               # Home page sections
│   │   └── markdown/           # Markdown editor & viewer
│   │
│   ├── config/
│   │   └── index.js            # API URLs, timeouts
│   │
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state & actions
│   │   └── LanguageContext.jsx # i18n (en/ar) with RTL switching
│   │
│   ├── features/               # Feature-based modules
│   │   ├── admin users/
│   │   ├── auth/
│   │   ├── blogs/
│   │   ├── bot commands/
│   │   ├── gallery/
│   │   ├── generics/           # Editable text content
│   │   ├── image storage/
│   │   └── monitoring/
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useBot.js
│   │   ├── useFileUpload.js
│   │   └── useGallery.js
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx      # NavBar + Footer wrapper
│   │   └── StandaloneLayout.jsx# Minimal layout (login/register)
│   │
│   ├── locales/
│   │   ├── en.json             # English translations
│   │   └── ar.json             # Arabic translations
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── About/
│   │   ├── Blogs/
│   │   ├── Admin/
│   │   ├── Admin Users/
│   │   ├── Bot Commands/
│   │   ├── Dashboard/
│   │   ├── Gallery/
│   │   └── Image Storage/
│   │
│   ├── services/
│   │   └── api.js              # Generic API client
│   │
│   ├── utils/
│   │   ├── api.js
│   │   ├── formatters.js       # Bytes, uptime formatting
│   │   └── images/             # Static images
│   │
│   ├── App.jsx                 # Route configuration
│   ├── main.jsx                # App entry point
│   └── index.css / App.css     # Global styles
│
├── .env.example                # Environment variable template
├── .gitignore
├── contribution-guid.md        # Detailed contribution guide
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** 20+
- **pnpm** (recommended) or npm
- A running instance of the **backend** Docker Compose container.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Engineering-Association-UofK/association-website-frontend.git
cd association-website-frontend

# 2. Install dependencies
pnpm install
# or: npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your actual values (see below)

# 4. Start the development server
pnpm dev
# or: npm run dev
```

The app will be available at **http://localhost:5173**.

---

## 🔧 Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```env
# Primary backend API base URL (no trailing slash, no /api suffix)
VITE_API_NEW_BASE_URL_RAW="http://localhost:8000"
```

---

## 📜 Available Scripts

| Command        | Description                            |
| -------------- | -------------------------------------- |
| `pnpm dev`     | Start Vite development server with HMR |
| `pnpm build`   | Create optimized production build      |
| `pnpm preview` | Preview the production build locally   |
| `pnpm lint`    | Run ESLint across the codebase         |

---

## 🤝 Contributing

Contributions are welcome! Please read the detailed **[Contribution Guide](./contribution-guide.md)** before submitting a PR.

**Quick summary:**

1. Fork the repository and create a feature branch (`git checkout -b feature/my-feature`)
2. Follow the established patterns: services → hooks → pages
3. Keep API logic in service files, not inside components
4. Use Bootstrap components + CSS Modules for styling; avoid inline styles
5. Write clear commit messages
6. Open a pull request with a description of what changed and why

For adding a new feature module (e.g., "Events"), see the step-by-step guide in [`contribution-guide.md`](./contribution-guide.md).

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Bootstrap](https://react-bootstrap.netlify.app)
- [TanStack React Query](https://tanstack.com/query/latest)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [React Router DOM](https://reactrouter.com)

---

<div align="center">

By the **Steering Engineering Association — University of Khartoum**

</div>
