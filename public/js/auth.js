/**
 * SDGs Dashboard untuk Bonus Demografi Indonesia
 * Authentication Module - Handles user login, registration, and session management
 */

// Initialize authentication when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginBtn = document.getElementById('loginBtn');
    const registerLink = document.getElementById('registerLink');
    const loginLink = document.getElementById('loginLink');
    const closeButtons = document.querySelectorAll('.close');
    
    // Form elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Initialize authentication
    function initAuth() {
        // Set up event listeners
        setupEventListeners();
        
        // Check if user is already logged in
        checkSession();
    }
    
    // Set up event listeners for authentication
    function setupEventListeners() {
        // Login button
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showLoginModal();
            });
        }
        
        // Register link in login modal
        if (registerLink) {
            registerLink.addEventListener('click', function(e) {
                e.preventDefault();
                hideLoginModal();
                showRegisterModal();
            });
        }
        
        // Login link in register modal
        if (loginLink) {
            loginLink.addEventListener('click', function(e) {
                e.preventDefault();
                hideRegisterModal();
                showLoginModal();
            });
        }
        
        // Close buttons for modals
        if (closeButtons) {
            closeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    hideLoginModal();
                    hideRegisterModal();
                });
            });
        }
        
        // Close modals when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                hideLoginModal();
            }
            if (e.target === registerModal) {
                hideRegisterModal();
            }
        });
        
        // Login form submission
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleLogin();
            });
        }
        
        // Register form submission
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleRegister();
            });
        }
    }
    
    // Show login modal
    function showLoginModal() {
        if (loginModal) {
            loginModal.classList.add('show');
        }
    }
    
    // Hide login modal
    function hideLoginModal() {
        if (loginModal) {
            loginModal.classList.remove('show');
        }
    }
    
    // Show register modal
    function showRegisterModal() {
        if (registerModal) {
            registerModal.classList.add('show');
        }
    }
    
    // Hide register modal
    function hideRegisterModal() {
        if (registerModal) {
            registerModal.classList.remove('show');
        }
    }
    
    // Handle login form submission
    function handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validate input
        if (!username || !password) {
            alert('Silakan isi semua field.');
            return;
        }
        
        // Disable submit button
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Memproses...';
        }
        
        // Create login data
        const loginData = {
            username: username,
            password: password
        };
        
        // Send login request to API
        fetch('../api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
            .then(response => response.json())
            .then(data => {
                // Reset button
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Masuk';
                }
                
                if (data.status === 'success') {
                    // Login successful
                    hideLoginModal();
                    
                    // Update UI for logged in user
                    updateUIForLoggedInUser(data.data);
                    
                    // Show success message
                    alert('Login berhasil. Selamat datang!');
                    
                    // Reset form
                    loginForm.reset();
                } else {
                    // Login failed
                    alert(data.message || 'Login gagal. Silakan coba lagi.');
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                
                // Reset button
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Masuk';
                }
                
                // Show error message
                alert('Terjadi kesalahan. Silakan coba lagi nanti.');
            });
    }
    
    // Handle register form submission
    function handleRegister() {
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // Validate input
        if (!username || !email || !password || !confirmPassword) {
            alert('Silakan isi semua field.');
            return;
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Password tidak cocok.');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Format email tidak valid.');
            return;
        }
        
        // Validate password strength
        if (password.length < 6) {
            alert('Password harus minimal 6 karakter.');
            return;
        }
        
        // Disable submit button
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Memproses...';
        }
        
        // Create register data
        const registerData = {
            username: username,
            email: email,
            password: password
        };
        
        // Send register request to API
        fetch('../api/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        })
            .then(response => response.json())
            .then(data => {
                // Reset button
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Daftar';
                }
                
                if (data.status === 'success') {
                    // Registration successful
                    hideRegisterModal();
                    
                    // Show success message
                    alert('Pendaftaran berhasil. Silakan login.');
                    
                    // Reset form
                    registerForm.reset();
                    
                    // Show login modal
                    showLoginModal();
                } else {
                    // Registration failed
                    alert(data.message || 'Pendaftaran gagal. Silakan coba lagi.');
                }
            })
            .catch(error => {
                console.error('Error during registration:', error);
                
                // Reset button
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Daftar';
                }
                
                // Show error message
                alert('Terjadi kesalahan. Silakan coba lagi nanti.');
            });
    }
    
    // Check if user is already logged in
    function checkSession() {
        fetch('../api/check_session.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // User is logged in
                    updateUIForLoggedInUser(data.data);
                }
            })
            .catch(error => {
                console.error('Error checking session:', error);
            });
    }
    
    // Update UI for logged in user
    function updateUIForLoggedInUser(userData) {
        // Update login button
        if (loginBtn) {
            loginBtn.textContent = 'Keluar';
            loginBtn.removeEventListener('click', showLoginModal);
            loginBtn.addEventListener('click', handleLogout);
        }
        
        // Update reports section if it exists
        const savedReportsList = document.getElementById('savedReportsList');
        if (savedReportsList) {
            // If we're on the reports page, load reports
            if (document.getElementById('reports').classList.contains('active')) {
                // This function would be defined in reports.js
                if (typeof loadSavedReports === 'function') {
                    loadSavedReports();
                }
            }
        }
        
        // Add user info to header if needed
        const nav = document.querySelector('nav ul');
        if (nav) {
            // Check if user info already exists
            if (!document.getElementById('userInfo')) {
                const userInfoLi = document.createElement('li');
                userInfoLi.id = 'userInfo';
                userInfoLi.innerHTML = `<span>Halo, ${userData.username}</span>`;
                
                // Insert before login/logout button
                nav.insertBefore(userInfoLi, loginBtn.parentElement);
            }
        }
    }
    
    // Handle logout
    function handleLogout(e) {
        e.preventDefault();
        
        // Send logout request to API
        fetch('../api/logout.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Logout successful
                    
                    // Update login button
                    if (loginBtn) {
                        loginBtn.textContent = 'Masuk';
                        loginBtn.removeEventListener('click', handleLogout);
                        loginBtn.addEventListener('click', showLoginModal);
                    }
                    
                    // Remove user info
                    const userInfo = document.getElementById('userInfo');
                    if (userInfo) {
                        userInfo.remove();
                    }
                    
                    // Update reports section if it exists
                    const savedReportsList = document.getElementById('savedReportsList');
                    if (savedReportsList) {
                        savedReportsList.innerHTML = '<p class="no-reports">Tidak ada laporan tersimpan. Silakan login untuk melihat laporan Anda.</p>';
                    }
                    
                    // Show success message
                    alert('Logout berhasil.');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
                alert('Terjadi kesalahan. Silakan coba lagi nanti.');
            });
    }
    
    // Initialize authentication
    initAuth();
});
