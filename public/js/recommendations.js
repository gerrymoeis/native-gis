/**
 * SDGs Dashboard untuk Bonus Demografi Indonesia
 * Recommendations Module - Handles AI-based policy recommendations
 */

// Initialize recommendations when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if recommendations page elements exist
    const analysisPage = document.getElementById('analysis');
    if (!analysisPage) return;
    
    // Add recommendations section to analysis page if it doesn't exist
    if (!document.getElementById('recommendations-section')) {
        const recommendationsSection = document.createElement('div');
        recommendationsSection.id = 'recommendations-section';
        recommendationsSection.className = 'recommendations-section';
        recommendationsSection.innerHTML = `
            <div class="container">
                <h3>Rekomendasi Kebijakan</h3>
                <p>Dapatkan rekomendasi kebijakan berbasis AI untuk indikator dan provinsi yang dipilih.</p>
                
                <div class="recommendations-controls">
                    <button id="generateRecommendationsBtn" class="btn btn-primary">Buat Rekomendasi</button>
                </div>
                
                <div id="recommendations-container" class="recommendations-container">
                    <!-- Recommendations will be displayed here -->
                    <p class="no-recommendations">Klik tombol "Buat Rekomendasi" untuk mendapatkan rekomendasi kebijakan.</p>
                </div>
            </div>
        `;
        
        // Insert after chart container
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.parentNode.insertBefore(recommendationsSection, chartContainer.nextSibling);
        } else {
            analysisPage.querySelector('.container').appendChild(recommendationsSection);
        }
        
        // Set up event listener for generate recommendations button
        const generateRecommendationsBtn = document.getElementById('generateRecommendationsBtn');
        if (generateRecommendationsBtn) {
            generateRecommendationsBtn.addEventListener('click', generateRecommendations);
        }
    }
    
    // Generate policy recommendations
    function generateRecommendations() {
        // Get selected values from controls
        const indicatorSelect = document.getElementById('analysisIndicator');
        const provinsiSelect = document.getElementById('analysisProvinsi');
        
        const indicator = indicatorSelect ? indicatorSelect.value : 'angka_harapan_hidup';
        const provinsi = provinsiSelect ? provinsiSelect.value : 'all';
        
        // Check if province is selected
        if (provinsi === 'all') {
            alert('Silakan pilih provinsi tertentu untuk mendapatkan rekomendasi kebijakan.');
            return;
        }
        
        // Map indicator value to display name
        const indicatorMap = {
            'angka_harapan_hidup': 'Angka Harapan Hidup',
            'rata_lama_sekolah': 'Rata-rata Lama Sekolah',
            'tingkat_pengangguran': 'Tingkat Pengangguran'
        };
        
        const indicatorName = indicatorMap[indicator] || indicator;
        
        // Show loading indicator
        const recommendationsContainer = document.getElementById('recommendations-container');
        if (recommendationsContainer) {
            recommendationsContainer.innerHTML = '<div class="loading-spinner"></div><p>Menghasilkan rekomendasi kebijakan...</p>';
        }
        
        // Prepare data for API request
        const requestData = {
            indicator: indicatorName,
            provinsi: provinsi
        };
        
        // Send request to AI recommendation API
        fetch('../api/ai_recommend.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    // Display recommendations
                    displayRecommendations(data.data);
                } else {
                    throw new Error(data.message || 'Failed to generate recommendations');
                }
            })
            .catch(error => {
                console.error('Error generating recommendations:', error);
                
                // Show error message
                if (recommendationsContainer) {
                    recommendationsContainer.innerHTML = `
                        <div class="error-message">
                            <p>Gagal menghasilkan rekomendasi kebijakan. Silakan coba lagi nanti.</p>
                            <p class="error-details">${error.message}</p>
                        </div>
                    `;
                }
            });
    }
    
    // Display recommendations
    function displayRecommendations(recommendations) {
        const recommendationsContainer = document.getElementById('recommendations-container');
        if (!recommendationsContainer) return;
        
        // Create recommendations HTML
        let html = `
            <div class="recommendations-card">
                <div class="recommendations-header">
                    <h4>${recommendations.summary.indicator} - ${recommendations.summary.provinsi}</h4>
                    <div class="status-badge status-${recommendations.status.toLowerCase().replace(/\s+/g, '-')}">${recommendations.status}</div>
                </div>
                
                <div class="recommendations-summary">
                    <div class="summary-item">
                        <div class="summary-label">Nilai Saat Ini (${recommendations.summary.current_year})</div>
                        <div class="summary-value">${recommendations.summary.current_value.toFixed(2)}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Tren</div>
                        <div class="summary-value ${recommendations.summary.trend >= 0 ? 'positive' : 'negative'}">
                            ${recommendations.summary.trend >= 0 ? '+' : ''}${recommendations.summary.trend.toFixed(2)} 
                            (${recommendations.summary.trend_percentage.toFixed(2)}%)
                        </div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Populasi</div>
                        <div class="summary-value">${recommendations.summary.population.toLocaleString()} jiwa</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Usia Produktif</div>
                        <div class="summary-value">${recommendations.summary.productive_percentage.toFixed(2)}%</div>
                    </div>
                </div>
                
                <div class="recommendations-analysis">
                    <h5>Analisis Tren</h5>
                    <p>${recommendations.trend_analysis}</p>
                    
                    <h5>Dampak Demografis</h5>
                    <p>${recommendations.demographic_impact}</p>
                </div>
                
                <div class="recommendations-policies">
                    <h5>Rekomendasi Kebijakan</h5>
                    <ul>
        `;
        
        // Add policy recommendations
        recommendations.policy_recommendations.forEach(policy => {
            html += `<li>${policy}</li>`;
        });
        
        html += `
                    </ul>
                </div>
                
                <div class="recommendations-footer">
                    <p class="disclaimer">Rekomendasi ini dihasilkan berdasarkan analisis data dan dimaksudkan sebagai referensi. Keputusan kebijakan harus mempertimbangkan faktor-faktor lain yang relevan.</p>
                </div>
            </div>
        `;
        
        // Update container
        recommendationsContainer.innerHTML = html;
        
        // Add CSS for recommendations if not already added
        if (!document.getElementById('recommendations-styles')) {
            const style = document.createElement('style');
            style.id = 'recommendations-styles';
            style.textContent = `
                .recommendations-section {
                    margin-top: 2rem;
                }
                
                .recommendations-controls {
                    margin-bottom: 1rem;
                    text-align: center;
                }
                
                .recommendations-container {
                    margin-top: 1.5rem;
                }
                
                .no-recommendations {
                    text-align: center;
                    color: var(--gray-text);
                    padding: 2rem 0;
                }
                
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(79, 70, 229, 0.2);
                    border-radius: 50%;
                    border-top-color: var(--primary-color);
                    margin: 2rem auto;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .error-message {
                    background-color: rgba(239, 68, 68, 0.1);
                    border-left: 4px solid var(--error-color);
                    padding: 1rem;
                    margin: 1rem 0;
                    border-radius: 0.5rem;
                }
                
                .error-details {
                    font-size: 0.9rem;
                    color: var(--gray-text);
                    margin-top: 0.5rem;
                }
                
                .recommendations-card {
                    background-color: var(--card-bg);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    border: 1px solid var(--border-color);
                    margin-top: 1rem;
                }
                
                .recommendations-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                
                .recommendations-header h4 {
                    margin-bottom: 0;
                }
                
                .status-badge {
                    padding: 0.5rem 1rem;
                    border-radius: 2rem;
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                
                .status-baik {
                    background-color: rgba(16, 185, 129, 0.2);
                    color: #10B981;
                }
                
                .status-sedang {
                    background-color: rgba(245, 158, 11, 0.2);
                    color: #F59E0B;
                }
                
                .status-perlu-perhatian {
                    background-color: rgba(239, 68, 68, 0.2);
                    color: #EF4444;
                }
                
                .recommendations-summary {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    background-color: rgba(51, 65, 85, 0.3);
                    border-radius: 0.5rem;
                    padding: 1rem;
                }
                
                .summary-item {
                    text-align: center;
                }
                
                .summary-label {
                    font-size: 0.9rem;
                    color: var(--gray-text);
                    margin-bottom: 0.5rem;
                }
                
                .summary-value {
                    font-size: 1.2rem;
                    font-weight: 600;
                }
                
                .summary-value.positive {
                    color: #10B981;
                }
                
                .summary-value.negative {
                    color: #EF4444;
                }
                
                .recommendations-analysis h5,
                .recommendations-policies h5 {
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                }
                
                .recommendations-policies ul {
                    margin-left: 1.5rem;
                }
                
                .recommendations-policies li {
                    margin-bottom: 0.5rem;
                }
                
                .recommendations-footer {
                    margin-top: 1.5rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border-color);
                }
                
                .disclaimer {
                    font-size: 0.9rem;
                    color: var(--gray-text);
                    font-style: italic;
                }
                
                @media (max-width: 768px) {
                    .recommendations-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .status-badge {
                        margin-top: 0.5rem;
                    }
                    
                    .recommendations-summary {
                        grid-template-columns: 1fr 1fr;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
});
