'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Brain, Cpu, Globe, Lock, Zap, BarChart } from 'lucide-react';
import { useEffect } from 'react';

const featuresList = [
    {
        icon: <Brain className="w-8 h-8 text-violet-400" />,
        title: 'Psychological Profiling',
        desc: 'Our assessment analyzes your cognitive style through everyday scenarios—no technical knowledge required.'
    },
    {
        icon: <Cpu className="w-8 h-8 text-blue-400" />,
        title: 'Archetype Matching',
        desc: 'We map your answers to 6 core work archetypes (Architect, Creator, Detective, Optimizer, Conductor, Pioneer) for precise career alignment.'
    },
    {
        icon: <Globe className="w-8 h-8 text-emerald-400" />,
        title: '60+ Career Paths',
        desc: 'Match with careers across 15 categories including Development, Data, Security, Design, Social Media, and more.'
    },
    {
        icon: <Lock className="w-8 h-8 text-rose-400" />,
        title: 'Privacy First',
        desc: 'No signup required. Your answers are processed and never stored. Take the assessment completely anonymously.'
    },
    {
        icon: <Zap className="w-8 h-8 text-amber-400" />,
        title: '5-Minute Assessment',
        desc: '20 carefully crafted questions that shuffle each session—quick, engaging, and impossible to game.'
    },
    {
        icon: <BarChart className="w-8 h-8 text-cyan-400" />,
        title: 'Skills Gap Analysis',
        desc: "See not just where you fit, but what skills you'd need to develop for each recommended career path."
    }
];

export default function FeaturesPage() {
    useEffect(() => {
        document.title = 'Features | JobMatch';
    }, []);

    return (
        <div className="min-h-screen bg-[rgb(var(--bg-base))] text-[rgb(var(--text-primary))] flex flex-col">
            <Header />

            <main className="flex-grow pt-32 pb-24 px-6 container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gradient">
                        How It Works
                    </h1>
                    <p className="text-xl text-[rgb(var(--text-muted))]">
                        Discover what makes our career matching different from traditional assessments.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {featuresList.map((f, i) => (
                        <div key={i} className="card p-8 hover:border-[rgb(var(--accent))]/30 transition-all hover:-translate-y-1 group">
                            <div className="mb-6 bg-[rgb(var(--bg-elevated))] w-16 h-16 rounded-xl flex items-center justify-center border border-[rgb(var(--border-subtle))] group-hover:scale-110 transition-transform">
                                {f.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-[rgb(var(--text-primary))]">{f.title}</h3>
                            <p className="text-[rgb(var(--text-muted))] leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}

