
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Users, Server, Database, Cloud, Brain, Code2, Globe, Rocket } from 'lucide-react';
import { MetricItem, SkillCategory, UIStrings } from '../types';

// --- IMPACT METRICS DIAGRAM ---
export const ImpactMetrics: React.FC<{ metrics: MetricItem[], theme: string, ui: UIStrings }> = ({ metrics, theme, ui }) => {
  const colors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-yellow-500"];
  const isDark = theme === 'dark';
  const isProfessional = theme === 'professional';

  // Styling Logic
  let containerClass = 'bg-white border-stone-200';
  let textColor = 'text-stone-900';
  let subTextColor = 'text-stone-500';
  let iconColor = 'text-nobel-gold';
  let barBg = 'bg-stone-100';

  if (isDark) {
    containerClass = 'bg-white/5 border-white/10';
    textColor = 'text-white';
    subTextColor = 'text-gray-400';
    iconColor = 'text-nobel-gold';
    barBg = 'bg-white/10';
  } else if (isProfessional) {
    containerClass = 'bg-white border-gray-200 shadow-sm';
    textColor = 'text-[#191919]';
    subTextColor = 'text-gray-500';
    iconColor = 'text-[#0a66c2]'; // LinkedIn Blue
    barBg = 'bg-[#f3f2ef]';
  }

  return (
    <div className={`flex flex-col p-8 rounded-xl shadow-sm border w-full ${containerClass}`}>
      <h3 className={`font-serif text-2xl mb-6 flex items-center gap-3 ${textColor}`}>
        <TrendingUp className={iconColor} /> {ui.headings.keyAchievements}
      </h3>

      <div className="space-y-8">
        {metrics.map((m, idx) => (
          <div key={idx} className="relative">
            <div className="flex justify-between items-end mb-2">
              <span className={`text-sm font-bold uppercase tracking-wider ${subTextColor}`}>{m.label}</span>
              <div className="text-right">
                <span className={`text-2xl font-serif font-bold ${textColor}`}>{m.value}</span>
                <span className={`text-sm font-medium ml-1 ${subTextColor}`}>{m.suffix}</span>
              </div>
            </div>

            <div className={`h-3 w-full rounded-full overflow-hidden ${barBg}`}>
              <motion.div
                key={`${theme}-${idx}`} // Force re-animation on theme change
                initial={{ width: 0 }}
                whileInView={{ width: `${m.progress || (Math.random() * 40 + 60)}%` }}
                transition={{ duration: 1.5, delay: idx * 0.2 }}
                className={`h-full rounded-full ${colors[idx % colors.length]}`}
              />
            </div>
            <p className={`mt-2 text-xs italic ${subTextColor}`}>{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SKILLS CLOUD ---
export const SkillsCloud: React.FC<{ theme: string, skills: SkillCategory[], ui: UIStrings }> = ({ theme, skills, ui }) => {
  const getIcon = (name: string) => {
    if (name.includes("Leader") || name.includes("領導")) return <Rocket size={18} />;
    if (name.includes("Cloud") || name.includes("雲端")) return <Globe size={18} />;
    if (name.includes("Development") || name.includes("軟體")) return <Code2 size={18} />;
    if (name.includes("AI")) return <Brain size={18} />;
    return <Database size={18} />;
  }

  const [activeCategory, setActiveCategory] = useState(0);
  const isDark = theme === 'dark';
  const isProfessional = theme === 'professional';

  // Styling Logic
  let cardBg = 'bg-[#F5F4F0] border-stone-200';
  let itemBg = 'bg-white border-stone-200 text-stone-700';
  let headingColor = 'text-stone-900';
  let subHeadingColor = 'text-stone-500';
  let activeBtnClass = 'bg-nobel-gold text-white shadow-md';
  let inactiveBtnClass = 'bg-white text-stone-500 border border-stone-200 hover:border-stone-400';
  let dotColor = 'bg-nobel-gold';

  if (isDark) {
    cardBg = 'bg-white/5 border-white/10';
    itemBg = 'bg-white/10 border-white/5 text-gray-200';
    headingColor = 'text-white';
    subHeadingColor = 'text-gray-400';
    activeBtnClass = 'bg-nobel-gold text-white shadow-md';
    inactiveBtnClass = 'bg-white/10 text-gray-400 hover:bg-white/20';
  } else if (isProfessional) {
    cardBg = 'bg-white border-gray-200 shadow-sm';
    itemBg = 'bg-[#f3f2ef] border-gray-300 text-[#191919]';
    headingColor = 'text-[#191919]';
    subHeadingColor = 'text-gray-500';
    activeBtnClass = 'bg-[#0a66c2] text-white shadow-md'; // LinkedIn Blue
    inactiveBtnClass = 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50';
    dotColor = 'bg-[#0a66c2]';
  }

  return (
    <div className={`flex flex-col p-8 rounded-xl border w-full h-full min-h-[400px] ${cardBg}`}>
      <h3 className={`font-serif text-2xl mb-2 ${headingColor}`}>{ui.headings.technicalExpertise}</h3>
      <p className={`${subHeadingColor} text-sm mb-6`}>{ui.headings.expertiseSubtitle}</p>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {skills.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(idx)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeCategory === idx ? activeBtnClass : inactiveBtnClass
              }`}
          >
            {getIcon(cat.name)}
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex-1 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills[activeCategory]?.skills.map((skill, idx) => (
            <motion.div
              key={`${activeCategory}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${itemBg} p-4 rounded-lg border shadow-sm flex items-center gap-3`}
            >
              <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
              <span className="font-medium">{skill}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- CERTIFICATIONS ---
export const CertificationGrid: React.FC<{ theme?: string }> = ({ theme = 'dark' }) => {
  const certs = [
    { code: "CSM", name: "Certified Scrum Master", org: "Scrum Alliance" },
    { code: "CSPO", name: "Certified Scrum Product Owner", org: "Scrum Alliance" },
    { code: "PMP", name: "Project Management Professional", org: "PMI" },
    { code: "MCPD", name: "Microsoft Certified Professional Developer", org: "Microsoft" },
    { code: "MCTS", name: "Microsoft Certified Technology Specialist (C#.NET)", org: "Microsoft" },
    { code: "ITILv3", name: "Information Technology Infrastructure Library", org: "Axelos" },
    { code: "ITSMS", name: "IT Service Management System", org: "ISO/IEC 20000" },
    { code: "BS 10012", name: "Personal Information Management System (PIMS)", org: "BSI" },
    { code: "OCA", name: "Oracle Certified Associate", org: "Oracle" },
  ];

  const isProfessional = theme === 'professional';
  const isDark = theme === 'dark';

  // Styles
  let cardClass = "";
  let codeClass = "";
  let iconClass = "";
  let nameClass = "";
  let orgClass = "";

  if (isDark) {
    cardClass = "group p-4 bg-stone-800 border border-stone-700 rounded-lg hover:border-nobel-gold transition-colors";
    codeClass = "font-bold text-nobel-gold text-lg";
    iconClass = "text-stone-500 group-hover:text-nobel-gold transition-colors";
    nameClass = "text-stone-300 text-sm font-medium leading-tight mb-1";
    orgClass = "text-stone-500 text-xs";
  } else if (isProfessional) {
    // Professional Color Blocks
    cardClass = "group p-4 bg-white shadow-sm hover:shadow-md rounded-lg border-gray-100 border transition-all relative overflow-hidden";
    codeClass = "inline-block px-3 py-1 bg-[#0a66c2] text-white text-xs font-bold rounded mb-2 shadow-sm";
    iconClass = "absolute top-4 right-4 text-gray-300 group-hover:text-[#0a66c2] transition-colors";
    nameClass = "text-gray-800 text-sm font-semibold leading-tight mb-1";
    orgClass = "text-gray-500 text-xs font-mono";
  } else {
    // Light / Hipster styles
    cardClass = "group p-4 bg-white border border-stone-200 rounded-lg hover:border-nobel-gold transition-colors shadow-sm";
    codeClass = "font-bold text-nobel-gold text-lg";
    iconClass = "text-stone-400 group-hover:text-nobel-gold transition-colors";
    nameClass = "text-stone-800 text-sm font-medium leading-tight mb-1";
    orgClass = "text-stone-500 text-xs";
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {certs.map((c, i) => (
        <div key={i} className={cardClass}>
          <div className="flex flex-col items-start relative z-10">
            <span className={codeClass}>{c.code}</span>
            <div className={nameClass}>{c.name}</div>
            <div className={orgClass}>{c.org}</div>
          </div>
          {/* Decorative Icon */}
          <Award size={20} className={iconClass} />
        </div>
      ))}
    </div>
  )
}
