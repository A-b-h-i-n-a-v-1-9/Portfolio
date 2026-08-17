import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  ExternalLink,
  Github,
  Brain,
  Activity,
  Shirt,
  Search,
  Keyboard,
  Heart,
  Users,
  Link,
} from 'lucide-react';
import MatrixRain from './MatrixRain';

/* ================================
   Project Data (FINAL ORDER)
================================ */

const projects = [
  {
    id: 1,
    title: 'AI Anomaly Detection',
    subtitle: 'Industry Project: TwoRegisters',
    description:
      'Advanced detection system for synthetic manufacturing data using Isolation Forest and LSTM. Achieved high recall in identifying IoT sensor anomalies.',
    tech: ['Python', 'TensorFlow', 'Isolation Forest', 'LSTM', 'IoT'],
    icon: Activity,
    badges: ['Industry', 'Research'],
  },
  {
    id: 2,
    title: "Parkinson's MRI Classifier",
    subtitle: 'Research Accepted - IET SCS 2025',
    description:
      'A deep learning diagnostic tool utilizing CNNs to classify Parkinson’s disease from MRI scans with high accuracy. Accepted for international publication.',
    tech: ['Python', 'CNN', 'TensorFlow', 'Keras', 'Medical Imaging'],
    icon: Brain,
    badges: ['Research'],
  },
  {
    id: 3,
    title: 'Semantic Job Matcher',
    subtitle: 'AI Project: KGamify',
    description:
      'Intelligent recruitment engine using BERT Embeddings and Cosine Similarity to match resumes to job descriptions in real-time.',
    tech: ['BERT', 'NLP', 'FastAPI', 'Cosine Similarity', 'Python'],
    icon: Search,
    badges: ['Industry', 'Research'],
    links: {
      source:
        'https://huggingface.co/spaces/48H1NAV/VCA-Ai_case-study/tree/main',
      live: 'https://a-b-h-i-n-a-v-1-9.github.io/CareerSync/',
    },
  },
  {
    id: 6,
    title: 'Typix',
    subtitle: 'Multiplayer Typing Game',
    description:
      'High-concurrency multiplayer competition game using WebSockets for sub-100ms latency between global players.',
    tech: ['Socket.io', 'React', 'Node.js', 'Redis', 'Tailwind'],
    icon: Keyboard,
    links: {
      source: 'https://github.com/Abh19avM/typemaster',
      live: 'https://typemaster-sepia.vercel.app/',
    },
  },
  {
    id: 7,
    title: 'LSOM Community',
    subtitle: 'Open Source Community Site',
    description:
      'A fully responsive community hub for developers, featuring resource sharing and event tracking. Deployed via Cloudflare.',
    tech: ['JavaScript', 'HTML5', 'CSS3', 'Cloudflare Pages'],
    icon: Users,
    links: {
      live: 'https://www.lsom.in/',
    },
  },
  {
    id: 8,
    title: 'ChainOwl',
    subtitle: 'Blockchain Certificate Verification',
    description:
      'A blockchain-based certificate issuance and verification system designed to prevent fraud and ensure authenticity using decentralized ledger technology.',
    tech: ['Blockchain', 'Smart Contracts', 'Web3', 'Ethereum'],
    icon: Link,
    badges: ['Blockchain'],
    links: {
      source: 'https://github.com/Abh19avM/new_block_cert-main',
    },
  },
  {
    id: 4,
    title: 'T-Shirt Engine',
    subtitle: 'E-commerce Customizer',
    description:
      'Full-stack platform featuring a real-time 3D visualization engine for product customization using WebGL.',
    tech: ['Three.js', 'React', 'Node.js', 'MySQL', 'WebGL'],
    icon: Shirt,
    links: {
      source:
        'https://github.com/Abh19avM/custom-tshirt-store/tree/main',
      live: 'https://a-b-h-i-n-a-v-1-9.github.io/custom-tshirt-store/',
    },
  },
  {
    id: 5,
    title: 'MediQuick',
    subtitle: 'Healthcare Booking Platform',
    description:
      'Comprehensive patient-doctor appointment system with real-time status tracking and medical history management.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Cloudinary'],
    icon: Heart,
    links: {
      source: 'https://github.com/Abh19avM/Mediquick',
    },
  },
];

/* ================================
   Animations
================================ */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ================================
   Component
================================ */

const ProjectLab = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  return (
    <section id="projects" className="py-24 relative">
      <div className="container px-4 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-mono mb-4">
            Project <span className="text-primary">Lab</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A collection of innovative projects spanning AI, research, blockchain, and full-stack development.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => {
            const Icon = project.icon;
            const isHovered = hoveredProject === project.id;

            return (
              <motion.div
                key={project.id}
                variants={item}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                className="project-card relative"
              >
                {/* Optional Cyber Effect */}
                {project.badges?.includes('Cyber') && isHovered && <MatrixRain />}

                {/* Badges */}
                {project.badges?.length > 0 && (
                  <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-2 justify-end">
                    {project.badges.map((badge) => (
                      <span
                        key={badge}
                        className="px-2 py-1 text-xs font-mono rounded
                          bg-primary/20 text-primary border border-primary/40"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg border border-border/60 bg-secondary/50 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-lg font-bold font-mono mb-1">
                    {project.title}
                  </h3>

                  <p className="text-sm text-primary/70 font-medium mb-3">
                    {project.subtitle}
                  </p>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs font-mono rounded
                          border border-border/60 bg-secondary/30 text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="px-2 py-1 text-xs font-mono rounded
                        border border-border/60 bg-secondary/30 text-muted-foreground">
                        +{project.tech.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
                    {project.links?.source && (
                      <a
                        href={project.links.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span className="font-mono">Source</span>
                      </a>
                    )}

                    {project.links?.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="font-mono">Live</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectLab;
