/**
 * Questions List Page - Server Component wrapper
 */

import QuestionsClient from './QuestionsClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function QuestionsPage() {
    return <QuestionsClient />;
}
