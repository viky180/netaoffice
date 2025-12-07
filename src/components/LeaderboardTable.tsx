/**
 * Leaderboard Table component
 */

'use client';

import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Clock, ThumbsUp, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from './ui/Badge';

interface Politician {
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
}

interface LeaderboardTableProps {
    politicians: Politician[];
    compact?: boolean;
}

export function LeaderboardTable({ politicians, compact = false }: LeaderboardTableProps) {
    const getRankBadge = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const getConservativeRating = (mu: number, sigma: number) => {
        return Math.max(0, mu - 3 * sigma).toFixed(1);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-700">
                        <th className="text-left py-4 px-4 text-gray-400 font-medium">Rank</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium">Politician</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium">
                            <div className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                Skill
                            </div>
                        </th>
                        {!compact && (
                            <>
                                <th className="text-left py-4 px-4 text-gray-400 font-medium">
                                    <div className="flex items-center gap-1">
                                        <ThumbsUp className="w-4 h-4" />
                                        Satisfaction
                                    </div>
                                </th>
                                <th className="text-left py-4 px-4 text-gray-400 font-medium">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        Avg Response
                                    </div>
                                </th>
                                <th className="text-left py-4 px-4 text-gray-400 font-medium">Bounty Earned</th>
                            </>
                        )}
                        <th className="py-4 px-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {politicians.map((politician, index) => (
                        <motion.tr
                            key={politician.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                        >
                            <td className="py-4 px-4">
                                <span className={`text-lg ${politician.rank <= 3 ? 'text-xl' : 'text-gray-400'}`}>
                                    {getRankBadge(politician.rank)}
                                </span>
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                        {politician.display_name[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium flex items-center gap-2">
                                            {politician.display_name}
                                            {politician.verified && (
                                                <Badge variant="success" size="sm">Verified</Badge>
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {politician.questions_answered} answers
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, (politician.mu / 50) * 100)}%` }}
                                            transition={{ delay: index * 0.05 + 0.2 }}
                                        />
                                    </div>
                                    <span className="text-white font-medium">
                                        {getConservativeRating(politician.mu, politician.sigma)}
                                    </span>
                                </div>
                            </td>
                            {!compact && (
                                <>
                                    <td className="py-4 px-4">
                                        {politician.satisfaction_rate != null ? (
                                            <span className={politician.satisfaction_rate >= 70 ? 'text-emerald-400' : politician.satisfaction_rate >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                                                {politician.satisfaction_rate.toFixed(0)}%
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        {politician.avg_response_time_hours != null ? (
                                            <span className="text-gray-300">
                                                {politician.avg_response_time_hours < 24
                                                    ? `${politician.avg_response_time_hours.toFixed(0)}h`
                                                    : `${(politician.avg_response_time_hours / 24).toFixed(1)}d`
                                                }
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-emerald-400 font-medium">
                                            {politician.total_bounty_earned.toLocaleString()} pts
                                        </span>
                                    </td>
                                </>
                            )}
                            <td className="py-4 px-4">
                                <Link href={`/leaderboard/${politician.id}`}>
                                    <ChevronRight className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                                </Link>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
