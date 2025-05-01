<?php
// Start session
session_start();

// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Destroy session
session_unset();
session_destroy();

// Return success response
echo json_encode([
    'status' => 'success',
    'message' => 'Logout successful.'
]);
?>
