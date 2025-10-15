<?php

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Parse the request URI
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Route API requests to our API handler
if (strpos($path, '/api/') === 0) {
    require_once __DIR__ . '/api.php';
    exit();
}

// Default response for non-API requests
header('Content-Type: application/json');
echo json_encode([
    'message' => 'RC Convergio API Server',
    'version' => '1.0.0',
    'status' => 'running'
]);
?>
