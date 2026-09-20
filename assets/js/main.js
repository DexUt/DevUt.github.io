/* Mark the document as JS-enabled as early as possible so scroll animations
   only hide content when JavaScript can reveal it again. */
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {

    // --- Smart Header ---
    const initSmartHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;

        const hasHero = !!document.querySelector('.hero');

        // Pages without a full-height hero start with a solid header so the
        // navigation always sits on a readable surface.
        if (!hasHero) {
            header.classList.add('site-header--solid');
            return;
        }

        header.classList.add('site-header--transparent');

        const toggleHeader = () => {
            const threshold = window.innerHeight * 0.6;

            if (window.scrollY > threshold) {
                header.classList.remove('site-header--transparent');
                header.classList.add('site-header--solid');
            } else {
                header.classList.remove('site-header--solid');
                header.classList.add('site-header--transparent');
            }
        };

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    toggleHeader();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        toggleHeader();
    };

    // --- Mobile Navigation Toggle ---
    const initMobileNav = () => {
        const navToggle = document.querySelector('.nav-toggle');
        const primaryNav = document.querySelector('#primary-navigation');

        if (!navToggle || !primaryNav) return;

        const setOpen = (open) => {
            primaryNav.setAttribute('data-visible', String(open));
            navToggle.setAttribute('aria-expanded', String(open));
            document.body.classList.toggle('nav-open', open);
        };

        navToggle.addEventListener('click', () => {
            setOpen(primaryNav.getAttribute('data-visible') !== 'true');
        });

        // Close the menu when a link is chosen or Escape is pressed
        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setOpen(false));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') setOpen(false);
        });
    };

    // --- Scroll Animations with IntersectionObserver ---
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .card, .stagger-children');
        if (animatedElements.length === 0) return;

        // If IntersectionObserver is unavailable, reveal everything.
        if (!('IntersectionObserver' in window)) {
            animatedElements.forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.15 });

        animatedElements.forEach(el => observer.observe(el));
    };

    // --- Project Filtering ---
    const initProjectFiltering = () => {
        const filterTabs = document.querySelectorAll('.filter-tab');
        const projectCards = document.querySelectorAll('.card[data-category]');

        if (filterTabs.length === 0 || projectCards.length === 0) return;

        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-pressed', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-pressed', 'true');

                const filter = tab.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const categories = (card.getAttribute('data-category') || '').split(' ');
                    const matches = filter === 'all' || categories.includes(filter);

                    if (matches) {
                        card.classList.remove('hidden');
                        requestAnimationFrame(() => card.classList.add('visible'));
                    } else {
                        card.classList.add('hidden');
                        card.classList.remove('visible');
                    }
                });
            });
        });
    };

    // --- Project Page Prev/Next Navigation ---
    // Order mirrors the featured grid: robotics-focused work leads.
    const initProjectNav = () => {
        const projectNavContainer = document.querySelector('.project-nav');
        if (!projectNavContainer) return;

        const projects = [
            'act-so101-sharpener.html',
            'eskf-sensor-fusion.html',
            'zenoh-fleet.html',
            'ppo-locomotion.html',
            'ros2-mobile-robot.html',
            'drone-project.html',
            'egg-mover.html',
            'quick-return.html',
            'spacecraft-control.html',
            'weather-satellite.html',
            'light-sport-aircraft.html',
            'low-cost-gc.html',
            'heat-sink.html'
        ];

        const titles = {
            'ros2-mobile-robot.html': 'ROS2 Mobile Robot',
            'drone-project.html': 'Drone Project',
            'egg-mover.html': 'Egg Mover Project',
            'quick-return.html': 'Quick-Return Dynamics',
            'spacecraft-control.html': 'Spacecraft Attitude Dynamics and Control',
            'weather-satellite.html': 'Weather Satellite',
            'light-sport-aircraft.html': 'Light Sport Aircraft',
            'low-cost-gc.html': 'Low Cost Gas Chromatograph',
            'heat-sink.html': 'Enhanced Heat Sinks',
            'ppo-locomotion.html': 'PPO Locomotion Study',
            'zenoh-fleet.html': 'ZenohFleet',
            'eskf-sensor-fusion.html': 'ESKF Sensor Fusion',
            'act-so101-sharpener.html': 'ACT Policy on SO-101'
        };

        const currentPage = window.location.pathname.split('/').pop() || projects[0];
        const currentIndex = projects.indexOf(currentPage);

        if (currentIndex === -1) return;

        const prevLinkContainer = document.querySelector('.prev-link-container');
        const nextLinkContainer = document.querySelector('.next-link-container');

        if (currentIndex > 0 && prevLinkContainer) {
            const prevPage = projects[currentIndex - 1];
            const prevLink = document.createElement('a');
            prevLink.href = `./${prevPage}`;
            prevLink.textContent = `\u2190 ${titles[prevPage]}`;
            prevLinkContainer.appendChild(prevLink);
        }

        if (currentIndex < projects.length - 1 && nextLinkContainer) {
            const nextPage = projects[currentIndex + 1];
            const nextLink = document.createElement('a');
            nextLink.href = `./${nextPage}`;
            nextLink.textContent = `${titles[nextPage]} \u2192`;
            nextLinkContainer.appendChild(nextLink);
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

            if (nameField) clearError(nameField);
            if (emailField) clearError(emailField);
            if (messageField) clearError(messageField);

            if (nameField && nameField.value.trim() === '') {
                showError(nameField, 'Name cannot be empty.');
                isValid = false;
            }

            if (emailField) {
                if (emailField.value.trim() === '') {
                    showError(emailField, 'Email cannot be empty.');
                    isValid = false;
                } else if (!emailField.checkValidity()) {
                    showError(emailField, 'Please enter a valid email address.');
                    isValid = false;
                }
            }

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
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    };

    // --- Footer Year ---
    const initFooterYear = () => {
        document.querySelectorAll('[data-year]').forEach(el => {
            el.textContent = new Date().getFullYear();
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
    initFooterYear();
});
