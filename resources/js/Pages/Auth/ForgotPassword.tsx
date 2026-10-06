import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-10">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-1/2 top-0 h-full w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent animate-beam-1" />
                    <div className="absolute -left-1/2 top-0 h-full w-1/4 skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-beam-2" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(24,24,27,0)_0%,rgb(9,9,11)_70%)]" />
                </div>

                <div className="relative w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="mx-auto overflow-hidden rounded-xl bg-zinc-900 p-1.5 ring-1 ring-zinc-700">
                            <img
                                src="/images/logo.png"
                                alt="NdegeTech"
                                className="mx-auto h-10 w-auto max-w-[100px] object-contain"
                            />
                        </div>
                        <h1 className="mt-4 text-xl font-semibold tracking-tight text-white">
                            Forgot password
                        </h1>
                        <p className="mt-1 text-[13px] text-zinc-400">
                            Enter your email and we’ll send a reset link
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
                        {status && (
                            <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[13px] text-emerald-400">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-[12px] font-medium text-zinc-300">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1.5 block w-full rounded-lg border-zinc-700 bg-zinc-950 text-sm text-white placeholder:text-zinc-600 focus:border-amber-500 focus:ring-amber-500"
                                    placeholder="admin@ndegetech.com"
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-[12px] text-red-400">{errors.email}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center rounded-lg bg-amber-500 px-4 py-2.5 text-[13px] font-semibold text-zinc-950 transition hover:bg-amber-400 disabled:opacity-60"
                            >
                                {processing ? 'Sending...' : 'Send reset link'}
                            </button>
                        </form>

                        <p className="mt-5 text-center">
                            <Link
                                href={route('login')}
                                className="text-[12px] font-medium text-zinc-400 transition hover:text-amber-400"
                            >
                                ← Back to login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes beam-1 {
                    0% { transform: translateX(-40%) skewX(12deg); opacity: 0; }
                    12% { opacity: 1; }
                    88% { opacity: 1; }
                    100% { transform: translateX(240%) skewX(12deg); opacity: 0; }
                }
                @keyframes beam-2 {
                    0% { transform: translateX(-60%) skewX(12deg); opacity: 0; }
                    20% { opacity: 0.85; }
                    80% { opacity: 0.85; }
                    100% { transform: translateX(260%) skewX(12deg); opacity: 0; }
                }
                .animate-beam-1 { animation: beam-1 2.8s ease-in-out infinite; }
                .animate-beam-2 { animation: beam-2 3.6s ease-in-out infinite 0.7s; }
            `}</style>
        </>
    );
}