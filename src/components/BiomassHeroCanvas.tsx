import React, { useRef, useEffect } from 'react';

export function BiomassHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Particles representing protein molecules, leaves, and bioreactor bubbles
    interface Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      speedY: number;
      speedX: number;
      opacity: number;
      wiggle: number;
      wiggleSpeed: number;
      type: 'chloroplast' | 'nutrient' | 'bubble';
    }

    const particles: Particle[] = [];
    const particleCount = 45;

    const createParticle = (initY = false): Particle => {
      const types: Particle['type'][] = ['chloroplast', 'nutrient', 'bubble'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      let radius = 2;
      let color = 'rgba(16, 185, 129, 0.2)'; // Emerald default
      
      if (type === 'chloroplast') {
        radius = Math.random() * 4 + 4;
        color = `rgba(${Math.random() * 20 + 16}, ${Math.random() * 50 + 160}, ${Math.random() * 20 + 90}, ${Math.random() * 0.25 + 0.1})`;
      } else if (type === 'nutrient') {
        radius = Math.random() * 2 + 1.5;
        color = 'rgba(52, 211, 153, 0.4)';
      } else {
        radius = Math.random() * 3 + 2;
        color = 'rgba(255, 255, 255, 0.12)';
      }

      return {
        x: Math.random() * width,
        y: initY ? Math.random() * height : height + 20,
        radius,
        color,
        speedY: -(Math.random() * 0.6 + 0.3),
        speedX: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        wiggle: Math.random() * Math.PI * 2,
        wiggleSpeed: Math.random() * 0.02 + 0.005,
        type,
      };
    };

    // Initialize particles across screen
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    // Handles fluid waves
    let waveOffset = 0;

    const resizeHandler = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', resizeHandler);

    // Mouse interactive coordinates
    let mouseX = -1000;
    let mouseY = -1000;

    const mouseMoveHandler = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const mouseLeaveHandler = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.parentElement?.addEventListener('mousemove', mouseMoveHandler);
    canvas.parentElement?.addEventListener('mouseleave', mouseLeaveHandler);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Render glowing ambient gradients in background
      const ambientGrad = ctx.createRadialGradient(
        width * 0.3, height * 0.4, 10,
        width * 0.3, height * 0.4, Math.max(width, height) * 0.6
      );
      ambientGrad.addColorStop(0, 'rgba(16, 185, 129, 0.05)'); // Soft emerald glow
      ambientGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, width, height);

      const ambientGrad2 = ctx.createRadialGradient(
        width * 0.8, height * 0.7, 50,
        width * 0.8, height * 0.7, Math.max(width, height) * 0.5
      );
      ambientGrad2.addColorStop(0, 'rgba(34, 197, 94, 0.04)'); // Soft green
      ambientGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGrad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Render Laboratory Digital Grid (Futuristic blueprint feel)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Render organic flowing green liquid streams at the bottom
      waveOffset += 0.006;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.03)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 10) {
        const wave1 = Math.sin(x * 0.003 + waveOffset) * 20;
        const wave2 = Math.cos(x * 0.005 - waveOffset * 1.5) * 12;
        ctx.lineTo(x, height - 120 + wave1 + wave2);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(52, 211, 153, 0.02)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 10) {
        const wave1 = Math.cos(x * 0.004 + waveOffset * 0.8) * 18;
        const wave2 = Math.sin(x * 0.006 - waveOffset * 1.2) * 10;
        ctx.lineTo(x, height - 90 + wave1 + wave2);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // 4. Update and render floating biomass particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.wiggle += p.wiggleSpeed;
        p.x += p.speedX + Math.sin(p.wiggle) * 0.25;

        // Interactive mouse distortion: particles fly away gently from mouse
        if (mouseX !== -1000) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 2;
            p.y += Math.sin(angle) * force * 1.5;
          }
        }

        // Wrap around screen or respawn at bottom
        if (p.y < -20 || p.x < -20 || p.x > width + 20) {
          particles[i] = createParticle(false);
          continue;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.type === 'chloroplast') {
          // Render as glowing blur circle OR rotating simple biology ellipse
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.shadowBlur = 15;
          ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
          ctx.fill();
        } else if (p.type === 'bubble') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeHandler);
      canvas.parentElement?.removeEventListener('mousemove', mouseMoveHandler);
      canvas.parentElement?.removeEventListener('mouseleave', mouseLeaveHandler);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
