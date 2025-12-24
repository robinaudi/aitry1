
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { X, Save, LogOut, Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { ContentData, ExperienceItem, MetricItem, SkillCategory, EducationItem, TeachingItem } from '../types';

interface DashboardProps {
    isOpen: boolean;
    onClose: () => void;
    content: ContentData;
    onUpdate: (newContent: ContentData) => void;
    onLogout: () => void;
    user: any;
}

// --- Helper Components ---

const Label = ({ children }: { children?: React.ReactNode }) => (
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 mt-4">{children}</label>
);

const Input = ({ value, onChange, placeholder = "" }: { value: string, onChange: (val: string) => void, placeholder?: string }) => (
    <input 
        type="text" 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 text-sm border border-gray-200 rounded bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
    />
);

const TextArea = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
    <textarea 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 text-sm border border-gray-200 rounded bg-white focus:border-blue-500 outline-none min-h-[80px]"
    />
);

// --- Generic Array Editor (Strings) ---
const StringArrayEditor = ({ items, onChange }: { items: string[], onChange: (items: string[]) => void }) => {
    const handleChange = (idx: number, val: string) => {
        const newItems = [...items];
        newItems[idx] = val;
        onChange(newItems);
    };

    const handleAdd = () => onChange([...items, "New Item"]);
    const handleRemove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

    return (
        <div className="space-y-2">
            {items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                    <Input value={item} onChange={(val) => handleChange(idx, val)} />
                    <button onClick={() => handleRemove(idx)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
            ))}
            <button onClick={handleAdd} className="text-xs flex items-center gap-1 text-blue-600 font-bold mt-2 hover:bg-blue-50 px-2 py-1 rounded">
                <Plus size={14} /> Add Item
            </button>
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ isOpen, onClose, content, onUpdate, onLogout, user }) => {
    // Local state to handle edits before saving
    const [localContent, setLocalContent] = useState<ContentData>(content);
    const [activeTab, setActiveTab] = useState<keyof ContentData | 'ui'>('hero');

    // Sync local state when content prop updates (e.g. language switch)
    useEffect(() => {
        setLocalContent(content);
    }, [content]);

    if (!isOpen) return null;

    const handleSave = () => {
        onUpdate(localContent);
    };

    const updateSection = (section: keyof ContentData, updates: any) => {
        setLocalContent(prev => ({ ...prev, [section]: { ...prev[section], ...updates } }));
    };

    // --- Tab Content Renderers ---

    const renderHero = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold mb-6">Hero Section</h2>
            <Label>Name (Display)</Label>
            <Input value={localContent.hero.name} onChange={(v) => updateSection('hero', { name: v })} />
            
            <Label>Chinese Name (Optional)</Label>
            <Input value={localContent.hero.nameZh} onChange={(v) => updateSection('hero', { nameZh: v })} />
            
            <Label>Experience Badge Text</Label>
            <Input value={localContent.hero.experienceBadge} onChange={(v) => updateSection('hero', { experienceBadge: v })} />
            
            <Label>Job Titles (Pipe Separated)</Label>
            <Input value={localContent.hero.title} onChange={(v) => updateSection('hero', { title: v })} />
            
            <Label>Subtitle / Slogan</Label>
            <Input value={localContent.hero.subtitle} onChange={(v) => updateSection('hero', { subtitle: v })} />
            
            <Label>CTA Button Text</Label>
            <Input value={localContent.hero.cta} onChange={(v) => updateSection('hero', { cta: v })} />
        </div>
    );

    const renderAbout = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold mb-6">About Section</h2>
            <Label>Section Title</Label>
            <Input value={localContent.about.title} onChange={(v) => updateSection('about', { title: v })} />

            <Label>Quote</Label>
            <TextArea value={localContent.about.quote} onChange={(v) => updateSection('about', { quote: v })} />

            <Label>Summary Paragraph</Label>
            <TextArea value={localContent.about.summary} onChange={(v) => updateSection('about', { summary: v })} />

            <Label>Key Bullet Points</Label>
            <StringArrayEditor 
                items={localContent.about.points} 
                onChange={(newPoints) => updateSection('about', { points: newPoints })} 
            />
        </div>
    );

    const renderMetrics = () => {
        const updateMetric = (idx: number, field: keyof MetricItem, val: any) => {
            const newMetrics = [...localContent.metrics];
            newMetrics[idx] = { ...newMetrics[idx], [field]: val };
            setLocalContent({ ...localContent, metrics: newMetrics });
        };

        return (
            <div className="space-y-6">
                <h2 className="text-xl font-serif font-bold mb-6">Impact Metrics</h2>
                {localContent.metrics.map((m, idx) => (
                    <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                        <Label>Metric Label</Label>
                        <Input value={m.label} onChange={(v) => updateMetric(idx, 'label', v)} />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Value</Label><Input value={m.value} onChange={(v) => updateMetric(idx, 'value', v)} /></div>
                            <div><Label>Suffix</Label><Input value={m.suffix} onChange={(v) => updateMetric(idx, 'suffix', v)} /></div>
                        </div>

                        <Label>Description</Label>
                        <Input value={m.desc} onChange={(v) => updateMetric(idx, 'desc', v)} />
                        
                        <Label>Progress Bar %</Label>
                        <Input value={m.progress?.toString() || '0'} onChange={(v) => updateMetric(idx, 'progress', parseInt(v) || 0)} />
                    </div>
                ))}
            </div>
        );
    };

    const renderSkills = () => {
        const updateSkillCat = (idx: number, field: keyof SkillCategory, val: any) => {
            const newSkills = [...localContent.skills];
            newSkills[idx] = { ...newSkills[idx], [field]: val };
            setLocalContent({ ...localContent, skills: newSkills });
        };
        
        const moveCat = (idx: number, dir: -1 | 1) => {
            if ((idx === 0 && dir === -1) || (idx === localContent.skills.length - 1 && dir === 1)) return;
            const newSkills = [...localContent.skills];
            const temp = newSkills[idx];
            newSkills[idx] = newSkills[idx + dir];
            newSkills[idx + dir] = temp;
            setLocalContent({ ...localContent, skills: newSkills });
        }

        return (
            <div className="space-y-6">
                <h2 className="text-xl font-serif font-bold mb-6">Skills & Expertise</h2>
                {localContent.skills.map((cat, idx) => (
                    <div key={idx} className="p-4 border rounded-lg bg-gray-50 relative">
                        <div className="absolute right-2 top-2 flex gap-1">
                             <button onClick={() => moveCat(idx, -1)} className="p-1 text-gray-400 hover:text-gray-700"><ChevronUp size={16}/></button>
                             <button onClick={() => moveCat(idx, 1)} className="p-1 text-gray-400 hover:text-gray-700"><ChevronDown size={16}/></button>
                        </div>

                        <Label>Category Name</Label>
                        <Input value={cat.name} onChange={(v) => updateSkillCat(idx, 'name', v)} />

                        <Label>Skills List</Label>
                        <StringArrayEditor 
                            items={cat.skills} 
                            onChange={(items) => updateSkillCat(idx, 'skills', items)} 
                        />
                    </div>
                ))}
                <button 
                    onClick={() => setLocalContent({...localContent, skills: [...localContent.skills, { name: 'New Category', skills: ['Skill 1'] }]})}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 font-bold"
                >
                    + Add Category
                </button>
            </div>
        );
    };

    const renderExperience = () => {
        const updateExp = (idx: number, field: keyof ExperienceItem, val: any) => {
            const newItems = [...localContent.experience.items];
            newItems[idx] = { ...newItems[idx], [field]: val };
            setLocalContent({ ...localContent, experience: { ...localContent.experience, items: newItems } });
        };

        const addExp = () => {
            const newItem: ExperienceItem = {
                id: Date.now().toString(),
                company: "New Company",
                role: "Role",
                period: "2024",
                highlights: ["Achievement 1"],
                stack: "Tech Stack"
            };
            setLocalContent({ ...localContent, experience: { ...localContent.experience, items: [newItem, ...localContent.experience.items] } });
        };

        const removeExp = (idx: number) => {
            const newItems = localContent.experience.items.filter((_, i) => i !== idx);
            setLocalContent({ ...localContent, experience: { ...localContent.experience, items: newItems } });
        };

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-serif font-bold">Experience</h2>
                    <button onClick={addExp} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">+ Add Job</button>
                </div>

                <div className="mb-6 p-4 border rounded bg-white">
                    <Label>Section Title</Label>
                    <Input value={localContent.experience.title} onChange={(v) => updateSection('experience', { title: v })} />
                    <Label>Subtitle</Label>
                    <Input value={localContent.experience.subtitle} onChange={(v) => updateSection('experience', { subtitle: v })} />
                </div>

                {localContent.experience.items.map((item, idx) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-gray-50 relative group">
                         <button 
                            onClick={() => removeExp(idx)} 
                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={20} />
                        </button>

                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Company</Label><Input value={item.company} onChange={(v) => updateExp(idx, 'company', v)} /></div>
                            <div><Label>Role</Label><Input value={item.role} onChange={(v) => updateExp(idx, 'role', v)} /></div>
                        </div>
                        <Label>Period</Label>
                        <Input value={item.period} onChange={(v) => updateExp(idx, 'period', v)} />

                        <Label>Highlights</Label>
                        <StringArrayEditor items={item.highlights} onChange={(v) => updateExp(idx, 'highlights', v)} />

                        <Label>Tech Stack</Label>
                        <Input value={item.stack} onChange={(v) => updateExp(idx, 'stack', v)} />
                    </div>
                ))}
            </div>
        );
    };

    const renderEducation = () => {
         // Generic handler for education array
         const updateEdu = (idx: number, field: keyof EducationItem, val: string) => {
            const newEdu = [...localContent.education];
            newEdu[idx] = { ...newEdu[idx], [field]: val };
            setLocalContent({ ...localContent, education: newEdu });
        };

        return (
            <div className="space-y-6">
                <h2 className="text-xl font-serif font-bold mb-6">Education</h2>
                {localContent.education.map((edu, idx) => (
                    <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                        <Label>School</Label>
                        <Input value={edu.school} onChange={(v) => updateEdu(idx, 'school', v)} />
                        <Label>Degree</Label>
                        <Input value={edu.degree} onChange={(v) => updateEdu(idx, 'degree', v)} />
                        <Label>Note / Awards</Label>
                        <TextArea value={edu.note || ''} onChange={(v) => updateEdu(idx, 'note', v)} />
                    </div>
                ))}
            </div>
        )
    };
    
    const renderContact = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold mb-6">Contact Section</h2>
            <Label>Title</Label>
            <Input value={localContent.contact.title} onChange={(v) => updateSection('contact', { title: v })} />
            
            <Label>Subtitle</Label>
            <TextArea value={localContent.contact.subtitle} onChange={(v) => updateSection('contact', { subtitle: v })} />
            
            <Label>Button Text</Label>
            <Input value={localContent.contact.emailBtn} onChange={(v) => updateSection('contact', { emailBtn: v })} />
        </div>
    );

    // --- Sidebar Nav Items ---
    const navItems: { id: keyof ContentData; label: string }[] = [
        { id: 'hero', label: 'Hero' },
        { id: 'about', label: 'About' },
        { id: 'metrics', label: 'Metrics' },
        { id: 'skills', label: 'Skills' },
        { id: 'experience', label: 'Experience' },
        { id: 'education', label: 'Education' },
        { id: 'contact', label: 'Contact' },
    ];

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex justify-end">
            <div className="w-full md:w-[900px] bg-white h-full shadow-2xl flex flex-col md:flex-row animate-slide-in-right overflow-hidden">
                
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 h-full">
                    <div className="p-6 border-b border-slate-800">
                        <h2 className="text-white font-bold tracking-wider">CMS DASHBOARD</h2>
                        <div className="text-xs text-slate-500 mt-1 truncate">{user?.email}</div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto py-4">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${
                                    activeTab === item.id 
                                    ? 'bg-blue-600 text-white border-l-4 border-white' 
                                    : 'hover:bg-slate-800 text-slate-400'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-t border-slate-800">
                        <button onClick={onLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 w-full px-2 py-2">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col h-full bg-white relative">
                    {/* Header */}
                    <div className="h-16 border-b flex justify-between items-center px-6 bg-white shrink-0">
                        <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                            Editing: <span className="text-black">{activeTab}</span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Form Area */}
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                        <div className="max-w-3xl mx-auto">
                            {activeTab === 'hero' && renderHero()}
                            {activeTab === 'about' && renderAbout()}
                            {activeTab === 'metrics' && renderMetrics()}
                            {activeTab === 'skills' && renderSkills()}
                            {activeTab === 'experience' && renderExperience()}
                            {activeTab === 'education' && renderEducation()}
                            {activeTab === 'contact' && renderContact()}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t bg-white flex justify-end gap-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm">
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
