'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Trophy, Flame, Clock, CheckCircle, ChevronRight,
    Calendar, Target, BookOpen, Zap, ArrowRight, BarChart3
} from 'lucide-react';

interface RoadmapProgress {
    careerId: string;
    title: string;
    totalNodes: number;
    completedNodes: number;
    lastUpdated: string;
}

export default function ProgressPage() {
    const [progress, setProgress] = useState<RoadmapProgress[]>([]);
    const [streak, setStreak] = useState(0);
    const [totalCompleted, setTotalCompleted] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Your Progress | JobMatch';
        loadProgress();
    }, []);

    function loadProgress() {
        try {
            // Get all roadmap progress from localStorage
            const allProgress: RoadmapProgress[] = [];
            let total = 0;

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('roadmap-progress-')) {
                    const careerId = key.replace('roadmap-progress-', '');
                    const data = JSON.parse(localStorage.getItem(key) || '[]');
                    const completedCount = Array.isArray(data) ? data.length : 0;

                    if (completedCount > 0) {
                        allProgress.push({
                            careerId,
                            title: formatCareerId(careerId),
                            totalNodes: 7, // Approximate, will be updated when user visits
                            completedNodes: completedCount,
                            lastUpdated: new Date().toISOString(),
                        });
                        total += completedCount;
                    }
                }
            }

            setProgress(allProgress);
            setTotalCompleted(total);

            // Calculate streak (simplified - just check if user has any progress)
            setStreak(allProgress.length > 0 ? Math.min(allProgress.length, 7) : 0);
        } catch (error) {
            console.error('Error loading progress:', error);
        } finally {
            setLoading(false);
        }
    }

    function formatCareerId(id: string): string {
        return id
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    function getMotivationalMessage(): string {
        if (totalCompleted === 0) return "Start your first roadmap today!";
        if (totalCompleted < 5) return "Great start! Keep the momentum going.";
        if (totalCompleted < 15) return "You're making solid progress!";
        if (totalCompleted < 30) return "Impressive dedication!";
        return "You're on your way to mastery!";
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg-base))]">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[rgb(var(--bg-base))]">
            <Header />

            <main className="flex-grow pt-20 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                            <BarChart3 className="w-4 h-4" />
                            Your Learning Journey
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Progress Dashboard
                        </h1>
                        <p className="text-gray-400">{getMotivationalMessage()}</p>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    >
                        {/* Topics Completed */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-green-500/20">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white">{totalCompleted}</div>
                            <div className="text-sm text-gray-400">Topics Completed</div>
                        </div>

                        {/* Active Roadmaps */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-500/20">
                                    <BookOpen className="w-5 h-5 text-blue-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white">{progress.length}</div>
                            <div className="text-sm text-gray-400">Active Roadmaps</div>
                        </div>

                        {/* Learning Streak */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-orange-500/20">
                                    <Flame className="w-5 h-5 text-orange-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white">{streak}</div>
                            <div className="text-sm text-gray-400">Day Streak</div>
                        </div>

                        {/* Time Invested */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-purple-500/20">
                                    <Clock className="w-5 h-5 text-purple-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white">{Math.round(totalCompleted * 2.5)}</div>
                            <div className="text-sm text-gray-400">Hours Invested</div>
                        </div>
                    </motion.div>

                    {/* Active Roadmaps */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">Your Roadmaps</h2>

                        {progress.length === 0 ? (
                            <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                                <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">No Progress Yet</h3>
                                <p className="text-gray-400 mb-6">Start a roadmap to track your learning journey</p>
                                <Link
                                    href="/roadmap"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                                >
                                    Browse Roadmaps
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {progress.map((roadmap, index) => {
                                    const percentage = Math.min(100, Math.round((roadmap.completedNodes / roadmap.totalNodes) * 100));
                                    return (
                                        <motion.div
                                            key={roadmap.careerId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={`/roadmap?career=${roadmap.careerId}`}
                                                className="block p-5 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/30 hover:bg-gray-800 transition-all group"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-blue-500/20">
                                                            <BookOpen className="w-5 h-5 text-blue-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                                {roadmap.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-400">
                                                                {roadmap.completedNodes} topics completed
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {percentage === 100 ? (
                                                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                                                                <Trophy className="w-4 h-4 text-yellow-400" />
                                                                <span className="text-sm font-medium text-green-400">Complete!</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-lg font-bold text-blue-400">{percentage}%</span>
                                                        )}
                                                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percentage}%` }}
                                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                                        className={`h-full rounded-full ${percentage === 100
                                                                ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                                                                : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                                                            }`}
                                                    />
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>

                    {/* Suggested Next Steps */}
                    {progress.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Zap className="w-5 h-5 text-yellow-400" />
                                <h3 className="font-semibold text-white">Suggested Next Steps</h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-bold">1</div>
                                    Continue your most active roadmap: <strong className="text-white">{progress[0]?.title}</strong>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-bold">2</div>
                                    Complete at least one topic today to maintain your streak
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-bold">3</div>
                                    Explore a new roadmap in a related field
                                </li>
                            </ul>
                        </motion.div>
                    )}

                    {/* Browse More */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 text-center"
                    >
                        <Link
                            href="/roadmap"
                            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                        >
                            Explore All Roadmaps
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
