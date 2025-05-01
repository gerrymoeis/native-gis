<?php
// Database connection configuration
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'sdgs_dashboard';

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    header('Content-Type: application/json');
    die(json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

// Set character set
$conn->set_charset("utf8mb4");

// Function to sanitize input data
function sanitize($conn, $data) {
    return mysqli_real_escape_string($conn, trim($data));
}

// Function to handle API responses
function sendResponse($status, $message, $data = null) {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}
?>
