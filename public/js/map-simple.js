/**
 * Simple Map Module - Minimal version to ensure OpenStreetMap works
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
