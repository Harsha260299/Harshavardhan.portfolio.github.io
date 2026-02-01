/**
 * Premium Portfolio Interactivity
 * Modern, lightweight, and performance-focused JavaScript
 * Features: IntersectionObserver scroll reveals, 3D tilt effects, magnetic buttons, clipboard functionality
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
    // SCROLL PROGRESS BAR
    // ========================================
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    if (progressBar) {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${progress}%`;
        };

        window.addEventListener('scroll', throttle(updateProgress, 16), { passive: true });
    }

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
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
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
    // TEXT SCRAMBLE EFFECT
    // ========================================
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        
        update() {
            let output = '';
            let complete = 0;
            
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            
            this.el.innerHTML = output;
            
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Initialize scramble effect
    const scrambleEl = document.querySelector('.scramble-text');
    if (scrambleEl) {
        const fx = new TextScramble(scrambleEl);
        const finalText = scrambleEl.dataset.value;
        
        setTimeout(() => {
            fx.setText(finalText);
        }, 500);
    }

    // ========================================
    // TYPEWRITER EFFECT
    // ========================================
    const typewriterElement = document.querySelector('.typewriter-text');
    
    if (typewriterElement) {
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
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };

        setTimeout(type, 1500);
    }

    // ========================================
    // COUNTER ANIMATION
    // ========================================
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + '+';
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ========================================
    // MAGNETIC EFFECT
    // ========================================
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    if (!isTouchDevice) {
        const magneticElements = document.querySelectorAll('.magnetic-element');
        const magneticButtons = document.querySelectorAll('.magnetic-btn');
        
        const applyMagneticEffect = (element, strength = 0.3) => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        };
        
        magneticElements.forEach(el => applyMagneticEffect(el, 0.2));
        magneticButtons.forEach(btn => applyMagneticEffect(btn, 0.15));
    }

    // ========================================
    // 3D TILT EFFECT FOR VISITING CARD
    // ========================================
    const visitingCard = document.getElementById('visiting-card');
    
    if (visitingCard && !isTouchDevice) {
        const maxTilt = 8;
        
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
            if (!visitingCard.classList.contains('floating')) {
                visitingCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            }
        };

        visitingCard.addEventListener('mousemove', throttle(handleTilt, 16));
        visitingCard.addEventListener('mouseleave', resetTilt);
    }

    // ========================================
    // CARD REVEAL & FLOATING ANIMATION
    // ========================================
    if (visitingCard) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add revealed class for slide-in animation
                    setTimeout(() => {
                        visitingCard.classList.add('revealed');
                    }, 200);
                    
                    // Add floating animation after reveal
                    setTimeout(() => {
                        visitingCard.classList.add('floating');
                    }, 1200);
                    
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        cardObserver.observe(visitingCard);
    }

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
        el.addEventListener('click', () => {
            const textToCopy = el.getAttribute('data-copy');
            if (textToCopy) {
                copyToClipboard(textToCopy);
            }
        });

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
    
    if (hero && heroVisual && !isTouchDevice) {
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
        .scramble-char {
            color: var(--accent-cyan);
        }
    `;
    document.head.appendChild(rippleStyle);

    // ========================================
    // INTERSECTION OBSERVER FOR TIMELINE
    // ========================================
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, delay);
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
            document.body.classList.add('tab-hidden');
        } else {
            document.body.classList.remove('tab-hidden');
        }
    });

    // ========================================
    // INITIALIZE
    // ========================================
    handleHeaderScroll();
    updateActiveNav();
    
    console.log('%c✨ Portfolio Loaded', 'color: #3b82f6; font-size: 14px; font-weight: bold;');
    console.log('%cBuilt with precision and care', 'color: #64748b; font-size: 12px;');
});
