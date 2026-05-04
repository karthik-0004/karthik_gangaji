'use client';

import { Briefcase } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

export function Experience() {
  return (
    <section className="bg-black px-4 md:px-8 lg:px-16 py-20 md:py-32 border-t border-white/5">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-16 text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Experience</h3>
            <p className="text-gray-400 text-lg md:text-xl font-light">Professional journey and contributions</p>
          </div>

          <div className="max-w-4xl mx-auto relative pt-4">
            {/* Vertical line */}
            <div className="absolute left-[15px] md:left-[39px] top-10 bottom-0 w-[2px] bg-gradient-to-b from-[#00E8A2] via-purple-500/50 to-transparent"></div>

            {/* Experience 1: Full stack Intern At PSS Automate */}
            <div className="relative pl-12 md:pl-24 mb-12">
              {/* Glowing Dot */}
              <div className="absolute left-[9px] md:left-[33px] top-6 w-[14px] h-[14px] rounded-full bg-[#00E8A2] shadow-[0_0_15px_#00E8A2]"></div>
              
              <div className="bg-[#0a0a0a] border border-[#00E8A2]/30 rounded-2xl p-6 md:p-8 flex items-start gap-4 md:gap-6 hover:border-[#00E8A2]/60 transition-colors">
                <div className="bg-[#00E8A2]/10 p-3 rounded-xl shrink-0 hidden sm:block">
                  <Briefcase className="w-6 h-6 text-[#00E8A2]" />
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-white mb-1 tracking-tight">Full Stack Intern</h4>
                  <p className="text-[#00E8A2] text-sm md:text-base font-medium mb-4 flex items-center flex-wrap gap-2">
                    PSS Automate Private Limited <span className="text-gray-500">•</span> 3 Months (May 4th - Present)
                  </p>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
                    Developed and maintained responsive web applications using React and Django. Implemented RESTful APIs and integrated third-party services to enhance system functionality and user experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Experience 2: Data Entry & Data Cleaning Intern */}
            <div className="relative pl-12 md:pl-24">
              {/* Glowing Dot */}
              <div className="absolute left-[9px] md:left-[33px] top-6 w-[14px] h-[14px] rounded-full bg-[#00E8A2] shadow-[0_0_15px_#00E8A2]"></div>
              
              <div className="bg-[#0a0a0a] border border-[#00E8A2]/30 rounded-2xl p-6 md:p-8 flex items-start gap-4 md:gap-6 hover:border-[#00E8A2]/60 transition-colors">
                <div className="bg-[#00E8A2]/10 p-3 rounded-xl shrink-0 hidden sm:block">
                  <Briefcase className="w-6 h-6 text-[#00E8A2]" />
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-white mb-1 tracking-tight">Data Entry & Data Cleaning Intern</h4>
                  <p className="text-[#00E8A2] text-sm md:text-base font-medium mb-4 flex items-center flex-wrap gap-2">
                    Suvidha Foundation <span className="text-gray-500">•</span> Hyderabad <span className="text-gray-500">•</span> 1 Month
                  </p>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
                    Structured data entry and quality assurance on large datasets. Maintained spreadsheet databases to support accurate reporting pipelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
