'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Mail, Phone, MapPin, Instagram, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import { EVENT_INFO } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      contentRef.current?.children || [],
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 92%',
        },
      }
    );
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="relative bg-[#050a14] border-t border-gold/10 overflow-hidden">
      {/* Top Decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      
      {/* Background Glow */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center rotate-12 transition-all duration-500 group-hover:rotate-0 group-hover:bg-gold/20 group-hover:border-gold/40">
                  <Trophy className="w-6 h-6 text-gold -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                </div>
                <div className="absolute inset-0 bg-gold/20 blur-lg rounded-full scale-0 group-hover:scale-125 transition-transform duration-500 opacity-50" />
              </div>
              <span className="text-3xl font-black tracking-tighter text-gradient-gold uppercase">{EVENT_INFO.name}</span>
            </Link>
            <p className="text-foreground/50 text-base md:text-lg leading-relaxed max-w-md font-medium">
              {EVENT_INFO.tagline}. A premier convergence of talent and innovation redefining the standard of excellence since 2018.
            </p>
            {/* Social Matrix */}
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-12 h-12 rounded-2xl bg-navy-light flex items-center justify-center text-gold/60 border border-gold/5 hover:border-gold hover:bg-gold hover:text-navy hover:-translate-y-1.5 transition-all duration-300 group shadow-xl"
                >
                  <social.icon className="w-5 h-5 transition-transform group-hover:rotate-12" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-8">
            <h3 className="text-gold text-[10px] font-black tracking-[0.4em] uppercase opacity-60">Navigation</h3>
            <ul className="space-y-4">
              {[
                { label: 'The Legacy', href: '#about' },
                { label: 'Event Core', href: '#highlights' },
                { label: 'Visionaries', href: '#committee' },
                { label: 'Join Coalesce', href: '/register' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={link.href} 
                    className="text-foreground/40 hover:text-gold transition-all duration-500 text-sm font-black uppercase tracking-widest hover:translate-x-3 inline-flex items-center gap-3 group/nav"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-gold/20 group-hover/nav:bg-gold group-hover/nav:scale-125 transition-all duration-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Terminal */}
          <div className="space-y-8">
            <h3 className="text-gold text-[10px] font-black tracking-[0.4em] uppercase opacity-60">Connect</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group/item">
                <div className="w-12 h-12 rounded-xl bg-navy-light/50 flex items-center justify-center border border-gold/5 text-gold/40 group-hover/item:border-gold/40 group-hover/item:text-gold group-hover/item:bg-gold/10 transition-all duration-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-foreground/40 text-[11px] font-bold uppercase tracking-wider leading-relaxed pt-1 group-hover:text-foreground/70 transition-colors">
                  {EVENT_INFO.venue}<br />
                  {EVENT_INFO.location}
                </span>
              </li>
              <li className="flex items-center gap-4 group/item">
                <div className="w-12 h-12 rounded-xl bg-navy-light/50 flex items-center justify-center border border-gold/5 text-gold/40 group-hover/item:border-gold/40 group-hover/item:text-gold group-hover/item:bg-gold/10 transition-all duration-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <a href="mailto:contact@coalesce.event" className="text-foreground/40 hover:text-gold transition-colors text-[11px] font-black uppercase tracking-[0.15em] pt-0.5">
                  contact@coalesce.event
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Console Bottom */}
        <div className="mt-20 pt-10 border-t border-gold/5 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center lg:items-start gap-4">
            <p className="text-foreground/20 text-[10px] font-black tracking-[0.3em] uppercase">
              © 2026 {EVENT_INFO.name}. All Rights Reserved.
            </p>
            
            {/* Elite Architecture Credit */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3">
              <div className="flex flex-col items-center lg:items-start gap-2">
                <span className="text-foreground/20 text-[9px] font-bold uppercase tracking-widest">Architected by</span>
                <div className="flex flex-col gap-1.5">
                  <a 
                    href="https://aasurjya.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gold hover:text-gold/80 transition-all duration-300 flex items-center gap-1.5 group/dev font-black text-[11px] uppercase tracking-[0.2em]"
                  >
                    Aasurjya Bikash Handique
                    <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-0.5" />
                  </a>
                  <a 
                    href="mailto:corp.asurjya@gmail.com" 
                    className="text-gold/60 hover:text-gold transition-colors text-[9px] font-bold lowercase tracking-wider"
                  >
                    corp.asurjya@gmail.com
                  </a>
                  <span className="text-gold/40 text-[8px] font-medium tracking-wider">To know more visit: aasurjya.in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Links */}
          <div className="flex gap-10">
            <a href="#" className="text-foreground/20 hover:text-gold text-[9px] font-black uppercase tracking-[0.3em] transition-colors border-b border-transparent hover:border-gold/20 pb-1">Privacy</a>
            <a href="#" className="text-foreground/20 hover:text-gold text-[9px] font-black uppercase tracking-[0.3em] transition-colors border-b border-transparent hover:border-gold/20 pb-1">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

