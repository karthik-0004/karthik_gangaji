'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { 
  Database, 
  Server, 
  Brain, 
  Network, 
  Workflow, 
  BookOpen, 
  Search, 
  Bot, 
  Terminal, 
  Compass, 
  Key, 
  Activity, 
  FileSpreadsheet, 
  Package, 
  Cpu
} from 'lucide-react';

const brandIcons: Record<string, string> = {
  "Python": "python",
  "JavaScript": "javascript",
  "React.js": "react",
  "HTML5": "html5",
  "Bootstrap": "bootstrap",
  "Tailwind": "tailwindcss",
  "Django": "django",
  "Flask": "flask",
  "Node.js": "nodedotjs",
  "Streamlit": "streamlit",
  "MySQL": "mysql",
  "PostgreSQL": "postgresql",
  "SQLite": "sqlite",
  "Scikit-learn": "scikitlearn",
  "NumPy": "numpy",
  "Pandas": "pandas",
  "SciPy": "scipy",
  "GitHub": "github",
  "Vercel": "vercel",
  "FFmpeg": "ffmpeg",
  "Google Maps API": "googlemaps"
};

const localLogos: Record<string, string> = {
  "Java": "/logos/java.svg",
  "CSS3": "/logos/css3.svg",
  "AWS Cloud Practitioner": "/logos/aws.svg",
  "EC2": "/logos/ec2.svg",
  "S3": "/logos/s3.svg",
  "OpenAI Embeddings": "/logos/openai.svg",
  "Whisper": "/logos/openai.svg",
  "Power BI": "/logos/powerbi.svg",
  "Tableau": "/logos/tableau.svg",
  "MS Excel": "/logos/excel.svg",
  "Chromium": "/logos/chromium.svg",
  "Matplotlib": "/logos/matplotlib.svg",
  "Seaborn": "/logos/seaborn.svg"
};

const lucideIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "SQL": Database,
  "REST APIs": Server,
  "Machine Learning": Brain,
  "Deep Learning": Network,
  "Supervised Learning": Workflow,
  "Unsupervised Learning": Workflow,
  "RAG": BookOpen,
  "Semantic Search": Search,
  "Local LLMs": Bot,
  "Prompt Engineering": Terminal,
  "Vector Search": Compass,
  "IAM": Key,
  "VPC": Network,
  "CloudWatch": Activity,
  "CSV": FileSpreadsheet,
  "Pickle": Package,
  "Joblib": Cpu
};

interface SkillIconProps {
  name: string;
}

function SkillIcon({ name }: SkillIconProps) {
  const localSrc = localLogos[name];
  if (localSrc) {
    return (
      <img 
        src={localSrc} 
        alt={name} 
        className="w-5 h-5 object-contain transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
    );
  }

  const slug = brandIcons[name];
  if (slug) {
    const colorParam = slug === 'github' || slug === 'vercel' ? '/fff' : '';
    const src = `https://cdn.simpleicons.org/${slug}${colorParam}`;
    return (
      <img 
        src={src} 
        alt={name} 
        className="w-5 h-5 object-contain transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
    );
  }

  const IconComponent = lucideIcons[name];
  if (IconComponent) {
    return <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-[#00E8A2] transition-all duration-300 group-hover:scale-110" />;
  }

  return <Terminal className="w-5 h-5 text-gray-400 group-hover:text-[#00E8A2] transition-all duration-300 group-hover:scale-110" />;
}

const skillsData = [
  {
    category: "Languages",
    items: ["Python", "JavaScript", "Java", "SQL"],
    fullWidth: false
  },
  {
    category: "Frontend",
    items: ["React.js", "HTML5", "CSS3", "Bootstrap", "Tailwind"],
    fullWidth: false
  },
  {
    category: "Backend",
    items: ["Django", "Flask", "Node.js", "Streamlit", "REST APIs"],
    fullWidth: false
  },
  {
    category: "Database",
    items: ["MySQL", "PostgreSQL", "SQLite", "SQL"],
    fullWidth: false
  },
  {
    category: "AI / ML",
    items: [
      "Machine Learning", 
      "Deep Learning", 
      "Supervised Learning", 
      "Unsupervised Learning", 
      "RAG", 
      "OpenAI Embeddings", 
      "Whisper", 
      "Semantic Search", 
      "Local LLMs", 
      "Scikit-learn", 
      "Prompt Engineering", 
      "Vector Search", 
      "NumPy", 
      "Pandas", 
      "Matplotlib", 
      "Seaborn", 
      "SciPy"
    ],
    fullWidth: true
  },
  {
    category: "Cloud",
    items: ["AWS Cloud Practitioner", "EC2", "S3", "IAM", "VPC", "CloudWatch"],
    fullWidth: false
  },
  {
    category: "Tools",
    items: ["GitHub", "Vercel", "Chromium", "FFmpeg", "Power BI", "Tableau", "MS Excel", "CSV", "Pickle", "Joblib", "Google Maps API"],
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
                      className="flex items-center gap-2.5 px-4 py-2 border border-white/10 hover:border-[#00E8A2]/50 bg-white/[0.02] hover:bg-white/[0.06] rounded-xl text-sm md:text-base text-gray-300 transition-all duration-300 ease-out hover:scale-[1.03] cursor-default"
                    >
                      <SkillIcon name={item} />
                      <span>{item}</span>
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
