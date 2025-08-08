<?php
// Database configuration - supports both local MySQL and Supabase PostgreSQL
if (isset($_ENV['DATABASE_URL'])) {
    // Vercel deployment - use Supabase PostgreSQL
    $database_url = $_ENV['DATABASE_URL'] ?? 'postgresql://postgres:Nakia270406.@db.forgfekdtgwcejthjhcz.supabase.co:5432/postgres';
    $url = parse_url($database_url);
    
    define('DB_HOST', $url['host']);
    define('DB_NAME', ltrim($url['path'], '/'));
    define('DB_USER', $url['user']);
    define('DB_PASS', $url['pass']);
    define('DB_PORT', $url['port'] ?? 5432);
    
    $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
} else {
    // Local MAMP - use MySQL
    define('DB_HOST', 'naxx-mac.local');
    define('DB_NAME', 'thumbnail_generator');
    define('DB_USER', 'root');
    define('DB_PASS', 'Bismillah9');
    
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
}

// Database connection options
$db_options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $db_options);
} catch (PDOException $e) {
    die('Database connection failed: ' . $e->getMessage());
}
?>