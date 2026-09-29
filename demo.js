// MODO DEMO: datos de ejemplo en memoria (solo se usa si CONFIG.API_URL está vacío).
window.DemoAPI = (function () {
  const iso = (d) => { const p = (n) => String(n).padStart(2, '0'); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); };
  const today = iso(new Date());
  const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const defs = [
    ['📚 Estudiar la carrera', 'Sí/No', null, 'Diario', null, 'Núcleo', true, 'Abrir los apuntes y leer 1 página'],
    ['💻 Curso online (min)', 'Número ≥', 25, 'Diario', null, 'Núcleo', true, 'Ver 1 vídeo de 5 min'],
    ['🥗 Comer sano', 'Sí/No', null, 'Diario', null, 'Núcleo', true, 'Añadir una pieza de fruta'],
    ['💶 Registrar gastos', 'Sí/No', null, 'Diario', null, 'Núcleo', true, 'Solo abrir Añadir'],
    ['🗓️ Planificar mañana', 'Sí/No', null, 'Diario', null, 'Núcleo', true, 'Escribir solo 1 tarea'],
    ['⏰ Me levanto a mi hora', 'Sí/No', null, 'Diario', null, 'Núcleo', true, 'Pies en el suelo al primer sonido'],
    ['😴 Horas de sueño', 'Número ≥', 8, 'Diario', null, 'Núcleo', true, ''],
    ['📱 Móvil (min)', 'Número ≤', 120, 'Diario', null, 'Núcleo', true, ''],
    ['📖 Páginas leídas', 'Número ≥', 10, 'Diario', null, 'Núcleo', true, 'Leer 1 página'],
    ['👣 Pasos', 'Número ≥', 8000, 'Diario', null, 'Núcleo', true, ''],
    ['🏋️ Gimnasio', 'Sí/No', null, 'Semanal', 4, 'Núcleo', true, ''],
    ['🔁 Revisión semanal', 'Sí/No', null, 'Semanal', 1, 'Núcleo', true, ''],
    ['🛁 Limpiar baño', 'Sí/No', null, 'Semanal', 1, 'Nivel 2', true, ''],
    ['🧽 Limpieza profunda', 'Sí/No', null, 'Mensual', 2, 'Nivel 2', true, ''],
    ['👗 Limpiar armario', 'Sí/No', null, 'Mensual', 1, 'Nivel 2', true, ''],
    ['💧 Beber 2 L agua', 'Sí/No', null, 'Diario', null, 'Nivel 2', false, ''],
    ['🌙 Sin pantallas antes de dormir', 'Sí/No', null, 'Diario', null, 'Nivel 2', false, ''],
    ["🧹 Ordenar cuarto 10'", 'Sí/No', null, 'Diario', null, 'Nivel 2', false, ''],
    ['📞 Hablar con alguien querido', 'Sí/No', null, 'Diario', null, 'Nivel 2', false, ''],
    ['📥 Bandeja de entrada a cero', 'Sí/No', null, 'Diario', null, 'Nivel 2', false, ''],
    ['⭐ Hábito extra 1', 'Sí/No', null, 'Diario', null, 'Nivel 2', false, ''],
    ['⭐ Hábito extra 2', 'Sí/No', null, 'Diario', null, 'Nivel 2', false, '']
  ];
  const vals = { 1: true, 2: 25, 4: true, 6: true, 7: 7.5, 8: 96, 10: 6240 };
  const streaks = { 1: 9, 2: 4, 3: 3, 4: 10, 5: 1, 6: 5, 7: 0, 8: 6, 9: 2, 10: 0 };
  let curso = 'DP-900';
  const moves = [
    { row: 1, fecha: today, concepto: 'Café con Marta', categoria: 'Comida fuera y cafés', importe: 4.5, cuenta: 'Efectivo', destino: '', tipo: 'Gasto' },
    { row: 2, fecha: today, concepto: 'Bus a la uni', categoria: 'Transporte', importe: 1.5, cuenta: 'Cuenta gastos', destino: '', tipo: 'Gasto' }
  ];
  const RUT = {
    'Pierna': [['Sentadilla con barra', 'Principal', 4, 5, 8, 150, 2.5, 32.5, 'Prensa o sentadilla goblet', 'Rodillas hacia fuera'], ['Peso muerto rumano', 'Secundario', 3, 8, 10, 120, 2.5, 30, 'Rumano con mancuernas', ''], ['Hip thrust', 'Secundario', 3, 8, 12, 120, 2.5, 40, 'Puente de glúteo', 'Pausa 1 s arriba'], ['Sentadilla búlgara', 'Accesorio', 3, 10, 12, 90, 1, 8, 'Zancadas', 'Reps por pierna'], ['Curl femoral en máquina', 'Accesorio', 3, 10, 15, 60, 1, 25, '', '']],
    'Empuje': [['Press banca con barra', 'Principal', 4, 5, 8, 150, 2.5, 32.5, 'Press con mancuernas', 'Escápulas juntas'], ['Press militar con mancuernas', 'Secundario', 3, 8, 10, 120, 1, 9, 'Máquina de hombro', ''], ['Press inclinado con mancuernas', 'Secundario', 3, 8, 12, 90, 1, 12, 'Máquina inclinada', ''], ['Elevaciones laterales', 'Accesorio', 3, 12, 15, 60, 1, 5, 'Polea', 'Sin impulso'], ['Tríceps en polea', 'Accesorio', 3, 10, 15, 60, 1, 15, 'Fondos en máquina', '']],
    'Tirón': [['Peso muerto convencional', 'Principal', 3, 5, 5, 180, 2.5, 50, 'Rumano o hip thrust', 'Barra pegada'], ['Dominadas asistidas', 'Secundario', 3, 6, 10, 120, 1, -20, 'Jalón al pecho', 'Asistencia en negativo'], ['Remo con mancuerna a una mano', 'Secundario', 3, 8, 12, 90, 1, 12, 'Remo en polea', ''], ['Face pull', 'Accesorio', 3, 12, 15, 60, 1, 12.5, 'Pájaros', ''], ['Curl de bíceps con mancuernas', 'Accesorio', 3, 10, 12, 60, 1, 7, 'Curl en polea', '']],
    'Ciclo + core': [['Cycling (clase)', 'Cardio', 1, 45, 45, 0, 0, null, 'Bici estática', 'Reps = minutos'], ['Plancha', 'Core', 3, 40, 40, 30, 0, null, '', 'Reps = segundos'], ['Dead bug', 'Core', 3, 10, 10, 30, 0, null, '', ''], ['Pallof press', 'Core', 3, 10, 10, 30, 0, null, '', 'Reps por lado'], ['Crunch en polea', 'Core', 3, 12, 15, 30, 0, null, '', '']]
  };
  const DAYOF = { 'Pierna': 'Martes', 'Empuje': 'Jueves', 'Tirón': 'Viernes', 'Ciclo + core': 'Sábado' };
  const logged = [];
  let nextRow = 100;
  const wd = new Date().getDay();
  const rutinaHoy = Object.keys(DAYOF).find((k) => DAYOF[k] === DIAS[wd]) || '';

  const addD = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
  let tRow = 6;
  const tareas = [
    ['Tecnología Big Data II', 'Entrega práctica 1: pipeline con Spark', 'Entrega', addD(1), 'Alta'],
    ['Visualización de datos & reporting empresarial', 'Leer capítulo 2 de Storytelling with Data', 'Lectura', addD(0), 'Media'],
    ['Cert. DP-900', 'Módulo 3: bases de datos relacionales en Azure', 'Estudio', addD(4), 'Media'],
    ['Marketing y estrategia de ventas', 'Caso práctico en grupo', 'Trabajo en grupo', addD(9), 'Media'],
    ['Regression and modeling with SAS', 'Instalar SAS OnDemand y probar el primer script', 'Ejercicios', addD(-1), 'Alta'],
    ['Analítica de datos II: modelización avanzada y ML', 'Repasar regresión logística', 'Estudio', '', 'Baja'],
    ['Data analytics with Google', 'Cuestionario tema 1', 'Entrega', addD(-3), 'Media', true]
  ].map(([asignatura, tarea, tipo, fecha, prioridad, hecha]) => ({ row: tRow++, asignatura, tarea, tipo, fecha, prioridad, hecha: !!hecha, notas: '' }));
  const asigs = [['Regression and modeling with SAS', 3], ['Visualización de datos & reporting empresarial', 4.5], ['Data analytics with Google', 6], ['Sistemas de apoyo a la decisión (inglés)', 3], ['Emprendimiento tecnológico', 3], ['Tecnología Big Data II', 3], ['Marketing y estrategia de ventas', 6], ['Analítica de datos II: modelización avanzada y ML', 6], ['La cuestión de Dios', 5]]
    .map(([nombre, creditos], k) => ({ row: 18 + k, nombre, cuatri: '1º cuatri', creditos, examen: k === 5 ? addD(12) : k === 2 ? addD(40) : '', objetivo: 9, final: null, estado: 'Cursando', notas: '' }));
  const certs = [['Microsoft DP-900 · Azure Data Fundamentals', 'DP-900', 12, 3, '2026-11-15', 'En curso', 13.5], ['Claude (Anthropic) · certificación', 'Claude', null, null, '2026-12-20', 'Pendiente', 0], ['SAS · Regression & Modeling', 'SAS', null, null, '2027-03-31', 'Pendiente', 0]]
    .map(([nombre, codigo, total, hechos, objetivo, estado, horas], k) => ({ row: 7 + k, nombre, codigo, total, hechos, progreso: null, objetivo, examen: '', estado, horas, notas: k === 0 ? 'Primero: es la más corta.' : '' }));
  const mk = (r0, list) => list.map(([tarea, fecha], k) => ({ row: r0 + k, tarea, fecha, estado: 'Pendiente', notas: '' }));
  const planP = mk(35, [['Actualizar CV (1 página, con proyectos y certificaciones)', '2026-10-31'], ['LinkedIn completo: foto, titular, extracto y certificaciones', '2026-11-15'], ['Lista de 15 empresas donde me gustaría hacer prácticas', '2026-12-15'], ['Enviar al menos 10 candidaturas', '2027-03-15']]);
  const cvL = mk(48, [['Certificación DP-900', '2026-11-15'], ['CV de 1 página actualizado', '2026-10-31'], ['Portfolio: 3 proyectos en GitHub', '2027-02-28']]);
  const soonT = (f) => tareas.filter((t) => !t.hecha && t.fecha && t.fecha <= addD(1)).sort((a, b) => (a.fecha < b.fecha ? -1 : 1));
  const est = () => ({ ok: true, hoy: today, certs, asignaturas: asigs, plan: planP, cv: cvL, media: null, practicas: '2027-06-01', tareas: tareas.slice(), tipos: [] });

  function habits() {
    return defs.map((d, k) => {
      const i = k + 1, v = vals[i];
      let done = false;
      if (d[1] === 'Sí/No') done = !!v;
      else if (v != null && v !== '') done = d[1] === 'Número ≥' ? Number(v) >= d[2] : Number(v) <= d[2];
      if (i === 11 && logged.length) done = true;
      return { i, name: d[0], type: d[1], meta: d[2], freq: d[3], veces: d[4], nivel: d[5], activo: d[6], mini: d[7], stack: '',
        value: d[1] === 'Sí/No' ? !!v : (v == null ? null : v), done, streak: (streaks[i] || 0) + (done ? 1 : 0), yesterday: i !== 10,
        count: i === 11 ? 1 + (done ? 1 : 0) : (done ? 1 : 0) };
    });
  }
  function money() {
    const g = moves.filter((m) => m.fecha === today && m.tipo === 'Gasto').reduce((a, m) => a + m.importe, 0);
    return { gastadoHoy: g, gastadoMes: 62.4 + g, limite: 120.89, queda: 120.89 - 62.4 - g };
  }
  function todayResp(fecha) {
    const hs = habits();
    const act = hs.filter((h) => h.freq === 'Diario' && h.activo);
    const best = act.reduce((a, h) => (h.streak > a.streak ? h : a), { streak: 0, name: '' });
    return {
      ok: true, fecha: fecha || today, dia: DIAS[wd], habits: hs, pct: act.filter((h) => h.done).length / act.length,
      failedYesterday: ['👣 Pasos'], bestStreak: { days: best.streak, name: best.name },
      identidad: 'Soy una persona sana que se cuida, entrena y estudia para sacar lo mejor de sí misma, y ahorra para su futuro.',
      nombre: 'Laura', frase: { text: 'No subes al nivel de tus metas, caes al nivel de tus sistemas.', autor: 'James Clear · Hábitos atómicos' },
      curso, despertar: '07:04', wakeTarget: '07:00', nota: '', sinGastar: '',
      agenda: [{ inicio: '08:00', fin: '10:00', actividad: 'Clase', tipo: 'Clase' }, { inicio: '16:00', fin: '18:30', actividad: 'Estudio', tipo: 'Estudio' }, { inicio: '19:30', fin: '20:30', actividad: 'Gym · ' + (rutinaHoy || 'descanso'), tipo: 'Gym' }],
      gym: { rutina: rutinaHoy, ejercicios: rutinaHoy ? 5 : 0, semana: 1 + (logged.length ? 1 : 0), meta: 4 },
      money: money(), sonido: true, tareas: soonT()
    };
  }
  function meta() {
    return { ok: true, categorias: ['Gimnasio', 'Suscripciones', 'Comida fuera y cafés', 'Ocio y planes', 'Ropa y compras', 'Cuidado personal', 'Transporte', 'Estudios y certificaciones', 'Regalos', 'Viajes y escapadas', 'Salud', 'Deporte extra (pádel)', 'Otros e imprevistos'],
      ingresos: ['Trabajos puntuales', 'Regalos / paga familiar', 'Otros ingresos'], cuentas: ['Efectivo', 'Cuenta gastos', 'Cuenta ahorro', 'Hucha Canadá'],
      recientes: moves.slice().reverse(), calendario: { on: true, last: new Date(Date.now() - 12 * 60000).toISOString(), nombre: 'Laura 26/27', error: '' }, saldos: { 'Efectivo': 995.5, 'Cuenta gastos': 1016.1, 'Cuenta ahorro': 0, 'Hucha Canadá': 40, total: 2051.6, colchon: 17 } };
  }
  function plan(rutina, fecha) {
    const r = rutina || rutinaHoy || 'Empuje';
    return { ok: true, fecha: fecha || today, rutina: r, rutinas: Object.keys(RUT), rutinaHoy, sonido: true,
      ejercicios: RUT[r].map((e, k) => {
        const hechas = logged.filter((l) => l.ejercicio === e[0]).map((l) => ({ row: l.row, serie: l.serie, kg: l.kg, reps: l.reps }));
        const last = e[7] == null ? null : { fecha: '2026-10-06', sets: Array.from({ length: e[2] }, () => ({ kg: e[7], reps: k === 0 ? e[4] : e[3] + 1 })), kg: e[7], subir: k === 0 };
        return { rutina: r, dia: DAYOF[r], orden: k + 1, ejercicio: e[0], tipo: e[1], series: e[2], repsMin: e[3], repsMax: e[4], descanso: e[5], salto: e[6],
          sustituto: e[8], tecnica: e[9], last, record: e[7] == null ? null : e[7] + (k === 0 ? 2.5 : 0), sugerido: e[7] == null ? null : e[7] + (k === 0 ? e[6] : 0), hechas };
      }) };
  }
  return function (action, p) {
    return new Promise((res) => setTimeout(() => {
      if (action === 'ping') return res(p.pin === '1212' ? { ok: true, nombre: 'Laura' } : { ok: false, badPin: true, error: 'PIN incorrecto (en la demo es 1212)' });
      if (action === 'today') return res(todayResp(p.fecha));
      if (action === 'setHabit') { vals[p.i] = p.value; return res(todayResp(p.fecha)); }
      if (action === 'setField') { if (p.field === 'curso') curso = p.value; return res(todayResp(p.fecha)); }
      if (action === 'meta') return res(meta());
      if (action === 'addMove') {
        const m = { row: nextRow++, fecha: p.fecha || today, concepto: p.concepto || p.categoria || 'Traspaso', categoria: p.tipo === 'Traspaso' ? 'Traspaso' : p.categoria, importe: Number(p.importe), cuenta: p.cuenta, destino: p.destino || '', tipo: p.tipo };
        moves.push(m);
        return res(Object.assign(meta(), { row: m.row, money: money(), categoria: p.tipo === 'Gasto' ? { nombre: p.categoria, gastado: 9 + m.importe, limite: 20, queda: 11 - m.importe } : undefined }));
      }
      if (action === 'deleteMove') { const k = moves.findIndex((m) => m.row === p.row); if (k >= 0) moves.splice(k, 1); return res(meta()); }
      if (action === 'vision') return res({ ok: true, identidad: 'Soy una persona sana que se cuida, entrena y estudia para sacar lo mejor de sí misma, y ahorra para su futuro.', year: 0.05, folderOk: true,
        cards: [['Estudios', 'Estudio con foco: cada tema bien hecho suma.', 'Media de 9 en el curso', '', '9', null], ['Carrera', 'Construyo mi futuro en datos, una certificación cada vez.', 'Prácticas para junio', '1', '9', 0.11],
          ['Empleable', 'Un currículum que abra puertas.', 'Tener un buen currículum', '1', '8', 0.13], ['Cuerpo', 'Cada entrenamiento suma. Me cuido para sentirme bien.', 'Mejorar mi forma física', '89%', '85%', 1],
          ['Disfrutar', 'Disfruto el camino: también es parte del plan.', 'Disfrutar mientras hago todo esto', '4,0', '4,0', 1], ['Canadá', 'Me permito soñar en grande y me lo gano paso a paso.', 'Volver a Canadá, pagado por mí', '40,00 €', '1.200,00 €', 0.03],
          ['Sueños', 'Mi futuro, a mi manera: mi casa, mi estilo, mis viajes.', 'Galería de inspiración (sin meta)', '', '', null]]
          .map(([area, frase, meta, actual, objetivo, progreso], k) => ({ area, frase, meta, actual, objetivo, progreso: k === 0 ? 0 : progreso, fecha: '', como: '', images: [] })) });
      if (action === 'gymPlan') return res(plan(p.rutina, p.fecha));
      if (action === 'logSet') { const row = nextRow++; logged.push({ row, ejercicio: p.ejercicio, serie: p.serie, kg: p.kg, reps: p.reps }); return res({ ok: true, row, record: p.kg != null && p.serie === 1 && /banca|Sentadilla|muerto/.test(p.ejercicio) }); }
      if (action === 'deleteSet') { const k = logged.findIndex((l) => l.row === p.row); if (k >= 0) logged.splice(k, 1); return res({ ok: true }); }
      if (action === 'calSync') return res({ ok: true, creados: 0, borrados: 0, eventos: 42, pendientes: 0, calendario: { on: true, last: new Date().toISOString(), nombre: 'Laura 26/27', error: '' } });
      if (action === 'estudios') return res(est());
      if (action === 'addTask') { if (!String(p.tarea || '').trim()) return res({ ok: false, error: 'Escribe la tarea' }); const t = { row: tRow++, asignatura: p.asignatura || '', tarea: p.tarea, tipo: p.tipo, fecha: p.fecha || '', prioridad: p.prioridad, hecha: false, notas: p.notas || '' }; tareas.push(t); return res({ ok: true, row: t.row, tareas: tareas.slice() }); }
      if (action === 'updateTask') { const t = tareas.find((x) => x.row === Number(p.row)); if (!t) return res({ ok: false, error: 'Esa tarea ya no existe' }); Object.assign(t, p.fields); return res({ ok: true, tareas: tareas.slice() }); }
      if (action === 'deleteTask') { const k = tareas.findIndex((x) => x.row === Number(p.row)); if (k >= 0) tareas.splice(k, 1); return res({ ok: true, tareas: tareas.slice() }); }
      if (action === 'updateStudy') {
        const list = { cert: certs, asig: asigs, plan: planP, cv: cvL }[p.kind]; const it = list && list.find((x) => x.row === Number(p.row));
        if (!it) return res({ ok: false, error: 'Fila no válida' });
        Object.keys(p.fields).forEach((k) => { const v = p.fields[k]; it[k] = ['total', 'hechos', 'objetivo', 'final'].includes(k) ? (v === '' || v == null ? null : Number(String(v).replace(',', '.'))) : v; });
        return res(est());
      }
      res({ ok: false, error: 'Acción no disponible en la demo' });
    }, 250));
  };
})();
