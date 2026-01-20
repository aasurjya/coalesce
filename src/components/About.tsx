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
              Where Everyone Comes Together
            </h2>
          </TextReveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 md:mb-24">
          {/* Decorative Image */}
          <div ref={imageRef} className="relative aspect-[4/5] sm:aspect-video lg:aspect-square rounded-[3rem] overflow-hidden group shadow-2xl border border-gold/10">
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent z-10 opacity-90" />
            <Image 
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2669&auto=format&fit=crop" 
              alt="Event Atmosphere" 
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            {/* Corner Accents */}
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-gold/20 rounded-br-2xl group-hover:border-gold/60 transition-colors duration-700" />
          </div>

          {/* Content */}
          <div ref={contentRef} className="space-y-8 md:space-y-10">
            <div className="award-card rounded-[3rem] p-10 md:p-14 relative overflow-hidden group transition-all duration-700 hover:border-gold/40 shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-15 transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110">
                <Trophy className="w-48 h-48 text-gold" />
              </div>
              
              <div className="relative z-10">
                <div className="space-y-6 mb-10">
                  <p className="text-lg md:text-xl text-foreground/90 font-medium leading-relaxed tracking-tight">
                    Coalesce 1.0 isn&apos;t just an event, it&apos;s a movement that brings us together to create memories, showcase our talents, to feel the urge of freedom from all that academic pressure.
                  </p>
                  <p className="text-lg md:text-xl text-foreground/90 font-medium leading-relaxed tracking-tight">
                    Register to have fun, to preserve a memory with us.
                  </p>
                </div>
                <div className="flex flex-col gap-10">
                  <div className="flex items-center gap-4 group/venue cursor-default">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20 group-hover/venue:bg-gold group-hover/venue:text-navy transition-all duration-500">
                      <Zap className="w-6 h-6" />
                    </div>
                    <p className="text-foreground/80 leading-relaxed text-sm md:text-lg font-bold tracking-tight">
                      Join us at <span className="text-gold group-hover/venue:underline decoration-gold/30 underline-offset-8 transition-all">{EVENT_INFO.venue}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tagline Section */}
        <div className="text-center mt-20 md:mt-24">
          <p className="text-xl md:text-3xl lg:text-4xl font-bold text-gradient-gold tracking-tight leading-relaxed">
            Perform. Impress. Grab Mr Coalesce and Miss Coalesce
          </p>
        </div>
      </div>
    </section>
  );
}

