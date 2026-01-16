'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Highlights from '@/components/Highlights';
import Committee from '@/components/Committee';
import Footer from '@/components/Footer';
import Particles from '@/components/Particles';
import Preloader from '@/components/Preloader';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <main className="relative min-h-screen bg-navy overflow-x-hidden">
      <Preloader onComplete={() => setIsLoaded(true)} />
      
      <div className="relative">
        <Particles />
        <Navigation isVisible={isLoaded} />
        <Hero isVisible={isLoaded} />
        <About />
        <Highlights />
        <Committee />
        <Footer />
      </div>
    </main>
  );
}

