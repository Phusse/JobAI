'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import {
    CheckCircle, BarChart3, TrendingUp, AlertCircle,
    RefreshCw, Lightbulb, ArrowRight, Award, BookOpen, Sparkles,
    Rocket, Target, Zap, Clock, ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CareerMatch {
    title: string;
    match_score: number;
    description: string;
    reasoning: string;
    confidence?: string;
    category?: string;
    matched_traits?: string[];
    skills_required?: string[];
    skills_gap?: Array<{ trait: string; skill: string; suggested_course: string }>;
    alternative_paths?: Array<{ career: string; category: string; match_score: number; shared_traits: string[] }>;
    salary_range?: string;
    growth_outlook?: string;
}

interface TraitData {
    trait: string;
    score: number;
    normalized: number;
    level: string;
}

interface AnalysisResult {
    recommendations: CareerMatch[];
    analysis: string;
    trait_profile?: TraitData[];
    answer_distribution?: Record<string, number>;
    total_questions?: number;
    low_engagement?: boolean;
}

// Convert title to roadmap ID format
function toRoadmapId(title: string): string {
    return title.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/\//g, '-')
        .replace(/engineer/g, 'engineer')
        .replace(/developer/g, 'dev')
        .replace(/front-?end/g, 'frontend')
        .replace(/back-?end/g, 'backend')
        .replace(/full-?stack/g, 'fullstack');
}

export default function ResultsPage() {
    const [results, setResults] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCareer, setActiveCareer] = useState(0);

    useEffect(() => {
        document.title = 'Your Career Matches | JobMatch';
        try {
            const stored = localStorage.getItem('careerResults');
            if (stored) {
                const parsed = JSON.parse(stored);
                setResults(parsed.recommendations ? parsed : parsed.data);
            } else {
                setError('No results found.');
            }
        } catch {
            setError('Failed to load results.');
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg-base))]">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[rgb(var(--accent))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[rgb(var(--text-muted))]">Loading results...</p>
                </div>
            </div>
        );
    }

    if (error || !results) {
        return (
            <div className="min-h-screen flex flex-col bg-[rgb(var(--bg-base))]">
                <Header />
                <main className="flex-grow flex items-center justify-center px-6 pt-20">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={32} className="text-red-400" />
                        </div>
                        <h2 className="heading-2 mb-3">{error || 'Something went wrong'}</h2>
                        <p className="text-[rgb(var(--text-muted))] mb-8">Take the assessment to see your matches.</p>
                        <Link href="/questionnaire" className="btn btn-primary">
                            Take Assessment
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (results.low_engagement) {
        return (
            <div className="min-h-screen flex flex-col bg-[rgb(var(--bg-base))]">
                <Header />
                <main className="flex-grow pt-24 pb-12 px-6">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                            <Lightbulb size={32} className="text-amber-400" />
                        </div>
                        <h1 className="heading-1 mb-4">Let's Try Again</h1>
                        <p className="text-[rgb(var(--text-muted))] mb-8">{results.analysis}</p>
                        <Link href="/questionnaire" className="btn btn-primary">
                            Retake Assessment
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const topCareer = results.recommendations[0];
    const otherCareers = results.recommendations.slice(1);
    const selectedCareer = results.recommendations[activeCareer];
    const traits = results.trait_profile?.filter(t => t.level === 'high' || t.score > 1).slice(0, 5) || [];
    const strongTraits = traits.slice(0, 3).map(t => t.trait.replace(/-/g, ' '));

    return (
        <div className="min-h-screen flex flex-col bg-[rgb(var(--bg-base))]">
            <Header />

            <main className="flex-grow pt-20 pb-16 px-6">
                <div className="absolute inset-0 bg-mesh opacity-30" />

                <div className="container mx-auto max-w-6xl relative">
                    {/* Success Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <span className="badge badge-success mb-4 inline-flex">
                            <CheckCircle size={14} /> Analysis Complete
                        </span>
                        <h1 className="heading-1 mb-4">
                            Your Career <span className="text-gradient">Matches</span>
                        </h1>
                        <p className="text-[rgb(var(--text-muted))] max-w-2xl mx-auto">{results.analysis}</p>
                    </motion.div>

                    {/* Top Match Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20 border border-blue-500/30 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />

                        <div className="relative">
                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                {/* Left side - Career info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-medium text-blue-400 uppercase tracking-wide">Your #1 Match</span>
                                            <h2 className="text-2xl md:text-3xl font-bold text-white">{topCareer.title}</h2>
                                        </div>
                                    </div>

                                    <p className="text-gray-300 mb-4">{topCareer.description}</p>

                                    {/* Match Reasoning */}
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                                        <div className="flex items-start gap-3">
                                            <Target className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-white mb-1">Why You Match</p>
                                                <p className="text-sm text-gray-400">
                                                    Based on your <span className="text-blue-400">{strongTraits.join(', ')}</span> traits — {topCareer.reasoning}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="flex flex-wrap gap-4 mb-6">
                                        {topCareer.salary_range && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Zap className="w-4 h-4 text-green-400" />
                                                <span className="text-gray-400">Salary:</span>
                                                <span className="text-white font-medium">{topCareer.salary_range}</span>
                                            </div>
                                        )}
                                        {topCareer.growth_outlook && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <TrendingUp className="w-4 h-4 text-blue-400" />
                                                <span className="text-gray-400">Growth:</span>
                                                <span className="text-white font-medium">{topCareer.growth_outlook}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Start Day One CTA */}
                                    <Link
                                        href={`/roadmap?career=${toRoadmapId(topCareer.title)}`}
                                        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all group"
                                    >
                                        <Rocket className="w-5 h-5" />
                                        Start Day One
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                {/* Right side - Score */}
                                <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2">
                                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-3xl md:text-4xl font-bold text-green-400">{Math.round(topCareer.match_score)}%</div>
                                            <div className="text-xs text-green-400/70">Match</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        ~3-6 months to job-ready
                                    </div>
                                </div>
                            </div>

                            {/* Skills to Learn Preview */}
                            {topCareer.skills_required && topCareer.skills_required.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <p className="text-sm font-medium text-gray-400 mb-3">Skills You'll Learn:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {topCareer.skills_required.slice(0, 8).map((skill, i) => (
                                            <span key={i} className="px-3 py-1 text-sm bg-white/5 text-gray-300 rounded-full border border-white/10">
                                                {skill}
                                            </span>
                                        ))}
                                        {topCareer.skills_required.length > 8 && (
                                            <span className="px-3 py-1 text-sm text-gray-500">
                                                +{topCareer.skills_required.length - 8} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Other Career Cards */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Other Strong Matches</h3>
                            {otherCareers.map((job, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    onClick={() => setActiveCareer(i + 1)}
                                    className={`card cursor-pointer transition-all ${i + 1 === activeCareer
                                        ? 'ring-2 ring-[rgb(var(--accent))] border-transparent'
                                        : 'hover:border-[rgb(var(--border-default))]'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="heading-3">{job.title}</h3>
                                                {job.confidence === 'high' && (
                                                    <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">High Confidence</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-[rgb(var(--text-muted))] mb-3">{job.category}</p>
                                            <p className="text-sm text-[rgb(var(--text-secondary))] line-clamp-2">{job.description}</p>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {job.matched_traits?.slice(0, 3).map((t, idx) => (
                                                    <span key={idx} className="text-xs px-2 py-1 rounded bg-[rgb(var(--glass-bg))] text-[rgb(var(--text-muted))]">
                                                        {t.replace(/-/g, ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-4 mt-4">
                                                <Link
                                                    href={`/roadmap?career=${toRoadmapId(job.title)}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center gap-1.5 text-sm text-[rgb(var(--accent))] hover:text-[rgb(var(--accent-light))] transition-colors font-medium"
                                                >
                                                    <BookOpen size={14} />
                                                    View Roadmap
                                                    <ArrowRight size={12} />
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="ml-6 text-center">
                                            <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold ${job.match_score >= 80
                                                ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/10 text-green-400'
                                                : job.match_score >= 60
                                                    ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-400'
                                                    : 'bg-gradient-to-br from-gray-500/20 to-gray-500/10 text-gray-400'
                                                }`}>
                                                {Math.round(job.match_score)}%
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Selected Career Details */}
                            {selectedCareer && activeCareer > 0 && (
                                <div className="card">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Award size={18} className="text-[rgb(var(--accent))]" />
                                        <h3 className="font-semibold text-[rgb(var(--text-primary))]">Why This Matches</h3>
                                    </div>
                                    <p className="text-sm text-[rgb(var(--text-muted))] mb-4">{selectedCareer.reasoning}</p>

                                    {selectedCareer.skills_gap && selectedCareer.skills_gap.length > 0 && (
                                        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 mt-4">
                                            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
                                                <BookOpen size={14} /> Skills to Develop
                                            </div>
                                            <ul className="text-xs text-amber-400/80 space-y-1">
                                                {selectedCareer.skills_gap.slice(0, 2).map((gap, idx) => (
                                                    <li key={idx}>{gap.skill}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {selectedCareer.alternative_paths && selectedCareer.alternative_paths.length > 0 && (
                                        <div className="p-4 rounded-lg bg-[rgb(var(--accent))]/10 border border-[rgb(var(--accent))]/20 mt-4">
                                            <div className="flex items-center gap-2 text-[rgb(var(--accent))] text-sm font-medium mb-2">
                                                <TrendingUp size={14} /> Related Paths
                                            </div>
                                            {selectedCareer.alternative_paths.slice(0, 2).map((alt, idx) => (
                                                <div key={idx} className="flex justify-between text-xs text-[rgb(var(--accent-light))] mb-1">
                                                    <span>{alt.career}</span>
                                                    <span>{alt.match_score}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Trait Profile */}
                            <div className="card">
                                <div className="flex items-center gap-2 mb-4">
                                    <BarChart3 size={18} className="text-[rgb(var(--accent))]" />
                                    <h3 className="font-semibold text-[rgb(var(--text-primary))]">Your Traits</h3>
                                </div>
                                {traits.length > 0 ? (
                                    <div className="space-y-4">
                                        {traits.map((trait, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-[rgb(var(--text-muted))] capitalize">{trait.trait.replace(/-/g, ' ')}</span>
                                                    <span className="text-[rgb(var(--text-primary))] font-medium">{trait.normalized}%</span>
                                                </div>
                                                <div className="progress">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${trait.normalized}%` }}
                                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                                        className="progress-fill"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-[rgb(var(--text-muted))]">Complete full assessment for trait profile.</p>
                                )}
                            </div>

                            {/* Explore All Roadmaps */}
                            <Link
                                href="/roadmap"
                                className="block p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-colors group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-white">Explore All Roadmaps</p>
                                        <p className="text-sm text-gray-400">Browse 30+ career paths</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                            {/* Actions */}
                            <Link href="/questionnaire" className="btn btn-secondary w-full">
                                <RefreshCw size={16} /> Retake Assessment
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
