<?php
// Start session
session_start();

// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Check if user is logged in
if (isset($_SESSION['user_id'])) {
    // Return user data
    echo json_encode([
        'status' => 'success',
        'message' => 'User is logged in.',
        'data' => [
            'user_id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'role' => $_SESSION['role']
        ]
    ]);
} else {
    // Return error response
    echo json_encode([
        'status' => 'error',
        'message' => 'User is not logged in.'
    ]);
}
?>
