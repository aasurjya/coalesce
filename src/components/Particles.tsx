'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Particles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];
    const particleCount = 40; // Reduced for performance with smooth scroll

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.width = `${Math.random() * 3 + 1}px`;
      particle.style.height = particle.style.width;
      particle.style.opacity = `${Math.random() * 0.3 + 0.1}`;
      container.appendChild(particle);
      particles.push(particle);

      gsap.to(particle, {
        y: -window.innerHeight,
        x: `+=${Math.random() * 60 - 30}`,
        opacity: 0,
        duration: Math.random() * 15 + 15,
        repeat: -1,
        delay: Math.random() * 10,
        ease: 'none',
        onRepeat: () => {
          gsap.set(particle, {
            y: window.innerHeight + 50,
            x: Math.random() * window.innerWidth,
            opacity: Math.random() * 0.3 + 0.1,
          });
        },
      });
    }

    return () => {
      particles.forEach((p) => p.remove());
    };
  }, { scope: containerRef });

  return <div ref={containerRef} className="particles pointer-events-none" />;
}

