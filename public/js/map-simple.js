/**
 * Simple Map Module - Minimal version to ensure OpenStreetMap works
 * Modified for Netlify deployment
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple map module loaded');
    
    // Function to initialize map
    function initMap() {
        console.log('Initializing simple map');
        
        // Get map container
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }
        
        // Clear any existing content
        mapContainer.innerHTML = '';
        
        // Make sure the container has proper dimensions
        mapContainer.style.width = '100%';
        mapContainer.style.height = '600px';
        mapContainer.style.backgroundColor = '#f0f0f0';
        
        try {
            // Create map instance
            const map = L.map('mapContainer').setView([-2.5489, 118.0149], 5);
            
            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(map);
            
            // Add a marker for Jakarta
            L.marker([-6.2088, 106.8456])
                .addTo(map)
                .bindPopup('Jakarta')
                .openPopup();
            
            console.log('Map initialized successfully');
            
            // Load GeoJSON data from Netlify Function (instead of PHP API)
            loadGeoJsonData(map);
            
            // Force map to render correctly after a delay
            setTimeout(function() {
                map.invalidateSize(true);
                console.log('Map size invalidated');
            }, 500);
            
            return map;
        } catch (error) {
            console.error('Error initializing map:', error);
            mapContainer.innerHTML = `
                <div style="padding: 20px; background-color: #f8d7da; color: #721c24; text-align: center; border-radius: 5px;">
                    <h3>Error Loading Map</h3>
                    <p>${error.message}</p>
                </div>
            `;
            return null;
        }
    }
    
    // Function to load GeoJSON data from Netlify Function
    function loadGeoJsonData(map) {
        // Get selected values from controls
        const yearSelect = document.getElementById('yearSelect');
        const indicatorSelect = document.getElementById('indicatorSelect');
        
        const year = yearSelect ? yearSelect.value : '2023';
        const indicator = indicatorSelect ? indicatorSelect.value : 'populasi';
        
        // Show loading indicator
        const mapContainer = document.getElementById('mapContainer');
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'map-loading';
        loadingOverlay.innerHTML = '<div class="spinner"></div><p>Memuat data...</p>';
        loadingOverlay.style.position = 'absolute';
        loadingOverlay.style.top = '0';
        loadingOverlay.style.left = '0';
        loadingOverlay.style.width = '100%';
        loadingOverlay.style.height = '100%';
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.flexDirection = 'column';
        loadingOverlay.style.alignItems = 'center';
        loadingOverlay.style.justifyContent = 'center';
        loadingOverlay.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
        loadingOverlay.style.zIndex = '1000';
        mapContainer.appendChild(loadingOverlay);
        
        // URL for Netlify Function (instead of PHP API)
        const apiUrl = `/.netlify/functions/get-geojson?tahun=${year}&indikator=${indicator}`;
        console.log('Fetching GeoJSON data from:', apiUrl);
        
        // Fetch GeoJSON data
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('GeoJSON data received:', data);
                
                // Check if data has features
                if (!data.features || data.features.length === 0) {
                    throw new Error('No GeoJSON features found in data');
                }
                
                // Add GeoJSON layer to map
                const geojsonLayer = L.geoJSON(data, {
                    pointToLayer: function(feature, latlng) {
                        // Create circle marker
                        return L.circleMarker(latlng, {
                            radius: 8,
                            fillColor: '#4F46E5',
                            color: '#fff',
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        });
                    },
                    onEachFeature: function(feature, layer) {
                        // Create popup content
                        let popupContent = `<div class="map-popup">
                            <h3>${feature.properties.provinsi}</h3>`;
                        
                        if (feature.properties.kabupaten) {
                            popupContent += `<p>Kabupaten: ${feature.properties.kabupaten}</p>`;
                        }
                        
                        if (indicator === 'populasi') {
                            popupContent += `<p>Populasi: ${feature.properties.populasi.toLocaleString()} jiwa</p>
                            <p>Populasi Produktif: ${feature.properties.populasi_produktif.toLocaleString()} jiwa (${feature.properties.persentase_produktif}%)</p>`;
                        } else {
                            popupContent += `<p>${feature.properties.indikator}: ${feature.properties.nilai}</p>
                            <p>Kategori: ${feature.properties.kategori}</p>`;
                        }
                        
                        popupContent += `<p>Tahun: ${feature.properties.tahun}</p>
                        </div>`;
                        
                        // Bind popup to layer
                        layer.bindPopup(popupContent);
                    }
                }).addTo(map);
                
                // Fit map to GeoJSON bounds
                map.fitBounds(geojsonLayer.getBounds(), {
                    padding: [50, 50],
                    maxZoom: 7,
                    animate: true
                });
                
                // Remove loading overlay
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            })
            .catch(error => {
                console.error('Error fetching GeoJSON data:', error);
                
                // Remove loading overlay
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
                
                // Show error message
                const errorOverlay = document.createElement('div');
                errorOverlay.style.position = 'absolute';
                errorOverlay.style.top = '50%';
                errorOverlay.style.left = '50%';
                errorOverlay.style.transform = 'translate(-50%, -50%)';
                errorOverlay.style.backgroundColor = 'rgba(15, 23, 42, 0.9)';
                errorOverlay.style.padding = '20px';
                errorOverlay.style.borderRadius = '8px';
                errorOverlay.style.textAlign = 'center';
                errorOverlay.style.maxWidth = '300px';
                errorOverlay.style.border = '1px solid #334155';
                errorOverlay.style.zIndex = '1000';
                errorOverlay.style.color = '#fff';
                
                errorOverlay.innerHTML = `
                    <div style="font-size: 32px; margin-bottom: 10px;">❌</div>
                    <p>Gagal memuat data peta: ${error.message}</p>
                    <button style="
                        background: linear-gradient(135deg, #4F46E5, #EC4899);
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-top: 10px;
                        font-weight: bold;
                    ">Coba Lagi</button>
                `;
                mapContainer.appendChild(errorOverlay);
                
                // Add event listener to retry button
                const retryButton = errorOverlay.querySelector('button');
                if (retryButton) {
                    retryButton.addEventListener('click', function() {
                        // Remove error overlay
                        if (errorOverlay.parentNode) {
                            errorOverlay.parentNode.removeChild(errorOverlay);
                        }
                        
                        // Try loading data again
                        loadGeoJsonData(map);
                    });
                }
            });
    }
    
    // Initialize map when map page is shown
    const mapLink = document.querySelector('a[data-page="map"]');
    if (mapLink) {
        mapLink.addEventListener('click', function() {
            // Short delay to ensure the page is visible
            setTimeout(initMap, 100);
        });
    }
    
    // Check if map page is already active
    const mapPage = document.getElementById('map');
    if (mapPage && mapPage.classList.contains('active')) {
        console.log('Map page is active, initializing map');
        initMap();
    }
});
