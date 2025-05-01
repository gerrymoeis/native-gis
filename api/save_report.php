<?php
// Include database connection
require_once 'db_connect.php';

// Start session
session_start();

// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    sendResponse('error', 'User not logged in.');
}

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse('error', 'Invalid request method. Only POST is allowed.');
}

// Get POST data
$data = json_decode(file_get_contents("php://input"));

// Check if required fields are provided
if (!isset($data->title) || !isset($data->content) || !isset($data->format)) {
    sendResponse('error', 'Title, content, and format are required.');
}

// Sanitize input
$title = sanitize($conn, $data->title);
$description = isset($data->description) ? sanitize($conn, $data->description) : '';
$content = sanitize($conn, $data->content);
$format = sanitize($conn, $data->format);
$user_id = $_SESSION['user_id'];

// Insert report into database
$query = "INSERT INTO reports (user_id, title, description, content, format) 
          VALUES ('$user_id', '$title', '$description', '$content', '$format')";

$result = $conn->query($query);

// Check if query was successful
if (!$result) {
    sendResponse('error', 'Failed to save report: ' . $conn->error);
}

// Get the ID of the newly created report
$report_id = $conn->insert_id;

// Return success response with report ID
sendResponse('success', 'Report saved successfully.', ['report_id' => $report_id]);
?>
