// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .about-img, .section-header');
animateElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Enhanced parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && window.innerWidth > 768) {
        // Only apply parallax on desktop to avoid mobile performance issues
        const speed = 0.3;
        hero.style.backgroundPositionY = `${scrolled * speed}px`;
    }
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = this.querySelector('.cta-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Gmail redirect function for magazine form
function sendToGmail() {
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const project = document.getElementById('project').value;
    const message = document.getElementById('message').value;
    
    // Basic validation
    if (!name || !email || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Create email subject and body
    const subject = encodeURIComponent(`New Project Inquiry from ${name}`);
    const projectType = project ? `Project Type: ${project}\n\n` : '';
    const emailBody = encodeURIComponent(
        `Hello Kentucky Red,\n\n` +
        `I'm interested in working with you on a project.\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `${projectType}` +
        `Message:\n${message}\n\n` +
        `Looking forward to hearing from you!\n\n` +
        `Best regards,\n${name}`
    );
    
    // Detect if user is on mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // For mobile devices, try Gmail app first, then fallback to mailto
        const gmailAppUrl = `googlegmail://co?to=kentucky.red@icloud.com&su=${subject}&body=${emailBody}`;
        const mailtoUrl = `mailto:kentucky.red@icloud.com?subject=${subject}&body=${emailBody}`;
        
        // Try to open Gmail app
        const link = document.createElement('a');
        link.href = gmailAppUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Fallback to mailto after a short delay
        setTimeout(() => {
            window.location.href = mailtoUrl;
        }, 500);
        
        showNotification('Opening email app...', 'success');
    } else {
        // For desktop, use Gmail web interface
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=kentucky.red@icloud.com&su=${subject}&body=${emailBody}`;
        window.open(gmailUrl, '_blank');
        showNotification('Redirecting to Gmail...', 'success');
    }
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.7;
    }
`;
document.head.appendChild(notificationStyles);

// Portfolio image lazy loading
const portfolioImages = document.querySelectorAll('.portfolio-image, .service-image, .about-img');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

portfolioImages.forEach(img => {
    imageObserver.observe(img);
});

// Sticky CTA button hide/show on scroll
let lastScrollTop = 0;
const stickyCTA = document.querySelector('.sticky-cta');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 200) {
        // Scrolling down
        stickyCTA.style.transform = 'translateY(100px)';
    } else {
        // Scrolling up
        stickyCTA.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Add loading animation for images
const imageLoadingStyles = document.createElement('style');
imageLoadingStyles.textContent = `
    .hero-image,
    .portfolio-image,
    .service-image,
    .about-img {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .hero-image:not(.loaded),
    .portfolio-image:not(.loaded),
    .service-image:not(.loaded),
    .about-img:not(.loaded) {
        opacity: 0.7;
    }
    
    .hero-image.loaded,
    .portfolio-image.loaded,
    .service-image.loaded,
    .about-img.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(imageLoadingStyles);

// Initialize all images as loaded (since we're not using lazy loading for src)
portfolioImages.forEach(img => {
    img.classList.add('loaded');
});

// Add smooth reveal animation for text content
const textElements = document.querySelectorAll('.about-text p, .contact-info p, .service-card p');
textElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Enhanced scroll indicator functionality
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Hide scroll indicator after scrolling
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

// Add hover effects for portfolio items
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.zIndex = '10';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.zIndex = '1';
    });
});

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'images/1.jpg',
        'images/3.jpg',
        'images/4.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();

// Add resize handler for responsive adjustments
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

console.log('Kentucky Red website initialized successfully!');