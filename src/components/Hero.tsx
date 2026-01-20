'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Calendar, MapPin, Clock, ChevronDown, Ticket, Sparkles } from 'lucide-react';
import { EVENT_INFO } from '@/lib/constants';

import Magnetic from './Magnetic';

export default function Hero({ isVisible }: { isVisible: boolean }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const hostedByRef = useRef<HTMLParagraphElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!isVisible) return;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Background Image Zoom
    tl.fromTo(
      bgImageRef.current,
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 0.6, duration: 2, ease: 'power2.out' },
      0
    );

    // Trophy decoration
    tl.fromTo(
      decorRef.current,
      { scale: 0, rotation: -180, opacity: 0, y: 30 },
      { scale: 1, rotation: 0, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' },
      0.1
    );

    // Title animation - simple fade in
    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power4.out' },
      0.2
    );

    // Tagline
    tl.fromTo(
      taglineRef.current,
      { y: 10, opacity: 0, letterSpacing: '0.4em' },
      { y: 0, opacity: 1, letterSpacing: '0.2em', duration: 0.6 },
      0.5
    );

    // Hosted by
    tl.fromTo(
      hostedByRef.current,
      { y: 5, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4 },
      0.7
    );

    // Details card
    tl.fromTo(
      detailsRef.current,
      { y: 20, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' },
      0.6
    );

    // CTA buttons
    tl.fromTo(
      ctaRef.current?.children || [],
      { x: -10, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.15 },
      0.8
    );

    // Floating animation for decoration
    gsap.to(decorRef.current, {
      y: -20,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 40;
      const yPos = (clientY / window.innerHeight - 0.5) * 40;

      gsap.to(bgImageRef.current, {
        x: xPos,
        y: yPos,
        duration: 1,
        ease: 'power2.out',
      });

      gsap.to(decorRef.current, {
        x: -xPos * 0.5,
        y: -yPos * 0.5,
        duration: 1.5,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, { scope: heroRef, dependencies: [isVisible] });

  return (
    <section
      ref={heroRef}
      className={`relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-10 overflow-hidden ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
    >
      {/* Background Image with Overlay */}
      <div 
        ref={bgImageRef}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2670&auto=format&fit=crop"
          alt="Event Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy/80 z-10" />
        <div className="absolute inset-0 gradient-radial opacity-50 z-10" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-pulse opacity-0" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl animate-pulse opacity-0" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Trophy decoration */}
        <div ref={decorRef} className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gold-dark to-gold glow-gold-intense relative group">
            <Sparkles className="w-12 h-12 text-navy relative z-10" />
            <div className="absolute inset-0 rounded-full bg-gold/30 blur-md group-hover:scale-125 transition-transform duration-500" />
          </div>
        </div>

        {/* Main title */}
        <h1
          ref={titleRef}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-gradient-gold mb-6 tracking-tight perspective-1000 uppercase italic"
        >
          {EVENT_INFO.name}
        </h1>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="mb-8 text-lg sm:text-xl text-gold/60 font-black tracking-[0.5em] uppercase pl-[0.5em]"
        >
          {EVENT_INFO.tagline}
        </p>

        {/* Hosted by */}
        <p ref={hostedByRef} className="mb-8 text-sm text-gold/40 font-medium tracking-[0.3em] uppercase">
          Hosted by {EVENT_INFO.hosted_by}
        </p>

        {/* Event Details Card */}
        <div 
          ref={detailsRef} 
          className="w-full max-w-4xl mx-auto mb-12 p-6 md:p-8 rounded-3xl border border-gold/20 bg-navy/30 backdrop-blur-2xl shadow-2xl shadow-gold/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-around gap-6 md:gap-8">
            <div className="flex items-center gap-4 text-left">
              <Calendar className="w-7 h-7 text-gold/60 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold/40">Date</p>
                <p className="text-lg font-black text-white tracking-tighter">{EVENT_INFO.date}</p>
              </div>
            </div>
            <div className="w-px h-12 bg-gold/20 hidden md:block" />
            <div className="flex items-center gap-4 text-left">
              <Clock className="w-7 h-7 text-gold/60 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold/40">Time</p>
                <p className="text-lg font-black text-white tracking-tighter">{EVENT_INFO.time}</p>
              </div>
            </div>
            <div className="w-px h-12 bg-gold/20 hidden md:block" />
            <div className="flex items-center gap-4 text-left">
              <MapPin className="w-7 h-7 text-gold/60 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold/40">Venue</p>
                <p className="text-lg font-black text-white tracking-tighter">{EVENT_INFO.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons - Premium Redesign */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row justify-center gap-8 mb-12">
          <Magnetic strength={0.2}>
            <Link
              href="/register"
              className="group relative px-14 py-6 rounded-[2rem] bg-gold text-navy text-xl font-black uppercase tracking-[0.1em] shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-4">
                <Ticket className="w-6 h-6" />
                <span>Register Now</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          </Magnetic>
          
          <Magnetic strength={0.2}>
            <Link
              href="#about"
              className="group relative px-12 py-6 rounded-[2rem] border border-gold/30 bg-white/5 backdrop-blur-xl text-gold text-xl font-black uppercase tracking-[0.1em] transition-all duration-500 hover:bg-gold/10 hover:border-gold/60 hover:scale-105"
            >
              <span className="relative z-10">The Legacy</span>
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
            </Link>
          </Magnetic>
        </div>

        {/* Fee badge */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-gold/30" />
          <span className="inline-block bg-gold/10 border border-gold/30 text-gold px-6 py-2 rounded-full text-sm font-medium tracking-widest uppercase">
            Entry Fee: ₹{EVENT_INFO.fee} | Early Bird: ₹150 (First 50)
          </span>
          <div className="h-px w-8 bg-gold/30" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2`}>
        <span className="text-[10px] uppercase tracking-[0.3em] text-gold/40">Scroll</span>
        <ChevronDown className="w-6 h-6 text-gold animate-bounce" />
      </div>
    </section>
  );
}
