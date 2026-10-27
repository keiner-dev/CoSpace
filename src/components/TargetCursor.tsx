"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";

interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
}

// Suscriptor vacío requerido por useSyncExternalStore
const emptySubscribe = () => () => {};

export default function TargetCursor({
  targetSelector = "button, a, input, select, textarea, .cursor-target, [role='button']",
  spinDuration = 2.5,
  hideDefaultCursor = false,
}: TargetCursorProps) {
  // Detecta puntero fino (mouse/trackpad) sin provocar re-renders en cascada
  const isFinePointer = useSyncExternalStore(
    emptySubscribe,
    () => window.matchMedia("(pointer: fine)").matches, // Cliente
    () => false // Servidor (SSR)
  );

  const cursorWrapperRef = useRef<HTMLDivElement | null>(null);
  const reticleRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const isLockedRef = useRef<boolean>(false);
  const currentTargetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isFinePointer) return;

    if (hideDefaultCursor) {
      document.body.style.cursor = "none";
    }

    const wrapper = cursorWrapperRef.current;
    const reticle = reticleRef.current;
    const dot = dotRef.current;
    if (!wrapper || !reticle || !dot) return;

    // Animación de giro constante
    const spinTween = gsap.to(reticle, {
      rotation: 360,
      duration: spinDuration > 0 ? spinDuration : 2.5,
      repeat: -1,
      ease: "none",
      paused: spinDuration <= 0,
    });

    // Seguimiento del cursor con amortiguación suave
    const xTo = gsap.quickTo(wrapper, "x", { duration: 0.12, ease: "power2.out" });
    const yTo = gsap.quickTo(wrapper, "y", { duration: 0.12, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      if (isLockedRef.current && currentTargetRef.current) {
        // Comprobar si el puntero se alejó del elemento bloqueado
        const rect = currentTargetRef.current.getBoundingClientRect();
        if (
          e.clientX < rect.left - 20 ||
          e.clientX > rect.right + 20 ||
          e.clientY < rect.top - 20 ||
          e.clientY > rect.bottom + 20
        ) {
          unlockTarget();
        } else {
          return;
        }
      }

      xTo(e.clientX - 18);
      yTo(e.clientY - 18);
    };

    // Bloquear retícula alrededor del elemento interactivo
    const lockTarget = (target: HTMLElement) => {
      currentTargetRef.current = target;
      isLockedRef.current = true;

      spinTween.pause();
      gsap.to(reticle, { rotation: 0, duration: 0.2 });

      const rect = target.getBoundingClientRect();
      const padding = 6;

      // Centrar el wrapper en el objetivo
      gsap.to(wrapper, {
        x: rect.left - padding,
        y: rect.top - padding,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Expandir las esquinas para encuadrar el elemento
      gsap.to(reticle, {
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        borderRadius: "12px",
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Ocultar el punto central durante el bloqueo
      gsap.to(dot, { opacity: 0, duration: 0.15 });
    };

    // Desbloquear retícula y volver al estado libre
    const unlockTarget = () => {
      currentTargetRef.current = null;
      isLockedRef.current = false;

      gsap.to(reticle, {
        width: 36,
        height: 36,
        borderRadius: "0px",
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(dot, { opacity: 1, duration: 0.15 });

      if (spinDuration > 0) {
        spinTween.play();
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(targetSelector);
      if (target) {
        lockTarget(target);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(targetSelector);
      if (target && target === currentTargetRef.current) {
        unlockTarget();
      }
    };

    const handleScroll = () => {
      if (isLockedRef.current && currentTargetRef.current) {
        const rect = currentTargetRef.current.getBoundingClientRect();
        const padding = 6;
        gsap.to(wrapper, {
          x: rect.left - padding,
          y: rect.top - padding,
          duration: 0.1,
          overwrite: "auto",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("scroll", handleScroll);
      spinTween.kill();
      if (hideDefaultCursor) {
        document.body.style.cursor = "auto";
      }
    };
  }, [isFinePointer, targetSelector, spinDuration, hideDefaultCursor]);

  if (!isFinePointer) return null;

  return (
    <div
      ref={cursorWrapperRef}
      className="fixed top-0 left-0 pointer-events-none z-[99999] will-change-transform"
      style={{ transform: "translate(-100px, -100px)" }}
    >
      <div
        ref={reticleRef}
        className="relative flex items-center justify-center pointer-events-none transition-colors"
        style={{ width: 36, height: 36 }}
      >
        {/* Punto central láser */}
        <div
          ref={dotRef}
          className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,1)]"
        />

        {/* Las 4 esquinas de puntería táctica (Brackets) */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-indigo-500" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-indigo-500" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-indigo-500" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-indigo-500" />
      </div>
    </div>
  );
}