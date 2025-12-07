/**
 * API client for CivicStake backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    token?: string;
}

export async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, token } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
}

// Auth endpoints
export const authApi = {
    register: (data: { email: string; password: string; display_name: string; role: string }) =>
        api('/auth/register', { method: 'POST', body: data }),

    login: (email: string, password: string) =>
        api<{ access_token: string; user: { id: string; email: string; display_name: string; role: string } }>(
            '/auth/login',
            { method: 'POST', body: { email, password } }
        ),

    me: (token: string) =>
        api('/auth/me', { token }),
};

// Questions endpoints
export const questionsApi = {
    list: (params?: { status?: string; politician_id?: string; sort_by?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.set('status', params.status);
        if (params?.politician_id) queryParams.set('politician_id', params.politician_id);
        if (params?.sort_by) queryParams.set('sort_by', params.sort_by);
        const query = queryParams.toString();
        return api(`/questions${query ? `?${query}` : ''}`);
    },

    get: (id: string) => api(`/questions/${id}`),

    create: (
        data: { title: string; body: string; target_politician_id: string; initial_stake?: number },
        token: string
    ) => api('/questions', { method: 'POST', body: data, token }),
};

// Bounties endpoints
export const bountiesApi = {
    stake: (questionId: string, amount: number, token: string) =>
        api(`/bounties/questions/${questionId}/stake`, { method: 'POST', body: { amount }, token }),

    getDetails: (questionId: string) =>
        api(`/bounties/questions/${questionId}`),

    getWallet: (token: string) =>
        api('/bounties/wallet', { token }),

    purchase: (amount: number, token: string) =>
        api('/bounties/purchase', { method: 'POST', body: { amount }, token }),
};

// Answers endpoints
export const answersApi = {
    submit: (questionId: string, content: string, token: string) =>
        api(`/answers/questions/${questionId}`, { method: 'POST', body: { content }, token }),

    get: (questionId: string) =>
        api(`/answers/questions/${questionId}`),

    vote: (answerId: string, isHelpful: boolean, token: string) =>
        api(`/answers/${answerId}/vote`, { method: 'POST', body: { is_helpful: isHelpful }, token }),

    getVotes: (answerId: string, token?: string) =>
        api(`/answers/${answerId}/votes`, { token }),
};

// Leaderboard endpoints
export const leaderboardApi = {
    get: (limit = 20, offset = 0) =>
        api(`/leaderboard?limit=${limit}&offset=${offset}`),

    getPolitician: (id: string) =>
        api(`/leaderboard/${id}`),

    getDashboardStats: () =>
        api('/leaderboard/stats/dashboard'),
};
