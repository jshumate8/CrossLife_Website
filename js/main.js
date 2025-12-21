// CrossLife Ministry Website - Main JavaScript

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!event.target.closest('.navbar')) {
                navLinks.classList.remove('active');
                if (mobileMenuToggle) {
                    mobileMenuToggle.classList.remove('active');
                }
            }
        }
    });
    
    // Study/Teaching Filtering
    initializeFilters();
    
    // Contact Form Handling
    initializeContactForm();
    
    // Smooth scroll for anchor links
    initializeSmoothScroll();
    
    // Initialize Netlify Identity
    initNetlifyIdentity();
});

// Filter functionality for studies and teachings pages
function initializeFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const seriesFilter = document.getElementById('series-filter');
    const formatFilter = document.getElementById('format-filter');
    const searchInput = document.getElementById('search-studies');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterContent);
    }
    
    if (seriesFilter) {
        seriesFilter.addEventListener('change', filterContent);
    }
    
    if (formatFilter) {
        formatFilter.addEventListener('change', filterContent);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterContent, 300));
    }
}

function filterContent() {
    const categoryFilter = document.getElementById('category-filter');
    const seriesFilter = document.getElementById('series-filter');
    const formatFilter = document.getElementById('format-filter');
    const searchInput = document.getElementById('search-studies');
    
    const categoryValue = categoryFilter ? categoryFilter.value : 'all';
    const seriesValue = seriesFilter ? seriesFilter.value : 'all';
    const formatValue = formatFilter ? formatFilter.value : 'all';
    const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Filter study cards
    const studyCards = document.querySelectorAll('.study-card');
    studyCards.forEach(card => {
        const category = card.dataset.category || '';
        const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
        const description = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
        
        const categoryMatch = categoryValue === 'all' || category === categoryValue;
        const searchMatch = searchValue === '' || title.includes(searchValue) || description.includes(searchValue);
        
        if (categoryMatch && searchMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Filter teaching items
    const teachingItems = document.querySelectorAll('.teaching-item');
    teachingItems.forEach(item => {
        const format = item.dataset.format || '';
        const series = item.dataset.series || '';
        
        const formatMatch = formatValue === 'all' || format === formatValue;
        const seriesMatch = seriesValue === 'all' || series === seriesValue;
        
        if (formatMatch && seriesMatch) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Contact Form Handling
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const formResponse = document.getElementById('form-response');
            
            // Basic client-side validation
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            if (!name || !email || !subject || !message) {
                showFormResponse('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormResponse('Please enter a valid email address.', 'error');
                return;
            }
            
            // Validate form inputs for security
            const validationErrors = validateFormInput(formData);
            if (validationErrors.length > 0) {
                showFormResponse('Invalid input detected. Please check your entries.', 'error');
                console.error('Form validation errors:', validationErrors);
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Here you would normally send the form data to your backend
            // For now, we'll just simulate a successful submission
            // 
            // Example with Formspree:
            // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            //     method: 'POST',
            //     body: formData,
            //     headers: {
            //         'Accept': 'application/json'
            //     }
            // });
            
            // Simulate API call
            setTimeout(() => {
                showFormResponse('Thank you for your message! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }, 1500);
            
            // For actual implementation, uncomment this:
            /*
            try {
                // Replace with your actual form handling endpoint
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    showFormResponse('Thank you for your message! We\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showFormResponse('Something went wrong. Please try again later.', 'error');
                }
            } catch (error) {
                showFormResponse('Network error. Please try again later.', 'error');
            }
            
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            */
        });
    }
}

function showFormResponse(message, type) {
    const formResponse = document.getElementById('form-response');
    if (formResponse) {
        formResponse.textContent = message;
        formResponse.className = 'form-response ' + type;
        formResponse.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formResponse.style.display = 'none';
        }, 5000);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sanitize user input to prevent XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Validate phone number format
function isValidPhone(phone) {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    // Allow 10-15 digits (accommodates international formats)
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

// Validate form inputs to prevent injection attacks
function validateFormInput(formData) {
    const errors = [];
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,  // Event handlers like onclick=
        /<iframe/gi,
        /<object/gi,
        /<embed/gi
    ];
    
    for (let [key, value] of formData.entries()) {
        if (typeof value === 'string') {
            for (let pattern of suspiciousPatterns) {
                if (pattern.test(value)) {
                    errors.push(`Invalid content detected in ${key} field`);
                    break;
                }
            }
            
            // Check for excessively long inputs
            if (value.length > 5000) {
                errors.push(`${key} field exceeds maximum length`);
            }
        }
    }
    
    return errors;
}

// Smooth scroll for anchor links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Lazy loading for images (optional enhancement)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add active class to current page in navigation
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Call on page load
setActiveNavLink();

// Netlify Identity - centralized authentication handling
function initNetlifyIdentity() {
    if (typeof netlifyIdentity === 'undefined') return;
    
    const loginBtn = document.getElementById('loginBtn');
    
    // Login button handler
    if (loginBtn) {
        loginBtn.onclick = function() {
            netlifyIdentity.currentUser() ? netlifyIdentity.logout() : netlifyIdentity.open();
        };
    }
    
    // Update UI based on auth state
    netlifyIdentity.on('init', updateAuthUI);
    netlifyIdentity.on('login', function(user) {
        netlifyIdentity.close();
        updateAuthUI(user);
    });
    netlifyIdentity.on('logout', function() {
        location.reload();
    });
}

function updateAuthUI(user) {
    const loginBtn = document.getElementById('loginBtn');
    const navStudies = document.getElementById('nav-studies');
    const navTeachings = document.getElementById('nav-teachings');
    const navResources = document.getElementById('nav-resources');
    
    if (user) {
        if (loginBtn) loginBtn.textContent = 'Logout';
        if (navStudies) navStudies.style.display = 'list-item';
        if (navTeachings) navTeachings.style.display = 'list-item';
        if (navResources) navResources.style.display = 'list-item';
    } else {
        if (loginBtn) loginBtn.textContent = 'Login';
        if (navStudies) navStudies.style.display = 'none';
        if (navTeachings) navTeachings.style.display = 'none';
        if (navResources) navResources.style.display = 'none';
    }
}

// Protected page check - call this from protected pages
function requireAuth() {
    if (typeof netlifyIdentity === 'undefined') {
        window.location.href = '/index.html';
        return;
    }
    
    netlifyIdentity.on('init', function(user) {
        if (!user) {
            window.location.href = '/index.html';
        } else {
            updateAuthUI(user);
        }
    });
    
    netlifyIdentity.on('logout', function() {
        window.location.href = '/index.html';
    });
}
