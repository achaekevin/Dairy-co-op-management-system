-- =====================================================
-- Dairy Cooperative Management System - Database Setup
-- =====================================================
-- This script creates the MySQL database for the system
-- Database: dairy_management_db
-- Password: NewSecurePassword2026!
-- =====================================================

-- Drop database if exists (WARNING: This will delete all data)
DROP DATABASE IF EXISTS dairy_management_db;

-- Create the database
CREATE DATABASE dairy_management_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Use the database
USE dairy_management_db;

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. This script only creates the database
-- 2. All tables will be created by Prisma migrations
-- 3. To complete setup, run:
--    - Update .env file with: DATABASE_URL="mysql://root:NewSecurePassword2026!@localhost:3306/dairy_management_db"
--    - Run: npx prisma migrate deploy
--    - Run: npm run prisma:seed (optional)
--
-- 4. The Prisma schema already defines 20+ tables:
--    - tenants, users, farmers, milk_collections
--    - quality_tests, payments, loans, shares
--    - inventory_items, suppliers, purchase_orders
--    - customers, vehicles, employees, meetings
--    - And supporting tables for auth, sessions, audit logs
--
-- 5. All tables will have:
--    - UUID primary keys
--    - Soft deletes (deletedAt)
--    - Timestamps (createdAt, updatedAt)
--    - Multi-tenant isolation (tenantId)
--    - Proper indexes and foreign keys
-- =====================================================

SELECT 'Database dairy_management_db created successfully!' as Status;
SELECT 'Run Prisma migrations to create all tables' as NextStep;
