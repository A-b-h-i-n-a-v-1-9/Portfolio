import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Amruta',
    quote:
      'Consistently delivered beyond expectations. Took ownership beyond assigned responsibilities and remained dependable in high-pressure situations.',
  },
  {
    name: 'Soham Kolte',
    quote:
      'Played a key role in the success of VishwaCTF’25 by handling challenges smoothly and ensuring attention to detail throughout the event.',
  },
  {
    name: 'Alpha Charlie',
    quote:
      'Calm under pressure and sharp in execution. Demonstrated strong strategic thinking in competitive CTF environments.',
  },
  {
    name: 'Pratik Patil',
    quote:
      'Strong communication, thoughtful delegation, and composed decision-making. A reliable and effective team lead.',
  },
];

const TestimonialSection = () => {
  return (
    <section id="testimonials" className="py-20 relative">
      <div className="container px-4 lg:px-8 max-w-4xl mx-auto">
        
        {/* Header - Simple & Clean */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-mono font-bold mb-3">
            <span className="text-primary">/</span> what others say
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Feedback from teammates and collaborators
          </p>
        </motion.div>

        {/* Testimonials - Clean List */}
        <div className="space-y-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Simple left accent */}
              <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/50 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="pl-2">
                {/* Quote with simple icon */}
                <div className="flex items-start gap-3 mb-4">
                  <Quote className="w-5 h-5 text-primary/60 mt-1 flex-shrink-0" />
                  <p className="text-sm md:text-base leading-relaxed text-foreground/85">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                {/* Name - Simple and clean */}
                <div className="flex items-center gap-2 pl-8">
                  <div className="h-px w-4 bg-primary/40" />
                  <span className="font-mono text-sm text-primary/90">
                    — {testimonial.name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Simple footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span>based on collaborative projects</span>
            <span className="text-primary">•</span>
            <span>2023-2025</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default TestimonialSection;