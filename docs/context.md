# Konteks Proyek: SDGs Dashboard untuk Bonus Demografi Indonesia

## Latar Belakang
Indonesia diproyeksikan mencapai puncak bonus demografi pada tahun 2045, saat proporsi penduduk usia produktif (15-64 tahun) akan mendominasi. Bonus demografi ini menawarkan peluang besar untuk pembangunan ekonomi dan sosial, namun juga menuntut perencanaan strategis agar potensinya dapat dimanfaatkan secara optimal. Untuk itu, pemantauan indikator Sustainable Development Goals (SDGs) seperti kesehatan, pendidikan, dan ketenagakerjaan menjadi krusial. Proyek ini bertujuan mengembangkan aplikasi web yang memvisualisasikan data demografi dan kemajuan SDGs, memberikan rekomendasi kebijakan berbasis data, serta menghasilkan laporan otomatis untuk mendukung pengambilan keputusan oleh pemangku kepentingan.

## Relevansi dengan Tema Lomba
Proyek ini dikembangkan untuk lomba Olivia 2025 dengan tema "Sustainable Digital Solutions: Enhancing Innovation through Web Technology." Keselarasan proyek dengan tema ini meliputi:  
- **Solusi Berkelanjutan**: Memanfaatkan teknologi web untuk mendukung pencapaian SDGs dan bonus demografi.  
- **Integrasi Data Terbuka**: Menggunakan sumber data publik seperti Badan Pusat Statistik (BPS) dan data.go.id.  
- **Inovasi Berbasis AI**: Mengintegrasikan kecerdasan buatan untuk menghasilkan wawasan dan rekomendasi kebijakan yang inovatif.

## Tujuan
- Menyediakan alat visualisasi data yang intuitif untuk memantau indikator demografi dan SDGs.  
- Memberikan rekomendasi kebijakan berbasis data yang relevan untuk pemerintah, akademisi, dan masyarakat.  
- Memfasilitasi pembuatan laporan otomatis yang dapat diakses oleh pemangku kepentingan.  
- Memastikan keamanan dan kemudahan penggunaan aplikasi melalui desain yang responsif dan manajemen pengguna yang terstruktur.

## Fitur Utama
1. **Visualisasi GIS**: Peta interaktif yang menampilkan kepadatan penduduk dan indikator SDGs per provinsi atau kabupaten.  
2. **Analisis Tren**: Grafik dan tabel yang menggambarkan perkembangan indikator SDGs dari waktu ke waktu.  
3. **Rekomendasi Kebijakan**: Saran kebijakan otomatis berdasarkan analisis data, didukung oleh AI.  
4. **Laporan Otomatis**: Pembuatan laporan dalam format PDF atau Excel untuk kebutuhan pelaporan.  
5. **Manajemen Pengguna**: Panel admin untuk verifikasi data, pengelolaan pengguna, dan pemantauan aktivitas.

## Kebutuhan Dasar
- **Data**: Data demografi dan SDGs dari sumber terpercaya (BPS, data.go.id).  
- **Akses Teknologi**: Server lokal (XAMPP) untuk pengembangan dan shared hosting untuk produksi.  
- **Keamanan**: Autentikasi pengguna dan proteksi data sensitif.

## Pendekatan Teknologi
Proyek ini menggunakan teknologi native untuk mendukung pembelajaran mendalam tentang dasar-dasar pengembangan web:  
- **Frontend**: HTML, CSS, JavaScript untuk antarmuka pengguna, dengan Leaflet.js untuk peta GIS dan Chart.js untuk visualisasi data.  
- **Backend**: PHP dan MySQL (via XAMPP) untuk pengolahan data dan logika server.  
- **Integrasi AI**: API eksternal seperti Google Gemini API untuk analisis dan rekomendasi.  
- **Alasan Pemilihan**: Pendekatan native dipilih untuk eksperimen teknis dan fleksibilitas, meskipun lebih memakan waktu dibandingkan framework modern.

## Struktur Proyek
Direktori proyek akan diorganisir sebagai berikut:  
- **Folder `public/`**: Berisi file HTML, CSS, JavaScript, dan aset statis seperti gambar atau ikon.  
- **Folder `api/`**: Berisi file PHP untuk logika backend dan endpoint API.  
- **File `database.sql`**: Skema database MySQL dan data awal untuk pengujian.

## Konsep Teknis
- **Alur Data**: Data diambil dari MySQL melalui API PHP, kemudian divisualisasikan di frontend menggunakan JavaScript.  
- **GIS**: Data spasial dalam format GeoJSON diproses oleh PHP dan ditampilkan dengan Leaflet.js.  
- **AI**: Backend PHP mengirimkan permintaan ke API AI, mem-parsing respons, dan mengirimkan hasil ke frontend.  
- **Keamanan**: Autentikasi berbasis sesi dan penggunaan prepared statements untuk mencegah SQL injection.

## Deployment
- **Pengembangan Lokal**: Menggunakan XAMPP untuk menjalankan server Apache dan database MySQL.  
- **Produksi**: Deploy ke shared hosting yang mendukung PHP dan MySQL, dengan konfigurasi HTTPS jika memungkinkan.

## Manajemen Proyek
- **Prioritas**: Fokus pada fitur inti (visualisasi GIS, analisis tren, dan laporan otomatis) sebelum fitur tambahan seperti rekomendasi AI.  
- **Sumber Daya**: Tim kecil atau individu dengan keterampilan dasar web development.  
- **Pendekatan**: Iterative development dengan pengujian berkala untuk memastikan stabilitas.

Proyek ini dirancang untuk menjaga keseimbangan antara ambisi fitur dan keterbatasan teknologi native, dengan tujuan menghasilkan solusi yang fungsional, aman, dan relevan dengan kebutuhan bonus demografi Indonesia.