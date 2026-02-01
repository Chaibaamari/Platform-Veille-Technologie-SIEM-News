/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = 'http://127.0.0.1:8000/api/';

function handleUnauthorized(response: Response) {
    if (response.status === 401) {
        // Clear token if needed
        localStorage.removeItem('auth_token');
        // Redirect to login
        window.location.href = '/home';
        // Optionally throw to stop further processing
        throw new Error('Unauthorized - redirecting to login');
    }
}


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

    const response = await fetch(`${API_BASE_URL}${url}`, config);
    if (response.status === 401) handleUnauthorized(response);

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

    handleUnauthorized(response)

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

    if (response.status === 401) handleUnauthorized(response);


    if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText || response.statusText}`);
    }
    return response.json();
};

// Helper to download binary file using fetch (compatible with your auth setup)
export async function downloadReport(
  endpoint: string,          // e.g. 'reports/articles/pdf/'
  defaultFileName: string    // e.g. 'articles-report.pdf'
) {
    const token = localStorage.getItem('auth_token');

    const headers: HeadersInit = {
        'Accept': '*/*',  // crucial — do NOT force application/json
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        credentials: 'include',
        headers,
    });

    if (response.status === 401) handleUnauthorized(response);

    if (!response.ok) {
        let errorText = '';
        try {
            errorText = await response.text();
        } catch {
            throw new Error(`Report download failed: ${response.status} - ${errorText || response.statusText}`);
    }
    };

  // Try to get real filename from Content-Disposition (Django should set this)
    const disposition = response.headers.get('content-disposition');
    let fileName = defaultFileName;

    if (disposition) {
        const match = disposition.match(/filename="?(.+)"?$/i);
        if (match?.[1]) fileName = match[1];
    }

  // Trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};