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
  let modRow = 5;
  const mods = [['Statistics and Machine Learning', '2026-10-04', true], ['Fundamental Statistical Concepts', '2026-10-11', false], ['Explanatory Modeling Using Linear Regression', '2026-10-18', false], ['Predictive Modeling Using Logistic Regression', '2026-10-25', false], ['Statistical Foundations of Machine Learning', '2026-11-01', false]]
    .map(([nombre, objetivo, hecho], k) => ({ row: modRow++, cert: 'SAS', orden: k + 1, nombre, objetivo, hecho, fechaHecho: hecho ? addD(-1) : '', notas: '' }));
  const certs = [['SAS Certified Associate: Applied Statistics for ML', 'SAS', null, null, '2026-11-08', 'En curso', 2.5, '2026-11-23'], ['Microsoft DP-900 · Azure Data Fundamentals', 'DP-900', 12, 3, '2026-12-12', 'Pendiente', 13.5, ''], ['Claude (Anthropic) · certificación', 'Claude', null, null, '', 'Pendiente', 0, '']]
    .map(([nombre, codigo, total, hechos, objetivo, estado, horas, examen], k) => ({ row: 7 + k, nombre, codigo, total, hechos, progreso: null, objetivo, examen, estado, horas, notas: k === 0 ? 'Práctica el 8 nov · examen 23 nov' : '', notebook: '' }));
  const withMods = () => certs.map((c) => Object.assign(c, { modulos: mods.filter((m) => m.cert === c.codigo).sort((a, b) => a.orden - b.orden) }));
  const mk = (r0, list) => list.map(([tarea, fecha], k) => ({ row: r0 + k, tarea, fecha, estado: 'Pendiente', notas: '' }));
  const planP = mk(35, [['Actualizar CV (1 página, con proyectos y certificaciones)', '2026-10-31'], ['LinkedIn completo: foto, titular, extracto y certificaciones', '2026-11-15'], ['Lista de 15 empresas donde me gustaría hacer prácticas', '2026-12-15'], ['Enviar al menos 10 candidaturas', '2027-03-15']]);
  const cvL = mk(48, [['Certificación DP-900', '2026-11-15'], ['CV de 1 página actualizado', '2026-10-31'], ['Portfolio: 3 proyectos en GitHub', '2027-02-28']]);
  const soonT = (f) => tareas.filter((t) => !t.hecha && t.fecha && t.fecha <= addD(1)).sort((a, b) => (a.fecha < b.fecha ? -1 : 1));
  const est = () => ({ ok: true, hoy: today, certs: withMods(), asignaturas: asigs, plan: planP, cv: cvL, media: null, practicas: '2027-06-01', tareas: tareas.slice(), tipos: [] });

  const mondayOf = (f) => { const [y, m, d] = f.split('-').map(Number); const dt = new Date(y, m - 1, d); dt.setDate(dt.getDate() - ((dt.getDay() + 6) % 7)); return iso(dt); };
  let rrow = 5;
  const recetas = [
    ['Overnight oats con yogur griego y frutos rojos', 'Desayuno', 5, 1, 22, 0.9, 'rápida', '50 g · copos de avena\n170 g · yogur griego natural\n100 ml · leche\n80 g · frutos rojos', 'Mezcla todo en un tarro la noche antes.\nA la nevera.'],
    ['Bowl de pollo, arroz y verduras al horno', 'Comida / tupper', 35, 3, 38, 1.9, 'tupper, batch', '450 g · pechuga de pollo\n200 g · arroz (en crudo)\n1 · calabacín\n1 · pimiento rojo\n2 cdas · aceite de oliva', 'Horno a 200 °C.\nPollo y verduras 25 min.\nCuece el arroz.\nReparte en 3 tuppers.'],
    ['Lentejas estofadas con verduras y huevo duro', 'Comida / tupper', 40, 3, 24, 1.1, 'tupper, batch', '250 g · lentejas pardinas\n1 · zanahoria\n1 · cebolla\n3 · huevos', 'Sofríe la verdura.\nAñade lentejas y agua.\nCuece 30 min.'],
    ['Pasta integral con atún, tomate y espinacas', 'Comida / tupper', 15, 2, 30, 1.3, 'rápida', '160 g · pasta integral\n2 latas · atún al natural\n300 g · tomate triturado', 'Cuece la pasta.\nSofríe y mezcla.'],
    ['Tortilla de claras con espinacas y queso', 'Cena', 10, 1, 26, 1.2, 'cena rápida', '200 ml · claras de huevo\n1 · huevo\n1 puñado · espinacas', 'Saltea las espinacas.\nCuaja las claras.'],
    ['Salmón al horno con patata y brócoli', 'Cena', 30, 1, 30, 3, 'omega 3', '150 g · lomo de salmón\n1 · patata mediana\n150 g · brócoli', 'Horno 200 °C 25 min.'],
    ['Batido post-gym de plátano y cacahuete', 'Snack / pre-post gym', 5, 1, 25, 0.9, 'post-gym', '250 ml · leche\n1 · plátano\n1 cda · crema de cacahuete', 'Tritura todo.']
  ].map(([nombre, tipo, min, raciones, proteina, precio, etiquetas, ingredientes, pasos]) => ({ row: rrow++, nombre, tipo, min, raciones, proteina, precio, etiquetas, ingredientes, pasos, enlace: '', estrellas: nombre.startsWith('Bowl') ? 5 : null, notas: '' }));
  let mrow = 5;
  const semana0 = mondayOf(today);
  const menu = [['Lunes', 'Comida', 1], ['Martes', 'Comida', 2], ['Miércoles', 'Comida', 1], ['Jueves', 'Comida', 3], ['Viernes', 'Comida', 2], ['Lunes', 'Cena', 4], ['Martes', 'Cena', 5]]
    .map(([dia, momento, k]) => ({ row: mrow++, semana: semana0, dia, momento, receta: recetas[k].nombre, tupper: momento === 'Comida' ? 'Sí' : 'No' }));
  const menuOf = (sem) => menu.filter((m) => m.semana === sem);
  let brow = 6;
  const libros = [['Hábitos atómicos', 'James Clear', 'ES', '', 336, 232, 'Leyendo'], ['Storytelling with Data', 'Cole Nussbaumer Knaflic', 'EN', '9781119002253', 288, 0, 'Por leer'], ['La psicología del dinero', 'Morgan Housel', 'ES', '', 272, 0, 'Por leer'], ['Hyperfocus', 'Chris Bailey', 'EN', '9780525522232', 288, 0, 'Por leer'], ['Start with Why', 'Simon Sinek', 'EN', '9781591846444', 256, 0, 'Por leer']]
    .map(([titulo, autor, idioma, isbn, paginas, pagina, estado], k) => ({ row: brow++, orden: k + 1, titulo, autor, idioma, isbn, paginas, pagina, estado, categoria: '', inicio: '', fin: '', estrellas: null, notas: '', portada: '' }));
  let prow = 5;
  const pods = [['Acquired', 'EN', 'Historias de grandes empresas', 'Escuchando', 4], ['Kaizen', 'ES', 'Desarrollo personal y finanzas', 'Por escuchar', 0], ['Hard Fork', 'EN', 'Tecnología e IA', 'Por escuchar', 0], ['The AI Daily Brief', 'EN', 'Noticias de IA', 'Dejado', 2]]
    .map(([nombre, idioma, tema, estado, episodios]) => ({ row: prow++, nombre, idioma, tema, estado, episodios, actual: '', ideas: '', enlace: '' }));
  const bib = () => ({ ok: true, libros: libros.slice(), podcasts: pods.slice(), reto: 12, paginasTotal: 1101, hoy: today });
  let wrow = 6;
  const deseos = [[addD(-3), 'Zapatillas de pádel', 59.9, 'Alta', 'Pendiente'], [addD(0), 'Funda del iPad', 19.99, 'Media', 'Pendiente'], [addD(-10), 'Sudadera', 35, 'Baja', 'Descartado']]
    .map(([añadido, cosa, precio, prioridad, estado]) => ({ row: wrow++, añadido, cosa, precio, prioridad, enlace: '', nota: '', estado, decidido: estado === 'Pendiente' ? '' : addD(-8) }));
  const des = () => ({ ok: true, items: deseos.slice(), pendiente: deseos.filter((x) => x.estado === 'Pendiente').reduce((a, x) => a + (x.precio || 0), 0), ahorrado: deseos.filter((x) => x.estado === 'Descartado').reduce((a, x) => a + (x.precio || 0), 0), hoy: today });
  let arow = 5;
  const acts = [{ row: arow++, fecha: addD(-2), actividad: 'Pádel', minutos: 60, notas: '' }];
  const actividades = () => ({ recientes: acts.slice().sort((a, b) => (a.fecha < b.fecha ? 1 : -1)), meses: ['Oct 2026', 'Nov 2026', 'Dic 2026'].map((mes, k) => ({ mes, padel: k === 0 ? acts.filter((a) => a.actividad === 'Pádel').length : 0, futbol: k === 0 ? acts.filter((a) => a.actividad === 'Fútbol').length : 0, clases: 0, minutos: k === 0 ? acts.reduce((x, a) => x + a.minutos, 0) : 0 })), actual: 0 });
  const revs = {};
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
      money: money(), sonido: true, tareas: soonT(), menuHoy: menuOf(mondayOf(today)).filter((m) => m.dia === ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][new Date().getDay()])
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
      if (action === 'ping') return res(p.pin === '0000' ? { ok: true, nombre: 'Laura' } : { ok: false, badPin: true, error: 'PIN incorrecto (en la demo es 0000)' });
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
      if (action === 'dinero') {
        const mi = p.mes === '' || p.mes == null ? 0 : Number(p.mes);
        const meses = ['Oct 2026', 'Nov 2026', 'Dic 2026', 'Ene 2027', 'Feb 2027', 'Mar 2027', 'Abr 2027', 'May 2027', 'Jun 2027', 'Jul 2027', 'Ago 2027', 'Sep 2027'];
        const cats = [['Gimnasio', 'Fijo', 37.9, 37.9], ['Suscripciones', 'Fijo', 8.98, 2.99], ['Comida fuera y cafés', 'Variable', 17.4, 20], ['Ocio y planes', 'Variable', 24.5, 20], ['Ropa y compras', 'Variable', 0, 10], ['Transporte', 'Variable', 3, 5], ['Deporte extra (pádel)', 'Variable', 5, 10]].map(([nombre, tipo, gastado, limite]) => ({ nombre, tipo, gastado: gastado * (1 - mi * 0.2), limite }));
        const g = cats.reduce((a, c) => a + c.gastado, 0);
        const m = meta();
        return res({ ok: true, mes: mi, meses, actual: 0, hoy: today, categorias: cats, gastado: g, limite: 120.89, queda: 120.89 - g, ingresos: [{ nombre: 'Trabajos puntuales', importe: 60 }], totalIngresos: 60, resultado: 60 - g, ahorro: 30, diasSinGastar: 12,
          serie: meses.map((x, k) => ({ mes: x, gastado: k <= 2 ? [96.8, 131.4, 88.2][k] : null, limite: k === 2 ? 150.89 : 120.89, total: null })), movimientos: m.recientes, saldos: m.saldos, cuentas: m.cuentas, categoriasGasto: m.categorias, hucha: { saldo: 40, meta: 1200, aportacion: 40 } });
      }
      if (action === 'fixBalance') return res({ ok: false, error: 'En la demo no se corrigen saldos' });
      if (action === 'progreso') {
        const n = 40, rnd = (k, i) => ((k * 7 + i * 13) % 10) / 10;
        const habits = defs.map((d, k) => { const i = k + 1; let done = ''; for (let j = 0; j < n; j++) done += rnd(j, i) < (i <= 10 ? 0.75 : 0.5) ? '1' : '0'; return { i, name: d[0], freq: d[3], veces: d[4], activo: d[6], nivel: d[5], meta: d[2], type: d[1], done, streak: 3, best: 9 }; });
        const nums = { 2: Array.from({ length: n }, (_, j) => 20 + (j % 4) * 10), 7: Array.from({ length: n }, (_, j) => 6.5 + (j % 4) * 0.5), 8: Array.from({ length: n }, (_, j) => 90 + (j % 5) * 12), 9: Array.from({ length: n }, (_, j) => (j % 3) * 8), 10: Array.from({ length: n }, (_, j) => 6000 + (j % 6) * 1100) };
        return res({ ok: true, inicio: '2026-10-01', hoy: '2026-11-09', dias: n, habits, nums, actividades: actividades() });
      }
      if (action === 'cocina') { const sem = p.semana ? mondayOf(p.semana) : semana0; return res({ ok: true, semana: sem, hoy: today, recetas: recetas.slice(), menu: menuOf(sem), tipos: ['Desayuno', 'Comida / tupper', 'Cena', 'Snack / pre-post gym'], momentos: ['Desayuno', 'Comida', 'Cena', 'Snack'] }); }
      if (action === 'setMenu') { const k = menu.findIndex((m) => m.semana === p.semana && m.dia === p.dia && m.momento === p.momento); if (k >= 0) menu.splice(k, 1); if (p.receta) menu.push({ row: mrow++, semana: p.semana, dia: p.dia, momento: p.momento, receta: p.receta, tupper: '' }); return res({ ok: true, semana: p.semana, menu: menuOf(p.semana) }); }
      if (action === 'addRecipe') { recetas.push({ row: rrow++, nombre: p.nombre, tipo: p.tipo, min: Number(p.min) || null, raciones: Number(p.raciones) || 1, proteina: Number(p.proteina) || null, precio: null, etiquetas: '', ingredientes: p.ingredientes || '', pasos: p.pasos || '', enlace: '', estrellas: null, notas: '' }); return res({ ok: true, recetas: recetas.slice() }); }
      if (action === 'updateRecipe') { const r = recetas.find((x) => x.row === Number(p.row)); Object.assign(r, p.fields); return res({ ok: true, recetas: recetas.slice() }); }
      if (action === 'biblioteca') return res(bib());
      if (action === 'addBook') { libros.push({ row: brow++, orden: libros.length + 1, titulo: p.titulo, autor: p.autor || '', idioma: p.idioma, isbn: String(p.isbn || '').replace(/\D/g, ''), paginas: Number(p.paginas) || null, pagina: 0, estado: p.estado || 'Por leer', categoria: p.categoria || '', inicio: '', fin: '', estrellas: null, notas: '', portada: '' }); return res(bib()); }
      if (action === 'updateBook') { const b = libros.find((x) => x.row === Number(p.row)); const f = p.fields; let terminado = false;
        if ('paginas' in f) b.paginas = Number(f.paginas) || null; if ('pagina' in f) { b.pagina = Math.min(b.paginas || 1e9, Number(f.pagina) || 0); if (b.pagina > 0 && b.estado === 'Por leer') b.estado = 'Leyendo'; if (b.paginas && b.pagina >= b.paginas && b.estado !== 'Terminado') f.estado = 'Terminado'; }
        if ('estado' in f) { if (f.estado === 'Terminado' && b.estado !== 'Terminado') { terminado = true; b.fin = today; } b.estado = f.estado; }
        ['estrellas', 'notas', 'portada', 'isbn'].forEach((k) => { if (k in f) b[k] = k === 'estrellas' ? (Number(f[k]) || null) : f[k]; });
        return res(Object.assign(bib(), { terminado })); }
      if (action === 'addPodcast') { pods.push({ row: prow++, nombre: p.nombre, idioma: p.idioma, tema: p.tema || '', estado: p.estado, episodios: 0, actual: '', ideas: '', enlace: p.enlace || '' }); return res(bib()); }
      if (action === 'updatePodcast') { const x = pods.find((y) => y.row === Number(p.row)); Object.keys(p.fields).forEach((k) => { x[k] = k === 'episodios' ? Number(p.fields[k]) || 0 : p.fields[k]; }); return res(bib()); }
      if (action === 'deseos') return res(des());
      if (action === 'addDeseo') { deseos.push({ row: wrow++, añadido: today, cosa: p.cosa, precio: p.precio === '' ? null : Number(String(p.precio).replace(',', '.')), prioridad: p.prioridad, enlace: p.enlace || '', nota: p.nota || '', estado: 'Pendiente', decidido: '' }); return res(des()); }
      if (action === 'updateDeseo') { const x = deseos.find((y) => y.row === Number(p.row)); if (p.fields.estado) { x.estado = p.fields.estado; x.decidido = today; } return res(des()); }
      if (action === 'deleteDeseo') { const k = deseos.findIndex((y) => y.row === Number(p.row)); deseos.splice(k, 1); return res(des()); }
      if (action === 'addActividad') { acts.push({ row: arow++, fecha: today, actividad: p.actividad, minutos: p.actividad === 'Fútbol' ? 90 : 60, notas: '' }); return res({ ok: true, actividades: actividades() }); }
      if (action === 'deleteActividad') { const k = acts.findIndex((a) => a.row === Number(p.row)); acts.splice(k, 1); return res({ ok: true, actividades: actividades() }); }
      if (action === 'revision' || action === 'saveRevision') {
        const sem = p.semana ? mondayOf(p.semana) : mondayOf(new Date().getDay() >= 1 && new Date().getDay() <= 2 ? addD(-7) : today);
        if (action === 'saveRevision') revs[sem] = Object.assign({}, revs[sem], p.fields);
        const rv = revs[sem] || {};
        const [y, m, d] = sem.split('-').map(Number); const fin = iso(new Date(y, m - 1, d + 6));
        return res({ ok: true, semana: sem, fin, hoy: today, row: 5, dias: 7, auto: { pct: 0.71, entrenos: 3, gastado: 38.4, paginas: 74, horasCurso: 3.5 },
          disfrute: rv.disfrute ? Number(rv.disfrute) : null, bien: rv.bien || '', mejorar: rv.mejorar || '', prioridades: rv.prioridades || '',
          habitos: defs.filter((x) => x[6]).map((x, k) => ({ name: x[0], freq: x[3], veces: x[4], hechos: [7, 5, 6, 7, 4, 5, 3, 6, 5, 2, 3, 1, 1, 0, 0][k] || 0 })),
          nums: { 7: { media: 7.2 }, 10: { media: 8120 }, 8: { media: 104 }, 9: { total: 74 }, 2: { total: 210 } }, ingresos: 0, topCats: [{ cat: 'Comida fuera y cafés', importe: 17.4 }, { cat: 'Ocio y planes', importe: 12 }],
          dineroMes: money(), hechasSemana: ['Cuestionario tema 1 (Data Google)'], atrasadas: ['Instalar SAS OnDemand · ' + addD(-1)], proximas: tareas.filter((t) => !t.hecha && t.fecha > today).map((t) => t.tarea + ' · ' + t.fecha),
          examenes: ['Big Data II · ' + addD(12)], certs: ['DP-900: 3/12 módulos · En curso', 'Claude: sin empezar · Pendiente'], leyendo: ['Hábitos atómicos · pág. 232/336'], actividades: acts.map((a) => a.actividad),
          medida: { mes: 'Oct 2026', mi: 0, fecha: '', peso: null, sentir: rv.sentir || null, notas: '' }, identidad: 'Soy una persona sana que se cuida, entrena y estudia para sacar lo mejor de sí misma, y ahorra para su futuro.' });
      }
      if (action === 'setMedida') { const sem = mondayOf(today); revs[sem] = Object.assign({}, revs[sem], { sentir: Number(p.fields.sentir) }); return res({ ok: true }); }
      if (action === 'addModule') { mods.push({ row: modRow++, cert: p.cert, orden: mods.filter((m) => m.cert === p.cert).length + 1, nombre: p.nombre, objetivo: p.objetivo || '', hecho: false, fechaHecho: '', notas: p.notas || '' }); return res(est()); }
      if (action === 'updateModule') { const m = mods.find((x) => x.row === Number(p.row)); if (!m) return res({ ok: false, error: 'Ese módulo ya no existe' }); Object.assign(m, p.fields); if ('hecho' in p.fields) m.fechaHecho = p.fields.hecho ? today : ''; return res(est()); }
      if (action === 'deleteModule') { const k = mods.findIndex((x) => x.row === Number(p.row)); if (k >= 0) mods.splice(k, 1); return res(est()); }
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
