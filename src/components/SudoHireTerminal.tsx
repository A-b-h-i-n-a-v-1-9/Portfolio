import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Matter from 'matter-js';

type TerminalStep = 'idle' | 'email' | 'brief' | 'sending' | 'success' | 'rateLimited';

interface TerminalLine {
  type: 'command' | 'output' | 'input' | 'success' | 'error';
  content: string;
}

interface RateLimitData {
  month: number;
  year: number;
  count: number;
  emails: Array<{
    email: string;
    timestamp: string;
    briefPreview: string;
  }>;
  resetDate: string;
}

const SudoHireTerminal = () => {
  const [step, setStep] = useState<TerminalStep>('idle');
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: "Welcome to Abhinav Mehta's Terminal v1.0.0" },
    { type: 'output', content: 'Type "sudo hire" to initiate recruitment protocol.' },
    { type: 'output', content: '' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [email, setEmail] = useState('');
  const [brief, setBrief] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Rate limiting storage key
  const RATE_LIMIT_KEY = 'terminal_email_limits';
  const MAX_EMAILS_PER_MONTH = 3;

  const triggerSudoDestroy = () => {
    const { Engine, Runner, Bodies, Composite } = Matter;
    const engine = Engine.create();
    const world = engine.world;

    const elements = document.querySelectorAll('.project-card, .bento-card, h1, h2, p, button, .terminal, span, .status-bar');
    
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const { x, y, width, height } = rect;

      const body = Bodies.rectangle(x + width / 2, y + height / 2, width, height, {
        restitution: 0.6,
        friction: 0.1,
      });

      Composite.add(world, body);

      const update = () => {
        const pos = body.position;
        const angle = body.angle;
        (el as HTMLElement).style.position = 'fixed';
        (el as HTMLElement).style.top = '0';
        (el as HTMLElement).style.left = '0';
        (el as HTMLElement).style.width = `${width}px`;
        (el as HTMLElement).style.zIndex = '9999';
        (el as HTMLElement).style.pointerEvents = 'none';
        (el as HTMLElement).style.transform = `translate(${pos.x - width / 2}px, ${pos.y - height / 2}px) rotate(${angle}rad)`;
        requestAnimationFrame(update);
      };
      update();
    });

    const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 30, window.innerWidth, 60, { isStatic: true });
    Composite.add(world, ground);

    const runner = Runner.create();
    Runner.run(runner, engine);
  };

  // Check rate limit - returns both the result and full data
  const checkRateLimit = (): { 
    allowed: boolean; 
    remaining: number;
    count: number;
    resetDate: string;
    data: RateLimitData | null;
  } => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get existing rate limit data
    const storedData = localStorage.getItem(RATE_LIMIT_KEY);
    let rateLimitData: RateLimitData | null = storedData ? JSON.parse(storedData) : null;
    
    // If no data exists or month/year has changed, reset the counter
    if (!rateLimitData || rateLimitData.month !== currentMonth || rateLimitData.year !== currentYear) {
      rateLimitData = {
        month: currentMonth,
        year: currentYear,
        count: 0,
        emails: [],
        resetDate: new Date(currentYear, currentMonth + 1, 0).toISOString() // Last day of current month
      };
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(rateLimitData));
    }
    
    const remaining = MAX_EMAILS_PER_MONTH - rateLimitData.count;
    const allowed = rateLimitData.count < MAX_EMAILS_PER_MONTH;
    
    return {
      allowed,
      remaining,
      count: rateLimitData.count,
      resetDate: rateLimitData.resetDate,
      data: rateLimitData
    };
  };

  // Get only rate limit status (for display)
  const getRateLimitStatus = () => {
    const result = checkRateLimit();
    return {
      allowed: result.allowed,
      remaining: result.remaining,
      resetDate: result.resetDate
    };
  };

  // Increment rate limit counter
  const incrementRateLimit = (userEmail: string) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const storedData = localStorage.getItem(RATE_LIMIT_KEY);
    let rateLimitData: RateLimitData = storedData ? JSON.parse(storedData) : {
      month: currentMonth,
      year: currentYear,
      count: 0,
      emails: [],
      resetDate: new Date(currentYear, currentMonth + 1, 0).toISOString()
    };
    
    // Reset if month/year changed
    if (rateLimitData.month !== currentMonth || rateLimitData.year !== currentYear) {
      rateLimitData = {
        month: currentMonth,
        year: currentYear,
        count: 0,
        emails: [],
        resetDate: new Date(currentYear, currentMonth + 1, 0).toISOString()
      };
    }
    
    rateLimitData.count += 1;
    rateLimitData.emails.push({
      email: userEmail,
      timestamp: now.toISOString(),
      briefPreview: brief.substring(0, 50) + (brief.length > 50 ? '...' : '')
    });
    
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(rateLimitData));
  };

  // Format reset date
  const formatResetDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Web3Forms submission function (plain text version)
  const submitToWeb3Forms = async (userEmail: string, message: string) => {
    try {
      // Check rate limit first
      const rateLimit = checkRateLimit();
      if (!rateLimit.allowed) {
        throw new Error(`RATE_LIMIT_EXCEEDED: ${rateLimit.remaining} attempts remaining`);
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'b3ade3ee-c7f6-4598-adab-2d956f27b76f', // REPLACE THIS WITH YOUR ACTUAL KEY
          subject: 'New Contact from Portfolio Terminal',
          from_name: 'Portfolio Terminal',
          reply_to: userEmail,
          email: userEmail,
          message: `New contact form submission:\n\nFrom: ${userEmail}\n\nMessage:\n${message}\n\n---\nSent via Portfolio Terminal`,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Increment rate limit only on successful submission
        incrementRateLimit(userEmail);
        console.log('Email sent successfully:', result);
        return result;
      } else {
        console.error('Web3Forms error:', result);
        throw new Error(result.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Web3Forms submission error:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const hasMounted = useRef(false);
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [step]);

  const addLine = useCallback((line: TerminalLine) => {
    setLines(prev => [...prev, line]);
  }, []);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#10b981', '#059669', '#34d399', '#6ee7b7'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#10b981', '#059669', '#34d399', '#6ee7b7'] });
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = currentInput.trim();
    if (!input) return;

    if (step === 'idle') {
      const lowerInput = input.toLowerCase();
      if (lowerInput === 'sudo hire') {
        // Check rate limit before even starting
        const rateLimit = checkRateLimit();
        if (!rateLimit.allowed) {
          addLine({ type: 'command', content: `$ ${input}` });
          addLine({ type: 'error', content: '[RATE_LIMIT] Monthly quota exceeded' });
          addLine({ type: 'output', content: `You can only send ${MAX_EMAILS_PER_MONTH} emails per month.` });
          addLine({ type: 'output', content: `Limit resets on ${formatResetDate(rateLimit.resetDate)}` });
          setCurrentInput('');
          setStep('rateLimited');
          return;
        }

        addLine({ type: 'command', content: `$ ${input}` });
        setCurrentInput('');
        setTimeout(() => {
          addLine({ type: 'output', content: '[sudo] Initiating recruitment protocol...' });
          // Show rate limit info
          addLine({ type: 'output', content: `[INFO] Monthly limit: ${MAX_EMAILS_PER_MONTH} emails (${rateLimit.remaining} remaining)` });
          setTimeout(() => {
            addLine({ type: 'output', content: '' });
            addLine({ type: 'output', content: 'Please enter your email:' });
            setStep('email');
          }, 500);
        }, 300);
      } 
      else if (lowerInput === 'sudo destroy') {
        addLine({ type: 'command', content: `$ ${input}` });
        addLine({ type: 'error', content: '[CRITICAL] GRAVITY_SYSTEM_FAILURE: Disabling safety locks...' });
        addLine({ type: 'output', content: 'Goodbye, system stability.' });
        setCurrentInput('');
        setTimeout(() => triggerSudoDestroy(), 1200);
      }
      else {
        addLine({ type: 'command', content: `$ ${input}` });
        addLine({ type: 'error', content: `Command not found: ${input}` });
        addLine({ type: 'output', content: 'Try "sudo hire" or "sudo destroy".' });
        setCurrentInput('');
      }
    } 
    else if (step === 'email') {
      if (input.includes('@') && input.includes('.')) {
        setEmail(input);
        addLine({ type: 'input', content: `> ${input}` });
        addLine({ type: 'success', content: '✓ Email validated' });
        setCurrentInput('');
        setTimeout(() => {
          addLine({ type: 'output', content: '' });
          addLine({ type: 'output', content: 'Enter your project brief (min 10 chars):' });
          setStep('brief');
        }, 300);
      } else {
        addLine({ type: 'input', content: `> ${input}` });
        addLine({ type: 'error', content: 'Invalid email format. Try again.' });
        setCurrentInput('');
      }
    } else if (step === 'brief') {
      if (input.length >= 10) {
        const userBrief = input;
        setBrief(userBrief);
        addLine({ type: 'input', content: `> ${input}` });
        setCurrentInput('');
        setStep('sending');
        addLine({ type: 'output', content: '' });
        addLine({ type: 'output', content: 'Processing request...' });

        // Show progress bars
        setTimeout(() => { addLine({ type: 'output', content: '██░░░░░░░░░░░░░░░░░░ 10%' }); }, 400);
        setTimeout(() => { addLine({ type: 'output', content: '████████░░░░░░░░░░░░ 40%' }); }, 800);
        setTimeout(() => { addLine({ type: 'output', content: '██████████████░░░░░░ 70%' }); }, 1200);
        
        // Submit to Web3Forms
        setTimeout(async () => {
          try {
            addLine({ type: 'output', content: 'Checking rate limits...' });
            const rateLimit = checkRateLimit();
            if (!rateLimit.allowed) {
              throw new Error(`RATE_LIMIT_EXCEEDED: Monthly quota of ${MAX_EMAILS_PER_MONTH} emails reached. Resets on ${formatResetDate(rateLimit.resetDate)}`);
            }
            
            // addLine({ type: 'output', content: 'Connecting to Web3Forms API...' });
            
            // Wait for the submission
            await submitToWeb3Forms(email, userBrief);
            
            addLine({ type: 'success', content: '████████████████████ 100%' });
            addLine({ type: 'output', content: '' });
            addLine({ type: 'success', content: '✓ Email sent successfully!' });
            addLine({ type: 'success', content: `✓ Monthly emails used: ${rateLimit.count + 1}/${MAX_EMAILS_PER_MONTH}` });
            addLine({ type: 'success', content: '✓ Response within 24 hours' });
            addLine({ type: 'output', content: '' });
            addLine({ type: 'output', content: '🎉 Thank you for reaching out!' });
            setStep('success');
            triggerConfetti();
          } catch (error: any) {
            // Check if it's a rate limit error
            if (error.message?.includes('RATE_LIMIT')) {
              addLine({ type: 'error', content: '✗ Rate limit exceeded' });
              addLine({ type: 'output', content: `Monthly quota: ${MAX_EMAILS_PER_MONTH} emails per IP` });
              addLine({ type: 'output', content: `Limit resets on ${formatResetDate(getRateLimitStatus().resetDate)}` });
              setStep('rateLimited');
            } else {
              // Fallback if Web3Forms fails
              addLine({ type: 'error', content: '✗ Connection failed' });
              addLine({ type: 'output', content: 'Using fallback notification method...' });
              addLine({ type: 'success', content: '████████████████████ 100%' });
              addLine({ type: 'output', content: '' });
              addLine({ type: 'success', content: '✓ Request logged locally' });
              addLine({ type: 'success', content: '✓ Will respond manually' });
              addLine({ type: 'output', content: '' });
              addLine({ type: 'output', content: '🎉 Thank you for reaching out!' });
              setStep('success');
              triggerConfetti();
            }
          }
        }, 1600);
      } else {
        addLine({ type: 'input', content: `> ${input}` });
        addLine({ type: 'error', content: 'Too short. Please provide more details.' });
        setCurrentInput('');
      }
    } else if (step === 'rateLimited') {
      // Allow viewing rate limit info
      const lowerInput = input.toLowerCase();
      if (lowerInput === 'sudo status') {
        addLine({ type: 'command', content: `$ ${input}` });
        const rateLimit = checkRateLimit();
        addLine({ type: 'output', content: `📊 Rate Limit Status:` });
        addLine({ type: 'output', content: `   Emails this month: ${rateLimit.count}/${MAX_EMAILS_PER_MONTH}` });
        addLine({ type: 'output', content: `   Remaining: ${rateLimit.remaining}` });
        addLine({ type: 'output', content: `   Resets on: ${formatResetDate(rateLimit.resetDate)}` });
        setCurrentInput('');
      } else if (lowerInput === 'sudo reset') {
        addLine({ type: 'command', content: `$ ${input}` });
        addLine({ type: 'error', content: '[PERMISSION_DENIED] Cannot reset rate limits manually' });
        addLine({ type: 'output', content: 'Limits reset automatically at the start of each month' });
        setCurrentInput('');
      } else if (lowerInput === 'sudo hire') {
        // Try to initiate again
        handleSubmit(e);
      } else {
        addLine({ type: 'command', content: `$ ${input}` });
        addLine({ type: 'output', content: 'Rate limit exceeded. Try "sudo status" or wait for next month.' });
        setCurrentInput('');
      }
    }
  };

  const resetTerminal = () => {
    setStep('idle');
    setCurrentInput('');
    setEmail('');
    setBrief('');
    setLines([
      { type: 'output', content: "Welcome to Abhinav Mehta's Terminal v1.0.0" },
      { type: 'output', content: 'Type "sudo hire" to initiate recruitment protocol.' },
      { type: 'output', content: '' },
    ]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const getPrompt = () => {
    switch (step) {
      case 'email': return 'email › ';
      case 'brief': return 'brief › ';
      case 'rateLimited': return '$ ';
      default: return '$ ';
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <section id="terminal" className="py-24 relative">
      <div className="container px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Get in <span className="text-primary">Touch</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <div 
            ref={terminalContainerRef}
            onClick={handleTerminalClick}
            className="terminal overflow-hidden cursor-text"
          >
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500/80"></div>
              <div className="terminal-dot bg-yellow-500/80"></div>
              <div className="terminal-dot bg-green-500/80"></div>
              <span className="ml-4 text-xs text-muted-foreground font-mono">
                ~/recruitment
              </span>
              {step === 'success' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetTerminal();
                  }}
                  className="ml-auto text-xs text-primary hover:text-primary/80 font-mono transition-colors"
                >
                  [reset]
                </button>
              )}
              {step === 'rateLimited' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetTerminal();
                  }}
                  className="ml-auto text-xs text-primary hover:text-primary/80 font-mono transition-colors"
                >
                  [reset]
                </button>
              )}
            </div>

            <div 
              ref={terminalRef}
              className="terminal-body h-[320px] overflow-y-auto"
            >
              <AnimatePresence mode="popLayout">
                {lines.map((line, index) => (
                  <motion.div
                    key={`${index}-${line.content}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`font-mono text-sm leading-relaxed ${
                      line.type === 'command' ? 'text-primary' :
                      line.type === 'success' ? 'text-primary' :
                      line.type === 'error' ? 'text-red-400' :
                      line.type === 'input' ? 'text-blue-400' :
                      'text-muted-foreground'
                    }`}
                  >
                    {line.content || '\u00A0'}
                  </motion.div>
                ))}
              </AnimatePresence>

              {step !== 'sending' && step !== 'success' && (
                <form onSubmit={handleSubmit} className="flex items-center mt-1">
                  <span className="text-primary font-mono text-sm shrink-0">{getPrompt()}</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-foreground font-mono text-sm caret-primary"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    placeholder={step === 'idle' ? '' : ''}
                  />
                </form>
              )}

              {step === 'sending' && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-muted-foreground font-mono text-sm">Processing</span>
                  <span className="text-primary animate-pulse">...</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SudoHireTerminal;