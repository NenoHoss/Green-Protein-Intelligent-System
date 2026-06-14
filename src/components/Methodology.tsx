import React from 'react';
import { motion } from 'motion/react';
import { 
  Leaf, 
  Droplets, 
  Flame, 
  Filter, 
  Sun, 
  Scissors, 
  Wind, 
  Beaker,
  Scale,
  CheckCircle2,
  ArrowRight,
  Hammer,
  GlassWater
} from 'lucide-react';
import { ProcessDiagram } from './ProcessDiagram';
import { Language } from '../translations';

interface MethodologyProps {
  language: Language;
  t: any;
}

export const Methodology = ({ language, t }: MethodologyProps) => {
  const leafStepsFromT = t.methodology.leafSteps || [];
  const legumeStepsFromT = t.methodology.legumeSteps || [];

  const leafIcons = [
    <Scissors size={24} />,
    <Droplets size={24} />,
    <Sun size={24} />,
    <Wind size={24} />,
    <Filter size={24} />,
    <Flame size={24} />,
    <Droplets size={24} />,
    <Sun size={24} />
  ];

  const legumeIcons = [
    <Beaker size={24} />,
    <Filter size={24} />,
    <Droplets size={24} />,
    <Flame size={24} />,
    <CheckCircle2 size={24} />,
    <Sun size={24} />
  ];

  const leafDiagramSteps = leafStepsFromT.map((s: any, i: number) => ({
    icon: leafIcons[i] || <Leaf size={24} />,
    label: s.title
  }));

  const legumeDiagramSteps = legumeStepsFromT.map((s: any, i: number) => ({
    icon: legumeIcons[i] || <Scale size={24} />,
    label: s.title
  }));

  return (
    <div className="space-y-24 pb-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-display font-bold text-stone-900 tracking-tight leading-tight">{t.methodology.title}</h2>
        <p className="text-emerald-700 font-bold uppercase tracking-[0.3em] text-[10px]">{t.methodology.scientificMethodology}</p>
        <div className="max-w-2xl mx-auto text-base text-stone-500 leading-relaxed font-medium">
          {t.methodology.subtitle}
        </div>
      </div>

      {/* Leaf Extraction Track */}
      <section className="space-y-12">
        <div className="flex items-center gap-6 border-b border-stone-100 pb-8">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
            <Leaf size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold text-stone-900 tracking-tight">{t.methodology.trackA}</h3>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">{t.methodology.trackALabel}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {leafStepsFromT.map((content: any, index: number) => {
            const icons = [
              <Scissors className="text-emerald-600" />,
              <Droplets className="text-blue-400" />,
              <Sun className="text-amber-500" />,
              <Wind className="text-blue-500" />,
              <Filter className="text-stone-500" />,
              <Flame className="text-orange-600" />,
              <Droplets className="text-cyan-500" />,
              <Sun className="text-yellow-600" />
            ];
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-8 flex flex-col items-center text-center group relative"
              >
                <div className="w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center text-[9px] font-bold mb-6 shadow-lg">
                  {index + 1}
                </div>
                <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-stone-900 group-hover:text-white transition-all duration-500 shadow-inner">
                  {React.cloneElement(icons[index] as React.ReactElement<any>, { size: 20 })}
                </div>
                <h4 className="font-display font-bold text-stone-900 mb-4 text-base tracking-tight">{content.title}</h4>
                <p className="text-xs text-stone-500 leading-relaxed font-medium">{content.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Process Diagram - Leaf */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="glass-card overflow-hidden rounded-[2rem] border border-emerald-100/50 bg-emerald-50/5 p-2">
            <ProcessDiagram 
              steps={leafDiagramSteps} 
              language={language} 
              color="emerald" 
            />
          </div>
        </motion.div>
      </section>

      {/* Legume Extraction Track */}
      <section className="space-y-12">
        <div className="flex items-center gap-6 border-b border-stone-100 pb-8">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shadow-inner">
            <Scale size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold text-stone-900 tracking-tight">{t.methodology.trackB}</h3>
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mt-1">{t.methodology.trackBLabel}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {legumeStepsFromT.map((content: any, index: number) => {
            const icons = [
              <Beaker className="text-indigo-600" />,
              <Filter className="text-stone-400" />,
              <Droplets className="text-lime-600" />,
              <Flame className="text-red-500" />,
              <CheckCircle2 className="text-emerald-500" />
            ];
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-8 flex flex-col items-center text-center group relative"
              >
                <div className="w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center text-[9px] font-bold mb-6 shadow-lg">
                  {index + 1}
                </div>
                <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-stone-900 group-hover:text-white transition-all duration-500 shadow-inner">
                  {React.cloneElement(icons[index] as React.ReactElement<any>, { size: 20 })}
                </div>
                <h4 className="font-display font-bold text-stone-900 mb-4 text-base tracking-tight">{content.title}</h4>
                <p className="text-xs text-stone-500 leading-relaxed font-medium">{content.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Process Diagram - Legume */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="glass-card overflow-hidden rounded-[2rem] border border-amber-100/50 bg-amber-50/5 p-2">
            <ProcessDiagram 
              steps={legumeDiagramSteps} 
              language={language} 
              color="amber" 
            />
          </div>
        </motion.div>
      </section>

      {/* Quality Standards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-stone-100">
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-3xl font-display font-bold text-stone-900 tracking-tight">{t.methodology.qa}</h3>
            <p className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px]">{t.methodology.standardsTitle}</p>
          </div>
          <p className="text-base text-stone-500 leading-relaxed font-medium">
            {t.methodology.standardsDesc}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Flame size={16} />, label: t.methodology.thermalLimit },
              { icon: <CheckCircle2 size={16} />, label: t.methodology.phPoint },
              { icon: <Filter size={16} />, label: t.methodology.filtration },
              { icon: <Leaf size={16} />, label: t.methodology.natural },
              { icon: <Beaker size={16} />, label: t.methodology.noChemicals },
              { icon: <Scale size={16} />, label: t.methodology.wasteRecovery }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100/50">
                <div className="text-emerald-600">{stat.icon}</div>
                <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="glass-card p-8 flex flex-col justify-between bg-stone-900 text-white border-stone-800">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
              <Leaf size={24} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-4xl font-display font-bold mb-2">{t.methodology.zero}</div>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-loose">
                {t.methodology.wasteRecovery}
              </p>
            </div>
          </div>
          <div className="glass-card p-8 flex flex-col justify-between border-stone-100">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
              <CheckCircle2 size={24} className="text-emerald-600" />
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-stone-900 mb-2">{t.methodology.fao}</div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-loose">
                {t.methodology.compliant}
              </p>
            </div>
          </div>
          <div className="glass-card p-8 flex flex-col justify-between border-stone-100 col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Sun size={24} className="text-blue-600" />
              </div>
              <ArrowRight className="text-stone-300" />
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-stone-900 mb-2">{t.methodology.days45}</div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-loose">
                {t.methodology.stableShelfLife}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
