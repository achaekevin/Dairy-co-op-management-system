# DairyCoop Management System - Frontend

A modern, production-ready frontend for managing dairy cooperative operations built with React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS
- **Authentication**: Complete auth flow with login, forgot password, and JWT management
- **Dashboard**: Real-time stats, charts, and analytics
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: System-aware theme switching
- **State Management**: Zustand for lightweight global state
- **API Integration**: Axios with interceptors for auth and error handling
- **Form Management**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Recharts for data visualization
- **Type Safety**: Full TypeScript coverage

## 📦 Tech Stack

- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: React Icons (Heroicons v2)
- **Date Handling**: Day.js
- **Notifications**: React Hot Toast

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=DairyCoop Management System
VITE_APP_VERSION=1.0.0
```

## 📁 Project Structure

```
src/
├── app/                    # App-level configuration
├── assets/                 # Static assets (images, icons, logos)
├── components/             # Reusable components
│   ├── cards/             # Card components
│   ├── charts/            # Chart components
│   ├── common/            # Common components
│   ├── feedback/          # Feedback components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   ├── navigation/        # Navigation components
│   ├── tables/            # Table components
│   └── ui/                # UI primitives
├── constants/             # Constants and configurations
├── contexts/              # React contexts
├── features/              # Feature modules
├── hooks/                 # Custom hooks
├── layouts/               # Page layouts
│   ├── AuthLayout/        # Authentication layout
│   ├── DashboardLayout/   # Dashboard layout
│   └── BlankLayout/       # Blank layout
├── pages/                 # Page components
│   ├── auth/              # Auth pages
│   ├── dashboard/         # Dashboard pages
│   └── errors/            # Error pages
├── providers/             # Context providers
├── routes/                # Route configuration
├── services/              # API services
├── store/                 # Zustand stores
├── styles/                # Global styles
├── types/                 # TypeScript types
├── utils/                 # Utility functions
├── App.tsx               # Root component
├── main.tsx              # Entry point
└── index.css             # Global CSS
```

## 🎨 Design System

### Colors
- **Primary**: Green (Agricultural theme)
- **Secondary**: Blue
- **Accent**: Amber
- **Neutral**: Slate

### Components
All components follow consistent design patterns:
- Fully typed with TypeScript
- Support for light/dark themes
- Responsive by default
- Accessible (WCAG 2.2 AA)
- Animated with Framer Motion

## 🔐 Authentication

The app includes a complete authentication system:

- **Login Page**: Email/password authentication
- **Forgot Password**: Password reset flow
- **Protected Routes**: Route guards for authenticated users
- **JWT Management**: Token refresh and storage
- **Auto Logout**: On token expiration

### Demo Credentials
- **Email**: admin@dairycoop.com
- **Password**: password123

## 🎯 Available Routes

- `/` - Redirects to dashboard
- `/login` - Login page
- `/forgot-password` - Forgot password page
- `/dashboard` - Main dashboard (protected)
- `/dashboard/*` - All feature pages (protected)
- `*` - 404 Not Found page

## 🧪 Development

```bash
# Run development server
npm run dev

# Type check
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌙 Theme Support

The application supports three theme modes:
- **Light Mode**: Default light theme
- **Dark Mode**: Dark theme
- **System**: Follows OS preference

Theme is persisted in localStorage and syncs across tabs.

## 🚧 Roadmap

Phase 1 (Complete) ✅:
- Project setup and architecture
- Authentication system
- Dashboard layout with sidebar and header
- Responsive navigation
- Theme switching
- Basic dashboard with stats and charts

Phase 2 (Next):
- Farmer Management module
- Milk Collection module
- Payment module
- Quality management
- Loan management

Phase 3:
- Inventory system
- Fleet management
- HR module
- Accounting module
- Reports and analytics

## 📄 License

This project is proprietary software for dairy cooperative management.

## 👨‍💻 Development Team

Built with ❤️ for dairy cooperatives worldwide.

---

**Version**: 1.0.0  
**Last Updated**: July 2026
