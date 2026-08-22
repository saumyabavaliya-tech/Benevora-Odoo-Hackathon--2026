import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'compact';
  showTagline?: boolean;
  taglineText?: string;
  animate?: boolean;
  interactive?: boolean;
  className?: string;
}

/**
 * High-Resolution 3D Live Canvas Globe Logo
 * Renders real-time rotating 3D spherical geometry, atmospheric glow,
 * orbital flight trajectory with trailing supersonic jet, and interactive tilt physics.
 */
export const LiveGlobeCanvas: React.FC<{
  sizePx: number;
  interactive?: boolean;
  className?: string;
}> = ({ sizePx, interactive = true, className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number; isHovered: boolean }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isHovered: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina / High-DPI Resolution Scaling (4x internal buffer for ultra-sharp vectors)
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    canvas.width = sizePx * dpr;
    canvas.height = sizePx * dpr;
    canvas.style.width = `${sizePx}px`;
    canvas.style.height = `${sizePx}px`;

    // 3D Sphere Topography & Point Cloud Points
    const sphereRadius = (sizePx * dpr * 0.38);
    const centerX = (sizePx * dpr) / 2;
    const centerY = (sizePx * dpr) / 2;

    // Generate geographic topographical nodes (Continent Clusters & Waypoints)
    interface NodePoint {
      lat: number;
      lon: number;
      size: number;
      color: string;
      isBeacon?: boolean;
    }

    const nodes: NodePoint[] = [];
    // Major continent clusters (Asia, Europe, Americas, Africa, Australia)
    const continentCenters = [
      { lat: 20, lon: 78, density: 16, spread: 25 }, // India / South Asia
      { lat: 35, lon: 105, density: 18, spread: 30 }, // East Asia
      { lat: 48, lon: 15, density: 18, spread: 22 }, // Europe
      { lat: 38, lon: -95, density: 22, spread: 35 }, // North America
      { lat: -15, lon: -55, density: 14, spread: 28 }, // South America
      { lat: 5, lon: 20, density: 16, spread: 30 }, // Africa
      { lat: -25, lon: 135, density: 12, spread: 20 }, // Australia
      { lat: 65, lon: -18, density: 8, spread: 15 }, // Nordic / Iceland
    ];

    continentCenters.forEach((c) => {
      // Landmark center beacon
      nodes.push({
        lat: (c.lat * Math.PI) / 180,
        lon: (c.lon * Math.PI) / 180,
        size: 2.4 * dpr,
        color: '#38BDF8',
        isBeacon: true,
      });

      for (let i = 0; i < c.density; i++) {
        const offsetLat = (c.lat + (Math.random() - 0.5) * c.spread) * (Math.PI / 180);
        const offsetLon = (c.lon + (Math.random() - 0.5) * c.spread) * (Math.PI / 180);
        nodes.push({
          lat: offsetLat,
          lon: offsetLon,
          size: (1.0 + Math.random() * 1.2) * dpr,
          color: Math.random() > 0.4 ? '#60A5FA' : '#818CF8',
        });
      }
    });

    // Generate Latitude & Longitude Wireframe Rings
    const latRings = [-60, -40, -20, 0, 20, 40, 60].map((deg) => (deg * Math.PI) / 180);
    const lonRings = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (deg * Math.PI) / 180);

    let rotationAngle = 0;
    let flightAngle = 0;
    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Base auto rotation + smooth mouse tilt integration
      rotationAngle += delta * 0.45;
      flightAngle += delta * 1.1;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const tiltX = (mouseRef.current.y / sizePx) * 0.5;
      const tiltY = (mouseRef.current.x / sizePx) * 0.6;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- 1. OUTER AMBIENT ATMOSPHERE & NEBULA GLOW ---
      const outerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        sphereRadius * 0.5,
        centerX,
        centerY,
        sphereRadius * 1.35
      );
      outerGlow.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
      outerGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.15)');
      outerGlow.addColorStop(0.85, 'rgba(14, 165, 233, 0.06)');
      outerGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // --- 2. DEEP COSMIC SPHERE CORE ---
      const globeGrad = ctx.createRadialGradient(
        centerX - sphereRadius * 0.35 + tiltY * 15 * dpr,
        centerY - sphereRadius * 0.35 + tiltX * 15 * dpr,
        sphereRadius * 0.1,
        centerX,
        centerY,
        sphereRadius
      );
      globeGrad.addColorStop(0, '#1E293B');
      globeGrad.addColorStop(0.4, '#0F172A');
      globeGrad.addColorStop(0.85, '#020617');
      globeGrad.addColorStop(1, '#000000');

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = globeGrad;
      ctx.fill();

      // Internal subtle star speckles inside core
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.fillRect(centerX - 10 * dpr, centerY - 14 * dpr, 1.2 * dpr, 1.2 * dpr);
      ctx.fillRect(centerX + 18 * dpr, centerY + 8 * dpr, 1 * dpr, 1 * dpr);
      ctx.fillRect(centerX - 24 * dpr, centerY + 16 * dpr, 0.8 * dpr, 0.8 * dpr);

      // --- 3. 3D WIREFRAME MERIDIANS & LATITUDES ---
      // Function to project 3D spherical coordinates (lat, lon, radius) to 2D
      const project3D = (lat: number, lon: number, rad: number) => {
        const curLon = lon + rotationAngle + tiltY;
        const x3d = rad * Math.cos(lat) * Math.sin(curLon);
        const y3d = -rad * Math.sin(lat);
        const z3d = rad * Math.cos(lat) * Math.cos(curLon);

        // Apply pitch tilt (X-axis rotation)
        const cosPitch = Math.cos(0.28 + tiltX);
        const sinPitch = Math.sin(0.28 + tiltX);
        const yRot = y3d * cosPitch - z3d * sinPitch;
        const zRot = y3d * sinPitch + z3d * cosPitch;

        return {
          x: centerX + x3d,
          y: centerY + yRot,
          z: zRot,
          visible: zRot > -rad * 0.15,
          opacity: Math.max(0, (zRot + rad * 0.2) / (rad * 1.2)),
        };
      };

      // Draw Longitude Meridian Curves
      lonRings.forEach((lon) => {
        ctx.beginPath();
        let first = true;
        for (let deg = -90; deg <= 90; deg += 5) {
          const lat = (deg * Math.PI) / 180;
          const p = project3D(lat, lon, sphereRadius);
          if (p.visible) {
            if (first) {
              ctx.moveTo(p.x, p.y);
              first = false;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 0.8 * dpr;
        ctx.stroke();
      });

      // Draw Latitude Rings
      latRings.forEach((lat) => {
        ctx.beginPath();
        let first = true;
        for (let deg = 0; deg <= 360; deg += 6) {
          const lon = (deg * Math.PI) / 180;
          const p = project3D(lat, lon, sphereRadius);
          if (p.visible) {
            if (first) {
              ctx.moveTo(p.x, p.y);
              first = false;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.14)';
        ctx.lineWidth = 0.8 * dpr;
        ctx.stroke();
      });

      // --- 4. CONTINENT TOPOGRAPHY NODES & CITIES ---
      nodes.forEach((node) => {
        const p = project3D(node.lat, node.lon, sphereRadius);
        if (p.visible) {
          ctx.beginPath();
          const nodeRad = node.size * (0.6 + p.opacity * 0.5);
          ctx.arc(p.x, p.y, Math.max(0.6 * dpr, nodeRad), 0, Math.PI * 2);

          if (node.isBeacon) {
            // Glowing pulsing city beacon
            ctx.fillStyle = '#38BDF8';
            ctx.shadowColor = '#38BDF8';
            ctx.shadowBlur = 6 * dpr;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Ripple ring around landmark
            const pulse = (Math.sin(time * 0.005 + node.lat) + 1) * 0.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, nodeRad + pulse * 2.5 * dpr, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 * (1 - pulse)})`;
            ctx.lineWidth = 0.8 * dpr;
            ctx.stroke();
          } else {
            ctx.fillStyle = node.color;
            ctx.globalAlpha = 0.3 + p.opacity * 0.7;
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
        }
      });

      // --- 5. ATMOSPHERIC FRESNEL RIM LIGHT ---
      const rimGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        sphereRadius * 0.78,
        centerX,
        centerY,
        sphereRadius
      );
      rimGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      rimGrad.addColorStop(0.65, 'rgba(56, 189, 248, 0.15)');
      rimGrad.addColorStop(0.9, 'rgba(99, 102, 241, 0.55)');
      rimGrad.addColorStop(1, 'rgba(224, 242, 254, 0.95)');

      ctx.fillStyle = rimGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // Exit sphere clipping

      // Outer Sphere Border Ring (Glass Edge)
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.2 * dpr;
      ctx.stroke();

      // --- 6. 3D ORBITING FLIGHT TRAJECTORY & SUPERSONIC JET ---
      const orbitRadius = sphereRadius * 1.24;
      const orbitPointsCount = 64;
      const orbitTrail: { x: number; y: number; z: number; alpha: number }[] = [];

      // Orbit inclination: tilted ring around globe
      const orbitInclination = 0.55;

      for (let i = 0; i <= orbitPointsCount; i++) {
        const angle = flightAngle - (i / orbitPointsCount) * Math.PI * 1.8;
        const ox = orbitRadius * Math.cos(angle);
        const oy = orbitRadius * Math.sin(angle) * Math.sin(orbitInclination);
        const oz = orbitRadius * Math.sin(angle) * Math.cos(orbitInclination);

        // Apply pitch tilt
        const cosP = Math.cos(0.28 + tiltX);
        const sinP = Math.sin(0.28 + tiltX);
        const yRot = oy * cosP - oz * sinP;
        const zRot = oy * sinP + oz * cosP;

        orbitTrail.push({
          x: centerX + ox,
          y: centerY + yRot,
          z: zRot,
          alpha: Math.pow(1 - i / orbitPointsCount, 1.8),
        });
      }

      // Draw Orbit Glowing Vapor Trail
      for (let i = 1; i < orbitTrail.length; i++) {
        const p1 = orbitTrail[i - 1];
        const p2 = orbitTrail[i];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        // Adjust brightness based on depth (front vs back of globe)
        const depthMod = p1.z > 0 ? 1.0 : 0.35;
        ctx.strokeStyle = `rgba(56, 189, 248, ${p1.alpha * 0.85 * depthMod})`;
        ctx.lineWidth = (2.2 * p1.alpha + 0.6) * dpr;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Live Lead Supersonic Aero Jet Pointer at Head of Trajectory
      if (orbitTrail.length > 0) {
        const head = orbitTrail[0];
        const prev = orbitTrail[1] || head;
        const angle = Math.atan2(head.y - prev.y, head.x - prev.x);

        ctx.save();
        ctx.translate(head.x, head.y);
        ctx.rotate(angle);

        // Glow behind jet
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 8 * dpr;

        // Jet Craft Geometry
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        const jetSize = 4.2 * dpr;
        ctx.moveTo(jetSize * 1.5, 0); // Nose tip
        ctx.lineTo(-jetSize, -jetSize * 0.9); // Left wing
        ctx.lineTo(-jetSize * 0.4, 0); // Inner fuselage
        ctx.lineTo(-jetSize, jetSize * 0.9); // Right wing
        ctx.closePath();
        ctx.fill();

        // Neon thruster spark
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(-jetSize * 0.6, 0, 1.4 * dpr, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // --- 7. NORTH ADVENTURE STAR SPARKLE ---
      const starX = centerX + sphereRadius * 0.82;
      const starY = centerY - sphereRadius * 0.72;
      const starGlow = (Math.sin(time * 0.004) + 1) * 0.5;

      ctx.save();
      ctx.translate(starX, starY);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = (6 + starGlow * 6) * dpr;

      // 4-point Diamond Star
      const starLen = (3.5 + starGlow * 1.5) * dpr;
      const starThick = 0.8 * dpr;
      ctx.beginPath();
      ctx.moveTo(0, -starLen);
      ctx.lineTo(starThick, 0);
      ctx.lineTo(0, starLen);
      ctx.lineTo(-starThick, 0);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-starLen, 0);
      ctx.lineTo(0, starThick);
      ctx.lineTo(starLen, 0);
      ctx.lineTo(0, -starThick);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [sizePx]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
    mouseRef.current.isHovered = true;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
    mouseRef.current.isHovered = false;
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative flex items-center justify-center cursor-pointer select-none', className)}
      style={{ width: sizePx, height: sizePx }}
    >
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
};

export const BrandIcon: React.FC<{
  sizeClass?: string;
  sizePx?: number;
  className?: string;
  animate?: boolean;
  interactive?: boolean;
}> = ({ sizePx = 44, className = '', interactive = true }) => {
  return (
    <div
      className={cn(
        'relative shrink-0 flex items-center justify-center rounded-2xl group select-none transition-transform duration-300',
        'hover:scale-105',
        className
      )}
      style={{ width: sizePx, height: sizePx }}
    >
      {/* Outer ambient glow backing */}
      <div className="absolute inset-[-4px] rounded-3xl bg-gradient-to-tr from-cyan-500/30 via-blue-600/30 to-indigo-600/30 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />

      {/* Glossy Bezel Frame */}
      <div className="relative w-full h-full rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-blue-900/30 flex items-center justify-center overflow-hidden">
        {/* Subtle mesh background grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:6px_6px]" />

        {/* Real-time High-Resolution Live Canvas */}
        <LiveGlobeCanvas sizePx={sizePx - 4} interactive={interactive} />
      </div>
    </div>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'full',
  showTagline = true,
  taglineText = 'Feel the adventure',
  animate = true,
  interactive = true,
  className,
}) => {
  const sizeConfig = {
    xs: {
      px: 32,
      text: 'text-base',
      tagline: 'text-[8px]',
      gap: 'gap-2',
    },
    sm: {
      px: 38,
      text: 'text-lg',
      tagline: 'text-[9px]',
      gap: 'gap-2.5',
    },
    md: {
      px: 46,
      text: 'text-xl',
      tagline: 'text-[10px]',
      gap: 'gap-3',
    },
    lg: {
      px: 56,
      text: 'text-2xl',
      tagline: 'text-xs',
      gap: 'gap-3.5',
    },
    xl: {
      px: 72,
      text: 'text-3xl sm:text-4xl',
      tagline: 'text-xs sm:text-sm',
      gap: 'gap-4',
    },
  };

  const current = sizeConfig[size];

  if (variant === 'icon') {
    return <BrandIcon sizePx={current.px} className={className} animate={animate} interactive={interactive} />;
  }

  return (
    <div className={cn('inline-flex items-center group select-none', current.gap, className)}>
      <BrandIcon sizePx={current.px} animate={animate} interactive={interactive} />

      <div className="flex flex-col">
        <div className="flex items-center tracking-tight font-extrabold leading-none">
          <span className={cn('text-white font-black drop-shadow-sm', current.text)}>
            Globe
          </span>
          <span
            className={cn(
              'font-black bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent ml-[1.5px] drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]',
              current.text
            )}
          >
            Trotter
          </span>
          {/* Live pulsing adventure beacon dot */}
          <span className="relative flex h-2 w-2 ml-1.5 mb-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400 shadow-xs shadow-sky-400" />
          </span>
        </div>

        {showTagline && (
          <span
            className={cn(
              'font-semibold uppercase tracking-widest text-slate-400 group-hover:text-sky-300 transition-colors mt-0.5',
              current.tagline
            )}
          >
            {taglineText}
          </span>
        )}
      </div>
    </div>
  );
};
