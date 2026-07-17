'use client';

import { portfolioInfo } from '@/lib/projects';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const footerSections = {
  pages: [
    { label: 'Home', href: '#' },
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
  ] as FooterLink[],
  social: [
    { label: 'GitHub', href: portfolioInfo.links.github, external: true },
    { label: 'LinkedIn', href: portfolioInfo.links.linkedin, external: true },
    { label: 'LeetCode', href: portfolioInfo.links.leetcode, external: true },
  ] as FooterLink[],
  resources: [
    { label: 'Resume', href: '/resume.pdf', external: true },
    { label: 'Email', href: `mailto:${portfolioInfo.email}`, external: false },
  ] as FooterLink[],
};

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-transparent border-t border-white/10 px-4 md:px-8 lg:px-16 py-20 md:py-32">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          {/* Main footer grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-20 md:mb-32">
            {/* Column 1: Name & Title */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                About
              </h3>
              <p className="text-white font-semibold text-sm md:text-base">
                {portfolioInfo.name}
              </p>
              <p className="text-gray-400 text-xs md:text-sm mt-1">
                {portfolioInfo.title}
              </p>
            </div>

            {/* Column 2: Pages */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                Pages
              </h3>
              <ul className="space-y-2">
                {footerSections.pages.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => {
                        const sectionId = link.href.replace('#', '');
                        if (sectionId) scrollToSection(sectionId);
                        else window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-gray-300 hover:text-white text-xs md:text-sm transition-colors relative group"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Social */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                Social
              </h3>
              <ul className="space-y-2">
                {footerSections.social.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-gray-300 hover:text-white text-xs md:text-sm transition-colors relative group inline-flex items-center gap-2"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Resources */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                {footerSections.resources.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-gray-300 hover:text-white text-xs md:text-sm transition-colors relative group inline-flex items-center gap-2"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom info */}
          <div className="flex flex-col md:flex-row items-center justify-between text-xs md:text-sm text-gray-500 pt-8 border-t border-white/10">
            <p>© 2024 {portfolioInfo.name}. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Designed & built by hand</p>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
}
