/**
 * SDGs Dashboard untuk Bonus Demografi Indonesia
 * Reports Module - Handles report generation and management
 */

// Initialize reports functionality when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if reports page elements exist
    const reportsPage = document.getElementById('reports');
    if (!reportsPage) return;
    
    // Initialize reports
    function initReports() {
        // Set up event listeners
        setupEventListeners();
        
        // Load saved reports if user is logged in
        checkLoginAndLoadReports();
    }
    
    // Set up event listeners for reports functionality
    function setupEventListeners() {
        const reportForm = document.getElementById('reportForm');
        
        if (reportForm) {
            reportForm.addEventListener('submit', function(e) {
                e.preventDefault();
                generateReport();
            });
        }
    }
    
    // Check if user is logged in and load reports
    function checkLoginAndLoadReports() {
        // Check session status
        fetch('../api/check_session.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // User is logged in, load reports
                    loadSavedReports();
                } else {
                    // User is not logged in, show message
                    const reportsList = document.getElementById('savedReportsList');
                    if (reportsList) {
                        reportsList.innerHTML = '<p class="no-reports">Tidak ada laporan tersimpan. Silakan login untuk melihat laporan Anda.</p>';
                    }
                }
            })
            .catch(error => {
                console.error('Error checking session:', error);
            });
    }
    
    // Generate a new report
    function generateReport() {
        // Get form values
        const title = document.getElementById('reportTitle').value;
        const description = document.getElementById('reportDescription').value;
        const indicator = document.getElementById('reportIndicator').value;
        const provinsi = document.getElementById('reportProvinsi').value;
        const format = document.getElementById('reportFormat').value;
        
        // Check if user is logged in
        fetch('../api/check_session.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // User is logged in, proceed with report generation
                    
                    // Show loading indicator
                    const submitBtn = document.querySelector('#reportForm button[type="submit"]');
                    if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.textContent = 'Membuat Laporan...';
                    }
                    
                    // Fetch data for report
                    fetch(`../api/get_sdgs.php?indikator=${indicator}${provinsi !== 'all' ? `&provinsi=${provinsi}` : ''}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.status === 'success') {
                                // Create report object
                                const reportData = {
                                    title: title,
                                    description: description,
                                    indicator: indicator,
                                    provinsi: provinsi,
                                    format: format,
                                    data: data.data
                                };
                                
                                // Save report to database
                                saveReport(reportData);
                            } else {
                                throw new Error(data.message || 'Failed to load data');
                            }
                        })
                        .catch(error => {
                            console.error('Error generating report:', error);
                            
                            // Reset button
                            if (submitBtn) {
                                submitBtn.disabled = false;
                                submitBtn.textContent = 'Buat Laporan';
                            }
                            
                            // Show error message
                            alert('Gagal membuat laporan. Silakan coba lagi nanti.');
                        });
                } else {
                    // User is not logged in, show login modal
                    alert('Silakan login terlebih dahulu untuk membuat laporan.');
                    
                    // Show login modal
                    const loginModal = document.getElementById('loginModal');
                    if (loginModal) {
                        loginModal.classList.add('show');
                    }
                }
            })
            .catch(error => {
                console.error('Error checking session:', error);
                alert('Terjadi kesalahan. Silakan coba lagi nanti.');
            });
    }
    
    // Save report to database
    function saveReport(reportData) {
        // Create report object to send to API
        const report = {
            title: reportData.title,
            description: reportData.description,
            content: JSON.stringify(reportData),
            format: reportData.format
        };
        
        // Send report to API
        fetch('../api/save_report.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(report)
        })
            .then(response => response.json())
            .then(data => {
                // Reset button
                const submitBtn = document.querySelector('#reportForm button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Buat Laporan';
                }
                
                if (data.status === 'success') {
                    // Show success message
                    alert('Laporan berhasil dibuat dan disimpan.');
                    
                    // Reset form
                    document.getElementById('reportForm').reset();
                    
                    // Reload saved reports
                    loadSavedReports();
                    
                    // If format is PDF or Excel, trigger download
                    if (reportData.format === 'pdf' || reportData.format === 'excel') {
                        // In a real app, this would trigger a download
                        // For now, we'll just simulate it
                        setTimeout(() => {
                            alert(`Unduhan laporan dalam format ${reportData.format.toUpperCase()} akan dimulai.`);
                        }, 1000);
                    }
                } else {
                    // Show error message
                    alert(data.message || 'Gagal menyimpan laporan. Silakan coba lagi nanti.');
                }
            })
            .catch(error => {
                console.error('Error saving report:', error);
                
                // Reset button
                const submitBtn = document.querySelector('#reportForm button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Buat Laporan';
                }
                
                // Show error message
                alert('Gagal menyimpan laporan. Silakan coba lagi nanti.');
            });
    }
    
    // Load saved reports from database
    function loadSavedReports() {
        // Fetch saved reports from API
        fetch('../api/get_reports.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const reportsList = document.getElementById('savedReportsList');
                if (!reportsList) return;
                
                if (data.status === 'success' && data.data && data.data.length > 0) {
                    // Clear existing reports
                    reportsList.innerHTML = '';
                    
                    // Add reports to list
                    data.data.forEach(report => {
                        const reportItem = document.createElement('div');
                        reportItem.className = 'report-item';
                        
                        // Parse report content
                        let content;
                        try {
                            content = JSON.parse(report.content);
                        } catch (e) {
                            content = { format: 'unknown' };
                        }
                        
                        // Format date
                        const date = new Date(report.created_at);
                        const formattedDate = date.toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                        
                        // Create report HTML
                        reportItem.innerHTML = `
                            <div class="report-info">
                                <h4>${report.title}</h4>
                                <p>${report.description || 'Tidak ada deskripsi'}</p>
                                <p class="report-meta">
                                    <span class="report-date">${formattedDate}</span>
                                    <span class="report-format">${content.format ? content.format.toUpperCase() : 'Unknown'}</span>
                                </p>
                            </div>
                            <div class="report-actions">
                                <button class="view-report" data-id="${report.id}">Lihat</button>
                                <button class="download-report" data-id="${report.id}" data-format="${content.format || 'pdf'}">Unduh</button>
                                <button class="delete-report" data-id="${report.id}">Hapus</button>
                            </div>
                        `;
                        
                        // Add report to list
                        reportsList.appendChild(reportItem);
                    });
                    
                    // Add event listeners to buttons
                    addReportButtonListeners();
                } else {
                    // No reports found
                    reportsList.innerHTML = '<p class="no-reports">Tidak ada laporan tersimpan.</p>';
                }
            })
            .catch(error => {
                console.error('Error loading reports:', error);
                
                // Show error message
                const reportsList = document.getElementById('savedReportsList');
                if (reportsList) {
                    reportsList.innerHTML = '<p class="no-reports">Gagal memuat laporan. Silakan coba lagi nanti.</p>';
                }
            });
    }
    
    // Add event listeners to report buttons
    function addReportButtonListeners() {
        // View report buttons
        const viewButtons = document.querySelectorAll('.view-report');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const reportId = this.getAttribute('data-id');
                viewReport(reportId);
            });
        });
        
        // Download report buttons
        const downloadButtons = document.querySelectorAll('.download-report');
        downloadButtons.forEach(button => {
            button.addEventListener('click', function() {
                const reportId = this.getAttribute('data-id');
                const format = this.getAttribute('data-format');
                downloadReport(reportId, format);
            });
        });
        
        // Delete report buttons
        const deleteButtons = document.querySelectorAll('.delete-report');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const reportId = this.getAttribute('data-id');
                deleteReport(reportId);
            });
        });
    }
    
    // View report details
    function viewReport(reportId) {
        // In a real app, this would open a modal with report details
        // For now, we'll just show an alert
        alert(`Melihat laporan dengan ID: ${reportId}`);
    }
    
    // Download report
    function downloadReport(reportId, format) {
        // In a real app, this would trigger a download
        // For now, we'll just show an alert
        alert(`Mengunduh laporan dengan ID: ${reportId} dalam format ${format.toUpperCase()}`);
    }
    
    // Delete report
    function deleteReport(reportId) {
        // Confirm deletion
        if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
            // Send delete request to API
            fetch(`../api/delete_report.php?id=${reportId}`, {
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Show success message
                        alert('Laporan berhasil dihapus.');
                        
                        // Reload saved reports
                        loadSavedReports();
                    } else {
                        // Show error message
                        alert(data.message || 'Gagal menghapus laporan. Silakan coba lagi nanti.');
                    }
                })
                .catch(error => {
                    console.error('Error deleting report:', error);
                    alert('Gagal menghapus laporan. Silakan coba lagi nanti.');
                });
        }
    }
    
    // Initialize reports
    initReports();
});
