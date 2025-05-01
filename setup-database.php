<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database connection configuration
$host = 'localhost';
$user = 'root';
$pass = '';

// Create connection
$conn = new mysqli($host, $user, $pass);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "<h1>Database Setup for Native GIS Application</h1>";

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS sdgs_dashboard";
if ($conn->query($sql) === TRUE) {
    echo "<p>Database created successfully or already exists.</p>";
} else {
    die("Error creating database: " . $conn->error);
}

// Select database
$conn->select_db("sdgs_dashboard");

// Read database.sql and extract CREATE TABLE statements only
$dbSql = file_get_contents('database/database.sql');
if ($dbSql === false) {
    die("Error reading database.sql file.");
}

// Extract only CREATE TABLE statements using regex
preg_match_all('/CREATE TABLE IF NOT EXISTS.*?;/s', $dbSql, $matches);
$createStatements = $matches[0];

echo "<h2>Creating tables...</h2>";
echo "<ul>";

foreach ($createStatements as $statement) {
    if (!empty($statement)) {
        if ($conn->query($statement) === TRUE) {
            // Extract table name from CREATE TABLE statement
            if (preg_match('/CREATE TABLE IF NOT EXISTS (\w+)/', $statement, $matches)) {
                echo "<li>Table '{$matches[1]}' created successfully.</li>";
            }
        } else {
            echo "<li style='color: red;'>Error executing statement: " . $conn->error . "</li>";
        }
    }
}

echo "</ul>";

// Check if dummy data already exists
$result = $conn->query("SELECT COUNT(*) as count FROM demografi");
if ($result) {
    $row = $result->fetch_assoc();
    $dataExists = $row['count'] > 0;
} else {
    $dataExists = false;
}

// Import dummy data if it doesn't exist
echo "<h2>Importing dummy data...</h2>";

if ($dataExists) {
    echo "<p>Dummy data already exists. Skipping import.</p>";
} else {
    $dummySql = file_get_contents('database/dummy_data.sql');
    if ($dummySql === false) {
        die("Error reading dummy_data.sql file.");
    }
    
    // Split SQL statements
    $statements = explode(';', $dummySql);
    
    echo "<ul>";
    $dataImported = 0;
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement)) {
            if ($conn->query($statement) === TRUE) {
                $dataImported++;
            } else {
                echo "<li style='color: red;'>Error importing data: " . $conn->error . "</li>";
            }
        }
    }
    
    echo "<li>Successfully imported {$dataImported} data records.</li>";
    echo "</ul>";
}

// Create a test admin user if it doesn't exist
$checkUser = $conn->query("SELECT COUNT(*) as count FROM users WHERE username = 'admin'");
$row = $checkUser->fetch_assoc();

if ($row['count'] == 0) {
    $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
    $insertUser = $conn->query("INSERT INTO users (username, password, email, role) VALUES ('admin', '{$hashedPassword}', 'admin@example.com', 'admin')");
    
    if ($insertUser) {
        echo "<p>Created test admin user (username: admin, password: admin123)</p>";
    } else {
        echo "<p style='color: red;'>Failed to create test admin user: " . $conn->error . "</p>";
    }
} else {
    echo "<p>Test admin user already exists.</p>";
}

// Verify data
echo "<h2>Verifying data...</h2>";
echo "<ul>";

$tables = ['demografi', 'sdgs', 'users'];
foreach ($tables as $table) {
    $result = $conn->query("SELECT COUNT(*) as count FROM {$table}");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "<li>Table '{$table}' contains {$row['count']} records.</li>";
    } else {
        echo "<li style='color: red;'>Error checking table '{$table}': " . $conn->error . "</li>";
    }
}

echo "</ul>";

echo "<h2>Testing GeoJSON API</h2>";
echo "<p>Testing API endpoint: <a href='api/get_geojson.php?tahun=2023&indikator=populasi' target='_blank'>api/get_geojson.php?tahun=2023&indikator=populasi</a></p>";

// Test API
$apiUrl = 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/api/get_geojson.php?tahun=2023&indikator=populasi';
$apiResponse = @file_get_contents($apiUrl);

if ($apiResponse === false) {
    echo "<p style='color: red;'>Failed to fetch GeoJSON data from API.</p>";
    echo "<p>Error details: " . error_get_last()['message'] . "</p>";
} else {
    $geojson = json_decode($apiResponse, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "<p style='color: red;'>Failed to parse GeoJSON response: " . json_last_error_msg() . "</p>";
        echo "<p>Raw response: " . htmlspecialchars(substr($apiResponse, 0, 500)) . "...</p>";
    } else {
        $featureCount = count($geojson['features'] ?? []);
        
        if ($featureCount > 0) {
            echo "<p style='color: green;'>Successfully retrieved GeoJSON with {$featureCount} features.</p>";
        } else {
            echo "<p style='color: red;'>GeoJSON contains no features. Check your data.</p>";
            echo "<p>Response: " . htmlspecialchars(json_encode($geojson, JSON_PRETTY_PRINT)) . "</p>";
        }
    }
}

echo "<h2>Next Steps</h2>";
echo "<ol>";
echo "<li>Go to <a href='index.php'>Main Application</a></li>";
echo "<li>Navigate to the GIS Map page</li>";
echo "<li>Verify that the map loads correctly with data points</li>";
echo "</ol>";

// Close connection
$conn->close();
?>

<style>
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #0F172A;
        color: #F8FAFC;
        padding: 20px;
        line-height: 1.6;
        max-width: 800px;
        margin: 0 auto;
    }
    h1, h2 {
        color: #4F46E5;
        border-bottom: 1px solid #334155;
        padding-bottom: 10px;
    }
    ul, ol {
        background-color: rgba(30, 41, 59, 0.7);
        padding: 15px 15px 15px 40px;
        border-radius: 8px;
        border: 1px solid #334155;
    }
    p {
        background-color: rgba(30, 41, 59, 0.7);
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #334155;
    }
    a {
        color: #EC4899;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
</style>
