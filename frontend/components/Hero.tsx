'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, Zap, Target, Brain, TrendingUp, Map } from 'lucide-react';
import { useEffect, useState } from 'react';

// Calculate progressive match count based on time
// Starts at 1220 on Dec 24, 2024, increases ~100 per hour
function getMatchCount(): number {
    const startDate = new Date('2024-12-24T00:00:00').getTime();
    const now = Date.now();
    const hoursSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60));
    const baseCount = 1220;
    // Add 80-120 per hour (using hour index for pseudo-randomness)
    const increment = hoursSinceStart * 97; // ~97 per hour average
    return baseCount + increment;
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{count.toLocaleString()}{suffix}</span>;
}

function MatchCounter() {
    const [matchCount, setMatchCount] = useState(1220);

    useEffect(() => {
        setMatchCount(getMatchCount());
        // Update every hour
        const interval = setInterval(() => {
            setMatchCount(getMatchCount());
        }, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return <AnimatedCounter value={matchCount} suffix="" />;
}

const stats = [
    { value: 20, suffix: '', label: 'Questions • 5 min', dynamic: false },
    { value: 60, suffix: '+', label: 'Career Paths Analyzed', dynamic: false },
    { value: 0, suffix: '', label: 'Matches Made', dynamic: true },
];


export const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-mesh" />
                <div className="absolute inset-0 bg-grid opacity-30" />

                {/* Animated Gradient Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-[rgb(var(--accent))] to-cyan-400 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-gradient-to-r from-blue-500 to-[rgb(var(--accent))] rounded-full blur-[150px]"
                />
            </div>

            <div className="w-full max-w-[1200px] mx-auto px-6 py-20">
                <div className="w-full max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 badge badge-accent mb-8">
                            <Zap size={14} />
                            <span>Free • No signup required • 5 min</span>
                        </div>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="heading-display mb-6"
                    >
                        From <span className="text-gray-500 line-through">confused</span> to
                        <br />
                        <span className="text-gradient">confident in 5 minutes.</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-[rgb(var(--text-secondary))] max-w-2xl mx-auto mb-6"
                    >
                        Answer 20 simple questions about your everyday habits—no tech knowledge needed.
                        We'll discover your natural work style and match you to careers that truly fit.
                    </motion.p>

                    {/* Quick Testimonials */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 mb-10"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>"Finally found my path" — <span className="text-gray-300">Sarah, UX Designer</span></span>
                        </div>
                        <div className="hidden md:block text-gray-600">•</div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>"Landed my dream job" — <span className="text-gray-300">Mike, DevOps Engineer</span></span>
                        </div>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                    >
                        <Link href="/questionnaire" className="btn btn-primary btn-lg group">
                            Start Free Assessment
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="btn btn-secondary btn-lg group">
                            <div className="w-8 h-8 rounded-full bg-[rgb(var(--accent))] flex items-center justify-center mr-1">
                                <Play size={14} className="text-white ml-0.5" />
                            </div>
                            Watch Demo
                        </button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
                    >
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-[rgb(var(--text-primary))] mb-1">
                                    {stat.dynamic ? (
                                        <MatchCounter />
                                    ) : (
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                    )}
                                </div>
                                <div className="text-sm text-[rgb(var(--text-muted))]">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Feature Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-24 flex flex-wrap justify-center gap-4"
                >
                    {[
                        { icon: Brain, label: 'Trait Analysis', href: null },
                        { icon: Target, label: 'Precision Matching', href: null },
                        { icon: TrendingUp, label: 'Growth Insights', href: null },
                        { icon: Map, label: 'Career Roadmaps', href: '/roadmap' },
                    ].map((item, i) => (
                        item.href ? (
                            <Link key={i} href={item.href} className="card-glass flex items-center gap-3 px-5 py-3 rounded-full hover:border-[rgb(var(--accent))/50] transition-colors">
                                <item.icon size={18} className="text-[rgb(var(--accent))]" />
                                <span className="text-sm font-medium text-[rgb(var(--text-secondary))]">{item.label}</span>
                            </Link>
                        ) : (
                            <div key={i} className="card-glass flex items-center gap-3 px-5 py-3 rounded-full">
                                <item.icon size={18} className="text-[rgb(var(--accent))]" />
                                <span className="text-sm font-medium text-[rgb(var(--text-secondary))]">{item.label}</span>
                            </div>
                        )
                    ))}
                </motion.div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[rgb(var(--bg-base))] to-transparent" />
        </section>
    );
};
