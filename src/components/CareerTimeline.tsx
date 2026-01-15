import { motion } from 'framer-motion';
import { Shield, Users, Code, Trophy, Globe } from 'lucide-react';

const phases = [
  {
    phase: 3,
    title: 'Advisory Board',
    period: '2025 - Present',
    role: 'Strategic Oversight & Mentorship',
    description: 'Providing strategic technical oversight and mentorship to the next generation of cybersecurity enthusiasts.',
    icon: Shield,
    status: 'current',
    highlights: ['Technical Strategy', 'Team Mentorship', 'Vision Planning'],
  },
  {
    phase: 2,
    title: 'CTF Head',
    period: '2024',
    role: 'Led VISWACTF 24',
    description: 'Led a 7-member team for VISWACTF 24; managed 3000+ teams from 100+ countries; achieved Top 25 AIR.',
    icon: Trophy,
    status: 'completed',
    highlights: ['7-Member Team Lead', '3000+ Teams Managed', '100+ Countries', 'Top 25 AIR'],
  },
  {
    phase: 1,
    title: 'Tech Team Member',
    period: '2023',
    role: 'Challenge Creator & Infrastructure',
    description: 'Created CTF challenges and networking infrastructure for competitive hacking events.',
    icon: Code,
    status: 'completed',
    highlights: ['CTF Challenges', 'Network Infrastructure', 'Security Research'],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0 },
};

const CareerTimeline = () => {
  return (
    <section id="experience" className="pt-32 pb-24 relative">
      <div className="container px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* <span className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-4">
            
          </span> */}
          <h2 className="text-3xl md:text-4xl font-bold font-mono mb-4">
            CyberCell <span className="text-primary">VIIT</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A journey through leadership roles in cybersecurity and competitive hacking.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto"
        >
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent md:-translate-x-1/2" />

          {phases.map((phase, index) => {
            const Icon = phase.icon;
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={phase.phase}
                variants={item}
                className={`relative flex items-start gap-8 mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Node */}
                <div className="absolute left-6 md:left-1/2 w-12 h-12 -translate-x-1/2 flex items-center justify-center">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                    phase.status === 'current' 
                      ? 'border-primary bg-primary/20 shadow-emerald' 
                      : 'border-border bg-card'
                  }`}>
                    <Icon className={`w-5 h-5 ${phase.status === 'current' ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                </div>

                {/* Content Card */}
                <div className={`ml-20 md:ml-0 md:w-[calc(50%-40px)] ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className="bento-card group">
                    {/* Phase Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono text-primary">PHASE {phase.phase}</span>
                      <span className="text-xs font-mono text-muted-foreground">{phase.period}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold font-mono mb-2 group-hover:text-primary transition-colors">
                      {phase.title}
                    </h3>

                    {/* Role */}
                    <p className="text-sm text-primary/80 font-medium mb-3">{phase.role}</p>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4">{phase.description}</p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2">
                      {phase.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="px-2 py-1 text-xs font-mono rounded border border-border/60 bg-secondary/50 text-muted-foreground"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* Current Status Indicator */}
                    {phase.status === 'current' && (
                      <div className="mt-4 pt-4 border-t border-border/60">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </span>
                          <span className="text-xs font-mono text-primary">Currently Active</span>
                        </div>
                      </div>
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

export default CareerTimeline;
