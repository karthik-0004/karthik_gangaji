export const projects = [
  {
    id: 1,
    title: "Get to Know About Hyderabad",
    shortDescription: "A real estate intelligence platform that predicts property prices using ML — for the city I call home.",
    description: "Built a full-stack system — React + Django + Google Maps API — with ML-powered buy and rental price predictions. Scraped live government land rates from IGRS Telangana using a headless Chromium scraper with auto-saving CSV pipeline.",
    tags: ["React", "Django", "Google Maps API", "Scikit-learn", "Playwright", "Python"],
    liveUrl: "https://get-to-know-about-hyderabad.vercel.app",
    githubUrl: "https://github.com/karthik-0004",
    theme: "from-cyan-400 to-blue-500"
  },
  {
    id: 2,
    title: "Video Knowledge Extraction & Semantic Search",
    shortDescription: "Turns hours of video into an intelligent, searchable knowledge base — instantly.",
    description: "Full-stack RAG platform. Transcribes video using OpenAI Whisper, generates vector embeddings, and answers natural language queries using local LLMs — making any long video as searchable as a document.",
    tags: ["React", "Django", "Whisper", "OpenAI Embeddings", "RAG", "SQLite", "Local LLMs"],
    liveUrl: "https://video-mind-key-embeddings.vercel.app",
    githubUrl: "https://github.com/karthik-0004",
    theme: "from-purple-500 to-indigo-500"
  },
  {
    id: 3,
    title: "Taskifier — Autonomous Workflow Orchestrator",
    shortDescription: "An AI agent that reads a project brief and autonomously plans, assigns, and replans work.",
    description: "Agentic AI system powered by Claude. Decomposes project briefs into granular tasks, uses a RAG pipeline for skill-aware team assignments, and autonomously replans when tasks complete — all in a React + Django REST architecture.",
    tags: ["React", "Django REST", "Claude API", "RAG", "Agentic AI", "Python"],
    liveUrl: null,
    githubUrl: "https://github.com/karthik-0004",
    theme: "from-pink-500 to-rose-500"
  },
  {
    id: 4,
    title: "20+ Python Mini Projects",
    shortDescription: "Utility tools that solve real problems — clean, version-controlled, and ready to use.",
    description: "A collection of practical tools including Python games and daily-use automation utilities, all maintained with proper GitHub version control.",
    tags: ["Python", "GitHub", "Automation"],
    liveUrl: null,
    githubUrl: "https://github.com/karthik-0004",
    links: [
      { text: "Python Games", url: "https://github.com/karthik-0004/Python-Games" },
      { text: "Daily Python Tools", url: "https://github.com/karthik-0004/Daily-use-python-tools" }
    ],
    theme: "from-emerald-400 to-teal-500"
  },
  {
    id: 5,
    title: "AI Resume Analyzer — Streamlit App",
    shortDescription: "Analyze resumes with AI-powered insights for skill gaps and profile strength.",
    description: "Built and deployed a Streamlit application that evaluates resumes, surfaces strengths, and highlights areas to improve for target roles.",
    tags: ["Python", "Streamlit", "AI/ML"],
    liveUrl: "https://ai-resume-analyzer-04.streamlit.app/",
    githubUrl: "https://github.com/karthik-0004",
    theme: "from-orange-400 to-amber-500"
  },
  {
    id: 6,
    title: "Face Recognition System — OpenCV",
    shortDescription: "A real-time computer vision system that detects and recognizes faces from live webcam feed.",
    description: "Built a real-time Face Recognition system using Python and OpenCV with support for face dataset creation, model training, and identity recognition from webcam input.",
    tags: ["Python", "OpenCV", "Computer Vision"],
    liveUrl: null,
    githubUrl: "https://github.com/karthik-0004/Face-Recognition-OpenCV-",
    theme: "from-sky-400 to-blue-400"
  }
];

export const portfolioInfo = {
  name: "Gangaji Karthikeyan",
  title: "Full-Stack Developer & AI/ML Engineer",
  location: "Hyderabad",
  school: "CMR Technical Campus",
  year: "3rd Year CS",
  cgpa: "9.25",
  email: "karthikgangaji@gmail.com",
  handle: "karthikgangaji",
  bio: [
    "I am a Computer Science student specializing in full-stack engineering and artificial intelligence. My technical expertise spans React, Django, and modern AI integrations, including RAG pipelines and local LLMs.",
    "I enjoy building products that solve real-world problems, from real estate intelligence platforms to autonomous AI orchestrators. I am also an AWS Certified developer with a strong foundation in problem-solving, having successfully solved 270+ Data Structures and Algorithms (DSA) challenges on LeetCode."
  ],
  links: {
    github: "https://github.com/karthik-0004",
    linkedin: "https://www.linkedin.com/in/karthikgangaji",
    leetcode: "https://leetcode.com/u/karthikgangaji/"
  }
};
