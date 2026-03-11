import { useState } from "react";

const PIXEL = "'Press Start 2P', monospace";
const KO    = "'Noto Sans KR', sans-serif";

const RED   = "#ff5c39";
const LIGHT = "#ececec";
const DARK  = "#414344";

const SECTIONS = [
  {
    id: "clean", icon: "🧹",
    label: "오염·청결 문제",
    tag: "CLEANLINESS",
    items: [
      "파티션 표면에 얼룩·낙서·테이프 자국이 남아 있나요?",
      "의자 패브릭이나 메쉬에 먼지·얼룩이 눈에 띄나요?",
      "에어컨·공기청정기 필터를 6개월 이상 교체하지 않았나요?",
      "창틀·블라인드·조명 등 손이 잘 안 가는 곳에 먼지가 쌓여 있나요?",
      "현재 사무실 공용 공간의 청소 상태에 불만족하시나요?",
      "가구 아래·뒤편 등 사각지대를 3개월 이상 청소하지 못했나요?",
    ],
  },
  {
    id: "move", icon: "📦",
    label: "공간·배치 문제",
    tag: "SPACE",
    items: [
      "3개월 이상 아무도 앉지 않은 자리가 있나요?",
      "사용하지 않는 여분 의자·책상이 공간을 차지하고 있나요?",
      "회의실이나 휴게 공간이 창고처럼 쓰이고 있나요?",
      "현재 자리 배치가 지금의 팀 구성·인원수와 맞지 않나요?",
      "자주 협업하는 팀이나 인원이 물리적으로 멀리 떨어져 있나요?",
      "무거운 가구를 옮기고 싶지만 엄두가 나지 않아 미루고 있나요?",
      "사무실 이전·확장·축소를 고려하고 있나요?",
    ],
  },
];
const TOTAL = 13;
const INQUIRY_URL = "https://service.letus4u.com/service/inquiry";

function getChar(n) {
  if (n === 0) return { face: "😊", sweat: 0, label: "이상 없어요",           shake: false };
  if (n <= 2)  return { face: "🙂", sweat: 0, label: "아직 괜찮아요",         shake: false };
  if (n <= 4)  return { face: "😐", sweat: 1, label: "슬슬 신경 쓰세요",      shake: false };
  if (n <= 6)  return { face: "😅", sweat: 2, label: "점검이 필요해요!",      shake: false };
  if (n <= 9)  return { face: "😰", sweat: 3, label: "위험 신호예요!",        shake: true  };
  return             { face: "🥵", sweat: 4, label: "당장 조치가 필요해요!!", shake: true  };
}

function getSecLevel(n, total) {
  const r = n / total;
  if (r === 0)  return "SAFE";
  if (r <= 0.4) return "CAUTION";
  if (r <= 0.7) return "WARNING";
  return              "DANGER";
}

function getOverall(n) {
  if (n <= 2)  return { grade: "SAFE",    label: "안전", headline: "우리 사무실, 꽤 잘 관리되고 있어요!", desc: "지금처럼만 유지해보세요.\n그래도 주기적인 점검은 필수예요.", urgent: false };
  if (n <= 5)  return { grade: "CAUTION", label: "주의", headline: "슬슬 정비가 필요한 신호가 보여요", desc: "한 번쯤 꼼꼼히 점검해보세요.\n작은 방치가 나중엔 큰 문제가 됩니다.", urgent: false };
  if (n <= 9)  return { grade: "WARNING", label: "경고", headline: "공간이 지쳐있어요.\n지금이 딱 정비할 타이밍이에요.", desc: "클리닝 또는 공간 재배치가 필요한 상태예요.\n레터스가 도와드릴 수 있어요.", urgent: false };
  return             { grade: "DANGER",  label: "위험", headline: "사무실 전체에 변화가 필요해요!", desc: "당장 공간 재배치·사무실 청소를\n고려해보세요.", urgent: true };
}

function SweatDrops({ count }) {
  return (
    <div style={{ position: "absolute", top: -6, right: -12, display: "flex", gap: 2, pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ fontSize: 13, display: "block", opacity: 0, animation: `sweat .9s ${i * .22}s ease-in-out infinite` }}>💧</span>
      ))}
    </div>
  );
}

function Checkbox({ checked, onClick }) {
  return (
    <button onClick={e => { e.stopPropagation(); onClick(); }} style={{
      width: 22, height: 22, minWidth: 22, flexShrink: 0,
      border: `2px solid ${checked ? RED : "#3a3a5c"}`,
      background: checked ? RED : "transparent",
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all .12s", boxShadow: checked ? `0 0 8px ${RED}66` : "none",
    }}>
      {checked && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4.5 8L10 1" stroke="#fff" strokeWidth="2.5" strokeLinecap="square" /></svg>}
    </button>
  );
}

// ── 픽셀 오피스 SVG 일러스트 ────────────────────────────────────
function PixelOffice() {
  return (
    <svg width="260" height="160" viewBox="0 0 260 160" style={{ imageRendering: "pixelated" }} xmlns="http://www.w3.org/2000/svg">
      {/* 바닥 */}
      <rect x="0" y="130" width="260" height="30" fill="#1a1a2e"/>
      <rect x="0" y="128" width="260" height="4" fill="#2a2a44"/>

      {/* 벽 */}
      <rect x="10" y="20" width="240" height="112" fill="#0f0f1e"/>
      <rect x="10" y="20" width="240" height="4"   fill="#1e1e32"/>

      {/* 창문 */}
      <rect x="30"  y="35" width="50" height="40" fill="#1a2a3a"/>
      <rect x="30"  y="35" width="50" height="2"  fill="#2a4a6a"/>
      <rect x="30"  y="35" width="2"  height="40" fill="#2a4a6a"/>
      <rect x="78"  y="35" width="2"  height="40" fill="#2a4a6a"/>
      <rect x="30"  y="73" width="50" height="2"  fill="#2a4a6a"/>
      <rect x="54"  y="35" width="2"  height="40" fill="#1e3a5a"/>
      <rect x="30"  y="55" width="50" height="2"  fill="#1e3a5a"/>
      {/* 창문 빛 */}
      <rect x="32" y="37" width="20" height="16" fill="#1e3a5a" opacity=".6"/>
      <rect x="56" y="37" width="20" height="16" fill="#1e3a5a" opacity=".6"/>

      {/* 창문2 */}
      <rect x="180" y="35" width="50" height="40" fill="#1a2a3a"/>
      <rect x="180" y="35" width="50" height="2"  fill="#2a4a6a"/>
      <rect x="180" y="35" width="2"  height="40" fill="#2a4a6a"/>
      <rect x="228" y="35" width="2"  height="40" fill="#2a4a6a"/>
      <rect x="180" y="73" width="50" height="2"  fill="#2a4a6a"/>
      <rect x="204" y="35" width="2"  height="40" fill="#1e3a5a"/>
      <rect x="180" y="55" width="50" height="2"  fill="#1e3a5a"/>
      <rect x="182" y="37" width="20" height="16" fill="#1e3a5a" opacity=".6"/>
      <rect x="206" y="37" width="20" height="16" fill="#1e3a5a" opacity=".6"/>

      {/* 책상 1 (왼쪽) */}
      <rect x="20"  y="100" width="70" height="8"  fill="#2d1f14"/>
      <rect x="20"  y="100" width="70" height="2"  fill="#3d2a1a"/>
      <rect x="22"  y="108" width="6"  height="22" fill="#241810"/>
      <rect x="82"  y="108" width="6"  height="22" fill="#241810"/>

      {/* 모니터 1 */}
      <rect x="32" y="78" width="30" height="22" fill="#0d0d1a"/>
      <rect x="32" y="78" width="30" height="2"  fill="#ff5c39" opacity=".8"/>
      <rect x="32" y="78" width="2"  height="22" fill="#1e1e2e"/>
      <rect x="60" y="78" width="2"  height="22" fill="#1e1e2e"/>
      <rect x="32" y="98" width="30" height="2"  fill="#1e1e2e"/>
      {/* 모니터 화면 내용 */}
      <rect x="34" y="82" width="20" height="2" fill="#ff5c39" opacity=".5"/>
      <rect x="34" y="86" width="14" height="2" fill="#ffffff" opacity=".2"/>
      <rect x="34" y="90" width="18" height="2" fill="#ffffff" opacity=".2"/>
      <rect x="34" y="94" width="10" height="2" fill="#ffffff" opacity=".15"/>
      {/* 모니터 받침 */}
      <rect x="44" y="100" width="6"  height="2" fill="#1e1e2e"/>
      <rect x="40" y="102" width="14" height="2" fill="#1e1e2e"/>

      {/* 키보드 1 */}
      <rect x="28" y="104" width="22" height="6" fill="#1a1a2e"/>
      <rect x="29" y="105" width="4"  height="2" fill="#2a2a44"/>
      <rect x="34" y="105" width="4"  height="2" fill="#2a2a44"/>
      <rect x="39" y="105" width="4"  height="2" fill="#2a2a44"/>
      <rect x="29" y="108" width="12" height="2" fill="#2a2a44"/>

      {/* 책상 2 (오른쪽) */}
      <rect x="170" y="100" width="70" height="8"  fill="#2d1f14"/>
      <rect x="170" y="100" width="70" height="2"  fill="#3d2a1a"/>
      <rect x="172" y="108" width="6"  height="22" fill="#241810"/>
      <rect x="232" y="108" width="6"  height="22" fill="#241810"/>

      {/* 모니터 2 */}
      <rect x="182" y="78" width="30" height="22" fill="#0d0d1a"/>
      <rect x="182" y="78" width="30" height="2"  fill="#ff5c39" opacity=".8"/>
      <rect x="182" y="78" width="2"  height="22" fill="#1e1e2e"/>
      <rect x="210" y="78" width="2"  height="22" fill="#1e1e2e"/>
      <rect x="182" y="98" width="30" height="2"  fill="#1e1e2e"/>
      <rect x="184" y="82" width="20" height="2" fill="#ff5c39" opacity=".5"/>
      <rect x="184" y="86" width="14" height="2" fill="#ffffff" opacity=".2"/>
      <rect x="184" y="90" width="18" height="2" fill="#ffffff" opacity=".2"/>
      <rect x="184" y="94" width="10" height="2" fill="#ffffff" opacity=".15"/>
      <rect x="194" y="100" width="6"  height="2" fill="#1e1e2e"/>
      <rect x="190" y="102" width="14" height="2" fill="#1e1e2e"/>

      {/* 키보드 2 */}
      <rect x="178" y="104" width="22" height="6" fill="#1a1a2e"/>
      <rect x="179" y="105" width="4"  height="2" fill="#2a2a44"/>
      <rect x="184" y="105" width="4"  height="2" fill="#2a2a44"/>
      <rect x="189" y="105" width="4"  height="2" fill="#2a2a44"/>
      <rect x="179" y="108" width="12" height="2" fill="#2a2a44"/>

      {/* 가운데 의자 (빈 자리 - 먼지 강조) */}
      <rect x="108" y="108" width="44" height="6"  fill="#1e1810"/>
      <rect x="108" y="108" width="44" height="2"  fill="#2a2214"/>
      <rect x="116" y="114" width="6"  height="16" fill="#1a1408"/>
      <rect x="138" y="114" width="6"  height="16" fill="#1a1408"/>
      <rect x="112" y="122" width="36" height="4"  fill="#1a1408"/>
      {/* 먼지 파티클 */}
      <rect x="118" y="104" width="4" height="4" fill="#ff5c39" opacity=".7"/>
      <rect x="128" y="100" width="4" height="4" fill="#ff5c39" opacity=".5"/>
      <rect x="140" y="106" width="4" height="4" fill="#ff5c39" opacity=".6"/>
      <rect x="124" y="96"  width="2" height="2" fill="#ff5c39" opacity=".4"/>
      <rect x="136" y="98"  width="2" height="2" fill="#ff5c39" opacity=".3"/>

      {/* 파티션 */}
      <rect x="100" y="60" width="6" height="70" fill="#1e1e32"/>
      <rect x="100" y="60" width="2" height="70" fill="#2a2a44"/>
      <rect x="154" y="60" width="6" height="70" fill="#1e1e32"/>
      <rect x="154" y="60" width="2" height="70" fill="#2a2a44"/>

      {/* 파티션 얼룩 (오염 표시) */}
      <rect x="102" y="75" width="4" height="4" fill="#ff5c39" opacity=".6"/>
      <rect x="102" y="82" width="4" height="2" fill="#ff5c39" opacity=".4"/>
      <rect x="156" y="70" width="4" height="6" fill="#ff5c39" opacity=".5"/>

      {/* 바닥 먼지들 */}
      <rect x="95"  y="128" width="6" height="2" fill="#ff5c39" opacity=".3"/>
      <rect x="145" y="126" width="4" height="2" fill="#ff5c39" opacity=".25"/>
      <rect x="160" y="128" width="8" height="2" fill="#ff5c39" opacity=".2"/>
    </svg>
  );
}

// ── 오프닝 화면 ─────────────────────────────────────────────────
function OpeningScreen({ onStart }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#09091a", position: "relative", overflow: "hidden",
      padding: "32px 24px",
    }}>
      <style>{`
        @keyframes scan     { 0%{top:-5%} 100%{top:110%} }
        @keyframes floatUp  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes titleIn  { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes subtitleIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes btnBlink { 0%,100%{opacity:1} 50%{opacity:.6} }
        @keyframes dustFloat1 { 0%,100%{transform:translate(0,0) rotate(0deg);opacity:.4} 33%{transform:translate(4px,-6px) rotate(10deg);opacity:.7} 66%{transform:translate(-3px,-3px) rotate(-5deg);opacity:.5} }
        @keyframes dustFloat2 { 0%,100%{transform:translate(0,0);opacity:.3} 50%{transform:translate(-5px,-8px);opacity:.6} }
        @keyframes dustFloat3 { 0%,100%{transform:translate(0,0) rotate(0deg);opacity:.35} 40%{transform:translate(6px,-5px) rotate(15deg);opacity:.6} }
        @keyframes glowPulse { 0%,100%{opacity:.15} 50%{opacity:.3} }
      `}</style>

      {/* 배경 그리드 */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(${RED}08 1px, transparent 1px),
                          linear-gradient(90deg, ${RED}08 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }} />

      {/* 스캔라인 */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: "2px",
        background: "linear-gradient(transparent,#ffffff0a,transparent)",
        animation: "scan 4s linear infinite", pointerEvents: "none",
      }} />

      {/* 코너 장식 */}
      {[
        { top: 12, left: 12 },
        { top: 12, right: 12 },
        { bottom: 12, left: 12 },
        { bottom: 12, right: 12 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute", ...pos,
          width: 16, height: 16,
          borderTop: i < 2 ? `2px solid ${RED}44` : "none",
          borderBottom: i >= 2 ? `2px solid ${RED}44` : "none",
          borderLeft: (i === 0 || i === 2) ? `2px solid ${RED}44` : "none",
          borderRight: (i === 1 || i === 3) ? `2px solid ${RED}44` : "none",
        }} />
      ))}

      {/* 배경 글로우 */}
      <div style={{
        position: "absolute", width: 280, height: 280,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${RED}18 0%, transparent 70%)`,
        animation: "glowPulse 3s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* 픽셀 오피스 일러스트 */}
      <div style={{
        position: "relative", marginBottom: 24,
        animation: "floatUp 4s ease-in-out infinite",
      }}>
        <PixelOffice />

        {/* 떠다니는 먼지 이모지 */}
        <div style={{ position: "absolute", top: 8,  left: 20,  fontSize: 14, animation: "dustFloat1 3.2s ease-in-out infinite" }}>🦠</div>
        <div style={{ position: "absolute", top: 20, right: 18, fontSize: 12, animation: "dustFloat2 2.8s ease-in-out infinite" }}>💨</div>
        <div style={{ position: "absolute", top: 0,  left: "50%",fontSize: 11, animation: "dustFloat3 3.5s ease-in-out infinite" }}>🌫️</div>
      </div>

      {/* 타이틀 */}
      <div style={{
        fontFamily: PIXEL, fontSize: 9, color: RED,
        letterSpacing: 2, marginBottom: 14, textAlign: "center",
        animation: "titleIn .6s both",
        textShadow: `0 0 20px ${RED}66`,
      }}>OFFICE DETOX</div>

      {/* 메인 멘트 */}
      <div style={{
        fontFamily: KO, fontWeight: 700, fontSize: 20,
        color: LIGHT, textAlign: "center",
        lineHeight: 1.6, marginBottom: 8,
        animation: "subtitleIn .6s .1s both",
      }}>우리 사무실 청결도 점검하기!</div>

      <div style={{
        fontFamily: KO, fontSize: 13, color: "#666",
        textAlign: "center", lineHeight: 1.8, marginBottom: 32,
        animation: "subtitleIn .6s .2s both",
      }}>
        13가지 항목으로 확인하는<br/>
        우리 사무실 오염·공간 진단
      </div>

      {/* 시작 버튼 */}
      <button
        onClick={onStart}
        style={{
          fontFamily: PIXEL, fontSize: 10,
          padding: "16px 36px",
          background: RED, color: "#fff",
          border: "none", cursor: "pointer",
          boxShadow: `4px 4px 0 #7a1a00, 0 0 24px ${RED}44`,
          letterSpacing: 1,
          animation: "subtitleIn .6s .3s both",
          transition: "transform .1s, box-shadow .1s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translate(-1px,-1px)";
          e.currentTarget.style.boxShadow = `6px 6px 0 #7a1a00, 0 0 32px ${RED}66`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = `4px 4px 0 #7a1a00, 0 0 24px ${RED}44`;
        }}
        onMouseDown={e => {
          e.currentTarget.style.transform = "translate(2px,2px)";
          e.currentTarget.style.boxShadow = `2px 2px 0 #7a1a00`;
        }}
        onMouseUp={e => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = `4px 4px 0 #7a1a00, 0 0 24px ${RED}44`;
        }}
      >▶ GAME START</button>

      {/* 하단 힌트 */}
      <div style={{
        position: "absolute", bottom: 18,
        fontFamily: PIXEL, fontSize: 6, color: "#333",
        letterSpacing: 1, animation: "btnBlink 2s infinite",
      }}>PRESS START</div>
    </div>
  );
}

// ── 결과 화면 ────────────────────────────────────────────────────
function ResultScreen({ checks, onRetry }) {
  const cleanCnt = SECTIONS[0].items.filter((_, i) => checks[`clean-${i}`]).length;
  const moveCnt  = SECTIONS[1].items.filter((_, i) => checks[`move-${i}`]).length;
  const total    = cleanCnt + moveCnt;
  const overall  = getOverall(total);
  const cleanLevel = getSecLevel(cleanCnt, SECTIONS[0].items.length);
  const moveLevel  = getSecLevel(moveCnt,  SECTIONS[1].items.length);
  const needCleaning = cleanCnt >= 2;
  const needMove     = moveCnt  >= 3;
  const noBad        = !needCleaning && !needMove;

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#09091a", position: "relative" }}>
      <style>{`
        @keyframes gradePop  { 0%{transform:scale(.6);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ctaBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes scan      { 0%{top:-5%} 100%{top:110%} }
        @keyframes urgentGlow { 0%,100%{text-shadow:0 0 20px ${RED}66,4px 4px 0 #000} 50%{text-shadow:0 0 40px ${RED}cc,4px 4px 0 #000} }
      `}</style>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(${RED}06 1px, transparent 1px), linear-gradient(90deg, ${RED}06 1px, transparent 1px)`,
        backgroundSize: "22px 22px",
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, height: "2px",
        background: "linear-gradient(transparent,#ffffff08,transparent)",
        animation: "scan 5s linear infinite", pointerEvents: "none",
      }} />

      <div style={{ padding: "28px 22px 36px", position: "relative", zIndex: 1 }}>
        {/* 종합 등급 */}
        <div style={{ textAlign: "center", marginBottom: 28, animation: "gradePop .5s both" }}>
          <div style={{ fontFamily: PIXEL, fontSize: 7, color: "#444", letterSpacing: 4, marginBottom: 14 }}>OFFICE RISK LEVEL</div>
          <div style={{
            fontFamily: PIXEL, fontSize: 34, color: RED,
            textShadow: `0 0 30px ${RED}88, 4px 4px 0 #000`,
            lineHeight: 1.2, marginBottom: 8,
            animation: overall.urgent ? "urgentGlow 1.5s ease-in-out infinite" : "none",
          }}>{overall.grade}</div>
          <div style={{
            display: "inline-block", fontFamily: KO, fontWeight: 700, fontSize: 13,
            color: "#000", background: RED, padding: "4px 16px", marginBottom: 20,
          }}>{overall.label}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 8 }}>
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div key={i} style={{
                width: 9, height: 9,
                background: i < total ? RED : "#1e1e32",
                border: `1px solid ${i < total ? RED : "#2a2a44"}`,
                boxShadow: i < total ? `0 0 5px ${RED}88` : "none",
                transition: `all .12s ${i * .03}s`,
              }} />
            ))}
          </div>
          <div style={{ fontFamily: KO, fontSize: 12, color: RED, marginBottom: 22 }}>{total}개 항목에서 문제 감지</div>
          <div style={{ fontFamily: KO, fontWeight: 700, fontSize: 18, color: LIGHT, lineHeight: 1.7, marginBottom: 10, whiteSpace: "pre-line" }}>{overall.headline}</div>
          <div style={{ fontFamily: KO, fontSize: 14, color: "#777", lineHeight: 1.9, whiteSpace: "pre-line" }}>{overall.desc}</div>
        </div>

        <div style={{ height: 1, background: "#1e1e32", marginBottom: 20 }} />

        {/* 파트별 결과 */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24, animation: "fadeUp .4s .2s both" }}>
          {[
            { sec: SECTIONS[0], level: cleanLevel, cnt: cleanCnt },
            { sec: SECTIONS[1], level: moveLevel,  cnt: moveCnt  },
          ].map(({ sec, level, cnt }) => {
            const isDanger = level === "DANGER" || level === "WARNING";
            return (
              <div key={sec.id} style={{
                flex: 1, border: `2px solid ${isDanger ? RED + "55" : "#2a2a44"}`,
                background: isDanger ? `${RED}0a` : "#0c0c1e", padding: "14px 12px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 18 }}>{sec.icon}</span>
                  <span style={{ fontFamily: KO, fontSize: 12, color: "#bbb", fontWeight: 700 }}>{sec.label}</span>
                </div>
                <div style={{
                  display: "inline-block", fontFamily: PIXEL, fontSize: 7,
                  color: isDanger ? "#000" : "#888", background: isDanger ? RED : "#1e1e32",
                  padding: "3px 8px", marginBottom: 10,
                }}>{level}</div>
                <div style={{ height: 5, background: "#1e1e32", overflow: "hidden", marginBottom: 8 }}>
                  <div style={{
                    height: "100%", width: `${(cnt / sec.items.length) * 100}%`,
                    background: isDanger ? RED : "#3a3a5c",
                    boxShadow: isDanger ? `0 0 6px ${RED}88` : "none",
                    transition: "width .5s ease",
                  }} />
                </div>
                <div style={{ fontFamily: KO, fontSize: 11, color: isDanger ? RED : "#555" }}>{cnt}/{sec.items.length} 감지</div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "fadeUp .4s .35s both" }}>
          {(needCleaning || noBad) && (
            <a href={INQUIRY_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <div style={{
                fontFamily: KO, fontWeight: 700, fontSize: 15,
                padding: "16px 20px", cursor: "pointer",
                background: LIGHT, color: DARK,
                border: `2px solid ${LIGHT}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: `4px 4px 0 ${DARK}`,
                animation: needCleaning ? "ctaBounce 2s ease-in-out infinite" : "none",
                letterSpacing: .3,
              }}>
                <span>🧹 오피스 클리닝 알아보기</span>
                <span style={{ fontFamily: PIXEL, fontSize: 10 }}>▶</span>
              </div>
            </a>
          )}
          {(needMove || noBad) && (
            <a href={INQUIRY_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <div style={{
                fontFamily: KO, fontWeight: 700, fontSize: 15,
                padding: "16px 20px", cursor: "pointer",
                background: DARK, color: LIGHT,
                border: `2px solid ${DARK}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: `4px 4px 0 #000`,
                animation: needMove ? "ctaBounce 2s .2s ease-in-out infinite" : "none",
                letterSpacing: .3,
              }}>
                <span>📦 무브 서비스 알아보기</span>
                <span style={{ fontFamily: PIXEL, fontSize: 10 }}>▶</span>
              </div>
            </a>
          )}
          <button onClick={onRetry} style={{
            fontFamily: PIXEL, fontSize: 7, padding: "11px", background: "transparent",
            color: "#333", border: "1px solid #2a2a44", cursor: "pointer",
            letterSpacing: 1, marginTop: 4,
          }}>↺ RETRY</button>
        </div>
      </div>
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────────
export default function OfficeDetox() {
  const [checks, setChecks]               = useState({});
  const [phase, setPhase]                 = useState("opening"); // opening | game | result
  const [activeSection, setActiveSection] = useState(0);

  const totalChecked = Object.values(checks).filter(Boolean).length;
  const char = getChar(totalChecked);

  const sectionChecked = id =>
    SECTIONS.find(s => s.id === id).items.filter((_, i) => checks[`${id}-${i}`]).length;

  const toggle = (sid, idx) =>
    setChecks(prev => ({ ...prev, [`${sid}-${idx}`]: !prev[`${sid}-${idx}`] }));

  const handleRetry = () => { setChecks({}); setPhase("opening"); setActiveSection(0); };

  const gaugeColor = totalChecked === 0 ? "#2a2a44"
    : totalChecked <= 4 ? `${RED}88`
    : totalChecked <= 8 ? `${RED}bb`
    : RED;

  return (
    <div style={{
      width: 420, maxWidth: "100vw", minHeight: 640,
      background: "#09091a",
      display: "flex", flexDirection: "column",
      border: `3px solid #1a1a2e`,
      boxShadow: `6px 6px 0 #000`,
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Noto+Sans+KR:wght@400;700&display=swap');
        @keyframes sweat { 0%{opacity:0;transform:translateY(-4px)} 25%{opacity:1} 100%{opacity:0;transform:translateY(12px)} }
        @keyframes charShake { 0%,100%{transform:rotate(0deg) translateX(0)} 25%{transform:rotate(-5deg) translateX(-3px)} 75%{transform:rotate(5deg) translateX(3px)} }
        @keyframes charFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes itemIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes badgePop { 0%{transform:scale(0) rotate(-10deg)} 70%{transform:scale(1.2) rotate(2deg)} 100%{transform:scale(1) rotate(0deg)} }
        @keyframes scan { 0%{top:-5%} 100%{top:110%} }
        @keyframes labelPulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .check-row:hover { background: rgba(255,92,57,.05) !important; }
        .next-btn:hover  { background: rgba(255,255,255,.05) !important; }
      `}</style>

      {/* 오프닝 */}
      {phase === "opening" && <OpeningScreen onStart={() => setPhase("game")} />}

      {/* 게임 헤더 (game/result 공통) */}
      {phase !== "opening" && (
        <div style={{
          background: "#06060f", padding: "14px 18px",
          borderBottom: "2px solid #1a1a2e",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", left: 0, right: 0, height: "2px",
            background: "linear-gradient(transparent,#ffffff08,transparent)",
            animation: "scan 4s linear infinite", pointerEvents: "none",
          }} />
          <div>
            <div style={{ fontFamily: PIXEL, fontSize: 9, color: RED, letterSpacing: 2, marginBottom: 5 }}>OFFICE DETOX</div>
            <div style={{ fontFamily: KO, fontSize: 12, color: "#555" }}>우리 사무실 공간 진단</div>
          </div>
          <div style={{
            fontFamily: PIXEL, fontSize: 8, color: totalChecked > 0 ? RED : "#444",
            background: "#ffffff08", padding: "6px 10px",
            border: `1px solid ${totalChecked > 0 ? RED + "44" : "#1e1e2e"}`,
            transition: "all .3s",
          }}>
            {String(totalChecked).padStart(2,"0")}<span style={{ color: "#333" }}>/{String(TOTAL).padStart(2,"0")}</span>
          </div>
        </div>
      )}

      {/* 결과 */}
      {phase === "result" && (
        <>
          <div style={{ background: "#06060f", padding: "10px 18px", borderBottom: "1px solid #1a1a2e", flexShrink: 0 }}>
            <span style={{ fontFamily: PIXEL, fontSize: 7, color: "#444", letterSpacing: 2 }}>RESULT</span>
          </div>
          <ResultScreen checks={checks} onRetry={handleRetry} />
        </>
      )}

      {/* 게임 */}
      {phase === "game" && (
        <>
          {/* 캐릭터 패널 */}
          <div style={{
            background: "#0c0c1e", padding: "16px 18px 14px",
            borderBottom: "2px solid #1a1a2e",
            display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
          }}>
            <div style={{ position: "relative", flexShrink: 0, width: 54 }}>
              <div style={{
                fontSize: 46, lineHeight: 1, display: "inline-block",
                animation: char.shake ? "charShake .4s ease-in-out infinite" : "charFloat 2.5s ease-in-out infinite",
                filter: totalChecked >= 7 ? `drop-shadow(0 0 10px ${RED}99)` : "none",
              }}>{char.face}</div>
              <SweatDrops count={char.sweat} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: KO, fontWeight: 700, fontSize: 14,
                color: totalChecked > 0 ? RED : "#555", marginBottom: 9,
                transition: "color .4s",
                animation: char.shake ? "labelPulse .6s infinite" : "none",
              }}>{char.label}</div>
              <div style={{ height: 10, background: "#14142a", border: "1px solid #2a2a44", overflow: "hidden", marginBottom: 6 }}>
                <div style={{
                  height: "100%", width: `${(totalChecked / TOTAL) * 100}%`,
                  background: gaugeColor,
                  boxShadow: totalChecked > 6 ? `0 0 10px ${RED}88` : "none",
                  transition: "width .35s ease, background .4s",
                }} />
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {Array.from({ length: TOTAL }).map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 4,
                    background: i < totalChecked ? RED : "#1e1e32",
                    transition: `background .15s ${i * .02}s`,
                    boxShadow: i < totalChecked ? `0 0 4px ${RED}88` : "none",
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* 체크리스트 */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {SECTIONS.map((sec, si) => {
              const unlocked = si === 0 || activeSection >= si;
              const cnt = sectionChecked(sec.id);
              return (
                <div key={sec.id} style={{ opacity: unlocked ? 1 : 0.2, pointerEvents: unlocked ? "auto" : "none", transition: "opacity .4s" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "12px 18px 10px", background: "#0c0c1e",
                    borderTop: si > 0 ? "2px solid #1a1a2e" : "none",
                    borderLeft: `3px solid ${cnt > 0 ? RED : "#2a2a44"}`,
                    position: "sticky", top: 0, zIndex: 5, transition: "border-color .3s",
                  }}>
                    <span style={{ fontSize: 18 }}>{sec.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: PIXEL, fontSize: 7, color: cnt > 0 ? RED : "#444", letterSpacing: 1, marginBottom: 3, transition: "color .3s" }}>{sec.tag}</div>
                      <div style={{ fontFamily: KO, fontWeight: 700, fontSize: 13, color: "#ccc" }}>{sec.label}</div>
                    </div>
                    {cnt > 0 && (
                      <div style={{ fontFamily: KO, fontWeight: 700, fontSize: 11, background: RED, color: "#fff", padding: "4px 10px", animation: "badgePop .25s both" }}>{cnt}개 감지</div>
                    )}
                  </div>
                  <div>
                    {sec.items.map((item, ii) => {
                      const key = `${sec.id}-${ii}`;
                      const checked = !!checks[key];
                      return (
                        <div key={ii} className="check-row" onClick={() => toggle(sec.id, ii)} style={{
                          display: "flex", alignItems: "flex-start", gap: 12,
                          padding: "12px 18px",
                          borderLeft: checked ? `3px solid ${RED}` : "3px solid transparent",
                          background: checked ? `${RED}0d` : "transparent",
                          borderBottom: "1px solid #12122a", cursor: "pointer",
                          animation: `itemIn .2s ${ii * .04}s both`,
                          transition: "background .12s, border-color .12s",
                        }}>
                          <div style={{ paddingTop: 2 }}>
                            <Checkbox checked={checked} onClick={() => toggle(sec.id, ii)} />
                          </div>
                          <div style={{ fontFamily: KO, fontSize: 14, lineHeight: 1.7, color: checked ? LIGHT : "#777", transition: "color .12s", flex: 1 }}>{item}</div>
                        </div>
                      );
                    })}
                  </div>
                  {si === 0 && activeSection === 0 && (
                    <div style={{ padding: "14px 18px", background: "#0a0a18" }}>
                      <button className="next-btn" onClick={() => setActiveSection(1)} style={{
                        fontFamily: KO, fontWeight: 700, fontSize: 13,
                        width: "100%", padding: "13px", background: "transparent",
                        color: LIGHT, border: `2px solid #2a2a44`, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        transition: "background .15s",
                      }}>
                        공간·배치 문제도 확인하기
                        <span style={{ fontFamily: PIXEL, fontSize: 8 }}>▶</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 결과 보기 버튼 */}
          {activeSection === 1 && (
            <div style={{ padding: "12px 18px 18px", borderTop: "2px solid #1a1a2e", background: "#06060f", flexShrink: 0 }}>
              <button onClick={() => setPhase("result")} style={{
                fontFamily: KO, fontWeight: 700, fontSize: 15,
                width: "100%", padding: "16px",
                background: totalChecked >= 4 ? RED : DARK,
                color: "#fff",
                border: `2px solid ${totalChecked >= 4 ? RED : "#3a3a5a"}`,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: totalChecked >= 4 ? `4px 4px 0 #7a1a00, 0 0 20px ${RED}44` : "4px 4px 0 #000",
                transition: "background .3s, border .3s, box-shadow .3s",
              }}>
                {totalChecked >= 7 ? "🚨" : totalChecked >= 4 ? "⚠️" : "📋"}
                <span>진단 결과 보기</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}