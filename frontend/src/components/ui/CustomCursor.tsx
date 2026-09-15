'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return;
    }

    const arrow = arrowRef.current;
    if (!arrow) return;

    document.body.classList.add('custom-cursor-active');

    let mx = 0, my = 0;   // mouse position
    let ax = 0, ay = 0;   // arrow position (lerped)
    let raf: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Color-reactive: find nearest ancestor with data-cursor-color
      const target = (e.target as HTMLElement)?.closest?.('[data-cursor-color]');
      const color = target?.getAttribute('data-cursor-color');
      document.documentElement.style.setProperty('--cursor-color', color || '#ffffff');
    };

    const animate = () => {
      // Arrow follows tightly
      ax = lerp(ax, mx, 0.22);
      ay = lerp(ay, my, 0.22);
      arrow.style.left = `${ax}px`;
      arrow.style.top = `${ay}px`;

      raf = requestAnimationFrame(animate);
    };
    animate();

    const onEnter = () => {
      arrow.classList.add('hovering');
    };
    const onLeave = () => {
      arrow.classList.remove('hovering');
    };
    const onDown = () => {
      arrow.classList.add('clicking');
    };
    const onUp = () => {
      arrow.classList.remove('clicking');
    };

    // Use mutation observer to catch dynamically added elements
    const observeHoverTargets = () => {
      const targets = document.querySelectorAll('a, button, [data-cursor-hover]');
      targets.forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
      return targets;
    };

    let hoverTargets = observeHoverTargets();
    const observer = new MutationObserver(() => {
      // cleanup old
      hoverTargets.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      hoverTargets = observeHoverTargets();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      hoverTargets.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <div ref={arrowRef} id="cursor-arrow" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 2L16 10L9 11.5L6.5 18L4 2Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
