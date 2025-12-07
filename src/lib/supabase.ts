/**
 * Supabase client for authentication and real-time subscriptions
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Real-time subscription helpers
export function subscribeToQuestions(callback: (payload: unknown) => void) {
    return supabase
        .channel('questions-changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'questions' },
            callback
        )
        .subscribe();
}

export function subscribeToLeaderboard(callback: (payload: unknown) => void) {
    return supabase
        .channel('profiles-changes')
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'profiles', filter: 'role=eq.politician' },
            callback
        )
        .subscribe();
}

export function subscribeToVotes(answerId: string, callback: (payload: unknown) => void) {
    return supabase
        .channel(`votes-${answerId}`)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'votes', filter: `answer_id=eq.${answerId}` },
            callback
        )
        .subscribe();
}

export function subscribeToEscrow(questionId: string, callback: (payload: unknown) => void) {
    return supabase
        .channel(`escrow-${questionId}`)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'escrow', filter: `question_id=eq.${questionId}` },
            callback
        )
        .subscribe();
}
