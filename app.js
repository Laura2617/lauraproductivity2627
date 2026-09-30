/* Laura 26/27 · fase 2 (Hoy · Estudios · Añadir · Gym · Más · Visión) */
(function () {
  'use strict';
  const CFG = window.CONFIG || {};
  const DEMO = !CFG.API_URL;
  const APP_VERSION = '2.0 · fase 3 completa';
  const LS = { pin: 'l2627.pin', sound: 'l2627.sound', theme: 'l2627.theme' };
  const $ = (s, el) => (el || document).querySelector(s);
  const view = $('#view'), tabs = $('#tabs'), sheet = $('#sheet'), toastEl = $('#toast'), timerEl = $('#timer');

  const S = { pin: store('get', LS.pin), tab: 'hoy', fecha: null, today: null, meta: null, gym: null, gymMode: '60', gymRutina: null,
    pending: 0, seq: 0, add: null, est: null, coc: null, cocTab: 'menu', recFilter: 'Todas', bib: null, bibTab: 'libros', des: null, desTab: 'pend', rev: null, revDraft: null, form: null, picker: null, din: null, dinCat: '', fix: null, prog: null, progHabit: null, progMonth: null, estFilter: 'Todas', estOpen: {}, task: null, sedit: null, timer: null, soundLocal: store('get', LS.sound) !== 'off' };

  // ─── Utilidades ──────────────────────────────────────────────
  function store(op, k, v) { try { if (op === 'get') return localStorage.getItem(k); if (op === 'set') localStorage.setItem(k, v); if (op === 'del') localStorage.removeItem(k); } catch (e) { return null; } return null; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  const eur = (n) => (n == null || isNaN(n) ? '–' : Number(n).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €');
  const fmt = (n, d) => (n == null || n === '' || isNaN(n) ? '' : Number(n).toLocaleString('es-ES', { maximumFractionDigits: d == null ? 1 : d }));
  const iso = (d) => { const p = (n) => String(n).padStart(2, '0'); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); };
  const todayIso = () => iso(new Date());
  const addDays = (s, n) => { const [y, m, d] = s.split('-').map(Number); return iso(new Date(y, m - 1, d + n)); };
  const niceDate = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }); };
  const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  const shortDate = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }); };
  const emojiOf = (name) => { const m = String(name).match(/^(\p{Extended_Pictographic}️?)\s*/u); return m ? m[1] : '•'; };
  const labelOf = (name) => String(name).replace(/^(\p{Extended_Pictographic}️?)\s*/u, '');
  const ICON = {
    hoy: 'M12 3v2 M12 19v2 M3 12h2 M19 12h2 M5.6 5.6l1.4 1.4 M17 17l1.4 1.4 M5.6 18.4L7 17 M17 7l1.4-1.4 M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8z',
    gym: 'M6 7v10 M18 7v10 M3 10v4 M21 10v4 M6 12h12', plus: 'M12 5v14 M5 12h14',
    recetas: 'M4 11h16v2a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7z M2 11h20 M9 7c0-2 2-2 2-4 M14 7c0-2 2-2 2-4',
    mas: 'M4 6h16 M4 12h16 M4 18h16', vision: 'M12 2l3 6 6 1-4.5 4.5 1 6.5-5.5-3-5.5 3 1-6.5L3 9l6-1z', close: 'M6 6l12 12 M18 6L6 18', check: 'M5 12l5 5 9-10', flame: 'M12 22c4 0 7-3 7-7 0-4-3-6-4-9-1 2-2 3-4 3 0-2 0-4-1-6-3 3-5 7-5 12 0 4 3 7 7 7z',
    warn: 'M12 3l10 18H2z M12 10v5 M12 18h.01', trophy: 'M8 4h8v5a4 4 0 0 1-8 0z M8 6H4v1a4 4 0 0 0 4 4 M16 6h4v1a4 4 0 0 1-4 4 M12 13v4 M8 20h8',
    chev: 'M9 6l6 6-6 6', trash: 'M4 7h16 M10 11v6 M14 11v6 M6 7l1 13h10l1-13 M9 7V4h6v3', clock: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z M12 7v5l3 2',
    estudios: 'M2 9l10-5 10 5-10 5z M6 11v5c3 2.5 9 2.5 12 0v-5 M22 9v6', sheet: 'M4 4h16v16H4z M4 10h16 M10 4v16', logout: 'M15 4h4v16h-4 M10 8l-4 4 4 4 M6 12h10', sound: 'M4 9v6h4l5 4V5L8 9z M17 9a4 4 0 0 1 0 6'
  };
  const icon = (k, cls) => `<svg class="i ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON[k]}"/></svg>`;

  function toast(msg, bad) {
    toastEl.textContent = msg; toastEl.className = 'toast' + (bad ? ' bad' : ''); toastEl.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(() => { toastEl.hidden = true; }, bad ? 4200 : 2600);
  }
  function setSaving(on) {
    let el = $('.saving');
    if (on && !el) { el = document.createElement('div'); el.className = 'saving'; el.title = 'Guardando…'; document.body.appendChild(el); }
    if (!on && el) el.remove();
  }

  // ─── API ─────────────────────────────────────────────────────
  async function api(action, params) {
    const body = Object.assign({}, params || {}, { action, pin: S.pin });
    S.pending++; setSaving(true);
    try {
      let r;
      if (DEMO) r = await window.DemoAPI(action, body);
      else {
        const res = await fetch(CFG.API_URL, { method: 'POST', body: JSON.stringify(body), redirect: 'follow' });
        r = await res.json();
      }
      if (!r.ok) {
        if (r.badPin || r.locked) { if (action !== 'ping') logout(r.error); }
        throw new Error(r.error || 'Error');
      }
      return r;
    } catch (e) {
      if (String(e.message).match(/Failed to fetch|NetworkError|Load failed/)) throw new Error('Sin conexión. Inténtalo de nuevo.');
      throw e;
    } finally { S.pending--; if (!S.pending) setSaving(false); }
  }

  // ─── Arranque ────────────────────────────────────────────────
  function start() {
    if (!S.pin) return renderLogin();
    tabs.hidden = false; renderTabs(); go('hoy');
    setTimeout(maybeSplash, 1500);
  }
  function logout(msg) { store('del', LS.pin); S.pin = null; tabs.hidden = true; renderLogin(msg); }

  function renderLogin(msg) {
    tabs.hidden = true; let pin = '';
    const draw = (err) => {
      view.innerHTML = `<section class="login">
        <div class="logo">26/27</div>
        <div><h1 style="font-size:28px">Hola, Laura</h1><p class="muted" style="margin:6px 0 0">Introduce tu PIN</p></div>
        <div class="pin-dots">${[0, 1, 2, 3].map((k) => `<i class="${k < pin.length ? 'on' : ''}"></i>`).join('')}</div>
        <div class="err" role="alert">${esc(err || '')}</div>
        <div class="keypad">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k) => k ? `<button type="button" data-k="${k}" aria-label="${k === '⌫' ? 'Borrar' : k}">${k}</button>` : '<span></span>').join('')}</div>
        ${DEMO ? '<p class="demo-banner">Modo demo · el PIN es 0000. Conecta tu Google Sheets en config.js.</p>' : ''}
      </section>`;
    };
    draw(msg);
    view.onclick = async (e) => {
      const b = e.target.closest('[data-k]'); if (!b) return;
      unlockAudio();
      const k = b.dataset.k;
      if (k === '⌫') pin = pin.slice(0, -1); else if (pin.length < 8) pin += k;
      draw();
      if (pin.length >= 4) {
        S.pin = pin;
        try { await api('ping'); store('set', LS.pin, pin); view.onclick = null; start(); }
        catch (err) { S.pin = null; pin = ''; draw(err.message); }
      }
    };
  }

  function renderTabs() {
    const t = [['hoy', 'Hoy'], ['estudios', 'Estudios'], ['add', ''], ['gym', 'Gym'], ['mas', 'Más']];
    const cur = ['vision', 'dinero', 'progreso', 'recetas', 'biblioteca', 'deseos', 'revision'].includes(S.tab) ? 'mas' : S.tab;
    tabs.innerHTML = t.map(([k, l]) => k === 'add'
      ? `<button type="button" class="add" data-tab="add" aria-label="Añadir">${icon('plus')}</button>`
      : `<button type="button" data-tab="${k}" class="${cur === k ? 'on' : ''}">${icon(k)}<span>${l}</span></button>`).join('');
  }
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]'); if (!b) return;
    unlockAudio();
    if (b.dataset.tab === 'add') return openAdd();
    go(b.dataset.tab);
  });
  function go(tab) {
    S.tab = tab; renderTabs(); window.scrollTo(0, 0);
    if (tab === 'hoy') loadToday();
    else if (tab === 'gym') loadGym();
    else if (tab === 'mas') loadMas();
    else if (tab === 'vision') loadVision();
    else if (tab === 'dinero') { if (S.din) renderDinero(); loadDinero(S.din ? S.din.mes : '', true); }
    else if (tab === 'progreso') { if (S.prog) renderProgreso(); loadProgreso(); }
    else if (tab === 'estudios') { if (S.est) renderEstudios(); loadEstudios(true); }
    else if (tab === 'recetas') { if (S.coc) renderCocina(); loadCocina(); }
    else if (tab === 'biblioteca') { if (S.bib) renderBiblioteca(); loadBiblioteca(); }
    else if (tab === 'deseos') { if (S.des) renderDeseos(); loadDeseos(); }
    else if (tab === 'revision') { S.rev = null; loadRevision(''); }
  }
  function skeleton() { view.innerHTML = '<div class="skeleton" style="height:60px"></div><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton" style="height:220px"></div>'; }

  // ─── HOY ─────────────────────────────────────────────────────
  async function loadToday(silent) {
    if (!S.fecha) S.fecha = todayIso();
    if (!silent || !S.today) skeleton();
    try { S.today = await api('today', { fecha: S.fecha }); if (S.tab === 'hoy') renderToday(); }
    catch (e) { if (S.tab === 'hoy') view.innerHTML = errBox(e.message, 'reload-today'); }
  }
  function errBox(msg, act) { return `<div class="card"><p class="bold">No se ha podido cargar</p><p class="muted small">${esc(msg)}</p><button type="button" class="btn" data-act="${act}">Reintentar</button></div>`; }

  function habitDone(h) {
    if (h.type === 'Sí/No') return !!h.value;
    if (h.value == null || h.value === '') return false;
    return h.type === 'Número ≥' ? Number(h.value) >= h.meta : Number(h.value) <= h.meta;
  }
  function recomputePct(t) {
    const act = t.habits.filter((h) => h.freq === 'Diario' && h.activo);
    t.pct = act.length ? act.filter((h) => h.done).length / act.length : 0;
  }
  const STEP = { 2: 5, 7: 0.5, 8: 5, 9: 1, 10: 500 };
  const UNIT = { 2: 'min', 7: 'h', 8: 'min', 9: 'págs', 10: 'pasos' };

  function renderToday() {
    const t = S.today; if (!t) return;
    const isToday = S.fecha === todayIso();
    const daily = t.habits.filter((h) => h.freq === 'Diario' && h.activo);
    const checks = daily.filter((h) => h.type === 'Sí/No');
    const nums = daily.filter((h) => h.type !== 'Sí/No');
    const weekly = t.habits.filter((h) => h.freq !== 'Diario' && h.activo);
    const lvl2 = t.habits.filter((h) => !h.activo && h.freq === 'Diario');
    const doneN = daily.filter((h) => h.done).length;
    const C = 2 * Math.PI * 34, off = C * (1 - t.pct);
    const gymDef = t.habits.find((h) => h.i === 11) || {};
    const curso = t.habits.find((h) => h.i === 2) || {};
    const left = `
      ${DEMO ? '<div class="demo-banner">Modo demo: los datos son de ejemplo y no se guardan.</div>' : ''}
      <header class="head">
        <div>
          <div class="datenav">
            <button type="button" data-act="day" data-d="-1" aria-label="Día anterior">‹</button>
            <span>${esc(cap(niceDate(S.fecha)))}</span>
            <button type="button" data-act="day" data-d="1" aria-label="Día siguiente" ${isToday ? 'disabled' : ''}>›</button>
          </div>
          <h1>${isToday ? 'Hola, ' + esc(t.nombre || 'Laura') : 'Editando otro día'}</h1>
        </div>
        ${t.bestStreak && t.bestStreak.days ? `<span class="pill flame" title="${esc(labelOf(t.bestStreak.name))}">${icon('flame')}${t.bestStreak.days} días</span>` : ''}
      </header>
      ${t.frase && t.frase.text ? `<section class="quote"><span class="kicker">Frase del día</span><p>“${esc(t.frase.text)}”</p><span class="src">${esc(t.frase.autor)}</span></section>` : ''}
      <section class="card ring-card tap" data-act="goprog" role="button" tabindex="0" aria-label="Ver tu progreso">
        <div class="ring"><svg viewBox="0 0 84 84"><circle class="track" cx="42" cy="42" r="34" fill="none" stroke-width="10"/><circle class="bar" cx="42" cy="42" r="34" fill="none" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${off}"/></svg><span>${Math.round(t.pct * 100)}%</span></div>
        <div><div class="bold" style="font-size:17px">${doneN} de ${daily.length} hábitos</div><div class="muted small" style="margin-top:4px">${t.pct >= 1 ? '¡Día completo! Has votado por quien quieres ser.' : 'Cada ✓ es un voto por la persona que quieres ser.'}</div></div>
      </section>
      ${t.failedYesterday && t.failedYesterday.length && isToday ? `<section class="alert">${icon('warn')}<div><b>Nunca falles dos veces</b><span class="small">Ayer se quedó sin hacer: ${esc(t.failedYesterday.map(labelOf).join(', '))}. Hoy, aunque sea la versión de 2 minutos.</span></div></section>` : ''}
      <section style="display:flex;flex-direction:column;gap:10px">
        <div class="section-title"><h2>Núcleo diario</h2><span class="muted small">toca para marcar</span></div>
        ${checks.map((h) => habitRow(h, t)).join('')}
      </section>
      ${tasksCard(t)}`;
    const right = `
      <section style="display:flex;flex-direction:column;gap:10px">
        <div class="section-title"><h2>Tus números</h2><span class="muted small">Polar = automático</span></div>
        <div class="nums">${nums.map(numCard).join('')}</div>
        ${curso.value > 0 ? `<div class="card" style="padding:12px 14px"><div class="small muted" style="margin-bottom:8px">¿Qué curso has hecho hoy?</div><div class="chips">${['DP-900', 'Claude', 'SAS', 'Otro'].map((c) => `<button type="button" class="chip blue ${t.curso === c ? 'on' : ''}" data-act="curso" data-v="${c}">${c}</button>`).join('')}</div></div>` : ''}
      </section>
      ${gymCard(t, gymDef)}
      <section style="display:flex;flex-direction:column;gap:10px">
        <div class="section-title"><h2>Esta semana</h2><span class="muted small">márcalo el día que lo hagas</span></div>
        ${weekly.filter((h) => h.i !== 11).map((h) => habitRow(h, t, true)).join('')}
      </section>
      ${isToday && new Date().getDay() === 0 ? `<section class="card sunday tap" data-act="gorev" role="button" tabindex="0"><span style="font-size:26px">🔁</span><div style="flex:1"><div class="bold">Hoy toca revisión semanal</div><div class="small muted">10 minutos · y copias el resumen para Claude</div></div>${icon('chev')}</section>` : ''}
      ${Array.isArray(t.menuHoy) && t.menuHoy.length ? `<section class="card tap" data-act="gorec" role="button" tabindex="0"><div class="kicker" style="margin-bottom:6px">🍽 Hoy comes</div>${t.menuHoy.map((m) => `<div class="small" style="margin:3px 0"><span class="muted">${esc(m.momento)}:</span> <b>${esc(m.receta)}</b></div>`).join('')}</section>` : ''}
      ${t.agenda && t.agenda.length ? `<section class="card agenda"><div class="kicker" style="margin-bottom:8px">Tu día</div>${t.agenda.map((a) => `<div class="it"><span class="t">${esc(a.inicio)}</span><span class="ln" style="background:${agColor(a.tipo)}"></span><div><div class="bold" style="font-size:15px">${esc(a.actividad)}</div><div class="small muted">${esc(a.inicio)}–${esc(a.fin)}${a.notas ? ' · ' + esc(a.notas) : ''}</div></div></div>`).join('')}</section>` : ''}
      <section class="money tap" data-act="godin" role="button" tabindex="0" aria-label="Ver tu dinero"><div><span class="small">Gastado ${isToday ? 'hoy' : 'ese día'}</span><b>${eur(t.money.gastadoHoy)}</b></div><div style="text-align:right"><span class="small">Te queda este mes</span><b>${eur(t.money.queda)}</b></div></section>
      ${lvl2.length ? `<details class="level2 card"><summary class="row between"><span><b>Nivel 2</b> <span class="muted small">· puedes marcarlos, no cuentan en tu %</span></span>${icon('chev', 'chev')}</summary><div style="display:flex;flex-direction:column;gap:10px;margin-top:12px">${lvl2.map((h) => habitRow(h, t)).join('')}</div></details>` : ''}`;
    view.innerHTML = `<div class="cols"><div>${left}</div><div>${right}</div></div>`;
  }
  function agColor(tipo) { return ({ Clase: '#2456E6', Estudio: '#6D4AFF', 'Certificación': '#8B5CF6', Gym: '#14B8A6', Deporte: '#E8A317', Curso: '#0EA5E9', Comida: '#F59E0B', Rutina: '#94A3B8' })[tipo] || '#94A3B8'; }
  function habitRow(h, t, weekly) {
    let sub = '';
    if (h.i === 6) sub = `Objetivo ${esc(t.wakeTarget || '')}${t.despertar ? ' · Polar: ' + esc(t.despertar) : ' · se marca con tu Polar'}`;
    else if (weekly) sub = h.freq === 'Semanal' ? `Esta semana: ${h.count}/${h.veces}` : `Este mes: ${h.count}/${h.veces}`;
    else if (h.done && h.streak) sub = `Racha ${h.streak} ${h.streak === 1 ? 'día' : 'días'}`;
    else if (h.streak) sub = `Racha ${h.streak} · márcalo para mantenerla`;
    else sub = h.mini ? 'Versión 2 min: ' + h.mini : 'Empieza hoy tu racha';
    const miss = !h.done && h.yesterday === false && h.freq === 'Diario' && h.activo;
    return `<div class="habit ${h.done ? 'done' : ''} ${miss ? 'miss' : ''}">
      <div class="ico" aria-hidden="true">${esc(emojiOf(h.name))}</div>
      <div class="txt"><span class="name">${esc(labelOf(h.name))}</span><span class="sub">${sub}</span></div>
      <button type="button" class="check ${h.value ? 'on' : ''}" data-act="toggle" data-i="${h.i}" aria-pressed="${h.value ? 'true' : 'false'}" aria-label="${h.value ? 'Desmarcar' : 'Marcar'} ${esc(labelOf(h.name))}">${h.value ? icon('check') : ''}</button>
    </div>`;
  }
  function numCard(h) {
    const v = h.value == null ? '' : h.value;
    const meta = h.type === 'Número ≤' ? 'máx. ' + fmt(h.meta, 0) : 'meta ' + fmt(h.meta, 1);
    let pct = 0;
    if (v !== '') pct = h.type === 'Número ≤' ? (Number(v) <= h.meta ? 100 : Math.max(0, 100 - (Number(v) - h.meta) / h.meta * 100)) : Math.min(100, Number(v) / h.meta * 100);
    const polar = h.i === 7 || h.i === 10;
    return `<div class="num"><div class="top"><span>${esc(emojiOf(h.name))} ${esc(labelOf(h.name).replace(/\s*\(.*\)/, ''))}</span>${polar ? '<span class="badge">Polar</span>' : `<span class="meta">${meta}</span>`}</div>
      <div class="ctl"><button type="button" data-act="step" data-i="${h.i}" data-d="-1" aria-label="Restar">−</button>
      <input type="number" inputmode="decimal" step="any" value="${v === '' ? '' : v}" data-act="numin" data-i="${h.i}" aria-label="${esc(labelOf(h.name))}" placeholder="–">
      <button type="button" data-act="step" data-i="${h.i}" data-d="1" aria-label="Sumar">+</button></div>
      <div class="unit">${UNIT[h.i] || ''}${polar ? ' · ' + meta : ''}</div>
      <div class="bar ${h.done ? 'ok' : ''}"><i style="width:${pct}%"></i></div></div>`;
  }
  function gymCard(t, gymDef) {
    const g = t.gym || {};
    const n = gymDef.count || g.semana || 0, meta = gymDef.veces || g.meta || 4;
    const dots = Array.from({ length: meta }, (_, k) => `<i class="${k < n ? 'on' : ''}"></i>`).join('');
    const done = gymDef.value || gymDef.done;
    return `<section class="card gymcard" style="display:flex;flex-direction:column;gap:12px">
      <div class="row between"><span class="kicker">${g.rutina ? 'Hoy toca gym' : 'Gym esta semana'}</span><div class="dots" aria-label="${n} de ${meta} sesiones">${dots}</div></div>
      ${g.rutina ? `<div class="row"><div class="ico" style="width:52px;height:52px;border-radius:16px;background:var(--teal-soft);color:var(--teal);display:flex;align-items:center;justify-content:center">${icon('gym')}</div><div><div style="font-family:var(--display);font-size:20px;font-weight:700">${esc(g.rutina)}</div><div class="small muted">${g.ejercicios} ejercicios · ${n}/${meta} esta semana</div></div></div>
      <button type="button" class="btn teal" data-act="gogym">${done ? 'Ver el entreno de hoy ✓' : 'Empezar entreno'}</button>`
      : `<div class="small muted">Hoy es día de descanso. Llevas ${n} de ${meta} sesiones esta semana.</div>`}
    </section>`;
  }

  // Interacción de Hoy
  let numTimers = {};
  view.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-act]'); if (!b || S.tab !== 'hoy' && !['reload-today'].includes(b.dataset.act)) return;
    const act = b.dataset.act;
    if (act === 'reload-today') return loadToday();
    if (act === 'day') { const nf = addDays(S.fecha, Number(b.dataset.d)); if (nf > todayIso() || nf < '2026-10-01') return; S.fecha = nf; S.fechaAuto = nf === todayIso(); return loadToday(); }
    if (act === 'gogym') return go('gym');
    if (act === 'goprog') return go('progreso');
    if (act === 'godin') return go('dinero');
    if (act === 'gorev') return go('revision');
    if (act === 'gorec') return go('recetas');
    if (act === 'toggle') {
      const h = S.today.habits.find((x) => x.i === Number(b.dataset.i)); if (!h) return;
      h.value = !h.value; h.done = habitDone(h);
      const before = S.today.pct; recomputePct(S.today); renderToday();
      if (S.today.pct >= 1 && before < 1) confetti();
      return save('setHabit', { fecha: S.fecha, i: h.i, value: h.value });
    }
    if (act === 'step') {
      const h = S.today.habits.find((x) => x.i === Number(b.dataset.i)); if (!h) return;
      const step = STEP[h.i] || 1;
      const dir = Number(b.dataset.d);
      if (h.value == null || h.value === '') h.value = dir > 0 ? ({ 7: 7, 10: 5000, 8: 60 })[h.i] || step : 0;
      else h.value = Math.max(0, Math.round((Number(h.value) + step * dir) * 100) / 100);
      h.done = habitDone(h); recomputePct(S.today); renderToday();
      clearTimeout(numTimers[h.i]);
      numTimers[h.i] = setTimeout(() => save('setHabit', { fecha: S.fecha, i: h.i, value: h.value }), 700);
    }
    if (act === 'curso') { S.today.curso = b.dataset.v; renderToday(); return save('setField', { fecha: S.fecha, field: 'curso', value: b.dataset.v }); }
  });
  view.addEventListener('change', (e) => {
    const el = e.target.closest('[data-act="numin"]'); if (!el || S.tab !== 'hoy') return;
    const h = S.today.habits.find((x) => x.i === Number(el.dataset.i)); if (!h) return;
    const v = el.value === '' ? null : Number(String(el.value).replace(',', '.'));
    h.value = v; h.done = habitDone(h); recomputePct(S.today); renderToday();
    save('setHabit', { fecha: S.fecha, i: h.i, value: v });
  });
  async function save(action, params) {
    const my = ++S.seq;
    try {
      const r = await api(action, params);
      if (my === S.seq && S.tab === 'hoy' && r.habits) { S.today = r; renderToday(); }
    } catch (e) { toast(e.message, true); loadToday(true); }
  }
  function confetti() {
    const colors = ['#2456E6', '#14B8A6', '#6D4AFF', '#F59E0B', '#EC4899', '#60A5FA'];
    for (let k = 0; k < 60; k++) {
      const c = document.createElement('i'); c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw'; c.style.background = colors[k % colors.length];
      c.style.animationDelay = Math.random() * 0.5 + 's'; c.style.animationDuration = 1.8 + Math.random() * 1.2 + 's';
      document.body.appendChild(c); setTimeout(() => c.remove(), 3600);
    }
  }

  // ─── GYM ─────────────────────────────────────────────────────
  async function loadGym(rutina) {
    skeleton();
    try {
      S.gym = await api('gymPlan', { fecha: todayIso(), rutina: rutina || S.gymRutina || undefined });
      S.gymRutina = S.gym.rutina;
      prepGym(); if (S.tab === 'gym') renderGym();
    } catch (e) { if (S.tab === 'gym') view.innerHTML = errBox(e.message, 'reload-gym'); }
  }
  function nSeries(ex) {
    if (S.gymMode === 'cansada') return Math.max(1, ex.series - 1);
    return ex.series;
  }
  function visibleEx() {
    const list = S.gym.ejercicios;
    if (S.gymMode !== '30') return list;
    const acc = list.find((x) => x.tipo === 'Accesorio');
    return list.filter((x) => x.orden <= 2 || x === acc || !['Principal', 'Secundario', 'Accesorio'].includes(x.tipo));
  }
  function unitOf(ex) { if (/minutos/i.test(ex.tecnica || '')) return 'min'; if (/segundos/i.test(ex.tecnica || '')) return 's'; return 'reps'; }
  function prepGym() {
    S.gym.ejercicios.forEach((ex) => {
      ex.draft = [];
      for (let k = 1; k <= ex.series; k++) {
        const lastSet = ex.last && ex.last.sets[k - 1];
        const kg = ex.salto === 0 && ex.sugerido == null ? null : (ex.sugerido != null ? ex.sugerido : (lastSet ? lastSet.kg : null));
        const reps = lastSet && lastSet.reps != null && !(ex.last && ex.last.subir) ? Math.max(ex.repsMin, lastSet.reps) : ex.repsMin;
        ex.draft.push({ kg, reps });
      }
    });
  }
  function renderGym() {
    const g = S.gym; if (!g) return;
    const exs = visibleEx();
    const total = exs.reduce((a, ex) => a + nSeries(ex), 0);
    const done = exs.reduce((a, ex) => a + Math.min(nSeries(ex), ex.hechas.length), 0);
    const activeIdx = exs.findIndex((ex) => ex.hechas.length < nSeries(ex));
    const modes = [['60', '60 min'], ['45', '45 min'], ['30', '30 min'], ['cansada', 'Cansada']];
    view.innerHTML = `
      ${DEMO ? '<div class="demo-banner">Modo demo: los entrenos no se guardan.</div>' : ''}
      <header class="head"><div><div class="muted small">${esc(cap(niceDate(g.fecha)))}${g.rutinaHoy === g.rutina ? ' · te toca hoy' : ''}</div><h1>${esc(g.rutina)}</h1></div>
        <span class="pill teal">${icon('gym')}${done}/${total}</span></header>
      <div class="chips scroll">${g.rutinas.map((r) => `<button type="button" class="chip ${r === g.rutina ? 'on' : ''}" data-act="rutina" data-v="${esc(r)}">${esc(r)}</button>`).join('')}</div>
      <div><div class="small muted bold" style="margin-bottom:8px">¿Cuánto tiempo tienes hoy?</div>
        <div class="chips">${modes.map(([k, l]) => `<button type="button" class="chip ${S.gymMode === k ? 'on' : ''}" data-act="mode" data-v="${k}">${l}</button>`).join('')}</div>
        ${S.gymMode === '45' ? '<p class="small muted" style="margin:8px 0 0">Haz los accesorios en superserie: uno detrás de otro, sin descanso entre ellos.</p>' : ''}
        ${S.gymMode === '30' ? '<p class="small muted" style="margin:8px 0 0">Versión exprés: principal, un secundario y un accesorio. Mejor corta que saltársela.</p>' : ''}
        ${S.gymMode === 'cansada' ? '<p class="small muted" style="margin:8px 0 0">Una serie menos en cada ejercicio y sin buscar récords. Hoy cuenta igual.</p>' : ''}
      </div>
      <div class="progress"><div class="bar"><i style="width:${total ? done / total * 100 : 0}%"></i></div><span class="bold small">${done}/${total} series</span></div>
      <div class="cols"><div>${exs.filter((_, k) => k % 2 === 0 || window.innerWidth < 820).map((ex) => exCard(ex, exs.indexOf(ex) === activeIdx)).join('')}</div>
      <div>${window.innerWidth >= 820 ? exs.filter((_, k) => k % 2 === 1).map((ex) => exCard(ex, exs.indexOf(ex) === activeIdx)).join('') : ''}</div></div>
      <button type="button" class="btn dark" data-act="finish">Terminar entreno</button>
      <p class="small muted" style="text-align:center;margin:0">Con una serie guardada, el hábito de Gimnasio se marca solo.</p>`;
  }
  function exCard(ex, active) {
    const n = nSeries(ex);
    const unit = unitOf(ex);
    const complete = ex.hechas.length >= n;
    let lastTxt = 'Primera vez: empieza con un peso cómodo y apunta.';
    if (ex.last) {
      const reps = ex.last.sets.map((s) => s.reps).filter((x) => x != null);
      lastTxt = `La última vez (${shortDate(ex.last.fecha)}): ${ex.last.sets.length} × ${reps.length ? Math.min(...reps) + (Math.max(...reps) !== Math.min(...reps) ? '-' + Math.max(...reps) : '') : '?'}${ex.last.kg != null ? ' · ' + fmt(ex.last.kg, 2) + ' kg' : ''}`;
    }
    let goal = '';
    if (ex.last && ex.last.subir && ex.sugerido != null) goal = `¡Toca subir! Hoy ${fmt(ex.sugerido, 2)} kg y vuelve a ${ex.repsMin} reps`;
    else if (ex.last && ex.last.kg != null) goal = `Objetivo: ${n} × ${ex.repsMax} con ${fmt(ex.last.kg, 2)} kg`;
    const rows = [];
    for (let k = 1; k <= n; k++) {
      const h = ex.hechas.find((s) => s.serie === k);
      const d = ex.draft[k - 1] || { kg: null, reps: ex.repsMin };
      const kg = h ? h.kg : d.kg, reps = h ? h.reps : d.reps;
      const showKg = !(ex.salto === 0 && kg == null);
      rows.push(`<div class="set ${h ? 'done' : ''}">
        <span class="n">${k}</span>
        ${showKg ? stepper(ex, k, 'kg', kg, 'kg', !!h) : '<span class="small muted" style="text-align:center">—</span>'}
        ${stepper(ex, k, 'reps', reps, unit, !!h)}
        <button type="button" class="check ${h ? 'on teal' : ''}" data-act="${h ? 'unset' : 'set'}" data-ex="${esc(ex.ejercicio)}" data-k="${k}" aria-label="${h ? 'Deshacer serie' : 'Serie hecha'} ${k}">${h ? icon('check') : ''}</button>
      </div>`);
    }
    return `<article class="ex ${active ? 'active' : ''} ${complete ? 'complete' : ''}">
      <div class="row between" style="align-items:flex-start"><div style="display:flex;flex-direction:column;gap:4px"><span class="tag ${esc(ex.tipo)}">${esc(ex.tipo).toUpperCase()}</span><h3>${esc(ex.ejercicio)}</h3>
        <span class="small muted">${n} × ${ex.repsMin}${ex.repsMax !== ex.repsMin ? '-' + ex.repsMax : ''} ${unit} · descanso ${fmtRest(ex.descanso)}</span></div>
        ${ex.record != null ? `<div style="color:var(--amber);text-align:center;font-size:12px;font-weight:700">${icon('trophy')}<div>${fmt(ex.record, 2)} kg</div></div>` : ''}</div>
      <div class="last"><span>${esc(lastTxt)}</span>${goal ? `<span class="goal">${esc(goal)}</span>` : ''}</div>
      <div class="sets"><div class="set head"><span class="tiny muted">Serie</span><span class="tiny muted" style="text-align:center">kg</span><span class="tiny muted" style="text-align:center">${unit}</span><span></span></div>${rows.join('')}</div>
      ${ex.tecnica || ex.sustituto ? `<details class="ex-more"><summary>Técnica · si está ocupado</summary>${ex.tecnica ? `<p>${esc(ex.tecnica)}</p>` : ''}${ex.sustituto ? `<p>Cambio: ${esc(ex.sustituto)}</p>` : ''}</details>` : ''}
    </article>`;
  }
  function stepper(ex, k, field, val, unit, locked) {
    return `<div class="stepper"><button type="button" data-act="sstep" data-ex="${esc(ex.ejercicio)}" data-k="${k}" data-f="${field}" data-d="-1" aria-label="Menos" ${locked ? 'tabindex="-1"' : ''}>−</button>
      <input type="number" inputmode="decimal" step="any" value="${val == null ? '' : val}" data-act="sin" data-ex="${esc(ex.ejercicio)}" data-k="${k}" data-f="${field}" ${locked ? 'readonly' : ''} aria-label="${field} serie ${k}">
      <button type="button" data-act="sstep" data-ex="${esc(ex.ejercicio)}" data-k="${k}" data-f="${field}" data-d="1" aria-label="Más" ${locked ? 'tabindex="-1"' : ''}>+</button></div>`;
  }
  const fmtRest = (s) => (s >= 60 ? (s / 60).toLocaleString('es-ES', { maximumFractionDigits: 1 }) + ' min' : s + ' s');
  const findEx = (name) => S.gym.ejercicios.find((x) => x.ejercicio === name);

  view.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-act]'); if (!b || S.tab !== 'gym') return;
    const act = b.dataset.act;
    if (act === 'reload-gym') return loadGym();
    if (act === 'rutina') { S.gymRutina = b.dataset.v; return loadGym(b.dataset.v); }
    if (act === 'mode') { S.gymMode = b.dataset.v; return renderGym(); }
    if (act === 'finish') {
      stopTimer();
      const n = S.gym.ejercicios.reduce((a, x) => a + x.hechas.length, 0);
      toast(n ? `¡Entreno guardado! ${n} series. Gym marcado en Hábitos 💪` : 'Aún no has guardado ninguna serie');
      if (n) { S.today = null; setTimeout(() => go('hoy'), 900); }
      return;
    }
    const ex = b.dataset.ex ? findEx(b.dataset.ex) : null; if (!ex) return;
    const k = Number(b.dataset.k), d = ex.draft[k - 1];
    if (act === 'sstep') {
      const f = b.dataset.f, dir = Number(b.dataset.d);
      if (f === 'kg') { const step = ex.salto || 1; d.kg = Math.round(((d.kg == null ? 0 : Number(d.kg)) + dir * step) * 100) / 100; }
      else d.reps = Math.max(0, (Number(d.reps) || 0) + dir);
      for (let j = k; j < ex.draft.length; j++) if (!ex.hechas.find((s) => s.serie === j + 1)) ex.draft[j][f] = d[f];
      return renderGym();
    }
    if (act === 'set') {
      b.disabled = true;
      const payload = { fecha: todayIso(), rutina: S.gym.rutina, ejercicio: ex.ejercicio, serie: k, kg: d.kg, reps: d.reps };
      ex.hechas.push({ row: null, serie: k, kg: d.kg, reps: d.reps }); renderGym();
      const lastOne = visibleEx().every((x) => x.hechas.length >= nSeries(x));
      if (!lastOne) startTimer(ex.descanso, ex.ejercicio);
      try {
        const r = await api('logSet', payload);
        const hh = ex.hechas.find((s) => s.serie === k && s.row == null); if (hh) hh.row = r.row;
        if (r.record) toast('🏆 ¡Nuevo récord en ' + ex.ejercicio + '!');
        if (lastOne) { stopTimer(); toast('¡Entreno completo! 🎉'); confetti(); }
      } catch (err) { ex.hechas = ex.hechas.filter((s) => !(s.serie === k && s.row == null)); renderGym(); toast(err.message, true); }
      return;
    }
    if (act === 'unset') {
      const h = ex.hechas.find((s) => s.serie === k); if (!h) return;
      ex.hechas = ex.hechas.filter((s) => s !== h); d.kg = h.kg; d.reps = h.reps; renderGym();
      if (h.row) { try { await api('deleteSet', { row: h.row }); } catch (err) { toast(err.message, true); loadGym(); } }
    }
  });
  view.addEventListener('change', (e) => {
    const el = e.target.closest('[data-act="sin"]'); if (!el || S.tab !== 'gym') return;
    const ex = findEx(el.dataset.ex); if (!ex) return;
    const k = Number(el.dataset.k), f = el.dataset.f;
    const v = el.value === '' ? null : Number(String(el.value).replace(',', '.'));
    for (let j = k - 1; j < ex.draft.length; j++) if (!ex.hechas.find((s) => s.serie === j + 1)) ex.draft[j][f] = v;
    renderGym();
  });

  // Temporizador de descanso
  let audioCtx = null;
  function unlockAudio() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const b = audioCtx.createBuffer(1, 1, 22050), s = audioCtx.createBufferSource(); s.buffer = b; s.connect(audioCtx.destination); s.start(0);
    } catch (e) { /* sin audio */ }
  }
  function beep() {
    if (!audioCtx || !S.soundLocal || (S.gym && S.gym.sonido === false)) return;
    [0, 0.25, 0.5].forEach((t, k) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.frequency.value = k === 2 ? 1175 : 880; o.type = 'sine';
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.4, audioCtx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + t + 0.2);
      o.connect(g); g.connect(audioCtx.destination); o.start(audioCtx.currentTime + t); o.stop(audioCtx.currentTime + t + 0.22);
    });
  }
  function startTimer(sec, label) {
    stopTimer(); if (!sec) return;
    S.timer = { end: Date.now() + sec * 1000, label, fired: false };
    timerEl.hidden = false; tickTimer(); S.timer.iv = setInterval(tickTimer, 250);
  }
  function tickTimer() {
    const t = S.timer; if (!t) return;
    const left = Math.max(0, Math.round((t.end - Date.now()) / 1000));
    const mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, '0');
    timerEl.className = 'timer' + (left === 0 ? ' end' : '');
    timerEl.innerHTML = `${icon('clock')}<span class="t">${mm}:${ss}</span><span class="lbl">${left ? 'Descanso · ' + esc(t.label) : '¡A por la siguiente serie!'}</span>
      <button type="button" data-tm="+15">+15 s</button><button type="button" data-tm="stop">${left ? 'Saltar' : 'OK'}</button>`;
    if (left === 0 && !t.fired) { t.fired = true; beep(); setTimeout(() => { if (S.timer === t) stopTimer(); }, 6000); }
  }
  function stopTimer() { if (S.timer) clearInterval(S.timer.iv); S.timer = null; timerEl.hidden = true; }
  timerEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tm]'); if (!b || !S.timer) return;
    if (b.dataset.tm === 'stop') return stopTimer();
    S.timer.end += 15000; S.timer.fired = false; tickTimer();
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && S.timer) tickTimer(); });

  // ─── AÑADIR (gasto · ingreso · traspaso) ────────────────────
  async function openAdd(pre) {
    S.form = null; S.picker = null; S.task = null; S.sedit = null; S.fix = null;
    S.add = Object.assign({ tipo: 'Gasto', amount: '', concepto: '', categoria: null, cuenta: 'Efectivo', destino: 'Cuenta ahorro', fecha: todayIso(), busy: false, hint: null }, pre || {});
    sheet.hidden = false; renderAdd();
    if (!S.meta) { try { S.meta = await api('meta'); renderAdd(); } catch (e) { toast(e.message, true); } }
  }
  function enterCls() { return sheet.children.length ? '' : ' enter'; }
  function closeAdd() { sheet.hidden = true; sheet.innerHTML = ''; S.add = null; S.task = null; S.sedit = null; S.fix = null; S.form = null; S.picker = null; }
  function renderAdd() {
    const a = S.add; if (!a) return;
    const m = S.meta;
    const cats = !m ? [] : a.tipo === 'Gasto' ? m.categorias : a.tipo === 'Ingreso' ? m.ingresos : [];
    const cuentas = m ? m.cuentas : ['Efectivo', 'Cuenta gastos', 'Cuenta ahorro', 'Hucha Canadá'];
    const shown = a.amount === '' ? '0' : a.amount;
    const ok = Number(a.amount.replace(',', '.')) > 0 && (a.tipo === 'Traspaso' ? a.cuenta !== a.destino : !!a.categoria);
    sheet.innerHTML = `<div class="sheet${enterCls()}" role="dialog" aria-modal="true" aria-label="Añadir">
      <div class="grab"></div>
      <div class="row between"><h2 style="font-size:24px">Añadir</h2><button type="button" class="chip" data-a="close">Cerrar</button></div>
      <div class="seg">${['Gasto', 'Ingreso', 'Traspaso'].map((t) => `<button type="button" class="${a.tipo === t ? 'on' : ''}" data-a="tipo" data-v="${t}">${t}</button>`).join('')}</div>
      <div class="amount" aria-live="polite">${esc(shown)} €</div>
      <input class="text-in" type="text" placeholder="${a.tipo === 'Traspaso' ? 'Concepto (opcional, p. ej. Págate primero)' : 'Concepto (opcional)'}" value="${esc(a.concepto)}" data-a="concepto" aria-label="Concepto">
      ${cats.length ? `<div><div class="small muted bold" style="margin-bottom:8px">Categoría</div><div class="chips">${cats.map((c) => `<button type="button" class="chip blue ${a.categoria === c ? 'on' : ''}" data-a="cat" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>` : (!m ? '<div class="skeleton" style="height:80px"></div>' : '')}
      <div><div class="small muted bold" style="margin-bottom:8px">${a.tipo === 'Ingreso' ? 'Entra en' : 'Sale de'}</div><div class="chips">${cuentas.map((c) => `<button type="button" class="chip blue ${a.cuenta === c ? 'on' : ''}" data-a="cuenta" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>
      ${a.tipo === 'Traspaso' ? `<div><div class="small muted bold" style="margin-bottom:8px">Va a</div><div class="chips">${cuentas.map((c) => `<button type="button" class="chip blue ${a.destino === c ? 'on' : ''}" data-a="destino" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>` : ''}
      <div class="chips">${[['Hoy', todayIso()], ['Ayer', addDays(todayIso(), -1)]].map(([l, f]) => `<button type="button" class="chip ${a.fecha === f ? 'on' : ''}" data-a="fecha" data-v="${f}">${l}</button>`).join('')}</div>
      <div class="keypad">${['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', '⌫'].map((k) => `<button type="button" data-a="key" data-v="${k}" aria-label="${k === '⌫' ? 'Borrar' : k}">${k}</button>`).join('')}</div>
      <button type="button" class="btn" data-a="save" ${ok && !a.busy ? '' : 'disabled'}>${a.busy ? 'Guardando…' : 'Guardar ' + a.tipo.toLowerCase()}</button>
    </div>`;
  }
  sheet.addEventListener('click', async (e) => {
    if (e.target === sheet) return closeAdd();
    const b = e.target.closest('[data-a]'); if (!b || !S.add) return;
    const a = S.add, act = b.dataset.a, v = b.dataset.v;
    if (act === 'close') return closeAdd();
    if (act === 'tipo') { a.tipo = v; a.categoria = null; if (v === 'Traspaso' && a.cuenta === a.destino) a.destino = 'Cuenta ahorro'; }
    if (act === 'cat') a.categoria = v;
    if (act === 'cuenta') a.cuenta = v;
    if (act === 'destino') a.destino = v;
    if (act === 'fecha') a.fecha = v;
    if (act === 'key') {
      if (v === '⌫') a.amount = a.amount.slice(0, -1);
      else if (v === ',') { if (!a.amount.includes(',')) a.amount = (a.amount || '0') + ','; }
      else { const dec = a.amount.split(',')[1]; if (!(dec && dec.length >= 2) && a.amount.length < 8) a.amount = (a.amount === '0' ? '' : a.amount) + v; }
    }
    if (act === 'save') {
      a.busy = true; renderAdd();
      try {
        const r = await api('addMove', { tipo: a.tipo, importe: Number(a.amount.replace(',', '.')), concepto: a.concepto.trim(), categoria: a.categoria, cuenta: a.cuenta, destino: a.destino, fecha: a.fecha });
        S.meta = r;
        let msg = a.tipo + ' guardado ✓';
        if (r.categoria) msg = r.categoria.queda >= 0 ? `Guardado ✓ · te quedan ${eur(r.categoria.queda)} en ${r.categoria.nombre}` : `Guardado · te has pasado ${eur(-r.categoria.queda)} en ${r.categoria.nombre}`;
        toast(msg, r.categoria && r.categoria.queda < 0);
        if (S.today && r.money) S.today.money = r.money;
        closeAdd();
        if (S.tab === 'hoy') renderToday(); else if (S.tab === 'mas') renderMas(); else if (S.tab === 'dinero') loadDinero(S.din ? S.din.mes : '', true);
      } catch (err) { a.busy = false; renderAdd(); toast(err.message, true); }
      return;
    }
    renderAdd();
  });
  sheet.addEventListener('input', (e) => { if (e.target.dataset.a === 'concepto' && S.add) S.add.concepto = e.target.value; });

  // ─── MÁS ─────────────────────────────────────────────────────
  async function loadMas() {
    skeleton();
    try { S.meta = await api('meta'); if (S.tab === 'mas') renderMas(); }
    catch (e) { if (S.tab === 'mas') view.innerHTML = errBox(e.message, 'reload-mas'); }
  }
  function renderMas() {
    const m = S.meta || { recientes: [], saldos: {} };
    const s = m.saldos || {};
    let vis = S.vision; if (!vis) { try { vis = JSON.parse(store('get', 'l2627.vision') || 'null'); } catch (e) { vis = null; } }
    const vImg = vis && (vis.cards || []).map((c) => c.images && c.images[0]).find(Boolean);
    view.innerHTML = `<header class="head"><h1>Más</h1></header>
      <div class="tiles">${[['dinero', '💶', 'Dinero', eur(m.saldos && m.saldos.total)], ['progreso', '📈', 'Progreso', 'rachas y medallas'], ['recetas', '🍳', 'Recetas', 'menú y lista de la compra'],
        ['biblioteca', '📚', 'Biblioteca', 'libros y podcasts'], ['deseos', '🛍️', 'Me gustaría comprar', 'regla de las 48 h'], ['revision', '🔁', 'Revisión semanal', 'y resumen para Claude']]
        .map(([k, e, t, sub]) => `<button type="button" class="tile" data-m="${k}"><span class="te">${e}</span><span class="tt">${t}</span><span class="ts">${sub}</span></button>`).join('')}</div>
      <button type="button" class="vtile" data-m="vision"><span class="vimg" ${vImg ? `data-img="${esc(vImg)}"` : ''}></span><span class="vtile-txt"><span class="tiny bold">MI VISIÓN</span><span class="vfrase">Mis metas y mis fotos</span></span>${icon('chev')}</button>
      <div class="cols"><div>
      <section class="card"><div class="kicker" style="margin-bottom:10px">Tu dinero hoy</div>
        <div class="list">${['Efectivo', 'Cuenta gastos', 'Cuenta ahorro', 'Hucha Canadá'].map((k) => `<div class="li"><span style="flex:1">${k}</span><b>${eur(s[k])}</b></div>`).join('')}
        <div class="li"><span style="flex:1" class="bold">Total</span><b>${eur(s.total)}</b></div>
        <div class="li"><span style="flex:1">Meses de colchón</span><b>${s.colchon != null ? fmt(s.colchon, 1) : '–'}</b></div></div></section>
      <section class="card"><div class="kicker" style="margin-bottom:6px">Últimos movimientos</div>
        <div class="list">${(m.recientes || []).map((r) => `<div class="li"><div style="flex:1;min-width:0"><div class="bold" style="font-size:15px">${esc(r.concepto)}</div><div class="small muted">${shortDate(r.fecha)} · ${esc(r.cuenta)}${r.destino ? ' → ' + esc(r.destino) : ''} · ${esc(r.categoria)}</div></div>
          <b style="color:${r.tipo === 'Ingreso' ? 'var(--green)' : 'inherit'}">${r.tipo === 'Ingreso' ? '+' : r.tipo === 'Gasto' ? '−' : ''}${eur(r.importe)}</b>
          <button type="button" class="icon-btn" data-m="del" data-row="${r.row}" aria-label="Borrar ${esc(r.concepto)}">${icon('trash')}</button></div>`).join('') || '<p class="small muted">Todavía no hay movimientos.</p>'}</div></section>
      </div><div>
      ${calCard(m.calendario)}
      <section class="card"><div class="kicker" style="margin-bottom:6px">Ajustes</div><div class="list">
        <div class="li">${icon('sound')}<span style="flex:1">Pitido del temporizador</span><button type="button" class="toggle ${S.soundLocal ? 'on' : ''}" data-m="sound" aria-pressed="${S.soundLocal}" aria-label="Pitido del temporizador"></button></div>
        ${CFG.SHEET_URL ? `<a class="li" href="${esc(CFG.SHEET_URL)}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${icon('sheet')}<span style="flex:1">Abrir mi Google Sheets</span>${icon('chev')}</a>` : ''}
        <button type="button" class="li" data-m="logout" style="border:none;background:none;width:100%;text-align:left;padding-left:0">${icon('logout')}<span style="flex:1">Cerrar sesión en este dispositivo</span></button>
        <div class="li small muted">Versión ${APP_VERSION}${DEMO ? ' · modo demo' : ''}</div></div></section>
      </div></div>`;
    paintImages(view);
  }
  view.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-m],[data-act="reload-mas"]'); if (!b || S.tab !== 'mas') return;
    if (b.dataset.act === 'reload-mas') return loadMas();
    const m = b.dataset.m;
    if (m === 'vision') return go('vision');
    if (['dinero', 'progreso', 'recetas', 'biblioteca', 'deseos', 'revision'].includes(m)) return go(m);
    if (m === 'calsync') {
      S.calBusy = true; renderMas();
      try { const r = await api('calSync'); if (S.meta) S.meta.calendario = r.calendario; toast('Calendario al día ✓ · ' + r.eventos + ' eventos' + (r.pendientes ? ' (faltan ' + r.pendientes + ', siguen en la próxima hora)' : '')); }
      catch (err) { toast(err.message, true); }
      S.calBusy = false; if (S.tab === 'mas') renderMas(); return;
    }
    if (m === 'sound') { S.soundLocal = !S.soundLocal; store('set', LS.sound, S.soundLocal ? 'on' : 'off'); if (S.soundLocal) { unlockAudio(); beep(); } return renderMas(); }
    if (m === 'logout') { if (confirm('¿Cerrar sesión en este dispositivo? Tendrás que volver a poner el PIN.')) logout(); return; }
    if (m === 'del') {
      if (!confirm('¿Borrar este movimiento?')) return;
      try { S.meta = await api('deleteMove', { row: Number(b.dataset.row) }); renderMas(); toast('Movimiento borrado'); } catch (err) { toast(err.message, true); }
    }
  });
  function ago(isoStr) {
    if (!isoStr) return 'nunca';
    const min = Math.round((Date.now() - new Date(isoStr).getTime()) / 60000);
    if (min < 1) return 'ahora mismo'; if (min < 60) return 'hace ' + min + ' min';
    const h = Math.round(min / 60); if (h < 24) return 'hace ' + h + ' h';
    return 'hace ' + Math.round(h / 24) + ' días';
  }
  function calCard(c) {
    if (!c) return '';
    if (!c.on) return `<section class="card"><div class="kicker" style="margin-bottom:8px">Calendario con avisos</div>
      <p class="small" style="margin:0 0 6px"><b>Aún no está conectado.</b> Solo hay que hacerlo una vez:</p>
      <p class="small muted" style="margin:0">En Apps Script, elige <b>configurarCalendario</b> en el desplegable de arriba y pulsa <b>▶ Ejecutar</b>. Acepta el permiso de Google Calendar.</p></section>`;
    return `<section class="card"><div class="row between" style="margin-bottom:8px"><span class="kicker">Calendario con avisos</span><span class="okpill">Conectado</span></div>
      <p class="small" style="margin:0">Tus clases, gym, tareas y exámenes están en el calendario <b>«${esc(c.nombre)}»</b> de Google Calendar.</p>
      <p class="small muted" style="margin:6px 0 10px">Última sincronización: ${esc(ago(c.last))}. Las tareas se pasan al momento; lo que cambies en el Sheet, cada hora.</p>
      ${c.error ? `<div class="demo-banner" style="margin-bottom:10px">Último error: ${esc(c.error)}</div>` : ''}
      <button type="button" class="btn ghost slim" data-m="calsync" ${S.calBusy ? 'disabled' : ''}>${S.calBusy ? 'Sincronizando… (puede tardar un minuto)' : 'Sincronizar ahora'}</button></section>`;
  }
  function renderSoon(title, text) {
    view.innerHTML = `<header class="head"><h1>${esc(title)}</h1></header><section class="card"><span class="soon">fase 3</span><p style="margin:10px 0 0">${esc(text)}</p></section>`;
  }

  // ─── DINERO ──────────────────────────────────────────────────
  async function loadDinero(mes, silent) {
    if (!silent || !S.din) skeleton();
    try { S.din = await api('dinero', { mes: mes == null ? (S.din ? S.din.mes : '') : mes }); if (S.tab === 'dinero') renderDinero(); }
    catch (e) { if (S.tab === 'dinero') view.innerHTML = errBox(e.message, 'reload-din'); }
  }
  const pctOf = (g, l) => (l > 0 ? g / l : g > 0 ? 9 : 0);
  function statusOf(p) { return p > 1 ? 'over' : p >= 0.8 ? 'near' : 'ok'; }
  function backLink() { return `<button type="button" class="linkbtn back" data-d="back">‹ Más</button>`; }
  function renderDinero() {
    const d = S.din; if (!d) return;
    const p = pctOf(d.gastado, d.limite), st = statusOf(p);
    const queda = d.queda == null ? d.limite - d.gastado : d.queda;
    const max = Math.max(1, ...d.serie.map((x) => Math.max(x.gastado || 0, x.limite || 0)));
    const H = 120, W = 12 * 28;
    const bars = d.serie.map((x, k) => {
      const g = x.gastado || 0, h = Math.max(g > 0 ? 3 : 0, g / max * H), lh = (x.limite || 0) / max * H;
      const cls = k === d.mes ? 'sel' : (x.gastado == null ? 'fut' : '');
      return `<g class="mbar ${cls}" data-d="mes" data-v="${k}"><title>${esc(x.mes)}: ${x.gastado == null ? 'sin datos' : eur(g) + ' de ' + eur(x.limite)}</title>
        <rect class="hit" x="${k * 28}" y="0" width="28" height="${H + 22}"/>
        ${h ? `<path class="b ${statusOf(pctOf(g, x.limite || 0))}" d="M${k * 28 + 6},${H} v-${Math.max(0, h - 4)} q0,-4 4,-4 h8 q4,0 4,4 v${Math.max(0, h - 4)} z"/>` : ''}
        ${x.limite ? `<line class="lim" x1="${k * 28 + 3}" x2="${k * 28 + 25}" y1="${H - lh}" y2="${H - lh}"/>` : ''}
        <text x="${k * 28 + 14}" y="${H + 16}" text-anchor="middle">${esc(String(x.mes).slice(0, 1))}</text></g>`;
    }).join('');
    const cats = d.categorias.filter((c) => c.limite > 0 || c.gastado > 0)
      .sort((a, b) => (a.tipo === 'Fijo') - (b.tipo === 'Fijo') || pctOf(b.gastado, b.limite) - pctOf(a.gastado, a.limite));
    const h = d.hucha || {}; const hp = h.meta ? Math.min(1, (h.saldo || 0) / h.meta) : 0;
    const faltan = h.meta && h.aportacion ? Math.max(0, Math.ceil((h.meta - (h.saldo || 0)) / h.aportacion)) : null;
    const left = `
      ${DEMO ? '<div class="demo-banner">Modo demo: los datos son de ejemplo.</div>' : ''}
      ${backLink()}
      <header class="head"><h1>Dinero</h1>
        <div class="monthnav"><button type="button" data-d="mes" data-v="${d.mes - 1}" ${d.mes <= 0 ? 'disabled' : ''} aria-label="Mes anterior">‹</button><span>${esc(d.meses[d.mes])}</span><button type="button" data-d="mes" data-v="${d.mes + 1}" ${d.mes >= 11 ? 'disabled' : ''} aria-label="Mes siguiente">›</button></div></header>
      <section class="card hero-money ${st}">
        <span class="kicker">Gastado en ${esc(d.meses[d.mes])}</span>
        <div class="big">${eur(d.gastado)}</div>
        <div class="bar thick"><i style="width:${Math.min(100, p * 100)}%"></i></div>
        <div class="row between small"><span class="muted">Límite ${eur(d.limite)} · ${Math.round(p * 100)}%</span>
          <b class="st-${st}">${queda >= 0 ? 'Te quedan ' + eur(queda) : '⚠ Te has pasado ' + eur(-queda)}</b></div>
      </section>
      <div class="stats">
        <div class="stat"><b class="sm">${eur(d.totalIngresos)}</b><span>ingresos</span></div>
        <div class="stat"><b class="sm">${eur(d.ahorro)}</b><span>a la cuenta ahorro</span></div>
        <div class="stat"><b>${d.diasSinGastar == null ? '–' : d.diasSinGastar}</b><span>días sin gastar</span></div>
      </div>
      <section class="card"><div class="row between" style="margin-bottom:8px"><span class="kicker">Gasto por mes</span><span class="tiny muted"><i class="limkey"></i> límite</span></div>
        <svg class="mchart" viewBox="0 0 ${W} ${H + 22}" role="img" aria-label="Gasto de cada mes frente a tu límite">${bars}</svg>
        <p class="tiny muted" style="margin:6px 0 0">Toca una barra para ver ese mes.</p></section>
      <section class="card"><div class="kicker" style="margin-bottom:4px">Por categoría</div><div class="list">${cats.map((c) => {
        const cp = pctOf(c.gastado, c.limite), cs = statusOf(cp);
        return `<button type="button" class="li catrow" data-d="cat" data-v="${esc(c.nombre)}"><span class="txt"><span class="row between"><span class="bold">${esc(c.nombre)}${c.tipo === 'Fijo' ? ' <span class="tiny muted">fijo</span>' : ''}</span><span class="small"><b>${eur(c.gastado)}</b> <span class="muted">/ ${eur(c.limite)}</span></span></span>
          <span class="bar ${cs}"><i style="width:${Math.min(100, cp * 100)}%"></i></span>${cs === 'over' ? `<span class="tiny st-over">⚠ Te has pasado ${eur(c.gastado - c.limite)}</span>` : cs === 'near' && c.tipo !== 'Fijo' && cp < 1 ? `<span class="tiny st-near">Cuidado: quedan ${eur(c.limite - c.gastado)}</span>` : ''}</span></button>`;
      }).join('')}</div></section>`;
    const sel = S.dinCat;
    const movs = d.movimientos.filter((m) => !sel || m.categoria === sel);
    const right = `
      <section class="card hucha"><div class="row between"><span class="kicker">✈️ Hucha Canadá</span><span class="small bold">${Math.round(hp * 100)}%</span></div>
        <div class="big sm">${eur(h.saldo)} <span class="muted small">de ${eur(h.meta)}</span></div>
        <div class="bar thick"><i style="width:${hp * 100}%"></i></div>
        <span class="small muted">${faltan ? `Con ${eur(h.aportacion)} al mes, la llenas en ${faltan} ${faltan === 1 ? 'mes' : 'meses'}. Cada ingreso extra la acerca.` : '¡Hucha llena! Canadá te espera. 🇨🇦'}</span></section>
      <section class="card"><div class="kicker" style="margin-bottom:4px">Tus cuentas hoy</div><div class="list">
        ${(d.cuentas || []).map((c) => `<div class="li"><span style="flex:1">${esc(c)}</span><b>${eur(d.saldos[c])}</b><button type="button" class="chip slimchip" data-d="fix" data-v="${esc(c)}">Corregir</button></div>`).join('')}
        <div class="li"><span style="flex:1" class="bold">Total</span><b>${eur(d.saldos.total)}</b><span style="width:78px"></span></div></div>
        <p class="tiny muted" style="margin:6px 0 0">"Corregir" ajusta el saldo si no coincide con tu banco, sin inventar gastos.</p></section>
      <section class="card"><div class="row between" style="margin-bottom:4px"><span class="kicker">Movimientos de ${esc(d.meses[d.mes])}</span>${sel ? `<button type="button" class="chip slimchip on" data-d="cat" data-v="">${esc(sel)} ✕</button>` : `<span class="small muted">${movs.length}</span>`}</div>
        <div class="list">${movs.slice(0, 60).map((r) => `<div class="li"><div style="flex:1;min-width:0"><div class="bold" style="font-size:15px">${esc(r.concepto)}</div><div class="small muted">${shortDate(r.fecha)} · ${esc(r.cuenta)}${r.destino ? ' → ' + esc(r.destino) : ''} · ${esc(r.categoria)}</div></div>
          <b style="color:${r.tipo === 'Ingreso' ? 'var(--green)' : 'inherit'}">${r.tipo === 'Ingreso' ? '+' : r.tipo === 'Gasto' ? '−' : ''}${eur(r.importe)}</b>
          <button type="button" class="icon-btn" data-d="del" data-v="${r.row}" aria-label="Borrar ${esc(r.concepto)}">${icon('trash')}</button></div>`).join('') || '<p class="small muted">Nada este mes todavía.</p>'}</div></section>`;
    view.innerHTML = `<div class="cols"><div>${left}</div><div>${right}</div></div>`;
  }
  function openFix(cuenta) {
    S.fix = { cuenta, real: '', busy: false };
    sheet.hidden = false; renderFix();
    setTimeout(() => { const i = sheet.querySelector('[data-ff]'); if (i) i.focus(); }, 250);
  }
  function renderFix() {
    const f = S.fix; if (!f) return;
    const cur = S.din && S.din.saldos ? S.din.saldos[f.cuenta] : null;
    const v = Number(String(f.real).replace(',', '.'));
    const ok = f.real !== '' && !isNaN(v);
    sheet.innerHTML = `<div class="sheet${enterCls()}" role="dialog" aria-modal="true" aria-label="Corregir saldo">
      <div class="grab"></div>
      <div class="row between"><h2 style="font-size:22px">Corregir ${esc(f.cuenta)}</h2><button type="button" class="chip" data-x="close">Cerrar</button></div>
      <p class="small muted" style="margin:0">La app cree que tienes <b>${eur(cur)}</b>. ¿Cuánto tienes de verdad ahora mismo?</p>
      <input class="text-in big-in" type="text" inputmode="decimal" placeholder="0,00" value="${esc(f.real)}" data-ff="real" aria-label="Saldo real">
      <p class="small" style="margin:0;min-height:18px" data-x="diff">${ok && cur != null ? diffTxt(v - cur) : ''}</p>
      <button type="button" class="btn" data-x="save" ${ok && !f.busy ? '' : 'disabled'}>${f.busy ? 'Guardando…' : 'Guardar saldo real'}</button>
    </div>`;
  }
  function diffTxt(x) { x = Math.round(x * 100) / 100; return x === 0 ? 'Coincide: no hace falta cambiar nada.' : (x > 0 ? 'Se sumarán ' : 'Se restarán ') + eur(Math.abs(x)) + ' al saldo de partida de esta cuenta.'; }
  sheet.addEventListener('input', (e) => {
    if (!(e.target.dataset && e.target.dataset.ff) || !S.fix) return;
    S.fix.real = e.target.value;
    const cur = S.din && S.din.saldos ? S.din.saldos[S.fix.cuenta] : null, v = Number(String(e.target.value).replace(',', '.'));
    const ok = e.target.value !== '' && !isNaN(v);
    const dEl = sheet.querySelector('[data-x="diff"]'); if (dEl) dEl.textContent = ok && cur != null ? diffTxt(v - cur) : '';
    const b = sheet.querySelector('[data-x="save"]'); if (b) b.disabled = !ok;
  });
  sheet.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-x]'); if (!b || !S.fix) return;
    if (b.dataset.x === 'close') return closeAdd();
    if (b.dataset.x === 'save') {
      S.fix.busy = true; renderFix();
      try {
        const r = await api('fixBalance', { cuenta: S.fix.cuenta, real: S.fix.real, mes: S.din ? S.din.mes : '' });
        S.din = r; S.meta = null; closeAdd();
        toast(r.ajuste ? 'Saldo corregido ✓ (' + (r.ajuste > 0 ? '+' : '−') + eur(Math.abs(r.ajuste)) + ')' : 'Ya coincidía ✓');
        if (S.tab === 'dinero') renderDinero();
      } catch (err) { S.fix.busy = false; renderFix(); toast(err.message, true); }
    }
  });

  // ─── PROGRESO ────────────────────────────────────────────────
  async function loadProgreso() {
    if (!S.prog) skeleton();
    try { S.prog = await api('progreso'); if (S.tab === 'progreso') renderProgreso(); }
    catch (e) { if (S.tab === 'progreso') view.innerHTML = errBox(e.message, 'reload-prog'); }
  }
  const dayOf = (k) => addDays(S.prog.inicio, k);
  function dailyPct(pr) {
    const act = pr.habits.filter((h) => h.freq === 'Diario' && h.activo);
    const out = [];
    for (let k = 0; k < pr.dias; k++) { const n = act.filter((h) => h.done[k] === '1').length; out.push(act.length ? n / act.length : 0); }
    return { pct: out, n: act.length };
  }
  function streakRuns(str) { let best = 0, cur = 0; for (const c of str) { cur = c === '1' ? cur + 1 : 0; best = Math.max(best, cur); } return best; }
  function badges(pr, dp) {
    const hb = (i) => pr.habits.find((h) => h.i === i) || { done: '', best: 0 };
    const bestAny = Math.max(0, ...pr.habits.filter((h) => h.freq === 'Diario').map((h) => Math.max(h.best || 0, streakRuns(h.done))));
    const full = dp.pct.map((p) => p >= 1);
    let perfectWeek = false;
    for (let k = 0; k + 6 < pr.dias; k++) { if (weekdayIdx(dayOf(k)) === 0 && full.slice(k, k + 7).every(Boolean)) { perfectWeek = true; break; } }
    const gym = hb(11), gymMeta = gym.veces || 4;
    let gymWeek = false;
    for (let k = 0; k < pr.dias; k++) { if (weekdayIdx(dayOf(k)) === 0) { const w = gym.done.slice(k, k + 7).split('').filter((c) => c === '1').length; if (w >= gymMeta) { gymWeek = true; break; } } }
    const pages = (pr.nums[9] || []).reduce((a, x) => a + (Number(x) || 0), 0);
    const maxSteps = Math.max(0, ...(pr.nums[10] || []).map((x) => Number(x) || 0));
    const wake = Math.max(hb(6).best || 0, streakRuns(hb(6).done));
    return [
      ['🌱', 'Primer día completo', 'Un día con el 100 %', full.some(Boolean)],
      ['🔥', 'Racha de 7', '7 días seguidos un hábito', bestAny >= 7],
      ['⚡', 'Racha de 21', '21 días seguidos', bestAny >= 21],
      ['🏅', 'Racha de 30', 'Un mes sin fallar', bestAny >= 30],
      ['🧠', 'Hábito formado', '66 días seguidos', bestAny >= 66],
      ['💯', 'Racha de 100', '100 días seguidos', bestAny >= 100],
      ['⭐', 'Semana perfecta', 'Lunes a domingo al 100 %', perfectWeek],
      ['🏋️', 'Semana de gym', gymMeta + ' entrenos en una semana', gymWeek],
      ['⏰', 'Madrugadora', '7 días levantándote a tu hora', wake >= 7],
      ['👣', '10.000 pasos', 'Un día con 10.000 pasos', maxSteps >= 10000],
      ['📖', '100 páginas', 'Páginas leídas acumuladas', pages >= 100],
      ['📚', '1.000 páginas', 'Páginas leídas acumuladas', pages >= 1000]
    ];
  }
  const weekdayIdx = (s) => { const [y, m, d] = s.split('-').map(Number); return (new Date(y, m - 1, d).getDay() + 6) % 7; };
  function avg(arr) { const v = arr.filter((x) => x != null && x !== ''); return v.length ? v.reduce((a, x) => a + Number(x), 0) / v.length : null; }
  function sum(arr) { return arr.reduce((a, x) => a + (Number(x) || 0), 0); }
  function renderProgreso() {
    const pr = S.prog; if (!pr) return;
    if (pr.empty) {
      view.innerHTML = `${backLink()}<header class="head"><h1>Progreso</h1></header>
        <section class="card empty"><div style="font-size:36px">📅</div><p class="bold" style="margin:8px 0 4px">Tu progreso empieza el 1 de octubre</p>
        <p class="small muted" style="margin:0">Aquí verás tu calendario de hábitos en colores, tus rachas, tus medias de sueño y pasos y las medallas que vayas ganando.</p></section>${actCard(pr.actividades)}`;
      return;
    }
    const dp = dailyPct(pr);
    const selH = S.progHabit ? pr.habits.find((h) => h.i === S.progHabit) : null;
    const lastDay = dayOf(pr.dias - 1);
    if (!S.progMonth) S.progMonth = lastDay.slice(0, 7);
    const [yy, mm] = S.progMonth.split('-').map(Number);
    const first = S.progMonth + '-01', nDays = new Date(yy, mm, 0).getDate();
    const lead = weekdayIdx(first);
    const cells = [];
    for (let k = 0; k < lead; k++) cells.push('<span class="hc pad"></span>');
    for (let d = 1; d <= nDays; d++) {
      const f = S.progMonth + '-' + String(d).padStart(2, '0'), k = dDiff(pr.inicio, f);
      if (k < 0 || k >= pr.dias) { cells.push(`<span class="hc fut">${d}</span>`); continue; }
      let lvl, lab;
      if (selH) { const on = selH.done[k] === '1'; lvl = on ? 4 : 0; lab = on ? 'hecho' : 'sin hacer'; }
      else { const p = dp.pct[k]; lvl = p >= 1 ? 4 : p >= 0.67 ? 3 : p >= 0.34 ? 2 : p > 0 ? 1 : 0; lab = Math.round(p * 100) + ' %'; }
      cells.push(`<button type="button" class="hc l${lvl} ${f === lastDay ? 'today' : ''}" data-p="day" data-v="${f}" data-l="${esc(lab)}" aria-label="${esc(cap(niceDate(f)))}: ${esc(lab)}">${d}</button>`);
    }
    const mStartK = Math.max(0, dDiff(pr.inicio, first)), mEndK = Math.min(pr.dias - 1, dDiff(pr.inicio, S.progMonth + '-' + nDays));
    const monthVals = []; for (let k = mStartK; k <= mEndK; k++) monthVals.push(selH ? (selH.done[k] === '1' ? 1 : 0) : dp.pct[k]);
    const monthPct = monthVals.length ? avg(monthVals) : null;
    const act = pr.habits.filter((h) => h.activo);
    const streakNow = selH ? selH.streak : Math.max(0, ...act.filter((h) => h.freq === 'Diario').map((h) => h.streak || 0));
    const bestAll = selH ? Math.max(selH.best || 0, streakRuns(selH.done)) : Math.max(0, ...act.filter((h) => h.freq === 'Diario').map((h) => Math.max(h.best || 0, streakRuns(h.done))));
    const last = (i, n) => (pr.nums[i] || []).slice(-n);
    const numsCard = [['😴', 'Sueño', avg(last(7, 7)), avg(last(7, 30)), 'h', 1], ['👣', 'Pasos', avg(last(10, 7)), avg(last(10, 30)), '', 0], ['📱', 'Móvil', avg(last(8, 7)), avg(last(8, 30)), 'min', 0]];
    const gym = pr.habits.find((h) => h.i === 11);
    const weeks = [];
    if (gym) {
      let k = pr.dias - 1; k -= weekdayIdx(dayOf(k));
      for (let w = 0; w < 8 && k + 7 > 0; w++, k -= 7) { const from = Math.max(0, k); weeks.unshift({ from: dayOf(from), n: gym.done.slice(from, k + 7).split('').filter((c) => c === '1').length }); }
    }
    const gm = (gym && gym.veces) || 4;
    const bd = badges(pr, dp);
    const monthLabel = cap(new Date(yy, mm - 1, 1).toLocaleDateString('es-ES', { month: 'long' })) + ' ' + yy;
    const left = `
      ${DEMO ? '<div class="demo-banner">Modo demo: datos de ejemplo.</div>' : ''}
      ${backLink()}
      <header class="head"><div><div class="muted small">Día ${pr.dias} de 365</div><h1>Progreso</h1></div></header>
      <div class="chips scroll"><button type="button" class="chip ${!selH ? 'on' : ''}" data-p="habit" data-v="">Todos</button>${act.map((h) => `<button type="button" class="chip ${selH && selH.i === h.i ? 'on' : ''}" data-p="habit" data-v="${h.i}">${esc(emojiOf(h.name))} ${esc(labelOf(h.name).replace(/\s*\(.*\)/, ''))}</button>`).join('')}</div>
      <div class="stats">
        <div class="stat"><b>${streakNow}</b><span>racha actual</span></div>
        <div class="stat"><b>${bestAll}</b><span>mejor racha</span></div>
        <div class="stat"><b>${monthPct == null ? '–' : Math.round(monthPct * 100) + '%'}</b><span>${selH ? 'días este mes' : 'media del mes'}</span></div>
      </div>
      <section class="card">
        <div class="row between" style="margin-bottom:10px"><div class="monthnav"><button type="button" data-p="month" data-v="-1" ${S.progMonth <= pr.inicio.slice(0, 7) ? 'disabled' : ''} aria-label="Mes anterior">‹</button><span>${esc(monthLabel)}</span><button type="button" data-p="month" data-v="1" ${S.progMonth >= lastDay.slice(0, 7) ? 'disabled' : ''} aria-label="Mes siguiente">›</button></div>
          <span class="tiny muted">${selH ? esc(labelOf(selH.name)) : 'núcleo diario'}</span></div>
        <div class="hgrid head">${['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((x) => `<span>${x}</span>`).join('')}</div>
        <div class="hgrid">${cells.join('')}</div>
        <div class="hlegend tiny muted">${selH ? '<span class="hc l0"></span> sin hacer <span class="hc l4"></span> hecho' : '<span>0 %</span><span class="hc l0"></span><span class="hc l1"></span><span class="hc l2"></span><span class="hc l3"></span><span class="hc l4"></span><span>100 %</span>'}</div>
      </section>`;
    const right = `
      <section class="card"><div class="row between" style="margin-bottom:6px"><span class="kicker">Tus números</span><span class="tiny muted">7 días · 30 días</span></div><div class="list">
        ${numsCard.map(([e, l, a7, a30, u, dec]) => `<div class="li"><span style="font-size:20px">${e}</span><span style="flex:1">${l}</span><b>${a7 == null ? '–' : fmt(a7, dec)} ${u}</b><span class="muted small" style="min-width:70px;text-align:right">${a30 == null ? '–' : fmt(a30, dec)} ${u}</span></div>`).join('')}
        <div class="li"><span style="font-size:20px">📖</span><span style="flex:1">Páginas leídas</span><b>${fmt(sum(last(9, 7)), 0)}</b><span class="muted small" style="min-width:70px;text-align:right">${fmt(sum(last(9, 30)), 0)}</span></div>
        <div class="li"><span style="font-size:20px">💻</span><span style="flex:1">Curso online</span><b>${fmt(sum(last(2, 7)) / 60, 1)} h</b><span class="muted small" style="min-width:70px;text-align:right">${fmt(sum(last(2, 30)) / 60, 1)} h</span></div>
      </div></section>
      ${weeks.length ? `<section class="card"><div class="row between" style="margin-bottom:10px"><span class="kicker">Gym · últimas semanas</span><span class="tiny muted">meta ${gm}/semana</span></div>
        <div class="gweeks">${weeks.map((w) => `<div class="gw" title="Semana del ${shortDate(w.from)}: ${w.n} de ${gm}"><div class="gcol">${Array.from({ length: Math.max(gm, w.n) }, (_, j) => `<i class="${j < w.n ? (w.n >= gm ? 'full' : 'on') : ''}"></i>`).reverse().join('')}</div><span class="tiny muted">${shortDate(w.from).replace(/\s.*$/, '')}</span></div>`).join('')}</div></section>` : ''}
      ${actCard(pr.actividades)}
      <section class="card"><div class="row between" style="margin-bottom:10px"><span class="kicker">Medallas</span><span class="small bold">${bd.filter((b) => b[3]).length}/${bd.length}</span></div>
        <div class="badges">${bd.map(([e, t, dsc, ok]) => `<div class="badge2 ${ok ? 'got' : ''}" title="${esc(dsc)}"><span class="be">${ok ? e : '🔒'}</span><span class="bt">${esc(t)}</span><span class="bd">${esc(dsc)}</span></div>`).join('')}</div></section>`;
    view.innerHTML = `<div class="cols"><div>${left}</div><div>${right}</div></div>`;
  }

  function actCard(a) {
    if (!a) return '';
    const m = a.meses[a.actual] || { padel: 0, futbol: 0, clases: 0, mes: '' };
    return `<section class="card"><div class="row between" style="margin-bottom:8px"><span class="kicker">Deporte extra · ${esc(m.mes)}</span><span class="small muted">${m.minutos ? m.minutos + ' min' : ''}</span></div>
      <div class="stats" style="margin-bottom:10px"><div class="stat"><b>${m.padel}</b><span>🎾 pádel</span></div><div class="stat"><b>${m.futbol}</b><span>⚽ fútbol</span></div><div class="stat"><b>${m.clases}</b><span>🧘 clases</span></div></div>
      <div class="row" style="gap:8px;flex-wrap:wrap"><button type="button" class="chip" data-p="act" data-v="Pádel">+ 🎾 Pádel hoy</button><button type="button" class="chip" data-p="act" data-v="Fútbol">+ ⚽ Fútbol hoy</button><button type="button" class="chip" data-p="act" data-v="Clase colectiva">+ 🧘 Clase</button></div>
      ${a.recientes.length ? `<div class="list" style="margin-top:6px">${a.recientes.slice(0, 4).map((x) => `<div class="li" style="padding:8px 0"><span style="flex:1" class="small">${esc(x.actividad)} · ${shortDate(x.fecha)}${x.minutos ? ' · ' + x.minutos + ' min' : ''}</span><button type="button" class="icon-btn" style="width:34px;height:34px" data-p="actdel" data-v="${x.row}" aria-label="Borrar">${icon('trash')}</button></div>`).join('')}</div>` : ''}</section>`;
  }
  // Clics de Dinero y Progreso
  view.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-d],[data-p],[data-act="reload-din"],[data-act="reload-prog"]'); if (!b) return;
    if (b.dataset.act === 'reload-din') return loadDinero();
    if (b.dataset.act === 'reload-prog') return loadProgreso();
    if (b.dataset.d === 'back' || b.dataset.p === 'back') return go('mas');
    if (b.dataset.d && S.tab === 'dinero') {
      const a = b.dataset.d, v = b.dataset.v;
      if (a === 'mes') { const m = Number(v); if (m >= 0 && m <= 11 && m !== S.din.mes) { S.dinCat = ''; return loadDinero(m, true); } return; }
      if (a === 'cat') { S.dinCat = S.dinCat === v ? '' : v; renderDinero(); if (S.dinCat) { const el = view.querySelector('.cols > div:last-child .card:last-child'); if (el && window.innerWidth < 820) el.scrollIntoView({ behavior: 'smooth' }); } return; }
      if (a === 'fix') return openFix(v);
      if (a === 'del') {
        if (!confirm('¿Borrar este movimiento?')) return;
        try { await api('deleteMove', { row: Number(v) }); toast('Movimiento borrado'); S.meta = null; loadDinero(S.din.mes, true); } catch (err) { toast(err.message, true); }
      }
      return;
    }
    if (b.dataset.p && S.tab === 'progreso') {
      const a = b.dataset.p, v = b.dataset.v;
      if (a === 'habit') { S.progHabit = v ? Number(v) : null; return renderProgreso(); }
      if (a === 'month') { const [y, m] = S.progMonth.split('-').map(Number); const d = new Date(y, m - 1 + Number(v), 1); S.progMonth = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); return renderProgreso(); }
      if (a === 'day') return toast(cap(niceDate(v)) + ' · ' + b.dataset.l);
      if (a === 'act') {
        try { const r = await api('addActividad', { actividad: v }); S.prog.actividades = r.actividades; renderProgreso(); toast(v === 'Pádel' ? '🎾 ¡Partido apuntado!' : v === 'Fútbol' ? '⚽ ¡Partido apuntado!' : 'Clase apuntada ✓'); } catch (err) { toast(err.message, true); }
      }
      if (a === 'actdel') {
        if (!confirm('¿Borrar este registro?')) return;
        try { const r = await api('deleteActividad', { row: Number(v) }); S.prog.actividades = r.actividades; renderProgreso(); } catch (err) { toast(err.message, true); }
      }
    }
  });

  // ─── ESTUDIOS Y TAREAS ───────────────────────────────────────
  const SHORT = { 'Regression and modeling with SAS': 'Regresión SAS', 'Visualización de datos & reporting empresarial': 'Visualización', 'Data analytics with Google': 'Data Google',
    'Sistemas de apoyo a la decisión (inglés)': 'Decision Support', 'Emprendimiento tecnológico': 'Emprendimiento', 'Tecnología Big Data II': 'Big Data II',
    'Marketing y estrategia de ventas': 'Marketing', 'Analítica de datos II: modelización avanzada y ML': 'Analítica II', 'La cuestión de Dios': 'Cuestión de Dios' };
  const shortSub = (n) => SHORT[n] || String(n || '').split(/[:(]/)[0].trim().slice(0, 22) || 'Sin asignatura';
  const SUB_COLORS = ['#2456E6', '#6D4AFF', '#0F766E', '#C2410C', '#BE185D', '#0369A1', '#7C3AED', '#15803D', '#B45309', '#0891B2', '#DB2777', '#4F46E5', '#64748B', '#64748B'];
  const PRIOS = ['Alta', 'Media', 'Baja'];
  const TIPOS = ['Entrega', 'Examen', 'Lectura', 'Ejercicios', 'Estudio', 'Trabajo en grupo', 'Otro'];
  function subjectList() {
    const e = S.est;
    const asig = e && e.asignaturas.length ? e.asignaturas.map((a) => a.nombre) : Object.keys(SHORT);
    const certs = (e && e.certs.length ? e.certs.map((c) => c.codigo || c.nombre) : ['DP-900', 'Claude', 'SAS']).map((c) => 'Cert. ' + c);
    return asig.concat(certs, ['Prácticas y CV', 'Otro']);
  }
  function subColor(n) {
    const k = subjectList().indexOf(n);
    if (k >= 0) return SUB_COLORS[k % SUB_COLORS.length];
    let h = 0; for (const ch of String(n)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return SUB_COLORS[h % 12];
  }
  const dDiff = (a, b) => { const p = a.split('-').map(Number), q = b.split('-').map(Number); return Math.round((Date.UTC(q[0], q[1] - 1, q[2]) - Date.UTC(p[0], p[1] - 1, p[2])) / 864e5); };
  const wdName = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('es-ES', { weekday: 'long' }); };
  function dueInfo(f) {
    if (!f) return { t: 'Sin fecha', c: '', g: 'Sin fecha' };
    const n = dDiff(todayIso(), f);
    if (n < 0) return { t: n === -1 ? 'Ayer' : 'Hace ' + (-n) + ' días', c: 'late', g: 'Atrasadas' };
    if (n === 0) return { t: 'Hoy', c: 'late', g: 'Hoy' };
    if (n === 1) return { t: 'Mañana', c: 'warn', g: 'Mañana' };
    if (n < 7) return { t: cap(wdName(f)), c: 'warn', g: 'Esta semana' };
    return { t: shortDate(f), c: '', g: 'Más adelante' };
  }
  const byDue = (a, b) => (a.fecha || '9999') < (b.fecha || '9999') ? -1 : (a.fecha || '9999') > (b.fecha || '9999') ? 1 : PRIOS.indexOf(a.prioridad) - PRIOS.indexOf(b.prioridad);
  function soonFrom(list, fecha) { const lim = addDays(fecha, 1); return list.filter((t) => !t.hecha && t.fecha && t.fecha <= lim).sort(byDue).slice(0, 8); }

  function taskRow(t) {
    const d = dueInfo(t.fecha);
    return `<div class="task ${t.hecha ? 'done' : ''}">
      <button type="button" class="check sm ${t.hecha ? 'on' : ''}" data-e="tdone" data-row="${t.row}" aria-pressed="${t.hecha}" aria-label="${t.hecha ? 'Desmarcar' : 'Marcar como hecha'}: ${esc(t.tarea)}">${t.hecha ? icon('check') : ''}</button>
      <button type="button" class="tbody" data-e="tedit" data-row="${t.row}" aria-label="Editar: ${esc(t.tarea)}">
        <span class="tname">${t.prioridad === 'Alta' && !t.hecha ? '<i class="prio" title="Prioridad alta"></i>' : ''}${esc(t.tarea)}</span>
        <span class="tsub"><i class="sdot" style="background:${subColor(t.asignatura)}"></i>${esc(shortSub(t.asignatura))}${t.tipo ? ' · ' + esc(t.tipo) : ''}</span>
      </button>
      <span class="due ${t.hecha ? '' : d.c}">${t.hecha ? 'Hecha' : esc(d.t)}</span>
    </div>`;
  }
  function tasksCard(t) {
    if (!Array.isArray(t.tareas)) return '';
    return `<section class="card" style="display:flex;flex-direction:column;gap:10px">
      <div class="row between"><span class="kicker">Tareas · hoy y mañana</span><button type="button" class="linkbtn" data-e="goest">Ver todas${icon('chev')}</button></div>
      ${t.tareas.length ? `<div class="tlist">${t.tareas.map(taskRow).join('')}</div>` : '<p class="small muted" style="margin:0">Nada que entregar hoy ni mañana. 🎉</p>'}
      <button type="button" class="btn ghost slim" data-e="tnew">+ Tarea</button></section>`;
  }

  async function loadEstudios(silent) {
    if (!silent || !S.est) skeleton();
    try { S.est = await api('estudios'); if (S.tab === 'estudios') renderEstudios(); }
    catch (e) { if (S.tab === 'estudios') view.innerHTML = errBox(e.message, 'reload-est'); }
  }
  function renderEstudios() {
    const e = S.est; if (!e) return;
    const hoy = todayIso();
    const pend = e.tareas.filter((t) => !t.hecha);
    const late = pend.filter((t) => t.fecha && t.fecha < hoy).length;
    const week = pend.filter((t) => t.fecha && t.fecha >= hoy && dDiff(hoy, t.fecha) < 7).length;
    const withTasks = subjectList().filter((s) => pend.some((t) => t.asignatura === s));
    pend.forEach((t) => { if (t.asignatura && !withTasks.includes(t.asignatura)) withTasks.push(t.asignatura); });
    if (S.estFilter !== 'Todas' && !withTasks.includes(S.estFilter) && !e.tareas.some((t) => t.asignatura === S.estFilter)) S.estFilter = 'Todas';
    const f = S.estFilter, match = (t) => f === 'Todas' || t.asignatura === f;
    const shown = pend.filter(match).sort(byDue);
    const groups = ['Atrasadas', 'Hoy', 'Mañana', 'Esta semana', 'Más adelante', 'Sin fecha'].map((g) => [g, shown.filter((t) => dueInfo(t.fecha).g === g)]).filter(([, l]) => l.length);
    const done = e.tareas.filter((t) => t.hecha && match(t)).sort((a, b) => byDue(b, a)).slice(0, 30);
    const left = `
      ${DEMO ? '<div class="demo-banner">Modo demo: las tareas no se guardan.</div>' : ''}
      <header class="head"><div><div class="muted small">Curso 2026/27</div><h1>Estudios</h1></div>
        <button type="button" class="pill addpill" data-e="tnew">${icon('plus')}Tarea</button></header>
      <div class="stats">
        <div class="stat"><b>${pend.length}</b><span>pendientes</span></div>
        <div class="stat ${week ? 'warn' : ''}"><b>${week}</b><span>en 7 días</span></div>
        <div class="stat ${late ? 'late' : ''}"><b>${late}</b><span>atrasadas</span></div>
      </div>
      ${withTasks.length > 1 || f !== 'Todas' ? `<div class="chips scroll">${['Todas'].concat(withTasks).map((s) => `<button type="button" class="chip ${f === s ? 'on' : ''}" data-e="filter" data-v="${esc(s)}">${s === 'Todas' ? 'Todas' : `<i class="sdot" style="background:${subColor(s)}"></i>` + esc(shortSub(s))}</button>`).join('')}</div>` : ''}
      ${groups.length ? groups.map(([g, l]) => `<section class="tgroup"><div class="section-title"><h2 class="${g === 'Atrasadas' ? 'late' : ''}">${g}</h2><span class="muted small">${l.length}</span></div><div class="tlist card">${l.map(taskRow).join('')}</div></section>`).join('')
        : `<section class="card empty"><div style="font-size:34px">📚</div><p class="bold" style="margin:6px 0 2px">${f === 'Todas' ? 'No tienes tareas pendientes' : 'Nada pendiente en ' + esc(shortSub(f))}</p><p class="small muted" style="margin:0 0 12px">Apunta aquí cada entrega o examen en cuanto te lo manden.</p><button type="button" class="btn" data-e="tnew">+ Añadir tarea</button></section>`}
      ${done.length ? `<details class="card donebox"><summary class="row between"><span class="bold">Hechas <span class="muted small">(${done.length})</span></span>${icon('chev', 'chev')}</summary><div class="tlist" style="margin-top:8px">${done.map(taskRow).join('')}</div></details>` : ''}`;
    const dPr = e.practicas ? Math.max(0, dDiff(hoy, e.practicas)) : null;
    const right = `
      <section class="est-top">
        <div class="card stat-big"><span class="kicker">Prácticas</span><b>${dPr == null ? '–' : dPr}</b><span class="small muted">días · 1 jun 2027</span></div>
        <div class="card stat-big"><span class="kicker">Media</span><b>${e.media != null ? fmt(e.media, 2) : '–'}</b><span class="small muted">${e.media != null ? 'meta 9' : 'meta 9 · aún sin notas'}</span></div>
      </section>
      <section class="card"><div class="kicker" style="margin-bottom:4px">Asignaturas</div><div class="list">${e.asignaturas.map((a) => {
        const n = pend.filter((t) => t.asignatura === a.nombre).length;
        let sub = 'Sin fecha de examen · toca para ponerla', cls = 'muted';
        if (a.final != null) { sub = 'Nota final ' + fmt(a.final, 2) + (a.estado ? ' · ' + a.estado : ''); cls = a.final >= (a.objetivo || 9) ? 'ok' : 'muted'; }
        else if (a.examen) { const dx = dDiff(hoy, a.examen); sub = 'Examen ' + shortDate(a.examen) + (dx >= 0 ? ' · ' + (dx === 0 ? 'hoy' : 'en ' + dx + ' días') : ' · hecho'); cls = dx >= 0 && dx <= 14 ? 'late' : dx >= 0 && dx <= 30 ? 'warn' : 'muted'; }
        return `<button type="button" class="li subj" data-e="sedit" data-kind="asig" data-row="${a.row}"><i class="sdot big" style="background:${subColor(a.nombre)}"></i>
          <span class="txt"><span class="bold">${esc(shortSub(a.nombre))}${a.notebook ? ' <span class="tiny" title="Tiene NotebookLM">📓</span>' : ''}</span><span class="small ${cls}">${esc(sub)}</span></span>
          ${n ? `<span class="nbadge" title="${n} tareas pendientes">${n}</span>` : ''}${icon('chev', 'chev')}</button>`;
      }).join('')}</div></section>
      <section style="display:flex;flex-direction:column;gap:10px"><div class="section-title"><h2>Certificaciones</h2><span class="muted small">una a una</span></div>
        ${e.certs.map((c) => {
          const p = c.total ? Math.min(1, (c.hechos || 0) / c.total) : null;
          const got = c.estado === '✅ Conseguida';
          return `<article class="card cert ${got ? 'got' : ''}">
            <div class="row between" style="align-items:flex-start"><div style="min-width:0"><span class="tiny bold" style="color:${subColor('Cert. ' + c.codigo)}">${esc(c.codigo)}</span><h3>${esc(c.nombre)}</h3></div>
              <button type="button" class="estado" data-e="sedit" data-kind="cert" data-row="${c.row}">${esc(c.estado || 'Pendiente')}</button></div>
            ${got ? `<p class="small" style="margin:0">¡Conseguida! 🏅${c.examen ? ' · ' + shortDate(c.examen) : ''}</p>` : c.total ? `<div class="row" style="gap:10px"><div class="bar" style="flex:1"><i style="width:${p * 100}%;background:${subColor('Cert. ' + c.codigo)}"></i></div><span class="small bold">${Math.round(p * 100)}%</span></div>
              <div class="row between"><div class="mini-step"><button type="button" data-e="cstep" data-row="${c.row}" data-d="-1" aria-label="Un módulo menos">−</button><span><b>${c.hechos || 0}</b> / ${c.total} módulos</span><button type="button" data-e="cstep" data-row="${c.row}" data-d="1" aria-label="Un módulo más">+</button></div>
              <span class="small muted">${c.horas ? fmt(c.horas, 1) + ' h' : ''}</span></div>`
              : `<button type="button" class="btn ghost slim" data-e="sedit" data-kind="cert" data-row="${c.row}">¿Cuántos módulos tiene? Ponlo aquí</button>`}
            <div class="small muted">${c.examen ? 'Examen ' + shortDate(c.examen) : c.objetivo ? 'Objetivo: ' + shortDate(c.objetivo) : ''}${c.notas && !got ? ' · ' + esc(c.notas) : ''}</div>
            ${/^https:\/\//.test(c.notebook || '') ? `<a class="linkbtn" href="${esc(c.notebook)}" target="_blank" rel="noopener">📓 Abrir en NotebookLM ↗</a>` : ''}
          </article>`;
        }).join('')}</section>
      ${checklist('Plan de prácticas', 'plan', e.plan)}
      ${checklist('Currículum empleable', 'cv', e.cv)}`;
    view.innerHTML = `<div class="cols"><div>${left}</div><div>${right}</div></div>`;
  }
  function checklist(title, kind, items) {
    if (!items || !items.length) return '';
    const hoy = todayIso();
    const hechos = items.filter((x) => x.estado === '✅ Hecho').length;
    const next = items.find((x) => x.estado !== '✅ Hecho');
    const open = S.estOpen && S.estOpen[kind];
    return `<details class="card checklist" data-kind="${kind}" ${open ? 'open' : ''}><summary><div class="row between"><span class="kicker">${esc(title)}</span><span class="small bold">${hechos}/${items.length}</span></div>
      <div class="bar" style="margin:8px 0"><i style="width:${hechos / items.length * 100}%"></i></div>
      ${next ? `<div class="small"><span class="muted">Siguiente:</span> ${esc(next.tarea)}${next.fecha ? ` <span class="${next.fecha < hoy ? 'late' : 'muted'}">· ${shortDate(next.fecha)}</span>` : ''}</div>` : '<div class="small ok">¡Todo hecho! 🎉</div>'}
      <div class="tiny muted" style="margin-top:4px">${open ? 'Toca para cerrar' : 'Toca para ver la lista'}</div></summary>
      <div class="tlist" style="margin-top:8px">${items.map((x) => { const ok = x.estado === '✅ Hecho'; return `<div class="task ${ok ? 'done' : ''}">
        <button type="button" class="check sm ${ok ? 'on' : ''}" data-e="pdone" data-kind="${kind}" data-row="${x.row}" aria-pressed="${ok}" aria-label="${ok ? 'Desmarcar' : 'Marcar'}: ${esc(x.tarea)}">${ok ? icon('check') : ''}</button>
        <span class="tbody"><span class="tname">${esc(x.tarea)}</span>${x.estado === 'En curso' ? '<span class="tsub">En curso</span>' : ''}</span>
        <span class="due ${!ok && x.fecha && x.fecha < hoy ? 'late' : ''}">${x.fecha ? shortDate(x.fecha) : ''}</span></div>`; }).join('')}</div></details>`;
  }

  // Hoja para crear / editar una tarea
  function openTask(row) {
    const t = row ? findTask(row) : null;
    const fs = S.est && S.estFilter !== 'Todas' ? S.estFilter : '';
    S.task = t ? { row: t.row, tarea: t.tarea, asignatura: t.asignatura, tipo: t.tipo || 'Entrega', fecha: t.fecha, prioridad: t.prioridad || 'Media', notas: t.notas, hecha: t.hecha, busy: false }
      : { row: null, tarea: '', asignatura: fs, tipo: 'Entrega', fecha: addDays(todayIso(), 7), prioridad: 'Media', notas: '', busy: false };
    sheet.hidden = false; renderTask();
    if (!S.est) api('estudios').then((r) => { S.est = r; if (S.task) renderTask(); }).catch(() => {});
    if (!t) setTimeout(() => { const i = sheet.querySelector('[data-tf="tarea"]'); if (i) i.focus(); }, 250);
  }
  function findTask(row) {
    row = Number(row);
    return (S.est && S.est.tareas.find((x) => x.row === row)) || (S.today && (S.today.tareas || []).find((x) => x.row === row)) || null;
  }
  function renderTask() {
    const t = S.task; if (!t) return;
    const hoy = todayIso();
    const quick = [['Hoy', hoy], ['Mañana', addDays(hoy, 1)], ['En 1 semana', addDays(hoy, 7)], ['Sin fecha', '']];
    const ok = t.tarea.trim().length > 0 && !t.busy;
    sheet.innerHTML = `<div class="sheet${enterCls()}" role="dialog" aria-modal="true" aria-label="${t.row ? 'Editar tarea' : 'Nueva tarea'}">
      <div class="grab"></div>
      <div class="row between"><h2 style="font-size:24px">${t.row ? 'Editar tarea' : 'Nueva tarea'}</h2><button type="button" class="chip" data-t="close">Cerrar</button></div>
      <input class="text-in" type="text" maxlength="200" placeholder="¿Qué tienes que hacer?" value="${esc(t.tarea)}" data-tf="tarea" aria-label="Tarea" enterkeyhint="done">
      <div><div class="small muted bold" style="margin-bottom:8px">Asignatura</div><div class="chips">${subjectList().map((s) => `<button type="button" class="chip subchip ${t.asignatura === s ? 'on' : ''}" data-t="asig" data-v="${esc(s)}" style="--sc:${subColor(s)}"><i class="sdot" style="background:${subColor(s)}"></i>${esc(shortSub(s))}</button>`).join('')}</div></div>
      <div><div class="small muted bold" style="margin-bottom:8px">Tipo</div><div class="chips">${TIPOS.map((x) => `<button type="button" class="chip ${t.tipo === x ? 'on' : ''}" data-t="tipo" data-v="${x}">${x}</button>`).join('')}</div></div>
      <div><div class="small muted bold" style="margin-bottom:8px">Fecha límite${t.fecha ? ' · ' + esc(cap(niceDate(t.fecha))) : ''}</div>
        <div class="chips">${quick.map(([l, v]) => `<button type="button" class="chip ${t.fecha === v ? 'on' : ''}" data-t="fecha" data-v="${v}">${l}</button>`).join('')}
        <label class="chip datechip ${t.fecha && !quick.some(([, v]) => v === t.fecha) ? 'on' : ''}">Otra fecha<input type="date" value="${esc(t.fecha)}" data-tf="fecha" aria-label="Elegir fecha"></label></div></div>
      <div><div class="small muted bold" style="margin-bottom:8px">Prioridad</div><div class="seg">${PRIOS.map((p) => `<button type="button" class="${t.prioridad === p ? 'on' : ''}" data-t="prio" data-v="${p}">${p}</button>`).join('')}</div></div>
      <input class="text-in" type="text" maxlength="300" placeholder="Notas (opcional)" value="${esc(t.notas)}" data-tf="notas" aria-label="Notas">
      <button type="button" class="btn" data-t="save" ${ok ? '' : 'disabled'}>${t.busy ? 'Guardando…' : t.row ? 'Guardar cambios' : 'Añadir tarea'}</button>
      ${t.row ? `<div class="row" style="gap:10px"><button type="button" class="btn ghost" data-t="toggle">${t.hecha ? 'Marcar como pendiente' : 'Marcar como hecha ✓'}</button><button type="button" class="btn ghost danger" data-t="del" style="width:auto">${icon('trash')}</button></div>` : ''}
    </div>`;
  }
  function refreshAfterTasks(tareas) {
    if (S.est) S.est.tareas = tareas;
    if (S.today && Array.isArray(S.today.tareas)) {
      const keep = S.today.tareas.map((x) => x.row);
      const soon = soonFrom(tareas, S.fecha || todayIso());
      // mantiene visibles (tachadas) las que acabas de marcar hoy
      tareas.forEach((x) => { if (x.hecha && keep.includes(x.row) && !soon.some((y) => y.row === x.row)) soon.push(x); });
      S.today.tareas = soon.sort(byDue);
    }
    if (S.tab === 'estudios') renderEstudios(); else if (S.tab === 'hoy') renderToday();
  }
  async function saveTask() {
    const t = S.task; if (!t || !t.tarea.trim()) return;
    t.busy = true; renderTask();
    const fields = { tarea: t.tarea.trim(), asignatura: t.asignatura, tipo: t.tipo, fecha: t.fecha, prioridad: t.prioridad, notas: t.notas.trim() };
    try {
      const r = t.row ? await api('updateTask', { row: t.row, fields }) : await api('addTask', fields);
      closeAdd(); toast(t.row ? 'Tarea actualizada ✓' : 'Tarea añadida ✓'); refreshAfterTasks(r.tareas);
    } catch (err) { t.busy = false; renderTask(); toast(err.message, true); }
  }
  async function toggleTask(row) {
    const t = findTask(row); if (!t) return;
    const v = !t.hecha;
    [S.est && S.est.tareas, S.today && S.today.tareas].forEach((l) => (l || []).forEach((x) => { if (x.row === t.row) x.hecha = v; }));
    if (S.tab === 'estudios') renderEstudios(); else if (S.tab === 'hoy') renderToday();
    if (v) toast('¡Tarea hecha! ✓');
    try { const r = await api('updateTask', { row: t.row, fields: { hecha: v } }); refreshAfterTasks(r.tareas); }
    catch (err) { toast(err.message, true); if (S.tab === 'estudios') loadEstudios(true); else loadToday(true); }
  }
  sheet.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-t]'); if (!b || !S.task) return;
    const t = S.task, a = b.dataset.t, v = b.dataset.v;
    if (a === 'close') return closeAdd();
    if (a === 'asig') t.asignatura = t.asignatura === v ? '' : v;
    if (a === 'tipo') t.tipo = v;
    if (a === 'fecha') t.fecha = v;
    if (a === 'prio') t.prioridad = v;
    if (a === 'save') return saveTask();
    if (a === 'toggle') { const row = t.row; closeAdd(); return toggleTask(row); }
    if (a === 'del') {
      if (!confirm('¿Borrar esta tarea?')) return;
      try { const r = await api('deleteTask', { row: t.row }); closeAdd(); toast('Tarea borrada'); if (S.today && S.today.tareas) S.today.tareas = S.today.tareas.filter((x) => x.row !== t.row); refreshAfterTasks(r.tareas); }
      catch (err) { toast(err.message, true); }
      return;
    }
    renderTask();
  });
  sheet.addEventListener('input', (e) => {
    const f = e.target.dataset && e.target.dataset.tf; if (!f || !S.task) return;
    S.task[f] = e.target.value;
    if (f === 'tarea') { const btn = sheet.querySelector('[data-t="save"]'); if (btn) btn.disabled = !e.target.value.trim(); }
  });
  sheet.addEventListener('change', (e) => { if (e.target.dataset && e.target.dataset.tf === 'fecha' && S.task) { S.task.fecha = e.target.value; renderTask(); } });
  sheet.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.dataset && e.target.dataset.tf === 'tarea' && S.task && S.task.tarea.trim()) { e.preventDefault(); saveTask(); } });

  // Hoja para editar asignatura / certificación
  function openStudy(kind, row) {
    const e = S.est; if (!e) return;
    const it = (kind === 'asig' ? e.asignaturas : e.certs).find((x) => x.row === Number(row)); if (!it) return;
    S.sedit = kind === 'asig' ? { kind, row: it.row, notebook: it.notebook || '', nombre: it.nombre, examen: it.examen, objetivo: it.objetivo == null ? '' : String(it.objetivo), final: it.final == null ? '' : String(it.final), estado: it.estado || 'Cursando', busy: false }
      : { kind, row: it.row, notebook: it.notebook || '', nombre: it.nombre, examen: it.examen, total: it.total == null ? '' : String(it.total), hechos: it.hechos == null ? '' : String(it.hechos), estado: it.estado || 'Pendiente', busy: false };
    sheet.hidden = false; renderStudy();
  }
  function renderStudy() {
    const s = S.sedit; if (!s) return;
    const estados = s.kind === 'asig' ? ['Pendiente', 'Cursando', '✅ Aprobada', 'Suspensa'] : ['Pendiente', 'En curso', 'Examen reservado', '✅ Conseguida'];
    const num = (f, l, ph) => `<label class="field"><span class="small muted bold">${l}</span><input class="text-in" type="text" inputmode="decimal" value="${esc(s[f])}" data-sf="${f}" placeholder="${ph}"></label>`;
    const tasks = s.kind === 'asig' && S.est ? S.est.tareas.filter((t) => t.asignatura === s.nombre && !t.hecha).sort(byDue) : [];
    sheet.innerHTML = `<div class="sheet${enterCls()}" role="dialog" aria-modal="true" aria-label="${esc(s.nombre)}">
      <div class="grab"></div>
      <div class="row between" style="align-items:flex-start"><div><span class="tiny bold" style="color:${subColor(s.kind === 'asig' ? s.nombre : 'Cert. ' + (S.est.certs.find((c) => c.row === s.row) || {}).codigo)}">${s.kind === 'asig' ? 'ASIGNATURA' : 'CERTIFICACIÓN'}</span><h2 style="font-size:22px">${esc(s.nombre)}</h2></div><button type="button" class="chip" data-s="close">Cerrar</button></div>
      <label class="field"><span class="small muted bold">Fecha del examen</span><input class="text-in" type="date" value="${esc(s.examen)}" data-sf="examen"></label>
      ${s.kind === 'asig' ? `<div class="row" style="gap:10px;align-items:flex-end">${num('objetivo', 'Nota objetivo', '9')}${num('final', 'Nota final', 'cuando la sepas')}</div>`
        : `<div class="row" style="gap:10px;align-items:flex-end">${num('total', 'Módulos totales', 'p. ej. 12')}${num('hechos', 'Módulos hechos', '0')}</div>`}
      <div><div class="small muted bold" style="margin-bottom:8px">Estado</div><div class="chips">${estados.map((x) => `<button type="button" class="chip ${s.estado === x ? 'on' : ''}" data-s="estado" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>
      <label class="field"><span class="small muted bold">📓 Enlace de NotebookLM</span><input class="text-in" type="text" value="${esc(s.notebook)}" data-sf="notebook" placeholder="https://notebooklm.google.com/notebook/…"></label>
      ${/^https:\/\//.test(s.notebook) ? `<a class="btn ghost slim" style="display:flex;align-items:center;justify-content:center;text-decoration:none" href="${esc(s.notebook)}" target="_blank" rel="noopener">Abrir en NotebookLM ↗</a>` : ''}
      <button type="button" class="btn" data-s="save" ${s.busy ? 'disabled' : ''}>${s.busy ? 'Guardando…' : 'Guardar'}</button>
      ${s.kind === 'asig' ? `<div><div class="small muted bold" style="margin:4px 0 8px">Tareas pendientes (${tasks.length})</div>${tasks.length ? `<div class="tlist">${tasks.map((t) => { const d = dueInfo(t.fecha); return `<div class="task"><span class="tbody"><span class="tname">${esc(t.tarea)}</span><span class="tsub">${esc(t.tipo || '')}</span></span><span class="due ${d.c}">${esc(d.t)}</span></div>`; }).join('')}</div>` : '<p class="small muted" style="margin:0">Ninguna.</p>'}
        <button type="button" class="btn ghost slim" data-s="newtask" style="margin-top:10px">+ Tarea de ${esc(shortSub(s.nombre))}</button></div>` : ''}
    </div>`;
  }
  sheet.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-s]'); if (!b || !S.sedit) return;
    const s = S.sedit, a = b.dataset.s;
    if (a === 'close') return closeAdd();
    if (a === 'estado') { s.estado = b.dataset.v; return renderStudy(); }
    if (a === 'newtask') { const n = s.nombre; closeAdd(); openTask(null); S.task.asignatura = n; return renderTask(); }
    if (a === 'save') {
      const fields = s.kind === 'asig' ? { examen: s.examen, objetivo: s.objetivo, final: s.final, estado: s.estado, notebook: s.notebook.trim() } : { examen: s.examen, total: s.total, hechos: s.hechos, estado: s.estado, notebook: s.notebook.trim() };
      if (fields.notebook && !/^https:\/\//.test(fields.notebook)) return toast('El enlace de NotebookLM debe empezar por https://', true);
      for (const k of ['objetivo', 'final', 'total', 'hechos']) {
        if (k in fields && fields[k] !== '' && isNaN(Number(String(fields[k]).replace(',', '.')))) return toast('Revisa el número de "' + k + '"', true);
      }
      s.busy = true; renderStudy();
      try { S.est = await api('updateStudy', { kind: s.kind, row: s.row, fields }); closeAdd(); toast('Guardado ✓'); if (S.tab === 'estudios') renderEstudios(); }
      catch (err) { s.busy = false; renderStudy(); toast(err.message, true); }
    }
  });
  sheet.addEventListener('input', (e) => { const f = e.target.dataset && e.target.dataset.sf; if (f && S.sedit) S.sedit[f] = e.target.value; });

  // Clics en Estudios y en la tarjeta de tareas de Hoy
  let certTimers = {};
  view.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-e],[data-act="reload-est"]'); if (!b) return;
    if (b.dataset.act === 'reload-est') return loadEstudios();
    const a = b.dataset.e;
    if (a === 'goest') return go('estudios');
    if (a === 'tnew') return openTask(null);
    if (a === 'tedit') return openTask(b.dataset.row);
    if (a === 'tdone') return toggleTask(b.dataset.row);
    if (a === 'filter') { S.estFilter = b.dataset.v; return renderEstudios(); }
    if (a === 'sedit') return openStudy(b.dataset.kind, b.dataset.row);
    if (a === 'cstep') {
      const c = S.est.certs.find((x) => x.row === Number(b.dataset.row)); if (!c) return;
      c.hechos = Math.max(0, Math.min(c.total || 999, (c.hechos || 0) + Number(b.dataset.d)));
      renderEstudios();
      clearTimeout(certTimers[c.row]);
      certTimers[c.row] = setTimeout(async () => {
        try { S.est = await api('updateStudy', { kind: 'cert', row: c.row, fields: { hechos: c.hechos } }); if (S.tab === 'estudios') renderEstudios(); if (c.total && c.hechos >= c.total) toast('¡Todos los módulos hechos! Ahora, a por el examen 💪'); }
        catch (err) { toast(err.message, true); loadEstudios(true); }
      }, 700);
      return;
    }
    if (a === 'pdone') {
      const kind = b.dataset.kind, it = S.est[kind].find((x) => x.row === Number(b.dataset.row)); if (!it) return;
      const nuevo = it.estado === '✅ Hecho' ? 'Pendiente' : '✅ Hecho';
      it.estado = nuevo; S.estOpen = Object.assign({}, S.estOpen, { [kind]: true }); renderEstudios();
      if (nuevo === '✅ Hecho') toast('¡Un paso más hacia junio! ✓');
      try { S.est = await api('updateStudy', { kind, row: it.row, fields: { estado: nuevo } }); if (S.tab === 'estudios') renderEstudios(); }
      catch (err) { toast(err.message, true); loadEstudios(true); }
    }
  });
  view.addEventListener('toggle', (e) => {
    const d = e.target; if (!d.classList || !d.classList.contains('checklist')) return;
    S.estOpen = Object.assign({}, S.estOpen, { [d.dataset.kind]: d.open });
    const hint = d.querySelector('summary .tiny'); if (hint) hint.textContent = d.open ? 'Toca para cerrar' : 'Toca para ver la lista';
  }, true);


  // ─── Formularios y selectores genéricos (hoja inferior) ─────
  function openForm(cfg) {
    S.form = Object.assign({ values: {}, busy: false }, cfg);
    cfg.fields.forEach((f) => { if (!(f.key in S.form.values)) S.form.values[f.key] = f.value == null ? '' : f.value; });
    sheet.hidden = false; renderForm();
    if (cfg.focus) setTimeout(() => { const i = sheet.querySelector(`[data-fk="${cfg.focus}"]`); if (i) i.focus(); }, 250);
  }
  function renderForm() {
    const f = S.form; if (!f) return;
    const v = f.values;
    const field = (x) => {
      const lab = x.label ? `<span class="small muted bold">${esc(x.label)}</span>` : '';
      if (x.type === 'chips') return `<div class="field">${lab}<div class="chips">${x.options.map((o) => { const val = typeof o === 'object' ? o.v : o, l = typeof o === 'object' ? o.l : o; return `<button type="button" class="chip ${String(v[x.key]) === String(val) ? 'on' : ''}" data-fm="chip" data-k="${x.key}" data-v="${esc(val)}">${esc(l)}</button>`; }).join('')}</div></div>`;
      if (x.type === 'textarea') return `<label class="field">${lab}<textarea class="text-in area" rows="${x.rows || 4}" data-fk="${x.key}" placeholder="${esc(x.placeholder || '')}" maxlength="${x.max || 3000}">${esc(v[x.key])}</textarea></label>`;
      if (x.type === 'html') return x.html;
      return `<label class="field">${lab}<input class="text-in" type="${x.type === 'date' ? 'date' : 'text'}" ${x.type === 'number' ? 'inputmode="decimal"' : ''} data-fk="${x.key}" value="${esc(v[x.key])}" placeholder="${esc(x.placeholder || '')}" maxlength="${x.max || 300}"></label>`;
    };
    sheet.innerHTML = `<div class="sheet${enterCls()}" role="dialog" aria-modal="true" aria-label="${esc(f.title)}">
      <div class="grab"></div>
      <div class="row between" style="align-items:flex-start"><div style="min-width:0">${f.kicker ? `<span class="tiny bold muted">${esc(f.kicker)}</span>` : ''}<h2 style="font-size:22px">${esc(f.title)}</h2></div><button type="button" class="chip" data-fm="close">Cerrar</button></div>
      ${f.intro ? `<div class="small muted">${f.intro}</div>` : ''}
      ${f.fields.map(field).join('')}
      ${f.submit ? `<button type="button" class="btn" data-fm="submit" ${f.busy ? 'disabled' : ''}>${f.busy ? 'Guardando…' : esc(f.submit)}</button>` : ''}
      ${(f.actions || []).length ? `<div class="row" style="gap:10px;flex-wrap:wrap">${f.actions.map((a) => a.href ? `<a class="btn ghost" style="flex:1;display:flex;align-items:center;justify-content:center;text-decoration:none" href="${esc(a.href)}" target="_blank" rel="noopener">${esc(a.label)}</a>` : `<button type="button" class="btn ghost ${a.cls || ''}" style="flex:1" data-fm="act" data-v="${esc(a.id)}">${esc(a.label)}</button>`).join('')}</div>` : ''}
      ${f.footer || ''}
    </div>`;
  }
  sheet.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-fm]'); if (!b || !S.form) return;
    const f = S.form, a = b.dataset.fm;
    if (a === 'close') return closeAdd();
    if (a === 'chip') { f.values[b.dataset.k] = String(f.values[b.dataset.k]) === b.dataset.v && f.toggle ? '' : b.dataset.v; return renderForm(); }
    if (a === 'submit' || a === 'act') {
      const fn = a === 'submit' ? f.onSubmit : (v) => f.onAction(b.dataset.v, v);
      if (!fn) return;
      f.busy = true; renderForm();
      try { const keep = await fn(f.values); if (keep !== true) closeAdd(); else { f.busy = false; renderForm(); } }
      catch (err) { if (S.form) { S.form.busy = false; renderForm(); } toast(err.message, true); }
    }
  });
  sheet.addEventListener('input', (e) => { const k = e.target.dataset && e.target.dataset.fk; if (k && S.form) S.form.values[k] = e.target.value; });
  function openPicker(cfg) {
    S.form = null; S.picker = cfg; sheet.hidden = false;
    sheet.innerHTML = `<div class="sheet${enterCls()}" role="dialog" aria-modal="true" aria-label="${esc(cfg.title)}">
      <div class="grab"></div>
      <div class="row between"><h2 style="font-size:22px">${esc(cfg.title)}</h2><button type="button" class="chip" data-pk="close">Cerrar</button></div>
      <div class="list">${cfg.items.map((it, k) => `<button type="button" class="li pick ${it.on ? 'on' : ''}" data-pk="pick" data-k="${k}"><span class="txt"><span class="bold">${esc(it.label)}</span>${it.sub ? `<span class="small muted">${esc(it.sub)}</span>` : ''}</span>${it.on ? icon('check') : ''}</button>`).join('')}</div>
    </div>`;
  }
  sheet.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pk]'); if (!b || !S.picker) return;
    if (b.dataset.pk === 'close') return closeAdd();
    const it = S.picker.items[Number(b.dataset.k)], fn = S.picker.onPick; closeAdd(); fn(it);
  });
  function subHeader(title, sub) { return `${backLink()}<header class="head"><div>${sub ? `<div class="muted small">${sub}</div>` : ''}<h1>${esc(title)}</h1></div></header>`; }
  const stars = (n) => (n ? '★'.repeat(n) + '☆'.repeat(5 - n) : '');
  async function copyText(t) {
    try { await navigator.clipboard.writeText(t); return true; }
    catch (e) { const ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e2) { ok = false; } ta.remove(); return ok; }
  }

  // ─── RECETAS · MENÚ · LISTA DE LA COMPRA ─────────────────────
  const DIAS7 = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const TIPO_EMO = { 'Desayuno': '🥣', 'Comida / tupper': '🍱', 'Cena': '🌙', 'Snack / pre-post gym': '🍌' };
  async function loadCocina(semana) {
    if (!S.coc) skeleton();
    try { S.coc = await api('cocina', { semana: semana || (S.coc && S.coc.semana) || '' }); if (S.tab === 'recetas') renderCocina(); }
    catch (e) { if (S.tab === 'recetas') view.innerHTML = errBox(e.message, 'reload-coc'); }
  }
  const recByName = (n) => (S.coc.recetas || []).find((r) => r.nombre === n);
  function fmtQty(q) { const r = Math.round(q * 100) / 100; if (Math.abs(r - Math.round(r)) < 0.01) return String(Math.round(r)); return r.toLocaleString('es-ES', { maximumFractionDigits: 2 }); }
  function shoppingList() {
    const c = S.coc, counts = {};
    c.menu.forEach((m) => { counts[m.receta] = (counts[m.receta] || 0) + 1; });
    const items = {};
    Object.keys(counts).forEach((name) => {
      const r = recByName(name); if (!r) return;
      const batches = Math.max(1, Math.ceil(counts[name] / (r.raciones || 1)));
      r.ingredientes.split('\n').map((l) => l.trim()).filter(Boolean).forEach((line) => {
        const parts = line.split(/\s+·\s+/);
        const q = parts.length > 1 ? parts[0] : '', ing = (parts.length > 1 ? parts.slice(1).join(' · ') : line).trim();
        let num = null, unit = '';
        const m = q.match(/^(\d+\/\d+|\d+(?:[.,]\d+)?)\s*(.*)$/);
        if (m) { num = m[1].includes('/') ? Number(m[1].split('/')[0]) / Number(m[1].split('/')[1]) : Number(m[1].replace(',', '.')); unit = m[2].trim(); }
        else unit = q.trim();
        const norm = (x) => x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/(?:es|s)\b/g, '').replace(/\s+/g, ' ').trim();
        const key = norm(ing) + '|' + norm(unit);
        const it = items[key] || (items[key] = { key, ing, unit, qty: 0, hasNum: false, recetas: [] });
        if (ing.length > it.ing.length) it.ing = ing;
        if (num != null) { it.qty += num * batches; it.hasNum = true; }
        if (!it.recetas.includes(name)) it.recetas.push(name);
      });
    });
    return Object.values(items).sort((a, b) => a.ing.localeCompare(b.ing, 'es'));
  }
  const itemText = (it) => (it.hasNum ? fmtQty(it.qty) + (it.unit ? ' ' + it.unit : '') + ' · ' : (it.unit ? it.unit + ' · ' : '')) + it.ing;
  function boughtSet() { try { return new Set(JSON.parse(store('get', 'l2627.compra.' + S.coc.semana) || '[]')); } catch (e) { return new Set(); } }
  function renderCocina() {
    const c = S.coc; if (!c) return;
    const tab = S.cocTab || 'menu';
    const semLabel = 'Semana del ' + shortDate(c.semana);
    let body = '';
    if (tab === 'menu') {
      const slotsFor = (dia) => { const base = ['Comida', 'Cena']; c.menu.forEach((m) => { if (m.dia === dia && !base.includes(m.momento)) base.push(m.momento); }); return ['Desayuno', 'Comida', 'Cena', 'Snack'].filter((x) => base.includes(x)); };
      const counts = {}; c.menu.forEach((m) => { counts[m.receta] = (counts[m.receta] || 0) + 1; });
      const batch = Object.keys(counts).map((n) => ({ n, k: counts[n], r: recByName(n) })).filter((x) => x.r && /tupper|batch/i.test(x.r.tipo + ' ' + x.r.etiquetas) && x.k >= 2);
      body = `<div class="menu-days">${DIAS7.map((dia, k) => {
        const f = addDays(c.semana, k), today = f === todayIso();
        return `<section class="card dayc ${today ? 'today' : ''}"><div class="row between"><span class="bold">${dia} <span class="muted small">${shortDate(f)}</span></span>${today ? '<span class="okpill">hoy</span>' : ''}</div>
          ${slotsFor(dia).map((mo) => { const m = c.menu.find((x) => x.dia === dia && x.momento === mo); return `<button type="button" class="slot ${m ? 'full' : ''}" data-c="slot" data-dia="${dia}" data-mo="${mo}"><span class="tiny muted bold">${mo.toUpperCase()}</span><span class="${m ? 'bold' : 'muted'}">${m ? esc(m.receta) : '+ Elegir receta'}</span></button>`; }).join('')}
          <button type="button" class="linkbtn tiny" data-c="more" data-dia="${dia}">+ desayuno o snack</button></section>`;
      }).join('')}</div>
      ${batch.length ? `<section class="card"><div class="kicker" style="margin-bottom:6px">🍳 Batch del domingo</div>${batch.map((x) => `<div class="small" style="margin:4px 0">${esc(x.n)} · <b>${Math.ceil(x.k / (x.r.raciones || 1))} tanda${Math.ceil(x.k / (x.r.raciones || 1)) > 1 ? 's' : ''}</b> (${x.k} raciones)</div>`).join('')}</section>` : ''}`;
    } else if (tab === 'recetas') {
      const f = S.recFilter || 'Todas';
      const list = c.recetas.filter((r) => f === 'Todas' || r.tipo === f);
      body = `<div class="chips scroll">${['Todas'].concat(c.tipos).map((t) => `<button type="button" class="chip ${f === t ? 'on' : ''}" data-c="filter" data-v="${esc(t)}">${t === 'Todas' ? 'Todas' : (TIPO_EMO[t] || '') + ' ' + esc(t.replace(' / pre-post gym', '').replace(' / tupper', ''))}</button>`).join('')}</div>
        <div class="rec-grid">${list.map((r) => `<button type="button" class="card recc" data-c="rec" data-row="${r.row}"><span class="re">${TIPO_EMO[r.tipo] || '🍽'}</span><span class="bold">${esc(r.nombre)}</span>
          <span class="small muted">${[r.min ? r.min + ' min' : '', r.proteina ? r.proteina + ' g prot.' : '', r.precio ? eur(r.precio) + '/rac.' : ''].filter(Boolean).join(' · ')}</span>${r.estrellas ? `<span class="stars">${stars(r.estrellas)}</span>` : ''}</button>`).join('')}</div>
        <button type="button" class="btn ghost" data-c="newrec">+ Nueva receta</button>`;
    } else {
      const items = shoppingList(), got = boughtSet();
      const pend = items.filter((it) => !got.has(it.key));
      const txt = '🛒 Lista de la compra · ' + semLabel.toLowerCase() + '\n\n' + pend.map((it) => '• ' + itemText(it)).join('\n');
      body = items.length ? `<section class="card"><div class="row between" style="margin-bottom:4px"><span class="kicker">Para ${c.menu.length} comidas del menú</span><span class="small muted">${pend.length} por comprar</span></div>
        <div class="tlist">${items.map((it) => { const on = got.has(it.key); return `<div class="task ${on ? 'done' : ''}"><button type="button" class="check sm ${on ? 'on' : ''}" data-c="got" data-k="${esc(it.key)}" aria-pressed="${on}" aria-label="${on ? 'Desmarcar' : 'Ya lo tengo'}: ${esc(it.ing)}">${on ? icon('check') : ''}</button>
          <span class="tbody"><span class="tname">${esc(itemText(it))}</span><span class="tsub">${esc(it.recetas.map((n) => n.split(/[,(]/)[0].trim().slice(0, 30)).join(' · '))}</span></span></div>`; }).join('')}</div>
        <p class="tiny muted" style="margin:8px 0 0">Marca lo que ya tienes en casa: no saldrá en el mensaje.</p></section>
        <a class="btn wa" href="https://wa.me/?text=${encodeURIComponent(txt)}" target="_blank" rel="noopener">Enviar por WhatsApp</a>
        <button type="button" class="btn ghost" data-c="copy">Copiar la lista</button>`
        : `<section class="card empty"><div style="font-size:34px">🛒</div><p class="bold" style="margin:6px 0 2px">Tu lista se hace sola</p><p class="small muted" style="margin:0 0 12px">Elige las recetas de la semana en "Menú" y aquí aparecerán todos los ingredientes, sumados.</p><button type="button" class="btn" data-c="tab" data-v="menu">Ir al menú</button></section>`;
      S.cocTxt = txt;
    }
    view.innerHTML = `${subHeader('Recetas', 'Menú, recetas y lista de la compra')}
      <div class="seg">${[['menu', 'Menú'], ['recetas', 'Recetas'], ['compra', 'Lista compra']].map(([k, l]) => `<button type="button" class="${tab === k ? 'on' : ''}" data-c="tab" data-v="${k}">${l}</button>`).join('')}</div>
      ${tab !== 'recetas' ? `<div class="row between"><div class="monthnav"><button type="button" data-c="week" data-v="-7" aria-label="Semana anterior">‹</button><span>${esc(semLabel)}</span><button type="button" data-c="week" data-v="7" aria-label="Semana siguiente">›</button></div></div>` : ''}
      ${body}`;
  }
  function openRecipe(row) {
    const r = S.coc.recetas.find((x) => x.row === Number(row)); if (!r) return;
    const ings = r.ingredientes.split('\n').filter(Boolean), pasos = r.pasos.split('\n').filter(Boolean);
    openForm({
      kicker: (r.tipo || '').toUpperCase(), title: r.nombre,
      intro: `${[r.min ? '⏱ ' + r.min + ' min' : '', r.raciones ? '🍱 ' + r.raciones + ' ración' + (r.raciones > 1 ? 'es' : '') : '', r.proteina ? '💪 ' + r.proteina + ' g/ración' : '', r.precio ? '💶 ' + eur(r.precio) + '/ración' : ''].filter(Boolean).join(' · ')}`,
      values: { dia: DIAS7[(new Date().getDay() + 6) % 7], momento: /Cena/.test(r.tipo) ? 'Cena' : /Desayuno/.test(r.tipo) ? 'Desayuno' : /Snack/.test(r.tipo) ? 'Snack' : 'Comida', estrellas: r.estrellas ? String(r.estrellas) : '' },
      fields: [
        { type: 'html', html: `<div class="recbody"><div class="kicker">Ingredientes</div><ul>${ings.map((l) => `<li>${esc(l)}</li>`).join('')}</ul><div class="kicker">Pasos</div><ol>${pasos.map((l) => `<li>${esc(l)}</li>`).join('')}</ol>${r.notas ? `<p class="small muted">${esc(r.notas)}</p>` : ''}${r.enlace && /^https:\/\//.test(r.enlace) ? `<a class="linkbtn" href="${esc(r.enlace)}" target="_blank" rel="noopener">Ver enlace ↗</a>` : ''}</div>` },
        { key: 'estrellas', label: 'Tu nota', type: 'chips', options: ['1', '2', '3', '4', '5'].map((x) => ({ v: x, l: '★'.repeat(+x) })) },
        { key: 'dia', label: 'Añadir al menú de la semana · día', type: 'chips', options: DIAS7.map((d) => ({ v: d, l: d.slice(0, 3) })) },
        { key: 'momento', label: 'Momento', type: 'chips', options: ['Desayuno', 'Comida', 'Cena', 'Snack'] }
      ],
      submit: 'Añadir al menú',
      actions: [{ id: 'rate', label: 'Guardar nota ★' }],
      onSubmit: async (v) => {
        const res = await api('setMenu', { semana: S.coc.semana, dia: v.dia, momento: v.momento, receta: r.nombre });
        S.coc.menu = res.menu; toast('Añadida al ' + v.dia.toLowerCase() + ' ✓'); S.cocTab = 'menu'; renderCocina();
      },
      onAction: async (id, v) => {
        if (!v.estrellas) { toast('Elige de 1 a 5 estrellas', true); return true; }
        const res = await api('updateRecipe', { row: r.row, fields: { estrellas: Number(v.estrellas) } });
        S.coc.recetas = res.recetas; toast('Nota guardada ✓'); renderCocina();
      }
    });
  }
  function openNewRecipe() {
    openForm({
      title: 'Nueva receta', focus: 'nombre', values: { tipo: 'Comida / tupper', raciones: '1' },
      fields: [
        { key: 'nombre', label: 'Nombre', placeholder: 'Poke de salmón' },
        { key: 'tipo', label: 'Tipo', type: 'chips', options: S.coc.tipos },
        { key: 'min', label: 'Minutos', type: 'number', placeholder: '20' },
        { key: 'raciones', label: 'Raciones', type: 'number' },
        { key: 'proteina', label: 'Proteína por ración (g)', type: 'number', placeholder: '30' },
        { key: 'ingredientes', label: 'Ingredientes (uno por línea: cantidad · ingrediente)', type: 'textarea', placeholder: '150 g · salmón\n80 g · arroz' },
        { key: 'pasos', label: 'Pasos (uno por línea)', type: 'textarea', rows: 3 }
      ],
      submit: 'Guardar receta',
      onSubmit: async (v) => {
        if (!v.nombre.trim()) throw new Error('Ponle nombre a la receta');
        if (/melocot[oó]n/i.test(v.nombre + ' ' + v.ingredientes)) toast('Ojo: lleva melocotón 🍑', true);
        const res = await api('addRecipe', v); S.coc.recetas = res.recetas; toast('Receta guardada ✓'); renderCocina();
      }
    });
  }
  view.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-c],[data-act="reload-coc"]'); if (!b || S.tab !== 'recetas') return;
    if (b.dataset.act === 'reload-coc') return loadCocina();
    const a = b.dataset.c, v = b.dataset.v, c = S.coc;
    if (a === 'tab') { S.cocTab = v; return renderCocina(); }
    if (a === 'week') { return loadCocina(addDays(c.semana, Number(v))); }
    if (a === 'filter') { S.recFilter = v; return renderCocina(); }
    if (a === 'rec') return openRecipe(b.dataset.row);
    if (a === 'newrec') return openNewRecipe();
    if (a === 'copy') { const ok = await copyText(S.cocTxt || ''); return toast(ok ? 'Lista copiada ✓' : 'No se ha podido copiar', !ok); }
    if (a === 'got') {
      const set = boughtSet(), k = b.dataset.k; set.has(k) ? set.delete(k) : set.add(k);
      store('set', 'l2627.compra.' + c.semana, JSON.stringify([...set])); return renderCocina();
    }
    if (a === 'more') {
      return openPicker({ title: b.dataset.dia + ': añadir…', items: [{ label: 'Desayuno', v: 'Desayuno' }, { label: 'Snack', v: 'Snack' }], onPick: (it) => pickSlot(b.dataset.dia, it.v) });
    }
    if (a === 'slot') return pickSlot(b.dataset.dia, b.dataset.mo);
  });
  function pickSlot(dia, mo) {
    const c = S.coc, cur = c.menu.find((x) => x.dia === dia && x.momento === mo);
    const pref = { Comida: 'Comida / tupper', Cena: 'Cena', Desayuno: 'Desayuno', Snack: 'Snack / pre-post gym' }[mo];
    const recs = c.recetas.slice().sort((x, y) => (y.tipo === pref) - (x.tipo === pref) || (y.estrellas || 0) - (x.estrellas || 0));
    const items = recs.map((r) => ({ label: r.nombre, sub: [r.tipo, r.min ? r.min + ' min' : '', r.proteina ? r.proteina + ' g prot.' : ''].filter(Boolean).join(' · '), v: r.nombre, on: cur && cur.receta === r.nombre }));
    if (cur) items.unshift({ label: '✕ Quitar ' + cur.receta, v: '', sub: 'Dejar este hueco vacío' });
    openPicker({ title: dia + ' · ' + mo, items, onPick: async (it) => {
      try { const res = await api('setMenu', { semana: c.semana, dia, momento: mo, receta: it.v }); S.coc.menu = res.menu; renderCocina(); toast(it.v ? 'Menú actualizado ✓' : 'Quitado'); }
      catch (err) { toast(err.message, true); }
    } });
  }

  // ─── BIBLIOTECA ──────────────────────────────────────────────
  async function loadBiblioteca() {
    if (!S.bib) skeleton();
    try { S.bib = await api('biblioteca'); if (S.tab === 'biblioteca') renderBiblioteca(); }
    catch (e) { if (S.tab === 'biblioteca') view.innerHTML = errBox(e.message, 'reload-bib'); }
  }
  const BOOK_COLORS = ['#6D4AFF', '#2456E6', '#0F766E', '#BE185D', '#B45309', '#1E3A8A', '#7C3AED', '#0369A1'];
  function bookCover(b, cls) {
    const col = BOOK_COLORS[(b.row || 0) % BOOK_COLORS.length];
    return `<span class="cover ${cls || ''}" style="--bc:${col}" data-cover="${b.row}"><span class="ct">${esc(b.titulo)}</span></span>`;
  }
  async function findCover(b) {
    const key = 'l2627.cover.' + (b.isbn || b.titulo.toLowerCase());
    const hit = store('get', key); if (hit) return hit === 'none' ? null : hit;
    let url = null;
    const probe = (u) => new Promise((res) => { const im = new Image(); im.onload = () => res(im.naturalWidth > 2 ? u : null); im.onerror = () => res(null); im.src = u; });
    if (b.isbn) url = await probe(`https://covers.openlibrary.org/b/isbn/${encodeURIComponent(b.isbn)}-M.jpg?default=false`);
    if (!url) {
      try {
        const q = `https://openlibrary.org/search.json?title=${encodeURIComponent(b.titulo.replace(/\(.*?\)/g, ''))}${b.autor ? '&author=' + encodeURIComponent(b.autor.split(',')[0]) : ''}&limit=5&fields=cover_i`;
        const r = await fetch(q).then((x) => x.json());
        const d = (r.docs || []).find((x) => x.cover_i);
        if (d) url = await probe(`https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`);
      } catch (e) { url = null; }
    }
    store('set', key, url || 'none');
    return url;
  }
  function paintCovers(root) {
    if (!S.bib) return;
    (root || view).querySelectorAll('[data-cover]').forEach(async (el) => {
      const b = S.bib.libros.find((x) => x.row === Number(el.dataset.cover)); el.removeAttribute('data-cover'); if (!b) return;
      let url = /^https:\/\//.test(b.portada) ? b.portada : null;
      if (!url && !DEMO) { url = await findCover(b); if (url) { b.portada = url; api('updateBook', { row: b.row, fields: { portada: url } }).catch(() => {}); } }
      if (url) { el.style.backgroundImage = `url("${url}")`; el.classList.add('img'); }
    });
  }
  function renderBiblioteca() {
    const d = S.bib; if (!d) return;
    const tab = S.bibTab || 'libros';
    let body = '';
    if (tab === 'libros') {
      const L = d.libros, fin = L.filter((b) => b.estado === 'Terminado'), lee = L.filter((b) => b.estado === 'Leyendo'), por = L.filter((b) => b.estado === 'Por leer').sort((a, b) => (a.orden || 99) - (b.orden || 99)), aban = L.filter((b) => b.estado === 'Abandonado');
      const shelf = (t, arr) => arr.length ? `<section style="display:flex;flex-direction:column;gap:10px"><div class="section-title"><h2>${t}</h2><span class="muted small">${arr.length}</span></div><div class="shelf">${arr.map((b) => `<button type="button" class="bookb" data-b="edit" data-row="${b.row}">${bookCover(b)}<span class="bt2">${esc(b.titulo)}</span>${b.estrellas ? `<span class="stars tiny">${stars(b.estrellas)}</span>` : ''}</button>`).join('')}</div></section>` : '';
      body = `<div class="stats"><div class="stat"><b>${fin.length}<span class="small muted">/${d.reto}</span></b><span>libros del reto</span></div><div class="stat"><b class="sm">${fmt(d.paginasTotal, 0)}</b><span>páginas leídas</span></div><div class="stat"><b>${lee.length}</b><span>leyendo</span></div></div>
        <div class="bar thick"><i style="width:${Math.min(100, fin.length / (d.reto || 12) * 100)}%;background:#6D4AFF"></i></div>
        ${lee.map((b) => { const p = b.paginas ? Math.min(1, b.pagina / b.paginas) : 0; return `<section class="card reading">${bookCover(b, 'big')}<div class="rd"><span class="tiny bold" style="color:#6D4AFF">LEYENDO</span><span class="bold" style="font-size:17px">${esc(b.titulo)}</span><span class="small muted">${esc(b.autor)}</span>
          <div class="bar"><i style="width:${p * 100}%;background:#6D4AFF"></i></div><span class="small"><b>pág. ${b.pagina}</b>${b.paginas ? ' de ' + b.paginas + ' · ' + Math.round(p * 100) + ' %' + (b.paginas - b.pagina > 0 ? ' · te quedan ' + (b.paginas - b.pagina) : '') : ''}</span>
          <div class="row" style="gap:8px;flex-wrap:wrap"><button type="button" class="chip" data-b="pag" data-row="${b.row}" data-d="10">+10 págs</button><button type="button" class="chip" data-b="pag" data-row="${b.row}" data-d="25">+25</button><button type="button" class="chip" data-b="edit" data-row="${b.row}">Editar</button></div></div></section>`; }).join('')}
        ${shelf('Por leer', por)}${shelf('Terminados', fin)}${shelf('Abandonados', aban)}
        <button type="button" class="btn ghost" data-b="newbook">+ Añadir libro</button>`;
    } else {
      const P = d.podcasts.slice().sort((a, b) => ['Escuchando', 'Por escuchar', 'Terminado', 'Dejado'].indexOf(a.estado) - ['Escuchando', 'Por escuchar', 'Terminado', 'Dejado'].indexOf(b.estado));
      body = `<section class="card"><div class="list">${P.map((p) => `<div class="li pod ${p.estado === 'Dejado' ? 'dim' : ''}"><button type="button" class="tbody" data-b="pedit" data-row="${p.row}"><span class="bold">${esc(p.nombre)} <span class="lang">${esc(p.idioma)}</span></span><span class="small muted">${esc(p.tema)}</span><span class="tiny ${p.estado === 'Escuchando' ? 'bold' : 'muted'}" style="${p.estado === 'Escuchando' ? 'color:#6D4AFF' : ''}">${esc(p.estado)}${p.episodios ? ' · ' + p.episodios + ' episodios' : ''}${p.actual ? ' · ' + esc(p.actual) : ''}</span></button>
        ${p.estado === 'Escuchando' ? `<button type="button" class="icon-btn" data-b="ep" data-row="${p.row}" aria-label="Un episodio más">+1</button>` : ''}</div>`).join('')}</div></section>
        <button type="button" class="btn ghost" data-b="newpod">+ Añadir podcast</button>`;
    }
    view.innerHTML = `${subHeader('Biblioteca', 'Curso 2026/27')}
      <div class="seg">${[['libros', '📚 Libros'], ['podcasts', '🎧 Podcasts']].map(([k, l]) => `<button type="button" class="${tab === k ? 'on' : ''}" data-b="tab" data-v="${k}">${l}</button>`).join('')}</div>
      ${body}`;
    paintCovers(view);
  }
  function bookAfter(res, msg) {
    S.bib = res; if (res.terminado) { confetti(); toast('¡Libro terminado! 🎉 Uno más para el reto'); } else if (msg) toast(msg);
    if (S.tab === 'biblioteca') renderBiblioteca();
  }
  function openBook(row) {
    const b = S.bib.libros.find((x) => x.row === Number(row)); if (!b) return;
    openForm({
      kicker: (b.autor || '').toUpperCase(), title: b.titulo,
      values: { estado: b.estado, pagina: String(b.pagina || 0), paginas: b.paginas == null ? '' : String(b.paginas), estrellas: b.estrellas ? String(b.estrellas) : '', notas: b.notas, isbn: b.isbn },
      fields: [
        { type: 'html', html: `<div class="row" style="gap:14px;align-items:flex-start">${bookCover(b, 'big')}<div class="small muted">${esc(b.categoria || '')}${b.inicio ? '<br>Empezado el ' + shortDate(b.inicio) : ''}${b.fin ? '<br>Terminado el ' + shortDate(b.fin) : ''}</div></div>` },
        { key: 'estado', label: 'Estado', type: 'chips', options: ['Por leer', 'Leyendo', 'Terminado', 'Abandonado'] },
        { key: 'pagina', label: 'Página actual', type: 'number' },
        { key: 'paginas', label: 'Páginas totales (de tu edición)', type: 'number' },
        { key: 'estrellas', label: 'Tu nota', type: 'chips', options: ['1', '2', '3', '4', '5'].map((x) => ({ v: x, l: '★'.repeat(+x) })) },
        { key: 'notas', label: 'Ideas y notas', type: 'textarea', rows: 3, placeholder: 'Lo que no quieres olvidar de este libro' },
        { key: 'isbn', label: 'ISBN (para la portada)', type: 'number', placeholder: 'opcional' }
      ],
      submit: 'Guardar',
      onSubmit: async (v) => {
        const fields = { paginas: v.paginas, pagina: v.pagina, notas: v.notas, estrellas: v.estrellas, isbn: v.isbn };
        if (v.estado !== b.estado) fields.estado = v.estado;
        if (v.isbn !== b.isbn) { fields.portada = ''; store('del', 'l2627.cover.' + (b.isbn || b.titulo.toLowerCase())); }
        bookAfter(await api('updateBook', { row: b.row, fields }), 'Guardado ✓');
      }
    });
    paintCovers(sheet);
  }
  view.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-b],[data-act="reload-bib"]'); if (!b || S.tab !== 'biblioteca') return;
    if (b.dataset.act === 'reload-bib') return loadBiblioteca();
    const a = b.dataset.b;
    if (a === 'tab') { S.bibTab = b.dataset.v; return renderBiblioteca(); }
    if (a === 'edit') return openBook(b.dataset.row);
    if (a === 'pag') {
      const bk = S.bib.libros.find((x) => x.row === Number(b.dataset.row)); if (!bk) return;
      const np = bk.paginas ? Math.min(bk.paginas, bk.pagina + Number(b.dataset.d)) : bk.pagina + Number(b.dataset.d);
      bk.pagina = np; renderBiblioteca();
      try { bookAfter(await api('updateBook', { row: bk.row, fields: { pagina: np } }), 'Pág. ' + np + ' ✓'); } catch (err) { toast(err.message, true); loadBiblioteca(); }
      return;
    }
    if (a === 'newbook') {
      return openForm({ title: 'Añadir libro', focus: 'titulo', values: { idioma: 'ES', estado: 'Por leer' },
        fields: [{ key: 'titulo', label: 'Título' }, { key: 'autor', label: 'Autor/a' }, { key: 'idioma', label: 'Idioma', type: 'chips', options: ['ES', 'EN'] },
          { key: 'paginas', label: 'Páginas', type: 'number' }, { key: 'isbn', label: 'ISBN (opcional, para la portada)', type: 'number' },
          { key: 'estado', label: 'Estado', type: 'chips', options: ['Por leer', 'Leyendo'] }, { key: 'categoria', label: 'Categoría o asignatura', placeholder: 'Personal, Clase…' }],
        submit: 'Añadir a mi biblioteca',
        onSubmit: async (v) => { if (!v.titulo.trim()) throw new Error('Escribe el título'); bookAfter(await api('addBook', v), 'Libro añadido ✓'); } });
    }
    if (a === 'ep') {
      const p = S.bib.podcasts.find((x) => x.row === Number(b.dataset.row)); if (!p) return;
      p.episodios++; renderBiblioteca();
      try { S.bib = await api('updatePodcast', { row: p.row, fields: { episodios: p.episodios } }); toast('🎧 ' + p.episodios + ' episodios'); } catch (err) { toast(err.message, true); loadBiblioteca(); }
      return;
    }
    if (a === 'pedit') {
      const p = S.bib.podcasts.find((x) => x.row === Number(b.dataset.row)); if (!p) return;
      return openForm({ kicker: (p.tema || '').toUpperCase(), title: p.nombre, values: { estado: p.estado, episodios: String(p.episodios || 0), actual: p.actual, ideas: p.ideas },
        fields: [{ key: 'estado', label: 'Estado', type: 'chips', options: ['Escuchando', 'Por escuchar', 'Terminado', 'Dejado'] }, { key: 'episodios', label: 'Episodios escuchados', type: 'number' },
          { key: 'actual', label: 'Episodio actual', placeholder: 'p. ej. #112 La psicología del dinero' }, { key: 'ideas', label: 'Ideas guardadas', type: 'textarea', rows: 3 }],
        submit: 'Guardar', actions: p.enlace && /^https:\/\//.test(p.enlace) ? [{ label: 'Abrir ↗', href: p.enlace }] : [],
        onSubmit: async (v) => { S.bib = await api('updatePodcast', { row: p.row, fields: v }); toast('Guardado ✓'); renderBiblioteca(); } });
    }
    if (a === 'newpod') {
      return openForm({ title: 'Añadir podcast', focus: 'nombre', values: { idioma: 'ES', estado: 'Por escuchar' },
        fields: [{ key: 'nombre', label: 'Nombre' }, { key: 'idioma', label: 'Idioma', type: 'chips', options: ['ES', 'EN'] }, { key: 'tema', label: 'Tema' },
          { key: 'estado', label: 'Estado', type: 'chips', options: ['Por escuchar', 'Escuchando'] }, { key: 'enlace', label: 'Enlace (opcional)', placeholder: 'https://…' }],
        submit: 'Añadir', onSubmit: async (v) => { if (!v.nombre.trim()) throw new Error('Escribe el nombre'); S.bib = await api('addPodcast', v); toast('Podcast añadido ✓'); renderBiblioteca(); } });
    }
  });

  // ─── ME GUSTARÍA COMPRAR ─────────────────────────────────────
  async function loadDeseos() {
    if (!S.des) skeleton();
    try { S.des = await api('deseos'); if (S.tab === 'deseos') renderDeseos(); }
    catch (e) { if (S.tab === 'deseos') view.innerHTML = errBox(e.message, 'reload-des'); }
  }
  function renderDeseos() {
    const d = S.des; if (!d) return;
    const tab = S.desTab || 'pend', hoy = todayIso();
    const pend = d.items.filter((x) => x.estado === 'Pendiente').sort((a, b) => PRIOS.indexOf(a.prioridad) - PRIOS.indexOf(b.prioridad) || (a.añadido < b.añadido ? -1 : 1));
    const hist = d.items.filter((x) => x.estado !== 'Pendiente').sort((a, b) => (a.decidido < b.decidido ? 1 : -1));
    const card = (x) => {
      const dias = x.añadido ? dDiff(x.añadido, hoy) : 99, listo = dias >= 2;
      return `<article class="card wish"><div class="row between" style="align-items:flex-start"><div style="min-width:0"><span class="prio-pill ${x.prioridad}">${esc(x.prioridad)}</span><h3>${esc(x.cosa)}</h3>${x.nota ? `<span class="small muted">${esc(x.nota)}</span>` : ''}</div><b style="font-size:18px;white-space:nowrap">${x.precio != null ? eur(x.precio) : ''}</b></div>
        <div class="small ${listo ? 'ok' : 'warn'}">${listo ? '✓ Han pasado 48 h: ya puedes decidir con calma' : '⏳ Espera: podrás decidir el ' + shortDate(addDays(x.añadido, 2))}</div>
        <div class="row" style="gap:8px;flex-wrap:wrap"><button type="button" class="chip" data-w="buy" data-row="${x.row}">Lo compro</button><button type="button" class="chip" data-w="drop" data-row="${x.row}">Descartar</button>
          ${x.enlace && /^https?:\/\//.test(x.enlace) ? `<a class="chip" style="display:inline-flex;align-items:center;text-decoration:none;color:inherit" href="${esc(x.enlace)}" target="_blank" rel="noopener">Ver ↗</a>` : ''}
          <button type="button" class="icon-btn" style="margin-left:auto" data-w="del" data-row="${x.row}" aria-label="Borrar ${esc(x.cosa)}">${icon('trash')}</button></div></article>`;
    };
    view.innerHTML = `${subHeader('Me gustaría comprar', 'Regla de las 48 horas')}
      <div class="stats" style="grid-template-columns:1fr 1fr"><div class="stat"><b class="sm">${eur(d.pendiente)}</b><span>en tu lista</span></div><div class="stat ok-t"><b class="sm">${eur(d.ahorrado)}</b><span>ahorrado por no comprar</span></div></div>
      <button type="button" class="btn" data-w="new">+ Añadir algo que quiero</button>
      <div class="seg">${[['pend', 'Pendientes (' + pend.length + ')'], ['hist', 'Historial']].map(([k, l]) => `<button type="button" class="${tab === k ? 'on' : ''}" data-w="tab" data-v="${k}">${l}</button>`).join('')}</div>
      ${tab === 'pend' ? (pend.length ? `<div class="wish-grid">${pend.map(card).join('')}</div>` : '<section class="card empty"><div style="font-size:34px">🛍️</div><p class="small muted" style="margin:6px 0 0">Cuando algo te apetezca, apúntalo aquí en vez de comprarlo al momento. A las 48 h decides.</p></section>')
        : `<section class="card"><div class="list">${hist.map((x) => `<div class="li"><span style="flex:1;min-width:0"><span class="bold">${esc(x.cosa)}</span><br><span class="small muted">${x.estado === 'Comprado' ? '🛍️ Comprado' : '💚 Descartado'}${x.decidido ? ' · ' + shortDate(x.decidido) : ''}</span></span><b>${x.precio != null ? eur(x.precio) : ''}</b></div>`).join('') || '<p class="small muted">Aún no has decidido nada.</p>'}</div></section>`}`;
  }
  view.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-w],[data-act="reload-des"]'); if (!b || S.tab !== 'deseos') return;
    if (b.dataset.act === 'reload-des') return loadDeseos();
    const a = b.dataset.w, x = b.dataset.row ? S.des.items.find((i) => i.row === Number(b.dataset.row)) : null;
    if (a === 'tab') { S.desTab = b.dataset.v; return renderDeseos(); }
    if (a === 'new') {
      return openForm({ title: '¿Qué te gustaría comprar?', focus: 'cosa', values: { prioridad: 'Media' },
        fields: [{ key: 'cosa', label: 'Cosa', placeholder: 'Zapatillas de pádel' }, { key: 'precio', label: 'Precio (€)', type: 'number' }, { key: 'prioridad', label: 'Prioridad', type: 'chips', options: PRIOS },
          { key: 'enlace', label: 'Enlace (opcional)', placeholder: 'https://…' }, { key: 'nota', label: 'Por qué lo quiero', placeholder: 'opcional' }],
        submit: 'Apuntar (y esperar 48 h)',
        onSubmit: async (v) => { if (!v.cosa.trim()) throw new Error('Escribe qué es'); S.des = await api('addDeseo', v); toast('Apuntado. Decide dentro de 48 h ⏳'); renderDeseos(); } });
    }
    if (!x) return;
    if (a === 'drop') {
      try { S.des = await api('updateDeseo', { row: x.row, fields: { estado: 'Descartado' } }); toast(x.precio ? '💚 ' + eur(x.precio) + ' ahorrados' : 'Descartado 💚'); renderDeseos(); } catch (err) { toast(err.message, true); }
    }
    if (a === 'buy') {
      if (x.añadido && dDiff(x.añadido, todayIso()) < 2 && !confirm('Aún no han pasado 48 h. ¿Seguro que lo compras ya?')) return;
      try {
        S.des = await api('updateDeseo', { row: x.row, fields: { estado: 'Comprado' } }); renderDeseos();
        toast('¡Disfrútalo! Apunta el gasto 👇');
        setTimeout(() => openAdd({ tipo: 'Gasto', amount: x.precio != null ? String(x.precio).replace('.', ',') : '', concepto: x.cosa }), 500);
      } catch (err) { toast(err.message, true); }
    }
    if (a === 'del') {
      if (!confirm('¿Borrar "' + x.cosa + '" de la lista?')) return;
      try { S.des = await api('deleteDeseo', { row: x.row }); renderDeseos(); } catch (err) { toast(err.message, true); }
    }
  });

  // ─── REVISIÓN SEMANAL + RESUMEN PARA CLAUDE ──────────────────
  async function loadRevision(semana) {
    if (!S.rev) skeleton();
    try { S.rev = await api('revision', { semana: semana || (S.rev && S.rev.semana) || '' }); S.revDraft = null; if (S.tab === 'revision') renderRevision(); }
    catch (e) { if (S.tab === 'revision') view.innerHTML = errBox(e.message, 'reload-rev'); }
  }
  const isoNice = (t) => String(t).replace(/\d{4}-\d{2}-\d{2}/g, (d) => shortDate(d));
  const pctS = (x) => (x == null ? '–' : Math.round(x * 100) + ' %');
  function revSummary(r, dr) {
    const L = [];
    const fl = (s) => cap(new Date(...s.split('-').map((n, i) => (i === 1 ? n - 1 : +n))).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }));
    L.push(`# Mi semana · ${fl(r.semana)} – ${fl(r.fin)}`);
    L.push(`Identidad: "${r.identidad}"`, '');
    L.push('## Números');
    L.push(`- Hábitos del núcleo: ${pctS(r.auto.pct)} de media`);
    L.push(`- Entrenos de gym: ${r.auto.entrenos == null ? '–' : r.auto.entrenos} (meta 4)`);
    if (r.nums[7] && r.nums[7].media != null) L.push(`- Sueño medio: ${fmt(r.nums[7].media, 1)} h (meta 8)`);
    if (r.nums[10] && r.nums[10].media != null) L.push(`- Pasos medios: ${fmt(r.nums[10].media, 0)}`);
    if (r.nums[8] && r.nums[8].media != null) L.push(`- Móvil medio: ${fmt(r.nums[8].media, 0)} min/día (máx. 120)`);
    L.push(`- Páginas leídas: ${r.auto.paginas == null ? '–' : fmt(r.auto.paginas, 0)} · Curso online: ${r.auto.horasCurso == null ? '–' : fmt(r.auto.horasCurso, 1)} h`);
    if (r.actividades.length) L.push(`- Deporte extra: ${r.actividades.join(', ')}`);
    L.push('', '## Hábitos (días cumplidos)');
    r.habitos.forEach((h) => L.push(`- ${labelOf(h.name)}: ${h.hechos}${h.freq === 'Diario' ? '/' + r.dias : '/' + (h.veces || 1) + (h.freq === 'Mensual' ? ' al mes' : '')}`));
    L.push('', '## Dinero');
    L.push(`- Gastado esta semana: ${eur(r.auto.gastado)}${r.topCats.length ? ' (' + r.topCats.map((c) => c.cat + ' ' + eur(c.importe)).join(', ') + ')' : ''}`);
    if (r.ingresos) L.push(`- Ingresos: ${eur(r.ingresos)}`);
    if (r.dineroMes && r.dineroMes.limite != null) L.push(`- Mes: gastado ${eur(r.dineroMes.gastadoMes)} de ${eur(r.dineroMes.limite)} (quedan ${eur(r.dineroMes.queda)})`);
    L.push('', '## Estudios');
    L.push(`- Tareas hechas: ${r.hechasSemana.length ? r.hechasSemana.join('; ') : 'ninguna registrada'}`);
    if (r.atrasadas.length) L.push(`- Atrasadas: ${r.atrasadas.join('; ')}`);
    L.push(`- Próxima semana: ${r.proximas.length ? r.proximas.join('; ') : 'sin entregas apuntadas'}`);
    if (r.examenes.length) L.push(`- Exámenes en las próximas 3 semanas: ${r.examenes.join('; ')}`);
    L.push(`- Certificaciones: ${r.certs.join(' | ')}`);
    if (r.leyendo.length) L.push(`- Leyendo: ${r.leyendo.join('; ')}`);
    L.push('', '## Mi reflexión');
    L.push(`- Disfrute: ${dr.disfrute ? dr.disfrute + '/5' : 'sin puntuar'}`);
    L.push(`- Qué fue bien: ${dr.bien || '—'}`);
    L.push(`- Qué mejorar: ${dr.mejorar || '—'}`);
    L.push(`- Mis 3 prioridades para la próxima semana: ${dr.prioridades || '—'}`);
    L.push('', '---', 'Claude: analiza mi semana con sinceridad y cariño. Dime qué patrones ves (qué hábitos fallan y cuándo), una cosa a celebrar y una sola cosa concreta a cambiar. Después ayúdame a planificar la próxima semana día a día teniendo en cuenta mi horario de clases, el gym (pierna martes, empuje jueves, tirón viernes, cycling sábado), las entregas y exámenes, y mis prioridades. Mi meta de junio: prácticas en datos y media de 9.');
    return L.join('\n');
  }
  function renderRevision() {
    const r = S.rev; if (!r) return;
    const dr = S.revDraft || (S.revDraft = { disfrute: r.disfrute ? String(r.disfrute) : '', bien: r.bien, mejorar: r.mejorar, prioridades: r.prioridades });
    const faces = ['😞', '🙁', '😐', '🙂', '😄'];
    const hb = r.habitos.filter((h) => h.freq === 'Diario');
    const m = r.medida;
    view.innerHTML = `${subHeader('Revisión semanal', 'Domingo · 10 minutos')}
      <div class="row between"><div class="monthnav"><button type="button" data-r="week" data-v="-7" aria-label="Semana anterior">‹</button><span>${shortDate(r.semana)} – ${shortDate(r.fin)}</span><button type="button" data-r="week" data-v="7" aria-label="Semana siguiente" ${r.semana >= todayIso() ? 'disabled' : ''}>›</button></div></div>
      <div class="cols"><div>
        <div class="stats">
          <div class="stat"><b>${pctS(r.auto.pct)}</b><span>hábitos</span></div>
          <div class="stat"><b>${r.auto.entrenos == null ? '–' : r.auto.entrenos}<span class="small muted">/4</span></b><span>entrenos</span></div>
          <div class="stat"><b class="sm">${eur(r.auto.gastado)}</b><span>gastado</span></div>
        </div>
        <section class="card"><div class="row between" style="margin-bottom:6px"><span class="kicker">Hábitos de la semana</span><span class="tiny muted">${r.dias} días registrados</span></div>
          ${hb.length ? `<div class="list">${hb.map((h) => { const p = r.dias ? h.hechos / r.dias : 0; return `<div class="li" style="padding:8px 0"><span style="width:26px">${esc(emojiOf(h.name))}</span><span style="flex:1;min-width:0" class="small">${esc(labelOf(h.name).replace(/\s*\(.*\)/, ''))}<span class="bar" style="margin-top:4px;display:block"><i style="width:${p * 100}%;${p >= 0.85 ? 'background:var(--green)' : p < 0.5 ? 'background:#D9482B' : ''}"></i></span></span><b class="small">${h.hechos}/${r.dias}</b></div>`; }).join('')}</div>` : '<p class="small muted" style="margin:0">Aún no hay datos de hábitos esta semana.</p>'}
        </section>
        <section class="card"><div class="kicker" style="margin-bottom:6px">Estudios</div>
          <p class="small" style="margin:0 0 6px">✅ Tareas hechas: <b>${r.hechasSemana.length}</b>${r.atrasadas.length ? ` · <span class="late">⚠ ${r.atrasadas.length} atrasadas</span>` : ''}</p>
          ${r.proximas.length ? `<div class="small muted" style="margin-bottom:4px">Próxima semana:</div>${r.proximas.map((t) => `<div class="small">• ${esc(isoNice(t))}</div>`).join('')}` : '<p class="small muted" style="margin:0">Sin entregas apuntadas para la próxima semana.</p>'}
          ${r.examenes.length ? `<p class="small late" style="margin:8px 0 0">📝 Exámenes cerca: ${esc(isoNice(r.examenes.join(' · ')))}</p>` : ''}
        </section>
      </div><div>
        <section class="card refl"><div class="kicker">Tu reflexión</div>
          <div class="small muted" style="margin:8px 0 6px">¿Cuánto has disfrutado la semana?</div>
          <div class="faces">${faces.map((f, k) => `<button type="button" class="${dr.disfrute === String(k + 1) ? 'on' : ''}" data-r="face" data-v="${k + 1}" aria-label="${k + 1} de 5">${f}</button>`).join('')}</div>
          <label class="field"><span class="small muted bold">🌟 Qué fue bien</span><textarea class="text-in area" rows="2" data-rk="bien" maxlength="2000">${esc(dr.bien)}</textarea></label>
          <label class="field"><span class="small muted bold">🔧 Qué mejorar</span><textarea class="text-in area" rows="2" data-rk="mejorar" maxlength="2000">${esc(dr.mejorar)}</textarea></label>
          <label class="field"><span class="small muted bold">🎯 3 prioridades para la próxima semana</span><textarea class="text-in area" rows="3" data-rk="prioridades" maxlength="2000" placeholder="1.&#10;2.&#10;3.">${esc(dr.prioridades)}</textarea></label>
          <button type="button" class="btn ghost" data-r="save">Guardar reflexión</button>
        </section>
        ${m ? `<section class="card"><div class="kicker" style="margin-bottom:6px">Cómo me siento · ${esc(m.mes)}</div>
          ${m.sentir ? `<p class="small" style="margin:0">Este mes: <b>${m.sentir}/10</b>${m.peso ? ' · ' + fmt(m.peso, 1) + ' kg' : ''} <button type="button" class="linkbtn tiny" data-r="medida">cambiar</button></p>` : `<p class="small muted" style="margin:0 0 8px">Una vez al mes, sin obsesiones: ¿cómo te sientes con tu cuerpo y tu energía?</p><button type="button" class="btn ghost slim" data-r="medida">Apuntar este mes</button>`}</section>` : ''}
        <button type="button" class="btn claude" data-r="copy">📋 Copiar resumen para Claude</button>
        <a class="btn ghost" style="display:flex;align-items:center;justify-content:center;text-decoration:none" href="https://claude.ai/new" target="_blank" rel="noopener">Abrir Claude ↗</a>
        <p class="tiny muted" style="margin:0;text-align:center">Copia el resumen, abre Claude y pégalo: te ayudo a analizar la semana y a preparar la siguiente.</p>
      </div></div>`;
  }
  view.addEventListener('input', (e) => { const k = e.target.dataset && e.target.dataset.rk; if (k && S.revDraft) S.revDraft[k] = e.target.value; });
  view.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-r],[data-act="reload-rev"]'); if (!b || S.tab !== 'revision') return;
    if (b.dataset.act === 'reload-rev') return loadRevision();
    const a = b.dataset.r, r = S.rev, dr = S.revDraft;
    if (a === 'week') return loadRevision(addDays(r.semana, Number(b.dataset.v)));
    if (a === 'face') { dr.disfrute = dr.disfrute === b.dataset.v ? '' : b.dataset.v; view.querySelectorAll('.faces button').forEach((x) => x.classList.toggle('on', x.dataset.v === dr.disfrute)); return; }
    if (a === 'save') {
      b.disabled = true;
      try { const res = await api('saveRevision', { semana: r.semana, fields: dr }); S.rev = res; toast('Reflexión guardada ✓'); if (S.today) S.today = null; }
      catch (err) { toast(err.message, true); } b.disabled = false; return;
    }
    if (a === 'copy') {
      const ok = await copyText(revSummary(r, dr));
      toast(ok ? 'Resumen copiado ✓ Pégalo en Claude' : 'No se ha podido copiar', !ok);
      if (ok && (dr.disfrute !== (r.disfrute ? String(r.disfrute) : '') || dr.bien !== r.bien || dr.mejorar !== r.mejorar || dr.prioridades !== r.prioridades)) api('saveRevision', { semana: r.semana, fields: dr }).then((res) => { S.rev = res; }).catch(() => {});
      return;
    }
    if (a === 'medida') {
      const m = r.medida;
      return openForm({ title: 'Cómo me siento · ' + m.mes, values: { sentir: m.sentir ? String(m.sentir) : '', peso: m.peso == null ? '' : String(m.peso).replace('.', ','), notas: m.notas },
        intro: 'Energía, cómo te ves y te sientes. El peso es opcional.',
        fields: [{ key: 'sentir', label: 'Del 1 al 10', type: 'chips', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] }, { key: 'peso', label: 'Peso (opcional, kg)', type: 'number' }, { key: 'notas', label: 'Notas', placeholder: 'opcional' }],
        submit: 'Guardar',
        onSubmit: async (v) => { if (!v.sentir) throw new Error('Elige del 1 al 10'); await api('setMedida', { mi: m.mi, fields: v }); r.medida = Object.assign({}, m, { sentir: Number(v.sentir), peso: v.peso === '' ? null : Number(String(v.peso).replace(',', '.')), notas: v.notas }); toast('Guardado ✓'); renderRevision(); } });
    }
  });


  // ─── VISIÓN ──────────────────────────────────────────────────
  const AREA_COLOR = { Estudios: '#6D4AFF', Carrera: '#2456E6', Empleable: '#0369A1', Cuerpo: '#0F766E', Disfrutar: '#BE185D', 'Canadá': '#B45309', 'Sueños': '#1E3A8A' };
  const imgURLs = {};
  async function imgURL(id) {
    if (imgURLs[id]) return imgURLs[id];
    const key = new Request(location.origin + '/__img/' + id);
    let cache = null;
    try { cache = await caches.open('l2627-img'); const hit = await cache.match(key); if (hit) return (imgURLs[id] = URL.createObjectURL(await hit.blob())); } catch (e) { cache = null; }
    const r = await api('img', { id });
    const bin = atob(r.data), arr = new Uint8Array(bin.length);
    for (let k = 0; k < bin.length; k++) arr[k] = bin.charCodeAt(k);
    const blob = new Blob([arr], { type: r.mime || 'image/jpeg' });
    try { if (cache) await cache.put(key, new Response(blob)); } catch (e) { /* sin caché */ }
    return (imgURLs[id] = URL.createObjectURL(blob));
  }
  function paintImages(root) {
    (root || document).querySelectorAll('[data-img]').forEach(async (el) => {
      const id = el.dataset.img; el.removeAttribute('data-img');
      try { const u = await imgURL(id); if (el.tagName === 'IMG') el.src = u; else el.style.backgroundImage = `url("${u}")`; el.classList.add('loaded'); } catch (e) { /* se queda el color */ }
    });
  }
  async function loadVision() {
    if (!S.vision) skeleton();
    try { S.vision = await api('vision'); store('set', 'l2627.vision', JSON.stringify(S.vision)); if (S.tab === 'vision') renderVision(); }
    catch (e) { if (S.tab === 'vision') view.innerHTML = errBox(e.message, 'reload-vision'); }
  }
  function pctTxt(p) { return p == null ? '' : Math.round(p * 100) + '%'; }
  function renderVision() {
    const v = S.vision; if (!v) return;
    const cards = v.cards || [];
    view.innerHTML = `
      <header class="head"><h1>Mi visión</h1></header>
      <p class="identity">“${esc(v.identidad)}”</p>
      <section class="yearbar"><div class="row between small bold"><span>Oct 2026</span><span>Mi año · ${Math.round((v.year || 0) * 100)}%</span><span>Sep 2027</span></div><div class="bar"><i style="width:${(v.year || 0) * 100}%"></i></div></section>
      ${!DEMO && v.folderOk === false ? '<div class="demo-banner">No encuentro tu carpeta de fotos en Google Drive. Revisa su nombre en la hoja Ajustes.</div>' : ''}
      <div class="vcards" id="vcards">${cards.map((c, k) => `
        <article class="vcard" data-v="open" data-k="${k}" style="--c:${AREA_COLOR[c.area] || '#1E3A8A'}">
          <div class="vimg" ${c.images[0] ? `data-img="${esc(c.images[0])}"` : ''}></div>
          <span class="vtag">${esc(c.area)} · ${k + 1}/${cards.length}</span>
          <div class="vpanel">
            <p class="vfrase">${esc(c.frase)}</p>
            ${c.progreso != null ? `<div class="row between small bold"><span>${esc(c.meta)}</span><span>${esc(c.fecha || '')}</span></div>
              <div class="bar light"><i style="width:${Math.min(100, c.progreso * 100)}%"></i></div>
              <span class="small" style="opacity:.85">${c.actual ? esc(c.actual) + ' de ' + esc(c.objetivo || '–') + ' · ' + pctTxt(c.progreso) : 'Aún sin datos · meta ' + esc(c.objetivo || '')}</span>` : `<span class="small" style="opacity:.85">${esc(c.meta || '')}</span>`}
            <span class="tiny" style="opacity:.7">${c.images.length} ${c.images.length === 1 ? 'foto' : 'fotos'} · toca para verlas</span>
          </div>
        </article>`).join('')}</div>
      <div class="vdots" id="vdots">${cards.map((_, k) => `<i class="${k === 0 ? 'on' : ''}"></i>`).join('')}</div>
      <section style="display:flex;flex-direction:column;gap:10px">
        <div class="section-title"><h2>Mis metas estrella</h2></div>
        ${cards.filter((c) => c.progreso != null).map((c) => `<div class="habit" data-v="open" data-k="${cards.indexOf(c)}" style="cursor:pointer">
          <div class="ico vthumb" ${c.images[0] ? `data-img="${esc(c.images[0])}"` : ''} style="background-color:${AREA_COLOR[c.area]}"></div>
          <div class="txt"><span class="tiny bold" style="color:${AREA_COLOR[c.area]}">${esc(c.area).toUpperCase()}</span><span class="name">${esc(c.meta)}</span>
          <div class="bar"><i style="width:${Math.min(100, c.progreso * 100)}%;background:${AREA_COLOR[c.area]}"></i></div></div>
          <span class="count">${pctTxt(c.progreso)}</span></div>`).join('')}
      </section>`;
    paintImages(view);
    const wrap = $('#vcards'), dots = $('#vdots');
    if (wrap) wrap.addEventListener('scroll', () => {
      const k = Math.round(wrap.scrollLeft / wrap.clientWidth);
      dots.querySelectorAll('i').forEach((d, j) => d.classList.toggle('on', j === k));
    }, { passive: true });
  }
  function openGallery(k) {
    const c = S.vision.cards[k]; if (!c) return;
    sheet.hidden = false;
    sheet.innerHTML = `<div class="sheet gallery${enterCls()}" role="dialog" aria-modal="true" aria-label="Fotos de ${esc(c.area)}">
      <div class="grab"></div>
      <div class="row between"><div><span class="tiny bold" style="color:${AREA_COLOR[c.area]}">${esc(c.area).toUpperCase()}</span><h2 style="font-size:22px">${esc(c.meta || c.area)}</h2></div>
        <button type="button" class="icon-btn" data-g="close" aria-label="Cerrar">${icon('close')}</button></div>
      <p class="identity" style="margin:0">${esc(c.frase)}</p>
      ${c.como ? `<p class="small muted" style="margin:0">Cómo se mide: ${esc(c.como)}</p>` : ''}
      <div class="ggrid">${c.images.map((id) => `<button type="button" class="gimg" data-g="full" data-id="${esc(id)}" data-img="${esc(id)}" aria-label="Ver foto"></button>`).join('') || '<p class="small muted">Aún no hay fotos en esta área. Añádelas en la hoja "Visión fotos".</p>'}</div>
    </div>`;
    paintImages(sheet);
  }
  function showFull(id) {
    const d = document.createElement('div'); d.className = 'fullimg'; d.setAttribute('role', 'dialog');
    d.innerHTML = `<img alt="" data-img="${esc(id)}"><button type="button" class="icon-btn" aria-label="Cerrar">${icon('close')}</button>`;
    document.body.appendChild(d); paintImages(d);
    d.addEventListener('click', () => d.remove());
  }
  view.addEventListener('click', (e) => {
    const b = e.target.closest('[data-v],[data-act="reload-vision"]'); if (!b || S.tab !== 'vision') return;
    if (b.dataset.act === 'reload-vision') return loadVision();
    if (b.dataset.v === 'open') openGallery(Number(b.dataset.k));
  });
  sheet.addEventListener('click', (e) => {
    const b = e.target.closest('[data-g]'); if (!b) return;
    if (b.dataset.g === 'close') { sheet.hidden = true; sheet.innerHTML = ''; }
    if (b.dataset.g === 'full') showFull(b.dataset.id);
  });
  async function maybeSplash() {
    const today = todayIso();
    if (store('get', 'l2627.splash') === today || !S.pin) return;
    let v = null;
    try { v = JSON.parse(store('get', 'l2627.vision') || 'null'); } catch (e) { v = null; }
    if (!v) { try { v = await api('vision'); S.vision = v; store('set', 'l2627.vision', JSON.stringify(v)); } catch (e) { return; } }
    const pool = (v.cards || []).filter((c) => c.images && c.images.length);
    const c = pool.length ? pool[Math.floor(Math.random() * pool.length)] : (v.cards || [])[0];
    if (!c) return;
    store('set', 'l2627.splash', today);
    const id = c.images && c.images.length ? c.images[Math.floor(Math.random() * c.images.length)] : null;
    const d = document.createElement('div'); d.className = 'splash'; d.style.setProperty('--c', AREA_COLOR[c.area] || '#1E3A8A');
    d.innerHTML = `<div class="vimg" ${id ? `data-img="${esc(id)}"` : ''}></div><div class="splash-txt"><span class="tiny bold">${esc(c.area).toUpperCase()} · TU VISIÓN DE HOY</span><p class="vfrase">${esc(c.frase)}</p>${c.meta && c.progreso != null ? `<span class="small">${esc(c.meta)} · ${pctTxt(c.progreso)}</span>` : ''}<span class="tiny" style="opacity:.7">Toca para empezar tu día</span></div>`;
    document.body.appendChild(d); paintImages(d);
    const close = () => { d.classList.add('out'); setTimeout(() => d.remove(), 400); };
    d.addEventListener('click', close); setTimeout(close, 4500);
  }

  // Refrescar al volver a la app (p. ej. después del Atajo del Polar)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && S.pin && S.tab === 'hoy' && S.today) {
      if (S.fechaAuto !== false) S.fecha = todayIso();
      loadToday(true);
    }
  });
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  start();
})();
