import { useState } from 'react';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export interface NewsletterFormData {
  email: string;
}

interface NewsletterProps {
  apiUrl?: string; // Optional: override default API endpoint
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function Newsletter({
  apiUrl = '/api/subscribe',
  onSuccess,
  onError,
}: NewsletterProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const validateEmail = (email: string) => {
        return email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setStatus('error');
            setMessage('Please enter your email');
            return;
        }

        if (!validateEmail(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to subscribe');
            }

            setStatus('success');
            setMessage('Thank you! You are now subscribed.');
            setEmail('');
            onSuccess?.();
        } catch (err) {
            setStatus('error');
            setMessage(err instanceof Error ? err.message : 'Something went wrong');
            onError?.(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    return (
        <div className="h-screen self-stretch flex flex-col justify-start items-center gap-10 py-12 bg-linear-to-b from-slate-950 to-zinc-900">
            {/* Title & Description */}
            <div className="self-stretch flex flex-col justify-start items-center gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-3">
                    <div className="self-stretch text-center text-violet-500 text-base font-semibold  leading-6">
                        Newsletters
                    </div>
                    <div className="self-stretch text-center text-white text-5xl font-semibold  leading-15">
                        Stories and interviews
                    </div>
                </div>
                <div className="w-full max-w-3xl text-center text-neutral-300 text-xl font-normal  leading-8">
                    Subscribe to learn about new product features, the latest in technology, solutions, and updates.
                </div>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="flex justify-start items-start gap-4 flex-wrap"
            >
                <div className="w-full sm:w-96 flex flex-col justify-start items-start">
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="self-stretch pl-4 pr-3.5 py-3 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline  outline-gray-300 flex justify-start items-center gap-2 overflow-hidden text-gray-500 text-base font-normal  leading-6 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* Privacy notice */}
                        <div className="self-stretch text-sm text-neutral-300 font-normal  leading-5">
                            We care about your data in our{' '}
                            <a href="/privacy" className="underline hover:text-violet-400 transition">
                                privacy policy
                            </a>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-5 py-3 bg-violet-500 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline  outline-violet-500 flex justify-center items-center gap-2 overflow-hidden text-white text-base font-medium  leading-6 hover:bg-violet-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Subscribing...
                        </>
                    ) : (
                        'Subscribe'
                    )}
                </button>
            </form>

            {/* Status Messages */}
            {status === 'success' && (
                <div className="mt-6 flex items-center gap-2 text-green-400 text-lg">
                    <CheckCircle className="w-6 h-6" />
                    {message}
                </div>
            )}

            {status === 'error' && (
                <div className="mt-6 flex items-center gap-2 text-red-400 text-lg">
                    <AlertCircle className="w-6 h-6" />
                    {message}
                </div>
            )}
        </div>
    );
}