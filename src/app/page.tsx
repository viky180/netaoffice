/**
 * CivicStake - Landing Page
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Scale,
  TrendingUp,
  Users,
  Shield,
  Zap,
  ArrowRight,
  MessageSquare,
  Trophy,
  Coins
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  const features = [
    {
      icon: <Coins className="w-8 h-8" />,
      title: 'Stake for Accountability',
      description: 'Put your civic points behind questions that matter. Higher stakes = higher priority.',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Get Real Answers',
      description: 'Politicians earn reputation by answering. AI detects evasive responses.',
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Public Rankings',
      description: 'See who\'s responsive and who\'s ignoring constituents on the live leaderboard.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Funds to Charity',
      description: 'When questions are answered, staked points go to registered charities.',
    },
  ];

  const stats = [
    { value: '2,500+', label: 'Questions Asked' },
    { value: '89%', label: 'Response Rate' },
    { value: '$45K', label: 'To Charities' },
    { value: '156', label: 'Politicians Ranked' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-animated opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm mb-6"
            >
              <Zap className="w-4 h-4" />
              The Accountability Market
            </motion.div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Hold Politicians
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Accountable
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Stake civic points on questions that matter. Politicians answer to earn reputation
              and release funds to charity. Ignore constituents? Watch your ranking drop.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/questions/new">
                <Button size="lg" className="w-full sm:w-auto">
                  Ask a Question
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              A transparent system that rewards responsive politicians and empowers citizens.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-emerald-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 border border-emerald-500/30"
          >
            <Scale className="w-16 h-16 mx-auto text-emerald-400 mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Democracy Works When
              <br />
              <span className="text-emerald-400">Representatives Listen</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Join thousands of citizens using proof-of-priority to get real answers
              from their elected officials.
            </p>
            <Link href="/auth/register">
              <Button size="lg">
                Create Your Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold">CivicStake</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 CivicStake. Building accountable democracy.
          </p>
        </div>
      </footer>
    </div>
  );
}
