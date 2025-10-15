# RC Convergio Frontend - Cleaned Up Structure

## Overview
This directory has been cleaned up to contain only frontend files and the essential API file. All Laravel backend files have been removed while maintaining full functionality.

## What Was Removed
- `app/` - Laravel application directory
- `bootstrap/` - Laravel bootstrap files
- `config/` - Laravel configuration files
- `database/` - Laravel migrations and seeders
- `routes/` - Laravel route files
- `vendor/` - Composer dependencies
- `storage/` - Laravel storage directory
- `resources/` - Laravel resources (views, etc.)
- `artisan` - Laravel command-line tool
- `composer.json` - Composer configuration
- `composer.lock` - Composer lock file
- `router.php` - Custom router file
- `.env` - Environment configuration

## What Was Preserved
- `src/` - Vue.js frontend application
- `public/` - Public assets and API file
- `dist/` - Built frontend assets
- `node_modules/` - Node.js dependencies
- `package.json` - Node.js configuration
- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- All documentation files (`.md` files)

## API Functionality
The `public/api.php` file contains all the necessary API endpoints for:
- Contact Journey API
- SEO Tools API
- Social Media API
- Analytics API

## How to Run
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Access the application at `http://localhost:5173`

## API Endpoints
The API is available at `http://localhost:8000/api/` and includes:
- `/api/contacts/journey/{email}` - Contact journey data
- `/api/seo/*` - SEO tools endpoints
- `/api/social-media/*` - Social media management endpoints
- `/api/analytics/*` - Analytics endpoints

## Notes
- The application now runs as a pure frontend with a custom PHP API
- No database connection is required
- All data is served as mock data for demonstration purposes
- The SEO and Social Media modules are fully functional



