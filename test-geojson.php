<?php
// Set headers
header('Content-Type: text/html');
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test GeoJSON API</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0F172A;
            color: #F8FAFC;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: rgba(30, 41, 59, 0.7);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #334155;
        }
        h1 {
            color: #4F46E5;
            border-bottom: 1px solid #334155;
            padding-bottom: 10px;
        }
        pre {
            background-color: #1E293B;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            border: 1px solid #334155;
        }
        .status {
            margin-top: 20px;
            padding: 10px;
            border-radius: 5px;
        }
        .success {
            background-color: rgba(16, 185, 129, 0.2);
            border: 1px solid #10B981;
        }
        .error {
            background-color: rgba(239, 68, 68, 0.2);
            border: 1px solid #EF4444;
        }
        .test-section {
            margin-bottom: 30px;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #4F46E5, #EC4899);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Test GeoJSON API</h1>
        
        <div class="test-section">
            <h2>Database Connection</h2>
            <?php
            // Test database connection
            require_once 'api/db_connect.php';
            
            if ($conn->connect_error) {
                echo '<div class="status error">Database connection failed: ' . $conn->connect_error . '</div>';
            } else {
                echo '<div class="status success">Database connection successful!</div>';
            }
            ?>
        </div>
        
        <div class="test-section">
            <h2>Data Availability</h2>
            <?php
            // Check if tables exist and have data
            $tables = ['demografi', 'sdgs'];
            $tableStatus = [];
            
            foreach ($tables as $table) {
                $query = "SELECT COUNT(*) as count FROM $table";
                $result = $conn->query($query);
                
                if (!$result) {
                    $tableStatus[$table] = [
                        'exists' => false,
                        'count' => 0,
                        'error' => $conn->error
                    ];
                } else {
                    $row = $result->fetch_assoc();
                    $tableStatus[$table] = [
                        'exists' => true,
                        'count' => $row['count'],
                        'error' => null
                    ];
                }
            }
            
            foreach ($tableStatus as $table => $status) {
                echo '<h3>Table: ' . $table . '</h3>';
                
                if (!$status['exists']) {
                    echo '<div class="status error">Table does not exist or cannot be accessed: ' . $status['error'] . '</div>';
                } else {
                    if ($status['count'] > 0) {
                        echo '<div class="status success">Table exists and contains ' . $status['count'] . ' records.</div>';
                    } else {
                        echo '<div class="status error">Table exists but contains no data.</div>';
                    }
                }
            }
            ?>
        </div>
        
        <div class="test-section">
            <h2>GeoJSON API Test</h2>
            <?php
            // Test GeoJSON API
            $apiUrl = 'api/get_geojson.php?tahun=2023&indikator=populasi';
            $apiResponse = @file_get_contents($apiUrl);
            
            if ($apiResponse === false) {
                echo '<div class="status error">Failed to fetch GeoJSON data from API.</div>';
            } else {
                $geojson = json_decode($apiResponse, true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    echo '<div class="status error">Failed to parse GeoJSON response: ' . json_last_error_msg() . '</div>';
                } else {
                    $featureCount = count($geojson['features'] ?? []);
                    
                    if ($featureCount > 0) {
                        echo '<div class="status success">Successfully retrieved GeoJSON with ' . $featureCount . ' features.</div>';
                    } else {
                        echo '<div class="status error">GeoJSON contains no features. Check your data.</div>';
                    }
                    
                    echo '<h3>Sample GeoJSON Response:</h3>';
                    echo '<pre>' . htmlspecialchars(json_encode($geojson, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) . '</pre>';
                }
            }
            ?>
        </div>
        
        <div class="test-section">
            <h2>Next Steps</h2>
            <p>If all tests pass, your GeoJSON API is working correctly. If you're still having issues with the map display, check:</p>
            <ol>
                <li>JavaScript console for any errors</li>
                <li>Network tab in developer tools to ensure GeoJSON is being loaded</li>
                <li>CSS styling for the map container</li>
                <li>Leaflet.js initialization in map.js</li>
            </ol>
            
            <a href="index.php" class="btn">Return to Main Application</a>
        </div>
    </div>
</body>
</html>
