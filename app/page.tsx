import { Hero } from '@/components/sections/Hero';
import { Experience } from '@/components/sections/Experience';
import { Work } from '@/components/sections/Work';
import { Skills } from '@/components/sections/Skills';
import { About } from '@/components/sections/About';
import { Footer } from '@/components/sections/Footer';
import { BottomNav } from '@/components/layout/BottomNav';

export default function Home() {
  return (
    <main className="bg-black overflow-x-hidden">
      <BottomNav />
      
      <div id="home">
        <Hero />
      </div>

      <div id="experience">
        <Experience />
      </div>

      <div id="work">
        <Work />
      </div>

      <div id="skills">
        <Skills />
      </div>

      <div id="about">
        <About />
      </div>

      <Footer />
    </main>
  );
}
