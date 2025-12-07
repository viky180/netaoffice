/**
 * Header component with navigation
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Menu, X, User, LogOut, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from './ui/Button';

export function Header() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Scale className="w-8 h-8 text-emerald-400" />
                        </motion.div>
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            CivicStake
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/questions" className="text-gray-300 hover:text-white transition-colors">
                            Questions
                        </Link>
                        <Link href="/leaderboard" className="text-gray-300 hover:text-white transition-colors">
                            Leaderboard
                        </Link>
                        {user?.role === 'politician' && (
                            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                                Dashboard
                            </Link>
                        )}
                    </nav>

                    {/* Auth Section */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <Link href="/wallet" className="flex items-center gap-2 text-gray-300 hover:text-white">
                                    <Wallet className="w-4 h-4" />
                                    <span className="text-sm">Wallet</span>
                                </Link>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm">{user.display_name}</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={logout}>
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button variant="ghost" size="sm">Log In</Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button variant="primary" size="sm">Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-400 hover:text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="md:hidden py-4 border-t border-gray-800"
                    >
                        <nav className="flex flex-col gap-4">
                            <Link href="/questions" className="text-gray-300 hover:text-white">
                                Questions
                            </Link>
                            <Link href="/leaderboard" className="text-gray-300 hover:text-white">
                                Leaderboard
                            </Link>
                            {user ? (
                                <>
                                    <Link href="/wallet" className="text-gray-300 hover:text-white">
                                        Wallet
                                    </Link>
                                    <button onClick={logout} className="text-left text-gray-300 hover:text-white">
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" className="text-gray-300 hover:text-white">
                                        Log In
                                    </Link>
                                    <Link href="/auth/register" className="text-emerald-400 hover:text-emerald-300">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </nav>
                    </motion.div>
                )}
            </div>
        </header>
    );
}
