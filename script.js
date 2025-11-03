// ============ PRELOADER ============
// Unificato: gestione preloader nell'IIFE sotto (classe .hidden)

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
    const MIN_DISPLAY = 1000; // almeno 1 secondo
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
  const modelli = {
    "a4-mono":   { base: 15.00, inclAnnoBn: 2500, costoBn: 0.0098, costoCol: 0 },
    "a3-mono":   { base: 30.00, inclAnnoBn: 8000, costoBn: 0.0090, costoCol: 0 },
    "a4-colore": { base: 25.00, inclAnnoBn: 2500, costoBn: 0.0095, costoCol: 0.085 },
    "a3-colore": { base: 40.00, inclAnnoBn: 8000, costoBn: 0.0095, costoCol: 0.078 }
  };

  const sconto={12:0,24:0.05,36:0.10,48:0.15,60:0.20};
  const serviziMap={standard:0,full:0};

  const m=document.getElementById('prev-modello');
  const d=document.getElementById('prev-durata');
  const vBn=document.getElementById('prev-volume');
  const vCol=document.getElementById('prev-volume-colore');
  const vColWrap=document.getElementById('prev-volume-colore-wrap');
  const vBnWrap=document.getElementById('prev-volume-bn-wrap');
  const s=document.getElementById('prev-servizi');
  const mens=document.getElementById('prev-mensile');
  const tot=document.getElementById('prev-totale');
  const wa=document.getElementById('prev-waBtn');
  const alertBox=document.getElementById('prev-alert');
  const detBase=document.getElementById('prev-detBase');
  const detPagine=document.getElementById('prev-detPagine');
  const detServizi=document.getElementById('prev-detServizi');
  const detSconto=document.getElementById('prev-detSconto');

  if(!m || !d || !vBn || !s || !mens) return; // tolto !tot

  function eur(n){return n.toLocaleString('it-IT',{style:'currency',currency:'EUR',minimumFractionDigits:2});}

  function aggiornaVisibilita(){
    const cfg = modelli[m.value];
    const isColore = cfg && cfg.costoCol > 0;
    if(vColWrap){ vColWrap.style.display = isColore ? '' : 'none'; }
    if(vBnWrap){ vBnWrap.style.display = isColore ? 'none' : ''; }
  }

  function bracketDiscount(value, tiers){
    if(value<=0) return {disc:0, alert:false};
    for(const t of tiers){ if(value <= t.max) return {disc:t.disc, alert:false}; }
    return {disc:tiers[tiers.length-1].disc, alert:true};
  }

  function getBnDiscount(machineType, size, overYear){
    if(machineType==='mono'){
      const tiers=[{max:15000,disc:0.10},{max:25000,disc:0.20},{max:35000,disc:0.30}];
      return bracketDiscount(overYear, tiers);
    } else {
      if(size==='a4'){
        const tiers=[{max:15000,disc:0.20},{max:25000,disc:0.30},{max:35000,disc:0.35}];
        return bracketDiscount(overYear, tiers);
      } else {
        const tiers=[{max:15000,disc:0.15},{max:25000,disc:0.25},{max:35000,disc:0.37}];
        return bracketDiscount(overYear, tiers);
      }
    }
  }

  function getColDiscount(size, colYear){
    if(size==='a4'){
      const tiers=[{max:15000,disc:0.20},{max:25000,disc:0.30},{max:35000,disc:0.40}];
      return bracketDiscount(colYear, tiers);
    } else {
      const tiers=[{max:15000,disc:0.25},{max:25000,disc:0.35},{max:35000,disc:0.45}];
      return bracketDiscount(colYear, tiers);
    }
  }

  function calc(){
    const mm=m.value;
    const dd=Number(d.value);
    const vvBn=Math.max(0,Number(vBn.value||0));
    const vvCol=Math.max(0,Number((vCol && vCol.value)||0));
    const ss=s.value;

    const cfg=modelli[mm];
    if(!cfg) return;
    const add=serviziMap[ss]||0;
    const disc=sconto[dd]||0;

    const costoBase=cfg.base;
    const inclMensileBn = (cfg.inclAnnoBn||0)/12;
    const eccedenzaBn = Math.max(0, vvBn - inclMensileBn);

    const isColor = (mm.indexOf('colore')!==-1);
    const size = mm.startsWith('a4') ? 'a4' : 'a3';

    const bnYearOver = Math.max(0, vvBn*12 - (cfg.inclAnnoBn||0));
    const {disc: bnDisc, alert: bnAlert} = getBnDiscount(isColor? 'colore':'mono', size, bnYearOver);
    const {disc: colDisc, alert: colAlert} = isColor ? getColDiscount(size, vvCol*12) : {disc:0, alert:false};

    let costoPagine = 0;
    costoPagine += eccedenzaBn * (cfg.costoBn||0) * (1 - bnDisc);
    if(isColor){
      costoPagine += vvCol * cfg.costoCol * (1 - colDisc);
    }

    const costoServizi=add;
    const lordo=costoBase+costoPagine+costoServizi;
    const valoreSconto=lordo*disc;
    const mensile=Math.max(0,lordo - valoreSconto);
    const totale=mensile*dd;

    if(mens) mens.textContent = eur(mensile);
    // tot.textContent=eur(totale); // Totale periodo nascosto su richiesta del cliente
    if(detBase) detBase.textContent=eur(costoBase);
    if(detPagine) detPagine.textContent=eur(costoPagine);
    if(detServizi) detServizi.textContent=eur(costoServizi);
    if(detSconto) detSconto.textContent='- '+eur(valoreSconto);

    const anyAlert = bnAlert || colAlert;
    if(alertBox){
      if(anyAlert){
        alertBox.style.display='';
      } else {
        alertBox.style.display='none';
      }
    }

    // Nota: riga "Stima totale periodo" rimossa dal messaggio WhatsApp su richiesta cliente

    const label={
      "a4-mono":"A4 Bianco e Nero",
      "a3-mono":"A3 Bianco e Nero",
      "a4-colore":"A4 Colore",
      "a3-colore":"A3 Colore"
    }[mm];
    const srv= ss==='full'? 'Full service (toner inclusi)':'Assistenza + parti usura';
    const volumiRiga = (cfg.costoCol && cfg.costoCol>0)
        ? `Pagine B/N: ${vvBn}/mese\nPagine Colore: ${vvCol}/mese`
        : `Pagine B/N: ${vvBn}/mese`;
    
    const txt=encodeURIComponent(`Salve DIEM Srl, vorrei un preventivo.\nModello: ${label}\n${volumiRiga}\nDurata: ${dd} mesi\nServizi: ${srv}\nStima canone mensile: ${eur(mensile)}`);
    if(wa) wa.href=`https://wa.me/3341056059?text=${txt}`;
  }

  ['change','input'].forEach(ev=>{
    m.addEventListener(ev,(e)=>{ aggiornaVisibilita(); calc(); });
    d.addEventListener(ev,calc);
    vBn.addEventListener(ev,calc);
    if(vCol) vCol.addEventListener(ev,calc);
    s.addEventListener(ev,calc);
  });
  const btnCalcola=document.getElementById('prev-btnCalcola');
  const btnReset=document.getElementById('prev-btnReset');
  if(btnCalcola) btnCalcola.addEventListener('click',calc);
  if(btnReset) btnReset.addEventListener('click',()=>{
    m.value='a4-mono'; d.value='36'; vBn.value=2000; if(vCol) vCol.value=0; s.value='full'; aggiornaVisibilita(); calc();
  });
  aggiornaVisibilita();
  calc();
})();


