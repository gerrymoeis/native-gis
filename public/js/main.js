/**
 * SDGs Dashboard untuk Bonus Demografi Indonesia
 * Main JavaScript File - Handles navigation and common functionality
 */

// Initialize app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize app
    initApp();
    
    // Set up navigation
    setupNavigation();
    
    // Set up mobile menu
    setupMobileMenu();
    
    // Set up hero buttons
    setupHeroButtons();
});

// Initialize app
function initApp() {
    // Add loading animation to body
    document.body.classList.add('loaded');
    
    // Initialize particles background
    initParticles();
}

// Set up navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a[data-page], .footer-links a[data-page]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get page id from data attribute
            const pageId = this.getAttribute('data-page');
            
            // Navigate to page
            navigateToPage(pageId);
            
            // Close mobile menu if open
            const nav = document.querySelector('nav');
            if (nav.classList.contains('show')) {
                nav.classList.remove('show');
            }
        });
    });
}

// Navigate to specific page
function navigateToPage(pageId) {
    // Get all pages
    const pages = document.querySelectorAll('.page');
    
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
        
        // Update active link in navigation
        const navLinks = document.querySelectorAll('nav a[data-page]');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Update URL hash
        window.location.hash = pageId;
    }
}

// Set up mobile menu
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('show');
        });
    }
}

// Set up hero buttons
function setupHeroButtons() {
    const exploreMapBtn = document.getElementById('exploreMapBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    
    if (exploreMapBtn) {
        exploreMapBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToPage('map');
        });
    }
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToPage('about');
        });
    }
}

// Initialize particles background
function initParticles() {
    const particles = document.querySelector('.particles');
    if (!particles) return;
    
    // In a real app, this would initialize a particle library
    // For now, we'll just use CSS background
}

// Check URL hash on page load
window.addEventListener('load', function() {
    // Get page id from URL hash
    const hash = window.location.hash.substring(1);
    
    // Navigate to page if hash exists
    if (hash && document.getElementById(hash)) {
        navigateToPage(hash);
    }
});
