import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Droplets, Wind, Hammer, Filter, Thermometer, Snowflake, Sun, Scale, GlassWater } from 'lucide-react';
import { cn } from '../utils';

interface Step {
  icon: React.ReactNode;
  label: string;
}

interface ProcessDiagramProps {
  steps: Step[];
  language: string;
  color: 'emerald' | 'amber';
}

export function ProcessDiagram({ steps, language, color }: ProcessDiagramProps) {
  const isAr = language === 'ar';
  const themeClasses = color === 'emerald' 
    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
    : "bg-amber-50 text-amber-600 border-amber-100";

  return (
    <div className="w-full py-12 px-4 overflow-x-auto">
      <div className={cn(
        "flex items-center gap-4 min-w-max mx-auto justify-center",
        isAr ? "flex-row-reverse" : "flex-row"
      )}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex flex-col items-center"
            >
              <div className={cn(
                "w-20 h-20 rounded-2xl border-2 flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg bg-white z-10",
                color === 'emerald' ? "border-emerald-100 group-hover:border-emerald-500" : "border-amber-100 group-hover:border-amber-500"
              )}>
                <div className={cn("p-4 rounded-xl", themeClasses)}>
                   {step.icon}
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <span className="block text-[10px] font-black text-stone-300 uppercase tracking-tighter mb-1">
                  {index + 1}
                </span>
                <p className={cn(
                  "font-bold text-stone-700 max-w-[100px] whitespace-normal leading-tight",
                  isAr ? "text-sm" : "text-[10px] uppercase tracking-wider"
                )}>
                  {step.label}
                </p>
              </div>
            </motion.div>

            {/* Arrow */}
            {index < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.05 }}
                className="flex items-center text-stone-200"
              >
                <ArrowRight 
                  className={cn("w-6 h-6", isAr && "rotate-180")} 
                  strokeWidth={3}
                />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
