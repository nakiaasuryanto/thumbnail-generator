<?php
// Simple router for API endpoints
$path = $_GET['path'] ?? '';

if ($path === 'templates' || empty($path)) {
    require_once 'templates.php';
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
}
?>