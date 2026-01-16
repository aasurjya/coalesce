import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Star, Users, Zap, Trophy } from 'lucide-react';
import { EVENT_INFO } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

import TextReveal from './TextReveal';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
      },
    });

    tl.fromTo(
      imageRef.current,
      { x: -60, opacity: 0, scale: 0.9, rotate: -2 },
      { x: 0, opacity: 1, scale: 1, rotate: 0, duration: 1.2, ease: 'power3.out' }
    )
    .fromTo(
      contentRef.current,
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      '-=1'
    )
    .fromTo(
      statsRef.current?.children || [],
      { y: 30, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)' },
      '-=0.5'
    );

    // Parallax for the decorative image
    gsap.to(imageRef.current, {
      y: -40,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  }, { scope: sectionRef });

  const stats = [
    { icon: Users, value: '1000+', label: 'Attendees' },
    { icon: Award, value: '15+', label: 'Events' },
    { icon: Star, value: '₹50K', label: 'Prizes' },
    { icon: Zap, value: '20+', label: 'Workshops' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-navy-light/20 rounded-full blur-[120px] animate-pulse" />

      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <TextReveal className="mb-4">
            <span className="inline-block text-gold text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase">
              The Legacy of Coalesce
            </span>
          </TextReveal>
          <TextReveal width="100%">
            <h2
              ref={titleRef}
              className="text-4xl md:text-6xl font-bold text-gradient-gold mb-6 md:mb-8"
            >
              Where Excellence Meets Innovation
            </h2>
          </TextReveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 md:mb-24">
          {/* Decorative Image */}
          <div ref={imageRef} className="relative aspect-[4/5] sm:aspect-video lg:aspect-square rounded-[2rem] overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent z-10 opacity-80" />
            <Image 
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2669&auto=format&fit=crop" 
              alt="Event Atmosphere" 
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
            />
            <div className="absolute bottom-8 left-8 z-20">
              <div className="award-card p-6 rounded-2xl backdrop-blur-xl border-gold/30">
                <p className="text-gold font-black text-2xl tracking-tighter mb-1">Since 2018</p>
                <p className="text-foreground/70 text-xs font-bold uppercase tracking-widest">Empowering Student Leaders</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="space-y-8 md:space-y-10">
            <div className="award-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group transition-all duration-500 hover:border-gold/40">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trophy className="w-32 h-32 text-gold -rotate-12" />
              </div>
              
              <div className="relative z-10">
                <p className="text-lg md:text-xl text-foreground/90 font-medium leading-relaxed mb-8">
                  {EVENT_INFO.description}
                </p>
                <div className="flex flex-col gap-8">
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold to-transparent rounded-full" />
                    <p className="text-foreground/60 leading-relaxed text-base md:text-lg italic font-medium">
                      &quot;COALESCE isn&apos;t just an event; it&apos;s a movement that brings together the brightest minds to define the future of technology and culture.&quot;
                    </p>
                  </div>
                  <p className="text-foreground/70 leading-relaxed text-sm md:text-base font-medium">
                    Join us at <span className="text-gold font-bold underline decoration-gold/30 underline-offset-4">{EVENT_INFO.venue}</span> for
                    an immersive experience that blends competitive spirit with professional networking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="award-card rounded-[2rem] p-6 md:p-10 text-center group hover:scale-105 transition-all duration-500 hover:border-gold/50 cursor-default relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gold/10 mb-6 group-hover:bg-gold/20 transition-all duration-500 group-hover:rotate-6 relative z-10">
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-gold" />
              </div>
              <div className="text-3xl md:text-5xl font-black text-gradient-gold mb-2 relative z-10 tabular-nums">
                {stat.value}
              </div>
              <div className="text-foreground/40 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase relative z-10">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

