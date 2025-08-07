# Thumbnail Generator - Database Setup

## 🚀 Setup Instructions

### 1. Database Setup
```sql
-- Run this SQL to create the database and table
mysql -u root -p < database.sql
```

### 2. Configure Database Connection
Edit `config/database.php` with your database credentials:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'thumbnail_generator');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

### 3. File Structure
```
thumbnail-gen/
├── index.php              # Main application (converted from HTML)
├── config/
│   └── database.php       # Database configuration
├── includes/
│   └── Database.php       # Database helper class
├── api/
│   └── templates.php      # API endpoints for template CRUD
├── database.sql           # Database schema
└── README.md             # This file
```

### 4. Features
✅ **Database Storage** - Templates saved to MySQL database  
✅ **API Endpoints** - RESTful API for template management  
✅ **Error Handling** - Comprehensive error handling and validation  
✅ **Security** - Prepared statements to prevent SQL injection  

### 5. API Endpoints
- **GET** `/api/templates.php` - Get all templates
- **GET** `/api/templates.php?id=1` - Get single template
- **POST** `/api/templates.php` - Create new template
- **PUT** `/api/templates.php` - Update template
- **DELETE** `/api/templates.php?id=1` - Delete template

### 6. Requirements
- PHP 7.4+
- MySQL 5.7+
- Web server (Apache/Nginx)

### 7. Installation
1. Upload all files to your web server
2. Create database using `database.sql`
3. Configure database credentials in `config/database.php`
4. Access `index.php` in your browser

## 🎨 Usage
The application now saves templates to database instead of browser localStorage. All existing functionality remains the same but with persistent storage!