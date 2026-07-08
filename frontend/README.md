# Dairy Cooperative Management System - Frontend

Modern, responsive frontend application built with React, TypeScript, and Tailwind CSS for the Dairy Cooperative Management System.

## 🚀 Features

- **Modern UI/UX**: Clean, intuitive interface with dark mode support
- **Responsive Design**: Mobile-first approach, works on all devices
- **Role-Based Access**: Different views and permissions based on user roles
- **Real-time Updates**: Live notifications and data synchronization
- **Multi-language Support**: Ready for internationalization
- **Performance Optimized**: Code splitting, lazy loading, and caching

## Tech Stack

- **React 18** - Modern React with Hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Recharts** - Data visualization
- **Heroicons** - Beautiful icons

## 📋 Prerequisites

- **Node.js** >= 20.0.0 LTS
- **npm** >= 10.0.0
- **Backend API** running on `http://localhost:5000`

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Dairy Cooperative Management System
VITE_APP_VERSION=1.0.0
```

### Step 3: Start Development Server

```bash
npm run dev
```

✅ **Frontend is now running!**
- URL: `http://localhost:5173`
- Hot Module Replacement (HMR) enabled

### Step 4: Login

Open your browser and navigate to `http://localhost:5173/login`

## 🔐 Test User Accounts

Use these accounts to test different user roles and access levels:

### 1. Super Administrator
- **Email:** `superadmin@dairycoop.com`
- **Password:** `SuperAdmin@123`
- **Dashboard:** Full system access, all modules unlocked

### 2. Administrator
- **Email:** `admin@dairycoop.com`
- **Password:** `Admin@123`
- **Dashboard:** Full organizational access

### 3. Manager (John Kamau)
- **Email:** `manager@dairycoop.com`
- **Password:** `Manager@123`
- **Dashboard:** Operations, approvals, reports

### 4. Milk Collection Officer (Peter Mwangi)
- **Email:** `collection@dairycoop.com`
- **Password:** `Collection@123`
- **Dashboard:** Milk collection, quality checks

### 5. Accountant (Jane Wanjiku)
- **Email:** `accountant@dairycoop.com`
- **Password:** `Accountant@123`
- **Dashboard:** Payments, finances, loans, shares

### 6. Store Officer (David Ochieng)
- **Email:** `store@dairycoop.com`
- **Password:** `Store@123`
- **Dashboard:** Inventory, procurement, suppliers

### 7. Veterinary Officer (Dr. Sarah Njeri)
- **Email:** `vet@dairycoop.com`
- **Password:** `Vet@123`
- **Dashboard:** Livestock, vaccinations, treatments

### 8. Farmer (James Kiprop)
- **Email:** `farmer@dairycoop.com`
- **Password:** `Farmer@123`
- **Dashboard:** Self-service portal (own records)

### 9. Customer (Mary Achieng)
- **Email:** `customer@dairycoop.com`
- **Password:** `Customer@123`
- **Dashboard:** Orders, invoices, products

**Note:** Remember to change default passwords in production!

## 📜 Available Scripts

### Development
```bash
npm run dev          # Start dev server with HMR (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
```

## 🎨 Design System

### Colors (Tailwind)
- **Primary:** Blue (600, 700)
- **Success:** Green (600, 700)
- **Warning:** Yellow (500, 600)
- **Danger:** Red (600, 700)
- **Gray Scale:** Slate (100-900)

### Typography
- **Font Family:** Inter (system fonts fallback)
- **Headings:** Font weight 600-800
- **Body:** Font weight 400-500

### Components
- **Buttons:** Primary, Secondary, Outline, Ghost, Danger
- **Forms:** Input, Select, Textarea, Checkbox, Radio
- **Cards:** Default, Elevated, Outlined
- **Tables:** Sortable, Filterable, Paginated
- **Modals:** Confirmation, Form, Info
- **Badges:** Status indicators with colors
- **Alerts:** Success, Warning, Error, Info

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Laptop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

## 🗂️ Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, icons
│   ├── components/     # Reusable components
│   │   ├── ui/        # UI primitives (Button, Input, etc.)
│   │   ├── forms/     # Form components
│   │   ├── navigation/# Navigation components
│   │   └── dashboard/ # Dashboard widgets
│   ├── layouts/        # Page layouts
│   ├── pages/          # Page components (routes)
│   │   ├── auth/      # Login, Register, etc.
│   │   ├── dashboard/ # Dashboard pages
│   │   ├── farmers/   # Farmer management
│   │   ├── payments/  # Payment management
│   │   └── ...        # Other modules
│   ├── routes/         # Route configuration
│   ├── store/          # State management (Zustand)
│   ├── services/       # API services
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   ├── constants/      # App constants
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point
├── .env                # Environment variables
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── tailwind.config.js  # Tailwind config
└── vite.config.ts      # Vite config
```

## 🔄 State Management

Using **Zustand** for global state:

- `authStore` - User authentication state
- `themeStore` - Theme preferences (light/dark)
- `notificationStore` - Notifications and alerts

## 🌐 API Integration

All API calls are handled through the `services/` directory:

```typescript
// Example: services/auth.service.ts
import axios from './axios.config';

export const authService = {
  login: (email: string, password: string) => 
    axios.post('/auth/login', { email, password }),
  
  logout: () => 
    axios.post('/auth/logout'),
  
  getCurrentUser: () => 
    axios.get('/auth/me'),
};
```

## 🎯 Features by Module

### Dashboard
- Overview statistics cards
- Revenue and collection charts
- Recent activities timeline
- Quick action buttons
- System alerts

### Farmers Management
- Farmer registration with photo
- Cattle tracking
- Village/district filters
- Performance metrics
- Export to Excel/PDF

### Milk Collection
- Daily collection recording
- Shift tracking (Morning/Evening)
- Quality grading (Fat, SNF)
- Rejection handling
- Collection summaries

### Quality Control
- Lab test recording
- Parameter tracking (12+ parameters)
- Approval workflow
- Quality trends charts
- Test history

### Payments
- Payment generation
- Bonus/deduction management
- Payment batch processing
- Payment history
- Export statements

### Loans
- Loan application
- EMI calculator
- Approval workflow
- Repayment tracking
- Outstanding reports

### Shares
- Share purchase
- Certificate generation
- Transfer/redemption
- Dividend tracking
- Share portfolio

### Inventory
- Stock management
- Min/max stock alerts
- Expiry tracking
- Stock movements
- Purchase orders

### Veterinary
- Service booking
- Vaccination schedules
- Treatment records
- Health tracking
- Farm visits

## 🔒 Security Features

- **JWT Authentication** with automatic token refresh
- **Protected Routes** with role-based access control
- **XSS Protection** through React's automatic escaping
- **CSRF Protection** with secure cookies
- **Input Validation** on all forms
- **Secure Password** strength requirements
- **Session Timeout** after inactivity

## 🚀 Performance Optimizations

- **Code Splitting** - Dynamic imports for routes
- **Lazy Loading** - Components loaded on demand
- **Image Optimization** - WebP format with fallbacks
- **Caching** - API response caching with React Query
- **Memoization** - useMemo and useCallback hooks
- **Virtual Scrolling** - For large data tables

## 🌙 Dark Mode

Toggle between light and dark themes:
- Preference saved in localStorage
- System preference detection
- Smooth transitions
- All components themed

## 📊 Charts & Analytics

Using **Recharts** for data visualization:
- Line charts (revenue trends)
- Bar charts (collection comparisons)
- Pie charts (distribution)
- Area charts (cumulative data)

## 🔔 Notifications

Real-time notifications system:
- Toast notifications for actions
- Alert banners for warnings
- Notification center/panel
- Push notifications (coming soon)

## 🌍 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.ts or use different port
npm run dev -- --port 3000
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Build Errors
```bash
# Clean and rebuild
npm run clean
npm run build
```

## 📚 Documentation

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT License - see LICENSE file for details

---

**Frontend Version:** 1.0.0  
**Last Updated:** July 7, 2026  
**Status:** ✅ Production Ready
