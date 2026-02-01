/**
 * Premium Portfolio Interactivity
 * Modern, lightweight, and performance-focused JavaScript
 * Features: IntersectionObserver scroll reveals, 3D tilt effects, clipboard functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // ========================================
    // NAVIGATION
    // ========================================
    const header = document.getElementById('site-header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav ul');
    const navLinks = document.querySelectorAll('.nav a');

    // Header scroll effect
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', throttle(handleHeaderScroll, 16), { passive: true });

    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('show');
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                navMenu.classList.remove('show');
                document.body.style.overflow = '';
            });
        });
    }

    // Active section highlighting
    const sections = document.querySelectorAll('.section, .hero');
    const navItems = document.querySelectorAll('.nav a[data-section]');

    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 150;
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', throttle(updateActiveNav, 100), { passive: true });

    // ========================================
    // SMOOTH SCROLL
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ========================================
    // SCROLL TO TOP BUTTON
    // ========================================
    const scrollTopBtn = document.getElementById('scroll-top');

    if (scrollTopBtn) {
        const toggleScrollTop = () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', throttle(toggleScrollTop, 100), { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // TYPEWRITER EFFECT
    // ========================================
    const typewriterElement = document.querySelector('.typewriter-text');
    
    if (typewriterElement) {
        const text = typewriterElement.textContent;
        const roles = ['Cloud Data Engineer', 'AWS Specialist', 'Azure Expert', 'PySpark Developer'];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        const type = () => {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before typing
            }

            setTimeout(type, typeSpeed);
        };

        // Start typing after initial delay
        setTimeout(type, 1000);
    }

    // ========================================
    // 3D TILT EFFECT FOR VISITING CARD
    // ========================================
    const visitingCard = document.getElementById('visiting-card');
    
    if (visitingCard && window.matchMedia('(pointer: fine)').matches) {
        const maxTilt = 8; // Maximum tilt angle in degrees
        
        const handleTilt = (e) => {
            const rect = visitingCard.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotateX = (mouseY / (rect.height / 2)) * -maxTilt;
            const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
            
            visitingCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };

        const resetTilt = () => {
            visitingCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        };

        visitingCard.addEventListener('mousemove', throttle(handleTilt, 16));
        visitingCard.addEventListener('mouseleave', resetTilt);
    }

    // ========================================
    // FLOATING ANIMATION FOR VISITING CARD
    // ========================================
    if (visitingCard) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visitingCard.classList.add('card-visible');
                    // Add subtle floating animation after reveal
                    setTimeout(() => {
                        visitingCard.style.animation = 'card-float 6s ease-in-out infinite';
                    }, 600);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        cardObserver.observe(visitingCard);
    }

    // Add floating keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes card-float {
            0%, 100% { transform: translateY(0) perspective(1000px) rotateX(0) rotateY(0); }
            50% { transform: translateY(-10px) perspective(1000px) rotateX(0) rotateY(0); }
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // CLIPBOARD FUNCTIONALITY
    // ========================================
    const toast = document.getElementById('toast');
    const copyableElements = document.querySelectorAll('[data-copy]');

    const showToast = (message = 'Copied to clipboard!') => {
        if (!toast) return;
        
        const toastMessage = toast.querySelector('.toast-message');
        if (toastMessage) {
            toastMessage.textContent = message;
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Copied to clipboard!');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                showToast('Copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy:', err);
            }
            
            document.body.removeChild(textArea);
        }
    };

    copyableElements.forEach(el => {
        // Click handler
        el.addEventListener('click', () => {
            const textToCopy = el.getAttribute('data-copy');
            if (textToCopy) {
                copyToClipboard(textToCopy);
            }
        });

        // Keyboard handler for accessibility
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const textToCopy = el.getAttribute('data-copy');
                if (textToCopy) {
                    copyToClipboard(textToCopy);
                }
            }
        });
    });

    // ========================================
    // SKILL CARDS HOVER EFFECTS
    // ========================================
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transitionDelay = '0s';
        });
    });

    // ========================================
    // CERTIFICATE CARDS ENHANCED INTERACTION
    // ========================================
    const certCards = document.querySelectorAll('.cert-card');
    
    certCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const arrow = card.querySelector('.cert-arrow');
            if (arrow) {
                arrow.style.transform = 'translateX(0) rotate(-45deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const arrow = card.querySelector('.cert-arrow');
            if (arrow) {
                arrow.style.transform = 'translateX(-10px) rotate(0)';
            }
        });
    });

    // ========================================
    // DYNAMIC YEAR IN FOOTER
    // ========================================
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ========================================
    // PARALLAX EFFECT FOR HERO
    // ========================================
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (hero && heroVisual && window.matchMedia('(pointer: fine)').matches) {
        const handleParallax = () => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.3;
            
            if (rate < window.innerHeight) {
                heroVisual.style.transform = `translateY(${rate * 0.15}px)`;
            }
        };

        window.addEventListener('scroll', throttle(handleParallax, 16), { passive: true });
    }

    // ========================================
    // BUTTON RIPPLE EFFECT
    // ========================================
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ========================================
    // INTERSECTION OBSERVER FOR TIMELINE
    // ========================================
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        timelineObserver.observe(item);
    });

    // ========================================
    // PERFORMANCE: CLEANUP ON PAGE HIDE
    // ========================================
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause expensive animations when tab is hidden
            document.body.classList.add('tab-hidden');
        } else {
            document.body.classList.remove('tab-hidden');
        }
    });

    // ========================================
    // INITIALIZE
    // ========================================
    // Trigger initial scroll handlers
    handleHeaderScroll();
    updateActiveNav();
    
    console.log('%c✨ Portfolio Loaded', 'color: #3b82f6; font-size: 14px; font-weight: bold;');
    console.log('%cBuilt with precision and care', 'color: #64748b; font-size: 12px;');
});
