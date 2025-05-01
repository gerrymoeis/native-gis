<?php
// Include database connection
require_once 'db_connect.php';

// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse('error', 'Invalid request method. Only POST is allowed.');
}

// Get POST data
$data = json_decode(file_get_contents("php://input"));

// Check if required fields are provided
if (!isset($data->username) || !isset($data->password) || !isset($data->email)) {
    sendResponse('error', 'Username, password, and email are required.');
}

// Sanitize input
$username = sanitize($conn, $data->username);
$email = sanitize($conn, $data->email);
$password = password_hash($data->password, PASSWORD_DEFAULT); // Hash password

// Check if username already exists
$query = "SELECT * FROM users WHERE username = '$username'";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    sendResponse('error', 'Username already exists.');
}

// Check if email already exists
$query = "SELECT * FROM users WHERE email = '$email'";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    sendResponse('error', 'Email already exists.');
}

// Insert new user
$query = "INSERT INTO users (username, password, email) VALUES ('$username', '$password', '$email')";
$result = $conn->query($query);

// Check if query was successful
if (!$result) {
    sendResponse('error', 'Registration failed: ' . $conn->error);
}

// Return success response
sendResponse('success', 'Registration successful. You can now login.');
?>
