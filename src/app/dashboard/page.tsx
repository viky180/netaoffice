/**
 * Politician Dashboard Page
 */

'use client';

// Prevent static prerendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Inbox, TrendingUp, Clock, Send, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { questionsApi, answersApi, leaderboardApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Question {
    id: string;
    title: string;
    body: string;
    total_bounty: number;
    status: string;
    deadline: string;
}

interface PoliticianStats {
    mu: number;
    sigma: number;
    questions_answered: number;
    total_bounty_earned: number;
    satisfaction_rate?: number;
    rank: number;
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, token } = useAuth();
    const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
    const [stats, setStats] = useState<PoliticianStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [answeringId, setAnsweringId] = useState<string | null>(null);
    const [answerContent, setAnswerContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'politician') {
            router.push('/');
            return;
        }
        loadData();
    }, [user]);

    const loadData = async () => {
        if (!user) return;

        try {
            const [questionsData, statsData] = await Promise.all([
                questionsApi.list({ politician_id: user.id, status: 'open', sort_by: 'bounty' }),
                leaderboardApi.getPolitician(user.id),
            ]);

            setPendingQuestions(questionsData as Question[]);
            setStats(statsData as PoliticianStats);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitAnswer = async (questionId: string) => {
        if (!token || !answerContent.trim()) return;

        setIsSubmitting(true);
        try {
            await answersApi.submit(questionId, answerContent, token);
            await loadData();
            setAnsweringId(null);
            setAnswerContent('');
        } catch (error) {
            console.error('Failed to submit answer:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user || user.role !== 'politician') {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">
                    Welcome back, {user.display_name}
                </p>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card hover={false} className="text-center">
                        <p className="text-3xl font-bold text-white">#{stats.rank}</p>
                        <p className="text-sm text-gray-400">Rank</p>
                    </Card>
                    <Card hover={false} className="text-center">
                        <p className="text-3xl font-bold text-emerald-400">
                            {(stats.mu - 3 * stats.sigma).toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-400">Skill Rating</p>
                    </Card>
                    <Card hover={false} className="text-center">
                        <p className="text-3xl font-bold text-white">{stats.questions_answered}</p>
                        <p className="text-sm text-gray-400">Answered</p>
                    </Card>
                    <Card hover={false} className="text-center">
                        <p className="text-3xl font-bold text-cyan-400">
                            {stats.satisfaction_rate?.toFixed(0) || '-'}%
                        </p>
                        <p className="text-sm text-gray-400">Satisfaction</p>
                    </Card>
                </div>
            )}

            {/* Inbox */}
            <Card hover={false}>
                <div className="flex items-center gap-3 mb-6">
                    <Inbox className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-xl font-semibold text-white">Inbox</h2>
                    {pendingQuestions.length > 0 && (
                        <Badge variant="warning">{pendingQuestions.length} pending</Badge>
                    )}
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-24 rounded-xl bg-gray-700/50 animate-pulse" />
                        ))}
                    </div>
                ) : pendingQuestions.length === 0 ? (
                    <div className="text-center py-12">
                        <Inbox className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No pending questions</p>
                        <p className="text-sm text-gray-500 mt-1">Great job staying responsive!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingQuestions.map((question) => (
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl border border-gray-700 bg-gray-800/30"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white">{question.title}</h3>
                                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{question.body}</p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                                        <span className="font-bold text-emerald-400">{question.total_bounty} pts</span>
                                    </div>
                                </div>

                                {answeringId === question.id ? (
                                    <div className="mt-4">
                                        <textarea
                                            value={answerContent}
                                            onChange={(e) => setAnswerContent(e.target.value)}
                                            placeholder="Write your response..."
                                            className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[120px] resize-y"
                                        />
                                        <div className="flex gap-2 mt-3">
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    setAnsweringId(null);
                                                    setAnswerContent('');
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={() => handleSubmitAnswer(question.id)}
                                                isLoading={isSubmitting}
                                                disabled={!answerContent.trim() || isSubmitting}
                                            >
                                                <Send className="w-4 h-4 mr-2" />
                                                Submit Answer
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            Due {new Date(question.deadline).toLocaleDateString()}
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/questions/${question.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    View <ChevronRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </Link>
                                            <Button size="sm" onClick={() => setAnsweringId(question.id)}>
                                                Answer
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
