'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

const skillsData = [
  {
    category: "Languages",
    items: ["Python", "JavaScript", "Java", "SQL"],
    fullWidth: false
  },
  {
    category: "Frontend",
    items: ["React.js", "AngularJS", "HTML5", "CSS3", "Bootstrap", "Tailwind"],
    fullWidth: false
  },
  {
    category: "Backend",
    items: ["Django", "Flask", "Node.js", "Streamlit", "REST APIs", "APScheduler"],
    fullWidth: false
  },
  {
    category: "Database",
    items: ["MySQL", "PostgreSQL", "SQLite", "SQL", "NoSQL"],
    fullWidth: false
  },
  {
    category: "AI / ML",
    items: ["Machine Learning", "Deep Learning", "Feature Learning", "Supervised Learning", "Unsupervised Learning", "Model Fine-Tuning", "RAG", "OpenAI Embeddings", "Whisper", "Semantic Search", "Local LLMs", "Scikit-learn", "Agentic AI", "Prompt Engineering", "LLM Orchestration", "Vector Search", "NumPy", "Pandas", "Matplotlib", "Seaborn", "SciPy"],
    fullWidth: true
  },
  {
    category: "Cloud",
    items: ["AWS Cloud Practitioner", "EC2", "S3", "IAM", "VPC", "CloudWatch"],
    fullWidth: false
  },
  {
    category: "Tools",
    items: ["GitHub", "Vercel", "Chromium", "FFmpeg", "Power BI", "Tableau", "MS Excel", "CSV", "Pickle", "Joblib", "Google Maps API", "Playwright"],
    fullWidth: false
  }
];

export function Skills() {
  return (
    <section className="bg-transparent min-h-screen px-4 md:px-8 lg:px-16 py-32 md:py-48">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          {/* Section Label */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-gray-400 font-mono text-sm tracking-widest uppercase">03 - Stack</span>
            <div className="w-2 h-2 rounded-full bg-[#00E8A2]" />
          </div>

          <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 leading-tight">
            Skills & Technologies
          </h2>
          <p className="text-gray-400 text-xl md:text-2xl font-light mb-20 md:mb-32">
            The tools I build with
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {skillsData.map((skillGroup) => (
              <div 
                key={skillGroup.category} 
                className={`bg-[#080808] border border-white/10 rounded-2xl p-6 md:p-8 ${skillGroup.fullWidth ? 'md:col-span-2' : ''}`}
              >
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-[#00E8A2]">
                    {skillGroup.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skillGroup.items.map((item) => (
                    <span 
                      key={item} 
                      className="px-4 py-2 border border-white/20 rounded-full text-sm md:text-base text-gray-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
