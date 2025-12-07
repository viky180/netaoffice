/**
 * Questions List Client Component
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { questionsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { QuestionCard } from '@/components/QuestionCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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

export default function QuestionsClient() {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'bounty' | 'recent' | 'deadline'>('bounty');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            loadQuestions();
        }
    }, [sortBy, statusFilter, mounted]);

    const loadQuestions = async () => {
        setIsLoading(true);
        try {
            const data = await questionsApi.list({
                sort_by: sortBy,
                status: statusFilter || undefined,
            }) as Question[];
            setQuestions(data);
        } catch (error) {
            console.error('Failed to load questions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sortOptions = [
        { value: 'bounty', label: 'Highest Bounty', icon: <TrendingUp className="w-4 h-4" /> },
        { value: 'recent', label: 'Most Recent', icon: <Clock className="w-4 h-4" /> },
        { value: 'deadline', label: 'Ending Soon', icon: <Calendar className="w-4 h-4" /> },
    ];

    const statusOptions = [
        { value: '', label: 'All' },
        { value: 'open', label: 'Open' },
        { value: 'answered', label: 'Answered' },
        { value: 'expired', label: 'Expired' },
    ];

    if (!mounted) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="h-64 rounded-2xl bg-gray-800/50 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Questions</h1>
                    <p className="text-gray-400 mt-1">
                        Browse questions and add your stake to increase visibility
                    </p>
                </div>

                {user?.role === 'citizen' && (
                    <Link href="/questions/new">
                        <Button>
                            <Plus className="w-5 h-5 mr-2" />
                            Ask Question
                        </Button>
                    </Link>
                )}
            </div>

            {/* Filters */}
            <Card hover={false} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Sort */}
                    <div className="flex-1">
                        <label className="text-sm text-gray-400 mb-2 block">Sort By</label>
                        <div className="flex gap-2">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSortBy(option.value as 'bounty' | 'recent' | 'deadline')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${sortBy === option.value
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {option.icon}
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Status</label>
                        <div className="flex gap-2">
                            {statusOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setStatusFilter(option.value)}
                                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${statusFilter === option.value
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Questions Grid */}
            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-64 rounded-2xl bg-gray-800/50 animate-pulse"
                        />
                    ))}
                </div>
            ) : questions.length === 0 ? (
                <Card hover={false} className="text-center py-12">
                    <p className="text-gray-400 mb-4">No questions found</p>
                    {user?.role === 'citizen' && (
                        <Link href="/questions/new">
                            <Button>Ask the First Question</Button>
                        </Link>
                    )}
                </Card>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {questions.map((question) => (
                        <QuestionCard
                            key={question.id}
                            id={question.id}
                            title={question.title}
                            body={question.body}
                            totalBounty={question.total_bounty}
                            stakerCount={question.staker_count}
                            status={question.status}
                            politicianName={question.politician_name}
                            citizenName={question.citizen_name}
                            hasAnswer={question.has_answer}
                            helpfulPercentage={question.helpful_percentage}
                            deadline={question.deadline}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
}
