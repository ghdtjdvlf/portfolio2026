import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../lib/utils';

function resolveColor(color) {
  if (color.startsWith('var(')) {
    const varName = color.slice(4, -1).trim();
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    return resolved || color;
  }
  return color;
}

export function CanvasText({
  text,
  className = '',
  bgColor = '#09090b',
  colors = ['#a78bfa', '#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#818cf8'],
  animationDuration = 5,
  lineWidth = 1.5,
  lineGap = 10,
  curveIntensity = 60,
}) {
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const animationRef = useRef(0);
  const startTimeRef = useRef(0);
  const [resolvedColors, setResolvedColors] = useState([]);

  const updateColors = useCallback(() => {
    setResolvedColors(colors.map(resolveColor));
  }, [colors]);

  useEffect(() => {
    updateColors();
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, [updateColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const textEl = textRef.current;
    if (!canvas || !textEl || resolvedColors.length === 0) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const rect = textEl.getBoundingClientRect();
    const width = Math.ceil(rect.width) || 400;
    const height = Math.ceil(rect.height) || 200;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const numLines = Math.floor(height / lineGap) + 10;
    startTimeRef.current = performance.now();

    const animate = (currentTime) => {
      const elapsed = (currentTime - startTimeRef.current) / 1000;
      const phase = (elapsed / animationDuration) * Math.PI * 2;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < numLines; i++) {
        const y = i * lineGap;
        const curve1 = Math.sin(phase) * curveIntensity;
        const curve2 = Math.sin(phase + 0.5) * curveIntensity * 0.6;

        ctx.strokeStyle = resolvedColors[i % resolvedColors.length];
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(
          width * 0.33, y + curve1,
          width * 0.66, y + curve2,
          width, y,
        );
        ctx.stroke();
      }

      textEl.style.backgroundImage = `url(${canvas.toDataURL()})`;
      textEl.style.backgroundSize = `${width}px ${height}px`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [bgColor, resolvedColors, animationDuration, lineWidth, lineGap, curveIntensity]);

  return (
    <span className="relative inline">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        aria-hidden="true"
      />
      <span
        ref={textRef}
        className={cn('bg-clip-text text-transparent inline', className)}
        style={{ WebkitBackgroundClip: 'text' }}
      >
        {text}
      </span>
    </span>
  );
}
