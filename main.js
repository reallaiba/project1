/* ICoder - Main JavaScript */

document.addEventListener('DOMContentLoaded', function () {

    // Highlight active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Back to top button
    const backToTopLinks = document.querySelectorAll('.back-to-top');
    backToTopLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Show toast notification
    window.showToast = function (message, type) {
        type = type || 'success';
        const toastEl = document.getElementById('liveToast');
        if (!toastEl) return;

        const toastBody = toastEl.querySelector('.toast-body');
        const toastHeader = toastEl.querySelector('.toast-header strong');

        toastBody.textContent = message;
        toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'text-white');

        if (type === 'success') {
            toastHeader.textContent = 'Success';
            toastEl.classList.add('bg-success', 'text-white');
        } else if (type === 'error') {
            toastHeader.textContent = 'Error';
            toastEl.classList.add('bg-danger', 'text-white');
        } else if (type === 'warning') {
            toastHeader.textContent = 'Warning';
            toastEl.classList.add('bg-warning');
        }

        const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
        toast.show();
    };

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (!email || !password) {
                showToast('Please fill in all fields.', 'error');
                return;
            }
            if (!email.includes('@')) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            modal.hide();
            loginForm.reset();
            showToast('Welcome back! You have logged in successfully.');
        });
    }

    // Sign up form handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value.trim();
            const confirm = document.getElementById('confirmPassword').value.trim();
            const terms = document.getElementById('termsCheck').checked;

            if (!email || !password || !confirm) {
                showToast('Please fill in all fields.', 'error');
                return;
            }
            if (password !== confirm) {
                showToast('Passwords do not match.', 'error');
                return;
            }
            if (password.length < 6) {
                showToast('Password must be at least 6 characters.', 'error');
                return;
            }
            if (!terms) {
                showToast('Please agree to the terms and conditions.', 'warning');
                return;
            }

            const modal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
            modal.hide();
            signupForm.reset();
            showToast('Account created successfully! Welcome to ICoder.');
        });
    }

    // Contact form handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !subject || !message) {
                showToast('Please fill in all required fields.', 'error');
                return;
            }
            if (!email.includes('@')) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            contactForm.reset();
            showToast('Thank you! Your message has been sent successfully. We will get back to you soon.');
        });
    }

    // Search functionality (home page)
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const query = document.getElementById('searchInput').value.trim().toLowerCase();
            const cards = document.querySelectorAll('.blog-card-wrapper');
            const noResults = document.getElementById('noResults');
            let visibleCount = 0;

            cards.forEach(function (card) {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const category = card.querySelector('.category-badge').textContent.toLowerCase();
                const text = card.querySelector('.card-text').textContent.toLowerCase();
                const match = !query || title.includes(query) || category.includes(query) || text.includes(query);

                card.style.display = match ? '' : 'none';
                if (match) {
                    visibleCount++;
                    card.classList.add('search-highlight');
                    setTimeout(function () { card.classList.remove('search-highlight'); }, 1500);
                }
            });

            if (noResults) {
                noResults.classList.toggle('show', visibleCount === 0 && query !== '');
            }

            if (query && visibleCount > 0) {
                showToast('Found ' + visibleCount + ' result(s) for "' + query + '"');
            } else if (query && visibleCount === 0) {
                showToast('No articles found for "' + query + '"', 'warning');
            }

            const blogSection = document.getElementById('blog-section');
            if (blogSection) {
                blogSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Hero category buttons - filter blog by category
    document.querySelectorAll('[data-filter]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const filter = btn.getAttribute('data-filter').toLowerCase();
            const cards = document.querySelectorAll('.blog-card-wrapper');
            let visibleCount = 0;

            cards.forEach(function (card) {
                const category = card.getAttribute('data-category').toLowerCase();
                const match = filter === 'all' || category === filter;
                card.style.display = match ? '' : 'none';
                if (match) visibleCount++;
            });

            const noResults = document.getElementById('noResults');
            if (noResults) {
                noResults.classList.toggle('show', visibleCount === 0);
            }

            showToast('Showing ' + visibleCount + ' article(s) in "' + btn.textContent.trim() + '"');

            const blogSection = document.getElementById('blog-section');
            if (blogSection) {
                blogSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Read more / article buttons - open article modal
    document.querySelectorAll('[data-article]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const articleId = btn.getAttribute('data-article');
            const data = articles[articleId];
            if (!data) return;

            document.getElementById('articleModalTitle').textContent = data.title;
            document.getElementById('articleModalCategory').textContent = data.category;
            document.getElementById('articleModalDate').textContent = data.date;
            document.getElementById('articleModalImage').src = data.image;
            document.getElementById('articleModalImage').alt = data.title;
            document.getElementById('articleModalBody').textContent = data.content;

            const modal = new bootstrap.Modal(document.getElementById('articleModal'));
            modal.show();
        });
    });

    // Dropdown topic links
    document.querySelectorAll('[data-topic]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const topic = link.getAttribute('data-topic');
            showToast('You selected: ' + topic + '. Explore our blog articles below!');
            const blogSection = document.getElementById('blog-section');
            if (blogSection) {
                blogSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Footer privacy/terms modals
    document.querySelectorAll('[data-footer-modal]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const type = link.getAttribute('data-footer-modal');
            const title = document.getElementById('footerModalTitle');
            const body = document.getElementById('footerModalBody');

            if (type === 'privacy') {
                title.textContent = 'Privacy Policy';
                body.innerHTML = '<p>At ICoder, we respect your privacy. We collect only essential information to improve your experience. Your data is never sold to third parties.</p><p>We use cookies to enhance site functionality and analyze traffic. You can disable cookies in your browser settings at any time.</p>';
            } else if (type === 'terms') {
                title.textContent = 'Terms & Conditions';
                body.innerHTML = '<p>By using ICoder, you agree to our terms of service. All content on this platform is for educational purposes.</p><p>Users must not misuse the platform, post harmful content, or attempt to disrupt our services. We reserve the right to update these terms at any time.</p>';
            }

            const modal = new bootstrap.Modal(document.getElementById('footerModal'));
            modal.show();
        });
    });

    // Newsletter form (about page)
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail').value.trim();
            if (!email || !email.includes('@')) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }
            newsletterForm.reset();
            showToast('Subscribed successfully! You will receive our latest updates.');
        });
    }

    // Get Directions button (contact page map)
    const directionsBtn = document.getElementById('getDirectionsBtn');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', function () {
            window.open(
                'https://www.google.com/maps/dir/?api=1&destination=Gulberg+III+Lahore+Punjab+Pakistan',
                '_blank'
            );
            showToast('Opening Google Maps directions...');
        });
    }

    // Open in Google Maps button
    const openMapBtn = document.getElementById('openMapBtn');
    if (openMapBtn) {
        openMapBtn.addEventListener('click', function () {
            window.open(
                'https://www.google.com/maps/search/?api=1&query=Gulberg+III+Lahore+Punjab+Pakistan',
                '_blank'
            );
        });
    }

    // Contact info card actions
    document.querySelectorAll('[data-contact-action]').forEach(function (card) {
        card.addEventListener('click', function () {
            const action = card.getAttribute('data-contact-action');
            if (action === 'email') {
                window.location.href = 'mailto:support@icoder.com';
                showToast('Opening email client...');
            } else if (action === 'phone') {
                window.location.href = 'tel:+923001234567';
                showToast('Calling ICoder support...');
            } else if (action === 'location') {
                const mapSection = document.getElementById('map-section');
                if (mapSection) {
                    mapSection.scrollIntoView({ behavior: 'smooth' });
                    showToast('Scroll down to view our location on the map.');
                }
            }
        });
    });

    // Gallery image lightbox
    document.querySelectorAll('[data-gallery]').forEach(function (item) {
        item.addEventListener('click', function () {
            const title = item.getAttribute('data-gallery-title') || 'ICoder Gallery';
            const desc = item.getAttribute('data-gallery-desc') || '';
            const imgSrc = item.querySelector('img').src.replace('w=600', 'w=1200').replace('h=300', 'h=700');

            document.getElementById('imageModalTitle').textContent = title;
            document.getElementById('imageModalDesc').textContent = desc;
            document.getElementById('imageModalImg').src = imgSrc;
            document.getElementById('imageModalImg').alt = title;

            const modal = new bootstrap.Modal(document.getElementById('imageModal'));
            modal.show();
        });
    });
});

// Article content data
const articles = {
    conference: {
        title: 'Global Tech Conference 2025',
        category: 'World',
        date: 'Nov 12, 2025',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
        content: 'Join developers from around the world at the Global Tech Conference 2025. This event features keynote speakers from leading tech companies, hands-on workshops on AI, cloud computing, and web development, and networking opportunities with industry professionals. Early bird tickets are now available.'
    },
    design: {
        title: 'Learn UI/UX Designing',
        category: 'Design',
        date: 'Nov 11, 2025',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
        content: 'Master the art of user interface and user experience design. This comprehensive guide covers design principles, color theory, typography, wireframing, prototyping with Figma, and creating responsive layouts that users love. Perfect for beginners and intermediate designers.'
    },
    python: {
        title: 'Learn Python Programming',
        category: 'Python',
        date: 'Nov 10, 2025',
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop',
        content: 'Python is one of the most popular programming languages today. Start with basics like variables, loops, and functions, then advance to web development with Django, data science with Pandas, and automation scripts. Our step-by-step tutorials make learning easy and fun.'
    },
    bootstrap: {
        title: 'Bootstrap Templates Guide',
        category: 'Frontend',
        date: 'Nov 9, 2025',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
        content: 'Build beautiful, responsive websites quickly with Bootstrap 5. Learn the grid system, components like navbars, cards, modals, and carousels. This guide walks you through creating professional templates that work on all devices without writing extensive custom CSS.'
    },
    ai: {
        title: 'Introduction to Artificial Intelligence',
        category: 'Technology',
        date: 'Nov 8, 2025',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        content: 'Artificial Intelligence is transforming every industry. Learn about machine learning fundamentals, neural networks, natural language processing, and practical AI applications. Whether you are a student or professional, this guide helps you understand and leverage AI technology.'
    },
    webdev: {
        title: 'Full Stack Web Development Roadmap',
        category: 'Web Development',
        date: 'Nov 7, 2025',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
        content: 'Become a full stack developer with our complete roadmap. Start with HTML, CSS, and JavaScript, then move to React or Vue for frontend, Node.js or Python for backend, and databases like MongoDB and PostgreSQL. Includes project ideas and career tips for internships and jobs.'
    }
};
