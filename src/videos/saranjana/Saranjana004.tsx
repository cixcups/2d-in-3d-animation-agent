import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";

const W = 1080;
const H = 1920;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const stars = [
  [72, 130, 3], [188, 245, 2], [318, 100, 3], [468, 210, 2], [603, 94, 2],
  [760, 178, 3], [902, 118, 2], [1004, 290, 3], [844, 365, 2], [530, 335, 2],
  [236, 425, 2], [52, 380, 2], [687, 455, 2], [965, 520, 2],
];
const buildings = [
  { x: 70, w: 105, h: 360 }, { x: 190, w: 125, h: 510 }, { x: 330, w: 90, h: 420 },
  { x: 435, w: 138, h: 650 }, { x: 590, w: 100, h: 470 }, { x: 705, w: 145, h: 580 },
  { x: 865, w: 90, h: 390 }, { x: 970, w: 100, h: 520 },
];

function Skyline({ opacity = 1, frame = 0, wide = false }: { opacity?: number; frame?: number; wide?: boolean }) {
  return (
    <g opacity={opacity}>
      {buildings.map((b, i) => {
        const y = 1480 - b.h;
        const cols = Math.max(2, Math.floor(b.w / 30));
        const rows = Math.max(3, Math.floor(b.h / 52));
        return (
          <g key={i}>
            <rect x={b.x} y={y} width={b.w} height={b.h} rx={8} fill={i % 2 ? "#10264f" : "#172d59"} stroke="#5276a8" strokeWidth={5} />
            {Array.from({ length: rows * cols }).map((_, j) => {
              const cx = b.x + 15 + (j % cols) * ((b.w - 25) / cols);
              const cy = y + 28 + Math.floor(j / cols) * 48;
              return <rect key={j} x={cx} y={cy} width={10} height={20} rx={2} fill={(j + i) % 4 === 0 ? "#ffdc77" : "#48d9ff"} opacity={0.85} />;
            })}
            {i === 3 || i === 5 ? <path d={`M ${b.x + b.w / 2} ${y} l 0 -95 l 14 95`} fill="#ffd56a" stroke="#ffd56a" strokeWidth={6} /> : null}
          </g>
        );
      })}
      <path d="M0 1480 H1080 V1570 H0Z" fill="#09152f" />
      <path d="M0 1480 Q540 1430 1080 1480" fill="none" stroke="#ffd56a" strokeWidth={8} opacity={0.8} />
      <path d="M300 1480 Q540 1320 780 1480" fill="none" stroke="#46dfff" strokeWidth={7} opacity={0.55 + 0.15 * Math.sin(frame * 0.08)} />
      {wide ? <path d="M0 1600 H1080" stroke="#4fc8ff" strokeWidth={5} opacity={0.35} /> : null}
    </g>
  );
}

function Backdrop({ frame = 0, cityOpacity = 0.9, purple = false, fog = false, wide = false }: {
  frame?: number; cityOpacity?: number; purple?: boolean; fog?: boolean; wide?: boolean;
}) {
  const fogShift = (frame * 1.8) % 600;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ transform: `scale(${1 + 0.012 * Math.sin(frame * 0.025)}) translateX(${Math.sin(frame * 0.018) * 8}px)`, transformOrigin: "50% 50%" }}>
      <defs>
        <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={purple ? "#160b36" : "#07142e"} />
          <stop offset="0.52" stopColor={purple ? "#30205b" : "#12345e"} />
          <stop offset="1" stopColor="#182946" />
        </linearGradient>
        <radialGradient id="cityGlow"><stop offset="0" stopColor="#43cfff" stopOpacity="0.42"/><stop offset="1" stopColor="#43cfff" stopOpacity="0"/></radialGradient>
        <linearGradient id="fogGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d9e8ff" stopOpacity="0"/><stop offset="0.5" stopColor="#e2edff" stopOpacity="0.75"/><stop offset="1" stopColor="#d9e8ff" stopOpacity="0"/></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#nightSky)" />
      {stars.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.55 + 0.35 * Math.sin(frame * 0.04 + i)} />)}
      <circle cx="820" cy="280" r="112" fill="#e4eeff" opacity="0.9" />
      <circle cx="855" cy="250" r="112" fill="#15294b" opacity="0.28" />
      <path d="M0 1040 L180 780 L320 1010 L470 710 L660 1030 L810 820 L1080 1020 V1600 H0Z" fill="#102344" />
      <path d="M0 1190 L180 950 L330 1150 L520 900 L710 1190 L890 940 L1080 1160 V1650 H0Z" fill="#0c1c36" opacity="0.96" />
      <ellipse cx="740" cy="1290" rx="580" ry="520" fill="url(#cityGlow)" />
      <g transform={`translate(${Math.sin(frame * 0.018) * -14} 0)`}>
        <Skyline opacity={cityOpacity} frame={frame} wide={wide} />
      </g>
      {/* forest silhouettes */}
      <g fill="#071a21" stroke="#0a231f" strokeWidth="22" strokeLinejoin="round">
        <path d="M0 1510 L0 380 L85 520 L25 520 L130 680 L52 680 L180 900 L0 900Z" />
        <path d="M1080 1500 L1080 470 L995 620 L1055 620 L930 800 L1010 800 L890 1010 L1080 1010Z" />
        <path d="M-80 970 Q70 760 220 945 Q130 990 90 1080 Q-10 1060 -80 970Z" />
        <path d="M1160 1030 Q1000 780 850 960 Q940 1030 970 1120 Q1080 1110 1160 1030Z" />
      </g>
      <path d="M0 1690 Q240 1580 470 1690 Q720 1570 1080 1680 V1920 H0Z" fill="#071620" />
      <path d="M0 1760 Q260 1670 520 1770 Q810 1650 1080 1750" fill="none" stroke="#214b39" strokeWidth="18" />
      {fog ? (
        <g opacity="0.82">
          <path d={`M${-500 + fogShift} 1330 Q${-100 + fogShift} 1190 ${250 + fogShift} 1330 T${1050 + fogShift} 1330`} fill="none" stroke="url(#fogGrad)" strokeWidth="150" />
          <path d={`M${-400 - fogShift / 2} 1540 Q${100 - fogShift / 2} 1400 ${550 - fogShift / 2} 1540 T${1450 - fogShift / 2} 1540`} fill="none" stroke="url(#fogGrad)" strokeWidth="190" />
          <path d="M0 1640 Q250 1490 510 1640 T1080 1640" fill="none" stroke="#d9e8ff" strokeWidth="90" opacity="0.28" />
        </g>
      ) : null}
    </svg>
  );
}

type Mood = "shock" | "point" | "curious" | "determined" | "happy";
function BangStick({ x, y, scale = 1, mood = "curious", frame = 0, walking = false }: {
  x: number; y: number; scale?: number; mood?: Mood; frame?: number; walking?: boolean;
}) {
  const step = walking ? Math.sin(frame * 0.24) * 26 : Math.sin(frame * 0.06) * 3;
  const bob = walking ? Math.abs(Math.sin(frame * 0.24)) * -13 : Math.sin(frame * 0.09) * 5;
  const walkSwing = walking ? Math.sin(frame * 0.24) : 0;
  const leftArm = walking ? `M-5 -145 Q${-125 - walkSwing * 48} ${-105 + walkSwing * 52} ${-145 - walkSwing * 28} ${-35 + walkSwing * 18}` : mood === "shock" ? "M-5 -145 Q-130 -250 -165 -200" : mood === "point" ? "M-5 -145 Q105 -210 185 -205" : mood === "happy" ? "M-5 -145 Q-140 -255 -150 -300" : "M-5 -145 Q-125 -100 -145 -35";
  const rightArm = walking ? `M5 -145 Q${125 + walkSwing * 48} ${-105 - walkSwing * 52} ${145 + walkSwing * 28} ${-35 - walkSwing * 18}` : mood === "shock" ? "M5 -145 Q130 -250 165 -200" : mood === "point" ? "M5 -145 Q115 -110 150 -35" : mood === "happy" ? "M5 -145 Q140 -255 150 -300" : "M5 -145 Q115 -100 145 -35";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }} aria-hidden="true">
    <g transform={`translate(${x} ${y + bob}) scale(${scale})`} stroke="#05070d" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
      {/* legs and oversized white shoes */}
      <path d={`M-10 135 L-75 ${315 + step}`} fill="none" />
      <path d={`M10 135 L75 ${315 - step}`} fill="none" />
      <path d={`M-75 ${310 + step} q-65 8 -75 70 q-4 32 38 35 h92 q30 -10 12 -42 l-28 -48Z`} fill="#fff" />
      <path d={`M75 ${310 - step} q65 8 75 70 q4 32 -38 35 h-92 q-30 -10 -12 -42 l28 -48Z`} fill="#fff" />
      {/* slim black body */}
      <path d="M0 -170 L0 150" fill="none" strokeWidth="34" />
      {/* arms */}
      <path d={leftArm} fill="none" strokeWidth="24" />
      <path d={rightArm} fill="none" strokeWidth="24" />
      {/* gloves */}
      <g fill="#fff" strokeWidth="13">
        <ellipse cx={mood === "shock" ? -175 : mood === "happy" ? -160 : -150} cy={mood === "shock" ? -210 : mood === "happy" ? -310 : -30} rx="47" ry="38" />
        <ellipse cx={mood === "shock" ? 175 : mood === "happy" ? 160 : 150} cy={mood === "shock" ? -210 : mood === "happy" ? -310 : -30} rx="47" ry="38" />
      </g>
      {/* round white head */}
      <ellipse cx="0" cy="-300" rx="132" ry="132" fill="#fff" strokeWidth="12" />
      {/* exactly two black tufts */}
      <path d="M-54 -424 Q-108 -500 -42 -512 Q-12 -513 -1 -462" fill="none" strokeWidth="21" />
      <path d="M15 -429 Q28 -504 87 -488 Q110 -480 80 -435" fill="none" strokeWidth="21" />
      <g fill="#05070d" stroke="none">
        <ellipse cx="-43" cy="-318" rx="19" ry="38" />
        <ellipse cx="43" cy="-318" rx="19" ry="38" />
      </g>
      {mood === "shock" ? <ellipse cx="0" cy="-244" rx="29" ry="42" fill="#b40f19" strokeWidth="8" /> : null}
      {mood === "happy" ? <path d="M-43 -252 Q0 -190 43 -252 Q35 -197 0 -195 Q-35 -197 -43 -252Z" fill="#a90816" strokeWidth="7" /> : null}
      {mood === "determined" ? <path d="M-45 -245 Q0 -270 45 -245" fill="none" strokeWidth="11" /> : null}
      {mood === "curious" || mood === "point" ? <path d="M-39 -244 Q0 -218 39 -244" fill="none" strokeWidth="9" /> : null}
      {/* motion ticks on walking */}
      {walking ? <g stroke="#fff" strokeWidth="9" opacity="0.8"><path d="M-190 70 h-45 M185 105 h45"/><path d="M-190 125 h-35"/></g> : null}
    </g>
    </svg>
  );
}

function Caption({ children, top = false }: { children: React.ReactNode; top?: boolean }) {
  return (
    <div style={{ position: "absolute", left: 56, right: 56, [top ? "top" : "bottom"]: top ? 105 : 112, textAlign: "center", color: "white", fontFamily: "Arial, sans-serif", fontSize: 40, fontWeight: 900, lineHeight: 1.15, letterSpacing: -1, WebkitTextStroke: "2px #07101e", textShadow: "0 5px 0 #000, 0 10px 24px #000", padding: "22px 24px", background: "rgba(2, 8, 20, .38)", borderRadius: 26 }}>
      {children}
    </div>
  );
}

const Title: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 340 }) => (
  <div style={{ position: "absolute", top, left: 48, right: 48, textAlign: "center", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 1000, fontSize: 66, color: "#ffe14b", lineHeight: 1.02, WebkitTextStroke: "4px #140b20", textShadow: "0 8px 0 #ad231d, 0 13px 22px #000" }}>{children}</div>
);

const SceneOne: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 180], [250, 345], clamp);
  return <AbsoluteFill><Backdrop frame={f} cityOpacity={0.92} /><BangStick x={x} y={1510} scale={1.08} mood="shock" frame={f} /><Title top={310}>KOTA MISTERIUS?</Title><Caption>Bayangkan... ada kota yang katanya lebih modern dari Jakarta!</Caption></AbsoluteFill>;
};

const SceneTwo: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 270], [0.93, 1.08], clamp);
  return <AbsoluteFill><div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}><Backdrop frame={f} cityOpacity={1} wide /></div><BangStick x={235} y={1540} scale={0.84} mood="point" frame={f} /><Title top={270}>KOTA GAIB<br/>SARANJANA!</Title><Caption>Konon, Saranjana berada di Pulau Laut, Kalimantan Selatan.</Caption></AbsoluteFill>;
};

const SceneThree: React.FC = () => {
  const f = useCurrentFrame();
  const glow = 0.5 + 0.3 * Math.sin(f * 0.11);
  return <AbsoluteFill><Backdrop frame={f} cityOpacity={1} wide /><div style={{ position: "absolute", top: 680, left: 0, right: 0, textAlign: "center", color: "#9cf3ff", fontFamily: "Arial Black, Arial", fontSize: 36, fontWeight: 900, textShadow: `0 0 24px rgba(50,220,255,${glow})` }}>GEDUNG MEGAH • JALANAN LUAS</div><BangStick x={350} y={1530} scale={0.95} mood="curious" frame={f} /><Caption>Menurut cerita masyarakat, kota ini punya bangunan megah dan teknologi maju.</Caption></AbsoluteFill>;
};

const SceneFour: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 360], [220, 590], clamp);
  return <AbsoluteFill><Backdrop frame={f} cityOpacity={0.58} fog wide /><BangStick x={x} y={1530} scale={0.97} mood="determined" frame={f} walking /><Caption>Ada pula cerita orang-orang yang mengaku pernah melihat kota misterius ini.</Caption></AbsoluteFill>;
};

const SceneFive: React.FC = () => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 230, 330], [0.82, 0.45, 0.08], clamp);
  return <AbsoluteFill><Backdrop frame={f} cityOpacity={opacity} fog wide /><BangStick x={310} y={1535} scale={1.06} mood="shock" frame={f} /><Title top={300}>TIBA-TIBA<br/>MENGHILANG!</Title><Caption>Tapi... apakah kota itu benar-benar ada, atau hanya legenda?</Caption></AbsoluteFill>;
};

const SceneSix: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = 1 + 0.025 * Math.sin(f * 0.18);
  return <AbsoluteFill><Backdrop frame={f} cityOpacity={0.22} purple fog /><BangStick x={285} y={1500} scale={1.16 * pulse} mood="determined" frame={f} /><div style={{ position: "absolute", left: 510, right: 38, top: 660, textAlign: "center", fontFamily: "Arial Black, Arial", fontWeight: 1000, fontSize: 76, lineHeight: 1.03, color: "#fff", WebkitTextStroke: "4px #120a24", textShadow: "0 8px 0 #000" }}>MISTIS<br/><span style={{ color: "#ffd83f" }}>ATAU</span><br/><span style={{ color: "#ffdd39" }}>SAINS?</span></div><div style={{ position: "absolute", left: 50, right: 50, bottom: 130, textAlign: "center", color: "#fff", fontFamily: "Arial, sans-serif", fontWeight: 900, fontSize: 34, textShadow: "0 4px 12px #000" }}>TULIS PENDAPATMU DI KOMENTAR!</div></AbsoluteFill>;
};

export const Saranjana004: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#07142e" }}>
    <Sequence from={0} durationInFrames={180}><SceneOne /></Sequence>
    <Sequence from={180} durationInFrames={270}><SceneTwo /></Sequence>
    <Sequence from={450} durationInFrames={300}><SceneThree /></Sequence>
    <Sequence from={750} durationInFrames={360}><SceneFour /></Sequence>
    <Sequence from={1110} durationInFrames={330}><SceneFive /></Sequence>
    <Sequence from={1440} durationInFrames={210}><SceneSix /></Sequence>
  </AbsoluteFill>
);