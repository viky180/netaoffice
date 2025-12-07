/**
 * Leaderboard Page - Server Component wrapper
 */

import LeaderboardClient from './LeaderboardClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function LeaderboardPage() {
    return <LeaderboardClient />;
}
