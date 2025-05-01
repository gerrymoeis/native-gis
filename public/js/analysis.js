/**
 * SDGs Dashboard untuk Bonus Demografi Indonesia
 * Analysis Module - Handles data analysis and visualization using Chart.js
 */

// Initialize analysis when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if analysis page elements exist
    const analysisPage = document.getElementById('analysis');
    if (!analysisPage) return;
    
    // Chart variables
    let trendChart = null;
    
    // Initialize analysis
    function initAnalysis() {
        // Set up event listeners for controls
        setupEventListeners();
        
        // Load initial data
        loadAnalysisData();
    }
    
    // Set up event listeners for analysis controls
    function setupEventListeners() {
        const indicatorSelect = document.getElementById('analysisIndicator');
        const provinsiSelect = document.getElementById('analysisProvinsi');
        
        if (indicatorSelect) {
            indicatorSelect.addEventListener('change', loadAnalysisData);
        }
        
        if (provinsiSelect) {
            provinsiSelect.addEventListener('change', loadAnalysisData);
        }
    }
    
    // Load data for analysis
    function loadAnalysisData() {
        // Get selected values from controls
        const indicatorSelect = document.getElementById('analysisIndicator');
        const provinsiSelect = document.getElementById('analysisProvinsi');
        
        const indicator = indicatorSelect ? indicatorSelect.value : 'angka_harapan_hidup';
        const provinsi = provinsiSelect ? provinsiSelect.value : 'all';
        
        // Show loading indicator
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.classList.add('loading');
        }
        
        // Fetch data from API
        fetch(`../api/get_sdgs.php?indikator=${indicator}${provinsi !== 'all' ? `&provinsi=${provinsi}` : ''}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    // Process data for chart
                    const chartData = processDataForChart(data.data, indicator, provinsi);
                    
                    // Update chart
                    updateChart(chartData, indicator);
                    
                    // Update data table
                    updateDataTable(data.data);
                    
                    // Hide loading indicator
                    if (chartContainer) {
                        chartContainer.classList.remove('loading');
                    }
                } else {
                    throw new Error(data.message || 'Failed to load data');
                }
            })
            .catch(error => {
                console.error('Error fetching analysis data:', error);
                
                // Hide loading indicator
                if (chartContainer) {
                    chartContainer.classList.remove('loading');
                }
                
                // Show error message
                alert('Gagal memuat data analisis. Silakan coba lagi nanti.');
            });
    }
    
    // Process data for chart visualization
    function processDataForChart(data, indicator, provinsi) {
        // Group data by province and year
        const groupedData = {};
        const years = new Set();
        
        data.forEach(item => {
            const prov = item.provinsi;
            const year = parseInt(item.tahun);
            const value = parseFloat(item.nilai);
            
            if (!groupedData[prov]) {
                groupedData[prov] = {};
            }
            
            groupedData[prov][year] = value;
            years.add(year);
        });
        
        // Sort years
        const sortedYears = Array.from(years).sort();
        
        // Prepare datasets for Chart.js
        const datasets = [];
        const colors = [
            '#4F46E5', '#EC4899', '#10B981', '#F59E0B', '#EF4444',
            '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
        ];
        
        let colorIndex = 0;
        
        // If specific province is selected, only include that one
        if (provinsi !== 'all') {
            if (groupedData[provinsi]) {
                const data = sortedYears.map(year => groupedData[provinsi][year] || null);
                
                datasets.push({
                    label: provinsi,
                    data: data,
                    borderColor: colors[0],
                    backgroundColor: colors[0] + '33', // Add transparency
                    tension: 0.3,
                    fill: true
                });
            }
        } else {
            // Include all provinces
            Object.keys(groupedData).forEach(prov => {
                const data = sortedYears.map(year => groupedData[prov][year] || null);
                
                datasets.push({
                    label: prov,
                    data: data,
                    borderColor: colors[colorIndex % colors.length],
                    backgroundColor: 'transparent',
                    tension: 0.3
                });
                
                colorIndex++;
            });
        }
        
        return {
            labels: sortedYears,
            datasets: datasets
        };
    }
    
    // Update chart with new data
    function updateChart(chartData, indicator) {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;
        
        // Get chart title based on indicator
        let chartTitle;
        let yAxisLabel;
        
        switch (indicator) {
            case 'angka_harapan_hidup':
                chartTitle = 'Tren Angka Harapan Hidup';
                yAxisLabel = 'Tahun';
                break;
            case 'rata_lama_sekolah':
                chartTitle = 'Tren Rata-rata Lama Sekolah';
                yAxisLabel = 'Tahun';
                break;
            case 'tingkat_pengangguran':
                chartTitle = 'Tren Tingkat Pengangguran';
                yAxisLabel = 'Persentase (%)';
                break;
            default:
                chartTitle = 'Tren Indikator SDGs';
                yAxisLabel = 'Nilai';
        }
        
        // Destroy existing chart if it exists
        if (trendChart) {
            trendChart.destroy();
        }
        
        // Create new chart
        trendChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: chartTitle,
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#F8FAFC',
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#F8FAFC',
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        titleColor: '#F8FAFC',
                        bodyColor: '#F8FAFC',
                        borderColor: '#334155',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toFixed(2);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tahun',
                            color: '#94A3B8',
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                            color: '#94A3B8'
                        },
                        grid: {
                            color: 'rgba(51, 65, 85, 0.3)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: yAxisLabel,
                            color: '#94A3B8',
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                            color: '#94A3B8'
                        },
                        grid: {
                            color: 'rgba(51, 65, 85, 0.3)'
                        },
                        beginAtZero: true
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }
    
    // Update data table with new data
    function updateDataTable(data) {
        const tableBody = document.querySelector('#dataTable tbody');
        if (!tableBody) return;
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Sort data by province and year
        data.sort((a, b) => {
            if (a.provinsi === b.provinsi) {
                return parseInt(b.tahun) - parseInt(a.tahun); // Descending year
            }
            return a.provinsi.localeCompare(b.provinsi); // Ascending province
        });
        
        // Add rows to table
        data.forEach(item => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${item.provinsi}</td>
                <td>${item.indikator}</td>
                <td>${parseFloat(item.nilai).toFixed(2)}</td>
                <td>${item.tahun}</td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // If no data, show message
        if (data.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="4" class="text-center">Tidak ada data tersedia</td>';
            tableBody.appendChild(row);
        }
    }
    
    // Initialize analysis
    initAnalysis();
});
