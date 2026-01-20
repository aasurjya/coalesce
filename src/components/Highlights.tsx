import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Lightbulb, Users, Music, Mic2, Camera, Code, Palette, Sparkles, Zap, Smile, Radio, Gift } from 'lucide-react';
import { EVENT_HIGHLIGHTS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  Trophy,
  Lightbulb,
  Users,
  Music,
  Mic2,
  Camera,
  Code,
  Palette,
  Sparkles,
  Zap,
  Smile,
  Radio,
  Gift,
};

const highlights = EVENT_HIGHLIGHTS.map((highlight) => ({
  icon: iconMap[highlight.icon as keyof typeof iconMap] || Music,
  title: highlight.title,
  description: highlight.description,
  color: 'from-gold to-yellow-600',
  img: highlight.img || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop',
}));

import TextReveal from './TextReveal';

export default function Highlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Cards animation
    const cards = gsap.utils.toArray<HTMLElement>('.highlight-card');
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { 
          y: 60, 
          opacity: 0, 
          rotateX: -15,
          scale: 0.95 
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',
            toggleActions: 'play none none reverse',
          },
          delay: (i % 4) * 0.1,
        }
      );
    });

    // Hover effect on cards
    cards.forEach((card) => {
      const img = card.querySelector('.card-bg-img');
      const icon = card.querySelector('.icon-container');
      
      card.addEventListener('mouseenter', () => {
        gsap.to(img, { scale: 1.1, duration: 0.6, ease: 'power2.out' });
        gsap.to(icon, { y: -5, scale: 1.05, duration: 0.3, ease: 'back.out(2)' });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.out' });
        gsap.to(icon, { y: 0, scale: 1, duration: 0.3, ease: 'back.out(2)' });
      });
    });
  }, { scope: sectionRef });

  return (
    <section
      id="highlights"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 gradient-dark opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-gold/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={titleRef} className="flex flex-col items-center text-center mb-16 md:mb-20">
          <TextReveal className="mb-4">
            <span className="inline-block text-gold text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase">
              Curated Experiences
            </span>
          </TextReveal>
          <TextReveal width="100%">
            <h2 className="text-4xl md:text-6xl font-bold text-gradient-gold mb-6 md:mb-8">
              Event Highlights
            </h2>
          </TextReveal>
          <p className="text-foreground/60 max-w-2xl mx-auto text-base md:text-lg px-4">
            Immerse yourself in a diverse array of events designed to challenge, inspire, and entertain.
          </p>
        </div>

        {/* Highlights grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 perspective-1000"
        >
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="highlight-card group relative h-[380px] md:h-[420px] rounded-3xl overflow-hidden award-card border-gold/10 hover:border-gold/30 transition-colors duration-500 cursor-pointer"
            >
              {/* Background Image */}
              <div className="card-bg-img absolute inset-0 z-0 transition-transform duration-700">
                <Image
                  src={highlight.img}
                  alt={highlight.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent z-1" />
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-1" />

              {/* Content */}
              <div className="relative z-10 h-full p-6 md:p-8 flex flex-col justify-end">
                {/* Icon */}
                <div
                  className={`icon-container inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${highlight.color} mb-4 md:mb-6 shadow-xl relative overflow-hidden group/icon transition-transform duration-500 group-hover:scale-110`}
                >
                  <highlight.icon className="w-5 h-5 md:w-6 md:h-6 text-white relative z-10" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/icon:translate-y-0 transition-transform duration-300" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4 group-hover:text-gold transition-colors">
                  {highlight.title}
                </h3>
                <p className="text-foreground/70 text-xs md:text-sm leading-relaxed mb-4 line-clamp-3">
                  {highlight.description}
                </p>

                <div className="flex items-center gap-2 text-gold text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span>Explore</span>
                  <div className="h-px w-6 md:w-8 bg-gold" />
                </div>
              </div>

              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 h-1 bg-gold w-0 group-hover:w-full transition-all duration-700 ease-in-out" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

