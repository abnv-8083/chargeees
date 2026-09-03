'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return;
    }

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    document.body.classList.add('custom-cursor-active');

    let ox = 0, oy = 0;
    let ix = 0, iy = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      ix = e.clientX; iy = e.clientY;
      inner.style.left = `${ix}px`;
      inner.style.top  = `${iy}px`;

      // Color-reactive: find nearest ancestor with data-cursor-color
      const target = (e.target as HTMLElement)?.closest?.('[data-cursor-color]');
      const color = target?.getAttribute('data-cursor-color');
      document.documentElement.style.setProperty('--cursor-color', color || 'rgba(255,255,255,0.5)');
      document.documentElement.style.setProperty('--cursor-color-hover', color || 'rgba(255,255,255,0.8)');
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      ox = lerp(ox, ix, 0.12);
      oy = lerp(oy, iy, 0.12);
      outer.style.left = `${ox}px`;
      outer.style.top  = `${oy}px`;
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onEnter = () => outer.classList.add('hovering');
    const onLeave = () => outer.classList.remove('hovering');
    const onDown  = () => outer.classList.add('clicking');
    const onUp    = () => outer.classList.remove('clicking');

    const hoverTargets = document.querySelectorAll('a, button, [data-cursor-hover]');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      hoverTargets.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={outerRef} id="cursor-outer" aria-hidden="true" />
      <div ref={innerRef} id="cursor-inner" aria-hidden="true" />
    </>
  );
}
