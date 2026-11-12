// @ts-nocheck
/**
 * The radio engine: dial, knobs, lock, sound, rooms, harmonium, back panel, postcard.
 * Ported from v1 as one function so it can be loaded lazily (see components/radio/RadioBoot.tsx).
 * Rendering is plain DOM on purpose: it was built and tested that way and it is the safest route.
 * Content comes from src/content/*: edit those files, not this one.
 */
import { CONFIG as USER, SONGS } from '@/content/config';
import { PERSON } from '@/content/site';
import { toolIconBody } from '@/content/icons';

let started = false;
export function startRadio() {
if (started) return;
started = true;
'use strict';

const CONFIG = { email: PERSON.email, ...USER, songs: SONGS };

/* ================= helpers ================= */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const root = document.documentElement;
const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const params = new URLSearchParams(location.search);
const mulberry = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const enc = s => 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")';

/* ================= SOUND: Web Audio only. Nothing plays until the visitor switches the radio on. ================= */
const IDS = ['malkauns', 'bhairav', 'bilaval', 'todi', 'brindavani-sarang', 'bhimpalasi', 'yaman', 'bihag'];
const RATIO = { S: 1, r: 16 / 15, R: 9 / 8, g: 6 / 5, G: 5 / 4, M: 4 / 3, 'M#': 45 / 32, P: 3 / 2, d: 8 / 5, D: 5 / 3, n: 9 / 5, N: 15 / 8 }; // just intonation from Sa
/* Alaap phrases: swara:beats. A comma before = lower octave, an apostrophe after = upper octave, _ = breath.
   Each uses ONLY the swaras of its raga, leans on the vadi (the long notes) and ends on Sa. Scaled to about 21 seconds. */
const PHR = {
  malkauns: ",n:1.2 S:1.6 g:1.4 M:3.2 _:.8 g:1.4 M:1.6 d:1.2 n:2 d:1.2 M:3 _:.8 g:1.4 S:2.4 ,n:1.4 S:4",
  bhairav: "S:2 G:1 M:1.2 P:2 d:3.5 _:.8 P:1 M:1 G:1.2 r:3 _:.8 S:3 ,N:1 S:2.4 r:2.2 S:4",
  bilaval: "S:1.5 R:1 G:1.5 M:1 P:2 D:3.5 _:.8 N:1.2 S':2 N:1.2 D:3.5 _:.8 P:1.5 M:1 G:1.5 R:1.5 S:4",
  todi: ",N:1 S:1.5 r:1.2 g:3 _:.8 r:1 g:1.2 M#:1.6 P:2 d:3.5 _:.8 N:1 d:1.6 P:1.5 M#:1 g:2.5 r:1.5 S:4",
  'brindavani-sarang': ",n:1.2 S:1.6 R:3.5 _:.8 M:1.2 P:2 n:1.6 P:1.2 M:1.2 R:3.5 _:.8 S:1.2 ,n:1.6 S:4",
  bhimpalasi: ",n:1.2 S:1.4 g:1.6 M:3.5 _:.8 P:1 M:1.2 g:1.2 R:1.2 S:2 _:.8 ,n:1.2 ,D:1.4 ,n:1.2 S:1.6 g:1.4 M:3.5 _:.8 P:1.6 D:1.2 n:1.6 D:1.2 P:1.2 M:2 g:1.5 R:1.2 S:4",
  yaman: ",N:1.2 R:1.4 G:3.5 _:.8 M#:1.2 P:2 M#:1.2 G:1.2 R:1.4 S:2 _:.8 ,N:1.2 R:1.2 G:3.2 M#:1.4 D:1.6 P:1.4 M#:1.2 G:3 _:.6 R:1.4 S:4",
  bihag: ",N:1.2 S:1.5 G:3.5 M:1.2 P:2 G:1.4 M:1.4 G:2.4 R:1.2 S:2 _:.8 ,N:1.4 ,P:1.6 ,N:1.2 S:2 G:3.5 M#:1.2 P:2.2 G:1.4 M:1.2 G:1.4 R:1.4 S:4.5"
};
const SIGN_ON = "S:.5 G:.5 P:.6 S':1.4 N:.5 D:.5 P:1.2 _:.4 G:.5 R:.5 S:2";          // 6 s, Bilaval
const SIGN_OFF = "S':.7 n:.5 d:.5 P:.7 M:.6 g:.6 r:.5 S:2.2";                          // 3 s, Bhairavi (S r g M P d n)

const SOUND = (() => {
  const SA = CONFIG.saHz, FLUTE = SA * 2;                    // tanpura Sa, flute one octave up
  let ctx = null, engine = false, quiet = false, vol = .6, forced = null;
  let master, comp, analyser, duckG, musicBus, musicG, bpF, gBP, hpF, lpF, gFull, tanG, humG, statG, crack, fxBus, noiseBuf;
  const W = {};
  let tanOn = false, tanNext = 0, tanStep = 0, tanFirst = 'P', tanTimer = 0, tanFileSrc = null, crackTimer = 0;
  let ph = null, phIdx = -1, phTimer = 0, sign = null, preloaded = false;
  let listen = 'flute', noteCb = null, sgT = [], swOf = () => [];   // what the radio plays: flute | sargam | song (drone only) | mute (quiet)
  const files = { phrases: {}, tanpura: null, signOn: null, signOff: null };

  const live = () => !!(ctx && engine && !quiet);

  function build() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { ctx = new AC(); } catch (e) { ctx = null; return false; }
    const c = ctx;
    noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const mk = im => c.createPeriodicWave(new Float32Array(im.length), Float32Array.from(im));
    W.body = mk([0, 1, .62, .38, .22, .14, .09]);                        // tanpura string body
    W.buzz = mk([0, 0, 0, .2, .5, .7, .8, .7, .6, .5, .4, .3, .2]);      // jawari buzz: harmonics 4 to 12
    W.flute = mk([0, 1, .18, .07, .03]); W.reed = mk([0, 1, .55, .7, .3, .4, .18, .24, .09, .12]);                                  // bansuri: nearly a pure tone

    master = c.createGain(); master.gain.value = .0001;
    comp = c.createDynamicsCompressor(); comp.threshold.value = -16; comp.knee.value = 18; comp.ratio.value = 3; comp.attack.value = .01; comp.release.value = .25;
    analyser = c.createAnalyser(); analyser.fftSize = 8192; analyser.smoothingTimeConstant = .6;
    master.connect(comp); comp.connect(c.destination); comp.connect(analyser);

    duckG = c.createGain(); duckG.connect(master);
    musicG = c.createGain(); musicG.gain.value = 0; musicG.connect(duckG);
    musicBus = c.createGain();
    // like a real set: a narrow band-pass path (tinny) that crossfades into a wide, full path as you tune in
    bpF = c.createBiquadFilter(); bpF.type = 'bandpass'; bpF.frequency.value = 1500; bpF.Q.value = 1.6;
    gBP = c.createGain(); gBP.gain.value = 1;
    hpF = c.createBiquadFilter(); hpF.type = 'highpass'; hpF.frequency.value = 70;
    lpF = c.createBiquadFilter(); lpF.type = 'lowpass'; lpF.frequency.value = 7000;
    gFull = c.createGain(); gFull.gain.value = 0;
    musicBus.connect(bpF); bpF.connect(gBP); gBP.connect(musicG);
    musicBus.connect(hpF); hpF.connect(lpF); lpF.connect(gFull); gFull.connect(musicG);
    tanG = c.createGain(); tanG.gain.value = .8; tanG.connect(musicBus);

    // static: filtered noise with random crackle
    const ss = c.createBufferSource(); ss.buffer = noiseBuf; ss.loop = true;
    const sh = c.createBiquadFilter(); sh.type = 'highpass'; sh.frequency.value = 600;
    const sl = c.createBiquadFilter(); sl.type = 'lowpass'; sl.frequency.value = 6500;
    crack = c.createGain(); crack.gain.value = .5;
    statG = c.createGain(); statG.gain.value = .2;
    ss.connect(sh); sh.connect(sl); sl.connect(crack); crack.connect(statG); statG.connect(master); ss.start();

    // 50 Hz mains hum (India)
    const h1 = c.createOscillator(); h1.type = 'sawtooth'; h1.frequency.value = 50;
    const hl = c.createBiquadFilter(); hl.type = 'lowpass'; hl.frequency.value = 300;
    const h2 = c.createOscillator(); h2.type = 'sine'; h2.frequency.value = 100;
    const h2g = c.createGain(); h2g.gain.value = .6;
    humG = c.createGain(); humG.gain.value = 0;
    h1.connect(hl); hl.connect(humG); h2.connect(h2g); h2g.connect(humG); humG.connect(master); h1.start(); h2.start();

    fxBus = c.createGain(); fxBus.connect(master);
    return true;
  }

  function applyMaster(sec) {
    if (!ctx) return;
    const t = (!engine || quiet) ? .0001 : Math.max(.0001, vol * vol * .68), now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(.0001, master.gain.value), now);
    master.gain.exponentialRampToValueAtTime(t, now + (sec || .08));
  }

  /* ---------- tanpura: Pa, Sa, Sa, low Sa on a rolling 6.4 s cycle (Ma instead of Pa for Malkauns) ---------- */
  function pluck(k, t) {
    const c = ctx;
    const f = k === 0 ? SA * (tanFirst === 'M' ? (4 / 3) * .5 : .75) : k === 3 ? SA * .5 : SA * (k === 2 ? 1.0009 : 1);
    const a = k === 3 ? .24 : .19;
    const o1 = c.createOscillator(); o1.setPeriodicWave(W.body); o1.frequency.value = f;
    const g1 = c.createGain(); g1.gain.setValueAtTime(0, t); g1.gain.linearRampToValueAtTime(a, t + .012); g1.gain.setTargetAtTime(0, t + .012, 2.3);
    const o2 = c.createOscillator(); o2.setPeriodicWave(W.buzz); o2.frequency.value = f * 1.0015;
    const g2 = c.createGain(); g2.gain.setValueAtTime(0, t); g2.gain.linearRampToValueAtTime(a * .5, t + .9); g2.gain.setTargetAtTime(0, t + .9, 1.9);   // the buzz blooms as the note decays
    o1.connect(g1); o2.connect(g2); g1.connect(tanG); g2.connect(tanG);
    o1.start(t); o2.start(t); o1.stop(t + 8.5); o2.stop(t + 8.5);
    o2.onended = () => { try { g1.disconnect(); g2.disconnect(); } catch (_) {} };
  }
  function tanTick() {
    if (!tanOn || !ctx || ctx.state !== 'running') return;
    const horizon = ctx.currentTime + .7;
    while (tanNext < horizon) { pluck(tanStep % 4, tanNext); tanStep++; tanNext += 1.6 + (Math.random() - .5) * .09; }
  }
  function drone() {
    if (!live()) return;
    if (files.tanpura) { startTanFile(); return; }
    if (tanOn) return;
    tanOn = true; tanNext = ctx.currentTime + .4; tanTick(); tanTimer = setInterval(tanTick, 220);
  }
  function droneStop() { tanOn = false; clearInterval(tanTimer); if (tanFileSrc) { try { tanFileSrc.stop(); } catch (_) {} tanFileSrc = null; } }
  function startTanFile() {
    if (tanFileSrc || !files.tanpura || !ctx) return;
    tanOn = false; clearInterval(tanTimer);
    const s = ctx.createBufferSource(); s.buffer = files.tanpura; s.loop = true; s.connect(tanG); s.start(); tanFileSrc = s;
  }

  /* ---------- bansuri: soft attack, breath noise, vibrato after ~300 ms, meend between close notes ---------- */
  function parse(str, target) {
    const raw = str.trim().split(/\s+/).map(t => { const i = t.lastIndexOf(':'); return { n: t.slice(0, i), b: parseFloat(t.slice(i + 1)) }; });
    const sum = raw.reduce((a, x) => a + x.b, 0), k = target / sum; let t = 0;
    return raw.map(x => { const o = { n: x.n, start: t, dur: x.b * k }; t += o.dur; return o; });
  }
  function freqOf(n) {
    let oct = 1;
    if (n[0] === ',') { oct = .5; n = n.slice(1); }
    if (n.slice(-1) === "'") { oct = 2; n = n.slice(0, -1); }
    return FLUTE * RATIO[n] * oct;
  }
  function voice(notes, t0, level) {
    const c = ctx, ns = notes.filter(n => n.n !== '_').map(n => ({ f: freqOf(n.n), s: t0 + n.start, d: n.dur }));
    if (!ns.length) return { end: t0, stop() {} };
    const out = c.createGain(); out.connect(musicBus);
    const osc = c.createOscillator(); osc.setPeriodicWave(W.flute); osc.frequency.value = ns[0].f;
    const amp = c.createGain(); amp.gain.value = .0001;
    const vib = c.createOscillator(); vib.frequency.value = 5.1;
    const vg = c.createGain(); vg.gain.value = 0; vib.connect(vg); vg.connect(osc.detune);       // detune is in cents
    const nz = c.createBufferSource(); nz.buffer = noiseBuf; nz.loop = true;
    const nb = c.createBiquadFilter(); nb.type = 'bandpass'; nb.frequency.value = 3000; nb.Q.value = .7;   // breath, roughly 2 to 4 kHz
    const ng = c.createGain(); ng.gain.value = .3;
    osc.connect(amp); nz.connect(nb); nb.connect(ng); ng.connect(amp); amp.connect(out);
    ns.forEach((n, i) => {
      const prev = ns[i - 1], next = ns[i + 1], e = n.s + n.d;
      const leg = !!prev && n.s - (prev.s + prev.d) < .4;          // closer than 400 ms: glide (meend)
      const nextLeg = !!next && next.s - e < .4;
      const peak = level * (n.d > 2.4 ? 1 : .86);
      if (!leg) { osc.frequency.setValueAtTime(n.f, n.s); amp.gain.setValueAtTime(.0001, n.s); amp.gain.linearRampToValueAtTime(peak, n.s + .09); }
      else {
        osc.frequency.setValueAtTime(prev.f, n.s); osc.frequency.exponentialRampToValueAtTime(n.f, n.s + Math.min(.2, n.d * .35));
        amp.gain.linearRampToValueAtTime(peak * .82, n.s + .04); amp.gain.linearRampToValueAtTime(peak, n.s + .18);
      }
      vg.gain.setValueAtTime(0, n.s);
      const ve = Math.min(n.s + .8, e);
      if (ve > n.s + .3) { vg.gain.setValueAtTime(0, n.s + .3); vg.gain.linearRampToValueAtTime(6 * (ve - n.s - .3) / .5, ve); }   // up to +/-6 cents at about 5 Hz
      if (!nextLeg) { amp.gain.setValueAtTime(peak, e - .03); amp.gain.setTargetAtTime(.0001, e - .03, .12); }
    });
    const end = ns[ns.length - 1].s + ns[ns.length - 1].d, stopAt = end + .6;
    osc.start(t0); vib.start(t0); nz.start(t0); osc.stop(stopAt); vib.stop(stopAt); nz.stop(stopAt);
    osc.onended = () => { try { out.disconnect(); } catch (_) {} };
    return {
      end,
      stop(fade) {                                                  // cut cleanly: quick fade, then stop everything
        const n = c.currentTime, f = fade || .08;
        out.gain.cancelScheduledValues(n); out.gain.setValueAtTime(out.gain.value, n); out.gain.linearRampToValueAtTime(0, n + f);
        const st = n + f + .02; try { osc.stop(st); vib.stop(st); nz.stop(st); } catch (_) {}
      }
    };
  }
  function playFile(buf, t0, level) {                                 // your own recording instead of the synth
    const out = ctx.createGain(); out.gain.value = level; out.connect(musicBus);
    const s = ctx.createBufferSource(); s.buffer = buf; s.connect(out); s.start(t0);
    s.onended = () => { try { out.disconnect(); } catch (_) {} };
    return {
      end: t0 + buf.duration,
      stop(fade) { const n = ctx.currentTime, f = fade || .08; out.gain.cancelScheduledValues(n); out.gain.setValueAtTime(out.gain.value, n); out.gain.linearRampToValueAtTime(0, n + f); try { s.stop(n + f + .02); } catch (_) {} }
    };
  }

  /* ---------- the alaap cycle for the locked station ---------- */
  function stopPhrase() { clearTimeout(phTimer); sgT.forEach(clearTimeout); sgT = []; if (noteCb) noteCb(null); if (ph) { ph.stop(); ph = null; } phIdx = -1; }
  function loop(idx) {
    if (phIdx !== idx || !live()) return;
    if (ctx.state !== 'running') { phTimer = setTimeout(() => loop(idx), 800); return; }   // tab hidden or still waking: wait, never stack phrases
    const id = IDS[idx], buf = files.phrases[id], t0 = ctx.currentTime + .3;
    let len, gap = 7;
    if (listen === 'sargam') {                                          // the raga's own notes, sung as sa re ga, with a caption per note
      const sg = sargam(idx); ph = voice(sg.notes, t0, .32); len = sg.len; gap = 4;
      sgT = sg.notes.filter(n => n.n !== '_').map(n => setTimeout(() => { if (noteCb && phIdx === idx) noteCb(n.n); }, Math.max(0, (t0 - ctx.currentTime + n.start) * 1000)));
      sgT.push(setTimeout(() => { if (noteCb) noteCb(null); }, (len + .2) * 1000));
    }
    else if (buf) { ph = playFile(buf, t0, .9); len = buf.duration; }
    else { ph = voice(parse(PHR[id], 21), t0, .32); len = 21; }
    phTimer = setTimeout(() => loop(idx), (len + .3 + gap) * 1000);     // then a few seconds of drone alone, and again
  }
  const ORDER = ['S', 'r', 'R', 'g', 'G', 'M', 'M#', 'P', 'd', 'D', 'n', 'N'];
  function sargam(idx) {                                                // aroha to upper Sa and back, using only this raga's swaras
    const sw = ORDER.filter(x => swOf(idx).includes(x));
    const toks = sw.map(x => x + ':1').concat(["S':1.2"], sw.slice().reverse().map((x, i, a) => x + (i === a.length - 1 ? ':3.2' : ':1')));
    const sum = toks.reduce((a, t) => a + parseFloat(t.slice(t.lastIndexOf(':') + 1)), 0), len = sum * .62;
    return { notes: parse(toks.join(' '), len), len };
  }
  function setListen(m) { listen = m; stopPhrase(); }
  function phrase(idx) {
    if (!live() || listen === 'song') return;
    if (sign) { sign.stop(.3); sign = null; }
    if (phIdx === idx) return;
    stopPhrase(); phIdx = idx; loop(idx);
  }
  function setStation(idx) { tanFirst = idx === 0 ? 'M' : 'P'; if (phIdx !== -1 && phIdx !== idx) stopPhrase(); }

  /* ---------- tuning: static crossfades into music ---------- */
  function setTune(t) {
    if (!ctx || !engine) return;
    if (forced != null) t = forced;
    const now = ctx.currentTime;
    musicG.gain.setTargetAtTime(Math.pow(t, 1.3), now, .05);
    gFull.gain.setTargetAtTime(t, now, .06);
    gBP.gain.setTargetAtTime(1 - t * .92, now, .06);
    statG.gain.setTargetAtTime(.2 * Math.pow(1 - t, .8) + .006, now, .05);
  }
  function crackTick() {
    if (!ctx || ctx.state !== 'running') return;
    const now = ctx.currentTime, n = Math.random() < .55 ? Math.floor(Math.random() * 3) : 0, ts = [];
    for (let i = 0; i < n; i++) ts.push(now + Math.random() * .18);
    ts.sort((a, b) => a - b).forEach(t => { crack.gain.setTargetAtTime(2.2, t, .002); crack.gain.setTargetAtTime(.5, t + .012, .02); });
  }

  /* ---------- little mechanical sounds ---------- */
  function burst(freq, q, gain, dur, t) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + .0015); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(fxBus); s.start(t, Math.random() * 1.5, dur + .02);
  }
  function thump(f0, f1, gain, dur, t) {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + .003); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(fxBus); o.start(t); o.stop(t + dur + .02);
  }
  function tock() { if (!live()) return; const t = ctx.currentTime; thump(210, 85, .22, .07, t); burst(1100, 1.2, .12, .03, t); }
  function tick(l) { if (!live()) return; burst(2200, 2, .05 * (l || 1), .012, ctx.currentTime); }
  function clunk() { if (!live()) return; const t = ctx.currentTime; thump(95, 42, .34, .16, t); burst(700, .9, .16, .05, t); }
  function tink() {
    if (!live()) return; const t = ctx.currentTime;
    [2100, 3150].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05 / (i + 1), t + .002); g.gain.exponentialRampToValueAtTime(.0001, t + .28);
      o.connect(g); g.connect(fxBus); o.start(t); o.stop(t + .3);
    });
  }

  /* ---------- power on / sign-on / sign-off ---------- */
  function load(url) {
    return fetch(url).then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); })
      .then(b => new Promise((res, rej) => ctx.decodeAudioData(b, res, rej))).catch(() => null);
  }
  function preload() {
    const A = CONFIG.audio || {};
    if (A.signOn) load(A.signOn).then(b => { files.signOn = b; });
    if (A.signOff) load(A.signOff).then(b => { files.signOff = b; });
    if (A.tanpura) load(A.tanpura).then(b => { files.tanpura = b; if (b && engine) startTanFile(); });
    IDS.forEach(id => { const u = A.phrases && A.phrases[id]; if (u) load(u).then(b => { files.phrases[id] = b; }); });
  }
  function start() {                                                  // must run inside a click or key press
    if (quiet) return false;
    engine = true;
    if (!ctx && !build()) { engine = false; return false; }
    if (ctx.resume) ctx.resume();
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now); master.gain.setValueAtTime(.0001, now);
    applyMaster(1.5);                                                  // fade in over 1.5 s from almost nothing
    humG.gain.cancelScheduledValues(now); humG.gain.setTargetAtTime(.014, now, .8);   // valves warming up
    clearInterval(crackTimer); crackTimer = setInterval(crackTick, 180);
    if (!preloaded) { preloaded = true; preload(); }
    return true;
  }
  function signOn() {
    if (!live()) return;
    drone(); forced = 1; setTune(1);
    const t0 = ctx.currentTime + 1;
    sign = files.signOn ? playFile(files.signOn, t0, .9) : voice(parse(SIGN_ON, 6), t0, .38);
  }
  function releaseForce() { forced = null; }
  function cutSignOn() { forced = null; if (sign) { sign.stop(.15); sign = null; } }
  function signOff(done) {
    whirr(false);
    if (!live()) { if (done) done(); return; }
    stopPhrase(); if (sign) { sign.stop(.1); sign = null; }
    forced = 1; setTune(1);
    const t0 = ctx.currentTime + .25;
    sign = files.signOff ? playFile(files.signOff, t0, .9) : voice(parse(SIGN_OFF, 3), t0, .36);
    setTimeout(() => {
      clunk(); humG.gain.setTargetAtTime(0, ctx.currentTime, .15);
      engine = false; applyMaster(.5); droneStop(); clearInterval(crackTimer); forced = null; sign = null;
      setTimeout(() => { try { ctx.suspend(); } catch (_) {} if (done) done(); }, 700);
    }, 3400);
  }
  function setQuiet(q) {
    quiet = q; if (q) { whirr(false); harmStop(); }
    if (!ctx) return;
    if (q) { applyMaster(.15); stopPhrase(); if (sign) { sign.stop(.1); sign = null; } setTimeout(() => { if (quiet && ctx.state === 'running') ctx.suspend(); }, 300); }
    else if (engine) { ctx.resume(); applyMaster(.8); }
  }
  function setVolume(v) { vol = v; applyMaster(.08); }
  function duck(on) { if (ctx && duckG) duckG.gain.setTargetAtTime(on ? .7 : 1, ctx.currentTime, .08); }   // 30% down while the keyboard plays (Stage 3)

  document.addEventListener('visibilitychange', () => {               // no sound or work in a hidden tab
    if (!ctx || !engine) return;
    if (document.hidden) { try { ctx.suspend(); } catch (_) {} } else if (!quiet) { try { ctx.resume(); } catch (_) {} }
  });

  function meter() {                                                  // for testing only (?debug)
    if (!analyser) return { rms: 0, peak: 0, state: 'none' };
    const n = analyser.fftSize, td = new Float32Array(n); analyser.getFloatTimeDomainData(td);
    let s = 0; for (let i = 0; i < n; i++) s += td[i] * td[i];
    const fd = new Float32Array(analyser.frequencyBinCount); analyser.getFloatFrequencyData(fd);
    let mi = 0, mv = -1e9; for (let i = 3; i < fd.length; i++) if (fd[i] > mv) { mv = fd[i]; mi = i; }
    return { rms: Math.sqrt(s / n), peak: mi * ctx.sampleRate / n, state: ctx.state };
  }

  /* ---------- harmonium (Stage 3): two slightly detuned reeds and a little air; the music ducks 30% while you play ---------- */
  const HV = new Map(); let duckT = 0;
  function harmOn(id, ratio) {
    if (!live() || HV.has(id)) return;
    if (HV.size >= 6) harmOff(HV.keys().next().value);
    const t = ctx.currentTime, f = SA * 2 * ratio;
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
    o1.setPeriodicWave(W.reed); o2.setPeriodicWave(W.reed); o1.frequency.value = f; o2.frequency.value = f; o1.detune.value = -5; o2.detune.value = 6;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600; lp.Q.value = .5;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.1, t + .05);
    const nz = ctx.createBufferSource(); nz.buffer = noiseBuf; nz.loop = true;
    const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 1800; nf.Q.value = .7;
    const ng = ctx.createGain(); ng.gain.value = .014;
    o1.connect(lp); o2.connect(lp); lp.connect(g); nz.connect(nf); nf.connect(ng); ng.connect(g); g.connect(fxBus);
    o1.start(t); o2.start(t); nz.start(t, Math.random());
    HV.set(id, { o1, o2, nz, g }); clearTimeout(duckT); duck(true);
  }
  function harmOff(id) {
    const v = HV.get(id); if (!v || !ctx) return; HV.delete(id);
    const t = ctx.currentTime; v.g.gain.cancelScheduledValues(t); v.g.gain.setValueAtTime(v.g.gain.value, t); v.g.gain.setTargetAtTime(0, t, .07);
    setTimeout(() => { try { v.o1.stop(); v.o2.stop(); v.nz.stop(); } catch (_) {} }, 600);
    if (!HV.size) { clearTimeout(duckT); duckT = setTimeout(() => { if (!HV.size) duck(false); }, 700); }
  }
  function harmStop() { [...HV.keys()].forEach(harmOff); }

  function om() {                                                      // easter egg: a slow Sa-Pa-Sa swell
    if (!live()) return;
    const t = ctx.currentTime, g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.14, t + 1.4); g.gain.setTargetAtTime(0, t + 2.4, .7); g.connect(fxBus);
    [[SA / 2, 1], [SA, .8], [SA * 1.5, .5], [SA * 2, .4]].forEach(([f, a]) => {
      const o = ctx.createOscillator(); o.setPeriodicWave(W.body); o.frequency.value = f;
      const og = ctx.createGain(); og.gain.value = a; o.connect(og); og.connect(g); o.start(t); o.stop(t + 5.5);
    });
    duck(true); clearTimeout(duckT); duckT = setTimeout(() => { if (!HV.size) duck(false); }, 3800);
  }

  /* ---------- sounds for the rooms ---------- */
  function key() { if (!live()) return; const t = ctx.currentTime; thump(240, 110, .3, .07, t); burst(1700, 1.1, .2, .025, t); burst(700, .8, .1, .05, t + .05); }   // a piano key goes down
  function chatter(sec) {                                              // teleprinter feeding out a page, then a bell
    if (!live()) return;
    let t = ctx.currentTime + .05; const end = t + sec;
    while (t < end) { burst(2600 + Math.random() * 1800, 3, .05 + Math.random() * .04, .012, t); t += .028 + Math.random() * .04; }
    setTimeout(() => { if (live()) tink(); }, sec * 1000);
  }
  function clap() { if (!live()) return; const t = ctx.currentTime; burst(1400, .6, .55, .09, t); thump(220, 70, .32, .1, t); burst(3500, 1.2, .2, .04, t); }
  let wh = null;
  function whirr(on) {                                                 // a soft projector hum while the edit bay is open
    if (!ctx || !engine) return;
    if (on && !quiet) {
      if (wh) return;
      const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 520; f.Q.value = .9;
      const g = ctx.createGain(); g.gain.value = 0;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 24; const lg = ctx.createGain(); lg.gain.value = .012;
      lfo.connect(lg); lg.connect(g.gain); s.connect(f); f.connect(g); g.connect(fxBus); s.start(); lfo.start();
      g.gain.setTargetAtTime(.022, ctx.currentTime, .4); wh = { s, lfo, g };
    } else if (wh) {
      const w = wh; wh = null; w.g.gain.setTargetAtTime(0, ctx.currentTime, .15);
      setTimeout(() => { try { w.s.stop(); w.lfo.stop(); } catch (_) {} }, 700);
    }
  }
  function bed(v) {                                                    // in the desk rooms: no static, just a quiet drone
    if (!ctx || !engine) return;
    if (v == null) { forced = null; tanG.gain.setTargetAtTime(.8, ctx.currentTime, .3); }
    else { forced = 1; setTune(1); tanG.gain.setTargetAtTime(v, ctx.currentTime, .3); }
  }

  return { start, setQuiet, setVolume, setTune, setStation, phrase, stopPhrase, setListen, onNote: f => { noteCb = f; }, setSwaras: f => { swOf = f; }, drone, signOn, releaseForce, cutSignOn, signOff, tock, tick, clunk, tink, duck, live, meter, key, chatter, clap, whirr, bed, harmOn, harmOff, harmStop, om, hasContext: () => !!ctx };
})();
if (params.has('debug')) window.__raag = { meter: SOUND.meter };


/* ================= data: read from the real HTML text of the guide ================= */
const P = $$('.prog').map((el, i) => {
  const q = s => { const n = $(s, el); return n ? n.textContent.trim() : ''; };
  return {
    el, i, id: el.dataset.id, zone: el.dataset.zone, zonedev: el.dataset.zonedev,
    dev: q('.p-raga-dev'), lat: q('.p-raga-lat').replace(/^Raag\s+/, ''),
    window: q('.p-time'), mood: q('.p-mood'),
    swaras: el.dataset.swaras.split(' '), vadiKey: el.dataset.vadikey, vadiName: el.dataset.vadi,
    tdev: q('.p-title-dev'), tlat: q('.p-title-lat'), sub: q('.p-sub'), sum: q('.p-sum'),
    tags: $$('.p-tags li', el).map(li => li.textContent.trim()), note: q('.p-note-t')
  };
});
const center = i => 1.5 + 3 * i;
const idxOf = t => clamp(Math.round((t - 1.5) / 3), 0, 7);

/* ================= elements ================= */
const dial = $('#dial'), needle = $('#needle'), needleHit = $('#needleHit'), zonesEl = $('#zones'), scaleEl = $('#scale');
const snow = $('#snow'), lamp = $('#lamp'), eyeGlow = $('#eyeGlow'), eyeShade = $('#eyeShade');
const tuneRot = $('#tuneRot'), knobTune = $('#knobTune'), knobVol = $('#knobVol'), volRot = $('#volRot');
const rt = $('#rt'), rr = $('#rr'), slip = $('#slip'), hint = $('#hint'), nearEl = $('#near');
const sun = $('#sun'), sunWarm = $('#sunWarm'), moon = $('#moon'), stars = $('#stars'), clouds = $('#clouds'), lights = $('#lights');
const pool = $('#pool'), beam = $('#beam'), motes = $('#motes'), dim = $('#dim');
const parFar = $('#parFar'), parMid = $('#parMid'), room = $('#room'), guide = $('#guide');
const F = {}; $$('[data-f]', slip).forEach(n => F[n.dataset.f] = n);
SOUND.setSwaras(i => P[i].swaras);
let listenMode = 'flute', listenOpen = false, harmFree = true, harmOct = 0;
try { const v = localStorage.getItem('raagradio.listen'); if (v === 'sargam' || v === 'song') listenMode = v; harmFree = localStorage.getItem('raagradio.free') !== '0'; } catch (e) {}
const listenEl = $('#listen'), lsSub = $('#lsSub'), lsSong = $('#lsSong'), sgChip = $('#sgChip'), fabMute = $('#fabMute'), listenBtn = $('#listenOpen'), belowEl = $('#below');
SOUND.setListen(listenMode);

/* dial zones (station buttons) + scale */
const zoneEls = P.map(p => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'zone'; b.tabIndex = -1;
  b.setAttribute('aria-label', `Tune to Raag ${p.lat}, ${p.window.replace('–', 'to')}`);
  const n = document.createElement('span'); n.className = 'n'; n.textContent = p.i + 1;
  const l = document.createElement('span'); l.className = 'lbl';
  const d = document.createElement('span'); d.className = 'd'; d.lang = 'hi'; d.textContent = p.zonedev;
  const t = document.createElement('span'); t.className = 'l'; t.textContent = p.zone;
  l.append(d, t); b.append(n, l);
  b.addEventListener('click', e => { if (e.detail === 0) { touched(); tuneTo(p.i, 'key'); } }); // keyboard / screen reader activation
  zonesEl.appendChild(b); return b;
});
(function scale() {
  let s = '<svg viewBox="0 0 240 33" preserveAspectRatio="none">';
  for (let k = 0; k <= 48; k++) {
    const x = k * 5, h3 = k % 6 === 0, h1 = k % 2 === 0;
    s += `<line x1="${x}" x2="${x}" y1="0" y2="${h3 ? 15 : h1 ? 9 : 5}" stroke="#5b3a1e" stroke-width="${h3 ? 1.6 : 1}" vector-effect="non-scaling-stroke"/>`;
  }
  scaleEl.innerHTML = s + '</svg>';
  ['12a', '3', '6', '9', '12p', '3', '6', '9', '12a'].forEach((txt, k) => {
    const e = document.createElement('span'); e.className = 'hr' + (k === 0 ? ' first' : k === 8 ? ' last' : '');
    e.textContent = txt; e.style.left = (k * 12.5) + '%'; scaleEl.appendChild(e);
  });
  // dust motes
  const r = mulberry(9); let m = '';
  for (let k = 0; k < 14; k++) m += `<i style="--x:${(r() * 100).toFixed(0)}%;--y:${(30 + r() * 65).toFixed(0)}%;--d:${(9 + r() * 12).toFixed(1)}s;--l:-${(r() * 12).toFixed(1)}s"></i>`;
  motes.innerHTML = m;
})();

/* ================= state ================= */
const G = { W: innerWidth, H: innerHeight, dialW: 300, horizon: 130, peak: 76 };
const state = { locked: -1, sweeping: false, touched: false, liveIdx: 0 };
let powered = false, leaving = false, signing = false, signT = 0, hasPlayed = false, tuneNow = 0, lastTune = -1, quietPref = false;
let farmOpen = false, flipped = false, view = 'explore', forView = 'edit', lastRoom = 'edit', exploreIntroDone = false, skyLocal = 12, harmOpen = false, deepRadio = false;
try { quietPref = localStorage.getItem('raagradio.quiet') === '1'; } catch (e) {}
SOUND.setQuiet(quietPref);
let cur = 0, target = 0, sv = 0, mv = 0, prevCur = 0, raw = 0;
let mode = 'idle';          // idle | tween | spring | drag
let anim = null, raf = 0, lastT = 0, gesture = null, samples = [];
let lastSky = -9, lastMin = -1, lastNear = -1, lastLock = -2, slipShown = false, slipClosedAt = 0, swapT = 0;
const par = { x: 0, y: 0, tx: 0, ty: 0 };

/* ================= sky = f(dial time) ================= */
const LAYERS = ['night', 'dawn', 'day', 'golden', 'dusk'];
const skyEls = $$('.sky');
const KEYS = [[0, 'night'], [3.2, 'night'], [5.6, 'dawn'], [7.6, 'day'], [13.6, 'day'], [16.2, 'golden'], [18, 'golden'], [19.4, 'dusk'], [21.2, 'night'], [24, 'night']];
function updateSky(t) {
  const w = { night: 0, dawn: 0, day: 0, golden: 0, dusk: 0 };
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i], b = KEYS[i + 1];
    if (t <= b[0]) { const f = a[0] === b[0] ? 1 : smooth((t - a[0]) / (b[0] - a[0])); w[a[1]] += 1 - f; w[b[1]] += f; break; }
  }
  let cum = 0;
  LAYERS.forEach((k, i) => { cum += w[k]; skyEls[i].style.opacity = i === 0 ? 1 : (cum > 0 ? w[k] / cum : 0); });

  const night = w.night, dayL = w.day + w.golden * .8 + w.dawn * .4;
  dim.style.opacity = clamp(night * .9 + w.dusk * .3, 0, 1);
  pool.style.opacity = clamp(night * .9 + w.dusk * .5 + w.dawn * .3, 0, 1);
  lamp.style.opacity = (.4 + .55 * clamp(night + w.dusk * .5, 0, 1)).toFixed(3);
  beam.style.opacity = (w.day * .3 + w.golden * .5 + w.dawn * .26).toFixed(3);
  motes.style.opacity = clamp(dayL * .9, 0, 1).toFixed(3);
  stars.style.opacity = Math.pow(clamp(night, 0, 1), 1.4).toFixed(3);
  clouds.style.opacity = (.1 + .8 * (1 - night)).toFixed(3);
  lights.style.opacity = clamp(night + w.dusk * .8 + w.dawn * .25, 0, 1).toFixed(3);

  // sun 5:36 to 18:24, moon the rest of the night, both rise and set behind the skyline
  const sp = (t - 5.6) / 12.8;
  const sA = sp > 0 && sp < 1 ? smooth(sp / .07) * smooth((1 - sp) / .07) : 0;
  sun.style.opacity = sA.toFixed(3);
  if (sA > 0) {
    sun.style.transform = `translate3d(${(lerp(.08, .92, sp) * G.W).toFixed(1)}px,${(G.horizon - Math.sin(Math.PI * sp) * (G.horizon - G.peak)).toFixed(1)}px,0)`;
    sunWarm.style.opacity = Math.pow(1 - Math.sin(Math.PI * sp), 2.2).toFixed(3);
  }
  const tt = t >= 18.4 ? t : (t <= 5.6 ? t + 24 : -1), mp = (tt - 18.4) / 11.2;
  const mA = tt > 0 && mp > 0 && mp < 1 ? smooth(mp / .07) * smooth((1 - mp) / .07) : 0;
  moon.style.opacity = mA.toFixed(3);
  if (mA > 0) moon.style.transform = `translate3d(${(lerp(.08, .92, mp) * G.W).toFixed(1)}px,${(G.horizon - Math.sin(Math.PI * mp) * (G.horizon - G.peak)).toFixed(1)}px,0)`;
}

/* ================= layout ================= */
function layout() {
  G.W = innerWidth; G.H = innerHeight; G.dialW = dial.clientWidth || 300;
  const wr = $('#wrap').getBoundingClientRect();
  const skH = Math.round(clamp(G.H * .2, 110, 200));
  G.deskY = Math.round(clamp(G.H * .24, Math.min(130, G.H * .3), 230));
  root.style.setProperty('--deskY', G.deskY + 'px');
  const base = view === 'explore' ? wr.top + scrollY + 44 : G.deskY + 6;
  root.style.setProperty('--sk-h', skH + 'px');
  root.style.setProperty('--sk-top', Math.round(base - skH) + 'px');
  const celR = clamp(Math.min(G.W, G.H) * .08, 40, 80) / 2;
  G.peak = Math.max(76, celR + 62);
  G.horizon = Math.max(base - skH * .3, G.peak + 36);
  lastSky = -9; render();
}
let layoutQ = 0;
const queueLayout = () => { if (!layoutQ) layoutQ = requestAnimationFrame(() => { layoutQ = 0; layout(); }); };
addEventListener('resize', queueLayout);
if ('ResizeObserver' in window) new ResizeObserver(queueLayout).observe(dial);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueLayout);
addEventListener('load', queueLayout);

/* ================= the engine: one loop, only runs while something moves ================= */
function run() { if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(frame); } }
function cancelAnim() { anim = null; if (mode === 'tween' || mode === 'spring') mode = 'idle'; state.sweeping = false; }

function springStep(dt) {
  const k = 170, c = 2 * Math.sqrt(k) * .74, n = Math.max(1, Math.ceil(dt / .008)), h = dt / n;
  for (let i = 0; i < n; i++) { sv += (k * (target - cur) - c * sv) * h; cur += sv * h; }
  cur = clamp(cur, 0, 24);
  if (Math.abs(target - cur) < .0015 && Math.abs(sv) < .02) { cur = target; sv = 0; return false; }
  return true;
}

function frame(now) {
  raf = 0;
  const dt = Math.min(.05, Math.max(.001, (now - lastT) / 1000)); lastT = now;
  let active = false;
  if (mode === 'tween' && anim) {
    const p = clamp((now - anim.t0) / anim.dur, 0, 1);
    cur = anim.from + (anim.to - anim.from) * ease(p); sv = 0;
    if (p >= 1) { cur = anim.to; mode = 'idle'; anim = null; state.sweeping = false; } else active = true;
  } else if (mode === 'spring') {
    if (springStep(dt)) active = true; else mode = 'idle';
  } else if (mode === 'drag') active = true;

  mv = active ? lerp(mv, (cur - prevCur) / dt, .4) : 0;
  prevCur = cur;

  let parActive = false;
  if (!RM) {
    par.x += (par.tx - par.x) * .08; par.y += (par.ty - par.y) * .08;
    parActive = Math.abs(par.tx - par.x) > .002 || Math.abs(par.ty - par.y) > .002;
    parFar.style.transform = `translate3d(${(-par.x * 5).toFixed(2)}px,${(-par.y * 3).toFixed(2)}px,0)`;
    parMid.style.transform = `translate3d(${(-par.x * 12).toFixed(2)}px,${(-par.y * 4).toFixed(2)}px,0)`;
    { const pg = !powered ? pwKeys : (view !== 'explore' ? PAGES[view] : null); if (pg) { pg.style.setProperty('--tx', par.x.toFixed(3)); pg.style.setProperty('--ty', par.y.toFixed(3)); }
      if (powered && view !== 'explore') { miniRad.style.setProperty('--tx', par.x.toFixed(3)); miniRad.style.setProperty('--ty', par.y.toFixed(3)); } }   // 3D tilt of the paper, envelope, reel and clapperboard
  }
  render();
  if (active || parActive) run();
}

/* ================= render: transforms and opacity only ================= */
function fmt(t) {
  let m = Math.round(t * 60) % 1440; if (m < 0) m = 0;
  let h = Math.floor(m / 60); const mm = m % 60, ap = h < 12 ? 'AM' : 'PM'; h = h % 12 || 12;
  return `${h}:${String(mm).padStart(2, '0')} ${ap}`;
}
function render() {
  const near = idxOf(cur), d = Math.abs(cur - center(near));
  const stat = smooth((d - .22) / .85);
  const jit = !RM && stat > .3 && mode !== 'idle' ? (Math.random() - .5) * 1.4 * stat : 0;
  needle.style.transform = `translate3d(${(cur / 24 * G.dialW + jit).toFixed(2)}px,0,0)`;
  tuneRot.style.transform = `rotate(${(cur * 30).toFixed(2)}deg)`;     // one full turn = 12 hours
  snow.style.opacity = (.5 * stat).toFixed(3);
  eyeShade.style.transform = `scaleX(${(state.locked >= 0 ? .1 : lerp(.18, 1, stat)).toFixed(3)})`;
  eyeGlow.style.opacity = (state.locked >= 0 ? 1 : .55 + .15 * (1 - stat)).toFixed(2);
  const skyT = view === 'explore' ? cur : skyLocal;                 // the desk rooms show the visitor's real local time
  if (Math.abs(skyT - lastSky) > .003) { lastSky = skyT; updateSky(skyT); }

  const mins = Math.round(cur * 60);
  if (mins !== lastMin) { lastMin = mins; rt.textContent = fmt(cur); }

  // lock detection: needle slow and close to a station centre (with hysteresis)
  let want = state.locked;
  if (state.sweeping) want = -1;
  else if (state.locked >= 0) { if (near !== state.locked || d > .46 || Math.abs(mv) > 5) want = -1; }
  else if (d < .3 && Math.abs(mv) < 2.2) want = near;
  if (want !== state.locked) applyLock(want);

  const amt = state.locked >= 0 ? 1 : 1 - stat;                  // static fades into music as the needle nears a station
  if (Math.abs(amt - lastTune) > .01) { lastTune = amt; tuneNow = amt; if (view === 'explore') SOUND.setTune(amt); }

  if (near !== lastNear && view === 'explore') { SOUND.setStation(near); if (mode !== 'idle' && lastNear >= 0) SOUND.tick(); }
  if (near !== lastNear || lastLock !== state.locked) { lastNear = near; lastLock = state.locked; updateTexts(near); if (harmOpen) harmRefresh(); }
}
function updateTexts(near) {
  rr.textContent = state.locked >= 0 ? P[state.locked].lat : 'tuning…';
  nearEl.textContent = `Nearest: ${P[near].lat} · ${P[near].window}`;
}

/* ================= lock → slip ================= */
function chip(tok, vadiKey) {
  const NAMES = { S: 'Sa', R: 'Re', G: 'Ga', M: 'Ma', P: 'Pa', D: 'Dha', N: 'Ni' };
  const base = tok[0].toUpperCase(), komal = tok[0] !== base, tivra = tok.length > 1;
  const el = document.createElement('span'); el.className = 'sw';
  el.textContent = base + (tivra ? '♯' : '');
  if (komal) el.classList.add('k');
  if (tok === vadiKey) el.classList.add('v');
  el.title = (komal ? 'komal ' : tivra ? 'tivra ' : '') + NAMES[base];
  return el;
}
function fill(i) {
  const p = P[i];
  F.no.textContent = String(i + 1).padStart(2, '0');
  F.time.textContent = p.window; F.mood.textContent = p.mood;
  F.dev.textContent = p.dev; F.lat.textContent = 'Raag ' + p.lat;
  F.chips.textContent = ''; p.swaras.forEach(t => F.chips.appendChild(chip(t, p.vadiKey)));
  F.vadi.textContent = 'Vadi: ' + p.vadiName;
  F.tdev.textContent = p.tdev; F.tlat.textContent = p.tlat;
  F.sub.textContent = p.sub; F.sum.textContent = p.sum; F.note.textContent = p.note;
  F.tags.textContent = ''; p.tags.forEach(t => { const li = document.createElement('li'); li.textContent = t; F.tags.appendChild(li); });
  F.np.textContent = '';
  const s = CONFIG.songs[p.id];
  if (s && s.title) {
    const w = document.createElement('div'); w.className = 'np-song';
    const a = document.createElement('strong'); a.textContent = s.title;
    const b = document.createElement('span'); b.textContent = [s.film, s.year].filter(Boolean).join(' · ');
    const sg = Array.isArray(s.singers) ? s.singers : (s.singer ? [s.singer] : []);
    const c = document.createElement('span'); c.textContent = [sg.length && (sg.length > 1 ? 'Singers: ' : 'Singer: ') + sg.join(' & '), s.composer && 'Music: ' + s.composer].filter(Boolean).join(' · ');
    w.append(a, b, c);
    if (s.raga) { const rg = document.createElement('span'); rg.className = 'np-raga'; rg.textContent = 'Raga: ' + s.raga + (s.ragaVerified ? '' : ' (to be confirmed)'); w.appendChild(rg); }
    if (s.url) { const l = document.createElement('a'); l.href = s.url; l.target = '_blank'; l.rel = 'noopener'; l.textContent = 'Listen ↗'; l.style.cssText = 'display:inline-block;margin-top:4px;font-weight:600'; w.appendChild(l); }
    F.np.appendChild(w);
  } else {
    const w = document.createElement('p'); w.className = 'np-pending';
    const b = document.createElement('b'); b.lang = 'hi'; b.textContent = 'फ़रमाइश बाकी';
    w.append(b, ` · Farmaish pending. An old film song in Raag ${p.lat} will be announced here.`);
    F.np.appendChild(w);
  }
  slip.scrollTop = 0;
}
function openSlip() { slipShown = true; slip.classList.add('open'); slip.setAttribute('aria-hidden', 'false'); }
function closeSlip() { if (slipShown) slipClosedAt = performance.now(); slipShown = false; slip.classList.remove('open'); slip.setAttribute('aria-hidden', 'true'); }
function showHint(on) { hint.classList.toggle('off', !on); }
function setAria() {
  const i = state.locked;
  if (i >= 0) { needleHit.setAttribute('aria-valuenow', center(i)); needleHit.setAttribute('aria-valuetext', `${P[i].lat}, ${P[i].window.replace('–', 'to')}`); }
  else { const n = idxOf(cur); needleHit.setAttribute('aria-valuenow', cur.toFixed(1)); needleHit.setAttribute('aria-valuetext', `Between stations, near ${P[n].lat}`); }
}
function applyLock(i) {
  if (i === state.locked) return;
  state.locked = i;
  zoneEls.forEach((z, k) => z.classList.toggle('on', k === i));
  clearTimeout(swapT);
  if (i < 0) { closeSlip(); showHint(true); setAria(); SOUND.stopPhrase(); return; }
  showHint(false);
  if (slipShown) closeSlip();
  const wait = Math.max(0, slipClosedAt + 340 - performance.now());
  if (wait > 0) swapT = setTimeout(() => { if (state.locked === i) { fill(i); openSlip(); } }, wait);
  else { fill(i); openSlip(); }
  if (state.touched && navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} }
  SOUND.tock(); if (!signing) SOUND.phrase(i);          // the old phrase is already cut; the new alaap starts
  setAria();
}

/* ================= moving the dial ================= */
function touched() { state.touched = true; if (signing) endSign(); }
function tuneTo(idx, why) {
  idx = ((idx % 8) + 8) % 8;
  const to = center(idx), dist = Math.abs(to - cur);
  mode = 'idle'; sv = 0;
  if (dist < .002 || RM) { cur = to; state.sweeping = false; run(); render(); return; }
  const long = why === 'intro' || why === 'auto';
  const dur = long ? clamp(1.5 + dist * .075, 1.5, 3.2) : clamp(.45 + dist * .09, .5, 1.7);
  anim = { from: cur, to, t0: performance.now(), dur: dur * 1000 };
  mode = 'tween'; state.sweeping = true; run();
}
function magnet(x) {            // sticky detent: the needle lingers at each station centre
  const c = center(idxOf(x)), d = x - c, w = .6;
  if (Math.abs(d) >= w) return x;
  return c + Math.sign(d) * w * Math.pow(Math.abs(d) / w, 1.8);
}
function pushSample() {
  const t = performance.now(); samples.push([t, raw]);
  while (samples.length > 1 && t - samples[0][0] > 120) samples.shift();
}
function velocity() {
  if (samples.length < 2) return 0;
  const a = samples[0], b = samples[samples.length - 1], span = (b[0] - a[0]) / 1000;
  if (span < .016 || performance.now() - b[0] > 90) return 0;
  return clamp((b[1] - a[1]) / span, -40, 40);
}
function beginGesture() { cancelAnim(); raw = cur; samples = []; mode = 'drag'; state.sweeping = false; touched(); run(); }
function setFromRaw() { cur = magnet(raw); sv = 0; pushSample(); run(); }
function release() {
  const v = velocity(); samples = [];
  const end = raw + clamp(v * .12, -4, 4);
  target = center(idxOf(end)); sv = clamp(v * .5, -20, 20);
  mode = 'spring'; run();
}

/* needle / dial surface: drag = swipe the dial, tap = tune to that station */
let dg = null;
dial.addEventListener('pointerdown', e => {
  if (e.button > 0) return;
  beginGesture(); dg = { id: e.pointerId, x0: e.clientX, y0: e.clientY, raw0: cur, moved: false };
  try { dial.setPointerCapture(e.pointerId); } catch (_) {}
});
dial.addEventListener('pointermove', e => {
  if (!dg || e.pointerId !== dg.id) return;
  const dx = e.clientX - dg.x0;
  if (!dg.moved) { if (Math.abs(dx) < 6 && Math.abs(e.clientY - dg.y0) < 6) return; dg.moved = true; dial.classList.add('grab'); }
  raw = clamp(dg.raw0 + dx / G.dialW * 24, 0, 24); setFromRaw();
});
function dialEnd(e, cancel) {
  if (!dg || e.pointerId !== dg.id) return;
  const g = dg; dg = null; dial.classList.remove('grab');
  if (!g.moved) {
    if (cancel) { release(); return; }
    const r = dial.getBoundingClientRect();
    tuneTo(clamp(Math.floor((e.clientX - r.left) / r.width * 8), 0, 7), 'tap'); return;
  }
  release();
}
dial.addEventListener('pointerup', e => dialEnd(e, false));
dial.addEventListener('pointercancel', e => dialEnd(e, true));

/* tuning knob: circular drag, 12 hours per turn, 4 detents per turn */
let kg = null;
knobTune.addEventListener('pointerdown', e => {
  if (e.button > 0) return;
  beginGesture();
  const r = knobTune.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  kg = { id: e.pointerId, cx, cy, last: Math.atan2(e.clientY - cy, e.clientX - cx) };
  try { knobTune.setPointerCapture(e.pointerId); } catch (_) {}
});
knobTune.addEventListener('pointermove', e => {
  if (!kg || e.pointerId !== kg.id) return;
  const a = Math.atan2(e.clientY - kg.cy, e.clientX - kg.cx);
  let da = a - kg.last; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI;
  kg.last = a; raw = clamp(raw + da / (2 * Math.PI) * 12, 0, 24); setFromRaw();
});
const knobEnd = e => { if (!kg || e.pointerId !== kg.id) return; kg = null; release(); };
knobTune.addEventListener('pointerup', knobEnd); knobTune.addEventListener('pointercancel', knobEnd);

/* mouse wheel on the dial or the knob */
let wheelOn = false, wheelT = 0;
function onWheel(e) {
  e.preventDefault();
  if (!wheelOn) { wheelOn = true; beginGesture(); }
  const dy = (e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY) + e.deltaX;
  raw = clamp(raw + dy * .012, 0, 24); setFromRaw();
  clearTimeout(wheelT); wheelT = setTimeout(() => { wheelOn = false; release(); }, 150);
}
dial.addEventListener('wheel', onWheel, { passive: false });
knobTune.addEventListener('wheel', onWheel, { passive: false });

/* volume knob */
let vol = .7, volStep = 14;
function setVol(v) { vol = clamp(v, 0, 1); volRot.style.transform = `rotate(${-135 + 270 * vol}deg)`; knobVol.setAttribute('aria-valuenow', Math.round(vol * 100)); SOUND.setVolume(vol); const st = Math.round(vol * 20); if (st !== volStep) { volStep = st; SOUND.tick(.8); } }
setVol(vol);
let vg = null;
knobVol.addEventListener('pointerdown', e => {
  if (e.button > 0) return; touched();
  const r = knobVol.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  vg = { id: e.pointerId, cx, cy, last: Math.atan2(e.clientY - cy, e.clientX - cx) };
  try { knobVol.setPointerCapture(e.pointerId); } catch (_) {}
});
knobVol.addEventListener('pointermove', e => {
  if (!vg || e.pointerId !== vg.id) return;
  const a = Math.atan2(e.clientY - vg.cy, e.clientX - vg.cx);
  let da = a - vg.last; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI;
  vg.last = a; setVol(vol + da / (270 * Math.PI / 180));
});
const vEnd = e => { if (vg && e.pointerId === vg.id) vg = null; };
knobVol.addEventListener('pointerup', vEnd); knobVol.addEventListener('pointercancel', vEnd);
knobVol.addEventListener('keydown', e => {
  const step = { ArrowRight: .05, ArrowUp: .05, ArrowLeft: -.05, ArrowDown: -.05 }[e.key];
  if (step) { e.preventDefault(); setVol(vol + step); }
});

/* keyboard: arrows (or 1 to 8) change station, works when nothing else is focused or the needle is */
function curStation() { return state.locked >= 0 ? state.locked : idxOf(mode === 'tween' && anim ? anim.to : cur); }
addEventListener('keydown', e => {
  if (e.key === 'Escape' && keysEl.classList.contains('open')) { closeRooms(); btnRooms.focus(); return; }
  if (farmOpen) { if (e.key === 'Escape') closeFarm(); return; }
  if (guide.classList.contains('open')) { if (e.key === 'Escape') closeGuide(); return; }
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (!powered || leaving || view !== 'explore' || flipped) return;
  const t = e.target;
  if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
  if (!(t === document.body || t === root || (t && t.closest && t.closest('#dial')))) return;
  let ok = true;
  switch (e.key) {
    case 'ArrowRight': case 'ArrowUp': tuneTo(curStation() + 1, 'key'); break;
    case 'ArrowLeft': case 'ArrowDown': tuneTo(curStation() - 1, 'key'); break;
    case 'PageUp': tuneTo(curStation() + 1, 'key'); break;
    case 'PageDown': tuneTo(curStation() - 1, 'key'); break;
    case 'Home': tuneTo(0, 'key'); break;
    case 'End': tuneTo(7, 'key'); break;
    default: if (/^[1-8]$/.test(e.key)) tuneTo(+e.key - 1, 'key'); else ok = false;
  }
  if (ok) { e.preventDefault(); touched(); }
});

/* gentle mouse parallax (off for reduced motion) */
if (!RM) addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse') return;
  par.tx = (e.clientX / innerWidth - .5) * 2; par.ty = (e.clientY / innerHeight - .5) * 2; run();
}, { passive: true });

/* ================= programme guide overlay ================= */
const btnGuide = $('#btnGuide'), gClose = $('#gClose');
function openGuide(push) {
  guide.classList.add('open'); syncInert();
  if (push) { const u = new URL(location.href); u.searchParams.set('mode', 'guide'); history.replaceState(null, '', u); }
  guide.scrollTop = 0; setTimeout(() => gClose.focus(), 0);
}
function closeGuide() {
  guide.classList.remove('open'); syncInert();
  const u = new URL(location.href); u.searchParams.delete('mode'); history.replaceState(null, '', u);
  (powered ? btnGuide : $('.key.big')).focus();
}
btnGuide.addEventListener('click', () => openGuide(true));
gClose.addEventListener('click', closeGuide);

/* ================= power, quiet mode ================= */
const pw = $('#door'), pwKeys = $('#pwKeys'), pwCap = $('#pwCap'), pwQuiet = $('#pwQuiet'), pwGuide = $('#pwGuide');
const btnSound = $('#btnSound'), btnPower = $('#btnPower');
function syncInert() {
  const ov = guide.classList.contains('open') || farmOpen, blocked = !powered || leaving || ov;
  const set = (el, off) => { el.inert = off; if (off) el.setAttribute('aria-hidden', 'true'); else el.removeAttribute('aria-hidden'); };
  const away = leaving || ov || (powered && view !== 'explore');
  topbar.classList.toggle('idle', !powered); set(topbar, blocked); set(room, away); set(belowEl, away); $('#dock').inert = blocked || harmOpen || listenOpen; set(pageE, blocked || view !== 'edit');
  harm.inert = blocked || !harmOpen; harmBtn.inert = blocked || harmOpen; miniRad.inert = blocked || view === 'explore';
  listenEl.inert = blocked || !listenOpen; fabMute.inert = blocked; $('#cueMore').inert = ov;
  document.body.classList.toggle('lock-scroll', ov);
}
function refreshQuietUI() {
  btnSound.setAttribute('aria-pressed', quietPref ? 'true' : 'false'); btnSound.classList.toggle('is-quiet', quietPref);
  fabMute.classList.toggle('is-quiet', quietPref); fabMute.setAttribute('aria-pressed', quietPref ? 'true' : 'false'); fabMute.setAttribute('aria-label', quietPref ? 'Turn the radio sound on' : 'Mute the radio');
  if (listenOpen) updateListenUI(); if (harmOpen) harmRefresh();
  pwQuiet.textContent = quietPref ? 'Sound on instead' : 'Quiet mode';
  pwCap.textContent = quietPref ? 'Quiet mode is on, so nothing will play. Turn a knob on the radio, or press a key.' : 'A key switches the radio on. Open the Edit bay, or just listen.';
}
function saveQuiet() { try { localStorage.setItem('raagradio.quiet', quietPref ? '1' : '0'); } catch (e) {} }
function setQuietMode(q) {
  quietPref = q; SOUND.setQuiet(q); saveQuiet(); refreshQuietUI();
  if (!q && powered && !leaving && SOUND.start()) {           // sound switched back on while the radio is running
    SOUND.drone(); lastTune = -1; applyViewSound();
  }
}
function endSign() {
  signing = false; clearTimeout(signT); SOUND.cutSignOn();
  if (view === 'explore') { SOUND.setTune(tuneNow); if (state.locked >= 0) SOUND.phrase(state.locked); } else applyViewSound();
}
function applyViewSound() {                                     // what you hear depends on the room you are in
  if (!SOUND.live()) return;
  SOUND.whirr(view === 'edit');
  if (view === 'explore') { SOUND.bed(null); lastTune = -1; SOUND.setTune(tuneNow); if (!signing && state.locked >= 0) SOUND.phrase(state.locked); }
  else { SOUND.stopPhrase(); SOUND.bed(.32); }
}
function powerOn(v, viaKey) {
  if (powered || leaving) return;
  if (typeof v !== 'string' || !ROOM_NAME[v]) v = 'explore';
  forView = v === 'explore' ? lastRoom : v; powered = true;
  pw.classList.add('gone'); room.classList.remove('off');
  lastTune = -1;
  const snd = !quietPref && SOUND.start();                    // this runs inside the click or key press, which unlocks audio
  const first = !hasPlayed; hasPlayed = true;
  if (snd) {
    if (viaKey) SOUND.key(); else SOUND.clunk();
    SOUND.tink(); SOUND.drone();
    if (first) { signing = true; SOUND.signOn(); signT = setTimeout(endSign, 7300); }   // 6 s flute sign-on, whichever way you come in
  }
  introWait = RM ? 0 : (snd && first && v === 'explore' ? 2200 : 700);
  go(v, { first: true });
}
function powerOff() {
  if (!powered || leaving) return;
  if (flipped) setFlip(false, true);
  leaving = true; forView = view === 'explore' ? lastRoom : view; syncInert(); cancelAnim(); clearTimeout(signT); signing = false; SOUND.whirr(false); setHarm(false);
  SOUND.signOff(() => setTimeout(() => {
    powered = false; leaving = false; applyLock(-1); room.classList.add('off'); room.classList.remove('away');
    Object.keys(PAGES).forEach(k => PAGES[k].classList.remove('on'));
    document.body.classList.remove('in-radio', 'in-room'); view = 'explore'; exploreIntroDone = false;
    skyLocal = localHour(); cur = clamp(skyLocal, 0, 24); target = cur; lastSky = -9; lastNear = -1; layout();
    $$('.key.big').forEach(k => k.classList.remove('down'));
    pw.classList.remove('gone'); buildDoor(); syncInert(); refreshQuietUI();
    setTimeout(() => { const k = $('.key.big'); if (k) k.focus({ preventScroll: true }); }, 60);
  }, 250));
}
pwQuiet.addEventListener('click', () => { quietPref = !quietPref; SOUND.setQuiet(quietPref); saveQuiet(); refreshQuietUI(); });
pwGuide.addEventListener('click', () => openGuide(true));
btnSound.addEventListener('click', () => setQuietMode(!quietPref));
btnPower.addEventListener('click', powerOff);

/* ================= rooms: Editing (the Edit bay) and Explore (the radio) ================= */
const topbar = $('#topbar'), pageE = $('#pageEdit'), keysEl = $('#keys'), btnRooms = $('#btnRooms');
const PAGES = { edit: pageE };
const ROOM_NAME = { edit: 'the Edit bay', explore: 'the radio' };
const ALIAS = { edit: 'edit', editing: 'edit', video: 'edit', hiring: 'edit', hire: 'edit', jobs: 'edit', placement: 'edit', explore: 'explore', radio: 'explore', afterhours: 'explore' };
let introWait = 450;
const clapEl = $('#clap'), chipLab = $('#chipLab'), miniRad = $('#miniRad'), mrLab = $('#mrLab');

function closeRooms() { keysEl.classList.remove('open'); btnRooms.setAttribute('aria-expanded', 'false'); }
let clapN = 0, clapT = 0;
function doClap(auto) {
  clapEl.classList.remove('hit'); void clapEl.offsetWidth; clapEl.classList.add('hit'); SOUND.clap();
  if (auto === true) return;
  clearTimeout(clapT); clapN++; clapT = setTimeout(() => { clapN = 0; }, 4000);
  if (clapN >= 5) { clapN = 0; toast('That is a wrap. Take 1, only take.'); setTimeout(() => SOUND.clap(), 160); }
}
function go(v, o) {
  o = o || {};
  if (!powered || leaving) return;
  if (!ROOM_NAME[v]) v = 'explore';
  const was = view; view = v;
  closeRooms();
  if (v !== 'explore') lastRoom = v;
  document.body.classList.remove('past'); if (v !== 'explore' || was !== 'explore') scrollTo({ top: 0, behavior: 'auto' });
  document.body.classList.toggle('in-radio', v === 'explore');
  document.body.classList.toggle('in-room', v !== 'explore');
  if (v !== 'explore') { setHarm(false); if (flipped) setFlip(false, true); }
  $$('[data-go]').forEach(b => b.setAttribute('aria-pressed', b.dataset.go === v ? 'true' : 'false'));
  Object.keys(PAGES).forEach(k => PAGES[k].classList.toggle('on', k === v));
  room.classList.toggle('away', v !== 'explore');
  skyLocal = localHour(); lastSky = -9;
  if (v === 'explore' && !exploreIntroDone) { cur = clamp(skyLocal, 0, 24); target = cur; }   // the sky does not jump on the first visit to the radio
  syncInert(); layout();
  if (o.key) SOUND.key();
  if (v === 'explore') {
    if (!exploreIntroDone) { exploreIntroDone = true; setTimeout(() => { if (view === 'explore' && powered && !leaving) tuneTo(startIdx, 'intro'); }, o.first ? introWait : 450); }
    else { lastNear = -1; render(); }
  } else {
    const d = $('.desk', PAGES[v]); if (d) d.scrollTop = 0;
    if (was !== v || o.first) setTimeout(() => { if (view === 'edit') doClap(true); }, 500);
  }
  applyViewSound();
  try { const u = new URL(location.href); u.searchParams.set('for', v); history.replaceState(null, '', u); } catch (e) {}
  const tgt = v === 'explore' ? needleHit : $('h1', PAGES[v]);
  setTimeout(() => { if (tgt && view === v) tgt.focus({ preventScroll: true }); }, 140);
}

$$('[data-go]').forEach(b => b.addEventListener('click', () => { if (b.dataset.go !== view) go(b.dataset.go, { key: true }); }));
$$('[data-room]').forEach(b => b.addEventListener('click', () => go(b.dataset.room, { key: true })));
miniRad.addEventListener('click', () => go('explore', { key: true }));
// the radio on the first screen wakes when you touch it: any knob, the dial, the cabinet
let wokeAt = 0; const wrapEl = $('#wrap');
wrapEl.addEventListener('pointerdown', e => { if (powered || leaving || e.button > 0) return; e.preventDefault(); e.stopPropagation(); wokeAt = performance.now(); powerOn('explore'); }, true);
wrapEl.addEventListener('click', e => { if (performance.now() - wokeAt < 700) { e.preventDefault(); e.stopPropagation(); } }, true);
$$('[data-radio]').forEach(b => b.addEventListener('click', () => go('explore', { key: true })));
$$('[data-pick]').forEach(b => b.addEventListener('click', () => { b.classList.add('down'); powerOn(b.dataset.pick, true); }));
btnRooms.addEventListener('click', e => { e.stopPropagation(); const o = !keysEl.classList.contains('open'); keysEl.classList.toggle('open', o); btnRooms.setAttribute('aria-expanded', o ? 'true' : 'false'); });
document.addEventListener('click', e => { if (keysEl.classList.contains('open') && !keysEl.contains(e.target) && !btnRooms.contains(e.target)) closeRooms(); });
clapEl.addEventListener('click', () => doClap());

/* 3D tilt from a phone's motion sensor (pointer tilt is handled with the mouse parallax above) */
if (!RM && 'DeviceOrientationEvent' in window) addEventListener('deviceorientation', e => {
  if (view === 'explore' || e.gamma == null) return;
  par.tx = clamp(e.gamma / 30, -1, 1); par.ty = clamp((e.beta - 45) / 30, -1, 1); run();
}, { passive: true });

function buildMini() {
  const d = new Date(), h = d.getHours() + d.getMinutes() / 60, p = P[clamp(Math.floor(h / 3), 0, 7)];
  miniRad.style.setProperty('--mh', (h / 24 * 100).toFixed(1) + '%'); mrLab.textContent = 'On air: ' + p.zone;
}
function buildDoor() {                                           // a small 24 hour dial with a needle at the visitor's real time
  const d = new Date(), h = d.getHours() + d.getMinutes() / 60, idx = clamp(Math.floor(h / 3), 0, 7), p = P[idx];
  const line = $('#airLine'); line.textContent = '';
  const b = document.createElement('b'); b.textContent = 'Raag ' + p.lat;
  line.append(document.createElement('i'), 'It is ' + (d.getHours() % 12 || 12) + ':' + String(d.getMinutes()).padStart(2, '0') + ' ' + (d.getHours() < 12 ? 'AM' : 'PM') + ' · ', b, ' is on air');
  const X = v => (v / 24 * 320).toFixed(1);
  let sv = '<svg viewBox="0 0 320 40" focusable="false">';
  for (let i = 0; i < 8; i++) sv += `<rect x="${i * 40 + 1}" y="5" width="38" height="14" rx="2" fill="${i === idx ? '#e6b85c' : 'rgba(246,220,144,' + (i % 2 ? .12 : .2) + ')'}"/>`;
  for (let t = 0; t <= 24; t += 3) sv += `<path d="M${X(t)} 19v${t % 6 ? 3 : 6}" stroke="#d9b160" stroke-width="1"/>`;
  [[0, '12a'], [6, '6a'], [12, '12p'], [18, '6p'], [24, '12a']].forEach(([t, l]) => { sv += `<text x="${X(t)}" y="37" text-anchor="${t === 0 ? 'start' : t === 24 ? 'end' : 'middle'}" fill="#bba57a" font-size="9.5" font-family="sans-serif">${l}</text>`; });
  sv += `<path d="M${X(h)} 2v21" stroke="#ff6a4a" stroke-width="2"/><path d="M${(+X(h) - 4).toFixed(1)} 0h8l-4 5z" fill="#ff6a4a"/></svg>`;
  $('#airDial').innerHTML = sv;
}

/* ================= Stage 3: harmonium with raga lock. Only the current raga's swaras sound; the rest are locked. ================= */
const harm = $('#harm'), harmBtn = $('#harmOpen'), hkeysEl = $('#hkeys'), harmCap = $('#harmCap'), harmLab = $('#harmLab');
const HK = {}, HKS = [];
const NAMES = { S: 'Sa', r: 'Re komal', R: 'Re', g: 'Ga komal', G: 'Ga', M: 'Ma', 'M#': 'Ma tivra', P: 'Pa', d: 'Dha komal', D: 'Dha', n: 'Ni komal', N: 'Ni' };
const ragaNow = () => state.locked >= 0 ? state.locked : idxOf(cur);
const allowed = o => harmFree || o.s === 'S' || P[ragaNow()].swaras.includes(o.s);
function keyOn(o, id) {
  if (!allowed(o)) { o.el.classList.remove('shake'); void o.el.offsetWidth; o.el.classList.add('shake'); SOUND.tick(.8); return; }
  if (o.ids.has(id)) return;
  o.ids.add(id); o.el.classList.add('down'); SOUND.harmOn(o.k + ':' + id, o.ratio * Math.pow(2, harmOct));
}
function keyOff(o, id) {
  if (!o.ids.delete(id)) return;
  if (!o.ids.size) o.el.classList.remove('down');
  SOUND.harmOff(o.k + ':' + id);
}
function harmRefresh() {
  const p = P[ragaNow()];
  HKS.forEach(o => { const ok = allowed(o); o.el.classList.toggle('lock', !ok); o.el.classList.toggle('vadi', ok && o.s === p.vadiKey && !o.up); o.el.setAttribute('aria-disabled', ok ? 'false' : 'true'); });
  harmCap.textContent = '';
  const b = document.createElement('b'); b.textContent = harmFree ? 'Free play' : 'Raga lock · Raag ' + p.lat;
  harmCap.append(b, harmFree ? ' · every key sounds. Choose Raga lock to play only Raag ' + p.lat + '’s own notes.' : ' · ' + p.swaras.map(t => t.replace('#', '♯')).join(' ') + ' · the other keys are locked.');
  if (quietPref) harmCap.append(' Quiet mode is on, so it is silent.');
}
function setHarm(o) {
  if (o === harmOpen) return;
  harmOpen = o; harm.classList.toggle('open', o); harmBtn.setAttribute('aria-expanded', o ? 'true' : 'false');
  if (o) harmRefresh();
  else { SOUND.harmStop(); HKS.forEach(k => { k.ids.clear(); k.el.classList.remove('down'); }); }
  syncInert();
}
(function buildHarm() {
  const add = (k, s, lab, up, black, after) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'hk ' + (black ? 'b' : 'w'); b.tabIndex = -1;
    b.setAttribute('aria-label', NAMES[s] + (up ? ', upper octave' : ''));
    if (black) b.style.left = ((after + 1) / 8 * 100) + '%';
    const l = document.createElement('span'); l.textContent = lab; const h = document.createElement('small'); h.textContent = k.toUpperCase(); b.append(l, h);
    const o = { k, s, up, el: b, ids: new Set(), ratio: RATIO[s] * (up ? 2 : 1) }; HK[k] = o; HKS.push(o); hkeysEl.appendChild(b);
    b.addEventListener('pointerdown', e => { if (e.button > 0) return; e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch (_) {} keyOn(o, 'p' + e.pointerId); });
    const up_ = e => keyOff(o, 'p' + e.pointerId);
    b.addEventListener('pointerup', up_); b.addEventListener('pointercancel', up_);
  };
  [['a', 'S', 'S'], ['s', 'R', 'R'], ['d', 'G', 'G'], ['f', 'M', 'M'], ['g', 'P', 'P'], ['h', 'D', 'D'], ['j', 'N', 'N'], ['k', 'S', 'Ṡ', 1]].forEach(a => add(a[0], a[1], a[2], a[3], false));
  [['w', 'r', 'r', 0], ['e', 'g', 'g', 1], ['t', 'M#', 'M♯', 3], ['y', 'd', 'd', 4], ['u', 'n', 'n', 5]].forEach(a => add(a[0], a[1], a[2], false, true, a[3]));
})();
harmBtn.addEventListener('click', () => { setHarm(true); setTimeout(() => $('#harmX').focus({ preventScroll: true }), 50); });
$('#harmX').addEventListener('click', () => { setHarm(false); harmBtn.focus({ preventScroll: true }); });
addEventListener('keydown', e => {
  if (!harmOpen || !powered || leaving || view !== 'explore' || guide.classList.contains('open') || farmOpen) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === 'Escape') { setHarm(false); harmBtn.focus({ preventScroll: true }); return; }
  const t = e.target; if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
  const o = HK[e.key.length === 1 ? e.key.toLowerCase() : '']; if (!o) return;
  e.preventDefault(); if (!e.repeat) keyOn(o, 'kb');
});
addEventListener('keyup', e => { const o = HK[e.key.length === 1 ? e.key.toLowerCase() : '']; if (o) keyOff(o, 'kb'); });
addEventListener('blur', () => HKS.forEach(o => o.ids.forEach(id => keyOff(o, id))));

/* ================= Listen chooser (flute / sargam / a film song / mute), the always-there mute button, the page below the radio ================= */
const SG = { S: 'Sa', r: 'Re komal', R: 'Re', g: 'Ga komal', G: 'Ga', M: 'Ma', 'M#': 'Ma tivra', P: 'Pa', d: 'Dha komal', D: 'Dha', n: 'Ni komal', N: 'Ni' };
SOUND.onNote(tok => {
  if (tok == null) { sgChip.classList.remove('on'); return; }
  const up = tok.endsWith("'"), t = tok.replace(/^,|'$/g, '');
  sgChip.textContent = 'Sargam · ' + (SG[t] || t) + (up ? ' (upper)' : ''); sgChip.classList.add('on');
});
function updateListenUI() {
  const p = P[state.locked >= 0 ? state.locked : idxOf(cur)], s = CONFIG.songs[p.id];
  lsSub.textContent = 'Raag ' + p.lat + ' · ' + p.window;
  $$('.ls-o', listenEl).forEach(b => b.setAttribute('aria-checked', String(quietPref ? b.dataset.mode === 'mute' : b.dataset.mode === listenMode)));
  lsSong.textContent = '';
  const song = !quietPref && listenMode === 'song';
  lsSong.hidden = !song;
  if (!song) return;
  if (s && s.title) {
    const sg = Array.isArray(s.singers) ? s.singers : [];
    const b = document.createElement('b'); b.textContent = s.title;
    lsSong.append(b, ' (' + [s.film, s.year].filter(Boolean).join(', ') + ')' + (sg.length ? ', sung by ' + sg.join(' & ') : '') + (s.composer ? ', music by ' + s.composer : '') + '.');
    if (s.raga) lsSong.append(document.createElement('br'), 'Raga: ' + s.raga + (s.ragaVerified ? '.' : ' (to be confirmed).'));
    if (s.url) { const a = document.createElement('a'); a.className = 'ls-go'; a.href = s.url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Play it on YouTube ↗'; lsSong.append(document.createElement('br'), a); }
  } else {
    lsSong.append('Farmaish pending: a film song in Raag ' + p.lat + ' will be added here once its raga is confirmed.');
  }
}
function openListen(o) {
  if (o === listenOpen) return;
  listenOpen = o; listenEl.classList.toggle('open', o); listenBtn.setAttribute('aria-expanded', String(o));
  if (o) { setHarm(false); updateListenUI(); }
  syncInert();
}
function chooseListen(m) {
  if (m === 'mute') { setQuietMode(true); return; }
  listenMode = m; try { localStorage.setItem('raagradio.listen', m); } catch (e) {}
  SOUND.setListen(m);                                              // stored first, so unmuting below starts the right thing
  if (quietPref) setQuietMode(false);
  else { updateListenUI(); if (powered && !leaving && view === 'explore' && !signing && state.locked >= 0) SOUND.phrase(state.locked); }
  if (m === 'song' && !quietPref) toast('Song mode: the radio keeps its drone. Open the song from this panel.');
}
$$('.ls-o', listenEl).forEach(b => b.addEventListener('click', () => chooseListen(b.dataset.mode)));
listenBtn.addEventListener('click', () => { openListen(!listenOpen); if (listenOpen) setTimeout(() => { const c = $('.ls-o[aria-checked="true"]', listenEl); if (c) c.focus({ preventScroll: true }); }, 60); });
$('#lsX').addEventListener('click', () => { openListen(false); listenBtn.focus({ preventScroll: true }); });
addEventListener('keydown', e => { if (e.key === 'Escape' && listenOpen) { openListen(false); listenBtn.focus({ preventScroll: true }); } });
fabMute.addEventListener('click', () => setQuietMode(!quietPref));

/* free-play harmonium + octave */
const harmFreeBtn = $('#harmFree'), octLab = $('#octLab');
harmFreeBtn.setAttribute('aria-pressed', String(harmFree));
harmFreeBtn.addEventListener('click', () => {
  harmFree = !harmFree; try { localStorage.setItem('raagradio.free', harmFree ? '1' : '0'); } catch (e) {}
  harmFreeBtn.setAttribute('aria-pressed', String(harmFree)); harmRefresh();
});
function setOct(d) { harmOct = clamp(harmOct + d, -1, 1); octLab.textContent = 'Octave ' + (harmOct > 0 ? '+' : '') + harmOct; }
$('#octUp').addEventListener('click', () => setOct(1));
$('#octDn').addEventListener('click', () => setOct(-1));
harmBtn.addEventListener('click', () => { if (listenOpen) openListen(false); });

/* the page below the radio */
$$('[data-enter]').forEach(b => b.addEventListener('click', () => { scrollTo({ top: 0, behavior: 'auto' }); if (!powered) powerOn('edit', true); else go('edit', { key: true }); }));
$$('[data-guide]').forEach(b => b.addEventListener('click', () => openGuide(true)));
$$('[data-open]').forEach(b => b.addEventListener('click', () => {
  const w = b.dataset.open, run = () => { if (w === 'listen') openListen(true); else setHarm(true); };
  scrollTo({ top: 0, behavior: 'auto' });
  if (!powered) { powerOn('explore', true); setTimeout(run, 600); }
  else if (view !== 'explore') { go('explore', { key: true }); setTimeout(run, 450); }
  else run();
}));
const scrollBelow = () => belowEl.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
$('#moreBtn').addEventListener('click', scrollBelow);
$('#cueMore').addEventListener('click', scrollBelow);
let pastQ = 0;
addEventListener('scroll', () => { if (pastQ) return; pastQ = requestAnimationFrame(() => { pastQ = 0; document.body.classList.toggle('past', scrollY > innerHeight * .45); }); }, { passive: true });


/* ================= Stage 4: back panel ================= */
const rback = $('#rback'), flipBtn = $('#flipBtn'), flipLab = $('#flipLab'), bsTitle = $('#bsTitle'), bsText = $('#bsText'), bsAct = $('#bsAct');
const VALVES = [
  { n: ['DaVinci', 'Resolve'], t: 'Where I am learning colour grading, and cutting too. Resolve is built around colour, so it teaches how contrast and a look create a mood. I am a beginner here.', a: ['Tune to Rang Tarang', () => { setFlip(false); touched(); tuneTo(3, 'key'); }] },
  { n: ['Premiere', 'Pro'], t: 'My timeline for storytelling: assembling scenes, pacing and rhythm. I am learning it, not claiming mastery.', a: ['Tune to Matinee Show', () => { setFlip(false); touched(); tuneTo(5, 'key'); }] },
  { n: ['After', 'Effects'], t: 'On my learning list for animated titles and small motion touches. I am starting with the basics, so there is nothing to show yet.', a: ['Tune to Chalti Tasveer', () => { setFlip(false); touched(); tuneTo(4, 'key'); }] },
  { n: ['Photoshop'], t: 'For thumbnails, posters and cover images that match the mood of an edit. Learning, one design at a time.', a: ['Tune to Pehli Nazar', () => { setFlip(false); touched(); tuneTo(7, 'key'); }] },
  { n: ['Canva'], t: 'For quick graphics and social posts, where speed matters more than polish. Also one of the apps I am learning.', a: ['Open the Edit bay', () => go('edit', { key: true })] },
  { n: ['Flute &', 'rhythm'], t: 'I play the flute as a hobby and love Indian classical music, so I listen for rhythm before pictures. I want my cuts to land with the music. Yaman, the dusk station, is where that lives.', a: ['Tune to Yaman', () => { setFlip(false); touched(); tuneTo(6, 'key'); }] }
];
const NS = 'http://www.w3.org/2000/svg';
const vIcon = (name, x, y) => { const b = toolIconBody(name); return b ? `<svg class="vico" x="${x - 12}" y="${y}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff1c8" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" pointer-events="none" aria-hidden="true">${b}</svg>` : ''; };
function buildBack() {
  const X = [52, 116, 180];
  let g = '<svg viewBox="0 0 360 292" focusable="false"><defs><radialGradient id="fg"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#ffb347"/><stop offset="1" stop-color="rgba(255,140,40,0)"/></radialGradient></defs>';
  [[14, 14], [346, 14], [14, 278], [346, 278]].forEach(([x, y]) => { g += `<circle cx="${x}" cy="${y}" r="5" fill="#8a6a3a"/><path d="M${x - 3} ${y - 3}l6 6" stroke="#2a160a" stroke-width="1.4"/>`; });
  g += '<text class="hdr" x="180" y="20" aria-hidden="true">WHAT POWERS THIS SET</text>';
  g += '<path class="bus" d="M52 112H238M216 112V236H200"/><path class="bus hot" d="M52 112H238M216 112V236H200"/>';
  VALVES.forEach((v, i) => {
    const top = i < 3, x = X[i % 3];
    const y0 = top ? 49 : 128, base = top ? 96 : 118;
    const tube = top ? `M${x - 17} 96V66a17 17 0 0 1 34 0V96Z` : `M${x - 17} 128V158a17 17 0 0 0 34 0V128Z`;
    const fy = top ? 76 : 150;
    const ly = top ? 33 : 192, lines = v.n.map((t, k) => `<tspan x="${x}" dy="${k ? 11 : 0}">${t.replace('&', '&amp;')}</tspan>`).join('');
    g += `<g class="vl" data-v="${i}" tabindex="0" role="button" aria-label="${v.n.join(' ').replace('&', 'and')}: read more"><rect class="hit" x="${x - 31}" y="${top ? 20 : 114}" width="62" height="${top ? 88 : 96}" rx="6"/>`
      + `<path class="tube" d="${tube}"/><ellipse class="fil" cx="${x}" cy="${fy}" rx="9" ry="12"/>${vIcon(v.n.join(' '), x, fy - 12)}`
      + `<rect x="${x - 19}" y="${top ? 96 : 118}" width="38" height="10" rx="2" fill="#b88636"/><path d="M${x - 9} ${top ? 106 : 118}v${top ? 5 : -5}M${x} ${top ? 106 : 118}v${top ? 5 : -5}M${x + 9} ${top ? 106 : 118}v${top ? 5 : -5}" stroke="#d9b160" stroke-width="1.6"/>`
      + `<text class="lbl" x="${x}" y="${ly}">${lines}</text></g>`;
  });
  g += '<rect x="52" y="214" width="148" height="44" rx="5" fill="#2b1a0e" stroke="#d9b160" stroke-width="1.4"/><text x="126" y="238" text-anchor="middle" style="font-size:17px;font-weight:700;letter-spacing:.2em" fill="#f6dc90">OM</text><text x="126" y="251" text-anchor="middle" style="font-size:8px;letter-spacing:.1em">EDITOR IN THE MAKING</text>';
  // Raga Clock: eight slices, one per station, needle at the visitor's local time
  const cx = 290, cy = 112, ro = 50, ri = 22, pt = (r, d) => [(cx + r * Math.sin(d * Math.PI / 180)).toFixed(1), (cy - r * Math.cos(d * Math.PI / 180)).toFixed(1)];
  for (let i = 0; i < 8; i++) {
    const a = pt(ro, i * 45), b = pt(ro, (i + 1) * 45), c = pt(ri, (i + 1) * 45), d = pt(ri, i * 45);
    g += `<g class="sec" data-i="${i}" tabindex="0" role="button" aria-label="Tune to ${P[i].lat}, ${P[i].window}"><path d="M${a} A${ro} ${ro} 0 0 1 ${b} L${c} A${ri} ${ri} 0 0 0 ${d}Z" fill="${i === state.liveIdx ? '#e6b85c' : 'rgba(246,220,144,' + (i % 2 ? .16 : .26) + ')'}"/></g>`;
  }
  g += `<circle cx="${cx}" cy="${cy}" r="${ro + 3}" fill="none" stroke="#b88636" stroke-width="1.4" pointer-events="none"/><g id="clk" pointer-events="none"><path d="M${cx} ${cy}V${cy - ro - 4}" stroke="#ff6a4a" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="4" fill="#ff6a4a"/></g>`;
  g += `<text class="hdr" x="${cx}" y="${cy - ro - 9}" style="letter-spacing:.1em">12A</text><text class="hdr" x="${cx + ro + 5}" y="${cy + 3}" style="text-anchor:start;letter-spacing:.06em;font-size:7.5px">6A</text><text class="hdr" x="${cx}" y="${cy + ro + 15}" style="letter-spacing:.1em">12P</text>`;
  g += `<text class="lbl" x="${cx}" y="196" style="fill:#f6dc90;letter-spacing:.12em">RAGA CLOCK</text><text id="rcCap" x="${cx}" y="209" style="font-size:9px;text-anchor:middle">now on air</text>`;
  g += '</svg>';
  rback.innerHTML = g;
  $$('.vl', rback).forEach(el => {
    const pick = () => selectValve(+el.dataset.v);
    el.addEventListener('click', pick);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });
  $$('.sec', rback).forEach(el => {
    const i = +el.dataset.i, cap = $('#rcCap');
    const tell = () => { cap.textContent = P[i].zone + (i === state.liveIdx ? ' · on air' : '') + ' · tap to tune'; };
    const rest = () => { cap.textContent = P[state.liveIdx].zone + ' is on air'; };
    el.addEventListener('mouseenter', tell); el.addEventListener('focus', tell); el.addEventListener('mouseleave', rest); el.addEventListener('blur', rest);
    const go_ = () => { setFlip(false); touched(); tuneTo(i, 'key'); };
    el.addEventListener('click', go_);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go_(); } });
  });
  updateClock();
}
function updateClock() {
  const clk = $('#clk'); if (!clk) return;
  clk.setAttribute('transform', `rotate(${(localHour() / 24 * 360).toFixed(1)} 290 112)`);
  const cap = $('#rcCap'); if (cap && !cap.dataset.t) cap.textContent = P[state.liveIdx].zone + ' is on air';
}
function selectValve(i) {
  const v = VALVES[i];
  $$('.vl', rback).forEach(el => el.classList.toggle('sel', +el.dataset.v === i));
  rback.classList.add('on');
  bsTitle.textContent = v.n.join(' ').replace('&', 'and'); bsText.textContent = v.t; bsAct.textContent = '';
  if (v.a) { const b = document.createElement('button'); b.type = 'button'; b.textContent = v.a[0]; b.addEventListener('click', v.a[1]); bsAct.appendChild(b); }
  SOUND.tick(1.4);
}
function setFlip(o, quick) {
  if (o === flipped) return;
  flipped = o; room.classList.toggle('flip', o); flipBtn.setAttribute('aria-pressed', o ? 'true' : 'false'); flipLab.textContent = o ? 'Front of the set' : 'Back panel'; flipLab.dataset.s = o ? 'Front' : 'Back';
  ['.r-top', '.bezel', '.r-low'].forEach(q => { const e = $(q, $('.radio')); if (e) e.inert = o; });
  rback.inert = !o; rback.setAttribute('aria-hidden', o ? 'false' : 'true');
  if (o && !rback.firstChild) buildBack();
  if (!quick) { SOUND.clunk(); }
}
flipBtn.addEventListener('click', () => setFlip(!flipped));
rback.inert = true;

/* ================= Stage 5: farmaish postcard, toast and the two easter eggs ================= */
const farm = $('#farm'), pc = $('#pc'), pcStatus = $('#pcStatus'), pcStamp = $('#pcStamp'), toastEl = $('#toast');
let farmFrom = null, toastT = 0;
function toast(t) { toastEl.textContent = t; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 2600); }
function farmStation() { return view === 'explore' ? P[ragaNow()] : null; }
function openFarm() {
  if (!powered || leaving || farmOpen) return;
  farmFrom = document.activeElement; farmOpen = true; farm.classList.add('open'); pc.classList.remove('sent'); pcStamp.classList.remove('show'); pcStatus.textContent = '';
  const st = farmStation(); $('#pcFor').textContent = st ? 'For: Raag ' + st.lat + ' · ' + st.window : '';
  $('#pmark').textContent = 'Pune · ' + new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  syncInert(); setTimeout(() => $('#pcMsg').focus({ preventScroll: true }), 120);
}
function closeFarm() {
  if (!farmOpen) return; farmOpen = false; farm.classList.remove('open'); syncInert();
  setTimeout(() => { if (farmFrom && farmFrom.focus && !farmFrom.inert) farmFrom.focus({ preventScroll: true }); }, 60);
}
$$('[data-farm]').forEach(b => b.addEventListener('click', openFarm));
$('#pcX').addEventListener('click', closeFarm);
farm.addEventListener('pointerdown', e => { if (e.target === farm) closeFarm(); });
(function farmForm() {
  const read = () => { const f = new FormData(pc), g = k => String(f.get(k) || '').trim(); return { name: g('name'), email: g('email'), msg: g('msg') }; };
  const body = b => { const st = farmStation(); return 'Hi Om,\n\nA farmaish for the radio:\n\n' + b.msg + '\n\n' + (st ? 'Tuned to: Raag ' + st.lat + ' (' + st.window + ')\n' : '') + 'From: ' + (b.name || '(name)') + (b.email ? ' <' + b.email + '>' : ''); };
  pc.addEventListener('submit', e => {
    e.preventDefault(); const b = read();
    if (!b.msg) { pcStatus.textContent = 'Write a line first, even a single word.'; $('#pcMsg').focus(); return; }
    if (CONFIG.formspree) {
      fetch(CONFIG.formspree, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ name: b.name, email: b.email, message: b.msg, kind: 'farmaish' }) })
        .then(r => { if (!r.ok) throw 0; pcStamp.textContent = 'Posted'; pcStamp.classList.add('show'); pcStatus.textContent = 'Posted. Thank you.'; setTimeout(() => { pc.classList.add('sent'); setTimeout(() => { closeFarm(); pc.reset(); }, 950); }, 900); })
        .catch(() => { pcStatus.textContent = 'That did not send. Use Copy instead, or write to ' + CONFIG.email + '.'; });
      return;
    }
    const st = farmStation();
    location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('Farmaish' + (st ? ' for Raag ' + st.lat : '')) + '&body=' + encodeURIComponent(body(b));
    pcStamp.textContent = 'Addressed'; pcStamp.classList.add('show');
    pcStatus.textContent = 'Your mail app should open with the farmaish ready. If nothing happens, press Copy instead.';
  });
  $('#pcCopy').addEventListener('click', () => {
    const b = read(), txt = 'To: ' + CONFIG.email + '\n\n' + body(b);
    const fb = () => { const t = document.createElement('textarea'); t.value = txt; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (_) {} t.remove(); };
    try { navigator.clipboard.writeText(txt).catch(fb); } catch (_) { fb(); }
    pcStatus.textContent = 'Copied. Paste it into an email to ' + CONFIG.email + '.';
  });
})();

// easter egg one: tap the green magic eye three times
(function eyeEgg() {
  const eye = $('.eye'); let n = 0, t = 0;
  eye.addEventListener('click', () => {
    if (!powered) return; clearTimeout(t); n++; t = setTimeout(() => { n = 0; }, 1500);
    if (n >= 3) { n = 0; eye.classList.add('wink'); SOUND.om(); toast('ॐ  Sa · Pa · Sa'); setTimeout(() => eye.classList.remove('wink'), 1900); }
  });
})();

function buildRooms() {
  const mk = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };

  // Edit bay: film strip frames
  const strip = $('#strip'), note = $('#stripNote'), E = CONFIG.edits || [];
  if (!E.length) {
    for (let i = 1; i <= 3; i++) {
      const f = mk('div', 'cel empty'); f.setAttribute('role', 'img'); f.setAttribute('aria-label', 'Empty frame ' + i + ', first cut soon');
      f.append(mk('em', '', '0' + i), mk('i', 'lamp2'), mk('span', '', 'First cut soon')); strip.appendChild(f);
    }
  } else {
    note.textContent = 'Pick a frame to watch it.';
    E.forEach(ed => {
      const a = mk(ed.url ? 'a' : 'div', ed.url ? 'cel lnk' : 'cel');
      if (ed.url) { a.href = ed.url; a.target = '_blank'; a.rel = 'noopener'; a.addEventListener('click', () => SOUND.clap()); }
      if (ed.thumb) a.style.setProperty('--bg', 'url("' + String(ed.thumb).replace(/"/g, '') + '")');
      a.append(mk('strong', '', ed.title || 'Untitled'), mk('span', '', ed.line || ''));
      if (ed.tool) a.append(mk('small', '', ed.tool));
      strip.appendChild(a);
    });
  }

  // the 3D film reel: two aluminium flanges and a wound roll between them, all real layers in depth
  const c = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
  let d = c(100, 100, 94) + c(100, 100, 13);
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + Math.PI / 6; d += c(+(100 + Math.cos(a) * 54).toFixed(1), +(100 + Math.sin(a) * 54).toFixed(1), 20); }
  const flange = id => `<svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1ead7"/><stop offset=".5" stop-color="#b9b19c"/><stop offset="1" stop-color="#7d765f"/></linearGradient></defs><path d="${d}" fill="url(#${id})" fill-rule="evenodd" stroke="#5a5444" stroke-width="2"/></svg>`;
  let layers = `<div style="transform:translateZ(-18px)">${flange('rgA')}</div>`;
  [-12, -6, 0, 6, 12].forEach(z => { layers += `<i class="rw" style="transform:translateZ(${z}px)"></i>`; });
  layers += `<div style="transform:translateZ(18px)">${flange('rgB')}</div>`;
  $('#reelSpin').innerHTML = layers;

  // colour grade wipe
  const gd = $('#gd'), gr = $('#gdRange');
  gr.addEventListener('input', () => gd.style.setProperty('--w', gr.value + '%'));

  // send a brief: opens an email, or posts to Formspree when you add one in the config
  const bf = $('#briefForm'), st = $('#bfStatus'), stamp = $('#bfStamp');
  const read = () => { const f = new FormData(bf), g = k => String(f.get(k) || '').trim(); return { name: g('name'), email: g('email'), kind: g('kind'), msg: g('msg') }; };
  const body = b => `Hi Om,\n\nI would like to send you a brief.\n\nType: ${b.kind}\nDetails: ${b.msg}\n\nFrom: ${b.name || '(name)'}${b.email ? ' <' + b.email + '>' : ''}`;
  const done = txt => { st.textContent = txt; stamp.classList.add('show'); setTimeout(() => stamp.classList.remove('show'), 4000); };
  bf.addEventListener('submit', e => {
    e.preventDefault(); const b = read();
    if (!b.msg) { st.textContent = 'Write a line about the video first.'; bf.elements.msg.focus(); return; }
    if (CONFIG.formspree) {
      fetch(CONFIG.formspree, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ name: b.name, email: b.email, kind: b.kind, message: b.msg }) })
        .then(r => { if (!r.ok) throw 0; done('Sent. I will reply to your email.'); bf.reset(); })
        .catch(() => { st.textContent = 'That did not send. Use Copy instead, or write to ' + CONFIG.email + '.'; });
      return;
    }
    location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('Edit brief: ' + b.kind) + '&body=' + encodeURIComponent(body(b));
    done('Your mail app should open with the brief ready. If nothing happens, press Copy instead.');
  });
  $('#bfCopy').addEventListener('click', () => {
    const b = read(), txt = 'To: ' + CONFIG.email + '\n\n' + body(b);
    const fallback = () => { const t = document.createElement('textarea'); t.value = txt; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (_) {} t.remove(); };
    try { navigator.clipboard.writeText(txt).catch(fallback); } catch (_) { fallback(); }
    st.textContent = 'Copied. Paste it into an email to ' + CONFIG.email + '.';
  });
}


/* ================= clock, deep links, boot ================= */
function localHour() { const d = new Date(); return d.getHours() + d.getMinutes() / 60; }
let forced = false, startIdx;
(function boot() {
  const qs = params.get('station'), qt = parseFloat(params.get('t'));
  const byId = qs ? P.findIndex(p => p.id === qs.toLowerCase()) : -1;
  if (byId >= 0) { startIdx = byId; forced = true; }
  else if (!isNaN(qt)) { forced = true; startIdx = clamp(Math.floor((((qt % 24) + 24) % 24) / 3), 0, 7); }
  else startIdx = clamp(Math.floor(localHour() / 3), 0, 7);
  state.liveIdx = clamp(Math.floor(localHour() / 3), 0, 7);
  P[state.liveIdx].el.classList.add('live');
  { const f = ALIAS[(params.get('for') || '').toLowerCase()];
    if (f && f !== 'explore') { forView = f; const k = $('[data-pick="' + f + '"]'); if (k) k.classList.add('suggest'); } }
  skyLocal = localHour(); cur = clamp(skyLocal, 0, 24); target = cur; buildRooms(); buildDoor(); buildMini();
  layout();
  if (params.get('mode') === 'guide') openGuide(false);
  refreshQuietUI(); syncInert();                                 // the radio waits, switched off, until the visitor turns the knob
  P.forEach(p => {                                                // the guide also lists each programme's song (real HTML text)
    const sg = CONFIG.songs[p.id]; if (!sg || !sg.title) return;
    const el = document.createElement('p'); el.className = 'p-np'; const b = document.createElement('b'); b.textContent = 'Now playing';
    el.append(b, [sg.title, sg.film && '(' + [sg.film, sg.year].filter(Boolean).join(', ') + ')', sg.raga && '· Raag ' + sg.raga].filter(Boolean).join(' '));
    p.el.appendChild(el);
  });
})();

// if the page stays open and the clock enters a new prahar, retune slowly (unless the visitor has touched the dial)
setInterval(() => {
  if (document.hidden) return;
  skyLocal = localHour(); buildMini(); updateClock(); if (!powered) buildDoor();
  const i = clamp(Math.floor(localHour() / 3), 0, 7);
  if (i === state.liveIdx) return;
  P[state.liveIdx].el.classList.remove('live'); state.liveIdx = i; P[i].el.classList.add('live');
  if (powered && !leaving && view === 'explore' && !state.touched && !forced) tuneTo(i, 'auto');
}, 15000);
}
