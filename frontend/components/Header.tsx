'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/questionnaire', label: 'Assessment' },
        { href: '/roadmap', label: 'Roadmaps' },
        { href: '/progress', label: 'My Progress' },
        { href: '/features', label: 'How It Works' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'glass'
                : 'bg-transparent'
                }`}
        >
            <div className="w-full max-w-[1200px] mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[rgb(var(--accent))] to-teal-400 flex items-center justify-center shadow-lg shadow-[rgb(var(--accent))]/20">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[rgb(var(--accent))] to-teal-400 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                        </div>
                        <span className="text-xl font-bold text-[rgb(var(--text-primary))]">
                            JobMatch
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="btn btn-icon btn-ghost"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <Link href="/login" className="btn btn-ghost text-sm">
                            Sign In
                        </Link>

                        <Link href="/questionnaire" className="btn btn-primary text-sm">
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex md:hidden items-center gap-2">
                        <button onClick={toggleTheme} className="btn btn-icon btn-ghost">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="btn btn-icon btn-ghost"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-t border-[rgb(var(--glass-border))]"
                    >
                        <nav className="w-full max-w-[1200px] mx-auto px-6 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-sm font-medium text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] rounded-lg hover:bg-[rgb(var(--glass-hover))]"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-[rgb(var(--border-subtle))] space-y-2">
                                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block btn btn-secondary w-full">
                                    Sign In
                                </Link>
                                <Link href="/questionnaire" onClick={() => setIsMenuOpen(false)} className="block btn btn-primary w-full">
                                    Get Started
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};
