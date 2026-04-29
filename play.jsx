
/* ============================================================
   TRIB & TRIP — EL JUEGO DE LA TRIBU (PRO · Escalable)
   - 3 fases progresivas (10 / 20 / 30)
   - 8 energías (Fuego, Viento, Piedra, Raíz, Agua, Sol, Luna, Nieve)
   - Perfil híbrido si top1-top2 <= 2 puntos
   - Núcleo tribal: 2 energías clave (equilibrio) + ampliación sugerida
   - Pasaporte final descargable (en bloque 3)
   ============================================================ */

const { useEffect, useMemo, useRef, useState } = React;

/* ---------------------------
   Marca TRIB & TRIP
---------------------------- */

const BRAND = {
  colors: {
    verde: "#4F5F3E", // Verde Tierra
    arena: "#EFE9DD",
    carbon: "#2B2B2B",
    ocre: "#C3A76B",
    blanco: "#FFFFFF",
  },
  fonts: {
    title: "DM Sans, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    body: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  },
  tagline: "Ser dueño de ti mismo.",
};

/* ---------------------------
   Fases (nombres cerrados)
---------------------------- */
const PHASES = [
  {
    key: "sendero",
    title: "Sendero",
    subtitle:
      "Empezamos por lo esencial: tu energía base. Cómo sueles moverte cuando viajas y convives.",
    icon: "🌱",
    total: 10,
  },
  {
    key: "fogata",
    title: "La Fogata",
    subtitle:
      "Aquí vemos tu impacto en grupo: ritmo, convivencia, cómo sostienes (o te sostienen).",
    icon: "🔥",
    total: 20,
  },
  {
    key: "identidad",
    title: "Tu Identidad Tribal",
    subtitle: "Quién eres cuando estás en tribu y con quién encajas de verdad.",
    icon: "🧭",
    total: 30,
  },
];

/* ---------------------------
   Energías (8)
---------------------------- */
const ENERGIES = [
  { key: "FUEGO", name: "Fuego", icon: "🔥", accent: BRAND.colors.ocre },
  { key: "VIENTO", name: "Viento", icon: "🌬️", accent: BRAND.colors.ocre },
  { key: "PIEDRA", name: "Piedra", icon: "🪨", accent: BRAND.colors.ocre },
  { key: "RAIZ", name: "Raíz", icon: "🌿", accent: BRAND.colors.ocre },
  { key: "AGUA", name: "Agua", icon: "💧", accent: BRAND.colors.ocre },
  { key: "SOL", name: "Sol", icon: "☀️", accent: BRAND.colors.ocre },
  { key: "LUNA", name: "Luna", icon: "🌙", accent: BRAND.colors.ocre },
  { key: "NIEVE", name: "Nieve", icon: "❄️", accent: BRAND.colors.ocre },
];

const energyByKey = Object.fromEntries(ENERGIES.map((e) => [e.key, e]));

/* ---------------------------
   Definición completa energías (humana)
---------------------------- */
const ENERGY_DEFS = {
  FUEGO: {
    essence: "Impulso, acción, energía social.",
    tribeRole: "Activa, empuja y enciende la experiencia.",
    gifts: ["Movimiento", "Decisión", "Energía colectiva"],
    shadow: "Puede ir demasiado rápido, saturar o quemarse.",
    balancesWith: ["PIEDRA", "RAIZ"],
    boostsWith: ["SOL", "VIENTO"],
    frictionWith: ["NIEVE"],
  },
  VIENTO: {
    essence: "Exploración, cambio, curiosidad.",
    tribeRole: "Abre caminos y trae aire nuevo.",
    gifts: ["Ideas nuevas", "Flexibilidad", "Movimiento"],
    shadow: "Puede dispersarse o perder foco.",
    balancesWith: ["PIEDRA", "NIEVE"],
    boostsWith: ["FUEGO", "SOL"],
    frictionWith: ["RAIZ"],
  },
  PIEDRA: {
    essence: "Estructura, orden, seguridad.",
    tribeRole: "Da estabilidad logística y calma práctica.",
    gifts: ["Planificación", "Claridad", "Protección"],
    shadow: "Puede volverse rígida o controladora.",
    balancesWith: ["VIENTO", "FUEGO"],
    boostsWith: ["RAIZ"],
    frictionWith: ["FUEGO"],
  },
  RAIZ: {
    essence: "Estabilidad emocional, paciencia.",
    tribeRole: "Sostiene el ritmo y la presencia del grupo.",
    gifts: ["Constancia", "Calma profunda", "Seguridad emocional"],
    shadow: "Puede resistirse al cambio o volverse pasiva.",
    balancesWith: ["VIENTO", "FUEGO"],
    boostsWith: ["PIEDRA", "LUNA"],
    frictionWith: ["SOL"],
  },
  AGUA: {
    essence: "Empatía, vínculo, armonía.",
    tribeRole: "Teje confianza y cuida el clima emocional.",
    gifts: ["Escucha", "Cuidado", "Armonía"],
    shadow: "Puede cargarse de más o evitar conflictos necesarios.",
    balancesWith: ["NIEVE", "PIEDRA"],
    boostsWith: ["SOL"],
    frictionWith: ["FUEGO"],
  },
  SOL: {
    essence: "Motivación, optimismo, liderazgo.",
    tribeRole: "Inspira y eleva cuando el grupo baja.",
    gifts: ["Confianza", "Dirección", "Energía positiva"],
    shadow: "Puede negar emociones difíciles o empujar de más.",
    balancesWith: ["LUNA", "NIEVE"],
    boostsWith: ["FUEGO"],
    frictionWith: ["RAIZ"],
  },
  LUNA: {
    essence: "Profundidad, introspección, mirada interna.",
    tribeRole: "Da significado y calma consciente.",
    gifts: ["Reflexión", "Perspectiva", "Silencio útil"],
    shadow: "Puede aislarse o dudar demasiado.",
    balancesWith: ["SOL", "FUEGO"],
    boostsWith: ["RAIZ"],
    frictionWith: ["VIENTO"],
  },
  NIEVE: {
    essence: "Contención estratégica, objetividad, límites sanos.",
    tribeRole: "Regula, enfría cuando toca y protege con claridad.",
    gifts: ["Claridad mental", "Límites sanos", "Decisiones frías"],
    shadow: "Puede parecer distante o fría si no comunica.",
    balancesWith: ["AGUA", "SOL"],
    boostsWith: ["PIEDRA"],
    frictionWith: ["FUEGO"],
  },
};

/* ---------------------------
   Núcleo tribal (2 claves) + ampliación
   (Cada energía tiene 2 “equilibradoras” + 2 sugeridas para crecer)
---------------------------- */
const TRIBE_BLUEPRINT = {
  FUEGO: {
    core: ["NIEVE", "AGUA"],
    expand: ["PIEDRA", "RAIZ"],
    mirrorNote:
      "Dos Fuegos pueden ser magia… si hay alguien que regule el ritmo (Nieve o Raíz).",
  },
  VIENTO: {
    core: ["PIEDRA", "NIEVE"],
    expand: ["AGUA", "SOL"],
    mirrorNote:
      "Dos Vientos juntos pueden ser aventura total… si no se pierde el foco (Piedra ayuda).",
  },
  PIEDRA: {
    core: ["FUEGO", "AGUA"],
    expand: ["RAIZ", "SOL"],
    mirrorNote:
      "Dos Piedras dan mucha estabilidad… y pueden necesitar aire nuevo (Viento o Sol).",
  },
  RAIZ: {
    core: ["VIENTO", "SOL"],
    expand: ["PIEDRA", "LUNA"],
    mirrorNote:
      "Dos Raíces pueden crear paz real… y quizá necesiten un impulso (Fuego o Sol).",
  },
  AGUA: {
    core: ["NIEVE", "PIEDRA"],
    expand: ["SOL", "RAIZ"],
    mirrorNote:
      "Dos Aguas pueden sentirse como casa… pero necesitan límites claros (Nieve ayuda).",
  },
  SOL: {
    core: ["LUNA", "NIEVE"],
    expand: ["AGUA", "PIEDRA"],
    mirrorNote:
      "Dos Soles levantan cualquier viaje… si también hay pausa (Luna) y límites (Nieve).",
  },
  LUNA: {
    core: ["SOL", "RAIZ"],
    expand: ["AGUA", "PIEDRA"],
    mirrorNote:
      "Dos Lunas se entienden sin hablar… y pueden necesitar chispa (Sol o Fuego).",
  },
  NIEVE: {
    core: ["AGUA", "SOL"],
    expand: ["PIEDRA", "RAIZ"],
    mirrorNote:
      "Dos Nieves pueden ser claridad total… si recuerdan ablandar con empatía (Agua).",
  },
};

/* ---------------------------
   Preguntas (30) — diseñadas para que:
   - 10 primeras = base
   - 10 siguientes = convivencia/ritmo
   - 10 últimas = precisión (cierre)
   Cada energía aparece de forma equilibrada a lo largo.
---------------------------- */
const QUESTIONS = [
  // --- 1..10 (Sendero)
  { energy: "VIENTO", text: "Me emociona improvisar y descubrir planes sobre la marcha." },
  { energy: "PIEDRA", text: "Me siento mejor cuando tengo claro lo básico: horarios, rutas o reservas." },
  { energy: "FUEGO", text: "Me sale natural activar al grupo y proponer cosas." },
  { energy: "AGUA", text: "Me importa que el ambiente sea agradable y nadie se quede fuera." },
  { energy: "RAIZ", text: "Necesito momentos de calma para sostener mi energía durante el viaje." },
  { energy: "SOL", text: "Me gusta contagiar motivación cuando el grupo se viene abajo." },
  { energy: "LUNA", text: "Observo detalles y me gusta darle significado a lo que vivo." },
  { energy: "NIEVE", text: "Si algo no me cuadra, prefiero parar y decidir con cabeza fría." },
  { energy: "VIENTO", text: "Disfruto cuando el camino me sorprende y me saca de lo conocido." },
  { energy: "PIEDRA", text: "Me tranquiliza anticipar imprevistos antes de que aparezcan." },

  // --- 11..20 (La Fogata)
  { energy: "AGUA", text: "Soy de quien escucha y ayuda a que las personas se entiendan." },
  { energy: "FUEGO", text: "Si hay que decidir rápido, suelo tirar para adelante." },
  { energy: "NIEVE", text: "Pongo límites cuando toca, aunque no sea lo más cómodo." },
  { energy: "SOL", text: "Me sale ser el ánimo del grupo, incluso en días malos." },
  { energy: "LUNA", text: "Necesito silencio para procesar y no saturarme." },
  { energy: "RAIZ", text: "Mantengo el rumbo emocional incluso si todo cambia." },
  { energy: "PIEDRA", text: "Me gusta organizar para que el grupo esté seguro y sin estrés." },
  { energy: "VIENTO", text: "Me aburro si todo está demasiado cerrado y sin margen." },
  { energy: "AGUA", text: "Me afecta el mal rollo; intento suavizar tensiones antes de que crezcan." },
  { energy: "NIEVE", text: "Si el grupo se acelera, me sale bajar el ritmo con claridad." },

  // --- 21..30 (Tu Identidad Tribal)
  { energy: "FUEGO", text: "Me siento mejor cuando hay acción, aunque sea sencilla." },
  { energy: "SOL", text: "Soy capaz de motivar sin imponer, desde lo humano." },
  { energy: "LUNA", text: "Prefiero profundidad y calidad antes que cantidad de planes." },
  { energy: "RAIZ", text: "Puedo sostener a otras personas sin perderme a mí." },
  { energy: "PIEDRA", text: "Cuando todo es caos, yo pongo estructura para que respire." },
  { energy: "VIENTO", text: "Si tengo libertad, doy lo mejor; si me encierran, me apago." },
  { energy: "NIEVE", text: "Me resulta fácil ver lo que no funciona y proponer un ajuste." },
  { energy: "AGUA", text: "Sé cuidar sin cargarme: acompaño, pero también me protejo." },
  { energy: "LUNA", text: "Me gusta cerrar etapas con reflexión: aprender de lo vivido." },
  { energy: "RAIZ", text: "Aunque el viaje sea intenso, vuelvo a mi centro cuando lo necesito." },
];

/* ---------------------------
   Helpers
---------------------------- */
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function formatDniTribal() {
  // TRB-YYYYMMDD-HHMM-XXXX (sin backend)
  const d = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TRB-${y}${m}${day}-${hh}${mm}-${rand}`;
}

function computeScores(answers) {
  // answers: { [questionIndex]: 1..5 }
  const scores = Object.fromEntries(ENERGIES.map((e) => [e.key, 0]));
  const counts = Object.fromEntries(ENERGIES.map((e) => [e.key, 0]));

  Object.entries(answers).forEach(([idxStr, val]) => {
    const idx = Number(idxStr);
    const q = QUESTIONS[idx];
    if (!q) return;
    scores[q.energy] += Number(val);
    counts[q.energy] += 1;
  });

  // normalizamos a 0..100 (por energía)
  const pct = {};
  for (const e of ENERGIES) {
    const max = (counts[e.key] || 1) * 5;

     
    const raw = scores[e.key];
    pct[e.key] = Math.round((raw / max) * 100);
  }

  return { raw: scores, counts, pct };
}

function topEnergies(pct) {
  const arr = Object.entries(pct).sort((a, b) => b[1] - a[1]);
  const [top1, top2, top3] = arr;
  return {
    primary: top1?.[0],
    secondary: top2?.[0],
    third: top3?.[0],
    diff12: (top1?.[1] ?? 0) - (top2?.[1] ?? 0),
    ranking: arr,
  };
}

function makeProfile({ primary, secondary, diff12 }) {
  const isHybrid = diff12 <= 6; 
  // Nota: en % el umbral 2 puntos “raw” equivale aprox a 6% según reparto,
  // lo ajustaremos si hiciera falta tras test real.
  if (isHybrid && primary && secondary) {
    return {
      type: "hybrid",
      primary,
      secondary,
      name: `${energyByKey[primary].name} ${energyByKey[secondary].name}`,
      icon: `${energyByKey[primary].icon}${energyByKey[secondary].icon}`,
    };
  }
  return {
    type: "single",
    primary,
    secondary,
    name: energyByKey[primary]?.name ?? "Energía",
    icon: energyByKey[primary]?.icon ?? "🧭",
  };
}

function buildTribeGuide(primaryKey) {
  const bp = TRIBE_BLUEPRINT[primaryKey];
  if (!bp) return null;

  return {
    core: bp.core, // 2 energías núcleo
    expand: bp.expand, // 2 ampliación
    mirrorNote: bp.mirrorNote,
    copy: {
      headline: "Tu Núcleo Tribal",
      intro:
        "No necesitas una tribu grande. Necesitas una tribu que te equilibre.",
      coreLine:
        "Para que tu energía fluya sin desbordarse, busca al menos estas dos presencias:",
      trioLine: "Con esas dos energías ya hay armonía real. Tres personas pueden ser tribu.",
      expandTitle: "Si quieres construir algo más sólido",
      expandLine:
        "Añade estructura y estabilidad para que el grupo respire sin tensión.",
      ruleTitle: "Atención consciente",
      ruleLine:
        "No hay energías incompatibles. Algunas combinaciones simplemente necesitan más comunicación y madurez.",
      sizes:
        "2 ya es tribu. 4 es equilibrio. 6 es ideal. 8 es el límite antes de dejar de escucharse.",
      closing: "Más no es mejor. Mejor es mejor.",
    },
  };
}
/* ============================================================
   UI Helpers (estilos + animaciones suaves)
============================================================ */

const css = `
@keyframes ttFadeUp { from { opacity: 0; transform: translateY(10px);} to {opacity:1; transform: translateY(0);} }
@keyframes ttFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ttSlide { from { opacity: 0; transform: translateX(14px);} to { opacity: 1; transform: translateX(0);} }

.tt-card { border-radius: 24px; box-shadow: 0 10px 30px rgba(43,43,43,0.08); border: 1px solid rgba(79,95,62,0.10); }
.tt-soft { background: rgba(255,255,255,0.55); backdrop-filter: blur(6px); }
.tt-btn { border-radius: 999px; font-weight: 600; letter-spacing: .2px; }
.tt-btn:active { transform: scale(0.99); }
.tt-focus { outline: none; box-shadow: 0 0 0 4px rgba(195,167,107,0.25); }
.tt-anim { animation: ttFadeUp .45s ease-out both; }
.tt-anim-fade { animation: ttFade .25s ease-out both; }
.tt-anim-slide { animation: ttSlide .35s ease-out both; }
.tt-muted { color: rgba(43,43,43,0.68); }
.tt-muted2 { color: rgba(43,43,43,0.45); }
`;

/* ============================================================
   Componentes UI pequeños
============================================================ */

function Pill({ children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        border: "1px solid rgba(79,95,62,0.14)",
        background: "rgba(255,255,255,0.55)",
        fontSize: 12,
        fontWeight: 600,
        color: BRAND.colors.carbon,
      }}
    >
      {children}
    </span>
  );
}

function ProgressBar({ value }) {
  return (
    <div
      style={{
        width: "100%",
        height: 10,
        background: "rgba(79,95,62,0.10)",
        borderRadius: 999,
        overflow: "hidden",
      }}
      aria-label="Progreso"
    >
      <div
        style={{
          height: "100%",
          width: `${clamp(value, 0, 100)}%`,
          background: BRAND.colors.verde,
          borderRadius: 999,
          transition: "width 300ms ease-out",
        }}
      />
    </div>
  );
}

function EnergyChip({ k }) {
  const e = energyByKey[k];
  if (!e) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.65)",
        border: "1px solid rgba(79,95,62,0.12)",
        fontWeight: 700,
      }}
    >
      <span style={{ fontSize: 16 }}>{e.icon}</span>
      <span style={{ fontSize: 13, color: BRAND.colors.carbon }}>{e.name}</span>
    </span>
  );
}

function EnergyMiniLegend() {
  return (
    <div
      className="tt-anim-fade"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 10,
      }}
    >
      {ENERGIES.map((e) => (
        <div
          key={e.key}
          style={{
            borderRadius: 18,
            padding: 12,
            border: "1px solid rgba(79,95,62,0.10)",
            background: "rgba(255,255,255,0.55)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                background: BRAND.colors.arena,
                border: "1px solid rgba(79,95,62,0.12)",
                fontSize: 18,
              }}
            >
              {e.icon}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13 }}>{e.name}</div>
              <div className="tt-muted2" style={{ fontSize: 12, marginTop: 2 }}>
                {ENERGY_DEFS[e.key].essence}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="tt-btn"
      style={{
        width: "100%",
        padding: "18px 20px",
        background: BRAND.colors.verde,
        color: BRAND.colors.arena,
        border: "1px solid rgba(79,95,62,0.25)",
        boxShadow: "0 12px 24px rgba(79,95,62,0.18)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        transition: "opacity 200ms ease",
        fontSize: 18,
        fontWeight: 900,
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="tt-btn"
      style={{
        width: "100%",
        padding: "14px 16px",
        background: "rgba(255,255,255,0.55)",
        color: BRAND.colors.verde,
        border: "1px solid rgba(79,95,62,0.20)",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function SmallButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="tt-btn"
      style={{
        padding: "10px 12px",
        background: "rgba(255,255,255,0.55)",
        color: BRAND.colors.verde,
        border: "1px solid rgba(79,95,62,0.20)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {children}
    </button>
  );
}

/* ============================================================
   App principal (flujo completo)
============================================================ */

function App() {
  // Inyectamos fuentes y estilos (sin depender de tailwind)
  useEffect(() => {
    const st = document.createElement("style");
    st.innerHTML = css;
    document.head.appendChild(st);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;800&family=Inter:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(st);
      document.head.removeChild(link);
    };
  }, []);

  // Pantallas:
  // intro -> choose -> quiz -> gate (transición/resultado provisional) -> quiz -> gate -> quiz -> result
  const [screen, setScreen] = useState("intro");
  const [phaseIndex, setPhaseIndex] = useState(0); // 0,1,2
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // key: globalQuestionIndex -> 1..5
  const [pendingChoice, setPendingChoice] = useState(null); // 1..5
  const [dni, setDni] = useState("");
  const [computed, setComputed] = useState(null); // resultado completo (al final)
  const [gateInfo, setGateInfo] = useState(null); // info fase completada

  const passportRef = useRef(null);

  const phase = PHASES[phaseIndex];
  const phaseTotal = phase.total; // 10 / 20 / 30
  const questionsForNow = useMemo(() => QUESTIONS.slice(0, phaseTotal), [phaseTotal]);

  const globalIdx = qIndex; // usamos índice global dentro de slice (0..phaseTotal-1)
  const q = questionsForNow[globalIdx];

  const progressPct = useMemo(() => {
    const done = globalIdx; // preguntas contestadas en la fase actual
    const total = phaseTotal;
    return Math.round(((done) / total) * 100);
  }, [globalIdx, phaseTotal]);

  const answeredThis = useMemo(() => {
    return answers[globalIdx] != null;
  }, [answers, globalIdx]);

  // ------- Navegación y reset -------
  const resetAll = () => {
    setScreen("intro");
    setPhaseIndex(0);
    setQIndex(0);
    setAnswers({});
    setPendingChoice(null);
    setDni("");
    setComputed(null);
    setGateInfo(null);
  };

  const startGame = () => {
    setPhaseIndex(0);
    setQIndex(0);
    setAnswers({});
    setPendingChoice(null);
    setComputed(null);
    setGateInfo(null);
    setScreen("choose");
  };

  const beginPhase = (idx) => {
     setPhaseIndex(idx);
   
     // Siempre empezamos desde la pregunta 1
     setQIndex(0);
   
     setPendingChoice(null);
     setScreen("quiz");
   
     if (!dni) setDni(formatDniTribal());
   };

  // ------- Respuesta -------
  const chooseValue = (val) => setPendingChoice(val);

  const confirmNext = () => {
    if (!q) return;
    if (pendingChoice == null) return;

    setAnswers((prev) => ({
      ...prev,
      [globalIdx]: pendingChoice,
    }));

    // mini-animación de “cambio”
    setPendingChoice(null);

    // si quedan preguntas en esta fase
    if (globalIdx < phaseTotal - 1) {
      setQIndex((x) => x + 1);
      return;
    }

    // si completó la fase: abrir Gate (pantalla motivadora + opción continuar)
    const currentAnswers = { ...answers, [globalIdx]: pendingChoice };
    const scores = computeScores(currentAnswers);
    const top = topEnergies(scores.pct);
    const profile = makeProfile(top);

    const gate = buildGateSummary({
      phaseIndex,
      scores,
      top,
      profile,
    });

    setGateInfo(gate);
    setScreen("gate");
  };

  const goBack = () => {
    if (screen === "quiz") {
      // si estamos al inicio de la fase, volvemos al selector (para no liar)
      if ((phaseIndex === 0 && qIndex === 0) || (phaseIndex === 1 && qIndex === 10) || (phaseIndex === 2 && qIndex === 20)) {
        setScreen("choose");
        return;
      }
      setQIndex((x) => Math.max(0, x - 1));
      setPendingChoice(null);
    } else if (screen === "gate") {
      // volver a quiz al final de la fase (última pregunta)
      setScreen("quiz");
      setPendingChoice(null);
    } else {
      setScreen("intro");
    }
  };

  // ------- Gate: continuar o ver resultado provisional -------
  const viewProvisional = () => {
    // Resultado provisional = lectura + barras + núcleo tribal según primaria
    if (!gateInfo) return;
    setScreen("provisional");
  };

  const continueToNextPhase = () => {
    if (phaseIndex === 0) {
      setPhaseIndex(1);
      setQIndex(10);
      setScreen("quiz");
      return;
    }
    if (phaseIndex === 1) {
      setPhaseIndex(2);
      setQIndex(20);
      setScreen("quiz");
      return;
    }
    // si ya está en fase 3 y termina gate, produce resultado final
    finalizeResult();
  };

  // ------- Final result -------
  const finalizeResult = () => {
    const scores = computeScores(answers);
    const top = topEnergies(scores.pct);
    const profile = makeProfile(top);

    const primary = top.primary;
    const secondary = top.secondary;

    const tribe = buildTribeGuide(primary);

    const longText = buildLongNarrative({
      profile,
      primary,
      secondary,
      scoresPct: scores.pct,
    });

    setComputed({
      dni: dni || formatDniTribal(),
      scores,
      top,
      profile,
      tribe,
      longText,
    });
    setScreen("result");
  };

  // ------- Render wrappers -------
  const Page = ({ children }) => (
    <div
      style={{
        minHeight: "100vh",
        background: BRAND.colors.arena,
        color: BRAND.colors.carbon,
        fontFamily: BRAND.fonts.body,
        padding: 18,
        display: "grid",
        placeItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 520 }}>{children}</div>
    </div>
  );

  const Card = ({ children }) => (
    <div className="tt-card tt-soft tt-anim" style={{ padding: 18 }}>
      {children}
    </div>
  );

  const Header = ({ title, subtitle, icon }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 18,
            display: "grid",
            placeItems: "center",
            border: "1px solid rgba(79,95,62,0.14)",
            background: "rgba(255,255,255,0.55)",
            fontSize: 24,
          }}
        >
          {icon}
        </div>
        <div>
          <div
            style={{
              fontFamily: BRAND.fonts.title,
              fontWeight: 900,
              letterSpacing: -0.4,
              fontSize: 20,
              color: BRAND.colors.verde,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div className="tt-muted" style={{ fontSize: 13, marginTop: 4, lineHeight: 1.35 }}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  /* ============================================================
     Pantallas
  ============================================================ */

  // --- INTRO ---
  if (screen === "intro") {
    return (
      <Page>
        <Card>

            <div style={{ marginBottom: 16 }}>
              <img
                src="https://passport.tribandtrip.com/preview.jpg"
                alt="TRIB & TRIP — El Juego de la Tribu"
                style={{
                  width: "100%",
                  borderRadius: 18,
                  objectFit: "cover",
                }}
              />
            </div>
            <div style={{ textAlign: "center", padding: "10px 6px" }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>🧭</div>
            <div
              style={{
                fontFamily: BRAND.fonts.title,
                fontWeight: 900,
                fontSize: 22,
                color: BRAND.colors.carbon,
                letterSpacing: -0.4,
                marginBottom: 10,
              }}
            >
              El Juego de la Tribu
            </div>

            <div className="tt-muted" style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 14 }}>
              Este juego no es un test. Es una brújula para entender
              <b> cómo eres cuando viajas y convives</b>: qué energía te sale natural, qué aportas en grupo y con quién encajas de verdad.
            </div>

            <div className="tt-muted" style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 14 }}>
              Al final obtendrás tu <b>Nº de Pasaporte Tribal</b>, tu identidad dentro de la tribu y las pistas para completar tu pasaporte físico.
            </div>

            <div className="tt-muted2" style={{ fontSize: 12, lineHeight: 1.45, marginBottom: 16 }}>
              No guardamos datos. No hay cuentas. No hay seguimiento. Solo una brújula para conocerte mejor.
            </div>

            <PrimaryButton onClick={startGame}>Descubrir mi identidad</PrimaryButton>
            <div style={{ marginTop: 12, fontFamily: BRAND.fonts.title, fontWeight: 800, fontSize: 14, color: BRAND.colors.verde, opacity: 0.75 }}>
              {BRAND.tagline}
            </div>
          </div>
        </Card>
      </Page>
    );
  }

  // --- CHOOSE ---
  if (screen === "choose") {
    return (
      <Page>
        <Card>
          <Header
            icon="🧩"
            title="Elige tu ritmo"
            subtitle="Esto no va de hacerlo todo perfecto. Va de entenderte. Si llegas al final, tendrás tu Pasaporte."
          />

          <div style={{ display: "grid", gap: 12 }}>
            {PHASES.map((p, idx) => (
              <button
                key={p.key}
                onClick={() => beginPhase(idx)}
                className="tt-card tt-soft"
                style={{
                  padding: 16,
                  cursor: "pointer",
                  textAlign: "left",
                  borderRadius: 22,
                  border: "1px solid rgba(79,95,62,0.12)",
                  transition: "transform 150ms ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 18,
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid rgba(79,95,62,0.12)",
                      background: BRAND.colors.arena,
                      fontSize: 24,
                    }}
                  >
                    {p.icon}
                  </div>
                   <div style={{ flex: 1 }}>
                     <div style={{ fontFamily: BRAND.fonts.title, fontWeight: 900, fontSize: 18 }}>
                       {p.title} {idx === 2 ? "· Pasaporte completo" : ""}
                     </div>
                    <div className="tt-muted" style={{ fontSize: 13, lineHeight: 1.35, marginTop: 2 }}>
                      {p.subtitle}
                    </div>
                    <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Pill>🧠 {p.total} preguntas</Pill>
                      <Pill>⏳ ~{idx === 0 ? "3" : idx === 1 ? "7" : "12"} min</Pill>
                    </div>
                  
                  </div>
                  <div style={{ color: BRAND.colors.verde, fontWeight: 900, fontSize: 18 }}>›</div>
                </div>
              </button>
            ))}
          </div>

          <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
            <SmallButton onClick={() => setScreen("intro")}>← Volver</SmallButton>
          </div>
        </Card>
      </Page>
    );
  }

  // --- QUIZ ---
  if (screen === "quiz") {
    const phaseMeta = PHASES[phaseIndex];

    const answeredCount = Object.keys(answers).filter((k) => Number(k) < phaseTotal).length;
    const pct = Math.round((answeredCount / phaseTotal) * 100);

    return (
      <Page>
        <Card>
          <Header icon={phaseMeta.icon} title={phaseMeta.title} subtitle={phaseMeta.subtitle} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Pill>Pregunta {globalIdx + 1} de {phaseTotal}</Pill>
            <Pill>Progreso {pct}%</Pill>
          </div>

          <ProgressBar value={pct} />

          <div className="tt-anim-slide" style={{ marginTop: 14 }}>
            <div
              className="tt-card"
              style={{
                padding: 16,
                borderRadius: 22,
                background: "rgba(255,255,255,0.72)",
              }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                 <div>
                      <div style={{ fontFamily: BRAND.fonts.title, fontWeight: 900, color: BRAND.colors.verde }}>
                        Responde con sinceridad
                      </div>
                      <div className="tt-muted2" style={{ fontSize: 12, marginTop: 2 }}>
                        No hay respuestas buenas o malas.
                      </div>
                    </div>
                  
                    <Pill>Escala 1–5</Pill>
               </div>
              <div
                style={{
                  marginTop: 12,
                  fontFamily: BRAND.fonts.title,
                  fontWeight: 900,
                  fontSize: 20,
                  letterSpacing: -0.4,
                  lineHeight: 1.25,
                }}
              >
                {q.text}
              </div>

              <div style={{ marginTop: 14 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((v) => {
                    const selected = pendingChoice === v;
                    return (
                      <button
                        key={v}
                        onClick={() => chooseValue(v)}
                        className="tt-btn"
                        style={{
                          flex: "1 1 64px",
                          padding: "12px 0",
                          borderRadius: 18,
                          border: `1px solid ${selected ? "rgba(79,95,62,0.35)" : "rgba(79,95,62,0.16)"}`,
                          background: selected ? BRAND.colors.verde : "rgba(255,255,255,0.55)",
                          color: selected ? BRAND.colors.arena : BRAND.colors.carbon,
                          fontWeight: 900,
                          fontSize: 16,
                          cursor: "pointer",
                          transition: "all 160ms ease",
                          boxShadow: selected ? "0 12px 22px rgba(79,95,62,0.18)" : "none",
                        }}
                        aria-pressed={selected}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                  <span className="tt-muted2" style={{ fontSize: 12, fontWeight: 700 }}>
                    No resuena
                  </span>
                  <span className="tt-muted2" style={{ fontSize: 12, fontWeight: 700 }}>
                    Resuena mucho
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
            <PrimaryButton onClick={confirmNext} disabled={pendingChoice == null}>
              Siguiente →
            </PrimaryButton>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <SmallButton onClick={goBack}>← Atrás</SmallButton>
              <SmallButton onClick={resetAll}>Reiniciar</SmallButton>
            </div>
          </div>
        </Card>
      </Page>
    );
  }

  // --- GATE ---
  if (screen === "gate" && gateInfo) {
    const { phaseMeta, headline, text, profile, scoresPct } = gateInfo;
    const isLast = phaseIndex === 2;

    return (
      <Page>
        <Card>
          <Header icon={phaseMeta.icon} title={headline} subtitle={text} />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
            <Pill>Tu lectura hasta ahora</Pill>
            <Pill>{profile.icon} {profile.name}</Pill>
          </div>

          <div className="tt-card" style={{ padding: 14, borderRadius: 22, background: "rgba(255,255,255,0.70)" }}>
            <div style={{ fontFamily: BRAND.fonts.title, fontWeight: 900, color: BRAND.colors.verde, marginBottom: 10 }}>
              Energías (provisional)
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {Object.entries(scoresPct)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([k, v]) => (
                  <div key={k}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800 }}>
                      <span>{energyByKey[k].icon} {energyByKey[k].name}</span>
                      <span className="tt-muted">{v}%</span>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <ProgressBar value={v} />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
            <GhostButton onClick={viewProvisional}>Ver lectura (por ahora)</GhostButton>
            <PrimaryButton onClick={continueToNextPhase}>
              {isLast ? "Terminar y conseguir mi Pasaporte Tribal" : "Seguir a la siguiente fase"}
            </PrimaryButton>

            <SmallButton onClick={resetAll}>Volver al inicio</SmallButton>
          </div>
        </Card>
      </Page>
    );
  }

  // --- PROVISIONAL ---
  if (screen === "provisional" && gateInfo) {
    const primary = gateInfo.top.primary;
    const tribe = buildTribeGuide(primary);

    return (
      <Page>
        <Card>
          <Header
            icon="📍"
            title="Lectura (por ahora)"
            subtitle="Si paras aquí, esto es lo que vemos. Si sigues, afinamos y el pasaporte será más preciso."
          />

          <div className="tt-card" style={{ padding: 14, borderRadius: 22, background: "rgba(255,255,255,0.70)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <div style={{ fontFamily: BRAND.fonts.title, fontWeight: 900, color: BRAND.colors.verde }}>
                  Tu energía dominante (provisional)
                </div>
                <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <EnergyChip k={gateInfo.top.primary} />
                  <EnergyChip k={gateInfo.top.secondary} />
                </div>
                <div className="tt-muted" style={{ marginTop: 10, lineHeight: 1.5 }}>
                  {gateInfo.narrativeShort}
                </div>
              </div>

              <Pill>ID: {dni || "(generándose…)"}</Pill>
            </div>

            {tribe ? (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(79,95,62,0.10)" }}>
                <div style={{ fontFamily: BRAND.fonts.title, fontWeight: 900, color: BRAND.colors.verde }}>
                  {tribe.copy.headline}
                </div>
                <div className="tt-muted" style={{ marginTop: 8, lineHeight: 1.55 }}>
                  {tribe.copy.intro}
                </div>

                <div style={{ marginTop: 10, fontWeight: 900 }}>{tribe.copy.coreLine}</div>
                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {tribe.core.map((k) => (
                    <EnergyChip key={k} k={k} />
                  ))}
                </div>

                <div className="tt-muted" style={{ marginTop: 10, lineHeight: 1.5 }}>
                  {tribe.copy.trioLine}
                </div>

                <div style={{ marginTop: 12, fontWeight: 900 }}>{tribe.copy.expandTitle}</div>
                <div className="tt-muted" style={{ marginTop: 6, lineHeight: 1.5 }}>
                  {tribe.copy.expandLine}
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {tribe.expand.map((k) => (
                    <EnergyChip key={k} k={k} />
                  ))}
                </div>

                <div style={{ marginTop: 12, fontWeight: 900 }}>¿Otro como tú?</div>
                <div className="tt-muted" style={{ marginTop: 6, lineHeight: 1.5 }}>
                  {tribe.mirrorNote}
                </div>

                <div style={{ marginTop: 12, fontWeight: 900 }}>{tribe.copy.ruleTitle}</div>
                <div className="tt-muted" style={{ marginTop: 6, lineHeight: 1.5 }}>
                  {tribe.copy.ruleLine}
                </div>

                <div style={{ marginTop: 12, fontWeight: 900 }}>Recuerda</div>
                <div className="tt-muted" style={{ marginTop: 6, lineHeight: 1.5 }}>
                  {tribe.copy.sizes}
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
            <PrimaryButton onClick={continueToNextPhase}>Seguir afinando</PrimaryButton>
            <SmallButton onClick={() => setScreen("gate")}>← Volver</SmallButton>
          </div>
        </Card>
      </Page>
    );
  }

  // --- RESULT (sin descarga todavía; la descarga va en Bloque 3) ---
  if (screen === "result" && computed) {
    const { profile, scores, top, tribe, longText } = computed;

    return (
      <Page>
        <Card>
          <Header
            icon="🛂"
            title="Tu Pasaporte Tribal"
            subtitle="Quién eres cuando estás en tribu y con quién encajas de verdad."
          />

          {/* Pasaporte Visual */}
          <div
            ref={passportRef}
            className="tt-card"
            style={{
              padding: 16,
              borderRadius: 24,
              background: "rgba(255,255,255,0.76)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Deco suave */}
            <div
              style={{
                position: "absolute",
                inset: -40,
                background:
                  "radial-gradient(circle at 20% 20%, rgba(195,167,107,0.16), transparent 55%), radial-gradient(circle at 80% 10%, rgba(79,95,62,0.12), transparent 55%), radial-gradient(circle at 70% 80%, rgba(195,167,107,0.10), transparent 55%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: BRAND.fonts.title, fontWeight: 900, color: BRAND.colors.verde, fontSize: 16 }}>
                    TRIB & TRIP
                  </div>
                  <div className="tt-muted2" style={{ marginTop: 2, fontSize: 12, fontWeight: 800 }}>
                    Pasaporte Tribal · ID {computed.dni}
                  </div>
                </div>
                <Pill>{BRAND.tagline}</Pill>
              </div>

              <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontFamily: BRAND.fonts.title, fontWeight: 900, fontSize: 28, letterSpacing: -0.8 }}>
                    {profile.icon} {profile.type === "hybrid" ? profile.name : energyByKey[top.primary].name}
                  </div>
                  <div className="tt-muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
                    {longText.summary}
                  </div>
                </div>
              </div>

              {/* Barras */}
              <div style={{ marginTop: 14 }}>
                <div style={{ fontFamily: BRAND.fonts.title, fontWeight: 900, color: BRAND.colors.verde, marginBottom: 8 }}>
                  Tus energías
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  {Object.entries(scores.pct)
                    .sort((a, b) => b[1] - a[1])
                    .map(([k, v]) => (
                      <div key={k}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 900 }}>
                          <span>{energyByKey[k].icon} {energyByKey[k].name}</span>
                          <span className="tt-muted">{v}%</span>
                        </div>
                        <div style={{ marginTop: 6 }}>
                          <ProgressBar value={v} />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Narrativa + Tribu */}
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(79,95,62,0.10)" }}>
                <div style={{ fontFamily: BRAND.fonts.title, fontWeight: 900, color: BRAND.colors.verde }}>
                  Quién eres en tribu
                </div>
                <div className="tt-muted" style={{ marginTop: 8, lineHeight: 1.6 }}>
                  {longText.long}
                </div>

                {tribe ? (
                  <>
                    <div style={{ marginTop: 14, fontFamily: BRAND.fonts.title, fontWeight: 900, color: BRAND.colors.verde }}>
                      {tribe.copy.headline}
                    </div>
                    <div className="tt-muted" style={{ marginTop: 8, lineHeight: 1.6 }}>
                      {tribe.copy.intro}
                    </div>

                    <div style={{ marginTop: 10, fontWeight: 900 }}>{tribe.copy.coreLine}</div>
                    <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {tribe.core.map((k) => (
                        <EnergyChip key={k} k={k} />
                      ))}
                    </div>
                    <div className="tt-muted" style={{ marginTop: 10, lineHeight: 1.55 }}>
                      {tribe.copy.trioLine}
                    </div>

                    <div style={{ marginTop: 12, fontWeight: 900 }}>{tribe.copy.expandTitle}</div>
                    <div className="tt-muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
                      {tribe.copy.expandLine}
                    </div>
                    <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {tribe.expand.map((k) => (
                        <EnergyChip key={k} k={k} />
                      ))}
                    </div>

                    <div style={{ marginTop: 12, fontWeight: 900 }}>¿Otro como tú?</div>
                    <div className="tt-muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
                      {tribe.mirrorNote}
                    </div>

                    <div style={{ marginTop: 12, fontWeight: 900 }}>{tribe.copy.ruleTitle}</div>
                    <div className="tt-muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
                      {tribe.copy.ruleLine}
                    </div>

                    <div style={{ marginTop: 12, fontWeight: 900 }}>Recuerda</div>
                    <div className="tt-muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
                      {tribe.copy.sizes}
                    </div>
                    <div className="tt-muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
                      {tribe.copy.closing}
                    </div>
                  </>
                ) : null}
              </div>

              {/* Diccionario rápido */}
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(79,95,62,0.10)" }}>
                <div style={{ fontFamily: BRAND.fonts.title, fontWeight: 900, color: BRAND.colors.verde, marginBottom: 10 }}>
                  Diccionario rápido de energías
                </div>
                <EnergyMiniLegend />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
            {/* Descarga y compartir van en Bloque 3 */}
            <PrimaryButton onClick={resetAll}>Volver a empezar</PrimaryButton>
            <SmallButton onClick={() => setScreen("choose")}>Volver al selector</SmallButton>
          </div>
        </Card>
      </Page>
    );
  }

  // fallback
  return (
    <Page>
      <Card>
        <Header icon="⚠️" title="Algo se ha quedado a medias" subtitle="Vuelve al inicio y probamos de nuevo." />
        <PrimaryButton onClick={resetAll}>Ir al inicio</PrimaryButton>
      </Card>
    </Page>
  );
}

/* ============================================================
   Construcción de textos (Gate y Resultado)
============================================================ */

function buildGateSummary({ phaseIndex, scores, top, profile }) {
  const phaseMeta = PHASES[phaseIndex];

  const headline =
    phaseIndex === 0
      ? "Has encontrado tu base."
      : phaseIndex === 1
      ? "Ahora sí: ya se ve tu forma de estar en tribu."
      : "Último tramo: ya estás a nada del Pasaporte.";

  const text =
    phaseIndex === 0
      ? "Ya tenemos una primera pista de tu energía. Si paras aquí, te damos una lectura suave. Si sigues, afinamos cómo encajas en grupo."
      : phaseIndex === 1
      ? "Esto ya no va solo de cómo eres: va de cómo convives. Si sigues, cerramos tu identidad tribal completa."
      : "Has llegado al final. Terminamos y te llevas tu Pasaporte Tribal descargable.";

  const narrativeShort = shortNarrative(top.primary, top.secondary);

  return {
    phaseMeta,
    headline,
    text,
    profile,
    top,
    scoresPct: scores.pct,
    narrativeShort,
  };
}

function shortNarrative(primary, secondary) {
  if (!primary || !secondary) return "Tu energía se está dibujando. Sigue un poco más para afinar.";
  const p = energyByKey[primary]?.name;
  const s = energyByKey[secondary]?.name;
  return `Empieza a verse una energía ${p}, con un matiz ${s}. Si sigues, afinamos mejor tu identidad dentro de la tribu.`;
}

function buildLongNarrative({ profile, primary, secondary, scoresPct }) {
  const p = ENERGY_DEFS[primary];
  const s = ENERGY_DEFS[secondary];

  const summary =
    profile.type === "hybrid"
      ? `Eres un perfil híbrido: ${energyByKey[primary].name} con matiz ${energyByKey[secondary].name}.`
      : `Tu energía dominante es ${energyByKey[primary].name}.`;

  const long =
    profile.type === "hybrid"
      ? `Tu forma de estar en tribu mezcla ${energyByKey[primary].name} y ${energyByKey[secondary].name}. 
Aportas ${p.gifts.slice(0, 2).join(" y ")} desde ${energyByKey[primary].name}, y sumas ${s.gifts[0]} desde ${energyByKey[secondary].name}. 
Tu reto no es “cambiar quién eres”, sino cuidar el equilibrio: cuando sube la intensidad, recuerda regular el ritmo y volver a tu centro.`
      : `Cuando estás en tribu, lo tuyo es ${p.essence.toLowerCase()}.
Aportas ${p.gifts.slice(0, 2).join(" y ")} y sueles funcionar mejor cuando el grupo respira equilibrio: acción cuando toca, calma cuando toca. 
Tu reto típico es sencillo de cuidar: ${p.shadow}`;

  return { summary, long };
}

ReactDOM.render(<App />, document.getElementById("root"));
