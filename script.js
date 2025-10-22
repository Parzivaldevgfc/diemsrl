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

// ============ PREVENTIVO (landing) ============
(function(){
  const prezzo={"a4-mono":{base:29,perPage:0.009},"a4-colore":{base:49,perPage:0.045},"a3-colore":{base:79,perPage:0.055}};
  const sconto={12:0,24:0.05,36:0.10,48:0.12};
  const serviziMap={standard:0,full:10};

  const m=document.getElementById('prev-modello');
  const d=document.getElementById('prev-durata');
  const v=document.getElementById('prev-volume');
  const s=document.getElementById('prev-servizi');
  const mens=document.getElementById('prev-mensile');
  const tot=document.getElementById('prev-totale');
  const wa=document.getElementById('prev-waBtn');
  const detBase=document.getElementById('prev-detBase');
  const detPagine=document.getElementById('prev-detPagine');
  const detServizi=document.getElementById('prev-detServizi');
  const detSconto=document.getElementById('prev-detSconto');

  if(!m || !d || !v || !s || !mens || !tot) return;

  function eur(n){return n.toLocaleString('it-IT',{style:'currency',currency:'EUR',minimumFractionDigits:2});}

  function calc(){
    const mm=m.value;
    const dd=Number(d.value);
    const vv=Math.max(0,Number(v.value||0));
    const ss=s.value;

    const cfg=prezzo[mm];
    const add=serviziMap[ss]||0;
    const disc=sconto[dd]||0;

    const costoBase=cfg.base;
    const costoPagine=vv*cfg.perPage;
    const costoServizi=add;
    const lordo=costoBase+costoPagine+costoServizi;
    const valoreSconto=lordo*disc;
    const mensile=Math.max(0,lordo - valoreSconto);
    const totale=mensile*dd;

    mens.textContent=eur(mensile);
    tot.textContent=eur(totale);
    if(detBase) detBase.textContent=eur(costoBase);
    if(detPagine) detPagine.textContent=eur(costoPagine);
    if(detServizi) detServizi.textContent=eur(costoServizi);
    if(detSconto) detSconto.textContent='- '+eur(valoreSconto);

    const label={"a4-mono":"A4 Monocromatica","a4-colore":"A4 Colore","a3-colore":"A3 Colore"}[mm];
    const srv= ss==='full'? 'Full service (toner inclusi)':'Assistenza + parti usura';
    const txt=encodeURIComponent(`Salve DIEM Srl, vorrei un preventivo.\nModello: ${label}\nVolumi: ${vv} pagine/mese\nDurata: ${dd} mesi\nServizi: ${srv}\nStima canone mensile: ${eur(mensile)}\nStima totale periodo: ${eur(totale)}`);
    if(wa) wa.href=`https://wa.me/3341056059?text=${txt}`;
  }

  ['change','input'].forEach(ev=>{ m.addEventListener(ev,calc); d.addEventListener(ev,calc); v.addEventListener(ev,calc); s.addEventListener(ev,calc); });
  const btnCalcola=document.getElementById('prev-btnCalcola');
  const btnReset=document.getElementById('prev-btnReset');
  if(btnCalcola) btnCalcola.addEventListener('click',calc);
  if(btnReset) btnReset.addEventListener('click',()=>{ m.value='a4-mono'; d.value='36'; v.value=2000; s.value='full'; calc(); });
  calc();
})();
