import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Award, Shield, Network, Bot, Key } from 'lucide-react';
import MatrixRain from './MatrixRain';

type Credential = {
  name: string;
  issuer: string;
  year: string;
  verifyUrl: string;
  previewImg?: string;
};

type Category = {
  title: string;
  icon: any;
  credentials: Credential[];
  hasCyber?: boolean;
};

const credentialCategories: Category[] = [
  {
    title: 'AI / GenAI',
    icon: Bot,
    credentials: [
      {
        name: 'Oracle AI Foundation',
        issuer: 'Oracle',
        year: '2025',
        verifyUrl: 'https://drive.google.com/file/d/1Fl03t54bExvMOTcJF9eMvSQhT1QO0yqX/view?usp=sharing',
        previewImg: '/certs/oracle-ai-foundation.png',
      },
      {
        name: 'Oracle Generative AI Professional',
        issuer: 'Oracle',
        year: '2025',
        verifyUrl: 'https://drive.google.com/file/d/1uLcwvrZqe1YngDjyJIX1SkdHpj3uchXS/view?usp=sharing',
        previewImg: '/certs/oracle-genai-pro.png',
      },
    ],
  },
  {
    title: 'Networking',
    icon: Network,
    credentials: [
      {
        name: 'CCNA: Routing & Switching',
        issuer: 'Cisco',
        year: '2025',
        verifyUrl: 'https://drive.google.com/file/d/1LAOaPpf-9nwJnrowMzG86zJdHNTHtokK/view?usp=sharing',
        previewImg: '/certs/ccna-rs.png',
      },
      {
        name: 'CCNA: Wireless Essentials',
        issuer: 'Cisco',
        year: '2025',
        verifyUrl: 'https://drive.google.com/file/d/1kXNWkG8dzaI4iElL9heuNF6qtK9g_64c/view?usp=sharing',
        previewImg: '/certs/ccna-wireless.png',
      },
      {
        name: 'Introduction to Networks',
        issuer: 'Cisco',
        year: '2025',
        verifyUrl: 'https://drive.google.com/file/d/1b7mvIo2JKa88dPI5i_f00dxvplEog3rI/view?usp=sharing',
        previewImg: '/certs/intro-networks.png',
      },
    ],
  },
  {
    title: 'Security & APIs',
    icon: Shield,
    hasCyber: true,
    credentials: [
      {
        name: 'Cybersecurity Essentials',
        issuer: 'Cisco',
        year: '2025',
        verifyUrl: 'https://drive.google.com/file/d/12uZBKttwE3hR6jg5g-9P8fcZyb7IltgS/view?usp=sharing',
        previewImg: '/certs/cybersecurity.png',
      },
      {
        name: 'Introduction to Cybersecurity',
        issuer: 'Cisco',
        year: '2025',
        verifyUrl: 'https://drive.google.com/file/d/1620l-7SRqz6Yi5bZ73cLFdxNsNbqqeoL/view?usp=sharing',
        previewImg: '/certs/cybersecurity.png',
      },
      {
        name: 'Postman API Student Expert',
        issuer: 'Postman',
        year: '2024',
        verifyUrl: 'https://badges.parchment.com/public/assertions/Y7NruJsXTZ2jAZL14FE9cA?identity__email=abhinavmehta374@gmail.com',
        previewImg: './public/postman.png',
      },
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const CredentialRegistry = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredCert, setHoveredCert] = useState<string | null>(null);

  return (
    <section id="credentials" className="py-24 relative overflow-hidden">
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
            Credential <span className="text-primary">Registry</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Industry-recognized certifications from Cisco, Oracle, and Postman.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {credentialCategories.map((category) => {
            const Icon = category.icon;
            const isHovered = hoveredCategory === category.title;

            return (
              <motion.div
                key={category.title}
                variants={item}
                onMouseEnter={() => setHoveredCategory(category.title)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="bento-card relative overflow-hidden shadow-sm hover:shadow-primary/10 transition-shadow"
              >
                {/* Matrix Effect */}
                {category.hasCyber && isHovered && (
                  <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                    <MatrixRain />
                  </div>
                )}

                {/* Category Header */}
                <div className="relative z-10 flex items-center gap-3 mb-6 pb-4 border-b border-border/60">
                  <div className="w-10 h-10 rounded-lg border border-primary/40 bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold font-mono text-lg">{category.title}</h3>
                </div>

                {/* Credentials */}
                <div className="relative z-10 space-y-4">
                  {category.credentials.map((credential) => (
                    <div
                      key={credential.name}
                      className="relative"
                      onMouseEnter={() => setHoveredCert(credential.name)}
                      onMouseLeave={() => setHoveredCert(null)}
                    >
                      <a
                        href={credential.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-3 rounded-lg border border-border/40 
                                   bg-secondary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
                      >
                        <div className="w-8 h-8 rounded-full border border-border/60 bg-card flex items-center justify-center">
                          <Award className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-medium">{credential.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{credential.issuer}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-primary/70 font-mono">{credential.year}</span>
                          </div>
                        </div>
                      </a>

                      {/* Hover Preview */}
                      <AnimatePresence>
                        {hoveredCert === credential.name && credential.previewImg && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-full top-1/2 -translate-y-1/2 ml-4 
                                       w-64 p-2 rounded-lg border border-border bg-card 
                                       shadow-xl z-50 hidden lg:block"
                          >
                            <img
                              src={credential.previewImg}
                              alt={credential.name}
                              className="rounded-md"
                            />
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                              Click to verify
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="relative z-10 mt-6 pt-4 border-t border-border/60">
                  <span className="text-xs font-mono text-muted-foreground">
                    {category.credentials.length} verified credentials 
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border bg-card/50">
            <Key className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-muted-foreground">
              Total Certifications: <span className="text-primary font-bold">8</span>
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default CredentialRegistry;
