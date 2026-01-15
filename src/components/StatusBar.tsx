import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const StatusBar = () => {
  const [time, setTime] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Handle logo click → go home + scroll top
  const handleHome = () => {
  navigate(
    { pathname: "/", hash: "" },
    { replace: true }
  );

  window.scrollTo({ top: 0, behavior: "smooth" });
};


  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcTime = now.toUTCString().split(" ")[4];
      setTime(`${utcTime} UTC`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div
            onClick={handleHome}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <span className="font-mono text-lg font-bold text-foreground">
              AM<span className="text-primary">.</span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#experience" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Experience
            </a>
            <a href="#projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Projects
            </a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Testimonials 
            </a>
            <a href="#credentials" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Credentials
            </a>
            <a href="#terminal" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* Status */}
          <div className="flex items-center gap-6">
            <a href="#terminal" className="hidden sm:flex items-center gap-2 group">
              <div className="relative w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                <span className="relative block w-2 h-2 rounded-full bg-primary" />
              </div>
              <span className="text-xs font-mono text-primary">
                Available for Hire
              </span>
            </a>

            <div className="font-mono text-xs text-muted-foreground">
              {time}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default StatusBar;
