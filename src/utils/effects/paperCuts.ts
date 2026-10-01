// src/utils/effects/paperCuts.ts

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  tilt: number;
  tiltSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  drag: number;
}

/**
 * Triggers a butter-smooth, physics-based party popper burst.
 * Uses HTML5 Canvas with requestAnimationFrame and Newtonian physics
 * (gravity, drag, rotation, and sinusoidal wobble) for natural movement.
 */
export function triggerPaperCuts() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:9999;width:100%;height:100%;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  // Handle Retina / High-DPI screens
  const dpr = window.devicePixelRatio || 1;
  let width = window.innerWidth;
  let height = window.innerHeight;

  const resizeCanvas = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const colors = [
    '#10b981', // emerald
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#fb923c', // orange
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#f59e0b', // amber
  ];

  const particles: Particle[] = [];
  const gravity = 0.075; // Lowered gravity for a slower drift

  // Generate particles from 7 cannons (3 bottom: left, right, center; 4 top: left, right, center-left, center-right)
  const cannons = [
    // Bottom launchers (shoot up and inward, then arch down)
    {
      x: 0,
      y: height,
      angleMin: -70,
      angleMax: -25,
      speedMin: 9,
      speedMax: 17,
      count: 35,
    },
    {
      x: width,
      y: height,
      angleMin: -155,
      angleMax: -110,
      speedMin: 9,
      speedMax: 17,
      count: 35,
    },
    {
      x: width / 2,
      y: height,
      angleMin: -115,
      angleMax: -65,
      speedMin: 8,
      speedMax: 15,
      count: 25,
    },
    // Top launchers (shoot down and inward, then drift down)
    {
      x: 0,
      y: 0,
      angleMin: 15,
      angleMax: 65,
      speedMin: 4,
      speedMax: 10,
      count: 25,
    },
    {
      x: width,
      y: 0,
      angleMin: 115,
      angleMax: 165,
      speedMin: 4,
      speedMax: 10,
      count: 25,
    },
    // Top Center launchers (shoot down and spread outward)
    {
      x: width / 2 - 80,
      y: 0,
      angleMin: 60,
      angleMax: 120,
      speedMin: 3,
      speedMax: 8,
      count: 20,
    },
    {
      x: width / 2 + 80,
      y: 0,
      angleMin: 60,
      angleMax: 120,
      speedMin: 3,
      speedMax: 8,
      count: 20,
    },
  ];

  cannons.forEach((cannon) => {
    for (let i = 0; i < cannon.count; i++) {
      const angle =
        ((cannon.angleMin +
          Math.random() * (cannon.angleMax - cannon.angleMin)) *
          Math.PI) /
        180;
      const speed =
        cannon.speedMin + Math.random() * (cannon.speedMax - cannon.speedMin);

      particles.push({
        x: cannon.x,
        y: cannon.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        width: 6 + Math.random() * 8, // 6px - 14px
        height: 10 + Math.random() * 10, // 10px - 20px
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() * 0.05 - 0.025) * 1.2, // Slower Z spin
        tilt: Math.random() * Math.PI,
        tiltSpeed: 0.02 + Math.random() * 0.04, // Slower 3D card flipping
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.02, // Slower side-to-side sway
        drag: 0.965 + Math.random() * 0.015, // Dynamic drag coefficient (air resistance)
      });
    }
  });

  let active = true;
  const startTime = parseFloat(performance.now().toFixed(2));

  function update() {
    if (!active) return;

    // Clear canvas
    ctx!.clearRect(0, 0, width, height);

    let allOut = true;
    const elapsed = parseFloat(performance.now().toFixed(2)) - startTime;

    particles.forEach((p) => {
      // Physics calculations
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += gravity; // Gravity pull

      p.x += p.vx;
      p.y += p.vy;

      // Soft wind-sway effect as it descends
      p.wobble += p.wobbleSpeed;
      if (p.vy > 0) {
        p.x += Math.sin(p.wobble) * 0.55;
      }

      // Rotate and flip card simulation
      p.rotation += p.rotationSpeed;
      p.tilt += p.tiltSpeed;

      // Keep animation running as long as particles are visible
      if (p.y < height + 30) {
        allOut = false;
      }

      // Draw particle with 3D projection tilt simulation
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rotation);

      const currentWidth = p.width * Math.cos(p.tilt);
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-currentWidth / 2, -p.height / 2, currentWidth, p.height);
      ctx!.restore();
    });

    // Cleanup after all out or after 12s max timeout
    if (allOut || elapsed > 12000) {
      active = false;
      window.removeEventListener('resize', resizeCanvas);
      canvas.remove();
    } else {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
