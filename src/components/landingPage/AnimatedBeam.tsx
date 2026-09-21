"use client";

import React, { useEffect, useState } from "react";

export interface AnimatedBeamProps {
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  duration?: number;
  pathType?: "orthogonal" | "straight-horizontal" | "l-shape-up-right";
  startYOffset?: number;
  startAnchor?: "center" | "top" | "bottom";
  endAnchor?: "center" | "top" | "bottom";
}

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  reverse = false,
  pathColor = "currentColor",
  pathWidth = 1.5,
  pathOpacity = 0.2,
  gradientStartColor = "#38bdf8",
  gradientStopColor = "#818cf8",
  duration = 1,
  pathType = "orthogonal",
  startYOffset = 0,
  startAnchor = "center",
  endAnchor = "center",
}: AnimatedBeamProps) {
  const [pathD, setPathD] = useState("");

  useEffect(() => {
    const updatePath = () => {
      const container = containerRef.current;
      const from = fromRef.current;
      const to = toRef.current;
      if (!container || !from || !to) return;

      const containerRect = container.getBoundingClientRect();
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();
      const startX = fromRect.left - containerRect.left + fromRect.width / 2;
      const endX = toRect.left - containerRect.left + toRect.width / 2;
      let startY = fromRect.top - containerRect.top + startYOffset;
      let endY = toRect.top - containerRect.top;

      if (startAnchor === "center") startY += fromRect.height / 2;
      if (startAnchor === "bottom") startY += fromRect.height;
      if (endAnchor === "center") endY += toRect.height / 2;
      if (endAnchor === "bottom") endY += toRect.height;

      const dx = endX - startX;
      const dy = endY - startY;
      const directionX = Math.sign(dx) || 1;
      const directionY = Math.sign(dy) || 1;
      const radius = Math.min(24, Math.abs(dx) / 2, Math.abs(dy) / 2);

      if (radius === 0 || pathType === "straight-horizontal") {
        setPathD(`M ${startX},${startY} L ${endX},${pathType === "straight-horizontal" ? startY : endY}`);
        return;
      }

      if (pathType === "l-shape-up-right") {
        setPathD(`M ${startX},${startY} L ${startX},${endY - radius * directionY} Q ${startX},${endY} ${startX + radius * directionX},${endY} L ${endX},${endY}`);
        return;
      }

      const midY = startY + dy / 2;
      setPathD(`M ${startX},${startY} L ${startX},${midY - radius * directionY} Q ${startX},${midY} ${startX + radius * directionX},${midY} L ${endX - radius * directionX},${midY} Q ${endX},${midY} ${endX},${midY + radius * directionY} L ${endX},${endY}`);
    };

    const observer = new ResizeObserver(updatePath);
    [containerRef.current, fromRef.current, toRef.current].forEach((element) => {
      if (element) observer.observe(element);
    });
    updatePath();
    window.addEventListener("resize", updatePath);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePath);
    };
  }, [containerRef, fromRef, toRef, pathType, startAnchor, endAnchor, startYOffset]);

  const gradientId = React.useId();
  if (!pathD) return null;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <path d={pathD} stroke={pathColor} strokeWidth={pathWidth} strokeOpacity={pathOpacity} strokeDasharray="4 4" fill="none" />
      <path d={pathD} stroke={`url(#${gradientId})`} strokeWidth={pathWidth + 0.5} strokeLinecap="round" strokeDasharray="40 1000" fill="none">
        <animate attributeName="stroke-dashoffset" values={reverse ? "0;1000" : "1000;0"} dur={`${duration}s`} repeatCount="indefinite" />
      </path>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="50%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStartColor} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
