"use client";

import { useEffect, useRef, useCallback } from "react";

interface AudioVisualizerProps {
  getFrequencyData: (() => Uint8Array) | null;
  isActive: boolean;
  isSpeaking: boolean;
}

export default function AudioVisualizer({
  getFrequencyData,
  isActive,
  isSpeaking,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.28;

    ctx.clearRect(0, 0, width, height);

    let frequencyData: Uint8Array | null = null;
    if (getFrequencyData && isActive) {
      try {
        frequencyData = getFrequencyData();
      } catch {
        frequencyData = null;
      }
    }

    const avgLevel =
      frequencyData && frequencyData.length > 0
        ? frequencyData.reduce((sum, val) => sum + val, 0) /
          frequencyData.length /
          255
        : 0;

    const time = Date.now() / 1000;

    // Outer glow
    const glowRadius = baseRadius + 30 + avgLevel * 40;
    const glowGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      baseRadius * 0.5,
      centerX,
      centerY,
      glowRadius
    );

    if (isSpeaking) {
      glowGradient.addColorStop(0, `rgba(251, 113, 133, ${0.12 + avgLevel * 0.15})`);
      glowGradient.addColorStop(0.6, `rgba(251, 113, 133, ${0.04 + avgLevel * 0.06})`);
      glowGradient.addColorStop(1, "rgba(251, 113, 133, 0)");
    } else if (isActive) {
      glowGradient.addColorStop(0, `rgba(214, 211, 209, ${0.08 + avgLevel * 0.1})`);
      glowGradient.addColorStop(0.6, `rgba(214, 211, 209, ${0.03 + avgLevel * 0.04})`);
      glowGradient.addColorStop(1, "rgba(214, 211, 209, 0)");
    } else {
      glowGradient.addColorStop(0, "rgba(214, 211, 209, 0.04)");
      glowGradient.addColorStop(1, "rgba(214, 211, 209, 0)");
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Orb with frequency distortion
    const segments = 128;
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      let radius = baseRadius;

      if (frequencyData && frequencyData.length > 0 && isActive) {
        const freqIndex = Math.floor((i / segments) * frequencyData.length);
        const freqValue = frequencyData[freqIndex] / 255;
        radius += freqValue * baseRadius * 0.25;
      }

      // Idle breathing animation
      const breathe = Math.sin(time * 1.5) * 2;
      radius += breathe;

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();

    const orbGradient = ctx.createRadialGradient(
      centerX - baseRadius * 0.3,
      centerY - baseRadius * 0.3,
      0,
      centerX,
      centerY,
      baseRadius * 1.3
    );

    if (isSpeaking) {
      orbGradient.addColorStop(0, "rgba(251, 113, 133, 0.15)");
      orbGradient.addColorStop(0.5, "rgba(251, 113, 133, 0.08)");
      orbGradient.addColorStop(1, "rgba(251, 113, 133, 0.02)");
    } else if (isActive) {
      orbGradient.addColorStop(0, "rgba(214, 211, 209, 0.1)");
      orbGradient.addColorStop(0.5, "rgba(214, 211, 209, 0.05)");
      orbGradient.addColorStop(1, "rgba(214, 211, 209, 0.01)");
    } else {
      orbGradient.addColorStop(0, "rgba(214, 211, 209, 0.06)");
      orbGradient.addColorStop(0.5, "rgba(214, 211, 209, 0.03)");
      orbGradient.addColorStop(1, "rgba(214, 211, 209, 0.01)");
    }

    ctx.fillStyle = orbGradient;
    ctx.fill();

    // Border ring
    ctx.strokeStyle = isSpeaking
      ? `rgba(251, 113, 133, ${0.3 + avgLevel * 0.4})`
      : isActive
        ? `rgba(214, 211, 209, ${0.15 + avgLevel * 0.25})`
        : "rgba(214, 211, 209, 0.1)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    animationRef.current = requestAnimationFrame(draw);
  }, [getFrequencyData, isActive, isSpeaking]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
