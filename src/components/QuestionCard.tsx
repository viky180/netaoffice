/**
 * Question Card component with bounty display
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Users, MessageSquare, TrendingUp } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface QuestionCardProps {
    id: string;
    title: string;
    body: string;
    totalBounty: number;
    stakerCount: number;
    status: string;
    politicianName?: string;
    citizenName?: string;
    hasAnswer: boolean;
    helpfulPercentage?: number;
    deadline: string;
}

export function QuestionCard({
    id,
    title,
    body,
    totalBounty,
    stakerCount,
    status,
    politicianName,
    hasAnswer,
    helpfulPercentage,
    deadline,
}: QuestionCardProps) {
    const timeRemaining = getTimeRemaining(deadline);

    const statusBadge = {
        open: { variant: 'success' as const, label: 'Open' },
        answered: { variant: 'info' as const, label: 'Answered' },
        expired: { variant: 'danger' as const, label: 'Expired' },
        flagged: { variant: 'warning' as const, label: 'Flagged' },
    }[status] || { variant: 'default' as const, label: status };

    return (
        <Link href={`/questions/${id}`}>
            <Card className="cursor-pointer overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>

                    {/* Bounty Display */}
                    <motion.div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-emerald-400">{totalBounty} pts</span>
                    </motion.div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {body}
                </p>

                {politicianName && (
                    <p className="text-sm text-cyan-400 mb-4">
                        → {politicianName}
                    </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{stakerCount} stakers</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{timeRemaining}</span>
                    </div>

                    {hasAnswer && (
                        <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                            {helpfulPercentage != null ? (
                                <span className={helpfulPercentage > 50 ? 'text-emerald-400' : 'text-red-400'}>
                                    {helpfulPercentage.toFixed(0)}% helpful
                                </span>
                            ) : (
                                <span>Answered</span>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    );
}

function getTimeRemaining(deadline: string): string {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
}
