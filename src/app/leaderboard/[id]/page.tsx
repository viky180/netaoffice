/**
 * Politician Profile Page - Server Component wrapper
 */

import PoliticianProfileClient from './PoliticianProfileClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PoliticianProfilePage({ params }: PageProps) {
    const { id } = await params;
    return <PoliticianProfileClient politicianId={id} />;
}
