import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Lightbulb, Users, Music, Mic2, Camera, Code, Palette } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  {
    icon: Trophy,
    title: 'Competitions',
    description: 'Battle for glory across 15+ categories including technical, cultural, and sports events.',
    color: 'from-yellow-500 to-amber-600',
    img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2670&auto=format&fit=crop',
  },
  {
    icon: Code,
    title: 'Hackathon',
    description: '24-hour coding marathon with exciting problem statements and amazing prizes.',
    color: 'from-blue-500 to-cyan-600',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2670&auto=format&fit=crop',
  },
  {
    icon: Lightbulb,
    title: 'Workshops',
    description: 'Learn from industry experts in AI, Web3, Design, and more cutting-edge fields.',
    color: 'from-purple-500 to-pink-600',
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2670&auto=format&fit=crop',
  },
  {
    icon: Mic2,
    title: 'Talks',
    description: 'Inspiring keynotes from successful entrepreneurs and thought leaders.',
    color: 'from-green-500 to-emerald-600',
    img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2670&auto=format&fit=crop',
  },
  {
    icon: Music,
    title: 'Concert',
    description: 'End the day with an electrifying performance by surprise celebrity artists.',
    color: 'from-red-500 to-rose-600',
    img: 'https://images.unsplash.com/photo-1459749411177-042180ceea72?q=80&w=2670&auto=format&fit=crop',
  },
  {
    icon: Palette,
    title: 'Art Exhibition',
    description: 'Showcase your creativity or admire stunning artworks from talented peers.',
    color: 'from-orange-500 to-yellow-600',
    img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2670&auto=format&fit=crop',
  },
  {
    icon: Camera,
    title: 'Photography',
    description: 'Capture moments and compete in our photography contest with great prizes.',
    color: 'from-teal-500 to-cyan-600',
    img: 'https://images.unsplash.com/photo-1452581766285-b004c643d147?q=80&w=2670&auto=format&fit=crop',
  },
  {
    icon: Users,
    title: 'Networking',
    description: 'Connect with like-minded individuals, industry professionals, and potential mentors.',
    color: 'from-indigo-500 to-purple-600',
    img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2670&auto=format&fit=crop',
  },
];

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

