/**
 * Voting Panel component
 */

'use client';

import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Brain } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface VotingPanelProps {
    answerId: string;
    totalVotes: number;
    helpfulVotes: number;
    evasiveVotes: number;
    aiDirectnessScore?: number;
    userVote?: boolean | null;
    canVote: boolean;
    onVote: (isHelpful: boolean) => Promise<void>;
}

export function VotingPanel({
    answerId,
    totalVotes,
    helpfulVotes,
    evasiveVotes,
    aiDirectnessScore,
    userVote,
    canVote,
    onVote,
}: VotingPanelProps) {
    const [isVoting, setIsVoting] = useState(false);
    const [localVote, setLocalVote] = useState<boolean | null>(userVote ?? null);

    const handleVote = async (isHelpful: boolean) => {
        if (!canVote || isVoting) return;

        setIsVoting(true);
        try {
            await onVote(isHelpful);
            setLocalVote(isHelpful);
        } finally {
            setIsVoting(false);
        }
    };

    const helpfulPercentage = totalVotes > 0 ? (helpfulVotes / totalVotes) * 100 : 50;

    const getAIBadgeVariant = (score: number) => {
        if (score >= 70) return 'success';
        if (score >= 40) return 'warning';
        return 'danger';
    };

    return (
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
            {/* AI Analysis */}
            {aiDirectnessScore !== undefined && (
                <div className="mb-6 p-4 rounded-xl bg-gray-700/30 border border-gray-600/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-cyan-400" />
                            <span className="text-gray-300 text-sm">AI Directness Analysis</span>
                        </div>
                        <Badge variant={getAIBadgeVariant(aiDirectnessScore)}>
                            {aiDirectnessScore.toFixed(0)}% Direct
                        </Badge>
                    </div>
                    <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${aiDirectnessScore >= 70
                                    ? 'bg-emerald-500'
                                    : aiDirectnessScore >= 40
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${aiDirectnessScore}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Vote counts */}
            <div className="text-center mb-6">
                <p className="text-gray-400 text-sm mb-2">Community Verdict</p>
                <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-400">{helpfulVotes}</p>
                        <p className="text-xs text-gray-500">Helpful</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-red-400">{evasiveVotes}</p>
                        <p className="text-xs text-gray-500">Evasive</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-3 bg-gray-700 rounded-full overflow-hidden flex">
                    <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${helpfulPercentage}%` }}
                    />
                    <motion.div
                        className="h-full bg-red-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - helpfulPercentage}%` }}
                    />
                </div>
            </div>

            {/* Voting buttons */}
            {canVote ? (
                <div className="flex gap-4">
                    <Button
                        variant={localVote === true ? 'primary' : 'outline'}
                        className="flex-1"
                        onClick={() => handleVote(true)}
                        isLoading={isVoting}
                        disabled={isVoting}
                    >
                        <ThumbsUp className="w-5 h-5 mr-2" />
                        Helpful
                    </Button>
                    <Button
                        variant={localVote === false ? 'danger' : 'outline'}
                        className="flex-1"
                        onClick={() => handleVote(false)}
                        isLoading={isVoting}
                        disabled={isVoting}
                    >
                        <ThumbsDown className="w-5 h-5 mr-2" />
                        Evasive
                    </Button>
                </div>
            ) : (
                <p className="text-center text-gray-500 text-sm">
                    Only stakers can vote on this answer
                </p>
            )}

            {localVote !== null && (
                <p className="text-center text-sm text-gray-400 mt-4">
                    You voted: <span className={localVote ? 'text-emerald-400' : 'text-red-400'}>
                        {localVote ? 'Helpful' : 'Evasive'}
                    </span>
                </p>
            )}
        </div>
    );
}
