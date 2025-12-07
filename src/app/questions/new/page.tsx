/**
 * New Question Page
 */

'use client';

// Prevent static prerendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle, Coins, Send } from 'lucide-react';
import Link from 'next/link';
import { questionsApi, leaderboardApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface Politician {
    id: string;
    display_name: string;
}

export default function NewQuestionPage() {
    const router = useRouter();
    const { user, token } = useAuth();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [targetPoliticianId, setTargetPoliticianId] = useState('');
    const [initialStake, setInitialStake] = useState('0');
    const [politicians, setPoliticians] = useState<Politician[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadPoliticians();
    }, []);

    const loadPoliticians = async () => {
        try {
            const data = await leaderboardApi.get(100);
            setPoliticians(data as Politician[]);
        } catch (e) {
            console.error('Failed to load politicians:', e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            router.push('/auth/login');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const question = await questionsApi.create({
                title,
                body,
                target_politician_id: targetPoliticianId,
                initial_stake: parseInt(initialStake) || 0,
            }, token);

            router.push(`/questions/${(question as { id: string }).id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create question');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8 text-center">
                <Card hover={false}>
                    <HelpCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
                    <p className="text-gray-400 mb-6">You need to be logged in as a citizen to ask questions.</p>
                    <Link href="/auth/login">
                        <Button>Sign In</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    if (user.role !== 'citizen') {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8 text-center">
                <Card hover={false}>
                    <HelpCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Citizens Only</h2>
                    <p className="text-gray-400">Only citizens can ask questions. Politicians can answer them!</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <Link href="/questions" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Questions
            </Link>

            <Card hover={false}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                        <HelpCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Ask a Question</h1>
                        <p className="text-gray-400 text-sm">Hold your representative accountable</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <Input
                        label="Question Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., When will potholes on Main St be fixed?"
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Detailed Question
                        </label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Provide context and specific details about the issue..."
                            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[150px] resize-y"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Target Politician
                        </label>
                        <select
                            value={targetPoliticianId}
                            onChange={(e) => setTargetPoliticianId(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select a politician...</option>
                            {politicians.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.display_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Coins className="w-4 h-4 text-emerald-400" />
                                Initial Stake (optional)
                            </div>
                        </label>
                        <Input
                            type="number"
                            value={initialStake}
                            onChange={(e) => setInitialStake(e.target.value)}
                            placeholder="0"
                            min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Stake points to show this question matters. Others can add to the bounty.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                        disabled={isLoading || !title || !body || !targetPoliticianId}
                    >
                        <Send className="w-4 h-4 mr-2" />
                        Submit Question
                    </Button>
                </form>
            </Card>
        </div>
    );
}
