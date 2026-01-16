'use client';

import { useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  width?: string;
}

export default function TextReveal({ children, className = '', delay = 0, width = 'fit-content' }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.set(revealRef.current, { xPercent: -101 })
      .set(textRef.current, { opacity: 0 })
      .to(revealRef.current, {
        xPercent: 0,
        duration: 0.6,
        ease: 'expo.inOut',
        delay: delay,
      })
      .set(textRef.current, { opacity: 1 })
      .to(revealRef.current, {
        xPercent: 101,
        duration: 0.6,
        ease: 'expo.inOut',
      });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width }}
    >
      <div ref={textRef}>{children}</div>
      <div
        ref={revealRef}
        className="absolute inset-0 bg-gold z-20"
      />
    </div>
  );
}
