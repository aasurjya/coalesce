'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Trophy } from 'lucide-react';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Luxury Dissolve Transition
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 1.1,
          duration: 1.2,
          ease: 'power2.inOut',
          onStart: () => {
            // Trigger site content entrance exactly as the dissolve begins
            onComplete();
          },
          onComplete: () => {
            if (containerRef.current) containerRef.current.style.display = 'none';
          }
        });
      }
    });

    // 1. Initial State
    tl.set([logoRef.current, titleRef.current], { opacity: 0, y: 30, scale: 0.8, filter: 'blur(10px)' });
    tl.set(auraRef.current, { opacity: 0, scale: 0.5 });

    // 2. Aura Pulsation Entrance
    tl.to(auraRef.current, {
      opacity: 0.4,
      scale: 1.5,
      duration: 1.5,
      ease: 'power3.out'
    });

    // 3. Logo & Title "Luxury Reveal"
    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'back.out(1.7)'
    }, '-=1');

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power4.out'
    }, '-=0.6');

    // 4. Elegant Suspension (the "Hold" moment)
    tl.to(logoRef.current, {
      y: -10,
      duration: 1.5,
      repeat: 1,
      yoyo: true,
      ease: 'sine.inOut'
    }, '+=0.2');

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050a14] overflow-hidden"
    >
      {/* Cinematic Background Atmosphere */}
      <div className="absolute inset-0">
        <div ref={auraRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/20 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* The Prestige Trophy */}
        <div ref={logoRef} className="relative mb-10">
          <div className="relative w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-gold-dark/30 to-gold/5 border border-gold/20 flex items-center justify-center rotate-12 glow-gold backdrop-blur-md shadow-2xl overflow-hidden group">
            <Trophy className="w-16 h-16 text-gold -rotate-12 drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </div>

        {/* The Brand Revelation */}
        <div ref={titleRef} className="text-center">
          <p className="text-gold/60 text-lg font-bold tracking-[0.4em] uppercase mb-6">Loading...</p>
          <h1 className="text-6xl md:text-7xl font-black tracking-[-0.08em] text-gradient-gold uppercase leading-none italic drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            COALESCE
          </h1>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
            <p className="text-gold/60 text-[11px] font-bold uppercase tracking-[0.8em] whitespace-nowrap pl-[0.8em]">
              March 2026
            </p>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
          </div>
        </div>
      </div>

      {/* Subtle Developer Signature */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-30 flex flex-col items-center gap-1.5 pointer-events-none">
        <span className="text-[7px] font-bold uppercase tracking-[0.4em] text-gold/60">Architected by</span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold/40">Aasurjya Bikash Handique</span>
        <span className="text-[7px] font-medium lowercase tracking-wider text-gold/30">corp.asurjya@gmail.com</span>
      </div>

      {/* Luxury Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-20" />
    </div>
  );
}
