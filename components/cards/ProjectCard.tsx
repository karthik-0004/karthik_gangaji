'use client';

import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  id: number;
  title: string;
  shortDescription?: string;
  description: string;
  tags?: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  links?: { text: string; url: string }[];
  theme?: string;
  index?: number;
}

export function ProjectCard({
  title,
  shortDescription,
  description,
  tags = [],
  liveUrl,
  githubUrl,
  links,
  theme = 'from-cyan-400 to-blue-500',
  index = 0
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex flex-col justify-between w-full rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
    >
      {/* Top neon gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme}`} />

      <div className="p-6 md:p-8 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-white font-bold text-xl md:text-2xl mb-4">
          {title}
        </h3>
        
        {/* Short description */}
        {shortDescription && (
          <p className="text-[#00E8A2]/90 italic text-sm md:text-base mb-6 font-light">
            {shortDescription}
          </p>
        )}

        {/* Long description */}
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 flex-1">
          {description}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full border border-[#00E8A2]/30 text-[#00E8A2] text-xs font-medium bg-[#00E8A2]/5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-auto pt-4">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00E8A2] text-[#00E8A2] hover:bg-[#00E8A2]/10 transition-colors text-sm font-semibold"
            >
              Live <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {githubUrl && !links && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-colors text-sm font-semibold"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
          )}

          {/* Render custom links if provided (e.g. for Python Mini Projects) */}
          {links && links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-colors text-sm font-semibold"
            >
              <Github className="w-4 h-4" /> {link.text}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
