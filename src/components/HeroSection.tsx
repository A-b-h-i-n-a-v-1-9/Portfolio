import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, Twitter } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent" />

      {/* Minimal geometric accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.19]">
        <div className="absolute inset-0 border border-primary/50 rounded-full" />
        <div className="absolute inset-12 border border-primary/40 rounded-full" />
        <div className="absolute inset-24 border border-primary/30 rounded-full" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Status line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-mono text-muted-foreground">Available for opportunities</span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
          >
            <span className="text-foreground">Abhinav</span>{' '}
            <span className="text-primary">Mehta</span>
          </motion.h1>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-6 font-light"
          >
            Full-Stack Developer & Security Enthusiast
          </motion.p>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground/80 mb-8 max-w-xl leading-relaxed"
          >
            B.Tech CS (IoT, Cyber Security, Blockchain) at VIIT.
            Building intelligent systems and leading cybersecurity initiatives.
          </motion.p>

          {/* Stats - minimal inline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-6 mb-10 font-mono text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-primary">8.42</span>
              <span className="text-muted-foreground/60">CGPA</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-primary">1148</span>
              <span className="text-muted-foreground/60">Codeforces</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-primary">885</span>
              <span className="text-muted-foreground/60">CodeChef</span>
            </div>
          </motion.div>

          {/* CTA + Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-6"
          >
            <a
              href="#terminal"
              className="group inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <span className="font-mono text-sm">$ sudo hire</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </a>

            <div className="w-px h-4 bg-border" />

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/A-b-h-i-n-a-v-1-9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>

              <a
                href="https://www.linkedin.com/in/mehta-abhinav/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              <a
                href="https://x.com/Abhinav_io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>

              <a
                href="mailto:abhinavmehta374@gmail.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-16 bg-gradient-to-b from-border to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
