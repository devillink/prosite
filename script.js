// Spline 3D Scene Integration using Spline Viewer component
class SplineBackground {
    constructor() {
        this.isLoading = true;
        this.splineViewer = null;
        this.init();
    }

    async init() {
        try {
            // Wait for Spline viewer to be ready
            await this.waitForSplineViewer();

            // Get reference to the spline-viewer element
            this.splineViewer = document.querySelector('spline-viewer');

            if (this.splineViewer) {
                // Add load event listener
                this.splineViewer.addEventListener('load', () => {
                    this.onSplineLoad();
                });

                // Add error event listener
                this.splineViewer.addEventListener('error', (error) => {
                    this.onSplineError(error);
                });

                console.log('Spline viewer initialized successfully!');
            } else {
                throw new Error('Spline viewer element not found');
            }

        } catch (error) {
            console.error('Error initializing Spline background:', error);
            this.showError();
        }
    }

    waitForSplineViewer() {
        return new Promise((resolve, reject) => {
            // Check if spline-viewer is already available
            if (document.querySelector('spline-viewer')) {
                resolve();
                return;
            }

            // Wait for the script to load and element to be available
            const checkInterval = setInterval(() => {
                if (document.querySelector('spline-viewer')) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);

            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                reject(new Error('Spline viewer script failed to load'));
            }, 10000);
        });
    }

    onSplineLoad() {
        this.isLoading = false;
        console.log('Spline scene loaded successfully!');

        // Add fade-in effect
        if (this.splineViewer) {
            this.splineViewer.style.opacity = '0';
            this.splineViewer.style.transition = 'opacity 1s ease';

            setTimeout(() => {
                this.splineViewer.style.opacity = '1';
            }, 500);
        }
    }

    onSplineError(error) {
        console.error('Spline viewer error:', error);
        this.showError();
    }

    showError() {
        // Use gradient background as fallback
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

        // Show loading message
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'spline-loading';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            text-align: center;
            z-index: -1;
            font-size: 1.2em;
        `;
        loadingDiv.innerHTML = `
            <h2>3D Scene Loading...</h2>
            <p>Using fallback background</p>
        `;
        document.body.appendChild(loadingDiv);
    }
}

// Navigation functionality
class Navigation {
    constructor() {
        this.navDropdownToggle = document.getElementById('nav-dropdown-toggle');
        this.navDropdownMenu = document.getElementById('nav-dropdown-menu');
        this.navDropdownLinks = document.querySelectorAll('.nav-dropdown-link');

        this.init();
    }

    init() {
        // Toggle dropdown menu
        if (this.navDropdownToggle) {
            this.navDropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }

        // Close dropdown when clicking on a link
        this.navDropdownLinks.forEach(link => {
            link.addEventListener('click', () => this.closeDropdown());
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navDropdownToggle?.contains(e.target) && !this.navDropdownMenu?.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Smooth scrolling for navigation links
        this.navDropdownLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => this.updateNavbar());
    }

    toggleDropdown() {
        const isActive = this.navDropdownToggle.classList.contains('active');
        if (isActive) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    openDropdown() {
        this.navDropdownToggle.classList.add('active');
        this.navDropdownMenu.classList.add('active');
    }

    closeDropdown() {
        this.navDropdownToggle?.classList.remove('active');
        this.navDropdownMenu?.classList.remove('active');
    }

    updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }
}

// Portfolio items interaction
class Portfolio {
    constructor() {
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        this.init();
    }

    init() {
        this.portfolioItems.forEach((item, index) => {
            // Add staggered animation delay
            item.style.animationDelay = `${index * 0.1}s`;

            // Add click interaction
            item.addEventListener('click', () => {
                console.log(`Portfolio item ${index + 1} clicked`);
                // Here you could add modal or navigation to detail page
            });
        });
    }
}

// Contact form handling
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Simple validation
        if (name && email && message) {
            console.log('Form submitted:', { name, email, message });

            // Show success message (you would typically send this to a server)
            this.showMessage('Message sent successfully!', 'success');
            this.form.reset();
        } else {
            this.showMessage('Please fill in all fields', 'error');
        }
    }

    showMessage(text, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            padding: 10px 15px;
            border-radius: 5px;
            margin-top: 15px;
            font-weight: 500;
            ${type === 'success'
                ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;'
                : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;

        this.form.appendChild(message);

        // Remove message after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.service-card, .portfolio-item, .stat');
        this.init();
    }

    init() {
        // Intersection Observer for scroll animations
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, options);

        this.elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize Spline 3D background
        const background = new SplineBackground();

        // Initialize navigation
        const navigation = new Navigation();

        // Initialize portfolio interactions
        const portfolio = new Portfolio();

        // Initialize contact form
        const contactForm = new ContactForm();

        // Initialize scroll animations
        const scrollAnimations = new ScrollAnimations();

        // Add loading animation
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);

    } catch (error) {
        console.error('Error initializing application:', error);
    }
});

// Performance optimization
window.addEventListener('blur', () => {
    // Pause animations when tab is not visible
    document.querySelectorAll('.service-card, .portfolio-item, .stat').forEach(element => {
        element.style.animationPlayState = 'paused';
    });
});

window.addEventListener('focus', () => {
    // Resume animations when tab becomes visible
    document.querySelectorAll('.service-card, .portfolio-item, .stat').forEach(element => {
        element.style.animationPlayState = 'running';
    });
});