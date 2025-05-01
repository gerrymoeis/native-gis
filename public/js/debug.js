/**
 * Debug script untuk memeriksa masalah peta GIS
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Debug script loaded');
    
    // Periksa apakah elemen mapContainer ada
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) {
        console.error('Map container not found!');
        return;
    }
    console.log('Map container found:', mapContainer);
    
    // Periksa apakah Leaflet tersedia
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded!');
        return;
    }
    console.log('Leaflet version:', L.version);
    
    // Periksa ukuran container
    const containerStyle = window.getComputedStyle(mapContainer);
    console.log('Map container dimensions:', {
        width: containerStyle.width,
        height: containerStyle.height,
        display: containerStyle.display,
        visibility: containerStyle.visibility,
        position: containerStyle.position
    });
    
    // Coba inisialisasi peta sederhana
    try {
        // Hapus semua child nodes dari container
        while (mapContainer.firstChild) {
            mapContainer.removeChild(mapContainer.firstChild);
        }
        
        // Reset class Leaflet
        mapContainer.className = '';
        
        console.log('Creating test map...');
        const testMap = L.map('mapContainer', {
            center: [-2.5489, 118.0149], // Center of Indonesia
            zoom: 5
        });
        
        // Tambahkan tile layer OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(testMap);
        
        console.log('Test map created successfully');
        
        // Tambahkan marker untuk memastikan peta berfungsi
        L.marker([-6.2088, 106.8456]) // Jakarta
            .addTo(testMap)
            .bindPopup('Jakarta')
            .openPopup();
        
        // Force invalidate size setelah beberapa saat
        setTimeout(function() {
            console.log('Forcing map resize...');
            testMap.invalidateSize(true);
        }, 1000);
    } catch (error) {
        console.error('Error creating test map:', error);
    }
    
    // Periksa koneksi ke API GeoJSON
    fetch('../api/get_geojson.php?tahun=2023&indikator=populasi')
        .then(response => {
            console.log('GeoJSON API response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('GeoJSON data received:', data);
        })
        .catch(error => {
            console.error('Error fetching GeoJSON data:', error);
        });
});
