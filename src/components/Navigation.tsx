'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Menu, X, Trophy } from 'lucide-react';

import Magnetic from './Magnetic';

export default function Navigation({ isVisible }: { isVisible: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!isVisible) return;

    const tl = gsap.timeline();
    
    tl.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    );

    if (linksRef.current) {
      tl.fromTo(
        linksRef.current.children,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        '-=0.5'
      );
    }
  }, { scope: navRef, dependencies: [isVisible] });

  useGSAP(() => {
    if (menuRef.current) {
      if (isOpen) {
        gsap.fromTo(
          menuRef.current,
          { opacity: 0, scaleY: 0, transformOrigin: 'top' },
          { opacity: 1, scaleY: 1, duration: 0.4, ease: 'power3.out' }
        );
        
        const mobileLinks = menuRef.current.querySelectorAll('a');
        gsap.fromTo(
          mobileLinks,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, delay: 0.2 }
        );
      }
    }
  }, [isOpen]);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#highlights', label: 'Highlights' },
    { href: '#committee', label: 'Committee' },
    { href: '/register', label: 'Register', isButton: true },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth',
        });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-gold/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group relative overflow-hidden">
            <div className="relative">
              <Trophy className="w-8 h-8 text-gold trophy-icon transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-gold/20 blur-md rounded-full scale-0 group-hover:scale-150 transition-transform duration-500" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gradient-gold">COALESCE</span>
          </Link>

          {/* Desktop Navigation */}
          <div ref={linksRef} className="hidden md:flex items-center gap-10">
            {navLinks.map((link) =>
              link.isButton ? (
                <Magnetic key={link.href} strength={0.3}>
                  <Link
                    href={link.href}
                    className="group relative px-8 py-2.5 rounded-full bg-gold text-navy text-sm font-black tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] overflow-hidden"
                  >
                    <span className="relative z-10">{link.label}</span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Link>
                </Magnetic>
              ) : (
                <Magnetic key={link.href} strength={0.2}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="relative text-foreground/40 hover:text-gold transition-all duration-500 text-[10px] font-black uppercase tracking-[0.3em] group/link"
                  >
                    {link.label}
                    <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-gold transition-all duration-500 group-hover/link:w-full" />
                  </Link>
                </Magnetic>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground/70 hover:text-gold transition-all duration-300 hover:bg-gold/5 rounded-lg"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          ref={menuRef}
          className="md:hidden fixed top-20 left-0 right-0 bottom-0 bg-background/95 backdrop-blur-2xl border-t border-gold/10 z-40"
        >
          <div className="flex flex-col items-center justify-between h-full py-20 px-4">
            <div className="flex flex-col items-center space-y-8 w-full">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-2xl font-bold tracking-widest uppercase transition-all duration-300 ${
                    link.isButton
                      ? 'btn-gold px-12 py-4 rounded-full w-full max-w-xs text-center shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                      : 'text-foreground/70 hover:text-gold'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Developer Credit in Mobile Menu */}
            <div className="flex flex-col items-center gap-4 pt-10 border-t border-gold/5 w-full max-w-xs">
              <div className="flex flex-col items-center gap-1.5 opacity-40">
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-gold/60">Digital Architecture</span>
                <div className="flex flex-col items-center">
                  <a 
                    href="https://aasurjya.in" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-black uppercase tracking-[0.2em] text-gold"
                  >
                    Aasurjya
                  </a>
                  <a 
                    href="mailto:corp.surjya@gmail.com" 
                    className="text-[9px] text-gold/40 lowercase tracking-normal italic mt-1"
                  >
                    corp.surjya@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

