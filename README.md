# Dairy Cooperative Management System

A comprehensive full-stack management system for dairy cooperatives, built with modern web technologies to streamline operations, milk collection, farmer management, and financial tracking.

## Features

### Core Functionality
- **User Management** - Multi-role authentication system (Admin, Manager, Accountant, Operator, Store Manager, Veterinarian, Farmer, Customer)
- **Farmer Portal** - Comprehensive farmer registration and profile management
- **Milk Collection** - Real-time tracking of morning and evening milk collections
- **Quality Control** - Automated quality testing with fat and SNF measurements
- **Payment Processing** - Automated payment calculations and disbursements
- **Loan Management** - Track farmer loans and repayments
- **Customer Portal** - Product browsing, shopping cart, and order management
- **Inventory Management** - Product catalog with 64+ dairy products
- **Analytics Dashboard** - Role-based dashboards with real-time insights
- **Veterinary Services** - Service booking and management system

### Technical Features
- Multi-tenant architecture with tenant isolation
- Role-based access control (RBAC)
- Real-time data synchronization
- Responsive design for mobile and desktop
- Dark mode support
- Excel export functionality
- RESTful API architecture
- Secure authentication with JWT

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Framer Motion for animations
- React Router for navigation
- Zustand for state management
- React Hot Toast for notifications
- Recharts for data visualization

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- MySQL database
- Redis for caching
- JWT authentication
- Winston for logging
- Express Validator

## Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL 8+
- Redis (optional, for caching)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/achaekevin/Dairy-co-op-management-system.git
cd Dairy-co-op-management-system
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables (see Configuration section)

5. Set up the database
```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

6. Start the development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="mysql://user:password@localhost:3306/dairy_management_db"
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=5000
```

### Frontend Environment Variables
Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Default Accounts

After seeding the database, you can log in with:

- **Admin**: admin@dairycoop.com / Admin@123
- **Manager**: manager@dairycoop.com / Manager@123
- **Accountant**: accountant@dairycoop.com / Accountant@123

## Project Structure

```
dairy-coop-management-system/
├── backend/
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── core/         # Core utilities (errors, logger, response)
│   │   ├── database/     # Database clients (Prisma, Redis)
│   │   ├── middlewares/  # Express middlewares
│   │   ├── modules/      # Feature modules
│   │   └── routes/       # API routes
│   ├── prisma/           # Database schema and migrations
│   └── logs/             # Application logs
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   ├── store/        # State management
│   │   ├── types/        # TypeScript definitions
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
└── README.md
```

## API Documentation

API documentation is available at `/api/v1/docs` when running the backend server.

Key endpoints:
- `/api/v1/auth` - Authentication
- `/api/v1/farmers` - Farmer management
- `/api/v1/customers` - Customer management
- `/api/v1/milk-collection` - Milk collection records
- `/api/v1/payments` - Payment processing
- `/api/v1/products` - Product catalog
- `/api/v1/quality` - Quality testing

## Database Schema

The system uses Prisma ORM with MySQL. Key entities include:
- Users (multi-role system)
- Farmers
- Customers
- MilkCollection
- QualityTest
- Payment
- Loan
- Product
- Order

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions, please open an issue on the GitHub repository.

## Acknowledgments

Built for dairy cooperatives in Kenya to modernize their operations and improve efficiency.
