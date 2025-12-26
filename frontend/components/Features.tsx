'use client';

import { motion } from 'framer-motion';
import { Brain, Target, BarChart3, Lightbulb, Zap, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        icon: Brain,
        title: 'Honest Self-Assessment',
        description: 'Questions designed by psychologists to uncover how you actually work—not how you interview.',
    },
    {
        icon: Target,
        title: 'Real Match Scores',
        description: 'See exactly why each career fits (or doesn\'t). No black-box algorithms—full transparency.',
    },
    {
        icon: BarChart3,
        title: 'Skill Gap Analysis',
        description: 'Know what\'s standing between you and your match. Get specific steps to bridge the gap.',
    },
    {
        icon: Lightbulb,
        title: 'Unexpected Paths',
        description: 'Discover careers you\'ve never considered that might be perfect for how you\'re wired.',
    },
    {
        icon: Zap,
        title: 'Instant Results',
        description: 'No waiting. Your personalized career report is ready the moment you finish.',
    },
    {
        icon: Shield,
        title: 'Your Data Stays Yours',
        description: 'No accounts, no email required. Take the assessment anonymously if you want.',
    },
];

const steps = [
    { number: '01', title: 'Be Honest', description: 'Answer about your real preferences, not what sounds good' },
    { number: '02', title: 'See The Match', description: 'Watch how your answers translate into career compatibility' },
    { number: '03', title: 'Get Clarity', description: 'Leave with 3 careers worth exploring and why' },
];

const testimonials = [
    {
        quote: "I was stuck between law school and tech. This helped me realize I hate routine but love problem-solving. Now I'm a PM at a startup.",
        name: "Sarah K.",
        role: "Product Manager",
    },
    {
        quote: "Told me I'd be miserable in the career I was planning. Was annoyed at first. A year later, I'm grateful.",
        name: "Marcus T.",
        role: "UX Researcher",
    },
];

export const Features = () => {
    return (
        <>
            {/* How It Works */}
            <section id="methodology" className="py-24 relative">
                <div className="w-full max-w-[1200px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="badge badge-accent mb-4">How It Works</span>
                        <h2 className="heading-1 mb-4">
                            Three steps to <span className="text-[rgb(var(--accent-light))] italic">greatness</span>
                        </h2>
                        <p className="text-lg text-[rgb(var(--text-secondary))] max-w-2xl mx-auto">
                            A simple process designed to uncover your true career path
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="card-glass p-8 text-center relative group"
                            >
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[rgb(var(--accent))] to-teal-400 flex items-center justify-center text-white font-bold text-xl mx-auto mb-5 shadow-lg shadow-[rgb(var(--accent))]/20">
                                    {step.number}
                                </div>
                                <h3 className="heading-4 mb-3">{step.title}</h3>
                                <p className="text-sm text-[rgb(var(--text-muted))] leading-relaxed">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 relative">
                <div className="w-full max-w-[1200px] mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {testimonials.map((testimonial, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="card-glass p-6"
                            >
                                <p className="text-[rgb(var(--text-secondary))] mb-4 italic">
                                    "{testimonial.quote}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[rgb(var(--accent))] to-teal-400 flex items-center justify-center text-white font-semibold text-sm">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-[rgb(var(--text-primary))]">{testimonial.name}</div>
                                        <div className="text-sm text-[rgb(var(--text-muted))]">{testimonial.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 relative">
                <div className="absolute inset-0 bg-mesh opacity-50" />

                <div className="w-full max-w-[1200px] mx-auto px-6 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="badge badge-accent mb-4">What You Get</span>
                        <h2 className="heading-1 mb-4">
                            Built for <span className="text-[rgb(var(--accent-light))] italic">clarity</span>
                        </h2>
                        <p className="text-lg text-[rgb(var(--text-secondary))] max-w-2xl mx-auto">
                            Everything you need to make confident career decisions
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="card card-glow group hover:border-[rgb(var(--accent))]/30 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center mb-4 group-hover:bg-[rgb(var(--accent))]/20 transition-colors">
                                    <feature.icon size={24} className="text-[rgb(var(--accent))]" />
                                </div>
                                <h3 className="heading-4 mb-2">{feature.title}</h3>
                                <p className="text-sm text-[rgb(var(--text-muted))]">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--accent))]/20 via-cyan-500/10 to-sky-500/20" />
                    <div className="absolute inset-0 bg-grid opacity-20" />
                </div>

                <div className="w-full max-w-[1200px] mx-auto px-6 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h2 className="heading-1 mb-6">
                            Ready to discover your
                            <br />
                            <span className="text-gradient">perfect match?</span>
                        </h2>
                        <p className="text-lg text-[rgb(var(--text-secondary))] mb-10">
                            Join thousands of professionals who found careers aligned with their true potential.
                        </p>
                        <Link href="/questionnaire" className="btn btn-primary btn-lg group">
                            Start Free Assessment
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
};
