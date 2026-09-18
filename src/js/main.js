// ============================================================
//  200-Frame Scroll-Driven Background Canvas Animator
//  Scroll position maps to frame index (0 → 199)
//  Path: /public/video_ultra_200_frames/frame_001.jpg … frame_200.jpg
// ============================================================

const TOTAL_FRAMES = 200;
const FRAME_PATH = (index) =>
  `/video_ultra_200_frames/frame_${String(index).padStart(3, '0')}.jpg`;

const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d', { alpha: false });

ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const images = new Array(TOTAL_FRAMES).fill(null);

let currentFrame  = 0;   // smoothly interpolated display frame
let targetFrame   = 0;   // frame dictated by scroll position
let rafId         = null;

// ── Canvas Resize ──────────────────────────────────────────

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width  = Math.round(canvas.clientWidth  * dpr);
  canvas.height = Math.round(canvas.clientHeight * dpr);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  render();
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 100));
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', resizeCanvas);
}

// ── Best-available frame (no blank flash while loading) ────

function getBestFrame(index) {
  const safe = Math.min(TOTAL_FRAMES - 1, Math.max(0, index));
  if (images[safe]?.complete && images[safe].naturalWidth > 0) return images[safe];

  // Walk outward from target to find nearest loaded frame
  for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
    const prev = safe - offset;
    if (prev >= 0 && images[prev]?.complete && images[prev].naturalWidth > 0)
      return images[prev];
    const next = safe + offset;
    if (next < TOTAL_FRAMES && images[next]?.complete && images[next].naturalWidth > 0)
      return images[next];
  }
  return null;
}

// ── Render ─────────────────────────────────────────────────

function render() {
  const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrame)));
  const img = getBestFrame(idx);
  if (!img) return;

  const cw = canvas.width;
  const ch = canvas.height;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  // Cover-fill: scale to fill canvas, centered
  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);
}

// ── Smooth lerp loop ───────────────────────────────────────

function animationLoop() {
  const diff = targetFrame - currentFrame;

  if (Math.abs(diff) > 0.05) {
    currentFrame += diff * 0.12;   // ease factor — higher = snappier
    render();
  }

  rafId = requestAnimationFrame(animationLoop);
}

// ── Scroll → Frame ─────────────────────────────────────────

function onScroll() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return;

  const fraction = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  targetFrame = fraction * (TOTAL_FRAMES - 1);
}

window.addEventListener('scroll', onScroll, { passive: true });

// ── Preload frames ─────────────────────────────────────────

function preloadFrames() {
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const idx = i - 1;
    const img = new Image();
    img.src = FRAME_PATH(i);
    img.onload = () => {
      images[idx] = img;
      // Show frame 0 immediately when first image lands
      if (idx === 0 || idx === Math.round(currentFrame)) {
        render();
      }
    };
  }
}

// ── Boot ───────────────────────────────────────────────────
resizeCanvas();
onScroll();
currentFrame = targetFrame;   // jump to correct frame on page load/refresh

requestAnimationFrame(animationLoop);
preloadFrames();
