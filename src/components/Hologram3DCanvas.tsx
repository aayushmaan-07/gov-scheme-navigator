'use client';

import React, { useEffect, useRef } from 'react';

export const Hologram3DCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = Math.min(460, window.innerHeight * 0.5);
      }
    };
    window.addEventListener('resize', handleResize);

    // 3D Sphere Points
    const numPoints = 220;
    const radius = Math.min(width, height) * 0.36;
    interface Point3D {
      x: number;
      y: number;
      z: number;
      origX: number;
      origY: number;
      origZ: number;
      size: number;
      color: string;
    }

    const points: Point3D[] = [];
    const colors = ['#10B981', '#34D399', '#06B6D4', '#F59E0B', '#60A5FA'];

    // Generate points on sphere using Fibonacci sphere algorithm
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        origX: x * radius,
        origY: y * radius,
        origZ: z * radius,
        size: Math.random() * 2.2 + 1.2,
        color: colors[i % colors.length],
      });
    }

    let angleX = 0;
    let angleY = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - width / 2;
      const mouseY = e.clientY - rect.top - height / 2;
      targetAngleY = (mouseX / width) * 1.5;
      targetAngleX = -(mouseY / height) * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    const render = () => {
      // Smooth camera interpolation
      angleX += (targetAngleX - angleX) * 0.05 + 0.002;
      angleY += (targetAngleY - angleY) * 0.05 + 0.005;

      ctx.clearRect(0, 0, width, height);

      // Central glowing orb background
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        radius * 1.4
      );
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.08)');
      grad.addColorStop(1, 'rgba(7, 11, 20, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Project points
      const projected = points.map((p) => {
        // Rotate around Y
        let x1 = p.origX * cosY - p.origZ * sinY;
        let z1 = p.origZ * cosY + p.origX * sinY;

        // Rotate around X
        let y2 = p.origY * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.origY * sinX;

        // Perspective projection
        const fov = 400;
        const scale = fov / (fov + z2);
        const projX = x1 * scale + width / 2;
        const projY = y2 * scale + height / 2;
        const alpha = Math.max(0.1, (z2 + radius) / (2 * radius));

        return {
          projX,
          projY,
          scale,
          alpha,
          z: z2,
          color: p.color,
          size: p.size * scale,
        };
      });

      // Sort by depth
      projected.sort((a, b) => a.z - b.z);

      // Draw connecting holographic lines between nearby points
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].projX - projected[j].projX;
          const dy = projected[i].projY - projected[j].projY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 42) {
            const lineAlpha = (1 - dist / 42) * projected[i].alpha * 0.35;
            ctx.strokeStyle = `rgba(52, 211, 153, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].projX, projected[i].projY);
            ctx.lineTo(projected[j].projX, projected[j].projY);
            ctx.stroke();
          }
        }
      }

      // Draw points
      projected.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.globalAlpha = 1.0;

      // Draw subtle orbital rings around sphere
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(angleY * 0.4);
      ctx.scale(1, 0.35);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.25, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([8, 12]);
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center my-2 pointer-events-none">
      <canvas ref={canvasRef} className="max-w-full drop-shadow-[0_0_35px_rgba(16,185,129,0.3)]" />
    </div>
  );
};
