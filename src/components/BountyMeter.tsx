/**
 * Bounty Meter - animated visual for bounty amounts
 */

'use client';

import { motion } from 'framer-motion';
import { Flame, Users, Clock } from 'lucide-react';

interface BountyMeterProps {
    totalBounty: number;
    stakerCount: number;
    timeRemainingHours: number;
    onStake?: () => void;
    showStakeButton?: boolean;
}

export function BountyMeter({
    totalBounty,
    stakerCount,
    timeRemainingHours,
    onStake,
    showStakeButton = true,
}: BountyMeterProps) {
    // Determine "heat" level based on bounty
    const heatLevel = totalBounty < 50 ? 'low' : totalBounty < 200 ? 'medium' : 'high';

    const heatColors = {
        low: 'from-blue-500 to-cyan-500',
        medium: 'from-yellow-500 to-orange-500',
        high: 'from-orange-500 to-red-500',
    };

    const heatGlow = {
        low: 'shadow-cyan-500/25',
        medium: 'shadow-orange-500/25',
        high: 'shadow-red-500/50',
    };

    return (
        <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${heatColors[heatLevel]} bg-opacity-10 border border-white/10 backdrop-blur-sm shadow-lg ${heatGlow[heatLevel]}`}>
            {/* Animated background glow */}
            <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${heatColors[heatLevel]} opacity-10`}
                animate={{ opacity: [0.05, 0.15, 0.05] }}
                transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative z-10">
                {/* Main bounty display */}
                <div className="text-center mb-6">
                    <motion.div
                        className="flex justify-center items-center gap-2 mb-2"
                        animate={heatLevel === 'high' ? { scale: [1, 1.1, 1] } : undefined}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        <Flame className={`w-8 h-8 ${heatLevel === 'high' ? 'text-red-400' : 'text-orange-400'}`} />
                    </motion.div>

                    <motion.p
                        className="text-4xl font-bold text-white"
                        key={totalBounty}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        {totalBounty.toLocaleString()}
                    </motion.p>
                    <p className="text-gray-300 text-sm mt-1">Civic Points Staked</p>
                </div>

                {/* Stats row */}
                <div className="flex justify-around text-center mb-6">
                    <div>
                        <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <p className="text-white font-semibold">{stakerCount}</p>
                        <p className="text-xs text-gray-400">Stakers</p>
                    </div>
                    <div>
                        <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <p className="text-white font-semibold">
                            {timeRemainingHours > 24
                                ? `${Math.floor(timeRemainingHours / 24)}d`
                                : `${Math.floor(timeRemainingHours)}h`
                            }
                        </p>
                        <p className="text-xs text-gray-400">Remaining</p>
                    </div>
                </div>

                {/* Stake button */}
                {showStakeButton && onStake && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onStake}
                        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors border border-white/20"
                    >
                        Add to Bounty
                    </motion.button>
                )}
            </div>
        </div>
    );
}
