# Native GIS - SDGs Dashboard Indonesia

Aplikasi visualisasi data GIS untuk Sustainable Development Goals (SDGs) dan bonus demografi Indonesia.

![Native GIS Preview](public/images/preview.png)

## Fitur Utama

- **Visualisasi GIS**: Menampilkan data demografi dan indikator SDGs pada peta interaktif Indonesia
- **Analisis Tren**: Visualisasi tren indikator SDGs dari waktu ke waktu
- **Rekomendasi Kebijakan**: Generasi rekomendasi kebijakan berdasarkan data
- **Laporan**: Pembuatan dan penyimpanan laporan kustom

## Teknologi

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: PHP
- **Database**: MySQL
- **Peta**: Leaflet.js dengan OpenStreetMap
- **Visualisasi Data**: Chart.js

## Instalasi

### Prasyarat

- PHP 7.4 atau lebih tinggi
- MySQL 5.7 atau lebih tinggi
- Web server (Apache, Nginx, dll)

### Langkah Instalasi

1. Clone repository ini:
   ```bash
   git clone https://github.com/username/native-gis.git
   cd native-gis
   ```

2. Import database:
   ```bash
   mysql -u username -p < database/database.sql
   ```

3. Import data dummy (opsional):
   ```bash
   mysql -u username -p sdgs_dashboard < database/dummy_data.sql
   ```

4. Konfigurasi database:
   - Edit file `api/db_connect.php` sesuai dengan konfigurasi database Anda

5. Jalankan aplikasi:
   - Jika menggunakan PHP built-in server:
     ```bash
     php -S localhost:8000
     ```
   - Atau akses melalui web server Anda

## Penggunaan

1. Buka aplikasi di browser
2. Navigasi ke halaman "Peta GIS" untuk melihat visualisasi data pada peta
3. Gunakan filter tahun dan indikator untuk menyesuaikan data yang ditampilkan
4. Jelajahi halaman "Analisis" untuk melihat tren data dari waktu ke waktu
5. Buat dan simpan laporan di halaman "Laporan"

## Struktur Proyek

```
native-gis/
├── api/                  # Backend API endpoints
│   ├── db_connect.php    # Database connection
│   ├── get_geojson.php   # GeoJSON data API
│   └── ...
├── database/             # Database scripts
│   ├── database.sql      # Schema
│   └── dummy_data.sql    # Sample data
├── public/               # Frontend files
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   ├── images/           # Images and assets
│   └── index.html        # Main HTML file
└── README.md             # Documentation
```

## Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau buka issue untuk diskusi.

## Lisensi

[MIT License](LICENSE)

## Kontak

Untuk pertanyaan atau dukungan, silakan hubungi [email@example.com](mailto:email@example.com).
