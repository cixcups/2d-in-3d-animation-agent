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
      {/* Saranjana signature tower, luminous crown and floating halo */ }
      <g>
        <path d="M510 1480 L510 870 L526 870 L540 620 L554 870 L570 870 L570 1480Z" fill="#142c58" stroke="#86dfff" strokeWidth={5}/>
        <path d="M540 620 L540 520 L548 620" fill="none" stroke="#fff0ad" strokeWidth={7}/>
        <path d="M522 900 H558 M518 970 H562 M515 1050 H565 M512 1140 H568 M510 1240 H570 M510 1350 H570" stroke="#56e6ff" strokeWidth={9} opacity={0.9}/>
        <ellipse cx="540" cy="910" rx="110" ry="20" fill="none" stroke="#ffe18b" strokeWidth={8} opacity={0.9}/>
        <ellipse cx="540" cy="910" rx="130" ry="31" fill="none" stroke="#52dcff" strokeWidth={3} opacity={0.75}/>
        <path d="M420 1480 Q430 1370 540 1340 Q650 1370 660 1480Z" fill="#173a6c" stroke="#6fe7ff" strokeWidth={7}/>
        <path d="M455 1480 Q465 1390 540 1370 Q615 1390 625 1480" fill="none" stroke="#ffe08a" strokeWidth={8}/>
        <path d="M490 1480 V1410 Q540 1360 590 1410 V1480" fill="#0b1a36" stroke="#6fe7ff" strokeWidth={6}/>
      </g>
      <path d="M0 1480 H1080 V1570 H0Z" fill="#09152f" />
      <path d="M0 1480 Q540 1430 1080 1480" fill="none" stroke="#ffd56a" strokeWidth={8} opacity={0.8} />
      <path d="M300 1480 Q540 1320 780 1480" fill="none" stroke="#46dfff" strokeWidth={7} opacity={0.55 + 0.15 * Math.sin(frame * 0.08)} />
      <g opacity={0.55}>
        {Array.from({length: 22}).map((_,i)=><path key={i} d={`M${390+i*14} 1510 l${(i%2?1:-1)* (8+(i%5)*3)} 250`} stroke={i%3===0?"#ffe18b":"#4bdcff"} strokeWidth={4+(i%3)} opacity={0.4}/>)}
      </g>
      {wide ? <path d="M0 1600 H1080" stroke="#4fc8ff" strokeWidth={5} opacity={0.35} /> : null}
    </g>
  );
}

function Backdrop({ frame = 0, cityOpacity = 0.9, purple = false, fog = false, wide = false }: {
  frame?: number; cityOpacity?: number; purple?: boolean; fog?: boolean; wide?: boolean;
}) {
  const fogShift = (frame * 1.8) % 600;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
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
      <Skyline opacity={cityOpacity} frame={frame} wide={wide} />
      <g fill="#071a21" stroke="#0a231f" strokeWidth="22" strokeLinejoin="round">
        <path d="M0 1510 L0 380 L85 520 L25 520 L130 680 L52 680 L180 900 L0 900Z" />
        <path d="M1080 1500 L1080 470 L995 620 L1055 620 L930 800 L1010 800 L890 1010 L1080 1010Z" />
        <path d="M-80 970 Q70 760 220 945 Q130 990 90 1080 Q-10 1060 -80 970Z" />
        <path d="M1160 1030 Q1000 780 850 960 Q940 1030 970 1120 Q1080 1110 1160 1030Z" />
      </g>
      <path d="M0 1690 Q240 1580 470 1690 Q720 1570 1080 1680 V1920 H0Z" fill="#071620" />
      <path d="M0 1760 Q260 1670 520 1770 Q810 1650 1080 1750" fill="none" stroke="#214b39" strokeWidth="18" />
      {/* Layered foreground foliage and stones for a hand-illustrated forest frame */}
      <g stroke="#07120f" strokeWidth="12" strokeLinejoin="round">
        <path d="M0 1850 Q65 1740 140 1815 Q180 1700 255 1790 Q310 1750 350 1850Z" fill="#164b32"/>
        <path d="M760 1890 Q820 1760 890 1820 Q950 1690 1010 1790 Q1050 1760 1080 1840V1920H760Z" fill="#174d34"/>
        <path d="M40 1920 Q80 1830 155 1880 Q210 1815 270 1920Z" fill="#286b3d"/>
        <path d="M850 1920 Q900 1810 970 1870 Q1020 1810 1080 1900V1920Z" fill="#2a7041"/>
      </g>
      <g fill="#68a94d" stroke="#173b28" strokeWidth="7">
        {Array.from({length:18}).map((_,i)=><ellipse key={i} cx={25+i*62} cy={1800+(i%4)*26} rx={36+(i%3)*7} ry={17+(i%2)*6} transform={`rotate(${(i%2?1:-1)*22} ${25+i*62} ${1800+(i%4)*26})`}/>)}
      </g>
      <g fill="#263d3b" stroke="#0a1718" strokeWidth="8">
        <path d="M250 1920 l70 -95 110 95Z"/><path d="M650 1920 l90 -70 90 70Z"/>
      </g>
      {fog ? (
        <g opacity="0.82">
          <path d={`M${-500 + fogShift} 1330 Q${-100 + fogShift} 1190 ${250 + fogShift} 1330 T${1050 + fogShift} 1330`} fill="none" stroke="url(#fogGrad)" strokeWidth="150" />
          <path d={`M${-400 - fogShift / 2} 1540 Q${100 - fogShift / 2} 1400 ${550 - fogShift / 2} 1540 T${1450 - fogShift / 2} 1540`} fill="none" stroke="url(#fogGrad)" strokeWidth="190" />
          <path d="M0 1640 Q250 1490 510 1640 T1080 1640" fill="none" stroke="#d9e8ff" strokeWidth="90" opacity={0.28} />
        </g>
      ) : null}
    </svg>
  );
}

type Mood = "shock" | "point" | "curious" | "determined" | "happy";
function BangStick({ x, y, scale = 1, mood = "curious", frame = 0, walking = false }: {
  x: number; y: number; scale?: number; mood?: Mood; frame?: number; walking?: boolean;
}) {
  const gait = walking ? frame * 0.22 : frame * 0.035;
  const stride = walking ? Math.sin(gait) : 0;
  const bob = walking ? -Math.abs(Math.sin(gait)) * 17 : Math.sin(frame * 0.07) * 3;
  const bodyLean = walking ? Math.sin(gait) * 4 : mood === "shock" ? -3 : 0;
  const headTilt = mood === "shock" ? -5 : mood === "determined" ? 5 : walking ? Math.sin(gait) * 3 : 0;
  const leftLeg = walking ? stride * 25 : 0;
  const rightLeg = walking ? -stride * 25 : 0;
  const idleSwing = Math.sin(frame * 0.105) * 7;
  const leftArm = walking ? -stride * 30 : mood === "shock" ? -34 : mood === "happy" ? -54 : mood === "point" ? 8 : idleSwing;
  const rightArm = walking ? stride * 30 : mood === "shock" ? 34 : mood === "happy" ? 54 : mood === "point" ? -42 : -idleSwing;
  const blink = !walking && (frame % 137 < 5);
  const mouth = mood === "shock" ? "M-25 -248 Q0 -285 25 -248 Q28 -207 0 -205 Q-28 -207 -25 -248Z"
    : mood === "happy" ? "M-47 -250 Q0 -184 47 -250 Q38 -190 0 -188 Q-38 -190 -47 -250Z"
    : mood === "determined" ? "M-35 -222 Q0 -210 35 -222" : "M-31 -230 Q0 -207 31 -230";
  const handY = mood === "shock" ? -205 : mood === "happy" ? -305 : mood === "point" ? -175 : -28;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="bangHeadShade" cx="34%" cy="24%" r="78%">
          <stop offset="0" stopColor="#ffffff"/><stop offset="0.68" stopColor="#fff"/><stop offset="1" stopColor="#c9cde0"/>
        </radialGradient>
        <linearGradient id="bangShoeShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff"/><stop offset="0.72" stopColor="#f4f5fb"/><stop offset="1" stopColor="#bfc5d6"/>
        </linearGradient>
        <linearGradient id="bangGloveShade" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#d7dbea"/>
        </linearGradient>
      </defs>
      <g transform={`translate(${x} ${y + bob}) scale(${scale})`}>
        <ellipse cx="0" cy="435" rx="190" ry="24" fill="#020711" opacity="0.42"/>
        {/* Legs articulate from the hips; opposite swing creates a readable walk cycle. */}
        <g stroke="#05070d" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round">
          <g transform={`rotate(${leftLeg} -18 120)`}>
            <path d="M-18 120 Q-48 214 -88 320" fill="none"/>
            <path d="M-91 315 Q-160 326 -169 390 Q-170 424 -130 429 H-30 Q2 418 -14 385 L-54 328Z" fill="url(#bangShoeShade)"/>
            <path d="M-160 397 Q-98 425 -22 402" fill="none" stroke="#aab1c2" strokeWidth="7"/>
          </g>
          <g transform={`rotate(${rightLeg} 18 120)`}>
            <path d="M18 120 Q48 214 88 320" fill="none"/>
            <path d="M91 315 Q160 326 169 390 Q170 424 130 429 H30 Q-2 418 14 385 L54 328Z" fill="url(#bangShoeShade)"/>
            <path d="M22 402 Q98 425 160 397" fill="none" stroke="#aab1c2" strokeWidth="7"/>
          </g>
        </g>
        {/* Compact black torso, matching the official slim silhouette. */}
        <g transform={`rotate(${bodyLean} 0 -5)`}>
          <path d="M-34 -172 Q-48 -115 -31 -55 L-25 145 Q0 162 25 145 L31 -55 Q48 -115 34 -172Z" fill="#05070d" stroke="#05070d" strokeWidth="8"/>
          {/* Arms and gloves share the same shoulder pivots: hands follow every gesture. */}
          {(() => {
            const leftEndY = mood === "shock" ? -205 : mood === "happy" ? -250 : -15;
            const rightEndY = mood === "shock" ? -205 : mood === "happy" ? -250 : mood === "point" ? -125 : -15;
            const leftEndX = mood === "happy" ? -132 : mood === "shock" ? -122 : -145;
            const rightEndX = mood === "happy" ? 132 : mood === "shock" ? 122 : mood === "point" ? 155 : 145;
            const glove = (flip: number) => (
              <g transform={`scale(${flip} 1)`} fill="url(#bangGloveShade)" stroke="#111522" strokeWidth="8" strokeLinejoin="round">
                <path d="M-38 8 Q-50 -18 -30 -34 Q-10 -48 7 -32 Q26 -45 42 -24 Q58 -4 40 19 Q25 42 -8 40 Q-38 36 -38 8Z"/>
                <path d="M-27 -26 Q-44 -52 -27 -63 Q-10 -70 0 -42"/>
                <path d="M-3 -34 Q-8 -63 10 -66 Q28 -64 24 -34"/>
                <path d="M20 -28 Q25 -52 42 -47 Q57 -39 39 -12"/>
              </g>
            );
            return (
              <g stroke="#05070d" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <g transform={`rotate(${leftArm} -22 -145)`}>
                  <path d={`M-22 -145 Q-82 -116 -116 ${leftEndY + 55} L${leftEndX} ${leftEndY}`}/>
                  <g transform={`translate(${leftEndX} ${leftEndY}) rotate(-12)`}>{glove(1)}</g>
                </g>
                <g transform={`rotate(${rightArm} 22 -145)`}>
                  <path d={`M22 -145 Q82 -116 116 ${rightEndY + 55} L${rightEndX} ${rightEndY}`}/>
                  <g transform={`translate(${rightEndX} ${rightEndY}) rotate(12)`}>{glove(-1)}</g>
                </g>
              </g>
            );
          })()}
          {/* Large round head and the two unmistakable black tufts. */}
          <g transform={`rotate(${headTilt} 0 -300)`}>
            <ellipse cx="0" cy="-300" rx="134" ry="134" fill="url(#bangHeadShade)" stroke="#05070d" strokeWidth="13"/>
            <path d="M-55 -425 Q-112 -505 -43 -516 Q-10 -516 -2 -463" fill="none" stroke="#05070d" strokeWidth="23" strokeLinecap="round"/>
            <path d="M15 -429 Q28 -507 89 -491 Q113 -481 81 -436" fill="none" stroke="#05070d" strokeWidth="23" strokeLinecap="round"/>
            {/* Brows and eyes change with the emotion, not just the mouth. */}
            {mood === "determined" ? <g stroke="#05070d" strokeWidth="13" strokeLinecap="round"><path d="M-75 -374 L-20 -350"/><path d="M75 -374 L20 -350"/></g> : null}
            {mood === "curious" || mood === "point" ? <path d="M-70 -375 Q-42 -394 -18 -378" fill="none" stroke="#05070d" strokeWidth="10" strokeLinecap="round"/> : null}
            {mood === "shock" ? <g stroke="#05070d" strokeWidth="10" strokeLinecap="round"><path d="M-76 -385 Q-45 -414 -17 -385"/><path d="M17 -385 Q45 -414 76 -385"/></g> : null}
            <g fill="#05070d">
              <ellipse cx="-43" cy="-318" rx={blink ? 19 : 21} ry={blink ? 4 : 39}/>
              <ellipse cx="43" cy="-318" rx={blink ? 19 : 21} ry={blink ? 4 : 39}/>
            </g>
            <g fill="#fff"><ellipse cx="-50" cy="-335" rx="7" ry="12"/><ellipse cx="36" cy="-335" rx="7" ry="12"/></g>
            <path d={mouth} fill={mood === "determined" ? "none" : "#a90918"} stroke="#05070d" strokeWidth="8" strokeLinejoin="round"/>
            {mood === "shock" || mood === "happy" ? <path d="M-15 -221 Q0 -212 15 -221" fill="none" stroke="#ff6470" strokeWidth="7"/> : null}
          </g>
          {walking ? <g stroke="#eaf6ff" strokeWidth="8" opacity="0.8"><path d="M-190 90 h-42 M188 125 h42"/><path d="M-185 145 h-30"/></g> : null}
        </g>
      </g>
    </svg>
  );
}

function Caption({ children, top = false }: { children: React.ReactNode; top?: boolean }) {
  return (
    <div style={{ position: "absolute", left: 56, right: 56, [top ? "top" : "bottom"]: top ? 105 : 112, textAlign: "center", color: "white", fontFamily: "Arial, sans-serif", fontSize: 54, fontWeight: 900, lineHeight: 1.15, letterSpacing: -1, WebkitTextStroke: "2px #07101e", textShadow: "0 5px 0 #000, 0 10px 24px #000", padding: "22px 24px", background: "rgba(2, 8, 20, .38)", borderRadius: 26 }}>
      {children}
    </div>
  );
}

const Title: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 340 }) => (
  <div style={{ position: "absolute", top, left: 48, right: 48, textAlign: "center", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 1000, fontSize: 82, color: "#ffe14b", lineHeight: 1.02, WebkitTextStroke: "4px #140b20", textShadow: "0 8px 0 #ad231d, 0 13px 22px #000" }}>{children}</div>
);

const SceneOne: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 180], [250, 345], clamp);
  return <AbsoluteFill><Backdrop frame={f} cityOpacity={0.92} /><BangStick x={x} y={1510} scale={1.08} mood="shock" frame={f} walking /><Title top={310}>KOTA MISTERIUS?</Title><Caption>Bayangkan... ada kota yang katanya lebih modern dari Jakarta!</Caption></AbsoluteFill>;
};

const SceneTwo: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 270], [0.93, 1.08], clamp);
  return <AbsoluteFill><div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}><Backdrop frame={f} cityOpacity={1} wide /></div><BangStick x={235} y={1540} scale={0.84} mood="point" frame={f} /><Title top={270}>KOTA GAIB<br/>SARANJANA!</Title><Caption>Konon, Saranjana berada di Pulau Laut, Kalimantan Selatan.</Caption></AbsoluteFill>;
};

const SceneThree: React.FC = () => {
  const f = useCurrentFrame();
  const glow = 0.5 + 0.3 * Math.sin(f * 0.11);
  return <AbsoluteFill><Backdrop frame={f} cityOpacity={1} wide /><div style={{ position: "absolute", top: 680, left: 0, right: 0, textAlign: "center", color: "#9cf3ff", fontFamily: "Arial Black, Arial", fontSize: 48, fontWeight: 900, textShadow: `0 0 24px rgba(50,220,255,${glow})` }}>GEDUNG MEGAH • JALANAN LUAS</div><BangStick x={350} y={1530} scale={0.95} mood="curious" frame={f} /><Caption>Menurut cerita masyarakat, kota ini punya bangunan megah dan teknologi maju.</Caption></AbsoluteFill>;
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
  return <AbsoluteFill><Backdrop frame={f} cityOpacity={0.22} purple fog /><BangStick x={285} y={1500} scale={1.16 * pulse} mood="determined" frame={f} /><div style={{ position: "absolute", left: 510, right: 38, top: 660, textAlign: "center", fontFamily: "Arial Black, Arial", fontWeight: 1000, fontSize: 98, lineHeight: 1.03, color: "#fff", WebkitTextStroke: "4px #120a24", textShadow: "0 8px 0 #000" }}>MISTIS<br/><span style={{ color: "#ffd83f" }}>ATAU</span><br/><span style={{ color: "#ffdd39" }}>SAINS?</span></div><div style={{ position: "absolute", left: 50, right: 50, bottom: 130, textAlign: "center", color: "#fff", fontFamily: "Arial, sans-serif", fontWeight: 900, fontSize: 42, textShadow: "0 4px 12px #000" }}>TULIS PENDAPATMU DI KOMENTAR!</div></AbsoluteFill>;
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
