/**
 * Leaderboard Client Component
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw } from 'lucide-react';
import { leaderboardApi } from '@/lib/api';
import { subscribeToLeaderboard } from '@/lib/supabase';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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

interface DashboardStats {
    total_questions: number;
    open_questions: number;
    total_politicians: number;
    total_citizens: number;
    total_bounty_in_escrow: number;
    total_released_to_charity: number;
}

export default function LeaderboardClient() {
    const [politicians, setPoliticians] = useState<Politician[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadData();

        // Subscribe to real-time updates
        const subscription = subscribeToLeaderboard(() => {
            loadData();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const loadData = async () => {
        try {
            const [leaderboardData, statsData] = await Promise.all([
                leaderboardApi.get(50),
                leaderboardApi.getDashboardStats(),
            ]);
            setPoliticians(leaderboardData as Politician[]);
            setStats(statsData as DashboardStats);
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
                        <p className="text-gray-400">
                            Politicians ranked by accountability score
                        </p>
                    </div>
                </div>

                <Button variant="ghost" onClick={loadData} disabled={isLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card hover={false} className="text-center">
                        <p className="text-2xl font-bold text-white">
                            {stats.total_politicians}
                        </p>
                        <p className="text-sm text-gray-400">Politicians</p>
                    </Card>
                    <Card hover={false} className="text-center">
                        <p className="text-2xl font-bold text-white">
                            {stats.total_questions}
                        </p>
                        <p className="text-sm text-gray-400">Questions</p>
                    </Card>
                    <Card hover={false} className="text-center">
                        <p className="text-2xl font-bold text-emerald-400">
                            {stats.total_bounty_in_escrow.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400">Points in Escrow</p>
                    </Card>
                    <Card hover={false} className="text-center">
                        <p className="text-2xl font-bold text-cyan-400">
                            {stats.total_released_to_charity.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400">To Charities</p>
                    </Card>
                </div>
            )}

            {/* Leaderboard Table */}
            <Card hover={false}>
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="h-16 rounded-lg bg-gray-700/50 animate-pulse"
                            />
                        ))}
                    </div>
                ) : politicians.length === 0 ? (
                    <p className="text-center text-gray-400 py-12">
                        No politicians registered yet
                    </p>
                ) : (
                    <LeaderboardTable politicians={politicians} />
                )}
            </Card>

            {/* Live Update Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/90 border border-gray-700 shadow-lg"
            >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm text-gray-400">Live updates</span>
            </motion.div>
        </div>
    );
}
