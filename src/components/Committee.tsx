'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crown, User, Linkedin, Twitter, Mail } from 'lucide-react';
import { COMMITTEE_MEMBERS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

import TextReveal from './TextReveal';

export default function Committee() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Cards animation
    const cards = gsap.utils.toArray<HTMLElement>('.committee-card');
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { 
          y: 30, 
          opacity: 0,
          scale: 0.98,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          delay: (i % 4) * 0.1,
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section
      id="committee"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4 overflow-hidden bg-[#050a14]"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={titleRef} className="flex flex-col items-center text-center mb-16 md:mb-24">
          <TextReveal className="mb-4">
            <span className="inline-block text-gold text-[10px] md:text-xs font-black tracking-[0.5em] uppercase pl-[0.5em]">
              The Visionaries
            </span>
          </TextReveal>
          <TextReveal width="100%">
            <h2 className="text-4xl md:text-7xl font-black text-gradient-gold mb-6 italic tracking-tight">
              Committee
            </h2>
          </TextReveal>
          <div className="w-12 h-1 bg-gold/20 rounded-full mb-8" />
          <p className="text-foreground/50 max-w-xl mx-auto text-sm md:text-base font-medium leading-relaxed">
            The architectural minds behind COALESCE, dedicated to engineering an unprecedented standard of excellence.
          </p>
        </div>

        {/* Committee grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {COMMITTEE_MEMBERS.map((member, index) => (
            <div
              key={member.id}
              className="committee-card group relative"
            >
              <div className="award-card rounded-[2.5rem] p-8 text-center transition-all duration-700 hover:border-gold/40 relative overflow-hidden h-full flex flex-col items-center bg-navy-light/20 backdrop-blur-sm">
                {/* Decorative glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                {/* Role Badge for Chairperson */}
                {index === 0 && (
                  <div className="absolute top-6 right-6 z-20">
                    <div className="bg-gold/10 backdrop-blur-md border border-gold/30 p-2 rounded-xl shadow-2xl">
                      <Crown className="w-4 h-4 text-gold" />
                    </div>
                  </div>
                )}

                {/* Photo Container */}
                <div className="relative w-44 h-44 mb-8 p-1.5 border border-gold/10 group-hover:border-gold/40 rounded-[2.5rem] transition-all duration-700 ease-out transform group-hover:-translate-y-2 group-hover:rotate-2 shrink-0">
                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-navy-light/50">
                    {member.photo_url ? (
                      <Image
                        src={member.photo_url}
                        alt={member.name}
                        fill
                        priority={index < 4}
                        sizes="(max-width: 640px) 200px, 200px"
                        className="object-cover transition-all duration-1000 filter grayscale md:group-hover:grayscale-0 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-gold/20" />
                      </div>
                    )}
                  </div>
                  
                  {/* Subtle corner accents */}
                  <div className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-gold/0 group-hover:border-gold/60 transition-all duration-700" />
                  <div className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-gold/0 group-hover:border-gold/60 transition-all duration-700" />
                </div>

                {/* Info */}
                <div className="space-y-2 relative z-10 mb-8 w-full">
                  <h3 className="text-2xl font-black text-foreground group-hover:text-gold transition-colors duration-500 tracking-tight line-clamp-1">
                    {member.name}
                  </h3>
                  <p className="text-[10px] font-black text-gold/60 uppercase tracking-[0.3em]">{member.role}</p>
                </div>

                {/* Social Links - Improved visibility for mobile */}
                <div className="mt-auto flex justify-center gap-3 w-full">
                  {[
                    { icon: Linkedin, href: '#' },
                    { icon: Twitter, href: '#' },
                    { icon: Mail, href: `mailto:contact@coalesce.event` }
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      className="w-11 h-11 rounded-xl bg-navy-light/50 md:bg-navy-light/30 flex items-center justify-center text-gold/40 hover:text-navy hover:bg-gold border border-gold/5 hover:border-gold transition-all duration-500 transform md:group-hover:translate-y-0 md:translate-y-2 md:opacity-0 md:group-hover:opacity-100 opacity-100 translate-y-0"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

