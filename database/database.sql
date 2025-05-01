-- Database creation
CREATE DATABASE IF NOT EXISTS sdgs_dashboard;
USE sdgs_dashboard;

-- Table for demographic data
CREATE TABLE IF NOT EXISTS demografi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provinsi VARCHAR(100) NOT NULL,
    kabupaten VARCHAR(100),
    populasi INT,
    populasi_produktif INT,
    persentase_produktif DECIMAL(5,2),
    tahun INT,
    latitude FLOAT,
    longitude FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for SDGs indicators
CREATE TABLE IF NOT EXISTS sdgs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    indikator VARCHAR(255) NOT NULL,
    kategori VARCHAR(100),
    nilai DECIMAL(10,2),
    tahun INT,
    provinsi VARCHAR(100),
    kabupaten VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for saved reports
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content LONGTEXT,
    format ENUM('pdf', 'excel', 'json') DEFAULT 'pdf',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample data for provinces
INSERT INTO demografi (provinsi, populasi, populasi_produktif, persentase_produktif, tahun, latitude, longitude) VALUES
('Aceh', 5274871, 3428666, 65.00, 2023, 4.695135, 96.749397),
('Sumatera Utara', 14799361, 9767578, 66.00, 2023, 2.1153547, 99.5450974),
('DKI Jakarta', 10562088, 7287841, 69.00, 2023, -6.2087634, 106.845599),
('Jawa Barat', 48683861, 32982231, 67.75, 2023, -6.8898362, 107.6400872),
('Jawa Tengah', 34552500, 22803650, 66.00, 2023, -7.1562833, 110.1895416),
('Jawa Timur', 39698631, 26193296, 66.00, 2023, -7.5360639, 112.2384017),
('Bali', 4317404, 2892961, 67.00, 2023, -8.4095178, 115.188916);

-- Sample data for SDGs indicators
INSERT INTO sdgs (indikator, kategori, nilai, tahun, provinsi) VALUES
('Angka Harapan Hidup', 'Kesehatan', 71.5, 2023, 'DKI Jakarta'),
('Angka Harapan Hidup', 'Kesehatan', 70.2, 2023, 'Jawa Barat'),
('Angka Harapan Hidup', 'Kesehatan', 69.8, 2023, 'Jawa Tengah'),
('Angka Harapan Hidup', 'Kesehatan', 70.1, 2023, 'Jawa Timur'),
('Angka Harapan Hidup', 'Kesehatan', 72.3, 2023, 'Bali'),
('Rata-rata Lama Sekolah', 'Pendidikan', 11.2, 2023, 'DKI Jakarta'),
('Rata-rata Lama Sekolah', 'Pendidikan', 9.8, 2023, 'Jawa Barat'),
('Rata-rata Lama Sekolah', 'Pendidikan', 8.9, 2023, 'Jawa Tengah'),
('Rata-rata Lama Sekolah', 'Pendidikan', 9.1, 2023, 'Jawa Timur'),
('Rata-rata Lama Sekolah', 'Pendidikan', 10.2, 2023, 'Bali'),
('Tingkat Pengangguran', 'Ketenagakerjaan', 6.2, 2023, 'DKI Jakarta'),
('Tingkat Pengangguran', 'Ketenagakerjaan', 7.5, 2023, 'Jawa Barat'),
('Tingkat Pengangguran', 'Ketenagakerjaan', 5.8, 2023, 'Jawa Tengah'),
('Tingkat Pengangguran', 'Ketenagakerjaan', 5.3, 2023, 'Jawa Timur'),
('Tingkat Pengangguran', 'Ketenagakerjaan', 3.8, 2023, 'Bali');

-- Sample admin user
INSERT INTO users (username, password, email, role) VALUES
('admin', '$2y$10$8tGmGPvlG.jHVt2b.QDh5.U7HhJ/VYP1cYdQZH5KLNlr0lPCivXd.', 'admin@sdgs-dashboard.id', 'admin');
