import { KAI_DATA } from './kaiData';

export interface ChatMessage {
  sender: 'user' | 'kai';
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

// Intent Categories
type Intent =
  | 'unrelated'
  | 'education'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'technologies'
  | 'resume'
  | 'contact'
  | 'achievements'
  | 'internship'
  | 'certifications'
  | 'portfolio'
  | 'availability'
  | 'docker'
  | 'kubernetes'
  | 'cgpa'
  | 'videomind'
  | 'taskifier'
  | 'hyderabad'
  | 'placement_portal'
  | 'python_projects'
  | 'microservices'
  | 'ai_projects'
  | 'devops_projects'
  | 'react_projects'
  | 'best_project';

export function getKaiResponse(userMessage: string): { response: string; suggestions: string[] } {
  const query = userMessage.toLowerCase().trim();

  // 1. Guardrail for general-purpose chatbot / unrelated topics
  const isGreeting = /^(hello|hi|hey|greetings|good morning|good afternoon|good evening|yo)\b/i.test(query);
  
  // List of forbidden patterns that suggest general LLM usage
  const forbiddenPatterns = [
    /write a/i, /create a/i, /solve/i, /calculate/i, /code/i, /interview question/i, /fizzbuzz/i,
    /joke/i, /weather/i, /news/i, /math/i, /science/i, /history/i, /politics/i, /president/i,
    /capital of/i, /how to make/i, /how do i/i, /recipe/i, /health/i, /medical/i, /translate/i
  ];

  const matchesForbidden = forbiddenPatterns.some((pattern) => pattern.test(query));
  
  // Determine Intent
  let intent: Intent = 'unrelated';

  if (isGreeting) {
    return {
      response: "Hello! I'm KAI, Gangaji Karthikeyan's Portfolio Assistant. How can I help you today?",
      suggestions: [
        "What is his CGPA?",
        "Does he know Docker?",
        "Tell me about VideoMind",
        "What projects has he done?"
      ]
    };
  }

  // Check specific high-priority keywords
  if (query.includes('docker') || query.includes('containerization')) {
    intent = 'docker';
  } else if (query.includes('kubernetes') || query.includes('k8s')) {
    intent = 'kubernetes';
  } else if (query.includes('cgpa') || query.includes('gpa') || query.includes('academic score') || query.includes('marks') || query.includes('percentage')) {
    intent = 'cgpa';
  } else if (query.includes('videomind')) {
    intent = 'videomind';
  } else if (query.includes('taskifier')) {
    intent = 'taskifier';
  } else if (query.includes('hyderabad') || query.includes('get to know about hyderabad')) {
    intent = 'hyderabad';
  } else if (query.includes('placement management') || query.includes('placement portal')) {
    intent = 'placement_portal';
  } else if (query.includes('python mini projects') || query.includes('mini projects') || query.includes('20+ python')) {
    intent = 'python_projects';
  } else if (query.includes('microservice') || query.includes('microservices')) {
    intent = 'microservices';
  } else if (query.includes('ai project') || query.includes('artificial intelligence') || query.includes('machine learning project') || query.includes('ml project') || query.includes('rag') || query.includes('semantic search') || query.includes('whisper')) {
    intent = 'ai_projects';
  } else if (query.includes('devops project') || query.includes('cicd') || query.includes('ci/cd') || query.includes('jenkins') || query.includes('prometheus') || query.includes('grafana')) {
    intent = 'devops_projects';
  } else if (query.includes('react project') || query.includes('next.js project') || query.includes('frontend project')) {
    intent = 'react_projects';
  } else if (query.includes('best project') || query.includes('favorite project') || query.includes('top project')) {
    intent = 'best_project';
  } else if (query.includes('education') || query.includes('college') || query.includes('degree') || query.includes('study') || query.includes('studied') || query.includes('school') || query.includes('intermediate')) {
    intent = 'education';
  } else if (query.includes('experience') || query.includes('work') || query.includes('job') || (query.includes('placement') && !query.includes('portal') && !query.includes('management'))) {
    intent = 'experience';
  } else if (query.includes('internship') || query.includes('intern') || query.includes('pss automate') || query.includes('suvidha')) {
    intent = 'internship';
  } else if (query.includes('project') || query.includes('projet') || query.includes('projec') || query.includes('build') || query.includes('built')) {
    intent = 'projects';
  } else if (query.includes('skills') || query.includes('languages') || query.includes('programming') || query.includes('know python') || query.includes('know java') || query.includes('know sql') || query.includes('know react') || query.includes('know django')) {
    intent = 'skills';
  } else if (query.includes('technologies') || query.includes('stack') || query.includes('tools') || query.includes('frameworks')) {
    intent = 'technologies';
  } else if (query.includes('resume') || query.includes('cv') || query.includes('pdf')) {
    intent = 'resume';
  } else if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('mobile') || query.includes('call') || query.includes('reach')) {
    intent = 'contact';
  } else if (query.includes('achievements') || query.includes('solved') || query.includes('leetcode') || query.includes('codechef') || query.includes('nss') || query.includes('volunteer')) {
    intent = 'achievements';
  } else if (query.includes('certifications') || query.includes('certification') || query.includes('certificate')) {
    intent = 'certifications';
  } else if (query.includes('availability') || query.includes('available') || query.includes('hiring') || query.includes('hire') || query.includes('opportunity')) {
    intent = 'availability';
  } else if (query.includes('portfolio') || query.includes('website') || query.includes('url')) {
    intent = 'portfolio';
  }

  // Reject forbidden topics or classified as unrelated
  if (matchesForbidden || intent === 'unrelated') {
    return {
      response: `I'm KAI, Gangaji Karthikeyan's Portfolio Assistant.

I can answer questions regarding:
• Skills
• Projects
• Experience
• Education
• Internship
• Technologies
• Resume

Feel free to ask anything related to the portfolio.`,
      suggestions: [
        "What projects has he done?",
        "What is his CGPA?",
        "Tell me about his experience",
        "How can I contact him?"
      ]
    };
  }

  // 2. Response routing based on matched intent
  switch (intent) {
    case 'docker':
      return {
        response: `Yes.

Gangaji has hands-on experience with Docker and Kubernetes.

During his Full Stack Developer Internship he worked with Dockerized microservices for enterprise applications.

He also used Docker, GitHub Actions, Kubernetes, Prometheus and Grafana in his Placement Management Portal project.

Would you like to know about his DevOps projects?`,
        suggestions: ["Tell me about Placement Management Portal", "What are his DevOps skills?"]
      };

    case 'kubernetes':
      return {
        response: `Yes.

Gangaji has experience with Kubernetes.

It has been used in:
• Placement Management Portal
• Enterprise Internship

Related Technologies:
Docker, GitHub Actions, Prometheus, Grafana.

Would you like to know about his DevOps projects?`,
        suggestions: ["Tell me about Placement Management Portal", "What are his DevOps skills?"]
      };

    case 'cgpa':
      return {
        response: `Gangaji is currently pursuing B.Tech in Computer Science and Information Technology at CMR Technical Campus.

Current CGPA:
9.12

Expected Graduation:
2027`,
        suggestions: ["Tell me about his intermediate education", "What is his branch?"]
      };

    case 'videomind':
      return {
        response: `VideoMind (2024) is one of Gangaji's AI projects. It converts long videos into searchable knowledge bases.

Key features:
• Speech-to-text transcription via OpenAI Whisper
• Local LLMs and Vector embeddings for RAG
• Semantic search and semantic question answering

Technologies: React, Django, SQLite, OpenAI Whisper, OpenAI Embeddings, RAG.`,
        suggestions: ["Does he have other AI projects?", "What technologies were used in VideoMind?"]
      };

    case 'taskifier':
      return {
        response: `Taskifier (2025) is an Agentic AI project built by Gangaji. It is an autonomous workflow orchestration platform.

Key features:
• Autonomous planning and project decomposition
• Skill-aware task assignment
• Automatic plan adjustment/replanning

Technologies: React, Django REST, Claude, RAG.`,
        suggestions: ["Does he have other AI projects?", "What are his AI/ML skills?"]
      };

    case 'hyderabad':
      return {
        response: `Get to Know About Hyderabad (2024) is a real estate intelligence platform built by Gangaji.

Key features:
• Machine learning property price predictions
• Localities exploration via Google Maps integration
• Automated land rate scraping
• Dynamic CSV reporting

Technologies: React, Django, Google Maps API, Scikit-learn, Chromium, CSV.`,
        suggestions: ["What ML tools does he know?", "Tell me about his other projects"]
      };

    case 'placement_portal':
      return {
        response: `Placement Management Portal (2025) is a campus recruitment management system built by Gangaji.

Key features:
• Complete campus recruitment workflow support
• CI/CD pipeline integrated using GitHub Actions and Jenkins
• Containerized deployment using Docker and Kubernetes
• Live performance monitoring with Prometheus and Grafana

Technologies: React, Django REST, Docker, Kubernetes, GitHub Actions, Jenkins, Prometheus, Grafana.`,
        suggestions: ["Does he know Docker?", "What are his DevOps skills?"]
      };

    case 'python_projects':
      return {
        response: `Gangaji built a collection of 20+ Python Mini Projects during 2023-2024 to automate everyday tasks.

Examples include:
• PDF Merger tool
• QR Code Generator
• Image Resizer utility
• Various automation scripts

Technologies: Python, Git, GitHub.`,
        suggestions: ["What programming languages does he know?", "Show AI projects"]
      };

    case 'microservices':
      return {
        response: `Yes.

During his internship at PSS Automate Pvt Ltd,

Gangaji worked on enterprise-grade React and FastAPI applications built using a multi-tenant microservice architecture.

He also worked with Dockerized services and REST API testing using Swagger UI.`,
        suggestions: ["Tell me about his internship responsibilities", "Does he know Docker?"]
      };

    case 'ai_projects':
      return {
        response: `Gangaji has worked on several AI and Machine Learning projects:

• VideoMind: Converts videos into searchable knowledge bases using Whisper, embeddings, and RAG.
• Taskifier: An autonomous planning agent platform built using React, Django REST, and Claude.
• Get to Know About Hyderabad: Real estate price prediction using Scikit-Learn ML.

Would you like to know more about VideoMind or Taskifier?`,
        suggestions: ["Tell me about VideoMind", "Tell me about Taskifier", "What are his AI/ML skills?"]
      };

    case 'devops_projects':
      return {
        response: `Gangaji's primary DevOps project is the Placement Management Portal.

It features a complete campus recruitment system with containerized deployment using Docker and Kubernetes, monitored using Prometheus and Grafana, and built with CI/CD pipelines via GitHub Actions and Jenkins.

Would you like to explore this project in detail?`,
        suggestions: ["Tell me about Placement Management Portal", "What are his DevOps skills?"]
      };

    case 'react_projects':
      return {
        response: `Yes, Gangaji has built multiple React.js projects:

• Placement Management Portal (React frontend)
• VideoMind (React frontend)
• Taskifier (React frontend)
• Get to Know About Hyderabad (React frontend)

Would you like to know about his frontend skills?`,
        suggestions: ["What are his frontend skills?", "What backend frameworks does he use?"]
      };

    case 'best_project':
      return {
        response: `There isn't a single "best" project.

Depending on your interest:

• AI: VideoMind
• Machine Learning: Get to Know About Hyderabad
• DevOps: Placement Management Portal
• Autonomous AI: Taskifier

Which area would you like to explore?`,
        suggestions: ["Tell me about VideoMind", "Tell me about Placement Management Portal", "Tell me about Taskifier"]
      };

    case 'education':
      return {
        response: `Gangaji's educational background:

1. Bachelor of Technology (2023 - 2027)
• Institution: CMR Technical Campus, Hyderabad
• Branch: Computer Science and Information Technology
• Current CGPA: 9.12

2. Intermediate MPC (2021 - 2023)
• Institution: Sri Chaitanya College, Hyderabad
• Percentage: 92%`,
        suggestions: ["What is his branch?", "What programming languages did he learn?"]
      };

    case 'experience':
    case 'internship':
      return {
        response: `Gangaji has completed the following internships:

1. Full Stack Developer Intern (May 2026 - Present)
• Company: PSS Automate Private Limited
• Responsibilities: Enterprise React & FastAPI microservices, Docker container management, Swagger REST API validation.

2. Data Entry & Cleaning Intern (1 Month)
• Company: Suvidha Foundation
• Responsibilities: Structured data entry, spreadsheets, database organization.`,
        suggestions: ["Tell me about PSS Automate internship", "Does he know microservices?"]
      };

    case 'projects':
      return {
        response: `Gangaji has developed several projects:

• VideoMind: AI-powered video knowledge base (Whisper, RAG, Embeddings).
• Taskifier: Autonomous workflow orchestrator (Claude, React, Django REST).
• Placement Management Portal: Campus hiring tool (Docker, Kubernetes, CI/CD).
• Get to Know About Hyderabad: Real estate explorer (Django, ML, Google Maps API).

Which project would you like to hear about?`,
        suggestions: ["Tell me about VideoMind", "Tell me about Taskifier", "Tell me about Placement Management Portal"]
      };

    case 'skills':
      return {
        response: `Gangaji's core technical skills include:

• Programming: Python, Java, SQL
• Frontend: React.js, HTML5, CSS3
• Backend: Django, FastAPI, Flask, Node.js
• Databases: MySQL, SQLite, NoSQL
• DevOps: Docker, Kubernetes, Git, GitHub Actions, Prometheus, Grafana
• AI/ML: RAG, Semantic Search, Whisper, Local LLMs, Scikit-learn`,
        suggestions: ["Does he know Kubernetes?", "Does he know Python?", "What ML tools does he know?"]
      };

    case 'technologies':
      return {
        response: `Gangaji uses a modern stack including:

• Languages: Python, Java, SQL
• Frameworks: React, Django REST, FastAPI, Streamlit
• Cloud & DevOps: Docker, Kubernetes, GitHub Actions, AWS, Nginx
• AI Tools: OpenAI Whisper, OpenAI Embeddings, Claude, Local LLMs`,
        suggestions: ["Does he know Docker?", "What are his AI/ML skills?"]
      };

    case 'resume':
      return {
        response: `Gangaji's resume details his B.Tech education (9.12 CGPA), Full Stack internship at PSS Automate, and projects like VideoMind, Taskifier, and Placement Management Portal.

You can view his GitHub (github.com/karthik-0004) and LinkedIn profile (linkedin.com/in/karthikgangaji) for code repositories and credentials.`,
        suggestions: ["What is his contact info?", "What is his CGPA?"]
      };

    case 'contact':
      return {
        response: `You can reach out to Gangaji Karthikeyan directly:

• Email: karthikgangaji@gmail.com
• Phone: +91 98661 70506
• Location: Hyderabad, India
• GitHub: github.com/karthik-0004
• LinkedIn: linkedin.com/in/karthikgangaji`,
        suggestions: ["Is he looking for opportunities?", "Tell me about his internship"]
      };

    case 'achievements':
    case 'certifications':
      return {
        response: `Gangaji's key achievements include:

• Solved 450+ Data Structures & Algorithms problems on LeetCode and CodeChef
• Active NSS Volunteer supporting community welfare
• Lexis Club Member promoting academic growth

Would you like to know about his projects or skills?`,
        suggestions: ["What projects has he done?", "What is his CGPA?"]
      };

    case 'availability':
      return {
        response: `Gangaji is currently available for Full Stack, DevOps, or AI/ML Developer internships and full-time opportunities.

Would you like to see his contact details?`,
        suggestions: ["How can I contact him?", "What are his core skills?"]
      };

    case 'portfolio':
      return {
        response: `You are currently browsing Gangaji Karthikeyan's interactive portfolio website.

GitHub repository of candidate: github.com/karthik-0004
LinkedIn profile: linkedin.com/in/karthikgangaji

Would you like to know about his projects?`,
        suggestions: ["Show AI projects", "What is his CGPA?"]
      };

    default:
      return {
        response: "I couldn't find that information in Gangaji Karthikeyan's portfolio.",
        suggestions: ["What projects has he done?", "What is his CGPA?", "What is his email?"]
      };
  }
}
