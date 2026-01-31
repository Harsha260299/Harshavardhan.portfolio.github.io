/*
 * Enhanced Portfolio Interactivity
 *
 * Features: mobile navigation, particle background, scroll animations,
 * scroll-to-top button, header scrolling effects, and smooth transitions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========== Mobile Navigation ==========
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.querySelector('.nav ul');
    
    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('show');
            const icon = navToggle.querySelector('i');
            if (nav.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden'; // Prevent scroll when menu open
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });

        // Close navigation after clicking a link
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('show')) {
                    nav.classList.remove('show');
                    const icon = navToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // ========== Dynamic Year in Footer ==========
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ========== Particle Background ==========
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-bg';
        document.body.prepend(particlesContainer);

        const particleCount = 30;
        const colors = ['rgba(77, 163, 255, 0.3)', 'rgba(157, 80, 255, 0.3)', 'rgba(0, 217, 255, 0.3)'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 80 + 40;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
            particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            particlesContainer.appendChild(particle);
        }
    }
    createParticles();

    // ========== Smoke Effect in Hero Section ==========
    function initSmoke() {
        const canvas = document.getElementById('smoke-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let width, height;
        const particles = [];
        const particleCount = 40;

        function resize() {
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width;
            canvas.height = height;
        }

        window.addEventListener('resize', resize);
        resize();

        function createParticle() {
            return {
                x: Math.random() * width,
                y: height + Math.random() * height * 0.3,
                radius: 60 + Math.random() * 100,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -0.4 - Math.random() * 0.3,
                opacity: 0.05 + Math.random() * 0.25
            };
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            
            for (const p of particles) {
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
                gradient.addColorStop(0, `rgba(77, 163, 255, ${p.opacity})`);
                gradient.addColorStop(0.5, `rgba(157, 80, 255, ${p.opacity * 0.5})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.beginPath();
                ctx.fillStyle = gradient;
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                if (p.y + p.radius < 0 || p.x + p.radius < 0 || p.x - p.radius > width) {
                    const newP = createParticle();
                    Object.assign(p, newP);
                }
            }
            
            requestAnimationFrame(draw);
        }
        
        draw();
    }
    initSmoke();

    // ========== Header Scroll Effect ==========
    const header = document.querySelector('.site-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // ========== Scroll to Top Button ==========
    const scrollTopBtn = document.createElement('div');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ========== Scroll Animation Observer ==========
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.skill, .timeline-item, .education-item, .cert-item, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ========== Smooth Scrolling for Anchor Links ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== Active Navigation Highlight ==========
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.style.color = 'var(--accent-cyan)';
            }
        });
    });

    // ========== Typing Effect for Hero Text (Optional Enhancement) ==========
    const heroTitle = document.querySelector('.hero-text h1 .accent');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        setTimeout(typeWriter, 500);
    }

    // ========== Parallax Effect for Hero Section ==========
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }

    // ========== Skill Cards Stagger Animation ==========
    const skillCards = document.querySelectorAll('.skill');
    skillCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // ========== Certificate Cards Hover Sound Effect (Visual Feedback) ==========
    const certItems = document.querySelectorAll('.cert-item');
    certItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        });
    });

    // ========== Timeline Items Sequential Reveal ==========
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
            }
        });
    }, { threshold: 0.1 });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        timelineObserver.observe(item);
    });

    // ========== Add Loading Animation ==========
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.6s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    // ========== Interactive Cursor Effect (Desktop Only) ==========
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--accent-blue);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.2s ease, opacity 0.2s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        // Scale cursor on hover over interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .cert-item, .contact-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = 'var(--accent-cyan)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = 'var(--accent-blue)';
            });
        });
    }

    // ========== Performance Optimization ==========
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            // Scroll-dependent operations here
        });
    }, { passive: true });

    console.log('✨ Portfolio enhanced and ready!');
});
