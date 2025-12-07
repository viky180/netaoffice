/**
 * Question Detail Page
 */

'use client';

// Prevent static prerendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { questionsApi, answersApi, bountiesApi } from '@/lib/api';
import { subscribeToEscrow, subscribeToVotes } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { BountyMeter } from '@/components/BountyMeter';
import { VotingPanel } from '@/components/VotingPanel';

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
    target_politician_id: string;
}

interface Answer {
    id: string;
    content: string;
    ai_analysis?: {
        directness_score: number;
        summary: string;
        flags: string[];
    };
    created_at: string;
    total_votes: number;
    helpful_votes: number;
    evasive_votes: number;
}

interface BountyDetails {
    question_id: string;
    total_bounty: number;
    contributors: { citizen_id: string; citizen_name: string; amount: number }[];
    time_remaining_hours: number;
}

export default function QuestionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, token } = useAuth();
    const questionId = params.id as string;

    const [question, setQuestion] = useState<Question | null>(null);
    const [answer, setAnswer] = useState<Answer | null>(null);
    const [bountyDetails, setBountyDetails] = useState<BountyDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [stakeAmount, setStakeAmount] = useState('');
    const [isStaking, setIsStaking] = useState(false);
    const [showStakeModal, setShowStakeModal] = useState(false);
    const [userHasStaked, setUserHasStaked] = useState(false);

    useEffect(() => {
        loadData();

        // Subscribe to real-time updates
        const escrowSub = subscribeToEscrow(questionId, loadData);

        return () => {
            escrowSub.unsubscribe();
        };
    }, [questionId]);

    const loadData = async () => {
        try {
            const [questionData, bountyData] = await Promise.all([
                questionsApi.get(questionId),
                bountiesApi.getDetails(questionId),
            ]);

            setQuestion(questionData as Question);
            setBountyDetails(bountyData as BountyDetails);

            // Check if user has staked
            if (user) {
                const bd = bountyData as BountyDetails;
                setUserHasStaked(bd.contributors.some(c => c.citizen_id === user.id));
            }

            // Load answer if exists
            if ((questionData as Question).has_answer) {
                try {
                    const answerData = await answersApi.get(questionId);
                    setAnswer(answerData as Answer);
                } catch (e) {
                    // No answer yet
                }
            }
        } catch (error) {
            console.error('Failed to load question:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStake = async () => {
        if (!token || !stakeAmount) return;

        setIsStaking(true);
        try {
            await bountiesApi.stake(questionId, parseInt(stakeAmount), token);
            await loadData();
            setShowStakeModal(false);
            setStakeAmount('');
        } catch (error) {
            console.error('Failed to stake:', error);
        } finally {
            setIsStaking(false);
        }
    };

    const handleVote = async (isHelpful: boolean) => {
        if (!token || !answer) return;
        await answersApi.vote(answer.id, isHelpful, token);
        await loadData();
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="h-64 rounded-2xl bg-gray-800/50 animate-pulse" />
            </div>
        );
    }

    if (!question) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                <p className="text-gray-400">Question not found</p>
                <Link href="/questions">
                    <Button variant="ghost" className="mt-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Questions
                    </Button>
                </Link>
            </div>
        );
    }

    const statusBadge = {
        open: { variant: 'success' as const, label: 'Open' },
        answered: { variant: 'info' as const, label: 'Answered' },
        expired: { variant: 'danger' as const, label: 'Expired' },
        flagged: { variant: 'warning' as const, label: 'Flagged' },
    }[question.status] || { variant: 'default' as const, label: question.status };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back button */}
            <Link href="/questions" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Questions
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card hover={false}>
                        <div className="flex items-start justify-between mb-4">
                            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Clock className="w-4 h-4" />
                                {new Date(question.deadline).toLocaleDateString()}
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-4">{question.title}</h1>

                        <p className="text-gray-300 whitespace-pre-wrap">{question.body}</p>

                        <div className="mt-6 pt-6 border-t border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <User className="w-4 h-4" />
                                Asked by {question.citizen_name || 'Anonymous'}
                            </div>
                            <div className="text-sm text-cyan-400">
                                → {question.politician_name || 'Unknown Politician'}
                            </div>
                        </div>
                    </Card>

                    {/* Answer Section */}
                    {answer ? (
                        <Card hover={false}>
                            <div className="flex items-center gap-2 mb-4">
                                <MessageSquare className="w-5 h-5 text-emerald-400" />
                                <h2 className="text-lg font-semibold text-white">Answer</h2>
                            </div>

                            <p className="text-gray-300 whitespace-pre-wrap mb-6">{answer.content}</p>

                            <VotingPanel
                                answerId={answer.id}
                                totalVotes={answer.total_votes}
                                helpfulVotes={answer.helpful_votes}
                                evasiveVotes={answer.evasive_votes}
                                aiDirectnessScore={answer.ai_analysis?.directness_score}
                                canVote={userHasStaked && !!token}
                                onVote={handleVote}
                            />
                        </Card>
                    ) : question.status === 'open' ? (
                        <Card hover={false} className="text-center py-8">
                            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">Waiting for politician to respond...</p>
                        </Card>
                    ) : null}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {bountyDetails && (
                        <BountyMeter
                            totalBounty={bountyDetails.total_bounty}
                            stakerCount={bountyDetails.contributors.length}
                            timeRemainingHours={bountyDetails.time_remaining_hours}
                            showStakeButton={question.status === 'open' && user?.role === 'citizen'}
                            onStake={() => setShowStakeModal(true)}
                        />
                    )}

                    {/* Contributors */}
                    {bountyDetails && bountyDetails.contributors.length > 0 && (
                        <Card hover={false}>
                            <h3 className="text-sm font-medium text-gray-400 mb-3">Top Stakers</h3>
                            <div className="space-y-2">
                                {bountyDetails.contributors.slice(0, 5).map((c, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-gray-300">{c.citizen_name}</span>
                                        <span className="text-emerald-400">{c.amount} pts</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Stake Modal */}
            {showStakeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md mx-4"
                    >
                        <Card hover={false}>
                            <h2 className="text-xl font-bold text-white mb-4">Add to Bounty</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                Stake points to increase visibility and show this issue matters.
                            </p>

                            <Input
                                label="Amount (points)"
                                type="number"
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                                placeholder="50"
                                min="1"
                            />

                            <div className="flex gap-4 mt-6">
                                <Button
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => setShowStakeModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleStake}
                                    isLoading={isStaking}
                                    disabled={!stakeAmount || isStaking}
                                >
                                    Stake Points
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
