'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, FileText, Code2 } from 'lucide-react';
import { portfolioInfo } from '@/lib/projects';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

export function About() {
  return (
    <section className="bg-black min-h-screen px-4 md:px-8 lg:px-16 py-32 md:py-48">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          {/* Section title */}
          <h2 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-20 md:mb-32 leading-tight">
            About
          </h2>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 mb-20 md:mb-32">
            {/* Left column - Identity */}
            <div className="flex flex-col justify-start">
              <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-2 leading-tight tracking-tighter">
                Gangaji<br />Karthikeyan
              </h3>
              <p className="text-xl md:text-2xl text-gray-400 mb-8 font-medium">
                Full-Stack Developer & AI/ML Engineer
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 border border-white/20 rounded-full text-sm text-gray-300">
                  {portfolioInfo.location}
                </div>
                <div className="px-4 py-2 border border-white/20 rounded-full text-sm text-gray-300">
                  {portfolioInfo.school}
                </div>
                <div className="px-4 py-2 border border-white/20 rounded-full text-sm text-gray-300">
                  {portfolioInfo.year}
                </div>
                <div className="px-4 py-2 border border-[#00E8A2]/30 text-[#00E8A2] rounded-full text-sm font-medium">
                  {portfolioInfo.cgpa} CGPA
                </div>
              </div>
            </div>

            {/* Right column - Bio */}
            <div className="flex flex-col justify-start">
              <div className="text-lg md:text-xl text-gray-300 leading-relaxed space-y-8 font-light">
                {Array.isArray(portfolioInfo.bio) ? (
                  portfolioInfo.bio.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p>{portfolioInfo.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Massive contact display */}
          <div className="text-center py-24 md:py-32 border-t border-white/10">
            <h4 className="text-4xl sm:text-5xl md:text-7xl lg:text-[90px] font-bold text-white break-words leading-none tracking-tighter mb-12 hover:text-white/80 transition-colors cursor-pointer">
              <a href={`mailto:${portfolioInfo.email}`}>
                {portfolioInfo.email}
              </a>
            </h4>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 justify-center items-center">
              <a
                href={`mailto:${portfolioInfo.email}`}
                className="flex items-center gap-2 text-xl text-gray-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-white pb-1"
              >
                <Mail className="w-5 h-5" /> Send email
              </a>
              <a
                href={portfolioInfo.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xl text-gray-400 hover:text-[#00E8A2] transition-colors border-b-2 border-transparent hover:border-[#00E8A2] pb-1"
              >
                <Github className="w-5 h-5" /> GitHub
              </a>
              <a
                href={portfolioInfo.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xl text-gray-400 hover:text-[#00E8A2] transition-colors border-b-2 border-transparent hover:border-[#00E8A2] pb-1"
              >
                <Linkedin className="w-5 h-5" /> LinkedIn
              </a>
              <a
                href={portfolioInfo.links.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xl text-gray-400 hover:text-[#00E8A2] transition-colors border-b-2 border-transparent hover:border-[#00E8A2] pb-1"
              >
                <Code2 className="w-5 h-5" /> LeetCode
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xl text-gray-400 hover:text-[#00E8A2] transition-colors border-b-2 border-transparent hover:border-[#00E8A2] pb-1"
              >
                <FileText className="w-5 h-5" /> Resume
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
