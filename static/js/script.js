// script.js
// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    // Select dropdown elements on the main index.html page
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    // --- Utility Functions ---

    // Set body padding for fixed header to prevent content overlap
    function setBodyPadding() {
        const header = document.querySelector('.header');
        // Ensure the header element exists before trying to get its height
        if (header) {
            document.body.style.paddingTop = `${header.offsetHeight}px`;
        }
    }
    
    function closeMobileMenu() {
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            // Reset hamburger icon animation if custom styles are used in CSS
        }
        // Also ensure dropdown is closed when main menu closes (mobile only)
        if (dropdownMenu && dropdownMenu.classList.contains('active')) {
            dropdownMenu.classList.remove('active');
            // Check if the caret exists before querying it
            const caret = dropdownToggle ? dropdownToggle.querySelector('.fa-caret-down') : null;
            if (caret) {
                caret.style.transform = 'rotate(0deg)';
            }
        }
    }

    // --- Event Listeners ---
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Dropdown toggle for mobile view 
    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', function(e) {
            // Only handle the click/toggle if the screen is mobile size (< 992px)
            if (window.innerWidth < 992) {
                e.preventDefault();
                dropdownMenu.classList.toggle('active');
                const caret = dropdownToggle.querySelector('.fa-caret-down');
                if (dropdownMenu.classList.contains('active')) {
                    caret.style.transform = 'rotate(180deg)';
                } else {
                    caret.style.transform = 'rotate(0deg)';
                }
            }
            // On desktop (> 992px), the anchor link will work normally and CSS handles hover
        });
    }
    
    // Testimonial Slider (Existing Logic)
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;
    
    function showTestimonial(n) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentTestimonial = (n + testimonials.length) % testimonials.length;
        
        if (testimonials[currentTestimonial]) {
            testimonials[currentTestimonial].classList.add('active');
            dots[currentTestimonial].classList.add('active');
        }
    }

    if (testimonials.length > 0) {
        // Auto slide testimonials
        setInterval(() => {
            showTestimonial(currentTestimonial + 1);
        }, 5000);
        
        // Dot click events
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showTestimonial(index);
            });
        });
    }
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                // Ensure a smooth transition for the fixed header
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = '#fff';
                header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Prevent default scrolling only if it's an anchor link for smooth scroll
                e.preventDefault(); 
                const headerHeight = document.querySelector('.header').offsetHeight;

                // Scroll to the target element, factoring in the fixed header's height
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
    
    // Form submission feedback
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('success')) {
        alert('Thank you for your enquiry! We will get back to you soon.');
    }
    if (urlParams.has('error')) {
        alert('Sorry, there was an error sending your enquiry. Please try again or contact us directly.');
    }

    // Initial body padding set
    setBodyPadding();

    // Update on resize (e.g., orientation change or window resize)
    window.addEventListener('resize', setBodyPadding);
});