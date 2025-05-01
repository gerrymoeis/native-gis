<?php
// Include database connection
require_once 'db_connect.php';

// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Check if request method is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse('error', 'Invalid request method. Only GET is allowed.');
}

// Get query parameters
$tahun = isset($_GET['tahun']) ? sanitize($conn, $_GET['tahun']) : null;
$provinsi = isset($_GET['provinsi']) ? sanitize($conn, $_GET['provinsi']) : null;

// Build query
$query = "SELECT * FROM demografi WHERE 1=1";

// Add filters if provided
if ($tahun) {
    $query .= " AND tahun = '$tahun'";
}
if ($provinsi) {
    $query .= " AND provinsi = '$provinsi'";
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
sendResponse('success', 'Data retrieved successfully', $data);
?>
