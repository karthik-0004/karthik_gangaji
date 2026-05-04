'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/projects';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

export function Work() {
  return (
    <section className="bg-black min-h-screen px-4 md:px-8 lg:px-16 py-32 md:py-48">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-start gap-4 mb-20 md:mb-32">
            <h2 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white leading-tight">
              Work
            </h2>
            <div className="mt-4">
              <ArrowUpRight className="w-12 h-12 md:w-16 md:h-16 text-white/70" />
            </div>
          </div>

          {/* Project grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                {...project}
                index={index}
              />
            ))}
          </div>

          {/* Call to action */}
          <div className="mt-16 md:mt-24 text-center">
            <a
              href="https://github.com/karthikgangaji"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-lg hover:text-[#00E8A2] transition-colors inline-flex items-center gap-2"
            >
              View all projects on GitHub
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
