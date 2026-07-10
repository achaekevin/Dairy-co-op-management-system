# Security Policy

## Reporting Security Issues

If you discover a security vulnerability, please email: security@dairycoop.com

**Do not** create public GitHub issues for security vulnerabilities.

## Recent Security Updates

### July 10, 2026 - Secret Management Improvements

**Issue:** Hardcoded passwords detected in seed file  
**Fix:** Replaced hardcoded passwords with environment variables

#### Changes Made:

1. **Seed File Security**
   - Replaced all hardcoded passwords in `backend/prisma/seed.ts`
   - Now uses `SEED_DEFAULT_PASSWORD` environment variable
   - Admin password can be set via `ADMIN_PASSWORD` env variable
   - Default fallback password: `TempPass@2026!`

2. **Environment Variables**
   - All sensitive data now uses environment variables
   - `.env` files are properly excluded from version control
   - Added comprehensive `.gitignore` rules

3. **Production Recommendations**
   - Change ALL default passwords immediately after deployment
   - Use strong, unique passwords for each user
   - Enable two-factor authentication (2FA)
   - Rotate JWT secrets regularly
   - Use secure SMTP credentials
   - Never commit `.env` files to version control

## Secure Deployment Checklist

- [ ] Change all default user passwords
- [ ] Generate unique JWT_ACCESS_SECRET (min 32 chars)
- [ ] Generate unique JWT_REFRESH_SECRET (min 32 chars)
- [ ] Generate unique SESSION_SECRET (min 32 chars)
- [ ] Configure production SMTP credentials
- [ ] Set strong database password
- [ ] Enable Redis password protection
- [ ] Configure CORS_ORIGIN for your domain only
- [ ] Enable HTTPS/TLS
- [ ] Set up regular backups
- [ ] Enable audit logging
- [ ] Configure rate limiting appropriately
- [ ] Review and restrict API access

## Environment Variables Security

### Required Environment Variables

```bash
# Database
DATABASE_URL="mysql://user:password@host:3306/database"

# JWT Secrets (MUST be changed in production)
JWT_ACCESS_SECRET="your-unique-access-secret-min-32-chars"
JWT_REFRESH_SECRET="your-unique-refresh-secret-min-32-chars"
SESSION_SECRET="your-unique-session-secret-min-32-chars"

# SMTP (use secure credentials)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-app-specific-password"

# Seed Passwords (only for development)
SEED_DEFAULT_PASSWORD="TempPass@2026!"
ADMIN_PASSWORD="YourSecureAdminPass@2026"
```

### Generating Secure Secrets

Use these commands to generate secure secrets:

```bash
# Generate random 32-character secret (Linux/Mac)
openssl rand -base64 32

# Generate random secret (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate random secret (PowerShell/Windows)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## Password Policy

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- At least one special character
- Cannot be a common password
- Cannot be the same as username/email

## Data Protection

- All passwords are hashed using bcrypt (12 rounds)
- JWT tokens expire after configured time
- Refresh tokens enable secure session extension
- Session data stored in Redis with encryption
- Database connections use SSL/TLS
- API rate limiting prevents brute force attacks

## Audit Logging

The system logs:
- All authentication attempts (success/failure)
- User creation and deletion
- Permission changes
- Financial transactions
- Data exports
- Configuration changes

## Contact

For security concerns: security@dairycoop.com  
For general support: support@dairycoop.com
