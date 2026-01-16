'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, Trophy } from 'lucide-react';
import RegistrationForm from '@/components/RegistrationForm';
import Particles from '@/components/Particles';

export default function RegisterClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(
      headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    );
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative min-h-screen py-12 px-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-background/60 z-0" />
      
      <Particles />
      
      <div className="relative z-10 max-w-xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-gold transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-bold uppercase tracking-widest">Return to Home</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-gold/10 border border-gold/20">
              <Trophy className="w-8 h-8 text-gold trophy-icon" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-gradient-gold uppercase leading-none">COALESCE</h1>
              <p className="text-foreground/40 text-xs font-bold uppercase tracking-[0.3em] mt-1">Official Registration</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <RegistrationForm />
      </div>
    </main>
  );
}
