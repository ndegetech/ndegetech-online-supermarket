import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function UpdatePasswordForm() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errs.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    const EyeButton = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
        <button
            type="button"
            onClick={onToggle}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 hover:text-zinc-600"
            tabIndex={-1}
        >
            {show ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
            ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )}
        </button>
    );

    return (
        <section>
            <header>
                <h2 className="text-sm font-semibold text-zinc-900">Update Password</h2>
                <p className="mt-1 text-[12px] text-zinc-500">
                    Use a strong password. Current password is required.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-5 space-y-4">
                <div>
                    <label className="block text-[12px] font-medium text-zinc-700">Current password</label>
                    <div className="relative mt-1">
                        <input
                            ref={currentPasswordInput}
                            type={showCurrent ? 'text' : 'password'}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            className="block w-full rounded-lg border-zinc-300 pr-10 text-sm focus:border-amber-500 focus:ring-amber-500"
                            autoComplete="current-password"
                        />
                        <EyeButton show={showCurrent} onToggle={() => setShowCurrent((v) => !v)} />
                    </div>
                    {errors.current_password && (
                        <p className="mt-1 text-[12px] text-red-600">{errors.current_password}</p>
                    )}
                </div>

                <div>
                    <label className="block text-[12px] font-medium text-zinc-700">New password</label>
                    <div className="relative mt-1">
                        <input
                            ref={passwordInput}
                            type={showNew ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="block w-full rounded-lg border-zinc-300 pr-10 text-sm focus:border-amber-500 focus:ring-amber-500"
                            autoComplete="new-password"
                        />
                        <EyeButton show={showNew} onToggle={() => setShowNew((v) => !v)} />
                    </div>
                    {errors.password && <p className="mt-1 text-[12px] text-red-600">{errors.password}</p>}
                </div>

                <div>
                    <label className="block text-[12px] font-medium text-zinc-700">Confirm new password</label>
                    <div className="relative mt-1">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="block w-full rounded-lg border-zinc-300 pr-10 text-sm focus:border-amber-500 focus:ring-amber-500"
                            autoComplete="new-password"
                        />
                        <EyeButton show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
                    </div>
                    {errors.password_confirmation && (
                        <p className="mt-1 text-[12px] text-red-600">{errors.password_confirmation}</p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-zinc-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                    >
                        {processing ? 'Saving...' : 'Save password'}
                    </button>
                    {recentlySuccessful && (
                        <span className="text-[12px] font-medium text-emerald-600">Password updated.</span>
                    )}
                </div>
            </form>
        </section>
    );
}