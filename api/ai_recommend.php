<?php
// Include database connection
require_once 'db_connect.php';

// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse('error', 'Invalid request method. Only POST is allowed.');
}

// Get POST data
$data = json_decode(file_get_contents("php://input"));

// Check if required fields are provided
if (!isset($data->indicator) || !isset($data->provinsi)) {
    sendResponse('error', 'Indicator and provinsi are required.');
}

// Sanitize input
$indicator = sanitize($conn, $data->indicator);
$provinsi = sanitize($conn, $data->provinsi);

// Get data for the specified indicator and province
$query = "SELECT * FROM sdgs WHERE indikator = '$indicator' AND provinsi = '$provinsi' ORDER BY tahun DESC";
$result = $conn->query($query);

// Check if query was successful
if (!$result) {
    sendResponse('error', 'Database query failed: ' . $conn->error);
}

// Fetch data
$sdgsData = [];
while ($row = $result->fetch_assoc()) {
    $sdgsData[] = $row;
}

// If no data found, return error
if (count($sdgsData) === 0) {
    sendResponse('error', 'No data found for the specified indicator and province.');
}

// Get demographic data for the province
$query = "SELECT * FROM demografi WHERE provinsi = '$provinsi' ORDER BY tahun DESC";
$result = $conn->query($query);

// Check if query was successful
if (!$result) {
    sendResponse('error', 'Database query failed: ' . $conn->error);
}

// Fetch data
$demoData = [];
while ($row = $result->fetch_assoc()) {
    $demoData[] = $row;
}

// Prepare data for AI analysis
$analysisData = [
    'indicator' => $indicator,
    'provinsi' => $provinsi,
    'sdgs_data' => $sdgsData,
    'demographic_data' => $demoData
];

// In a real application, this would call an external AI API
// For this example, we'll generate recommendations based on simple rules
$recommendations = generateRecommendations($analysisData);

// Return response with recommendations
sendResponse('success', 'Recommendations generated successfully.', $recommendations);

/**
 * Generate policy recommendations based on data analysis
 * 
 * @param array $data Analysis data
 * @return array Recommendations
 */
function generateRecommendations($data) {
    $indicator = $data['indicator'];
    $provinsi = $data['provinsi'];
    $sdgsData = $data['sdgs_data'];
    $demoData = $data['demographic_data'];
    
    // Get the most recent values
    $currentValue = isset($sdgsData[0]['nilai']) ? floatval($sdgsData[0]['nilai']) : 0;
    $currentYear = isset($sdgsData[0]['tahun']) ? intval($sdgsData[0]['tahun']) : 0;
    
    // Get previous value if available
    $previousValue = isset($sdgsData[1]['nilai']) ? floatval($sdgsData[1]['nilai']) : $currentValue;
    $previousYear = isset($sdgsData[1]['tahun']) ? intval($sdgsData[1]['tahun']) : $currentYear - 1;
    
    // Calculate trend
    $trend = $currentValue - $previousValue;
    $trendPercentage = $previousValue > 0 ? ($trend / $previousValue) * 100 : 0;
    
    // Get demographic data
    $population = isset($demoData[0]['populasi']) ? intval($demoData[0]['populasi']) : 0;
    $productivePopulation = isset($demoData[0]['populasi_produktif']) ? intval($demoData[0]['populasi_produktif']) : 0;
    $productivePercentage = isset($demoData[0]['persentase_produktif']) ? floatval($demoData[0]['persentase_produktif']) : 0;
    
    // Initialize recommendations
    $recommendations = [
        'summary' => [
            'indicator' => $indicator,
            'provinsi' => $provinsi,
            'current_value' => $currentValue,
            'current_year' => $currentYear,
            'trend' => $trend,
            'trend_percentage' => $trendPercentage,
            'population' => $population,
            'productive_population' => $productivePopulation,
            'productive_percentage' => $productivePercentage
        ],
        'status' => '',
        'trend_analysis' => '',
        'demographic_impact' => '',
        'policy_recommendations' => []
    ];
    
    // Determine status based on indicator
    switch ($indicator) {
        case 'Angka Harapan Hidup':
            if ($currentValue >= 72) {
                $recommendations['status'] = 'Baik';
            } elseif ($currentValue >= 68) {
                $recommendations['status'] = 'Sedang';
            } else {
                $recommendations['status'] = 'Perlu Perhatian';
            }
            break;
            
        case 'Rata-rata Lama Sekolah':
            if ($currentValue >= 10) {
                $recommendations['status'] = 'Baik';
            } elseif ($currentValue >= 8) {
                $recommendations['status'] = 'Sedang';
            } else {
                $recommendations['status'] = 'Perlu Perhatian';
            }
            break;
            
        case 'Tingkat Pengangguran':
            if ($currentValue <= 4) {
                $recommendations['status'] = 'Baik';
            } elseif ($currentValue <= 6) {
                $recommendations['status'] = 'Sedang';
            } else {
                $recommendations['status'] = 'Perlu Perhatian';
            }
            break;
            
        default:
            $recommendations['status'] = 'Tidak Dapat Ditentukan';
    }
    
    // Analyze trend
    if ($trend > 0) {
        if ($indicator === 'Tingkat Pengangguran') {
            $recommendations['trend_analysis'] = "Terjadi peningkatan sebesar " . number_format(abs($trendPercentage), 2) . "% dibandingkan tahun sebelumnya. Ini menunjukkan tren negatif yang perlu diatasi.";
        } else {
            $recommendations['trend_analysis'] = "Terjadi peningkatan sebesar " . number_format(abs($trendPercentage), 2) . "% dibandingkan tahun sebelumnya. Ini menunjukkan tren positif yang perlu dipertahankan.";
        }
    } elseif ($trend < 0) {
        if ($indicator === 'Tingkat Pengangguran') {
            $recommendations['trend_analysis'] = "Terjadi penurunan sebesar " . number_format(abs($trendPercentage), 2) . "% dibandingkan tahun sebelumnya. Ini menunjukkan tren positif yang perlu dipertahankan.";
        } else {
            $recommendations['trend_analysis'] = "Terjadi penurunan sebesar " . number_format(abs($trendPercentage), 2) . "% dibandingkan tahun sebelumnya. Ini menunjukkan tren negatif yang perlu diatasi.";
        }
    } else {
        $recommendations['trend_analysis'] = "Tidak ada perubahan signifikan dibandingkan tahun sebelumnya.";
    }
    
    // Analyze demographic impact
    $recommendations['demographic_impact'] = "Provinsi $provinsi memiliki populasi sebesar " . number_format($population) . " jiwa, dengan " . number_format($productivePopulation) . " jiwa ($productivePercentage%) berada pada usia produktif. ";
    
    if ($productivePercentage >= 65) {
        $recommendations['demographic_impact'] .= "Proporsi penduduk usia produktif yang tinggi ini menunjukkan potensi bonus demografi yang dapat dimanfaatkan untuk pembangunan ekonomi dan sosial.";
    } else {
        $recommendations['demographic_impact'] .= "Proporsi penduduk usia produktif masih perlu ditingkatkan untuk memaksimalkan potensi bonus demografi.";
    }
    
    // Generate policy recommendations based on indicator and status
    switch ($indicator) {
        case 'Angka Harapan Hidup':
            if ($recommendations['status'] === 'Perlu Perhatian') {
                $recommendations['policy_recommendations'] = [
                    "Meningkatkan akses dan kualitas layanan kesehatan dasar, terutama di daerah terpencil.",
                    "Memperluas cakupan asuransi kesehatan untuk seluruh penduduk.",
                    "Meningkatkan program kesehatan ibu dan anak untuk menurunkan angka kematian.",
                    "Mengembangkan program pencegahan dan penanganan penyakit tidak menular.",
                    "Meningkatkan kesadaran masyarakat tentang pola hidup sehat melalui kampanye edukasi."
                ];
            } elseif ($recommendations['status'] === 'Sedang') {
                $recommendations['policy_recommendations'] = [
                    "Meningkatkan kualitas layanan kesehatan sekunder dan tersier.",
                    "Mengoptimalkan sistem rujukan kesehatan dari tingkat primer ke sekunder dan tersier.",
                    "Memperkuat program pengendalian penyakit menular dan tidak menular.",
                    "Meningkatkan program kesehatan lansia untuk mendukung penuaan yang sehat.",
                    "Mengembangkan inovasi teknologi kesehatan untuk meningkatkan efisiensi layanan."
                ];
            } else {
                $recommendations['policy_recommendations'] = [
                    "Mempertahankan dan meningkatkan kualitas sistem kesehatan yang sudah baik.",
                    "Mengembangkan program kesehatan preventif untuk mencegah penyakit kronis.",
                    "Meningkatkan penelitian dan pengembangan di bidang kesehatan.",
                    "Mengembangkan sistem perawatan jangka panjang untuk penduduk lansia.",
                    "Menjadi model dan berbagi praktik terbaik dengan daerah lain."
                ];
            }
            break;
            
        case 'Rata-rata Lama Sekolah':
            if ($recommendations['status'] === 'Perlu Perhatian') {
                $recommendations['policy_recommendations'] = [
                    "Meningkatkan akses pendidikan dasar dan menengah, terutama di daerah terpencil.",
                    "Mengurangi angka putus sekolah melalui program bantuan pendidikan untuk keluarga miskin.",
                    "Meningkatkan kualitas infrastruktur pendidikan dasar.",
                    "Mengembangkan program pendidikan alternatif untuk anak putus sekolah.",
                    "Meningkatkan kesadaran masyarakat tentang pentingnya pendidikan."
                ];
            } elseif ($recommendations['status'] === 'Sedang') {
                $recommendations['policy_recommendations'] = [
                    "Meningkatkan transisi dari pendidikan menengah ke pendidikan tinggi.",
                    "Mengembangkan program pendidikan vokasi yang sesuai dengan kebutuhan pasar kerja.",
                    "Meningkatkan kualitas pengajaran melalui pelatihan guru.",
                    "Mengintegrasikan teknologi dalam proses pembelajaran.",
                    "Memperkuat kemitraan antara institusi pendidikan dan industri."
                ];
            } else {
                $recommendations['policy_recommendations'] = [
                    "Mengembangkan program pendidikan tinggi yang berkualitas dan relevan dengan kebutuhan global.",
                    "Meningkatkan investasi dalam penelitian dan pengembangan di institusi pendidikan.",
                    "Mengembangkan program pembelajaran sepanjang hayat untuk meningkatkan keterampilan tenaga kerja.",
                    "Memperkuat posisi sebagai pusat unggulan pendidikan di tingkat nasional dan internasional.",
                    "Mengembangkan program pertukaran pendidikan dengan daerah atau negara lain."
                ];
            }
            break;
            
        case 'Tingkat Pengangguran':
            if ($recommendations['status'] === 'Perlu Perhatian') {
                $recommendations['policy_recommendations'] = [
                    "Menciptakan lapangan kerja baru melalui investasi publik dan swasta.",
                    "Mengembangkan program pelatihan keterampilan untuk pencari kerja.",
                    "Memberikan insentif bagi usaha kecil dan menengah untuk memperluas bisnis dan menyerap tenaga kerja.",
                    "Mengembangkan sektor ekonomi padat karya.",
                    "Meningkatkan koordinasi antara institusi pendidikan dan pasar kerja."
                ];
            } elseif ($recommendations['status'] === 'Sedang') {
                $recommendations['policy_recommendations'] = [
                    "Meningkatkan kualitas angkatan kerja melalui pelatihan dan sertifikasi.",
                    "Mengembangkan program kewirausahaan untuk menciptakan lapangan kerja mandiri.",
                    "Memperkuat sistem informasi pasar kerja untuk mengurangi ketidaksesuaian keterampilan.",
                    "Mengembangkan sektor ekonomi kreatif dan digital.",
                    "Meningkatkan fleksibilitas pasar kerja melalui reformasi regulasi."
                ];
            } else {
                $recommendations['policy_recommendations'] = [
                    "Mempertahankan stabilitas ekonomi dan pasar kerja.",
                    "Meningkatkan produktivitas tenaga kerja melalui adopsi teknologi dan inovasi.",
                    "Mengembangkan sektor ekonomi bernilai tambah tinggi.",
                    "Menarik investasi asing untuk menciptakan lapangan kerja berkualitas.",
                    "Menjadi model dan berbagi praktik terbaik dengan daerah lain."
                ];
            }
            break;
            
        default:
            $recommendations['policy_recommendations'] = [
                "Mengumpulkan data yang lebih komprehensif untuk analisis lebih lanjut.",
                "Melakukan studi khusus untuk memahami faktor-faktor yang mempengaruhi indikator ini.",
                "Mengembangkan program pilot untuk menguji intervensi potensial.",
                "Meningkatkan koordinasi antar sektor terkait.",
                "Melibatkan masyarakat dalam perencanaan dan implementasi program."
            ];
    }
    
    return $recommendations;
}
?>
