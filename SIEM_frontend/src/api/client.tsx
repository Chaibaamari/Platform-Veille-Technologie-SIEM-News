/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = 'http://127.0.0.1:8000/api/';

// Custom fetch wrapper for React Query (kept for future real API integration, but not used currently)
export const apiClient = async ({ queryKey, signal }: { queryKey: [string, ...unknown[]], signal?: AbortSignal }) => {
    const [url, options = {}] = queryKey as [string, RequestInit?];
    const token = localStorage.getItem('auth_token');
    const config = {
        signal,
        credentials: 'include' as RequestCredentials,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...((options as RequestInit)?.headers || {}),
        },
        ...options,
    };
    console.log(`Fetching from API: ${API_BASE_URL}${url} with config:`, config);

    const response = await fetch(`${API_BASE_URL}${url}`, config);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const apiBlog = async ({
    queryKey,
    signal,
}: {
    queryKey: [string, ...unknown[]]
    signal?: AbortSignal
}) => {
    const [url, params = {}] = queryKey as [string, Record<string, any>]

    const token = localStorage.getItem("auth_token")

    const queryString = new URLSearchParams(params).toString()

    const response = await fetch(
        `${API_BASE_URL}${url}${queryString ? `?${queryString}` : ""}`,
        {
            signal,
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        }
    )

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
};

export const apiMutation = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('auth_token');
    const isFormData = options.body instanceof FormData;
    const headers = {
        'Accept': 'application/json',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...((options.headers as Record<string, string>) || {}),
    };

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, config);

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText || response.statusText}`);
    }
    return response.json();
};