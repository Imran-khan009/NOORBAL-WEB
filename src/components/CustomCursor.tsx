import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Strictly disable on touch / mobile devices and when reduced motion is preferred
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 1024;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest(
        'button, a, input, select, textarea, [data-cursor], [data-cursor-text]'
      ) as HTMLElement | null;

      if (interactiveEl) {
        setIsHoveringInteractive(true);
        const textAttr = interactiveEl.getAttribute('data-cursor-text');
        const isProductImg = target.closest('.product-image-container, [data-cursor="view"]');
        if (textAttr) {
          setCursorText(textAttr);
        } else if (isProductImg) {
          setCursorText('VIEW');
        } else {
          setCursorText(null);
        }
      } else {
        setIsHoveringInteractive(false);
        setCursorText(null);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth animation loop for ring tracking
    const render = () => {
      const ease = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (!isEnabled) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-9999 overflow-hidden transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#C9A468] transition-transform duration-75 ease-out shadow-xs pointer-events-none"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      />

      {/* Smooth Trailing Aura Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full flex items-center justify-center transition-all duration-200 ease-out pointer-events-none ${
          cursorText
            ? 'w-14 h-14 -ml-7 -mt-7 bg-[#2B231E]/85 backdrop-blur-xs border border-[#C9A468] shadow-lg'
            : isHoveringInteractive
            ? 'w-9 h-9 -ml-4.5 -mt-4.5 bg-[#C9A468]/15 border border-[#C9A468]'
            : 'w-7 h-7 -ml-3.5 -mt-3.5 border border-[#C9A468]/60'
        }`}
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      >
        {cursorText && (
          <span className="text-[9px] font-sans font-bold tracking-widest text-[#DFBF88] uppercase select-none px-1 text-center">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
