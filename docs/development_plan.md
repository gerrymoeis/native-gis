# Rencana Pengembangan: SDGs Dashboard untuk Bonus Demografi Indonesia

Proyek ini dikembangkan dengan pendekatan native web development, menggunakan HTML, CSS, JavaScript, PHP, dan MySQL (via XAMPP). Rencana ini mencakup langkah-langkah konkrit dari setup lingkungan hingga deployment, dengan tujuan menjaga fitur dan konsep proyek semaksimal mungkin.

---

## Langkah 1: Setup Lingkungan Pengembangan ✅
- **Instal XAMPP**: Unduh dan instal XAMPP untuk menjalankan server Apache dan database MySQL secara lokal.  
  - Website resmi: [XAMPP](https://www.apachefriends.org)  
- **Buat Direktori Proyek**: Buat folder baru, misalnya `sdgs-dashboard`, sebagai direktori utama proyek. ✅ 
- **Struktur Folder**: Di dalam `sdgs-dashboard`, buat subfolder: ✅ 
  - `public/` untuk file frontend (HTML, CSS, JS, aset). ✅ 
  - `api/` untuk file backend (PHP). ✅ 

---

## Langkah 2: Desain Database ✅
- **Rancang Skema Database**: Tentukan tabel untuk data demografi dan SDGs. ✅ 
  - Contoh tabel `demografi`:  
    ```sql
    CREATE TABLE demografi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        provinsi VARCHAR(100),
        kabupaten VARCHAR(100),
        populasi INT,
        latitude FLOAT,
        longitude FLOAT
    );
    ```  
  - Contoh tabel `sdgs`:  
    ```sql
    CREATE TABLE sdgs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        indikator VARCHAR(255),
        nilai DECIMAL,
        tahun INT,
        provinsi VARCHAR(100)
    );
    ```  
- **Buat File `database.sql`**: Simpan skema dan data awal untuk pengujian. ✅ 

---

## Langkah 3: Pengembangan Backend (PHP) ✅
- **Koneksi Database**: Buat file `db_connect.php` di folder `api/` untuk menghubungkan ke MySQL. ✅ 
  ```php
  <?php
  $host = 'localhost';
  $user = 'root';
  $pass = '';
  $db = 'sdgs_dashboard';
  $conn = new mysqli($host, $user, $pass, $db);
  if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
  }
  ?>
  ```  
- **Endpoint API**: Buat file PHP untuk setiap endpoint, misalnya: ✅ 
  - `get_demografi.php`: Mengambil data demografi. ✅ 
  - `get_sdgs.php`: Mengambil data SDGs. ✅ 
  - `get_geojson.php`: Mengonversi data spasial ke GeoJSON. ✅ 
- **Autentikasi**: Implementasikan login berbasis sesi di `login.php`. ✅ 

---

## Langkah 4: Pengembangan Frontend (HTML, CSS, JS) ✅
- **Struktur HTML**: Buat `index.html` di folder `public/` dengan layout dasar (header, sidebar, konten). ✅ 
- **Styling CSS**: Tambahkan `style.css` untuk desain responsif. ✅ 
- **Interaksi JS**: Buat `script.js` untuk event listeners dan pemanggilan API via `fetch()`. ✅ 

---

## Langkah 5: Integrasi GIS dan Visualisasi Data ✅
- **Peta GIS**: Integrasikan Leaflet.js di `index.html` untuk menampilkan peta interaktif. ✅ 
- **Grafik Data**: Gunakan Chart.js untuk visualisasi statistik di halaman analisis. ✅ 

---

## Langkah 6: Integrasi AI (Opsional) ✅
- **Pemanggilan API AI**: Buat `ai_recommend.php` untuk mengirim data ke API AI dan memproses respons. ✅
- **Tampilan Frontend**: Tampilkan rekomendasi di halaman khusus. ✅

---

## Langkah 7: Pengujian
- **Uji Frontend**: Verifikasi interaksi pengguna dan visualisasi data.  
- **Uji Backend**: Pastikan endpoint API mengembalikan data yang benar.  
- **Uji Integrasi**: Cek alur data dari database ke frontend.  

---

## Langkah 8: Deployment
- **Pilih Hosting**: Gunakan shared hosting yang mendukung PHP dan MySQL.  
- **Upload File**: Unggah folder `public/` dan `api/` ke direktori hosting.  
- **Konfigurasi Database**: Buat database di hosting dan impor `database.sql`.  
- **Uji Produksi**: Akses aplikasi via URL hosting untuk memastikan berfungsi.  

---

Rencana ini memastikan pengembangan proyek tetap pada jalur yang terstruktur dan sesuai dengan pendekatan native yang diinginkan.