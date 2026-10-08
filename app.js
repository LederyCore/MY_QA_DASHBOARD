(() => {
"use strict";
/* ---------- 저장 때문에 페이지가 새로 고쳐지지 않게 ----------
   VS Code Live Server는 폴더 안 파일이 바뀌면 페이지에 'reload' 신호를 보내 새로 고칩니다.
   이 앱이 데이터·첨부 파일을 쓴 직후(5초 안)의 신호는 무시하고, app.js·index.html을 직접 고쳤을 때의 새로 고침은 그대로 둡니다. */
let selfWriteAt = 0;
const markWrite = () => { selfWriteAt = Date.now(); };
(() => {
  const FH = window.FileSystemFileHandle?.prototype, DH = window.FileSystemDirectoryHandle?.prototype;
  if (FH?.createWritable) { const cw = FH.createWritable; FH.createWritable = function (...a) { markWrite(); return cw.apply(this, a).then(w => { const close = w.close.bind(w); w.close = (...b) => close(...b).finally(markWrite); return w; }); }; }
  if (DH?.removeEntry) { const re = DH.removeEntry; DH.removeEntry = function (...a) { markWrite(); return re.apply(this, a).finally(markWrite); }; }
  const WS = window.WebSocket; if (!WS) return;
  const Guard = function (url, protocols) {
    const ws = protocols === undefined ? new WS(url) : new WS(url, protocols);
    if (!/\/ws\/?$/.test(String(url))) return ws;                        /* Live Server 연결만 */
    let handler = null;
    Object.defineProperty(ws, "onmessage", { configurable: true, get: () => handler, set: fn => { handler = fn; } });
    ws.addEventListener("message", e => {
      if (e.data === "reload" && Date.now() - selfWriteAt < 5000) { console.info("[대시보드] 데이터 저장으로 인한 새로 고침을 건너뜀"); return; }
      handler?.call(ws, e);
    });
    return ws;
  };
  Guard.prototype = WS.prototype; ["CONNECTING", "OPEN", "CLOSING", "CLOSED"].forEach(k => { Guard[k] = WS[k]; });
  window.WebSocket = Guard;
})();
const LS_KEY = "qa-dashboard-config-v3";
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const fmt = v => typeof v === "number" ? v.toLocaleString("ko-KR", { maximumFractionDigits: 2 }) : esc(v);
const SERIES = ["--s1", "--s2", "--s3", "--s4"];
const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

/* ---------- config 로드 (파일 → 브라우저 저장본이 있으면 우선) ---------- */
const FILE_CFG = window.DASHBOARD_CONFIG || { pages: [] };
let cfg, usingLocal = false, hadCache = false;
function load() {
  cfg = structuredClone(FILE_CFG);
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) { cfg = JSON.parse(raw); usingLocal = true; hadCache = true; upgrade(cfg); resetAttachOnce(cfg); }
  } catch (e) { usingLocal = false; }
}
/* 첨부 파일 초기화(2026-10-08 요청): 브라우저 저장본의 첨부 연결·사용 횟수·삭제 대기 목록을 한 번 비웁니다 */
function resetAttachOnce(c) {
  if ((c.migr ||= {}).attachReset1) return;
  (c.datasets || []).forEach(d => { const keys = (d.fields || []).filter(f => f.type === "file").map(f => f.key); (d.records || []).forEach(r => keys.forEach(k => { if (k in r) r[k] = []; })); });
  c.fileRefs = {}; c.migr.attachReset1 = true;
  try { localStorage.removeItem("qa-dashboard-delq"); sessionStorage.removeItem("qa-dashboard-reopen"); localStorage.setItem(LS_KEY, JSON.stringify(c)); } catch (e) {}
}
function upgrade(c) {
  c.datasets ||= [];
  if ((c.migr ||= {}).upg1) return;                  /* 아래 보정은 한 번만 (지운 데이터·항목이 되살아나지 않게) */
  c.migr.upg1 = true;
  const file = FILE_CFG.datasets || [];
  file.filter(d => d.master && !c.datasets.some(x => x.id === d.id)).forEach(d => c.datasets.unshift(structuredClone(d)));
  file.forEach(fd => {
    const ld = c.datasets.find(x => x.id === fd.id); if (!ld) return;
    (fd.fields || []).filter(f => f.type === "ref").forEach(f => {
      const lf = (ld.fields || []).find(x => x.key === f.key);
      if (lf && (lf.type === "select" || lf.type === "text")) Object.assign(lf, { type: "ref", ref: f.ref, options: undefined, badge: undefined, auto: undefined });
    });
    (fd.fields || []).filter(f => f.type === "file" && !(ld.fields || []).some(x => x.key === f.key)).forEach(f => (ld.fields ||= []).push(structuredClone(f)));   /* 새 사진·파일 항목 */
    (fd.fields || []).filter(f => f.type === "select").forEach(f => {          /* 자유 입력 분류 → 선택 목록 */
      const lf = (ld.fields || []).find(x => x.key === f.key);
      if (lf && lf.type === "text" && !lf.auto) Object.assign(lf, { type: "select", options: [...new Set([...(f.options || []), ...(ld.records || []).map(r => r[f.key]).filter(v => v !== undefined && v !== null && v !== "")])] });
    });
  });
}
function persist() {
  fver++;
  try { spawnRepeats(); } catch (e) {}              /* 반복 일정: 완료된 정기 업무의 다음 일정 */
  try { trashPrune(); } catch (e) {}
  try { logChanges(); } catch (e) {}                 /* 최근 변경 내역 */
  (cfg.migr ||= {}).attachReset1 = true;           /* 초기화는 기존 저장본에 한 번만 */
  try { const prev = cfg.fileRefs || {}, now = fileRefCounts(); cfg.fileRefs = now; Object.keys(prev).filter(k => !now[k]).forEach(scheduleFileDelete); } catch (e) {}
  try { localStorage.setItem(LS_KEY, JSON.stringify(cfg)); usingLocal = true; } catch (e) {}
  try { scheduleStore(); } catch (e) {}                 /* data 폴더의 JSON 파일에도 저장 */
}
load();

/* ---------- 상태 매핑 ---------- */
const STATUS = {
  good: "good", warning: "warning", serious: "serious", critical: "critical",
  "정상": "good", "완료": "good", "양호": "good", "승인": "good",
  "진행중": "info", "진행": "info",
  "대기": "neutral", "예정": "neutral",
  "주의": "warning", "지연": "serious", "심각": "critical", "긴급": "critical", "불합격": "critical",
  "접수": "neutral", "조사중": "warning", "대책수립": "info", "조치중": "warning"
};
const STATUS_LABEL = { good: "양호", warning: "주의", serious: "경고", critical: "긴급" };
/* 노션식 태그: 선택 목록(상태 아님) 옵션마다 색을 지정 */
const PALETTE = [["gray", "회색"], ["brown", "갈색"], ["orange", "주황"], ["yellow", "노랑"], ["green", "초록"], ["blue", "파랑"], ["purple", "보라"], ["pink", "분홍"], ["red", "빨강"]];
const PALETTE_AUTO = ["blue", "green", "orange", "purple", "pink", "yellow", "red", "brown", "gray"];
const isTagF = f => f && f.type === "select" && !f.badge;          /* 색 태그로 보이는 분류 (상태 제외) */
const isPickF = f => f && f.type === "select";                       /* 노션식으로 고르거나 바로 추가하는 분류 */
const tagColor = (f, v) => f?.colors?.[v] || (i => i < 0 ? "gray" : PALETTE_AUTO[i % PALETTE_AUTO.length])((f?.options || []).indexOf(v));
const tagChip = (f, v) => blank(v) ? "" : `<span class="tag c-${tagColor(f, v)}">${esc(v)}</span>`;
const chipFor = (f, v) => Array.isArray(v) ? v.filter(x => typeof x === "string").map(x => chipFor(f, x)).join(" ") : blank(v) ? "" : f?.badge && !f.colors?.[v] ? pill(v) : tagChip(f, v);   /* 상태는 기본 상태색, 색을 지정하면 태그색 */
const pill = (txt, key) => txt === undefined || txt === "" ? "" : `<span class="pill st-${STATUS[key ?? txt] || "neutral"}">${esc(txt)}</span>`;

/* ---------- 데이터 & 집계 엔진 ----------
   위젯/지표의 src = { ds, agg, field, field2, scale, filter:[{f,op,v}], period, dateField, ... }
   기록이 추가·수정되면 화면을 그릴 때마다 다시 계산됩니다. */
const REAL_TODAY = () => new Date().toLocaleDateString("sv-SE");
let asOf = null;                                   /* 기준일 (null = 실제 오늘) */
const TODAY = () => asOf || REAL_TODAY();
const ymOf = d => String(d || "").slice(0, 7);
function ymAdd(ym, n) { let [y, m] = ym.split("-").map(Number); m += n; while (m < 1) { m += 12; y--; } while (m > 12) { m -= 12; y++; } return `${y}-${String(m).padStart(2, "0")}`; }
const ymLabel = (ym, withYear) => { const [y, m] = ym.split("-"); return (withYear ? y.slice(2) + "년 " : "") + (+m) + "월"; };
const lastMonths = n => { const end = ymOf(TODAY()); return Array.from({ length: n }, (_, i) => ymAdd(end, i - n + 1)); };
const dsById = id => (cfg.datasets || []).find(d => d.id === id);
/* 목록 참조(ref) 필드는 참조한 기준 정보 목록의 항목 이름이 선택지가 됩니다 */
let fver = 0; const fcache = new WeakMap();
function masterValues(id) {
  const m = (cfg.datasets || []).find(d => d.id === id); if (!m) return [];
  const k = titleKeyOf(m); return k ? [...new Set((m.records || []).map(r => r[k]).filter(v => !blank(v)).map(String))] : [];
}
const dsFields = ds => {
  if (!ds) return [];
  const c = fcache.get(ds); if (c && c.v === fver) return c.f;
  const f = (ds.fields || []).map(x => x.type === "ref" ? { ...x, type: "select", options: masterValues(x.ref), refType: true, colors: dsById(x.ref)?.colors } : x);
  fcache.set(ds, { v: fver, f }); return f;
};
const newId = () => "r" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const fieldOf = (ds, k) => dsFields(ds).find(f => f.key === k);
const isNumF = f => f && (f.type === "number" || f.type === "days" || f.type === "formula" || f.type === "rollup");
const daysBetween = (a, b) => a && b ? Math.round((new Date(b) - new Date(a)) / 864e5) : undefined;
const DONE = ["완료", "승인", "종료"];
const dateAt = (r, k) => k === "@today" ? TODAY() : r[k];
/* 기준일 시점으로 되돌린 기록: 기준일 이후 완료일은 지우고 상태를 미완료로 */
function recView(ds, r) {
  const o = { ...r }, F = dsFields(ds);
  if (asOf) F.forEach(f => {
    if (f.type !== "date" || !f.closes || blank(o[f.key]) || o[f.key] <= asOf) return;
    o[f.key] = "";
    const b = F.find(x => x.badge);
    if (b && DONE.includes(o[b.key])) { const op = b.options || [], i = op.indexOf(o[b.key]); o[b.key] = op.includes("진행중") ? "진행중" : op[Math.max(0, i - 1)]; }
  });
  F.forEach(f => { if (f.type === "days") o[f.key] = daysBetween(dateAt(o, f.from), dateAt(o, f.to)); });
  if (F.some(isCalcF)) calcFields(ds, o, F);                 /* 수식·롤업 */
  return o;
}
/* ---------- 수식·롤업 항목 (자동 계산, 노션처럼) ----------
   수식: {항목 이름}으로 다른 항목을 불러 + − × ÷ ( ) 와 round·if·min·max·abs·today 로 계산. 날짜끼리 빼면 일수.
   롤업: 이 기록을 고른 다른 데이터베이스의 기록들을 개수·합계·평균·최솟값·최댓값으로 집계 (조건 하나 가능). */
const isCalcF = f => !!f && (f.type === "formula" || f.type === "rollup");
const CALC_KO = { 반올림: "round", 절댓값: "abs", 최소: "min", 최대: "max", 만약: "if", 오늘: "today", 비어있음: "blank" };
function evalFormula(expr, o, F) {
  const s = String(expr ?? ""); if (!s.trim()) return { ok: false, err: "수식이 비어 있습니다" };
  const byLabel = new Map(F.map(f => [f.label, f])), byKey = new Map(F.map(f => [f.key, f]));
  let i = 0;
  const err = m => { throw new Error(m); };
  const ws = () => { while (i < s.length && /\s/.test(s[i])) i++; };
  const eat = t => { ws(); if (s.startsWith(t, i)) { i += t.length; return true; } return false; };
  const num = v => v === null || v === undefined || v === "" ? null : typeof v === "number" ? v : isNaN(+v) ? null : +v;
  const truthy = v => !(v === null || v === 0 || v === "" || v === false);
  const fieldVal = name => {
    const f = byLabel.get(name) || byKey.get(name); if (!f) err(`‘${name}’ 항목이 없습니다`);
    const v = o[f.key]; if (blank(v) || (Array.isArray(v) && !v.length)) return null;
    if (f.type === "date") return dnum(v);
    if (isNumF(f)) return num(v);
    return String(valText(v));
  };
  const FN = {
    round: (x, n = 0) => { x = num(x); if (x === null) return null; const p = 10 ** (num(n) || 0); return Math.round(x * p) / p; },
    abs: x => num(x) === null ? null : Math.abs(num(x)),
    min: (...a) => { a = a.map(num).filter(x => x !== null); return a.length ? Math.min(...a) : null; },
    max: (...a) => { a = a.map(num).filter(x => x !== null); return a.length ? Math.max(...a) : null; },
    if: (c, a, b = "") => truthy(c) ? a : b,
    today: () => dnum(TODAY()),
    blank: x => x === null || x === "" ? 1 : 0
  };
  const arith = (a, b, fn) => { a = num(a); b = num(b); return a === null || b === null ? null : fn(a, b); };
  function primary() {
    ws();
    if (eat("(")) { const v = compare(); if (!eat(")")) err("괄호 ) 가 빠졌습니다"); return v; }
    if (eat("{")) { const j = s.indexOf("}", i); if (j < 0) err("} 가 빠졌습니다"); const name = s.slice(i, j).trim(); i = j + 1; return fieldVal(name); }
    if (s[i] === '"' || s[i] === "'") { const q = s[i++], j = s.indexOf(q, i); if (j < 0) err("따옴표가 닫히지 않았습니다"); const t = s.slice(i, j); i = j + 1; return t; }
    const m = /^(\d+(\.\d+)?|\.\d+)/.exec(s.slice(i)); if (m) { i += m[0].length; return +m[0]; }
    const id = /^[A-Za-z가-힣_]+/.exec(s.slice(i));
    if (id) {
      const name = id[0], fn = FN[name.toLowerCase()] || FN[CALC_KO[name]]; if (!fn) err(`‘${name}’ 함수를 모릅니다. 항목은 {항목 이름}처럼 중괄호로 감싸세요`);
      i += name.length; if (!eat("(")) err(`${name} 뒤에 ( 가 필요합니다`);
      const args = []; if (!eat(")")) { do args.push(compare()); while (eat(",")); if (!eat(")")) err(`${name}( ) 의 ) 가 빠졌습니다`); }
      return fn(...args);
    }
    err(i >= s.length ? "수식이 덜 끝났습니다" : `‘${s[i]}’ 부분을 읽을 수 없습니다`);
  }
  function unary() { if (eat("-")) { const v = num(unary()); return v === null ? null : -v; } if (eat("+")) return num(unary()); return primary(); }
  function mul() { let v = unary(); for (;;) { if (eat("*") || eat("×")) v = arith(v, unary(), (a, b) => a * b); else if (eat("/") || eat("÷")) v = arith(v, unary(), (a, b) => b === 0 ? null : a / b); else return v; } }
  function add() {
    let v = mul();
    for (;;) {
      if (eat("&")) { const b = mul(); v = `${v ?? ""}${b ?? ""}`; }
      else if (eat("+")) { const b = mul(); v = (typeof v === "string" && num(v) === null) || (typeof b === "string" && num(b) === null) ? `${v ?? ""}${b ?? ""}` : arith(v, b, (x, y) => x + y); }
      else if (eat("-") || eat("−")) v = arith(v, mul(), (a, b) => a - b);
      else return v;
    }
  }
  function compare() {
    const a = add();
    for (const op of [">=", "<=", "!=", "<>", "==", "=", ">", "<"]) if (eat(op)) {
      const b = add(), n = num(a) !== null && num(b) !== null, x = n ? num(a) : String(a ?? ""), y = n ? num(b) : String(b ?? "");
      return ({ ">=": x >= y, "<=": x <= y, "!=": x !== y, "<>": x !== y, "==": x === y, "=": x === y, ">": x > y, "<": x < y })[op] ? 1 : 0;
    }
    return a;
  }
  try {
    const v = compare(); ws(); if (i < s.length) err(`‘${s.slice(i, i + 8)}’ 부분을 읽을 수 없습니다`);
    return { ok: true, v: typeof v === "number" ? (isFinite(v) ? Math.round(v * 1e6) / 1e6 : "") : v === null ? "" : v };
  } catch (e) { return { ok: false, err: e.message }; }
}
const RAGG = [["count", "개수"], ["sum", "합계"], ["avg", "평균"], ["min", "최솟값"], ["max", "최댓값"]];
const relOpts = ds => (cfg.datasets || []).flatMap(d2 => (d2.fields || []).filter(x => x.type === "ref" && x.ref === ds.id).map(x => [`${d2.id}:${x.key}`, `${d2.name} · ${x.label}`]));
let rollDepth = 0; const rollCache = new Map();
function rollupOf(ds, f, o) {
  const [rid, rk] = String(f.rel || "").split(":"), od = dsById(rid); if (!od || !rk) return "";
  const key = ds.id + "|" + f.key, c = rollCache.get(key);
  let m = c && c.v === fver && c.a === asOf && c.sig === JSON.stringify([f.rel, f.agg, f.field, f.where]) ? c.m : null;
  if (!m) {
    if (rollDepth > 2) return "";
    rollDepth++;
    try {
      m = new Map(); let L = visibleRecs(od).map(r => recView(od, r));
      const w = f.where; if (w?.f && w.op) L = L.filter(r => matchCond(r, w));
      const grp = new Map(); L.forEach(r => vals(r[rk]).forEach(v => { if (!grp.has(v)) grp.set(v, []); grp.get(v).push(r); }));
      grp.forEach((rs, v) => m.set(v, aggregate(rs, { agg: f.agg || "count", field: f.field })));
    } finally { rollDepth--; }
    rollCache.set(key, { v: fver, a: asOf, sig: JSON.stringify([f.rel, f.agg, f.field, f.where]), m });
  }
  const t = o[titleKeyOf(ds)]; if (blank(t)) return "";
  const v = m.get(String(t)); return v === undefined ? (!f.agg || f.agg === "count" || f.agg === "sum" ? 0 : "") : v;
}
function calcFields(ds, o, F) {
  F.filter(f => f.type === "rollup").forEach(f => { o[f.key] = rollupOf(ds, f, o); });
  const fs = F.filter(f => f.type === "formula");
  for (let pass = 0; pass < 2; pass++) fs.forEach(f => { const r = evalFormula(f.expr, o, F); o[f.key] = r.ok ? r.v : ""; });
}
const calcText = (f, v) => blank(v) ? "" : typeof v === "number" ? fmt(v) : esc(v);
/* 기록 팝업의 자동 계산 칸 (수식 오류는 이유를 보여 줌) */
function calcCellHTML(ds, f, rv) {
  if (f.type === "formula") { const r = evalFormula(f.expr, rv, dsFields(ds)); if (!r.ok) return `<div class="f ro calc-err" data-calc="${esc(f.key)}">수식 확인 필요: ${esc(r.err)}</div>`; }
  const v = rv[f.key]; return `<div class="f ro calc" data-calc="${esc(f.key)}">${blank(v) ? `<span class="tp-hint">자동 계산</span>` : calcText(f, v)}</div>`;
}
/* 항목 이름이 바뀌면 같은 데이터베이스의 수식 속 {이름}도 함께 */
function renameInExpr(ds, from, to) { (ds.fields || []).filter(x => x.type === "formula" && x.expr).forEach(x => { x.expr = x.expr.split(`{${from}}`).join(`{${to}}`); }); }
const calcDesc = (ds, f) => {
  if (f.type === "formula") return `수식${f.expr ? " · " + (f.expr.length > 26 ? f.expr.slice(0, 26) + "…" : f.expr) : ""}`;
  const [rid, rk] = String(f.rel || "").split(":"), od = dsById(rid), rf = (od?.fields || []).find(x => x.key === rk);
  const fl = (od?.fields || []).find(x => x.key === f.field)?.label;
  return od ? `롤업 · ${od.name}${rf ? "(" + rf.label + ")" : ""} ${f.agg && f.agg !== "count" ? `${fl || ""} ${(RAGG.find(a => a[0] === f.agg) || [, ""])[1]}` : "개수"}` : "롤업 · 관계 미지정";
};
/* 항목 메뉴(proppop) 안의 수식·롤업 설정 */
function calcPropHTML(ds, f) {
  if (f.type === "formula") {
    const F = dsFields(ds), first = visibleRecs(ds).at(-1), r = first ? evalFormula(f.expr, recView(ds, first), F) : null;
    return `<div class="tp-sec">수식</div>
      <textarea class="f pp-expr" id="ppExpr" rows="2" spellcheck="false" placeholder="예: {심각도 (S)} * {발생도 (O)} * {검출도 (D)}">${esc(f.expr || "")}</textarea>
      <div class="pp-fchips" aria-label="항목 넣기">${(ds.fields || []).filter(x => x.key !== f.key && x.type !== "file").map(x => `<button type="button" class="pp-fchip" data-ins="${esc(x.label)}">${esc(x.label)}</button>`).join("")}</div>
      <div class="pp-res" id="ppRes">${!f.expr ? "항목 이름을 눌러 넣고 + − × ÷ 로 계산하세요." : r ? (r.ok ? `최근 기록 결과: <b>${calcText(f, r.v) || "(빈 값)"}</b>` : `<span class="calc-bad">${esc(r.err)}</span>`) : "기록이 없어 결과를 미리 볼 수 없습니다."}</div>
      <div class="tp-hint pp-help">round(값, 자릿수) · if(조건, 참, 거짓) · min · max · abs · today() · 날짜끼리 빼면 일수 · 글자 잇기 &amp;</div>`;
  }
  const R = relOpts(ds), [rid] = String(f.rel || "").split(":"), od = dsById(rid), OF = od ? dsFields(od) : [];
  const sel = (id, o, v) => `<select class="f pp-mini" id="${id}">${o.map(([a, b]) => `<option value="${esc(a)}" ${a === (v ?? "") ? "selected" : ""}>${esc(b)}</option>`).join("")}</select>`;
  const w = f.where || {};
  return `<div class="tp-sec">롤업 (관계 집계)</div>
    ${R.length ? `<label class="tp-row pp-chk"><span class="pp-t"><i>↙</i>관계</span>${sel("ppRel", R, f.rel)}</label>
    <label class="tp-row pp-chk"><span class="pp-t"><i>∑</i>계산</span>${sel("ppRAgg", RAGG, f.agg || "count")}</label>
    ${f.agg && f.agg !== "count" ? `<label class="tp-row pp-chk"><span class="pp-t"><i>#</i>값 항목</span>${sel("ppRField", [["", "선택"], ...OF.filter(isNumF).map(x => [x.key, x.label])], f.field)}</label>` : ""}
    <label class="tp-row pp-chk"><span class="pp-t"><i>⚲</i>조건</span>${sel("ppRWF", [["", "모든 기록"], ...OF.filter(x => x.type !== "file").map(x => [x.key, x.label])], w.f)}</label>
    ${w.f ? `<div class="pp-where">${sel("ppRWOp", [["=", "같음"], ["!=", "같지 않음"], [">", "보다 큼"], ["<", "보다 작음"], ["empty", "비어 있음"], ["filled", "값 있음"]], w.op || "=")}${["empty", "filled"].includes(w.op) ? "" : `<input class="f pp-mini" id="ppRWV" value="${esc(w.v ?? "")}" list="dl-rwv" placeholder="값"><datalist id="dl-rwv">${[...new Set(visibleRecs(od).map(r => valText(r[w.f])).filter(v => !blank(v)).map(String))].slice(0, 60).map(v => `<option value="${esc(v)}"></option>`).join("")}</datalist>`}</div>` : ""}
    <div class="pp-res">예: ${esc(calcDesc(ds, f))}</div>`
    : `<div class="tp-lock">다른 데이터베이스에 이 데이터베이스(${esc(ds.name)})를 고르는 관계 항목이 있어야 롤업을 만들 수 있습니다.</div>`}`;
}
/* 기준일 이후에 생긴 기록은 숨김 (asOfField: 미지정=기준 날짜, ""=숨기지 않음) */
const asOfKey = ds => ds.asOfField === undefined || ds.asOfField === "@date" ? ds.dateField : ds.asOfField;
function visibleRecs(ds) {
  const k = asOfKey(ds), all = ds.records || [];
  return asOf && k ? all.filter(r => blank(r[k]) || r[k] <= asOf) : all;
}
const PERIODS = [["all", "전체 기간"], ["thisMonth", "이번 달"], ["lastMonth", "지난 달"], ["last3m", "최근 3개월"], ["last6m", "최근 6개월"], ["last12m", "최근 12개월"], ["ytd", "올해 누적"]];
const periodName = p => (PERIODS.find(x => x[0] === p) || [, ""])[1];
function periodRange(p) {
  const ym = ymOf(TODAY());
  switch (p) {
    case "thisMonth": return [ym, ym];
    case "lastMonth": { const l = ymAdd(ym, -1); return [l, l]; }
    case "last3m": return [ymAdd(ym, -2), ym];
    case "last6m": return [ymAdd(ym, -5), ym];
    case "last12m": return [ymAdd(ym, -11), ym];
    case "ytd": return [ym.slice(0, 4) + "-01", ym];
    default: return null;
  }
}
const OPS = [["=", "같음"], ["!=", "같지 않음"], [">", "보다 큼"], [">=", "이상"], ["<", "보다 작음"], ["<=", "이하"], ["~", "포함"], ["empty", "비어 있음"], ["filled", "값 있음"]];
const blank = v => v === undefined || v === null || v === "";
/* 여러 값(관계): 값 하나는 글자, 둘 이상은 목록으로 저장 */
const vals = v => Array.isArray(v) ? v.filter(x => typeof x === "string" && x !== "") : blank(v) ? [] : [String(v)];
const normVals = a => { a = [...new Set(a.filter(x => !blank(x)).map(String))]; return a.length === 0 ? "" : a.length === 1 ? a[0] : a; };
const hasVal = (v, x) => vals(v).includes(String(x));
/* 기록 r의 k 값 안에서 from → to (to가 비면 지움). 바뀌었으면 true */
function swapVal(r, k, from, to) { if (!hasVal(r[k], from)) return false; r[k] = normVals(vals(r[k]).map(x => x === from ? to : x)); return true; }
/* 조건 값의 상대 날짜: today(오늘), today-30(30일 전), 오늘+7(7일 뒤) */
function relDay(v) {
  const m = String(v ?? "").trim().match(/^(today|오늘)\s*([+-]\s*\d+)?$/i); if (!m) return v;
  const d = new Date(TODAY() + "T00:00:00"); if (m[2]) d.setDate(d.getDate() + parseInt(m[2].replace(/\s/g, ""), 10));
  return d.toLocaleDateString("sv-SE");
}
function matchCond(r, c) {
  const v = r[c.f], t = relDay(c.v);
  if (Array.isArray(v) && v.every(x => typeof x === "string")) {            /* 여러 값: 하나라도 맞으면 */
    switch (c.op) { case "=": return v.includes(String(t ?? "")); case "!=": return !v.includes(String(t ?? "")); case "~": return v.join(", ").includes(t ?? "");
      case "empty": return !v.length; case "filled": return v.length > 0; default: return v.some(x => matchCond({ [c.f]: x }, c)); }
  }
  switch (c.op) {
    case "=": return String(v ?? "") === String(t ?? "");
    case "!=": return String(v ?? "") !== String(t ?? "");
    case "~": return String(v ?? "").includes(t ?? "");
    case "empty": return blank(v);
    case "filled": return !blank(v);
    default: {
      if (blank(v)) return false;
      const num = !isNaN(+v) && !blank(t) && !isNaN(+t);
      const a = num ? +v : String(v), b = num ? +t : String(t ?? "");
      return c.op === ">" ? a > b : c.op === ">=" ? a >= b : c.op === "<" ? a < b : a <= b;
    }
  }
}
/* 전월 동기: 지난달 1일 ~ 오늘과 같은 날짜까지 (건수·합계 비교용) */
function lastMonthToDate(recs, df) { const lm = ymAdd(ymOf(TODAY()), -1), day = TODAY().slice(8); return recs.filter(r => ymOf(r[df]) === lm && String(r[df]).slice(8, 10) <= day); }
function selectRecs(src, periodOverride) {
  const ds = dsById(src.ds); if (!ds) throw new Error("연결된 데이터를 찾을 수 없습니다");
  const df = src.dateField || ds.dateField;
  let recs = visibleRecs(ds).map(r => recView(ds, r));
  (src.filter || []).forEach(c => { if (c.f && c.op) recs = recs.filter(r => matchCond(r, c)); });
  const pr = periodRange(periodOverride ?? src.period);
  if (pr && df) recs = recs.filter(r => { const m = ymOf(r[df]); return m && m >= pr[0] && m <= pr[1]; });
  return { ds, recs, df };
}
const AGGS = [["count", "건수"], ["sum", "합계"], ["avg", "평균"], ["max", "최댓값"], ["min", "최솟값"], ["ratio", "비율 (A 합계 ÷ B 합계)"]];
const SCALES = [["1", "그대로"], ["100", "% (×100)"], ["1000000", "PPM (×1,000,000)"]];
const r2 = v => Math.round(v * 100) / 100;
function aggregate(recs, s) {
  const nums = k => recs.map(r => r[k]).filter(v => !blank(v) && !isNaN(+v)).map(Number);
  const sum = a => a.reduce((x, y) => x + y, 0);
  switch (s.agg || "count") {
    case "count": return recs.length;
    case "sum": return r2(sum(nums(s.field)));
    case "avg": { const a = nums(s.field); return a.length ? Math.round(sum(a) / a.length * 10) / 10 : 0; }
    case "max": { const a = nums(s.field); return a.length ? Math.max(...a) : 0; }
    case "min": { const a = nums(s.field); return a.length ? Math.min(...a) : 0; }
    case "ratio": { const B = sum(nums(s.field2)), v = B ? sum(nums(s.field)) / B * (+s.scale || 1) : 0; return +s.scale >= 1e6 ? Math.round(v) : r2(v); }
  }
  return 0;
}
const gvals = (r, k) => { const a = vals(r[k]); return a.length ? a : blank(r[k]) || Array.isArray(r[k]) ? ["(없음)"] : [String(r[k])]; };
const gval = (r, k) => gvals(r, k)[0];
const gin = (r, k, g) => gvals(r, k).includes(g);
const cmp = (a, b) => { if (blank(a)) return 1; if (blank(b)) return -1; const n = !isNaN(+a) && !isNaN(+b); return n ? +a - +b : String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0; };
function keysBy(recs, k, ds, mode, top) {
  const cnt = new Map(); recs.forEach(r => gvals(r, k).forEach(g => cnt.set(g, (cnt.get(g) || 0) + 1)));
  let keys = [...cnt.keys()];
  const f = fieldOf(ds, k);
  if (mode === "options" && f?.options) keys = f.options.filter(o => cnt.has(o)).concat(keys.filter(x => !f.options.includes(x)));
  else keys.sort((a, b) => cnt.get(b) - cnt.get(a));
  return top ? keys.slice(0, +top) : keys;
}
/* 계열은 최대 4개: 상위 3개 + 기타 */
function seriesKeys(recs, k, ds) { const all = keysBy(recs, k, ds, "options"); if (all.length <= 4) return { keys: all, of: r => gval(r, k) }; const top = keysBy(recs, k, ds, "count", 3); return { keys: [...top, "기타"], of: r => top.includes(gval(r, k)) ? gval(r, k) : "기타" }; }
const measureName = (s, ds) => s.agg === "count" || !s.agg ? "건수" : (fieldOf(ds, s.field)?.label || "값");
function resolveKpi(k) {
  const s = k.src; if (!s?.ds) return k;
  const o = { ...k, linked: true };
  try {
    const cur = selectRecs(s).recs;
    if (!cur.length && !["count", "sum"].includes(s.agg || "count")) { o.value = "—"; o.status = ""; o.delta = undefined; o.deltaLabel = "아직 기록이 없습니다"; return o; }
    o.value = aggregate(cur, s);
    const notes = [];
    if (s.compare && s.period === "thisMonth") {
      const mtd = ["count", "sum"].includes(s.agg || "count");
      const { recs, df } = selectRecs(s, mtd ? "all" : "lastMonth");
      o.delta = r2(o.value - aggregate(mtd ? lastMonthToDate(recs, df) : recs, s));
      notes.push(mtd ? "전월 동기 대비" : "전월 대비");
    }
    if (s.spark) { const { recs, df } = selectRecs(s, "all"); o.spark = lastMonths(10).map(ym => aggregate(recs.filter(r => ymOf(r[df]) === ym), s)); if (o.spark.every(v => !v)) o.spark = undefined; }
    if (typeof k.goal === "number") {
      notes.push(`목표 ${k.lowerIsBetter ? "≤" : "≥"} ${fmt(k.goal)}`);
      if (k.status === "auto") {
        const v = o.value, g = k.goal;
        o.status = k.lowerIsBetter ? (v <= g ? "good" : v <= g * 1.2 || v - g <= 1 ? "warning" : "serious") : (v >= g ? "good" : v >= g * .9 ? "warning" : "serious");
      }
    } else if (k.status === "auto") o.status = "";
    o.deltaLabel = k.deltaLabel ? [k.deltaLabel, ...notes.filter(n => !n.startsWith("전월"))].join(" · ") : notes.join(" · ") || periodName(s.period);
  } catch (e) { o.value = "—"; o.status = "critical"; o.deltaLabel = e.message; }
  return o;
}
function resolveWidget(w) {
  if (w.type === "kpi") return { ...w, items: (w.items || []).map(resolveKpi) };
  if (XW[w.type]?.resolveAny) return XW[w.type].resolveAny({ ...w });
  const s = w.src; if (!s?.ds) return w;
  const out = { ...w, linked: true };
  if (w.type === "bar" || w.type === "line") {
    const x = s.x || "month";
    if (x === "month") {
      let yms = lastMonths(+s.months || 6); const { recs, df, ds } = selectRecs(s, "all");
      const inM = ym => recs.filter(r => ymOf(r[df]) === ym);
      while (yms.length > 1 && !inM(yms[0]).length) yms = yms.slice(1);   /* 기록이 없는 앞쪽 달은 빼기 */
      if (!recs.length) yms = [];                                          /* 기록이 하나도 없으면 빈 상태 표시 */
      const cross = yms.length > 0 && yms[0].slice(0, 4) !== yms.at(-1).slice(0, 4);
      out.labels = yms.map((ym, i) => ymLabel(ym, cross && (i === 0 || ym.endsWith("-01")))); out.yms = yms;
      const val = rs => rs.length || ["count", "sum"].includes(s.agg || "count") ? aggregate(rs, s) : null;     /* 기록 없는 달의 평균 등은 0이 아니라 빈칸 */
      if (s.series) { const sk = seriesKeys(recs, s.series, ds); out.skeys = sk.keys; out.series = sk.keys.map(k => ({ name: k, values: yms.map(ym => val(inM(ym).filter(r => sk.of(r) === k))) })); }
      else out.series = [{ name: measureName(s, ds), values: yms.map(ym => val(inM(ym))) }];
    } else {
      const { recs, ds } = selectRecs(s);
      const keys = keysBy(recs, x, ds, "count", s.top);
      out.labels = keys; out.xkeys = keys;
      if (s.series) { const sk = seriesKeys(recs, s.series, ds); out.skeys = sk.keys; out.series = sk.keys.map(k => ({ name: k, values: keys.map(g => aggregate(recs.filter(r => gin(r, x, g) && sk.of(r) === k), s)) })); }
      else out.series = [{ name: measureName(s, ds), values: keys.map(g => aggregate(recs.filter(r => gin(r, x, g)), s)) }];
    }
  } else if (w.type === "hbar") {
    const { recs, ds } = selectRecs(s);
    out.items = keysBy(recs, s.by, ds, "count").map(g => ({ label: g, value: aggregate(recs.filter(r => gin(r, s.by, g)), s) }))
      .sort((a, b) => b.value - a.value).slice(0, +s.top || 5);
  } else if (w.type === "table") {
    let { recs, ds, df } = selectRecs(s);
    const sk = s.sort || df; if (sk) recs.sort((a, b) => cmp(a[sk], b[sk]) * (s.asc ? 1 : -1));
    if (+s.limit) recs = recs.slice(0, +s.limit);
    out.columns = (s.cols?.length ? s.cols : dsFields(ds).map(f => f.key)).map(k => { const f = fieldOf(ds, k) || { label: k }; return { key: k, label: f.label, align: isNumF(f) ? "right" : undefined, type: f.badge ? "status" : undefined, tag: isPickF(f) ? f : undefined }; });
    out.rows = recs;
  } else if (w.type === "tasks") {
    let { recs } = selectRecs(s); const m = s.map || {};
    if (m.due) recs.sort((a, b) => cmp(a[m.due], b[m.due]));
    if (+s.limit) recs = recs.slice(0, +s.limit);
    out.items = recs.map(r => ({ rid: r.id, title: r[m.title], owner: r[m.owner], due: r[m.due], status: r[m.status], progress: m.progress && !blank(r[m.progress]) ? +r[m.progress] : undefined }));
  } else if (w.type === "note") {
    let { recs, ds, df } = selectRecs(s);
    const sk = s.sort || df; if (sk) recs.sort((a, b) => cmp(a[sk], b[sk]) * (s.asc ? 1 : -1));
    if (+s.limit) recs = recs.slice(0, +s.limit);
    const fv = (k, r) => { if (!k || blank(r[k])) return ""; const f = fieldOf(ds, k); return f?.type === "date" ? String(r[k]).slice(5).replace("-", "/") : String(r[k]); };
    out.lines = recs.map(r => "- " + [fv(s.pre, r), fv(s.main, r), fv(s.post, r) && `(${fv(s.post, r)})`].filter(Boolean).join(" "));
    out.rids = recs.map(r => r.id);
    const tk = s.tag ?? (dsFields(ds).find(isTagF) || {}).key;          /* 태그로 표시할 항목 (기본: 첫 번째 선택 목록) */
    if (tk && isTagF(fieldOf(ds, tk))) { out.tagField = fieldOf(ds, tk); out.tags = recs.map(r => r[tk]); }
  } else if (w.type === "progress" && s.mode === "rows") {
    let { recs } = selectRecs(s);
    if (s.sort) recs.sort((a, b) => cmp(a[s.sort], b[s.sort]) * (s.asc ? 1 : -1));
    if (+s.limit) recs = recs.slice(0, +s.limit);
    out.items = recs.map(r => ({ rid: r.id, label: r[s.label], value: Math.max(0, +r[s.value] || 0), max: s.maxField ? (+r[s.maxField] || 100) : (+s.max || 100), note: s.noteField ? r[s.noteField] : undefined }));
  } else if (w.type === "progress") {
    const { recs, ds } = selectRecs(s);
    out.items = keysBy(recs, s.by, ds, "options").map(k => ({ label: k, value: recs.filter(r => gin(r, s.by, k)).length, max: recs.length }));
  } else if (XW[w.type]?.resolve) XW[w.type].resolve(w, s, out);
  return out;
}
function srcNote(w) {
  const s = w.src, ds = dsById(s?.ds); if (!ds) return "";
  const per = (w.type === "bar" || w.type === "line") && (s.x || "month") === "month" ? `최근 ${+s.months || 6}개월` : periodName(s.period || "all");
  return w.type === "quickform" ? `${ds.name} 데이터에 바로 저장` : `${ds.name} 데이터 · ${per}`;
}

/* ---------- 사이드바 ---------- */
function pageWorst(p) {
  const rank = { critical: 4, serious: 3, warning: 2 };
  let w = 0;
  (p.widgets || []).forEach(wd => { if (wd.type !== "kpi") return; try { resolveWidget(wd).items.forEach(it => { w = Math.max(w, rank[it.status] || 0); }); } catch (e) {} });
  return ["", "", "var(--warn)", "var(--serious)", "var(--crit)"][w];
}
const periodText = () => { const [y, m] = TODAY().split("-"); return `${y}년 ${+m}월 ${+TODAY().slice(8)}일 기준${asOf ? " (기준일 변경)" : ""}`; };
/* 메뉴 구역 접기 상태 (이 브라우저에만 저장) */
const navFold = new Set((() => { try { return JSON.parse(localStorage.getItem("qa-dashboard-navfold") || "[]"); } catch (e) { return []; } })());
const saveFold = () => { try { localStorage.setItem("qa-dashboard-navfold", JSON.stringify([...navFold])); } catch (e) {} };
/* 메뉴 구역 순서: 페이지 그룹("g:이름"), 데이터베이스("data" — 기준 정보와 기록을 한곳에) */
function navSections() {
  const groups = [...new Set(cfg.pages.map(p => p.group || "기타"))].map(g => "g:" + g);
  const keys = [...groups, "data"];
  const order = (cfg.navOrder || []).filter(k => keys.includes(k));
  keys.forEach(k => {
    if (order.includes(k)) return;
    const at = k.startsWith("g:") ? order.findIndex(x => x === "data") : -1;
    at >= 0 ? order.splice(at, 0, k) : order.push(k);
  });
  return order;
}
const navDel = (label, extra) => `<button type="button" class="nav-del" data-a="nav-del" ${extra} title="${esc(label)} 삭제" aria-label="${esc(label)} 삭제">✕</button>`;
function renderNav(cur) {
  const item = (kind, id, href, label, right, on) => `<div class="nav-item${on ? " on" : ""}" draggable="true" data-kind="${kind}" data-id="${esc(id)}">
    <a href="${href}" class="${on ? "on" : ""}" draggable="false"><span class="nav-lbl">${esc(label)}</span>${right}</a>${navDel(label, `data-kind="${kind}" data-id="${esc(id)}"`)}</div>`;
  const dsItem = d => item("ds", d.id, `#data-${esc(d.id)}`, d.name, `<span class="nav-cnt">${(d.records || []).length}</span>`, "data-" + d.id === cur);
  const secs = navSections();
  const head = (key, title, deletable, n) => { const f = navFold.has(key), i = secs.indexOf(key); return `<h4 draggable="true" data-sec-drag="${esc(key)}" data-a="nav-fold" title="눌러서 ${f ? "펼치기" : "접기"} · 끌어서 순서 바꾸기">
    <button type="button" class="nav-fold" data-a="nav-fold" aria-expanded="${!f}" aria-label="${esc(title)} ${f ? "펼치기" : "접기"}">${f ? "▸" : "▾"}</button>
    <span class="nav-h">${esc(title)}</span><span class="nav-n">${n}</span>
    <span class="nav-tools"><button type="button" class="nav-mv" data-a="nav-mv" data-dir="-1" title="위로" aria-label="${esc(title)} 위로 이동" ${i === 0 ? "disabled" : ""}>↑</button><button type="button" class="nav-mv" data-a="nav-mv" data-dir="1" title="아래로" aria-label="${esc(title)} 아래로 이동" ${i === secs.length - 1 ? "disabled" : ""}>↓</button>${deletable ? navDel(`‘${title}’ 그룹 전체`, `data-kind="group" data-id="${esc(key.slice(2))}"`) : ""}</span></h4>`; };
  const allFold = secs.every(k => navFold.has(k));
  $("#nav").innerHTML = `<div class="nav-bar"><button type="button" class="nav-all" data-a="nav-all">${allFold ? "▾ 모두 펼치기" : "▸ 모두 접기"}</button></div>` + secs.map(key => {
    const fold = navFold.has(key) ? " folded" : "";
    if (key === "data") return `<div class="nav-group nav-data${fold}" data-sec="data">${head("data", "데이터베이스", false, (cfg.datasets || []).length)}
      <div class="nav-item nav-home${cur === "db" ? " on" : ""}"><a href="#db" class="${cur === "db" ? "on" : ""}" draggable="false"><span class="nav-lbl">▦ 모든 데이터베이스</span></a></div>
      ${(cfg.datasets || []).map(dsItem).join("")}
      <a href="#" data-a="ds-new" class="nav-add"><span>＋ 새 데이터베이스</span></a></div>`;
    const g = key.slice(2), ps = cfg.pages.filter(p => (p.group || "기타") === g);
    return `<div class="nav-group${fold}" data-sec="${esc(key)}">${head(key, g, true, ps.length)}
      ${ps.map(p => item("page", p.id, `#${esc(p.id)}`, p.title, navBadge(p), p.id === cur)).join("")}</div>`;
  }).join("");
  applyNavFilter(); trashCount();
  $("#appName").textContent = cfg.appName || "업무 현황";
  $("#appMeta").textContent = [cfg.owner, periodText()].filter(Boolean).join(" · ");
}

/* ---------- 왼쪽 메뉴 찾기: 현황판(페이지)·데이터베이스 이름으로 거르기 ---------- */
let navQ = "";
function applyNavFilter() {
  const q = navQ.trim().toLowerCase(), nav = $("#nav"); if (!nav) return;
  nav.classList.toggle("searching", !!q);
  let hits = 0;
  nav.querySelectorAll(".nav-group").forEach(g => {
    let n = 0;
    g.querySelectorAll(".nav-item").forEach(it => {
      const lb = it.querySelector(".nav-lbl"); if (!lb) return;
      const text = lb.dataset.t ??= lb.textContent, i = q ? text.toLowerCase().indexOf(q) : -1, show = !q || i >= 0;
      it.hidden = !show; if (show && q) n++;
      lb.innerHTML = i >= 0 ? `${esc(text.slice(0, i))}<mark>${esc(text.slice(i, i + q.length))}</mark>${esc(text.slice(i + q.length))}` : esc(text);   /* 찾은 글자 표시 */
    });
    g.hidden = !!q && !n; hits += n;
  });
  let none = $("#navNone");
  if (q && !hits) { if (!none) { none = document.createElement("div"); none.id = "navNone"; none.className = "nav-none"; nav.appendChild(none); } none.textContent = `‘${navQ.trim()}’에 맞는 페이지·데이터베이스가 없습니다.`; }
  else none?.remove();
  const c = $("#navQClear"); if (c) c.hidden = !q;
}
const navFirstHit = () => [...document.querySelectorAll("#nav .nav-item")].find(it => !it.hidden && !it.closest(".nav-group")?.hidden)?.querySelector("a");
$("#navQ").addEventListener("input", e => { navQ = e.target.value; applyNavFilter(); });
$("#navQ").addEventListener("keydown", e => {
  if (e.isComposing || e.keyCode === 229) return;
  if (e.key === "Enter") { e.preventDefault(); const a = navFirstHit(); if (a) { a.click(); location.hash = a.getAttribute("href").slice(1); } }
  if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); e.target.value = navQ = ""; applyNavFilter(); e.target.blur(); }
  if (e.key === "ArrowDown") { e.preventDefault(); navFirstHit()?.focus(); }
});
$("#navQClear").addEventListener("click", () => { $("#navQ").value = navQ = ""; applyNavFilter(); $("#navQ").focus(); });
/* ---------- 위젯 미리보기 그림: 위젯 추가 화면의 카드 옆에 보이는 작은 그림 (화면 테마 색을 따름) ----------
   색: a=강조, s=옅은 강조, l=선, r=경고(빨강), w=주의(노랑), g=양호(초록) */
const WIMG = {
  kpi: `<rect class="s" x="3" y="5" width="42" height="26" rx="4"/><text class="a" x="8" y="23" font-size="13" font-weight="700">128</text><polyline class="ln" points="30,22 34,17 38,19 43,12"/>`,
  line: `<line class="l" x1="4" y1="31" x2="44" y2="31"/><polyline class="ln" points="5,26 13,19 21,22 29,13 37,15 44,7"/><line class="tg" x1="4" y1="11" x2="44" y2="11"/>`,
  bar: `<line class="l" x1="4" y1="31" x2="44" y2="31"/><rect class="a" x="7" y="18" width="6" height="13" rx="1"/><rect class="a" x="16" y="10" width="6" height="21" rx="1"/><rect class="a" x="25" y="14" width="6" height="17" rx="1"/><rect class="a" x="34" y="6" width="6" height="25" rx="1"/>`,
  hbar: `<rect class="a" x="5" y="6" width="36" height="5" rx="1"/><rect class="a" x="5" y="14" width="27" height="5" rx="1"/><rect class="a" x="5" y="22" width="19" height="5" rx="1"/><rect class="s" x="5" y="30" width="11" height="3" rx="1"/>`,
  table: `<rect class="s" x="4" y="5" width="40" height="6" rx="1"/><line class="l" x1="4" y1="16" x2="44" y2="16"/><line class="l" x1="4" y1="23" x2="44" y2="23"/><line class="l" x1="4" y1="30" x2="44" y2="30"/><line class="l" x1="18" y1="5" x2="18" y2="31"/><rect class="g" x="32" y="18" width="9" height="3" rx="1.5"/>`,
  tasks: `<rect class="lb" x="5" y="6" width="6" height="6" rx="1"/><path class="ck" d="M6 9l2 2 3-4"/><rect class="a" x="14" y="8" width="20" height="2" rx="1"/><rect class="lb" x="5" y="16" width="6" height="6" rx="1"/><rect class="a" x="14" y="18" width="24" height="2" rx="1"/><rect class="lb" x="5" y="26" width="6" height="6" rx="1"/><rect class="a" x="14" y="28" width="16" height="2" rx="1"/><text class="r" x="38" y="31" font-size="6" font-weight="700">D-2</text>`,
  progress: `<rect class="s" x="5" y="7" width="38" height="4" rx="2"/><rect class="a" x="5" y="7" width="30" height="4" rx="2"/><rect class="s" x="5" y="16" width="38" height="4" rx="2"/><rect class="a" x="5" y="16" width="18" height="4" rx="2"/><rect class="s" x="5" y="25" width="38" height="4" rx="2"/><rect class="g" x="5" y="25" width="38" height="4" rx="2"/>`,
  note: `<circle class="a" cx="7" cy="9" r="1.6"/><rect class="l2" x="11" y="8" width="30" height="2" rx="1"/><circle class="a" cx="7" cy="17" r="1.6"/><rect class="l2" x="11" y="16" width="24" height="2" rx="1"/><circle class="a" cx="7" cy="25" r="1.6"/><rect class="l2" x="11" y="24" width="28" height="2" rx="1"/>`,
  pareto: `<line class="l" x1="4" y1="31" x2="44" y2="31"/><rect class="a" x="6" y="8" width="7" height="23" rx="1"/><rect class="a" x="15" y="15" width="7" height="16" rx="1"/><rect class="s" x="24" y="22" width="7" height="9" rx="1"/><rect class="s" x="33" y="26" width="7" height="5" rx="1"/><polyline class="ln2" points="9,18 18,11 27,7 37,5"/><line class="tg" x1="4" y1="9" x2="44" y2="9"/>`,
  heatmap: `<g>${[0, 1, 2].map(r => [0, 1, 2, 3].map(c => `<rect x="${5 + c * 10}" y="${5 + r * 9}" width="9" height="8" rx="1.5" class="a" opacity="${[[.9, .4, .2, .6], [.3, .8, .5, .15], [.6, .2, .95, .35]][r][c]}"/>`).join("")).join("")}</g>`,
  control: `<line class="tg" x1="4" y1="8" x2="44" y2="8"/><line class="tg" x1="4" y1="28" x2="44" y2="28"/><line class="l" x1="4" y1="18" x2="44" y2="18"/><polyline class="ln" points="5,20 11,15 17,22 23,17 29,12 35,19 42,5"/><circle class="r" cx="42" cy="5" r="2.4"/>`,
  alerts: `<path class="w" d="M14 6 L24 24 H4 Z"/><rect class="wd" x="13" y="12" width="2" height="6"/><circle class="wd" cx="14" cy="21" r="1.1"/><rect class="r" x="27" y="9" width="17" height="3" rx="1.5"/><rect class="l2" x="27" y="16" width="14" height="2" rx="1"/><rect class="l2" x="27" y="22" width="16" height="2" rx="1"/><rect class="l2" x="6" y="29" width="36" height="2" rx="1"/>`,
  gantt: `<rect class="a" x="6" y="6" width="16" height="5" rx="2.5"/><rect class="a" x="14" y="14" width="20" height="5" rx="2.5"/><rect class="r" x="9" y="22" width="13" height="5" rx="2.5"/><rect class="g" x="24" y="29" width="16" height="4" rx="2"/><line class="rl" x1="27" y1="3" x2="27" y2="34"/>`,
  calendar: `<rect class="lb" x="5" y="5" width="38" height="27" rx="3"/><rect class="a" x="5" y="5" width="38" height="6" rx="2"/>${[0, 1, 2].map(r => [0, 1, 2, 3, 4].map(c => `<rect x="${8 + c * 7}" y="${14 + r * 6}" width="5" height="4" rx="1" class="${r === 1 && c === 2 ? "a" : "s"}"/>`).join("")).join("")}`,
  kanban: `<rect class="s" x="4" y="5" width="12" height="27" rx="2"/><rect class="s" x="18" y="5" width="12" height="27" rx="2"/><rect class="s" x="32" y="5" width="12" height="27" rx="2"/><rect class="cd" x="6" y="8" width="8" height="6" rx="1"/><rect class="cd" x="6" y="16" width="8" height="6" rx="1"/><rect class="cd" x="20" y="8" width="8" height="6" rx="1"/><rect class="cd" x="34" y="8" width="8" height="6" rx="1"/><rect class="cd" x="34" y="16" width="8" height="6" rx="1"/><rect class="cd" x="34" y="24" width="8" height="6" rx="1"/>`,
  dday: `<rect class="lb" x="4" y="6" width="40" height="24" rx="4"/><text class="a" x="9" y="23" font-size="13" font-weight="700" font-family="monospace">D-7</text>`,
  gauge: `<path class="gz1" d="M8 28 A16 16 0 0 1 20 13"/><path class="gz2" d="M20 13 A16 16 0 0 1 32 15"/><path class="gz3" d="M32 15 A16 16 0 0 1 40 28"/><line class="nd" x1="24" y1="28" x2="17" y2="18"/><circle class="ndc" cx="24" cy="28" r="2.2"/>`,
  yoy: `<line class="l" x1="4" y1="31" x2="44" y2="31"/>${[[6, 14, 10], [16, 18, 12], [26, 12, 16], [36, 16, 9]].map(([x, a, b]) => `<rect class="s" x="${x}" y="${31 - a}" width="4" height="${a}" rx="1"/><rect class="a" x="${x + 4.5}" y="${31 - b}" width="4" height="${b}" rx="1"/>`).join("")}`,
  scorecard: `${[[7, 30, "g"], [15, 22, "a"], [23, 14, "r"]].map(([y, w, c]) => `<rect class="l2" x="4" y="${y}" width="6" height="3" rx="1"/><rect class="s" x="13" y="${y}" width="22" height="3" rx="1.5"/><rect class="${c === "r" ? "r" : "a"}" x="13" y="${y}" width="${w * .7}" height="3" rx="1.5"/><rect class="${c}" x="38" y="${y - 1}" width="6" height="5" rx="1.5"/>`).join("")}<line class="l" x1="29" y1="4" x2="29" y2="29"/>`,
  donut: `<circle class="d1" cx="24" cy="18" r="11" stroke-dasharray="34 100"/><circle class="d2" cx="24" cy="18" r="11" stroke-dasharray="20 100" stroke-dashoffset="-35"/><circle class="d3" cx="24" cy="18" r="11" stroke-dasharray="14 100" stroke-dashoffset="-56"/>`,
  history: `<line class="l" x1="9" y1="5" x2="9" y2="32"/><circle class="g" cx="9" cy="8" r="2.5"/><circle class="a" cx="9" cy="18" r="2.5"/><circle class="r" cx="9" cy="28" r="2.5"/><rect class="l2" x="15" y="7" width="26" height="2" rx="1"/><rect class="l2" x="15" y="17" width="20" height="2" rx="1"/><rect class="l2" x="15" y="27" width="24" height="2" rx="1"/>`,
  gallery: `${[[4, 5], [25, 5], [4, 20], [25, 20]].map(([x, y], i) => `<rect class="${i === 0 ? "a" : "s"}" x="${x}" y="${y}" width="19" height="13" rx="2" opacity="${i === 0 ? .25 : 1}"/><path class="mt" d="M${x + 2} ${y + 11} l5 -5 l4 3 l3 -2 l4 4 z"/><circle class="w" cx="${x + 14}" cy="${y + 4}" r="1.6"/>`).join("")}`,
  quickform: `<rect class="lb" x="5" y="6" width="38" height="6" rx="2"/><rect class="lb" x="5" y="15" width="18" height="6" rx="2"/><rect class="lb" x="25" y="15" width="18" height="6" rx="2"/><rect class="a" x="29" y="25" width="14" height="7" rx="2"/>`,
  links: `<rect class="lb" x="4" y="6" width="40" height="9" rx="2"/><rect class="s" x="6" y="8" width="5" height="5" rx="1"/><path class="ln" d="M36 13 l4 -4 m-3 0 h3 v3"/><rect class="lb" x="4" y="20" width="40" height="9" rx="2"/><rect class="w" x="6" y="22" width="5" height="5" rx="1"/><rect class="l2" x="14" y="9" width="16" height="2" rx="1"/><rect class="l2" x="14" y="23" width="12" height="2" rx="1"/>`
  ,goaltable: `<rect class="lb" x="4" y="4" width="40" height="28" rx="2"/><rect class="l2" x="7" y="8" width="8" height="2" rx="1"/><rect class="l2" x="18" y="8" width="8" height="2" rx="1"/><rect class="s" x="30" y="7" width="11" height="4" rx="2"/><rect class="l2" x="7" y="15" width="8" height="2" rx="1"/><rect class="l2" x="18" y="15" width="8" height="2" rx="1"/><rect class="g" x="30" y="14" width="11" height="4" rx="2"/><rect class="l2" x="7" y="22" width="8" height="2" rx="1"/><rect class="l2" x="18" y="22" width="8" height="2" rx="1"/><rect class="r" x="30" y="21" width="11" height="4" rx="2"/>`,
  scatter: `<path class="l" d="M6 4 V31 H44"/><circle class="a" cx="11" cy="26" r="1.8"/><circle class="a" cx="15" cy="24" r="1.8"/><circle class="a" cx="18" cy="20" r="1.8"/><circle class="a" cx="23" cy="21" r="1.8"/><circle class="a" cx="27" cy="16" r="1.8"/><circle class="a" cx="31" cy="14" r="1.8"/><circle class="a" cx="35" cy="11" r="1.8"/><circle class="a" cx="39" cy="8" r="1.8"/><path class="tg" d="M8 28 L42 6"/>`,
  histogram: `<path class="l" d="M4 31 H44"/><rect class="s" x="9" y="24" width="4" height="7"/><rect class="s" x="14" y="17" width="4" height="14"/><rect class="a" x="19" y="9" width="4" height="22"/><rect class="a" x="24" y="8" width="4" height="23"/><rect class="s" x="29" y="15" width="4" height="16"/><rect class="s" x="34" y="23" width="4" height="8"/><path class="ln2" d="M7 30 C16 28 18 6 24 6 C30 6 32 28 41 30"/><path class="rl" d="M43 5 V31"/>`,
  burndown: `<path class="l" d="M5 4 V31 H44"/><path class="s" d="M6 8 L14 10 L20 9 L26 15 L32 19 L38 24 L43 26 V31 H6Z"/><path class="ln" d="M6 8 L14 10 L20 9 L26 15 L32 19 L38 24 L43 26"/><circle class="a" cx="43" cy="26" r="2"/>`,
  floormap: `<rect class="lb" x="3" y="4" width="42" height="28" rx="2"/><path class="l" d="M18 4 V18 M18 24 V32 M31 4 V12 M31 18 V32 M3 18 H14"/><circle class="r" cx="11" cy="11" r="4.5" opacity=".75"/><circle class="w" cx="25" cy="24" r="3.5" opacity=".8"/><circle class="a" cx="38" cy="10" r="2.6" opacity=".8"/><circle class="a" cx="38" cy="25" r="2" opacity=".6"/>`,
  rankchange: `<rect class="l2" x="5" y="7" width="3" height="3"/><rect class="a" x="11" y="7" width="22" height="3" rx="1.5"/><path class="rl" d="M37 11 l3 -4 l3 4"/><rect class="l2" x="5" y="16" width="3" height="3"/><rect class="s" x="11" y="16" width="16" height="3" rx="1.5"/><path class="ck" d="M37 15 l3 4 l3 -4"/><rect class="l2" x="5" y="25" width="3" height="3"/><rect class="s" x="11" y="25" width="11" height="3" rx="1.5"/><rect class="w" x="36" y="25" width="8" height="3" rx="1.5"/>`,
  summary: `<rect class="lb" x="4" y="4" width="40" height="28" rx="2"/><rect class="l2" x="8" y="9" width="10" height="2" rx="1"/><rect class="a" x="20" y="8.5" width="8" height="3" rx="1"/><rect class="l2" x="30" y="9" width="10" height="2" rx="1"/><rect class="l2" x="8" y="15" width="30" height="2" rx="1"/><rect class="l2" x="8" y="21" width="18" height="2" rx="1"/><rect class="r" x="28" y="20.5" width="6" height="3" rx="1"/><rect class="l2" x="8" y="27" width="22" height="2" rx="1"/>`,
  timeline: `<path class="l" d="M4 20 H44"/><circle class="a" cx="8" cy="20" r="2.6"/><circle class="a" cx="18" cy="20" r="2.6"/><circle class="a" cx="27" cy="20" r="2.6"/><circle class="lb" cx="40" cy="20" r="2.6"/><path class="rl" d="M33 9 V29"/><rect class="l2" x="5" y="10" width="7" height="2" rx="1"/><rect class="l2" x="15" y="25" width="7" height="2" rx="1"/><rect class="l2" x="24" y="10" width="7" height="2" rx="1"/><rect class="l2" x="36" y="25" width="7" height="2" rx="1"/>`,
  annotate: `<rect class="lb" x="3" y="4" width="42" height="28" rx="2"/><path class="s" d="M3 32 L16 18 L24 25 L32 15 L45 28 V32Z"/><circle class="r" cx="14" cy="11" r="3.6"/><circle class="r" cx="34" cy="21" r="3.6"/><path class="wd" d="M13.4 9.4 h1.2 v3.4 h-1.2z M32.6 19.6 h2.6 v1 h-1.6 l1.6 1.4 v1 h-2.6 v-1 h1.4 l-1.4 -1.3z"/>`
};
/* 새로 만들기 그림: 만들어질 페이지의 위젯 배치를 작게 그림 (위젯 그림을 칸에 나눠 담음) */
const KLAYOUT = {
  blank: "blank", dataset: [["table", 4, 4, 58, 56], ["quickform", 66, 4, 26, 26], ["note", 66, 34, 26, 26]],
  tasks: [["tasks", 4, 4, 88, 24], ["progress", 4, 32, 42, 28], ["table", 50, 32, 42, 28]],
  data: [["kpi", 4, 4, 88, 18], ["bar", 4, 26, 42, 34], ["hbar", 50, 26, 42, 34]],
  quality: [["kpi", 4, 4, 88, 18], ["gauge", 4, 26, 28, 34], ["yoy", 34, 26, 30, 34], ["pareto", 66, 26, 26, 34]],
  analysis: [["pareto", 4, 4, 58, 28], ["donut", 66, 4, 26, 28], ["heatmap", 4, 36, 88, 24]],
  schedule: [["dday", 4, 4, 42, 24], ["calendar", 50, 4, 42, 24], ["gantt", 4, 32, 88, 28]],
  board: [["kpi", 4, 4, 88, 18], ["kanban", 4, 26, 88, 34]],
  spc: [["control", 4, 4, 88, 28], ["scorecard", 4, 36, 42, 24], ["alerts", 50, 36, 42, 24]],
  supplier: [["scorecard", 4, 4, 54, 56], ["donut", 62, 4, 30, 26], ["hbar", 62, 34, 30, 26]],
  meeting: [["alerts", 4, 4, 42, 28], ["dday", 50, 4, 42, 28], ["history", 4, 36, 28, 24], ["note", 34, 36, 28, 24], ["links", 64, 36, 28, 24]],
  calib: [["table", 4, 4, 58, 56], ["calendar", 66, 4, 26, 26], ["alerts", 66, 34, 26, 26]],
  auditfind: [["table", 4, 4, 58, 56], ["kanban", 66, 4, 26, 26], ["alerts", 66, 34, 26, 26]],
  change4m: [["table", 4, 4, 58, 56], ["donut", 66, 4, 26, 26], ["kanban", 66, 34, 26, 26]],
  training: [["table", 4, 4, 58, 56], ["alerts", 66, 4, 26, 26], ["bar", 66, 34, 26, 26]],
  kpionly: [["kpi", 4, 18, 88, 28]],
  listpage: [["quickform", 4, 4, 88, 22], ["table", 4, 30, 88, 30]],
  notes: [["quickform", 4, 4, 88, 18], ["note", 4, 26, 88, 34]],
  linkpage: [["links", 4, 4, 58, 56], ["dday", 66, 4, 26, 56]],
  monthly: [["kpi", 4, 4, 88, 16], ["yoy", 4, 24, 88, 18], ["donut", 4, 46, 28, 14], ["pareto", 34, 46, 28, 14], ["table", 64, 46, 28, 14]],
  bycustomer: [["bar", 4, 4, 58, 28], ["donut", 66, 4, 26, 28], ["heatmap", 4, 36, 88, 24]],
  executive: [["kpi", 4, 4, 88, 16], ["gauge", 4, 24, 28, 18], ["yoy", 34, 24, 58, 18], ["alerts", 4, 46, 42, 14], ["history", 50, 46, 42, 14]],
  control: [["alerts", 4, 4, 88, 12], ["control", 4, 20, 42, 18], ["pareto", 50, 20, 20, 18], ["heatmap", 72, 20, 20, 18], ["kanban", 4, 42, 42, 18], ["gantt", 50, 42, 20, 18], ["calendar", 72, 42, 20, 18]],
  checklist: [["table", 4, 4, 58, 56], ["tasks", 66, 4, 26, 56]],
  contacts: [["table", 4, 4, 88, 56]],
  minutes: [["table", 4, 4, 58, 56], ["note", 66, 4, 26, 26], ["tasks", 66, 34, 26, 26]],
  equip: [["table", 4, 4, 58, 56], ["donut", 66, 4, 26, 26], ["alerts", 66, 34, 26, 26]],
  returns: [["table", 4, 4, 58, 56], ["pareto", 66, 4, 26, 26], ["donut", 66, 34, 26, 26]],
  csr: [["table", 4, 4, 58, 56], ["kanban", 66, 4, 26, 26], ["calendar", 66, 34, 26, 26]],
  fmea: [["table", 4, 4, 58, 56], ["kpi", 66, 4, 26, 18], ["donut", 66, 26, 26, 16], ["alerts", 66, 46, 26, 14]],
  controlplan: [["table", 4, 4, 88, 40], ["donut", 4, 48, 42, 12], ["hbar", 50, 48, 42, 12]]
};
function kimg(k) {
  const L = KLAYOUT[k] || KLAYOUT.data;
  const inner = L === "blank" ? `<rect class="kt-blank" x="4" y="4" width="88" height="56" rx="5"/><path class="kt-plus" d="M48 22v20M38 32h20"/>`
    : L.map(([t, x, y, w, h]) => `<rect class="kt" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/><svg x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" viewBox="0 0 48 36" preserveAspectRatio="xMidYMid meet">${WIMG[t] || ""}</svg>`).join("");
  return `<svg class="wimg kimg" viewBox="0 0 96 64" aria-hidden="true">${inner}</svg>`;
}
const wimg = k => `<svg class="wimg" viewBox="0 0 48 36" aria-hidden="true">${WIMG[k] || WIMG.note}</svg>`;
/* ---------- 위젯 렌더러 ---------- */
function spark(vals, color) {
  if (!vals || vals.length < 2) return "";
  const w = 72, h = 26, mn = Math.min(...vals), mx = Math.max(...vals), r = mx - mn || 1;
  const pts = vals.map((v, i) => [i / (vals.length - 1) * (w - 4) + 2, h - 3 - (v - mn) / r * (h - 6)]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join("");
  const last = pts[pts.length - 1];
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" aria-hidden="true">
    <path d="${d}L${last[0]} ${h}L2 ${h}Z" fill="${color}" opacity=".10"/>
    <path d="${d}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="${last[0]}" cy="${last[1]}" r="2.5" fill="${color}"/></svg>`;
}
const W = {
  kpi(w) {
    const colorOf = s => ({ good: "var(--good)", warning: "var(--warn)", serious: "var(--serious)", critical: "var(--crit)" }[s]);
    return `<div class="kpis">${(w.items || []).map((k, ki) => {
      let delta = "";
      if (typeof k.delta === "number" && k.delta !== 0) {
        const better = k.lowerIsBetter ? k.delta < 0 : k.delta > 0;
        delta = `<span class="delta ${better ? "up" : "down"}">${k.delta > 0 ? "▲" : "▼"} ${fmt(Math.abs(k.delta))}</span>`;
      }
      return `<div class="card kpi" data-wcard="${curWi}" style="--kpi-c:${colorOf(k.status) || "transparent"}">${editBtn()}
        <div class="lbl"><span>${esc(k.label)}</span>${k.status ? pill(STATUS_LABEL[k.status] || k.status, k.status) : ""}</div>
        <div class="row"><div class="val"${k.linked ? drillA({ k: ki }) + ` title="눌러서 이 숫자의 기록 보기"` : ""}>${fmt(k.value)}<small>${esc(k.unit)}</small></div>${spark(k.spark, "var(--accent)")}</div>
        <div class="foot">${delta}<span>${esc(k.deltaLabel)}</span>${k.linked ? `<span class="src-tag" title="${esc(srcNote({ src: k.src, type: "kpi" }))}에서 자동 집계">자동</span>` : ""}</div>${kpiCmpHTML(k, ki)}</div>`;
    }).join("")}</div>`;
  },
  bar: (w) => chartShell(w, "bar"),
  line: (w) => chartShell(w, "line"),
  hbar(w) {
    if (!w.items?.length) return card(w, `<div class="empty">조건에 맞는 기록이 없습니다.</div>`);
    const mx = Math.max(...w.items.map(i => i.value), 1);
    return card(w, `<div class="hbars">${w.items.map(i => `
      <div class="hrow" data-tip="${esc(i.label)}: <b>${fmt(i.value)}</b> ${esc(w.unit)}"${w.linked && w.src?.by ? drillA({ c: [[w.src.by, i.label]] }) : ""}>
        <span class="nm" title="${esc(i.label)}">${esc(i.label)}</span>
        <span class="htrack"><b style="width:${(i.value / mx * 100).toFixed(1)}%"></b></span>
        <span class="v">${fmt(i.value)}</span></div>`).join("")}</div>`, w.unit ? `단위: ${esc(w.unit)}` : "");
  },
  table(w) {
    if (!(w.rows || []).length) return card(w, `<div class="empty">조건에 맞는 기록이 없습니다.</div>`, "0건");
    const cols = w.columns || Object.keys(w.rows?.[0] || {}).map(k => ({ key: k, label: k }));
    return card(w, `<div class="tbl-wrap"><table><thead><tr>${cols.map(c => `<th class="${c.align === "right" ? "r" : ""}">${esc(c.label)}</th>`).join("")}</tr></thead>
      <tbody>${(w.rows || []).map(r => `<tr ${w.linked && r.id ? `class="rowlink" data-a="rec-open" data-ds="${esc(w.src.ds)}" data-id="${esc(r.id)}" tabindex="0" title="눌러서 열기"` : ""}>${cols.map((c, ci) => {
        const v = r[c.key], lf = w.linked && r.id && !lay.on ? dsFields(dsById(w.src.ds)).find(x => x.key === c.key) : null;
        if (lf) return cellHTML(lf, v, ci === 0, r.id, w.src.ds);
        if (c.tag) return `<td>${chipFor(c.tag, v)}</td>`;
        if (c.type === "status") return `<td>${pill(v)}</td>`;
        return `<td class="${c.align === "right" ? "r" : ""} ${ci === 0 ? "mono" : ""}">${typeof v === "number" ? fmt(v) : esc(valText(v))}</td>`;
      }).join("")}</tr>`).join("")}</tbody></table></div>`, `${(w.rows || []).length}건`);
  },
  tasks(w) {
    if (!(w.items || []).length) return card(w, `<div class="empty">해당하는 업무가 없습니다.</div>`, "0건");
    const today = new Date(TODAY() + "T00:00:00");
    return card(w, `<div class="tasks">${(w.items || []).map(t => {
      let dd = "", cls = "";
      if (t.due) {
        const diff = Math.round((new Date(t.due + "T00:00:00") - today) / 864e5);
        if (t.status !== "완료") { dd = diff < 0 ? `D+${-diff}` : diff === 0 ? "D-Day" : `D-${diff}`; cls = diff < 0 ? "over" : diff <= 3 ? "soon" : ""; }
      }
      return `<div class="task${t.rid ? " rowlink" : ""}" ${t.rid ? `data-a="rec-open" data-ds="${esc(w.src.ds)}" data-id="${esc(t.rid)}" tabindex="0" title="눌러서 열기"` : ""}><div class="t">${esc(t.title)}</div>
        <div class="m"><span>${esc(t.owner)}</span><span>기한 ${esc(t.due)}</span>${dd ? `<span class="dd ${cls}">${dd}</span>` : ""}</div>
        <div class="right">${pill(t.status)}${typeof t.progress === "number" ? `<div class="mini" title="진행률 ${t.progress}%"><b style="width:${t.progress}%"></b></div>` : ""}</div></div>`;
    }).join("")}</div>`, `${(w.items || []).length}건`);
  },
  progress(w) {
    if (!(w.items || []).length) return card(w, `<div class="empty">조건에 맞는 기록이 없습니다.</div>`);
    return card(w, `<div class="prog">${(w.items || []).map(p => {
      const max = p.max || 100, pct = Math.min(100, p.value / max * 100);
      const right = max === 100 ? `${fmt(p.value)}%` : `${fmt(p.value)} / ${fmt(max)}`;
      return `<div class="prow${p.rid ? " rowlink" : ""}" ${p.rid ? `data-a="rec-open" data-ds="${esc(w.src.ds)}" data-id="${esc(p.rid)}" tabindex="0" title="눌러서 열기"` : ""}><div class="top2"><span>${esc(p.label)}${p.note ? `<span class="note">${esc(p.note)}</span>` : ""}</span><span>${right}</span></div>
        <div class="ptrack"><b class="${pct >= 100 ? "full" : ""}" style="width:${pct.toFixed(1)}%"></b></div></div>`;
    }).join("")}</div>`);
  },
  note(w) {
    const quick = w.linked ? `<form class="memo-add" data-wi="${curWi}" autocomplete="off"><input class="f" name="memo" placeholder="메모를 입력하고 Enter · ${esc(dsById(w.src.ds)?.name || "")} 데이터에 저장" aria-label="새 메모"></form>` : "";
    if (w.linked && !(w.lines || []).length) return card(w, `<div class="empty">아직 메모가 없습니다. 아래에 입력해 보세요.</div>${quick}`);
    return card(w, `<ul class="note-list">${(w.lines || []).map((l, i) => {
      const b = /^\s*-\s+/.test(l), rid = w.rids?.[i], tg = w.tags ? tagChip(w.tagField, w.tags[i]) + " " : "";
      return `<li class="${b ? "b" : ""}${rid ? " rowlink" : ""}" ${rid ? `data-a="rec-open" data-ds="${esc(w.src.ds)}" data-id="${esc(rid)}" tabindex="0" title="눌러서 열기"` : ""}>${tg}${esc(b ? l.replace(/^\s*-\s+/, "") : l)}</li>`;
    }).join("")}</ul>${quick}`);
  }
};
let curWi = 0;
let boardPage = null;
const editBtn = () => `<div class="w-tools"><button type="button" data-a="w-export" data-i="${curWi}" title="파일로 내보내기" aria-haspopup="menu">⤓ 내보내기</button><button type="button" data-a="w-edit" data-i="${curWi}" title="이 위젯 편집">✎ 편집</button></div>`;
function card(w, inner, right = "") {
  return `<section class="card" data-wcard="${curWi}" style="grid-column: span ${w.span || 6}">${editBtn()}
    <div class="card-head"><div><div class="h3row"><h3>${esc(w.title)}</h3>${w.linked && (["tasks", "table", "note"].includes(w.type) || XW[w.type]?.addRec || (w.type === "progress" && w.src.mode === "rows")) ? `<button type="button" class="ib add-rec" data-a="rec-add" data-wi="${curWi}" title="${esc(dsById(w.src.ds)?.name || "")} 데이터에 새 항목 추가">＋ 추가</button>` : ""}</div>${w.subtitle || w.linked ? `<div class="sub">${w.linked ? `<span class="src-tag">자동</span> ` : ""}${esc([w.subtitle, w.linked && srcNote(w)].filter(Boolean).join(" · "))}</div>` : ""}</div>
    ${right ? `<div class="sub">${right}</div>` : ""}</div>${inner}</section>`;
}
let chartSeq = 0;
function chartShell(w, kind) {
  const id = "ch" + (++chartSeq);
  const multi = (w.series || []).length > 1;
  const legend = multi ? `<div class="legend">${w.series.map((s, i) => `<span><i style="background:var(${SERIES[i % 4]})"></i>${esc(s.name)}</span>`).join("")}</div>` : (w.unit ? `단위: ${esc(w.unit)}` : "");
  charts.push({ id, w, kind });
  return card(w, `<div class="chart" id="${id}"></div>`, legend);
}

/* ---------- SVG 차트 (컨테이너 폭에 맞춰 그림) ---------- */
let charts = [];
function niceMax(v) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p;
  return ([1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find(x => n <= x)) * p;
}
function drawChart({ id, w, kind, draw }) {
  const el = document.getElementById(id); if (!el) return;
  if (draw) return draw(el, w);
  const Wd = Math.max(260, el.clientWidth), H = 220, m = { t: 14, r: 14, b: 26, l: 40 };
  const iw = Wd - m.l - m.r, ih = H - m.t - m.b;
  const labels = w.labels || [], series = w.series || [];
  if (!labels.length || !series.length) { el.innerHTML = `<div class="empty">${w.linked ? "아직 기록이 없습니다. 기록을 입력하면 자동으로 그려집니다." : "표시할 데이터가 없습니다. 위젯 설정에서 항목을 추가하세요."}</div>`; return; }
  let maxV = 0;
  if (kind === "bar" && w.stacked) labels.forEach((_, i) => { maxV = Math.max(maxV, series.reduce((a, s) => a + (s.values[i] || 0), 0)); });
  else series.forEach(s => s.values.forEach(v => { maxV = Math.max(maxV, v); }));
  if (typeof w.target === "number") maxV = Math.max(maxV, w.target);
  const NT = niceTicks(0, maxV * 1.08 || 1), yMax = NT.hi;            /* 눈금은 보기 좋은 값 (0, 5, 10 …) */
  const y = v => m.t + ih - v / yMax * ih;
  let g = "";
  NT.ticks.forEach((v, i) => {
    const yy = y(v).toFixed(1);
    g += `<line class="${i ? "grid" : "base"}" x1="${m.l}" x2="${Wd - m.r}" y1="${yy}" y2="${yy}"/>`;
    g += `<text x="${m.l - 8}" y="${+yy + 4}" text-anchor="end" style="font-variant-numeric:tabular-nums">${fmt(+v.toFixed(2))}</text>`;
  });
  const band = iw / labels.length;
  labels.forEach((l, i) => { g += `<text x="${(m.l + band * (i + .5)).toFixed(1)}" y="${H - 6}" text-anchor="middle">${esc(l)}</text>`; });
  const unit = esc(w.unit || "");
  if (kind === "bar") {
    const groupW = Math.min(band * .64, w.stacked ? 44 : 22 * series.length + 6);
    labels.forEach((l, i) => {
      const cx = m.l + band * (i + .5);
      if (w.stacked) {
        let acc = 0;
        const total = series.reduce((a, s) => a + (s.values[i] || 0), 0);
        series.forEach((s, si) => {
          const v = s.values[i] || 0; if (!v) return;
          const y0 = y(acc), y1 = y(acc + v); acc += v;
          const top = si === series.length - 1 || series.slice(si + 1).every(x => !x.values[i]);
          g += barPath(cx - groupW / 2, y1 + (top ? 0 : 1), groupW, y0 - y1 - (top ? 0 : 1) - (si ? 1 : 0), top ? 3 : 0, `var(${SERIES[si % 4]})`, `${esc(l)} · ${esc(s.name)}: <b>${fmt(v)}</b> ${unit}`, chartDrill(w, i, si));
        });
        g += `<text class="endlbl" x="${cx}" y="${y(total) - 6}" text-anchor="middle">${fmt(total)}</text>`;
      } else {
        const bw = (groupW - (series.length - 1) * 2) / series.length;
        series.forEach((s, si) => {
          const v = s.values[i] || 0, x = cx - groupW / 2 + si * (bw + 2);
          g += barPath(x, y(v), bw, y(0) - y(v), 3, w.colors?.[si] || (series.length > 1 ? `var(${SERIES[si % 4]})` : "var(--s1)"), `${esc(l)}${series.length > 1 ? " · " + esc(s.name) : ""}: <b>${fmt(v)}</b> ${unit}`, chartDrill(w, i, series.length > 1 ? si : -1));
          if (series.length === 1 && s.values[i] !== null && s.values[i] !== undefined) g += `<text class="endlbl" x="${x + bw / 2}" y="${y(v) - 6}" text-anchor="middle">${fmt(v)}</text>`;
        });
      }
    });
  } else {
    series.forEach((s, si) => {
      const col = `var(${SERIES[si % 4]})`;
      const pts = s.values.map((v, i) => v === null || v === undefined ? null : [m.l + band * (i + .5), y(v)]).filter(Boolean);   /* 빈칸은 건너 이어 그림 */
      if (!pts.length) return;
      const lastV = [...s.values].reverse().find(v => v !== null && v !== undefined);
      const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join("");
      if (series.length === 1) g += `<path d="${d}L${pts.at(-1)[0]} ${y(0)}L${pts[0][0]} ${y(0)}Z" fill="${col}" opacity=".08"/>`;
      g += `<path d="${d}" fill="none" stroke="${col}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
      const lp = pts.at(-1);
      g += `<circle cx="${lp[0]}" cy="${lp[1]}" r="4" fill="${col}" stroke="var(--surface)" stroke-width="2"/>`;
      if (si === 0) g += `<text class="endlbl" x="${lp[0]}" y="${lp[1] - 9}" text-anchor="middle">${fmt(lastV)}</text>`;
    });
    labels.forEach((l, i) => {
      const tip = `<span style="opacity:.7">${esc(l)}</span><br>` + series.map(s => `${esc(s.name)}: <b>${s.values[i] === null || s.values[i] === undefined ? "기록 없음" : fmt(s.values[i])}</b> ${unit}`).join("<br>");
      g += `<rect class="hit" x="${m.l + band * i}" y="${m.t}" width="${band}" height="${ih}" data-tip="${esc(tip)}" data-x="${m.l + band * (i + .5)}"${chartDrill(w, i, -1)}/>`;
    });
    g += `<line class="xh" x1="0" x2="0" y1="${m.t}" y2="${m.t + ih}" stroke="var(--line-strong)" stroke-width="1" visibility="hidden" pointer-events="none"/>`;
  }
  if (typeof w.target === "number") {
    const ty = y(w.target).toFixed(1);
    g += `<line class="target" x1="${m.l}" x2="${Wd - m.r}" y1="${ty}" y2="${ty}" pointer-events="none"/><text class="target-lbl" x="${m.l + 6}" y="${ty - 5}" text-anchor="start">목표 ${fmt(w.target)}</text>`;
  }
  el.innerHTML = `<svg viewBox="0 0 ${Wd} ${H}" height="${H}" role="img" aria-label="${esc(w.title)}">${g}</svg>`;
}
function barPath(x, yTop, w, h, r, fill, tip, extra = "") {
  if (h <= 0) return "";
  r = Math.min(r, w / 2, h);
  const d = `M${x} ${yTop + h}V${yTop + r}Q${x} ${yTop} ${x + r} ${yTop}H${x + w - r}Q${x + w} ${yTop} ${x + w} ${yTop + r}V${yTop + h}Z`;
  return `<path class="bar" d="${d}" fill="${fill}" data-tip="${esc(tip)}"${extra}/>`;
}

/* ---------- 위젯 드릴다운: 막대·조각·칸을 누르면 그 조건의 기록 목록 ----------
   표시 요소에 data-drill='{c:[[항목,값]..], ym, all, ex:[항목,[제외값..]], range:[시작,끝], k:지표번호}' 을 붙이고,
   누르면 위젯의 데이터 조건(src) 위에 이 조건을 더해 기록을 거름 */
const drillA = d => ` data-drill="${esc(JSON.stringify(d))}"`;
function chartDrill(w, i, si) {
  if (!w.linked || !w.src) return "";
  const s = w.src, d = {}, sn = si >= 0 && w.skeys ? w.skeys[si] : null;
  if (w.yms) { d.ym = w.yms[i]; d.all = 1; } else if (w.xkeys) d.c = [[s.x, w.xkeys[i]]]; else return "";
  if (s.series && sn) { if (sn === "기타") d.ex = [s.series, w.skeys.filter(k => k !== "기타")]; else (d.c ||= []).push([s.series, sn]); }
  return drillA(d);
}
function drillRecs(d) {
  const w = boardRes[d.wi] || {}; let src = w.src, item = null;
  if (d.k !== undefined) { item = w.items?.[d.k]; src = item?.src; }
  if (!src?.ds || !dsById(src.ds)) return null;
  let { recs, df, ds } = selectRecs(src, d.all ? "all" : undefined);
  (d.c || []).forEach(([f, v]) => { recs = recs.filter(r => gin(r, f, v)); });
  if (d.ex) recs = recs.filter(r => !gvals(r, d.ex[0]).some(g => d.ex[1].includes(g)));
  if (d.ym) recs = recs.filter(r => ymOf(r[df]) === d.ym);
  if (d.range) { const k = src.dateField || df; recs = recs.filter(r => { const x = String(r[k] || "").slice(0, 10); return x && x >= d.range[0] && x <= d.range[1]; }); }
  if (df) recs.sort((a, b) => -cmp(a[df], b[df]));
  return { ds, recs, df, src, w, item };
}
function drillText(d, x) {
  const lab = k => fieldOf(x.ds, k)?.label || k, src = x.src, parts = [];
  (d.c || []).forEach(([f, v]) => parts.push(`${lab(f)}: ${v}`));
  if (d.ex) parts.push(`${lab(d.ex[0])}: 기타`);
  if (d.ym) parts.push(ymLabel(d.ym, true));
  if (d.range) parts.push(`${d.range[0]} ~ ${d.range[1]}`);
  else if (!d.ym && src.period && src.period !== "all") parts.push(periodName(src.period));
  (src.filter || []).filter(c => c.f && c.op).forEach(c => parts.push(`${lab(c.f)} ${(OPS.find(o => o[0] === c.op) || [, c.op])[1]}${["empty", "filled"].includes(c.op) ? "" : " " + c.v}`));
  return parts.join(" · ");
}
function openDrill(d) {
  const x = drillRecs(d); if (!x) return;
  Object.assign(ed, { mode: "drill", ds: x.ds.id, draft: {}, drill: d, isNew: false, hist: [] });
  showModal();
}
function drillHTML() {
  const d = ed.drill, x = drillRecs(d); if (!x) return `<div class="empty">데이터를 찾을 수 없습니다.</div>`;
  const ds = x.ds, F = dsFields(ds), tk = titleKeyOf(ds), used = new Set((d.c || []).map(c => c[0]));
  const cols = [fieldOf(ds, tk), x.df && fieldOf(ds, x.df), ...F.filter(f => isPickF(f) && f.key !== tk && !used.has(f.key) && !f.badge).slice(0, 3), x.src.field && fieldOf(ds, x.src.field), F.find(f => f.badge)].filter((f, i, a) => f && a.indexOf(f) === i);
  const L = x.recs, max = 300, sumF = x.src.agg && x.src.agg !== "count" ? fieldOf(ds, x.src.field) : null;
  const tot = sumF ? r2(L.reduce((n, r) => n + (+r[sumF.key] || 0), 0)) : null;
  return `<div class="mp-doc"><div class="mp-h">${esc(x.item?.label || x.w.title || ds.name)}</div>
    <div class="dr-cond">${esc(drillText(d, x)) || "위젯의 모든 기록"}</div>
    <div class="dr-sum"><b>${L.length.toLocaleString()}</b>건${sumF ? ` · ${esc(sumF.label)} 합계 <b>${fmt(tot)}</b>` : ""} <span class="tp-hint">· ${esc(ds.name)}</span></div>
    ${L.length ? `<div class="tbl-wrap"><table class="dv-tbl dr-tbl"><thead><tr>${cols.map(f => `<th class="${isNumF(f) ? "r" : ""}">${esc(f.label)}</th>`).join("")}</tr></thead>
      <tbody>${L.slice(0, max).map(r => `<tr class="rowlink" data-drill-rec="${esc(r.id)}" tabindex="0" title="눌러서 열기">${cols.map((f, i) => cellHTML(f, r[f.key], i === 0)).join("")}</tr>`).join("")}</tbody></table></div>
      ${L.length > max ? `<div class="hint">처음 ${max}건만 보여 줍니다. 전체는 ‘목록에서 모두 보기’로 보세요.</div>` : ""}` : `<div class="empty">조건에 맞는 기록이 없습니다.</div>`}</div>`;
}
function renderDrill(dr, popTop, msgPrev, top) {
  const ds = dsById(ed.ds); if (!ds) return closeDrawer(true);
  dr.innerHTML = popTop(`<span>${esc(boardPage?.title || "")}</span><span>/</span><b>기록 목록</b>`) + `<div class="body mp-body">${drillHTML()}</div>
    <footer>${msgPrev || `<div class="msg">기록을 누르면 열리고, ‘← 이전’으로 이 목록에 돌아옵니다.</div>`}<div class="row"><div></div>
    <div style="display:flex;gap:6px"><button class="btn" data-a="drill-list" type="button">목록에서 모두 보기</button><button class="btn primary" data-a="close" type="button">닫기</button></div></div></footer>`;
  const nb = dr.querySelector(".body"); if (nb) nb.scrollTop = top;
}
/* 데이터 목록으로 옮겨 보기: 분류 조건·기간을 목록 필터로 */
function drillToList(d) {
  const x = drillRecs(d); if (!x) return;
  const ds = x.ds, F = dsFields(ds), L = [];
  (d.c || []).forEach(([f, v]) => { const fd = F.find(y => y.key === f); if (fd && isPickF(fd)) L.push({ f, k: "pick", v: [v === "(없음)" ? "" : v] }); });
  (x.src.filter || []).forEach(c => { const fd = F.find(y => y.key === c.f); if (fd && isPickF(fd) && c.op === "=" && !blank(c.v)) L.push({ f: c.f, k: "pick", v: [c.v] }); });
  const df = x.df, pr = !d.ym && !d.all ? periodRange(x.src.period) : null;
  if (df && d.ym) L.push({ f: df, k: "date", from: d.ym + "-01", to: d.ym + "-31" });
  else if (df && d.range) L.push({ f: x.src.dateField || df, k: "date", from: d.range[0], to: d.range[1] });
  else if (df && pr) L.push({ f: df, k: "date", from: pr[0] + "-01", to: pr[1] + "-31" });
  dvfAll[ds.id] = L; saveDvf(); const st = dvSt(ds.id); st.view = ""; saveDvv();
  closeDrawer(true); location.hash = "data-" + ds.id; dv.q = "";
  toast(`위젯 조건을 목록 필터 ${L.length}개로 옮겼습니다.${(x.src.filter || []).some(c => !(c.op === "=" && isPickF(F.find(y => y.key === c.f) || {}))) ? " (일부 조건은 목록 필터로 옮길 수 없어 빠졌습니다)" : ""}`);
}
document.addEventListener("click", e => {
  const el = e.target.closest?.("#board [data-drill]"); if (!el || lay.on || ed.mode || e.target.closest(".w-tools, button, a")) return;
  const card0 = el.closest("[data-wcard]"); if (!card0) return;
  let d; try { d = JSON.parse(el.dataset.drill); } catch (er) { return; }
  d.wi = +card0.dataset.wcard; e.preventDefault(); openDrill(d);
});
$("#drawerWrap").addEventListener("click", e => {
  if (ed.mode !== "drill") return;
  const r = e.target.closest("[data-drill-rec]"); if (r) { e.preventDefault(); const d = ed.drill, ds = dsById(ed.ds); openRecord(ds, r.dataset.drillRec); ed.hist = [{ drill: d }]; renderDrawer(); return; }
  if (e.target.closest('[data-a="drill-list"]')) { e.preventDefault(); drillToList(ed.drill); }
});
$("#drawer").addEventListener("keydown", e => { const r = e.target.closest?.("[data-drill-rec]"); if (r && e.key === "Enter") r.click(); });
/* ---------- 페이지 렌더 ---------- */
function currentId() {
  const h = decodeURIComponent(location.hash.slice(1));
  return cfg.pages.some(p => p.id === h) ? h : cfg.pages[0]?.id;
}
let boardRes = [];
function renderBoard(page) {
  if (!page) return;
  boardPage = page; boardRes = [];
  if (lay.on) { const n = $("#layBar .rc-n"); if (n) n.textContent = `위젯 ${(page.widgets || []).length}개`; }
  $("#pTitle").textContent = page.title || "(제목 없음)";
  $("#pDesc").textContent = page.desc || "";
  $("#pMeta").textContent = [page.group, periodText()].filter(Boolean).join(" · ");
  document.title = `${page.title || "새 페이지"} · ${cfg.appName || "업무 현황"}`;
  charts = [];
  cmpNow = cmpAt && !lay.on ? compareKpis(page) : null;             /* 기준일 비교 */
  $("#board").innerHTML = (page.widgets || []).map((w, i) => {
    curWi = i;
    let html;
    try {
      if (!W[w.type]) html = `<div class="err" data-wcard="${i}">알 수 없는 위젯 타입: "${esc(w.type)}"</div>`;
      else { const rw = boardRes[i] = resolveWidget(w); html = W[w.type](rw); }
    }
    catch (e) { html = `<div class="err" data-wcard="${i}">위젯 "${esc(w.title || w.type)}" 표시 오류: ${esc(e.message)} <button type="button" class="btn sm" data-a="w-edit" data-i="${i}">편집</button></div>`; }
    return lay.on ? lwWrap(w, i, html, (page.widgets || []).length) : html;
  }).join("") + (lay.on ? `<div class="drop-end">${(page.widgets || []).length ? "여기에 놓으면 맨 아래에 추가됩니다" : "위 목록에서 위젯을 끌어다 여기에 놓으세요"}</div>`
                         : `<button type="button" class="add-tile" data-a="add-tile">＋ 위젯 추가</button>`);
  charts.forEach(drawChart);
  if (cmpNow?.size) $("#board").insertAdjacentHTML("afterbegin", cmpCardHTML());
  if (ed.mode) document.querySelectorAll("#board [data-wcard]").forEach(el => el.classList.toggle("hl", ed.open.has(+el.dataset.wcard)));
}
const currentDs = () => { const h = decodeURIComponent(location.hash.slice(1)); return h.startsWith("data-") ? dsById(h.slice(5)) : null; };
function render() {
  fver++;
  if (decodeURIComponent(location.hash.slice(1)) === "db" && !lay.on) {        /* 데이터베이스 모아 보기 */
    renderNav("db"); $("#btnEdit").hidden = true; $("#btnPageX").hidden = true; $("#btnQuick").hidden = false; $("#side").classList.remove("open"); renderDbHome(); return;
  }
  const ds = currentDs();
  const id = ds ? "data-" + ds.id : currentId(), page = ds ? null : cfg.pages.find(p => p.id === id);
  renderNav(id);
  $("#localBadge").hidden = true;
  $("#prevBadge").hidden = true;
  $("#btnEdit").hidden = !page || lay.on;
  $("#btnPageX").hidden = !page || lay.on;
  $("#btnQuick").hidden = lay.on;
  if (lay.on && page) { renderBoard(lay.draft); return; }
  $("#side").classList.remove("open");
  if (ds) { renderDataView(ds); return; }
  if (!page) { $("#pTitle").textContent = "페이지가 없습니다"; $("#pDesc").textContent = "왼쪽 아래 ‘새 페이지 추가’로 첫 페이지를 만드세요."; $("#board").innerHTML = ""; return; }
  renderBoard(page);
}

/* ---------- 데이터베이스 모아 보기: 기준 정보와 기록 데이터를 한 페이지에 (노션의 데이터베이스 목록처럼) ---------- */
const dbh = { q: "", sort: "order" };
function dbInfo(d) {
  const recs = d.records || [], df = d.dateField, last = df ? recs.map(r => r[df]).filter(Boolean).sort().at(-1) || "" : "";
  const refBy = (cfg.datasets || []).filter(x => x.id !== d.id && (x.fields || []).some(f => f.type === "ref" && f.ref === d.id));
  const refTo = [...new Set((d.fields || []).filter(f => f.type === "ref").map(f => dsById(f.ref)?.name).filter(Boolean))];
  return { d, n: recs.length, nf: (d.fields || []).length, w: usageOf(d.id), refBy, refTo, last };
}
function renderDbHome(listOnly) {
  boardPage = null; boardRes = []; charts = [];
  $("#pTitle").textContent = "데이터베이스";
  $("#pDesc").textContent = "기준 정보와 기록을 모두 모아 둔 곳입니다. 눌러서 열고, 대시보드 위젯은 여기의 데이터를 불러와 보여 줍니다.";
  $("#pMeta").textContent = "데이터베이스 · " + periodText();
  document.title = `데이터베이스 · ${cfg.appName || "업무 현황"}`;
  const q = dbh.q.trim().toLowerCase();
  let L = (cfg.datasets || []).map(dbInfo).filter(x => !q || x.d.name.toLowerCase().includes(q) || (x.d.desc || "").toLowerCase().includes(q) || (x.d.fields || []).some(f => f.label.toLowerCase().includes(q)));
  if (dbh.sort === "name") L.sort((a, b) => a.d.name.localeCompare(b.d.name, "ko"));
  if (dbh.sort === "n") L.sort((a, b) => b.n - a.n);
  if (dbh.sort === "last") L.sort((a, b) => String(b.last).localeCompare(String(a.last)));
  const total = (cfg.datasets || []).reduce((a, d) => a + (d.records || []).length, 0);
  const rows = L.map(x => `<tr class="rowlink" data-db-open="${esc(x.d.id)}" tabindex="0" title="눌러서 열기">
      <td><div class="db-name"><span class="db-ic" aria-hidden="true">${x.d.master ? "☰" : "▦"}</span><span class="db-nm"><b>${esc(x.d.name)}</b>${x.d.desc ? `<span>${esc(x.d.desc)}</span>` : ""}</span></div></td>
      <td class="r">${x.n.toLocaleString()}</td><td class="r">${x.nf}</td>
      <td>${x.d.master ? `<span class="tag c-gray">골라 쓰는 목록</span>` : ""}${x.refTo.length ? `<span class="db-rel" title="이 데이터베이스가 골라 쓰는 목록">↗ ${esc(x.refTo.join(", "))}</span>` : ""}${x.refBy.length ? `<span class="db-rel" title="이 데이터베이스를 골라 쓰는 곳">↙ ${esc(x.refBy.map(r => r.name).join(", "))}</span>` : ""}</td>
      <td class="r">${x.w || ""}</td><td class="mono">${esc(x.last)}</td></tr>`).join("");
  const body = `<div class="tbl-wrap"><table class="dv-tbl db-tbl"><thead><tr><th>이름</th><th class="r">기록</th><th class="r">항목</th><th>연결</th><th class="r">쓰는 위젯</th><th>마지막 기록일</th></tr></thead>
    <tbody>${rows || `<tr><td colspan="6" class="dv-empty">‘${esc(dbh.q)}’에 맞는 데이터베이스가 없습니다.</td></tr>`}</tbody></table></div>`;
  if (listOnly && $("#board .db-home .db-body")) { $("#board .db-home .db-body").innerHTML = body; $("#board .db-home .dv-stats").innerHTML = `데이터베이스 <b>${L.length}</b>개 · 기록 <b>${total.toLocaleString()}</b>건`; return; }
  $("#board").innerHTML = `<section class="card dv db-home" style="grid-column:1/-1">
    <div class="dv-bar"><div class="dv-stats">데이터베이스 <b>${L.length}</b>개 · 기록 <b>${total.toLocaleString()}</b>건</div>
      <div class="dv-actions"><input class="f" id="dbQ" type="search" placeholder="이름·설명·항목으로 찾기" value="${esc(dbh.q)}" aria-label="데이터베이스 찾기">
        <select class="f" id="dbSort" aria-label="정렬">${[["order", "메뉴 순서"], ["name", "이름순"], ["n", "기록 많은 순"], ["last", "최근 기록 순"]].map(([v, l]) => `<option value="${v}" ${dbh.sort === v ? "selected" : ""}>${l}</option>`).join("")}</select>
        <button class="btn primary" type="button" data-a="ds-new">＋ 새 데이터베이스</button></div></div>
    <div class="db-body">${body}</div></section>`;
}
$("#board").addEventListener("click", e => {
  const r = e.target.closest("[data-db-open]"); if (r) { location.hash = "data-" + r.dataset.dbOpen; return; }
  if (e.target.closest('#board [data-a="ds-new"]')) { e.preventDefault(); openCreate("dataset"); }
});
$("#board").addEventListener("keydown", e => { const r = e.target.closest?.("[data-db-open]"); if (r && e.key === "Enter") location.hash = "data-" + r.dataset.dbOpen; });
$("#board").addEventListener("input", e => { if (e.target.id === "dbQ") { dbh.q = e.target.value; renderDbHome(true); } });
$("#board").addEventListener("change", e => { if (e.target.id === "dbSort") { dbh.sort = e.target.value; renderDbHome(true); } });
/* ---------- 데이터 목록 항목별 필터 (노션처럼): 분류는 여러 값 고르기, 글자는 포함, 숫자·날짜는 범위, 첨부는 있음/없음 ----------
   필터는 데이터베이스마다 이 브라우저에 기억합니다. */
const DVF_KEY = "qa-dashboard-dvfilter";
const dvfAll = (() => { try { return JSON.parse(localStorage.getItem(DVF_KEY) || "{}"); } catch (e) { return {}; } })();
const dvFilters = id => (dvfAll[id] ||= []);
const saveDvf = () => { try { localStorage.setItem(DVF_KEY, JSON.stringify(dvfAll)); } catch (e) {} };
const dvfKind = f => f.type === "file" ? "file" : isPickF(f) ? "pick" : f.type === "date" ? "date" : isNumF(f) ? "num" : "text";
const dvfActive = x => x.k === "pick" ? (x.v || []).length > 0 : x.k === "text" ? !blank(x.v) : x.k === "file" ? !!x.v : x.k === "date" ? !!(x.preset || x.from || x.to) : !blank(x.min) || !blank(x.max);
const DPRESET = [["thisMonth", "이번 달"], ["lastMonth", "지난 달"], ["last30", "최근 30일"], ["last90", "최근 90일"], ["ytd", "올해"], ["future", "오늘 이후"], ["past", "오늘 이전"]];
function dateRange(x) {
  const T = TODAY(), ym = ymOf(T);
  switch (x.preset) {
    case "thisMonth": return [ym + "-01", ym + "-31"];
    case "lastMonth": { const l = ymAdd(ym, -1); return [l + "-01", l + "-31"]; }
    case "last30": return [relDay("today-30"), T];
    case "last90": return [relDay("today-90"), T];
    case "ytd": return [T.slice(0, 4) + "-01-01", T];
    case "future": return [T, "9999-12-31"];
    case "past": return ["0000-01-01", T];
  }
  return [x.from || "0000-01-01", x.to || "9999-12-31"];
}
function dvfMatch(f, x, v) {
  if (!dvfActive(x)) return true;
  if (x.k === "pick") { const a = vals(v); return a.length ? a.some(y => x.v.includes(y)) : x.v.includes(""); }
  if (x.k === "text") return String(valText(v) ?? "").toLowerCase().includes(String(x.v).toLowerCase());
  if (x.k === "file") return x.v === "has" ? attList(v).length > 0 : attList(v).length === 0;
  if (x.k === "date") { if (blank(v)) return false; const [a, b] = dateRange(x), d = String(v).slice(0, 10); return d >= a && d <= b; }
  if (blank(v) || isNaN(+v)) return false;
  return (blank(x.min) || +v >= +x.min) && (blank(x.max) || +v <= +x.max);
}
function dvfText(f, x) {
  if (!dvfActive(x)) return "모두";
  if (x.k === "pick") return x.v.length > 2 ? `${x.v.slice(0, 2).map(v => v || "비어 있음").join(", ")} 외 ${x.v.length - 2}` : x.v.map(v => v || "비어 있음").join(", ");
  if (x.k === "text") return `‘${x.v}’ 포함`;
  if (x.k === "file") return x.v === "has" ? "첨부 있음" : "첨부 없음";
  if (x.k === "date") return x.preset ? (DPRESET.find(p => p[0] === x.preset) || [, ""])[1] : `${x.from || "…"} ~ ${x.to || "…"}`;
  return `${blank(x.min) ? "" : fmt(+x.min)} ~ ${blank(x.max) ? "" : fmt(+x.max)}`;
}
const dvf = { i: -1, q: "", mode: "" };
function closeDvf() { $("#dvfpop")?.remove(); dvf.i = -1; dvf.mode = ""; }
function dvfRerender() { const ds = currentDs(); if (ds) renderDataView(ds); }
function openDvf(anchor, mode, i) {
  closeDvf(); closeTagPop(); if ($("#proppop")) closePropPop(false);
  Object.assign(dvf, { i, mode, q: "" });
  const pop = document.createElement("div"); pop.id = "dvfpop"; pop.className = "tagpop dvfpop"; pop.setAttribute("role", "dialog"); pop.setAttribute("aria-label", "필터");
  document.body.appendChild(pop);
  pop.addEventListener("click", dvfClick); pop.addEventListener("input", dvfInput); pop.addEventListener("change", dvfInput);
  pop.addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Escape") { e.preventDefault(); closeDvf(); } if (e.key === "Enter" && !e.isComposing && e.keyCode !== 229 && dvf.mode === "add") { e.preventDefault(); pop.querySelector("[data-dvf-pick]")?.click(); } });
  dvf.anchor = anchor; renderDvf(); pop.querySelector("input")?.focus();
}
function placeDvf() {
  const p = $("#dvfpop"), a = dvf.anchor; if (!p || !a?.isConnected) return;
  const r = a.getBoundingClientRect();
  p.style.width = "300px";
  p.style.left = Math.max(8, Math.min(innerWidth - p.offsetWidth - 8, r.left)) + "px";
  p.style.top = (r.bottom + p.offsetHeight + 8 > innerHeight ? Math.max(8, r.top - p.offsetHeight - 4) : r.bottom + 4) + "px";
}
function renderDvf(listOnly) {
  const p = $("#dvfpop"), ds = currentDs(); if (!p || !ds) return closeDvf();
  const F = dsFields(ds), L = dvFilters(ds.id);
  if (dvf.mode === "add") {                                   /* 필터할 항목 고르기 */
    const q = dvf.q.trim().toLowerCase(), used = new Set(L.map(x => x.f));
    const list = F.filter(f => !q || f.label.toLowerCase().includes(q)).map(f => `<button type="button" class="tp-row" data-dvf-pick="${esc(f.key)}"><span class="pp-t"><i>${fGlyph(f)}</i>${esc(f.label)}</span>${used.has(f.key) ? `<span class="tp-hint">사용 중</span>` : ""}</button>`).join("") || `<div class="tp-none">맞는 항목이 없습니다.</div>`;
    if (listOnly) { p.querySelector(".tp-list").innerHTML = list; return placeDvf(); }
    p.innerHTML = `<input class="tp-q dvf-q" id="dvfQ" placeholder="필터할 항목 찾기" autocomplete="off" value="${esc(dvf.q)}"><div class="tp-list">${list}</div>`;
    return placeDvf();
  }
  const x = L[dvf.i], f = x && F.find(y => y.key === x.f); if (!f) return closeDvf();
  let body = "";
  if (x.k === "pick") {
    const keysOf = r => { const a = vals(r[f.key]); return a.length ? a : [""]; };
    const recs = visibleRecs(ds), cnt = v => recs.filter(r => keysOf(r).includes(v)).length;
    const opts = [...new Set([...(f.options || []), ...recs.flatMap(keysOf)])];
    const q = dvf.q.trim().toLowerCase(), shown = opts.filter(o => !q || (o || "비어 있음").toLowerCase().includes(q));
    const list = shown.map(o => `<label class="tp-row dvf-opt"><input type="checkbox" data-dvf-v="${esc(o)}" ${x.v.includes(o) ? "checked" : ""}><span class="dvf-ol">${o ? chipFor(f, o) : `<span class="tag-empty">비어 있음</span>`}</span><span class="tp-hint">${cnt(o)}</span></label>`).join("") || `<div class="tp-none">맞는 값이 없습니다.</div>`;
    if (listOnly) { p.querySelector(".tp-list").innerHTML = list; return placeDvf(); }
    body = `<input class="tp-q dvf-q" id="dvfQ" placeholder="값 찾기" autocomplete="off" value="${esc(dvf.q)}"><div class="dvf-acts"><button type="button" class="cond-add" data-dvf-all="1">모두 선택</button><button type="button" class="cond-add" data-dvf-none="1">선택 해제</button></div><div class="tp-list dvf-list">${list}</div>`;
  } else if (x.k === "text") body = `<input class="f" id="dvfText" placeholder="이 글자가 들어간 기록" value="${esc(x.v || "")}" autocomplete="off">`;
  else if (x.k === "num") body = `<div class="dvf-range"><input class="f" id="dvfMin" inputmode="decimal" placeholder="최소" value="${esc(x.min ?? "")}"><span>~</span><input class="f" id="dvfMax" inputmode="decimal" placeholder="최대" value="${esc(x.max ?? "")}"></div>`;
  else if (x.k === "date") body = `<div class="dvf-presets">${DPRESET.map(([k, l]) => `<button type="button" class="rc-cat${x.preset === k ? " on" : ""}" data-dvf-preset="${k}">${l}</button>`).join("")}</div>
      <div class="dvf-range"><input class="f" type="date" id="dvfFrom" value="${esc(x.preset ? "" : x.from || "")}"><span>~</span><input class="f" type="date" id="dvfTo" value="${esc(x.preset ? "" : x.to || "")}"></div>`;
  else body = `<div class="dvf-presets">${[["has", "첨부 있음"], ["none", "첨부 없음"]].map(([k, l]) => `<button type="button" class="rc-cat${x.v === k ? " on" : ""}" data-dvf-file="${k}">${l}</button>`).join("")}</div>`;
  p.innerHTML = `<div class="tp-head"><span class="pp-t"><i>${fGlyph(f)}</i>${esc(f.label)}</span><span class="dvf-n">${{ pick: "고른 값 중 하나", text: "포함", num: "범위", date: "기간", file: "첨부" }[x.k]}</span></div>${body}
    <div class="tp-foot"><span class="tp-hint">${dvfActive(x) ? `조건: ${esc(dvfText(f, x))}` : "아직 거르지 않음"}</span><button type="button" class="btn sm danger" data-dvf-remove="1">필터 지우기</button></div>`;
  placeDvf();
}
function dvfChanged() { saveDvf(); const i = dvf.i, mode = dvf.mode; dvfRerender();          /* 목록을 다시 그리고 팝업은 새 칩 아래에 그대로 */
  dvf.anchor = document.querySelector(`#board [data-dvf="${i}"]`) || document.querySelector("#board .dvf-add"); dvf.mode = mode; dvf.i = i;
  const foot = $("#dvfpop .tp-foot .tp-hint"), ds = currentDs(), x = ds && dvFilters(ds.id)[i], f = x && dsFields(ds).find(y => y.key === x.f);
  if (foot && f) foot.textContent = dvfActive(x) ? `조건: ${dvfText(f, x)}` : "아직 거르지 않음"; placeDvf(); }
function dvfInput(e) {
  const ds = currentDs(); if (!ds) return; const L = dvFilters(ds.id), x = L[dvf.i], t = e.target;
  if (t.id === "dvfQ") { if (e.type === "input") { dvf.q = t.value; renderDvf(true); } return; }
  if (!x) return;
  if (t.dataset.dvfV !== undefined && e.type === "change") { const v = t.dataset.dvfV; x.v = t.checked ? [...new Set([...x.v, v])] : x.v.filter(y => y !== v); return dvfChanged(); }
  if (t.id === "dvfText" && e.type === "input") { x.v = t.value; return dvfChanged(); }
  if ((t.id === "dvfMin" || t.id === "dvfMax") && e.type === "input") { x[t.id === "dvfMin" ? "min" : "max"] = t.value.replace(/[,\s]/g, ""); return dvfChanged(); }
  if ((t.id === "dvfFrom" || t.id === "dvfTo") && e.type === "change") { x[t.id === "dvfFrom" ? "from" : "to"] = t.value; delete x.preset; renderDvf(); return dvfChanged(); }
}
function dvfClick(e) {
  const ds = currentDs(); if (!ds) return; const L = dvFilters(ds.id), t = e.target;
  const pick = t.closest("[data-dvf-pick]");
  if (pick) { const f = dsFields(ds).find(y => y.key === pick.dataset.dvfPick); let i = L.findIndex(x => x.f === f.key);
    if (i < 0) { L.push({ f: f.key, k: dvfKind(f), v: dvfKind(f) === "pick" ? [] : "" }); i = L.length - 1; saveDvf(); }
    dvfRerender(); openDvf(document.querySelector(`#board [data-dvf="${i}"]`), "edit", i); return; }
  const x = L[dvf.i]; if (!x) return;
  if (t.closest("[data-dvf-remove]")) { L.splice(dvf.i, 1); saveDvf(); closeDvf(); dvfRerender(); return; }
  if (t.closest("[data-dvf-all]")) { x.v = [...$("#dvfpop").querySelectorAll("[data-dvf-v]")].map(c => c.dataset.dvfV); renderDvf(); return dvfChanged(); }
  if (t.closest("[data-dvf-none]")) { x.v = []; renderDvf(); return dvfChanged(); }
  const pr = t.closest("[data-dvf-preset]"); if (pr) { x.preset = x.preset === pr.dataset.dvfPreset ? "" : pr.dataset.dvfPreset; if (!x.preset) delete x.preset; delete x.from; delete x.to; renderDvf(); return dvfChanged(); }
  const fl = t.closest("[data-dvf-file]"); if (fl) { x.v = x.v === fl.dataset.dvfFile ? "" : fl.dataset.dvfFile; renderDvf(); return dvfChanged(); }
}
document.addEventListener("click", e => {
  const ds = currentDs(); if (!ds || !e.target.closest?.("#board .dvf-bar")) return;
  const L = dvFilters(ds.id);
  const del = e.target.closest("[data-dvf-del]"); if (del) { e.preventDefault(); e.stopPropagation(); L.splice(+del.dataset.dvfDel, 1); saveDvf(); closeDvf(); dvfRerender(); return; }
  if (e.target.closest("[data-dvf-clear]")) { e.preventDefault(); dvfAll[ds.id] = []; saveDvf(); closeDvf(); dvfRerender(); return; }
  const add = e.target.closest("[data-dvf-add]"); if (add) { e.preventDefault(); e.stopPropagation(); if (dvf.mode === "add" && $("#dvfpop")) return closeDvf(); openDvf(add, "add", -1); return; }
  const chip = e.target.closest("[data-dvf]"); if (chip) { e.preventDefault(); e.stopPropagation(); const i = +chip.dataset.dvf; if (dvf.i === i && $("#dvfpop")) return closeDvf(); openDvf(chip, "edit", i); }
}, true);
document.addEventListener("mousedown", e => { if ($("#dvfpop") && !e.target.closest("#dvfpop, .dvf-bar")) closeDvf(); });
addEventListener("resize", () => placeDvf());
addEventListener("hashchange", () => closeDvf());
/* ---------- 데이터 입력 화면 (데이터 목록) ---------- */
const dv = { ds: null, q: "", sortK: null, asc: false, limit: 50 };
function usageOf(dsId) {
  let n = 0;
  cfg.pages.forEach(p => (p.widgets || []).forEach(w => { if (w.src?.ds === dsId || (w.items || []).some(k => k.src?.ds === dsId)) n++; }));
  return n;
}
/* 목록 칸 바로 고치기: 글자·긴 글·숫자·날짜 칸은 누르면 그 자리에서 입력, 분류 칸은 노션식 선택기 */
const CE_TYPES = ["text", "longtext", "number", "date"];
const openBtn = (rid, dsId) => `<button type="button" class="row-open" ${dsId ? `data-a="rec-open" data-ds="${esc(dsId)}"` : `data-a="rec-edit"`} data-id="${esc(rid)}" title="팝업으로 열기">열기</button>`;
function cellHTML(f, v, first, rid, dsId) {
  const td = rid ? cellTD(f, v, first, rid, dsId) : null;
  if (td && first) return td.replace(/<\/td>$/, openBtn(rid, dsId) + "</td>").replace(/^<td class="/, '<td class="has-open ');
  return td || cellTD(f, v, first);
}
function cellTD(f, v, first, rid, dsId) {
  const ce = rid && CE_TYPES.includes(f.type) ? ` data-ce="${esc(f.key)}" data-ce-id="${esc(rid)}"${dsId ? ` data-ce-ds="${esc(dsId)}"` : ""} title="눌러서 바로 고치기"` : "";
  if (f.type === "file") return fileCell(v).replace("<td>", '<td class="">');
  if (isCalcF(f)) return `<td class="r calc-c" title="자동 계산">${calcText(f, v)}</td>`;
  if (isPickF(f) && rid) return `<td class=""><span class="tagsel cell" role="button" tabindex="0" aria-haspopup="listbox" data-dv-id="${esc(rid)}" data-dv-key="${esc(f.key)}"${dsId ? ` data-dv-ds="${esc(dsId)}"` : ""} title="눌러서 바로 바꾸기">${chipFor(f, v) || `<span class="tag-empty">—</span>`}</span></td>`;
  if (ce) return `<td class="ce${isNumF(f) ? " r" : ""}${first ? " mono" : ""}${f.type === "longtext" ? " clip" : ""}"${ce}>${blank(v) ? "" : isNumF(f) ? fmt(+v) : esc(v)}</td>`;
  if (f.badge) return `<td class="">${pill(v)}</td>`;
  if (isTagF(f)) return `<td class="">${tagChip(f, v)}</td>`;
  if (isNumF(f)) return `<td class="r">${blank(v) ? "" : fmt(+v)}${f.type === "days" && !blank(v) ? "일" : ""}</td>`;
  return `<td class="${first ? "mono" : ""}${f.type === "longtext" ? " clip" : ""}">${esc(v)}</td>`;
}
function renderDataView(ds, listOnly) {
  if (dv.ds !== ds.id) { Object.assign(dv, { ds: ds.id, q: "", sortK: null, asc: false, limit: 50, glim: {} }); const v0 = (ds.views || []).find(x => x.id === dvSt(ds.id).view); if (v0) Object.assign(dv, { q: v0.q || "", sortK: v0.sortK || null, asc: !!v0.asc }); }
  const st = dvSt(ds.id);
  boardPage = null; boardRes = []; charts = [];
  $("#pTitle").textContent = ds.name;
  $("#pDesc").textContent = ds.desc || "기록을 추가하면 연결된 대시보드 위젯이 자동으로 다시 계산됩니다.";
  $("#pMeta").textContent = "데이터 입력 · " + periodText();
  document.title = `${ds.name} 데이터 · ${cfg.appName || "업무 현황"}`;
  const F = dsFields(ds), df = ds.dateField;
  const hidden = (ds.records || []).length - visibleRecs(ds).length;
  let recs = visibleRecs(ds).map(r => recView(ds, r));
  const total = recs.length, thisM = df ? recs.filter(r => ymOf(r[df]) === ymOf(TODAY())).length : null;
  const FL = dvFilters(ds.id).filter(x => F.some(f => f.key === x.f));
  FL.forEach(x => { const f = F.find(y => y.key === x.f); recs = recs.filter(r => dvfMatch(f, x, r[x.f])); });
  if (dv.q) { const q = dv.q.toLowerCase(); recs = recs.filter(r => F.some(f => String(valText(r[f.key]) ?? "").toLowerCase().includes(q))); }
  const sk = dv.sortK || df;
  if (sk) recs.sort((a, b) => cmp(a[sk], b[sk]) * (dv.asc ? 1 : -1));
  const used = usageOf(ds.id);
  const refBy = (cfg.datasets || []).flatMap(d2 => (d2.fields || []).filter(f => f.type === "ref" && f.ref === ds.id).map(f => ({ d2, f })));
  const tkey = titleKeyOf(ds);
  const useCount = v => refBy.reduce((n, { d2, f }) => n + (d2.records || []).filter(x => hasVal(x[f.key], v)).length, 0);
  $("#pMeta").textContent = "데이터베이스 · " + periodText();
  const Fv = F.filter(f => f.key === tkey || !(st.hide || []).includes(f.key)), nHide = F.length - Fv.length, gF = st.group && F.find(f => f.key === st.group);
  if (st.group && !gF) st.group = "";
  const colW = colWidths(ds, Fv, refBy.length);
  const rowHTML = r => `<tr class="rowlink" data-a="rec-edit" data-id="${esc(r.id)}" tabindex="0" title="눌러서 수정">${Fv.map((f, i) => cellHTML(f, r[f.key], i === 0, r.id)).join("")}${refBy.length ? `<td class="r">${useCount(r[tkey]).toLocaleString()}</td>` : ""}<td></td></tr>`;
  const html = `<section class="card dv" style="grid-column:1/-1">
    <div class="dv-bar">${dvViewsHTML(ds)}
      <div class="dv-stats">${hidden ? `<span class="src-tag" title="기준일을 오늘로 돌리면 다시 보입니다">기준일 이후 ${hidden}건 숨김</span> ` : ""}${FL.some(dvfActive) || dv.q ? `<b>${recs.length.toLocaleString()}</b>건 / ` : ""}전체 <b>${total.toLocaleString()}</b>건${thisM !== null ? ` · 이번 달 <b>${thisM}</b>건` : ""}${ds.master ? "" : ` · 이 데이터를 쓰는 위젯 <b>${used}</b>개`}${refBy.length ? `<div class="dv-refs">사용처: ${refBy.map(({ d2, f }) => `<a href="#data-${esc(d2.id)}">${esc(d2.name)} · ${esc(f.label)}</a>`).join(", ")}</div>` : ""}</div>
      <div class="dv-actions">
        <input class="f" id="dvQ" type="search" placeholder="검색 (모든 항목)" value="${esc(dv.q)}" aria-label="기록 검색">
        <button class="btn${gF ? " on" : ""}" type="button" data-a="dv-group" aria-haspopup="menu" title="상태·고객사·월별처럼 묶어 보기">묶기${gF ? `: ${esc(gF.label)}` : ""}</button>
        <button class="btn${nHide ? " on" : ""}" type="button" data-a="dv-cols" aria-haspopup="menu" title="보일 열 고르기">열${nHide ? ` · ${nHide}개 숨김` : ""}</button>
        <button class="btn" type="button" data-a="ds-schema">항목 구성</button>
        <button class="btn" type="button" data-a="ds-import" title="엑셀 표를 붙여넣거나 .xlsx · .csv 파일로 여러 건 넣기 (목록에서 Ctrl+V)">가져오기</button>
        <button class="btn" type="button" data-a="ds-export">엑셀로 내보내기</button>
        <span class="split-btn"><button class="btn primary" type="button" data-a="rec-new">＋ 새 항목 추가</button><button class="btn primary split-arrow" type="button" data-a="rec-tplmenu" title="템플릿에서 시작" aria-label="템플릿에서 새 항목 추가" aria-haspopup="menu">▾</button></span>
      </div>
      <div class="dvf-bar">${FL.map((x, i) => { const f = F.find(y => y.key === x.f); return `<button type="button" class="dvf-chip${dvfActive(x) ? " on" : ""}" data-dvf="${i}" title="눌러서 바꾸기"><i>${fGlyph(f)}</i><b>${esc(f.label)}</b><span>${esc(dvfText(f, x))}</span><span class="dvf-x" data-dvf-del="${i}" role="button" aria-label="${esc(f.label)} 필터 지우기">✕</span></button>`; }).join("")}
        <button type="button" class="dvf-add" data-dvf-add="1">＋ 필터</button>${FL.length ? `<button type="button" class="dvf-clear" data-dvf-clear="1">모두 지우기</button>` : ""}</div>
    </div>
    <div class="tbl-wrap"><table class="dv-tbl${colW ? " fixed" : ""}"${colW ? ` style="width:${colW.total}px"` : ""}>${colW ? `<colgroup>${Fv.map(f => `<col style="width:${colW.w[f.key]}px">`).join("")}${refBy.length ? `<col style="width:${COLW_EXTRA}px">` : ""}<col style="width:${COLW_ADD}px"></colgroup>` : ""}<thead><tr>${Fv.map(f => `<th class="${isNumF(f) ? "r" : ""}" data-fdrag="${esc(f.key)}" draggable="true"><button type="button" class="th-btn" data-fk="${esc(f.key)}" title="눌러서 이름·형식·정렬 바꾸기 · 끌어서 순서 바꾸기"><i>${fGlyph(f)}</i><span>${esc(f.label)}</span>${sk === f.key ? `<b class="th-ind">${dv.asc ? "▲" : "▼"}</b>` : ""}</button><span class="col-rs" data-colrs="${esc(f.key)}" title="끌어서 보이는 너비 조절 · 두 번 누르면 내용에 맞춤" aria-hidden="true"></span></th>`).join("")}${refBy.length ? `<th class="r" title="이 항목을 고른 기록 수">사용 건수</th>` : ""}<th class="th-add"><button type="button" data-pp-add="1" title="항목 추가" aria-label="항목 추가">＋</button></th></tr></thead>
    <tbody>${recs.length ? (gF ? dvGroupRows(ds, recs, Fv, st, rowHTML, Fv.length + (refBy.length ? 1 : 0) + 1) : recs.slice(0, dv.limit).map(rowHTML).join(""))
      : `<tr><td colspan="${Fv.length + (refBy.length ? 1 : 0) + 1}" class="dv-empty">${dv.q ? "검색 결과가 없습니다." : `아직 기록이 없습니다. ‘＋ 새 항목 추가’로 입력하세요. 머리글을 누르면 항목 이름·형식을 바로 바꿀 수 있습니다.`}</td></tr>`}</tbody></table></div>
    ${!gF && recs.length > dv.limit ? `<button type="button" class="btn sm" data-a="dv-more">더 보기 (${(recs.length - dv.limit).toLocaleString()}건 남음)</button>` : ""}
  </section>`;
  const cur = listOnly && $("#board .dv");
  if (cur) {                                   /* 검색창은 그대로 두고 결과만 바꿈 (한글 조합이 끊기지 않게) */
    const t = document.createElement("div"); t.innerHTML = html; const nw = t.firstElementChild;
    cur.querySelector(".dv-stats").replaceWith(nw.querySelector(".dv-stats"));
    cur.querySelector(".dv-views")?.replaceWith(nw.querySelector(".dv-views"));
    [...cur.children].filter(c => !c.classList.contains("dv-bar")).forEach(c => c.remove());
    [...nw.children].filter(c => !c.classList.contains("dv-bar")).forEach(c => cur.appendChild(c));
    return;
  }
  $("#board").innerHTML = html;
}
/* ---------- 저장된 보기 · 그룹으로 묶기 · 열 숨기기 (노션의 보기 탭처럼) ----------
   지금 보는 상태 = 필터(dvfAll) + 검색어 + 정렬 + 묶기 + 숨긴 열.  보기(ds.views)는 데이터 파일에 저장되어 모두가 함께 씀.
   어느 보기를 보고 있는지, 접은 묶음은 이 브라우저에만 기억. */
const DVV_KEY = "qa-dashboard-dvview";
const dvvAll = (() => { try { return JSON.parse(localStorage.getItem(DVV_KEY) || "{}"); } catch (e) { return {}; } })();
const dvSt = id => (dvvAll[id] ||= { view: "", group: "", hide: [], fold: {} });
const saveDvv = () => { try { localStorage.setItem(DVV_KEY, JSON.stringify(dvvAll)); } catch (e) {} };
const dvNow = ds => { const st = dvSt(ds.id); return { f: dvFilters(ds.id).filter(dvfActive), q: dv.q || "", sortK: dv.sortK || "", asc: !!dv.asc, group: st.group || "", hide: [...(st.hide || [])].sort() }; };
const dvSig = v => JSON.stringify({ f: (v.f || []).filter(dvfActive), q: v.q || "", sortK: v.sortK || "", asc: !!v.asc, group: v.group || "", hide: [...(v.hide || [])].sort() });
function dvApply(ds, v) {
  const st = dvSt(ds.id);
  dvfAll[ds.id] = structuredClone(v?.f || []); saveDvf();
  Object.assign(dv, { q: v?.q || "", sortK: v?.sortK || null, asc: !!v?.asc, limit: 50 });
  st.group = v?.group || ""; st.hide = [...(v?.hide || [])]; st.view = v?.id || ""; dv.glim = {}; saveDvv();
}
function dvViewsHTML(ds) {
  const st = dvSt(ds.id), V = ds.views || [], act = V.find(v => v.id === st.view), changed = dvSig(dvNow(ds)) !== dvSig(act || {});
  return `<div class="dv-views" role="tablist" aria-label="보기">
    <button type="button" role="tab" class="dv-vt${!act ? " on" : ""}" data-a="view-tab" data-v="" aria-selected="${!act}">전체</button>
    ${V.map(v => `<button type="button" role="tab" class="dv-vt${act === v ? " on" : ""}" data-a="view-tab" data-v="${esc(v.id)}" aria-selected="${act === v}" title="두 번 누르면 이름 바꾸기">${esc(v.name)}${act === v ? `<span class="dv-vx" data-a="view-del" data-v="${esc(v.id)}" role="button" aria-label="${esc(v.name)} 보기 지우기" title="이 보기 지우기">✕</span>` : ""}</button>`).join("")}
    <button type="button" class="dv-vadd" data-a="view-add" title="지금 필터·정렬·묶기·열 구성을 이름 붙여 저장">＋ 보기 저장</button>
    ${changed && act ? `<span class="dv-vchg">변경됨 <button type="button" class="btn sm" data-a="view-save">‘${esc(act.name)}’에 덮어쓰기</button><button type="button" class="btn sm ghost" data-a="view-revert">되돌리기</button></span>` : ""}
  </div>`;
}
/* 묶음: 분류(선택·관계·상태)는 값마다, 날짜는 달마다 */
const groupable = f => isPickF(f) || f.type === "date";
function dvGroups(ds, recs, gf) {
  const m = new Map(), keyOf = r => gf.type === "date" ? [ymOf(r[gf.key]) || ""] : (vals(r[gf.key]).length ? vals(r[gf.key]) : [""]);
  recs.forEach(r => keyOf(r).forEach(k => { if (!m.has(k)) m.set(k, []); m.get(k).push(r); }));
  let keys = [...m.keys()];
  if (gf.type === "date") keys.sort((a, b) => (b || "0").localeCompare(a || "0"));
  else { const o = gf.options || []; keys.sort((a, b) => (a === "" ? 1e9 : o.indexOf(a) < 0 ? 1e8 : o.indexOf(a)) - (b === "" ? 1e9 : o.indexOf(b) < 0 ? 1e8 : o.indexOf(b)) || String(a).localeCompare(String(b), "ko")); }
  return keys.map(k => ({ k, recs: m.get(k) }));
}
function dvGroupRows(ds, recs, Fv, st, rowHTML, cols) {
  const gf = dsFields(ds).find(f => f.key === st.group); if (!gf) return recs.slice(0, dv.limit).map(rowHTML).join("");
  const nums = Fv.filter(f => f.type === "number" || f.type === "rollup");          /* 비율 수식·기간은 더하지 않음 */
  return dvGroups(ds, recs, gf).map(({ k, recs: R }) => {
    const fk = st.group + ":" + k, fold = !!st.fold?.[fk], lim = (dv.glim ||= {})[fk] || 30;
    const label = k === "" ? `<span class="tag-empty">비어 있음</span>` : gf.type === "date" ? `<b>${esc(ymLabel(k, true))}</b>` : chipFor(gf, k);
    const sums = nums.map(f => { const a = R.map(r => r[f.key]).filter(v => !blank(v) && !isNaN(+v)); return a.length ? `${esc(f.label)} ${fmt(r2(a.reduce((x, y) => x + +y, 0)))}` : ""; }).filter(Boolean);
    return `<tr class="grp-h${fold ? " folded" : ""}"><td colspan="${cols}"><button type="button" class="grp-tg" data-a="grp-toggle" data-grp="${esc(fk)}" aria-expanded="${!fold}">${fold ? "▸" : "▾"}</button>${label}<span class="grp-n">${R.length.toLocaleString()}건</span>${sums.length ? `<span class="grp-sum">합계 · ${sums.join(" · ")}</span>` : ""}</td></tr>`
      + (fold ? "" : R.slice(0, lim).map(rowHTML).join("") + (R.length > lim ? `<tr class="grp-more"><td colspan="${cols}"><button type="button" class="btn sm" data-a="grp-more" data-grp="${esc(fk)}">이 묶음 더 보기 (${(R.length - lim).toLocaleString()}건 남음)</button></td></tr>` : ""));
  }).join("");
}
/* 작은 팝업 (열 구성 · 묶기 · 보기 이름) */
function closeMiniPop() { $("#minipop")?.remove(); }
function openMiniPop(anchor, html, onClick, w = 260) {
  closeMiniPop();
  const m = document.createElement("div"); m.id = "minipop"; m.className = "tagpop minipop"; m.innerHTML = html; document.body.appendChild(m);
  const r = anchor.getBoundingClientRect(); m.style.width = w + "px";
  m.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left)) + "px";
  m.style.top = (r.bottom + m.offsetHeight + 8 > innerHeight ? Math.max(8, r.top - m.offsetHeight - 4) : r.bottom + 4) + "px";
  m.addEventListener("click", onClick); m.addEventListener("change", onClick); m.dataset.for = anchor.dataset.a || "";
  return m;
}
document.addEventListener("mousedown", e => { if ($("#minipop") && !e.target.closest("#minipop, [data-a='dv-cols'], [data-a='dv-group'], [data-a='view-add'], #btnPageX")) closeMiniPop(); });
addEventListener("hashchange", closeMiniPop);
function dvColsPop(btn, ds) {
  const st = dvSt(ds.id), tk = titleKeyOf(ds), F = dsFields(ds);
  const html = () => `<div class="tp-head"><span>보일 열</span><span class="tp-hint">${F.length - (st.hide || []).length}/${F.length}</span></div><div class="tp-list">${F.map(f => `<label class="tp-row dvf-opt"><input type="checkbox" data-col="${esc(f.key)}" ${(st.hide || []).includes(f.key) ? "" : "checked"} ${f.key === tk ? "disabled title='제목 항목은 늘 보입니다'" : ""}><span class="pp-t"><i>${fGlyph(f)}</i>${esc(f.label)}</span></label>`).join("")}</div>
    <div class="tp-foot"><button type="button" class="cond-add" data-col-all="1">모두 보이기</button></div>`;
  const m = openMiniPop(btn, html(), e => {
    const c = e.target.closest("[data-col]"); if (c && e.type === "change") { const k = c.dataset.col; st.hide = c.checked ? (st.hide || []).filter(x => x !== k) : [...new Set([...(st.hide || []), k])]; saveDvv(); renderDataView(ds); return; }
    if (e.type === "click" && e.target.closest("[data-col-all]")) { st.hide = []; saveDvv(); renderDataView(ds); m.innerHTML = html(); }
  });
}
function dvGroupPop(btn, ds) {
  const st = dvSt(ds.id), G = dsFields(ds).filter(groupable);
  openMiniPop(btn, `<div class="tp-head"><span>무엇으로 묶을까요?</span></div><div class="tp-list">
    <button type="button" class="tp-row" data-grpby=""><span class="pp-t"><i>≡</i>묶지 않음</span>${!st.group ? `<b class="tp-check">✓</b>` : ""}</button>
    ${G.map(f => `<button type="button" class="tp-row" data-grpby="${esc(f.key)}"><span class="pp-t"><i>${fGlyph(f)}</i>${esc(f.label)}${f.type === "date" ? " (월별)" : ""}</span>${st.group === f.key ? `<b class="tp-check">✓</b>` : ""}</button>`).join("")}</div>
    <div class="tp-foot"><span class="tp-hint">묶음마다 건수와 숫자 항목 합계를 보여 줍니다.</span></div>`, e => {
    const b = e.target.closest("[data-grpby]"); if (!b || e.type !== "click") return;
    st.group = b.dataset.grpby; dv.glim = {}; saveDvv(); closeMiniPop(); renderDataView(ds);
  });
}
function dvViewAdd(btn, ds) {
  const V = ds.views || []; let n = "새 보기", i = 2; while (V.some(v => v.name === n)) n = `새 보기 ${i++}`;
  const m = openMiniPop(btn, `<div class="tp-head"><span>보기 이름</span></div><div style="padding:8px"><input class="f" id="viewName" value="${esc(n)}" autocomplete="off"></div>
    <div class="tp-foot"><span class="tp-hint">지금 필터·검색·정렬·묶기·열을 저장합니다.</span><button type="button" class="btn sm primary" data-view-ok="1">저장</button></div>`, e => { if (e.type === "click" && e.target.closest("[data-view-ok]")) ok(); });
  const inp = m.querySelector("#viewName"); inp.focus(); inp.select();
  const ok = () => { const name = inp.value.trim(); if (!name) return inp.focus(); const v = { id: "v" + Date.now().toString(36), name, ...dvNow(ds) }; (ds.views ||= []).push(v); dvSt(ds.id).view = v.id; saveDvv(); persist(); closeMiniPop(); renderDataView(ds); toast(`‘${name}’ 보기를 저장했습니다. 탭을 눌러 바로 바꿔 볼 수 있습니다.`); };
  inp.addEventListener("keydown", e => { e.stopPropagation(); if (e.isComposing || e.keyCode === 229) return; if (e.key === "Enter") { e.preventDefault(); ok(); } if (e.key === "Escape") closeMiniPop(); });
}
function dvViewAction(a, btn, ds) {
  const st = dvSt(ds.id), V = ds.views || [];
  if (a === "view-tab") { const v = V.find(x => x.id === btn.dataset.v); if (v && v.id === st.view) return; dvApply(ds, v || null); renderDataView(ds); return true; }
  if (a === "view-add") { if ($("#minipop")?.dataset.for === "view-add") return closeMiniPop(), true; dvViewAdd(btn, ds); return true; }
  if (a === "view-save") { const v = V.find(x => x.id === st.view); if (v) { Object.assign(v, dvNow(ds)); persist(); renderDataView(ds); toast(`‘${v.name}’ 보기를 지금 상태로 바꿨습니다.`); } return true; }
  if (a === "view-revert") { dvApply(ds, V.find(x => x.id === st.view)); renderDataView(ds); return true; }
  if (a === "view-del") { const v = V.find(x => x.id === btn.dataset.v); if (!v || !arm(btn, "✓?")) return true; ds.views = V.filter(x => x !== v); dvApply(ds, null); persist(); renderDataView(ds); toast(`‘${v.name}’ 보기를 지웠습니다.`); return true; }
  if (a === "dv-cols") { if ($("#minipop")?.dataset.for === "dv-cols") return closeMiniPop(), true; dvColsPop(btn, ds); return true; }
  if (a === "dv-group") { if ($("#minipop")?.dataset.for === "dv-group") return closeMiniPop(), true; dvGroupPop(btn, ds); return true; }
  if (a === "grp-toggle") { const k = btn.dataset.grp; st.fold ||= {}; if (st.fold[k]) delete st.fold[k]; else st.fold[k] = 1; saveDvv(); renderDataView(ds, true); return true; }
  if (a === "grp-more") { const k = btn.dataset.grp; (dv.glim ||= {})[k] = ((dv.glim[k]) || 30) + 100; renderDataView(ds, true); return true; }
}
/* 보기 탭 두 번 누르면 이름 바꾸기 */
document.addEventListener("dblclick", e => {
  const t = e.target.closest?.("#board .dv-vt[data-v]"); const ds = currentDs(); if (!t || !ds || !t.dataset.v) return;
  const v = (ds.views || []).find(x => x.id === t.dataset.v); if (!v) return;
  e.preventDefault();
  t.outerHTML = `<input class="f dv-vname" value="${esc(v.name)}" aria-label="보기 이름">`;
  const inp = $("#board .dv-vname"); inp.focus(); inp.select(); let done = false;
  const fin = ok => { if (done) return; done = true; const n = inp.value.trim(); if (ok && n && n !== v.name) { v.name = n; persist(); } renderDataView(ds); };
  inp.addEventListener("keydown", ev => { ev.stopPropagation(); if (ev.isComposing || ev.keyCode === 229) return; if (ev.key === "Enter") fin(true); if (ev.key === "Escape") fin(false); });
  inp.addEventListener("blur", () => fin(true));
});
$("#board").addEventListener("input", e => {
  if (e.target.id !== "dvQ") return;
  dv.q = e.target.value; dv.limit = 50;
  renderDataView(currentDs(), true);
});
$("#board").addEventListener("keydown", e => { if (e.key === "Enter" && e.target.classList?.contains("rowlink")) e.target.click(); });
let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => charts.forEach(drawChart), 120); });
addEventListener("hashchange", () => { if (ed.mode) closeDrawer(true); if (lay.on) leaveLayout(); render(); });

/* ---------- 툴팁 ---------- */
const tip = $("#tip");
document.addEventListener("mousemove", e => {
  const t = e.target.closest?.("[data-tip]");
  document.querySelectorAll(".xh").forEach(l => l.setAttribute("visibility", "hidden"));
  if (!t) { tip.style.opacity = 0; return; }
  tip.innerHTML = t.dataset.tip;
  if (t.dataset.x) { const xh = t.closest("svg").querySelector(".xh"); xh.setAttribute("x1", t.dataset.x); xh.setAttribute("x2", t.dataset.x); xh.setAttribute("visibility", "visible"); }
  const r = tip.getBoundingClientRect();
  tip.style.left = Math.min(innerWidth - r.width - 8, e.clientX + 14) + "px";
  tip.style.top = Math.max(8, e.clientY - r.height - 10) + "px";
  tip.style.opacity = 1;
});

/* ---------- 편집기 (GUI) ---------- */
const isoIn = d => { const t = new Date(TODAY() + "T00:00:00"); t.setDate(t.getDate() + d); return t.toLocaleDateString("sv-SE"); };
const TYPES = {
  kpi:      { name: "핵심 지표", desc: "큰 숫자 + 증감·상태" },
  line:     { name: "추이 차트", desc: "월별 변화와 목표선" },
  bar:      { name: "막대 차트", desc: "항목 비교, 누적 가능" },
  hbar:     { name: "순위 막대", desc: "상위 항목 순위" },
  table:    { name: "표",        desc: "목록과 상태 뱃지" },
  tasks:    { name: "할 일",     desc: "담당·기한·D-Day" },
  progress: { name: "진행률",    desc: "막대형 달성률" },
  note:     { name: "메모",      desc: "자유 텍스트" }
};
const DEFAULTS = {
  kpi:      () => ({ type: "kpi", items: [{ label: "새 지표", value: 0, unit: "건", status: "" }] }),
  line:     () => ({ type: "line", span: 6, title: "추이 차트", unit: "", labels: ["1월", "2월", "3월"], series: [{ name: "실적", values: [0, 0, 0] }] }),
  bar:      () => ({ type: "bar", span: 6, title: "막대 차트", unit: "건", labels: ["항목 A", "항목 B", "항목 C"], series: [{ name: "실적", values: [0, 0, 0] }] }),
  hbar:     () => ({ type: "hbar", span: 6, title: "순위", unit: "건", items: [{ label: "항목 A", value: 0 }, { label: "항목 B", value: 0 }] }),
  table:    () => ({ type: "table", span: 12, title: "목록", columns: [{ key: "c1", label: "No." }, { key: "c2", label: "내용" }, { key: "c3", label: "상태", type: "status" }], rows: [{ c1: "001", c2: "", c3: "진행중" }] }),
  tasks:    () => ({ type: "tasks", span: 6, title: "할 일", items: [{ title: "", owner: "", due: isoIn(7), status: "진행중", progress: 0 }] }),
  progress: () => ({ type: "progress", span: 6, title: "진행률", items: [{ label: "항목", value: 0, max: 100 }] }),
  note:     () => { const m = memoDs(); return m ? { type: "note", span: 6, title: "메모", src: defaultSrc("note", m.id) } : { type: "note", span: 6, title: "메모", lines: ["- "] }; }
};
const STATUS_OPTS = ["정상", "진행중", "대기", "주의", "지연", "심각", "긴급", "완료"];
const KPI_STATUS = [["", "표시 안 함"], ["good", "양호"], ["warning", "주의"], ["serious", "경고"], ["critical", "긴급"]];
const KPI_STATUS_AUTO = [["auto", "목표 기준 자동"], ...KPI_STATUS];
const SPANS = [[3, "폭 1/4"], [4, "폭 1/3"], [5, "폭 5/12"], [6, "폭 1/2"], [7, "폭 7/12"], [8, "폭 2/3"], [12, "전체 폭"]];
/* 항목(행) 목록 편집 정의: k=저장 키, l=라벨, t=입력 종류, w=가로 칸(최대 4) */
const ROWS = {
  kpi: { path: "items", label: "지표", cards: true, tpl: () => ({ label: "새 지표", value: 0, unit: "건", status: "" }), fields: [
    { k: "label", l: "지표명", t: "text", w: 2 }, { k: "value", l: "값", t: "num" }, { k: "unit", l: "단위", t: "text" },
    { k: "status", l: "상태 표시", t: "sel", o: KPI_STATUS }, { k: "delta", l: "증감 (예: -3)", t: "num" },
    { k: "deltaLabel", l: "보조 설명", t: "text", w: 2 }, { k: "lowerIsBetter", l: "낮을수록 좋은 지표", t: "chk", w: 2 },
    { k: "spark", l: "미니 추이 값 (쉼표로 구분, 비우면 숨김)", t: "csv", w: 2 } ] },
  hbar: { path: "items", label: "항목", tpl: () => ({ label: "", value: 0 }), fields: [
    { k: "label", l: "항목명", t: "text" }, { k: "value", l: "값", t: "num" } ] },
  tasks: { path: "items", label: "할 일", cards: true, tpl: () => ({ title: "", owner: "", due: isoIn(7), status: "진행중", progress: 0 }), fields: [
    { k: "title", l: "내용", t: "text", w: 4 }, { k: "owner", l: "담당", t: "text" }, { k: "due", l: "기한", t: "date" },
    { k: "status", l: "상태", t: "sel", o: STATUS_OPTS }, { k: "progress", l: "진행률 (%)", t: "num" } ] },
  progress: { path: "items", label: "항목", tpl: () => ({ label: "", value: 0, max: 100 }), fields: [
    { k: "label", l: "항목명", t: "text" }, { k: "value", l: "현재 값", t: "num" }, { k: "max", l: "최대(목표)", t: "num" }, { k: "note", l: "메모", t: "text" } ] }
};
const COMMON = {
  bar:      [["title", "제목", "text", 2], ["subtitle", "부제", "text", 2], ["unit", "단위", "text", 1], ["target", "목표값 (빨간 점선)", "num", 1], ["stacked", "누적 막대로 표시", "chk", 2]],
  line:     [["title", "제목", "text", 2], ["subtitle", "부제", "text", 2], ["unit", "단위", "text", 1], ["target", "목표값 (빨간 점선)", "num", 1]],
  hbar:     [["title", "제목", "text", 3], ["unit", "단위", "text", 1]],
  table:    [["title", "제목", "text", 4]],
  tasks:    [["title", "제목", "text", 4]],
  progress: [["title", "제목", "text", 4]],
  note:     [["title", "제목", "text", 4]]
};

const ed = { mode: null, tab: "gui", draft: null, open: new Set() };

/* 경로 유틸: "widgets.2.items.0.label" */
const getPath = (o, p) => p.split(".").reduce((a, k) => a?.[k], o);
function setPath(o, p, v) {
  const ks = p.split("."), last = ks.pop();
  const parent = ks.reduce((a, k, i) => (a[k] ??= /^\d+$/.test(ks[i + 1] ?? last) ? [] : {}), o);
  if (v === undefined) delete parent[last]; else parent[last] = v;
}
function parseVal(t, el) {
  if (t === "chk") return el.checked || undefined;
  if (t === "num" || t === "num0") { const v = el.value.trim(); if (v === "" || isNaN(+v)) return t === "num0" ? 0 : undefined; return +v; }
  if (t === "csv") { const a = el.value.split(/[,\s]+/).filter(Boolean).map(Number).filter(n => !isNaN(n)); return a.length ? a : undefined; }
  if (t === "lines") return el.value.split("\n");
  if (t === "list") { const a = el.value.split(",").map(x => x.trim()).filter(Boolean); return a.length ? a : undefined; }
  if (t === "selnum") return +el.value;
  return el.value;
}

/* 입력 요소 */
function inp(f, path, val) {
  const b = `data-b="${esc(path)}" data-t="${f.t}" ${f.re ? 'data-re="1"' : ""}`;
  if (f.t === "sel" || f.t === "selnum") {
    let opts = f.o.map(o => Array.isArray(o) ? o : [o, o]);
    const cur = String(val ?? "");
    if (!opts.some(o => o[0] === cur)) opts = [[cur, cur || "선택"], ...opts];
    return `<select class="f" ${b}>${opts.map(([v, l]) => `<option value="${esc(v)}" ${v === cur ? "selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
  }
  if (f.t === "chk") return `<label class="chk"><input type="checkbox" ${b} ${val ? "checked" : ""}> ${esc(f.l)}</label>`;
  if (f.t === "lines") return `<textarea class="f" rows="6" ${b}>${esc((val || []).join("\n"))}</textarea>`;
  if (f.t === "area") return `<textarea class="f" rows="3" ${b}>${esc(val)}</textarea>`;
  const type = f.t === "num" || f.t === "num0" ? "number" : f.t === "date" ? "date" : "text";
  const v = f.t === "csv" || f.t === "list" ? (val || []).join(", ") : (val ?? "");
  return `<input class="f" type="${type}" ${type === "number" ? 'step="any"' : ""} ${f.dl ? `list="${f.dl}"` : ""} ${b} value="${esc(v)}">`;
}
function fld(f, path, val) {
  const sp = `style="grid-column: span ${Math.min(f.w || 1, 4)}"`;
  if (f.t === "chk") return `<div class="fld" ${sp}>${inp(f, path, val)}</div>`;
  return `<label class="fld" ${sp}><span>${esc(f.l)}</span>${inp(f, path, val)}</label>`;
}
const rowBtns = (path, r) => `<button type="button" class="ib" data-a="r-up" data-p="${path}" data-r="${r}" title="위로 이동" ${r === 0 ? "disabled" : ""}>↑</button><button type="button" class="ib del" data-a="r-del" data-p="${path}" data-r="${r}" title="삭제">✕</button>`;

function rowsHTML(type, path, items) {
  const R = ROWS[type];
  const add = `<button type="button" class="btn sm" data-a="r-add" data-p="${path}" data-type="${type}">＋ ${R.label} 추가</button>`;
  if (R.cards) return `<div class="rows">${items.map((it, r) => `<div class="icard"><div class="icard-h"><span>${R.label} ${r + 1}</span><span>${rowBtns(path, r)}</span></div>
      <div class="cgrid">${R.fields.map(f => fld(f, `${path}.${r}.${f.k}`, it[f.k])).join("")}</div></div>`).join("")}</div>${add}`;
  return `<div class="gwrap"><table class="gt"><thead><tr>${R.fields.map(f => `<th>${esc(f.l)}</th>`).join("")}<th></th></tr></thead>
    <tbody>${items.map((it, r) => `<tr>${R.fields.map(f => `<td>${inp(f, `${path}.${r}.${f.k}`, it[f.k])}</td>`).join("")}<td class="acts">${rowBtns(path, r)}</td></tr>`).join("")}</tbody></table></div>${add}`;
}
function gridHTML(w, i) {
  const P = `widgets.${i}`, S = w.series || [], L = w.labels || [];
  return `<div class="glbl">데이터<span>행 = 가로축 항목, 열 = 계열 (최대 4개)</span></div>
  <div class="gwrap"><table class="gt"><thead><tr><th>가로축 항목</th>
  ${S.map((s, si) => `<th><div class="sh"><i style="background:var(${SERIES[si % 4]})"></i><input class="f" data-b="${P}.series.${si}.name" data-t="text" value="${esc(s.name)}" aria-label="계열 이름">${S.length > 1 ? `<button type="button" class="ib del" data-a="g-delser" data-i="${i}" data-s="${si}" title="계열 삭제">✕</button>` : ""}</div></th>`).join("")}
  <th>${S.length < 4 ? `<button type="button" class="ib" data-a="g-addser" data-i="${i}">＋ 계열</button>` : ""}</th></tr></thead>
  <tbody>${L.map((l, r) => `<tr><td><input class="f" data-b="${P}.labels.${r}" data-t="text" value="${esc(l)}"></td>
    ${S.map((s, si) => `<td><input class="f" type="number" step="any" data-b="${P}.series.${si}.values.${r}" data-t="num0" value="${esc(s.values?.[r] ?? 0)}"></td>`).join("")}
    <td class="acts">${L.length > 1 ? `<button type="button" class="ib del" data-a="g-delrow" data-i="${i}" data-r="${r}" title="행 삭제">✕</button>` : ""}</td></tr>`).join("")}</tbody></table></div>
  <button type="button" class="btn sm" data-a="g-addrow" data-i="${i}">＋ 가로축 항목 추가</button>`;
}
const colType = c => c.type === "status" ? "status" : c.align === "right" ? "num" : "text";
function tableHTML(w, i) {
  const P = `widgets.${i}`, C = w.columns || [], R = w.rows || [];
  return `<div class="glbl">열 구성과 데이터<span>열 이름 아래에서 텍스트·숫자·상태 뱃지를 고르세요</span></div>
  <div class="gwrap"><table class="gt"><thead><tr>
  ${C.map((c, ci) => `<th><div class="sh"><input class="f" data-b="${P}.columns.${ci}.label" data-t="text" value="${esc(c.label)}" aria-label="열 이름">${C.length > 1 ? `<button type="button" class="ib del" data-a="t-delcol" data-i="${i}" data-c="${ci}" title="열 삭제">✕</button>` : ""}</div>
    <select class="f sm" data-coltype="${i}.${ci}" aria-label="열 형식">${[["text", "텍스트"], ["num", "숫자"], ["status", "상태 뱃지"]].map(([v, l]) => `<option value="${v}" ${colType(c) === v ? "selected" : ""}>${l}</option>`).join("")}</select></th>`).join("")}
  <th><button type="button" class="ib" data-a="t-addcol" data-i="${i}">＋ 열</button></th></tr></thead>
  <tbody>${R.map((row, r) => `<tr>${C.map(c => { const t = colType(c); const f = t === "status" ? { t: "sel", o: STATUS_OPTS } : { t: t === "num" ? "num" : "text" }; return `<td>${inp(f, `${P}.rows.${r}.${c.key}`, row[c.key])}</td>`; }).join("")}
    <td class="acts">${rowBtns(`${P}.rows`, r)}</td></tr>`).join("")}</tbody></table></div>
  <button type="button" class="btn sm" data-a="r-add" data-p="${P}.rows" data-type="__row">＋ 행 추가</button>`;
}
const LINKABLE = ["bar", "line", "hbar", "table", "tasks", "progress", "note"];
const segHTML = (p, on, type) => `<span class="seg"><button type="button" class="${on ? "" : "on"}" data-a="src-off" data-p="${p}">직접 입력</button><button type="button" class="${on ? "on" : ""}" data-a="src-on" data-p="${p}" data-type="${type}">데이터 연동</button></span>`;
const dsOpts = () => (cfg.datasets || []).map(d => [d.id, d.name]);
const fOpts = (ds, pred, blankLabel) => [...(blankLabel !== undefined ? [["", blankLabel]] : []), ...dsFields(ds).filter(pred || (() => true)).map(f => [f.key, f.label])];
const catF = f => f.type === "select" || f.type === "text";
const dateF = f => f.type === "date";

/* ---------- 추가 위젯 등록부 ----------
   위젯 하나를 regW(종류, { name, desc, def, common, linkable, rows, src, form, resolve, resolveAny, editor, render, exports, table, addRec })로
   한 곳에서 정의하면 위젯 목록·끌어다 놓기·편집 화면·데이터 계산·내보내기에 모두 연결됩니다. */
const XW = {};
function regW(k, x) {
  XW[k] = x; TYPES[k] = { name: x.name, desc: x.desc }; DEFAULTS[k] = x.def;
  COMMON[k] = x.common || [["title", "제목", "text", 4]];
  if (x.linkable) LINKABLE.push(k);
  if (x.rows) ROWS[k] = x.rows;
  W[k] = x.render;
}
/* 컨테이너 폭에 맞춰 그리는 SVG 차트 껍데기 (창 크기가 바뀌면 다시 그림, PNG·SVG 내보내기 지원) */
function xChart(w, draw, right = "", h) {
  const id = "ch" + (++chartSeq);
  charts.push({ id, w, draw });
  return card(w, `<div class="chart" id="${id}"${h ? ` style="min-height:${h}px"` : ""}></div>`, right);
}
const firstDs = (...ids) => ids.map(dsById).find(Boolean) || (cfg.datasets || []).find(d => !d.master) || (cfg.datasets || [])[0];
const fieldBy = (ds, re, pred) => (dsFields(ds).find(f => re.test(f.label) && (!pred || pred(f))) || {}).key || "";
const svgText = (s, max) => { s = String(s ?? ""); return s.length > max ? s.slice(0, Math.max(1, max - 1)) + "…" : s; };
const chartEmpty = (el, w, msg) => { el.innerHTML = `<div class="empty">${msg || (w.linked ? "조건에 맞는 기록이 없습니다. 기록을 입력하면 자동으로 그려집니다." : "표시할 데이터가 없습니다. 위젯 설정에서 항목을 추가하세요.")}</div>`; };

/* ===== 1. 파레토 차트: 항목별 값 막대(큰 순) + 누적 % 선, 강조 기준(기본 80%)까지의 핵심 항목을 진하게 ===== */
function paretoItems(items, top) {
  let a = (items || []).filter(i => +i.value > 0).map(i => ({ label: i.label, value: +i.value })).sort((x, y) => y.value - x.value);
  top = +top || 8;
  if (a.length > top) { const rest = a.slice(top - 1); a = [...a.slice(0, top - 1), { label: "기타", value: r2(rest.reduce((n, i) => n + i.value, 0)), other: true }]; }
  const total = a.reduce((n, i) => n + i.value, 0); let acc = 0;
  a.forEach(i => { acc += i.value; i.share = total ? r2(i.value / total * 100) : 0; i.cum = total ? r2(acc / total * 100) : 0; });
  return { items: a, total: r2(total) };
}
function drawPareto(el, w) {
  const items = w.pItems || [];
  if (!items.length) return chartEmpty(el, w);
  const Wd = Math.max(280, el.clientWidth), H = 240, m = { t: 16, r: 40, b: 30, l: 40 }, iw = Wd - m.l - m.r, ih = H - m.t - m.b;
  const yMax = niceMax(Math.max(...items.map(i => i.value)) * 1.08), y = v => m.t + ih - v / yMax * ih, yp = p => m.t + ih - p / 100 * ih;
  const band = iw / items.length, bw = Math.min(band * .64, 46), mark = +w.mark || 80, unit = esc(w.unit || "");
  const vital = items.findIndex(i => i.cum >= mark);                   /* 이 막대까지가 누적 mark% 안의 핵심 항목 */
  let g = "";
  for (let i = 0; i <= 4; i++) {
    const v = yMax / 4 * i, yy = y(v).toFixed(1);
    g += `<line class="${i ? "grid" : "base"}" x1="${m.l}" x2="${Wd - m.r}" y1="${yy}" y2="${yy}"/><text x="${m.l - 8}" y="${+yy + 4}" text-anchor="end" style="font-variant-numeric:tabular-nums">${fmt(+v.toFixed(2))}</text>`;
  }
  [0, 100].forEach(pc => { if (Math.abs(pc - mark) >= 8) g += `<text x="${Wd - m.r + 6}" y="${yp(pc) + 4}" text-anchor="start" style="font-variant-numeric:tabular-nums">${pc}%</text>`; });
  const my = yp(mark).toFixed(1);   /* 강조 기준선: 오른쪽 누적 % 축에 이름표 */
  g += `<line class="target" x1="${m.l}" x2="${Wd - m.r}" y1="${my}" y2="${my}" pointer-events="none"/><text class="target-lbl" x="${Wd - m.r + 6}" y="${+my + 4}" text-anchor="start">${mark}%</text>`;
  const maxCh = Math.max(2, Math.floor(band / 7));
  items.forEach((it, i) => {
    const cx = m.l + band * (i + .5), x = cx - bw / 2, strong = vital < 0 || i <= vital;
    g += barPath(x, y(it.value), bw, y(0) - y(it.value), 3, strong ? "var(--s1)" : "var(--s1-soft, var(--line-strong))",
      `${esc(it.label)}: <b>${fmt(it.value)}</b> ${unit}<br>비율 ${fmt(it.share)}% · 누적 <b>${fmt(it.cum)}%</b>`, w.linked && w.src?.by ? drillA(it.other ? { ex: [w.src.by, items.filter(y => !y.other).map(y => y.label)] } : { c: [[w.src.by, it.label]] }) : "");
    g += `<text class="endlbl" x="${cx}" y="${y(it.value) - 6}" text-anchor="middle">${fmt(it.value)}</text>`;
    g += `<text x="${cx}" y="${H - 8}" text-anchor="middle"><title>${esc(it.label)}</title>${esc(svgText(it.label, maxCh))}</text>`;
  });
  const pts = items.map((it, i) => [m.l + band * (i + .5), yp(it.cum)]);
  g += `<path d="${pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join("")}" fill="none" stroke="var(--s3)" stroke-width="2" stroke-linejoin="round"/>`;
  pts.forEach((p, i) => { g += `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="var(--s3)" stroke="var(--surface)" stroke-width="1.5"><title>누적 ${fmt(items[i].cum)}%</title></circle>`; });
  el.innerHTML = `<svg viewBox="0 0 ${Wd} ${H}" height="${H}" role="img" aria-label="${esc(w.title)}">${g}</svg>`;
}
regW("pareto", {
  name: "파레토 차트", desc: "큰 순서 막대 + 누적 %", linkable: true,
  def: () => { const ds = firstDs("claims", "defects"); return { type: "pareto", span: 6, title: "불량 유형 파레토", unit: "건", mark: 80, src: defaultSrc("pareto", ds?.id) }; },
  common: [["title", "제목", "text", 2], ["subtitle", "부제", "text", 2], ["unit", "단위", "text", 1], ["mark", "강조 기준 누적 % (기본 80)", "num", 1]],
  rows: { path: "items", label: "항목", tpl: () => ({ label: "", value: 0 }), fields: [{ k: "label", l: "항목명", t: "text" }, { k: "value", l: "값", t: "num" }] },
  src: (ds, h) => ({ ...h.s, by: fieldBy(ds, /유형|불량/, catF) || h.cat?.key || "", top: 8, period: "last3m" }),
  form: (P, s, ds) => ({ g: fld({ l: "분류 기준 항목", t: "sel", o: fOpts(ds, catF, "선택"), w: 2 }, `${P}.by`, s.by || "") + fld({ l: "막대 최대 개수 (나머지는 ‘기타’)", t: "num" }, `${P}.top`, s.top ?? 8) + `<span></span>` + measureFields(P, s, ds) + periodFields(P, s, ds) }),
  resolve(w, s, out) {
    const { recs, ds } = selectRecs(s);
    out.items = keysBy(recs, s.by, ds, "count").map(g => ({ label: g, value: aggregate(recs.filter(r => gin(r, s.by, g)), s) }));
  },
  render(w) {
    const p = paretoItems(w.items, w.src?.top); w.pItems = p.items;
    const vital = p.items.findIndex(i => i.cum >= (+w.mark || 80));
    return xChart(w, drawPareto, p.items.length ? `합계 ${fmt(p.total)}${w.unit ? " " + esc(w.unit) : ""} · 상위 ${vital < 0 ? p.items.length : vital + 1}개가 ${fmt(p.items[vital < 0 ? p.items.length - 1 : vital].cum)}%` : "");
  },
  exports: [["png", "이미지 (PNG)"], ["svg", "벡터 이미지 (SVG)"], ["xlsx", "데이터 엑셀"], ["csv", "데이터 CSV"]],
  table: w => { const p = paretoItems(w.items, w.src?.top); return [["항목", "값" + (w.unit ? ` (${w.unit})` : ""), "비율(%)", "누적(%)"], ...p.items.map(i => [i.label, i.value, i.share, i.cum])]; }
});

/* ===== 2. 히트맵: 두 분류(예: 부품 × 불량 유형)를 행·열로 놓고 값이 클수록 진하게 ===== */
function heatCells(recs, s, ds) {
  const rows = keysBy(recs, s.by, ds, "count", +s.topRows || 8), cols = keysBy(recs, s.by2, ds, "count", +s.topCols || 6);
  const v = rows.map(r => cols.map(c => aggregate(recs.filter(x => gin(x, s.by, r) && gin(x, s.by2, c)), s)));
  return { rows, cols, v };
}
regW("heatmap", {
  name: "히트맵", desc: "두 분류 교차 · 색 진하기", linkable: true,
  def: () => { const ds = firstDs("claims", "defects"); return { type: "heatmap", span: 12, title: "부품 × 불량 유형", unit: "건", src: defaultSrc("heatmap", ds?.id) }; },
  common: [["title", "제목", "text", 2], ["subtitle", "부제", "text", 1], ["unit", "단위", "text", 1]],
  src: (ds, h) => ({ ...h.s, by: fieldBy(ds, /부품|품명|라인/, catF) || h.cat?.key || "", by2: fieldBy(ds, /유형|불량/, catF) || "", topRows: 8, topCols: 6, period: "last3m" }),
  form: (P, s, ds) => ({ g: fld({ l: "행 (세로) 항목", t: "sel", o: fOpts(ds, catF, "선택"), w: 2 }, `${P}.by`, s.by || "") + fld({ l: "열 (가로) 항목", t: "sel", o: fOpts(ds, catF, "선택"), w: 2 }, `${P}.by2`, s.by2 || "")
    + fld({ l: "행 최대 개수", t: "num" }, `${P}.topRows`, s.topRows ?? 8) + fld({ l: "열 최대 개수", t: "num" }, `${P}.topCols`, s.topCols ?? 6) + `<span></span><span></span>` + measureFields(P, s, ds) + periodFields(P, s, ds) }),
  resolve(w, s, out) { const { recs, ds } = selectRecs(s); Object.assign(out, heatCells(recs, s, ds)); out.rowLabel = fieldOf(ds, s.by)?.label || ""; },
  render(w) {
    if (!w.rows?.length || !w.cols?.length) return card(w, `<div class="empty">${w.linked ? "조건에 맞는 기록이 없습니다." : "데이터를 연결하세요."}</div>`);
    const mx = Math.max(1, ...w.v.flat()), u = esc(w.unit || "");
    const rt = w.v.map(r => r.reduce((a, b) => a + b, 0)), ct = w.cols.map((_, j) => w.v.reduce((a, r) => a + r[j], 0)), tot = rt.reduce((a, b) => a + b, 0);
    const cell = (val, r, c) => { const pc = Math.round(val / mx * 100), strong = pc >= 55;
      return `<td class="hm-c${val ? "" : " zero"}" style="--hm:${Math.max(val ? 8 : 0, pc)}%" data-tip="${esc(w.rows[r])} · ${esc(w.cols[c])}: <b>${fmt(val)}</b> ${u}"${val && w.linked ? drillA({ c: [[w.src.by, w.rows[r]], [w.src.by2, w.cols[c]]] }) : ""}><span class="${strong ? "on" : ""}">${val ? fmt(val) : ""}</span></td>`; };
    return card(w, `<div class="tbl-wrap"><table class="hm"><thead><tr><th>${esc(w.rowLabel || "")}</th>${w.cols.map(c => `<th class="hm-h" title="${esc(c)}">${esc(c)}</th>`).join("")}<th class="r">합계</th></tr></thead>
      <tbody>${w.rows.map((r, i) => `<tr><th class="hm-r" title="${esc(r)}">${esc(r)}</th>${w.v[i].map((val, j) => cell(val, i, j)).join("")}<td class="r hm-t">${fmt(rt[i])}</td></tr>`).join("")}</tbody>
      <tfoot><tr><th>합계</th>${ct.map(x => `<td class="r hm-t">${fmt(x)}</td>`).join("")}<td class="r hm-t"><b>${fmt(tot)}</b></td></tr></tfoot></table></div>
      <div class="hm-legend"><span>0</span><i></i><span>${fmt(mx)}${u ? " " + u : ""}</span></div>`, w.unit ? `단위: ${u}` : "");
  },
  table: w => [[w.rowLabel || "", ...(w.cols || []), "합계"], ...(w.rows || []).map((r, i) => [r, ...w.v[i], w.v[i].reduce((a, b) => a + b, 0)])]
});

/* ===== 3. 관리도: 개별값(I) 또는 불량률(p) 관리도, 관리 한계 이탈·연속 경향 표시 ===== */
function controlPoints(recs, s, ds, df) {
  const sorted = [...recs].sort((a, b) => cmp(a[df], b[df]));
  let pts = [];
  if (s.mode === "p") {
    const groups = s.group === "month" ? [...new Set(sorted.map(r => ymOf(r[df])).filter(Boolean))].map(ym => ({ label: ymLabel(ym), recs: sorted.filter(r => ymOf(r[df]) === ym) }))
      : sorted.map(r => ({ label: String(r[df] || "").slice(5).replace("-", "/"), recs: [r], rid: r.id }));
    pts = groups.map(g => { const d = g.recs.reduce((n, r) => n + (+r[s.num] || 0), 0), n = g.recs.reduce((a, r) => a + (+r[s.den] || 0), 0); return n > 0 ? { label: g.label, d, n, v: d / n, rid: g.rid } : null; }).filter(Boolean);
  } else pts = sorted.filter(r => !blank(r[s.value]) && !isNaN(+r[s.value])).map(r => ({ label: String(r[df] || "").slice(5).replace("-", "/"), v: +r[s.value], rid: r.id, sub: s.labelField ? r[s.labelField] : "" }));
  const lim = +s.limit || 25; if (pts.length > lim) pts = pts.slice(-lim);
  if (pts.length < 2) return { pts, cl: null };
  if (s.mode === "p") {
    const D = pts.reduce((a, x) => a + x.d, 0), N = pts.reduce((a, x) => a + x.n, 0), pb = D / N;
    pts.forEach(x => { const sd = Math.sqrt(pb * (1 - pb) / x.n); x.ucl = pb + 3 * sd; x.lcl = Math.max(0, pb - 3 * sd); });
    return { pts, cl: pb };
  }
  const mean = pts.reduce((a, x) => a + x.v, 0) / pts.length;
  const mr = pts.slice(1).reduce((a, x, i) => a + Math.abs(x.v - pts[i].v), 0) / (pts.length - 1);
  const allPos = pts.every(x => x.v >= 0);
  pts.forEach(x => { x.ucl = mean + 2.66 * mr; x.lcl = allPos ? Math.max(0, mean - 2.66 * mr) : mean - 2.66 * mr; });
  return { pts, cl: mean, mr };
}
/* 관리 이탈(한계 밖)과 연속 7점 이상 한쪽 치우침 표시 */
function controlFlags(pts, cl) {
  pts.forEach(x => { x.out = x.v > x.ucl + 1e-12 || x.v < x.lcl - 1e-12; x.run = false; });
  let side = 0, start = 0;
  pts.forEach((x, i) => { const sd = x.v > cl ? 1 : x.v < cl ? -1 : 0; if (sd !== side) { side = sd; start = i; } if (side && i - start + 1 >= 7) for (let k = start; k <= i; k++) pts[k].run = true; });
  return { out: pts.filter(x => x.out).length, run: pts.filter(x => x.run && !x.out).length };
}
function niceTicks(lo, hi, n = 4) {
  const raw = (hi - lo || Math.abs(hi) || 1) / n, p = Math.pow(10, Math.floor(Math.log10(raw)));
  const st = [1, 2, 2.5, 5, 10].map(x => x * p).find(x => x >= raw - 1e-12);
  const a = Math.floor(lo / st + 1e-9) * st, b = Math.ceil(hi / st - 1e-9) * st, ticks = [];
  for (let v = a; v <= b + st / 2; v += st) ticks.push(+v.toFixed(10));
  return { lo: a, hi: b, ticks };
}
function drawControl(el, w) {
  const { pts, cl } = w.cc || {};
  if (!pts || pts.length < 2 || cl === null) return chartEmpty(el, w, w.linked ? "관리도를 그리려면 기록이 2개 이상 필요합니다." : "데이터를 연결하세요.");
  const sc = w.src?.mode === "p" ? (+w.src.scale || 100) : 1, u = w.src?.mode === "p" ? (sc >= 1e6 ? " ppm" : "%") : (w.unit ? " " + w.unit : "");
  const fv = v => fmt(sc >= 1e6 ? Math.round(v * sc) : Math.round(v * sc * 1000) / 1000);
  const Wd = Math.max(300, el.clientWidth), H = 250, m = { t: 16, r: 92, b: 30, l: 50 }, iw = Wd - m.l - m.r, ih = H - m.t - m.b;
  const spec = [w.usl, w.lsl].filter(v => typeof v === "number").map(v => v / sc);
  const all = [...pts.flatMap(x => [x.v, x.ucl, x.lcl]), ...spec];
  let lo = Math.min(...all), hi = Math.max(...all); const pad = (hi - lo) * .08 || Math.abs(hi) * .1 || 1; lo -= pad; hi += pad;
  if (pts.every(x => x.lcl >= 0) && lo < 0) lo = 0;
  const T = niceTicks(lo * sc, hi * sc); lo = T.lo / sc; hi = T.hi / sc;      /* 눈금은 보기 좋은 값으로 */
  const y = v => m.t + ih - (v - lo) / (hi - lo) * ih, step = iw / (pts.length - 1 || 1), x = i => m.l + i * step;
  let g = "";
  T.ticks.forEach(t => { const yy = y(t / sc).toFixed(1); g += `<line class="grid" x1="${m.l}" x2="${Wd - m.r}" y1="${yy}" y2="${yy}"/><text x="${m.l - 8}" y="${+yy + 4}" text-anchor="end" style="font-variant-numeric:tabular-nums">${fmt(t)}</text>`; });
  const lim = (k, cls, name) => { const same = pts.every(p => Math.abs(p[k] - pts[0][k]) < 1e-12);
    const d = same ? `M${m.l} ${y(pts[0][k])}H${Wd - m.r}` : pts.map((p, i) => `${i ? "L" : "M"}${(i ? x(i) - step / 2 : m.l).toFixed(1)} ${y(p[k]).toFixed(1)}H${(i === pts.length - 1 ? Wd - m.r : x(i) + step / 2).toFixed(1)}`).join("");
    return `<path class="${cls}" d="${d}" fill="none"/><text class="cc-lbl ${cls}" x="${Wd - m.r + 6}" y="${y(pts.at(-1)[k]) + 4}">${name} ${fv(pts.at(-1)[k])}</text>`; };
  g += `<line class="cc-cl" x1="${m.l}" x2="${Wd - m.r}" y1="${y(cl)}" y2="${y(cl)}"/><text class="cc-lbl cc-cl" x="${Wd - m.r + 6}" y="${y(cl) + 4}">CL ${fv(cl)}</text>`;
  g += lim("ucl", "cc-ucl", "UCL") + (pts.some(p => p.lcl > lo) ? lim("lcl", "cc-ucl", "LCL") : "");
  [["usl", "USL"], ["lsl", "LSL"]].forEach(([k, n]) => { if (typeof w[k] !== "number") return; const yy = y(w[k] / sc);
    g += `<line class="cc-spec" x1="${m.l}" x2="${Wd - m.r}" y1="${yy}" y2="${yy}"/><text class="cc-lbl cc-spec" x="${Wd - m.r + 6}" y="${yy + 4}">${n} ${fmt(w[k])}</text>`; });
  g += `<path d="${pts.map((p, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(p.v).toFixed(1)).join("")}" fill="none" stroke="var(--s1)" stroke-width="1.6" stroke-linejoin="round"/>`;
  const every = Math.max(1, Math.ceil(pts.length / Math.max(2, Math.floor(iw / 46))));
  pts.forEach((p, i) => {
    const col = p.out ? "var(--crit)" : p.run ? "var(--warn)" : "var(--s1)", r = p.out || p.run ? 4.5 : 3.2;
    const tip = `${esc(p.label)}${p.sub ? " · " + esc(p.sub) : ""}<br>값 <b>${fv(p.v)}${esc(u)}</b>${p.n ? ` (${fmt(p.d)}/${fmt(p.n)})` : ""}<br>UCL ${fv(p.ucl)} · LCL ${fv(p.lcl)}${p.out ? "<br><b>관리 한계 이탈</b>" : p.run ? "<br>연속 7점 한쪽 치우침" : ""}`;
    g += `<circle cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="${r}" fill="${col}" stroke="var(--surface)" stroke-width="1.5" data-tip="${esc(tip)}"${p.rid && w.src?.ds ? ` data-a="rec-open" data-ds="${esc(w.src.ds)}" data-id="${esc(p.rid)}" style="cursor:pointer"` : ""}/>`;
    if (i % every === 0 || (i === pts.length - 1 && i % every >= every * .6)) g += `<text x="${x(i).toFixed(1)}" y="${H - 8}" text-anchor="middle">${esc(p.label)}</text>`;
  });
  el.innerHTML = `<svg viewBox="0 0 ${Wd} ${H}" height="${H}" role="img" aria-label="${esc(w.title)}">${g}</svg>`;
}
regW("control", {
  name: "관리도", desc: "UCL·LCL과 이탈 점 표시", linkable: true,
  def: () => { const ds = firstDs("inspections", "cpk"); return { type: "control", span: 12, title: ds?.id === "inspections" ? "검사 불량률 p 관리도" : "관리도", src: defaultSrc("control", ds?.id) }; },
  common: [["title", "제목", "text", 2], ["unit", "단위 (개별값일 때)", "text", 1], ["subtitle", "부제", "text", 1], ["usl", "규격 상한 (선택)", "num", 1], ["lsl", "규격 하한 (선택)", "num", 1]],
  src(ds) {
    const den = fieldBy(ds, /검사|수량|투입|생산/, isNumF), num = fieldBy(ds, /불량/, isNumF);
    return num && den && num !== den ? { ds: ds.id, mode: "p", num, den, group: "record", scale: 100, limit: 25, period: "all", filter: [] }
      : { ds: ds.id, mode: "i", value: (dsFields(ds).find(isNumF) || {}).key || "", limit: 25, period: "all", filter: [] };
  },
  form(P, s, ds) {
    let g = fld({ l: "관리도 종류", t: "sel", o: [["i", "개별값 (I 관리도)"], ["p", "불량률 (p 관리도)"]], re: 1, w: 2 }, `${P}.mode`, s.mode || "i");
    if (s.mode === "p") g += fld({ l: "불량 수 항목", t: "sel", o: fOpts(ds, isNumF, "선택") }, `${P}.num`, s.num || "") + fld({ l: "검사 수 항목", t: "sel", o: fOpts(ds, isNumF, "선택") }, `${P}.den`, s.den || "")
      + fld({ l: "점 하나의 단위", t: "sel", o: [["record", "기록 하나 (로트)"], ["month", "월별 합계"]] }, `${P}.group`, s.group || "record") + fld({ l: "표시 단위", t: "selnum", o: [["100", "%"], ["1000000", "PPM"]] }, `${P}.scale`, String(s.scale || 100));
    else g += fld({ l: "값 항목", t: "sel", o: fOpts(ds, isNumF, "선택") }, `${P}.value`, s.value || "") + fld({ l: "점 이름 항목 (선택)", t: "sel", o: fOpts(ds, null, "없음") }, `${P}.labelField`, s.labelField || "");
    g += fld({ l: "최근 점 개수", t: "num" }, `${P}.limit`, s.limit ?? 25) + periodFields(P, s, ds).replace("기간 기준 날짜", "순서·기간 기준 날짜");
    return { g, extra: `<div class="hint" style="margin:6px 0">관리 한계: I 관리도는 평균 ± 2.66 × 이동범위 평균, p 관리도는 p̄ ± 3√(p̄(1−p̄)/n). 한계 밖 점은 빨강, 같은 쪽 연속 7점 이상은 주황으로 표시합니다.</div>` };
  },
  resolve(w, s, out) { const { recs, ds, df } = selectRecs(s); out.cc = controlPoints(recs, s, ds, s.dateField || df); if (out.cc.cl !== null && out.cc.pts.length) out.cf = controlFlags(out.cc.pts, out.cc.cl); },
  render(w) {
    const f = w.cf, right = f ? (f.out || f.run ? `<span class="cc-alert">${f.out ? `관리 이탈 ${f.out}점` : ""}${f.out && f.run ? " · " : ""}${f.run ? `연속 경향 ${f.run}점` : ""}</span>` : `<span class="cc-ok">관리 상태</span>`) + ` · ${w.cc.pts.length}점` : "";
    return xChart(w, drawControl, right);
  },
  exports: [["png", "이미지 (PNG)"], ["svg", "벡터 이미지 (SVG)"], ["xlsx", "데이터 엑셀"], ["csv", "데이터 CSV"]],
  table: w => { const sc = w.src?.mode === "p" ? (+w.src.scale || 100) : 1, f = v => Math.round(v * sc * 10000) / 10000;
    return [["점", "값", "CL", "UCL", "LCL", "판정"], ...(w.cc?.pts || []).map(p => [p.label, f(p.v), f(w.cc.cl), f(p.ucl), f(p.lcl), p.out ? "관리 이탈" : p.run ? "연속 경향" : ""])]; }
});

/* ===== 4. 이상 알림: 여러 데이터에 규칙(조건)을 걸어, 걸린 기록만 심각도별로 모아 보여 줌 ===== */
const LEVELS = [["critical", "긴급"], ["serious", "경고"], ["warning", "주의"]];
const doneOf = f => (f?.options || []).find(o => DONE.includes(o)) || "완료";
function autoAlertRules() {
  const rules = [];
  (cfg.datasets || []).filter(d => !d.master).forEach(d => {
    const F = d.fields || [], badge = F.find(f => f.badge);
    const due = (F.find(f => f.type === "date" && /기한|마감|납기|예정/.test(f.label)) || {}).key;
    if (badge && due && rules.length < 4) rules.push({ ds: d.id, label: `${d.name} 기한 초과`, level: "serious", filter: [{ f: due, op: "<", v: "today" }, { f: badge.key, op: "!=", v: doneOf(badge) }] });
    const cpk = F.find(f => f.type === "number" && /cpk/i.test(f.label + f.key));
    if (cpk) rules.unshift({ ds: d.id, label: "Cpk 1.33 미만", level: "critical", filter: [{ f: cpk.key, op: "<", v: "1.33" }] });
    if (/클레임/.test(d.name) && badge && d.dateField) rules.push({ ds: d.id, label: "30일 넘은 미결 클레임", level: "warning", filter: [{ f: d.dateField, op: "<", v: "today-30" }, { f: badge.key, op: "!=", v: doneOf(badge) }] });
  });
  return rules.slice(0, 6);
}
function alertRuleHits(rule) {
  const ds = dsById(rule.ds); if (!ds) return null;
  let recs = visibleRecs(ds).map(r => recView(ds, r));
  (rule.filter || []).forEach(c => { if (c.f && c.op) recs = recs.filter(r => matchCond(r, c)); });
  const tk = titleKeyOf(ds), df = ds.dateField;
  if (df) recs.sort((a, b) => cmp(a[df], b[df]));
  return { ds, hits: recs.map(r => ({ rid: r.id, title: r[tk] || "(제목 없음)", date: df ? r[df] : "", sub: (ds.fields || []).filter(f => f.type === "ref" || f.badge).slice(0, 2).map(f => r[f.key]).filter(v => !blank(v)).join(" · ") })) };
}
regW("alerts", {
  name: "이상 알림", desc: "조건에 걸린 기록만 경고", addRec: false,
  def: () => ({ type: "alerts", span: 6, title: "이상 알림", limit: 4, rules: autoAlertRules() }),
  common: [["title", "제목", "text", 3], ["limit", "규칙마다 보여 줄 최대 건수", "num", 1]],
  tpl: () => { const d = (cfg.datasets || []).find(x => !x.master); return { ds: d?.id || "", label: "새 규칙", level: "warning", filter: [] }; },
  editor(w, P) {
    const R = w.rules || [];
    return `<div class="glbl">알림 규칙<span>규칙마다 데이터와 조건을 고르면, 조건을 모두 만족하는 기록이 알림으로 나옵니다</span></div>
    <div class="rows">${R.map((r, i) => { const ds = dsById(r.ds), p = `${P}.rules.${i}`;
      return `<div class="icard"><div class="icard-h"><span>${esc(r.label || "규칙 " + (i + 1))}</span><span>${rowBtns(`${P}.rules`, i)}</span></div>
        <div class="cgrid">${fld({ l: "이름", t: "text", w: 2 }, `${p}.label`, r.label)}${fld({ l: "심각도", t: "sel", o: LEVELS }, `${p}.level`, r.level || "warning")}${fld({ l: "데이터", t: "sel", o: dsOpts(), re: 1 }, `${p}.ds`, r.ds || "")}</div>
        ${ds ? filterHTML(p, r, ds) : `<div class="empty">데이터를 고르세요.</div>`}</div>`; }).join("")}</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" class="btn sm" data-a="r-add" data-p="${P}.rules" data-type="alerts">＋ 규칙 추가</button><button type="button" class="btn sm" data-a="alerts-auto" data-p="${P}">데이터를 보고 규칙 자동 구성</button></div>`;
  },
  resolveAny(w) {
    w.groups = (w.rules || []).map((r, i) => { const h = alertRuleHits(r); return h ? { i, label: r.label || h.ds.name, level: r.level || "warning", ds: h.ds, hits: h.hits } : null; }).filter(Boolean);
    const rank = { critical: 0, serious: 1, warning: 2 };
    w.groups.sort((a, b) => (b.hits.length ? 0 : 1) - (a.hits.length ? 0 : 1) || rank[a.level] - rank[b.level]);
    return w;
  },
  render(w) {
    const G = w.groups || [], lim = +w.limit || 4;
    if (!G.length) return card(w, `<div class="empty">알림 규칙이 없습니다. 편집에서 규칙을 추가하세요.</div>`);
    const cnt = Object.fromEntries(LEVELS.map(([k]) => [k, G.filter(g => g.level === k).reduce((n, g) => n + g.hits.length, 0)]));
    const total = G.reduce((n, g) => n + g.hits.length, 0);
    const head = total ? `<div class="al-sum">${LEVELS.filter(([k]) => cnt[k]).map(([k, l]) => `<span class="al-chip ${k}">${l} <b>${cnt[k]}</b></span>`).join("")}</div>` : `<div class="al-clear">✓ 모든 규칙에서 이상이 없습니다.</div>`;
    const body = G.filter(g => g.hits.length).map(g => `<div class="al-grp ${g.level}">
      <div class="al-gh"><span class="al-dot" aria-hidden="true"></span><b>${esc(g.label)}</b><span class="al-n">${g.hits.length}건</span><a href="#data-${esc(g.ds.id)}" class="al-more">${esc(g.ds.name)} ›</a></div>
      ${g.hits.slice(0, lim).map(h => `<div class="al-item rowlink" data-a="rec-open" data-ds="${esc(g.ds.id)}" data-id="${esc(h.rid)}" tabindex="0" title="눌러서 열기"><span class="al-t">${esc(h.title)}</span><span class="al-s">${esc([h.sub, h.date].filter(Boolean).join(" · "))}</span></div>`).join("")}
      ${g.hits.length > lim ? `<div class="al-rest">외 ${g.hits.length - lim}건</div>` : ""}</div>`).join("");
    const ok = G.filter(g => !g.hits.length);
    return card(w, head + body + (ok.length ? `<div class="al-oks">${ok.map(g => `<span>✓ ${esc(g.label)}</span>`).join("")}</div>` : ""), total ? `${total}건` : "이상 없음");
  },
  table: w => [["규칙", "심각도", "데이터", "기록", "날짜"], ...(w.groups || []).flatMap(g => g.hits.map(h => [g.label, (LEVELS.find(l => l[0] === g.level) || [])[1], g.ds.name, h.title, h.date || ""]))]
});

/* ===== 5. 간트 차트: 시작~끝 날짜를 가로 막대로, 오늘 선 · 지연은 빨강 · 완료는 초록 · 시작일 없으면 ◆ ===== */
const dnum = d => { const t = Date.parse(String(d || "").slice(0, 10) + "T00:00:00"); return isNaN(t) ? null : t / 864e5; };
const dstr = n => new Date(n * 864e5).toLocaleDateString("sv-SE");
regW("gantt", {
  name: "간트 차트", desc: "일정 막대 + 오늘 선", linkable: true, addRec: true,
  def: () => { const ds = firstDs("capa", "ppap", "tasks"); return { type: "gantt", span: 12, title: `${ds?.name || ""} 일정`, src: defaultSrc("gantt", ds?.id) }; },
  common: [["title", "제목", "text", 3], ["subtitle", "부제", "text", 1]],
  src(ds, h) {
    const D = dsFields(ds).filter(dateF), badge = h.badge;
    const start = (D.find(f => /시작|발행|접수|착수|등록|발생/.test(f.label)) || (D.length > 1 ? D[0] : null) || {}).key || "";
    const end = (D.find(f => /기한|마감|납기|예정|종료|목표|SOP/i.test(f.label) && f.key !== start) || D.find(f => f.key !== start) || {}).key || "";
    return { ds: ds.id, title: titleKeyOf(ds) || "", start, end, status: badge?.key || "", sub: (dsFields(ds).find(f => f.refType && /담당/.test(f.label)) || {}).key || "", range: "auto", limit: 15, period: "all", filter: h.notDone };
  },
  form: (P, s, ds) => ({ g: fld({ l: "막대 이름 항목", t: "sel", o: fOpts(ds, null, "선택"), w: 2 }, `${P}.title`, s.title || "") + fld({ l: "보조 정보 항목", t: "sel", o: fOpts(ds, null, "없음"), w: 2 }, `${P}.sub`, s.sub || "")
    + fld({ l: "시작 날짜", t: "sel", o: fOpts(ds, dateF, "없음 (끝 날짜만 ◆ 표시)") }, `${P}.start`, s.start || "") + fld({ l: "끝 날짜 (기한)", t: "sel", o: fOpts(ds, dateF, "선택") }, `${P}.end`, s.end || "")
    + fld({ l: "상태 항목 (완료 판단)", t: "sel", o: fOpts(ds, f => f.type === "select", "없음") }, `${P}.status`, s.status || "") + fld({ l: "실제 완료일 (선택)", t: "sel", o: fOpts(ds, dateF, "없음") }, `${P}.done`, s.done || "")
    + fld({ l: "보이는 기간", t: "sel", o: [["auto", "기록에 맞춤"], ["3", "오늘 기준 앞뒤 3개월"], ["6", "오늘 기준 앞뒤 6개월"]] }, `${P}.range`, s.range || "auto") + fld({ l: "최대 줄 수", t: "num" }, `${P}.limit`, s.limit ?? 15) + `<span></span><span></span>` + periodFields(P, s, ds) }),
  resolve(w, s, out) {
    const { recs } = selectRecs(s), T = dnum(TODAY());
    let rows = recs.map(r => {
      const a = dnum(r[s.start]), b = dnum(r[s.end]), fin = dnum(r[s.done]);
      const st = s.status ? r[s.status] : "", done = DONE.includes(st) || (!!s.done && fin !== null);
      if (a === null && b === null) return null;
      const late = !done && b !== null && b < T;
      return { rid: r.id, label: r[s.title] || "(제목 없음)", sub: s.sub ? r[s.sub] : "", a, b, fin, st, done, late };
    }).filter(Boolean);
    rows.sort((x, y) => (x.a ?? x.b) - (y.a ?? y.b));
    if (+s.limit && rows.length > +s.limit) { const near = [...rows].sort((x, y) => Math.abs((x.b ?? x.a) - T) - Math.abs((y.b ?? y.a) - T)).slice(0, +s.limit); rows = rows.filter(r => near.includes(r)); }
    let lo, hi;
    if (s.range === "3" || s.range === "6") { const n = +s.range * 30; lo = T - n; hi = T + n; }
    else { lo = Math.min(T, ...rows.map(r => r.a ?? r.b)); hi = Math.max(T, ...rows.map(r => Math.max(r.b ?? r.a, r.fin ?? 0))); const pad = Math.max(3, (hi - lo) * .04); lo -= pad; hi += pad; }
    Object.assign(out, { grows: rows, lo, hi, T });
  },
  render(w) {
    const R = w.grows || [];
    if (!R.length) return card(w, `<div class="empty">${w.linked ? "날짜가 있는 기록이 없습니다." : "데이터를 연결하세요."}</div>`);
    const { lo, hi, T } = w, span = hi - lo || 1, pc = v => Math.max(0, Math.min(100, (v - lo) / span * 100));
    const months = []; { const d = new Date(lo * 864e5); d.setDate(1); d.setMonth(d.getMonth() + 1); while (d.getTime() / 864e5 < hi) { months.push(d.getTime() / 864e5); d.setMonth(d.getMonth() + 1); } }
    const step = Math.ceil(months.length / 8) || 1;
    const ticks = months.filter((_, i) => i % step === 0).map(m => `<span class="gt-tick" style="left:${pc(m)}%">${new Date(m * 864e5).getMonth() + 1}월</span>`).join("");
    const grid = months.map(m => `<i class="gt-grid" style="left:${pc(m)}%"></i>`).join("");
    const today = T >= lo && T <= hi ? `<i class="gt-today" style="left:${pc(T)}%"></i>` : "";
    const lab = r => `${r.a !== null ? dstr(r.a) : ""}${r.a !== null && r.b !== null ? " ~ " : ""}${r.b !== null ? dstr(r.b) : ""}`;
    const rows = R.map(r => {
      const cls = r.done ? "done" : r.late ? "late" : "on";
      const tip = `<b>${esc(r.label)}</b><br>${esc(lab(r))}${r.st ? "<br>" + esc(r.st) : ""}${r.late ? `<br>기한 ${Math.round(T - r.b)}일 지남` : !r.done && r.b !== null ? `<br>남은 기간 ${Math.round(r.b - T)}일` : ""}`;
      let bar;
      if (r.a === null) bar = `<i class="gt-ms ${cls}" style="left:${pc(r.b)}%" data-tip="${esc(tip)}"></i>`;
      else { const end = r.b ?? Math.max(T, r.a + 1); bar = `<i class="gt-bar ${cls}${r.b === null ? " open" : ""}" style="left:${pc(r.a)}%;width:${Math.max(.8, pc(end) - pc(r.a))}%" data-tip="${esc(tip)}"></i>`; }
      return `<div class="gt-row rowlink" data-a="rec-open" data-ds="${esc(w.src.ds)}" data-id="${esc(r.rid)}" tabindex="0" title="눌러서 열기">
        <div class="gt-lbl"><span class="gt-t">${esc(r.label)}</span>${r.sub ? `<span class="gt-s">${esc(r.sub)}</span>` : ""}</div>
        <div class="gt-track">${grid}${today}${bar}</div></div>`;
    }).join("");
    const late = R.filter(r => r.late).length;
    return card(w, `<div class="gnt"><div class="gt-head"><div class="gt-lbl"></div><div class="gt-track">${ticks}${today ? `<span class="gt-tick today" style="left:${pc(T)}%">오늘</span>` : ""}</div></div>${rows}</div>
      <div class="gt-legend"><span><i class="on"></i>진행</span><span><i class="late"></i>기한 지남</span><span><i class="done"></i>완료</span><span><i class="ms"></i>기한만 있음</span></div>`,
      `${R.length}건${late ? ` · <span class="cc-alert">지연 ${late}</span>` : ""}`);
  },
  table: w => [["이름", "보조 정보", "시작", "끝", "상태", "판정"], ...(w.grows || []).map(r => [r.label, r.sub || "", r.a !== null ? dstr(r.a) : "", r.b !== null ? dstr(r.b) : "", r.st || "", r.done ? "완료" : r.late ? "지연" : "진행"])]
});

/* ===== 6. 달력: 날짜 항목을 월 달력에 표시, ◀ ▶로 달 이동, 눌러서 기록 열기 ===== */
const calMonth = {};                                    /* 위젯마다 보고 있는 달 (페이지id:순번 → "YYYY-MM") */
const calKey = () => `${boardPage?.id || ""}:${curWi}`;
regW("calendar", {
  name: "달력", desc: "월 달력에 일정 표시", linkable: true, addRec: true,
  def: () => { const ds = firstDs("auditplan", "tasks", "ppap"); return { type: "calendar", span: 6, title: `${ds?.name || ""} 달력`, src: defaultSrc("calendar", ds?.id) }; },
  common: [["title", "제목", "text", 3], ["subtitle", "부제", "text", 1]],
  src: (ds, h) => ({ ds: ds.id, date: (dsFields(ds).find(f => dateF(f) && /기한|마감|일정|예정|심사|납기/.test(f.label)) || {}).key || ds.dateField || (dsFields(ds).find(dateF) || {}).key || "",
    title: titleKeyOf(ds) || "", color: h.badge?.key || (dsFields(ds).find(isTagF) || {}).key || "", period: "all", filter: [] }),
  form: (P, s, ds) => ({ g: fld({ l: "날짜 항목", t: "sel", o: fOpts(ds, dateF, "선택") }, `${P}.date`, s.date || "") + fld({ l: "표시할 이름", t: "sel", o: fOpts(ds, null, "선택") }, `${P}.title`, s.title || "")
    + fld({ l: "색 구분 항목", t: "sel", o: fOpts(ds, f => f.type === "select", "없음"), w: 2 }, `${P}.color`, s.color || "") }),
  resolve(w, s, out) {
    const { recs, ds } = selectRecs(s, "all"), cf = s.color ? fieldOf(ds, s.color) : null;
    out.events = recs.filter(r => dnum(r[s.date]) !== null).map(r => ({ rid: r.id, d: String(r[s.date]).slice(0, 10), t: r[s.title] || "(제목 없음)", c: cf ? r[s.color] : "", done: DONE.includes(r[s.color]) }));
    out.colorField = cf;
  },
  render(w) {
    if (!w.linked) return card(w, `<div class="empty">데이터를 연결하세요.</div>`);
    const key = calKey(), ym = calMonth[key] || ymOf(TODAY()), [Y, M] = ym.split("-").map(Number);
    const first = new Date(Y, M - 1, 1), startDow = first.getDay(), days = new Date(Y, M, 0).getDate(), today = TODAY();
    const ev = {}; (w.events || []).forEach(e => { if (e.d.slice(0, 7) === ym) (ev[e.d] ||= []).push(e); });
    const n = Object.values(ev).reduce((a, x) => a + x.length, 0);
    const chip = e => `<button type="button" class="cal-ev${e.done ? " done" : ""}" data-a="rec-open" data-ds="${esc(w.src.ds)}" data-id="${esc(e.rid)}" title="${esc(e.t)}${e.c ? " · " + esc(e.c) : ""}"${w.colorField && e.c ? ` style="--ev:var(--t-${tagColor(w.colorField, e.c)}-i)"` : ""}>${esc(e.t)}</button>`;
    let cells = "";
    for (let i = 0; i < startDow; i++) cells += `<div class="cal-d out"></div>`;
    for (let d = 1; d <= days; d++) {
      const ds = `${ym}-${String(d).padStart(2, "0")}`, list = ev[ds] || [], dow = (startDow + d - 1) % 7;
      cells += `<div class="cal-d${ds === today ? " today" : ""}${dow === 0 ? " sun" : dow === 6 ? " sat" : ""}"><span class="cal-n">${d}</span>${list.slice(0, 3).map(chip).join("")}${list.length > 3 ? `<span class="cal-more" title="${esc(list.slice(3).map(e => e.t).join(", "))}">+${list.length - 3}</span>` : ""}</div>`;
    }
    const trail = (7 - (startDow + days) % 7) % 7; for (let i = 0; i < trail; i++) cells += `<div class="cal-d out"></div>`;
    return card(w, `<div class="cal-bar"><button type="button" class="ib" data-cal="-1" data-k="${esc(key)}" aria-label="이전 달">◀</button><b>${Y}년 ${M}월</b><button type="button" class="ib" data-cal="1" data-k="${esc(key)}" aria-label="다음 달">▶</button>${ym !== ymOf(today) ? `<button type="button" class="ib" data-cal="0" data-k="${esc(key)}">이번 달</button>` : ""}</div>
      <div class="cal"><div class="cal-w sun">일</div><div class="cal-w">월</div><div class="cal-w">화</div><div class="cal-w">수</div><div class="cal-w">목</div><div class="cal-w">금</div><div class="cal-w sat">토</div>${cells}</div>`, `${M}월 ${n}건`);
  },
  table: w => [["날짜", "이름", "구분"], ...(w.events || []).slice().sort((a, b) => a.d.localeCompare(b.d)).map(e => [e.d, e.t, e.c || ""])]
});
document.addEventListener("click", e => {
  const b = e.target.closest?.("[data-cal]"); if (!b) return;
  e.preventDefault(); e.stopPropagation();
  const k = b.dataset.k, d = +b.dataset.cal, cur = calMonth[k] || ymOf(TODAY());
  calMonth[k] = d === 0 ? ymOf(TODAY()) : ymAdd(cur, d);
  render();
}, true);

/* ===== 7. 단계 보드(칸반): 단계(선택 항목)별 열에 카드, 끌어서 다른 열에 놓으면 그 기록의 단계가 바뀜 ===== */
const ddayText = (d, done) => { const n = dnum(d), T = dnum(TODAY()); if (n === null || done) return ["", ""]; const k = Math.round(n - T); return [k < 0 ? `D+${-k}` : k === 0 ? "D-Day" : `D-${k}`, k < 0 ? "over" : k <= 3 ? "soon" : ""]; };
regW("kanban", {
  name: "단계 보드", desc: "단계별 카드 · 끌어서 이동", linkable: true, addRec: true,
  def: () => { const ds = firstDs("capa", "ppap", "tasks"); return { type: "kanban", span: 12, title: `${ds?.name || ""} 단계 보드`, src: defaultSrc("kanban", ds?.id) }; },
  common: [["title", "제목", "text", 3], ["subtitle", "부제", "text", 1]],
  src(ds, h) {
    const sel = dsFields(ds).filter(f => f.type === "select" && !f.refType);
    const col = (sel.find(f => /단계|진행|스텝|step/i.test(f.label + f.key) && !f.badge) || h.badge || sel[0] || {}).key || "";
    return { ds: ds.id, col, title: titleKeyOf(ds) || "", owner: (dsFields(ds).find(f => /담당/.test(f.label)) || {}).key || "", due: (dsFields(ds).find(f => dateF(f) && /기한|마감|납기/.test(f.label)) || {}).key || "",
      hideEmpty: false, limit: 8, period: "all", filter: col === h.badge?.key ? [] : h.notDone };
  },
  form: (P, s, ds) => ({ g: fld({ l: "열(단계) 항목", t: "sel", o: fOpts(ds, f => f.type === "select" && !f.refType, "선택"), w: 2 }, `${P}.col`, s.col || "") + fld({ l: "카드 제목", t: "sel", o: fOpts(ds, null, "선택"), w: 2 }, `${P}.title`, s.title || "")
    + fld({ l: "담당 항목", t: "sel", o: fOpts(ds, null, "없음") }, `${P}.owner`, s.owner || "") + fld({ l: "기한 항목", t: "sel", o: fOpts(ds, dateF, "없음") }, `${P}.due`, s.due || "") + fld({ l: "열마다 최대 카드", t: "num" }, `${P}.limit`, s.limit ?? 8) + fld({ l: "빈 열 숨기기", t: "chk" }, `${P}.hideEmpty`, s.hideEmpty) + periodFields(P, s, ds) }),
  resolve(w, s, out) {
    const { recs, ds } = selectRecs(s), f = fieldOf(ds, s.col), opts = f?.options || [];
    const keys = [...opts, ...new Set(recs.map(r => r[s.col]).filter(v => !blank(v) && !opts.includes(v)))];
    out.cols = keys.map(k => ({ k, f, cards: recs.filter(r => r[s.col] === k).map(r => ({ rid: r.id, t: r[s.title] || "(제목 없음)", o: s.owner ? r[s.owner] : "", d: s.due ? r[s.due] : "" })) }));
    const none = recs.filter(r => blank(r[s.col])); if (none.length) out.cols.push({ k: "", f, cards: none.map(r => ({ rid: r.id, t: r[s.title] || "(제목 없음)", o: s.owner ? r[s.owner] : "", d: s.due ? r[s.due] : "" })) });
    if (s.hideEmpty) out.cols = out.cols.filter(c => c.cards.length);
    out.colField = f;
  },
  render(w) {
    if (!w.linked) return card(w, `<div class="empty">데이터를 연결하세요.</div>`);
    if (!w.colField) return card(w, `<div class="empty">열(단계)로 쓸 선택 항목을 고르세요.</div>`);
    const lim = +w.src.limit || 8, drag = !lay.on;
    const cols = (w.cols || []).map(c => `<div class="kb-col" data-kb-col="${esc(c.k)}" data-kb-ds="${esc(w.src.ds)}" data-kb-f="${esc(w.src.col)}">
      <div class="kb-h">${c.k ? chipFor(c.f, c.k) : `<span class="tag-empty">비어 있음</span>`}<span class="kb-n">${c.cards.length}</span></div>
      <div class="kb-list">${c.cards.slice(0, lim).map(k => { const [dd, cls] = ddayText(k.d, DONE.includes(c.k));
        return `<div class="kb-card" ${drag ? `draggable="true"` : ""} data-kb-id="${esc(k.rid)}" data-a="rec-open" data-ds="${esc(w.src.ds)}" data-id="${esc(k.rid)}" tabindex="0" title="눌러서 열기 · 끌어서 단계 이동">
          <div class="kb-t">${esc(k.t)}</div>${k.o || dd ? `<div class="kb-m"><span>${esc(k.o || "")}</span>${dd ? `<span class="dd ${cls}">${dd}</span>` : ""}</div>` : ""}</div>`; }).join("")}
        ${c.cards.length > lim ? `<a class="kb-more" href="#data-${esc(w.src.ds)}">외 ${c.cards.length - lim}건</a>` : ""}${!c.cards.length ? `<div class="kb-empty">여기로 끌어 놓기</div>` : ""}</div></div>`).join("");
    const total = (w.cols || []).reduce((n, c) => n + c.cards.length, 0);
    return card(w, `<div class="kb">${cols}</div>`, `${total}건`);
  },
  table: w => [["단계", "카드", "담당", "기한"], ...(w.cols || []).flatMap(c => c.cards.map(k => [c.k, k.t, k.o || "", k.d || ""]))]
});
/* 카드 끌어 옮기기 → 그 기록의 단계 값을 바꾸고 저장 (되돌리기 가능) */
let kbDrag = null;
document.addEventListener("dragstart", e => {
  const c = e.target.closest?.(".kb-card"); if (!c || lay.on) return;
  const col = c.closest(".kb-col"); kbDrag = { id: c.dataset.kbId, ds: col.dataset.kbDs, f: col.dataset.kbF, from: col.dataset.kbCol };
  e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", c.dataset.kbId); setTimeout(() => c.classList.add("dragging"), 0);
});
document.addEventListener("dragover", e => {
  if (!kbDrag) return; const col = e.target.closest?.(".kb-col");
  document.querySelectorAll(".kb-col.over").forEach(x => x !== col && x.classList.remove("over"));
  if (!col || col.dataset.kbDs !== kbDrag.ds) return; e.preventDefault(); e.dataTransfer.dropEffect = "move"; col.classList.add("over");
});
document.addEventListener("drop", e => {
  if (!kbDrag) return; const col = e.target.closest?.(".kb-col"), d = kbDrag; kbDrag = null;
  document.querySelectorAll(".kb-col.over").forEach(x => x.classList.remove("over"));
  if (!col || col.dataset.kbDs !== d.ds) return; e.preventDefault();
  const to = col.dataset.kbCol; if (to === d.from) return;
  const ds = dsById(d.ds), rec = (ds?.records || []).find(r => r.id === d.id); if (!rec) return;
  const snap = JSON.stringify(cfg), f = dsFields(ds).find(x => x.key === d.f), tk = titleKeyOf(ds);
  rec[d.f] = to;
  if (f?.badge && DONE.includes(to)) { const cl = (ds.fields || []).find(x => x.closes && blank(rec[x.key])); if (cl) rec[cl.key] = TODAY(); }   /* 완료로 옮기면 완료일 자동 입력 */
  persist(); render();
  toast(`‘${rec[tk] || "기록"}’ → ${to || "비어 있음"}`, () => { cfg = JSON.parse(snap); persist(); render(); toast("되돌렸습니다."); });
});
document.addEventListener("dragend", () => { kbDrag = null; document.querySelectorAll(".kb-card.dragging").forEach(x => x.classList.remove("dragging")); document.querySelectorAll(".kb-col.over").forEach(x => x.classList.remove("over")); });

/* ===== 8. D-Day 카운트다운: 중요한 날까지 남은 날을 큰 숫자로 (직접 입력 또는 데이터의 다가오는 날짜) ===== */
regW("dday", {
  name: "D-Day", desc: "중요한 날까지 남은 일수", linkable: true,
  def: () => {     /* 다가오는 날짜가 가장 많은 데이터를 기본으로 */
    const T = TODAY(), cand = ["ppap", "auditplan", "launch", "tasks"].map(dsById).filter(Boolean);
    const ds = cand.map(d => { const k = defaultSrc("dday", d.id).date; return [d, (d.records || []).filter(r => String(r[k] || "") >= T).length]; }).sort((a, b) => b[1] - a[1])[0]?.[0] || firstDs();
    return { type: "dday", span: 6, title: "다가오는 주요 일정", src: defaultSrc("dday", ds?.id) }; },
  common: [["title", "제목", "text", 3], ["showPast", "지난 일정도 표시", "chk", 1]],
  rows: { path: "items", label: "일정", tpl: () => ({ label: "", date: isoIn(30), note: "" }), fields: [{ k: "label", l: "이름 (예: H사 품질 감사)", t: "text", w: 2 }, { k: "date", l: "날짜", t: "date" }, { k: "note", l: "메모", t: "text" }] },
  src: (ds, h) => ({ ds: ds.id, title: titleKeyOf(ds) || "", date: (dsFields(ds).find(f => dateF(f) && /SOP|양산|감사|심사|기한|납기|예정/i.test(f.label)) || {}).key || ds.dateField || "", sub: (dsFields(ds).find(f => f.refType && /고객/.test(f.label)) || {}).key || "", limit: 4, period: "all", filter: h.notDone }),
  form: (P, s, ds) => ({ g: fld({ l: "이름 항목", t: "sel", o: fOpts(ds, null, "선택") }, `${P}.title`, s.title || "") + fld({ l: "날짜 항목", t: "sel", o: fOpts(ds, dateF, "선택") }, `${P}.date`, s.date || "") + fld({ l: "보조 정보", t: "sel", o: fOpts(ds, null, "없음") }, `${P}.sub`, s.sub || "") + fld({ l: "표시 개수", t: "num" }, `${P}.limit`, s.limit ?? 4) }),
  resolve(w, s, out) {
    const { recs } = selectRecs(s, "all"), T = dnum(TODAY());
    out.items = recs.filter(r => dnum(r[s.date]) !== null).map(r => ({ rid: r.id, label: r[s.title] || "(제목 없음)", date: String(r[s.date]).slice(0, 10), note: s.sub ? r[s.sub] : "" }))
      .filter(i => w.showPast || dnum(i.date) >= T).sort((a, b) => a.date.localeCompare(b.date)).slice(0, +s.limit || 4);
  },
  render(w) {
    const T = dnum(TODAY());
    let L = (w.items || []).filter(i => dnum(i.date) !== null);
    if (!w.linked) L = L.filter(i => w.showPast || dnum(i.date) >= T).sort((a, b) => a.date.localeCompare(b.date));
    if (!L.length) return card(w, `<div class="empty">${w.linked ? "다가오는 일정이 없습니다." : "편집에서 일정을 추가하세요."}</div>`);
    const wd = ["일", "월", "화", "수", "목", "금", "토"];
    return card(w, `<div class="dd-grid">${L.map(i => { const k = Math.round(dnum(i.date) - T), cls = k < 0 ? "past" : k === 0 ? "today" : k <= 7 ? "soon" : "";
      return `<div class="dd-b ${cls}${i.rid ? " rowlink" : ""}" ${i.rid ? `data-a="rec-open" data-ds="${esc(w.src.ds)}" data-id="${esc(i.rid)}" tabindex="0" title="눌러서 열기"` : ""}>
        <div class="dd-num">${k === 0 ? "D-Day" : k > 0 ? `D-${k}` : `D+${-k}`}</div>
        <div class="dd-l">${esc(i.label)}</div><div class="dd-s">${esc(i.date)} (${wd[new Date(i.date + "T00:00:00").getDay()]})${i.note ? " · " + esc(i.note) : ""}</div></div>`; }).join("")}</div>`);
  },
  table: w => [["이름", "날짜", "남은 일수", "메모"], ...(w.items || []).map(i => [i.label, i.date, Math.round(dnum(i.date) - dnum(TODAY())), i.note || ""])]
});

/* ===== 9. 목표 대비 게이지: 반원에 양호·주의·위험 구간과 현재 값, 목표선 ===== */
function gaugeState(v, g, low) { if (typeof g !== "number" || v === null) return ""; return low ? (v <= g ? "good" : v <= g * 1.2 ? "warning" : "serious") : (v >= g ? "good" : v >= g * .9 ? "warning" : "serious"); }
function drawGauge(el, w) {
  const v = typeof w.gv === "number" ? w.gv : null, g = typeof w.goal === "number" ? w.goal : null, low = !!w.lowerIsBetter;
  if (v === null) return chartEmpty(el, w, w.linked ? "아직 기록이 없습니다." : "값을 입력하세요.");
  const mx = typeof w.max === "number" && w.max > 0 ? w.max : niceMax(Math.max(v, g ?? 0) * (low ? 1.6 : 1.25) || 1);
  const Wd = Math.max(220, el.clientWidth), cx = Wd / 2, R = Math.min(Wd / 2 - 30, 120), cy = R + 20, H = cy + 56, th = Math.max(14, R * .18);
  const ang = x => Math.PI * (1 - Math.max(0, Math.min(1, x / mx))), pt = (a, r) => [cx + r * Math.cos(a), cy - r * Math.sin(a)];
  const arc = (a0, a1, cls) => { const [x0, y0] = pt(ang(a0), R), [x1, y1] = pt(ang(a1), R); return `<path class="${cls}" d="M${x0.toFixed(1)} ${y0.toFixed(1)}A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke-width="${th}"/>`; };
  let gz = arc(0, mx, "gz-track");
  if (g !== null) {
    const z = low ? [[0, g, "gz-good"], [g, Math.min(mx, g * 1.2), "gz-warn"], [Math.min(mx, g * 1.2), mx, "gz-bad"]] : [[0, g * .9, "gz-bad"], [g * .9, Math.min(mx, g), "gz-warn"], [Math.min(mx, g), mx, "gz-good"]];
    z.forEach(([a, b, c]) => { if (b > a) gz += arc(a, b, c); });
  }
  const st = gaugeState(v, g, low), [nx, ny] = pt(ang(v), R * .66);
  gz += `<line class="gz-needle" x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}"/><circle cx="${cx}" cy="${cy}" r="6" class="gz-hub"/>`;
  if (g !== null) { const [a1, b1] = pt(ang(g), R + th / 2 + 2), [a2, b2] = pt(ang(g), R - th / 2 - 2), [lx, ly] = pt(ang(g), R + th / 2 + 12);
    gz += `<line class="gz-goal" x1="${a1}" y1="${b1}" x2="${a2}" y2="${b2}"/><text class="gz-gl" x="${lx}" y="${ly}" text-anchor="${g / mx < .4 ? "end" : g / mx > .6 ? "start" : "middle"}">목표 ${fmt(g)}</text>`; }
  gz += `<text class="gz-v gz-${st}" x="${cx}" y="${cy + 44}" text-anchor="middle">${fmt(v)}<tspan class="gz-u" dx="3">${esc(w.unit || "")}</tspan></text>`;
  gz += `<text class="gz-ax" x="${cx - R}" y="${cy + 16}" text-anchor="middle">0</text><text class="gz-ax" x="${cx + R}" y="${cy + 16}" text-anchor="middle">${fmt(mx)}</text>`;
  el.innerHTML = `<svg viewBox="0 0 ${Wd} ${H}" height="${H}" role="img" aria-label="${esc(w.title)}: ${fmt(v)} ${esc(w.unit || "")}">${gz}</svg>`;
}
regW("gauge", {
  name: "목표 게이지", desc: "반원 게이지 · 목표 구간", linkable: true,
  def: () => { const ds = firstDs("defects", "claims"); return { type: "gauge", span: 4, title: "이번 달 불량 수량", unit: "개", goal: 200, lowerIsBetter: true, src: defaultSrc("gauge", ds?.id) }; },
  common: [["title", "제목", "text", 2], ["unit", "단위", "text", 1], ["goal", "목표값", "num", 1], ["lowerIsBetter", "낮을수록 좋은 지표", "chk", 2], ["max", "눈금 최댓값 (비우면 자동)", "num", 1], ["value", "값 (직접 입력일 때)", "num", 1]],
  src: (ds, h) => { const q = (dsFields(ds).find(f => isNumF(f) && /수량|건수|불량/.test(f.label)) || {}).key; return { ds: ds.id, agg: q ? "sum" : "count", field: q || "", period: "thisMonth", filter: [] }; },
  form: (P, s, ds) => ({ g: measureFields(P, s, ds) + periodFields(P, s, ds) }),
  resolve(w, s, out) { const { recs } = selectRecs(s); out.gv = recs.length || ["count", "sum"].includes(s.agg || "count") ? aggregate(recs, s) : null; },
  render(w) {
    if (!w.linked) w.gv = typeof w.value === "number" ? w.value : null;
    const st = gaugeState(w.gv ?? null, w.goal, w.lowerIsBetter);
    return xChart(w, drawGauge, st ? pill(STATUS_LABEL[st], st) : "");
  },
  exports: [["png", "이미지 (PNG)"], ["svg", "벡터 이미지 (SVG)"], ["xlsx", "엑셀"], ["csv", "CSV"]],
  table: w => [["지표", "값", "단위", "목표", "판정"], [w.title, w.gv ?? w.value ?? "", w.unit || "", w.goal ?? "", STATUS_LABEL[gaugeState(w.gv ?? w.value ?? null, w.goal, w.lowerIsBetter)] || ""]]
});

/* ===== 10. 전년 비교 막대: 1~12월을 작년·올해 나란히, 올해 누계와 작년 같은 기간 비교 ===== */
regW("yoy", {
  name: "전년 비교", desc: "월별 작년 vs 올해 막대", linkable: true,
  def: () => { const ds = firstDs("claims", "defects"); return { type: "yoy", span: 12, title: `${ds?.name || ""} 전년 비교`, unit: "건", lowerIsBetter: true, src: defaultSrc("yoy", ds?.id) }; },
  common: [["title", "제목", "text", 2], ["subtitle", "부제", "text", 1], ["unit", "단위", "text", 1], ["lowerIsBetter", "낮을수록 좋은 지표 (증감 색)", "chk", 2]],
  src: (ds, h) => ({ ...h.s, period: "all" }),
  form: (P, s, ds) => ({ g: measureFields(P, s, ds) + fld({ l: "기준 날짜", t: "sel", o: fOpts(ds, dateF, `기본 (${fieldOf(ds, ds?.dateField)?.label || "없음"})`), w: 2 }, `${P}.dateField`, s.dateField || "") }),
  resolve(w, s, out) {
    const { recs, df } = selectRecs(s, "all"), Y = +TODAY().slice(0, 4), curM = +TODAY().slice(5, 7);
    const at = (y, m) => recs.filter(r => ymOf(r[df]) === `${y}-${String(m).padStart(2, "0")}`);
    out.labels = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
    out.series = [{ name: `${Y - 1}년`, values: out.labels.map((_, i) => aggregate(at(Y - 1, i + 1), s)) }, { name: `${Y}년`, values: out.labels.map((_, i) => i + 1 <= curM ? aggregate(at(Y, i + 1), s) : 0) }];
    const ytd = (y) => { const rs = recs.filter(r => { const m = ymOf(r[df]); return m && m >= `${y}-01` && m <= `${y}-${String(curM).padStart(2, "0")}` && (y === Y || String(r[df]).slice(5, 10) <= TODAY().slice(5, 10)); }); return aggregate(rs, s); };
    out.ytd = [ytd(Y - 1), ytd(Y)]; out.years = [Y - 1, Y]; out.curM = curM;
  },
  render(w) {
    if (!w.linked) return card(w, `<div class="empty">데이터를 연결하세요.</div>`);
    const [a, b] = w.ytd || [0, 0], d = a ? Math.round((b - a) / a * 1000) / 10 : null, better = d === null ? null : w.lowerIsBetter ? d <= 0 : d >= 0;
    const legend = `<div class="legend">${w.series.map((x, i) => `<span><i style="background:var(${i ? "--s1" : "--s1-soft"})"></i>${esc(x.name)}</span>`).join("")}</div>`;
    const sum = `<div class="yoy-sum">올해 1~${w.curM}월 누계 <b>${fmt(b)}</b>${w.unit ? " " + esc(w.unit) : ""} · 작년 같은 기간 ${fmt(a)}${d !== null ? ` <span class="delta ${better ? "up" : "down"}">${d > 0 ? "▲" : d < 0 ? "▼" : ""} ${fmt(Math.abs(d))}%</span>` : ""}</div>`;
    w.colors = ["var(--s1-soft)", "var(--s1)"];          /* 작년은 옅게, 올해는 진하게 */
    return xChart(w, (el, ww) => { drawChart({ id: el.id, w: ww, kind: "bar" }); el.insertAdjacentHTML("afterbegin", sum); }, legend);
  },
  exports: [["png", "이미지 (PNG)"], ["svg", "벡터 이미지 (SVG)"], ["xlsx", "데이터 엑셀"], ["csv", "데이터 CSV"]],
  table: w => [["월", ...(w.series || []).map(x => x.name), "증감"], ...(w.labels || []).map((l, i) => [l, w.series[0].values[i], i + 1 <= w.curM ? w.series[1].values[i] : "", i + 1 <= w.curM ? r2(w.series[1].values[i] - w.series[0].values[i]) : ""])]
});

/* ===== 11. 성적표: 대상(협력사 등)마다 점수 막대 · 등급 · 추가 항목, 기준 미달은 빨강 ===== */
regW("scorecard", {
  name: "성적표", desc: "점수 막대 · 등급 · 순위", linkable: true, addRec: true,
  def: () => { const ds = firstDs("suppliers", "cpk"); return { type: "scorecard", span: 6, title: `${ds?.name || ""} 성적표`, src: defaultSrc("scorecard", ds?.id) }; },
  common: [["title", "제목", "text", 2], ["subtitle", "부제", "text", 2]],
  src(ds, h) {
    const F = dsFields(ds), num = F.find(f => isNumF(f) && /점수|score|cpk/i.test(f.label + f.key)) || F.find(isNumF);
    return { ds: ds.id, name: (F.find(f => f.refType) || {}).key || titleKeyOf(ds) || "", score: num?.key || "", grade: (F.find(f => f.type === "select" && /등급|판정|grade/i.test(f.label + f.key)) || {}).key || "",
      max: /cpk/i.test(num?.key || "") ? 2 : 100, pass: /cpk/i.test(num?.key || "") ? 1.33 : 80, latest: true, order: "asc", limit: 8, cols: [], period: "all", filter: [] };
  },
  form(P, s, ds) {
    const g = fld({ l: "대상 이름 항목", t: "sel", o: fOpts(ds, null, "선택"), w: 2 }, `${P}.name`, s.name || "") + fld({ l: "점수 항목", t: "sel", o: fOpts(ds, isNumF, "선택") }, `${P}.score`, s.score || "") + fld({ l: "등급 항목", t: "sel", o: fOpts(ds, f => f.type === "select", "없음") }, `${P}.grade`, s.grade || "")
      + fld({ l: "막대 최댓값", t: "num" }, `${P}.max`, s.max ?? 100) + fld({ l: "기준 점수 (미만은 빨강)", t: "num" }, `${P}.pass`, s.pass) + fld({ l: "순서", t: "sel", o: [["asc", "낮은 점수부터 (관리 대상 먼저)"], ["desc", "높은 점수부터"]], w: 2 }, `${P}.order`, s.order || "asc")
      + fld({ l: "대상마다 최신 기록만", t: "chk", w: 2 }, `${P}.latest`, s.latest) + fld({ l: "최대 줄 수", t: "num" }, `${P}.limit`, s.limit ?? 8) + `<span></span>` + periodFields(P, s, ds);
    const cols = s.cols || [];
    return { g, extra: `<div class="glbl">함께 보여 줄 항목</div><div class="chips">${dsFields(ds).filter(f => ![s.name, s.score, s.grade].includes(f.key) && f.type !== "longtext" && f.type !== "file").map(f => `<label class="chip"><input type="checkbox" data-b="${P}.cols" data-t="arr" data-v="${esc(f.key)}" ${cols.includes(f.key) ? "checked" : ""}> ${esc(f.label)}</label>`).join("")}</div>` };
  },
  resolve(w, s, out) {
    const { recs, ds, df } = selectRecs(s);
    let rows = recs.filter(r => !blank(r[s.score]) && !isNaN(+r[s.score]));
    if (s.latest && s.name) { const m = new Map(); [...rows].sort((a, b) => cmp(a[df], b[df])).forEach(r => m.set(r[s.name], r)); rows = [...m.values()]; }
    rows.sort((a, b) => (+a[s.score] - +b[s.score]) * (s.order === "desc" ? -1 : 1));
    const all = rows.length; if (+s.limit) rows = rows.slice(0, +s.limit);
    const cols = (s.cols || []).map(k => fieldOf(ds, k)).filter(Boolean);
    Object.assign(out, { sc: rows.map(r => ({ rid: r.id, name: r[s.name] || "(이름 없음)", v: +r[s.score], g: s.grade ? r[s.grade] : "", x: cols.map(f => r[f.key]) })), scCols: cols, gradeF: fieldOf(ds, s.grade), scoreLabel: fieldOf(ds, s.score)?.label || "점수", all, under: recs.length ? rows.filter(r => typeof s.pass === "number" && r.v < s.pass).length : 0 });
    out.under = out.sc.filter(r => typeof s.pass === "number" && r.v < s.pass).length;
  },
  render(w) {
    if (!w.linked) return card(w, `<div class="empty">데이터를 연결하세요.</div>`);
    const R = w.sc || [], s = w.src, mx = +s.max || 100, pass = typeof s.pass === "number" ? s.pass : null;
    if (!R.length) return card(w, `<div class="empty">점수가 있는 기록이 없습니다.</div>`);
    const rows = R.map((r, i) => { const bad = pass !== null && r.v < pass, pc = Math.max(0, Math.min(100, r.v / mx * 100));
      return `<tr class="rowlink" data-a="rec-open" data-ds="${esc(s.ds)}" data-id="${esc(r.rid)}" tabindex="0" title="눌러서 열기"><td class="sc-rank">${i + 1}</td><td class="sc-name">${esc(r.name)}</td>
        <td class="sc-bar"><span class="sc-track"><b class="${bad ? "bad" : ""}" style="width:${pc.toFixed(1)}%"></b>${pass !== null ? `<i style="left:${Math.min(100, pass / mx * 100).toFixed(1)}%"></i>` : ""}</span><span class="sc-v${bad ? " bad" : ""}">${fmt(r.v)}</span></td>
        ${w.gradeF ? `<td>${chipFor(w.gradeF, r.g)}</td>` : ""}${w.scCols.map((f, j) => `<td class="${isNumF(f) ? "r" : ""}">${isPickF(f) ? chipFor(f, r.x[j]) : isNumF(f) && !blank(r.x[j]) ? fmt(+r.x[j]) : esc(valText(r.x[j]))}</td>`).join("")}</tr>`; }).join("");
    return card(w, `<div class="tbl-wrap"><table class="sc"><thead><tr><th>#</th><th>이름</th><th>${esc(w.scoreLabel)}${pass !== null ? ` <span class="sc-pass">기준 ${fmt(pass)}</span>` : ""}</th>${w.gradeF ? `<th>${esc(w.gradeF.label)}</th>` : ""}${w.scCols.map(f => `<th class="${isNumF(f) ? "r" : ""}">${esc(f.label)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div>`,
      `${w.all > R.length ? `${R.length} / ${w.all}` : `${R.length}`}곳${w.under ? ` · <span class="cc-alert">기준 미달 ${w.under}</span>` : ""}`);
  },
  table: w => [["순위", "이름", w.scoreLabel || "점수", ...(w.gradeF ? [w.gradeF.label] : []), ...(w.scCols || []).map(f => f.label)], ...(w.sc || []).map((r, i) => [i + 1, r.name, r.v, ...(w.gradeF ? [r.g] : []), ...r.x.map(valText)])]
});

/* ===== 12. 비율 도넛: 항목 4개 + 기타까지만, 가운데 합계, 옆에 값·비율 범례 ===== */
function donutItems(items) {
  let a = (items || []).filter(i => +i.value > 0).map(i => ({ label: i.label, value: +i.value })).sort((x, y) => y.value - x.value);
  if (a.length > 5) { const rest = a.slice(4); a = [...a.slice(0, 4), { label: "기타", value: r2(rest.reduce((n, i) => n + i.value, 0)), other: true }]; }
  const tot = a.reduce((n, i) => n + i.value, 0);
  a.forEach((i, k) => { i.pc = tot ? i.value / tot * 100 : 0; i.col = i.other ? "var(--ink-3)" : `var(${SERIES[k % 4]})`; });
  return { items: a, total: r2(tot) };
}
function drawDonut(el, w) {
  const { items, total } = w.dn || {};
  if (!items?.length) return chartEmpty(el, w);
  const Wd = Math.max(240, el.clientWidth), narrow = Wd < 420, D = Math.min(190, narrow ? Wd - 40 : Wd * .45), R = D / 2, r = R * .62;
  const H = narrow ? D + items.length * 24 + 24 : Math.max(D + 16, items.length * 26 + 16), cx = narrow ? Wd / 2 : R + 12, cy = narrow ? R + 8 : H / 2, u = esc(w.unit || "");
  let a0 = -Math.PI / 2, g = "";
  const P = (a, rr) => `${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`;
  items.forEach(i => {
    const a1 = a0 + i.pc / 100 * Math.PI * 2, big = a1 - a0 > Math.PI ? 1 : 0;
    const tip = `${esc(i.label)}: <b>${fmt(i.value)}</b> ${u}<br>${fmt(r2(i.pc))}%`, dA = w.linked && w.src?.by ? drillA(i.other ? { ex: [w.src.by, items.filter(y => !y.other).map(y => y.label)] } : { c: [[w.src.by, i.label]] }) : "";
    g += items.length === 1 ? `<circle cx="${cx}" cy="${cy}" r="${(R + r) / 2}" fill="none" stroke="${i.col}" stroke-width="${R - r}" data-tip="${esc(tip)}"${dA}/>`
      : `<path d="M${P(a0, R)}A${R} ${R} 0 ${big} 1 ${P(a1, R)}L${P(a1, r)}A${r} ${r} 0 ${big} 0 ${P(a0, r)}Z" fill="${i.col}" stroke="var(--surface)" stroke-width="2" data-tip="${esc(tip)}"${dA}/>`;
    a0 = a1;
  });
  g += `<text class="dn-tot" x="${cx}" y="${cy + 2}" text-anchor="middle">${fmt(total)}</text><text class="dn-sub" x="${cx}" y="${cy + 20}" text-anchor="middle">합계${u ? " · " + u : ""}</text>`;
  const lx = narrow ? 20 : cx + R + 28, ly0 = narrow ? D + 30 : cy - items.length * 13 + 13;
  items.forEach((i, k) => { const yy = ly0 + k * (narrow ? 24 : 26);
    g += `<rect x="${lx}" y="${yy - 9}" width="10" height="10" rx="2" fill="${i.col}"/><text class="dn-l" x="${lx + 18}" y="${yy}">${esc(svgText(i.label, narrow ? 16 : 14))}</text>`;
    g += `<text class="dn-v" x="${Wd - 14}" y="${yy}" text-anchor="end">${fmt(i.value)} <tspan class="dn-p">${fmt(Math.round(i.pc * 10) / 10)}%</tspan></text>`; });
  el.innerHTML = `<svg viewBox="0 0 ${Wd} ${H}" height="${H}" role="img" aria-label="${esc(w.title)}">${g}</svg>`;
}
regW("donut", {
  name: "비율 도넛", desc: "구성비 (항목 5개 이하)", linkable: true,
  def: () => { const ds = firstDs("claims", "defects"); return { type: "donut", span: 6, title: `${ds?.name || ""} 고객사별 비중`, unit: "건", src: defaultSrc("donut", ds?.id) }; },
  common: [["title", "제목", "text", 2], ["subtitle", "부제", "text", 1], ["unit", "단위", "text", 1]],
  rows: { path: "items", label: "항목", tpl: () => ({ label: "", value: 0 }), fields: [{ k: "label", l: "항목명", t: "text" }, { k: "value", l: "값", t: "num" }] },
  src: (ds, h) => ({ ...h.s, by: fieldBy(ds, /고객|상태|구분/, catF) || h.cat?.key || "", period: "last3m" }),
  form: (P, s, ds) => ({ g: fld({ l: "나눌 기준 항목", t: "sel", o: fOpts(ds, catF, "선택"), w: 2 }, `${P}.by`, s.by || "") + `<span></span><span></span>` + measureFields(P, s, ds) + periodFields(P, s, ds), extra: `<div class="hint" style="margin:6px 0">조각이 많으면 읽기 어려워 큰 4개만 보이고 나머지는 ‘기타’로 묶습니다.</div>` }),
  resolve(w, s, out) { const { recs, ds } = selectRecs(s); out.items = keysBy(recs, s.by, ds, "count").map(g => ({ label: g, value: aggregate(recs.filter(r => gin(r, s.by, g)), s) })); },
  render(w) { w.dn = donutItems(w.items); return xChart(w, drawDonut, w.dn.items.length ? `${w.dn.items.length}개 항목` : ""); },
  exports: [["png", "이미지 (PNG)"], ["svg", "벡터 이미지 (SVG)"], ["xlsx", "데이터 엑셀"], ["csv", "데이터 CSV"]],
  table: w => { const d = donutItems(w.items); return [["항목", "값", "비율(%)"], ...d.items.map(i => [i.label, i.value, r2(i.pc)])]; }
});

/* ===== 13. 최근 변경 내역: 저장할 때마다 기록을 전과 비교해 추가·수정·삭제를 남기고(cfg.changelog), 위젯으로 보여 줌 ===== */
const ME_KEY = "qa-dashboard-me", LOG_MAX = 300;
const myName = () => { try { return localStorage.getItem(ME_KEY) || cfg.owner || ""; } catch (e) { return cfg.owner || ""; } };
let recSnap = null;                                       /* 데이터id → (기록id → JSON) */
function snapRecords() { recSnap = new Map((cfg.datasets || []).map(d => [d.id, new Map((d.records || []).map(r => [r.id, JSON.stringify(r)]))])); }
const shortV = v => { v = valText(v); v = blank(v) ? "비어 있음" : String(v); return v.length > 18 ? v.slice(0, 18) + "…" : v; };
function logChanges() {
  if (!recSnap) return snapRecords();
  const out = [], at = new Date().toISOString(), who = myName();
  (cfg.datasets || []).forEach(d => {
    const old = recSnap.get(d.id) || new Map(), tk = titleKeyOf(d), F = d.fields || [], seen = new Set();
    (d.records || []).forEach(r => {
      seen.add(r.id); const prev = old.get(r.id), now = JSON.stringify(r);
      if (prev === now) return;
      if (!prev) { out.push({ at, who, ds: d.id, rid: r.id, title: r[tk] || "", kind: "add" }); return; }
      const o = JSON.parse(prev), fields = F.filter(f => JSON.stringify(o[f.key] ?? "") !== JSON.stringify(r[f.key] ?? "")).map(f => ({ l: f.label, from: shortV(o[f.key]), to: shortV(r[f.key]) }));
      if (fields.length) out.push({ at, who, ds: d.id, rid: r.id, title: r[tk] || o[tk] || "", kind: "edit", fields: fields.slice(0, 4), more: Math.max(0, fields.length - 4) });
    });
    old.forEach((json, id) => { if (!seen.has(id)) { const o = JSON.parse(json); out.push({ at, who, ds: d.id, rid: id, title: o[tk] || "", kind: "del" }); } });
  });
  if (out.length) {
    const entries = out.length > 30 ? [{ at, who, ds: "", rid: "", title: "", kind: "bulk", n: out.length }] : out;     /* 일괄 변경은 한 줄로 */
    cfg.changelog = [...entries.reverse(), ...(cfg.changelog || [])].slice(0, LOG_MAX);
  }
  snapRecords();
}
function agoText(iso) {
  const t = new Date(iso), s = (Date.now() - t) / 1000;
  if (s < 60) return "방금"; if (s < 3600) return `${Math.floor(s / 60)}분 전`; if (s < 86400 && t.getDate() === new Date().getDate()) return `${Math.floor(s / 3600)}시간 전`;
  const hm = t.toTimeString().slice(0, 5); if (s < 172800) return `어제 ${hm}`;
  return `${t.getMonth() + 1}/${t.getDate()} ${hm}`;
}
const KIND = { add: ["추가", "good"], edit: ["수정", "진행"], del: ["삭제", "critical"], bulk: ["일괄", "대기"], comment: ["의견", "진행"] };
regW("history", {
  name: "변경 내역", desc: "누가 언제 무엇을 바꿨는지",
  def: () => ({ type: "history", span: 6, title: "최근 변경 내역", limit: 10, ds: "" }),
  common: [["title", "제목", "text", 2], ["limit", "최대 줄 수", "num", 1]],
  editor: (w, P) => `<div class="cgrid">${fld({ l: "보여 줄 데이터", t: "sel", o: [["", "모든 데이터"], ...dsOpts()], w: 2 }, `${P}.ds`, w.ds || "")}${fld({ l: "종류", t: "sel", o: [["", "모두"], ["add", "추가만"], ["edit", "수정만"], ["del", "삭제만"]] }, `${P}.kind`, w.kind || "")}</div>
    <div class="hint" style="margin-top:6px">기록을 저장할 때마다 자동으로 남습니다(최근 ${LOG_MAX}건, data/app.json에 저장). 이름은 ‘설정 · 데이터 저장’의 ‘내 이름’으로 정합니다.</div>`,
  resolveAny(w) { w.log = (cfg.changelog || []).filter(e => (!w.ds || e.ds === w.ds) && (!w.kind || e.kind === w.kind)).slice(0, +w.limit || 10); return w; },
  render(w) {
    const L = w.log || [];
    if (!L.length) return card(w, `<div class="empty">아직 변경 내역이 없습니다. 기록을 추가하거나 고치면 여기에 나타납니다.</div>`);
    return card(w, `<ol class="hx">${L.map(e => { const d = dsById(e.ds), [kn, kc] = KIND[e.kind] || ["", ""], live = d && (d.records || []).some(r => r.id === e.rid);
      const what = e.kind === "bulk" ? `기록 ${e.n}건을 한꺼번에 바꿈` : `${esc(d?.name || "")} · <b>${esc(e.title || "(제목 없음)")}</b>`;
      const det = e.kind === "comment" ? `<div class="hx-f"><span>“${esc(e.text || "")}”</span></div>` : e.kind === "edit" ? `<div class="hx-f">${e.fields.map(f => `<span>${esc(f.l)}: <s>${esc(f.from)}</s> → ${esc(f.to)}</span>`).join("")}${e.more ? `<span>외 ${e.more}개 항목</span>` : ""}</div>` : "";
      return `<li class="hx-i${live ? " rowlink" : ""}" ${live ? `data-a="rec-open" data-ds="${esc(e.ds)}" data-id="${esc(e.rid)}" tabindex="0" title="눌러서 열기"` : ""}>
        <span class="hx-t" title="${esc(new Date(e.at).toLocaleString("ko-KR"))}">${esc(agoText(e.at))}</span>
        <div class="hx-b"><div>${pill(kn, kc)} ${what}${e.who ? ` <span class="hx-w">· ${esc(e.who)}</span>` : ""}</div>${det}</div></li>`; }).join("")}</ol>`, `${(cfg.changelog || []).length}건 중 ${L.length}`);
  },
  table: w => [["시각", "작성자", "종류", "데이터", "기록", "바뀐 항목"], ...(w.log || []).map(e => [new Date(e.at).toLocaleString("ko-KR"), e.who || "", (KIND[e.kind] || [""])[0], dsById(e.ds)?.name || "", e.kind === "bulk" ? `${e.n}건` : e.title, e.kind === "comment" ? e.text || "" : (e.fields || []).map(f => `${f.l}: ${f.from} → ${f.to}`).join("; ")])]
});

/* ===== 14. 사진 갤러리: 기록에 첨부된 사진을 썸네일로 모아 보기, 누르면 크게 · 기록 열기 ===== */
const galLists = {};                                     /* 화면에 그린 갤러리별 첨부 목록 (보기 창 이전·다음용) */
regW("gallery", {
  name: "사진 갤러리", desc: "첨부 사진 썸네일 모음", linkable: true,
  def: () => { const ds = (cfg.datasets || []).find(d => (d.fields || []).some(f => f.type === "file") && (d.records || []).some(r => attList(r[(d.fields.find(f => f.type === "file") || {}).key]).length)) || (cfg.datasets || []).find(d => (d.fields || []).some(f => f.type === "file")) || firstDs();
    return { type: "gallery", span: 6, title: `${ds?.name || ""} 사진`, src: defaultSrc("gallery", ds?.id) }; },
  common: [["title", "제목", "text", 3], ["subtitle", "부제", "text", 1]],
  src: (ds) => ({ ds: ds.id, file: (dsFields(ds).find(f => f.type === "file") || {}).key || "", title: titleKeyOf(ds) || "", imagesOnly: true, limit: 12, period: "all", filter: [] }),
  form: (P, s, ds) => ({ g: fld({ l: "첨부 항목", t: "sel", o: fOpts(ds, f => f.type === "file", "선택") }, `${P}.file`, s.file || "") + fld({ l: "사진 아래 이름", t: "sel", o: fOpts(ds, null, "선택") }, `${P}.title`, s.title || "")
    + fld({ l: "최대 개수", t: "num" }, `${P}.limit`, s.limit ?? 12) + fld({ l: "사진만 (PDF 등 제외)", t: "chk" }, `${P}.imagesOnly`, s.imagesOnly) + periodFields(P, s, ds) }),
  resolve(w, s, out) {
    const { recs, df } = selectRecs(s);
    const sorted = [...recs].sort((a, b) => -cmp(a[df], b[df]));
    const items = [];
    sorted.forEach(r => attList(r[s.file]).forEach(a => { if (!s.imagesOnly || isImgA(a)) items.push({ ...a, rid: r.id, cap: r[s.title] || "", date: df ? r[df] : "" }); }));
    out.gal = items.slice(0, +s.limit || 12); out.galAll = items.length;
  },
  render(w) {
    if (!w.linked) return card(w, `<div class="empty">데이터를 연결하세요.</div>`);
    const G = w.gal || [], key = `${boardPage?.id || ""}:${curWi}`; galLists[key] = G;
    if (!G.length) return card(w, `<div class="empty">${w.src.file ? "사진이 첨부된 기록이 없습니다. 기록 팝업에서 사진을 올려 보세요." : "첨부(사진·파일) 항목이 있는 데이터를 고르세요."}</div>`);
    return card(w, `<div class="gal">${G.map((a, i) => `<figure class="gal-i">
      <button type="button" class="gal-img fz-prev" data-gal="${esc(key)}" data-gi="${i}" title="크게 보기">${isImgA(a) ? attImg(a) : `<b class="gal-ext">${esc(fileExt(a))}</b>`}<span class="fz-miss">파일 없음</span></button>
      <figcaption><button type="button" class="gal-cap" data-a="rec-open" data-ds="${esc(w.src.ds)}" data-id="${esc(a.rid)}" title="기록 열기">${esc(a.cap || a.name)}</button><span>${esc(a.date || "")}</span></figcaption></figure>`).join("")}</div>`,
      w.galAll > G.length ? `${G.length} / ${w.galAll}장` : `${G.length}장`);
  },
  table: w => [["파일", "경로", "기록", "날짜"], ...(w.gal || []).map(a => [a.name, a.path, a.cap, a.date || ""])]
});
document.addEventListener("click", e => {
  const b = e.target.closest?.("[data-gal]"); if (!b || lay.on) return;
  e.preventDefault(); e.stopPropagation();
  const L = galLists[b.dataset.gal] || [], a = L[+b.dataset.gi]; if (!a) return;
  if (canPreview(a)) openViewer(L, +b.dataset.gi); else openAtt(a);
}, true);

/* ===== 15. 빠른 입력: 대시보드에서 바로 기록 한 건을 넣는 작은 입력란 (필수 항목이 더 있으면 팝업으로 이어서) ===== */
const QF_SKIP = f => f.type === "days" || f.type === "file" || (f.type === "text" && f.auto);
regW("quickform", {
  name: "빠른 입력", desc: "대시보드에서 바로 기록 입력", linkable: true,
  def: () => { const ds = firstDs("defects", "claims"); return { type: "quickform", span: 6, title: `${ds?.name || ""} 빠른 입력`, src: defaultSrc("quickform", ds?.id) }; },
  common: [["title", "제목", "text", 4]],
  src(ds) { const F = dsFields(ds).filter(f => !QF_SKIP(f) && f.type !== "longtext"); const pick = [...F.filter(f => f.req), ...F.filter(f => !f.req)].slice(0, 5).map(f => f.key);
    return { ds: ds.id, cols: dsFields(ds).filter(f => pick.includes(f.key)).map(f => f.key) }; },
  form(P, s, ds) {
    const cols = s.cols || [];
    return { noFilter: true, g: "", extra: `<div class="glbl">입력란에 보일 항목<span>필수 항목이 빠져 있으면 저장할 때 팝업이 열려 마저 입력합니다</span></div><div class="chips">${dsFields(ds).filter(f => !QF_SKIP(f)).map(f => `<label class="chip"><input type="checkbox" data-b="${P}.cols" data-t="arr" data-v="${esc(f.key)}" ${cols.includes(f.key) ? "checked" : ""}> ${esc(f.label)}${f.req ? " *" : ""}</label>`).join("")}</div>` };
  },
  resolve(w, s, out) { const ds = dsById(s.ds); out.qf = (s.cols || []).map(k => dsFields(ds).find(f => f.key === k)).filter(Boolean); out.qfDs = ds; },
  render(w) {
    if (!w.linked || !w.qfDs) return card(w, `<div class="empty">데이터를 연결하세요.</div>`);
    const ds = w.qfDs, base = newRecord(ds), dis = lay.on ? "disabled" : "";
    const input = f => { const id = `qf-${curWi}-${f.key}`, v = base[f.key] ?? "", ph = esc(f.label + (f.req ? " *" : ""));
      if (f.type === "select" && !f.refType) return `<select class="f" name="${esc(f.key)}" id="${id}" ${dis}><option value="">${ph}</option>${(f.options || []).map(o => `<option ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
      if (f.refType) return `<input class="f" name="${esc(f.key)}" id="${id}" list="${id}-dl" placeholder="${ph}" value="${esc(v)}" autocomplete="off" ${dis}><datalist id="${id}-dl">${(f.options || []).map(o => `<option value="${esc(o)}"></option>`).join("")}</datalist>`;
      if (f.type === "longtext") return `<textarea class="f" name="${esc(f.key)}" id="${id}" placeholder="${ph}" rows="2" ${dis}>${esc(v)}</textarea>`;
      return `<input class="f" name="${esc(f.key)}" id="${id}" type="${f.type === "date" ? "date" : "text"}" ${f.type === "number" ? `inputmode="decimal"` : ""} placeholder="${ph}" value="${esc(v)}" ${dis}>`; };
    return card(w, `<form class="qf" data-wi="${curWi}" data-ds="${esc(ds.id)}" autocomplete="off">
      <div class="qf-grid">${w.qf.map(f => `<label class="qf-f${f.type === "longtext" ? " wide" : ""}"><span>${esc(f.label)}${f.req ? `<b class="req">*</b>` : ""}</span>${input(f)}</label>`).join("")}</div>
      <div class="qf-act"><span class="qf-msg" role="status"></span><button type="button" class="btn sm" data-a="qf-more" title="모든 항목을 팝업에서 입력">팝업에서 자세히</button><button class="btn primary sm" type="submit" ${dis}>저장 (Enter)</button></div></form>`);
  },
  table: () => [["빠른 입력은 내보낼 데이터가 없습니다."]],
  exports: []
});
/* 빠른 입력 저장: 값 정리 → 필수 확인 → 목록 참조 새 값은 기준 정보에 추가 → 저장 */
function qfCollect(form) {
  const ds = dsById(form.dataset.ds), rec = newRecord(ds), F = dsFields(ds);
  new FormData(form).forEach((v, k) => { const f = F.find(x => x.key === k); if (!f) return; v = String(v).trim(); if (f.type === "number") { const n = Number(v.replace(/[,\s]/g, "")); rec[k] = v === "" ? "" : isNaN(n) ? v : n; } else rec[k] = v; });
  return { ds, rec, F };
}
$("#board").addEventListener("submit", e => {
  const form = e.target.closest(".qf"); if (!form) return;
  e.preventDefault();
  const { ds, rec, F } = qfCollect(form), m = form.querySelector(".qf-msg");
  const bad = F.find(f => f.type === "number" && !blank(rec[f.key]) && typeof rec[f.key] !== "number");
  if (bad) { m.textContent = `‘${bad.label}’에는 숫자를 입력하세요.`; m.className = "qf-msg bad"; return; }
  const filled = F.some(f => form.elements[f.key] && !blank(rec[f.key]) && rec[f.key] !== newRecord(ds)[f.key]);
  if (!filled) { m.textContent = "입력한 내용이 없습니다."; m.className = "qf-msg bad"; return; }
  if (F.some(f => f.req && f.type !== "days" && blank(rec[f.key]))) { openRecord(ds, null, rec); return; }     /* 필수 항목이 더 있으면 팝업에서 마저 */
  F.filter(f => f.refType && !blank(rec[f.key])).forEach(f => { const mm = dsById(f.ref); if (mm && !masterValues(f.ref).includes(rec[f.key])) (mm.records ||= []).push({ id: newId(), [titleKeyOf(mm)]: rec[f.key] }); });
  const snap = JSON.stringify(cfg); rec.id = newId(); (ds.records ||= []).push(rec); persist(); render();
  toast(`${ds.name} 데이터에 저장했습니다.`, () => { cfg = JSON.parse(snap); persist(); render(); toast("되돌렸습니다."); });
  setTimeout(() => $(`#board .qf[data-wi="${form.dataset.wi}"] .f:not([type=date])`)?.focus(), 30);
});
document.addEventListener("click", e => {
  const b = e.target.closest?.('[data-a="qf-more"]'); if (!b) return;
  e.preventDefault(); e.stopPropagation();
  const form = b.closest(".qf"), { ds, rec } = qfCollect(form); openRecord(ds, null, rec);
}, true);

/* ===== 16. 바로가기 링크 모음: 고객 포털·사내 시스템·공유 폴더를 버튼으로 ===== */
function linkHref(u) {
  u = String(u || "").trim(); if (!u) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(u) && !/^[a-z]:[\\/]/i.test(u)) return u;                 /* http:, https:, mailto:, file: … */
  if (/^\\\\/.test(u)) return "file:" + u.replace(/\\/g, "/");                                /* \\서버\공유 → file://서버/공유 */
  if (/^[a-z]:[\\/]/i.test(u)) return "file:///" + u.replace(/\\/g, "/");                     /* C:\폴더 → file:///C:/폴더 */
  return "https://" + u;
}
const linkIcon = h => /^file:/i.test(h) ? "📁" : /^mailto:/i.test(h) ? "✉" : "↗";
regW("links", {
  name: "바로가기 링크", desc: "자주 쓰는 사이트·폴더 버튼",
  def: () => ({ type: "links", span: 4, title: "바로가기", items: [{ label: "고객 품질 포털", url: "https://", desc: "클레임 접수·회신" }, { label: "공유 폴더 (품질보증)", url: "\\\\server\\QA", desc: "성적서·8D 보고서" }] }),
  common: [["title", "제목", "text", 4]],
  rows: { path: "items", label: "링크", tpl: () => ({ label: "", url: "https://", desc: "" }), fields: [{ k: "label", l: "이름", t: "text", w: 2 }, { k: "url", l: "주소 (https://… 또는 \\\\서버\\폴더, C:\\폴더)", t: "text", w: 2 }, { k: "desc", l: "설명", t: "text", w: 4 }] },
  render(w) {
    const L = (w.items || []).filter(i => i.label || i.url);
    if (!L.length) return card(w, `<div class="empty">편집에서 링크를 추가하세요.</div>`);
    return card(w, `<div class="lk">${L.map(i => { const h = linkHref(i.url), ok = h && !/^https?:\/\/$/i.test(h);
      return `<a class="lk-i${ok ? "" : " off"}" ${ok ? `href="${esc(h)}" target="_blank" rel="noopener"` : `aria-disabled="true"`} title="${esc(i.url || "주소를 입력하세요")}"><span class="lk-ic" aria-hidden="true">${linkIcon(h)}</span><span class="lk-b"><b>${esc(i.label || i.url)}</b>${i.desc ? `<span>${esc(i.desc)}</span>` : ""}</span></a>`; }).join("")}</div>
      <div class="lk-note">공유 폴더(\\\\서버…)는 브라우저 보안 때문에 열리지 않을 수 있습니다. 그때는 주소를 복사해 탐색기에 붙여 넣으세요.</div>`);
  },
  table: w => [["이름", "주소", "설명"], ...(w.items || []).map(i => [i.label, i.url, i.desc || ""])]
});

/* ===== 위젯 직접 편집 도우미: 배치도·주석처럼 위젯 안에서 고친 내용을 페이지 설정에 저장 ===== */
const wEditOn = new Set();                                         /* 편집 모드 켜진 위젯 (페이지id:순번) */
const wKey = i => `${boardPage?.id || ""}:${i}`;
function liveWidget(i) { if (lay.on) return lay.draft?.widgets?.[i]; return cfg.pages.find(p => p.id === boardPage?.id)?.widgets?.[i]; }
function saveWidgetEdit(i, fn) { const w = liveWidget(i); if (!w) return; fn(w); if (!lay.on) persist(); render(); }
const wEditBtn = (on, label = "편집") => `<button type="button" class="ib w-edit-tg${on ? " on" : ""}" data-wtg="${curWi}">${on ? "편집 끝" : label}</button>`;
document.addEventListener("click", e => { const b = e.target.closest?.("[data-wtg]"); if (!b) return; e.preventDefault(); e.stopPropagation(); const k = wKey(+b.dataset.wtg); wEditOn.has(k) ? wEditOn.delete(k) : wEditOn.add(k); render(); }, true);

/* ===== 17. 목표 대비 실적표: 1~12월 목표·실적·달성률, 달성은 초록·미달은 빨강 ===== */
regW("goaltable", {
  name: "목표 대비 실적", desc: "월별 목표·실적·달성 판정", linkable: true,
  def: () => { const ds = firstDs("claims", "defects"); return { type: "goaltable", span: 6, title: `${TODAY().slice(0, 4)}년 ${ds?.name || ""} 목표 대비 실적`, unit: "건", goal: 12, lowerIsBetter: true, src: defaultSrc("goaltable", ds?.id) }; },
  common: [["title", "제목", "text", 2], ["unit", "단위", "text", 1], ["goal", "매월 목표 (기본)", "num", 1], ["lowerIsBetter", "낮을수록 좋은 지표", "chk", 2]],
  src: (ds, h) => ({ ...h.s, period: "all" }),
  form: (P, s, ds) => ({ g: measureFields(P, s, ds) + fld({ l: "기준 날짜", t: "sel", o: fOpts(ds, dateF, `기본 (${fieldOf(ds, ds?.dateField)?.label || "없음"})`), w: 2 }, `${P}.dateField`, s.dateField || "") }),
  editor: (w, P) => `<div class="glbl">달마다 다른 목표 <span>비우면 위의 ‘매월 목표’를 씁니다</span></div><div class="gt-goals">${Array.from({ length: 12 }, (_, m) => `<label class="fld"><span>${m + 1}월</span>${inp({ t: "num" }, `${P}.goals.${m}`, (w.goals || [])[m])}</label>`).join("")}</div>`,
  resolve(w, s, out) {
    const { recs, df } = selectRecs(s, "all"), Y = TODAY().slice(0, 4), curM = +TODAY().slice(5, 7);
    out.rows = Array.from({ length: 12 }, (_, m) => { const ym = `${Y}-${String(m + 1).padStart(2, "0")}`, rs = recs.filter(r => ymOf(r[s.dateField || df]) === ym);
      const g = typeof (w.goals || [])[m] === "number" ? w.goals[m] : w.goal; return { m: m + 1, goal: g, act: m + 1 <= curM && (rs.length || s.agg !== "avg") ? aggregate(rs, s) : null }; });
    out.avgMode = s.agg === "avg";
    if (out.avgMode) out.ytd = aggregate(recs.filter(r => { const k = ymOf(r[s.dateField || df]); return k && k.slice(0, 4) === Y && k <= ymOf(TODAY()); }), s);
  },
  render(w) {
    if (!w.linked) return card(w, `<div class="empty">데이터를 연결하세요.</div>`);
    const low = !!w.lowerIsBetter, u = esc(w.unit || "");
    const judge = (a, g) => typeof g !== "number" || a === null ? "" : low ? (a <= g ? "good" : a <= g * 1.1 ? "warn" : "bad") : (a >= g ? "good" : a >= g * .9 ? "warn" : "bad");
    const curM = +TODAY().slice(5, 7), done = w.rows.filter(r => r.act !== null), fin = done.filter(r => r.m < curM), tA = w.avgMode ? w.ytd : r2(done.reduce((n, r) => n + r.act, 0)), tG = r2(done.reduce((n, r) => n + (r.goal || 0), 0) / (w.avgMode ? done.length || 1 : 1)), ok = fin.filter(r => judge(r.act, r.goal) === "good").length;
    const row = (lab, g, a, cls = "") => { const j = judge(a, g), pc = typeof g === "number" && g && a !== null ? Math.round(a / g * 100) : null;
      const live = cls === "cur" && j && !(low ? j === "bad" : j === "good");          /* 이번 달은 아직 끝나지 않음: 이미 확정된 경우만 판정 */
      return `<tr class="${cls}"><td>${lab}</td><td class="r">${typeof g === "number" ? fmt(g) : "—"}</td><td class="r">${a === null ? `<span class="tp-hint">—</span>` : fmt(a)}</td><td class="r">${pc === null ? "" : pc + "%"}</td><td>${live ? `<span class="gt-j live">진행 중</span>` : j ? `<span class="gt-j ${j}">${{ good: "달성", warn: "근접", bad: "미달" }[j]}</span>` : ""}</td></tr>`; };
    return card(w, `<div class="tbl-wrap"><table class="gtab"><thead><tr><th>월</th><th class="r">목표</th><th class="r">실적</th><th class="r">목표 대비</th><th>판정</th></tr></thead>
      <tbody>${w.rows.map(r => row(`${r.m}월`, r.goal, r.act, r.m === +TODAY().slice(5, 7) ? "cur" : "")).join("")}</tbody><tfoot>${row(w.avgMode ? "올해 평균" : "누계", tG, tA, "sum")}</tfoot></table></div>`, `${ok}/${fin.length}개월 달성${u ? " · 단위 " + u : ""}`);
  },
  table: w => [["월", "목표", "실적"], ...(w.rows || []).map(r => [`${r.m}월`, r.goal ?? "", r.act ?? ""])]
});

/* ===== 18. 산포도: 두 숫자 항목의 관계, 추세선과 상관계수 ===== */
function drawScatter(el, w) {
  const P = w.pts || []; if (P.length < 2) return chartEmpty(el, w, w.linked ? "숫자가 둘 다 있는 기록이 2개 이상 필요합니다." : "데이터를 연결하세요.");
  const Wd = Math.max(280, el.clientWidth), H = 260, m = { t: 14, r: 16, b: 38, l: 50 }, iw = Wd - m.l - m.r, ih = H - m.t - m.b;
  const rng = a => { const lo = Math.min(...a), hi = Math.max(...a), pad = (hi - lo) * .06 || Math.abs(hi) * .1 || 1; return niceTicks(lo >= 0 && lo - pad < 0 ? 0 : lo - pad, hi + pad); };   /* 데이터 범위에 맞춤 */
  const X = rng(P.map(p => p.x)), Y = rng(P.map(p => p.y)), cid = "scc" + Math.random().toString(36).slice(2, 7);
  const x = v => m.l + (v - X.lo) / (X.hi - X.lo) * iw, y = v => m.t + ih - (v - Y.lo) / (Y.hi - Y.lo) * ih;
  let g = "";
  Y.ticks.forEach(t => { g += `<line class="grid" x1="${m.l}" x2="${Wd - m.r}" y1="${y(t)}" y2="${y(t)}"/><text x="${m.l - 8}" y="${y(t) + 4}" text-anchor="end">${fmt(t)}</text>`; });
  X.ticks.forEach(t => { g += `<line class="grid" y1="${m.t}" y2="${m.t + ih}" x1="${x(t)}" x2="${x(t)}"/><text x="${x(t)}" y="${H - 22}" text-anchor="middle">${fmt(t)}</text>`; });
  g += `<text class="ax-l" x="${m.l + iw / 2}" y="${H - 4}" text-anchor="middle">${esc(w.xLabel)} →</text><text class="ax-l" x="12" y="${m.t + ih / 2}" text-anchor="middle" transform="rotate(-90 12 ${m.t + ih / 2})">${esc(w.yLabel)} →</text>`;
  if (w.fit) { const { a, b } = w.fit, xs = P.map(p => p.x), x1 = Math.min(...xs), x2 = Math.max(...xs);
    g += `<clipPath id="${cid}"><rect x="${m.l}" y="${m.t}" width="${iw}" height="${ih}"/></clipPath><line class="sc-fit" clip-path="url(#${cid})" x1="${x(x1)}" y1="${y(a + b * x1)}" x2="${x(x2)}" y2="${y(a + b * x2)}"/>`; }
  const cats = w.cats || [];
  P.forEach(p => { const ci = cats.indexOf(p.c), col = !p.c ? "var(--s1)" : ci >= 0 && ci < 4 ? `var(${SERIES[ci]})` : "var(--ink-3)";
    g += `<circle cx="${x(p.x).toFixed(1)}" cy="${y(p.y).toFixed(1)}" r="4" fill="${col}" fill-opacity=".75" stroke="var(--surface)" stroke-width="1" data-tip="${esc(`${p.l ? esc(p.l) + "<br>" : ""}${esc(w.xLabel)} <b>${fmt(p.x)}</b> · ${esc(w.yLabel)} <b>${fmt(p.y)}</b>${p.c ? "<br>" + esc(p.c) : ""}`)}"${p.rid ? ` data-a="rec-open" data-ds="${esc(w.src.ds)}" data-id="${esc(p.rid)}" style="cursor:pointer"` : ""}/>`; });
  el.innerHTML = `<svg viewBox="0 0 ${Wd} ${H}" height="${H}" role="img" aria-label="${esc(w.title)}">${g}</svg>`;
}
regW("scatter", {
  name: "산포도", desc: "두 숫자 항목 관계 · 추세선", linkable: true,
  def: () => { const ds = firstDs("inspections", "claims"); return { type: "scatter", span: 6, title: `${ds?.name || ""} 산포도`, src: defaultSrc("scatter", ds?.id) }; },
  common: [["title", "제목", "text", 3], ["subtitle", "부제", "text", 1]],
  src(ds) { const N = dsFields(ds).filter(isNumF); return { ds: ds.id, xf: N[0]?.key || "", yf: (N[1] || N[0])?.key || "", color: (dsFields(ds).find(f => f.type === "select" && !f.badge) || {}).key || "", label: titleKeyOf(ds) || "", limit: 300, period: "all", filter: [] }; },
  form: (P, s, ds) => ({ g: fld({ l: "가로축 (X)", t: "sel", o: fOpts(ds, isNumF, "선택") }, `${P}.xf`, s.xf || "") + fld({ l: "세로축 (Y)", t: "sel", o: fOpts(ds, isNumF, "선택") }, `${P}.yf`, s.yf || "")
    + fld({ l: "색 구분 항목", t: "sel", o: fOpts(ds, f => f.type === "select", "없음") }, `${P}.color`, s.color || "") + fld({ l: "점 이름 항목", t: "sel", o: fOpts(ds, null, "없음") }, `${P}.label`, s.label || "") + fld({ l: "최대 점 수", t: "num" }, `${P}.limit`, s.limit ?? 300) + periodFields(P, s, ds) }),
  resolve(w, s, out) {
    const { recs, ds } = selectRecs(s);
    let pts = recs.filter(r => !blank(r[s.xf]) && !blank(r[s.yf]) && !isNaN(+r[s.xf]) && !isNaN(+r[s.yf])).map(r => ({ x: +r[s.xf], y: +r[s.yf], c: s.color ? (vals(r[s.color])[0] || "") : "", l: s.label ? valText(r[s.label]) : "", rid: r.id }));
    if (+s.limit && pts.length > +s.limit) pts = pts.slice(-s.limit);
    const n = pts.length, mx = pts.reduce((a, p) => a + p.x, 0) / n, my = pts.reduce((a, p) => a + p.y, 0) / n;
    const sxy = pts.reduce((a, p) => a + (p.x - mx) * (p.y - my), 0), sxx = pts.reduce((a, p) => a + (p.x - mx) ** 2, 0), syy = pts.reduce((a, p) => a + (p.y - my) ** 2, 0);
    Object.assign(out, { pts, xLabel: fieldOf(ds, s.xf)?.label || "X", yLabel: fieldOf(ds, s.yf)?.label || "Y", cats: s.color ? keysBy(recs, s.color, ds, "count", 4) : [],
      fit: n > 2 && sxx ? { b: sxy / sxx, a: my - sxy / sxx * mx } : null, r: n > 2 && sxx && syy ? sxy / Math.sqrt(sxx * syy) : null });
  },
  render(w) {
    const r = w.r, str = r === null || r === undefined ? "" : Math.abs(r) >= .7 ? "강한" : Math.abs(r) >= .4 ? "보통" : "약한";
    const legend = (w.cats || []).length ? `<div class="legend">${w.cats.map((c, i) => `<span><i style="background:var(${SERIES[i]})"></i>${esc(c)}</span>`).join("")}</div>` : "";
    return xChart(w, drawScatter, `${legend}${r !== null && r !== undefined ? `<span class="sc-r" title="상관계수">r = ${r.toFixed(2)} · ${str} ${r >= 0 ? "양" : "음"}의 상관</span>` : ""}`);
  },
  exports: [["png", "이미지 (PNG)"], ["svg", "벡터 이미지 (SVG)"], ["xlsx", "데이터 엑셀"], ["csv", "데이터 CSV"]],
  table: w => [["이름", w.xLabel || "X", w.yLabel || "Y", "구분"], ...(w.pts || []).map(p => [p.l, p.x, p.y, p.c])]
});

/* ===== 19. 히스토그램 + 공정능력: 분포 막대, 정규 곡선, 규격선, Cp·Cpk ===== */
function capStats(v, usl, lsl) {
  const n = v.length, mean = v.reduce((a, b) => a + b, 0) / n, sd = n > 1 ? Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)) : 0;
  const hasU = typeof usl === "number", hasL = typeof lsl === "number";
  const cp = hasU && hasL && sd ? (usl - lsl) / (6 * sd) : null;
  const cpu = hasU && sd ? (usl - mean) / (3 * sd) : null, cpl = hasL && sd ? (mean - lsl) / (3 * sd) : null;
  const cpk = cpu !== null && cpl !== null ? Math.min(cpu, cpl) : cpu ?? cpl;
  const out = v.filter(x => (hasU && x > usl) || (hasL && x < lsl)).length;
  return { n, mean, sd, cp, cpk, out, min: Math.min(...v), max: Math.max(...v) };
}
function drawHist(el, w) {
  const v = w.hv || []; if (v.length < 3) return chartEmpty(el, w, w.linked ? "값이 3개 이상 필요합니다." : "데이터를 연결하세요.");
  const st = w.st, usl = w.usl, lsl = w.lsl, specs = [usl, lsl].filter(x => typeof x === "number");
  let lo = Math.min(st.min, ...specs, st.mean - 3 * st.sd), hi = Math.max(st.max, ...specs, st.mean + 3 * st.sd);
  const bins = Math.max(5, Math.min(30, +w.src?.bins || Math.round(Math.sqrt(v.length)) + 3)), bw = (hi - lo) / bins || 1;
  const cnt = Array(bins).fill(0); v.forEach(x => { cnt[Math.min(bins - 1, Math.max(0, Math.floor((x - lo) / bw)))]++; });
  const pdf = x => st.sd ? Math.exp(-((x - st.mean) ** 2) / (2 * st.sd ** 2)) / (st.sd * Math.sqrt(2 * Math.PI)) : 0;
  const peak = Math.max(...cnt, v.length * bw * pdf(st.mean));
  const Wd = Math.max(280, el.clientWidth), H = 250, m = { t: 22, r: 16, b: 30, l: 40 }, iw = Wd - m.l - m.r, ih = H - m.t - m.b;
  const Y = niceTicks(0, peak * 1.1), x = val => m.l + (val - lo) / (hi - lo) * iw, y = c => m.t + ih - c / Y.hi * ih;
  let g = "";
  Y.ticks.forEach(t => { g += `<line class="grid" x1="${m.l}" x2="${Wd - m.r}" y1="${y(t)}" y2="${y(t)}"/><text x="${m.l - 8}" y="${y(t) + 4}" text-anchor="end">${fmt(t)}</text>`; });
  cnt.forEach((c, i) => { const a = lo + i * bw, out = (typeof usl === "number" && a + bw / 2 > usl) || (typeof lsl === "number" && a + bw / 2 < lsl);
    g += barPath(x(a) + 1, y(c), Math.max(1, x(a + bw) - x(a) - 2), y(0) - y(c), 2, out ? "var(--crit)" : "var(--s1)", `${fmt(r2(a))} ~ ${fmt(r2(a + bw))}: <b>${c}</b>개`); });
  const curve = Array.from({ length: 61 }, (_, i) => { const xv = lo + (hi - lo) * i / 60; return `${i ? "L" : "M"}${x(xv).toFixed(1)} ${y(v.length * bw * pdf(xv)).toFixed(1)}`; }).join("");
  if (st.sd) g += `<path d="${curve}" fill="none" stroke="var(--s3)" stroke-width="2"/>`;
  const vline = (val, cls, lab) => `<line class="${cls}" x1="${x(val)}" x2="${x(val)}" y1="${m.t - 6}" y2="${m.t + ih}"/><text class="cc-lbl ${cls}" x="${x(val)}" y="${m.t - 9}" text-anchor="middle">${lab}</text>`;
  g += vline(st.mean, "cc-cl", `평균 ${fmt(r2(st.mean))}`);
  if (typeof lsl === "number") g += vline(lsl, "cc-ucl", `LSL ${fmt(lsl)}`);
  if (typeof usl === "number") g += vline(usl, "cc-ucl", `USL ${fmt(usl)}`);
  const xt = niceTicks(lo, hi, 6); xt.ticks.filter(t => t >= lo && t <= hi).forEach(t => { g += `<text x="${x(t)}" y="${H - 8}" text-anchor="middle">${fmt(t)}</text>`; });
  el.innerHTML = `<svg viewBox="0 0 ${Wd} ${H}" height="${H}" role="img" aria-label="${esc(w.title)}">${g}</svg>`;
}
regW("histogram", {
  name: "히스토그램 · 공정능력", desc: "분포 · 규격선 · Cp/Cpk", linkable: true,
  def: () => { const ds = firstDs("cpk", "inspections"); const cpk = ds?.id === "cpk"; return { type: "histogram", span: 6, title: cpk ? "Cpk 분포" : "측정값 분포", lsl: cpk ? 1.33 : undefined, src: defaultSrc("histogram", ds?.id) }; },
  common: [["title", "제목", "text", 2], ["unit", "단위", "text", 1], ["subtitle", "부제", "text", 1], ["lsl", "규격 하한 (LSL)", "num", 1], ["usl", "규격 상한 (USL)", "num", 1], ["target", "목표 Cpk (기본 1.33)", "num", 1]],
  src: ds => ({ ds: ds.id, value: (dsFields(ds).find(f => isNumF(f) && /cpk|측정|값|두께|치수/i.test(f.key + f.label)) || dsFields(ds).find(isNumF) || {}).key || "", bins: 0, period: "all", filter: [] }),
  form: (P, s, ds) => ({ g: fld({ l: "값 항목", t: "sel", o: fOpts(ds, isNumF, "선택"), w: 2 }, `${P}.value`, s.value || "") + fld({ l: "막대 수 (0 = 자동)", t: "num" }, `${P}.bins`, s.bins ?? 0) + periodFields(P, s, ds) }),
  resolve(w, s, out) { const { recs } = selectRecs(s); out.hv = recs.map(r => r[s.value]).filter(v => !blank(v) && !isNaN(+v)).map(Number); if (out.hv.length) out.st = capStats(out.hv, w.usl, w.lsl); },
  render(w) {
    const st = w.st, tgt = typeof w.target === "number" ? w.target : 1.33;
    const right = st ? `<span class="cap">n=${st.n} · σ ${fmt(r2(st.sd))}${st.cp !== null ? ` · Cp <b>${fmt(r2(st.cp))}</b>` : ""}${st.cpk !== null ? ` · Cpk <b class="${st.cpk >= tgt ? "cc-ok" : "cc-alert"}">${fmt(r2(st.cpk))}</b>` : " · 규격을 넣으면 Cpk 계산"}${st.out ? ` · <span class="cc-alert">규격 밖 ${st.out}</span>` : ""}</span>` : "";
    return xChart(w, drawHist, right);
  },
  exports: [["png", "이미지 (PNG)"], ["svg", "벡터 이미지 (SVG)"], ["xlsx", "데이터 엑셀"], ["csv", "데이터 CSV"]],
  table: w => { const s = w.st || {}; return [["항목", "값"], ["개수", s.n ?? ""], ["평균", s.mean ?? ""], ["표준편차", s.sd ?? ""], ["Cp", s.cp ?? ""], ["Cpk", s.cpk ?? ""], ["규격 밖", s.out ?? ""], [], ["값"], ...(w.hv || []).map(v => [v])]; }
});

/* ===== 20. 미결 추이 (번다운): 날마다 미결 건수가 어떻게 줄었는지 ===== */
function drawBurn(el, w) {
  const S = w.burn || []; if (!S.length) return chartEmpty(el, w, w.linked ? "날짜가 있는 기록이 없습니다." : "데이터를 연결하세요.");
  const Wd = Math.max(280, el.clientWidth), H = 230, m = { t: 16, r: 46, b: 28, l: 40 }, iw = Wd - m.l - m.r, ih = H - m.t - m.b;
  const Y = niceTicks(0, Math.max(...S.map(p => p.open), ...S.map(p => p.add)) * 1.1 || 1), x = i => m.l + i / (S.length - 1 || 1) * iw, y = v => m.t + ih - v / Y.hi * ih;
  let g = ""; Y.ticks.forEach(t => { g += `<line class="grid" x1="${m.l}" x2="${Wd - m.r}" y1="${y(t)}" y2="${y(t)}"/><text x="${m.l - 8}" y="${y(t) + 4}" text-anchor="end">${fmt(t)}</text>`; });
  const bw = Math.max(1, iw / S.length - 1);
  S.forEach((p, i) => { if (p.add) g += `<rect x="${x(i) - bw / 2}" y="${y(p.add)}" width="${bw}" height="${y(0) - y(p.add)}" fill="var(--s1)" opacity=".18"/>`; });
  const d = S.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p.open).toFixed(1)}`).join("");
  g += `<path d="${d}L${x(S.length - 1)} ${y(0)}L${x(0)} ${y(0)}Z" fill="var(--s1)" opacity=".08"/><path d="${d}" fill="none" stroke="var(--s1)" stroke-width="2"/>`;
  const step = Math.ceil(S.length / Math.max(2, Math.floor(iw / 60)));
  S.forEach((p, i) => { if (i % step === 0) g += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle">${p.d.slice(5).replace("-", "/")}</text>`;
    g += `<rect class="hit" x="${x(i) - iw / S.length / 2}" y="${m.t}" width="${iw / S.length}" height="${ih}" data-x="${x(i)}" data-tip="${esc(`${p.d}<br>미결 <b>${p.open}</b>건 · 새로 ${p.add} · 종결 ${p.done}`)}"/>`; });
  const last = S.at(-1); g += `<circle cx="${x(S.length - 1)}" cy="${y(last.open)}" r="4" fill="var(--s1)" stroke="var(--surface)" stroke-width="2"/><text class="endlbl" x="${x(S.length - 1) + 6}" y="${y(last.open) + 4}">${last.open}</text>`;
  g += `<line class="xh" x1="0" x2="0" y1="${m.t}" y2="${m.t + ih}" stroke="var(--line-strong)" visibility="hidden" pointer-events="none"/>`;
  el.innerHTML = `<svg viewBox="0 0 ${Wd} ${H}" height="${H}" role="img" aria-label="${esc(w.title)}">${g}</svg>`;
}
regW("burndown", {
  name: "미결 추이", desc: "날마다 남은 미결 건수 (번다운)", linkable: true,
  def: () => { const ds = firstDs("capa", "nc", "claims"); return { type: "burndown", span: 6, title: `${ds?.name || ""} 미결 추이`, src: defaultSrc("burndown", ds?.id) }; },
  common: [["title", "제목", "text", 3], ["subtitle", "부제", "text", 1]],
  src(ds) { const D = dsFields(ds).filter(dateF), close = D.find(f => f.closes) || D.find(f => /완료|종결|승인/.test(f.label)); return { ds: ds.id, start: ds.dateField || D[0]?.key || "", end: close?.key || "", days: 90, period: "all", filter: [] }; },
  form: (P, s, ds) => ({ g: fld({ l: "열린 날짜 (접수·발행)", t: "sel", o: fOpts(ds, dateF, "선택") }, `${P}.start`, s.start || "") + fld({ l: "닫힌 날짜 (완료일)", t: "sel", o: fOpts(ds, dateF, "선택") }, `${P}.end`, s.end || "")
    + fld({ l: "보는 기간", t: "selnum", o: [["30", "최근 30일"], ["60", "최근 60일"], ["90", "최근 90일"], ["180", "최근 180일"], ["365", "최근 1년"]] }, `${P}.days`, String(s.days || 90)) }),
  resolve(w, s, out) {
    const ds = dsById(s.ds), T = dnum(TODAY()), n = +s.days || 90;
    let recs = visibleRecs(ds); (s.filter || []).forEach(c => { if (c.f && c.op) recs = recs.filter(r => matchCond(r, c)); });
    const R = recs.map(r => ({ a: dnum(r[s.start]), b: dnum(r[s.end]) })).filter(r => r.a !== null);
    out.burn = Array.from({ length: n + 1 }, (_, i) => { const d = T - n + i; return { d: dstr(d), open: R.filter(r => r.a <= d && (r.b === null || r.b > d)).length, add: R.filter(r => r.a === d).length, done: R.filter(r => r.b === d).length }; });
  },
  render(w) {
    const S = w.burn || [], a = S[0]?.open ?? 0, b = S.at(-1)?.open ?? 0, d = b - a;
    return xChart(w, drawBurn, S.length ? `현재 미결 <b>${b}</b>건 · ${S.length - 1}일 전보다 <span class="${d <= 0 ? "cc-ok" : "cc-alert"}">${d > 0 ? "+" : ""}${d}</span>` : "");
  },
  exports: [["png", "이미지 (PNG)"], ["svg", "벡터 이미지 (SVG)"], ["xlsx", "데이터 엑셀"], ["csv", "데이터 CSV"]],
  table: w => [["날짜", "미결", "새로", "종결"], ...(w.burn || []).map(p => [p.d, p.open, p.add, p.done])]
});

/* ===== 21. 배치도: 공장·라인 그림 위에 구역별 값을 점 크기·색으로 (편집 모드에서 점을 끌어 배치) ===== */
regW("floormap", {
  name: "배치도", desc: "공장 배치 위 구역별 불량", linkable: true,
  def: () => { const ds = firstDs("defects", "inspections"); return { type: "floormap", span: 12, title: "라인별 불량 배치도", unit: "개", src: defaultSrc("floormap", ds?.id), pos: {} }; },
  common: [["title", "제목", "text", 2], ["unit", "단위", "text", 1], ["img", "배경 그림 주소 (files/… · https://… · 비우면 기본 배치)", "text", 4]],
  src: (ds, h) => { const by = (dsFields(ds).find(f => f.refType && f.ref === "lines") || dsFields(ds).find(f => /라인|구역|공정|설비/.test(f.label)) || h.cat || {}).key || ""; const q = (dsFields(ds).find(f => isNumF(f) && /수량/.test(f.label)) || {}).key;
    return { ds: ds.id, by, agg: q ? "sum" : "count", field: q || "", period: "last3m", filter: [] }; },
  form: (P, s, ds) => ({ g: fld({ l: "구역 항목 (점 하나)", t: "sel", o: fOpts(ds, catF, "선택"), w: 2 }, `${P}.by`, s.by || "") + measureFields(P, s, ds) + periodFields(P, s, ds), extra: `<div class="hint" style="margin:6px 0">카드의 ‘배치 편집’을 누르고 점을 끌어 원하는 자리에 놓으세요. 위치는 이 위젯에 저장됩니다.</div>` }),
  resolve(w, s, out) {
    const { recs, ds } = selectRecs(s), f = fieldOf(ds, s.by);
    const keys = [...new Set([...(f?.options || []), ...keysBy(recs, s.by, ds, "count")])].filter(k => k !== "(없음)");
    out.zones = keys.map(k => ({ k, v: aggregate(recs.filter(r => gin(r, s.by, k)), s) }));
  },
  render(w) {
    if (!w.linked) return card(w, `<div class="empty">데이터를 연결하세요.</div>`);
    const Z = w.zones || [], mx = Math.max(1, ...Z.map(z => z.v)), on = wEditOn.has(wKey(curWi)), cols = Math.ceil(Math.sqrt(Z.length || 1) * 1.4);
    const pos = (z, i) => w.pos?.[z.k] || { x: 10 + (i % cols) * (80 / Math.max(1, cols - 1 || 1)), y: 18 + Math.floor(i / cols) * 28 };
    const bg = w.img ? `<img class="fm-bg" src="${esc(/^(https?:|data:)/.test(w.img) ? w.img : encPath(w.img))}" alt="" data-att="${esc(w.img)}">` : `<div class="fm-floor">${Z.map((z, i) => { const p = pos(z, i); return `<span class="fm-zone" style="left:${p.x}%;top:${p.y}%"></span>`; }).join("")}</div>`;
    const pins = Z.map((z, i) => { const p = pos(z, i), r = 14 + Math.sqrt(z.v / mx) * 22, pc = Math.round(z.v / mx * 100);
      return `<div class="fm-pin${on ? " drag" : ""}" data-fmk="${esc(z.k)}" data-wi="${curWi}"${on ? "" : drillA({ c: [[w.src.by, z.k]] })} style="left:${p.x}%;top:${p.y}%;--r:${r}px;--hm:${Math.max(12, pc)}%" data-tip="${esc(`${esc(z.k)}: <b>${fmt(z.v)}</b> ${esc(w.unit || "")}`)}"><b>${fmt(z.v)}</b><span>${esc(z.k)}</span></div>`; }).join("");
    return card(w, `<div class="fm${on ? " editing" : ""}" data-fm="${curWi}">${bg}${pins}</div>`, `${wEditBtn(on, "배치 편집")}${Z.length}개 구역`);
  },
  table: w => [["구역", "값"], ...(w.zones || []).map(z => [z.k, z.v])]
});
document.addEventListener("pointerdown", e => {
  const pin = e.target.closest?.(".fm.editing .fm-pin"); if (!pin || e.button !== 0) return;
  e.preventDefault(); const box = pin.closest(".fm"), br = box.getBoundingClientRect(); pin.setPointerCapture(e.pointerId); pin.classList.add("moving");
  let px = parseFloat(pin.style.left), py = parseFloat(pin.style.top);
  const move = ev => { px = Math.max(2, Math.min(98, (ev.clientX - br.left) / br.width * 100)); py = Math.max(4, Math.min(96, (ev.clientY - br.top) / br.height * 100)); pin.style.left = px + "%"; pin.style.top = py + "%"; };
  const up = () => { pin.removeEventListener("pointermove", move); pin.removeEventListener("pointerup", up); pin.classList.remove("moving");
    saveWidgetEdit(+pin.dataset.wi, w => { (w.pos ||= {})[pin.dataset.fmk] = { x: Math.round(px * 10) / 10, y: Math.round(py * 10) / 10 }; }); };
  pin.addEventListener("pointermove", move); pin.addEventListener("pointerup", up);
}, true);

/* ===== 22. 랭킹 변화: 이번 기간과 지난 기간 순위를 비교 ▲▼ ===== */
const RANK_CMP = [["month", "이번 달 vs 지난달"], ["3m", "최근 3개월 vs 그 전 3개월"], ["year", "올해 vs 작년 같은 기간"]];
function rankRanges(c) {
  const ym = ymOf(TODAY()), Y = +TODAY().slice(0, 4), md = TODAY().slice(5);
  if (c === "3m") return [[ymAdd(ym, -2) + "-01", TODAY()], [ymAdd(ym, -5) + "-01", ymAdd(ym, -3) + "-31"]];
  if (c === "year") return [[`${Y}-01-01`, TODAY()], [`${Y - 1}-01-01`, `${Y - 1}-${md}`]];
  return [[ym + "-01", TODAY()], [ymAdd(ym, -1) + "-01", ymAdd(ym, -1) + "-" + TODAY().slice(8)]];
}
regW("rankchange", {
  name: "랭킹 변화", desc: "지난 기간 대비 순위 ▲▼", linkable: true,
  def: () => { const ds = firstDs("claims", "defects"); return { type: "rankchange", span: 6, title: `${ds?.name || ""} 순위 변화`, unit: "건", src: defaultSrc("rankchange", ds?.id) }; },
  common: [["title", "제목", "text", 3], ["unit", "단위", "text", 1]],
  src: (ds, h) => ({ ...h.s, by: fieldBy(ds, /유형|불량|부품|협력/, catF) || h.cat?.key || "", cmp: "3m", top: 8 }),
  form: (P, s, ds) => ({ g: fld({ l: "순위 기준 항목", t: "sel", o: fOpts(ds, catF, "선택"), w: 2 }, `${P}.by`, s.by || "") + fld({ l: "비교 기간", t: "sel", o: RANK_CMP, w: 2 }, `${P}.cmp`, s.cmp || "3m") + measureFields(P, s, ds) + fld({ l: "표시 개수", t: "num" }, `${P}.top`, s.top ?? 8) + fld({ l: "기준 날짜", t: "sel", o: fOpts(ds, dateF, "기본"), w: 2 }, `${P}.dateField`, s.dateField || ""), noFilter: false }),
  resolve(w, s, out) {
    const { recs, ds, df } = selectRecs(s, "all"), k = s.dateField || df, [cur, prev] = rankRanges(s.cmp);
    const inR = ([a, b]) => recs.filter(r => { const d = String(r[k] || "").slice(0, 10); return d && d >= a && d <= b; });
    const rank = rs => keysBy(rs, s.by, ds, "count").filter(g => g !== "(없음)").map(g => ({ g, v: aggregate(rs.filter(r => gin(r, s.by, g)), s) })).filter(x => x.v > 0).sort((a, b) => b.v - a.v);
    const A = rank(inR(cur)), B = rank(inR(prev)), bi = Object.fromEntries(B.map((x, i) => [x.g, i + 1]));
    out.rk = A.slice(0, +s.top || 8).map((x, i) => ({ ...x, r: i + 1, pr: bi[x.g] || null, pv: B.find(y => y.g === x.g)?.v ?? 0 }));
    out.cmpName = (RANK_CMP.find(c => c[0] === (s.cmp || "3m")) || [, ""])[1]; out.range = cur;
  },
  render(w) {
    const R = w.rk || []; if (!R.length) return card(w, `<div class="empty">${w.linked ? "이번 기간에 기록이 없습니다." : "데이터를 연결하세요."}</div>`);
    const mx = Math.max(...R.map(x => x.v));
    return card(w, `<div class="rk">${R.map(x => { const ch = x.pr === null ? "new" : x.pr - x.r, cls = ch === "new" ? "new" : ch > 0 ? "up" : ch < 0 ? "down" : "same";
      return `<div class="rk-row"${w.linked ? drillA({ c: [[w.src.by, x.g]], range: w.range, all: 1 }) : ""}><span class="rk-n">${x.r}</span><span class="rk-g" title="${esc(x.g)}">${esc(x.g)}</span><span class="rk-bar"><b style="width:${(x.v / mx * 100).toFixed(1)}%"></b></span><span class="rk-v">${fmt(x.v)}</span>
        <span class="rk-ch ${cls}" title="지난 기간 ${x.pr ? x.pr + "위 · " + fmt(x.pv) : "순위 없음"}">${ch === "new" ? "NEW" : ch > 0 ? `▲${ch}` : ch < 0 ? `▼${-ch}` : "–"}</span></div>`; }).join("")}</div>`, esc(w.cmpName));
  },
  table: w => [["순위", "항목", "값", "지난 순위", "지난 값"], ...(w.rk || []).map(x => [x.r, x.g, x.v, x.pr ?? "", x.pv])]
});

/* ===== 23. 텍스트 요약: 숫자를 문장으로 자동 작성 (보고서 첫 줄·메일용) ===== */
/* 받침에 맞는 조사: josa("클레임", "은", "는") → "클레임은" (영문·숫자는 읽는 소리 기준으로 대강) */
function josa(w, a, b) { const t = String(w || "").trim(), c = t.slice(-1), code = c.charCodeAt(0);
  const has = code >= 0xAC00 && code <= 0xD7A3 ? (code - 0xAC00) % 28 > 0 : /[136780lmnrLMNR]$/.test(c);
  return t + (has ? a : b); }
regW("summary", {
  name: "텍스트 요약", desc: "숫자를 문장으로 자동 요약", linkable: true,
  def: () => { const ds = firstDs("claims", "defects"); return { type: "summary", span: 6, title: `${ds?.name || ""} 요약`, unit: "건", src: defaultSrc("summary", ds?.id) }; },
  common: [["title", "제목", "text", 3], ["unit", "단위", "text", 1]],
  src: (ds, h) => ({ ...h.s, by: fieldBy(ds, /고객|협력/, catF) || h.cat?.key || "", by2: fieldBy(ds, /유형|불량|부품/, catF) || "", period: "thisMonth" }),
  form: (P, s, ds) => ({ g: fld({ l: "기간", t: "sel", o: PERIODS.filter(p => p[0] !== "all"), w: 2 }, `${P}.period`, s.period || "thisMonth") + fld({ l: "가장 많은 것 1 (예: 고객사)", t: "sel", o: fOpts(ds, catF, "없음") }, `${P}.by`, s.by || "") + fld({ l: "가장 많은 것 2 (예: 유형)", t: "sel", o: fOpts(ds, catF, "없음") }, `${P}.by2`, s.by2 || "") + measureFields(P, s, ds) }),
  resolve(w, s, out) {
    const { recs, ds, df } = selectRecs(s), all = selectRecs(s, "all").recs, u = w.unit || "건", per = periodName(s.period || "thisMonth");
    const v = aggregate(recs, s), lines = [];
    let cmp = "";
    if (s.period === "thisMonth" && df) { const pv = aggregate(lastMonthToDate(all, df), s), d = r2(v - pv); cmp = ` 지난달 같은 기간(${fmt(pv)}${esc(u)})보다 ${d === 0 ? "같습니다" : `<b class="${d > 0 ? "up" : "down"}">${fmt(Math.abs(d))}${esc(u)} ${d > 0 ? "많습니다" : "적습니다"}</b>`}.`; }
    lines.push(`${esc(per)} <b>${esc(ds.name)}</b> ${esc(josa(measureName(s, ds), "은", "는"))} <b>${fmt(v)}${esc(u)}</b>입니다.${cmp}`);
    [s.by, s.by2].filter(Boolean).forEach(k => { const ks = keysBy(recs, k, ds, "count").filter(g => g !== "(없음)"); if (!ks.length) return;
      const tv = aggregate(recs.filter(r => gin(r, k, ks[0])), s), pc = v ? Math.round(tv / v * 100) : 0;
      lines.push(`${esc(fieldOf(ds, k)?.label || "")}별로는 <b>${esc(josa(ks[0], "이", "가"))}</b> 가장 많습니다 (${fmt(tv)}${esc(u)}, ${pc}%).${ks[1] ? ` 다음은 ${esc(ks[1])}${ks[2] ? `, ${esc(ks[2])}` : ""} 순입니다.` : ""}`); });
    const badge = dsFields(ds).find(f => f.badge);
    if (badge) { const open = all.filter(r => !DONE.includes(r[badge.key])), due = dsFields(ds).find(f => dateF(f) && /기한|마감|납기/.test(f.label)), late = due ? open.filter(r => !blank(r[due.key]) && r[due.key] < TODAY()).length : 0;
      lines.push(`아직 끝나지 않은 건은 <b>${open.length}건</b>${late ? `이고, 그중 <b class="up">${late}건</b>은 기한이 지났습니다` : "입니다"}.`); }
    out.lines = lines;
  },
  render(w) {
    if (!w.linked) return card(w, `<div class="empty">데이터를 연결하세요.</div>`);
    return card(w, `<div class="sm-text">${(w.lines || []).map(l => `<p>${l}</p>`).join("")}</div><div class="sm-act"><button type="button" class="btn sm" data-smcopy="${curWi}">문장 복사</button></div>`, "자동 작성");
  },
  exports: [["txt", "텍스트 (TXT)"]],
  table: w => [["요약"], ...(w.lines || []).map(l => [l.replace(/<[^>]+>/g, "")])]
});
document.addEventListener("click", e => {
  const b = e.target.closest?.("[data-smcopy]"); if (!b) return;
  const txt = [...b.closest(".card").querySelectorAll(".sm-text p")].map(p => p.textContent).join("\n");
  (navigator.clipboard?.writeText(txt) || Promise.reject()).then(() => toast("요약 문장을 복사했습니다."), () => { const r = document.createRange(); r.selectNodeContents(b.closest(".card").querySelector(".sm-text")); getSelection().removeAllRanges(); getSelection().addRange(r); toast("문장을 선택했습니다. Ctrl+C로 복사하세요."); });
});

/* ===== 24. 진행 타임라인: 기록 하나의 날짜들을 단계별로 가로로 ===== */
regW("timeline", {
  name: "진행 타임라인", desc: "기록 하나의 단계별 날짜", linkable: true,
  def: () => { const ds = firstDs("capa", "claims", "ppap"); return { type: "timeline", span: 12, title: `${ds?.name || ""} 진행 타임라인`, src: defaultSrc("timeline", ds?.id) }; },
  common: [["title", "제목", "text", 4]],
  src: ds => ({ ds: ds.id, rid: "", period: "all", filter: [] }),
  form(P, s, ds) {
    const df = ds.dateField, tk = titleKeyOf(ds), R = [...visibleRecs(ds)].sort((a, b) => -cmp(a[df], b[df])).slice(0, 300);
    return { g: fld({ l: "보여 줄 기록", t: "sel", o: [["", "가장 최근 기록 (조건에 맞는)"], ...R.map(r => [r.id, `${valText(r[tk]) || "(제목 없음)"}${df && r[df] ? " · " + r[df] : ""}`])], w: 4 }, `${P}.rid`, s.rid || "") };
  },
  resolve(w, s, out) {
    const { recs, ds, df } = selectRecs(s), F = dsFields(ds), tk = titleKeyOf(ds);
    const r = s.rid ? (ds.records || []).map(x => recView(ds, x)).find(x => x.id === s.rid) : [...recs].sort((a, b) => -cmp(a[df], b[df]))[0];
    if (!r) return;
    const badge = F.find(f => f.badge), step = F.find(f => f.type === "select" && !f.badge && /단계|step/i.test(f.label + f.key));
    out.tl = { rid: r.id, title: valText(r[tk]) || "(제목 없음)", status: badge ? r[badge.key] : "", badgeF: badge, step: step ? r[step.key] : "", stepF: step,
      pts: F.filter(dateF).map(f => ({ l: f.label, d: r[f.key], due: /기한|마감|납기|예정/.test(f.label) })).filter(p => dnum(p.d) !== null).sort((a, b) => a.d.localeCompare(b.d)),
      sub: F.filter(f => f.refType).slice(0, 3).map(f => valText(r[f.key])).filter(Boolean).join(" · ") };
  },
  render(w) {
    const t = w.tl; if (!t) return card(w, `<div class="empty">${w.linked ? "조건에 맞는 기록이 없습니다." : "데이터를 연결하세요."}</div>`);
    const T = dnum(TODAY()), P = [...t.pts], all = [...P.map(p => dnum(p.d)), T], lo = Math.min(...all), hi = Math.max(...all), span = hi - lo || 1, pc = d => (d - lo) / span * 100;
    const nodes = P.map((p, i) => { const d = dnum(p.d), late = p.due && d < T && !DONE.includes(t.status), gap = i ? Math.round(d - dnum(P[i - 1].d)) : null;
      return `<div class="tl-n${p.due ? " due" : ""}${late ? " late" : ""}${d > T ? " future" : ""}" style="left:${pc(d)}%"><i></i><b>${esc(p.l)}</b><span>${esc(p.d)}</span>${gap !== null ? `<em>+${gap}일</em>` : ""}</div>`; }).join("");
    return card(w, `<div class="tl-head rowlink" data-a="rec-open" data-ds="${esc(w.src.ds)}" data-id="${esc(t.rid)}" title="눌러서 열기"><b>${esc(t.title)}</b>${t.step ? chipFor(t.stepF, t.step) : ""}${t.status ? chipFor(t.badgeF, t.status) : ""}<span class="tl-sub">${esc(t.sub)}</span></div>
      <div class="tl"><div class="tl-line"></div><div class="tl-today" style="left:${pc(T)}%"><span>오늘</span></div>${nodes}</div>`, P.length >= 2 ? `처음부터 ${Math.round(dnum(P.at(-1).d) - dnum(P[0].d))}일` : "");
  },
  table: w => [["단계", "날짜"], ...(w.tl?.pts || []).map(p => [p.l, p.d])]
});

/* ===== 25. 이미지·도면 주석: 사진 위에 번호 표시와 설명 (편집 모드에서 눌러 추가) ===== */
regW("annotate", {
  name: "이미지 주석", desc: "사진·도면 위 번호 표시",
  def: () => { const im = allAttachments().find(isImgA); return { type: "annotate", span: 6, title: "불량 위치 표시", img: im?.path || "", marks: [] }; },
  common: [["title", "제목", "text", 4]],
  editor: (w, P) => { const ims = allAttachments().filter(isImgA);
    return `<div class="cgrid">${fld({ l: "첨부된 사진에서 고르기", t: "sel", o: [["", ims.length ? "고르기" : "첨부된 사진이 없습니다"], ...ims.map(a => [a.path, `${a.name} · ${a.uses[0]?.title || ""}`])], w: 4 }, `${P}.img`, w.img || "")}
      ${fld({ l: "또는 그림 주소 (files/… · https://…)", t: "text", w: 4 }, `${P}.img`, w.img || "")}</div><div class="hint" style="margin-top:6px">카드의 ‘주석 편집’을 누른 뒤 그림을 누르면 번호가 추가됩니다. 번호마다 설명을 적을 수 있습니다.</div>`; },
  resolveAny: w => w,
  render(w) {
    if (!w.img) return card(w, `<div class="empty">편집에서 사진이나 도면을 고르세요.</div>`);
    const on = wEditOn.has(wKey(curWi)), M = w.marks || [], src = /^(https?:|data:)/.test(w.img) ? w.img : encPath(w.img);
    return card(w, `<div class="an${on ? " editing" : ""}" data-an="${curWi}"><div class="an-stage"><img src="${esc(src)}" data-att="${esc(w.img)}" alt="${esc(w.title)}">${M.map((m, i) => `<span class="an-pin" style="left:${m.x}%;top:${m.y}%" data-tip="${esc(`<b>${i + 1}</b> ${esc(m.t || "")}`)}">${i + 1}</span>`).join("")}<span class="fz-miss">그림을 찾지 못했습니다</span></div>
      ${M.length ? `<ol class="an-list">${M.map((m, i) => `<li><b>${i + 1}</b>${on ? `<input class="f an-note" data-an-i="${i}" data-wi="${curWi}" value="${esc(m.t || "")}" placeholder="설명">` + `<button type="button" class="ib" data-an-del="${i}" data-wi="${curWi}" aria-label="${i + 1}번 지우기">✕</button>` : `<span>${esc(m.t || "(설명 없음)")}</span>`}</li>`).join("")}</ol>` : on ? `<div class="hint">그림을 눌러 첫 번호를 추가하세요.</div>` : ""}</div>`, `${wEditBtn(on, "주석 편집")}${M.length}개`);
  },
  table: w => [["번호", "설명", "x(%)", "y(%)"], ...(w.marks || []).map((m, i) => [i + 1, m.t || "", m.x, m.y])]
});
document.addEventListener("click", e => {
  const img = e.target.closest?.(".an.editing .an-stage img");
  if (img) { const box = img.closest(".an"), r = img.getBoundingClientRect(), i = +box.dataset.an;
    const x = Math.round((e.clientX - r.left) / r.width * 1000) / 10, y = Math.round((e.clientY - r.top) / r.height * 1000) / 10;
    saveWidgetEdit(i, w => { (w.marks ||= []).push({ x, y, t: "" }); });
    setTimeout(() => { const inps = document.querySelectorAll(`.an[data-an="${i}"] .an-note`); inps[inps.length - 1]?.focus(); }, 30); return; }
  const del = e.target.closest?.("[data-an-del]"); if (del) { e.preventDefault(); saveWidgetEdit(+del.dataset.wi, w => { w.marks.splice(+del.dataset.anDel, 1); }); }
});
document.addEventListener("change", e => { const n = e.target.closest?.(".an-note"); if (!n) return; saveWidgetEdit(+n.dataset.wi, w => { if (w.marks?.[+n.dataset.anI]) w.marks[+n.dataset.anI].t = n.value.trim(); }); });
function measureFields(P, s, ds) {
  let h = fld({ l: "계산 방법", t: "sel", o: AGGS, re: 1, w: 2 }, `${P}.agg`, s.agg || "count");
  if (s.agg && s.agg !== "count") h += fld({ l: s.agg === "ratio" ? "A (분자) 항목" : "계산할 항목", t: "sel", o: fOpts(ds, isNumF, "선택"), w: 2 }, `${P}.field`, s.field || "");
  if (s.agg === "ratio") h += fld({ l: "B (분모) 항목", t: "sel", o: fOpts(ds, isNumF, "선택"), w: 2 }, `${P}.field2`, s.field2 || "") + fld({ l: "표시 단위", t: "selnum", o: SCALES, w: 2 }, `${P}.scale`, String(s.scale || 1));
  return h;
}
function periodFields(P, s, ds) {
  return fld({ l: "기간", t: "sel", o: PERIODS, w: 2 }, `${P}.period`, s.period || "all")
    + fld({ l: "기간 기준 날짜", t: "sel", o: fOpts(ds, dateF, `기본 (${fieldOf(ds, ds?.dateField)?.label || "없음"})`), w: 2 }, `${P}.dateField`, s.dateField || "");
}
function filterHTML(P, s, ds) {
  const fs = s.filter || [];
  return `<div class="cond-hint">모두 만족하는 기록만 씁니다 · 날짜는 <code>today</code>, <code>today-30</code>, <code>today+7</code></div>
  ${fs.length ? `<div class="gwrap"><table class="gt"><tbody>${fs.map((c, r) => {
    const f = fieldOf(ds, c.f), dl = `dl-${P.replace(/\W/g, "_")}-${r}`;
    const vals = f?.options || [...new Set((ds?.records || []).map(x => x[c.f]).filter(v => !blank(v)))].slice(0, 40);
    return `<tr><td>${inp({ t: "sel", o: fOpts(ds, null, "항목 선택"), re: 1 }, `${P}.filter.${r}.f`, c.f || "")}</td><td>${inp({ t: "sel", o: OPS, re: 1 }, `${P}.filter.${r}.op`, c.op || "=")}</td>
      <td>${c.op === "empty" || c.op === "filled" ? "" : inp({ t: "text", dl }, `${P}.filter.${r}.v`, c.v) + `<datalist id="${dl}">${vals.map(v => `<option value="${esc(v)}"></option>`).join("")}</datalist>`}</td>
      <td class="acts"><button type="button" class="ib del" data-a="r-del" data-p="${P}.filter" data-r="${r}" title="조건 삭제">✕</button></td></tr>`;
  }).join("")}</tbody></table></div>` : ""}
  <button type="button" class="cond-add" data-a="r-add" data-p="${P}.filter" data-type="__filter">＋ 조건 추가</button>`;
}
/* ---------- 데이터 연동 설정을 읽기 쉽게: 한 줄 요약 + 묶음(데이터·값·구성·기간·정렬)별 '이름 | 입력' 줄 ---------- */
const SRC_GROUPS = [["데이터", "▦", ["ds"]],
  ["값", "Σ", ["agg", "field", "field2", "scale", "value", "num", "den", "score", "mode", "group", "maxField", "max", "pass", "label"]],
  ["구성", "◫", []],
  ["기간", "◷", ["period", "dateField"]],
  ["정렬 · 개수", "↕", ["sort", "asc", "limit", "top", "topRows", "topCols", "order", "latest", "months", "hideEmpty"]]];
function groupedFields(html) {
  const t = document.createElement("template"); t.innerHTML = html;
  const buckets = SRC_GROUPS.map(() => []);
  [...t.content.children].forEach(el => {
    const b = el.querySelector("[data-b]"); if (!b) return;                 /* 빈 칸 메우기용 요소는 버림 */
    const key = b.dataset.b.split(".").pop(), gi = SRC_GROUPS.findIndex(([, , ks]) => ks.includes(key));
    el.removeAttribute("style"); buckets[gi < 0 ? 2 : gi].push(el.outerHTML);
  });
  return buckets.map((rows, i) => rows.length ? `<div class="sg"><div class="sg-h"><i aria-hidden="true">${SRC_GROUPS[i][1]}</i>${SRC_GROUPS[i][0]}</div><div class="sg-rows">${rows.join("")}</div></div>` : "").join("");
}
/* 지금 설정을 한 문장으로: 고객 클레임 · 최근 3개월 · 불량 유형별 · 건수 · 조건 2개 */
function srcSummary(type, s, ds) {
  if (!ds) return "";
  const lab = k => fieldOf(ds, k)?.label || "";
  const by = [s.x && s.x !== "month" ? s.x : "", s.by, s.by2, s.col, s.series].filter(Boolean).map(k => `${lab(k)}별`);
  const meas = s.agg === "ratio" ? `${lab(s.field) || "A"} ÷ ${lab(s.field2) || "B"}` : s.agg && s.agg !== "count" ? `${lab(s.field) || "(항목 선택)"} ${(AGGS.find(a => a[0] === s.agg) || [, ""])[1]}` : ["kpi", "bar", "line", "hbar", "pareto", "heatmap", "gauge", "yoy", "donut"].includes(type) ? "건수" : "";
  const per = (type === "bar" || type === "line") && (s.x || "month") === "month" ? `최근 ${+s.months || 6}개월 월별` : type === "yoy" ? "1~12월 작년·올해" : periodName(s.period || "all");
  const parts = [`<b>${esc(ds.name)}</b>`, esc(per), ...by.map(esc), meas && `<b>${esc(meas)}</b>`, (s.filter || []).length ? `조건 ${(s.filter || []).length}개` : ""].filter(Boolean);
  return `<div class="src-sum"><span class="src-dot" aria-hidden="true"></span>${parts.join(`<span class="sep">·</span>`)}<span class="src-n">${visibleRecs(ds).length.toLocaleString()}건</span></div>`;
}
function srcForm(type, P, s) {
  const ds = dsById(s.ds);
  let g = fld({ l: "데이터", t: "sel", o: dsOpts(), re: 1, w: 2 }, `${P}.ds`, s.ds || "");
  if (!ds) return `<div class="cgrid">${g}</div><div class="empty">데이터를 선택하세요.</div>`;
  let extra = "";
  if (type === "kpi") {
    g += measureFields(P, s, ds) + periodFields(P, s, ds);
    extra = `<div class="cgrid">${fld({ l: "전월 대비 증감 (기간이 이번 달일 때)", t: "chk", w: 2 }, `${P}.compare`, s.compare)}${fld({ l: "최근 10개월 미니 추이", t: "chk", w: 2 }, `${P}.spark`, s.spark)}</div>`;
  }
  if (type === "bar" || type === "line") {
    const x = s.x || "month";
    g += fld({ l: "가로축", t: "sel", o: [["month", "월별 추이"], ...fOpts(ds, catF).map(([k, l]) => [k, `항목별: ${l}`])], re: 1, w: 2 }, `${P}.x`, x);
    g += x === "month" ? fld({ l: "표시 개월 수", t: "selnum", o: [["3", "3개월"], ["6", "6개월"], ["10", "10개월"], ["12", "12개월"]] }, `${P}.months`, String(s.months || 6))
      : fld({ l: "최대 항목 수", t: "num" }, `${P}.top`, s.top);
    g += fld({ l: "계열 나누기", t: "sel", o: fOpts(ds, f => f.type === "select", "나누지 않음") }, `${P}.series`, s.series || "");
    g += measureFields(P, s, ds);
    if (x !== "month") g += periodFields(P, s, ds);
  }
  if (type === "hbar") g += fld({ l: "순위 기준 항목", t: "sel", o: fOpts(ds, catF, "선택"), w: 2 }, `${P}.by`, s.by || "") + fld({ l: "표시 개수", t: "num" }, `${P}.top`, s.top ?? 5) + `<span></span>` + measureFields(P, s, ds) + periodFields(P, s, ds);
  if (type === "progress") {
    g += fld({ l: "표시 방식", t: "sel", o: [["dist", "항목별 건수 분포"], ["rows", "기록마다 한 줄 (진행률 등 값)"]], re: 1, w: 2 }, `${P}.mode`, s.mode || "dist");
    if (s.mode === "rows") g += fld({ l: "이름 항목", t: "sel", o: fOpts(ds, catF, "선택") }, `${P}.label`, s.label || "") + fld({ l: "값 항목", t: "sel", o: fOpts(ds, isNumF, "선택") }, `${P}.value`, s.value || "")
      + fld({ l: "최대 (목표) 항목", t: "sel", o: fOpts(ds, isNumF, "고정값 사용") }, `${P}.maxField`, s.maxField || "") + fld({ l: "고정 최댓값", t: "num" }, `${P}.max`, s.max ?? 100)
      + fld({ l: "메모 항목", t: "sel", o: fOpts(ds, null, "없음") }, `${P}.noteField`, s.noteField || "") + fld({ l: "정렬 기준", t: "sel", o: fOpts(ds, null, "입력 순서") }, `${P}.sort`, s.sort || "")
      + fld({ l: "최대 개수", t: "num" }, `${P}.limit`, s.limit) + fld({ l: "오름차순", t: "chk" }, `${P}.asc`, s.asc);
    else g += fld({ l: "분포 기준 항목", t: "sel", o: fOpts(ds, f => f.type === "select", "선택"), w: 2 }, `${P}.by`, s.by || "");
    g += periodFields(P, s, ds);
  }
  if (type === "note") {
    g += fld({ l: "본문 항목", t: "sel", o: fOpts(ds, f => f.type === "text" || f.type === "longtext" || f.type === "select", "선택"), w: 2 }, `${P}.main`, s.main || "")
      + fld({ l: "앞에 붙일 항목", t: "sel", o: fOpts(ds, null, "없음") }, `${P}.pre`, s.pre || "") + fld({ l: "뒤 괄호 항목", t: "sel", o: fOpts(ds, null, "없음") }, `${P}.post`, s.post || "") + fld({ l: "색 태그로 표시", t: "sel", o: fOpts(ds, isTagF, "없음") }, `${P}.tag`, s.tag ?? (dsFields(ds).find(isTagF) || {}).key ?? "")
      + fld({ l: "정렬 기준", t: "sel", o: fOpts(ds, null, "기본 (기준 날짜)") }, `${P}.sort`, s.sort || "") + fld({ l: "최대 줄 수", t: "num" }, `${P}.limit`, s.limit)
      + fld({ l: "오름차순", t: "chk", w: 2 }, `${P}.asc`, s.asc) + periodFields(P, s, ds);
  }
  if (type === "table") {
    g += fld({ l: "정렬 기준", t: "sel", o: fOpts(ds, null, "기본 (기준 날짜)") }, `${P}.sort`, s.sort || "") + fld({ l: "최대 행 수", t: "num" }, `${P}.limit`, s.limit)
      + fld({ l: "오름차순 (작은 값·오래된 날짜 먼저)", t: "chk", w: 2 }, `${P}.asc`, s.asc) + periodFields(P, s, ds);
    const cols = s.cols?.length ? s.cols : dsFields(ds).map(f => f.key);
    extra = `<div class="glbl">표시할 열</div><div class="chips">${dsFields(ds).map(f => `<label class="chip"><input type="checkbox" data-b="${P}.cols" data-t="arr" data-v="${esc(f.key)}" ${cols.includes(f.key) ? "checked" : ""}> ${esc(f.label)}</label>`).join("")}</div>`;
  }
  if (type === "tasks") {
    const m = s.map || {};
    g += [["title", "업무명", null], ["owner", "담당", null], ["due", "기한", dateF], ["status", "상태", null], ["progress", "진행률", isNumF]]
      .map(([k, l, pr]) => fld({ l: `${l} 항목`, t: "sel", o: fOpts(ds, pr, "사용 안 함") }, `${P}.map.${k}`, m[k] || "")).join("")
      + fld({ l: "최대 개수", t: "num" }, `${P}.limit`, s.limit) + `<span></span><span></span>` + periodFields(P, s, ds);
  }
  let noFilter = false;
  if (XW[type]?.form) { const r = XW[type].form(P, s, ds) || {}; g += r.g || ""; extra += r.extra || ""; noFilter = !!r.noFilter; }
  return `${srcSummary(type, s, ds)}<div class="sgs">${groupedFields(g)}</div>${extra ? `<div class="sg-extra">${extra}</div>` : ""}${noFilter ? "" : `<div class="sg"><div class="sg-h"><i aria-hidden="true">⚲</i>조건</div>${filterHTML(P, s, ds)}</div>`}`;
}
function defaultSrc(type, dsId) {
  const ds = dsById(dsId) || (cfg.datasets || [])[0]; if (!ds) return { ds: "" };
  const F = dsFields(ds), sel = F.find(f => f.type === "select"), badge = F.find(f => f.badge), cat = sel || F.find(catF);
  const find = (re, pr) => (F.find(f => re.test(f.label) && (!pr || pr(f))) || {}).key || "";
  const s = { ds: ds.id, agg: "count", filter: [] };
  const notDone = badge?.options?.includes("완료") ? [{ f: badge.key, op: "!=", v: "완료" }] : [];
  switch (type) {
    case "kpi": return { ...s, period: "thisMonth", compare: true, spark: true };
    case "bar": case "line": return { ...s, x: "month", months: 6, period: "all" };
    case "hbar": return { ...s, by: cat?.key || "", top: 5, period: "last3m" };
    case "progress": return { ds: ds.id, by: sel?.key || "", period: "all", filter: notDone };
    case "table": return { ds: ds.id, period: "all", filter: [], cols: F.slice(0, 7).map(f => f.key), limit: 10 };
    case "note": return { ds: ds.id, period: "all", filter: [], main: titleKeyOf(ds) || (F.find(f => f.type === "text") || {}).key || "", pre: ds.dateField || "", post: find(/담당/), limit: 5 };
    case "tasks": return { ds: ds.id, period: "all", filter: notDone, limit: 6, map: {
      title: find(/업무|건명|제목|내용/) || (F.find(f => f.type === "text") || {}).key || "", owner: find(/담당/),
      due: find(/기한|마감/, dateF) || (F.find(dateF) || {}).key || "", status: badge?.key || "", progress: find(/진행/, isNumF) } };
  }
  if (XW[type]?.src) return XW[type].src(ds, { s, F, find, badge, sel, cat, notDone });
  return s;
}
const KPI_LINKED = [{ k: "label", l: "지표명", t: "text", w: 2 }, { k: "unit", l: "단위", t: "text" }, { k: "status", l: "상태 표시", t: "sel", o: KPI_STATUS_AUTO },
  { k: "goal", l: "목표값", t: "num" }, { k: "lowerIsBetter", l: "낮을수록 좋은 지표", t: "chk" }, { k: "deltaLabel", l: "보조 설명 (비우면 자동)", t: "text", w: 2 }];
function kpiItemsHTML(path, items) {
  return `<div class="rows">${items.map((it, r) => {
    const p = `${path}.${r}`, on = !!it.src;
    return `<div class="icard"><div class="icard-h"><span>지표 ${r + 1}</span><span class="icard-act">${segHTML(p, on, "kpi")}${rowBtns(path, r)}</span></div>
      <div class="cgrid">${(on ? KPI_LINKED : ROWS.kpi.fields).map(f => fld(f, `${p}.${f.k}`, it[f.k])).join("")}</div>
      ${on ? `<div class="srcbox">${srcForm("kpi", `${p}.src`, it.src)}</div>` : ""}</div>`;
  }).join("")}</div><button type="button" class="btn sm" data-a="r-add" data-p="${path}" data-type="kpi">＋ 지표 추가</button>`;
}
function weBody(w, i) {
  const P = `widgets.${i}`;
  let h = "";
  const linkable = LINKABLE.includes(w.type);
  if (linkable) h += `<div class="seg-row"><span class="glbl">데이터 가져오기</span>${segHTML(P, !!w.src, w.type)}</div>`;
  const com = COMMON[w.type] || [];
  if (com.length) h += `<div class="cgrid">${com.map(([k, l, t, sp]) => fld({ k, l, t, w: sp }, `${P}.${k}`, w[k])).join("")}</div>`;
  if (w.type === "kpi") h += kpiItemsHTML(`${P}.items`, w.items || []);
  else if (linkable && w.src) h += `<div class="srcbox">${srcForm(w.type, `${P}.src`, w.src)}</div>`;
  else {
    if (ROWS[w.type]) h += rowsHTML(w.type, `${P}.${ROWS[w.type].path}`, w[ROWS[w.type].path] || []);
    if (w.type === "bar" || w.type === "line") h += gridHTML(w, i);
    if (w.type === "table") h += tableHTML(w, i);
  }
  if (w.type === "note" && !w.src) h += `<div class="cgrid">${fld({ l: "내용 (한 줄에 하나, ‘- ’로 시작하면 글머리표)", t: "lines", w: 4 }, `${P}.lines`, w.lines)}</div>
    <div class="migrate"><span>이 메모를 <b>${esc(memoDs()?.name || "메모")}</b> 데이터로 옮기면 한 줄이 기록 하나가 되고, 이후에는 카드에서 바로 입력할 수 있습니다.</span><button type="button" class="btn sm" data-a="note-migrate" data-i="${i}">메모 데이터로 옮기기</button></div>`;
  if (XW[w.type]?.editor) h += XW[w.type].editor(w, P, i);
  if (!TYPES[w.type]) h += `<div class="empty">이 위젯 형식은 화면 편집을 지원하지 않습니다. ‘코드’ 탭에서 수정하세요.</div>`;
  return h;
}
const weTitle = w => w.title || (w.type === "kpi" ? (w.items || []).map(x => x.label).join(", ") : "") || "(제목 없음)";
function weHTML(w, i, n) {
  const open = ed.open.has(i), t = TYPES[w.type] || { name: w.type };
  return `<div class="we ${open ? "open" : ""}" data-wi="${i}">
    <div class="we-head">
      <button type="button" class="we-tog" data-a="toggle" data-i="${i}" aria-expanded="${open}"><span class="car">${open ? "▾" : "▸"}</span><span class="we-type">${esc(t.name)}</span><span class="we-title">${esc(weTitle(w))}</span></button>
      ${w.type !== "kpi" ? `<select class="f sm" data-b="widgets.${i}.span" data-t="num" aria-label="가로 폭">${SPANS.map(([v, l]) => `<option value="${v}" ${(w.span || 6) == v ? "selected" : ""}>${l}</option>`).join("")}</select>` : ""}
      <button type="button" class="ib" data-a="w-up" data-i="${i}" title="위로 이동" ${i === 0 ? "disabled" : ""}>↑</button>
      <button type="button" class="ib" data-a="w-down" data-i="${i}" title="아래로 이동" ${i === n - 1 ? "disabled" : ""}>↓</button>
      <button type="button" class="ib del" data-a="w-del" data-i="${i}">삭제</button>
    </div>
    ${open ? `<div class="we-body">${weBody(w, i)}</div>` : ""}
  </div>`;
}
function guiHTML() {
  const d = ed.draft, ws = d.widgets || [];
  const groups = [...new Set(cfg.pages.map(p => p.group).filter(Boolean))];
  return `<div class="sec"><h5>페이지 정보</h5>
    <div class="cgrid">
      <label class="fld" style="grid-column:span 2"><span>페이지 제목</span><input class="f" data-b="title" data-t="text" value="${esc(d.title)}"></label>
      <label class="fld" style="grid-column:span 2"><span>메뉴 그룹 (기존 그룹 선택 또는 새로 입력)</span><input class="f" data-b="group" data-t="text" list="grpList" value="${esc(d.group)}"></label>
      <label class="fld" style="grid-column:span 4"><span>설명 (제목 아래 한 줄)</span><input class="f" data-b="desc" data-t="text" value="${esc(d.desc)}"></label>
    </div><datalist id="grpList">${groups.map(g => `<option value="${esc(g)}"></option>`).join("")}</datalist></div>
  <div class="sec"><h5>위젯 <span class="cnt">${ws.length}개 · 위에서부터 순서대로 배치됩니다</span></h5>
    <div class="wlist">${ws.map((w, i) => weHTML(w, i, ws.length)).join("") || `<div class="empty">아직 위젯이 없습니다. 아래에서 추가하세요.</div>`}</div></div>
  <div class="sec" id="addSec"><h5>위젯 추가 <span class="cnt">누르면 맨 아래에 추가되고 바로 편집할 수 있습니다</span></h5>
    <div class="addbar">${Object.entries(TYPES).map(([k, t]) => `<button type="button" class="addbtn" data-a="add-w" data-type="${k}">${wimg(k)}<span class="pal-t"><b>＋ ${t.name}</b><span>${t.desc}</span></span></button>`).join("")}</div></div>`;
}

/* ---------- 기록 입력 폼 ---------- */
function nextAuto(ds, f) {
  const pre = f.auto.replace("{YYYY}", TODAY().slice(0, 4)).replace("{YY}", TODAY().slice(2, 4));
  let mx = 0;
  (ds.records || []).forEach(r => { const v = String(r[f.key] || ""); if (v.startsWith(pre)) { const n = parseInt(v.slice(pre.length), 10); if (n > mx) mx = n; } });
  return pre + String(mx + 1).padStart(3, "0");
}
function newRecord(ds) {
  const r = {};
  dsFields(ds).forEach(f => {
    if (f.type === "text" && f.auto) r[f.key] = nextAuto(ds, f);
    else if (f.type === "date" && f.key === ds.dateField) r[f.key] = TODAY();
    else if (f.type === "select" && f.badge && f.options?.length) r[f.key] = f.options[0];
  });
  return r;
}
const GLYPH = { text: "Aa", longtext: "¶", number: "#", date: "▦", select: "◇", days: "Σ", file: "⎙", formula: "ƒ", rollup: "∑" };
const titleKeyOf = ds => { const F = ds?.fields || []; return ds?.titleField && F.some(f => f.key === ds.titleField) ? ds.titleField : (F.find(f => f.type === "text" && f.req && !f.auto) || F.find(f => f.type === "text" && !f.auto) || {}).key; };
const propRow = (label, glyph, inner, req, fk) => `<div class="prop">${fk ? `<button type="button" class="pk pk-btn" data-fk="${esc(fk)}" aria-haspopup="dialog" title="눌러서 항목 이름·형식 바꾸기">` : `<span class="pk">`}<i>${glyph}</i><span class="pk-l">${esc(label)}</span>${req ? `<b class="req" title="필수">*</b>` : ""}${fk ? "</button>" : "</span>"}<div class="pv">${inner}</div></div>`;
function recFormHTML() {
  const ds = dsById(ed.ds), r = ed.draft, F = dsFields(ds), tk = titleKeyOf(ds), rv = F.some(isCalcF) ? recView(ds, r) : r;
  const uniq = k => [...new Set((ds.records || []).map(x => x[k]).filter(v => !blank(v)))].slice(-80);
  const tf = fieldOf(ds, tk);
  const props = F.filter(f => f.key !== tk && f.type !== "longtext").map(f => {
    if (f.type === "file") return propRow(f.label, GLYPH.file, filesHTML(f, r[f.key]), f.req, f.key);
    if (isCalcF(f)) return propRow(f.label, fGlyph(f), calcCellHTML(ds, f, rv), false, f.key);
    if (f.type === "days") { const v = daysBetween(dateAt(r, f.from), dateAt(r, f.to)); return propRow(f.label, GLYPH.days, `<div class="f ro" data-days="${esc(f.key)}">${blank(v) ? "자동 계산" : v + "일"}</div>`, false, f.key); }
    if (isPickF(f)) { const linkV = f.refType ? vals(r[f.key]).filter(v => relTarget(f.ref, v)) : [];
      return propRow(f.label, f.refType ? "↗" : GLYPH.select, linkV.length ? `<div class="rel-row">${tagSelHTML(f, r[f.key])}<span class="rel-links">${linkV.map(v => `<button type="button" class="rel-open" data-rel-ds="${esc(f.ref)}" data-rel-v="${esc(v)}" title="${esc(dsById(f.ref)?.name || "")}의 ‘${esc(v)}’ 페이지 열기">↗ ${linkV.length > 1 ? esc(v) : "열기"}</button>`).join("")}</span></div>` : tagSelHTML(f, r[f.key]), f.req, f.key); }
    if (f.refType) {
      const dl = `dl-ref-${f.key}`, m = dsById(f.ref);
      return propRow(f.label, "↗", inp({ t: "text", dl }, f.key, r[f.key]).replace("<input ", `<input placeholder="${esc(m?.name || "목록")}에서 고르거나 새로 입력" `)
        + `<datalist id="${dl}">${f.options.map(v => `<option value="${esc(v)}"></option>`).join("")}</datalist>`, f.req, f.key);
    }
    const t = { number: "num", date: "date", select: "sel" }[f.type] || "text";
    const o = f.type === "select" ? [["", "비어 있음"], ...(f.options || []).map(x => [x, x])] : undefined;
    const dl = f.type === "text" && !f.auto ? `dl-rec-${f.key}` : undefined;
    return propRow(f.label, GLYPH[f.type] || "Aa", inp({ t, o, dl }, f.key, r[f.key]) + (dl ? `<datalist id="${dl}">${uniq(f.key).map(v => `<option value="${esc(v)}"></option>`).join("")}</datalist>` : ""), f.req, f.key);
  }).join("");
  const texts = F.filter(f => f.type === "longtext" && f.key !== tk).map(f => `<button type="button" class="mp-textlbl pk-btn" data-fk="${esc(f.key)}" aria-haspopup="dialog" title="눌러서 항목 이름·형식 바꾸기"><span class="pk-l">${esc(f.label)}</span></button><textarea class="mp-text" data-b="${esc(f.key)}" data-t="text" placeholder="${esc(f.label)}을(를) 입력하세요">${esc(r[f.key])}</textarea>`).join("");
  return `<div class="mp-doc">
    ${tf ? `<input class="mp-title" data-b="${esc(tk)}" data-t="text" placeholder="${esc(tf.label)} (제목 없음)" value="${esc(r[tk])}" aria-label="${esc(tf.label)}" ${tf.refType ? `list="dl-title-ref"` : ""}>${tf.refType ? `<datalist id="dl-title-ref">${tf.options.map(v => `<option value="${esc(v)}"></option>`).join("")}</datalist>` : ""}` : `<div class="mp-h">${ed.isNew ? "새 기록" : "기록"}</div>`}
    <div class="props">${props}<button type="button" class="pk-add" data-pp-add="1">＋ 항목 추가</button></div>
    ${ed.isNew ? "" : backlinksHTML(ds, r)}
    ${texts ? `<hr class="mp-sep">${texts}` : ""}
    ${ed.isNew ? "" : commentsHTML(ds, r)}
    <p class="mp-note">${ds.master ? `이 목록을 고쳐 저장하면 이를 참조하는 데이터의 선택지가 바로 바뀝니다. 이름을 바꾸면 기존 기록의 값도 함께 바뀝니다.` : `저장하면 이 데이터를 쓰는 대시보드 위젯 ${usageOf(ds.id)}개가 바로 다시 계산됩니다.`}${F.some(f => f.req) ? " * 표시는 필수 항목입니다." : ""}${F.some(f => f.refType) ? " ↗ 표시 항목은 다른 데이터의 목록에서 고르며, 목록에 없는 값은 저장할 때 그 목록에 추가됩니다." : ""}</p>
  </div>`;
}
/* ---------- 목록 열 너비: 머리글 오른쪽 가장자리를 끌어 조절, 데이터 파일(colW)에 저장 ---------- */
const COLW_MIN = 56, COLW_MAX = 900, COLW_EXTRA = 90, COLW_ADD = 40;
function colWidths(ds, F, hasExtra) {
  const W = ds.colW; if (!W || !F.length || !F.every(f => W[f.key])) return null;
  const w = Object.fromEntries(F.map(f => [f.key, W[f.key]]));
  return { w, total: F.reduce((n, f) => n + w[f.key], 0) + (hasExtra ? COLW_EXTRA : 0) + COLW_ADD };
}
/* 처음 조절할 때 지금 보이는 너비를 모든 열에 굳혀 둠 (그다음부터는 끈 만큼 정확히) */
function freezeColW(table, ds) {
  const ths = [...table.querySelectorAll("thead th[data-fdrag]")];
  ds.colW ||= {};
  ths.forEach(th => { const k = th.dataset.fdrag; if (!ds.colW[k]) ds.colW[k] = Math.round(Math.max(COLW_MIN, Math.min(COLW_MAX, Math.max(th.getBoundingClientRect().width, (th.querySelector(".th-btn")?.scrollWidth || 0) + 22))));   /* 머리글 이름은 다 보이게 */ });
  if (!table.classList.contains("fixed")) {
    const extra = table.querySelectorAll("thead th").length - ths.length - 1;
    table.insertAdjacentHTML("afterbegin", `<colgroup>${ths.map(th => `<col style="width:${ds.colW[th.dataset.fdrag]}px">`).join("")}${extra > 0 ? `<col style="width:${COLW_EXTRA}px">` : ""}<col style="width:${COLW_ADD}px"></colgroup>`);
    table.classList.add("fixed");
  }
  const sum = () => [...table.querySelectorAll("colgroup col")].reduce((n, c) => n + parseFloat(c.style.width), 0);
  table.style.width = sum() + "px";
  return sum;
}
let colRs = null;
document.addEventListener("dragstart", e => { if (e.target.closest?.(".col-rs") || colRs) e.preventDefault(); }, true);
document.addEventListener("pointerdown", e => {
  const h = e.target.closest?.("#board .col-rs"); if (!h || e.button !== 0) return;
  const ds = currentDs(); if (!ds) return;
  e.preventDefault(); e.stopPropagation();
  const table = h.closest("table"), th = h.closest("th"), key = h.dataset.colrs;
  const sum = freezeColW(table, ds);
  const idx = [...table.querySelectorAll("thead th")].indexOf(th), col = table.querySelectorAll("colgroup col")[idx];
  const startX = e.clientX, startW = ds.colW[key];
  colRs = { key, w: startW }; h.classList.add("on"); document.body.classList.add("col-resizing");
  h.setPointerCapture(e.pointerId);
  const move = ev => {
    colRs.w = Math.round(Math.max(COLW_MIN, Math.min(COLW_MAX, startW + ev.clientX - startX)));
    col.style.width = colRs.w + "px"; table.style.width = sum() + "px";
  };
  const up = () => {
    h.removeEventListener("pointermove", move); h.removeEventListener("pointerup", up); h.removeEventListener("pointercancel", up);
    h.classList.remove("on"); document.body.classList.remove("col-resizing");
    const w = colRs.w; colRs = null;
    ds.colW[key] = w; persist(); render();
  };
  h.addEventListener("pointermove", move); h.addEventListener("pointerup", up); h.addEventListener("pointercancel", up);
}, true);
/* 두 번 누르면 그 열 내용에 맞춤 */
document.addEventListener("dblclick", e => {
  const h = e.target.closest?.("#board .col-rs"); if (!h) return;
  const ds = currentDs(); if (!ds) return;
  e.preventDefault(); e.stopPropagation();
  const table = h.closest("table"), th = h.closest("th"), key = h.dataset.colrs;
  freezeColW(table, ds);
  const idx = [...th.parentElement.children].indexOf(th);
  const cells = [th, ...[...table.querySelectorAll("tbody tr")].map(tr => tr.children[idx]).filter(Boolean)];
  const need = Math.max(...cells.map(c => { const k = c.querySelector(".th-btn") || c; return (k === c ? c.scrollWidth : k.scrollWidth + 24) + 2; }));
  ds.colW[key] = Math.round(Math.max(COLW_MIN, Math.min(COLW_MAX, need)));
  persist(); render();
  toast(`‘${dsFields(ds).find(f => f.key === key)?.label || ""}’ 열을 내용에 맞췄습니다.`);
}, true);
/* ---------- 목록·표에서 칸 바로 고치기 ---------- */
function startCellEdit(td) {
  const ds = td.dataset.ceDs ? dsById(td.dataset.ceDs) : currentDs(), key = td.dataset.ce, rid = td.dataset.ceId;
  const rec = (ds?.records || []).find(r => r.id === rid), f = ds && dsFields(ds).find(x => x.key === key);
  if (!rec || !f) return;
  const long = f.type === "longtext", el = document.createElement(long ? "textarea" : "input");
  if (!long) { el.type = f.type === "date" ? "date" : "text"; if (f.type === "number") el.inputMode = "decimal"; }
  el.className = "ce-in"; el.value = blank(rec[key]) ? "" : String(rec[key]); el.setAttribute("aria-label", f.label);
  td.classList.add("editing"); td.appendChild(el);      /* 원래 글자는 그대로 두고 위에 겹쳐 입력 → 칸 크기가 바뀌지 않음 */
  if (long) el.rows = Math.min(8, Math.max(2, el.value.split("\n").length));
  el.focus(); if (el.select && f.type !== "date") el.select();
  let done = false;
  const tr = td.closest("tr"), order = [...tr.querySelectorAll("td[data-ce]")].map(x => x.dataset.ce), dsId = td.dataset.ceDs || "";
  const finish = (save, move) => {
    if (done) return; done = true;
    if (save) commitCell(ds, rid, f, el.value); else render();
    if (move) {                                   /* Tab: 같은 줄의 다음(또는 이전) 칸으로 */
      const k = order[order.indexOf(key) + move];
      const nx = k && document.querySelector(`td[data-ce="${CSS.escape(k)}"][data-ce-id="${CSS.escape(rid)}"]${dsId ? `[data-ce-ds="${CSS.escape(dsId)}"]` : ":not([data-ce-ds])"}`);
      if (nx) startCellEdit(nx);
    }
  };
  el.addEventListener("keydown", ev => {
    ev.stopPropagation();
    if (ev.isComposing || ev.keyCode === 229) return;              /* 한글 조합 중에는 기다림 */
    if (ev.key === "Escape") { ev.preventDefault(); finish(false); }
    else if (ev.key === "Enter" && !(long && ev.shiftKey)) { ev.preventDefault(); finish(true); }
    else if (ev.key === "Tab") { ev.preventDefault(); finish(true, ev.shiftKey ? -1 : 1); }
  });
  el.addEventListener("click", ev => ev.stopPropagation());
  el.addEventListener("blur", () => finish(true));
}
function commitCell(ds, rid, f, raw) {
  const rec = (ds.records || []).find(r => r.id === rid); if (!rec) return render();
  let v = typeof raw === "string" && f.type !== "longtext" ? raw.trim() : raw;
  if (f.type === "number" && v !== "") { const n = Number(String(v).replace(/[,\s]/g, "")); if (isNaN(n)) { render(); toast(`‘${f.label}’에는 숫자를 입력하세요.`); return; } v = n; }
  const old = rec[f.key];
  if (String(old ?? "") === String(v ?? "")) return render();
  if (f.req && blank(v)) { render(); toast(`‘${f.label}’은(는) 필수 항목이라 비울 수 없습니다.`); return; }
  const snap = JSON.stringify(cfg);
  rec[f.key] = v;
  let extra = "";
  const referenced = (cfg.datasets || []).some(d2 => (d2.fields || []).some(x => x.type === "ref" && x.ref === ds.id));
  if (referenced && f.key === titleKeyOf(ds) && !blank(old) && !blank(v)) {      /* 다른 데이터가 골라 쓰는 이름을 바꾸면 쓰는 기록도 함께 */
    let n = 0;
    (cfg.datasets || []).forEach(d2 => (d2.fields || []).filter(x => x.type === "ref" && x.ref === ds.id).forEach(x => { (d2.records || []).forEach(r => { if (swapVal(r, x.key, old, v)) n++; }); fixFilters(d2.id, x.key, old, v); }));
    if (ds.colors?.[old]) { ds.colors[v] = ds.colors[old]; delete ds.colors[old]; }
    if (n) extra = ` · 기존 기록 ${n}건도 함께 바꿈`;
  }
  persist(); render();
  const show = x => blank(x) ? "비어 있음" : String(x).length > 24 ? String(x).slice(0, 24) + "…" : String(x);
  toast(`${f.label}: ‘${show(old)}’ → ‘${show(v)}’${extra}`, () => { cfg = JSON.parse(snap); persist(); render(); toast("되돌렸습니다."); });
}
document.addEventListener("click", e => {
  const td = e.target.closest?.("#board td[data-ce]");
  if (!td || td.classList.contains("editing") || e.target.closest(".row-open") || lay.on || ed.mode) return;
  e.preventDefault(); e.stopPropagation();
  startCellEdit(td);
}, true);
/* ---------- 관계 (노션처럼): 관계 값 → 그 기록 열기, 기록 → 이 기록을 고른 다른 데이터베이스의 기록들 ---------- */
const relTarget = (dsId, v) => { const d = dsById(dsId); if (!d || blank(v)) return null; const tk = titleKeyOf(d); return (d.records || []).find(r => String(r[tk]) === String(v)) || null; };
function backlinksOf(ds, rec) {
  const tk = titleKeyOf(ds), saved = (ds.records || []).find(x => x.id === rec.id), name = saved?.[tk] ?? rec[tk];
  if (blank(name)) return [];
  return (cfg.datasets || []).flatMap(d2 => (d2.fields || []).filter(f => f.type === "ref" && f.ref === ds.id).map(f => {
    const tk2 = titleKeyOf(d2), df = d2.dateField, badge = (d2.fields || []).find(x => x.badge);
    const hits = (d2.records || []).filter(r => hasVal(r[f.key], name)).sort((a, b) => -cmp(a[df], b[df]));
    return { d2, f, name, hits, tk2, df, badge };
  })).filter(g => g.hits.length);
}
function backlinksHTML(ds, rec) {
  const G = backlinksOf(ds, rec); if (!G.length) return "";
  return `<hr class="mp-sep"><div class="bl"><div class="mp-textlbl">연결된 기록 <span class="bl-n">이 항목을 고른 다른 데이터베이스의 기록</span></div>
    ${G.map(g => `<div class="bl-g"><div class="bl-h"><span class="db-ic sm" aria-hidden="true">▦</span><b>${esc(g.d2.name)}</b><span class="bl-n">· ${esc(g.f.label)} · ${g.hits.length}건</span>
      <button type="button" class="bl-all" data-rel-all="${esc(g.d2.id)}" data-rel-q="${esc(g.name)}">모두 보기 ›</button></div>
      ${g.hits.slice(0, 5).map(r => `<button type="button" class="bl-i" data-rel-rec="${esc(g.d2.id)}" data-rel-id="${esc(r.id)}"><span class="bl-t">${esc(r[g.tk2] || "(제목 없음)")}</span><span class="bl-m">${g.badge ? chipFor(dsFields(g.d2).find(x => x.key === g.badge.key), r[g.badge.key]) : ""}${g.df ? `<span class="mono">${esc(r[g.df] || "")}</span>` : ""}</span></button>`).join("")}
      ${g.hits.length > 5 ? `<div class="bl-more">외 ${g.hits.length - 5}건</div>` : ""}</div>`).join("")}</div>`;
}
/* 팝업 안에서 관계로 이동: 저장 안 된 변경이 있으면 막고, ‘← 이전’으로 돌아올 수 있게 기록 */
function relGo(dsId, rid) {
  const ds = dsById(dsId); if (!ds || !rid) return;
  if (ed.mode === "record" && ed.dirty) { msg("저장하지 않은 변경이 있습니다. 먼저 저장하거나 취소하세요.", false); return; }
  const back = ed.mode === "record" && !ed.isNew ? [...(ed.hist || []), { ds: ed.ds, rid: ed.draft.id }] : [];
  openRecord(ds, rid); ed.hist = back; renderDrawer();
}
document.addEventListener("click", e => {
  const o = e.target.closest?.("[data-rel-ds]");
  if (o) { e.preventDefault(); e.stopPropagation(); const t = relTarget(o.dataset.relDs, o.dataset.relV); if (t) relGo(o.dataset.relDs, t.id); return; }
  const r = e.target.closest?.("[data-rel-rec]");
  if (r) { e.preventDefault(); e.stopPropagation(); relGo(r.dataset.relRec, r.dataset.relId); return; }
  const a = e.target.closest?.("[data-rel-all]");
  if (a) { e.preventDefault(); e.stopPropagation(); if (ed.mode === "record" && ed.dirty) { msg("저장하지 않은 변경이 있습니다. 먼저 저장하거나 취소하세요.", false); return; }
    const id = a.dataset.relAll, v = a.dataset.relQ; closeDrawer(true); location.hash = "data-" + id; setTimeout(() => { dv.q = v; dv.limit = 50; const d = dsById(id); if (d) renderDataView(d); }, 0); return; }
  const b = e.target.closest?.('[data-a="rel-back"]');
  if (b) { e.preventDefault(); e.stopPropagation(); if (ed.dirty) { msg("저장하지 않은 변경이 있습니다. 먼저 저장하거나 취소하세요.", false); return; }
    const h = [...(ed.hist || [])], last = h.pop(); if (last?.drill) { openDrill(last.drill); return; }
    const ds = last && dsById(last.ds); if (!ds) return; openRecord(ds, last.rid); ed.hist = h; renderDrawer(); }
}, true);
/* ---------- 노션식 분류 선택: 고르기·검색·바로 만들기·이름/색 변경·삭제 ----------
   선택 목록, 목록 참조(기준 정보), 상태, 메뉴 그룹이 같은 선택기를 씁니다. */
const emptyChip = `<span class="tag-empty">비어 있음</span>`;
const tagSelHTML = (f, v) => `<div class="tagsel" role="button" tabindex="0" aria-haspopup="listbox" data-tag-key="${esc(f.key)}" title="눌러서 고르기 · 새로 만들기">${chipFor(f, v) || emptyChip}</div>`;
const groupSelHTML = (where, v) => `<div class="tagsel" role="button" tabindex="0" aria-haspopup="listbox" data-group="${where}" title="눌러서 고르기 · 새로 만들기">${blank(v) ? emptyChip : `<span class="tag c-gray">${esc(v)}</span>`}</div>`;
const autoColorFor = n => PALETTE_AUTO[n % PALETTE_AUTO.length];
/* 데이터 필드용 공급자 */
function fieldProv(dsId, key, get, set) {
  const ds = () => dsById(dsId), raw = () => (ds()?.fields || []).find(f => f.key === key), mf = () => dsFields(ds()).find(f => f.key === key);
  const master = () => raw()?.type === "ref" ? dsById(raw().ref) : null;
  const holders = () => master() ? (cfg.datasets || []).flatMap(d2 => (d2.fields || []).filter(f => f.type === "ref" && f.ref === master().id).map(f => [d2, f.key])) : [[ds(), key]];
  const count = v => holders().reduce((n, [d2, k]) => n + (d2.records || []).filter(r => hasVal(r[k], v)).length, 0);
  const colorBag = () => master() || raw();
  return {
    title: mf()?.label || "", get, set,
    options: () => mf()?.options || [],
    chip: v => chipFor(mf(), v),
    colorOf: v => tagColor(mf(), v),
    canColor: true, canRename: true, canDelete: true, multi: raw()?.type === "ref" && !raw()?.single,
    source: () => master() ? `${master().name} 목록` : "",
    locked: v => raw()?.badge && DONE.includes(v) ? "완료 계산에 쓰이는 상태라 이름을 바꾸거나 지울 수 없습니다. 색만 바꿀 수 있습니다." : "",
    usage: v => `이 값을 쓰는 기록 ${count(v)}건`,
    create(v) {
      const m = master();
      if (m) (m.records ||= []).push({ id: newId(), [titleKeyOf(m)]: v });
      else { const f = raw(); f.options = [...(f.options || []), v]; (f.colors ||= {})[v] = autoColorFor(f.options.length - 1); }
      if (m) (m.colors ||= {})[v] ||= autoColorFor(masterValues(m.id).length - 1);
    },
    rename(from, to) {
      const m = master(), f = raw(), bag = colorBag();
      if (m) { const tk = titleKeyOf(m); (m.records || []).forEach(r => { if (r[tk] === from) r[tk] = to; }); }
      else f.options = (f.options || []).map(x => x === from ? to : x);
      if (bag.colors?.[from]) { bag.colors[to] = bag.colors[from]; delete bag.colors[from]; }
      let n = 0;
      holders().forEach(([d2, k]) => { (d2.records || []).forEach(r => { if (swapVal(r, k, from, to)) n++; }); fixFilters(d2.id, k, from, to); });
      return n;
    },
    remove(v) {
      const m = master(), f = raw(), bag = colorBag();
      if (m) { const tk = titleKeyOf(m); m.records = (m.records || []).filter(r => r[tk] !== v); }
      else f.options = (f.options || []).filter(x => x !== v);
      if (bag.colors) delete bag.colors[v];
      let n = 0;
      holders().forEach(([d2, k]) => (d2.records || []).forEach(r => { if (swapVal(r, k, v, "")) n++; }));
      return n;
    },
    color(v, c) { (colorBag().colors ||= {})[v] = c; }
  };
}
/* 메뉴 그룹용 공급자 */
function groupProv(get, set) {
  const groups = () => [...new Set(cfg.pages.map(p => p.group || "기타"))];
  return {
    title: "메뉴 그룹", get, set, options: groups,
    chip: v => blank(v) ? "" : `<span class="tag c-gray">${esc(v)}</span>`, colorOf: () => "gray",
    canColor: false, canRename: true, canDelete: false, source: () => "", locked: () => "",
    usage: v => `이 그룹의 페이지 ${cfg.pages.filter(p => (p.group || "기타") === v).length}개`,
    create() {},
    rename(from, to) {
      let n = 0;
      cfg.pages.forEach(p => { if ((p.group || "기타") === from) { p.group = to; n++; } });
      if (lay.on && lay.draft.group === from) lay.draft.group = to;
      cfg.navOrder = (cfg.navOrder || []).map(k => k === "g:" + from ? "g:" + to : k);
      if (navFold.delete("g:" + from)) { navFold.add("g:" + to); saveFold(); }
      return n;
    }
  };
}
function provFor(el) {
  if (el.dataset.group === "create" && ed.mode === "create") return groupProv(() => ed.draft.group, v => { ed.draft.group = v; ed.dirty = true; });
  if (el.dataset.group === "lay" && lay.on) return groupProv(() => lay.draft.group, v => { lay.draft.group = v; $("#pMeta").textContent = [v, periodText()].filter(Boolean).join(" · "); });
  if (el.dataset.dvId) {
    const ds = el.dataset.dvDs ? dsById(el.dataset.dvDs) : currentDs(), id = el.dataset.dvId, key = el.dataset.dvKey; if (!ds) return null;
    const rec = () => (ds.records || []).find(r => r.id === id);
    /* 목록·표에서 바로 고칠 때: 고르는 동안은 저장만 하고 그 칸만 바꿈 → 창을 닫을 때 화면 전체를 다시 그리고 알림 한 번 */
    return { ...fieldProv(ds.id, key, () => rec()?.[key], v => { const r = rec(); if (r) { r[key] = v;                 /* 고르는 동안은 파일에 쓰지 않음 */
      tp.after = () => { persist(); render(); toast(`${dsFields(ds).find(f => f.key === key)?.label || ""}을(를) ‘${valText(rec()?.[key]) || "비어 있음"}’(으)로 바꿨습니다.`); }; } }),
      sel: `.tagsel[data-dv-id="${CSS.escape(id)}"][data-dv-key="${CSS.escape(key)}"]`, keepAnchor: false };
  }
  if (el.dataset.tagKey && ed.mode === "fields") { const k = el.dataset.tagKey; return { ...fieldProv(ed.ds, k, () => "", () => {}), keepAnchor: true, sel: `#drawer .tagsel[data-tag-key="${CSS.escape(k)}"]` }; }
  if (el.dataset.tagKey && ed.mode === "record") { const k = el.dataset.tagKey; return { ...fieldProv(ed.ds, k, () => ed.draft[k], v => { ed.draft[k] = v; ed.dirty = true; }), sel: `#drawer .tagsel[data-tag-key="${CSS.escape(k)}"]` }; }
  return null;
}
const tp = { anchor: null, prov: null, q: "", edit: null, act: 0, items: [] };
function closeTagPop() { $("#tagpop")?.remove(); tp.anchor = null; tp.prov = null; tp.placed = false; const f = tp.after; tp.after = null; if (f) f(); }
function tpAnchor() { if (tp.anchor && !tp.anchor.isConnected && tp.prov?.sel) tp.anchor = document.querySelector(tp.prov.sel); return tp.anchor; }
function refreshAnchor() { const a = tpAnchor(); if (a && tp.prov && !tp.prov.keepAnchor) a.innerHTML = tp.prov.chip(tp.prov.get()) || (a.classList.contains("cell") ? `<span class="tag-empty">—</span>` : emptyChip); }
function openTagPop(anchor, prov) {
  closeTagPop();
  Object.assign(tp, { anchor, prov, q: "", edit: null, act: 0 });
  const pop = document.createElement("div"); pop.id = "tagpop"; pop.className = "tagpop"; pop.setAttribute("role", "dialog"); pop.setAttribute("aria-label", `${prov.title} 선택`);
  document.body.appendChild(pop);
  pop.addEventListener("click", tagPopClick); pop.addEventListener("input", tagPopInput); pop.addEventListener("keydown", tagPopKey);
  renderTagPop(); $("#tpQ")?.focus();
}
/* 처음 열 때만 선택 칸에 맞춰 놓고, 그 뒤로는 자리를 고정 (값이 늘어 칸이 커져도 목록이 움직이지 않게) */
function placeTagPop(force) {
  const p = $("#tagpop"), a = tpAnchor(); if (!p || !a) return;
  if (tp.placed && !force) {                                   /* 화면 밖으로만 안 나가게 */
    const top = parseFloat(p.style.top) || 8; if (top + p.offsetHeight > innerHeight - 8) p.style.top = Math.max(8, innerHeight - p.offsetHeight - 8) + "px"; return;
  }
  tp.placed = true;
  const r = a.getBoundingClientRect();
  p.style.width = Math.max(280, Math.min(420, r.width)) + "px";
  p.style.left = Math.max(8, Math.min(innerWidth - p.offsetWidth - 8, r.left)) + "px";
  p.style.top = (r.bottom + p.offsetHeight + 8 > innerHeight ? Math.max(8, r.top - p.offsetHeight - 4) : r.bottom + 4) + "px";
}
function renderTagPop(keepFocus) {
  const P = tp.prov, p = $("#tagpop"); if (!P || !p) return;
  const cur = P.get();
  if (tp.edit !== null) {
    const o = tp.edit, lock = P.locked(o);
    p.innerHTML = `<div class="tp-head"><button type="button" class="ib" data-tp="back" aria-label="뒤로">←</button><span>${esc(P.title)} 옵션 편집</span></div>
      ${lock ? `<div class="tp-lock">${esc(lock)}</div><div class="tp-cur">${P.chip(o)}</div>` : P.canRename ? `<input class="f" id="tpRename" value="${esc(o)}" aria-label="옵션 이름">` : ""}
      ${P.canColor ? `<div class="tp-sec">색상</div><div class="tp-list">${PALETTE.map(([c, n]) => `<button type="button" class="tp-row" data-color="${c}"><span class="tag c-${c}">${n}</span>${P.colorOf(o) === c ? `<b class="tp-check" aria-label="선택됨">✓</b>` : ""}</button>`).join("")}</div>` : ""}
      <div class="tp-foot"><span class="tp-hint">${esc(P.usage(o))}${P.source() ? ` · ${esc(P.source())}` : ""}</span>${P.canDelete && !lock ? `<button type="button" class="btn sm danger" data-tp="del">옵션 삭제</button>` : ""}</div>`;
    placeTagPop(); return;
  }
  const q = tp.q.trim(), all = P.options(), multi = !!P.multi, curV = vals(cur), isOn = o => multi ? curV.includes(o) : o === cur;
  const opts = all.filter(o => !q || o.toLowerCase().includes(q.toLowerCase()));
  tp.items = [...opts.map(o => ({ pick: o })), ...(q && !all.includes(q) ? [{ create: q }] : [])];
  tp.act = Math.max(0, Math.min(tp.act, tp.items.length - 1));
  const secHTML = q && !all.includes(q) ? `Enter를 누르면 ‘${esc(q)}’을(를) 새로 만듭니다${P.source() ? ` (${esc(P.source())}에 추가)` : ""}` : `${esc(P.title)} 고르기${P.source() ? ` · ${esc(P.source())}` : ""}`;
  const listHTML = tp.items.map((it, i) => it.pick !== undefined
      ? `<div class="tp-row${i === tp.act ? " act" : ""}" role="option" aria-selected="${isOn(it.pick)}" data-pick="${esc(it.pick)}">${P.chip(it.pick)}${multi && isOn(it.pick) ? `<b class="tp-check tp-on" aria-label="고름">✓</b>` : ""}<button type="button" class="tp-more" data-edit="${esc(it.pick)}" aria-label="${esc(it.pick)} 편집" title="이름·색 변경, 삭제">⋯</button></div>`
      : `<div class="tp-row${i === tp.act ? " act" : ""}" role="option" data-create="1"><span class="tp-mk">만들기</span><span class="tag c-${P.canColor ? autoColorFor(all.length) : "gray"}">${esc(it.create)}</span></div>`).join("") || `<div class="tp-none">아직 옵션이 없습니다. 입력해서 만드세요.</div>`;
  if (keepFocus === "list" && $("#tpQ") && p.querySelector(".tp-list")) {     /* 검색창은 그대로 (한글 조합 유지) */
    p.querySelector(".tp-sec").innerHTML = secHTML; p.querySelector(".tp-list").innerHTML = listHTML; placeTagPop(); return;
  }
  const caret = keepFocus ? $("#tpQ")?.selectionStart : null;
  const top = multi ? curV.map(v => `<span class="tp-curchip">${P.chip(v)}<button type="button" class="tag-x" data-tp-un="${esc(v)}" aria-label="${esc(v)} 빼기">×</button></span>`).join("")
    : blank(cur) ? "" : `<span class="tp-curchip">${P.chip(cur)}<button type="button" class="tag-x" data-tp="clear" aria-label="선택 해제">×</button></span>`;
  p.innerHTML = `<div class="tp-top">${top}<input class="tp-q" id="tpQ" placeholder="${!curV.length ? (multi ? "검색 · 여러 개 고를 수 있음" : "검색 또는 새로 만들기") : multi ? "더 고르기…" : ""}" value="${esc(tp.q)}" aria-label="${esc(P.title)} 검색 또는 새로 만들기" autocomplete="off"></div>
    <div class="tp-sec">${secHTML}</div>
    <div class="tp-list" role="listbox">${listHTML}</div>`;
  placeTagPop();
  if (keepFocus) { const i = $("#tpQ"); i.focus(); if (caret !== null) i.setSelectionRange(caret, caret); }
}
function pickTag(v) {
  const P = tp.prov, a = tpAnchor();
  if (P.multi) {                                           /* 여러 개: 누를 때마다 넣고/빼고, 창은 열어 둠 */
    const cur = vals(P.get()); P.set(normVals(cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v])); refreshAnchor();
    tp.q = ""; renderTagPop(true); placeTagPop(); return;
  }
  P.set(v); refreshAnchor(); closeTagPop(); if (ed.mode === "fields") { persist(); render(); renderDrawer(true); } (tpAnchor() || a)?.focus?.(); }
function fixFilters(dsId, key, from, to) {
  const fix = src => { if (src?.ds === dsId) (src.filter || []).forEach(c => { if (c.f === key && c.v === from) c.v = to; }); };
  const each = pages => (pages || []).forEach(pg => (pg.widgets || []).forEach(w => { fix(w.src); (w.items || []).forEach(k => fix(k.src)); }));
  each(cfg.pages); if (lay.on) each([lay.draft]);
}
function afterSchemaChange() { persist(); render(); if (ed.mode === "fields") renderDrawer(true); refreshAnchor(); }   /* 뒤쪽 화면을 다시 그리고, 열린 팝업의 선택 칸만 갱신 */
function tagPopClick(e) {
  const P = tp.prov; if (!P) return;
  const t = e.target;
  const edit = t.closest("[data-edit]"); if (edit) { tp.edit = edit.dataset.edit; renderTagPop(); $("#tpRename")?.focus(); return; }
  const pk = t.closest("[data-pick]"); if (pk) return pickTag(pk.dataset.pick);
  if (t.closest("[data-create]")) {
    const v = tp.q.trim(); if (!v) return;
    P.create(v); if (P.canColor) persist();
    toast(`‘${v}’을(를) 만들었습니다.${P.source() ? ` ${P.source()}에도 추가했습니다.` : ""}`); return pickTag(v);
  }
  const col = t.closest("[data-color]"); if (col) { P.color(tp.edit, col.dataset.color); afterSchemaChange(); renderTagPop(); return; }
  const a = t.closest("[data-tp]")?.dataset.tp;
  if (a === "back") { tp.edit = null; renderTagPop(); $("#tpQ")?.focus(); }
  if (a === "clear") { P.set(""); refreshAnchor(); renderTagPop(); $("#tpQ")?.focus(); }
  const un = t.closest("[data-tp-un]"); if (un) { P.set(normVals(vals(P.get()).filter(x => x !== un.dataset.tpUn))); refreshAnchor(); renderTagPop(true); return; }
  if (a === "del") {
    const btn = t.closest("[data-tp]"); if (!arm(btn, "한 번 더 누르면 삭제")) return;
    const o = tp.edit, wasCur = hasVal(P.get(), o), n = P.remove(o);
    if (wasCur && !P.sel?.includes("data-dv")) P.set(normVals(vals(P.get()).filter(x => x !== o)));
    tp.edit = null; afterSchemaChange(); renderTagPop();
    toast(`‘${o}’을(를) 삭제했습니다.${n ? ` 기록 ${n}건에서 이 값을 비웠습니다.` : ""}`);
  }
}
function renameTag() {
  const P = tp.prov, el = $("#tpRename"); if (!P || !el) return;
  const from = tp.edit, to = el.value.trim();
  if (!to || to === from) return;
  if (P.options().includes(to)) { el.setCustomValidity("같은 이름이 이미 있습니다"); el.reportValidity(); return; }
  const wasCur = hasVal(P.get(), from), n = P.rename(from, to);
  if (wasCur) P.set(normVals(vals(P.get()).map(x => x === from ? to : x)));
  tp.edit = to; afterSchemaChange();
  toast(`‘${from}’을(를) ‘${to}’(으)로 바꿨습니다.${n ? ` ${P.title === "메뉴 그룹" ? `페이지 ${n}개` : `기록 ${n}건`}에도 반영했습니다.` : ""}`);
}
function tagPopInput(e) { if (e.target.id === "tpQ") { tp.q = e.target.value; tp.act = 0; renderTagPop("list"); } if (e.target.id === "tpRename") e.target.setCustomValidity(""); }
const composing = e => e.isComposing || e.keyCode === 229;
function tagPopKey(e) {
  e.stopPropagation();
  if (composing(e)) return;
  if (e.key === "Escape") { e.preventDefault(); if (tp.edit !== null) { renameTag(); tp.edit = null; renderTagPop(); $("#tpQ")?.focus(); } else { const a = tpAnchor(); closeTagPop(); a?.focus(); } return; }
  if (e.target.id === "tpRename" && e.key === "Enter") { e.preventDefault(); renameTag(); return; }
  if (e.target.id !== "tpQ") return;
  if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); tp.act = (tp.act + (e.key === "ArrowDown" ? 1 : -1) + tp.items.length) % Math.max(1, tp.items.length); renderTagPop("list"); }
  if (e.key === "Enter") { e.preventDefault(); const it = tp.items[tp.act]; if (it?.pick !== undefined) pickTag(it.pick); else if (it?.create) $("#tagpop [data-create]").click(); }
  if (e.key === "Backspace" && !e.target.value && vals(tp.prov.get()).length) { tp.prov.set(tp.prov.multi ? normVals(vals(tp.prov.get()).slice(0, -1)) : ""); refreshAnchor(); renderTagPop(true); }
}
document.addEventListener("click", e => {
  const ts = e.target.closest?.(".tagsel"); if (!ts) return;
  e.preventDefault(); e.stopPropagation();
  if ($("#tagpop") && tpAnchor() === ts) { if (tp.prov?.multi) { $("#tpQ")?.focus(); return; } closeTagPop(); return; }
  const P = provFor(ts); if (P) openTagPop(ts, P);
}, true);
document.addEventListener("keydown", e => { const ts = e.target.closest?.(".tagsel"); if (ts && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) { e.preventDefault(); e.stopPropagation(); const P = provFor(ts); if (P) openTagPop(ts, P); } }, true);
document.addEventListener("mousedown", e => { if ($("#tagpop") && !e.target.closest("#tagpop, .tagsel")) { if (tp.edit !== null) renameTag(); closeTagPop(); } });
addEventListener("resize", () => placeTagPop(true));

/* ---------- 사진·파일 첨부: 업로드한 파일의 복사본을 대시보드 폴더의 files/<데이터>/ 에 저장 ----------
   기록에는 상대 경로(files/parts/…)만 남기므로, 폴더째 다른 PC로 옮기면 사진·파일도 같이 보입니다. */
const FILES_DIR = "files";
const fsOK = () => "showDirectoryPicker" in window;
let projDir = null;
const idbOpen = () => new Promise((res, rej) => { const q = indexedDB.open("qa-dashboard-fs", 1); q.onupgradeneeded = () => q.result.createObjectStore("h"); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
async function idbGet(k) { const db = await idbOpen(); return new Promise((res, rej) => { const q = db.transaction("h").objectStore("h").get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); }
async function idbSet(k, v) { const db = await idbOpen(); return new Promise((res, rej) => { const t = db.transaction("h", "readwrite"); t.objectStore("h").put(v, k); t.oncomplete = () => res(); t.onerror = () => rej(t.error); }); }
/* 대시보드 폴더 쓰기 권한: 브라우저는 클릭 순간에만 폴더 고르기·권한 창을 띄울 수 있으므로,
   권한 상태(dirReady)를 미리 확인해 두고, 없으면 ‘폴더 연결’ 버튼 클릭에서 바로 요청합니다. */
let dirReady = false;
const RW = { mode: "readwrite" };
const dirInit = (async () => { try { projDir = await idbGet("proj") || null; dirReady = !!projDir && await projDir.queryPermission(RW) === "granted"; } catch (e) {} if (dirReady) setTimeout(processDelQ, DEL_DELAY); })();
async function checkProjDir(d) {
  try { await d.getFileHandle("index.html"); await d.getFileHandle("app.js"); } catch (e) { throw new Error("notproj"); }
  return d;
}
/* 반드시 클릭 처리 함수 안에서, 다른 await 없이 바로 부르세요 */
function connectProjDir() {
  const req = projDir && !dirReady
    ? projDir.requestPermission(RW).then(r => { if (r !== "granted") throw Object.assign(new Error("권한이 거부되었습니다"), { name: "AbortError" }); return projDir; })
    : showDirectoryPicker({ id: "qa-dashboard", mode: "readwrite" }).then(checkProjDir);
  return req.then(d => { projDir = d; dirReady = true; idbSet("proj", d).catch(() => {}); setTimeout(processDelQ, 500); return d; });
}
async function getProjDir() {
  if (projDir && (dirReady || await projDir.queryPermission(RW) === "granted")) { dirReady = true; return projDir; }
  dirReady = false; throw new Error("needconnect");
}
const fsErr = e => e.message === "notproj" ? "고른 폴더에 index.html이 없습니다. 이 대시보드 폴더(index.html이 있는 폴더)를 골라 주세요." : `처리하지 못했습니다: ${e.message}`;
const safeName = n => String(n).replace(/[\\/:*?"<>|#%]+/g, "_").replace(/\s+/g, " ").trim().slice(-80) || "file";
const encPath = p => String(p).split("/").map(encodeURIComponent).join("/");
const isImgA = a => /^image\//.test(a?.type || "") || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(a?.path || "");
const fileExt = a => ((a?.name || "").includes(".") ? a.name.split(".").pop() : "file").slice(0, 4).toUpperCase() || "FILE";
const fmtSize = b => !b ? "" : b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(0) + " KB" : (b / 1048576).toFixed(1) + " MB";
const attList = v => Array.isArray(v) ? v.filter(a => a && a.path) : [];
const valText = v => Array.isArray(v) ? v.map(a => typeof a === "string" ? a : a?.name || "").filter(Boolean).join(", ") : v;   /* 검색·내보내기용 글자 값 */
function fileStamp() { const d = new Date(), p = n => String(n).padStart(2, "0"); return `${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`; }
/* 파일 이름·경로를 먼저 정해 두고(planFiles) 기록에 연결한 다음 실제 복사(writeFiles)를 합니다.
   VS Code Live Server처럼 폴더에 파일이 생기면 페이지를 새로 고치는 환경에서도 연결이 사라지지 않게 하려는 순서입니다. */
function planFiles(dsId, files) {
  const sub = safeName(dsId), st = fileStamp();
  return files.map((f, i) => {
    const name = `${st}${i ? "-" + (i + 1) : ""}-${safeName(f.name || "붙여넣은 이미지.png")}`;
    return { file: f, meta: { name: f.name || name, path: `${FILES_DIR}/${sub}/${name}`, type: f.type || "", size: f.size, at: TODAY() } };
  });
}
async function writeFiles(plan) {
  const root = await getProjDir();
  for (const { file, meta } of plan) {
    const parts = meta.path.split("/"); let d = root;
    for (const seg of parts.slice(0, -1)) d = await d.getDirectoryHandle(seg, { create: true });
    markWrite(); const w = await (await d.getFileHandle(parts.at(-1), { create: true })).createWritable(); await w.write(file); await w.close(); markWrite();
  }
}
/* 첨부 목록을 팝업 초안과(이미 저장된 기록이면) 데이터에도 바로 반영 */
const REOPEN_KEY = "qa-dashboard-reopen";
function setAttach(key, list) {
  ed.draft[key] = list; ed.dirty = true;
  const ds = dsById(ed.ds), rec = !ed.isNew && (ds?.records || []).find(r => r.id === ed.draft.id);
  if (rec) { rec[key] = structuredClone(list); persist(); render(); }
  try { sessionStorage.setItem(REOPEN_KEY, JSON.stringify({ ds: ed.ds, isNew: !!ed.isNew, draft: ed.draft, at: Date.now() })); } catch (e) {}
  return !!rec;
}
/* ---------- 첨부 파일 사용 횟수 장부 ----------
   cfg.fileRefs = { "files/parts/…png": 2, … } 처럼 파일마다 몇 개의 기록에 첨부돼 있는지 저장할 때마다 다시 셉니다.
   횟수가 0이 되면 8초(되돌리기 시간) 뒤 다시 확인하고, 그래도 0이면 대시보드 폴더에서 파일을 지웁니다.
   폴더 권한이 없을 때는 삭제 대기 목록에 남겨 두었다가 다음에 폴더가 연결되면 지웁니다. */
const DELQ_KEY = "qa-dashboard-delq", DEL_DELAY = 8000;
function fileRefCounts(c = cfg) {
  const m = {};
  (c.datasets || []).forEach(d => {
    const keys = (d.fields || []).filter(f => f.type === "file").map(f => f.key); if (!keys.length) return;
    (d.records || []).forEach(r => keys.forEach(k => attList(r[k]).forEach(a => { m[a.path] = (m[a.path] || 0) + 1; })));
  });
  (c.pages || []).forEach(p => (p.widgets || []).forEach(w => { if (typeof w.img === "string" && /^files\//.test(w.img)) m[w.img] = (m[w.img] || 0) + 1; }));   /* 위젯 그림도 사용 중 */
  const scan = v => { if (Array.isArray(v)) v.forEach(a => { if (a && typeof a === "object" && a.path) m[a.path] = (m[a.path] || 0) + 1; }); };   /* 휴지통 안의 기록·데이터베이스 첨부도 보관 */
  (c.trash || []).forEach(t => { if (t.kind === "rec") Object.values(t.data || {}).forEach(scan); if (t.kind === "ds") (t.data?.records || []).forEach(r => Object.values(r).forEach(scan));
    if (t.kind === "page") (t.data?.widgets || []).forEach(w => { if (typeof w.img === "string" && /^files\//.test(w.img)) m[w.img] = (m[w.img] || 0) + 1; }); });
  return m;
}
const draftRefs = () => ed.mode === "record" && ed.draft ? new Set(dsFields(dsById(ed.ds)).filter(f => f.type === "file").flatMap(f => attList(ed.draft[f.key]).map(a => a.path))) : new Set();
const refCount = path => (cfg.fileRefs || fileRefCounts())[path] || 0;
const delQ = () => { try { return new Set(JSON.parse(localStorage.getItem(DELQ_KEY) || "[]")); } catch (e) { return new Set(); } };
const saveDelQ = q => { try { q.size ? localStorage.setItem(DELQ_KEY, JSON.stringify([...q])) : localStorage.removeItem(DELQ_KEY); } catch (e) {} };
let delTimer = null;
function scheduleFileDelete(path) {
  if (!/^files\/[^]+$/.test(path) || path.split("/").includes("..")) return;   /* files/ 아래만 지웁니다 */
  const q = delQ(); q.add(path); saveDelQ(q);
  clearTimeout(delTimer); delTimer = setTimeout(processDelQ, DEL_DELAY);
}
async function processDelQ() {
  const q = delQ(); if (!q.size) return;
  const live = fileRefCounts(), inDraft = draftRefs();
  [...q].forEach(p => { if (live[p] || inDraft.has(p)) q.delete(p); });    /* 되돌리기 등으로 다시 쓰이면 지우지 않음 */
  saveDelQ(q); if (!q.size) return;
  if (!projDir || !(dirReady || await projDir.queryPermission(RW).catch(() => "") === "granted")) return;   /* 폴더 연결 뒤 다시 시도 */
  dirReady = true;
  let n = 0;
  for (const p of [...q]) {
    try {
      const parts = p.split("/"); let d = projDir;
      for (const seg of parts.slice(0, -1)) d = await d.getDirectoryHandle(seg);
      markWrite(); await d.removeEntry(parts.at(-1)); n++;
    } catch (e) { if (e.name !== "NotFoundError") continue; }
    q.delete(p); blobCache.delete(p);
  }
  saveDelQ(q);
  if (n) toast(`어느 기록에도 첨부되지 않은 파일 ${n}개를 대시보드 폴더에서 지웠습니다.`);
}
/* 새 기록 팝업에서 올렸다가 저장하지 않고 닫거나 빼 버린 파일 → 쓰는 곳이 없으면 정리 */
function dropDraftOnly(paths) { paths.forEach(p => { if (!refCount(p)) scheduleFileDelete(p); }); }
/* 첨부 파일 주소: 기본은 index.html 기준 상대 경로. 그 경로로 못 읽으면(로컬 서버·미리보기 창 등)
   연결된 대시보드 폴더에서 직접 읽어 blob 주소로 보여 줍니다. */
const isPdfA = a => /pdf$/i.test(a?.type || "") || /\.pdf$/i.test(a?.path || "");
const isTxtA = a => /^text\//.test(a?.type || "") || /\.(txt|csv|log|md)$/i.test(a?.path || "");
const isVidA = a => /^video\//.test(a?.type || "") || /\.(mp4|webm|mov|m4v|ogv)$/i.test(a?.path || "");
const isAudA = a => /^audio\//.test(a?.type || "") || /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(a?.path || "");
const canPreview = a => isImgA(a) || isPdfA(a) || isTxtA(a) || isVidA(a) || isAudA(a);
const blobCache = new Map();
async function attBlobURL(path) {
  if (blobCache.has(path)) return blobCache.get(path);
  if (!projDir) throw new Error("nodir");
  if (!dirReady) { if (await projDir.queryPermission(RW) !== "granted") throw new Error("nodir"); dirReady = true; }
  const parts = String(path).split("/"); let d = projDir;
  for (const p of parts.slice(0, -1)) d = await d.getDirectoryHandle(p);
  const u = URL.createObjectURL(await (await d.getFileHandle(parts.at(-1))).getFile());
  blobCache.set(path, u); return u;
}
const attImg = (a, cls = "") => `<img${cls ? ` class="${cls}"` : ""} src="${esc(encPath(a.path))}" data-att="${esc(a.path)}" alt="${esc(a.name)}" loading="lazy">`;
/* 상대 경로로 못 읽은 사진은 폴더에서 다시 읽고, 그래도 없으면 ‘파일 없음’ 표시 */
document.addEventListener("error", e => {
  const im = e.target; if (im?.tagName !== "IMG" || !im.dataset.att) return;
  const miss = () => { im.closest(".fz-prev, .lb-stage")?.classList.add("miss"); if (im.closest(".fz-cell")) im.remove(); };
  if (im.dataset.fb) return miss();
  im.dataset.fb = "1"; attBlobURL(im.dataset.att).then(u => { im.src = u; }).catch(miss);
}, true);
function filesHTML(f, v) {
  const L = attList(v), imgs = L.map((a, i) => [a, i]).filter(([a]) => isImgA(a)), docs = L.map((a, i) => [a, i]).filter(([a]) => !isImgA(a));
  return `<div class="fz" data-fz="${esc(f.key)}">
    ${imgs.length ? `<div class="fz-grid">${imgs.map(([a, i]) => `<figure class="fz-card">
      <button type="button" class="fz-prev" data-fview="${i}" title="크게 보기">${attImg(a)}<span class="fz-miss">파일 없음<br><small>${esc(a.path)}</small></span></button>
      <figcaption><button type="button" class="fz-name" data-fview="${i}" title="${esc(a.path)}">${esc(a.name)}</button><span>${fmtSize(a.size)}</span></figcaption>
      <button type="button" class="ib fz-x" data-fdel="${i}" aria-label="${esc(a.name)} 첨부 해제" title="첨부 해제">✕</button></figure>`).join("")}</div>` : ""}
    ${docs.length ? `<div class="fz-list">${docs.map(([a, i]) => `<div class="fz-item">
      <button type="button" class="fz-thumb fz-doc" data-fview="${i}" title="${canPreview(a) ? "미리 보기" : "열기"}"><b>${esc(fileExt(a))}</b></button>
      <div class="fz-meta"><button type="button" class="fz-name" data-fview="${i}" title="${esc(a.path)}">${esc(a.name)}</button><span>${[fmtSize(a.size), a.at].filter(Boolean).join(" · ")}</span></div>
      <button type="button" class="ib fz-x" data-fdel="${i}" aria-label="${esc(a.name)} 첨부 해제" title="첨부 해제">✕</button></div>`).join("")}</div>` : ""}
    ${fzPending?.key === f.key && fzPending.ds === ed.ds ? `<div class="fz-wait"><span>올릴 파일 ${fzPending.files.length}개가 기다리고 있습니다. 처음 한 번(또는 브라우저를 다시 연 뒤) 대시보드 폴더 연결이 필요합니다.</span><div><button type="button" class="btn sm primary" data-fconnect="1">대시보드 폴더 연결하고 올리기</button> <button type="button" class="btn sm ghost" data-fcancel="1">취소</button></div></div>` : ""}
    <button type="button" class="fz-add" data-fadd="1">＋ 파일 올리기<span>사진·PDF·엑셀·도면 등 모든 형식 · 끌어다 놓기 · 캡처 붙여넣기(Ctrl+V)</span></button>
  </div>`;
}
const fileCell = v => { const L = attList(v); if (!L.length) return `<td></td>`; const im = L.find(isImgA); return `<td><span class="fz-cell">${im ? attImg(im) : `<b>${esc(fileExt(L[0]))}</b>`}${L.length > 1 || !im ? `<span>${L.length}개</span>` : ""}</span></td>`; };
/* 첨부 미리 보기: 사진·PDF·텍스트는 화면 안에서, 그 밖의 형식은 새 탭으로 */
const lb = { list: [], i: 0 };
function openViewer(list, i) { lb.list = list; lb.i = i; renderViewer(); }
function openAtt(a) {                                   /* 클릭 순간 새 탭을 먼저 열어 두고 주소를 채웁니다 */
  const w = window.open(encPath(a.path), "_blank");
  attBlobURL(a.path).then(u => { if (w && !w.closed) w.location = u; }).catch(() => {});
}
function renderViewer() {
  const a = lb.list[lb.i]; if (!a) return closeLightbox();
  let v = $("#lightbox");
  if (!v) {
    v = document.createElement("div"); v.id = "lightbox"; v.className = "lightbox"; v.setAttribute("role", "dialog");
    v.addEventListener("click", e => {
      const b = e.target.closest("[data-lb]");
      if (b) { e.preventDefault(); const k = b.dataset.lb; if (k === "close") closeLightbox(); if (k === "prev" || k === "next") { lb.i = (lb.i + (k === "next" ? 1 : -1) + lb.list.length) % lb.list.length; renderViewer(); } if (k === "open") openAtt(lb.list[lb.i]); return; }
      if (e.target === v || e.target.classList.contains("lb-stage")) closeLightbox();
    });
    document.body.appendChild(v);
  }
  v.setAttribute("aria-label", a.name);
  const n = lb.list.length, rel = esc(encPath(a.path));
  const stage = isImgA(a) ? attImg(a, "lb-img") + `<div class="fz-miss lb-miss">파일을 찾지 못했습니다.<br><small>${esc(a.path)}</small><br><small>대시보드 폴더가 연결되어 있지 않으면 첨부 영역의 ‘폴더 연결’ 후 다시 여세요.</small></div>`
    : isPdfA(a) || isTxtA(a) ? `<iframe class="lb-frame lb-src" title="${esc(a.name)}" src="${rel}"></iframe>`
    : isVidA(a) ? `<video class="lb-media lb-src" controls preload="metadata" src="${rel}"></video>`
    : isAudA(a) ? `<div class="lb-none"><b>${esc(fileExt(a))}</b><audio class="lb-src" controls preload="metadata" src="${rel}"></audio></div>`
    : `<div class="lb-none"><b>${esc(fileExt(a))}</b><p>이 형식은 화면 안에서 미리 볼 수 없습니다.</p><button type="button" class="btn primary" data-lb="open">새 탭에서 열기</button></div>`;
  v.innerHTML = `<div class="lb-bar"><span class="lb-name">${esc(a.name)}</span><span class="lb-sub">${[fmtSize(a.size), a.at, n > 1 ? `${lb.i + 1} / ${n}` : ""].filter(Boolean).join(" · ")}</span>
      <span class="lb-acts"><button type="button" class="btn sm" data-lb="open">새 탭에서 열기</button><button type="button" class="btn sm" data-lb="close">닫기 (Esc)</button></span></div>
    <div class="lb-stage">${n > 1 ? `<button type="button" class="lb-nav prev" data-lb="prev" aria-label="이전 첨부">‹</button>` : ""}${stage}${n > 1 ? `<button type="button" class="lb-nav next" data-lb="next" aria-label="다음 첨부">›</button>` : ""}</div>
    <div class="lb-path">대시보드 폴더 / ${esc(a.path)}</div>`;
  const fr = v.querySelector(".lb-src");
  if (fr) attBlobURL(a.path).then(u => { if (fr.isConnected) fr.src = u; }).catch(() => {});   /* 폴더가 연결돼 있으면 폴더에서 바로 읽기 */
  v.querySelector('[data-lb="close"]').focus();
}
function closeLightbox() { $("#lightbox")?.remove(); }
document.addEventListener("keydown", e => {
  if (!$("#lightbox")) return;
  if (e.key === "Escape") { e.preventDefault(); e.stopImmediatePropagation(); closeLightbox(); }
  if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && lb.list.length > 1) { e.preventDefault(); e.stopImmediatePropagation(); lb.i = (lb.i + (e.key === "ArrowRight" ? 1 : -1) + lb.list.length) % lb.list.length; renderViewer(); }
}, true);
let fzPending = null;   /* 폴더 연결을 기다리는 파일 */
/* 이미 첨부된 파일 찾기: 같은 파일 이름(크기도 같음)이면 새로 복사하지 않고 그 파일을 다시 연결합니다.
   크기가 다르면 이름만 같은 다른 판(수정본)으로 보고 새로 복사합니다. */
const attSig = a => `${a.name}|${a.size}`;
function knownAttachments() {
  const m = new Map(), add = a => { if (a?.path && !m.has(attSig(a))) m.set(attSig(a), a); };
  (cfg.datasets || []).forEach(d => {
    const keys = (d.fields || []).filter(f => f.type === "file").map(f => f.key);
    (d.records || []).forEach(r => keys.forEach(k => attList(r[k]).forEach(add)));
  });
  if (ed.mode === "record" && ed.draft) dsFields(dsById(ed.ds)).filter(f => f.type === "file").forEach(f => attList(ed.draft[f.key]).forEach(add));
  return m;
}
async function uploadTo(key, files) {
  files = [...files].filter(Boolean); if (!files.length || ed.mode !== "record") return;
  const dsId = ed.ds, before = attList(ed.draft[key]), have = new Set(before.map(attSig)), known = knownAttachments();
  const reuse = [], fresh = [], already = [];
  files.forEach(f => {
    const sig = `${f.name}|${f.size}`;
    if (have.has(sig)) { already.push(f.name); return; }                     /* 이 기록에 이미 있음 */
    have.add(sig);
    const k = known.get(sig);
    if (k) reuse.push({ name: k.name, path: k.path, type: k.type, size: k.size, at: TODAY() }); else fresh.push(f);
  });
  if (!fresh.length) {                                                        /* 복사할 파일 없음 → 폴더 연결도 필요 없음 */
    if (!reuse.length) { msg(`이미 이 기록에 첨부된 파일입니다: ${already.join(", ")}`, null); return; }
    const linked = setAttach(key, [...before, ...reuse]); renderDrawer();
    msg(`${reuse.length}개는 같은 이름의 파일이 폴더에 이미 있어 새로 복사하지 않고 그 파일을 연결했습니다 (${reuse.map(a => `${a.name} → 첨부 ${refCount(a.path) + (linked ? 0 : 1)}곳`).join(", ")}).${linked ? "" : " ‘저장’을 누르면 기록에 남습니다."}${already.length ? ` 이미 첨부됨: ${already.join(", ")}` : ""}`, true);
    return;
  }
  if (!fsOK()) { msg("이 브라우저는 폴더에 파일 복사를 지원하지 않습니다. Chrome 또는 Edge로 index.html을 여세요.", false); return; }
  try {
    await getProjDir();
  } catch (e) {
    fzPending = { ds: dsId, key, files }; renderDrawer();
    msg("대시보드 폴더 연결이 필요합니다. ‘대시보드 폴더 연결하고 올리기’를 누르세요.", null);
    $("#drawer [data-fconnect]")?.scrollIntoView({ block: "nearest" }); $("#drawer [data-fconnect]")?.focus({ preventScroll: true });
    return;
  }
  if (ed.mode !== "record" || ed.ds !== dsId) return;
  const plan = planFiles(dsId, fresh);
  const linked = setAttach(key, [...before, ...reuse, ...plan.map(x => x.meta)]);      /* 복사 전에 먼저 연결 */
  renderDrawer(); msg(`파일 ${plan.length}개를 대시보드 폴더에 복사하는 중…`, true);
  try {
    await writeFiles(plan);
    blobCache.clear();
    if (ed.mode === "record" && ed.ds === dsId) {
      renderDrawer();
      msg(`${plan.length}개를 ${FILES_DIR}/${safeName(dsId)}/ 폴더에 복사했습니다.${reuse.length ? ` ${reuse.length}개는 같은 이름의 파일이 이미 있어 복사하지 않고 연결했습니다.` : ""}${already.length ? ` 이미 첨부됨: ${already.join(", ")}.` : ""} ${linked ? "이 기록에 바로 연결해 저장했습니다." : "새 기록이라 ‘저장’을 누르면 함께 저장됩니다."}`, true);
    }
  } catch (e) {
    if (ed.mode === "record" && ed.ds === dsId) { setAttach(key, before); renderDrawer(); }
    msg(fsErr(e), false);
  }
}
/* ‘폴더 연결’ 버튼: 클릭 직후 바로 폴더 고르기·권한 창을 띄우고, 기다리던 파일을 이어서 복사 */
function connectAndUpload() {
  const pend = fzPending;
  msg("폴더 고르기 창에서 이 대시보드 폴더(index.html이 있는 폴더)를 고르고 ‘파일 편집 허용’을 누르세요.", null);
  connectProjDir().then(() => {
    fzPending = null;
    if (pend && ed.mode === "record" && ed.ds === pend.ds) uploadTo(pend.key, pend.files); else renderDrawer();
  }).catch(e => { if (e.name === "AbortError") msg("폴더 연결을 취소했습니다. 다시 누르면 이어서 올릴 수 있습니다.", null); else msg(fsErr(e), false); });
}
function pickFiles(key) {
  const i = document.createElement("input"); i.type = "file"; i.multiple = true;
  i.addEventListener("change", () => uploadTo(key, i.files)); i.click();
}
$("#drawer").addEventListener("click", e => {
  const z = e.target.closest(".fz"); if (!z || ed.mode !== "record") return;
  const key = z.dataset.fz;
  if (e.target.closest("[data-fadd]")) { e.preventDefault(); return pickFiles(key); }
  if (e.target.closest("[data-fconnect]")) { e.preventDefault(); return connectAndUpload(); }
  if (e.target.closest("[data-fcancel]")) { e.preventDefault(); fzPending = null; renderDrawer(); msg("올리기를 취소했습니다.", null); return; }
  const del = e.target.closest("[data-fdel]");
  if (del) {
    const L = attList(ed.draft[key]), a = L[+del.dataset.fdel]; if (!a) return;
    const linked = setAttach(key, L.filter((_, i) => i !== +del.dataset.fdel)); renderDrawer();
    if (!linked && !draftRefs().has(a.path)) dropDraftOnly([a.path]);
    const left = refCount(a.path) + (draftRefs().has(a.path) ? 1 : 0);
    msg(`‘${a.name}’ 첨부를 뺐습니다${linked ? "(기록에 바로 반영)" : ""}. ${left ? `이 파일은 아직 ${left}곳에 첨부되어 있어 폴더에 남겨 둡니다.` : "이제 첨부된 곳이 없어 잠시 뒤 폴더에서도 지웁니다."}`, true); return;
  }
  const vw = e.target.closest("[data-fview]");
  if (vw) { const L = attList(ed.draft[key]), i = +vw.dataset.fview; if (!L[i]) return; if (canPreview(L[i])) openViewer(L, i); else openAtt(L[i]); }
});
const dropZoneFor = t => t.closest(".fz") || (ed.mode === "record" && t.closest("#drawer") ? $("#drawer .fz") : null);
$("#drawer").addEventListener("dragover", e => { if (!e.dataTransfer?.types?.includes("Files")) return; const z = dropZoneFor(e.target); if (!z) return; e.preventDefault(); document.querySelectorAll("#drawer .fz.over").forEach(x => x !== z && x.classList.remove("over")); z.classList.add("over"); });
$("#drawer").addEventListener("dragleave", e => { if (!e.relatedTarget || !$("#drawer").contains(e.relatedTarget)) document.querySelectorAll("#drawer .fz.over").forEach(x => x.classList.remove("over")); });
$("#drawer").addEventListener("drop", e => {
  if (!e.dataTransfer?.types?.includes("Files")) return;
  const z = dropZoneFor(e.target); if (!z) return;
  e.preventDefault(); document.querySelectorAll("#drawer .fz.over").forEach(x => x.classList.remove("over"));
  const items = [...(e.dataTransfer.items || [])], dirs = items.filter(it => it.webkitGetAsEntry?.()?.isDirectory).length;
  const files = items.length ? items.filter(it => it.kind === "file" && !it.webkitGetAsEntry?.()?.isDirectory).map(it => it.getAsFile()).filter(Boolean) : [...e.dataTransfer.files];
  if (dirs) msg(`폴더 ${dirs}개는 올릴 수 없어 건너뜁니다. 폴더 안의 파일을 골라 올려 주세요.`, false);
  if (files.length) uploadTo(z.dataset.fz, files);
});
addEventListener("dragover", e => { if (e.dataTransfer?.types?.includes("Files") && !e.target.closest?.("#drawer")) { e.preventDefault(); e.dataTransfer.dropEffect = "none"; } });
addEventListener("drop", e => { if (e.dataTransfer?.types?.includes("Files") && !e.target.closest?.("#drawer")) e.preventDefault(); });
/* 캡처 붙여넣기: 파일이 담긴 붙여넣기만 가로채고, 글자 붙여넣기는 그대로 둡니다 */
$("#drawer").addEventListener("paste", e => {
  if (ed.mode !== "record") return;
  const files = [...(e.clipboardData?.files || [])]; if (!files.length) return;
  const z = e.target.closest?.(".fz") || $("#drawer .fz"); if (!z) return;
  e.preventDefault();
  uploadTo(z.dataset.fz, files.map((f, i) => f.name && f.name !== "image.png" ? f : new File([f], `캡처 ${fileStamp()}${i ? "-" + (i + 1) : ""}.${(f.type.split("/")[1] || "png").replace("jpeg", "jpg")}`, { type: f.type })));
});
/* 대시보드 폴더의 pages.config.js를 바로 덮어쓰기 (다른 PC와 기록을 맞출 때) */
async function saveConfigToProject() {
  if (!fsOK()) { msg("이 브라우저는 폴더 저장을 지원하지 않습니다. 다운로드한 파일로 교체하세요.", false); return; }
  try {
    const root = dirReady && projDir ? projDir : await connectProjDir();   /* 연결 전이면 클릭 순간 바로 폴더 창 */
    markWrite(); const w = await (await root.getFileHandle("pages.config.js", { create: true })).createWritable(); await w.write(configText()); await w.close();
    msg("대시보드 폴더의 pages.config.js를 지금 내용으로 저장했습니다. 폴더째 옮기면 다른 PC에서도 같은 기록과 첨부 파일이 보입니다.", true);
  } catch (e) {
    if (e.name === "AbortError") { msg("폴더 연결을 취소했습니다.", null); return; }
    if (e.name === "NotAllowedError" || e.message === "needconnect") { dirReady = false; msg("폴더 권한이 만료되었습니다. 버튼을 한 번 더 누르세요.", false); return; }
    msg(fsErr(e), false);
  }
}

/* ---------- 첨부 파일 관리 (설정 화면) ---------- */
function allAttachments() {
  const m = new Map();
  (cfg.datasets || []).forEach(d => {
    const keys = (d.fields || []).filter(f => f.type === "file").map(f => f.key), tk = titleKeyOf(d);
    (d.records || []).forEach(r => keys.forEach(k => attList(r[k]).forEach(a => {
      const e = m.get(a.path) || { ...a, uses: [] }; e.uses.push({ ds: d, rid: r.id, title: r[tk] || "(제목 없음)" }); m.set(a.path, e);
    })));
  });
  return [...m.values()].sort((a, b) => String(b.at || "").localeCompare(String(a.at || "")) || a.name.localeCompare(b.name));
}
function attachSecHTML() {
  const L = allAttachments(), total = L.reduce((n, a) => n + (a.size || 0), 0), links = L.reduce((n, a) => n + a.uses.length, 0);
  const q = (am.q || "").toLowerCase(), shown = L.filter(a => !q || a.name.toLowerCase().includes(q) || a.uses.some(u => String(u.title).toLowerCase().includes(q)));
  am.last = shown;
  return `<div class="sec"><h5>첨부 파일</h5>
    <div class="hint">대시보드 폴더의 <code>files/</code>에 복사된 파일 ${L.length}개 · 총 ${fmtSize(total) || "0 B"} · 기록에 연결 ${links}곳${dirReady ? " · 폴더 연결됨" : " · 폴더 연결 전"}${delQ().size ? ` · 삭제 대기 ${delQ().size}개` : ""}</div>
    ${L.length ? `<input class="f" id="amQ" type="search" placeholder="파일 이름·기록 제목으로 찾기" value="${esc(am.q || "")}" aria-label="첨부 파일 찾기">
    <div class="am-list">${amListHTML(shown)}</div>` : ""}
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn" data-a="am-clean" type="button" title="files/ 폴더를 살펴 어느 기록에도 첨부되지 않은 파일을 지웁니다">안 쓰는 파일 정리</button>
      <button class="btn danger" data-a="am-reset" type="button">첨부 파일 모두 초기화</button>
    </div></div>`;
}
const am = { q: "" };
const amFilter = (L, q) => L.filter(a => !q || a.name.toLowerCase().includes(q) || a.uses.some(u => String(u.title).toLowerCase().includes(q)));
const amListHTML = shown => `${shown.slice(0, 60).map(a => `<div class="am-row">
      <button type="button" class="fz-thumb fz-doc am-ic" data-a="am-view" data-path="${esc(a.path)}" title="미리 보기">${isImgA(a) ? attImg(a) : `<b>${esc(fileExt(a))}</b>`}</button>
      <div class="am-meta"><button type="button" class="fz-name" data-a="am-view" data-path="${esc(a.path)}" title="${esc(a.path)}">${esc(a.name)}</button>
        <span>${[fmtSize(a.size), `첨부 ${a.uses.length}곳`].join(" · ")} — ${a.uses.slice(0, 3).map(u => `<a href="#" data-a="am-open" data-ds="${esc(u.ds.id)}" data-id="${esc(u.rid)}">${esc(u.ds.name)} · ${esc(u.title)}</a>`).join(", ")}${a.uses.length > 3 ? ` 외 ${a.uses.length - 3}곳` : ""}</span></div>
    </div>`).join("") || `<div class="tp-none">찾는 파일이 없습니다.</div>`}${shown.length > 60 ? `<div class="tp-none">처음 60개만 보여 줍니다. 검색으로 좁혀 보세요.</div>` : ""}`;
/* files/ 폴더 안의 실제 파일 목록 (하위 폴더 포함) */
async function scanFolderFiles(root) {
  const out = []; let top;
  try { top = await root.getDirectoryHandle(FILES_DIR); } catch (e) { return out; }
  const walk = async (d, pre) => { for await (const [n, h] of d.entries()) { if (h.kind === "directory") await walk(h, `${pre}${n}/`); else out.push({ path: `${pre}${n}`, dir: d, name: n }); } };
  await walk(top, `${FILES_DIR}/`);
  return out;
}
/* 클릭 순간에 폴더 권한을 받고(필요하면 폴더 고르기) 작업을 이어 갑니다 */
function withProjDir(fn) {
  const go = dirReady && projDir ? Promise.resolve(projDir) : connectProjDir();
  return go.then(fn).catch(e => { if (e.name === "AbortError") msg("폴더 연결을 취소했습니다.", null); else msg(fsErr(e), false); });
}
function cleanUnused() {
  msg("files/ 폴더를 살펴보는 중…", null);
  withProjDir(async root => {
    const used = fileRefCounts(), draft = draftRefs(), found = await scanFolderFiles(root);
    const extra = found.filter(f => !used[f.path] && !draft.has(f.path));
    let n = 0, size = 0;
    for (const f of extra) { try { size += (await (await f.dir.getFileHandle(f.name)).getFile()).size; await f.dir.removeEntry(f.name); n++; blobCache.delete(f.path); } catch (e) {} }
    const missing = Object.keys(used).filter(pth => !found.some(f => f.path === pth)).length;
    saveDelQ(new Set());
    renderDrawer();
    msg(`폴더의 파일 ${found.length}개를 확인했습니다. ${n ? `어느 기록에도 첨부되지 않은 파일 ${n}개(${fmtSize(size)})를 지웠습니다.` : "지울 파일이 없습니다."}${missing ? ` 기록에는 있지만 폴더에 없는 파일이 ${missing}개 있습니다(다른 PC에서 복사가 빠졌을 수 있음).` : ""}`, true);
  });
}
function resetAttachments(btn) {
  const L = allAttachments();
  if (!arm(btn, `한 번 더 누르면 첨부 ${L.length}개를 모두 지웁니다`)) return;
  msg("첨부 파일을 지우는 중…", null);
  withProjDir(async root => {
    const found = await scanFolderFiles(root); let n = 0;
    for (const f of found) { try { await f.dir.removeEntry(f.name); n++; } catch (e) {} }
    (cfg.datasets || []).forEach(d => { const keys = (d.fields || []).filter(f => f.type === "file").map(f => f.key); (d.records || []).forEach(r => keys.forEach(k => { if (k in r) r[k] = []; })); });
    cfg.fileRefs = {}; saveDelQ(new Set()); blobCache.clear();
    persist(); render(); renderDrawer();
    msg(`첨부 연결을 모두 비우고, 폴더의 파일 ${n}개를 지웠습니다. 기록과 항목 구성은 그대로입니다.`, true);
  });
}
/* ---------- 노션식 항목 메뉴: 기록 팝업에서 항목 이름을 누르면 이름·형식·필수 여부를 바꾸거나 지웁니다 ---------- */
const PTYPES = [["text", "텍스트", "Aa"], ["longtext", "긴 텍스트", "¶"], ["number", "숫자", "#"], ["date", "날짜", "▦"], ["select", "선택 (분류)", "◇"], ["ref", "관계 (다른 데이터베이스)", "↗"], ["file", "사진 · 파일", "⎙"], ["formula", "수식 (자동 계산)", "ƒ"], ["rollup", "롤업 (관계 집계)", "∑"]];
const pp = { key: null, view: "main", ds: null, scope: "#drawer" };
const ppDs = () => dsById(pp.ds);
const ppField = () => (ppDs()?.fields || []).find(f => f.key === pp.key);
const ppAnchor = () => pp.key ? document.querySelector(`${pp.scope} [data-fk="${CSS.escape(pp.key)}"]`) : null;
function closePropPop(apply = true) {
  if (apply) { ppRename(); const x = $("#ppExpr"), f = ppField(); if (x && f && (f.expr || "") !== x.value.trim()) { f.expr = x.value.trim(); persist(); render(); if (ed.mode === "record" || ed.mode === "fields") renderDrawer(true); } }
  $("#proppop")?.remove(); pp.key = null;
}
function ppWidgetUse(ds, key) {
  const hit = src => src?.ds === ds.id && JSON.stringify(src).includes(`"${key}"`);
  let n = 0; cfg.pages.forEach(pg => (pg.widgets || []).forEach(w => { if (hit(w.src) || (w.items || []).some(k => hit(k.src))) n++; })); return n;
}
function ppLocks(ds, f) {
  const typeLock = f.key === ds.dateField ? "기준 날짜로 쓰는 항목이라 형식을 바꿀 수 없습니다." : f.badge ? "상태 항목은 완료 계산에 쓰여 형식을 바꿀 수 없습니다." : f.type === "days" ? "기간(일수 자동 계산) 항목입니다. 아래에서 시작·종료 날짜를 고르세요." : "";
  const byDays = (ds.fields || []).find(x => x.type === "days" && (x.from === f.key || x.to === f.key));
  const delLock = f.key === ds.dateField ? "기준 날짜 항목은 지울 수 없습니다." : f.key === ds.asOfField ? "기준일 숨김에 쓰는 항목은 지울 수 없습니다." : byDays ? `‘${byDays.label}’ 기간 계산에 쓰여 지울 수 없습니다.` : (ds.fields || []).length <= 1 ? "마지막 항목은 지울 수 없습니다." : "";
  return { typeLock, delLock };
}
function openPropPop(key, view = "main", ctx) {
  $("#proppop")?.remove(); closeTagPop();
  if (ctx) Object.assign(pp, ctx);
  pp.key = key; pp.view = view;
  const pop = document.createElement("div"); pop.id = "proppop"; pop.className = "tagpop proppop"; pop.setAttribute("role", "dialog"); pop.setAttribute("aria-label", "항목 편집");
  document.body.appendChild(pop);
  pop.addEventListener("click", propPopClick);
  pop.addEventListener("keydown", e => {
    e.stopPropagation();
    if (e.key === "Escape") { e.preventDefault(); if (pp.view !== "main") { pp.view = "main"; renderPropPop(); } else { const a = ppAnchor(); closePropPop(); a?.focus(); } }
    if (e.key === "Enter" && e.target.id === "ppName" && !composing(e)) { e.preventDefault(); ppRename(); }
    if (e.key === "Enter" && e.target.id === "ppExpr" && !composing(e)) { e.preventDefault(); e.target.dispatchEvent(new Event("change", { bubbles: true })); }
  });
  pop.addEventListener("input", e => {
    if (e.target.id === "ppName") e.target.setCustomValidity("");
    if (e.target.id === "ppExpr") {                        /* 수식 결과 미리 보기 (저장은 Enter·바깥 누르기) */
      const ds = ppDs(), f = ppField(), first = ds && visibleRecs(ds).at(-1), res = $("#ppRes"); if (!res || !f) return;
      if (!first) { res.textContent = "기록이 없어 결과를 미리 볼 수 없습니다."; return; }
      const r = evalFormula(e.target.value, recView(ds, first), dsFields(ds));
      res.innerHTML = r.ok ? `최근 기록 결과: <b>${calcText(f, r.v) || "(빈 값)"}</b>` : `<span class="calc-bad">${esc(r.err)}</span>`;
    }
  });
  pop.addEventListener("change", e => {                      /* 형식별 세부 설정 */
    const f = ppField(), t = e.target; if (!f) return;
    if (t.id === "ppAuto") { const v = t.value.trim(); if (v) f.auto = v; else delete f.auto; }
    else if (t.id === "ppCloses") { if (t.checked) f.closes = true; else delete f.closes; }
    else if (t.id === "ppMulti") { if (t.checked) delete f.single; else f.single = true; }
    else if (t.id === "ppFrom" || t.id === "ppTo") f[t.id === "ppFrom" ? "from" : "to"] = t.value;
    else if (t.id === "ppExpr") { if (f.expr === t.value.trim()) return; f.expr = t.value.trim(); }
    else if (t.id === "ppRel") f.rel = t.value;
    else if (t.id === "ppRAgg") { f.agg = t.value; if (f.agg !== "count" && !f.field) { const od = dsById(String(f.rel).split(":")[0]); f.field = (dsFields(od).find(isNumF) || {}).key || ""; } }
    else if (t.id === "ppRField") f.field = t.value;
    else if (t.id === "ppRWF") { if (t.value) f.where = { f: t.value, op: "=", v: "" }; else delete f.where; }
    else if (t.id === "ppRWOp") f.where = { ...(f.where || {}), op: t.value };
    else if (t.id === "ppRWV") f.where = { ...(f.where || {}), v: t.value };
    else return;
    ppCommit();
  });
  renderPropPop();
  const n = $("#ppName"); if (n) { n.focus(); n.select(); }
}
function placePropPop() {
  const p = $("#proppop"), a = ppAnchor(); if (!p || !a) return;
  const r = a.getBoundingClientRect();
  p.style.width = "300px";
  p.style.left = Math.max(8, Math.min(innerWidth - p.offsetWidth - 8, r.left)) + "px";
  p.style.top = (r.bottom + p.offsetHeight + 8 > innerHeight ? Math.max(8, r.top - p.offsetHeight - 4) : r.bottom + 4) + "px";
}
function renderPropPop() {
  const ds = ppDs(), f = ppField(), p = $("#proppop"); if (!ds || !f || !p) return closePropPop(false);
  const { typeLock, delLock } = ppLocks(ds, f);
  const nrec = (ds.records || []).filter(r => !blank(r[f.key]) && !(Array.isArray(r[f.key]) && !r[f.key].length)).length, nw = ppWidgetUse(ds, f.key);
  if (pp.view === "ref") {
    const ms = (cfg.datasets || []).filter(x => x.id !== ds.id).sort((a, b) => (b.master ? 1 : 0) - (a.master ? 1 : 0));
    p.innerHTML = `<div class="tp-head"><button type="button" class="ib" data-pp="back" aria-label="뒤로">←</button><span>어느 목록에서 고를까요?</span></div>
      <div class="tp-list">${ms.map(m => `<button type="button" class="tp-row" data-pref="${esc(m.id)}"><span class="pp-t"><i>↗</i>${esc(m.name)} <span class="tp-hint">${masterValues(m.id).length}개</span></span>${f.type === "ref" && f.ref === m.id ? `<b class="tp-check" aria-label="선택됨">✓</b>` : ""}</button>`).join("") || `<div class="tp-none">고를 수 있는 데이터가 없습니다. 왼쪽 ‘＋ 새 데이터’로 먼저 만드세요.</div>`}</div>
      <div class="tp-foot"><span class="tp-hint">지금 적힌 값 중 목록에 없는 값은 목록에 추가됩니다.</span></div>`;
    return placePropPop();
  }
  const cur = f.type;
  p.innerHTML = `<input class="f" id="ppName" value="${esc(f.label)}" aria-label="항목 이름" placeholder="항목 이름">
    ${pp.scope === "#board" && ds.colW ? `<div class="tp-list pp-sort"><button type="button" class="tp-row" data-pp="colw-fit"><span class="pp-t"><i>↔</i>이 열 내용에 맞추기</span></button><button type="button" class="tp-row" data-pp="colw-reset"><span class="pp-t"><i>⇔</i>모든 열 너비 자동으로</span></button></div>` : ""}
    ${pp.scope === "#board" ? `<div class="tp-list pp-sort"><button type="button" class="tp-row" data-pp="filter"><span class="pp-t"><i>⚲</i>이 항목으로 필터</span>${dvFilters(ds.id).some(x => x.f === f.key) ? `<b class="tp-check">✓</b>` : ""}</button><button type="button" class="tp-row" data-pp="sort-asc"><span class="pp-t"><i>↑</i>오름차순 정렬</span>${dv.sortK === f.key && dv.asc ? `<b class="tp-check">✓</b>` : ""}</button><button type="button" class="tp-row" data-pp="sort-desc"><span class="pp-t"><i>↓</i>내림차순 정렬</span>${dv.sortK === f.key && !dv.asc ? `<b class="tp-check">✓</b>` : ""}</button></div>` : ""}
    <div class="tp-sec">형식</div>
    ${typeLock ? `<div class="tp-lock">${esc(typeLock)}</div>` : `<div class="tp-list">${PTYPES.map(([t, n, g]) => `<button type="button" class="tp-row" data-ptype="${t}"><span class="pp-t"><i>${g}</i>${n}${t === "ref" && cur === "ref" ? ` · ${esc(dsById(f.ref)?.name || "")}` : ""}</span>${cur === t ? `<b class="tp-check" aria-label="현재 형식">✓</b>` : t === "ref" ? `<span class="tp-hint">›</span>` : ""}</button>`).join("")}</div>`}
    ${f.type === "select" || f.type === "ref" ? `<button type="button" class="tp-row" data-pp="opts"><span class="pp-t"><i>◇</i>${f.type === "ref" ? "목록 값 편집" : "선택지 편집 (이름·색·삭제)"}</span><span class="tp-hint">›</span></button>` : ""}
    ${f.type === "text" ? `<label class="tp-row pp-chk"><span class="pp-t"><i>№</i>자동 번호</span><input class="f pp-mini" id="ppAuto" value="${esc(f.auto || "")}" placeholder="예: CL-{YY}-" aria-label="자동 번호 접두어"></label>` : ""}
    ${f.type === "date" ? `<label class="tp-row pp-chk" title="이 날짜가 기준일보다 뒤면 미완료로 계산"><span class="pp-t"><i>✓</i>완료일로 쓰기</span><input type="checkbox" id="ppCloses" ${f.closes ? "checked" : ""}></label>` : ""}
    ${f.type === "days" ? (() => { const o = [["", "선택"], ["@today", "기준일 (오늘)"], ...(ds.fields || []).filter(dateF).map(x => [x.key, x.label])], sel = (id, v) => `<select class="f pp-mini" id="${id}">${o.map(([a, b]) => `<option value="${esc(a)}" ${a === (v || "") ? "selected" : ""}>${esc(b)}</option>`).join("")}</select>`;
      return `<label class="tp-row pp-chk"><span class="pp-t"><i>▶</i>시작 날짜</span>${sel("ppFrom", f.from)}</label><label class="tp-row pp-chk"><span class="pp-t"><i>■</i>종료 날짜</span>${sel("ppTo", f.to)}</label>`; })() : ""}
    ${isCalcF(f) ? calcPropHTML(ds, f) : ""}
    ${f.type === "ref" ? `<label class="tp-row pp-chk"><span class="pp-t"><i>⋯</i>여러 개 고르기</span><input type="checkbox" id="ppMulti" ${f.single ? "" : "checked"}></label>` : ""}
    ${f.type !== "days" && !isCalcF(f) ? `<label class="tp-row pp-chk"><span class="pp-t"><i>*</i>필수 입력</span><input type="checkbox" id="ppReq" ${f.req ? "checked" : ""}></label>` : ""}
    <div class="tp-foot"><span class="tp-hint">${delLock ? esc(delLock) : `값이 있는 기록 ${nrec}건 · 쓰는 위젯 ${nw}개`}</span>${delLock ? "" : `<button type="button" class="btn sm danger" data-pp="del">항목 삭제</button>`}</div>`;
  placePropPop();
}
/* 데이터 저장 → 뒤쪽 대시보드와 이 팝업을 다시 그리기 */
function ppCommit() { persist(); render(); if (ed.mode === "record" || ed.mode === "fields") renderDrawer(true); if (pp.key && $("#proppop")) renderPropPop(); }
function ppUndoable(text, fn) {
  const snap = JSON.stringify(cfg), dsnap = JSON.stringify(ed.draft);
  fn(); ppCommit();
  toast(text, () => { cfg = JSON.parse(snap); if (ed.mode === "record") ed.draft = JSON.parse(dsnap); closePropPop(false); persist(); render(); if (ed.mode === "record" || ed.mode === "fields") renderDrawer(true); toast("되돌렸습니다."); });
}
function ppRename() {
  const el = $("#ppName"), f = ppField(); if (!el || !f) return;
  const v = el.value.trim();
  if (!v || v === f.label) { el.value = f.label; return; }
  if ((ppDs().fields || []).some(x => x !== f && x.label === v)) { el.setCustomValidity("같은 이름의 항목이 이미 있습니다"); el.reportValidity(); return; }
  const from = f.label; f.label = v; renameInExpr(ppDs(), from, v); ppCommit(); toast(`항목 이름을 ‘${from}’에서 ‘${v}’(으)로 바꿨습니다. 위젯 연결은 그대로입니다.`);
}
function ppConvert(type, ref) {
  const ds = ppDs(), f = ppField(); if (!ds || !f) return;
  if (f.type === type && (type !== "ref" || f.ref === ref)) { pp.view = "main"; return renderPropPop(); }
  const k = f.key, holders = [...(ds.records || []), ...(ed.mode === "record" && ed.ds === ds.id ? [ed.draft] : [])], wasFile = f.type === "file";
  const flat = valText, wasCalc = isCalcF(f);
  const calcV = wasCalc ? new Map(holders.map(r => [r, recView(ds, r)[k]])) : null;         /* 자동 계산 값은 지금 값으로 굳혀서 옮김 */
  const vals = [...new Set((ds.records || []).map(r => flat(calcV ? calcV.get(r) : r[k])).filter(v => !blank(v)).map(String))];
  const oldColors = f.type === "ref" ? dsById(f.ref)?.colors || {} : f.colors || {};
  const oldOpts = f.type === "ref" ? masterValues(f.ref) : f.type === "select" ? f.options || [] : [];
  const tname = (PTYPES.find(t => t[0] === type) || [])[1];
  if (type === "file" && vals.length && !wasFile) { /* 글자 값은 파일로 바꿀 수 없으니 비웁니다 */ }
  ppUndoable(`‘${f.label}’ 형식을 ${tname}(으)로 바꿨습니다.`, () => {
    ["options", "badge", "colors", "ref", "auto", "closes", "expr", "rel", "agg", "field", "where"].forEach(x => delete f[x]);
    if (calcV) holders.forEach(r => { r[k] = calcV.get(r) ?? ""; });
    f.type = type; let cleared = 0;
    if (type === "formula") { f.expr = ""; holders.forEach(r => delete r[k]); }
    if (type === "rollup") { f.rel = relOpts(ds)[0]?.[0] || ""; f.agg = "count"; holders.forEach(r => delete r[k]); }
    if (wasFile) holders.forEach(r => { if (Array.isArray(r[k])) r[k] = flat(r[k]); });
    if (type === "select") {
      f.options = [...new Set([...oldOpts, ...vals])];
      f.colors = Object.fromEntries(f.options.map((o, i) => [o, oldColors[o] || autoColorFor(i)]));
    }
    if (type === "ref") {
      f.ref = ref; const m = dsById(ref), have = new Set(masterValues(ref)), tk = titleKeyOf(m);
      vals.filter(v => !have.has(v)).forEach(v => { (m.records ||= []).push({ id: newId(), [tk]: v }); (m.colors ||= {})[v] ||= oldColors[v] || autoColorFor(masterValues(ref).length - 1); });
    }
    if (type === "number") holders.forEach(r => { if (blank(r[k])) return; const n = Number(String(r[k]).replace(/[,\s]/g, "")); if (isNaN(n)) { r[k] = ""; cleared++; } else r[k] = n; });
    if (type === "date") holders.forEach(r => { if (blank(r[k])) return; const m = String(r[k]).match(/\d{4}-\d{2}-\d{2}/); if (m) r[k] = m[0]; else { r[k] = ""; cleared++; } });
    if (type === "text" || type === "longtext") holders.forEach(r => { if (!blank(r[k])) r[k] = String(r[k]); });
    if (type === "file") holders.forEach(r => { if (!blank(r[k]) && !Array.isArray(r[k])) { r[k] = []; cleared++; } });
    if (cleared) setTimeout(() => toast(`${tname} 형식에 맞지 않는 값 ${cleared}개를 비웠습니다. 되돌리려면 직전 알림의 되돌리기를 누르세요.`), 2800);
  });
  pp.view = "main"; renderPropPop();
}
function ppDelete(btn) {
  const ds = ppDs(), f = ppField(); if (!ds || !f) return;
  if (!arm(btn, "한 번 더 누르면 삭제")) return;
  const k = f.key, label = f.label;
  closePropPop(false);
  ppUndoable(`‘${label}’ 항목을 지웠습니다.`, () => {
    ds.fields = ds.fields.filter(x => x.key !== k); if (ds.colW) delete ds.colW[k];
    (ds.records || []).forEach(r => delete r[k]); if (ed.mode === "record" && ed.ds === ds.id) delete ed.draft[k];
    if (ds.titleField === k) ds.titleField = "";
  });
}
function ppAdd(ctx) {
  Object.assign(pp, ctx); const ds = ppDs(); if (!ds) return;
  const labels = new Set((ds.fields || []).map(f => f.label));
  let label = "새 항목", i = 2; while (labels.has(label)) label = `새 항목 ${i++}`;
  const key = "f" + Date.now().toString(36);
  (ds.fields ||= []).push({ key, label, type: "text" }); if (ds.colW) ds.colW[key] = 160;
  persist(); render(); if (ed.mode === "record" || ed.mode === "fields") renderDrawer(true);
  openPropPop(key, "main", ctx);
  toast(`‘${label}’ 항목을 추가했습니다. 이름과 형식을 정하세요.`);
}
function propPopClick(e) {
  const t = e.target;
  const ins = t.closest("[data-ins]");                       /* 수식에 항목 넣기 */
  if (ins) { const ta = $("#ppExpr"); if (ta) { const a = ta.selectionStart ?? ta.value.length, b = ta.selectionEnd ?? a; ta.setRangeText(`{${ins.dataset.ins}}`, a, b, "end"); ta.focus(); ta.dispatchEvent(new Event("input", { bubbles: true })); } return; }
  const pt = t.closest("[data-ptype]"); if (pt) { ppRename(); const ty = pt.dataset.ptype; if (ty === "ref") { pp.view = "ref"; return renderPropPop(); } return ppConvert(ty); }
  const pr = t.closest("[data-pref]"); if (pr) return ppConvert("ref", pr.dataset.pref);
  if (t.id === "ppReq") { const f = ppField(); if (f) { if (t.checked) f.req = true; else delete f.req; ppCommit(); } return; }
  const a = t.closest("[data-pp]")?.dataset.pp;
  if (a === "back") { pp.view = "main"; renderPropPop(); }
  if (a === "del") ppDelete(t.closest("[data-pp]"));
  if (a === "colw-reset") { const ds = ppDs(); if (ds) { delete ds.colW; closePropPop(false); persist(); render(); toast("열 너비를 자동으로 되돌렸습니다."); } return; }
  if (a === "colw-fit") { const k = pp.key; closePropPop(false); const h = document.querySelector(`#board .col-rs[data-colrs="${CSS.escape(k)}"]`); h?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true })); return; }
  if (a === "filter") { const ds = ppDs(), k = pp.key; closePropPop(false); if (!ds) return; const L = dvFilters(ds.id), f = dsFields(ds).find(y => y.key === k); let i = L.findIndex(x => x.f === k);
    if (i < 0) { L.push({ f: k, k: dvfKind(f), v: dvfKind(f) === "pick" ? [] : "" }); i = L.length - 1; saveDvf(); }
    renderDataView(ds); openDvf(document.querySelector(`#board [data-dvf="${i}"]`), "edit", i); return; }
  if (a === "sort-asc" || a === "sort-desc") { dv.sortK = pp.key; dv.asc = a === "sort-asc"; closePropPop(); const ds = currentDs(); if (ds) renderDataView(ds); return; }
  if (a === "opts") {
    const k = pp.key, dsId = pp.ds, anchor = ppAnchor(); closePropPop();
    const ts = document.querySelector(`#drawer .tagsel[data-tag-key="${CSS.escape(k)}"]`);
    if (ts && (ed.mode === "record" || ed.mode === "fields")) { ts.scrollIntoView({ block: "nearest" }); ts.click(); }
    else if (anchor) openTagPop(anchor, { ...fieldProv(dsId, k, () => "", () => {}), keepAnchor: true });
  }
}
/* 어느 화면의 항목 메뉴인지: 기록 팝업·항목 구성 팝업(#drawer) 또는 목록 화면 머리글(#board) */
const ppCtxOf = el => el.closest("#drawer") ? (ed.mode === "record" || ed.mode === "fields" ? { ds: ed.ds, scope: "#drawer" } : null)
  : el.closest("#board") && currentDs() ? { ds: currentDs().id, scope: "#board" } : null;
document.addEventListener("click", e => {
  const add = e.target.closest?.("[data-pp-add]");
  if (add) { const c = ppCtxOf(add); if (c) { e.preventDefault(); e.stopPropagation(); ppAdd(c); } return; }
  const b = e.target.closest?.("[data-fk]"); if (!b) return;
  const c = ppCtxOf(b); if (!c) return;
  e.preventDefault(); e.stopPropagation();
  if ($("#proppop") && pp.key === b.dataset.fk && pp.scope === c.scope) return closePropPop();
  openPropPop(b.dataset.fk, "main", c);
}, true);
document.addEventListener("mousedown", e => { if ($("#proppop") && !e.target.closest("#proppop, [data-fk]")) closePropPop(); });
addEventListener("resize", () => placePropPop());
/* ---------- 항목 구성: 노션처럼 바로 보이고 바로 고치는 편집 화면 (바뀐 내용은 즉시 저장) ---------- */
const fGlyph = f => f.type === "ref" || f.refType ? "↗" : f.badge ? "◉" : GLYPH[f.type] || "Aa";
const fTypeName = (ds, f) => isCalcF(f) ? calcDesc(ds, f) : f.badge ? "상태" : f.type === "days" ? "기간 (자동 계산)" : f.type === "ref" ? `목록 참조 · ${dsById(f.ref)?.name || "목록 미지정"}` : (PTYPES.find(t => t[0] === f.type) || [, "텍스트"])[1];
function openFields(ds) {
  Object.assign(ed, { mode: "fields", ds: ds.id, tab: "gui", isNew: false, draft: null });
  showModal();
}
function fieldsHTML(ds) {
  const F = ds.fields || [], tk = titleKeyOf(ds), lbl = k => k === "@today" ? "기준일" : F.find(x => x.key === k)?.label || "—";
  const dateOpts = F.filter(dateF).map(f => [f.key, f.label]);
  const textOpts = F.filter(f => ["text", "select", "ref"].includes(f.type)).map(f => [f.key, f.label]);
  const sel = (k, opts, v) => `<select class="f" data-ls="${k}">${opts.map(([a, b]) => `<option value="${esc(a)}" ${String(v ?? "") === a ? "selected" : ""}>${esc(b)}</option>`).join("")}</select>`;
  const rows = F.map(f => {
    const df = dsFields(ds).find(x => x.key === f.key) || f;
    const roles = [f.key === ds.dateField && "기준 날짜", f.key === tk && "제목", f.auto && `자동 번호 ${f.auto}`, f.closes && "완료일", f.type === "days" && `${lbl(f.from)} → ${lbl(f.to)}`].filter(Boolean);
    const isOpt = df.type === "select" && !df.refType, opts = isOpt ? df.options || [] : [];
    return `<div class="fl-row" data-fdrag="${esc(f.key)}" draggable="true">
      <span class="fl-grip" title="끌어서 순서 바꾸기" aria-hidden="true">⠿</span>
      <button type="button" class="fl-glyph" data-fk="${esc(f.key)}" title="형식 바꾸기">${fGlyph(f)}</button>
      <input class="fl-name" data-lf="${esc(f.key)}" value="${esc(f.label)}" aria-label="항목 이름" spellcheck="false">
      <button type="button" class="fl-type" data-fk="${esc(f.key)}" title="형식·설정 바꾸기">${esc(fTypeName(ds, f))} <span aria-hidden="true">▾</span></button>
      <div class="fl-extra">${roles.map(r => `<span class="fl-role">${esc(r)}</span>`).join("")}${isOpt ? `<div class="tagsel fl-opts" role="button" tabindex="0" data-tag-key="${esc(f.key)}" title="선택지 편집 · 새로 만들기">${opts.slice(0, 8).map(o => chipFor(df, o)).join("")}${opts.length > 8 ? `<span class="tag-empty">+${opts.length - 8}</span>` : ""}${opts.length ? "" : `<span class="tag-empty">선택지 추가</span>`}</div>` : ""}</div>
      ${f.type !== "days" && !isCalcF(f) ? `<label class="fl-req" title="필수 입력"><input type="checkbox" data-lreq="${esc(f.key)}" ${f.req ? "checked" : ""}> 필수</label>` : `<span></span>`}
      <button type="button" class="ib fl-more" data-fk="${esc(f.key)}" aria-label="${esc(f.label)} 더 보기" title="이름·형식·삭제">⋯</button>
    </div>`;
  }).join("");
  const DF = dsFields(ds), recs = visibleRecs(ds).slice(-3).reverse().map(r => recView(ds, r));
  return `<div class="mp-doc">
    <input class="mp-title" data-ls="name" value="${esc(ds.name)}" placeholder="데이터 이름" aria-label="데이터 이름">
    <input class="mp-desc" data-ls="desc" value="${esc(ds.desc || "")}" placeholder="설명을 적어 두세요 (선택)" aria-label="설명">
    <div class="fl-head"><h5>항목 <span class="cnt">${F.length}개</span></h5><span class="fl-hint">이름은 그 자리에서 고치고, 형식(▾)을 눌러 바꾸고, ⠿를 끌어 순서를 바꿉니다. 바뀐 내용은 바로 저장됩니다.</span></div>
    <div class="fl-list">${rows}</div>
    <button type="button" class="pk-add" data-pp-add="1">＋ 항목 추가</button>
    <div class="fl-head"><h5>데이터 설정</h5></div>
    <div class="props">
      ${propRow("기준 날짜", GLYPH.date, sel("dateField", [["", "없음"], ...dateOpts], ds.dateField))}
      ${propRow("제목 항목", "Aa", sel("titleField", [["", "자동"], ...textOpts], ds.titleField))}
      ${propRow("기준일 이후 숨김", GLYPH.date, sel("asOfField", [["@date", "기준 날짜가 기준일 이후면 숨김"], ["", "숨기지 않음 (일정·계획 데이터)"], ...dateOpts.map(([k, l]) => [k, `${l}이(가) 기준일 이후면 숨김`])], ds.asOfField ?? "@date"))}
      ${propRow("반복 일정", "↻", repeatSetHTML(ds))}
      ${propRow("골라 쓰는 목록", "↗", `<label class="chk inline"><input type="checkbox" data-ls="master" ${ds.master ? "checked" : ""}> 다른 데이터의 ‘목록 참조’ 항목에서 먼저 보이는 목록 (고객사·부품처럼)</label>`)}
    </div>
    <div class="fl-head"><h5>미리보기</h5><span class="fl-hint">${recs.length ? `최근 기록 ${recs.length}건이 이렇게 보입니다.` : "아직 기록이 없어 머리글만 보입니다."} 목록 화면의 머리글을 눌러도 같은 메뉴가 열립니다.</span></div>
    <div class="tbl-wrap fl-prev"><table class="dv-tbl"><thead><tr>${DF.map(f => `<th class="${isNumF(f) ? "r" : ""}"><span class="th-l"><i>${fGlyph(f)}</i><span data-pvh="${esc(f.key)}">${esc(f.label)}</span></span></th>`).join("")}</tr></thead>
      <tbody>${recs.map(r => `<tr>${DF.map((f, i) => cellHTML(f, r[f.key], i === 0)).join("")}</tr>`).join("") || `<tr><td colspan="${DF.length}" class="dv-empty">기록이 없습니다.</td></tr>`}</tbody></table></div>
  </div>`;
}
function renderFields(dr, popTop, msgPrev, top) {
  const ds = dsById(ed.ds); if (!ds) return closeDrawer(true);
  dr.innerHTML = popTop(`<a href="#data-${esc(ds.id)}" data-a="close-nav">${esc(ds.name)}</a><span>/</span><b>항목 구성</b>`) + `
    <div class="body mp-body">${fieldsHTML(ds)}</div>
    <footer>${msgPrev || `<div class="msg">바뀐 내용은 바로 저장되고, 이 데이터를 쓰는 위젯 ${usageOf(ds.id)}개에 바로 반영됩니다.</div>`}
    <div class="row"><div><button class="btn danger" data-fl="ds-del" type="button">이 데이터 삭제</button></div>
    <div style="display:flex;gap:6px"><button class="btn primary" data-a="close" type="button">완료</button></div></div></footer>`;
  const nb = dr.querySelector(".body"); if (nb) nb.scrollTop = top;
}
$("#drawer").addEventListener("input", e => {
  if (e.target.id === "meName") { try { localStorage.setItem(ME_KEY, e.target.value.trim()); } catch (er) {} return; }
  if (e.target.id === "amQ" && ed.mode === "export") { am.q = e.target.value; const l = $("#drawer .am-list"); if (l) l.innerHTML = amListHTML(amFilter(allAttachments(), am.q.toLowerCase())); return; }
  if (ed.mode !== "fields") return;
  const ds = dsById(ed.ds), el = e.target; if (!ds) return;
  if (el.dataset.lf) {
    const f = ds.fields.find(x => x.key === el.dataset.lf), v = el.value.trim();
    const bad = !v ? "이름을 입력하세요" : ds.fields.some(x => x !== f && x.label === v) ? "같은 이름의 항목이 이미 있습니다" : "";
    el.classList.toggle("bad", !!bad); el.title = bad;
    if (bad || !f) return;
    const from = f.label; f.label = v; renameInExpr(ds, from, v); persist(); render();
    document.querySelectorAll(`#drawer [data-pvh="${CSS.escape(f.key)}"]`).forEach(x => { x.textContent = v; });
    return;
  }
  if (el.dataset.ls === "name" || el.dataset.ls === "desc") {
    if (el.dataset.ls === "name" && !el.value.trim()) return;
    ds[el.dataset.ls] = el.dataset.ls === "name" ? el.value.trim() : el.value;
    persist(); render();
    if (el.dataset.ls === "name") { const c = $("#drawer .crumb a"); if (c) c.textContent = ds.name; }
  }
});
$("#drawer").addEventListener("change", e => {
  if (ed.mode !== "fields") return;
  const ds = dsById(ed.ds), el = e.target; if (!ds) return;
  if (el.dataset.lf) { const f = ds.fields.find(x => x.key === el.dataset.lf); if (el.classList.contains("bad") && f) { el.value = f.label; el.classList.remove("bad"); el.title = ""; } return; }
  if (el.dataset.lreq) { const f = ds.fields.find(x => x.key === el.dataset.lreq); if (f) { if (el.checked) f.req = true; else delete f.req; persist(); render(); } return; }
  const k = el.dataset.ls; if (!k || k === "name" || k === "desc") return;
  if (k === "master") { if (el.checked) ds.master = true; else delete ds.master; } else ds[k] = el.value;
  persist(); render(); renderDrawer(true);
  toast(k === "master" ? (ds.master ? "골라 쓰는 목록으로 표시했습니다." : "골라 쓰는 목록 표시를 껐습니다.") : "데이터 설정을 바꿨습니다.");
});
$("#drawer").addEventListener("click", e => {
  const b = e.target.closest("[data-fl]"); if (!b || ed.mode !== "fields") return;
  if (b.dataset.fl === "ds-del") {
    const ds = dsById(ed.ds); if (!ds || !arm(b, `한 번 더 누르면 삭제 (위젯 ${usageOf(ds.id)}개 연결 끊김)`)) return;
    closeDrawer(true);
    withUndo(`‘${ds.name}’ 데이터베이스를 휴지통으로 옮겼습니다.`, () => { trashPut("ds", ds, { label: ds.name }); cfg.datasets = cfg.datasets.filter(x => x.id !== ds.id); });
  }
});
/* 항목 순서 끌어 옮기기: 항목 구성 화면의 줄, 목록 화면의 머리글 */
let fDrag = null;
const fdCtx = el => el.closest("#drawer") && ed.mode === "fields" ? ed.ds : el.closest("#board") && currentDs() ? currentDs().id : null;
const fdAfter = (r, e) => { const b = r.getBoundingClientRect(); return r.tagName === "TH" ? e.clientX > b.left + b.width / 2 : e.clientY > b.top + b.height / 2; };
const clearFd = () => document.querySelectorAll(".fd-before, .fd-after").forEach(x => x.classList.remove("fd-before", "fd-after"));
document.addEventListener("dragstart", e => {
  const r = e.target.closest?.("[data-fdrag]"); if (!r || e.target.closest?.("input")) return;
  const ds = fdCtx(r); if (!ds) return;
  fDrag = { ds, key: r.dataset.fdrag }; closePropPop(false);
  e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", r.dataset.fdrag);
  setTimeout(() => r.classList.add("dragging"), 0);
});
document.addEventListener("dragover", e => {
  if (!fDrag) return;
  const r = e.target.closest?.("[data-fdrag]"); clearFd();
  if (!r || fdCtx(r) !== fDrag.ds) return;
  e.preventDefault(); e.dataTransfer.dropEffect = "move";
  if (r.dataset.fdrag !== fDrag.key) r.classList.add(fdAfter(r, e) ? "fd-after" : "fd-before");
});
document.addEventListener("drop", e => {
  if (!fDrag) return;
  const r = e.target.closest?.("[data-fdrag]"), d = fDrag; fDrag = null; clearFd();
  if (!r || fdCtx(r) !== d.ds) return;
  e.preventDefault(); moveField(d.ds, d.key, r.dataset.fdrag, fdAfter(r, e));
});
document.addEventListener("dragend", () => { fDrag = null; clearFd(); document.querySelectorAll("[data-fdrag].dragging").forEach(x => x.classList.remove("dragging")); });
function moveField(dsId, from, to, after) {
  if (from === to) return;
  const ds = dsById(dsId), F = ds?.fields; if (!F) return;
  const [f] = F.splice(F.findIndex(x => x.key === from), 1);
  let j = F.findIndex(x => x.key === to); if (after) j++;
  F.splice(j, 0, f);
  persist(); render(); if (ed.mode === "fields" || ed.mode === "record") renderDrawer(true);
  toast(`‘${f.label}’ 항목의 순서를 옮겼습니다.`);
}

/* ---------- 검색되는 선택 목록: 팝업·편집 창의 선택 상자에 고를 것이 많으면(8개 이상) 검색창이 달린 목록으로 엽니다 ----------
   원래 <select>는 그대로 두고 값만 바꾼 뒤 input·change 이벤트를 보내므로, 기존 저장·다시 그리기 동작이 그대로 이어집니다. */
const SSEL_MIN = 8;
const ss = { sel: null, act: 0, items: [] };
function closeSSel(focus) { const s = ss.sel; $("#ssel")?.remove(); ss.sel = null; if (focus && s?.isConnected) s.focus(); }
function openSSel(sel) {
  closeSSel();
  ss.sel = sel;
  const all = [...sel.options].map(o => ({ v: o.value, l: o.textContent, g: o.parentElement?.tagName === "OPTGROUP" ? o.parentElement.label : "" }));
  const pop = document.createElement("div"); pop.id = "ssel"; pop.className = "tagpop ssel"; pop.setAttribute("role", "dialog");
  pop.innerHTML = `<input class="tp-q" id="sselQ" type="search" placeholder="검색 (${all.length}개)" autocomplete="off" aria-label="목록 검색"><div class="tp-list ssel-list" role="listbox"></div>`;
  document.body.appendChild(pop);
  const q = pop.querySelector("#sselQ"), list = pop.querySelector(".ssel-list");
  const draw = () => {
    const k = q.value.trim().toLowerCase();
    ss.items = all.filter(o => !k || o.l.toLowerCase().includes(k) || o.g.toLowerCase().includes(k));
    ss.act = Math.max(0, Math.min(ss.act, ss.items.length - 1));
    list.innerHTML = ss.items.map((o, i) => `<div class="tp-row${i === ss.act ? " act" : ""}" role="option" aria-selected="${o.v === sel.value}" data-sv="${i}"><span class="ssel-l">${esc(o.l)}</span>${o.v === sel.value ? `<b class="tp-check" aria-label="지금 값">✓</b>` : ""}</div>`).join("")
      || `<div class="tp-none">‘${esc(q.value.trim())}’에 맞는 항목이 없습니다.</div>`;
    list.querySelector(".act")?.scrollIntoView({ block: "nearest" });
  };
  ss.act = Math.max(0, all.findIndex(o => o.v === sel.value));
  draw();
  placeSSel();
  const pickAt = i => { const o = ss.items[i]; if (!o) return; const changed = sel.value !== o.v; sel.value = o.v; closeSSel(true);
    if (changed) { sel.dispatchEvent(new Event("input", { bubbles: true })); sel.dispatchEvent(new Event("change", { bubbles: true })); } };
  q.addEventListener("input", () => { ss.act = 0; draw(); });                  /* 목록만 다시 그림 → 한글 입력이 끊기지 않음 */
  q.addEventListener("keydown", e => {
    e.stopPropagation();
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); const n = Math.max(1, ss.items.length); ss.act = (ss.act + (e.key === "ArrowDown" ? 1 : -1) + n) % n; draw(); }
    else if (e.key === "Enter") { e.preventDefault(); pickAt(ss.act); }
    else if (e.key === "Escape") { e.preventDefault(); closeSSel(true); }
    else if (e.key === "Tab") closeSSel();
  });
  list.addEventListener("mousedown", e => e.preventDefault());               /* 검색창 포커스 유지 */
  list.addEventListener("click", e => { const row = e.target.closest("[data-sv]"); if (row) pickAt(+row.dataset.sv); });
  q.focus();
}
function placeSSel() {                                  /* 선택 상자 바로 아래(공간이 없으면 위)에 붙임 */
  const pop = $("#ssel"), sel = ss.sel; if (!pop || !sel) return;
  const r = sel.getBoundingClientRect();
  if (!sel.isConnected || r.bottom < 0 || r.top > innerHeight) return closeSSel();
  pop.style.width = Math.max(240, Math.min(420, r.width)) + "px";
  pop.style.left = Math.max(8, Math.min(innerWidth - pop.offsetWidth - 8, r.left)) + "px";
  pop.style.top = (r.bottom + pop.offsetHeight + 8 > innerHeight ? Math.max(8, r.top - pop.offsetHeight - 4) : r.bottom + 4) + "px";
}
const sselTarget = t => { const sel = t?.closest?.("select.f"); return sel && !sel.disabled && sel.closest("#drawer, #layBar") && sel.options.length >= SSEL_MIN ? sel : null; };
document.addEventListener("mousedown", e => {
  if ($("#ssel") && !e.target.closest("#ssel")) { const same = sselTarget(e.target) === ss.sel; closeSSel(); if (same) { e.preventDefault(); return; } }
  const sel = sselTarget(e.target); if (!sel || e.button !== 0) return;
  e.preventDefault(); sel.focus(); openSSel(sel);                              /* 기본 목록 대신 검색 목록 */
}, true);
document.addEventListener("keydown", e => {
  const sel = sselTarget(e.target); if (!sel || $("#ssel")) return;
  if ((e.key === "ArrowDown" && e.altKey) || e.key === "Enter" || e.key === " " || e.key === "F4") { e.preventDefault(); e.stopPropagation(); openSSel(sel); }
}, true);
addEventListener("resize", () => placeSSel());
document.addEventListener("scroll", e => { if ($("#ssel") && !e.target.closest?.("#ssel")) placeSSel(); }, true);   /* 화면이 움직이면 따라감 */
/* 독립 팝업 페이지 열기 (기록·새 페이지·새 데이터) */
function showModal() {
  ed.dirty = false;
  const w = $("#drawerWrap"); w.classList.add("as-modal"); w.classList.toggle("wide", !!ed.wide); w.hidden = false;
  document.body.classList.remove("editing"); document.body.classList.add("modal-open");
  renderDrawer();
  setTimeout(() => $("#drawer .body input:not([readonly]):not([type=checkbox]), #drawer .body select, #drawer .kind")?.focus({ preventScroll: true }), 40);
}
function openRecord(ds, rid, preset) {
  const r = rid ? (ds.records || []).find(x => x.id === rid) : null;
  Object.assign(ed, { mode: "record", ds: ds.id, tab: "gui", isNew: !r, draft: r ? structuredClone(r) : { ...newRecord(ds), ...(preset || {}) } });
  showModal();
}
/* 기록 팝업의 수식·롤업 칸을 입력에 맞춰 다시 계산 */
function refreshCalc() {
  if (ed.mode !== "record" || !ed.draft) return;
  const ds = dsById(ed.ds), F = dsFields(ds); if (!F.some(isCalcF)) return;
  const rv = recView(ds, ed.draft);
  F.filter(isCalcF).forEach(f => { const o = $(`#drawer [data-calc="${CSS.escape(f.key)}"]`); if (o) o.outerHTML = calcCellHTML(ds, f, rv); });
}
function saveRecord(next) {
  const ds = dsById(ed.ds), r = ed.draft;
  const miss = dsFields(ds).filter(f => f.req && f.type !== "days" && !isCalcF(f) && (blank(r[f.key]) || (f.type === "file" && !attList(r[f.key]).length))).map(f => f.label);
  if (miss.length) { msg(`필수 항목을 입력하세요: ${miss.join(", ")}`, false); return; }
  dsFields(ds).forEach(f => { if (f.type === "days" || isCalcF(f)) delete r[f.key]; });
  const notes = [];
  dsFields(ds).filter(f => f.refType && vals(r[f.key]).length).forEach(f => {
    const m = dsById(f.ref); if (!m) return;
    r[f.key] = normVals(vals(r[f.key]).map(x => x.trim()));
    vals(r[f.key]).forEach(v => { if (!masterValues(f.ref).includes(v)) { (m.records ||= []).push({ id: newId(), [titleKeyOf(m)]: v }); notes.push(`${m.name} 목록에 ‘${v}’ 추가`); } });
  });
  if (!ed.isNew) {
    const old = (ds.records || []).find(x => x.id === r.id), tk = titleKeyOf(ds), ov = old?.[tk], nv = r[tk];
    if (!blank(ov) && !blank(nv) && ov !== nv) {
      let n = 0;
      (cfg.datasets || []).forEach(d2 => (d2.fields || []).filter(f => f.type === "ref" && f.ref === ds.id).forEach(f => (d2.records || []).forEach(x => { if (swapVal(x, f.key, ov, nv)) n++; })));
      if (n) notes.push(`기존 기록 ${n}건의 ‘${ov}’를 ‘${nv}’(으)로 변경`);
    }
  }
  if (ed.isNew) { r.id = newId(); (ds.records ||= []).push(r); }
  else { const i = ds.records.findIndex(x => x.id === r.id); if (i >= 0) ds.records[i] = r; }
  persist(); render();
  if (notes.length) setTimeout(() => toast(notes.join(" · ")), next ? 0 : 2700);
  if (next) { ed.draft = newRecord(ds); ed.isNew = true; ed.dirty = false; renderDrawer(); msg("저장했습니다. 다음 기록을 입력하세요.", true); $("#drawer .body input:not([readonly]), #drawer .body select")?.focus(); }
  else { closeDrawer(true); toast(`저장했습니다. 연결된 위젯 ${usageOf(ds.id)}개에 반영됩니다.`); }
}

/* ---------- 엑셀 붙여넣기 · 가져오기: 표를 붙여넣거나 .xlsx/.csv 파일을 올리면 기록 여러 건을 한 번에 ----------
   첫 줄 머리글을 항목 이름과 자동으로 짝지은 뒤, 짝을 바꾸고 미리 본 다음 가져옵니다. */
const IMPORTABLE = f => !["days", "formula", "rollup", "file"].includes(f.type);
function parseTable(text) {
  text = String(text || "").replace(/\r\n?/g, "\n").replace(/^﻿/, "");
  const sep = text.includes("\t") ? "\t" : (text.split("\n")[0].match(/;/g) || []).length > (text.split("\n")[0].match(/,/g) || []).length ? ";" : ",";
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; continue; }
    if (c === '"' && cell === "") { q = true; continue; }
    if (c === sep) { row.push(cell); cell = ""; continue; }
    if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; continue; }
    cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(x => String(x).trim() !== ""));
}
const impNorm = s => String(s ?? "").replace(/[\s()（）·_\-.:/\[\]]/g, "").toLowerCase();
function impAutoMap(ds, head, hasHead) {
  const F = dsFields(ds).filter(IMPORTABLE), used = new Set();
  if (!hasHead) return head.map((_, i) => { const f = F[i]; if (f) used.add(f.key); return f?.key || ""; });
  return head.map(h => {
    const n = impNorm(h); if (!n) return "";
    const f = F.find(x => !used.has(x.key) && impNorm(x.label) === n) || F.find(x => !used.has(x.key) && impNorm(x.key) === n)
      || F.find(x => !used.has(x.key) && n.length >= 2 && (impNorm(x.label).includes(n) || n.includes(impNorm(x.label))));
    if (f) used.add(f.key); return f?.key || "";
  });
}
/* 값 하나를 항목 형식에 맞게: { v, bad } */
function impConv(f, raw) {
  if (raw instanceof Date) raw = isNaN(raw) ? "" : raw.toLocaleDateString("sv-SE");
  const s = String(raw ?? "").trim(); if (!s) return { v: "" };
  if (f.type === "number") { const m = s.replace(/[,\s]/g, "").match(/-?\d+(\.\d+)?/); return m ? { v: +m[0] } : { v: "", bad: true }; }
  if (f.type === "date") {
    if (/^\d{5}(\.\d+)?$/.test(s)) { const n = Math.floor(+s); if (n > 20000 && n < 80000) return { v: new Date(Date.UTC(1899, 11, 30) + n * 864e5).toISOString().slice(0, 10) }; }
    let m = s.match(/(\d{4})\s*[-./년]\s*(\d{1,2})\s*[-./월]\s*(\d{1,2})/); if (!m) { const k = s.match(/^(\d{2})[-./](\d{1,2})[-./](\d{1,2})$/); if (k) m = [, "20" + k[1], k[2], k[3]]; }
    if (!m) { const k = s.match(/^(\d{4})(\d{2})(\d{2})$/); if (k) m = k; }
    return m ? { v: `${m[1]}-${String(m[2]).padStart(2, "0")}-${String(m[3]).padStart(2, "0")}` } : { v: "", bad: true };
  }
  if (f.type === "select" && f.refType) { const parts = s.split(/\s*[,;\n]\s*/).filter(Boolean); return { v: f.single || parts.length < 2 ? parts[0] : normVals(parts) }; }
  return { v: s };
}
function openImport(ds, text) {
  Object.assign(ed, { mode: "import", ds: ds.id, isNew: false, draft: {}, imp: { rows: [], head: true, map: [], upsert: false, src: "" } });
  showModal();
  if (text) impLoad(parseTable(text), "붙여넣은 표");
}
function impLoad(rows, src) {
  const im = ed.imp, ds = dsById(ed.ds); if (!im || !ds) return;
  const w = Math.max(0, ...rows.map(r => r.length)); rows = rows.map(r => Array.from({ length: w }, (_, i) => r[i] ?? ""));
  im.rows = rows; im.src = src; im.map = impAutoMap(ds, rows[0] || [], im.head);
  renderDrawer();
}
/* 짝지은 결과 계산: 새 기록·고칠 기록·잘못된 값·새 선택지 */
function impPlan() {
  const im = ed.imp, ds = dsById(ed.ds), F = dsFields(ds), body = im.head ? im.rows.slice(1) : im.rows;
  const cols = im.map.map((k, i) => ({ i, f: F.find(f => f.key === k) })).filter(c => c.f);
  const tk = titleKeyOf(ds), byTitle = new Map((ds.records || []).map(r => [String(r[tk] ?? ""), r]));
  let bad = 0; const newOpts = new Map(), items = [];
  body.forEach(row => {
    const vals0 = {}, badK = new Set();
    cols.forEach(({ i, f }) => { const c = impConv(f, row[i]); if (c.bad) { bad++; badK.add(f.key); } if (!blank(c.v)) vals0[f.key] = c.v;
      if (f.type === "select" && !blank(c.v)) vals(c.v).forEach(v => { if (!(f.options || []).includes(v)) { if (!newOpts.has(f.key)) newOpts.set(f.key, new Set()); newOpts.get(f.key).add(v); } }); });
    if (!Object.keys(vals0).length) return;
    const hit = im.upsert && tk && !blank(vals0[tk]) ? byTitle.get(String(vals0[tk])) : null;
    items.push({ vals: vals0, badK, hit });
  });
  return { cols, items, bad, newOpts, nNew: items.filter(x => !x.hit).length, nUpd: items.filter(x => x.hit).length };
}
function importHTML() {
  const im = ed.imp, ds = dsById(ed.ds), F = dsFields(ds).filter(IMPORTABLE);
  const pick = `<div class="imp-in">
      <textarea class="f imp-paste" id="impText" placeholder="엑셀에서 표를 복사(Ctrl+C)한 뒤 여기를 누르고 붙여넣으세요 (Ctrl+V).&#10;첫 줄은 머리글(항목 이름)로 두면 자동으로 짝지어집니다."></textarea>
      <div class="imp-or"><span>또는</span><label class="btn">파일 고르기 (.xlsx · .csv)<input type="file" id="impFile" accept=".xlsx,.xls,.csv,.tsv,.txt" hidden></label></div>
      <div class="hint">목록 화면에서 바로 Ctrl+V를 눌러도 이 창이 열립니다. 날짜는 2026-10-08 · 2026.10.8 · 엑셀 날짜 모두 읽습니다.</div></div>`;
  if (!im.rows.length) return `<div class="mp-doc"><div class="mp-h">‘${esc(ds.name)}’에 기록 가져오기</div>${pick}</div>`;
  const P = impPlan(), head = im.head ? im.rows[0] : im.rows[0].map((_, i) => `열 ${i + 1}`), body = im.head ? im.rows.slice(1) : im.rows;
  const sample = i => body.slice(0, 3).map(r => String(r[i] ?? "")).filter(Boolean).join(" · ");
  const mapRows = head.map((h, i) => `<tr><td><b>${esc(h || `열 ${i + 1}`)}</b><div class="imp-s">${esc(sample(i).slice(0, 60))}</div></td><td class="imp-arrow">→</td>
    <td><select class="f" data-imap="${i}">${[["", "가져오지 않음"], ...F.map(f => [f.key, f.label])].map(([k, l]) => `<option value="${esc(k)}" ${im.map[i] === k ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></td></tr>`).join("");
  const pv = P.items.slice(0, 5);
  const prev = P.cols.length ? `<div class="tbl-wrap"><table class="dv-tbl imp-prev"><thead><tr><th></th>${P.cols.map(c => `<th>${esc(c.f.label)}</th>`).join("")}</tr></thead>
    <tbody>${pv.map(x => `<tr><td>${x.hit ? `<span class="tag c-orange">고침</span>` : `<span class="tag c-green">새로</span>`}</td>${P.cols.map(c => `<td class="${x.badK.has(c.f.key) ? "imp-bad" : ""}">${x.badK.has(c.f.key) ? "읽지 못함" : isPickF(c.f) ? chipFor(c.f, x.vals[c.f.key]) : esc(valText(x.vals[c.f.key]) ?? "")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : `<div class="empty">가져올 항목을 하나 이상 고르세요.</div>`;
  const tk = titleKeyOf(ds), tl = fieldOf(ds, tk)?.label;
  return `<div class="mp-doc"><div class="mp-h">‘${esc(ds.name)}’에 기록 가져오기 <span class="imp-src">${esc(im.src)} · ${body.length}줄</span></div>
    <div class="imp-opts"><label class="chk inline"><input type="checkbox" id="impHead" ${im.head ? "checked" : ""}> 첫 줄은 머리글</label>
      ${tk && im.map.includes(tk) ? `<label class="chk inline"><input type="checkbox" id="impUpsert" ${im.upsert ? "checked" : ""}> 같은 ‘${esc(tl)}’ 기록이 있으면 새로 만들지 않고 고치기</label>` : ""}
      <button type="button" class="btn sm" data-a="imp-reset">다른 표 고르기</button></div>
    <div class="fl-head"><h5>항목 짝짓기</h5><span class="fl-hint">왼쪽은 표의 열, 오른쪽은 이 데이터베이스의 항목입니다.</span></div>
    <div class="tbl-wrap"><table class="imp-map">${mapRows}</table></div>
    <div class="fl-head"><h5>미리보기</h5><span class="fl-hint">새로 ${P.nNew}건${P.nUpd ? ` · 고침 ${P.nUpd}건` : ""}${P.bad ? ` · <b class="calc-bad">형식이 맞지 않아 비울 값 ${P.bad}개</b>` : ""}${P.newOpts.size ? ` · 새 선택지 ${[...P.newOpts.values()].reduce((n, s) => n + s.size, 0)}개 추가 (${esc([...P.newOpts.values()].flatMap(s => [...s]).slice(0, 4).join(", "))}${[...P.newOpts.values()].reduce((n, s) => n + s.size, 0) > 4 ? " …" : ""})` : ""}</span></div>
    ${prev}</div>`;
}
function renderImport(dr, popTop, msgPrev, top) {
  const ds = dsById(ed.ds); if (!ds) return closeDrawer(true);
  const P = ed.imp.rows.length ? impPlan() : null, n = P ? P.nNew + P.nUpd : 0;
  dr.innerHTML = popTop(`<a href="#data-${esc(ds.id)}" data-a="close-nav">${esc(ds.name)}</a><span>/</span><b>가져오기</b>`) + `
    <div class="body mp-body">${importHTML()}</div>
    <footer>${msgPrev || `<div class="msg"></div>`}<div class="row"><div></div>
    <div style="display:flex;gap:6px"><button class="btn" data-a="close" type="button">취소</button><button class="btn primary" data-a="save" type="button" ${n ? "" : "disabled"}>${n ? `${n}건 가져오기` : "가져오기"}</button></div></div></footer>`;
  const nb = dr.querySelector(".body"); if (nb) nb.scrollTop = top;
  if (!ed.imp.rows.length) setTimeout(() => $("#impText")?.focus(), 30);
}
function doImport() {
  const ds = dsById(ed.ds), P = impPlan(); if (!P.items.length) return;
  const snap = JSON.stringify(cfg);
  P.newOpts.forEach((set, k) => { const f = dsFields(ds).find(x => x.key === k);
    if (f.refType) { const m = dsById(f.ref); set.forEach(v => (m.records ||= []).push({ id: newId(), [titleKeyOf(m)]: v })); }
    else { const raw = ds.fields.find(x => x.key === k); raw.options = [...(raw.options || []), ...set]; } });
  P.items.forEach(x => {
    if (x.hit) { Object.assign(x.hit, x.vals); return; }
    const r = { ...newRecord(ds), ...x.vals, id: newId() }; (ds.records ||= []).push(r);
  });
  persist(); closeDrawer(true); render();
  toast(`${P.nNew ? `${P.nNew}건을 새로 넣었습니다` : ""}${P.nNew && P.nUpd ? " · " : ""}${P.nUpd ? `${P.nUpd}건을 고쳤습니다` : ""}.`, () => { cfg = JSON.parse(snap); persist(); render(); toast("가져오기를 되돌렸습니다."); });
}
async function impReadFile(file) {
  const name = file.name, low = name.toLowerCase();
  try {
    if (/\.(xlsx|xls)$/.test(low)) {
      const X = await loadXLSX(), wb = X.read(await file.arrayBuffer(), { type: "array", cellDates: true });
      const ws = wb.Sheets[wb.SheetNames[0]];
      impLoad(X.utils.sheet_to_json(ws, { header: 1, defval: "", raw: true }).filter(r => r.some(x => String(x).trim() !== "")), `${name} · ${wb.SheetNames[0]}`);
    } else {
      const buf = await file.arrayBuffer(); let t = new TextDecoder("utf-8").decode(buf);
      if (t.includes("�")) { try { t = new TextDecoder("euc-kr").decode(buf); } catch (e) {} }   /* 엑셀이 저장한 한글 CSV */
      impLoad(parseTable(t), name);
    }
  } catch (e) { msg(`파일을 읽지 못했습니다: ${e.message}`, false); }
}
$("#drawer").addEventListener("input", e => {
  if (ed.mode !== "import") return;
  if (e.target.id === "impText" && e.target.value.trim()) { const rows = parseTable(e.target.value); if (rows.length) impLoad(rows, "붙여넣은 표"); }
});
$("#drawer").addEventListener("change", e => {
  if (ed.mode !== "import") return; const t = e.target, im = ed.imp;
  if (t.id === "impFile" && t.files?.[0]) return impReadFile(t.files[0]);
  if (t.dataset.imap !== undefined) { const k = t.value, i = +t.dataset.imap; if (k) im.map = im.map.map((x, j) => j !== i && x === k ? "" : x); im.map[i] = k; return renderDrawer(true); }
  if (t.id === "impHead") { im.head = t.checked; im.map = impAutoMap(dsById(ed.ds), im.rows[0] || [], im.head); return renderDrawer(true); }
  if (t.id === "impUpsert") { im.upsert = t.checked; return renderDrawer(true); }
});
$("#drawer").addEventListener("click", e => { if (ed.mode === "import" && e.target.closest('[data-a="imp-reset"]')) { ed.imp.rows = []; ed.imp.map = []; renderDrawer(); } });
/* 목록 화면에서 바로 Ctrl+V: 표 모양이면 가져오기 창 */
document.addEventListener("paste", e => {
  const ds = currentDs(); if (!ds || ed.mode || lay.on || e.target.closest?.("input, textarea, [contenteditable]")) return;
  const t = e.clipboardData?.getData("text/plain") || ""; if (!t.includes("\t") && t.trim().split(/\r?\n/).length < 2) return;
  e.preventDefault(); openImport(ds, t);
});
/* ---------- 기록 복제 · 템플릿 기록 ----------
   복제: 지금 기록을 그대로 새 기록 초안으로 (번호·날짜·상태·완료일·첨부는 새로)
   템플릿: 자주 쓰는 값 묶음을 데이터베이스에 저장(ds.tpls)해 두고 새 기록을 그 값으로 시작 */
function recSeed(ds, src) {
  const F = dsFields(ds), o = {};
  F.forEach(f => {
    const v = src[f.key]; if (blank(v) || (Array.isArray(v) && !v.length)) return;
    if (f.type === "days" || isCalcF(f) || f.type === "file" || f.badge || (f.type === "text" && f.auto) || f.key === ds.dateField || (f.type === "date" && f.closes)) return;
    o[f.key] = structuredClone(v);
  });
  return o;
}
function dupRecord() {
  const ds = dsById(ed.ds); if (!ds || !ed.draft) return;
  const seed = recSeed(ds, ed.draft), tk = titleKeyOf(ds);
  const referenced = (cfg.datasets || []).some(d2 => (d2.fields || []).some(x => x.type === "ref" && x.ref === ds.id));
  if (referenced && !blank(seed[tk])) seed[tk] = `${seed[tk]} (사본)`;             /* 다른 데이터가 고르는 목록은 이름이 겹치지 않게 */
  ed.hist = []; ed.draft = { ...newRecord(ds), ...seed }; ed.isNew = true; ed.dirty = true;
  renderDrawer(); msg("복제한 새 기록입니다. 번호·날짜·상태는 새로 정했습니다. 고칠 곳을 고친 뒤 저장하세요.", true);
}
function saveAsTpl() {
  const ds = dsById(ed.ds); if (!ds || !ed.draft) return;
  const vals0 = recSeed(ds, ed.draft); if (!Object.keys(vals0).length) { msg("템플릿에 담을 값이 없습니다.", false); return; }
  const tk = titleKeyOf(ds), base = String(vals0[tk] || dsFields(ds).filter(f => isPickF(f) && !f.badge && !blank(vals0[f.key])).slice(0, 2).map(f => valText(vals0[f.key])).join(" · ") || ds.name).slice(0, 30);
  let name = base, i = 2; while ((ds.tpls || []).some(t => t.name === name)) name = `${base} ${i++}`;
  (ds.tpls ||= []).push({ id: "t" + Date.now().toString(36), name, vals: vals0 });
  persist(); msg(`템플릿 ‘${name}’(으)로 저장했습니다. 목록의 ‘＋ 새 항목 추가’ 옆 ▾에서 고를 수 있습니다.`, true);
}
const tplPickHTML = ds => (ds.tpls || []).length ? `<select class="f tpl-pick" id="recTpl" aria-label="템플릿에서 채우기"><option value="">템플릿에서 채우기…</option>${ds.tpls.map(t => `<option value="${esc(t.id)}">${esc(t.name)}</option>`).join("")}</select>` : "";
$("#drawer").addEventListener("change", e => {
  if (e.target.id !== "recTpl" || ed.mode !== "record") return;
  const ds = dsById(ed.ds), t = (ds.tpls || []).find(x => x.id === e.target.value); if (!t) return;
  Object.assign(ed.draft, structuredClone(t.vals)); ed.dirty = true; renderDrawer(); msg(`템플릿 ‘${t.name}’ 값으로 채웠습니다.`, true);
});
$("#drawerWrap").addEventListener("click", e => {
  const b = e.target.closest("[data-a]"); if (!b || ed.mode !== "record") return;
  if (b.dataset.a === "rec-dup") { e.preventDefault(); dupRecord(); }
  if (b.dataset.a === "rec-tpl") { e.preventDefault(); saveAsTpl(); }
});
/* 목록 화면: ＋ 새 항목 추가 ▾ → 빈 기록 / 템플릿 고르기 · 이름 바꾸기 · 지우기 */
function closeTplMenu() { $("#tplmenu")?.remove(); }
function openTplMenu(btn) {
  closeTplMenu(); const ds = currentDs(); if (!ds) return;
  const m = document.createElement("div"); m.id = "tplmenu"; m.className = "tagpop tplmenu"; m.setAttribute("role", "menu");
  const draw = () => {
    const T = ds.tpls || [];
    m.innerHTML = `<div class="tp-list"><button type="button" class="tp-row" data-tpl-use=""><span class="pp-t"><i>＋</i>빈 기록</span></button>
      ${T.map(t => `<div class="tp-row tpl-row"><button type="button" class="tpl-use" data-tpl-use="${esc(t.id)}"><span class="pp-t"><i>⧉</i>${esc(t.name)}</span></button><span class="tpl-acts"><button type="button" class="ib" data-tpl-ren="${esc(t.id)}" title="이름 바꾸기" aria-label="${esc(t.name)} 이름 바꾸기">✎</button><button type="button" class="ib" data-tpl-del="${esc(t.id)}" title="지우기" aria-label="${esc(t.name)} 지우기">✕</button></span></div>`).join("")}</div>
      <div class="tp-foot"><span class="tp-hint">${T.length ? "템플릿은 기록 팝업의 ‘템플릿으로 저장’으로 만듭니다." : "아직 템플릿이 없습니다. 기록을 열고 ‘템플릿으로 저장’을 누르세요."}</span></div>`;
  };
  draw(); document.body.appendChild(m);
  const r = btn.getBoundingClientRect(); m.style.width = "280px";
  m.style.left = Math.max(8, Math.min(innerWidth - 288, r.right - 280)) + "px"; m.style.top = r.bottom + 4 + "px";
  m.addEventListener("click", e => {
    const u = e.target.closest("[data-tpl-use]"); if (u) { const t = (ds.tpls || []).find(x => x.id === u.dataset.tplUse); closeTplMenu(); openRecord(ds, null, t ? structuredClone(t.vals) : undefined); if (t) setTimeout(() => msg(`템플릿 ‘${t.name}’ 값으로 시작했습니다.`, true), 0); return; }
    const d = e.target.closest("[data-tpl-del]"); if (d) { const t = ds.tpls.find(x => x.id === d.dataset.tplDel); ds.tpls = ds.tpls.filter(x => x !== t); persist(); draw(); toast(`템플릿 ‘${t.name}’을(를) 지웠습니다.`); return; }
    const rn = e.target.closest("[data-tpl-ren]"); if (rn) { const t = ds.tpls.find(x => x.id === rn.dataset.tplRen), row = rn.closest(".tpl-row");
      row.innerHTML = `<input class="f tpl-name" value="${esc(t.name)}" aria-label="템플릿 이름">`; const inp = row.querySelector("input"); inp.focus(); inp.select();
      const done = ok => { const v = inp.value.trim(); if (ok && v) { t.name = v; persist(); } draw(); };
      inp.addEventListener("keydown", ev => { ev.stopPropagation(); if (ev.isComposing || ev.keyCode === 229) return; if (ev.key === "Enter") done(true); if (ev.key === "Escape") done(false); });
      inp.addEventListener("blur", () => done(true)); }
  });
}
document.addEventListener("mousedown", e => { if ($("#tplmenu") && !e.target.closest("#tplmenu, [data-a='rec-tplmenu']")) closeTplMenu(); });
addEventListener("hashchange", closeTplMenu);
/* ---------- 기록 안 댓글 · 이력: 담당자 의견(r._c)과 저장 이력(cfg.changelog)을 시간순으로 ---------- */
function commentsHTML(ds, r) {
  const C = (r._c || []).map((c, i) => ({ ...c, i, k: "c" }));
  const L = (cfg.changelog || []).filter(e => e.ds === ds.id && e.rid === r.id && e.kind !== "comment").map(e => ({ ...e, k: "log" }));
  const all = [...C, ...L].sort((a, b) => String(b.at).localeCompare(String(a.at)));
  const me = myName();
  const item = x => x.k === "c"
    ? `<li class="cm-i"><div class="cm-h"><b>${esc(x.who || "이름 없음")}</b><span class="cm-t" title="${esc(new Date(x.at).toLocaleString("ko-KR"))}">${esc(agoText(x.at))}</span>${!x.who || x.who === me ? `<button type="button" class="ib cm-del" data-cm-del="${x.i}" title="지우기" aria-label="의견 지우기">✕</button>` : ""}</div><div class="cm-b">${esc(x.t).replace(/\n/g, "<br>")}</div></li>`
    : `<li class="cm-i cm-log"><div class="cm-h"><span class="cm-k">${esc((KIND[x.kind] || [""])[0])}</span>${x.who ? `<b>${esc(x.who)}</b>` : ""}<span class="cm-t" title="${esc(new Date(x.at).toLocaleString("ko-KR"))}">${esc(agoText(x.at))}</span></div>${x.kind === "edit" ? `<div class="cm-f">${x.fields.map(f => `<span>${esc(f.l)}: <s>${esc(f.from)}</s> → ${esc(f.to)}</span>`).join("")}${x.more ? `<span>외 ${x.more}개 항목</span>` : ""}</div>` : ""}</li>`;
  return `<hr class="mp-sep"><div class="cm" id="cmBox"><div class="mp-textlbl">댓글 · 이력 <span class="bl-n">${C.length ? `의견 ${C.length}개` : "의견을 남기면 시간순으로 쌓입니다"}${L.length ? ` · 변경 ${L.length}건` : ""}</span></div>
    <div class="cm-new"><textarea class="f" id="cmText" rows="2" placeholder="의견 남기기 — 예: 고객 회신 완료 (Enter 저장 · Shift+Enter 줄바꿈)"></textarea><button type="button" class="btn sm primary" data-a="cm-add">남기기</button></div>
    ${me ? "" : `<div class="hint">‘설정 · 데이터 저장’에서 내 이름을 정하면 의견에 이름이 함께 남습니다.</div>`}
    ${all.length ? `<ol class="cm-list">${all.slice(0, 60).map(item).join("")}</ol>` : ""}</div>`;
}
function cmRefresh() { const ds = dsById(ed.ds), box = $("#cmBox"); if (!box || !ds) return; const t = document.createElement("div"); t.innerHTML = commentsHTML(ds, ed.draft); box.replaceWith(t.querySelector(".cm")); }
function addComment() {
  const ds = dsById(ed.ds), ta = $("#cmText"); if (!ds || !ta || ed.isNew) return;
  const t = ta.value.trim(); if (!t) return ta.focus();
  const saved = (ds.records || []).find(x => x.id === ed.draft.id); if (!saved) return;
  const c = { at: new Date().toISOString(), who: myName(), t };
  (saved._c ||= []).push(c); ed.draft._c = structuredClone(saved._c);
  cfg.changelog = [{ at: c.at, who: c.who, ds: ds.id, rid: saved.id, title: saved[titleKeyOf(ds)] || "", kind: "comment", text: t.slice(0, 80) }, ...(cfg.changelog || [])].slice(0, LOG_MAX);
  persist(); render(); cmRefresh(); setTimeout(() => $("#cmText")?.focus(), 0);
}
$("#drawerWrap").addEventListener("click", e => {
  if (ed.mode !== "record") return;
  if (e.target.closest('[data-a="cm-add"]')) { e.preventDefault(); addComment(); return; }
  const d = e.target.closest("[data-cm-del]"); if (!d) return;
  e.preventDefault(); if (!arm(d, "지우기?")) return;
  const ds = dsById(ed.ds), saved = (ds.records || []).find(x => x.id === ed.draft.id), c = ed.draft._c?.[+d.dataset.cmDel]; if (!saved || !c) return;
  saved._c = (saved._c || []).filter(x => !(x.at === c.at && x.t === c.t)); if (!saved._c.length) delete saved._c;
  ed.draft._c = ed.draft._c.filter(x => x !== c); if (!ed.draft._c.length) delete ed.draft._c;
  persist(); render(); cmRefresh();
});
$("#drawer").addEventListener("keydown", e => {
  if (e.target.id !== "cmText" || e.key !== "Enter" || e.shiftKey || e.isComposing || e.keyCode === 229) return;
  e.preventDefault(); e.stopPropagation(); addComment();
});
/* ---------- 데이터 구성 편집 ---------- */
const FTYPES = [["text", "텍스트"], ["longtext", "긴 텍스트"], ["number", "숫자"], ["date", "날짜"], ["select", "선택 목록 (직접 적은 선택지)"], ["ref", "관계 (다른 데이터베이스에서 고르기)"], ["days", "기간 (일수 자동 계산)"], ["file", "사진 · 파일 (대시보드 폴더에 복사)"]];
function schemaHTML() {
  const d = ed.draft, F = d.fields || [];
  const dateOpts = F.filter(dateF).map(f => [f.key, f.label]);
  const textOpts = F.filter(f => f.type === "text" || f.type === "select" || f.type === "ref").map(f => [f.key, f.label]);
  return `<div class="mp-doc">
    <input class="mp-title" data-b="name" data-t="text" placeholder="데이터베이스 이름 (예: 측정기 교정, 고객사)" value="${esc(d.name)}" aria-label="데이터베이스 이름">
    <div class="props">
      ${ed.isNew ? propRow("시작 형태", "▦", `<span class="seg"><button type="button" class="${d.master ? "" : "on"}" data-a="schema-tpl" data-tpl="record">기록형 (날짜·내용·담당·상태)</button><button type="button" class="${d.master ? "on" : ""}" data-a="schema-tpl" data-tpl="list">목록형 (이름·비고)</button></span>`) : ""}
      ${propRow("설명", "Aa", inp({ t: "text" }, "desc", d.desc))}
      ${propRow("골라 쓰는 목록", "↗", `<label class="chk inline"><input type="checkbox" data-b="master" data-t="chk" data-re="1" ${d.master ? "checked" : ""}> 다른 데이터의 ‘목록 참조’ 항목에서 먼저 보이는 목록 (고객사·부품처럼)</label>`)}
      ${propRow("기준 날짜", GLYPH.date, inp({ t: "sel", o: [["", "없음"], ...dateOpts] }, "dateField", d.dateField || ""))}
      ${propRow("제목 항목", "Aa", inp({ t: "sel", o: [["", "자동"], ...textOpts] }, "titleField", d.titleField || ""))}
      ${propRow("기준일 이후 숨김", GLYPH.date, inp({ t: "sel", o: [["@date", "기준 날짜가 기준일 이후면 숨김"], ["", "숨기지 않음 (일정·계획 데이터)"], ...dateOpts.map(([k, l]) => [k, `${l}이(가) 기준일 이후면 숨김`])] }, "asOfField", d.asOfField ?? "@date"))}
      ${ed.isNew ? propRow("현황 페이지", "▤", `<label class="chk inline"><input type="checkbox" data-b="__withPage" data-t="chk" ${d.__withPage ? "checked" : ""}> 이 데이터의 현황 대시보드 페이지도 함께 만들기</label>`) : ""}
    </div>
  <div class="sec"><h5>입력 항목 <span class="cnt">${F.length}개 · 이름을 바꿔도 기존 기록과 위젯 연결은 유지됩니다</span></h5>
    <div class="rows">${F.map((f, r) => {
      const p = `fields.${r}`;
      let g = fld({ l: "항목 이름", t: "text", w: 2 }, `${p}.label`, f.label) + fld({ l: "형식", t: "sel", o: FTYPES, re: 1 }, `${p}.type`, f.type || "text") + fld({ l: "필수 입력", t: "chk" }, `${p}.req`, f.req);
      if (f.type === "select") g += fld({ l: "선택지 (쉼표로 구분)", t: "list", w: 3 }, `${p}.options`, f.options) + fld({ l: "상태 뱃지로 표시", t: "chk" }, `${p}.badge`, f.badge);
      if (f.type === "ref") g += fld({ l: "참조할 목록", t: "sel", o: [["", "선택"], ...(cfg.datasets || []).filter(x => x.id !== d.id).sort((a, b) => (b.master ? 1 : 0) - (a.master ? 1 : 0)).map(x => [x.id, (x.master ? "목록 · " : "") + x.name])], w: 4 }, `${p}.ref`, f.ref || "");
      if (f.type === "text" || !f.type) g += fld({ l: "자동 번호 접두어 (예: CL-{YY}-  · 비우면 사용 안 함)", t: "text", w: 4 }, `${p}.auto`, f.auto);
      if (f.type === "days") g += fld({ l: "시작 날짜", t: "sel", o: [["", "선택"], ["@today", "기준일 (오늘)"], ...dateOpts], w: 2 }, `${p}.from`, f.from || "") + fld({ l: "종료 날짜", t: "sel", o: [["", "선택"], ["@today", "기준일 (오늘)"], ...dateOpts], w: 2 }, `${p}.to`, f.to || "");
      if (f.type === "date") g += fld({ l: "완료일 (기준일보다 뒤면 미완료로 계산)", t: "chk", w: 4 }, `${p}.closes`, f.closes);
      return `<div class="icard"><div class="icard-h"><span>${esc(f.label || "새 항목")}</span><span>${rowBtns("fields", r)}</span></div><div class="cgrid">${g}</div></div>`;
    }).join("")}</div>
    <button type="button" class="btn sm" data-a="r-add" data-p="fields" data-type="__field">＋ 항목 추가</button></div></div>`;
}
const DB_TPL = {
  record: () => ({ master: undefined, dateField: "date", titleField: "title", asOfField: undefined, __withPage: true, fields: [
    { key: "date", label: "날짜", type: "date", req: true }, { key: "title", label: "내용", type: "text", req: true },
    { key: "owner", label: "담당", type: "text" }, { key: "status", label: "상태", type: "select", options: ["진행중", "완료"], badge: true }] }),
  list: () => ({ master: true, dateField: "", titleField: "name", asOfField: "", __withPage: false, fields: [
    { key: "name", label: "이름", type: "text", req: true }, { key: "note", label: "비고", type: "text" }] })
};
function openSchema(ds, master) {
  if (!ds && master) {
    Object.assign(ed, { mode: "schema", tab: "gui", isNew: true, ds: null, draft: { id: "", name: "", desc: "", master: true, dateField: "", titleField: "name", asOfField: "", records: [], fields: [
      { key: "name", label: "이름", type: "text", req: true }, { key: "note", label: "비고", type: "text" }] } });
    return showModal();
  }
  Object.assign(ed, { mode: "schema", tab: "gui", isNew: !ds, ds: ds?.id, draft: ds ? structuredClone(ds) : {
    id: "", name: "", desc: "", dateField: "date", titleField: "title", __withPage: true, records: [], fields: [
      { key: "date", label: "날짜", type: "date", req: true }, { key: "title", label: "내용", type: "text", req: true },
      { key: "owner", label: "담당", type: "text" }, { key: "status", label: "상태", type: "select", options: ["진행중", "완료"], badge: true }] } });
  showModal();
}
function saveSchema() {
  const d = ed.draft;
  if (!d.name?.trim()) { msg("데이터베이스 이름을 입력하세요.", false); return; }
  if (!(d.fields || []).length) { msg("입력 항목을 하나 이상 추가하세요.", false); return; }
  if (d.fields.some(f => !f.label?.trim())) { msg("이름이 비어 있는 항목이 있습니다.", false); return; }
  if (d.fields.some(f => f.type === "days" && (!f.from || !f.to))) { msg("기간 항목의 시작·종료 날짜를 고르세요.", false); return; }
  if (d.fields.some(f => f.type === "ref" && !f.ref)) { msg("목록 참조 항목의 참조할 목록을 고르세요.", false); return; }
  const withPage = ed.isNew && d.__withPage; delete d.__withPage;
  if (ed.isNew) {
    d.id = "ds-" + Date.now().toString(36); d.records = []; (cfg.datasets ||= []).push(d);
    if (withPage) cfg.pages.push({ id: "p-" + Date.now().toString(36), title: `${d.name.trim()} 현황`, group: "데이터 현황", desc: `${d.name.trim()} 데이터 기록을 자동 집계합니다.`, widgets: buildDataWidgets(d) });
  }
  else { const i = cfg.datasets.findIndex(x => x.id === d.id); cfg.datasets[i] = d; }
  persist(); closeDrawer(true);
  if (location.hash !== "#data-" + d.id) location.hash = "data-" + d.id; else render();
  toast("데이터 구성을 저장했습니다.");
}
/* ---------- 메모 데이터 ---------- */
function memoDs(create) {
  let m = dsById("memos") || (cfg.datasets || []).find(d => /메모/.test(d.name));
  if (!m && create) {
    m = { id: "memos", name: "메모 · 회의록", desc: "회의 결과, 공지, 이슈 등 짧은 메모를 기록합니다.", dateField: "date", titleField: "content", records: [], fields: [
      { key: "date", label: "작성일", type: "date", req: true }, { key: "category", label: "구분", type: "select", options: ["회의", "일정", "공지", "기타"] },
      { key: "content", label: "내용", type: "text", req: true }, { key: "owner", label: "작성자", type: "text" }, { key: "detail", label: "상세 내용", type: "longtext" }] };
    (cfg.datasets ||= []).push(m);
  }
  return m;
}
$("#board").addEventListener("submit", e => {
  const f = e.target.closest(".memo-add"); if (!f) return;
  e.preventDefault();
  const text = f.memo.value.trim(); if (!text) return;
  const wi = +f.dataset.wi, w = boardPage?.widgets?.[wi], ds = dsById(w?.src?.ds); if (!ds) return;
  const rec = newRecord(ds);
  (w.src.filter || []).forEach(c => { if (c.op === "=" && c.f && !blank(c.v)) rec[c.f] = c.v; });
  rec[w.src.main || titleKeyOf(ds)] = text;
  const miss = dsFields(ds).filter(x => x.req && x.type !== "days" && blank(rec[x.key]));
  if (miss.length) { openRecord(ds, null, rec); return; }        /* 필수 항목이 더 있으면 팝업에서 마저 입력 */
  rec.id = "r" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  (ds.records ||= []).push(rec); persist(); render();
  toast(`${ds.name} 데이터에 메모를 저장했습니다.`);
  setTimeout(() => $(`#board .memo-add[data-wi="${wi}"] input`)?.focus(), 30);
});

/* ---------- 새로 만들기: 템플릿 + 페이지 자동 구성 ---------- */
const KINDS = [
  ["blank", "빈 대시보드 페이지", "위젯을 하나씩 끌어다 놓아 직접 구성합니다.", "직접 구성"],
  ["dataset", "데이터베이스", "기록과 목록을 담는 표를 만듭니다. 측정기 교정·심사 지적 같은 기록도, 고객사·부품 같은 목록도 모두 데이터베이스이며 서로 관계로 연결됩니다.", "표 · 입력 양식 · 관계"],
  ["tasks", "업무 · 일정 페이지", "할 일 목록, 기한 D-Day, 상태별 분포를 업무 일정 데이터베이스와 연결해 만듭니다.", "할 일 · 진행률 · 전체 목록"],
  ["data", "데이터 현황 페이지", "고른 데이터베이스의 월별 추이, 항목별 순위, 최근 기록을 자동으로 구성합니다.", "지표 · 추이 · 순위 · 표"]
];
const catFieldOf = ds => dsFields(ds).find(f => f.type === "select" && !f.badge);
/* ---------- 새로 만들기 템플릿: 페이지 템플릿(지금 있는 데이터베이스로 자동 구성) · 데이터베이스 템플릿(데이터베이스 + 현황 페이지) ---------- */
const pickDs = (...ids) => ids.map(dsById).find(Boolean) || (cfg.datasets || []).find(d => !d.master);
/* 위젯 하나 만들기: 종류의 기본 연결(defaultSrc)을 고른 데이터베이스로 맞추고 덮어쓸 값 적용 */
function mkW(type, ds, over = {}) {
  const w = { type, span: 6, title: TYPES[type]?.name || "", ...(ds ? { src: defaultSrc(type, ds.id) } : {}) };
  const { src, ...rest } = over;
  return Object.assign(w, rest, src ? { src: { ...w.src, ...src } } : {});
}
const rulesFor = ds => { const r = autoAlertRules().filter(x => x.ds === ds.id); return r.length ? r : autoAlertRules(); };
const monthlyAvg = ds => { const df = ds.dateField; if (!df) return 0; const yms = lastMonths(6), recs = visibleRecs(ds); const n = yms.map(ym => recs.filter(r => ymOf(r[df]) === ym).length); const used = n.filter(x => x); return used.length ? Math.round(used.reduce((a, b) => a + b, 0) / used.length) : 0; };
const kpiOf = ds => buildDataWidgets(ds)[0];
const TPL = {
  quality: { lv: 3, sec: "page", name: "품질 현황판", tag: "지표 · 게이지 · 전년 비교 · 파레토 · 알림", desc: "한 데이터베이스(예: 고객 클레임)의 이번 달 지표, 목표 게이지, 전년 비교, 유형 파레토, 고객사 비중, 이상 알림을 한 페이지로 만듭니다.",
    pick: () => pickDs("claims", "defects"), needDs: true,
    build: ds => { const avg = monthlyAvg(ds); return [kpiOf(ds),
      mkW("gauge", ds, { span: 4, title: `이번 달 ${ds.name}`, unit: "건", goal: avg || 10, lowerIsBetter: true, src: { agg: "count", field: "", period: "thisMonth" } }),
      mkW("yoy", ds, { span: 8, title: `${ds.name} 전년 비교`, unit: "건", lowerIsBetter: true }),
      mkW("pareto", ds, { title: `${ds.name} 유형 파레토`, unit: "건", mark: 80 }),
      mkW("donut", ds, { title: `${ds.name} 비중`, unit: "건" }),
      { type: "alerts", span: 12, title: "이상 알림", limit: 4, rules: rulesFor(ds) }]; } },
  analysis: { lv: 2, sec: "page", name: "불량 분석 페이지", tag: "파레토 · 히트맵 · 비중 · 순위 · 표", desc: "어떤 불량이 어디서 많이 나는지 파레토와 교차 히트맵으로 보고, 비중과 최근 기록까지 한 번에 봅니다.",
    pick: () => pickDs("defects", "claims"), needDs: true,
    build: ds => [mkW("pareto", ds, { span: 7, title: "불량 유형 파레토", unit: "건" }), mkW("donut", ds, { span: 5, title: "비중", unit: "건" }),
      mkW("heatmap", ds, { span: 12, title: "교차 분석 히트맵", unit: "건" }), ...buildDataWidgets(ds).filter(w => w.type === "table")] },
  schedule: { lv: 2, sec: "page", name: "일정 · 마감 관리", tag: "D-Day · 달력 · 간트 · 알림", desc: "다가오는 마감을 D-Day로, 한 달 일정을 달력으로, 기간은 간트 차트로 보고 지난 기한은 알림으로 모읍니다.",
    pick: () => pickDs("tasks", "ppap", "auditplan"), needDs: true,
    build: ds => [mkW("dday", ds, { title: "다가오는 마감" }), mkW("calendar", ds, { title: `${ds.name} 달력` }), mkW("gantt", ds, { span: 12, title: `${ds.name} 일정` }),
      { type: "alerts", span: 12, title: "기한 알림", limit: 5, rules: rulesFor(ds) }] },
  board: { lv: 2, sec: "page", name: "진행 단계 보드", tag: "단계 보드 · 간트 · 지표", desc: "8D·PPAP처럼 단계가 있는 업무를 칸반 보드로 끌어 옮기며 관리하고, 일정은 간트로 함께 봅니다.",
    pick: () => pickDs("capa", "ppap", "tasks"), needDs: true,
    build: ds => [kpiOf(ds), mkW("kanban", ds, { span: 12, title: `${ds.name} 단계 보드` }), mkW("gantt", ds, { span: 12, title: `${ds.name} 일정` })] },
  spc: { lv: 3, sec: "page", name: "공정 관리도 페이지", tag: "관리도 · 성적표 · 알림", desc: "검사 불량률 p 관리도와 Cpk 관리도·성적표로 공정이 관리 상태인지 확인합니다.",
    pick: () => pickDs("inspections", "cpk"), needDs: true,
    build: ds => { const cpk = (cfg.datasets || []).find(d => (d.fields || []).some(f => f.type === "number" && /cpk/i.test(f.key + f.label)));
      return [mkW("control", ds, { span: 12, title: `${ds.name} 관리도` }),
        ...(cpk ? [mkW("control", cpk, { title: "Cpk 관리도", lsl: 1.33 }), mkW("scorecard", cpk, { title: "Cpk 하위 특성" }), { type: "alerts", span: 12, title: "공정 이상 알림", limit: 4, rules: rulesFor(cpk) }] : [])]; } },
  supplier: { lv: 2, sec: "page", name: "협력사 관리 페이지", tag: "성적표 · 등급 비중 · 순위 · 표", desc: "협력사 평가 점수를 성적표로 보고, 등급 비중과 공정별 분포, 최근 평가 기록을 함께 봅니다.",
    pick: () => pickDs("suppliers"), needDs: true,
    build: ds => { const grade = (dsFields(ds).find(f => f.type === "select" && /등급|grade/i.test(f.label + f.key)) || {}).key;
      return [mkW("scorecard", ds, { title: `${ds.name} 성적표` }), mkW("donut", ds, { title: "등급 비중", unit: "곳", src: grade ? { by: grade, period: "all" } : {} }), ...buildDataWidgets(ds).filter(w => w.type !== "kpi")]; } },
  meeting: { lv: 3, sec: "page", name: "주간 회의 페이지", tag: "알림 · D-Day · 변경 내역 · 메모 · 빠른 입력 · 링크", desc: "주간 회의 때 한 화면에서 보는 페이지: 이상 알림, 다가오는 일정, 이번 주 변경 내역, 회의 메모, 빠른 입력, 자주 쓰는 링크.",
    pick: () => null, needDs: false,
    build: () => [DEFAULTS.alerts(), DEFAULTS.dday(), DEFAULTS.history(), DEFAULTS.note(), DEFAULTS.quickform(), DEFAULTS.links()] },
  /* 데이터베이스 템플릿 */
  calib: { lv: 2, sec: "db", name: "측정기 교정 관리", tag: "데이터베이스 + 현황 페이지", desc: "측정기마다 최근·차기 교정일을 관리하고, 30일 안에 교정할 측정기와 기한이 지난 측정기를 알림으로 보여 줍니다.",
    db: () => ({ dateField: "next", titleField: "name", asOfField: "", fields: [
      { key: "no", label: "관리번호", type: "text", auto: "GA-" }, { key: "name", label: "측정기명", type: "text", req: true },
      { key: "kind", label: "구분", type: "select", options: ["버니어 캘리퍼스", "마이크로미터", "하이트 게이지", "다이얼 게이지", "토크 렌치", "기타"] },
      ...(dsById("lines") ? [{ key: "line", label: "사용 라인", type: "ref", ref: "lines" }] : []), ...(dsById("people") ? [{ key: "owner", label: "담당", type: "ref", ref: "people" }] : [{ key: "owner", label: "담당", type: "text" }]),
      { key: "last", label: "최근 교정일", type: "date" }, { key: "next", label: "차기 교정일", type: "date", req: true },
      { key: "status", label: "상태", type: "select", options: ["사용중", "교정중", "폐기"], badge: true }, { key: "note", label: "비고", type: "longtext" }] }),
    build: ds => [...buildDataWidgets(ds).filter(w => w.type !== "bar"),
      { type: "alerts", span: 6, title: "교정 알림", limit: 6, rules: [{ ds: ds.id, label: "교정 기한 지남", level: "critical", filter: [{ f: "next", op: "<", v: "today" }, { f: "status", op: "!=", v: "폐기" }] }, { ds: ds.id, label: "30일 안에 교정", level: "warning", filter: [{ f: "next", op: ">=", v: "today" }, { f: "next", op: "<=", v: "today+30" }, { f: "status", op: "!=", v: "폐기" }] }] },
      mkW("calendar", ds, { title: "교정 일정", src: { date: "next", title: "name", color: "kind" } })] },
  auditfind: { lv: 3, sec: "db", name: "고객 심사 지적사항", tag: "데이터베이스 + 현황 페이지", desc: "고객·인증 심사에서 받은 지적을 등급·기한·조치 상태로 관리하고, 단계 보드로 조치 진행을 봅니다.",
    db: () => ({ dateField: "date", titleField: "content", fields: [
      { key: "no", label: "지적번호", type: "text", auto: "AU-{YY}-" }, { key: "date", label: "심사일", type: "date", req: true },
      ...(dsById("customers") ? [{ key: "customer", label: "고객사", type: "ref", ref: "customers" }] : [{ key: "customer", label: "고객사", type: "text" }]),
      { key: "content", label: "지적 내용", type: "text", req: true }, { key: "level", label: "등급", type: "select", options: ["중결함", "경결함", "관찰"] },
      ...(dsById("people") ? [{ key: "owner", label: "담당", type: "ref", ref: "people" }] : [{ key: "owner", label: "담당", type: "text" }]),
      { key: "due", label: "조치 기한", type: "date" }, { key: "status", label: "상태", type: "select", options: ["접수", "조치중", "완료"], badge: true },
      { key: "closed", label: "완료일", type: "date", closes: true }, { key: "lead", label: "처리 기간(일)", type: "days", from: "date", to: "closed" }] }),
    build: ds => [...buildDataWidgets(ds), mkW("kanban", ds, { span: 12, title: "조치 단계 보드", src: { col: "status", filter: [] } }), { type: "alerts", span: 6, title: "기한 알림", limit: 5, rules: rulesFor(ds) }] },
  change4m: { lv: 3, sec: "db", name: "변경점 (4M) 관리", tag: "데이터베이스 + 현황 페이지", desc: "사람·설비·재료·방법(4M) 변경을 부품별로 기록하고, 고객 승인과 적용 진행을 관리합니다.",
    db: () => ({ dateField: "date", titleField: "content", fields: [
      { key: "no", label: "변경번호", type: "text", auto: "CH-{YY}-" }, { key: "date", label: "접수일", type: "date", req: true },
      { key: "kind", label: "구분 (4M)", type: "select", options: ["Man (사람)", "Machine (설비)", "Material (재료)", "Method (방법)"] },
      ...(dsById("parts") ? [{ key: "part", label: "부품", type: "ref", ref: "parts" }] : [{ key: "part", label: "부품", type: "text" }]),
      { key: "content", label: "변경 내용", type: "text", req: true }, { key: "approval", label: "고객 승인", type: "select", options: ["불필요", "신청", "승인", "반려"] },
      { key: "apply", label: "적용일", type: "date" }, { key: "status", label: "상태", type: "select", options: ["검토", "진행중", "완료"], badge: true }] }),
    build: ds => [...buildDataWidgets(ds), mkW("donut", ds, { title: "4M 구분 비중", unit: "건", src: { by: "kind", period: "all" } }), mkW("kanban", ds, { title: "진행 보드", src: { col: "status", filter: [] } })] },
  training: { lv: 2, sec: "db", name: "교육 · 자격 이력", tag: "데이터베이스 + 현황 페이지", desc: "담당자별 교육·자격 이력과 만료일을 관리하고, 만료가 다가오는 자격을 알림으로 보여 줍니다.",
    db: () => ({ dateField: "date", titleField: "course", fields: [
      { key: "date", label: "교육일", type: "date", req: true }, ...(dsById("people") ? [{ key: "person", label: "이름", type: "ref", ref: "people" }] : [{ key: "person", label: "이름", type: "text" }]),
      { key: "course", label: "교육·자격명", type: "text", req: true }, { key: "kind", label: "구분", type: "select", options: ["사내 교육", "사외 교육", "자격"] },
      { key: "hours", label: "시간", type: "number" }, { key: "expire", label: "만료일", type: "date" }, { key: "note", label: "비고", type: "text" }] }),
    build: ds => [...buildDataWidgets(ds).filter(w => w.type !== "hbar"), mkW("donut", ds, { title: "구분 비중", unit: "건", src: { by: "kind", period: "all" } }),
      { type: "alerts", span: 6, title: "자격 만료 알림", limit: 6, rules: [{ ds: ds.id, label: "60일 안에 만료", level: "warning", filter: [{ f: "expire", op: ">=", v: "today" }, { f: "expire", op: "<=", v: "today+60" }] }, { ds: ds.id, label: "만료됨", level: "serious", filter: [{ f: "expire", op: "<", v: "today" }] }] }] }
};

function buildTasksWidgets(ds, cat) {
  const src = defaultSrc("tasks", ds.id), m = src.map, badge = dsFields(ds).find(f => f.badge), cf = catFieldOf(ds);
  const base = cat && cf ? [{ f: cf.key, op: "=", v: cat }] : [];
  const open = badge?.options?.includes("완료") ? [{ f: badge.key, op: "!=", v: "완료" }] : [];
  const k = (label, filter, extra = {}) => ({ label, unit: "건", src: { ds: ds.id, agg: "count", period: "all", filter, ...extra } });
  const items = [k("진행 중", [...base, ...open])];
  if (m.due) items.push({ ...k("기한 초과", [...base, ...open, { f: m.due, op: "<", v: "today" }]), goal: 0, lowerIsBetter: true, status: "auto" });
  if (m.due) items.push(k("이번 달 마감", [...base], { period: "thisMonth", dateField: m.due }));
  if (open.length) items.push(k("완료", [...base, { f: badge.key, op: "=", v: "완료" }]));
  const out = [{ type: "kpi", items }, { type: "tasks", span: 7, title: "진행 중인 업무", src: { ...src, filter: [...base, ...open], limit: 8 } }];
  if (badge) out.push({ type: "progress", span: 5, title: "상태별 분포", src: { ds: ds.id, by: badge.key, period: "all", filter: base } });
  out.push({ type: "table", span: 12, title: "전체 목록", src: { ds: ds.id, period: "all", filter: base, cols: dsFields(ds).filter(f => f.type !== "longtext" && f.type !== "file").map(f => f.key), sort: m.due || "", asc: true } });
  return out;
}
/* ===== 추가 템플릿 (간단 → 고급) ===== */
const dsIf = (...ids) => ids.map(dsById).find(Boolean);
const refFieldTo = (ds, target) => (dsFields(ds).find(f => f.refType && f.ref === target) || {}).key || "";
Object.assign(TPL, {
  kpionly: { lv: 1, sec: "page", name: "핵심 숫자만", tag: "지표", desc: "고른 데이터베이스의 이번 달·전체·미결 건수만 크게 보여 주는 가장 간단한 현황판입니다.",
    pick: () => pickDs("claims", "defects"), needDs: true, build: ds => [kpiOf(ds)] },
  listpage: { lv: 1, sec: "page", name: "목록 + 바로 입력", tag: "빠른 입력 · 표", desc: "위에서 바로 입력하고 아래 표로 최근 기록을 확인합니다. 엑셀 시트처럼 쓰는 페이지입니다.",
    pick: () => pickDs("tasks", "defects"), needDs: true,
    build: ds => [mkW("quickform", ds, { span: 12, title: `${ds.name} 바로 입력` }), { ...buildDataWidgets(ds).find(w => w.type === "table"), title: `${ds.name} 최근 기록`, src: { ...buildDataWidgets(ds).find(w => w.type === "table").src, limit: 15 } }] },
  notes: { lv: 1, sec: "page", name: "메모장", tag: "메모 · 빠른 입력", desc: "짧은 메모를 바로 쓰고 최근 메모를 색 태그와 함께 봅니다.",
    pick: () => null, needDs: false,
    build: () => { const m = memoDs(true); return [mkW("quickform", m, { span: 12, title: "메모 쓰기" }), { type: "note", span: 12, title: "최근 메모", src: { ...defaultSrc("note", m.id), limit: 12 } }]; } },
  linkpage: { lv: 1, sec: "page", name: "바로가기 모음", tag: "링크 · D-Day", desc: "자주 가는 고객 포털·사내 시스템·공유 폴더와 중요한 날짜를 한 페이지에 모읍니다.",
    pick: () => null, needDs: false,
    build: () => [{ ...DEFAULTS.links(), span: 8, items: [{ label: "고객 품질 포털", url: "https://", desc: "클레임 접수·8D 회신" }, { label: "사내 MES", url: "http://", desc: "공정 불량·검사 실적" }, { label: "품질보증 공유 폴더", url: "\\\\server\\QA", desc: "성적서·보고서" }, { label: "IATF 16949 매뉴얼", url: "https://", desc: "품질 매뉴얼" }] },
      { type: "dday", span: 4, title: "중요한 날", items: [{ label: "고객 감사", date: isoIn(30), note: "" }, { label: "인증 사후심사", date: isoIn(60), note: "" }] }] },
  monthly: { lv: 2, sec: "page", name: "월간 보고", tag: "지표 · 전년 비교 · 비중 · 파레토 · 표", desc: "월간 품질 보고에 쓰는 구성: 이번 달 지표, 전년 대비, 구성 비중, 유형 파레토, 이번 달 기록 목록.",
    pick: () => pickDs("claims", "defects"), needDs: true,
    build: ds => { const t = buildDataWidgets(ds).find(w => w.type === "table"); return [kpiOf(ds), mkW("yoy", ds, { span: 12, title: `${ds.name} 전년 비교`, unit: "건", lowerIsBetter: true }),
      mkW("donut", ds, { title: "이번 달 구성", unit: "건", src: { period: "thisMonth" } }), mkW("pareto", ds, { title: "이번 달 유형 파레토", unit: "건", src: { period: "thisMonth" } }),
      { ...t, title: "이번 달 기록", src: { ...t.src, period: "thisMonth", limit: 20 } }]; } },
  bycustomer: { lv: 2, sec: "page", name: "고객사별 현황", tag: "비중 · 누적 막대 · 히트맵 · 표", desc: "고객사(또는 관계 항목)별로 월별 추이, 비중, 유형 교차 분석을 봅니다.",
    pick: () => pickDs("claims", "ppap"), needDs: true,
    build: ds => { const by = refFieldTo(ds, "customers") || (dsFields(ds).find(f => f.refType) || catFieldOf(ds) || {}).key || ""; const type = (dsFields(ds).find(f => f.key !== by && (f.refType || isTagF(f))) || {}).key || "";
      return [mkW("bar", ds, { span: 8, title: "월별 (고객사별)", unit: "건", stacked: true, src: { x: "month", months: 12, series: by } }), mkW("donut", ds, { span: 4, title: "고객사 비중", unit: "건", src: { by, period: "last12m" } }),
        mkW("heatmap", ds, { span: 12, title: "고객사 × 유형", unit: "건", src: { by, by2: type, period: "last12m" } }), ...buildDataWidgets(ds).filter(w => w.type === "table")]; } },
  executive: { lv: 3, sec: "page", name: "경영 보고 대시보드", tag: "여러 데이터 지표 · 게이지 · 전년 비교 · 알림", desc: "클레임·불량률·8D·품질 비용처럼 여러 데이터베이스의 핵심 지표를 한 장에 모은 보고용 대시보드입니다.",
    pick: () => null, needDs: false,
    build: () => { const cl = dsIf("claims"), ins = dsIf("inspections"), ca = dsIf("capa"), cq = dsIf("copq"), out = [];
      const items = [cl && { label: "이번 달 고객 클레임", unit: "건", src: { ds: cl.id, agg: "count", period: "thisMonth", compare: true, spark: true, filter: [] } },
        ins && { label: "이번 달 불량률", unit: "PPM", goal: 3000, lowerIsBetter: true, status: "auto", src: { ds: ins.id, agg: "ratio", field: "defects", field2: "inspected", scale: 1000000, period: "thisMonth", spark: true, filter: [] } },
        ca && { label: "진행 중 8D", unit: "건", src: { ds: ca.id, agg: "count", period: "all", filter: [{ f: "status", op: "!=", v: "완료" }] } },
        cq && { label: "이번 달 품질 비용", unit: "만원", src: { ds: cq.id, agg: "sum", field: "amount", period: "thisMonth", compare: true, spark: true, filter: [] } }].filter(Boolean);
      out.push(items.length ? { type: "kpi", items } : kpiOf(pickDs()));
      if (cl) out.push(mkW("gauge", cl, { span: 4, title: "이번 달 클레임 (목표)", unit: "건", goal: monthlyAvg(cl) || 10, lowerIsBetter: true, src: { agg: "count", field: "", period: "thisMonth" } }), mkW("yoy", cl, { span: 8, title: "고객 클레임 전년 비교", unit: "건", lowerIsBetter: true }));
      if (cq) out.push(mkW("yoy", cq, { span: 12, title: "품질 비용 전년 비교", unit: "만원", lowerIsBetter: true, src: { agg: "sum", field: "amount" } }));
      out.push({ type: "alerts", span: 6, title: "주의할 것", limit: 3, rules: autoAlertRules() }, { type: "history", span: 6, title: "최근 변경", limit: 8 });
      return out; } },
  control: { lv: 3, sec: "page", name: "품질 종합 관제", tag: "알림 · 관리도 · 파레토 · 히트맵 · 보드 · 간트 · 달력", desc: "품질 현황 전체를 한 화면에서: 이상 알림, 공정 관리도, 불량 파레토·히트맵, 8D 보드, PPAP 일정, 업무 달력까지 모두 담습니다.",
    pick: () => null, needDs: false,
    build: () => { const ins = dsIf("inspections"), cl = dsIf("claims", "defects"), df = dsIf("defects"), ca = dsIf("capa"), pp = dsIf("ppap"), tk = dsIf("tasks"), out = [{ type: "alerts", span: 12, title: "이상 알림", limit: 3, rules: autoAlertRules() }];
      if (ins) out.push(mkW("control", ins, { span: 12, title: "검사 불량률 관리도" }));
      if (cl) out.push(mkW("pareto", cl, { title: `${cl.name} 파레토`, unit: "건" }));
      if (df) out.push(mkW("heatmap", df, { title: "불량 교차 분석", unit: "건" }));
      if (ca) out.push(mkW("kanban", ca, { span: 12, title: "8D 단계 보드" }));
      if (pp) out.push(mkW("gantt", pp, { span: 12, title: "PPAP 일정" }));
      if (tk) out.push(mkW("calendar", tk, { span: 6, title: "업무 달력" }), mkW("tasks", tk, { span: 6, title: "할 일" }));
      return out; } },
  /* ----- 데이터베이스 템플릿 ----- */
  checklist: { lv: 1, sec: "db", name: "체크리스트", tag: "데이터베이스 + 할 일 페이지", desc: "할 일·점검 항목을 담당·기한·상태로 관리하는 가장 간단한 데이터베이스입니다.",
    db: () => ({ dateField: "due", titleField: "item", asOfField: "", fields: [{ key: "item", label: "항목", type: "text", req: true }, { key: "group", label: "분류", type: "select", options: ["일반", "고객", "내부", "협력사"] },
      ...(dsById("people") ? [{ key: "owner", label: "담당", type: "ref", ref: "people" }] : [{ key: "owner", label: "담당", type: "text" }]), { key: "due", label: "기한", type: "date" },
      { key: "status", label: "상태", type: "select", options: ["할 일", "진행중", "완료"], badge: true }, { key: "note", label: "메모", type: "text" }] }),
    build: ds => buildTasksWidgets(ds) },
  contacts: { lv: 1, sec: "db", name: "연락처 · 거래처", tag: "목록 데이터베이스", desc: "고객·협력사 담당자 연락처를 모아 두고 다른 데이터베이스에서 골라 씁니다.",
    db: () => ({ master: true, dateField: "", titleField: "name", asOfField: "", fields: [{ key: "name", label: "이름", type: "text", req: true }, { key: "company", label: "회사", type: "text" }, { key: "dept", label: "부서 · 직책", type: "text" },
      { key: "role", label: "구분", type: "select", options: ["고객 품질", "협력사 품질", "사내", "인증기관", "기타"] }, { key: "phone", label: "전화", type: "text" }, { key: "email", label: "이메일", type: "text" }, { key: "note", label: "메모", type: "text" }] }),
    build: ds => [{ type: "table", span: 12, title: `${ds.name}`, src: { ds: ds.id, period: "all", filter: [], cols: ["name", "company", "dept", "role", "phone", "email"], limit: 50 } }, mkW("donut", ds, { span: 6, title: "구분 비중", unit: "명", src: { by: "role", period: "all" } })] },
  minutes: { lv: 1, sec: "db", name: "회의록", tag: "데이터베이스 + 메모·할 일 페이지", desc: "회의 날짜·참석자·결정 사항을 기록하고, 후속 조치를 담당·기한으로 챙깁니다.",
    db: () => ({ dateField: "date", titleField: "title", fields: [{ key: "date", label: "회의일", type: "date", req: true }, { key: "title", label: "제목", type: "text", req: true },
      { key: "kind", label: "구분", type: "select", options: ["정기 회의", "고객 회의", "협력사 회의", "기타"] }, ...(dsById("people") ? [{ key: "attend", label: "참석자", type: "ref", ref: "people" }] : []),
      { key: "decision", label: "결정 사항", type: "longtext" }, { key: "action", label: "후속 조치", type: "text" }, ...(dsById("people") ? [{ key: "owner", label: "조치 담당", type: "ref", ref: "people", single: true }] : [{ key: "owner", label: "조치 담당", type: "text" }]),
      { key: "due", label: "조치 기한", type: "date" }, { key: "status", label: "상태", type: "select", options: ["진행중", "완료"], badge: true }] }),
    build: ds => [{ type: "note", span: 6, title: "최근 회의", src: { ds: ds.id, period: "all", filter: [], main: "title", pre: "date", post: "kind", limit: 8 } },
      { type: "tasks", span: 6, title: "후속 조치", src: { ds: ds.id, period: "all", filter: [{ f: "status", op: "!=", v: "완료" }], limit: 8, map: { title: "action", owner: "owner", due: "due", status: "status" } } },
      ...buildDataWidgets(ds).filter(w => w.type === "table")] },
  equip: { lv: 2, sec: "db", name: "설비 점검 기록", tag: "데이터베이스 + 현황 페이지", desc: "라인 설비의 일상·정기 점검 결과를 기록하고, 이상이 나온 점검을 알림으로 봅니다.",
    db: () => ({ dateField: "date", titleField: "equip", fields: [{ key: "date", label: "점검일", type: "date", req: true }, { key: "equip", label: "설비", type: "text", req: true },
      ...(dsById("lines") ? [{ key: "line", label: "라인", type: "ref", ref: "lines", single: true }] : [{ key: "line", label: "라인", type: "text" }]), { key: "kind", label: "점검 구분", type: "select", options: ["일상", "주간", "월간", "정기"] },
      { key: "result", label: "결과", type: "select", options: ["정상", "주의", "불량"], badge: true }, ...(dsById("people") ? [{ key: "owner", label: "점검자", type: "ref", ref: "people", single: true }] : []), { key: "action", label: "조치 내용", type: "text" }] }),
    build: ds => [...buildDataWidgets(ds), mkW("donut", ds, { title: "점검 결과 비중", unit: "건", src: { by: "result", period: "last3m" } }),
      { type: "alerts", span: 6, title: "점검 이상", limit: 6, rules: [{ ds: ds.id, label: "최근 30일 불량", level: "serious", filter: [{ f: "result", op: "=", v: "불량" }, { f: "date", op: ">=", v: "today-30" }] }, { ds: ds.id, label: "최근 30일 주의", level: "warning", filter: [{ f: "result", op: "=", v: "주의" }, { f: "date", op: ">=", v: "today-30" }] }] }] },
  returns: { lv: 2, sec: "db", name: "고객 반품 · 특채", tag: "데이터베이스 + 현황 페이지", desc: "고객 반품·특채·선별 요청을 부품·수량·비용으로 기록하고 처리 기간을 관리합니다.",
    db: () => ({ dateField: "date", titleField: "reason", fields: [{ key: "date", label: "접수일", type: "date", req: true },
      ...(dsById("customers") ? [{ key: "customer", label: "고객사", type: "ref", ref: "customers", single: true }] : [{ key: "customer", label: "고객사", type: "text" }]),
      ...(dsById("parts") ? [{ key: "part", label: "부품", type: "ref", ref: "parts", single: true }] : [{ key: "part", label: "부품", type: "text" }]),
      { key: "kind", label: "구분", type: "select", options: ["반품", "특채", "선별"] }, { key: "qty", label: "수량", type: "number" }, { key: "cost", label: "비용(만원)", type: "number" }, { key: "reason", label: "사유", type: "text", req: true },
      { key: "status", label: "상태", type: "select", options: ["접수", "처리중", "완료"], badge: true }, { key: "closed", label: "완료일", type: "date", closes: true }, { key: "lead", label: "처리 기간(일)", type: "days", from: "date", to: "closed" }] }),
    build: ds => [...buildDataWidgets(ds), mkW("pareto", ds, { title: "부품별 반품 수량", unit: "개", src: { agg: "sum", field: "qty", by: "part", period: "last12m" } }), mkW("donut", ds, { title: "구분 비중", unit: "건", src: { by: "kind", period: "last12m" } })] },
  csr: { lv: 2, sec: "db", name: "고객 요구사항 (CSR)", tag: "데이터베이스 + 보드 페이지", desc: "고객사별 특별 요구사항(CSR)을 조항·적용 부서·반영 상태로 관리합니다.",
    db: () => ({ dateField: "review", titleField: "req", asOfField: "", fields: [...(dsById("customers") ? [{ key: "customer", label: "고객사", type: "ref", ref: "customers", req: true }] : [{ key: "customer", label: "고객사", type: "text", req: true }]),
      { key: "doc", label: "문서명", type: "text" }, { key: "clause", label: "조항", type: "text" }, { key: "req", label: "요구사항", type: "text", req: true }, { key: "dept", label: "적용 부서", type: "select", options: ["품질보증", "생산", "구매", "개발", "물류"] },
      { key: "status", label: "반영 상태", type: "select", options: ["검토 전", "반영중", "완료"], badge: true }, { key: "review", label: "차기 검토일", type: "date" }] }),
    build: ds => [mkW("kanban", ds, { span: 12, title: "반영 단계 보드", src: { col: "status", filter: [] } }), mkW("donut", ds, { title: "고객사별", unit: "건", src: { by: "customer", period: "all" } }), mkW("calendar", ds, { title: "검토 일정" }), ...buildDataWidgets(ds).filter(w => w.type === "table")] },
  fmea: { lv: 3, sec: "db", name: "FMEA 관리", tag: "데이터베이스 + 위험 우선순위 페이지", desc: "공정 FMEA의 고장 모드별 심각도·발생도·검출도와 조치 우선순위(AP)를 관리하고 개선 조치를 추적합니다.",
    db: () => ({ dateField: "due", titleField: "mode", asOfField: "", fields: [{ key: "step", label: "공정 단계", type: "text", req: true }, { key: "mode", label: "고장 모드", type: "text", req: true }, { key: "effect", label: "고장 영향", type: "text" },
      { key: "s", label: "심각도 (S)", type: "number" }, { key: "o", label: "발생도 (O)", type: "number" }, { key: "d", label: "검출도 (D)", type: "number" }, { key: "rpn", label: "RPN (S×O×D)", type: "formula", expr: "{심각도 (S)} * {발생도 (O)} * {검출도 (D)}" },
      { key: "ap", label: "조치 우선순위 (AP)", type: "select", options: ["H", "M", "L"], colors: { H: "red", M: "orange", L: "gray" } }, { key: "action", label: "개선 조치", type: "text" },
      ...(dsById("people") ? [{ key: "owner", label: "담당", type: "ref", ref: "people", single: true }] : []), { key: "due", label: "기한", type: "date" }, { key: "status", label: "상태", type: "select", options: ["미착수", "진행중", "완료"], badge: true }] }),
    build: ds => [{ type: "kpi", items: [{ label: "AP = H 미완료", unit: "건", goal: 0, lowerIsBetter: true, status: "auto", src: { ds: ds.id, agg: "count", period: "all", filter: [{ f: "ap", op: "=", v: "H" }, { f: "status", op: "!=", v: "완료" }] } }, { label: "전체 고장 모드", unit: "건", src: { ds: ds.id, agg: "count", period: "all", filter: [] } }, { label: "평균 RPN", unit: "", src: { ds: ds.id, agg: "avg", field: "rpn", period: "all", filter: [] } }] },
      { type: "table", span: 12, title: "RPN 높은 순", src: { ds: ds.id, period: "all", filter: [], cols: ["step", "mode", "s", "o", "d", "rpn", "ap", "status"], sort: "rpn", asc: false, limit: 10 } },
      mkW("donut", ds, { title: "AP 비중", unit: "건", src: { by: "ap", period: "all" } }), mkW("kanban", ds, { title: "개선 조치 보드", src: { col: "status", filter: [] } }),
      { type: "alerts", span: 12, title: "우선 조치", limit: 6, rules: [{ ds: ds.id, label: "AP = H 미완료", level: "critical", filter: [{ f: "ap", op: "=", v: "H" }, { f: "status", op: "!=", v: "완료" }] }, { ds: ds.id, label: "기한 지난 조치", level: "serious", filter: [{ f: "due", op: "<", v: "today" }, { f: "status", op: "!=", v: "완료" }] }] }] },
  controlplan: { lv: 3, sec: "db", name: "관리계획서 (Control Plan)", tag: "데이터베이스 + 특성 관리 페이지", desc: "공정별 제품·공정 특성과 특별 특성(CC/SC), 측정 방법, 샘플·주기, 관리 방법, 대응 계획을 한 표로 관리합니다.",
    db: () => ({ dateField: "", titleField: "proc", asOfField: "", fields: [{ key: "no", label: "공정 번호", type: "text" }, { key: "proc", label: "공정명", type: "text", req: true }, { key: "prod", label: "제품 특성", type: "text" }, { key: "pchar", label: "공정 특성", type: "text" },
      { key: "special", label: "특별 특성", type: "select", options: ["CC", "SC", "일반"], colors: { CC: "red", SC: "orange", 일반: "gray" } }, { key: "spec", label: "규격 · 공차", type: "text" }, { key: "method", label: "측정 방법", type: "text" },
      { key: "size", label: "샘플 크기", type: "text" }, { key: "freq", label: "주기", type: "select", options: ["매 로트", "시간당", "교대당", "일", "주"] }, { key: "ctrl", label: "관리 방법", type: "select", options: ["SPC", "체크시트", "육안", "자동 검사", "에러 프루프"] },
      { key: "react", label: "대응 계획", type: "text" }] }),
    build: ds => [{ type: "table", span: 12, title: "관리계획서", src: { ds: ds.id, period: "all", filter: [], cols: ["no", "proc", "prod", "pchar", "special", "spec", "method", "size", "freq", "ctrl"], sort: "no", asc: true, limit: 50 } },
      mkW("donut", ds, { title: "특별 특성 비중", unit: "개", src: { by: "special", period: "all" } }), mkW("hbar", ds, { title: "관리 방법별", unit: "개", src: { by: "ctrl", period: "all" } })] }
});
const KLV = { tasks: 2, data: 2 };
const lvOf = k => TPL[k]?.lv ?? KLV[k] ?? 2;
const LV_NAME = ["", "간단", "보통", "고급"];
function buildDataWidgets(ds) {
  const F = dsFields(ds), badge = F.find(f => f.badge), sel = F.find(f => f.type === "select" && !f.badge) || badge, df = ds.dateField;
  const items = [{ label: "이번 달 기록", unit: "건", src: { ds: ds.id, agg: "count", period: df ? "thisMonth" : "all", compare: !!df, spark: !!df, filter: [] } },
                 { label: "전체 기록", unit: "건", src: { ds: ds.id, agg: "count", period: "all", filter: [] } }];
  if (badge?.options?.includes("완료")) items.push({ label: "미결", unit: "건", src: { ds: ds.id, agg: "count", period: "all", filter: [{ f: badge.key, op: "!=", v: "완료" }] } });
  const out = [{ type: "kpi", items }];
  if (df) out.push({ type: "bar", span: sel ? 7 : 12, title: "월별 기록 건수", unit: "건", src: { ds: ds.id, agg: "count", x: "month", months: 6, period: "all", filter: [] } });
  if (sel) out.push({ type: "hbar", span: df ? 5 : 12, title: `${sel.label}별${df ? " (최근 3개월)" : ""}`, unit: "건", src: { ds: ds.id, agg: "count", by: sel.key, top: 6, period: df ? "last3m" : "all", filter: [] } });
  out.push({ type: "table", span: 12, title: "최근 기록", src: { ds: ds.id, period: "all", filter: [], cols: F.filter(f => f.type !== "longtext" && f.type !== "file").slice(0, 8).map(f => f.key), limit: 10 } });
  return out;
}
function openCreate(kind) {
  if (kind === "dataset") return openSchema(null);
  const tasksDs = (cfg.datasets || []).find(d => d.id === "tasks") || (cfg.datasets || [])[0];
  Object.assign(ed, { mode: "create", tab: "gui", isNew: true, draft: { kind: kind || "", title: "", group: "", desc: "", ds: tasksDs?.id || "", cat: "" } });
  showModal();
}
function createHTML() {
  const d = ed.draft;
  if (!d.kind) return `<div class="mp-doc">
    <div class="mp-h">무엇을 만들까요?</div>
    <p class="mp-sub">고르면 이 창에서 이어서 작성합니다. 만든 뒤에도 ‘이 페이지 편집’으로 자유롭게 바꿀 수 있습니다.</p>
    ${(() => { const card = (k, n, desc, tag, cls = "") => `<button type="button" class="kind${cls}" data-a="ck" data-kind="${k}" title="${esc(desc)}">${kimg(k)}<span class="kind-t"><b>${n}</b><span class="kind-d">${desc}</span><small>${KINDS.slice(0, 2).some(x => x[0] === k) ? "" : `<i class="lv lv${lvOf(k)}">${LV_NAME[lvOf(k)]}</i>`}${tag}</small></span></button>`;
      const list = sec => [...(sec === "page" ? KINDS.slice(2).map(([k, n, desc, tag]) => ({ k, n, desc, tag })) : []), ...Object.entries(TPL).filter(([, t]) => t.sec === sec).map(([k, t]) => ({ k, n: t.name, desc: t.desc, tag: t.tag }))]
        .map((x, i) => ({ ...x, i })).sort((a, b) => lvOf(a.k) - lvOf(b.k) || a.i - b.i);                       /* 간단한 것부터 */
      const grp = sec => [1, 2, 3].map(lv => { const L = list(sec).filter(x => lvOf(x.k) === lv); return L.length ? `<div class="kind-lv"><i class="lv lv${lv}" aria-hidden="true">${"●".repeat(lv)}${"○".repeat(3 - lv)}</i>${LV_NAME[lv]}</div><div class="kinds">${L.map(x => card(x.k, x.n, x.desc, x.tag)).join("")}</div>` : ""; }).join("");
      return `<div class="kinds">${KINDS.slice(0, 2).map(([k, n, desc, tag]) => card(k, n, desc, tag, " main")).join("")}</div>
        <div class="kind-sec">페이지 템플릿 <span>지금 있는 데이터베이스와 연결해 위젯을 자동으로 채웁니다 · 간단한 것부터</span></div>${grp("page")}
        <div class="kind-sec">데이터베이스 템플릿 <span>입력 항목이 갖춰진 데이터베이스와 현황 페이지를 함께 만듭니다 · 간단한 것부터</span></div>${grp("db")}`; })()}</div>`;
  const groups = [...new Set(cfg.pages.map(p => p.group).filter(Boolean))];
  const ds = dsById(d.ds), cf = catFieldOf(ds);
  let extra = "";
  if (d.kind === "tasks") {
    extra = propRow("연결할 데이터", "◇", inp({ t: "sel", o: dsOpts(), re: 1 }, "ds", d.ds))
      + (cf ? propRow(`${cf.label} 범위`, "◇", inp({ t: "sel", o: [["", "전체"], ...(cf.options || []).map(o => [o, o])], re: 1 }, "cat", d.cat || "")) : "");
  }
  if (d.kind === "data") extra = propRow("데이터베이스", "◇", inp({ t: "sel", o: dsOpts(), re: 1 }, "ds", d.ds));
  const tpl = TPL[d.kind];
  if (tpl?.needDs) extra = propRow("연결할 데이터베이스", "◇", inp({ t: "sel", o: dsOpts(), re: 1 }, "ds", d.ds));
  if (tpl?.db) { const F = tpl.db().fields; extra = propRow("만들 데이터베이스", "▦", `<div class="made">${F.map(f => `<span>${esc(f.label)}${f.req ? " *" : ""}</span>`).join("")}</div>`); }
  let made = [];
  try { made = d.kind === "tasks" && ds ? buildTasksWidgets(ds, d.cat) : d.kind === "data" && ds ? buildDataWidgets(ds) : tpl && !tpl.db && (ds || !tpl.needDs) ? tpl.build(ds) : []; } catch (e) { made = []; }
  if (tpl?.db) made = [{ title: "지표" }, { title: "월별·항목별 현황" }, { title: "최근 기록" }, { title: "알림·보드 등 템플릿 위젯" }];
  const names = made.flatMap(w => w.type === "kpi" ? w.items.map(k => k.label) : [w.title]);
  return `<div class="mp-doc">
    <input class="mp-title" data-b="title" data-t="text" placeholder="제목 없음" value="${esc(d.title)}" aria-label="페이지 제목">
    <div class="props">
      ${propRow("메뉴 그룹", "▤", groupSelHTML("create", d.group))}
      ${propRow("설명", "Aa", inp({ t: "text" }, "desc", d.desc))}
      ${extra}
    </div>
    <hr class="mp-sep">
    ${names.length ? `<div class="mp-textlbl">${tpl?.db ? `데이터베이스 ‘${esc(d.title || tpl.name)}’와 함께 만들 현황 페이지` : `이 페이지에 자동으로 들어갈 위젯 (${names.length})`}</div><div class="made">${names.map(n => `<span>${esc(n)}</span>`).join("")}</div>
      <p class="mp-note">모든 위젯이 데이터와 연결되어, 기록을 추가하면 자동으로 다시 계산됩니다.</p>`
      : `<p class="mp-note">빈 페이지로 만든 뒤 오른쪽 편집 창에서 위젯을 추가합니다.</p>`}
  </div>`;
}
function saveCreate() {
  const d = ed.draft;
  if (!d.title?.trim()) { msg("제목을 입력하세요.", false); $("#drawer .mp-title")?.focus(); return; }
  let ds = dsById(d.ds);
  const tpl = TPL[d.kind];
  if ((d.kind === "tasks" || d.kind === "data" || tpl?.needDs) && !ds) { msg("연결할 데이터베이스를 고르세요.", false); return; }
  let pageTitle = d.title.trim();
  if (tpl?.db) {                                      /* 데이터베이스 템플릿: 데이터베이스를 먼저 만들고 그 현황 페이지를 만듦 */
    if ((cfg.datasets || []).some(x => x.name === pageTitle)) { msg("같은 이름의 데이터베이스가 이미 있습니다. 이름을 바꿔 주세요.", false); return; }
    ds = { id: "ds-" + Date.now().toString(36), name: pageTitle, desc: d.desc?.trim() || tpl.desc, records: [], ...tpl.db() };
    (cfg.datasets ||= []).push(ds); fver++;
    pageTitle = `${pageTitle} 현황`;
  }
  const widgets = d.kind === "tasks" ? buildTasksWidgets(ds, d.cat) : d.kind === "data" ? buildDataWidgets(ds) : tpl ? tpl.build(ds) : [];
  const page = { id: "p-" + Date.now().toString(36), title: pageTitle, group: d.group?.trim() || "내 업무", desc: d.desc?.trim() || (tpl && !tpl.db ? tpl.desc : ""), widgets };
  cfg.pages.push(page); persist(); closeDrawer(true);
  location.hash = page.id;
  toast(tpl?.db ? `데이터베이스 ‘${ds.name}’와 현황 페이지를 만들었습니다.` : "페이지를 만들었습니다.");
  if (d.kind === "blank") setTimeout(() => enterLayout(), 80);
}
const configText = () => "/* 품질보증 업무 대시보드 - 설정 + 데이터 파일 (화면에서 내보냄: " + TODAY() + ")\n   이 파일로 기존 pages.config.js 를 교체하세요. */\n\nwindow.DASHBOARD_CONFIG = " + JSON.stringify(cfg, null, 1) + ";\n";

/* 드로어 전체 그리기 */
function renderDrawer(keepMsg) {
  const dr = $("#drawer"), body = dr.querySelector(".body"), top = body ? body.scrollTop : 0;
  const msgPrev = keepMsg ? dr.querySelector(".msg")?.outerHTML : "";
  if (ed.mode === "export") {
    const nrec = (cfg.datasets || []).reduce((a, d) => a + (d.records || []).length, 0);
    dr.innerHTML = `<header><h2>설정 · 데이터 저장</h2><button class="btn ghost" data-a="close" type="button">닫기</button></header>
      <div class="body">
        <div class="sec"><h5>데이터 파일</h5>
          <div class="hint">모든 데이터(기록 ${nrec.toLocaleString()}건)는 데이터마다 <code>data/registers/&lt;데이터&gt;.json</code>, 화면 구성은 <code>data/app.json</code> 파일에 저장되고, 화면은 이 파일들을 불러와 보여 줍니다. 대시보드 폴더째 옮기면 다른 PC에서도 같은 내용이 보입니다.<br>지금 상태: <b>${esc({ ok: projDir && dirReady ? "파일과 맞춰져 있음" : "파일에서 불러옴 (저장하려면 폴더 연결)", saving: "저장 중", pending: "파일 저장 대기 (폴더 연결 필요)", off: "폴더 연결 전", error: "저장 실패", init: "확인 중" }[store.state] || "")}</b>${store.at ? ` · 마지막 ${store.at}` : ""}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn primary" data-a="st-save" type="button">${projDir && dirReady ? "지금 파일에 저장" : "데이터 폴더 연결하고 저장"}</button><button class="btn" data-a="st-reload" type="button">파일에서 다시 불러오기</button></div></div>
        <div class="sec"><h5>백업 파일로 내보내기</h5>
          <div class="hint">전체 내용을 하나의 <code>pages.config.js</code>로 받아 둘 수 있습니다. 데이터 파일을 읽을 수 없을 때 처음 화면으로도 쓰입니다.</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn" data-a="save-proj" type="button">pages.config.js로 폴더에 저장</button><button class="btn" data-a="dl-config" type="button">pages.config.js 다운로드</button><button class="btn" data-a="copy" type="button">내용 복사</button></div></div>
        <div class="sec"><h5>백업 파일 불러오기</h5>
          <div class="hint">이전에 다운로드한 <code>pages.config.js</code>를 고르면 그 내용으로 화면 전체를 바꾸고 데이터 파일에도 저장합니다. 지금 내용은 덮어써집니다.</div>
          <input type="file" id="impFile" accept=".js,.json,text/javascript,application/json" class="f"></div>
        <div class="sec"><h5>월간 보고서</h5>
          <div class="hint">고른 페이지의 위젯과 요약 문장을 한 달 기준으로 다시 계산해 보고서 문서(HTML · 인쇄하면 PDF) 또는 엑셀로 만듭니다.</div>
          <div><button class="btn" data-a="open-report" type="button">월간 보고서 만들기…</button></div></div>
        <textarea class="code" id="xText" readonly spellcheck="false" hidden>${esc(configText())}</textarea>
        ${attachSecHTML()}
        ${backupSecHTML()}
        <div class="sec"><h5>내 이름</h5>
          <div class="hint">변경 내역에 ‘누가’로 표시됩니다. 이 브라우저에만 저장됩니다.</div>
          <input class="f" id="meName" value="${esc(myName())}" placeholder="예: 김민수" aria-label="내 이름"></div>
        <div class="sec"><h5>기록 비우기</h5>
          <div class="hint">모든 데이터의 기록(${nrec.toLocaleString()}건)을 지웁니다. 화면 구성과 데이터의 입력 항목은 그대로 남습니다. 필요하면 먼저 위에서 파일로 저장해 두세요.</div>
          <div><button class="btn danger" data-a="wipe" type="button" ${nrec ? "" : "disabled"}>모든 기록 비우기</button></div></div>
      </div>
      <footer><div class="msg"></div><div class="row"><div>${isPending() ? `<button class="btn danger" data-a="reset" type="button">파일에 저장 안 된 변경 버리기</button>` : ""}</div><div></div></div></footer>`;
    setTimeout(fillBackupList, 0);
    return;
  }
  const popTop = crumb => `<div class="mp-top"><nav class="crumb" aria-label="위치">${crumb}</nav><div class="mp-tools"><button type="button" class="ib" data-a="mp-wide">${ed.wide ? "작게 보기" : "크게 보기"}</button><button type="button" class="ib" data-a="close" aria-label="닫기" title="닫기 (Esc)">✕</button></div></div>`;
  if (ed.mode === "fields") return renderFields(dr, popTop, msgPrev, top);
  if (ed.mode === "widget") {
    const w = ed.draft.widgets[ed.wi], t = TYPES[w.type] || { name: w.type };
    dr.innerHTML = popTop(`<span>${esc(ed.draft.title || "페이지")}</span><span>/</span><b>${esc(t.name)} 설정</b>`) + `
      <div class="body mp-body"><div class="mp-doc">
        <div class="mp-h">${esc(w.title || t.name)}</div>
        ${w.type !== "kpi" ? `<div class="props">${propRow("가로 폭", "↔", inp({ t: "selnum", o: SPANS.map(([v, l]) => [String(v), l]) }, `widgets.${ed.wi}.span`, String(w.span || 6)))}</div>` : ""}
        <div class="we-body flat">${weBody(w, ed.wi)}</div>
      </div></div>
      <footer>${msgPrev || `<div class="msg">${ed.isNewW ? "놓은 자리에 추가했습니다. 내용을 정한 뒤 적용을 누르세요." : "뒤쪽 화면에 바로 미리 보입니다."}</div>`}
      <div class="row"><div><button class="btn danger" data-a="wd-del" type="button">이 위젯 삭제</button></div>
      <div style="display:flex;gap:6px"><button class="btn" data-a="close" type="button">취소</button><button class="btn primary" data-a="save" type="button">적용</button></div></div></footer>`;
    const nb = dr.querySelector(".body"); if (nb) nb.scrollTop = top;
    return;
  }
  if (ed.mode === "create") {
    const kn = (KINDS.find(k => k[0] === ed.draft.kind) || [])[1] || TPL[ed.draft.kind]?.name;
    dr.innerHTML = popTop(kn ? `<a href="#" data-a="ck" data-kind="">새로 만들기</a><span>/</span><b>${esc(kn)}</b>` : `<b>새로 만들기</b>`) + `
      <div class="body mp-body">${createHTML()}</div>
      <footer>${msgPrev || `<div class="msg"></div>`}<div class="row"><div>${kn ? `<button class="btn" data-a="ck" data-kind="" type="button">← 다른 종류 고르기</button>` : ""}</div>
      <div style="display:flex;gap:6px"><button class="btn" data-a="close" type="button">취소</button>${kn ? `<button class="btn primary" data-a="save" type="button">만들기</button>` : ""}</div></div></footer>`;
    const nb = dr.querySelector(".body"); if (nb) nb.scrollTop = top;
    return;
  }
  if (ed.mode === "import") return renderImport(dr, popTop, msgPrev, top);
  if (ed.mode === "drill") return renderDrill(dr, popTop, msgPrev, top);
  if (ed.mode === "report") return renderReport(dr, popTop, msgPrev);
  if (ed.mode === "trash") return renderTrash(dr, popTop, msgPrev, top);
  if (ed.mode === "record") {
    const ds = dsById(ed.ds);
    dr.innerHTML = popTop(`${ed.hist?.length ? `<a href="#" data-a="rel-back" class="crumb-back" title="${esc(ed.hist.at(-1).drill ? "기록 목록" : dsById(ed.hist.at(-1).ds)?.name || "")}(으)로 돌아가기">← 이전</a><span>|</span>` : ""}<a href="#data-${esc(ds.id)}" data-a="close-nav">${esc(ds.name)}</a><span>/</span><b>${ed.isNew ? "새 기록" : esc(ed.draft[titleKeyOf(ds)] || "기록")}</b>`) + `
      <div class="body mp-body">${recFormHTML()}</div>
      <footer>${msgPrev || `<div class="msg"></div>`}<div class="row"><div class="ft-left">${ed.isNew ? tplPickHTML(ds) : `<button class="btn danger" data-a="rec-del" type="button">이 기록 삭제</button><button class="btn" data-a="rec-dup" type="button" title="이 기록을 바탕으로 새 기록 만들기">⧉ 복제</button><button class="btn" data-a="rec-tpl" type="button" title="이 기록의 값을 새 기록 템플릿으로 저장">템플릿으로 저장</button>`}</div>
      <div style="display:flex;gap:6px">${ed.isNew ? `<button class="btn" data-a="save-next" type="button">저장 후 계속 입력</button>` : `<button class="btn" data-a="close" type="button">취소</button>`}<button class="btn primary" data-a="save" type="button">저장 (Ctrl+S)</button></div></div></footer>`;
    const nb = dr.querySelector(".body"); if (nb) nb.scrollTop = top;
    return;
  }
  if (ed.mode === "schema") {
    const used = ed.isNew ? 0 : usageOf(ed.draft.id);
    dr.innerHTML = popTop(ed.isNew ? `<span>새로 만들기</span><span>/</span><b>새 데이터베이스</b>` : `<span>${esc(ed.draft.name)}</span><span>/</span><b>항목 구성</b>`) + `
      <div class="body mp-body">${schemaHTML()}</div>
      <footer>${msgPrev || `<div class="msg">${ed.isNew ? "만든 뒤 바로 기록을 입력할 수 있습니다." : `이 데이터를 쓰는 위젯 ${used}개`}</div>`}
      <div class="row"><div>${ed.isNew ? "" : `<button class="btn danger" data-a="ds-del" type="button">이 데이터 삭제</button>`}</div>
      <div style="display:flex;gap:6px"><button class="btn" data-a="close" type="button">취소</button><button class="btn primary" data-a="save" type="button">${ed.isNew ? "만들기" : "저장 (Ctrl+S)"}</button></div></div></footer>`;
    const nb = dr.querySelector(".body"); if (nb) nb.scrollTop = top;
    return;
  }
  const isNew = ed.mode === "new";
  dr.innerHTML = `<header><h2>${isNew ? "새 페이지 추가" : "페이지 편집"}</h2>
      <div style="display:flex;gap:8px;align-items:center"><div class="tabs" role="tablist"><button type="button" class="${ed.tab === "gui" ? "on" : ""}" data-a="tab" data-tab="gui">화면 편집</button><button type="button" class="${ed.tab === "json" ? "on" : ""}" data-a="tab" data-tab="json">코드</button></div>
      <button class="btn ghost" data-a="close" type="button">취소</button></div></header>
    <div class="body">${ed.tab === "gui" ? guiHTML() : `<div class="hint">고급 사용자용입니다. 입력하는 대로 미리보기에 반영됩니다.</div><textarea class="code" id="jText" spellcheck="false">${esc(JSON.stringify(ed.draft, null, 2))}</textarea>`}</div>
    <footer>${msgPrev || `<div class="msg">왼쪽 화면에서 미리 볼 수 있습니다. 저장을 눌러야 반영됩니다.</div>`}
      <div class="row"><div>${isNew ? "" : `<button class="btn danger" data-a="p-del" type="button">이 페이지 삭제</button>`}</div>
      <div style="display:flex;gap:6px"><button class="btn" data-a="close" type="button">취소</button><button class="btn primary" data-a="save" type="button">저장 (Ctrl+S)</button></div></div></footer>`;
  const nb = dr.querySelector(".body"); if (nb) nb.scrollTop = top;
}
function msg(t, ok) { const m = $("#drawer .msg"); if (m) { m.textContent = t; m.className = "msg " + (ok === true ? "ok" : ok === false ? "bad" : ""); } }

let pvT;
function preview() { clearTimeout(pvT); pvT = setTimeout(() => { if (!ed.mode || !ed.draft) return; renderBoard(ed.draft); $("#prevBadge").hidden = false; }, 120); }   /* 그사이 팝업을 닫았으면 그리지 않음 */

function openEditor(mode, wi) {
  ed.mode = mode; ed.tab = "gui"; ed.open = new Set();
  if (mode === "new") ed.draft = { id: "", title: "새 업무 페이지", group: "내 업무", desc: "", widgets: [DEFAULTS.kpi(), DEFAULTS.tasks()] };
  else if (mode === "page") ed.draft = structuredClone(cfg.pages.find(p => p.id === currentId()));
  if (mode === "new") ed.open.add(0);
  if (typeof wi === "number") ed.open.add(wi);
  document.body.classList.toggle("editing", mode !== "export");
  $("#drawerWrap").classList.remove("as-modal", "wide");
  $("#drawerWrap").hidden = false;
  renderDrawer();
  if (mode !== "export") preview(); else document.body.classList.remove("editing");
  setTimeout(() => charts.forEach(drawChart), 30);
}
function closeDrawer(silent) {
  ed.hist = [];
  if (ed.mode === "record" && ed.draft) { const orphans = [...draftRefs()].filter(p => !refCount(p)); ed.draft = null; dropDraftOnly(orphans); }
  try { sessionStorage.removeItem(REOPEN_KEY); } catch (e) {}
  fzPending = null;
  if ($("#proppop")) closePropPop(false);
  closeTagPop();
  const was = ed.mode;
  ed.mode = null; ed.draft = null;
  $("#drawerWrap").hidden = true;
  $("#drawerWrap").classList.remove("as-modal", "wide");
  document.body.classList.remove("editing", "modal-open");
  setTimeout(() => charts.forEach(drawChart), 30);
  if (!silent && was) render();
}
function focusWidget(i) {
  ed.open.add(i); renderDrawer(true); preview();
  $(`#drawer .we[data-wi="${i}"]`)?.scrollIntoView({ block: "start", behavior: "smooth" });
}
function arm(btn, label) {
  if (btn.classList.contains("armed")) return true;
  const orig = btn.textContent; btn.classList.add("armed"); btn.textContent = label;
  setTimeout(() => { btn.classList.remove("armed"); btn.textContent = orig; }, 3000);
  return false;
}
function save(next) {
  if (ed.mode === "record") return saveRecord(next);
  if (ed.mode === "schema") return saveSchema();
  if (ed.mode === "fields") return closeDrawer();
  if (ed.mode === "import") return doImport();
  if (ed.mode === "report") return makeReport();
  if (ed.mode === "create") return saveCreate();
  if (ed.mode === "widget") { const i = ed.wi; lay.draft = ed.draft; closeDrawer(true); renderBoard(lay.draft); flashW(i); return; }
  if (ed.tab === "json") { try { ed.draft = JSON.parse($("#jText").value); } catch (e) { msg("코드에 문법 오류가 있습니다: " + e.message, false); return; } }
  const d = ed.draft;
  if (!d.title?.trim()) { msg("페이지 제목을 입력하세요.", false); return; }
  if (ed.mode === "new") {
    d.id = "p-" + Date.now().toString(36);
    cfg.pages.push(d);
  } else {
    const idx = cfg.pages.findIndex(p => p.id === currentId());
    d.id = cfg.pages[idx].id;
    cfg.pages[idx] = d;
  }
  persist();
  const id = d.id;
  closeDrawer(true);
  if (location.hash.slice(1) !== id) location.hash = id; else render();
}

/* 입력 → 초안 반영 + 미리보기 */
$("#drawer").addEventListener("input", e => {
  const el = e.target;
  if (el.id === "jText") {
    try { ed.draft = JSON.parse(el.value); msg("문법 정상 · 미리보기에 반영됨", true); preview(); }
    catch (err) { msg("문법 오류: " + err.message, false); }
    return;
  }
  if (el.dataset.coltype) {
    const [wi, ci] = el.dataset.coltype.split(".").map(Number);
    const col = ed.draft.widgets[wi].columns[ci];
    delete col.type; delete col.align;
    if (el.value === "num") col.align = "right";
    if (el.value === "status") col.type = "status";
    renderDrawer(true); preview(); return;
  }
  if (!el.dataset.b) return;
  const path = el.dataset.b, d = ed.draft;
  ed.dirty = true;
  if (el.dataset.t === "arr") {                      /* 표시할 열 체크박스 */
    const sp = path.replace(/\.cols$/, ""), src = getPath(d, sp), ds = dsById(src.ds);
    const cur = new Set(src.cols?.length ? src.cols : dsFields(ds).map(f => f.key));
    el.checked ? cur.add(el.dataset.v) : cur.delete(el.dataset.v);
    src.cols = dsFields(ds).map(f => f.key).filter(k => cur.has(k));
    preview(); return;
  }
  setPath(d, path, parseVal(el.dataset.t, el));
  if (/(^|\.)src\.ds$/.test(path)) {                  /* 데이터를 바꾸면 항목 선택을 새 데이터 기준으로 초기화 */
    const sp = path.replace(/\.ds$/, ""), type = /items\.\d+\.src$/.test(sp) ? "kpi" : getPath(d, sp.replace(/\.src$/, "")).type;
    setPath(d, sp, defaultSrc(type, el.value));
  }
  if (/\.filter\.\d+\.f$/.test(path)) setPath(d, path.replace(/\.f$/, ".v"), "");
  if (ed.mode === "record") {
    dsFields(dsById(ed.ds)).filter(f => f.type === "days").forEach(f => { const v = daysBetween(dateAt(d, f.from), dateAt(d, f.to)), o = $(`#drawer [data-days="${f.key}"]`); if (o) o.textContent = blank(v) ? "자동 계산" : v + "일"; });
    refreshCalc();
    return;
  }
  if (ed.mode === "schema") { if (el.dataset.re) renderDrawer(true); return; }
  if (ed.mode === "create") { if (path === "ds") d.cat = ""; if (el.dataset.re) renderDrawer(true); return; }
  if (el.dataset.re) renderDrawer(true);
  const m = path.match(/^widgets\.(\d+)\./);
  if (m) { const t = $(`#drawer .we[data-wi="${m[1]}"] .we-title`); if (t) t.textContent = weTitle(d.widgets[+m[1]]); }
  preview();
});
$("#drawer").addEventListener("change", e => {
  if (e.target.id !== "impFile" || !e.target.files[0]) return;
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const txt = String(rd.result), a = txt.indexOf("{"), b = txt.lastIndexOf("}");
      const obj = JSON.parse(txt.slice(a, b + 1));
      if (!Array.isArray(obj.pages)) throw new Error("pages 항목이 없습니다");
      cfg = obj; persist(); closeDrawer(); toast("백업 파일을 불러왔습니다.");
    } catch (err) { msg("불러오지 못했습니다. 대시보드에서 내보낸 pages.config.js 파일인지 확인하세요. (" + err.message + ")", false); }
  };
  rd.readAsText(e.target.files[0], "utf-8");
});

/* 버튼 동작 */
$("#drawerWrap").addEventListener("click", e => {
  const btn = e.target.closest("[data-a]"); if (!btn) return;
  const a = btn.dataset.a, i = +btn.dataset.i, d = ed.draft;
  const ws = d?.widgets;
  let struct = true;
  switch (a) {
    case "close":
      if (btn.tagName === "BUTTON" || ed.mode === "export" || !ed.dirty) { e.preventDefault(); closeDrawer(); }
      else msg("저장하지 않은 내용이 있습니다. 저장하거나 취소를 누르세요.", false);
      return;
    case "schema-tpl": {                                /* 새 데이터베이스의 시작 형태 바꾸기 (이름·설명은 그대로) */
      if (ed.mode !== "schema" || !ed.isNew) return;
      const t = DB_TPL[btn.dataset.tpl](); Object.keys(t).forEach(k => { if (t[k] === undefined) delete d[k]; else d[k] = t[k]; });
      renderDrawer(true); return;
    }
    case "close-nav": e.preventDefault(); { const h = btn.getAttribute("href"); closeDrawer(true); location.hash = h.slice(1); render(); } return;
    case "mp-wide": ed.wide = !ed.wide; $("#drawerWrap").classList.toggle("wide", ed.wide); btn.textContent = ed.wide ? "작게 보기" : "크게 보기"; return;
    case "ck":
      e.preventDefault();
      if (btn.dataset.kind === "dataset") { openSchema(null); return; }
      if (btn.dataset.kind === "master") { openSchema(null, true); return; }
      ed.draft.kind = btn.dataset.kind;
      if (btn.dataset.kind === "tasks" && !ed.draft.title) ed.draft.title = "업무 · 일정";
      if (btn.dataset.kind === "data" && !ed.draft.title) ed.draft.title = `${dsById(ed.draft.ds)?.name || "데이터"} 현황`;
      { const t = TPL[btn.dataset.kind]; if (t) { ed.draft.title = t.name;
        if (t.sec === "db") { let n = t.name, i = 2; while ((cfg.datasets || []).some(d => d.name === n)) n = `${t.name} ${i++}`; ed.draft.title = n; }   /* 같은 이름이 있으면 번호 붙이기 */ if (t.needDs) ed.draft.ds = t.pick()?.id || ed.draft.ds; ed.draft.group = ed.draft.group || (t.sec === "db" ? "데이터 현황" : "내 업무"); } }
      renderDrawer();
      setTimeout(() => $("#drawer .mp-title")?.focus(), 30);
      return;
    case "tab": {
      if (btn.dataset.tab === ed.tab) return;
      if (ed.tab === "json") { try { ed.draft = JSON.parse($("#jText").value); } catch (err) { msg("코드에 문법 오류가 있어 화면 편집으로 돌아갈 수 없습니다: " + err.message, false); return; } }
      ed.tab = btn.dataset.tab; renderDrawer(); return;
    }
    case "save": save(); return;
    case "save-next": save(true); return;
    case "wd-del": {
      if (!arm(btn, "한 번 더 누르면 삭제합니다")) return;
      const i = ed.wi; lay.draft = ed.draft; lay.draft.widgets.splice(i, 1); closeDrawer(true); renderBoard(lay.draft); toast("위젯을 삭제했습니다."); return;
    }
    case "wipe":
      if (!arm(btn, "한 번 더 누르면 모두 지웁니다")) return;
      (cfg.datasets || []).forEach(d => { d.records = []; });
      persist(); closeDrawer(); toast("모든 기록을 비웠습니다. 처음부터 입력해 보세요."); return;
    case "save-proj": saveConfigToProject(); return;
    case "am-clean": cleanUnused(); return;
    case "am-reset": resetAttachments(btn); return;
    case "am-view": { const L = allAttachments(), i = L.findIndex(x => x.path === btn.dataset.path); if (i >= 0) { if (canPreview(L[i])) openViewer(L, i); else openAtt(L[i]); } return; }
    case "am-open": { e.preventDefault(); const ds = dsById(btn.dataset.ds); if (!ds) return; closeDrawer(true); location.hash = "data-" + ds.id; openRecord(ds, btn.dataset.id); return; }
    case "dl-config": download(new Blob([configText()], { type: "text/javascript;charset=utf-8" }), "pages.config.js"); msg("다운로드했습니다. 대시보드 폴더의 pages.config.js를 이 파일로 교체하세요.", true); return;
    case "rec-del": {
      if (!arm(btn, "한 번 더 누르면 삭제합니다")) return;
      const ds = dsById(ed.ds), old = ds.records.find(r => r.id === d.id), tid = old ? trashOfRec(ds, old) : null; ds.records = ds.records.filter(r => r.id !== d.id);
      persist(); closeDrawer(); toast("기록을 휴지통으로 옮겼습니다. 30일 안에 되살릴 수 있습니다.", tid ? () => { if (restoreTrash(tid, true)) toast("되살렸습니다."); } : undefined); return;
    }
    case "ds-del": {
      if (!arm(btn, `한 번 더 누르면 삭제 (위젯 ${usageOf(d.id)}개 연결 끊김)`)) return;
      trashPut("ds", dsById(d.id), { label: dsById(d.id)?.name || d.name }); cfg.datasets = cfg.datasets.filter(x => x.id !== d.id);
      persist(); closeDrawer(true); location.hash = cfg.pages[0]?.id || ""; render(); toast("데이터베이스를 휴지통으로 옮겼습니다."); return;
    }
    case "note-migrate": {
      const w = ws[i], m = memoDs(true), F = dsFields(m);
      const main = titleKeyOf(m) || (F.find(f => f.type === "text") || {}).key;
      const cat = F.find(f => f.type === "select" && !f.badge), tag = (w.title || "메모").trim();
      if (cat?.refType) { const mm = dsById(cat.ref); if (mm && !masterValues(cat.ref).includes(tag)) (mm.records ||= []).push({ id: newId(), [titleKeyOf(mm)]: tag }); }
      else if (cat) { const raw = m.fields.find(f => f.key === cat.key); if (!(raw.options || []).includes(tag)) raw.options = [...(raw.options || []), tag]; }
      const lines = (w.lines || []).map(l => l.replace(/^\s*-\s*/, "").trim()).filter(Boolean);
      lines.forEach((t, n) => (m.records ||= []).push({ ...newRecord(m), id: "r" + Date.now().toString(36) + n + Math.random().toString(36).slice(2, 5), [main]: t, ...(cat ? { [cat.key]: tag } : {}) }));
      persist();
      w.src = { ...defaultSrc("note", m.id), filter: cat ? [{ f: cat.key, op: "=", v: tag }] : [], limit: Math.max(5, lines.length), asc: true };
      msg(`${lines.length}줄을 ${m.name} 데이터에 기록했습니다. 적용을 누르면 위젯이 데이터와 연동됩니다.`, true);
      break;
    }
    case "src-on": {
      const p = btn.dataset.p, cur = getPath(d, p);
      if (cur.src) return;
      cur.src = defaultSrc(btn.dataset.type);
      if (btn.dataset.type === "kpi" && typeof cur.goal === "number") cur.status = "auto";
      break;
    }
    case "src-off": {
      const cur = getPath(d, btn.dataset.p);
      if (!cur.src) return;
      delete cur.src;
      if (cur.status === "auto") cur.status = "";
      if (btn.dataset.p.includes(".items.") && cur.value === undefined) cur.value = 0;
      break;
    }
    case "copy": {
      const ta = $("#xText");
      const fb = () => { ta.select(); msg("전체 선택했습니다. Ctrl+C로 복사하세요.", true); };
      if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(() => msg("클립보드에 복사했습니다. pages.config.js에 붙여넣으세요.", true), fb); else fb();
      return;
    }
    case "reset":
      if (!arm(btn, "한 번 더 누르면 버립니다")) return;
      reloadFromFiles().then(ok => { if (ok) toast("데이터 파일 기준으로 되돌렸습니다."); else msg("데이터 파일을 읽을 수 없습니다. 먼저 데이터 폴더를 연결하세요.", false); });
      return;
    case "st-save":
      if (projDir && dirReady) flushStore().then(() => { renderDrawer(); msg(store.state === "ok" ? "데이터 파일에 저장했습니다." : `저장하지 못했습니다: ${store.err || ""}`, store.state === "ok"); });
      else connectStore().then(() => renderDrawer());
      return;
    case "st-reload": {
      const go = () => reloadFromFiles().then(ok => { if (ok) toast("데이터 파일에서 다시 불러왔습니다."); else msg("데이터 파일을 읽을 수 없습니다. 데이터 폴더를 연결하세요.", false); });
      if (location.protocol === "file:" && !(projDir && dirReady)) connectProjDir().then(go).catch(e => { if (e.name !== "AbortError") msg(fsErr(e), false); });
      else go();
      return;
    }
    case "p-del":
      if (!arm(btn, "한 번 더 누르면 삭제합니다")) return;
      { const pg = cfg.pages.find(p => p.id === currentId()); if (pg) trashPut("page", pg, { label: pg.title }); }
      cfg.pages = cfg.pages.filter(p => p.id !== currentId());
      persist(); closeDrawer(true); location.hash = cfg.pages[0]?.id || ""; render(); toast("페이지를 휴지통으로 옮겼습니다."); return;
    case "toggle": ed.open.has(i) ? ed.open.delete(i) : ed.open.add(i); renderDrawer(true); preview(); return;
    case "add-w": {
      (d.widgets ||= []).push(DEFAULTS[btn.dataset.type]());
      const ni = d.widgets.length - 1;
      ed.open = new Set([ni]);
      renderDrawer(); preview();
      $(`#drawer .we[data-wi="${ni}"]`)?.scrollIntoView({ block: "start", behavior: "smooth" });
      msg(`‘${TYPES[btn.dataset.type].name}’ 위젯을 추가했습니다. 내용을 입력하세요.`, true);
      return;
    }
    case "w-up": case "w-down": {
      const j = a === "w-up" ? i - 1 : i + 1;
      [ws[i], ws[j]] = [ws[j], ws[i]];
      const oi = ed.open.has(i), oj = ed.open.has(j);
      ed.open.delete(i); ed.open.delete(j); if (oi) ed.open.add(j); if (oj) ed.open.add(i);
      break;
    }
    case "w-del":
      if (!arm(btn, "삭제 확인")) return;
      ws.splice(i, 1);
      ed.open = new Set([...ed.open].filter(x => x !== i).map(x => x > i ? x - 1 : x));
      break;
    case "r-add": {
      const P = btn.dataset.p, ty = btn.dataset.type;
      const arr = getPath(d, P) ?? (setPath(d, P, []), getPath(d, P));
      if (ty === "__row") arr.push({});
      else if (ty === "__filter") { const ds = dsById(getPath(d, P.replace(/\.filter$/, "")).ds); arr.push({ f: dsFields(ds)[0]?.key || "", op: "=", v: "" }); }
      else if (ty === "__field") arr.push({ key: "f" + Date.now().toString(36), label: "새 항목", type: "text" });
      else if (ROWS[ty]) arr.push(ROWS[ty].tpl());
      else if (XW[ty]?.tpl) arr.push(XW[ty].tpl(P));
      break;
    }
    case "r-del": getPath(d, btn.dataset.p).splice(+btn.dataset.r, 1); break;
    case "alerts-auto": getPath(d, btn.dataset.p).rules = autoAlertRules(); break;
    case "r-up": { const arr = getPath(d, btn.dataset.p), r = +btn.dataset.r; [arr[r - 1], arr[r]] = [arr[r], arr[r - 1]]; break; }
    case "g-addrow": { const w = ws[i]; (w.labels ||= []).push(""); (w.series || []).forEach(s => (s.values ||= []).push(0)); break; }
    case "g-delrow": { const w = ws[i], r = +btn.dataset.r; w.labels.splice(r, 1); w.series.forEach(s => s.values.splice(r, 1)); break; }
    case "g-addser": { const w = ws[i]; (w.series ||= []).push({ name: "계열 " + (w.series.length + 1), values: (w.labels || []).map(() => 0) }); break; }
    case "g-delser": ws[i].series.splice(+btn.dataset.s, 1); break;
    case "t-addcol": { const w = ws[i]; (w.columns ||= []).push({ key: "c" + Date.now().toString(36), label: "새 열" }); break; }
    case "t-delcol": { const w = ws[i], c = w.columns.splice(+btn.dataset.c, 1)[0]; (w.rows || []).forEach(r => delete r[c.key]); break; }
    default: struct = false;
  }
  if (struct) { renderDrawer(true); if (["page", "new", "widget"].includes(ed.mode)) preview(); }
});

/* 보드 위 편집 버튼 / 위젯 추가 타일 */
$("#board").addEventListener("click", e => {
  const btn = e.target.closest("[data-a]"); if (!btn) return;
  if (lay.on) {
    const a = btn.dataset.a, i = +btn.dataset.i, ws = lay.draft.widgets;
    if (a === "lw-set") openWidget(i);
    if (a === "lw-del") { if (!arm(btn, "삭제?")) return; ws.splice(i, 1); renderBoard(lay.draft); }
    if (a === "lw-left" || a === "lw-right") { const j = a === "lw-left" ? i - 1 : i + 1; if (j < 0 || j >= ws.length) return; [ws[i], ws[j]] = [ws[j], ws[i]]; renderBoard(lay.draft); flashW(j); }
    return;
  }
  if (!ed.mode && btn.dataset.a === "rec-open") { const d0 = dsById(btn.dataset.ds); if (d0) openRecord(d0, btn.dataset.id); return; }
  if (!ed.mode && btn.dataset.a === "rec-add") {
    const w = boardPage?.widgets?.[+btn.dataset.wi], d0 = dsById(w?.src?.ds); if (!d0) return;
    const pre = {}; (w.src.filter || []).forEach(c => { if (c.op === "=" && c.f && !blank(c.v)) pre[c.f] = c.v; });
    openRecord(d0, null, pre); return;
  }
  const ds = currentDs();
  if (ds) {
    const a = btn.dataset.a;
    if (a === "rec-new") openRecord(ds);
    if (a === "rec-edit") openRecord(ds, btn.dataset.id);
    if (a === "ds-schema") openFields(ds);
    if (a === "ds-export") exportDataset(ds);
    if (a === "ds-import") openImport(ds);
    if (a === "rec-tplmenu") { if ($("#tplmenu")) closeTplMenu(); else openTplMenu(btn); }
    if (a === "dv-sort") { const k = btn.dataset.k, cur = dv.sortK || ds.dateField; if (cur === k) dv.asc = !dv.asc; else { dv.sortK = k; dv.asc = true; } renderDataView(ds); }
    if (a === "dv-more") { dv.limit += 100; renderDataView(ds); }
    if (dvViewAction(a, btn, ds)) return;
    return;
  }
  if (btn.dataset.a === "w-edit") enterLayout(+btn.dataset.i);
  if (btn.dataset.a === "add-tile") { enterLayout(); $("#layBar")?.scrollIntoView({ block: "start", behavior: "smooth" }); }
});

document.addEventListener("keydown", e => {
  if (!ed.mode) return;
  if (e.key === "Escape" && ed.mode === "export") closeDrawer();
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && ed.mode !== "export") { e.preventDefault(); save(); }
  if (e.key === "Escape" && $("#drawerWrap").classList.contains("as-modal")) {
    if (!ed.dirty) closeDrawer(); else msg("저장하지 않은 내용이 있습니다. 저장하거나 취소를 누르세요.", false);
  }
  if (e.key === "Tab" && e.target.id === "jText") { e.preventDefault(); const t = e.target, s = t.selectionStart; t.setRangeText("  ", s, t.selectionEnd, "end"); }
});
$("#btnEdit").addEventListener("click", () => enterLayout());
function syncAsOf() {
  $("#asofInput").value = TODAY();
  $("#asofBox").classList.toggle("past", !!asOf);
  const b = $("#pastBanner"); b.hidden = !asOf;
  if (asOf) b.innerHTML = `<span><b>${asOf}</b> 기준으로 보는 중입니다. ${asOf < REAL_TODAY() ? "그 뒤에 생긴 기록은 숨기고, 그 뒤에 완료된 건은 미완료로 계산합니다." : "기한·D-Day·경과 일수를 이 날짜 기준으로 계산합니다."}</span><button type="button" class="btn sm" data-a="asof-back">오늘(${REAL_TODAY()})로 돌아가기</button>`;
}
function setAsOf(v) {
  asOf = !v || v === REAL_TODAY() ? null : v;
  syncAsOf(); render();
  toast(asOf ? `기준일을 ${asOf}(으)로 바꿨습니다. 모든 위젯을 다시 계산했습니다.` : "기준일을 오늘로 되돌렸습니다.");
}
function shiftMonth(n) {
  const d = new Date(TODAY() + "T00:00:00"), day = d.getDate();
  d.setDate(1); d.setMonth(d.getMonth() + n);
  d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
  setAsOf(d.toLocaleDateString("sv-SE"));
}
$("#asofInput").addEventListener("change", e => { if (e.target.value) setAsOf(e.target.value); });
$("#asofToday").addEventListener("click", () => setAsOf(null));
$("#asofPrev").addEventListener("click", () => shiftMonth(-1));
$("#asofNext").addEventListener("click", () => shiftMonth(1));
$("#pastBanner").addEventListener("click", e => { if (e.target.closest('[data-a="asof-back"]')) setAsOf(null); });
/* 데이터 추가 바로가기: 검색창 + 스크롤 목록 (↑↓로 고르고 Enter, 한글 입력 중에도 끊기지 않게 목록만 다시 그림) */
function openQuick(btn) {
  closeXMenu();
  const m = document.createElement("div");
  m.id = "xmenu"; m.className = "xmenu xq"; m.setAttribute("role", "dialog"); m.setAttribute("aria-label", "데이터 추가"); m.dataset.for = "quick";
  m.innerHTML = `<h6>어느 데이터베이스에 추가할까요?</h6><input class="f xq-q" id="xqQ" type="search" placeholder="데이터베이스 이름 검색" autocomplete="off" aria-label="데이터 검색"><div class="xq-list" role="listbox"></div>`;
  document.body.appendChild(m);
  let act = 0;
  const all = (cfg.datasets || []).map(d => ({ d, n: visibleRecs(d).length }));
  const list = () => { const q = $("#xqQ").value.trim().toLowerCase(); if (!q) return all;
    const inName = all.filter(x => x.d.name.toLowerCase().includes(q)); return [...inName, ...all.filter(x => !inName.includes(x) && (x.d.desc || "").toLowerCase().includes(q))]; };   /* 이름이 맞는 것 먼저 */
  const draw = () => {
    const L = list(); act = Math.max(0, Math.min(act, L.length - 1));
    m.querySelector(".xq-list").innerHTML = L.map((x, k) => `<button type="button" role="option" class="${k === act ? "act" : ""}" aria-selected="${k === act}" data-qds="${esc(x.d.id)}"><span>${esc(x.d.name)}</span><span class="ext">${x.n}</span></button>`).join("") || `<div class="xq-none">‘${esc($("#xqQ").value.trim())}’에 맞는 데이터가 없습니다.</div>`;
    m.querySelector(".xq-list .act")?.scrollIntoView({ block: "nearest" });
  };
  draw();
  const r = btn.getBoundingClientRect(), mr = m.getBoundingClientRect();
  m.style.left = Math.max(8, Math.min(innerWidth - mr.width - 8, r.right - mr.width)) + "px";
  m.style.top = (r.bottom + mr.height + 8 > innerHeight ? Math.max(8, r.top - mr.height - 4) : r.bottom + 4) + "px";
  const go = id => { closeXMenu(); openRecord(dsById(id)); };
  const q = $("#xqQ"); q.focus();
  q.addEventListener("input", () => { act = 0; draw(); });
  q.addEventListener("keydown", e => {
    if (e.isComposing || e.keyCode === 229) return;
    const L = list();
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); act = (act + (e.key === "ArrowDown" ? 1 : -1) + L.length) % Math.max(1, L.length); draw(); }
    if (e.key === "Enter") { e.preventDefault(); if (L[act]) go(L[act].d.id); }
  });
  m.addEventListener("click", e => { const b = e.target.closest("[data-qds]"); if (b) go(b.dataset.qds); });
}
$("#btnQuick").addEventListener("click", e => { if ($("#xmenu")?.dataset.for === "quick") closeXMenu(); else openQuick(e.currentTarget); });
document.addEventListener("keydown", e => {
  if (ed.mode || e.ctrlKey || e.metaKey || e.altKey || e.target.closest?.("input, textarea, select, [contenteditable]")) return;
  const k = e.key.toLowerCase();
  if (e.key === "/") { e.preventDefault(); $("#side").classList.add("open"); $("#navQ").focus(); $("#navQ").select(); return; }
  if (k === "n") { e.preventDefault(); openCreate(); }
  if (k === "r") { e.preventDefault(); openQuick($("#btnQuick")); }
  if (k === "t" && asOf) { e.preventDefault(); setAsOf(null); }
});
syncAsOf();
/* ---------- 전체 검색 (Ctrl+K): 페이지·데이터베이스·모든 기록·위젯을 한 번에 찾아 바로 열기 ----------
   한글 입력이 끊기지 않게 결과 목록만 다시 그림 */
const gs = { q: "", act: 0, items: [] };
const hiMark = (t, q) => { t = String(t ?? ""); const i = q ? t.toLowerCase().indexOf(q) : -1; return i < 0 ? esc(t) : `${esc(t.slice(0, i))}<mark>${esc(t.slice(i, i + q.length))}</mark>${esc(t.slice(i + q.length))}`; };
function gsSearch(raw) {
  const q = raw.trim().toLowerCase(), out = [];
  if (!q) {                                                         /* 비어 있으면 최근 바뀐 기록 */
    const seen = new Set();
    (cfg.changelog || []).forEach(e => { if (out.length >= 8 || !e.rid || seen.has(e.ds + e.rid)) return; const d = dsById(e.ds), r = d && (d.records || []).find(x => x.id === e.rid); if (!r) return; seen.add(e.ds + e.rid);
      out.push({ k: "rec", sec: "최근 바뀐 기록", ds: d, r, t: valText(r[titleKeyOf(d)]) || "(제목 없음)", sub: `${d.name} · ${agoText(e.at)}` }); });
    cfg.pages.slice(0, 6).forEach(p => out.push({ k: "page", sec: "현황판", p, t: p.title, sub: p.group || "" }));
    return out;
  }
  cfg.pages.forEach(p => { if ([p.title, p.desc, p.group].some(x => String(x || "").toLowerCase().includes(q))) out.push({ k: "page", sec: "현황판", p, t: p.title, sub: [p.group, p.desc].filter(Boolean).join(" · ") }); });
  (cfg.datasets || []).forEach(d => { if ([d.name, d.desc].some(x => String(x || "").toLowerCase().includes(q))) out.push({ k: "ds", sec: "데이터베이스", d, t: d.name, sub: `기록 ${(d.records || []).length.toLocaleString()}건${d.desc ? " · " + d.desc : ""}` }); });
  const recs = [];
  (cfg.datasets || []).forEach(d => {
    const F = dsFields(d).filter(f => f.type !== "file"), tk = titleKeyOf(d), df = d.dateField;
    (d.records || []).forEach(r => {
      let hit = null, inTitle = false;
      for (const f of F) { const v = valText(r[f.key]); if (blank(v)) continue; const s = String(v); if (s.toLowerCase().includes(q)) { hit = { f, s }; inTitle = f.key === tk; break; } }
      if (!hit) { const c = (r._c || []).find(c => c.t.toLowerCase().includes(q)); if (c) hit = { f: { label: "의견" }, s: c.t }; }
      if (hit) recs.push({ k: "rec", sec: "기록", ds: d, r, t: valText(r[tk]) || "(제목 없음)", hit, score: (inTitle ? 2 : 0) + (inTitle && d.master ? 1.5 : 0) + (String(valText(r[tk]) || "").toLowerCase() === q ? 3 : 0), date: df ? r[df] || "" : "" });
    });
  });
  recs.sort((a, b) => b.score - a.score || String(b.date).localeCompare(String(a.date)));
  recs.slice(0, 40).forEach(x => { x.sub = `${x.ds.name}${x.hit && x.hit.f.key !== titleKeyOf(x.ds) ? ` · ${x.hit.f.label}: ${x.hit.s.length > 40 ? x.hit.s.slice(0, 40) + "…" : x.hit.s}` : ""}${x.date ? " · " + x.date : ""}`; out.push(x); });
  if (recs.length > 40) out.push({ k: "more", sec: "기록", t: `기록 ${recs.length - 40}건 더 있음 — 데이터베이스에서 검색어로 거르려면 데이터베이스를 여세요`, sub: "" });
  cfg.pages.forEach(p => (p.widgets || []).forEach((w, i) => { if (String(w.title || "").toLowerCase().includes(q)) out.push({ k: "widget", sec: "위젯", p, i, t: w.title, sub: `${p.title} · ${TYPES[w.type]?.name || w.type}` }); }));
  return out;
}
function gsDraw() {
  const box = $("#gsList"); if (!box) return;
  const q = gs.q.trim().toLowerCase(), L = gs.items = gsSearch(gs.q); gs.act = Math.max(0, Math.min(gs.act, L.length - 1));
  let sec = "", h = "";
  L.forEach((x, k) => {
    if (x.sec !== sec) { sec = x.sec; h += `<div class="gs-sec">${esc(sec)}${sec === "기록" && q ? ` <span>${L.filter(y => y.k === "rec").length}${L.some(y => y.k === "more") ? "+" : ""}</span>` : ""}</div>`; }
    const ic = { page: "▤", ds: "▦", rec: "≡", widget: "◫", more: "…" }[x.k];
    h += `<button type="button" class="gs-i${k === gs.act ? " act" : ""}" data-gs="${k}" role="option" aria-selected="${k === gs.act}" ${x.k === "more" ? "disabled" : ""}><span class="gs-ic" aria-hidden="true">${ic}</span><span class="gs-tx"><b>${hiMark(x.t, q)}</b>${x.sub ? `<span>${hiMark(x.sub, q)}</span>` : ""}</span>${x.k === "rec" && x.r ? (() => { const b = dsFields(x.ds).find(f => f.badge); return b ? chipFor(b, x.r[b.key]) : ""; })() : ""}</button>`;
  });
  box.innerHTML = h || `<div class="gs-none">‘${esc(gs.q.trim())}’에 맞는 것이 없습니다.</div>`;
  box.querySelector(".act")?.scrollIntoView({ block: "nearest" });
}
function openSearch() {
  if (ed.mode === "record" && ed.dirty) { msg("저장하지 않은 변경이 있습니다. 먼저 저장하거나 취소하세요.", false); return; }
  if (ed.mode) closeDrawer(true);
  closeSearch();
  const w = document.createElement("div"); w.id = "gsearch"; w.className = "gs-wrap";
  w.innerHTML = `<div class="gs-bg" data-gs-close="1"></div><div class="gs" role="dialog" aria-label="전체 검색"><div class="gs-top"><span aria-hidden="true">⌕</span><input id="gsQ" class="gs-q" placeholder="페이지 · 데이터베이스 · 기록 · 위젯 찾기" autocomplete="off" aria-label="전체 검색" value="${esc(gs.q)}"><kbd>Esc</kbd></div><div class="gs-list" id="gsList" role="listbox"></div>
    <div class="gs-foot"><span><kbd>↑</kbd><kbd>↓</kbd> 고르기</span><span><kbd>Enter</kbd> 열기</span><span>기록은 팝업으로 바로 열립니다</span></div></div>`;
  document.body.appendChild(w);
  gs.act = 0; gsDraw();
  const q = $("#gsQ"); q.focus(); q.select();
  q.addEventListener("input", () => { gs.q = q.value; gs.act = 0; gsDraw(); });
  q.addEventListener("keydown", e => {
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); const n = gs.items.length; if (!n) return; let a = gs.act; do { a = (a + (e.key === "ArrowDown" ? 1 : -1) + n) % n; } while (gs.items[a].k === "more" && a !== gs.act); gs.act = a; gsDraw(); }
    if (e.key === "Enter") { e.preventDefault(); gsGo(gs.items[gs.act]); }
    if (e.key === "Escape") { e.preventDefault(); closeSearch(); }
  });
  w.addEventListener("click", e => { if (e.target.closest("[data-gs-close]")) return closeSearch(); const b = e.target.closest("[data-gs]"); if (b) gsGo(gs.items[+b.dataset.gs]); });
}
function closeSearch() { $("#gsearch")?.remove(); }
function gsGo(x) {
  if (!x || x.k === "more") return;
  closeSearch();
  if (x.k === "page") location.hash = x.p.id;
  if (x.k === "ds") location.hash = "data-" + x.d.id;
  if (x.k === "rec") openRecord(x.ds, x.r.id);
  if (x.k === "widget") { if (location.hash.slice(1) !== x.p.id) location.hash = x.p.id; setTimeout(() => { const el = $(`#board [data-wcard="${x.i}"]`); el?.scrollIntoView({ block: "center", behavior: "smooth" }); el?.classList.add("hl"); setTimeout(() => el?.classList.remove("hl"), 1600); }, 120); }
}
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "k") { e.preventDefault(); if ($("#gsearch")) closeSearch(); else openSearch(); }
}, true);
$("#btnSearch")?.addEventListener("click", () => openSearch());
/* ---------- 페이지 내보내기: 이미지(PNG) · PDF(인쇄 화면) ---------- */
let h2cLoading;
function loadH2C() {
  if (window.html2canvas) return Promise.resolve(window.html2canvas);
  return h2cLoading ||= new Promise((ok, no) => {
    const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = () => window.html2canvas ? ok(window.html2canvas) : no(new Error("라이브러리 없음"));
    s.onerror = () => { h2cLoading = null; no(new Error("인터넷 연결이 없어 이미지 도구를 불러오지 못했습니다")); };
    document.head.appendChild(s);
  });
}
const SNAP_PROPS = ["fill", "stroke", "stroke-width", "stroke-dasharray", "opacity", "font-size", "font-weight", "font-family", "visibility"];
const COLOR_PROPS = ["color", "background-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "outline-color", "box-shadow", "background-image", "fill", "stroke", "text-decoration-color"];
const srgbFix = v => String(v).replace(/color\(srgb ([-\d.e]+) ([-\d.e]+) ([-\d.e]+)(?: \/ ([\d.e]+))?\)/g, (_, r, g, b, a) => `rgba(${Math.round(+r * 255)}, ${Math.round(+g * 255)}, ${Math.round(+b * 255)}, ${a ?? 1})`);
async function exportPagePNG() {
  const page = boardPage; if (!page) return;
  toast("페이지를 이미지로 만드는 중입니다…");
  try {
    const h2c = await loadH2C(), main = $(".main");
    const canvas = await h2c(main, { backgroundColor: srgbFix(cssv("--bg")) || "#ffffff", scale: 2, logging: false, useCORS: true,
      onclone: doc => {                       /* 복제된 화면 안에서: SVG의 CSS 변수 색은 속성으로 굳히고, color-mix() 결과(color(srgb …))는 그림 도구가 읽는 rgba로 */
        doc.body.classList.add("snap");
        const win = doc.defaultView, cm = doc.querySelector(".main");
        [cm, ...cm.querySelectorAll("*")].forEach(c => {
          const cs = win.getComputedStyle(c), inSvg = c instanceof win.SVGElement && c.tagName.toLowerCase() !== "svg";
          if (inSvg) SNAP_PROPS.forEach(p => c.setAttribute(p, srgbFix(cs.getPropertyValue(p))));
          COLOR_PROPS.forEach(p => { const v = cs.getPropertyValue(p); if (/color\(|oklch|oklab/.test(v)) c.style.setProperty(p, srgbFix(v), "important"); });
        });
      } });
    canvas.toBlob(b => { download(b, `${page.title}_${today8()}.png`.replace(/[\\/:*?"<>|]+/g, "_")); toast("페이지를 PNG 이미지로 저장했습니다."); }, "image/png");
  } catch (e) { toast(`이미지로 만들지 못했습니다: ${e.message}. ‘PDF로 저장’을 써 보세요.`); }
}
function printPage() {
  const root = document.documentElement, prev = root.dataset.theme;
  root.dataset.theme = "light"; document.body.classList.add("printing");
  const done = () => { if (prev) root.dataset.theme = prev; else delete root.dataset.theme; document.body.classList.remove("printing"); charts.forEach(drawChart); removeEventListener("afterprint", done); };
  addEventListener("afterprint", done);
  charts.forEach(drawChart);
  setTimeout(() => { window.print(); setTimeout(() => { if (document.body.classList.contains("printing")) done(); }, 500); }, 60);
}
function openPageX(btn) {
  if ($("#minipop")?.dataset.for === "pagex") return closeMiniPop();
  const m = openMiniPop(btn, `<div class="tp-list">
    <button type="button" class="tp-row" data-px="png"><span class="pp-t"><i>▣</i>이미지로 저장 (PNG)</span></button>
    <button type="button" class="tp-row" data-px="pdf"><span class="pp-t"><i>⎙</i>PDF로 저장 · 인쇄</span><span class="tp-hint">인쇄 창에서 ‘PDF로 저장’</span></button>
    <button type="button" class="tp-row" data-px="report"><span class="pp-t"><i>▤</i>월간 보고서 만들기…</span></button></div>`, e => {
    const b = e.target.closest("[data-px]"); if (!b || e.type !== "click") return; closeMiniPop();
    if (b.dataset.px === "png") exportPagePNG(); if (b.dataset.px === "pdf") printPage(); if (b.dataset.px === "report") openReport();
  }, 250);
  m.dataset.for = "pagex";
}
$("#btnPageX")?.addEventListener("click", e => openPageX(e.currentTarget));

/* ---------- 월간 보고서: 고른 페이지의 위젯·요약을 한 달 기준으로 계산해 HTML 문서 또는 엑셀로 ---------- */
const monthEnd = ym => { const [y, m] = ym.split("-").map(Number); return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10); };
function openReport() {
  const cur = boardPage?.id || cfg.pages[0]?.id, today = REAL_TODAY();
  const ym = +today.slice(8) <= 10 ? ymAdd(ymOf(today), -1) : ymOf(today);             /* 월초에는 지난달이 기본 */
  Object.assign(ed, { mode: "report", draft: { ym, pages: cur ? [cur] : [], fmt: "html" }, isNew: false });
  showModal();
}
function reportHTML() {
  const d = ed.draft, months = Array.from({ length: 12 }, (_, i) => ymAdd(ymOf(REAL_TODAY()), -i));
  const groups = [...new Set(cfg.pages.map(p => p.group || "기타"))];
  return `<div class="mp-doc"><div class="mp-h">월간 보고서 만들기</div>
    <div class="props">
      ${propRow("기준 달", "▦", `<select class="f" id="rpYm">${months.map(m => `<option value="${m}" ${m === d.ym ? "selected" : ""}>${m.slice(0, 4)}년 ${+m.slice(5)}월${m === ymOf(REAL_TODAY()) ? " (이번 달 · 오늘까지)" : ""}</option>`).join("")}</select>`)}
      ${propRow("형식", "⎙", `<div class="rp-fmt">${[["html", "보고서 문서 (HTML · 인쇄하면 PDF)"], ["xlsx", "엑셀 (페이지마다 시트)"]].map(([k, l]) => `<label class="chk inline"><input type="radio" name="rpFmt" value="${k}" ${d.fmt === k ? "checked" : ""}> ${l}</label>`).join("")}</div>`)}
    </div>
    <div class="fl-head"><h5>넣을 페이지 <span class="cnt">${d.pages.length}개</span></h5><span class="fl-hint"><button type="button" class="cond-add" data-rp-all="1">모두</button> <button type="button" class="cond-add" data-rp-none="1">해제</button></span></div>
    <div class="rp-pages">${groups.map(g => `<div class="rp-g"><b>${esc(g)}</b>${cfg.pages.filter(p => (p.group || "기타") === g).map(p => `<label class="chk"><input type="checkbox" data-rp="${esc(p.id)}" ${d.pages.includes(p.id) ? "checked" : ""}> ${esc(p.title)} <span class="tp-hint">위젯 ${(p.widgets || []).length}</span></label>`).join("")}</div>`).join("")}</div>
    <p class="mp-note">고른 달의 마지막 날을 기준일로 놓고 모든 위젯을 다시 계산합니다(‘이번 달’ 지표 = 그달). 차트는 그림으로, 표·순위는 표로, 텍스트 요약은 문장으로 들어갑니다.</p></div>`;
}
function renderReport(dr, popTop, msgPrev) {
  dr.innerHTML = popTop(`<b>월간 보고서</b>`) + `<div class="body mp-body">${reportHTML()}</div>
    <footer>${msgPrev || `<div class="msg"></div>`}<div class="row"><div></div><div style="display:flex;gap:6px"><button class="btn" data-a="close" type="button">취소</button><button class="btn primary" data-a="save" type="button" ${ed.draft.pages.length ? "" : "disabled"}>보고서 만들기</button></div></div></footer>`;
}
$("#drawer").addEventListener("change", e => {
  if (ed.mode !== "report") return; const t = e.target, d = ed.draft;
  if (t.id === "rpYm") d.ym = t.value;
  if (t.name === "rpFmt") d.fmt = t.value;
  if (t.dataset.rp) { d.pages = t.checked ? [...new Set([...d.pages, t.dataset.rp])] : d.pages.filter(x => x !== t.dataset.rp); renderDrawer(true); }
});
$("#drawer").addEventListener("click", e => {
  if (ed.mode !== "report") return;
  if (e.target.closest("[data-rp-all]")) { ed.draft.pages = cfg.pages.map(p => p.id); renderDrawer(true); }
  if (e.target.closest("[data-rp-none]")) { ed.draft.pages = []; renderDrawer(true); }
});
/* 한 달 기준으로 페이지를 차례로 그려 위젯 결과를 모음 */
function collectReport(ids, ym) {
  const keepAsOf = asOf, root = document.documentElement, keepTheme = root.dataset.theme, end = monthEnd(ym), out = [];
  asOf = end >= REAL_TODAY() ? null : end; root.dataset.theme = "light";
  try {
    ids.forEach(id => {
      const p = cfg.pages.find(x => x.id === id); if (!p) return;
      fver++; renderBoard(p);
      out.push({ p, ws: (p.widgets || []).map((w, i) => { const rw = boardRes[i] || w; let rows = []; try { rows = widgetRows(rw); } catch (er) {} return { w: rw, i, svg: standaloneSVG(i, rw)?.svg || "", rows }; }) });
    });
  } finally { asOf = keepAsOf; if (keepTheme) root.dataset.theme = keepTheme; else delete root.dataset.theme; fver++; render(); }
  return out;
}
const plain = v => typeof v === "string" ? v.replace(/<[^>]+>/g, "") : v;
function reportDoc(data, ym) {
  const title = `${cfg.appName || "품질"} 월간 보고서 — ${ymLabel(ym, true).replace(/^(\d\d)년/, "20$1년")}`;
  const ST = { good: ["양호", "#1f7a3d"], warning: ["주의", "#9a6400"], serious: ["경고", "#b54708"], critical: ["긴급", "#b42318"] };
  const tbl = rows => { if (!rows?.length || rows.length < 2) return ""; const [h, ...b] = rows; return `<table><thead><tr>${h.map(c => `<th>${esc(plain(c))}</th>`).join("")}</tr></thead><tbody>${b.slice(0, 15).map(r => `<tr>${r.map(c => `<td>${typeof c === "number" ? c.toLocaleString("ko-KR", { maximumFractionDigits: 2 }) : esc(plain(c ?? ""))}</td>`).join("")}</tr>`).join("")}</tbody></table>${b.length > 15 ? `<p class="more">외 ${b.length - 15}줄</p>` : ""}`; };
  const SKIP = ["quickform", "links", "annotate", "gallery"];
  const sec = ({ p, ws }) => `<section><h2>${esc(p.title)}</h2>${p.desc ? `<p class="desc">${esc(p.desc)}</p>` : ""}
    ${ws.map(({ w, svg, rows }) => {
      if (SKIP.includes(w.type)) return "";
      if (w.type === "kpi") return `<div class="kpis">${(w.items || []).map(k => `<div class="kpi"><span>${esc(k.label)}</span><b>${typeof k.value === "number" ? k.value.toLocaleString("ko-KR") : esc(k.value)}<small>${esc(k.unit || "")}</small></b>${k.status && ST[k.status] ? `<i style="color:${ST[k.status][1]}">● ${ST[k.status][0]}</i>` : ""}${k.deltaLabel ? `<em>${esc(k.deltaLabel)}</em>` : ""}</div>`).join("")}</div>`;
      if (w.type === "summary") return `<div class="w"><h3>${esc(w.title || "")}</h3>${(w.lines || []).map(l => `<p>${l}</p>`).join("")}</div>`;
      if (w.type === "note") return `<div class="w"><h3>${esc(w.title || "")}</h3>${(w.lines || []).map(l => `<p>${esc(l)}</p>`).join("")}</div>`;
      if (svg) return `<div class="w">${svg}</div>`;
      const t = tbl(rows); return t ? `<div class="w"><h3>${esc(w.title || TYPES[w.type]?.name || "")}</h3>${t}</div>` : "";
    }).join("")}</section>`;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><style>
body{font-family:"Pretendard","Malgun Gothic","Apple SD Gothic Neo",sans-serif;color:#1d2433;background:#fff;margin:0 auto;padding:32px 24px;max-width:1080px;line-height:1.5}
header{border-bottom:3px solid #1d2433;padding-bottom:12px;margin-bottom:8px}h1{font-size:26px;margin:0}header p{margin:4px 0 0;color:#5b6474;font-size:13px}
h2{font-size:19px;margin:34px 0 10px;padding-bottom:6px;border-bottom:1px solid #cfd5df}h3{font-size:14px;margin:0 0 6px}.desc{color:#5b6474;font-size:13px;margin:-4px 0 10px}
.kpis{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;margin:10px 0}.kpi{border:1px solid #dfe3ea;border-radius:8px;padding:10px 12px;display:grid;gap:2px}
.kpi span{font-size:12px;color:#5b6474}.kpi b{font-size:24px;font-variant-numeric:tabular-nums}.kpi small{font-size:12px;font-weight:400;margin-left:2px}.kpi i{font-style:normal;font-size:12px;font-weight:600}.kpi em{font-style:normal;font-size:11.5px;color:#5b6474}
.w{margin:16px 0;break-inside:avoid}svg{max-width:100%;height:auto;border:1px solid #eef0f4;border-radius:8px}
table{border-collapse:collapse;width:100%;font-size:12.5px;font-variant-numeric:tabular-nums}th,td{border-bottom:1px solid #e6e9ef;padding:5px 7px;text-align:left}th{color:#5b6474;font-weight:600;background:#f6f7f9}
.more{font-size:12px;color:#8a92a0}p b{font-weight:700}footer{margin-top:40px;font-size:11.5px;color:#8a92a0;border-top:1px solid #e6e9ef;padding-top:8px}
@media print{body{padding:0;max-width:none}section{break-before:page}section:first-of-type{break-before:auto}@page{size:A4;margin:12mm}}
</style></head><body><header><h1>${esc(title)}</h1><p>기준일 ${esc(monthEnd(ym) >= REAL_TODAY() ? REAL_TODAY() : monthEnd(ym))} · 작성 ${esc(new Date().toLocaleString("ko-KR"))}${myName() ? " · " + esc(myName()) : ""} · 페이지 ${data.length}개</p></header>
${data.map(sec).join("")}<footer>${esc(cfg.appName || "")} 대시보드에서 자동으로 만든 보고서입니다. 인쇄(Ctrl+P)하면 PDF로 저장할 수 있습니다.</footer></body></html>`;
}
async function makeReport() {
  const d = ed.draft; if (!d.pages.length) return msg("보고서에 넣을 페이지를 고르세요.", false);
  msg("보고서를 만드는 중입니다…");
  await new Promise(r => setTimeout(r, 30));
  const data = collectReport(d.pages, d.ym), base = `${cfg.appName || "품질"}_월간보고서_${d.ym}`.replace(/[\\/:*?"<>|]+/g, "_");
  if (d.fmt === "xlsx") {
    try {
      const X = await loadXLSX(), wb = X.utils.book_new(), used = new Set();
      data.forEach(({ p, ws }) => {
        const rows = [[`${p.title} — ${ymLabel(d.ym, true)}`], []];
        ws.forEach(({ w, rows: R }) => { if (!R?.length) return; rows.push([w.title || TYPES[w.type]?.name || ""]); R.forEach(r => rows.push(r.map(plain))); rows.push([]); });
        const sh = X.utils.aoa_to_sheet(rows); sh["!cols"] = [{ wch: 30 }, ...Array(8).fill({ wch: 14 })];
        let n = String(p.title).replace(/[\\/?*[\]:]/g, " ").slice(0, 28) || "페이지", k = 2; while (used.has(n)) n = `${n.slice(0, 26)} ${k++}`; used.add(n);
        X.utils.book_append_sheet(wb, sh, n);
      });
      X.writeFile(wb, base + ".xlsx"); closeDrawer(true); toast(`월간 보고서(엑셀, 시트 ${data.length}개)를 저장했습니다.`);
    } catch (e) { msg(`엑셀로 만들지 못했습니다: ${e.message}. HTML 문서로 만들어 보세요.`, false); }
    return;
  }
  download(new Blob([reportDoc(data, d.ym)], { type: "text/html;charset=utf-8" }), base + ".html");
  closeDrawer(true); toast("월간 보고서를 HTML 문서로 저장했습니다. 브라우저로 열어 인쇄하면 PDF가 됩니다.");
}
/* ---------- 알림 배지: 사이드바 페이지 이름 옆에 주의가 필요한 지표 수 + 이상 알림 건수 ---------- */
function pageAlerts(p) {
  const rank = { critical: 4, serious: 3, warning: 2 }; let worst = 0, kpi = 0, hits = 0;
  (p.widgets || []).forEach(wd => {
    if (wd.type === "kpi") { try { resolveWidget(wd).items.forEach(it => { const r = rank[it.status] || 0; if (r) { kpi++; worst = Math.max(worst, r); } }); } catch (e) {} }
    if (wd.type === "alerts") (wd.rules || []).forEach(rule => { try { const n = alertRuleHits(rule)?.hits.length || 0; if (n) { hits += n; worst = Math.max(worst, rank[rule.level] || 2); } } catch (e) {} });
  });
  return { n: kpi + hits, kpi, hits, color: ["", "", "var(--warn)", "var(--serious)", "var(--crit)"][worst] };
}
const navBadge = p => { const a = pageAlerts(p); if (!a.n) return "";
  return `<span class="nav-badge" style="--nb:${a.color}" title="${esc([a.kpi && `주의가 필요한 지표 ${a.kpi}개`, a.hits && `이상 알림 ${a.hits}건`].filter(Boolean).join(" · "))}" aria-label="알림 ${a.n}건">${a.n > 99 ? "99+" : a.n}</span>`; };

/* ---------- 기준일 비교: 비교일과 기준일의 핵심 지표를 나란히 ---------- */
let cmpAt = null, cmpNow = null;
function compareKpis(page) {
  const keep = asOf, m = new Map(); asOf = cmpAt >= REAL_TODAY() ? null : cmpAt; fver++;
  try { (page.widgets || []).forEach((w, i) => { if (w.type === "kpi") { try { m.set(i, resolveWidget(w)); } catch (e) {} } }); }
  finally { asOf = keep; fver++; }
  return m;
}
const mdText = d => `${+d.slice(5, 7)}/${+d.slice(8, 10)}`;
function cmpCardHTML() {
  const A = cmpAt, B = TODAY(), rows = [];
  cmpNow.forEach((cw, i) => (boardRes[i]?.items || []).forEach((k, ki) => { const c = cw.items?.[ki]; if (c) rows.push({ k, a: typeof c.value === "number" ? c.value : null, b: typeof k.value === "number" ? k.value : null }); }));
  if (!rows.length) return "";
  return `<section class="card cmp-card" style="grid-column:1/-1"><div class="card-head"><div><h3>기준일 비교</h3><div class="sub">비교일 <b>${esc(A)}</b> ↔ 기준일 <b>${esc(B)}</b> · 이 페이지의 핵심 지표 ${rows.length}개 · ‘이번 달’ 지표는 각 날짜가 속한 달의 그날까지</div></div><div class="sub"><button class="btn sm ghost" data-a="cmp-off" type="button">비교 끄기</button></div></div>
    <div class="tbl-wrap"><table class="cmp-tbl"><thead><tr><th>지표</th><th class="r">${esc(A)}</th><th class="r">${esc(B)}</th><th class="r">변화</th><th>판정</th></tr></thead>
    <tbody>${rows.map(({ k, a, b }) => { const d = a !== null && b !== null ? r2(b - a) : null, better = d === null || d === 0 ? null : k.lowerIsBetter ? d < 0 : d > 0;
      return `<tr><td>${esc(k.label)}</td><td class="r">${a === null ? "—" : fmt(a)} <small>${esc(k.unit || "")}</small></td><td class="r"><b>${b === null ? "—" : fmt(b)}</b> <small>${esc(k.unit || "")}</small></td>
        <td class="r">${d === null ? "" : `<span class="${better === null ? "" : better ? "cmp-good" : "cmp-bad"}">${d > 0 ? "▲" : d < 0 ? "▼" : "–"} ${fmt(Math.abs(d))}</span>`}</td><td>${better === null ? `<span class="tp-hint">변화 없음</span>` : better ? `<span class="cmp-good">좋아짐</span>` : `<span class="cmp-bad">나빠짐</span>`}</td></tr>`; }).join("")}</tbody></table></div></section>`;
}
function kpiCmpHTML(k, ki) {
  const c = cmpNow?.get(curWi)?.items?.[ki]; if (!c || typeof c.value !== "number" || typeof k.value !== "number") return "";
  const d = r2(k.value - c.value), better = d === 0 ? null : k.lowerIsBetter ? d < 0 : d > 0;
  return `<div class="kpi-cmp" title="비교일 ${esc(cmpAt)} 값">${mdText(cmpAt)} ${fmt(c.value)} → <b>${fmt(k.value)}</b> <span class="${better === null ? "" : better ? "cmp-good" : "cmp-bad"}">${d > 0 ? "▲" : d < 0 ? "▼" : "–"}${d ? fmt(Math.abs(d)) : ""}</span></div>`;
}
function setCmp(on, v) {
  if (on) { if (!v) { const d = new Date(TODAY() + "T00:00:00"); d.setDate(0); v = d.toLocaleDateString("sv-SE"); } cmpAt = v; }
  else cmpAt = null;
  $("#cmpOn").checked = !!cmpAt; $("#cmpInput").hidden = !cmpAt; if (cmpAt) $("#cmpInput").value = cmpAt;
  render();
  if (cmpAt) toast(`${cmpAt}과(와) 기준일 ${TODAY()}의 핵심 지표를 나란히 보여 줍니다.`);
}
$("#cmpOn")?.addEventListener("change", e => setCmp(e.target.checked));
$("#cmpInput")?.addEventListener("change", e => { if (e.target.value) setCmp(true, e.target.value); });
$("#board").addEventListener("click", e => { if (e.target.closest('[data-a="cmp-off"]')) { e.preventDefault(); setCmp(false); } });
/* ---------- 반복 일정: ‘반복’ 항목(매주·매월·분기·반기·매년·N개월…)이 있는 기록이 완료되면 날짜를 그만큼 옮긴 다음 일정을 자동으로 ----------
   ds.repeat = { field: 반복 주기 항목 }.  완료 판단 = 상태가 완료·승인·종료 (상태가 없으면 완료일 입력).  만든 기록에는 r._rep 표시(한 번만) */
function cycleOf(v) {
  if (typeof v === "number") return v > 0 ? { m: v } : null;
  const s = String(valText(v) || "").trim(); if (!s) return null;
  if (/매일|daily/i.test(s)) return { d: 1 }; if (/격주|2\s*주/.test(s)) return { d: 14 }; if (/매주|주간|weekly|1\s*주/i.test(s)) return { d: 7 };
  if (/분기|3\s*개월|quarter/i.test(s)) return { m: 3 }; if (/반기|6\s*개월/.test(s)) return { m: 6 }; if (/매년|연간|1\s*년|12\s*개월|annual|yearly/i.test(s)) return { m: 12 };
  if (/매월|월간|1\s*개월|monthly/i.test(s)) return { m: 1 };
  const m = s.match(/(\d+)\s*(일|주|개월|달|년)/); if (m) { const n = +m[1]; return m[2] === "일" ? { d: n } : m[2] === "주" ? { d: n * 7 } : m[2] === "년" ? { m: n * 12 } : { m: n }; }
  return null;
}
function addCycle(date, c) {
  const t = new Date(String(date).slice(0, 10) + "T00:00:00"); if (isNaN(t)) return date;
  if (c.d) t.setDate(t.getDate() + c.d);
  else { const day = t.getDate(); t.setDate(1); t.setMonth(t.getMonth() + c.m); t.setDate(Math.min(day, new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate())); }
  return t.toLocaleDateString("sv-SE");
}
const repDone = (ds, r) => { const F = dsFields(ds), b = F.find(f => f.badge), c = F.find(f => f.type === "date" && f.closes); return b ? DONE.includes(r[b.key]) : c ? !blank(r[c.key]) : false; };
function nextOccurrence(ds, r, c) {
  const F = dsFields(ds), o = {};
  F.forEach(f => { const v = r[f.key]; if (blank(v) || (Array.isArray(v) && !v.length)) return;
    if (f.type === "file" || isCalcF(f) || f.type === "days" || f.badge || (f.type === "text" && f.auto) || (f.type === "date" && f.closes)) return;
    o[f.key] = f.type === "date" ? addCycle(v, c) : structuredClone(v); });
  F.filter(f => isNumF(f) && /진행|달성/.test(f.label) && !isCalcF(f)).forEach(f => { o[f.key] = 0; });
  return { ...newRecord(ds), ...o, id: newId() };
}
function spawnRepeats() {
  const made = [];
  (cfg.datasets || []).forEach(ds => {
    const k = ds.repeat?.field; if (!k || !(ds.fields || []).some(f => f.key === k)) return;
    (ds.records || []).slice().forEach(r => {
      if (r._rep || !repDone(ds, r)) return;
      const c = cycleOf(r[k]); if (!c) return;
      r._rep = 1; const nx = nextOccurrence(ds, r, c); ds.records.push(nx); made.push({ ds, r: nx });
    });
  });
  if (made.length) setTimeout(() => { const x = made[0], tk = titleKeyOf(x.ds), dd = x.ds.dateField;
    toast(made.length === 1 ? `반복 일정: ‘${valText(x.r[tk]) || "기록"}’의 다음 일정${dd && x.r[dd] ? `(${x.r[dd]})` : ""}을 만들었습니다.` : `반복 일정 ${made.length}건의 다음 일정을 만들었습니다.`); }, 350);
}
/* 항목 구성의 ‘반복 일정’ 설정 */
function repeatSetHTML(ds) {
  const F = (ds.fields || []).filter(f => (f.type === "select" && !f.badge) || (f.type === "number" && !/진행|달성|점수/.test(f.label)) || f.key === ds.repeat?.field), cur = ds.repeat?.field || "";
  return `<div class="rep-set"><select class="f" data-rep="field">${[["", "반복 안 함"], ...F.map(f => [f.key, `‘${f.label}’ 값대로 반복`])].map(([a, b]) => `<option value="${esc(a)}" ${a === cur ? "selected" : ""}>${esc(b)}</option>`).join("")}</select>
    ${!cur ? `<button type="button" class="btn sm" data-rep="make">＋ ‘반복’ 항목 만들고 켜기</button>` : ""}
    <span class="tp-hint">${cur ? "이 항목이 매주·매월·분기·반기·매년(또는 ‘2주’·‘6개월’)인 기록이 완료되면, 날짜를 그만큼 옮긴 다음 일정을 자동으로 만듭니다." : "주기가 있는 업무(정기 점검·교정·보고)는 완료할 때 다음 일정이 자동으로 생기게 할 수 있습니다."}</span></div>`;
}
function setRepeat(ds, key) {
  if (!key) { delete ds.repeat; return; }
  ds.repeat = { field: key };
  (ds.records || []).forEach(r => { if (repDone(ds, r)) r._rep = 1; });                /* 이미 끝난 기록에서 한꺼번에 생기지 않게 */
}
$("#drawer").addEventListener("change", e => {
  const el = e.target.closest?.('[data-rep="field"]'); if (!el || ed.mode !== "fields") return;
  const ds = dsById(ed.ds); if (!ds) return; setRepeat(ds, el.value); persist(); render(); renderDrawer(true);
  toast(el.value ? "반복 일정을 켰습니다. 반복 값이 있는 기록을 완료하면 다음 일정이 생깁니다." : "반복 일정을 껐습니다.");
});
$("#drawer").addEventListener("click", e => {
  if (!e.target.closest?.('[data-rep="make"]') || ed.mode !== "fields") return;
  const ds = dsById(ed.ds); if (!ds) return;
  let label = "반복", i = 2; while ((ds.fields || []).some(f => f.label === label)) label = `반복 ${i++}`;
  const key = "rep" + Date.now().toString(36);
  ds.fields.push({ key, label, type: "select", options: ["매주", "매월", "분기", "반기", "매년"], colors: { 매주: "blue", 매월: "green", 분기: "orange", 반기: "purple", 매년: "pink" } });
  setRepeat(ds, key); persist(); render(); renderDrawer(true);
  toast(`‘${label}’ 항목을 만들고 반복 일정을 켰습니다. 기록마다 주기를 고르세요.`);
});

/* ---------- 휴지통: 지운 기록·페이지·데이터베이스를 30일 보관 (cfg.trash, data/app.json) ---------- */
const TRASH_DAYS = 30;
function trashPrune() { const lim = Date.now() - TRASH_DAYS * 864e5; if (!cfg.trash) return; cfg.trash = cfg.trash.filter(t => Date.parse(t.at) > lim).slice(0, 300); if (!cfg.trash.length) delete cfg.trash; }
function trashPut(kind, data, meta) {
  if (!data) return null;
  const t = { id: "x" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), kind, at: new Date().toISOString(), who: myName(), data: structuredClone(data), ...meta };
  (cfg.trash ||= []).unshift(t); trashPrune(); return t.id;
}
const trashOfRec = (ds, r) => trashPut("rec", r, { ds: ds.id, label: String(valText(r[titleKeyOf(ds)]) || "(제목 없음)") });
function restoreTrash(id, quiet) {
  const t = (cfg.trash || []).find(x => x.id === id); if (!t) return false;
  if (t.kind === "rec") { const ds = dsById(t.ds); if (!ds) { toast(`‘${t.label}’이(가) 있던 데이터베이스가 없습니다. 먼저 그 데이터베이스를 되살리세요.`); return false; }
    const r = structuredClone(t.data); if ((ds.records || []).some(x => x.id === r.id)) r.id = newId(); (ds.records ||= []).push(r); }
  if (t.kind === "page") { const p = structuredClone(t.data); if (cfg.pages.some(x => x.id === p.id)) p.id = "p-" + Date.now().toString(36); cfg.pages.push(p); }
  if (t.kind === "ds") { if (dsById(t.data.id)) { toast(`같은 데이터베이스(${t.label})가 이미 있어 되살릴 수 없습니다.`); return false; } cfg.datasets.push(structuredClone(t.data)); }
  cfg.trash = cfg.trash.filter(x => x !== t); if (!cfg.trash.length) delete cfg.trash;
  persist(); render(); if (!quiet) toast(`‘${t.label}’을(를) 되살렸습니다.`);
  return true;
}
function openTrash() { if (ed.mode) closeDrawer(true); Object.assign(ed, { mode: "trash", draft: {}, isNew: false }); showModal(); }
function trashHTML() {
  const T = cfg.trash || [], KN = { rec: ["≡", "기록"], page: ["▤", "페이지"], ds: ["▦", "데이터베이스"] };
  const left = t => Math.max(0, Math.ceil((Date.parse(t.at) + TRASH_DAYS * 864e5 - Date.now()) / 864e5));
  return `<div class="mp-doc"><div class="mp-h">휴지통</div><p class="mp-note" style="margin-top:0">지운 기록·페이지·데이터베이스는 ${TRASH_DAYS}일 동안 여기에 남고, 그 뒤 자동으로 지워집니다. 첨부 파일도 그동안 지우지 않습니다.</p>
    ${T.length ? `<ul class="tr-list">${T.map(t => `<li class="tr-i"><span class="tr-ic" aria-hidden="true">${KN[t.kind]?.[0] || "·"}</span>
      <div class="tr-tx"><b>${esc(t.label || "(제목 없음)")}</b><span>${esc(KN[t.kind]?.[1] || "")}${t.kind === "rec" ? ` · ${esc(dsById(t.ds)?.name || "(지워진 데이터베이스)")}` : t.kind === "ds" ? ` · 기록 ${(t.data.records || []).length}건` : t.kind === "page" ? ` · 위젯 ${(t.data.widgets || []).length}개` : ""} · ${esc(agoText(t.at))}${t.who ? ` · ${esc(t.who)}` : ""} · ${left(t)}일 뒤 영구 삭제</span></div>
      <button type="button" class="btn sm" data-tr-restore="${esc(t.id)}">되살리기</button><button type="button" class="btn sm ghost" data-tr-del="${esc(t.id)}" title="영구 삭제">✕</button></li>`).join("")}</ul>`
      : `<div class="empty">휴지통이 비어 있습니다.</div>`}</div>`;
}
function renderTrash(dr, popTop, msgPrev, top) {
  dr.innerHTML = popTop(`<b>휴지통</b>`) + `<div class="body mp-body">${trashHTML()}</div>
    <footer>${msgPrev || `<div class="msg"></div>`}<div class="row"><div>${(cfg.trash || []).length ? `<button class="btn danger" data-a="tr-empty" type="button">휴지통 비우기</button>` : ""}</div><div><button class="btn primary" data-a="close" type="button">닫기</button></div></div></footer>`;
  const nb = dr.querySelector(".body"); if (nb) nb.scrollTop = top;
}
$("#drawerWrap").addEventListener("click", e => {
  if (ed.mode !== "trash") return;
  const r = e.target.closest("[data-tr-restore]"); if (r) { e.preventDefault(); if (restoreTrash(r.dataset.trRestore)) renderDrawer(true); return; }
  const d = e.target.closest("[data-tr-del]"); if (d) { e.preventDefault(); if (!arm(d, "영구 삭제?")) return; cfg.trash = (cfg.trash || []).filter(x => x.id !== d.dataset.trDel); if (!cfg.trash.length) delete cfg.trash; persist(); render(); renderDrawer(true); return; }
  const em = e.target.closest('[data-a="tr-empty"]'); if (em) { e.preventDefault(); if (!arm(em, "한 번 더 누르면 모두 영구 삭제")) return; delete cfg.trash; persist(); render(); renderDrawer(true); toast("휴지통을 비웠습니다."); }
});
$("#btnTrash")?.addEventListener("click", () => openTrash());
const trashCount = () => { const b = $("#btnTrash"); if (b) b.querySelector("span").textContent = (cfg.trash || []).length ? ` ${(cfg.trash || []).length}` : ""; };

/* ---------- 자동 백업: 하루 처음 저장할 때 data/ 폴더를 backup/날짜/ 로 복사 (최근 14일치 보관) ---------- */
const BK_KEY = "qa-dashboard-lastbackup", BK_DIR = "backup", BK_KEEP = 14;
async function backupCopy(root, name) {
  const d = await root.getDirectoryHandle(DATA_DIR), rd = await d.getDirectoryHandle(REG_DIR);
  const bd = await root.getDirectoryHandle(BK_DIR, { create: true }), dd = await bd.getDirectoryHandle(name, { create: true }), drd = await dd.getDirectoryHandle(REG_DIR, { create: true });
  for await (const [n, h] of rd.entries()) if (h.kind === "file" && n.endsWith(".json")) await writeText(drd, n, await (await h.getFile()).text());
  await writeText(dd, "app.json", await (await (await d.getFileHandle("app.json")).getFile()).text());     /* app.json을 마지막에: 있으면 완성된 백업 */
  const names = []; for await (const [n, h] of bd.entries()) if (h.kind === "directory" && /^\d{4}-\d{2}-\d{2}$/.test(n)) names.push(n);
  for (const n of names.sort().reverse().slice(BK_KEEP)) { try { markWrite(); await bd.removeEntry(n, { recursive: true }); } catch (e) {} }
}
async function autoBackup(root) {
  const day = REAL_TODAY(); let last = ""; try { last = localStorage.getItem(BK_KEY) || ""; } catch (e) {}
  if (last === day) return;
  try { await root.getDirectoryHandle(DATA_DIR).then(d => d.getFileHandle("app.json")); } catch (e) { return; }       /* 아직 데이터 파일이 없음 */
  let exists = false; try { await (await (await root.getDirectoryHandle(BK_DIR)).getDirectoryHandle(day)).getFileHandle("app.json"); exists = true; } catch (e) {}
  if (!exists) await backupCopy(root, day);
  try { localStorage.setItem(BK_KEY, day); } catch (e) {}
}
async function listBackups(root) {
  const out = []; let bd; try { bd = await root.getDirectoryHandle(BK_DIR); } catch (e) { return out; }
  for await (const [n, h] of bd.entries()) if (h.kind === "directory") { let ok = false; try { await h.getFileHandle("app.json"); ok = true; } catch (e) {} if (ok) out.push(n); }
  return out.sort().reverse();
}
async function readBackup(root, name) {
  const dd = await (await root.getDirectoryHandle(BK_DIR)).getDirectoryHandle(name), rd = await dd.getDirectoryHandle(REG_DIR);
  const app = JSON.parse(await (await (await dd.getFileHandle("app.json")).getFile()).text());
  const regs = await Promise.all((app.registers || []).map(async id => { try { return JSON.parse(await (await (await rd.getFileHandle(regFile(id))).getFile()).text()); } catch (e) { return null; } }));
  return joinCfg(app, regs);
}
function backupSecHTML() {
  let last = ""; try { last = localStorage.getItem(BK_KEY) || ""; } catch (e) {}
  const on = projDir && dirReady;
  return `<div class="sec"><h5>자동 백업</h5>
    <div class="hint">${on ? `하루에 한 번, 그날 처음 저장할 때 <code>data/</code> 폴더를 <code>${BK_DIR}/날짜/</code>로 복사해 둡니다. 최근 ${BK_KEEP}일치를 보관합니다.${last ? ` 마지막 백업: <b>${esc(last)}</b>` : ""}` : `데이터 폴더를 연결하면 하루에 한 번 <code>${BK_DIR}/날짜/</code>에 자동으로 백업합니다.`}</div>
    ${on ? `<div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn" data-a="bk-now" type="button">지금 백업</button></div><div class="bk-list" id="bkList"><span class="tp-hint">백업 목록을 읽는 중…</span></div>` : ""}</div>`;
}
async function fillBackupList() {
  const box = $("#bkList"); if (!box || !(projDir && dirReady)) return;
  const L = await listBackups(projDir).catch(() => []);
  box.innerHTML = L.length ? L.map(n => `<div class="bk-i"><span class="mono">${esc(n)}</span><button type="button" class="btn sm" data-bk-restore="${esc(n)}">이 백업으로 되돌리기</button></div>`).join("") : `<span class="tp-hint">아직 백업이 없습니다.</span>`;
}
$("#drawerWrap").addEventListener("click", async e => {
  if (ed.mode !== "export") return;
  const now = e.target.closest('[data-a="bk-now"]');
  if (now) { e.preventDefault(); try { const n = REAL_TODAY() + "_" + nowHM().replace(":", ""); await flushStore(); await backupCopy(projDir, n); msg(`backup/${n}/ 에 백업했습니다.`, true); fillBackupList(); } catch (er) { msg(`백업하지 못했습니다: ${er.message}`, false); } return; }
  const rb = e.target.closest("[data-bk-restore]");
  if (rb) { e.preventDefault(); if (!arm(rb, "한 번 더 누르면 되돌립니다")) return;
    try { const name = rb.dataset.bkRestore, c = await readBackup(projDir, name);
      await backupCopy(projDir, `${REAL_TODAY()}_${nowHM().replace(":", "")}_되돌리기전`);       /* 지금 상태도 남겨 둠 */
      cfg = c; upgrade(cfg); snapRecords(); persist(); closeDrawer(true); render(); toast(`${name} 백업으로 되돌렸습니다. 되돌리기 직전 상태는 backup/ 폴더에 따로 남겼습니다.`);
    } catch (er) { msg(`되돌리지 못했습니다: ${er.message}`, false); } }
});
/* 삭제 (되돌리기 가능) */
function withUndo(msgText, fn) {
  const snap = JSON.stringify(cfg);
  fn(); persist();
  if (!cfg.pages.some(p => p.id === currentId()) && !currentDs()) location.hash = cfg.pages[0]?.id || "";
  render();
  toast(msgText, () => { cfg = JSON.parse(snap); persist(); render(); toast("되돌렸습니다."); });
}
function navDelete(kind, id) {
  if (ed.mode) closeDrawer(true);
  if (kind === "page") {
    const pg = cfg.pages.find(p => p.id === id); if (!pg) return;
    if (lay.on && lay.pageId === id) leaveLayout();
    withUndo(`‘${pg.title}’ 페이지를 휴지통으로 옮겼습니다.`, () => { trashPut("page", pg, { label: pg.title }); cfg.pages = cfg.pages.filter(p => p.id !== id); });
  }
  if (kind === "group") {
    const n = cfg.pages.filter(p => (p.group || "기타") === id).length;
    if (lay.on) leaveLayout();
    withUndo(`‘${id}’ 그룹의 페이지 ${n}개를 휴지통으로 옮겼습니다.`, () => { cfg.pages.filter(p => (p.group || "기타") === id).forEach(p => trashPut("page", p, { label: p.title })); cfg.pages = cfg.pages.filter(p => (p.group || "기타") !== id); });
  }
  if (kind === "ds") {
    const d = dsById(id); if (!d) return;
    const n = (d.records || []).length, w = usageOf(id), refs = (cfg.datasets || []).filter(x => (x.fields || []).some(f => f.type === "ref" && f.ref === id)).length;
    const why = [n && `기록 ${n}건`, w && `연결 위젯 ${w}개`, refs && `이 목록을 참조하는 데이터 ${refs}개`].filter(Boolean).join(", ");
    withUndo(`‘${d.name}’ 데이터베이스를 휴지통으로 옮겼습니다.${why ? ` (${why} 영향)` : ""}`, () => { trashPut("ds", d, { label: d.name }); cfg.datasets = cfg.datasets.filter(x => x.id !== id); });
  }
}
/* 끌어서 순서·그룹 바꾸기 */
let navDrag = null;
const navClear = () => document.querySelectorAll("#nav .drop-above, #nav .drop-below, #nav .drop-into").forEach(x => x.classList.remove("drop-above", "drop-below", "drop-into"));
const secOk = (kind, sec) => kind === "page" ? sec.startsWith("g:") : kind === "ds" ? sec === "data" : false;
function navTarget(e) {
  const grp = e.target.closest?.(".nav-group"); if (!grp || !navDrag) return null;
  const sec = grp.dataset.sec;
  if (navDrag.type === "sec") { const r = grp.getBoundingClientRect(); return { el: grp, sec, below: e.clientY > r.top + r.height / 2 }; }
  if (!secOk(navDrag.kind, sec)) return null;
  const it = e.target.closest(".nav-item");
  if (it && it.dataset.kind === navDrag.kind) { const r = it.getBoundingClientRect(); return { el: it, sec, id: it.dataset.id, below: e.clientY > r.top + r.height / 2 }; }
  return { el: grp, sec, into: true };
}
$("#nav").addEventListener("dragstart", e => {
  const h = e.target.closest?.("[data-sec-drag]"), it = e.target.closest?.(".nav-item");
  if (h) navDrag = { type: "sec", sec: h.dataset.secDrag };
  else if (it) navDrag = { type: "item", kind: it.dataset.kind, id: it.dataset.id };
  else return;
  e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", "nav");
  setTimeout(() => (h ? h.closest(".nav-group") : it).classList.add("nav-dragging"), 0);
});
$("#nav").addEventListener("dragend", () => { navDrag = null; navClear(); document.querySelectorAll(".nav-dragging").forEach(x => x.classList.remove("nav-dragging")); });
$("#nav").addEventListener("dragover", e => {
  const t = navTarget(e); navClear(); if (!t) return;
  e.preventDefault(); e.dataTransfer.dropEffect = "move";
  t.el.classList.add(t.into ? "drop-into" : t.below ? "drop-below" : "drop-above");
});
$("#nav").addEventListener("drop", e => {
  const t = navTarget(e), src = navDrag; navClear(); navDrag = null; if (!t || !src) return;
  e.preventDefault();
  if (src.type === "sec") {
    if (t.sec === src.sec) return;
    const order = navSections().filter(k => k !== src.sec), at = order.indexOf(t.sec) + (t.below ? 1 : 0);
    order.splice(at, 0, src.sec); cfg.navOrder = order;
  } else if (src.kind === "page") {
    const arr = cfg.pages, from = arr.findIndex(p => p.id === src.id); if (from < 0 || src.id === t.id) return;
    const [pg] = arr.splice(from, 1), g = t.sec.slice(2), moved = (pg.group || "기타") !== g;
    pg.group = g;
    let at;
    if (t.into) { const last = arr.map(p => p.group || "기타").lastIndexOf(g); at = last + 1; if (last < 0) at = arr.length; }
    else at = arr.findIndex(p => p.id === t.id) + (t.below ? 1 : 0);
    arr.splice(at, 0, pg);
    if (lay.on && lay.pageId === pg.id) lay.draft.group = g;
    if (moved) toast(`‘${pg.title}’ 페이지를 ‘${g}’ 그룹으로 옮겼습니다.`);
  } else if (src.kind === "ds") {
    const arr = cfg.datasets, from = arr.findIndex(d => d.id === src.id); if (from < 0 || src.id === t.id) return;
    const [d] = arr.splice(from, 1);
    const at = t.into ? arr.length : arr.findIndex(x => x.id === t.id) + (t.below ? 1 : 0);
    arr.splice(at, 0, d);
  }
  persist(); render();
});
/* 키보드로 순서 바꾸기: Alt + ↑/↓ */
$("#nav").addEventListener("keydown", e => {
  if (!e.altKey || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
  const it = e.target.closest(".nav-item"); if (!it) return;
  e.preventDefault();
  const kind = it.dataset.kind, id = it.dataset.id, dir = e.key === "ArrowUp" ? -1 : 1;
  const arr = kind === "page" ? cfg.pages : cfg.datasets, i = arr.findIndex(x => x.id === id);
  const same = x => kind === "page" ? (x.group || "기타") === (arr[i].group || "기타") : !!x.master === !!arr[i].master;
  let j = i + dir; while (j >= 0 && j < arr.length && !same(arr[j])) j += dir;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]]; persist(); render();
  $(`#nav .nav-item[data-kind="${kind}"][data-id="${CSS.escape(id)}"] a`)?.focus();
});
$("#nav").addEventListener("click", e => {
  const mv = e.target.closest('[data-a="nav-mv"]');
  if (mv) {
    e.preventDefault();
    const key = mv.closest(".nav-group").dataset.sec, order = navSections(), i = order.indexOf(key), j = i + +mv.dataset.dir;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]]; cfg.navOrder = order; persist(); render();
    $(`#nav .nav-group[data-sec="${CSS.escape(key)}"] .nav-mv[data-dir="${mv.dataset.dir}"]`)?.focus();
    return;
  }
  if (e.target.closest('[data-a="nav-all"]')) {
    const secs = navSections(), all = secs.every(k => navFold.has(k));
    secs.forEach(k => all ? navFold.delete(k) : navFold.add(k)); saveFold(); render(); return;
  }
  const fold = e.target.closest('[data-a="nav-fold"]');
  if (fold && !e.target.closest('[data-a="nav-del"]')) {
    const key = fold.closest(".nav-group").dataset.sec;
    navFold.has(key) ? navFold.delete(key) : navFold.add(key); saveFold(); render();
    $(`#nav .nav-group[data-sec="${CSS.escape(key)}"] .nav-fold`)?.focus();
    return;
  }
  const del = e.target.closest('[data-a="nav-del"]');
  if (del) {
    e.preventDefault();
    if (!del.classList.contains("armed")) {                 /* 첫 클릭: 확인 상태로 */
      document.querySelectorAll("#nav .nav-del.armed").forEach(b => { b.classList.remove("armed"); b.textContent = "✕"; });
      del.classList.add("armed"); del.textContent = "삭제";
      setTimeout(() => { if (del.isConnected) { del.classList.remove("armed"); del.textContent = "✕"; } }, 3000);
      return;
    }
    navDelete(del.dataset.kind, del.dataset.id); return;
  }
  if (e.target.closest('[data-a="ds-new"]')) { e.preventDefault(); openCreate("dataset"); }
  if (e.target.closest('[data-a="master-new"]')) { e.preventDefault(); openSchema(null, true); }
});
$("#btnNew").addEventListener("click", () => openCreate());
$("#btnExport").addEventListener("click", () => openEditor("export"));
$("#drawerWrap").addEventListener("click", e => { if (e.target.closest('[data-a="open-report"]')) { e.preventDefault(); closeDrawer(true); openReport(); } });
$("#btnMenu").addEventListener("click", () => $("#side").classList.toggle("open"));
$("#btnTheme").addEventListener("click", () => {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("qa-dashboard-theme", root.dataset.theme); } catch (e) {}
  charts.forEach(drawChart);
});
try { const t = localStorage.getItem("qa-dashboard-theme"); if (t) document.documentElement.dataset.theme = t; } catch (e) {}

/* ---------- 페이지 편집: 끌어다 놓기 ---------- */
const lay = { on: false, draft: null, pageId: null };
function lwWrap(w, i, html, n) {
  const span = w.type === "kpi" ? 12 : (w.span || 6), nm = TYPES[w.type]?.name || w.type;
  return `<div class="lw" draggable="true" data-wi="${i}" style="grid-column: span ${span}">
    <div class="lw-bar"><span class="lw-grip" aria-hidden="true">⠿</span><span class="lw-name">${esc(nm)}${w.title ? " · " + esc(w.title) : ""}</span><span class="lw-span">${w.type === "kpi" ? "전체 폭" : `폭 ${span}/12`}</span>
      <span class="lw-btns"><button type="button" class="ib" data-a="lw-left" data-i="${i}" title="앞으로" ${i === 0 ? "disabled" : ""}>←</button><button type="button" class="ib" data-a="lw-right" data-i="${i}" title="뒤로" ${i === n - 1 ? "disabled" : ""}>→</button><button type="button" class="ib" data-a="lw-set" data-i="${i}">설정</button><button type="button" class="ib del" data-a="lw-del" data-i="${i}">삭제</button></span></div>
    <div class="lw-body">${html}</div>
    ${w.type !== "kpi" ? `<div class="lw-resize" data-i="${i}" title="끌어서 폭 조절" aria-hidden="true"></div>` : ""}
  </div>`;
}
/* ---------- 페이지 편집 리모컨: 떠 있는 작은 창 (끌어서 옮기기 · 접기), 위젯은 분류별 + 검색 ---------- */
const WCATS = [["지표", ["kpi", "gauge", "progress", "goaltable", "summary"]], ["차트", ["line", "bar", "hbar", "yoy", "donut", "scatter", "burndown"]], ["품질 분석", ["pareto", "heatmap", "control", "histogram", "rankchange", "scorecard", "alerts", "floormap"]],
  ["목록 · 보드", ["table", "tasks", "kanban", "gallery", "history"]], ["일정", ["calendar", "gantt", "dday", "timeline"]], ["메모 · 입력", ["note", "quickform", "links", "annotate"]]];
const wcatOf = k => (WCATS.find(([, ks]) => ks.includes(k)) || ["기타"])[0];
const pal = { q: "", cat: "" };
const RC_KEY = "qa-dashboard-rc";
const rcState = (() => { try { return JSON.parse(localStorage.getItem(RC_KEY) || "{}"); } catch (e) { return {}; } })();
const saveRc = () => { try { localStorage.setItem(RC_KEY, JSON.stringify(rcState)); } catch (e) {} };
function renderLayBar() {
  const d = lay.draft, b = $("#layBar");
  b.hidden = false; b.className = "laybar rc" + (rcState.min ? " min" : "");
  const n = (d.widgets || []).length;
  b.innerHTML = `<div class="rc-head" data-rc-drag title="끌어서 옮기기">
      <span class="rc-grip" aria-hidden="true">⠿</span><b class="rc-t">페이지 편집</b><span class="rc-n">위젯 ${n}개</span>
      <span class="rc-acts"><button type="button" class="btn sm" data-l="cancel">취소</button><button type="button" class="btn sm primary" data-l="save">저장</button>
        <button type="button" class="ib rc-min" data-rc="min" aria-label="${rcState.min ? "펼치기" : "접기"}" title="${rcState.min ? "펼치기" : "접기"}">${rcState.min ? "▢" : "—"}</button></span></div>
    <div class="rc-body">
      <details class="rc-info"${d.title?.trim() ? "" : " open"}><summary><span>페이지 정보</span><b>${esc(d.title || "(제목 없음)")}</b></summary>
        <div class="rc-fields"><label class="fld"><span>페이지 제목</span><input class="f" id="lbTitle" data-lb="title" value="${esc(d.title)}"></label>
          <div class="fld"><span>메뉴 그룹</span>${groupSelHTML("lay", d.group)}</div>
          <label class="fld"><span>설명</span><input class="f" id="lbDesc" data-lb="desc" value="${esc(d.desc)}"></label>
          <button type="button" class="btn sm danger" data-l="del">이 페이지 삭제</button></div></details>
      <div class="rc-search"><input class="f" id="palQ" type="search" placeholder="위젯 찾기 (${Object.keys(TYPES).length}개)" value="${esc(pal.q)}" autocomplete="off" aria-label="위젯 찾기"></div>
      <div class="rc-cats" role="tablist">${[["", "전체"], ...WCATS.map(([c]) => [c, c])].map(([c, l]) => `<button type="button" class="rc-cat${pal.cat === c ? " on" : ""}" data-pcat="${esc(c)}" role="tab" aria-selected="${pal.cat === c}">${esc(l)}</button>`).join("")}</div>
      <div class="palette" aria-label="위젯 목록 (끌어다 놓거나 눌러서 추가)"></div>
      <div class="lb-msg" id="layMsg" role="status"></div>
      <div class="rc-tip">끌어다 원하는 자리에 놓거나, 눌러서 맨 아래에 추가</div>
    </div>`;
  renderPalette(); placeRc();
}
function renderPalette() {
  const box = $("#layBar .palette"); if (!box) return;
  const q = pal.q.trim().toLowerCase();
  const match = k => { const t = TYPES[k]; return !q || `${t.name} ${t.desc} ${wcatOf(k)}`.toLowerCase().includes(q); };
  const known = new Set(WCATS.flatMap(([, ks]) => ks)), cats = [...WCATS, ["기타", Object.keys(TYPES).filter(k => !known.has(k))]];
  const groups = cats.filter(([c]) => q || !pal.cat || pal.cat === c).map(([c, ks]) => [c, ks.filter(k => TYPES[k] && match(k))]).filter(([, ks]) => ks.length);
  box.innerHTML = groups.map(([c, ks]) => `<div class="pal-g"><div class="pal-gh">${esc(c)} <span>${ks.length}</span></div><div class="pal-grid">${ks.map(k => `<button type="button" class="pal" draggable="true" data-ptype="${k}" title="${esc(TYPES[k].desc)} · 끌어다 놓거나 눌러서 추가">${wimg(k)}<span class="pal-t"><b>${esc(TYPES[k].name)}</b><span>${esc(TYPES[k].desc)}</span></span></button>`).join("")}</div></div>`).join("")
    || `<div class="tp-none">‘${esc(pal.q.trim())}’에 맞는 위젯이 없습니다.</div>`;
}
/* 화면 안에 머물게 위치 맞추기 */
function placeRc() {
  const b = $("#layBar"); if (!b || b.hidden) return;
  if (innerWidth <= 640) { b.style.left = b.style.top = ""; return; }
  const w = b.offsetWidth, h = b.offsetHeight, x = rcState.x ?? innerWidth - w - 24, y = rcState.y ?? 76;
  b.style.left = Math.max(8, Math.min(innerWidth - w - 8, x)) + "px";
  b.style.top = Math.max(8, Math.min(innerHeight - Math.min(h, 60) - 8, y)) + "px";
}
addEventListener("resize", () => { if (lay.on) placeRc(); });
$("#layBar").addEventListener("pointerdown", e => {
  const h = e.target.closest("[data-rc-drag]"); if (!h || e.target.closest("button, input, a") || e.button !== 0 || innerWidth <= 640) return;
  const b = $("#layBar"), r = b.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
  e.preventDefault(); h.setPointerCapture(e.pointerId); b.classList.add("moving");
  const move = ev => { rcState.x = ev.clientX - dx; rcState.y = ev.clientY - dy; placeRc(); };
  const up = () => { h.removeEventListener("pointermove", move); h.removeEventListener("pointerup", up); h.removeEventListener("pointercancel", up); b.classList.remove("moving");
    const rr = b.getBoundingClientRect(); rcState.x = rr.left; rcState.y = rr.top; saveRc(); };
  h.addEventListener("pointermove", move); h.addEventListener("pointerup", up); h.addEventListener("pointercancel", up);
});
$("#layBar").addEventListener("dblclick", e => { if (e.target.closest("[data-rc-drag]") && !e.target.closest("button")) { rcState.min = !rcState.min; saveRc(); renderLayBar(); } });
$("#layBar").addEventListener("input", e => { if (e.target.id === "palQ") { pal.q = e.target.value; renderPalette(); } });   /* 목록만 다시 그림 → 한글 입력 유지 */
$("#layBar").addEventListener("keydown", e => {
  if (e.target.id !== "palQ" || e.isComposing || e.keyCode === 229) return;
  if (e.key === "Enter") { e.preventDefault(); $("#layBar .palette .pal")?.click(); }                 /* 첫 번째 결과 추가 */
  if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); e.target.value = pal.q = ""; renderPalette(); }
});
function enterLayout(focusWi) {
  const page = cfg.pages.find(p => p.id === currentId()); if (!page || currentDs()) return;
  if (ed.mode) closeDrawer(true);
  Object.assign(lay, { on: true, draft: structuredClone(page), pageId: page.id });
  document.body.classList.add("layout");
  renderLayBar(); render();
  if (typeof focusWi === "number") openWidget(focusWi);
}
function leaveLayout() { lay.on = false; lay.draft = null; document.body.classList.remove("layout"); $("#layBar").hidden = true; }
function openWidget(i, isNew) {
  Object.assign(ed, { mode: "widget", tab: "gui", wi: i, isNewW: !!isNew, draft: structuredClone(lay.draft), open: new Set([i]) });
  showModal();
}
function flashW(i, noScroll) { const el = $(`#board .lw[data-wi="${i}"]`); if (!el) return; el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); if (!noScroll) el.scrollIntoView({ block: "nearest" }); }
$("#layBar").addEventListener("input", e => {
  const k = e.target.dataset.lb; if (!k || !lay.on) return;
  lay.draft[k] = e.target.value;
  if (k === "title") { $("#pTitle").textContent = e.target.value || "(제목 없음)"; const t = $("#layBar .rc-info summary b"); if (t) t.textContent = e.target.value || "(제목 없음)"; }
  if (k === "desc") $("#pDesc").textContent = e.target.value;
});
$("#layBar").addEventListener("click", e => {
  const c = e.target.closest("[data-pcat]"); if (c) { pal.cat = pal.cat === c.dataset.pcat ? "" : c.dataset.pcat; document.querySelectorAll("#layBar .rc-cat").forEach(x => { const on = x.dataset.pcat === pal.cat; x.classList.toggle("on", on); x.setAttribute("aria-selected", on); }); renderPalette(); return; }
  if (e.target.closest('[data-rc="min"]')) { rcState.min = !rcState.min; saveRc(); renderLayBar(); return; }
  const b = e.target.closest("[data-l], .pal"); if (!b || !lay.on) return;
  if (b.classList.contains("pal")) {                      /* 눌러서 추가 (끌기 대신) */
    const ws = lay.draft.widgets ||= []; ws.push(DEFAULTS[b.dataset.ptype]());
    renderBoard(lay.draft); flashW(ws.length - 1, true); openWidget(ws.length - 1, true); return;
  }
  const a = b.dataset.l;
  if (a === "cancel") { leaveLayout(); render(); }
  if (a === "save") {
    if (!lay.draft.title?.trim()) { if (rcState.min) { rcState.min = false; renderLayBar(); } $("#layBar .rc-info").open = true; $("#layMsg").textContent = "페이지 제목을 입력하세요."; $("#lbTitle").focus(); return; }
    const i = cfg.pages.findIndex(p => p.id === lay.pageId); cfg.pages[i] = lay.draft;
    persist(); leaveLayout(); render(); toast("페이지를 저장했습니다.");
  }
  if (a === "del") {
    if (!arm(b, "한 번 더 누르면 페이지 삭제")) return;
    cfg.pages = cfg.pages.filter(p => p.id !== lay.pageId); persist(); leaveLayout();
    location.hash = cfg.pages[0]?.id || ""; render(); toast("페이지를 삭제했습니다.");
  }
});
/* 끌어다 놓기 */
let dragSrc = null, resizing = false;
document.addEventListener("dragstart", e => {
  if (!lay.on || resizing) { if (resizing) e.preventDefault(); return; }
  const pal = e.target.closest?.(".pal"), lw = e.target.closest?.(".lw");
  if (pal) { dragSrc = { kind: "new", t: pal.dataset.ptype }; e.dataTransfer.effectAllowed = "copy"; e.dataTransfer.setData("text/plain", pal.dataset.ptype); document.body.classList.add("dragging-new"); }
  else if (lw) { dragSrc = { kind: "move", i: +lw.dataset.wi }; e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", "w" + lw.dataset.wi); setTimeout(() => lw.classList.add("dragging"), 0); }
});
function clearDrop() { document.querySelectorAll("#board .drop-before, #board .drop-after, #board .drop-end.on").forEach(x => x.classList.remove("drop-before", "drop-after", "on")); }
document.addEventListener("dragend", () => { dragSrc = null; clearDrop(); document.body.classList.remove("dragging-new"); document.querySelectorAll(".lw.dragging").forEach(x => x.classList.remove("dragging")); });
function dropTarget(e) {
  const lw = e.target.closest?.(".lw"), n = (lay.draft.widgets || []).length;
  if (!lw) return { idx: n, el: $("#board .drop-end"), cls: "on" };
  const r = lw.getBoundingClientRect(), i = +lw.dataset.wi, after = e.clientX > r.left + r.width / 2;
  return { idx: after ? i + 1 : i, el: lw, cls: after ? "drop-after" : "drop-before" };
}
$("#board").addEventListener("dragover", e => { if (!lay.on || !dragSrc) return; e.preventDefault(); e.dataTransfer.dropEffect = dragSrc.kind === "new" ? "copy" : "move"; const t = dropTarget(e); clearDrop(); t.el?.classList.add(t.cls); });
$("#board").addEventListener("dragleave", e => { if (!e.relatedTarget || !$("#board").contains(e.relatedTarget)) clearDrop(); });
$("#board").addEventListener("drop", e => {
  if (!lay.on || !dragSrc) return;
  e.preventDefault();
  const { idx } = dropTarget(e), ws = lay.draft.widgets ||= [], src = dragSrc;
  dragSrc = null; clearDrop(); document.body.classList.remove("dragging-new");
  if (src.kind === "new") { ws.splice(idx, 0, DEFAULTS[src.t]()); renderBoard(lay.draft); flashW(idx, true); openWidget(idx, true); return; }
  let to = idx > src.i ? idx - 1 : idx;
  if (to !== src.i) { const [w] = ws.splice(src.i, 1); ws.splice(to, 0, w); }
  renderBoard(lay.draft); flashW(to);
});
/* 오른쪽 가장자리를 끌어 폭 조절 (12칸 격자에 맞춤) */
$("#board").addEventListener("pointerdown", e => {
  const h = e.target.closest?.(".lw-resize"); if (!h || !lay.on) return;
  e.preventDefault(); resizing = true;
  const lw = h.closest(".lw"), i = +h.dataset.i, br = $("#board").getBoundingClientRect(), gap = parseFloat(getComputedStyle($("#board")).columnGap) || 14;
  const colW = (br.width - gap * 11) / 12, left = lw.getBoundingClientRect().left;
  let span = lay.draft.widgets[i].span || 6;
  lw.classList.add("resizing"); h.setPointerCapture(e.pointerId);
  const move = ev => {
    span = Math.max(3, Math.min(12, Math.round((ev.clientX - left + gap) / (colW + gap))));
    lw.style.gridColumn = `span ${span}`; lw.querySelector(".lw-span").textContent = `폭 ${span}/12`;
  };
  const up = () => {
    h.removeEventListener("pointermove", move); h.removeEventListener("pointerup", up); h.removeEventListener("pointercancel", up);
    resizing = false; lay.draft.widgets[i].span = span; renderBoard(lay.draft);
  };
  h.addEventListener("pointermove", move); h.addEventListener("pointerup", up); h.addEventListener("pointercancel", up);
});

/* ---------- 위젯 내보내기 ---------- */
const EXPORTS = {
  kpi:      [["xlsx", "엑셀"], ["csv", "CSV"]],
  bar:      [["png", "이미지 (PNG)"], ["svg", "벡터 이미지 (SVG)"], ["xlsx", "데이터 엑셀"], ["csv", "데이터 CSV"]],
  line:     [["png", "이미지 (PNG)"], ["svg", "벡터 이미지 (SVG)"], ["xlsx", "데이터 엑셀"], ["csv", "데이터 CSV"]],
  hbar:     [["xlsx", "엑셀"], ["csv", "CSV"]],
  table:    [["xlsx", "엑셀"], ["csv", "CSV"]],
  tasks:    [["xlsx", "엑셀"], ["csv", "CSV"]],
  progress: [["xlsx", "엑셀"], ["csv", "CSV"]],
  note:     [["txt", "텍스트 (TXT)"]]
};
Object.entries(XW).forEach(([k, x]) => { EXPORTS[k] = x.exports || [["xlsx", "엑셀"], ["csv", "CSV"]]; });
const KPI_ST = { good: "양호", warning: "주의", serious: "경고", critical: "긴급" };
/* 위젯 → 2차원 표 [머리글, ...행] */
function widgetRows(w) {
  if (XW[w.type]?.table) return XW[w.type].table(w);
  const u = w.unit ? ` (${w.unit})` : "";
  switch (w.type) {
    case "kpi": return [["지표", "값", "단위", "상태", "증감", "보조 설명"],
      ...(w.items || []).map(k => [k.label, k.value, k.unit, KPI_ST[k.status] || "", k.delta ?? "", k.deltaLabel || ""])];
    case "bar": case "line": {
      const S = w.series || [], hasT = typeof w.target === "number";
      return [["항목", ...S.map(s => s.name + u), ...(hasT ? ["목표" + u] : [])],
        ...(w.labels || []).map((l, i) => [l, ...S.map(s => s.values?.[i] ?? ""), ...(hasT ? [w.target] : [])])];
    }
    case "hbar": return [["항목", "값" + u], ...(w.items || []).map(i => [i.label, i.value])];
    case "table": { const C = w.columns || []; return [C.map(c => c.label), ...(w.rows || []).map(r => C.map(c => r[c.key] ?? ""))]; }
    case "tasks": return [["내용", "담당", "기한", "상태", "진행률(%)"], ...(w.items || []).map(t => [t.title, t.owner, t.due, t.status, t.progress ?? ""])];
    case "progress": return [["항목", "현재", "최대", "달성률(%)", "메모"],
      ...(w.items || []).map(p => { const mx = p.max || 100; return [p.label, p.value, mx, Math.round(p.value / mx * 1000) / 10, p.note || ""]; })];
    case "note": return [["내용"], ...(w.lines || []).map(l => [l])];
  }
  return [];
}
const today8 = () => new Date().toLocaleDateString("sv-SE").replace(/-/g, "");
const fname = (w, ext) => `${boardPage?.title || "대시보드"}_${w.title || TYPES[w.type]?.name || "위젯"}_${today8()}.${ext}`.replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, " ");
function download(blob, name) {
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
let toastT;
function toast(t, undo) {
  let el = $("#toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.innerHTML = `<span>${esc(t)}</span>${undo ? `<button type="button" class="toast-act">되돌리기</button>` : ""}`;
  el.classList.toggle("has-act", !!undo); el.classList.add("on");
  if (undo) el.querySelector(".toast-act").onclick = () => { clearTimeout(toastT); el.classList.remove("on", "has-act"); undo(); };
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("on", "has-act"), undo ? 8000 : 2600);
}
function toCSV(rows) {
  const cell = v => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  return "﻿" + rows.map(r => r.map(cell).join(",")).join("\r\n");   /* BOM: 엑셀에서 한글 깨짐 방지 */
}
let xlsxLoading;
function loadXLSX() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  return xlsxLoading ||= new Promise((ok, no) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    s.onload = () => window.XLSX ? ok(window.XLSX) : no(new Error("XLSX 없음"));
    s.onerror = () => { xlsxLoading = null; no(new Error("엑셀 라이브러리를 불러오지 못했습니다")); };
    document.head.appendChild(s);
  });
}
function exportDataset(ds) {
  const F = dsFields(ds), rows = [F.map(f => f.label), ...(ds.records || []).map(r => recView(ds, r)).sort((a, b) => cmp(a[ds.dateField], b[ds.dateField])).map(r => F.map(f => f.type === "file" ? attList(r[f.key]).map(a => a.path).join("\n") : valText(r[f.key]) ?? ""))];
  exportRowsXLSX(rows, ds.name, `${ds.name}_데이터_${today8()}`);
}
function exportXLSX(w) { exportRowsXLSX(widgetRows(w), w.title || "데이터", fname(w, "x").slice(0, -2)); }
async function exportRowsXLSX(rows, sheet, base) {
  try {
    const X = await loadXLSX();
    const ws = X.utils.aoa_to_sheet(rows);
    ws["!cols"] = rows[0].map((_, c) => ({ wch: Math.min(48, Math.max(8, ...rows.map(r => String(r[c] ?? "").length * 1.8 + 2))) }));
    const wb = X.utils.book_new();
    X.utils.book_append_sheet(wb, ws, String(sheet).replace(/[\\/?*[\]:]/g, " ").slice(0, 31));
    X.writeFile(wb, base + ".xlsx");
    toast("엑셀 파일로 저장했습니다.");
  } catch (e) {
    download(new Blob([toCSV(rows)], { type: "text/csv;charset=utf-8" }), base + ".csv");
    toast("인터넷 연결이 없어 엑셀 대신 CSV로 저장했습니다. CSV도 엑셀에서 열립니다.");
  }
}
/* 차트 SVG를 독립 파일로: 계산된 색·글꼴을 속성으로 굳히고 제목·배경을 붙임 */
const STYLE_PROPS = ["fill", "stroke", "stroke-width", "stroke-dasharray", "opacity", "font-size", "font-weight", "font-family", "visibility"];
function standaloneSVG(i, w) {
  const src = document.querySelector(`#board [data-wcard="${i}"] .chart svg`);
  if (!src) return null;
  const clone = src.cloneNode(true), so = src.querySelectorAll("*"), co = clone.querySelectorAll("*");
  so.forEach((el, k) => { const cs = getComputedStyle(el); STYLE_PROPS.forEach(p => co[k].setAttribute(p, cs.getPropertyValue(p))); co[k].removeAttribute("class"); co[k].removeAttribute("data-tip"); });
  clone.querySelectorAll("rect").forEach(r => { if (r.getAttribute("fill") === "rgba(0, 0, 0, 0)") r.remove(); });
  const [, , vw, vh] = src.getAttribute("viewBox").split(" ").map(Number);
  const head = 44, pad = 16, W2 = vw + pad * 2, H2 = vh + head + pad;
  const rs = getComputedStyle(document.documentElement), font = rs.getPropertyValue("--f-sans");
  const leg = (w.series || []).length > 1 ? w.series.map((s, si) => `<rect x="${0}" y="0" width="10" height="10" rx="2" fill="${rs.getPropertyValue(SERIES[si % 4]).trim()}" transform="translate(${W2 - pad - (w.series.length - si) * 90},${pad + 4})"/><text x="${W2 - pad - (w.series.length - si) * 90 + 14}" y="${pad + 13}" font-size="11" fill="${rs.getPropertyValue("--ink-2").trim()}" font-family='${font}'>${esc(s.name)}</text>`).join("") : "";
  const out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}" viewBox="0 0 ${W2} ${H2}">
<rect width="100%" height="100%" fill="${rs.getPropertyValue("--surface").trim()}"/>
<text x="${pad}" y="${pad + 12}" font-size="15" font-weight="600" fill="${rs.getPropertyValue("--ink").trim()}" font-family='${font}'>${esc(w.title || "")}</text>
<text x="${pad}" y="${pad + 30}" font-size="11" fill="${rs.getPropertyValue("--ink-3").trim()}" font-family='${font}'>${esc([w.subtitle, w.unit && "단위: " + w.unit, boardPage?.title].filter(Boolean).join(" · "))}</text>
${leg}<g transform="translate(${pad},${head})">${clone.innerHTML}</g></svg>`;
  return { svg: out, w: W2, h: H2 };
}
function exportImage(i, w, fmt) {
  const r = standaloneSVG(i, w);
  if (!r) { toast("차트를 찾지 못했습니다. 화면을 새로 고친 뒤 다시 시도하세요."); return; }
  if (fmt === "svg") { download(new Blob([r.svg], { type: "image/svg+xml" }), fname(w, "svg")); toast("SVG 이미지로 저장했습니다."); return; }
  const img = new Image(), scale = 2;
  img.onload = () => {
    const c = document.createElement("canvas"); c.width = r.w * scale; c.height = r.h * scale;
    const ctx = c.getContext("2d"); ctx.scale(scale, scale); ctx.drawImage(img, 0, 0);
    c.toBlob(b => { download(b, fname(w, "png")); toast("PNG 이미지로 저장했습니다."); }, "image/png");
  };
  img.onerror = () => toast("이미지 변환에 실패했습니다. SVG로 저장해 보세요.");
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(r.svg);
}
function runExport(i, fmt) {
  const w = boardRes[i] || boardPage?.widgets?.[i]; if (!w) return;
  if (fmt === "csv") { download(new Blob([toCSV(widgetRows(w))], { type: "text/csv;charset=utf-8" }), fname(w, "csv")); toast("CSV로 저장했습니다."); }
  else if (fmt === "xlsx") exportXLSX(w);
  else if (fmt === "txt") { download(new Blob([(w.title ? w.title + "\r\n\r\n" : "") + (w.lines || []).map(l => String(l).replace(/<[^>]+>/g, "")).join("\r\n")], { type: "text/plain;charset=utf-8" }), fname(w, "txt")); toast("텍스트 파일로 저장했습니다."); }
  else exportImage(i, w, fmt);
}
/* 내보내기 메뉴 */
function closeXMenu() { $("#xmenu")?.remove(); }
function openXMenu(btn) {
  closeXMenu();
  const i = +btn.dataset.i, w = boardRes[i] || boardPage?.widgets?.[i]; if (!w) return;
  const m = document.createElement("div");
  m.id = "xmenu"; m.className = "xmenu"; m.setAttribute("role", "menu");
  m.innerHTML = `<h6>${esc(w.title || TYPES[w.type]?.name || "위젯")} 내보내기</h6>` +
    ((EXPORTS[w.type] || [["csv", "CSV"]]).map(([f, l]) => `<button type="button" role="menuitem" data-fmt="${f}" data-i="${i}"><span>${l}</span><span class="ext">.${f}</span></button>`).join("") || `<p class="xm-none">이 위젯은 내보낼 데이터가 없습니다.</p>`);
  document.body.appendChild(m);
  const r = btn.getBoundingClientRect(), mr = m.getBoundingClientRect();
  m.style.left = Math.max(8, Math.min(innerWidth - mr.width - 8, r.right - mr.width)) + "px";
  m.style.top = (r.bottom + mr.height + 8 > innerHeight ? r.top - mr.height - 4 : r.bottom + 4) + "px";
  m.querySelector("button")?.focus();
  m.addEventListener("click", e => { const b = e.target.closest("[data-fmt]"); if (b) { closeXMenu(); runExport(+b.dataset.i, b.dataset.fmt); } });
}
document.addEventListener("click", e => {
  const b = e.target.closest('[data-a="w-export"]');
  if (b) { e.stopPropagation(); $("#xmenu") && $("#xmenu").dataset.for === b.dataset.i ? closeXMenu() : (openXMenu(b), $("#xmenu") && ($("#xmenu").dataset.for = b.dataset.i)); return; }
  if (!e.target.closest("#xmenu")) closeXMenu();
}, true);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeXMenu(); });
addEventListener("scroll", e => { if (!e.target.closest?.("#xmenu")) closeXMenu(); }, true);     /* 메뉴 안 목록을 스크롤할 때는 닫지 않음 */

/* ---------- 데이터 파일 저장소 ----------
   대시보드 폴더/data/
     app.json                  화면 구성(페이지·메뉴 순서)과 데이터 목록 순서, 첨부 사용 횟수
     registers/<데이터 id>.json  데이터마다 한 파일: 항목 구성(fields)과 기록(records)
   시작할 때 이 파일들을 읽어 화면을 그리고, 고칠 때마다 바뀐 파일만 다시 씁니다.
   브라우저 저장소(localStorage)는 빠른 첫 화면과 폴더 연결 전 임시 보관용 사본입니다. */
const DATA_DIR = "data", REG_DIR = "registers", PENDING_KEY = "qa-dashboard-pending";
const store = { state: "init", src: "", at: "", written: {}, timer: null, busy: null, warned: false, bootCache: false };
const regFile = id => `${safeName(id)}.json`;
function splitCfg(c) {
  const { datasets, ...rest } = c;
  return { app: { format: "qa-dashboard/1", ...rest, registers: (datasets || []).map(d => d.id) }, regs: datasets || [] };
}
function joinCfg(app, regs) {
  const { registers = [], format, ...rest } = app;
  const byId = Object.fromEntries(regs.filter(Boolean).map(r => [r.id, r]));
  const ordered = registers.map(id => byId[id]).filter(Boolean);
  return { ...rest, datasets: [...ordered, ...regs.filter(r => r && !registers.includes(r.id))] };
}
/* 사람이 열어 봐도 읽기 쉽게: 항목 구성은 들여쓰기, 기록은 한 줄에 하나 */
function fmtReg(reg) {
  const { records = [], ...meta } = reg, head = JSON.stringify(meta, null, 2);
  return `${head.slice(0, -2)},\n  "records": [${records.length ? "\n" + records.map(r => "    " + JSON.stringify(r)).join(",\n") + "\n  " : ""}]\n}\n`;
}
const fmtApp = app => JSON.stringify(app, null, 2) + "\n";
async function readFromHTTP() {
  if (location.protocol === "file:") return null;                      /* 파일로 직접 연 경우 브라우저가 막음 → 폴더 연결로 읽기 */
  const r = await fetch(`${DATA_DIR}/app.json`, { cache: "no-store" }); if (!r.ok) return null;
  const app = await r.json();
  const regs = await Promise.all((app.registers || []).map(async id => { const x = await fetch(`${DATA_DIR}/${REG_DIR}/${encodeURIComponent(regFile(id))}`, { cache: "no-store" }); return x.ok ? x.json() : null; }));
  return joinCfg(app, regs);
}
async function readFromDir(root) {
  let d; try { d = await root.getDirectoryHandle(DATA_DIR); } catch (e) { return null; }
  let app; try { const txt = await (await (await d.getFileHandle("app.json")).getFile()).text(); app = JSON.parse(txt); store.diskApp = txt; } catch (e) { return null; }
  const rd = await d.getDirectoryHandle(REG_DIR, { create: true });
  const regs = await Promise.all((app.registers || []).map(async id => { try { return JSON.parse(await (await (await rd.getFileHandle(regFile(id))).getFile()).text()); } catch (e) { return null; } }));
  return joinCfg(app, regs);
}
async function writeText(dir, name, text) { markWrite(); const w = await (await dir.getFileHandle(name, { create: true })).createWritable(); await w.write(text); await w.close(); }
async function writeAll(root, c) {
  const { app, regs } = splitCfg(c);
  const d = await root.getDirectoryHandle(DATA_DIR, { create: true }), rd = await d.getDirectoryHandle(REG_DIR, { create: true });
  /* 다른 창·다른 PC·생성 도구가 그사이 파일을 바꿨으면 덮어쓰지 않고 알림 */
  if (store.written["app.json"]) { let cur = null; try { cur = await (await (await d.getFileHandle("app.json")).getFile()).text(); } catch (e) {}
    if (cur !== null && cur !== store.written["app.json"]) throw Object.assign(new Error("데이터 파일이 다른 곳에서 바뀌었습니다"), { name: "ExternalChange" }); }
  let n = 0;
  for (const reg of regs) {
    const name = regFile(reg.id), text = fmtReg(reg), key = `${REG_DIR}/${name}`;
    if (store.written[key] !== text) { await writeText(rd, name, text); store.written[key] = text; n++; }
  }
  const keep = new Set(regs.map(r => regFile(r.id)));                  /* 지운 데이터의 파일 정리 */
  for await (const [name, h] of rd.entries()) if (h.kind === "file" && name.endsWith(".json") && !keep.has(name)) { await rd.removeEntry(name); delete store.written[`${REG_DIR}/${name}`]; n++; }
  const at = fmtApp(app);
  if (store.written["app.json"] !== at) { await writeText(d, "app.json", at); store.written["app.json"] = at; n++; }
  return n;
}
function rememberWritten(c) {                                           /* 읽어 온 내용은 다시 쓰지 않도록 기억 */
  const { app, regs } = splitCfg(c); store.written = { "app.json": store.diskApp ?? fmtApp(app) };   /* 비교 기준은 폴더에서 실제로 읽은 글자 그대로 */
  regs.forEach(r => { store.written[`${REG_DIR}/${regFile(r.id)}`] = fmtReg(r); });
}
const cacheOnly = () => { try { localStorage.setItem(LS_KEY, JSON.stringify(cfg)); } catch (e) {} };
const setPending = on => { try { on ? localStorage.setItem(PENDING_KEY, "1") : localStorage.removeItem(PENDING_KEY); } catch (e) {} };
const isPending = () => { try { return !!localStorage.getItem(PENDING_KEY); } catch (e) { return false; } };
function adopt(c, src) {
  cfg = c; upgrade(cfg); (cfg.migr ||= {}).fileStore1 = true; (cfg.migr).attachReset1 = true;
  if (src === "dir") rememberWritten(cfg); else store.written = {};
  snapRecords();
  cacheOnly(); setPending(false); fver++;
  store.src = src; store.state = "ok"; store.at = nowHM();
  if (ed.mode && ed.mode !== "record") closeDrawer(true);
  render(); renderStoreChip();
}
const nowHM = () => new Date().toTimeString().slice(0, 5);
/* 저장: persist()가 부르며, 잠시 모았다가 바뀐 파일만 씁니다 */
function scheduleStore() {
  setPending(true);
  clearTimeout(store.timer);
  store.timer = setTimeout(flushStore, 350);
  if (!(projDir && dirReady)) { store.state = "pending"; renderStoreChip(); if (!store.warned && store.src) { store.warned = true; toast("고친 내용을 데이터 파일에 저장하려면 왼쪽 아래 ‘데이터 폴더 연결’을 한 번 눌러 주세요. 그 전까지는 브라우저에 보관됩니다."); } }
}
/* 고르는 중에 창을 닫거나 새로 고쳐도 고른 값은 브라우저에 남김 (다음에 열 때 파일로 저장) */
addEventListener("pagehide", () => { if (tp.after) { tp.after = null; try { persist(); } catch (e) {} } });
const pickerOpen = () => !!document.querySelector("#tagpop, #ssel, #dvfpop, #proppop, #xmenu.xq");
async function flushStore() {
  if (!(projDir && dirReady)) return;
  if (pickerOpen()) { clearTimeout(store.timer); store.timer = setTimeout(flushStore, 600); return; }   /* 고르는 창이 닫힌 뒤에 저장 */
  if (store.busy) { await store.busy; return flushStore(); }
  store.state = "saving"; renderStoreChip();
  store.busy = (async () => {
    try {
      (cfg.migr ||= {}).fileStore1 = true;
      try { await autoBackup(projDir); } catch (e) {}          /* 하루 한 번 data/ → backup/날짜/ */
      await writeAll(projDir, cfg);
      markWrite(); cacheOnly(); setPending(false); store.state = "ok"; store.at = nowHM(); store.src ||= "dir";
    } catch (e) {
      if (e.name === "ExternalChange") {                     /* 최신 파일을 다시 불러옴 (이 창의 저장 안 된 변경은 버림) */
        const fc = await readFromDir(projDir).catch(() => null);
        if (fc) { store.busy = null; adopt(fc, "dir"); toast("데이터 파일이 다른 곳(다른 창·PC)에서 바뀌어 최신 내용을 다시 불러왔습니다. 방금 고친 내용은 저장되지 않았습니다."); return; }
      }
      if (e.name === "NotAllowedError") dirReady = false;
      store.state = dirReady ? "error" : "pending"; store.err = e.message;
    }
  })();
  await store.busy; store.busy = null; renderStoreChip();
}
/* 폴더가 연결되면: 파일이 있으면 읽고, 브라우저에만 있는 변경이 있으면 파일로 보냄 */
async function syncWithFolder() {
  const fc = await readFromDir(projDir).catch(() => null);
  const legacy = store.bootCache && !cfg.migr?.fileStore1;            /* 이 업데이트 전부터 브라우저에 있던 데이터 */
  const push = !fc || legacy || (isPending() && cfg.migr?.fileStore1);
  if (!push) {
    const lost = isPending();
    adopt(fc, "dir");
    toast(lost ? "데이터 파일을 불러왔습니다. 폴더 연결 전에 고친 내용은 파일 기준으로 덮어썼습니다." : "data 폴더의 파일을 불러왔습니다.");
    return;
  }
  if (fc) rememberWritten(fc); else store.written = {};      /* 이 폴더에 실제로 있는 내용 기준으로 비교 */
  await flushStore();
  if (store.state === "ok") toast(fc ? "브라우저에 보관 중이던 내용을 데이터 파일에 저장했습니다." : `데이터 ${cfg.datasets.length}개를 data 폴더에 JSON 파일로 만들었습니다.`);
}
function connectStore() {
  store.state = "saving"; renderStoreChip();
  return connectProjDir().then(syncWithFolder).catch(e => { store.state = isPending() ? "pending" : store.src ? "ok" : "off"; renderStoreChip(); if (e.name !== "AbortError") toast(fsErr(e)); });
}
/* 파일에서 다시 불러오기 (브라우저 사본 버림) */
async function reloadFromFiles() {
  let fc = await readFromHTTP().catch(() => null), src = "http";
  if (!fc && projDir && dirReady) { fc = await readFromDir(projDir).catch(() => null); src = "dir"; }
  if (!fc) return false;
  adopt(fc, src); return true;
}
function renderStoreChip() {
  let el = $("#storeChip");
  if (!el) { el = document.createElement("button"); el.type = "button"; el.id = "storeChip"; el.className = "store-chip"; $("#btnNew").parentElement.prepend(el); el.addEventListener("click", () => { if (projDir && dirReady) flushStore().then(() => toast(store.state === "ok" ? "데이터 파일에 저장했습니다." : `저장하지 못했습니다: ${store.err || ""}`)); else connectStore(); }); }
  const S = {
    init: ["wait", "데이터 파일 확인 중…", ""],
    ok: ["ok", `데이터 파일 ${store.src === "http" && !(projDir && dirReady) ? "불러옴" : "저장됨"}${store.at ? " · " + store.at : ""}`, projDir && dirReady ? "data 폴더의 JSON 파일과 맞춰져 있습니다. 누르면 지금 다시 저장합니다." : "data 폴더의 JSON 파일을 불러와 보여 주는 중입니다. 고치려면 폴더 연결이 필요합니다."],
    saving: ["wait", "파일에 저장 중…", ""],
    pending: ["warn", "파일 저장 대기 · 폴더 연결", "고친 내용이 아직 브라우저에만 있습니다. 눌러서 대시보드 폴더를 연결하면 data 폴더의 JSON 파일에 저장됩니다."],
    off: ["warn", "데이터 폴더 연결", "data 폴더의 JSON 파일을 읽고 쓰려면 눌러서 대시보드 폴더를 연결하세요."],
    error: ["bad", "파일 저장 실패 · 다시 시도", store.err || ""]
  }[store.state] || ["wait", "", ""];
  el.className = `store-chip ${S[0]}`; el.innerHTML = `<i aria-hidden="true"></i><span>${esc(S[1])}</span>`; el.title = S[2];
}
/* 시작: 브라우저 사본으로 먼저 그린 뒤, 데이터 파일을 읽어 바꿔 그림 */
async function bootStore() {
  renderStoreChip();
  await dirInit;
  const legacy = store.bootCache && !cfg.migr?.fileStore1, pending = isPending();
  let fc = null, src = "";
  if (projDir && dirReady) { fc = await readFromDir(projDir).catch(() => null); if (fc) src = "dir"; }   /* 쓸 수 있는 폴더가 있으면 그 폴더가 기준 */
  if (!fc) { try { fc = await readFromHTTP(); if (fc) src = "http"; } catch (e) {} }
  if (store.state !== "init") return;                  /* 읽는 사이 사용자가 이미 폴더를 연결해 맞췄으면 그대로 둠 */
  if (fc && !legacy && !(pending && cfg.migr?.fileStore1)) { adopt(fc, src); if (src === "http") store.written = {}; return; }
  store.written = src === "dir" ? (rememberWritten(fc), store.written) : {};
  if (fc) store.src = src;
  if (projDir && dirReady) { await flushStore(); if (!fc && store.state === "ok") toast(`데이터 ${cfg.datasets.length}개를 data 폴더에 JSON 파일로 만들었습니다.`); return; }
  store.state = legacy || pending ? "pending" : "off"; renderStoreChip();
}

snapRecords();
render();
store.bootCache = hadCache;
bootStore();
try {
  const ro = JSON.parse(sessionStorage.getItem(REOPEN_KEY) || "null");
  if (ro && Date.now() - ro.at < 10 * 60e3 && dsById(ro.ds)) {
    Object.assign(ed, { mode: "record", ds: ro.ds, tab: "gui", isNew: ro.isNew, draft: ro.draft });
    showModal(); ed.dirty = true;
    msg("페이지가 새로 고쳐져서, 입력하던 기록을 다시 열었습니다. 첨부 파일도 그대로 연결되어 있습니다.", true);
  }
} catch (e) {}
})();
