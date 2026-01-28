document.addEventListener('DOMContentLoaded', () => {

    // --- Smart Header ---
    const initSmartHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;

        // Add initial transparent class
        header.classList.add('site-header--transparent');

        const toggleHeader = () => {
            const scrollY = window.scrollY;
            const heroHeight = window.innerHeight * 0.6; // Switch at 60% of hero

            if (scrollY > heroHeight) {
                header.classList.remove('site-header--transparent');
                header.classList.add('site-header--solid');
            } else {
                header.classList.remove('site-header--solid');
                header.classList.add('site-header--transparent');
            }
        };

        // Throttle scroll events for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    toggleHeader();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial check
        toggleHeader();
    };

    // --- Mobile Navigation Toggle ---
    const initMobileNav = () => {
        const navToggle = document.querySelector('.nav-toggle');
        const primaryNav = document.querySelector('#primary-navigation');

        if (navToggle && primaryNav) {
            navToggle.addEventListener('click', () => {
                const isVisible = primaryNav.getAttribute('data-visible') === 'true';
                primaryNav.setAttribute('data-visible', !isVisible);
                navToggle.setAttribute('aria-expanded', !isVisible);

                // Prevent body scroll when menu is open
                document.body.style.overflow = isVisible ? '' : 'hidden';
            });

            // Close menu when clicking on a link
            const navLinks = primaryNav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    primaryNav.setAttribute('data-visible', 'false');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });
        }
    };

    // --- Scroll Animations with IntersectionObserver ---
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .card');

        if (animatedElements.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stop observing once visible (one-time animation)
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));

        // Handle staggered children
        const staggerContainers = document.querySelectorAll('.stagger-children');
        staggerContainers.forEach(container => {
            observer.observe(container);
        });
    };

    // --- Project Filtering ---
    const initProjectFiltering = () => {
        const filterTabs = document.querySelectorAll('.filter-tab');
        const projectCards = document.querySelectorAll('.card[data-category]');

        if (filterTabs.length === 0 || projectCards.length === 0) return;

        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.getAttribute('data-filter');

                // Filter cards
                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category').split(' ');

                    if (filter === 'all' || categories.includes(filter)) {
                        card.classList.remove('hidden');
                        // Small delay for smoother appearance
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                        card.classList.remove('visible');
                    }
                });
            });
        });
    };

    // --- Project Page Prev/Next Navigation ---
    const initProjectNav = () => {
        const projectNavContainer = document.querySelector('.project-nav');
        if (!projectNavContainer) return;

        const projects = [
            'egg-mover.html',
            'ros2-mobile-robot.html',
            'weather-satellite.html',
            'low-cost-gc.html',
            'heat-sink.html',
            'light-sport-aircraft.html',
            'drone-project.html',
            'spacecraft-control.html',
            'quick-return.html'
        ];

        const titles = {
            'egg-mover.html': 'Egg Mover Project',
            'ros2-mobile-robot.html': 'ROS2 Mobile Robot',
            'weather-satellite.html': 'Weather Satellite',
            'low-cost-gc.html': 'Low Cost GC',
            'heat-sink.html': 'Heat Sink',
            'light-sport-aircraft.html': 'Light Sport Aircraft',
            'drone-project.html': 'Drone Project',
            'spacecraft-control.html': 'Spacecraft Attitude Dynamics and Control',
            'quick-return.html': 'Crank, Link, Repeat - Quick-Return Dynamics'
        };

        const currentPage = window.location.pathname.split('/').pop() || projects[1];
        const currentIndex = projects.indexOf(currentPage);

        if (currentIndex !== -1) {
            const prevLinkContainer = document.querySelector('.prev-link-container');
            const nextLinkContainer = document.querySelector('.next-link-container');

            if (currentIndex > 0 && prevLinkContainer) {
                const prevPage = projects[currentIndex - 1];
                const prevTitle = titles[prevPage];
                const prevLink = document.createElement('a');
                prevLink.href = `./${prevPage}`;
                prevLink.textContent = `← ${prevTitle}`;
                prevLinkContainer.appendChild(prevLink);
            }

            if (currentIndex < projects.length - 1 && nextLinkContainer) {
                const nextPage = projects[currentIndex + 1];
                const nextTitle = titles[nextPage];
                const nextLink = document.createElement('a');
                nextLink.href = `./${nextPage}`;
                nextLink.textContent = `${nextTitle} →`;
                nextLinkContainer.appendChild(nextLink);
            }
        }
    };

    // --- Contact Form Client-Side Validation ---
    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const emailField = document.getElementById('email');
        const nameField = document.getElementById('name');
        const messageField = document.getElementById('message');

        const showError = (field, message) => {
            const formGroup = field.parentElement;
            formGroup.classList.add('error');
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) errorElement.textContent = message;
        };

        const clearError = (field) => {
            const formGroup = field.parentElement;
            formGroup.classList.remove('error');
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) errorElement.textContent = '';
        };

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Clear previous errors
            if (nameField) clearError(nameField);
            if (emailField) clearError(emailField);
            if (messageField) clearError(messageField);

            // Validate Name
            if (nameField && nameField.value.trim() === '') {
                showError(nameField, 'Name cannot be empty.');
                isValid = false;
            }

            // Validate Email
            if (emailField) {
                if (emailField.value.trim() === '') {
                    showError(emailField, 'Email cannot be empty.');
                    isValid = false;
                } else if (!emailField.checkValidity()) {
                    showError(emailField, 'Please enter a valid email address.');
                    isValid = false;
                }
            }

            // Validate Message
            if (messageField && messageField.value.trim() === '') {
                showError(messageField, 'Message cannot be empty.');
                isValid = false;
            }

            if (isValid) {
                const name = encodeURIComponent(nameField ? nameField.value.trim() : '');
                const subject = encodeURIComponent(`Contact from ${name}`);
                const body = encodeURIComponent(messageField ? messageField.value.trim() : '');
                const email = 'utkarshsheel@gmail.com';

                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
            }
        });
    };

    // --- Smooth Scroll for Anchor Links ---
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
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
    };

    // Initialize all scripts
    initSmartHeader();
    initMobileNav();
    initScrollAnimations();
    initProjectFiltering();
    initProjectNav();
    initContactForm();
    initSmoothScroll();
});
