'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RoadmapViewer from '@/components/RoadmapViewer';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Search, ArrowLeft, Loader2, Sparkles, TrendingUp, Users, Code,
    Shield, Database, Palette, Briefcase, Rocket, Clock, Target, ChevronRight,
    Star, Award, BookOpen, Zap
} from 'lucide-react';

interface RoleRequirements {
    experience_years?: string;
    prerequisite_paths?: string[];
    soft_skills?: string[];
    technical_foundation?: string;
}

interface RoadmapSummary {
    career_id: string;
    title: string;
    description: string;
    category: string;
    icon?: string;
    node_count: number;
    is_role?: boolean;
}

interface Roadmap {
    career_id: string;
    title: string;
    description: string;
    category: string;
    icon?: string;
    is_role?: boolean;
    role_requirements?: RoleRequirements;
    nodes: any[];
    edges: any[];
}

const ROADMAP_API = process.env.NEXT_PUBLIC_ROADMAP_API_URL || 'http://localhost:8001';

// Category config with icons and gradients
const categoryConfig: Record<string, { icon: any; gradient: string; bg: string; border: string }> = {
    development: { icon: Code, gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    data: { icon: Database, gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    infrastructure: { icon: Rocket, gradient: 'from-orange-500 to-amber-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
    security: { icon: Shield, gradient: 'from-red-500 to-rose-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    design: { icon: Palette, gradient: 'from-pink-500 to-fuchsia-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
    business: { icon: Briefcase, gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10', border: 'border-green-500/30' },
    management: { icon: Users, gradient: 'from-indigo-500 to-violet-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
    quality: { icon: Target, gradient: 'from-teal-500 to-cyan-500', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
    emerging: { icon: Zap, gradient: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
};

function RoadmapContent() {
    const searchParams = useSearchParams();
    const careerId = searchParams.get('career');

    const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
    const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'paths' | 'roles'>('all');

    useEffect(() => {
        async function fetchRoadmaps() {
            try {
                const res = await fetch(`${ROADMAP_API}/roadmaps`);
                if (!res.ok) throw new Error('Failed to fetch roadmaps');
                const data = await res.json();
                setRoadmaps(data);
            } catch (err) {
                setError('Unable to load roadmaps. Make sure the Roadmap Service is running.');
            } finally {
                setLoading(false);
            }
        }
        fetchRoadmaps();
    }, []);

    useEffect(() => {
        if (careerId) {
            fetchRoadmapDetails(careerId);
        } else {
            setSelectedRoadmap(null);
        }
    }, [careerId]);

    async function fetchRoadmapDetails(id: string) {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${ROADMAP_API}/roadmap/${id}`);
            if (!res.ok) throw new Error('Roadmap not found');
            const data = await res.json();
            setSelectedRoadmap(data);
        } catch (err) {
            setError(`Roadmap "${id}" not found`);
        } finally {
            setLoading(false);
        }
    }

    // Filter roadmaps
    let filteredRoadmaps = roadmaps.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeTab === 'paths') {
        filteredRoadmaps = filteredRoadmaps.filter(r => !r.is_role);
    } else if (activeTab === 'roles') {
        filteredRoadmaps = filteredRoadmaps.filter(r => r.is_role);
    }

    // Group by category
    const groupedRoadmaps = filteredRoadmaps.reduce((acc, roadmap) => {
        const cat = roadmap.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(roadmap);
        return acc;
    }, {} as Record<string, RoadmapSummary[]>);

    const paths = roadmaps.filter(r => !r.is_role);
    const roles = roadmaps.filter(r => r.is_role);

    if (loading && !roadmaps.length) {
        return (
            <div className="min-h-screen bg-[rgb(var(--bg-base))] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full" />
                        <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-gray-400">Loading roadmaps...</p>
                </div>
            </div>
        );
    }

    // Show roadmap viewer if a career is selected
    if (selectedRoadmap) {
        return (
            <div className="min-h-screen flex flex-col bg-[rgb(var(--bg-base))]">
                <Header />
                <main className="flex-grow pt-20 pb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        {/* Back Button */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-6"
                        >
                            <Link
                                href="/roadmap"
                                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Back to Roadmaps
                            </Link>
                        </motion.div>

                        {/* Roadmap Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-4 rounded-2xl bg-gradient-to-br ${categoryConfig[selectedRoadmap.category]?.gradient || 'from-blue-500 to-cyan-500'}`}>
                                    {(() => {
                                        const Icon = categoryConfig[selectedRoadmap.category]?.icon || Code;
                                        return <Icon className="w-8 h-8 text-white" />;
                                    })()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-bold text-white">{selectedRoadmap.title}</h1>
                                        {selectedRoadmap.is_role && (
                                            <span className="px-3 py-1 text-xs font-medium bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30">
                                                Senior Role
                                            </span>
                                        )}
                                        {(selectedRoadmap as any).career_type && (
                                            <span className="px-3 py-1 text-xs font-medium bg-gray-700/50 text-gray-300 rounded-full">
                                                {(selectedRoadmap as any).career_type}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-lg">{selectedRoadmap.description}</p>
                                </div>
                            </div>

                            {/* Career Context Section */}
                            {(selectedRoadmap as any).context && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="mt-6 p-5 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50"
                                >
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">About This Career</h3>
                                    <p className="text-gray-300 leading-relaxed">{(selectedRoadmap as any).context}</p>
                                </motion.div>
                            )}

                            {/* Role Requirements Banner */}
                            {selectedRoadmap.is_role && selectedRoadmap.role_requirements && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <Award className="w-5 h-5 text-indigo-400" />
                                        <h3 className="font-semibold text-white">This is a Senior Role</h3>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-4">
                                        This position is typically achieved after gaining experience in foundational roles. Here's what you need:
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {selectedRoadmap.role_requirements.experience_years && (
                                            <div className="flex items-start gap-3">
                                                <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-white">Experience Required</p>
                                                    <p className="text-sm text-gray-400">{selectedRoadmap.role_requirements.experience_years}</p>
                                                </div>
                                            </div>
                                        )}

                                        {selectedRoadmap.role_requirements.technical_foundation && (
                                            <div className="flex items-start gap-3">
                                                <Code className="w-5 h-5 text-green-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-white">Technical Foundation</p>
                                                    <p className="text-sm text-gray-400">{selectedRoadmap.role_requirements.technical_foundation}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {selectedRoadmap.role_requirements.soft_skills && selectedRoadmap.role_requirements.soft_skills.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-white mb-2">Key Soft Skills:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedRoadmap.role_requirements.soft_skills.map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedRoadmap.role_requirements.prerequisite_paths && selectedRoadmap.role_requirements.prerequisite_paths.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <p className="text-sm font-medium text-white mb-3">Start with these learning paths first:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedRoadmap.role_requirements.prerequisite_paths.map((pathId, i) => (
                                                    <Link
                                                        key={i}
                                                        href={`/roadmap?career=${pathId}`}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium"
                                                    >
                                                        <BookOpen className="w-4 h-4" />
                                                        {pathId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Roadmap Viewer */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <RoadmapViewer roadmap={selectedRoadmap} />
                        </motion.div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Browse page
    return (
        <div className="min-h-screen flex flex-col bg-[rgb(var(--bg-base))]">
            <Header />
            <main className="flex-grow pt-20">
                {/* Hero Section */}
                <section className="relative py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-mesh opacity-50" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-[120px]" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center max-w-3xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                                <Sparkles className="w-4 h-4" />
                                {roadmaps.length} Career Paths Available
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Your Path to
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> Mastery</span>
                            </h1>

                            <p className="text-lg text-gray-400 mb-8">
                                Interactive learning roadmaps with curated resources. Track your progress and build real skills.
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-xl mx-auto">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                                    <div className="relative flex items-center">
                                        <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search roadmaps..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-900/80 backdrop-blur border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex justify-center gap-8 mt-10"
                        >
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">{paths.length}</div>
                                <div className="text-sm text-gray-400">Learning Paths</div>
                            </div>
                            <div className="w-px bg-gray-700" />
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">{roles.length}</div>
                                <div className="text-sm text-gray-400">Senior Roles</div>
                            </div>
                            <div className="w-px bg-gray-700" />
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">{roadmaps.reduce((acc, r) => acc + r.node_count, 0)}</div>
                                <div className="text-sm text-gray-400">Total Topics</div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Tabs */}
                <section className="border-b border-gray-800 sticky top-16 bg-[rgb(var(--bg-base))]/95 backdrop-blur z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex gap-1 overflow-x-auto">
                            {[
                                { id: 'all', label: 'All Roadmaps', count: roadmaps.length },
                                { id: 'paths', label: 'Learning Paths', count: paths.length },
                                { id: 'roles', label: 'Senior Roles', count: roles.length },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-5 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.id
                                        ? 'text-blue-400'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {tab.label}
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-500/20' : 'bg-gray-800'
                                        }`}>
                                        {tab.count}
                                    </span>
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Goal-based Quick Filters */}
                <section className="py-6 border-b border-gray-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <span className="text-sm font-medium text-gray-400">I want to:</span>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: '💰 Make Money', keywords: ['data', 'cloud', 'ml-engineer', 'solutions', 'devops'] },
                                    { label: '🎨 Be Creative', keywords: ['design', 'frontend', 'game', 'graphic', 'ux'] },
                                    { label: '🏠 Work Remote', keywords: ['frontend', 'backend', 'fullstack', 'data', 'writer'] },
                                    { label: '📈 High Growth', keywords: ['ai', 'ml', 'blockchain', 'cloud', 'security'] },
                                    { label: '🚀 Start Quick', keywords: ['frontend', 'qa', 'data-analyst', 'writer', 'marketer'] },
                                ].map((goal) => (
                                    <button
                                        key={goal.label}
                                        onClick={() => {
                                            // Filter by goal keywords
                                            const keyword = goal.keywords[0];
                                            setSearchQuery(keyword);
                                        }}
                                        className="px-4 py-2 text-sm font-medium bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white rounded-full border border-gray-700 hover:border-gray-600 transition-all"
                                    >
                                        {goal.label}
                                    </button>
                                ))}
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="px-4 py-2 text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full border border-red-500/30 transition-all"
                                    >
                                        ✕ Clear Filter
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category Quick Filters */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {Object.entries(categoryConfig).map(([cat, config]) => {
                                const Icon = config.icon;
                                const count = roadmaps.filter(r => r.category === cat).length;
                                if (count === 0) return null;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSearchQuery(cat)}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${searchQuery === cat
                                                ? `${config.bg} ${config.border} text-white`
                                                : 'bg-gray-800/30 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                                            }`}
                                    >
                                        <Icon className="w-3 h-3" />
                                        <span className="capitalize">{cat}</span>
                                        <span className="opacity-60">({count})</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        {error && (
                            <div className="text-center text-red-400 mb-8 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {Object.entries(groupedRoadmaps).map(([category, items], categoryIndex) => (
                                <motion.div
                                    key={category}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: categoryIndex * 0.1 }}
                                    className="mb-12"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        {(() => {
                                            const config = categoryConfig[category] || categoryConfig.development;
                                            const Icon = config.icon;
                                            return (
                                                <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient}`}>
                                                    <Icon className="w-5 h-5 text-white" />
                                                </div>
                                            );
                                        })()}
                                        <h2 className="text-xl font-bold text-white capitalize">
                                            {category.replace(/-/g, ' ')}
                                        </h2>
                                        <span className="text-sm text-gray-500">({items.length})</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {items.map((roadmap, i) => {
                                            const config = categoryConfig[roadmap.category] || categoryConfig.development;
                                            return (
                                                <motion.div
                                                    key={roadmap.career_id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                >
                                                    <Link
                                                        href={`/roadmap?career=${roadmap.career_id}`}
                                                        className={`block p-5 rounded-2xl border ${config.border} ${config.bg} hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
                                                    >
                                                        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

                                                        <div className="relative">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors pr-2">
                                                                    {roadmap.title.replace(' Roadmap', '')}
                                                                </h3>
                                                                {roadmap.is_role && (
                                                                    <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                                                )}
                                                            </div>

                                                            <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                                                                {roadmap.description}
                                                            </p>

                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                    <TrendingUp className="w-4 h-4" />
                                                                    {roadmap.node_count} topics
                                                                </div>
                                                                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredRoadmaps.length === 0 && !loading && (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                                    <Search className="w-8 h-8 text-gray-600" />
                                </div>
                                <p className="text-gray-500">No roadmaps found matching &quot;{searchQuery}&quot;</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default function RoadmapPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[rgb(var(--bg-base))] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        }>
            <RoadmapContent />
        </Suspense>
    );
}
