<?php
// Include database connection
require_once 'db_connect.php';

// Start session
session_start();

// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    sendResponse('error', 'User not logged in.');
}

// Check if request method is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse('error', 'Invalid request method. Only GET is allowed.');
}

// Get user ID from session
$user_id = $_SESSION['user_id'];

// Get report ID from query parameter if provided
$report_id = isset($_GET['id']) ? sanitize($conn, $_GET['id']) : null;

// Build query
if ($report_id) {
    // Get specific report
    $query = "SELECT * FROM reports WHERE id = '$report_id' AND user_id = '$user_id'";
} else {
    // Get all reports for user
    $query = "SELECT * FROM reports WHERE user_id = '$user_id' ORDER BY created_at DESC";
}

// Execute query
$result = $conn->query($query);

// Check if query was successful
if (!$result) {
    sendResponse('error', 'Database query failed: ' . $conn->error);
}

// Fetch data
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// Return response
sendResponse('success', 'Reports retrieved successfully', $data);
?>
