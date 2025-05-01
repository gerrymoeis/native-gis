<?php
// Include database connection
require_once 'db_connect.php';

// Start session
session_start();

// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    sendResponse('error', 'User not logged in.');
}

// Check if request method is DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendResponse('error', 'Invalid request method. Only DELETE is allowed.');
}

// Get report ID from query parameter
if (!isset($_GET['id'])) {
    sendResponse('error', 'Report ID is required.');
}

// Sanitize input
$report_id = sanitize($conn, $_GET['id']);
$user_id = $_SESSION['user_id'];

// Check if report exists and belongs to user
$query = "SELECT * FROM reports WHERE id = '$report_id' AND user_id = '$user_id'";
$result = $conn->query($query);

if (!$result || $result->num_rows === 0) {
    sendResponse('error', 'Report not found or does not belong to user.');
}

// Delete report
$query = "DELETE FROM reports WHERE id = '$report_id' AND user_id = '$user_id'";
$result = $conn->query($query);

// Check if query was successful
if (!$result) {
    sendResponse('error', 'Failed to delete report: ' . $conn->error);
}

// Return success response
sendResponse('success', 'Report deleted successfully.');
?>
