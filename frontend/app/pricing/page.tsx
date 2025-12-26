'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

const tiers = [
    {
        name: 'Free',
        price: '$0',
        features: ['20-Question Assessment', 'Top 3 Career Matches', 'Trait Profile Overview', 'Skills Gap Insights'],
        cta: 'Start Free',
        primary: false
    },
    {
        name: 'Pro',
        price: '$29',
        period: ' one-time',
        features: ['Full 40-Question Deep Dive', 'Detailed PDF Report', 'Complete Learning Roadmap', 'Alternative Career Paths', 'Priority Support'],
        cta: 'Coming Soon',
        primary: true,
        disabled: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        features: ['White-label Solution', 'Team Analytics Dashboard', 'API Access', 'Dedicated Account Manager'],
        cta: 'Contact Sales',
        primary: false,
        disabled: true
    }
];

export default function PricingPage() {
    useEffect(() => {
        document.title = 'Pricing | JobMatch';
    }, []);

    return (
        <div className="min-h-screen bg-[rgb(var(--bg-base))] text-[rgb(var(--text-primary))] flex flex-col">
            <Header />

            <main className="flex-grow pt-32 pb-24 px-6 container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gradient">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-[rgb(var(--text-muted))]">
                        Start with our free assessment. Upgrade when you're ready for deeper insights.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((tier, i) => (
                        <div
                            key={i}
                            className={`rounded-3xl p-8 border flex flex-col ${tier.primary
                                ? 'bg-[rgb(var(--bg-elevated))] border-[rgb(var(--accent))] shadow-2xl shadow-[rgb(var(--accent))]/10 relative overflow-hidden'
                                : 'bg-[rgb(var(--bg-surface))] border-[rgb(var(--border-default))]'
                                }`}
                        >
                            {tier.primary && (
                                <div className="absolute top-0 right-0 bg-[rgb(var(--accent))] text-xs font-bold px-3 py-1 rounded-bl-xl text-white">
                                    COMING SOON
                                </div>
                            )}
                            <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-extrabold">{tier.price}</span>
                                {tier.period && <span className="text-[rgb(var(--text-muted))]">{tier.period}</span>}
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                {tier.features.map((feat, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-[rgb(var(--text-secondary))]">
                                        <Check className="w-5 h-5 text-[rgb(var(--accent))] flex-shrink-0" />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={tier.disabled ? '#' : '/questionnaire'}
                                className={`w-full py-4 rounded-xl font-bold text-center transition-all ${tier.primary
                                    ? 'bg-[rgb(var(--accent))] hover:opacity-90 text-white shadow-lg'
                                    : 'bg-[rgb(var(--bg-elevated))] hover:bg-[rgb(var(--glass-hover))] text-[rgb(var(--text-primary))] border border-[rgb(var(--border-default))]'
                                    } ${tier.disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                                onClick={tier.disabled ? (e) => e.preventDefault() : undefined}
                            >
                                {tier.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}

