// script.js — estratto da index.html

// preloader: terminal-like sequence (più veloce)
(function(){
    const preEl = document.getElementById('preloader');
    const container = document.getElementById('preloader-inner');
    // caret element
    const caret = document.createElement('span');
    caret.className = 'pre-caret';
    caret.setAttribute('aria-hidden','true');
    caret.textContent = '|';
    // keyframes (ensure exists)
    const css = document.createElement('style');
    css.textContent = `@keyframes blinkCaret { 50% { opacity: 0; } }`;
    document.head.appendChild(css);

    // helper: type text into a span, returns Promise
    function typeText(target, text, speed=6){
        return new Promise(resolve => {
            let i=0;
            function step(){
                if(i<=text.length){
                    target.textContent = text.slice(0,i);
                    i++;
                    setTimeout(step, speed);
                } else resolve();
            }
            step();
        });
    }

    // sequence of commands + outputs
    const seq = [
        {cmd: 'init.sh', out: 'Launching services...'},
        {cmd: 'git clone gfcshop/core', out: 'Repository cloned.'},
        {cmd: 'npm ci', out: 'Dependencies installed.'},
        {cmd: 'npm run build --prod', out: 'Build complete - optimized.'},
        {cmd: 'connect ui', out: 'UI ready. Enjoy the show!'}
    ];

    window.addEventListener('load', async function(){
        // Small ASCII art for GFC Shop (by parzival)
        const asciiArt = [
            "",
            "GFC SHOP® by Parzival"
        ].join('');
        const artLine = document.createElement('div');
        artLine.className = 'pre-line';
        const artPre = document.createElement('pre');
        artPre.style.margin = '0';
        artPre.style.display = 'inline-block';
        artPre.textContent = asciiArt;
        artLine.appendChild(artPre);
        container.appendChild(artLine);

        for(const item of seq){
            const line = document.createElement('div');
            line.className = 'pre-line';
            const promptSpan = document.createElement('span');
            promptSpan.className = 'cmd';
            promptSpan.textContent = 'root@GFC:~$ ';
            const typedSpan = document.createElement('span');
            typedSpan.className = 'typed';
            line.appendChild(promptSpan);
            line.appendChild(typedSpan);
            line.appendChild(caret);
            container.appendChild(line);

            await typeText(typedSpan, item.cmd, 6); // più veloce
            // small pause
            await new Promise(r => setTimeout(r, 200));
            // remove caret from command line
            caret.remove();
            // add output line
            const outLine = document.createElement('div');
            outLine.className = 'pre-line';
            outLine.innerHTML = `<span class="out">${item.out}</span>`;
            container.appendChild(outLine);
            // reattach caret for next command
            line.appendChild(caret);
            await new Promise(r => setTimeout(r, 180)); // breve pausa
        }

        // rapida dissolvenza
        setTimeout(()=> {
            preEl.style.opacity = '0';
            setTimeout(()=> preEl.style.display = 'none', 350);
        }, 350);
    });
})();

// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particlesContainer.appendChild(particle);
    }
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Scroll animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('animated'); });
}, observerOptions);
document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// Stagger animations for cards
document.querySelectorAll('.service-card').forEach((card, index) => { card.style.transitionDelay = `${index * 0.15}s`; });

// Initialize particles
createParticles();

// Gentle random movement (non-destructive)
setInterval(() => {
    document.querySelectorAll('.particle').forEach(p => {
        const randomX = Math.random() * 10 - 5;
        const randomY = Math.random() * 10 - 5;
        const prev = p.style.transform || '';
        p.style.transform = `${prev} translate(${randomX}px, ${randomY}px)`;
    });
}, 3000);

// Header background opacity on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;
    const scrolled = window.pageYOffset;
    const opacity = Math.min(0.95, 0.8 + (scrolled / 500) * 0.15);
    header.style.background = `rgba(15, 15, 35, ${opacity})`;
});

// Back to top button logic
(function() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    const style = document.createElement('style');
    style.innerHTML = `
        #backToTop { position: fixed; right: 24px; bottom: 24px; width:48px; height:48px; border-radius:12px; border:none;
            background: linear-gradient(135deg, #6366f1, #8b5cf6); color:#fff; font-size:20px; box-shadow:0 8px 24px rgba(99,102,241,0.3);
            cursor:pointer; opacity:0; transform:translateY(20px); transition:opacity 0.3s ease, transform 0.3s ease; z-index:1500; }
        #backToTop.show { opacity:1; transform:translateY(0); }
        @media (max-width: 480px) { #backToTop { right:16px; bottom:16px; width:44px; height:44px; } }`;
    document.head.appendChild(style);
    function checkScroll() { if (window.pageYOffset > 300) btn.classList.add('show'); else btn.classList.remove('show'); }
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', checkScroll);
    checkScroll();
})();
