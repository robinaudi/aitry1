
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useMemo } from 'react';
import { HeroScene, AbstractTechScene } from './components/QuantumScene';
import { ImpactMetrics, SkillsCloud, CertificationGrid } from './components/Diagrams';
import { Dashboard } from './components/Dashboard';
import { initialContent } from './content';
import { Theme, Language, ExperienceItem, LocalizedContent } from './types';
import { Menu, X, Linkedin, Coffee, Briefcase, Globe, Palette, Settings, User, ExternalLink, Loader2, Target, CheckCircle2, Lock, Cloud, Database, AlertTriangle } from 'lucide-react';

// Firebase Imports
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

// --- Types & Theme Config ---

const themeStyles: Record<Theme, string> = {
  light: 'bg-[#F9F8F4] text-stone-800',
  dark: 'bg-[#0f172a] text-slate-100',
  professional: 'bg-[#f3f2ef] text-[#191919] font-sans', 
  hipster: 'bg-[#e6e2dd] text-[#5e5a55]',
};

interface ExperienceCardProps {
  item: ExperienceItem;
  delay: string;
  theme: Theme;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ item, delay, theme }) => {
    const isDark = theme === 'dark';
    const isProfessional = theme === 'professional';
    
    let cardClass = 'bg-white border-stone-200 hover:shadow-md'; 
    let textClass = 'text-stone-600';
    let tagClass = 'bg-stone-100 text-stone-500';
    let highlightColor = 'border-l-nobel-gold';
    let titleColor = 'text-stone-900';
    let roleColor = 'text-nobel-gold';
    
    if (isDark) {
        cardClass = 'bg-white/5 border-white/10 hover:bg-white/10';
        textClass = 'text-gray-300';
        tagClass = 'bg-white/10 text-gray-300';
        titleColor = 'text-white';
        roleColor = 'text-nobel-gold';
    } else if (isProfessional) {
        cardClass = 'bg-white border border-gray-300 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded-lg';
        textClass = 'text-[#191919] text-[15px] leading-relaxed';
        tagClass = 'bg-[#f3f2ef] text-[#191919] font-semibold';
        highlightColor = 'border-l-0'; 
        titleColor = 'text-[#191919] font-semibold text-xl';
        roleColor = 'text-[#0a66c2]';
    }

  return (
    <div className={`flex flex-col group animate-fade-in-up p-6 rounded-xl border transition-all duration-300 w-full ${isProfessional ? '' : 'border-l-4'} ${highlightColor} ${cardClass}`} style={{ animationDelay: delay }}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
          <div>
            <h3 className={`font-serif text-2xl mb-1 ${titleColor}`}>{item.company}</h3>
            <p className={`${roleColor} font-bold uppercase tracking-widest text-xs mb-2`}>{item.role}</p>
          </div>
          <div className={`px-3 py-1 text-xs font-mono rounded-full whitespace-nowrap mt-2 md:mt-0 ${tagClass}`}>
            {item.period}
          </div>
      </div>
      
      <ul className="space-y-3 mb-6">
          {item.highlights.map((h, i) => (
              <li key={i} className={`text-sm leading-relaxed flex items-start gap-2 ${textClass}`}>
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isProfessional ? 'bg-[#0a66c2]' : 'bg-stone-300'}`}></span>
                  {h}
              </li>
          ))}
      </ul>
      
      <div className={`mt-auto pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          <p className="text-xs text-stone-400 font-mono">
              <span className={`font-bold ${isProfessional ? 'text-[#0a66c2]' : 'text-nobel-gold'}`}>Tech:</span> {item.stack}
          </p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Feature State
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('professional'); 
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  // Data Logic State
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'cloud' | 'local'>('local');
  const [contentMap, setContentMap] = useState<LocalizedContent>(initialContent);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Derived content
  const content = useMemo(() => contentMap[lang], [contentMap, lang]);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // We don't toggle loading here because we wait for Firestore
    });
    return () => unsubscribe();
  }, []);

  // 2. Data Fetching (Cloud First Strategy)
  useEffect(() => {
    setLoading(true);
    const docRef = doc(db, "portfolio", "main_content");

    console.log("Attempting to connect to Cloud Firestore...");

    const unsubscribe = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
            // SUCCESS: Cloud data found. Use it absolutely.
            const cloudData = docSnap.data() as LocalizedContent;
            console.log("✅ Cloud data loaded successfully.");
            
            // Validate minimal structure
            if (cloudData.en && cloudData.zh) {
                setContentMap(cloudData);
                setDataSource('cloud');
                setErrorMsg(null);
            } else {
                console.warn("⚠️ Cloud data exists but structure is invalid. Using local.");
                setDataSource('local');
            }
        } else {
            // EMPTY DB: This is fine, we use local default, but we tell the user.
            console.log("ℹ️ Database document does not exist yet. Using local defaults.");
            setDataSource('local');
            // We do NOT auto-write here to avoid accidental overwrites. 
            // Writing is handled manually in Dashboard or on first Save.
        }
        setLoading(false);
      }, 
      (err) => {
        console.error("❌ Firestore Error:", err);
        setDataSource('local');
        
        // Critical: Identify Permission Errors
        if (err.code === 'permission-denied') {
            setErrorMsg("Permission Denied: Unable to read Cloud Data. Please check Firestore Rules.");
        } else {
            setErrorMsg(`Connection Error: ${err.message}`);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []); // Run once on mount (snapshot listener handles updates)

  // 3. Save Logic (Full Overwrite)
  const handleUpdateContent = async (newSectionContent: any) => {
    if (!user) {
        alert("Please login to save changes.");
        return;
    }

    const newContentMap = {
        ...contentMap,
        [lang]: newSectionContent
    };

    // Optimistic Update
    setContentMap(newContentMap);

    try {
        const docRef = doc(db, "portfolio", "main_content");
        // Deep copy to remove any undefined/functions
        const cleanData = JSON.parse(JSON.stringify(newContentMap));
        
        // setDoc with NO merge option -> Replaces the entire document.
        // This ensures deleted items are actually deleted in the DB.
        await setDoc(docRef, cleanData); 
        
        // Note: The onSnapshot listener will trigger again, 
        // confirming the data source is 'cloud'.
    } catch (e: any) {
        console.error("Save failed:", e);
        alert(`Save failed: ${e.message}`);
    }
  };

  // 4. Force Reset / Initial Seed (Called from Dashboard)
  const handleForceReset = async () => {
    if (!user) return;
    if (!window.confirm("WARNING: This will overwrite the Cloud Database with the hardcoded 'initialContent' from the code. Are you sure?")) return;

    try {
        const docRef = doc(db, "portfolio", "main_content");
        await setDoc(docRef, initialContent);
        alert("Database successfully reset to local defaults.");
    } catch (e: any) {
        alert("Reset failed: " + e.message);
    }
  };

  const handleLogin = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
        setIsEditorOpen(true);
    } catch (error: any) {
        alert("Login failed: " + error.message);
    }
  };

  const handleLogout = async () => {
      await signOut(auth);
      setIsEditorOpen(false);
  }

  // --- Scroll & Theme Effects ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.className = themeStyles[theme];
  }, [theme]);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
        window.scrollTo({
            top: element.getBoundingClientRect().top + window.pageYOffset - 100,
            behavior: "smooth"
        });
    }
  };

  // Style Helpers
  const isDark = theme === 'dark';
  const isProfessional = theme === 'professional';
  const headingColor = isDark ? 'text-white' : (isProfessional ? 'text-[#191919]' : 'text-stone-900');
  const subHeadingColor = isDark ? 'text-gray-400' : 'text-stone-500';
  const textColor = isDark ? 'text-gray-300' : (isProfessional ? 'text-[#00000099]' : 'text-stone-600');
  const accentColor = isProfessional ? 'text-[#0a66c2]' : 'text-nobel-gold';
  const navBg = scrolled 
    ? (isDark ? 'bg-[#0f172a]/90' : (isProfessional ? 'bg-white shadow-sm' : 'bg-[#F9F8F4]/90')) 
    : 'bg-transparent';

  // --- LOADING SCREEN ---
  if (loading) {
      return (
          <div className={`h-screen w-full flex flex-col items-center justify-center gap-4 ${themeStyles[theme]}`}>
              <Loader2 className="animate-spin text-nobel-gold" size={48} />
              <div className="text-sm font-mono opacity-60">Connecting to Cloud Database...</div>
          </div>
      )
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${themeStyles[theme]} selection:bg-nobel-gold selection:text-white`}>
      
      {/* ERROR BANNER (Permission Denied) */}
      {errorMsg && (
        <div className="bg-red-600 text-white text-xs font-bold text-center px-4 py-2 flex items-center justify-center gap-2">
            <AlertTriangle size={16} />
            {errorMsg}
        </div>
      )}

      {/* Admin Dashboard */}
      <Dashboard 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        content={content} 
        onUpdate={handleUpdateContent}
        onLogout={handleLogout}
        user={user}
        // New prop for forcing reset
        onForceReset={handleForceReset}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md transition-all duration-300 ${navBg} ${errorMsg ? 'top-8' : 'top-0'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-xl shadow-sm ${isDark ? 'bg-white/10 text-nobel-gold' : (isProfessional ? 'bg-[#0a66c2] text-white' : 'bg-stone-900 text-nobel-gold')}`}>RH</div>
            <span className={`font-serif font-bold text-lg tracking-wide ${headingColor}`}>
              ROBIN HSU
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium tracking-wide">
             {/* Main Links */}
            <div className={`flex gap-6 ${isProfessional ? 'text-[#00000099] font-sans' : textColor}`}>
                <a href="#about" onClick={scrollToSection('about')} className={`hover:${accentColor} transition-colors`}>{content.ui.nav.about}</a>
                <a href="#experience" onClick={scrollToSection('experience')} className={`hover:${accentColor} transition-colors`}>{content.ui.nav.experience}</a>
                <a href="#skills" onClick={scrollToSection('skills')} className={`hover:${accentColor} transition-colors`}>{content.ui.nav.expertise}</a>
            </div>

            <div className={`h-4 w-px mx-2 bg-stone-300`}></div>

            {/* Controls */}
            <div className="flex items-center gap-3">
                
                {/* Data Source Indicator */}
                <div 
                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold border tracking-wider select-none ${
                        dataSource === 'cloud' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-stone-100 text-stone-500 border-stone-200'
                    }`}
                    title={dataSource === 'cloud' ? 'Data loaded from Firestore' : 'Data loaded from local file'}
                >
                    {dataSource === 'cloud' ? <Cloud size={10} className="fill-green-500 stroke-green-600" /> : <Database size={10} />}
                    {dataSource === 'cloud' ? 'CLOUD' : 'LOCAL'}
                </div>

                {/* Language Switcher */}
                <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className={`flex items-center gap-1 hover:${accentColor}`} title="Switch Language">
                    <Globe size={16} /> <span className="uppercase">{lang === 'en' ? '中' : 'EN'}</span>
                </button>

                {/* Theme Switcher */}
                <div className="relative group">
                    <button className={`flex items-center gap-1 hover:${accentColor}`}>
                        <Palette size={16} />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-xl py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all text-stone-800 border border-stone-100">
                        {(['light', 'dark', 'professional', 'hipster'] as Theme[]).map(t => (
                            <button key={t} onClick={() => setTheme(t)} className={`block w-full text-left px-4 py-2 text-xs uppercase hover:bg-stone-100 ${theme === t ? 'text-nobel-gold font-bold' : ''}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                 {/* Admin Login - Explicit Text */}
                 {user ? (
                     <button onClick={() => setIsEditorOpen(true)} className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-full text-xs font-bold hover:bg-green-700 shadow-sm">
                        <Settings size={12} /> EDITOR
                     </button>
                 ) : (
                     <button onClick={handleLogin} className={`flex items-center gap-1 px-3 py-1 rounded-full border border-transparent hover:border-gray-300 hover:bg-gray-100 transition-all ${isProfessional ? 'text-[#0a66c2]' : textColor}`} title={content.ui.nav.admin}>
                        <Lock size={14} />
                        <span className="text-xs font-bold uppercase">{content.ui.nav.admin}</span>
                     </button>
                 )}
            </div>
          </div>

          <button className={`md:hidden p-2 ${headingColor}`} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
            <div className={`md:hidden absolute top-full left-0 right-0 p-4 shadow-lg border-t transition-all duration-300 ${isDark ? 'bg-[#0f172a] border-white/10' : (isProfessional ? 'bg-white border-gray-100' : 'bg-[#F9F8F4] border-stone-200')}`}>
                <div className="flex flex-col gap-4">
                    <a href="#about" onClick={scrollToSection('about')} className={`py-2 px-4 rounded hover:bg-black/5 ${textColor}`}>{content.ui.nav.about}</a>
                    <a href="#experience" onClick={scrollToSection('experience')} className={`py-2 px-4 rounded hover:bg-black/5 ${textColor}`}>{content.ui.nav.experience}</a>
                    <a href="#skills" onClick={scrollToSection('skills')} className={`py-2 px-4 rounded hover:bg-black/5 ${textColor}`}>{content.ui.nav.expertise}</a>
                    <div className="h-px bg-stone-200 my-2"></div>
                    {/* Mobile Controls */}
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                             {/* Mobile Source Indicator */}
                             <div 
                                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border tracking-wider ${
                                    dataSource === 'cloud' 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-stone-100 text-stone-500 border-stone-200'
                                }`}
                            >
                                {dataSource === 'cloud' ? 'CLOUD' : 'LOCAL'}
                            </div>
                            <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className={`flex items-center gap-2 ${textColor}`}>
                                <Globe size={18} /> {lang === 'en' ? '中文' : 'English'}
                            </button>
                        </div>
                        
                        <div className="flex gap-2">
                            {(['light', 'dark', 'professional', 'hipster'] as Theme[]).map(t => (
                                <button key={t} onClick={() => setTheme(t)} className={`w-6 h-6 rounded-full border ${theme === t ? 'border-nobel-gold ring-1 ring-nobel-gold' : 'border-gray-300'}`} style={{ backgroundColor: t === 'dark' ? '#1a1a1a' : (t === 'professional' ? '#f3f2ef' : '#F9F8F4') }}></button>
                            ))}
                        </div>
                    </div>
                     {/* Mobile Admin Login */}
                     <div className="px-4 mt-2">
                         {user ? (
                             <button onClick={() => { setIsEditorOpen(true); setMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-bold">
                                <Settings size={14} /> Open Editor
                             </button>
                         ) : (
                             <button onClick={handleLogin} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200">
                                <Lock size={14} /> Admin Login
                             </button>
                         )}
                     </div>
                </div>
            </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Render Scene based on Theme */}
        <HeroScene />
        
        {/* Gradient Overlay based on Theme */}
        <div className={`absolute inset-0 z-0 pointer-events-none 
            ${isDark 
                ? 'bg-gradient-to-b from-transparent via-[#0f172a]/50 to-[#0f172a]' 
                : (isProfessional ? 'bg-[#f3f2ef]/50' : 'bg-[radial-gradient(circle_at_center,rgba(249,248,244,0.85)_0%,rgba(249,248,244,0.4)_60%,rgba(249,248,244,0)_100%)]')
            }`} 
        />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className={`inline-block mb-4 px-4 py-1 border text-xs tracking-[0.2em] uppercase font-bold rounded-full backdrop-blur-sm 
            ${isDark 
                ? 'border-white/20 text-gray-300 bg-black/20' 
                : (isProfessional ? 'border-gray-300 text-gray-600 bg-white shadow-sm' : 'border-stone-300 text-stone-500 bg-white/40')
            }`}>
            {content.hero.experienceBadge}
          </div>
          <h1 className={`font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-tight mb-6 drop-shadow-sm ${headingColor}`}>
            {content.hero.name} {content.hero.nameZh && <span className="text-4xl md:text-6xl text-stone-400 font-light block md:inline mt-2 md:mt-0 opacity-80">{content.hero.nameZh}</span>}<br/>
            <span className={`font-normal text-2xl md:text-3xl block mt-6 font-sans tracking-tight ${subHeadingColor}`}>{content.hero.subtitle}</span>
          </h1>
          <p className={`max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed mb-10 ${textColor}`}>
            {content.hero.title}
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
             <a href="#experience" onClick={scrollToSection('experience')} className={`px-8 py-3 rounded-full transition-all shadow-lg text-sm font-bold tracking-widest uppercase 
                ${isDark 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : (isProfessional ? 'bg-[#0a66c2] text-white hover:bg-[#004182]' : 'bg-stone-900 text-white hover:bg-stone-800')
                }`}>
                {content.hero.cta}
             </a>
             <div className="flex gap-4 mt-4 md:mt-0">
                 <a href="https://dada-fly.com/tw/mentors/robinhsu/sessions/a-first-look-at-career-counseling-1cb94db971d0" target="_blank" rel="noopener noreferrer" className={`p-3 rounded-full transition-colors shadow-sm 
                    ${isDark 
                        ? 'bg-white/10 text-white hover:bg-white/20' 
                        : (isProfessional ? 'bg-white text-[#0a66c2] border border-gray-200 hover:bg-blue-50' : 'bg-white text-stone-600 hover:text-nobel-gold border border-stone-200')
                    }`}><Coffee size={20} /></a>
                 <a href="https://www.linkedin.com/in/robin-hsu-2b59a9a5/" target="_blank" rel="noopener noreferrer" className={`p-3 rounded-full transition-colors shadow-sm 
                    ${isDark 
                        ? 'bg-white/10 text-white hover:bg-white/20' 
                        : (isProfessional ? 'bg-white text-[#0a66c2] border border-gray-200 hover:bg-blue-50' : 'bg-white text-stone-600 hover:text-nobel-gold border border-stone-200')
                    }`}><Linkedin size={20} /></a>
             </div>
          </div>
        </div>
      </header>

      <main>
        {/* Introduction */}
        <section id="about" className={`py-24 ${isDark ? 'bg-transparent' : (isProfessional ? 'bg-white border-b border-gray-200' : 'bg-white')}`}>
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4">
              <div className={`inline-block mb-3 text-xs font-bold tracking-widest uppercase ${accentColor}`}>Professional Profile</div>
              <h2 className={`font-serif text-4xl mb-6 leading-tight ${headingColor}`}>{content.about.title}</h2>
              <div className={`w-16 h-1 mb-6 ${isProfessional ? 'bg-[#0a66c2]' : 'bg-nobel-gold'}`}></div>
              <p className={`${subHeadingColor} italic`}>
                "{content.about.quote}"
              </p>
            </div>
            <div className={`md:col-span-8 text-lg leading-relaxed space-y-6 ${textColor}`}>
              {lang === 'en' ? (
                  <p>
                    <span className={`text-5xl float-left mr-3 mt-[-8px] font-serif ${accentColor}`}>W</span>{content.about.summary.substring(1)}
                  </p>
              ) : (
                  <div className="flex gap-4">
                     <div className={`${accentColor} pt-1`}><Target size={32} strokeWidth={1.5} /></div>
                     <p>{content.about.summary}</p>
                  </div>
              )}
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
                  {content.about.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className={`${accentColor} mt-1 flex-shrink-0`} size={18} />
                        <span>{point}</span>
                      </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Impact & Skills */}
        <section id="skills" className={`py-24 border-t ${isDark ? 'border-white/10' : (isProfessional ? 'bg-[#f3f2ef] border-gray-200' : 'bg-[#F9F8F4] border-stone-200')}`}>
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ImpactMetrics metrics={content.metrics} theme={theme} ui={content.ui} />
                    <SkillsCloud theme={theme} skills={content.skills} ui={content.ui} />
                </div>
            </div>
        </section>

        {/* Experience */}
        <section id="experience" className={`py-24 border-t ${isDark ? 'bg-transparent border-white/10' : (isProfessional ? 'bg-white border-gray-200' : 'bg-white border-stone-200')}`}>
             <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className={`inline-block mb-3 text-xs font-bold tracking-widest uppercase ${subHeadingColor}`}>{content.experience.subtitle}</div>
                    <h2 className={`font-serif text-4xl md:text-5xl mb-4 ${headingColor}`}>{content.experience.title}</h2>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    {content.experience.items.map((item, idx) => (
                        <ExperienceCard 
                            key={item.id}
                            item={item}
                            theme={theme}
                            delay={`${idx * 0.1}s`}
                        />
                    ))}
                </div>
             </div>
        </section>

        {/* Certifications & Education */}
        <section className={`py-24 overflow-hidden relative ${isDark ? 'bg-stone-900' : (isProfessional ? 'bg-[#f3f2ef]' : 'bg-[#e7e5e4]')}`}>
             <div className={`absolute top-0 right-0 w-1/2 h-full transition-opacity duration-700 ${!isProfessional ? 'opacity-30' : 'opacity-0 pointer-events-none'}`}>
                 <AbstractTechScene />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                     {/* Education & Teaching Column */}
                     <div>
                        <h2 className={`font-serif text-4xl mb-6 ${isDark ? 'text-white' : 'text-[#191919]'}`}>{content.ui.headings.education}</h2>
                        
                        {/* Education Items */}
                        <div className="mb-10 space-y-6">
                             <h3 className={`text-xl font-serif mb-2 ${isDark ? 'text-white' : 'text-[#191919]'}`}>{content.ui.headings.educationSubtitle}</h3>
                             {content.education.map((edu, index) => (
                                 <div key={index} className={`p-4 border rounded-lg backdrop-blur-sm ${
                                     isDark 
                                        ? 'border-stone-700 bg-stone-800/50' 
                                        : (isProfessional ? 'bg-white border-gray-200 shadow-sm' : 'bg-white border-stone-200 shadow-sm')
                                 }`}>
                                    <div className={`font-bold text-lg ${isDark ? 'text-nobel-gold' : (isProfessional ? 'text-[#0a66c2]' : 'text-nobel-gold')}`}>{edu.school}</div>
                                    <div className={`font-medium ${isDark ? 'text-stone-300' : 'text-stone-800'}`}>{edu.degree}</div>
                                    {edu.note && <div className={`text-sm mt-2 italic ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>{edu.note}</div>}
                                 </div>
                             ))}
                        </div>
                        
                        {/* Teaching Items */}
                        <div className="mb-10 space-y-6">
                             <h3 className={`text-xl font-serif mb-2 ${isDark ? 'text-white' : 'text-[#191919]'}`}>{content.ui.headings.teaching}</h3>
                             {content.teaching.map((teach, index) => (
                                 <div key={index} className={`p-4 border rounded-lg backdrop-blur-sm ${
                                     isDark 
                                        ? 'border-stone-700 bg-stone-800/50' 
                                        : (isProfessional ? 'bg-white border-gray-200 shadow-sm' : 'bg-white border-stone-200 shadow-sm')
                                 }`}>
                                    <div className={`flex justify-between items-start mb-1`}>
                                        <div className={`font-bold text-lg ${isDark ? 'text-nobel-gold' : (isProfessional ? 'text-[#0a66c2]' : 'text-nobel-gold')}`}>{teach.role}</div>
                                        <div className={`text-xs px-2 py-1 rounded ${
                                            isDark 
                                                ? 'text-stone-400 bg-stone-900/50' 
                                                : 'bg-stone-100 text-stone-600'
                                        }`}>{teach.period}</div>
                                    </div>
                                    <div className={`font-medium ${isDark ? 'text-stone-300' : 'text-stone-800'}`}>{teach.school}</div>
                                    <div className={`text-sm mt-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>{teach.subject}</div>
                                    <div className={`text-xs mt-1 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>{teach.location}</div>
                                 </div>
                             ))}
                        </div>
                     </div>

                     {/* Certifications Column */}
                     <div>
                        <div className="h-full flex flex-col justify-center">
                            <CertificationGrid theme={theme} />
                        </div>
                     </div>
                </div>
            </div>
        </section>

        {/* Footer */}
        <section id="contact" className={`py-24 border-t ${isDark ? 'bg-transparent border-white/10' : (isProfessional ? 'bg-white border-gray-200' : 'bg-white border-stone-200')}`}>
             <div className="container mx-auto px-6 text-center">
                 <h2 className={`font-serif text-4xl mb-8 ${headingColor}`}>{content.contact.title}</h2>
                 <p className={`max-w-xl mx-auto mb-12 ${textColor}`}>
                    {content.ui.headings.contactSubtitle}
                 </p>
                 <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                     <a href="https://www.linkedin.com/in/robin-hsu-2b59a9a5/" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 px-6 py-4 rounded-lg transition-colors border w-full md:w-auto justify-center group
                        ${isDark 
                            ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                            : (isProfessional ? 'bg-white border-gray-200 hover:border-[#0a66c2] text-[#191919] hover:bg-blue-50' : 'bg-[#F9F8F4] border-stone-200 hover:bg-stone-100 text-stone-800')
                        }`}>
                        <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${isProfessional ? 'bg-[#0a66c2] text-white' : 'bg-stone-900 text-white'}`}>
                            IN
                        </div>
                        <span className="font-medium group-hover:text-[#0a66c2] transition-colors">LinkedIn Profile</span>
                        <ExternalLink size={16} className="opacity-50" />
                    </a>
                    <a href="https://dada-fly.com/tw/mentors/robinhsu" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 px-6 py-4 rounded-lg transition-colors border w-full md:w-auto justify-center group
                        ${isDark 
                            ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                            : (isProfessional ? 'bg-white border-gray-200 hover:border-[#0a66c2] text-[#191919] hover:bg-blue-50' : 'bg-[#F9F8F4] border-stone-200 hover:bg-stone-100 text-stone-800')
                        }`}>
                        <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${isProfessional ? 'bg-[#0a66c2] text-white' : 'bg-stone-900 text-white'}`}>
                            DF
                        </div>
                        <span className="font-medium group-hover:text-[#0a66c2] transition-colors">Dada Fly Profile</span>
                        <ExternalLink size={16} className="opacity-50" />
                    </a>
                     <a href="https://dada-fly.com/tw/mentors/robinhsu/sessions/a-first-look-at-career-counseling-1cb94db971d0" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 px-6 py-4 rounded-lg transition-colors border w-full md:w-auto justify-center 
                        ${isDark 
                            ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                            : (isProfessional ? 'bg-white border-gray-200 hover:border-[#0a66c2] text-[#191919] hover:bg-blue-50' : 'bg-[#F9F8F4] border-stone-200 hover:bg-stone-100 text-stone-800')
                        }`}>
                        <Coffee size={20} className={accentColor} />
                        <span className="font-medium">{content.contact.emailBtn}</span>
                    </a>
                 </div>
             </div>
        </section>

      </main>

      <footer className={`py-12 border-t ${isDark ? 'bg-stone-900 text-stone-400 border-stone-800' : (isProfessional ? 'bg-white text-gray-500 border-gray-200' : 'bg-[#e7e5e4] text-stone-600 border-stone-300')}`}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
                <div className={`${isDark ? 'text-white' : 'text-stone-800'} font-serif font-bold text-xl mb-1`}>ROBIN HSU</div>
                <p className="text-xs text-stone-500 uppercase tracking-widest">Senior Technology Executive</p>
            </div>
             {/* Admin Link in Footer for Backup Access */}
             <div className="flex gap-4 items-center">
                 <button onClick={user ? () => setIsEditorOpen(true) : handleLogin} className="text-xs text-stone-400 hover:text-stone-600 flex items-center gap-1">
                     <Lock size={10} /> {user ? 'CMS Editor' : 'Admin'}
                 </button>
                 <div className="text-xs text-stone-500">
                     © {new Date().getFullYear()} Robin Hsu. {content.ui.footer.rights}
                 </div>
             </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
