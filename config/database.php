<?php
// Database configuration
define('DB_HOST', $_ENV['DB_HOST'] ?? 'naxx-mac.local');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'thumbnail_generator');
define('DB_USER', $_ENV['DB_USER'] ?? 'root');
define('DB_PASS', $_ENV['DB_PASS'] ?? 'Bismillah9');
define('DB_CHARSET', 'utf8mb4');

// Database connection options
$db_options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $db_options);
} catch (PDOException $e) {
    die('Database connection failed: ' . $e->getMessage());
}
?>