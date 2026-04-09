import { useRef, useEffect } from "react";
import styles from "./Visualizer.module.css";

// REVIEW: `cardPositions` prop is declared but never used anywhere in this component. Remove it.
function Visualizer({ analyser, color, cardPositions }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // REVIEW: These `bufferLength` and `dataArray` declarations are immediately shadowed by new declarations inside draw() (lines below). This is dead code — remove them.
    const bufferLength = 128;
    const dataArray = new Uint8Array(bufferLength);

    const particles = [];
    let animationId;

    const draw = () => {
      animationId = requestAnimationFrame(draw);

      if (!analyser.current) return;
      const bufferLength = analyser.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.current.getByteFrequencyData(dataArray);

      // average volume
      const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      const intensity = avg / 255;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // spawn particles based on volume
      if (intensity > 0.01 && Math.random() < intensity * 3) {
        const angle = Math.random() * Math.PI * 2;
        const spawnRadius = 80; // edge of center circle
        const speed = 1 + intensity * 6;
        particles.push({
          x: cx + Math.cos(angle) * spawnRadius, // ← spawn on circle edge
          y: cy + Math.sin(angle) * spawnRadius,
          vx: Math.cos(angle) * speed, // fly outward
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 2 + intensity * 8,
        });
      }

      // second ring — larger particles further out
      if (intensity > 0.05 && Math.random() < intensity * 2) {
        const angle = Math.random() * Math.PI * 2;
        const spawnRadius = 120; // ← further out
        const speed = 0.5 + intensity * 3;
        particles.push({
          x: cx + Math.cos(angle) * spawnRadius,
          y: cy + Math.sin(angle) * spawnRadius,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0.8,
          size: 4 + intensity * 12, // ← larger
        });
      }

      // update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.size *= 0.97;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // REVIEW: Setting shadowBlur and shadowColor on every particle in the loop is expensive for canvas rendering. Move these outside the loop since the values don't change per-particle.
        ctx.shadowBlur = 10;
        ctx.shadowColor = color || "#ffffff";
        ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.8})`;
        ctx.fill();
      }
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [analyser, color]);

  return (
    // REVIEW: Canvas size is hardcoded at 600x600 but the Wheel shrinks to 360x360 on mobile (max-width: 600px). Particles will render outside the visible wheel area on small screens. Consider making the canvas size responsive.
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      width={600}
      height={600}
    />
  );
}

export default Visualizer;
