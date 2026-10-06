/* ===== Convite-livro — Kamilla & Henrique ===== */
(function () {
  'use strict';

  /* ---------- CONFIGURAÇÃO EDITÁVEL ---------- */
  var CASAMENTO = new Date(2027, 9, 9, 15, 30, 0); // 09/10/2027 15:30 (mês 9 = outubro)

  // Preencha quando tiver os dados reais. Se "mapa" ficar vazio, aparece "em breve".
  var LOCAL = { endereco: '', mapa: '' }; // ex.: { endereco: 'Rua ..., nº ...', mapa: 'https://maps.google.com/...' }

  // Para ligar um backend no futuro, coloque a URL aqui (recebe POST com JSON).
  var RSVP_ENDPOINT = '';

  // Lista de presentes: edite, apague ou acrescente itens (id único).
  var GIFTS = [
    { id: 'cama',      nome: 'Jogo de cama',               desc: 'Para deixar nossa casa ainda mais aconchegante.' },
    { id: 'toalhas',   nome: 'Jogo de toalhas',            desc: 'Maciez para os nossos dias de descanso.' },
    { id: 'jantar',    nome: 'Aparelho de jantar',         desc: 'Para receber quem amamos à mesa.' },
    { id: 'tacas',     nome: 'Conjunto de taças',          desc: 'Para brindar cada pequena conquista.' },
    { id: 'cafeteira', nome: 'Cafeteira',                  desc: 'Para começar as manhãs com calma.' },
    { id: 'liquid',    nome: 'Liquidificador',             desc: 'Sucos, vitaminas e receitas novas.' },
    { id: 'kitcoz',    nome: 'Kit de cozinha',             desc: 'Utensílios para cozinharmos juntos.' },
    { id: 'panela',    nome: 'Panela',                     desc: 'Para o primeiro jantar na casa nova.' },
    { id: 'vale',      nome: 'Vale-presente',              desc: 'Para escolhermos algo especial a dois.' },
    { id: 'lua',       nome: 'Experiência para os noivos', desc: 'Uma lembrança para viver depois do grande dia.' }
  ];
  var KEY_GIFTS = 'convite-kh:presentes', KEY_RSVP = 'convite-kh:presenca';

  /* ---------- UTILIDADES ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function load(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---------- HORTÊNSIAS (SVG botânico gerado) ---------- */
  var BLUES = ['#8aa6c9', '#7c9abf', '#a3b8d6', '#b6c7de', '#95accc', '#c7d4e6', '#8a9fc4', '#a9b4d4'];
  var PETAL = 'M0 0C-3-3-9-6-8.6-11.2-8.2-14.6-2.2-14.2 0-10 2.2-14.2 8.2-14.6 8.6-11.2 9-6 3-3 0 0Z';
  function rng(s) {
    return function () {
      s |= 0; s = s + 0x6D2B79F5 | 0;
      var t = Math.imul(s ^ s >>> 15, 1 | s);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function petals() {
    return [0, 90, 180, 270].map(function (a) { return '<path d="' + PETAL + '" transform="rotate(' + a + ')"/>'; }).join('');
  }
  function leaf(a, sc, k) {
    return '<g transform="translate(120 120) rotate(' + a + ') translate(30 0) scale(' + sc + ')">' +
      '<path d="M0 0C14-22 58-26 88 0 58 26 14 22 0 0Z" fill="' + (k % 2 ? '#8ea58b' : '#7d957b') + '"/>' +
      '<path d="M0 0C14-22 58-26 88 0" fill="none" stroke="#a9bba5" stroke-width="1.4" opacity=".7"/>' +
      '<path d="M4 0H80M30 0l14-9M30 0l14 9M52 0l12-8M52 0l12 8" stroke="#dfe8dc" stroke-width=".8" opacity=".55" fill="none"/></g>';
  }
  function hydrangea(seed) {
    var r = rng(seed), s = '<svg viewBox="0 0 240 240" aria-hidden="true" focusable="false">', i;
    [[-18, 1], [48, .9], [128, 1], [196, .92], [268, .85], [330, .8]].forEach(function (l, k) { s += leaf(l[0] + r() * 14, l[1], k); });
    for (i = 0; i < 96; i++) {
      var a = r() * 6.2832, d = Math.pow(r(), .62) * 76;
      var x = (120 + Math.cos(a) * d).toFixed(1), y = (120 + Math.sin(a) * d * .94).toFixed(1);
      var sc = ((.78 + r() * .5) * (1 - d / 230)).toFixed(2);
      s += '<use href="#floret" transform="translate(' + x + ' ' + y + ') rotate(' + Math.round(r() * 90) + ') scale(' + sc + ')" style="color:' +
           BLUES[Math.floor(r() * BLUES.length)] + '"/>';
    }
    return s + '</svg>';
  }
  function sprig(seed) {
    var r = rng(seed), s = '<svg viewBox="0 0 150 30" width="150" height="30" aria-hidden="true" focusable="false">' +
      '<path d="M4 15H52M98 15H146" stroke="#b9c8da" stroke-width="1"/>', i;
    s += '<g transform="translate(75 16)"><path d="M0 0C-8-9-22-9-30-3C-20 3-8 4 0 0ZM0 0C8-9 22-9 30-3C20 3 8 4 0 0Z" fill="#8ea58b" opacity=".85"/></g>';
    for (i = 0; i < 7; i++) {
      var a = (i / 7) * 6.2832 + r(), d = i ? 7 + r() * 3 : 0;
      s += '<use href="#floret" transform="translate(' + (75 + Math.cos(a) * d).toFixed(1) + ' ' + (13 + Math.sin(a) * d * .8).toFixed(1) + ') rotate(' + Math.round(r() * 90) + ') scale(.5)" style="color:' + BLUES[Math.floor(r() * BLUES.length)] + '"/>';
    }
    return s + '</svg>';
  }
  document.body.insertAdjacentHTML('afterbegin',
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
    '<g id="floret"><g fill="currentColor" stroke="#faf9f6" stroke-width=".55" stroke-opacity=".8">' + petals() + '</g>' +
    '<g fill="#fff" opacity=".2" transform="scale(.55)">' + petals() + '</g><circle r="1.2" fill="#e3e9d6"/></g></defs></svg>');
  $$('[data-hy]').forEach(function (el) { el.innerHTML = hydrangea(parseInt(el.getAttribute('data-hy'), 10)); });
  $$('[data-sprig]').forEach(function (el) { el.innerHTML = sprig(parseInt(el.getAttribute('data-sprig'), 10)); });

  /* ---------- LIVRO ---------- */
  var book = $('#book'), leaves = $$('.leaf', book), tabs = $$('.tabs a'), idx = 0;
  var ids = leaves.map(function (l) { return l.id; });

  function render() {
    leaves.forEach(function (l, k) {
      l.style.zIndex = leaves.length - k;
      l.classList.toggle('is-turned', k < idx);
      l.classList.toggle('is-current', k === idx);
      l.classList.toggle('is-next', k === idx + 1);
      l.inert = (k !== idx);
    });
    var cur = leaves[idx], sh = $('.sheet', cur);
    if (sh) sh.scrollTop = 0;
    document.body.setAttribute('data-tone', cur.getAttribute('data-tone') || 'light');
    tabs.forEach(function (a) {
      if (a.getAttribute('data-go') === cur.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    try { history.replaceState(null, '', idx === 0 && ids[0] === 'capa' ? location.pathname + location.search : '#' + cur.id); } catch (e) {}
  }
  function goTo(i) {
    if (i < 0 || i >= leaves.length) return;
    idx = i; render();
    var h = $('h1,h2', leaves[idx]);
    if (h) { h.setAttribute('tabindex', '-1'); setTimeout(function () { h.focus({ preventScroll: true }); }, 800); }
  }
  function leave(href) {
    var cur = leaves[idx];
    cur.classList.remove('enter', 'is-current'); cur.classList.add('is-turned');
    setTimeout(function () { location.href = href; }, 900);
  }
  function step(dir) {
    var href = leaves[idx].getAttribute(dir > 0 ? 'data-next-href' : 'data-prev-href');
    if (href) leave(href); else goTo(idx + dir);
  }
  function canStep(dir) { return !!leaves[idx].getAttribute(dir > 0 ? 'data-next-href' : 'data-prev-href') || (idx + dir >= 0 && idx + dir < leaves.length); }

  // Início: capa fechada, ou direto na página pedida (hash / vindo de outro arquivo)
  var start = ids.indexOf(location.hash.slice(1));
  if (ids[0] !== 'capa') { render(); }
  else if (start > 0) {
    book.classList.add('instant'); idx = start; render();
    leaves[idx].classList.add('enter');
    leaves[idx].addEventListener('animationend', function () { this.classList.remove('enter'); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { book.classList.remove('instant'); }); });
  } else render();

  window.addEventListener('hashchange', function () {
    var t = ids.indexOf(location.hash.slice(1));
    if (t >= 0 && t !== idx) { if (t > 0) $('#capa') && $('#capa').classList.add('opening'); goTo(t); }
  });

  // Abertura: aba do envelope levanta, depois a capa vira
  var abrir = $('#abrir');
  if (abrir) abrir.addEventListener('click', function () {
    var cover = $('#capa'); cover.classList.add('opening');
    setTimeout(function () { goTo(1); }, 1100);
  });

  $$('[data-step]').forEach(function (b) { b.addEventListener('click', function () { step(parseInt(b.getAttribute('data-step'), 10)); }); });
  $$('[data-go]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = ids.indexOf(a.getAttribute('data-go'));
      if (t < 0) return; // outro arquivo: navegação normal
      e.preventDefault(); goTo(t);
    });
  });
  document.addEventListener('keydown', function (e) {
    if (/INPUT|TEXTAREA/.test(e.target.tagName || '')) return;
    var onCover = ids[0] === 'capa' && idx === 0;
    if (e.key === 'ArrowRight' && !onCover && canStep(1)) step(1);
    if (e.key === 'ArrowLeft' && !onCover && canStep(-1)) step(-1);
  });

  // Arrastar / deslizar: a folha acompanha o dedo
  var drag = null;
  book.addEventListener('pointerdown', function (e) {
    if (e.button > 0 || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    drag = { x: e.clientX, y: e.clientY, on: false, dir: 0, leaf: null, id: e.pointerId };
  });
  book.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y, w = book.clientWidth;
    if (!drag.on) {
      if (Math.abs(dx) < 12 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      if (idx === 0 && ids[0] === 'capa') { drag = null; return; } // a capa abre pelo botão
      drag.dir = dx < 0 ? 1 : -1;
      if (!canStep(drag.dir)) { drag = null; return; }
      drag.on = true;
      var hrefd = leaves[idx].getAttribute(drag.dir > 0 ? 'data-next-href' : 'data-prev-href');
      drag.leaf = drag.dir > 0 || hrefd ? leaves[idx] : leaves[idx - 1];
      drag.back = drag.dir < 0 && !hrefd;
      drag.leaf.classList.add('dragging');
      if (drag.back) drag.leaf.style.opacity = 1;
      try { book.setPointerCapture(drag.id); } catch (er) {}
    }
    var p = Math.min(1, Math.abs(dx) / (w * .8));
    drag.p = p;
    drag.leaf.style.transform = 'rotateY(' + (drag.back ? -112 + p * 112 : -p * 112) + 'deg)';
  });
  function endDrag() {
    if (!drag) return;
    var d = drag; drag = null;
    if (!d.on) return;
    d.leaf.classList.remove('dragging'); d.leaf.style.transform = ''; d.leaf.style.opacity = '';
    window.__dragged = true; setTimeout(function () { window.__dragged = false; }, 50);
    if (d.p > .25) step(d.dir);
  }
  book.addEventListener('pointerup', endDrag);
  book.addEventListener('pointercancel', endDrag);
  book.addEventListener('click', function (e) { if (window.__dragged) { e.stopPropagation(); e.preventDefault(); } }, true);

  /* ---------- LOCAL ---------- */
  var li = $('#local-info');
  if (li) {
    li.textContent = '';
    if (LOCAL.endereco) li.appendChild(document.createTextNode(LOCAL.endereco + ' '));
    if (LOCAL.mapa) { var m = document.createElement('a'); m.href = LOCAL.mapa; m.target = '_blank'; m.rel = 'noopener'; m.textContent = 'Abrir no Google Maps'; li.appendChild(m); }
    if (!LOCAL.endereco && !LOCAL.mapa) li.textContent = 'Endereço e mapa em breve.';
  }

  /* ---------- CONTAGEM REGRESSIVA ---------- */
  var box = $('#contagem-timer');
  if (box) {
    var E = { d: $('#cd-d'), h: $('#cd-h'), m: $('#cd-m'), s: $('#cd-s') };
    var timer = setInterval(tick, 1000); tick();
  }
  function tick() {
    var diff = CASAMENTO.getTime() - Date.now();
    if (diff <= 0) { box.classList.add('done'); box.innerHTML = '<p>Hoje é o nosso grande dia. ♡</p>'; clearInterval(timer); return; }
    var sec = Math.floor(diff / 1000);
    E.d.textContent = Math.floor(sec / 86400);
    E.h.textContent = pad(Math.floor(sec % 86400 / 3600));
    E.m.textContent = pad(Math.floor(sec % 3600 / 60));
    E.s.textContent = pad(sec % 60);
  }

  /* ---------- CONFIRMAÇÃO DE PRESENÇA ---------- */
  var form = $('#rsvp');
  if (form) {
    var ok = $('#rsvp-ok'), msg = $('#rsvp-msg'), err = $('#rsvp-err');
    var showThanks = function (r) {
      var first = r.nome.split(/\s+/)[0], em = document.createElement('em');
      em.textContent = first; msg.textContent = '';
      msg.appendChild(document.createTextNode(r.resp === 'sim' ? 'Obrigada, ' : 'Sentiremos sua falta, '));
      msg.appendChild(em);
      msg.appendChild(document.createTextNode(r.resp === 'sim' ? '. Sua presença foi recebida com carinho.' : '. Obrigada por nos avisar com carinho.'));
      form.hidden = true; ok.hidden = false;
    };
    // Ponto único para integrar um backend: troque/estenda esta função.
    var enviar = function (dados) {
      save(KEY_RSVP, dados);
      if (!RSVP_ENDPOINT) return Promise.resolve();
      return fetch(RSVP_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) });
    };
    var saved = load(KEY_RSVP, null);
    if (saved && saved.nome) showThanks(saved);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = form.nome.value.trim(), n = parseInt(form.acomp.value, 10);
      var sel = form.querySelector('input[name=resp]:checked');
      if (nome.length < 3) { err.textContent = 'Digite seu nome completo.'; form.nome.focus(); return; }
      if (isNaN(n) || n < 0 || n > 10) { err.textContent = 'Informe de 0 a 10 acompanhantes.'; form.acomp.focus(); return; }
      if (!sel) { err.textContent = 'Escolha uma das respostas.'; return; }
      err.textContent = '';
      var dados = { nome: nome, acompanhantes: n, resp: sel.value, em: new Date().toISOString() };
      enviar(dados).then(function () { showThanks(dados); }, function () { err.textContent = 'Não foi possível enviar agora. Tente novamente.'; });
    });
    $('#rsvp-edit').addEventListener('click', function () { ok.hidden = true; form.hidden = false; form.nome.focus(); });
  }

  /* ---------- LISTA DE PRESENTES ---------- */
  var list = $('#gifts');
  if (list) {
    var taken = load(KEY_GIFTS, {});
    var draw = function () {
      list.innerHTML = '';
      GIFTS.forEach(function (g) {
        var it = document.createElement('li'), h = document.createElement('h3'), p = document.createElement('p'), b = document.createElement('button');
        h.textContent = g.nome; p.textContent = g.desc; b.type = 'button'; b.className = 'btn';
        if (taken[g.id]) { it.className = 'taken'; b.textContent = '✓ Presente reservado'; b.disabled = true; }
        else { b.textContent = 'Já comprei'; b.addEventListener('click', function () { taken[g.id] = true; save(KEY_GIFTS, taken); draw(); }); }
        it.appendChild(h); it.appendChild(p); it.appendChild(b); list.appendChild(it);
      });
    };
    draw();
    $('#gifts-reset').addEventListener('click', function () { taken = {}; save(KEY_GIFTS, taken); draw(); });
  }
})();
