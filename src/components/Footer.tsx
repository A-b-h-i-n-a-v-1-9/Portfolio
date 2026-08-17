import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, Heart, Twitter, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/60">
      <div className="container px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-mono text-lg font-bold">
              AM<span className="text-primary">.</span>
            </span>
            <p className="text-xs text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Abhinav Mehta. Crafted with{' '}
              <Heart className="inline w-3 h-3 text-primary" /> and code.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Abh19avM"
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
            <a
              href="https://codolio.com/profile/MzMgXSPm"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Codolio"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Code2 className="w-5 h-5" />
            </a>
          </div>


          {/* Easter Egg Hint */}
          <div className="text-xs text-muted-foreground/50 font-mono">
            <span className="hidden md:inline">Press keys: snake anywhere 🐍</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
