// script.js
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.header');
    const infoBar = document.querySelector('.info-bar');
    
    // Define the desired gap height
    const GAP_HEIGHT = 10; // 10 pixels gap between fixed elements and content
    
    // --- Mobile Menu Toggle ---
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            // Recalculate padding after menu state change
            if (!nav.classList.contains('active')) {
                // Wait for menu transition to complete before calculating scroll offset
                setTimeout(setBodyPadding, 400); 
            }
        });
        // Simple fix for mobile dropdown visibility
        const productDropdown = document.querySelector('.nav .dropdown > a');
        if (productDropdown) {
             productDropdown.addEventListener('click', function(e) {
                // Only prevent default if we are in mobile view where the menu is active
                if (nav.classList.contains('active')) {
                    e.preventDefault();
                    const subMenu = this.nextElementSibling;
                    if (subMenu) {
                        subMenu.style.display = subMenu.style.display === 'block' ? 'none' : 'block';
                    }
                }
            });
        }
    }
    
    // --- Testimonial Slider ---
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;
    let autoSlideInterval;
    
    function showTestimonial(n) {
        clearInterval(autoSlideInterval);
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        currentTestimonial = (n + testimonials.length) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
        dots[currentTestimonial].classList.add('active');
        startAutoSlide();
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            showTestimonial(currentTestimonial + 1);
        }, 5000);
    }

    if (testimonials.length > 0) {
        showTestimonial(0); // Show initial testimonial
        startAutoSlide();
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });

    // --- Header scroll effect and Padding Fix (Gap Fix) ---
    function updateHeaderStyle() {
        requestAnimationFrame(() => {
            if (window.scrollY > 100) {
                // Shrink header on scroll
                header.style.padding = '10px 0';
            } else {
                // Restore original padding at the top
                if (window.innerWidth >= 992) {
                     header.style.padding = '18px 0 10px 0';
                } else {
                    header.style.padding = '18px 0';
                }
            }
            // IMPORTANT: Call setBodyPadding again because header height changes on scroll
            setBodyPadding();
        });
    }

    function setBodyPadding() {
        requestAnimationFrame(() => {
            // Use getBoundingClientRect().height for accurate computed height
            const headerHeight = header.getBoundingClientRect().height;
            const infoBarHeight = infoBar ? infoBar.getBoundingClientRect().height : 0; 
            
            // Total fixed height (Header + InfoBar) + Desired Gap
            const totalFixedOffset = headerHeight + infoBarHeight + GAP_HEIGHT;

            // 1. Set padding-top on body to push content below the fixed elements + gap
            document.body.style.paddingTop = `${totalFixedOffset}px`;

            // 2. Set the info-bar's top position to be exactly at the bottom of the header
            if(infoBar) {
                infoBar.style.top = `${headerHeight}px`;
                infoBar.style.marginTop = '0'; // Clear previous setting
            }
            
            // Note: The gap is visually achieved by the body padding, pushing the first section (hero) down.
        });
    }

    window.addEventListener('scroll', updateHeaderStyle);
    window.addEventListener('resize', setBodyPadding);
    
    // Initial calls
    updateHeaderStyle(); // This calls setBodyPadding initially
    
    // --- Smooth scrolling for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // If it's a menu link or button link, prevent default to handle scroll
                if(this.closest('.nav') || this.classList.contains('btn') || targetId === '#home') {
                    e.preventDefault();
                }

                // Close mobile menu if open
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    // Give menu time to transition out before final scroll
                    setTimeout(() => {
                       // Scroll to element with offset for fixed header + gap
                       const offset = header.getBoundingClientRect().height + (infoBar ? infoBar.getBoundingClientRect().height : 0) + GAP_HEIGHT;
                       
                       window.scrollTo({
                           top: targetElement.offsetTop - offset,
                           behavior: 'smooth'
                       });
                    }, 400); 
                } else {
                     // Direct scroll calculation
                     const offset = header.getBoundingClientRect().height + (infoBar ? infoBar.getBoundingClientRect().height : 0) + GAP_HEIGHT;

                     window.scrollTo({
                         top: targetElement.offsetTop - offset,
                         behavior: 'smooth'
                     });
                }
            }
        });
    });
    
    // --- Form submission feedback ---
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('success')) {
        alert('Thank you for your enquiry! We will get back to you soon.');
        history.replaceState(null, null, window.location.pathname);
    }
    if (urlParams.has('error')) {
        alert('Sorry, there was an error sending your enquiry. Please try again or contact us directly.');
        history.replaceState(null, null, window.location.pathname);
    }
});