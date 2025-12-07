/**
 * Wallet Page
 */

'use client';

// Prevent static prerendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Coins, Plus, TrendingUp, Lock, Unlock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { bountiesApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface WalletInfo {
    user_id: string;
    civic_points: number;
    total_staked: number;
    total_earned: number;
}

export default function WalletPage() {
    const router = useRouter();
    const { user, token } = useAuth();
    const [wallet, setWallet] = useState<WalletInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [purchaseAmount, setPurchaseAmount] = useState('');
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [showPurchase, setShowPurchase] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        loadWallet();
    }, [user]);

    const loadWallet = async () => {
        if (!token) return;

        try {
            const data = await bountiesApi.getWallet(token);
            setWallet(data as WalletInfo);
        } catch (error) {
            console.error('Failed to load wallet:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePurchase = async () => {
        if (!token || !purchaseAmount) return;

        setIsPurchasing(true);
        try {
            await bountiesApi.purchase(parseInt(purchaseAmount), token);
            await loadWallet();
            setShowPurchase(false);
            setPurchaseAmount('');
        } catch (error) {
            console.error('Failed to purchase:', error);
        } finally {
            setIsPurchasing(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Wallet</h1>
                    <p className="text-gray-400 text-sm">Manage your civic points</p>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    <div className="h-32 rounded-2xl bg-gray-800/50 animate-pulse" />
                    <div className="h-24 rounded-2xl bg-gray-800/50 animate-pulse" />
                </div>
            ) : wallet ? (
                <div className="space-y-6">
                    {/* Main Balance */}
                    <Card variant="highlight" hover={false}>
                        <div className="text-center py-4">
                            <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
                                <Coins className="w-5 h-5" />
                                <span>Available Balance</span>
                            </div>
                            <motion.p
                                key={wallet.civic_points}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="text-5xl font-bold text-white"
                            >
                                {wallet.civic_points.toLocaleString()}
                            </motion.p>
                            <p className="text-emerald-400 mt-1">Civic Points</p>
                        </div>

                        <Button
                            className="w-full mt-6"
                            onClick={() => setShowPurchase(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Get More Points
                        </Button>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card hover={false}>
                            <div className="flex items-center gap-3">
                                <Lock className="w-8 h-8 text-yellow-400" />
                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        {wallet.total_staked.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-400">Staked</p>
                                </div>
                            </div>
                        </Card>
                        <Card hover={false}>
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-8 h-8 text-emerald-400" />
                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        {wallet.total_earned.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {user.role === 'politician' ? 'To Charity' : 'Earned'}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Info */}
                    <Card hover={false}>
                        <h3 className="font-medium text-white mb-2">How Points Work</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-start gap-2">
                                <Coins className="w-4 h-4 mt-0.5 text-emerald-400" />
                                Stake points on questions to increase their visibility
                            </li>
                            <li className="flex items-start gap-2">
                                <Lock className="w-4 h-4 mt-0.5 text-yellow-400" />
                                Staked points are held in escrow until the question is answered
                            </li>
                            <li className="flex items-start gap-2">
                                <Unlock className="w-4 h-4 mt-0.5 text-cyan-400" />
                                When answered, points are released to the politician&apos;s chosen charity
                            </li>
                        </ul>
                    </Card>
                </div>
            ) : (
                <Card hover={false} className="text-center py-12">
                    <p className="text-gray-400">Failed to load wallet</p>
                </Card>
            )}

            {/* Purchase Modal */}
            {showPurchase && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md mx-4"
                    >
                        <Card hover={false}>
                            <h2 className="text-xl font-bold text-white mb-2">Get Civic Points</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                For this demo, you can get up to 1,000 points at a time.
                            </p>

                            <Input
                                label="Amount"
                                type="number"
                                value={purchaseAmount}
                                onChange={(e) => setPurchaseAmount(e.target.value)}
                                placeholder="100"
                                min="1"
                                max="1000"
                            />

                            <div className="flex gap-4 mt-6">
                                <Button
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => setShowPurchase(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handlePurchase}
                                    isLoading={isPurchasing}
                                    disabled={!purchaseAmount || isPurchasing}
                                >
                                    Get Points
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
