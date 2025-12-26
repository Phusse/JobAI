'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Target, Sparkles, Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function AboutPage() {
    useEffect(() => {
        document.title = 'About Us | JobMatch';
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[rgb(var(--bg-base))]">
            <Header />

            <main className="flex-grow pt-24 pb-16 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="heading-1 mb-4">
                            About <span className="text-[rgb(var(--accent-light))] italic">JobMatch</span>
                        </h1>
                        <p className="text-lg text-[rgb(var(--text-secondary))]">
                            We believe everyone deserves work that fits who they really are.
                        </p>
                    </div>

                    <div className="space-y-12 text-[rgb(var(--text-secondary))]">
                        {/* Mission */}
                        <section className="card p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[rgb(var(--accent))]/20 flex items-center justify-center">
                                    <Target size={20} className="text-[rgb(var(--accent-light))]" />
                                </div>
                                <h2 className="heading-3 text-[rgb(var(--text-primary))]">Our Mission</h2>
                            </div>
                            <p>
                                Career advice is broken. Most people choose jobs based on what sounds good,
                                what pays well, or what their parents want. Then they spend years feeling
                                unfulfilled, wondering why success doesn't feel like success.
                            </p>
                            <p className="mt-4">
                                We built JobMatch to fix that. Our assessment measures how you actually work—your
                                natural tendencies, preferences, and strengths—then matches you with careers
                                that fit your wiring, not just your resume.
                            </p>
                        </section>

                        {/* How It Works */}
                        <section className="card p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[rgb(var(--accent))]/20 flex items-center justify-center">
                                    <Sparkles size={20} className="text-[rgb(var(--accent-light))]" />
                                </div>
                                <h2 className="heading-3 text-[rgb(var(--text-primary))]">How It Works</h2>
                            </div>
                            <p>
                                Our 20-question assessment is designed to uncover your true work preferences
                                through indirect questions about everyday behavior. We're not asking if you
                                know Python—we're finding out if you're the type of person who would enjoy
                                learning it.
                            </p>
                            <p className="mt-4">
                                Our AI analyzes your responses against 60+ career profiles across 15 categories,
                                identifying which paths align with your natural strengths and which might be a struggle.
                            </p>
                        </section>

                        {/* Values */}
                        <section className="card p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[rgb(var(--accent))]/20 flex items-center justify-center">
                                    <Heart size={20} className="text-[rgb(var(--accent-light))]" />
                                </div>
                                <h2 className="heading-3 text-[rgb(var(--text-primary))]">What We Believe</h2>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="text-[rgb(var(--accent))] mt-1">•</span>
                                    <span><strong className="text-[rgb(var(--text-primary))]">Honesty over flattery.</strong> We'd rather give you uncomfortable truths than comfortable lies.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[rgb(var(--accent))] mt-1">•</span>
                                    <span><strong className="text-[rgb(var(--text-primary))]">Fit matters more than prestige.</strong> The "best" career is the one that fits you, not the one that impresses others.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[rgb(var(--accent))] mt-1">•</span>
                                    <span><strong className="text-[rgb(var(--text-primary))]">Privacy first.</strong> Take the assessment anonymously. Your data is yours.</span>
                                </li>
                            </ul>
                        </section>

                        {/* CTA */}
                        <div className="text-center pt-8">
                            <p className="text-lg text-[rgb(var(--text-primary))] mb-6">
                                Ready to find work that fits?
                            </p>
                            <Link href="/questionnaire" className="btn btn-primary btn-lg">
                                Take the Free Assessment
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
