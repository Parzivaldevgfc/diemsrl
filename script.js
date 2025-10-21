// ============ PRELOADER ============
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
    }, 1500);
});

// ============ ELEMENTI DOM ============
const sections = document.querySelectorAll('.section');
const header = document.getElementById('header');
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

// ============ INTERSECTION OBSERVER PER SEZIONI ============
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

sections.forEach(section => {
    observer.observe(section);
});

// Mostra prima sezione immediatamente
setTimeout(() => {
    sections[0]?.classList.add('visible');
}, 100);

// ============ HEADER SCROLL EFFECT ============
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ============ MOBILE MENU TOGGLE ============
burger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    burger.classList.toggle('toggle');
});

// Chiudi il menu quando clicchi su un link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        burger.classList.remove('toggle');
    });
});

 
    // Preloader: garantisce che il preloader rimanga visibile almeno MIN_DISPLAY ms
    (function(){
        const MIN_DISPLAY = 1000; // almeno 5 secondi
        const FALLBACK = 15000;   // forza rimozione dopo 15s se qualcosa va storto
        const start = Date.now();

        function hidePreloader() {
            const pre = document.getElementById('preloader');
            if (!pre) return;
            const elapsed = Date.now() - start;
            const wait = Math.max(0, MIN_DISPLAY - elapsed);
            setTimeout(() => {
                pre.classList.add('hidden');
                pre.addEventListener('transitionend', function () {
                    try { pre.parentNode && pre.parentNode.removeChild(pre); } catch (e) { /* ignore */ }
                });
            }, wait);
        }

        window.addEventListener('load', hidePreloader);

        // fallback: rimuove comunque il preloader dopo FALLBACK ms
        setTimeout(() => {
            const pre = document.getElementById('preloader');
            if (pre && !pre.classList.contains('hidden')) {
                const elapsed = Date.now() - start;
                const wait = Math.max(0, MIN_DISPLAY - elapsed);
                setTimeout(() => {
                    pre.classList.add('hidden');
                    setTimeout(()=> pre.parentNode && pre.parentNode.removeChild(pre), 700);
                }, wait);
            }
        }, FALLBACK);
    })();
   
// ============ SMOOTH SCROLLING ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============ HERO PRINTER ANIMATION ON VIEW (respects prefers-reduced-motion) ============
(function(){
    const printerEl = document.querySelector('#home .printer');
    if (!printerEl) return;
    // If user prefers reduced motion, don't animate
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (m && m.matches) return;

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                printerEl.classList.add('animate');
            } else {
                printerEl.classList.remove('animate');
            }
        });
    }, { threshold: 0.35 });

    heroObserver.observe(document.getElementById('home'));
})();