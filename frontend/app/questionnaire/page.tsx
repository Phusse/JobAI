'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Loader2, Keyboard, Brain, Target, Palette, Users, Shield, MessageSquare, Zap, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface Question {
    id: number;
    text: string;
    category: string;
}

interface Answer {
    questionId: number;
    question: string;
    answer: string;
}

const categoryConfig: Record<string, { icon: React.ElementType; label: string }> = {
    'problem-solving': { icon: Brain, label: 'How You Think' },
    'curiosity': { icon: Target, label: 'Your Curiosity' },
    'preference': { icon: Palette, label: 'Your Preferences' },
    'organization': { icon: Zap, label: 'Your Style' },
    'leadership': { icon: Users, label: 'Leadership' },
    'abstraction': { icon: Brain, label: 'Big Picture' },
    'aesthetics': { icon: Palette, label: 'Aesthetics' },
    'efficiency': { icon: Zap, label: 'Efficiency' },
    'pattern-recognition': { icon: Target, label: 'Pattern Spotting' },
    'problem-style': { icon: Brain, label: 'Problem Solving' },
    'security-mindset': { icon: Shield, label: 'Caution' },
    'planning': { icon: Users, label: 'Planning' },
    'communication': { icon: MessageSquare, label: 'Communication' },
    'early-adopter': { icon: Sparkles, label: 'Innovation' },
    'root-cause': { icon: Brain, label: 'Deep Thinking' },
    'attention-detail': { icon: Target, label: 'Attention to Detail' },
    'focus-style': { icon: Zap, label: 'Focus Style' },
    'adversarial-thinking': { icon: Shield, label: 'Security Mindset' },
    'visual-appreciation': { icon: Palette, label: 'Visual Sense' },
    'empathy': { icon: Users, label: 'Empathy' },
};

const answerOptions = [
    { value: 'Strongly Disagree', key: '1', shade: 'from-red-500/20 to-red-500/5 border-red-500/30 hover:border-red-500/50' },
    { value: 'Disagree', key: '2', shade: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 hover:border-orange-500/50' },
    { value: 'Neutral', key: '3', shade: 'from-gray-500/20 to-gray-500/5 border-gray-500/30 hover:border-gray-500/50' },
    { value: 'Agree', key: '4', shade: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/50' },
    { value: 'Strongly Agree', key: '5', shade: 'from-green-500/20 to-green-500/5 border-green-500/30 hover:border-green-500/50' },
];

export default function QuestionnairePage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        document.title = 'Career Assessment | JobMatch';
        const fetchQuestions = async () => {
            try {
                const res = await fetch('http://localhost:8000/questions');
                if (res.ok) {
                    const data = await res.json();
                    setQuestions(data.questions || []);
                } else {
                    setQuestions(getFallbackQuestions());
                }
            } catch {
                setQuestions(getFallbackQuestions());
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleAnswer = useCallback((answerText: string) => {
        const q = questions[currentIdx];
        const newAnswer: Answer = { questionId: q.id, question: q.text, answer: answerText };
        const existingIdx = answers.findIndex(a => a.questionId === q.id);
        let newAnswers = existingIdx >= 0 ? [...answers] : [...answers, newAnswer];
        if (existingIdx >= 0) newAnswers[existingIdx] = newAnswer;
        setAnswers(newAnswers);

        if (currentIdx < questions.length - 1) {
            setTimeout(() => setCurrentIdx(currentIdx + 1), 100);
        } else {
            setIsCompleted(true);
        }
    }, [answers, currentIdx, questions]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isCompleted || isLoading) return;
            const key = e.key;
            if (['1', '2', '3', '4', '5'].includes(key)) {
                const option = answerOptions.find(o => o.key === key);
                if (option) handleAnswer(option.value);
            }
            if (key === 'ArrowLeft' && currentIdx > 0) setCurrentIdx(currentIdx - 1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIdx, isCompleted, isLoading, handleAnswer]);

    const submitForAnalysis = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const payload = answers.map(a => ({ question: a.question, answer: a.answer }));
            const res = await fetch('http://localhost:4000/api/answers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'demo-user-123', answers: payload })
            });
            const data = await res.json();
            if (data.success && data.recommendations) {
                localStorage.setItem('careerResults', JSON.stringify(data));
                router.push('/results');
            } else {
                throw new Error('Failed to get recommendations');
            }
        } catch {
            setError('Analysis failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg-base))]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-[rgb(var(--accent))] animate-spin mx-auto mb-4" />
                    <p className="text-[rgb(var(--text-muted))]">Loading assessment...</p>
                </div>
            </div>
        );
    }

    const q = questions[currentIdx];
    const progress = ((currentIdx) / questions.length) * 100;
    const currentAnswer = answers.find(a => a.questionId === q?.id)?.answer;
    const cat = categoryConfig[q?.category] || { icon: Brain, label: 'General' };
    const CategoryIcon = cat.icon;

    return (
        <div className="min-h-screen flex flex-col bg-[rgb(var(--bg-base))]">
            <Header />

            <main className="flex-grow pt-20 pb-12 px-6 relative">
                <div className="absolute inset-0 bg-mesh opacity-50" />

                <div className="max-w-2xl mx-auto relative">
                    {/* Progress */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 badge badge-accent">
                                <CategoryIcon size={14} />
                                <span>{cat.label}</span>
                            </div>
                            <span className="text-sm text-[rgb(var(--text-muted))]">
                                {currentIdx + 1} / {questions.length}
                            </span>
                        </div>
                        <div className="progress">
                            <motion.div
                                className="progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {!isCompleted ? (
                            <motion.div
                                key={currentIdx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="card p-8 md:p-10"
                            >
                                <h2 className="heading-2 mb-8 leading-snug">{q.text}</h2>

                                <div className="space-y-3">
                                    {answerOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleAnswer(opt.value)}
                                            className={`w-full py-4 px-5 rounded-xl border text-left flex items-center justify-between transition-all group bg-gradient-to-r ${opt.shade} ${currentAnswer === opt.value ? 'ring-2 ring-[rgb(var(--accent))]' : ''
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded text-xs font-medium bg-[rgb(var(--glass-bg))] border border-[rgb(var(--glass-border))] flex items-center justify-center text-[rgb(var(--text-muted))]">
                                                    {opt.key}
                                                </span>
                                                <span className="font-medium text-[rgb(var(--text-primary))]">{opt.value}</span>
                                            </div>
                                            {currentAnswer === opt.value && <Check size={18} className="text-[rgb(var(--accent))]" />}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mt-8 pt-6 border-t border-[rgb(var(--border-subtle))]">
                                    <button
                                        onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)}
                                        disabled={currentIdx === 0}
                                        className="btn btn-ghost disabled:opacity-30"
                                    >
                                        <ArrowLeft size={16} /> Back
                                    </button>
                                    <div className="flex items-center gap-2 text-xs text-[rgb(var(--text-muted))]">
                                        <Keyboard size={14} />
                                        Press 1-5 to answer
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="complete"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="card p-10 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[rgb(var(--accent))] to-teal-400 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                                    <Check size={32} className="text-white" />
                                </div>
                                <h2 className="heading-2 mb-3">Assessment Complete</h2>
                                <p className="text-[rgb(var(--text-muted))] mb-8 max-w-md mx-auto">
                                    All {questions.length} questions answered. Ready to discover your career matches?
                                </p>
                                {error && (
                                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}
                                <button
                                    onClick={submitForAnalysis}
                                    disabled={isSubmitting}
                                    className="btn btn-primary btn-lg"
                                >
                                    {isSubmitting ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                                    ) : (
                                        <>View Results <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function getFallbackQuestions(): Question[] {
    return [
        { id: 1, text: 'When I get a new gadget, I read the manual before using it.', category: 'problem-solving' },
        { id: 2, text: "When I hear a strange noise in my car, I feel compelled to find exactly where it's coming from.", category: 'curiosity' },
        { id: 3, text: 'I care more about how something looks than how it works under the hood.', category: 'preference' },
        { id: 4, text: 'I feel satisfied when I organize a messy drawer so that everything fits perfectly.', category: 'organization' },
        { id: 5, text: "In a group that's lost or confused, I naturally start suggesting what to do next.", category: 'leadership' },
        { id: 6, text: "I enjoy thinking about deep questions like 'What is consciousness?' or 'Will machines ever think?'", category: 'abstraction' },
        { id: 7, text: 'When wrapping a gift, I care more about how it looks than getting it done quickly.', category: 'aesthetics' },
        { id: 8, text: 'It annoys me when people take the long way to do something that could be done faster.', category: 'efficiency' },
        { id: 9, text: 'When watching a movie, I often predict the plot twist before it happens.', category: 'pattern-recognition' },
        { id: 10, text: 'I prefer building things freely from scratch rather than following a set of instructions.', category: 'problem-style' },
        { id: 11, text: "I often check if doors are locked or appliances are off, even when I'm pretty sure they are.", category: 'security-mindset' },
        { id: 12, text: "When planning a group trip, I'm usually the one making the itinerary.", category: 'planning' },
        { id: 13, text: 'I enjoy explaining complicated things to people in a way they can easily understand.', category: 'communication' },
        { id: 14, text: "I'm usually the first among my friends to try new apps, gadgets, or trends.", category: 'early-adopter' },
        { id: 15, text: 'When something goes wrong, I need to understand WHY it happened, not just fix it and move on.', category: 'root-cause' },
        { id: 16, text: 'I notice small details that others usually miss, like a typo in a menu or a crooked picture frame.', category: 'attention-detail' },
        { id: 17, text: 'I prefer working on many different things each week rather than focusing deeply on one project for months.', category: 'focus-style' },
        { id: 18, text: 'I find it interesting to think about how people might cheat or break the rules of a system.', category: 'adversarial-thinking' },
        { id: 19, text: 'When I see a beautiful design (a website, poster, or room), I stop to appreciate it.', category: 'visual-appreciation' },
        { id: 20, text: "If a friend seems upset but hasn't said why, I tend to notice and ask them about it.", category: 'empathy' }
    ];
}
