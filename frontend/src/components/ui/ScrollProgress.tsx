'use client';

import { useEffect, useState, useCallback } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const calculateScroll = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;

    if (totalHeight > 0) {
      const currentProgress = Math.min(Math.max(currentScroll / totalHeight, 0), 1);
      setProgress(currentProgress);
    } else {
      setProgress(0);
    }

    if (currentScroll > 80) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', calculateScroll, { passive: true });
    window.addEventListener('resize', calculateScroll, { passive: true });
    calculateScroll();

    return () => {
      window.removeEventListener('scroll', calculateScroll);
      window.removeEventListener('resize', calculateScroll);
    };
  }, [calculateScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG Circular progress dimensions
  const size = 46;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2; // 21.5
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <>
      {/* Top scroll progress indicator bar */}
      <div
        id="scroll-progress"
        style={{
          transform: `scaleX(${progress})`,
        }}
        aria-hidden="true"
      />

      {/* Floating Circular Scroll Progress / Back to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`scroll-to-top-btn ${isVisible ? 'visible' : ''}`}
      >
        {/* SVG Progress Ring */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="scroll-progress-svg"
        >
          <defs>
            <linearGradient id="scrollProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="scroll-progress-track"
            strokeWidth={strokeWidth}
          />

          {/* Animated Loading/Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#scrollProgressGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="scroll-progress-indicator"
          />
        </svg>

        {/* Inner Chevron Up Arrow */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="scroll-arrow-icon"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </>
  );
}
