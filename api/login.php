<?php
// Include database connection
require_once 'db_connect.php';

// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Start session
session_start();

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse('error', 'Invalid request method. Only POST is allowed.');
}

// Get POST data
$data = json_decode(file_get_contents("php://input"));

// Check if username and password are provided
if (!isset($data->username) || !isset($data->password)) {
    sendResponse('error', 'Username and password are required.');
}

// Sanitize input
$username = sanitize($conn, $data->username);
$password = $data->password;

// Query to check if user exists
$query = "SELECT * FROM users WHERE username = '$username'";
$result = $conn->query($query);

// Check if query was successful
if (!$result) {
    sendResponse('error', 'Database query failed: ' . $conn->error);
}

// Check if user exists
if ($result->num_rows === 0) {
    sendResponse('error', 'Invalid username or password.');
}

// Get user data
$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password'])) {
    sendResponse('error', 'Invalid username or password.');
}

// Set session variables
$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];
$_SESSION['role'] = $user['role'];

// Return user data (excluding password)
unset($user['password']);
sendResponse('success', 'Login successful.', $user);
?>
