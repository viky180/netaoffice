/**
 * Politician Profile Client Component
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Trophy,
    MessageSquare,
    ThumbsUp,
    Clock,
    TrendingUp,
    Heart,
    Coins,
    BadgeCheck,
    User,
} from 'lucide-react';
import { leaderboardApi, questionsApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QuestionCard } from '@/components/QuestionCard';

interface PoliticianStats {
    id: string;
    display_name: string;
    mu: number;
    sigma: number;
    verified: boolean;
    questions_answered: number;
    total_bounty_earned: number;
    satisfaction_rate?: number;
    avg_response_time_hours?: number;
    rank: number;
    open_bounty_total: number;
    total_charity_released: number;
    questions_received: number;
}

interface Question {
    id: string;
    title: string;
    body: string;
    total_bounty: number;
    staker_count: number;
    status: string;
    politician_name?: string;
    citizen_name?: string;
    has_answer: boolean;
    helpful_percentage?: number;
    deadline: string;
}

interface PoliticianProfileClientProps {
    politicianId: string;
}

export default function PoliticianProfileClient({ politicianId }: PoliticianProfileClientProps) {
    const [politician, setPolitician] = useState<PoliticianStats | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [activeTab, setActiveTab] = useState<'open' | 'answered'>('open');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [politicianId]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [politicianData, questionsData] = await Promise.all([
                leaderboardApi.getPolitician(politicianId),
                questionsApi.list({ politician_id: politicianId }),
            ]);

            setPolitician(politicianData as PoliticianStats);
            setQuestions(questionsData as Question[]);
        } catch (err) {
            console.error('Failed to load profile:', err);
            setError('Failed to load politician profile');
        } finally {
            setIsLoading(false);
        }
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const getConservativeRating = (mu: number, sigma: number) => {
        return Math.max(0, mu - 3 * sigma).toFixed(1);
    };

    const formatResponseTime = (hours?: number) => {
        if (hours == null) return '-';
        if (hours < 24) return `${hours.toFixed(0)}h`;
        return `${(hours / 24).toFixed(1)}d`;
    };

    const filteredQuestions = questions.filter((q) =>
        activeTab === 'open' ? q.status === 'open' : q.status === 'answered'
    );

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="h-48 rounded-2xl bg-gray-800/50 animate-pulse mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 rounded-xl bg-gray-800/50 animate-pulse" />
                    ))}
                </div>
                <div className="h-64 rounded-xl bg-gray-800/50 animate-pulse" />
            </div>
        );
    }

    if (error || !politician) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="text-center py-12">
                    <User className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">Politician Not Found</h2>
                    <p className="text-gray-400 mb-6">{error || 'This profile does not exist.'}</p>
                    <Link href="/leaderboard">
                        <Button>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Leaderboard
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Link */}
            <Link
                href="/leaderboard"
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Leaderboard
            </Link>

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <Card hover={false} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center gap-6 p-2">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-lg shadow-emerald-500/20">
                                {politician.display_name[0].toUpperCase()}
                            </div>
                            {politician.rank <= 3 && (
                                <div className="absolute -top-2 -right-2 text-3xl">
                                    {getRankBadge(politician.rank)}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-white">
                                    {politician.display_name}
                                </h1>
                                {politician.verified && (
                                    <Badge variant="success" size="sm">
                                        <BadgeCheck className="w-3 h-3 mr-1" />
                                        Verified
                                    </Badge>
                                )}
                            </div>
                            <p className="text-gray-400 mb-4">
                                Ranked #{politician.rank} on CivicStake
                            </p>

                            {/* Reputation Bar */}
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                <div className="flex-1 max-w-xs h-3 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${Math.min(100, (politician.mu / 50) * 100)}%`,
                                        }}
                                        transition={{ delay: 0.3, duration: 0.8 }}
                                    />
                                </div>
                                <span className="text-white font-bold text-lg">
                                    {getConservativeRating(politician.mu, politician.sigma)}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                <Card hover={false} className="text-center">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                    <p className="text-2xl font-bold text-white">{politician.questions_answered}</p>
                    <p className="text-sm text-gray-400">Answered</p>
                </Card>

                <Card hover={false} className="text-center">
                    <ThumbsUp className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                    <p className="text-2xl font-bold text-white">
                        {politician.satisfaction_rate != null
                            ? `${politician.satisfaction_rate.toFixed(0)}%`
                            : '-'}
                    </p>
                    <p className="text-sm text-gray-400">Satisfaction</p>
                </Card>

                <Card hover={false} className="text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                    <p className="text-2xl font-bold text-white">
                        {formatResponseTime(politician.avg_response_time_hours)}
                    </p>
                    <p className="text-sm text-gray-400">Avg Response</p>
                </Card>

                <Card hover={false} className="text-center">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                    <p className="text-2xl font-bold text-white">
                        {politician.total_bounty_earned.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">Points Earned</p>
                </Card>
            </motion.div>

            {/* Impact Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            >
                <Card hover={false} className="border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <Coins className="w-7 h-7 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Open Bounty</p>
                            <p className="text-2xl font-bold text-white">
                                {politician.open_bounty_total.toLocaleString()} pts
                            </p>
                            <p className="text-xs text-gray-500">
                                Staked on {questions.filter((q) => q.status === 'open').length} open
                                questions
                            </p>
                        </div>
                    </div>
                </Card>

                <Card hover={false} className="border-l-4 border-l-pink-500">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-pink-500/20 flex items-center justify-center">
                            <Heart className="w-7 h-7 text-pink-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Charity Impact</p>
                            <p className="text-2xl font-bold text-white">
                                {politician.total_charity_released.toLocaleString()} pts
                            </p>
                            <p className="text-xs text-gray-500">
                                Released to charities from answers
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Questions Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">
                        Questions ({politician.questions_received})
                    </h2>

                    {/* Tab Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('open')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'open'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            Open ({questions.filter((q) => q.status === 'open').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('answered')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'answered'
                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            Answered ({questions.filter((q) => q.status === 'answered').length})
                        </button>
                    </div>
                </div>

                {filteredQuestions.length === 0 ? (
                    <Card hover={false} className="text-center py-12">
                        <MessageSquare className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                        <p className="text-gray-400">
                            {activeTab === 'open'
                                ? 'No open questions for this politician'
                                : 'No answered questions yet'}
                        </p>
                        {activeTab === 'open' && (
                            <Link href="/questions/new" className="mt-4 inline-block">
                                <Button variant="primary" size="sm">
                                    Ask a Question
                                </Button>
                            </Link>
                        )}
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {filteredQuestions.map((question, index) => (
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <QuestionCard
                                    id={question.id}
                                    title={question.title}
                                    body={question.body}
                                    totalBounty={question.total_bounty}
                                    stakerCount={question.staker_count}
                                    status={question.status}
                                    citizenName={question.citizen_name}
                                    hasAnswer={question.has_answer}
                                    helpfulPercentage={question.helpful_percentage}
                                    deadline={question.deadline}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
