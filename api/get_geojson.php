<?php
// Include database connection
require_once 'db_connect.php';

// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Check if request method is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse('error', 'Invalid request method. Only GET is allowed.');
    exit;
}

// Get query parameters
$tahun = isset($_GET['tahun']) ? sanitize($conn, $_GET['tahun']) : null;
$indikator = isset($_GET['indikator']) ? sanitize($conn, $_GET['indikator']) : null;

// Log request parameters
error_log("GeoJSON API Request - Tahun: " . ($tahun ?? 'null') . ", Indikator: " . ($indikator ?? 'null'));

// Check if database tables exist
$tables = ['demografi', 'sdgs'];
$missing_tables = [];

foreach ($tables as $table) {
    $check_table = $conn->query("SHOW TABLES LIKE '$table'");
    if ($check_table->num_rows === 0) {
        $missing_tables[] = $table;
    }
}

if (!empty($missing_tables)) {
    sendResponse('error', 'Missing database tables: ' . implode(', ', $missing_tables));
    exit;
}

// Build query to get demographic data with coordinates
$query = "SELECT d.*, s.indikator, s.nilai, s.kategori 
          FROM demografi d
          LEFT JOIN sdgs s ON d.provinsi = s.provinsi";

// Add filters if provided
if ($tahun) {
    $query .= " AND d.tahun = '$tahun'";
    
    if ($indikator) {
        $query .= " AND s.tahun = '$tahun' AND s.indikator = '$indikator'";
    }
} else {
    // Default to most recent year if not specified
    $query .= " AND d.tahun = (SELECT MAX(tahun) FROM demografi)";
    
    if ($indikator) {
        $query .= " AND s.tahun = (SELECT MAX(tahun) FROM sdgs) AND s.indikator = '$indikator'";
    }
}

// Log the query for debugging
error_log("GeoJSON API Query: $query");

// Execute query
$result = $conn->query($query);

// Check if query was successful
if (!$result) {
    sendResponse('error', 'Database query failed: ' . $conn->error);
    exit;
}

// Check if query returned any rows
if ($result->num_rows === 0) {
    sendResponse('error', 'No data found for the specified parameters');
    exit;
}

// Initialize GeoJSON structure
$geojson = [
    'type' => 'FeatureCollection',
    'features' => []
];

// Fetch data and build GeoJSON
while ($row = $result->fetch_assoc()) {
    // Skip entries without coordinates
    if (!isset($row['latitude']) || !isset($row['longitude']) || 
        $row['latitude'] == 0 || $row['longitude'] == 0) {
        continue;
    }

    // Create GeoJSON feature
    $feature = [
        'type' => 'Feature',
        'geometry' => [
            'type' => 'Point',
            'coordinates' => [(float)$row['longitude'], (float)$row['latitude']]
        ],
        'properties' => [
            'id' => $row['id'],
            'provinsi' => $row['provinsi'],
            'kabupaten' => $row['kabupaten'] ?? null,
            'populasi' => (int)$row['populasi'],
            'populasi_produktif' => (int)$row['populasi_produktif'],
            'persentase_produktif' => (float)$row['persentase_produktif'],
            'tahun' => (int)$row['tahun'],
            'indikator' => $row['indikator'] ?? null,
            'nilai' => isset($row['nilai']) ? (float)$row['nilai'] : null,
            'kategori' => $row['kategori'] ?? null
        ]
    ];

    // Add feature to collection
    $geojson['features'][] = $feature;
}

// Check if we have any features
if (empty($geojson['features'])) {
    sendResponse('error', 'No valid geographic data found');
    exit;
}

// Log the number of features
error_log("GeoJSON API Response: " . count($geojson['features']) . " features generated");

// Return GeoJSON
echo json_encode($geojson);
?>
