/**
 * SDGs Dashboard untuk Bonus Demografi Indonesia
 * Map Module - Handles GIS visualization using Leaflet.js
 */

// Initialize map when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if map container exists
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return;

    // Initialize map variables
    let map = null;
    let geojsonLayer = null;
    let legend = null;
    let tileLayer = null;
    
    // Map configuration
    const mapConfig = {
        center: [-2.5489, 118.0149], // Center of Indonesia
        zoom: 5,
        minZoom: 4,
        maxZoom: 18
    };
    
    // Color scales for different indicators
    const colorScales = {
        populasi: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'],
        angka_harapan_hidup: ['#edf8fb', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#6e016b'],
        rata_lama_sekolah: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#6e016b'],
        tingkat_pengangguran: ['#edf8fb', '#b3cde3', '#8c96c6', '#8856a7', '#810f7c']
    };
    
    // Available tile layers
    const tileLayers = {
        osm: {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            name: 'OpenStreetMap'
        },
        dark: {
            url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            name: 'Dark'
        },
        light: {
            url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            name: 'Light'
        }
    };
    
    // Initialize the map
    function initMap() {
        // Add loading indicator to map container
        mapContainer.innerHTML = '<div class="map-loading"><div class="spinner"></div><p>Memuat peta...</p></div>';
        
        // Create map instance
        map = L.map('mapContainer', {
            center: mapConfig.center,
            zoom: mapConfig.zoom,
            minZoom: mapConfig.minZoom,
            maxZoom: mapConfig.maxZoom,
            zoomControl: false, // We'll add zoom control manually
            attributionControl: true
        });
        
        // Clear loading indicator
        mapContainer.innerHTML = '';
        
        // Add zoom control to the top-right
        L.control.zoom({
            position: 'topright'
        }).addTo(map);
        
        // Add tile layer (base map) - Default to OpenStreetMap
        setTileLayer('osm');
        
        // Add layer control
        addLayerControl();
        
        // Add scale control
        L.control.scale({
            imperial: false,
            position: 'bottomright'
        }).addTo(map);
        
        // Set up event listeners for controls
        setupEventListeners();
        
        // Load initial data
        loadMapData();
        
        // Add resize handler to fix map rendering issues
        window.addEventListener('resize', function() {
            if (map) {
                map.invalidateSize();
            }
        });
        
        // Force map to render correctly after a short delay
        setTimeout(function() {
            if (map) {
                map.invalidateSize();
            }
        }, 500);
    }
    
    // Set tile layer
    function setTileLayer(type) {
        // Remove existing tile layer if it exists
        if (tileLayer) {
            map.removeLayer(tileLayer);
        }
        
        // Get tile layer configuration
        const layer = tileLayers[type] || tileLayers.osm;
        
        // Add new tile layer
        tileLayer = L.tileLayer(layer.url, {
            attribution: layer.attribution,
            subdomains: 'abc',
            maxZoom: 19
        }).addTo(map);
    }
    
    // Add layer control
    function addLayerControl() {
        // Create layer control
        const layerControl = L.control({
            position: 'topright'
        });
        
        // Define layer control HTML
        layerControl.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'layer-control');
            div.innerHTML = `
                <div class="layer-control-header">Peta Dasar</div>
                <div class="layer-control-options">
                    <div class="layer-option active" data-layer="osm">
                        <span class="layer-icon">🗺️</span>
                        <span class="layer-name">OpenStreetMap</span>
                    </div>
                    <div class="layer-option" data-layer="dark">
                        <span class="layer-icon">🌑</span>
                        <span class="layer-name">Gelap</span>
                    </div>
                    <div class="layer-option" data-layer="light">
                        <span class="layer-icon">🌕</span>
                        <span class="layer-name">Terang</span>
                    </div>
                </div>
            `;
            
            // Add event listeners to layer options
            const options = div.querySelectorAll('.layer-option');
            options.forEach(option => {
                option.addEventListener('click', function() {
                    // Remove active class from all options
                    options.forEach(opt => opt.classList.remove('active'));
                    
                    // Add active class to clicked option
                    this.classList.add('active');
                    
                    // Set tile layer
                    setTileLayer(this.getAttribute('data-layer'));
                });
            });
            
            return div;
        };
        
        // Add layer control to map
        layerControl.addTo(map);
        
        // Add CSS for layer control
        if (!document.getElementById('layer-control-styles')) {
            const style = document.createElement('style');
            style.id = 'layer-control-styles';
            style.textContent = `
                .layer-control {
                    background-color: rgba(15, 23, 42, 0.8);
                    border-radius: 4px;
                    padding: 8px;
                    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(4px);
                    margin-top: 10px;
                    border: 1px solid #334155;
                }
                
                .layer-control-header {
                    font-size: 12px;
                    font-weight: bold;
                    margin-bottom: 5px;
                    color: #94A3B8;
                }
                
                .layer-control-options {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                
                .layer-option {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    padding: 5px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                .layer-option:hover {
                    background-color: rgba(51, 65, 85, 0.5);
                }
                
                .layer-option.active {
                    background-color: rgba(79, 70, 229, 0.2);
                    border-left: 3px solid #4F46E5;
                }
                
                .layer-icon {
                    font-size: 16px;
                }
                
                .layer-name {
                    font-size: 12px;
                    color: #F8FAFC;
                }
                
                .map-loading {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(15, 23, 42, 0.8);
                    z-index: 1000;
                }
                
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(79, 70, 229, 0.2);
                    border-radius: 50%;
                    border-top-color: #4F46E5;
                    animation: spin 1s linear infinite;
                    margin-bottom: 10px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Set up event listeners for map controls
    function setupEventListeners() {
        const yearSelect = document.getElementById('yearSelect');
        const indicatorSelect = document.getElementById('indicatorSelect');
        
        if (yearSelect) {
            yearSelect.addEventListener('change', loadMapData);
        }
        
        if (indicatorSelect) {
            indicatorSelect.addEventListener('change', loadMapData);
        }
        
        // Add event listener for map page visibility
        document.querySelectorAll('nav a[data-page], .footer-links a[data-page]').forEach(link => {
            link.addEventListener('click', function() {
                if (this.getAttribute('data-page') === 'map' && map) {
                    // Force map to render correctly when map page becomes visible
                    setTimeout(function() {
                        map.invalidateSize();
                    }, 100);
                }
            });
        });
        
        // Add event listener for "Jelajahi Peta" button
        const exploreMapBtn = document.getElementById('exploreMapBtn');
        if (exploreMapBtn) {
            exploreMapBtn.addEventListener('click', function() {
                // Force map to render correctly when map page becomes visible via button
                setTimeout(function() {
                    if (map) {
                        map.invalidateSize();
                    }
                }, 100);
            });
        }
    }
    
    // Load GeoJSON data from API
    function loadMapData() {
        // Get selected values from controls
        const yearSelect = document.getElementById('yearSelect');
        const indicatorSelect = document.getElementById('indicatorSelect');
        
        const year = yearSelect ? yearSelect.value : '2023';
        const indicator = indicatorSelect ? indicatorSelect.value : 'populasi';
        
        // Show loading indicator
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'map-loading';
        loadingOverlay.innerHTML = '<div class="spinner"></div><p>Memuat data...</p>';
        mapContainer.appendChild(loadingOverlay);
        
        console.log('Fetching GeoJSON data from:', `../api/get_geojson.php?tahun=${year}&indikator=${indicator}`);
        
        // Fetch GeoJSON data from API
        fetch(`../api/get_geojson.php?tahun=${year}&indikator=${indicator}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('GeoJSON data received:', data);
                
                // Remove existing GeoJSON layer if it exists
                if (geojsonLayer) {
                    map.removeLayer(geojsonLayer);
                }
                
                // Check if data has features
                if (!data.features || data.features.length === 0) {
                    throw new Error('No GeoJSON features found in data');
                }
                
                // Add new GeoJSON layer
                addGeoJsonLayer(data, indicator);
                
                // Update legend
                updateLegend(indicator);
                
                // Remove loading overlay
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
                
                // Force map to render correctly
                setTimeout(function() {
                    if (map) {
                        map.invalidateSize();
                    }
                }, 100);
            })
            .catch(error => {
                console.error('Error fetching GeoJSON data:', error);
                
                // Remove loading overlay
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
                
                // Show error message
                const errorOverlay = document.createElement('div');
                errorOverlay.className = 'map-error';
                errorOverlay.innerHTML = `
                    <div class="error-icon">❌</div>
                    <p>Gagal memuat data peta: ${error.message}</p>
                    <button class="retry-button">Coba Lagi</button>
                `;
                mapContainer.appendChild(errorOverlay);
                
                // Add event listener to retry button
                const retryButton = errorOverlay.querySelector('.retry-button');
                if (retryButton) {
                    retryButton.addEventListener('click', function() {
                        // Remove error overlay
                        if (errorOverlay.parentNode) {
                            errorOverlay.parentNode.removeChild(errorOverlay);
                        }
                        
                        // Try loading data again
                        loadMapData();
                    });
                }
                
                // Add CSS for error overlay
                if (!document.getElementById('map-error-styles')) {
                    const style = document.createElement('style');
                    style.id = 'map-error-styles';
                    style.textContent = `
                        .map-error {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background-color: rgba(15, 23, 42, 0.9);
                            padding: 20px;
                            border-radius: 8px;
                            text-align: center;
                            max-width: 300px;
                            border: 1px solid #334155;
                            z-index: 1000;
                        }
                        
                        .error-icon {
                            font-size: 32px;
                            margin-bottom: 10px;
                        }
                        
                        .retry-button {
                            background: linear-gradient(135deg, #4F46E5, #EC4899);
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 4px;
                            cursor: pointer;
                            margin-top: 10px;
                            font-weight: bold;
                        }
                        
                        .retry-button:hover {
                            opacity: 0.9;
                        }
                    `;
                    document.head.appendChild(style);
                }
            });
    }
    
    // Add GeoJSON layer to map
    function addGeoJsonLayer(geojsonData, indicator) {
        // Get color scale for selected indicator
        const colorScale = colorScales[indicator] || colorScales.populasi;
        
        // Extract values for calculating ranges
        const values = geojsonData.features.map(feature => {
            if (indicator === 'populasi') {
                return feature.properties.populasi;
            } else {
                return feature.properties.nilai;
            }
        }).filter(value => value !== null && value !== undefined);
        
        // Calculate min and max values
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        
        console.log(`Value range for ${indicator}: ${minValue} to ${maxValue}`);
        
        // Create GeoJSON layer
        geojsonLayer = L.geoJSON(geojsonData, {
            pointToLayer: function(feature, latlng) {
                // Get value for this feature
                let value;
                let radius;
                
                if (indicator === 'populasi') {
                    value = feature.properties.populasi;
                    // Scale radius based on population (logarithmic scale)
                    radius = Math.max(5, Math.log(value) * 2);
                } else {
                    value = feature.properties.nilai;
                    // Fixed radius for other indicators
                    radius = 10;
                }
                
                // Get color based on value
                const color = getColor(value, minValue, maxValue, colorScale);
                
                // Create circle marker
                return L.circleMarker(latlng, {
                    radius: radius,
                    fillColor: color,
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
                
                // Add hover effect
                layer.on({
                    mouseover: function(e) {
                        const layer = e.target;
                        layer.setStyle({
                            weight: 3,
                            opacity: 1
                        });
                        
                        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                            layer.bringToFront();
                        }
                    },
                    mouseout: function(e) {
                        geojsonLayer.resetStyle(e.target);
                    },
                    click: function(e) {
                        map.fitBounds(e.target.getBounds());
                    }
                });
            }
        }).addTo(map);
        
        // Fit map to GeoJSON bounds
        if (geojsonData.features.length > 0) {
            map.fitBounds(geojsonLayer.getBounds(), {
                padding: [50, 50],
                maxZoom: 7,
                animate: true
            });
        }
        
        // Add CSS for popup
        if (!document.getElementById('map-popup-styles')) {
            const style = document.createElement('style');
            style.id = 'map-popup-styles';
            style.textContent = `
                .leaflet-popup-content-wrapper {
                    background-color: rgba(15, 23, 42, 0.9);
                    color: #F8FAFC;
                    border-radius: 8px;
                    border: 1px solid #334155;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(4px);
                }
                
                .leaflet-popup-tip {
                    background-color: rgba(15, 23, 42, 0.9);
                    border: 1px solid #334155;
                }
                
                .map-popup h3 {
                    margin: 0 0 10px 0;
                    color: #4F46E5;
                    font-size: 16px;
                    border-bottom: 1px solid #334155;
                    padding-bottom: 5px;
                }
                
                .map-popup p {
                    margin: 5px 0;
                    font-size: 13px;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Get color based on value and range
    function getColor(value, min, max, colorScale) {
        // If value is null or undefined, return gray
        if (value === null || value === undefined) {
            return '#ccc';
        }
        
        // Calculate the position in the range (0 to 1)
        const range = max - min;
        const normalizedValue = range === 0 ? 0.5 : (value - min) / range;
        
        // Get the index in the color scale
        const index = Math.min(
            Math.floor(normalizedValue * colorScale.length),
            colorScale.length - 1
        );
        
        return colorScale[index];
    }
    
    // Update legend based on selected indicator
    function updateLegend(indicator) {
        // Remove existing legend if it exists
        if (legend) {
            map.removeControl(legend);
        }
        
        // Create new legend
        legend = L.control({ position: 'bottomleft' });
        
        legend.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'info legend');
            const colorScale = colorScales[indicator] || colorScales.populasi;
            
            // Set legend title based on indicator
            let title;
            let units;
            
            switch (indicator) {
                case 'populasi':
                    title = 'Populasi';
                    units = 'jiwa';
                    break;
                case 'angka_harapan_hidup':
                    title = 'Angka Harapan Hidup';
                    units = 'tahun';
                    break;
                case 'rata_lama_sekolah':
                    title = 'Rata-rata Lama Sekolah';
                    units = 'tahun';
                    break;
                case 'tingkat_pengangguran':
                    title = 'Tingkat Pengangguran';
                    units = '%';
                    break;
                default:
                    title = 'Nilai';
                    units = '';
            }
            
            div.innerHTML = `<h4>${title}</h4>`;
            
            // Add legend items
            const legendItems = document.createElement('div');
            legendItems.className = 'legend-items';
            
            // Create legend with equal intervals
            const numClasses = colorScale.length;
            
            for (let i = 0; i < numClasses; i++) {
                const color = colorScale[i];
                const itemDiv = document.createElement('div');
                itemDiv.className = 'legend-item';
                
                const colorBox = document.createElement('span');
                colorBox.className = 'legend-color';
                colorBox.style.backgroundColor = color;
                
                const label = document.createElement('span');
                label.textContent = `${Math.round((i / numClasses) * 100)}% - ${Math.round(((i + 1) / numClasses) * 100)}%`;
                
                itemDiv.appendChild(colorBox);
                itemDiv.appendChild(label);
                legendItems.appendChild(itemDiv);
            }
            
            div.appendChild(legendItems);
            
            // Add CSS for legend
            if (!document.getElementById('legend-styles')) {
                const style = document.createElement('style');
                style.id = 'legend-styles';
                style.textContent = `
                    .info.legend {
                        background-color: rgba(15, 23, 42, 0.8);
                        padding: 10px;
                        border-radius: 8px;
                        border: 1px solid #334155;
                        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
                        backdrop-filter: blur(4px);
                    }
                    
                    .info.legend h4 {
                        margin: 0 0 10px 0;
                        color: #F8FAFC;
                        font-size: 14px;
                        font-weight: bold;
                    }
                    
                    .legend-items {
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                    }
                    
                    .legend-item {
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    }
                    
                    .legend-color {
                        width: 20px;
                        height: 20px;
                        border-radius: 4px;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }
                `;
                document.head.appendChild(style);
            }
            
            return div;
        };
        
        legend.addTo(map);
        
        // Update legend in HTML
        const mapLegend = document.getElementById('mapLegend');
        if (mapLegend) {
            mapLegend.innerHTML = legend.onAdd(map).innerHTML;
        }
    }
    
    // Initialize map
    initMap();
});
