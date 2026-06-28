document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       THEME TOGGLE
       ========================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply default theme
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    // Toggle logic
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        
        // Re-initialize particles to update colors matching the theme
        if (typeof initParticles === 'function') {
            initParticles();
        }
        
        // Re-render GitHub Graph to update SVG cell colors matching the theme
        renderGitHubGraph();
    });

    /* ==========================================
       SCROLL PROGRESS BAR & STICKY HEADER
       ========================================== */
    const scrollProgress = document.getElementById('scroll-progress');
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        // Scroll progress
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }

        // Header scrolled class
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================
       MOBILE MENU TOGGLE
       ========================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle hamburger icon between bars and times (close)
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }

    /* ==========================================
       TYPING TEXT ANIMATION
       ========================================== */
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const words = JSON.parse(typingElement.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 100;
        let erasingDelay = 50;
        let newWordDelay = 2000;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingDelay = erasingDelay;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingDelay = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingDelay = newWordDelay;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingDelay = 500;
            }

            setTimeout(type, typingDelay);
        }

        // Initialize typewriter
        setTimeout(type, 1000);
    }

    /* ==========================================
       SCROLL REVEAL & NAV HIGHLIGHT
       ========================================== */
    // Add reveal class to sections
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, idx) => {
        // Skip home section from fade reveal to prevent popping
        if (section.id !== 'home') {
            section.classList.add('reveal');
        }
    });

    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate skill progress bars when skills section is visible
                if (entry.target.id === 'skills') {
                    animateSkills();
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => sectionObserver.observe(el));

    // Nav active link highlighing
    const navObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px' // Trigger when section is in the middle of the viewport
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

    function animateSkills() {
        const skillFills = document.querySelectorAll('.skill-bar-fill');
        skillFills.forEach(fill => {
            const progress = fill.getAttribute('data-progress');
            fill.style.width = progress;
        });
    }

    /* ==========================================
       CANVAS PARTICLES BACKGROUND
       ========================================== */
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const maxParticles = 65;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Collision boundary checks
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }

        draw() {
            const isLight = document.body.classList.contains('light-theme');
            ctx.fillStyle = isLight 
                ? `rgba(99, 102, 241, ${this.opacity * 0.7})` 
                : `rgba(168, 85, 247, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < maxParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles() {
        const isLight = document.body.classList.contains('light-theme');
        const lineColor = isLight ? '99, 102, 241' : '99, 102, 241';
        
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const alpha = (1 - (distance / 120)) * 0.12;
                    ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    /* ==========================================
       GITHUB LIVE INTEGRATION
       ========================================== */
    const githubUsername = 'dhashni-dev';
    
    // Fetch info from GitHub API
    async function fetchGitHubData() {
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}`);
            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();
            
            document.getElementById('github-repos').textContent = data.public_repos || '15';
            document.getElementById('github-followers').textContent = data.followers || '0';
        } catch (error) {
            console.warn('GitHub API rate limit or error, loading default stats.', error);
            // Default mock fallbacks
            document.getElementById('github-repos').textContent = '12';
            document.getElementById('github-followers').textContent = '5';
        }
    }
    
    fetchGitHubData();

    // High fidelity Dynamic Contribution Graph SVG Generator
    function renderGitHubGraph() {
        const graphContainer = document.getElementById('github-graph');
        if (!graphContainer) return;

        const isLight = document.body.classList.contains('light-theme');
        
        // Define color levels
        const colors = isLight 
            ? ['#f1f5f9', '#e9d5ff', '#c084fc', '#a855f7', '#7e22ce'] 
            : ['#121624', '#2e1b4e', '#4c2c77', '#7835b0', '#a855f7'];

        const cols = 53;
        const rows = 7;
        const width = cols * 14;
        const height = rows * 14;
        
        let rects = '';
        
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                // Generate simulated contribution level (weighted towards empty & light contributions)
                const rand = Math.random();
                let level = 0;
                if (rand > 0.95) level = 4;
                else if (rand > 0.88) level = 3;
                else if (rand > 0.75) level = 2;
                else if (rand > 0.45) level = 1;
                
                const fill = colors[level];
                const x = c * 14;
                const y = r * 14;
                rects += `<rect x="${x}" y="${y}" width="11" height="11" rx="2" fill="${fill}" data-level="${level}"></rect>`;
            }
        }

        const svg = `
            <svg viewBox="0 0 ${width} ${height}" class="github-graph-svg">
                ${rects}
            </svg>
        `;
        
        graphContainer.innerHTML = svg;
    }

    renderGitHubGraph();

    /* ==========================================
       TESTIMONIALS SLIDER
       ========================================== */
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let testimonialIndex = 0;

    if (testimonialCards.length > 0) {
        function showTestimonial(index) {
            testimonialCards.forEach((card, i) => {
                card.classList.remove('active');
                if (i === index) {
                    card.classList.add('active');
                }
            });
        }

        function nextTestimonial() {
            testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
            showTestimonial(testimonialIndex);
        }

        function prevTestimonial() {
            testimonialIndex = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
            showTestimonial(testimonialIndex);
        }

        nextBtn.addEventListener('click', nextTestimonial);
        prevBtn.addEventListener('click', prevTestimonial);

        // Auto slide every 8 seconds
        let autoSlide = setInterval(nextTestimonial, 8000);

        // Reset timer on manual navigation
        [prevBtn, nextBtn].forEach(btn => {
            btn.addEventListener('mouseenter', () => clearInterval(autoSlide));
            btn.addEventListener('mouseleave', () => {
                autoSlide = setInterval(nextTestimonial, 8000);
            });
        });
    }

    /* ==========================================
       CONTACT FORM VALIDATION
       ========================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            
            let isValid = true;

            // Validate Name
            if (!nameField.value.trim()) {
                nameField.parentElement.classList.add('error');
                isValid = false;
            } else {
                nameField.parentElement.classList.remove('error');
            }

            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailField.value.trim() || !emailRegex.test(emailField.value.trim())) {
                emailField.parentElement.classList.add('error');
                isValid = false;
            } else {
                emailField.parentElement.classList.remove('error');
            }

            // Validate Message
            if (!messageField.value.trim()) {
                messageField.parentElement.classList.add('error');
                isValid = false;
            } else {
                messageField.parentElement.classList.remove('error');
            }

            if (isValid) {
                const submitBtn = contactForm.querySelector('.btn-submit');
                const btnText = submitBtn.querySelector('span');
                const btnIcon = submitBtn.querySelector('i');
                
                // Show loading state
                submitBtn.disabled = true;
                btnText.textContent = 'Sending...';
                btnIcon.className = 'fa-solid fa-spinner fa-spin';

                // Simulate form submission delay
               fetch("/", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(
        new FormData(contactForm)
    ).toString()
})
.then(() => {

    formStatus.style.display = "block";
    formStatus.className = "form-status success";
    formStatus.textContent =
        "Message sent successfully!";

    contactForm.reset();

    submitBtn.disabled = false;
    btnText.textContent = "Send Message";
    btnIcon.className =
        "fa-solid fa-paper-plane";
})
.catch(() => {

    formStatus.style.display = "block";
    formStatus.className = "form-status error";
    formStatus.textContent =
        "Failed to send message.";

    submitBtn.disabled = false;
    btnText.textContent = "Send Message";
    btnIcon.className =
        "fa-solid fa-paper-plane";
});
            }
        });

        // Real-time input error clearing
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.parentElement.classList.remove('error');
                }
            });
        });
    }
});
