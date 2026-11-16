const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Loader
window.addEventListener('load', () => setTimeout(() => $('#loader').classList.add('done'), 700));
$('#year').textContent = new Date().getFullYear();

// Typing effect
const words = ['Backend Developer', 'Python & Java Programmer', 'ML & RAG Enthusiast', 'Problem Solver'];
let w = 0, ch = 0, del = false;
(function type() {
  const word = words[w], el = $('#typing');
  el.textContent = word.slice(0, del ? --ch : ++ch);
  let delay = del ? 45 : 95;
  if (!del && ch === word.length) { del = true; delay = 1400; }
  else if (del && ch === 0) { del = false; w = (w + 1) % words.length; delay = 350; }
  setTimeout(type, delay);
})();

// Scroll: progress bar, header, active nav link
const links = $$('nav a'), sections = links.map(a => $(a.getAttribute('href')));
addEventListener('scroll', () => {
  const h = document.documentElement;
  $('#progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
  $('#header').classList.toggle('scrolled', scrollY > 40);
  const y = scrollY + innerHeight / 3;
  sections.forEach((s, i) => links[i].classList.toggle('active', s.offsetTop <= y && s.offsetTop + s.offsetHeight > y));
}, { passive: true });

// Mobile menu
$('#burger').onclick = () => $('#nav').classList.toggle('open');
links.forEach(a => a.onclick = () => $('#nav').classList.remove('open'));

// Reveal on scroll + counters + skill bars
const count = el => {
  const to = +el.dataset.to, dec = +(el.dataset.dec || 0), t0 = performance.now();
  const step = t => {
    const p = Math.min((t - t0) / 1800, 1), v = to * (1 - Math.pow(1 - p, 4));
    el.textContent = el.dataset.plain ? Math.round(v) : v.toFixed(dec);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const t = e.target; t.classList.add('in');
  $$('.count', t).forEach(count);
  $$('.bar', t).forEach(b => $('i', b).style.width = b.dataset.w + '%');
  io.unobserve(t);
}), { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));
// bars inside a revealed card need the card itself observed (handled above via querySelectorAll)

// Cursor glow + spotlight cards
const glow = $('#glow');
addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });
$$('.spot').forEach(c => c.addEventListener('mousemove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--x', e.clientX - r.left + 'px'); c.style.setProperty('--y', e.clientY - r.top + 'px');
}));

// Magnetic buttons
$$('.magnetic').forEach(b => {
  b.addEventListener('mousemove', e => {
    const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
  });
  b.addEventListener('mouseleave', () => b.style.transform = '');
});

// 3D tilt on hero photo
const tilt = $('#tilt');
if (matchMedia('(hover:hover)').matches) {
  tilt.addEventListener('mousemove', e => {
    const r = tilt.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    tilt.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  });
  tilt.addEventListener('mouseleave', () => tilt.style.transform = '');
}
