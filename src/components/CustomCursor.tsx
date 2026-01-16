'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      gsap.to(cursor, {
        x: clientX,
        y: clientY,
        duration: 0.1,
        ease: 'none',
      });

      gsap.to(follower, {
        x: clientX,
        y: clientY,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const onMouseDown = () => {
      gsap.to([cursor, follower], { scale: 0.7, duration: 0.2, ease: 'power2.out' });
    };

    const onMouseUp = () => {
      gsap.to([cursor, follower], { scale: 1, duration: 0.2, ease: 'back.out(2)' });
    };

    const onElementHover = () => {
      gsap.to(follower, {
        scale: 2.2,
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderColor: 'rgba(212, 175, 55, 0.6)',
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(cursor, { scale: 0.5, opacity: 0, duration: 0.3 });
    };

    const onElementLeave = () => {
      gsap.to(follower, {
        scale: 1,
        backgroundColor: 'transparent',
        borderColor: 'rgba(212, 175, 55, 0.3)',
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Dynamic delegation for hoverables
    const updateHoverables = () => {
      const hoverables = document.querySelectorAll('a, button, .highlight-card, .committee-card, input, label');
      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', onElementHover);
        el.addEventListener('mouseleave', onElementLeave);
      });
    };

    updateHoverables();
    
    // Periodically re-check for new elements (useful for dynamic content)
    const interval = setInterval(updateHoverables, 2000);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      clearInterval(interval);
      const hoverables = document.querySelectorAll('a, button, .highlight-card, .committee-card, input, label');
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', onElementHover);
        el.removeEventListener('mouseleave', onElementLeave);
      });
    };
  }, []);

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-gold rounded-full mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-gold/30 rounded-full"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
}
