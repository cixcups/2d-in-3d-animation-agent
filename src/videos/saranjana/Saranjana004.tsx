import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
type Mood = "shock" | "point" | "curious" | "determined" | "happy";

function RuralWorld({ frame = 0 }: { frame?: number }) {
  const sway = Math.sin(frame * .035) * 10;
  return <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="ruralSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#142d52"/><stop offset=".55" stopColor="#527d91"/><stop offset="1" stopColor="#e5a875"/></linearGradient>
      <linearGradient id="ruralPath" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b28a5d"/><stop offset="1" stopColor="#594735"/></linearGradient>
      <radialGradient id="sunGlow"><stop offset="0" stopColor="#ffe2a0" stopOpacity=".85"/><stop offset="1" stopColor="#ffe2a0" stopOpacity="0"/></radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#ruralSky)"/>
    <circle cx="790" cy="350" r="270" fill="url(#sunGlow)"/><circle cx="790" cy="350" r="90" fill="#ffe2ad"/>
    <path d="M0 900 L160 570 290 810 465 485 650 820 820 550 1080 860 V1300 H0Z" fill="#355b62"/>
    <path d="M0 1060 Q220 850 430 1040 T850 990 T1080 1020 V1450 H0Z" fill="#294b45"/>
    <path d="M0 1220 Q250 1010 500 1210 T1080 1160 V1500 H0Z" fill="#1c3d37"/>
    <path d="M0 1320 Q200 1240 380 1320 T760 1290 T1080 1310 V1920 H0Z" fill="#254334"/>
    <path d="M0 1430 Q250 1360 500 1450 T1080 1410 V1920 H0Z" fill="#49623e"/>
    <path d="M470 1920 Q510 1690 600 1510 Q670 1390 810 1280 L930 1260 Q760 1420 710 1580 Q660 1770 690 1920Z" fill="url(#ruralPath)" stroke="#d0aa78" strokeWidth="10"/>
    <g fill="#102e2b" stroke="#183c31" strokeWidth="18" strokeLinejoin="round">
      <path d="M-60 1410 L-30 870 50 1030 90 890 150 1120 190 1410Z"/>
      <path d="M870 1370 L910 810 980 980 1030 820 1110 1120 1140 1400Z"/>
      <path d={"M120 1370 Q"+(120+sway)+" 1080 190 970 Q260 1100 270 1370Z"}/>
      <path d={"M760 1370 Q"+(760-sway)+" 1040 830 920 Q900 1060 910 1370Z"}/>
    </g>
    <g fill="#e3c18b" stroke="#543d2e" strokeWidth="9"><path d="M145 1320 L145 1190 260 1110 375 1190 375 1320Z"/><path d="M125 1195 L260 1095 395 1195Z" fill="#583e30"/><rect x="190" y="1230" width="45" height="90" fill="#263c3b"/><rect x="285" y="1230" width="48" height="90" fill="#263c3b"/></g>
    <g fill="#eacb96" stroke="#523c30" strokeWidth="8"><path d="M750 1390 L750 1280 845 1210 940 1280 940 1390Z"/><path d="M730 1285 L845 1195 960 1285Z" fill="#5d4030"/><rect x="795" y="1310" width="40" height="80" fill="#283f3e"/><rect x="870" y="1310" width="40" height="80" fill="#283f3e"/></g>
    <path d={"M0 1660 Q260 "+(1580+sway)+" 520 1660 T1080 1630"} stroke="#b7d4bb" strokeWidth="9" fill="none" opacity=".4"/>
  </svg>;
}

function SaranjanaCity({ frame = 0, glow = 1 }: { frame?: number; glow?: number }) {
  const rise = interpolate(frame, [0,120,260], [180,40,0], clamp);
  const lights = .72 + .22 * Math.sin(frame * .09);
  const towers = [{x:70,w:100,h:500},{x:190,w:120,h:680},{x:340,w:95,h:560},{x:455,w:145,h:880},{x:630,w:105,h:650},{x:760,w:130,h:780},{x:920,w:95,h:570}];
  return <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="citySky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#07152f"/><stop offset=".65" stopColor="#252e62"/><stop offset="1" stopColor="#77527a"/></linearGradient><radialGradient id="cityHalo"><stop offset="0" stopColor="#63e8ff" stopOpacity=".8"/><stop offset="1" stopColor="#63e8ff" stopOpacity="0"/></radialGradient><linearGradient id="bay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#286b8b"/><stop offset="1" stopColor="#071b35"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#citySky)"/>
    {Array.from({length:38}).map((_,i)=><circle key={i} cx={(i*173)%1080} cy={90+(i*97)%670} r={i%3===0?4:2} fill="#fff" opacity={.4+.4*Math.sin(frame*.05+i)}/>)}
    <circle cx="780" cy="290" r="115" fill="#e9efff" opacity=".9"/><ellipse cx="520" cy="1050" rx="670" ry="490" fill="url(#cityHalo)" opacity={glow}/>
    <path d="M0 1250 Q220 1110 420 1230 T1080 1180 V1920 H0Z" fill="#101f45"/>
    <g transform={"translate(0 "+rise+")"}>{towers.map((b,i)=><g key={i}>
      <path d={"M"+b.x+" 1390 L"+(b.x+8)+" "+(1390-b.h)+" L"+(b.x+b.w/2)+" "+(1360-b.h-85)+" L"+(b.x+b.w-8)+" "+(1390-b.h)+" L"+(b.x+b.w)+" 1390Z"} fill={i%2?"#182d61":"#213b72"} stroke="#71dfff" strokeWidth="7"/>
      <path d={"M"+(b.x+b.w/2)+" "+(1300-b.h)+" L"+(b.x+b.w/2)+" 1390"} stroke="#b8f5ff" strokeWidth="5" opacity=".55"/>
      {Array.from({length:Math.floor(b.h/65)}).map((_,j)=><g key={j} fill={j%2?"#7ef3ff":"#ffd77a"} opacity={lights}><rect x={b.x+20} y={1390-b.h+55+j*58} width="13" height="23" rx="4"/><rect x={b.x+b.w-34} y={1390-b.h+55+j*58} width="13" height="23" rx="4"/></g>)}
      <path d={"M"+(b.x+b.w/2)+" "+(1305-b.h)+" v-90"} stroke="#ffd879" strokeWidth="7"/>
    </g>)}</g>
    <path d="M0 1430 Q250 1340 520 1430 T1080 1400 V1920 H0Z" fill="url(#bay)"/>
    <path d={"M0 1500 Q260 "+(1460+Math.sin(frame*.04)*12)+" 520 1500 T1080 1490"} stroke="#9beeff" strokeWidth="9" fill="none" opacity=".5"/>
    {Array.from({length:10}).map((_,i)=><path key={i} d={"M"+(i*125)+" "+(1580+(i%3)*72)+" q65 -18 130 0"} stroke="#5dd5ee" strokeWidth="5" fill="none" opacity={.22+.15*Math.sin(frame*.06+i)}/>)}
    <path d="M0 1740 Q220 1650 440 1740 T1080 1700 V1920 H0Z" fill="#07182b"/>
  </svg>;
}

function BangStick({x,y,scale=1,mood="curious",frame=0,walking=false,facing=1}:{x:number;y:number;scale?:number;mood?:Mood;frame?:number;walking?:boolean;facing?:number}) {
  const phase=frame*.22, step=walking?Math.sin(phase)*34:Math.sin(frame*.055)*3;
  const bob=walking?Math.abs(Math.sin(phase))*-17:Math.sin(frame*.08)*6, swing=walking?Math.sin(phase):0;
  const leftArm=walking?"M-8 -145 Q"+(-125-swing*48)+" "+(-110+swing*52)+" "+(-145-swing*30)+" "+(-35+swing*20):mood==="shock"?"M-8 -145 Q-150 -260 -170 -205":mood==="happy"?"M-8 -145 Q-150 -270 -155 -315":"M-8 -145 Q-120 -105 -145 -35";
  const rightArm=walking?"M8 -145 Q"+(125+swing*48)+" "+(-110-swing*52)+" "+(145+swing*30)+" "+(-35-swing*20):mood==="shock"?"M8 -145 Q150 -260 170 -205":mood==="point"?"M8 -145 Q125 -215 190 -205":mood==="happy"?"M8 -145 Q150 -270 155 -315":"M8 -145 Q120 -105 145 -35";
  const tilt=mood==="shock"?-5:mood==="curious"?Math.sin(frame*.06)*4:0;
  return <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position:"absolute",inset:0,overflow:"visible",pointerEvents:"none"}} aria-hidden="true">
    <g transform={"translate("+x+" "+(y+bob)+") scale("+(scale*facing)+" "+scale+") rotate("+tilt+" 0 -300)"} stroke="#05070d" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="0" cy="430" rx="160" ry="28" fill="#07121a" opacity=".42" stroke="none"/>
      <path d={"M-10 135 L-76 "+(310+step)} fill="none"/><path d={"M10 135 L76 "+(310-step)} fill="none"/>
      <path d={"M-76 "+(306+step)+" q-65 8 -75 70 q-4 32 38 35 h92 q30 -10 12 -42 l-28 -48Z"} fill="#fff"/>
      <path d={"M76 "+(306-step)+" q65 8 75 70 q4 32 -38 35 h-92 q-30 -10 -12 -42 l28 -48Z"} fill="#fff"/>
      <path d="M0 -170 L0 150" fill="none" strokeWidth="35"/><path d={leftArm} fill="none" strokeWidth="25"/><path d={rightArm} fill="none" strokeWidth="25"/>
      <g fill="#fff" strokeWidth="13"><ellipse cx={mood==="shock"?-185:-150} cy={mood==="shock"?-220:-30} rx="48" ry="39"/><ellipse cx={mood==="shock"?185:mood==="point"?195:150} cy={mood==="shock"?-220:mood==="point"?-210:-30} rx="48" ry="39"/></g>
      <ellipse cx="0" cy="-300" rx="132" ry="132" fill="#fff" strokeWidth="12"/>
      <path d="M-54 -424 Q-108 -500 -42 -512 Q-12 -513 -1 -462" fill="none" strokeWidth="21"/><path d="M15 -429 Q28 -504 87 -488 Q110 -480 80 -435" fill="none" strokeWidth="21"/>
      <g fill="#05070d" stroke="none"><ellipse cx="-43" cy="-318" rx="19" ry="38"/><ellipse cx="43" cy="-318" rx="19" ry="38"/></g>
      {mood==="shock"?<ellipse cx="0" cy="-244" rx="29" ry="42" fill="#b40f19" strokeWidth="8"/>:null}
      {mood==="happy"?<path d="M-43 -252 Q0 -190 43 -252 Q35 -197 0 -195 Q-35 -197 -43 -252Z" fill="#a90816" strokeWidth="7"/>:null}
      {mood==="determined"?<path d="M-45 -245 Q0 -270 45 -245" fill="none" strokeWidth="11"/>:null}
      {mood==="curious"||mood==="point"?<path d="M-39 -244 Q0 -218 39 -244" fill="none" strokeWidth="9"/>:null}
      {walking?<g stroke="#fff" strokeWidth="9" opacity=".8"><path d="M-190 70 h-45 M185 105 h45 M-190 125 h-35"/></g>:null}
    </g>
  </svg>;
}

function Caption({children,top=false,accent=false}:{children:React.ReactNode;top?:boolean;accent?:boolean}) {
  return <div style={{position:"absolute",left:48,right:48,[top?"top":"bottom"]:top?100:108,textAlign:"center",color:"#fff",fontFamily:"Arial,sans-serif",fontSize:39,fontWeight:900,lineHeight:1.16,letterSpacing:-.6,WebkitTextStroke:"2px #07101e",textShadow:"0 5px 0 #000,0 10px 24px #000",padding:"22px 24px",background:accent?"rgba(20,12,42,.72)":"rgba(2,8,20,.48)",borderRadius:28,border:accent?"3px solid rgba(255,215,120,.7)":"1px solid rgba(255,255,255,.15)"}}>{children}</div>;
}
function Title({children,top=300}:{children:React.ReactNode;top?:number}) {
  return <div style={{position:"absolute",top,left:42,right:42,textAlign:"center",fontFamily:"Arial Black,Arial,sans-serif",fontWeight:1000,fontSize:68,color:"#ffe15a",lineHeight:1.02,WebkitTextStroke:"4px #140b20",textShadow:"0 8px 0 #9b2f31,0 13px 22px #000"}}>{children}</div>;
}

function SceneOne(){const f=useCurrentFrame();const x=interpolate(f,[0,180],[690,530],clamp);return <AbsoluteFill><RuralWorld frame={f}/><div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(8,20,42,.15),rgba(8,20,42,.4))"}}/><BangStick x={x} y={1450} scale={1.02} mood="curious" frame={f} walking/><Title top={270}>KOTA YANG<br/>TAK TERLIHAT?</Title><Caption>Di Kalimantan Selatan, ada kisah tentang kota misterius bernama Saranjana.</Caption></AbsoluteFill>;}
function SceneTwo(){const f=useCurrentFrame();const zoom=interpolate(f,[0,270],[.94,1.08],clamp);const x=interpolate(f,[0,270],[360,520],clamp);return <AbsoluteFill><div style={{position:"absolute",inset:0,transform:"scale("+zoom+")"}}><RuralWorld frame={f+40}/></div><BangStick x={x} y={1450} scale={.98} mood="point" frame={f}/><div style={{position:"absolute",top:700,left:50,right:50,textAlign:"center",fontFamily:"Arial Black,Arial",fontSize:44,fontWeight:900,color:"#fff",textShadow:"0 5px 14px #000"}}>PULAU LAUT • KALIMANTAN SELATAN</div><Caption>Konon, kota itu berada di sekitar Pulau Laut dan hanya bisa dilihat oleh orang tertentu.</Caption></AbsoluteFill>;}
function SceneThree(){const f=useCurrentFrame();const glow=.7+.2*Math.sin(f*.12);return <AbsoluteFill><SaranjanaCity frame={f} glow={glow}/><BangStick x={250} y={1460} scale={.94} mood="shock" frame={f}/><Title top={310}>SARANJANA:<br/>KOTA CAHAYA</Title><Caption>Dalam cerita yang beredar, gedung tinggi dan cahaya kota tampak berkilau di kejauhan.</Caption></AbsoluteFill>;}
function SceneFour(){const f=useCurrentFrame();const x=interpolate(f,[0,360],[220,600],clamp);return <AbsoluteFill><SaranjanaCity frame={f+90} glow={.72}/><div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(4,10,25,.55),transparent 65%)"}}/><BangStick x={x} y={1450} scale={.98} mood="determined" frame={f} walking/><Caption>Bang Stick mencoba mendekat. Namun, semakin jauh melangkah, kota itu seperti menjauh.</Caption></AbsoluteFill>;}
function SceneFive(){const f=useCurrentFrame();const opacity=interpolate(f,[0,120,250,330],[1,.8,.25,.04],clamp);return <AbsoluteFill><SaranjanaCity frame={f+180} glow={opacity}/><div style={{position:"absolute",inset:0,background:"rgba(4,8,25,.35)"}}/><BangStick x={310} y={1435} scale={1.05} mood="shock" frame={f}/><Title top={300}>LENYAP<br/>DALAM KABUT!</Title><Caption>Kota itu menghilang dari pandangan. Apakah benar ada, atau hanya legenda?</Caption></AbsoluteFill>;}
function SceneSix(){const f=useCurrentFrame();const pulse=1+.025*Math.sin(f*.18);return <AbsoluteFill><SaranjanaCity frame={f+250} glow={.22}/><div style={{position:"absolute",inset:0,background:"rgba(14,8,38,.58)"}}/><BangStick x={285} y={1435} scale={1.08*pulse} mood="determined" frame={f}/><div style={{position:"absolute",left:500,right:35,top:630,textAlign:"center",fontFamily:"Arial Black,Arial",fontWeight:1000,fontSize:78,lineHeight:1.02,color:"#fff",WebkitTextStroke:"4px #120a24",textShadow:"0 8px 0 #000"}}>MISTIS<br/><span style={{color:"#ffd83f"}}>ATAU</span><br/><span style={{color:"#ffdd39"}}>SAINS?</span></div><Caption accent>Menurutmu, apa rahasia Saranjana? Tulis pendapatmu di komentar!</Caption></AbsoluteFill>;}

export const Saranjana004:React.FC=()=> <AbsoluteFill style={{backgroundColor:"#07142e"}}>
  <Sequence from={0} durationInFrames={180}><SceneOne/></Sequence>
  <Sequence from={180} durationInFrames={270}><SceneTwo/></Sequence>
  <Sequence from={450} durationInFrames={300}><SceneThree/></Sequence>
  <Sequence from={750} durationInFrames={360}><SceneFour/></Sequence>
  <Sequence from={1110} durationInFrames={330}><SceneFive/></Sequence>
  <Sequence from={1440} durationInFrames={210}><SceneSix/></Sequence>
</AbsoluteFill>;
