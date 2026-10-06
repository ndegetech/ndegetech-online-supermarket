import { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset Password" />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-10">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-1/2 top-0 h-full w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent animate-beam-1" />
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
                            Reset password
                        </h1>
                        <p className="mt-1 text-[13px] text-zinc-400">
                            Choose a new password for your account
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
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
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1.5 block w-full rounded-lg border-zinc-700 bg-zinc-950 text-sm text-white focus:border-amber-500 focus:ring-amber-500"
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-[12px] text-red-400">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-[12px] font-medium text-zinc-300">
                                    New password
                                </label>
                                <div className="relative mt-1.5">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        autoComplete="new-password"
                                        autoFocus
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="block w-full rounded-lg border-zinc-700 bg-zinc-950 pr-11 text-sm text-white focus:border-amber-500 focus:ring-amber-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500 hover:text-zinc-300"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-[12px] text-red-400">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-[12px] font-medium text-zinc-300">
                                    Confirm password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="mt-1.5 block w-full rounded-lg border-zinc-700 bg-zinc-950 text-sm text-white focus:border-amber-500 focus:ring-amber-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center rounded-lg bg-amber-500 px-4 py-2.5 text-[13px] font-semibold text-zinc-950 transition hover:bg-amber-400 disabled:opacity-60"
                            >
                                {processing ? 'Saving...' : 'Reset password'}
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
                .animate-beam-1 { animation: beam-1 2.8s ease-in-out infinite; }
            `}</style>
        </>
    );
}