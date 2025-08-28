document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const initMobileNav = () => {
        const navToggle = document.querySelector('.nav-toggle');
        const primaryNav = document.querySelector('#primary-navigation');

        if (navToggle && primaryNav) {
            navToggle.addEventListener('click', () => {
                const isVisible = primaryNav.getAttribute('data-visible') === 'true';
                primaryNav.setAttribute('data-visible', !isVisible);
                navToggle.setAttribute('aria-expanded', !isVisible);
            });
        }
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
            'drone-project.html'
        ];

        const titles = {
            'egg-mover.html': 'Egg Mover Project',
            'ros2-mobile-robot.html': 'ROS2 Mobile Robot',
            'weather-satellite.html': 'Weather Satellite',
            'low-cost-gc.html': 'Low Cost GC',
            'heat-sink.html': 'Heat Sink',
            'light-sport-aircraft.html': 'Light Sport Aircraft',
            'drone-project.html': 'Drone Project'
        };

        const currentPage = window.location.pathname.split('/').pop();
        const currentIndex = projects.indexOf(currentPage);

        if (currentIndex !== -1) {
            const prevLinkContainer = document.querySelector('.prev-link-container');
            const nextLinkContainer = document.querySelector('.next-link-container');

            if (currentIndex > 0) {
                const prevPage = projects[currentIndex - 1];
                const prevTitle = titles[prevPage];
                const prevLink = document.createElement('a');
                prevLink.href = `./${prevPage}`;
                prevLink.textContent = `← Prev: ${prevTitle}`;
                prevLinkContainer.appendChild(prevLink);
            }

            if (currentIndex < projects.length - 1) {
                const nextPage = projects[currentIndex + 1];
                const nextTitle = titles[nextPage];
                const nextLink = document.createElement('a');
                nextLink.href = `./${nextPage}`;
                nextLink.textContent = `Next: ${nextTitle} →`;
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
            errorElement.textContent = message;
        };
        
        const clearError = (field) => {
            const formGroup = field.parentElement;
            formGroup.classList.remove('error');
            const errorElement = formGroup.querySelector('.error-message');
            errorElement.textContent = '';
        };

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Clear previous errors
            clearError(nameField);
            clearError(emailField);
            clearError(messageField);

            // Validate Name
            if (nameField.value.trim() === '') {
                showError(nameField, 'Name cannot be empty.');
                isValid = false;
            }

            // Validate Email
            if (emailField.value.trim() === '') {
                showError(emailField, 'Email cannot be empty.');
                isValid = false;
            } else if (!emailField.checkValidity()) {
                showError(emailField, 'Please enter a valid email address.');
                isValid = false;
            }

            // Validate Message
            if (messageField.value.trim() === '') {
                showError(messageField, 'Message cannot be empty.');
                isValid = false;
            }

            if (isValid) {
                const name = encodeURIComponent(nameField.value.trim());
                const subject = encodeURIComponent(`Contact from ${name}`);
                const body = encodeURIComponent(messageField.value.trim());
                const email = '{{YOUR_EMAIL}}'; // This will be replaced by the user

                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
            }
        });
    };

    // Initialize all scripts
    initMobileNav();
    initProjectNav();
    initContactForm();
});