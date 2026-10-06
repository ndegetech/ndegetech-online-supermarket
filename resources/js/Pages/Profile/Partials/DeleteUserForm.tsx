import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function DeleteUserForm() {
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({ password: '' });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
            },
            onError: () => {},
            onFinish: () => reset(),
        });
    };

    const close = () => {
        setOpen(false);
        clearErrors();
        reset();
    };

    return (
        <section>
            <header>
                <h2 className="text-sm font-semibold text-red-700">Delete account</h2>
                <p className="mt-1 text-[12px] text-zinc-500">
                    Permanently delete your account. This cannot be undone.
                </p>
            </header>

            <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-[13px] font-medium text-red-700 hover:bg-red-100"
            >
                Delete account
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl">
                        <h3 className="text-sm font-semibold text-zinc-900">
                            Are you sure?
                        </h3>
                        <p className="mt-2 text-[13px] text-zinc-600">
                            Enter your password to confirm permanent account deletion.
                        </p>

                        <form onSubmit={deleteUser} className="mt-4 space-y-3">
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="block w-full rounded-lg border-zinc-300 pr-10 text-sm focus:border-red-500 focus:ring-red-500"
                                    placeholder="Password"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400"
                                    tabIndex={-1}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        {showPassword ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        ) : (
                                            <>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </>
                                        )}
                                    </svg>
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-[12px] text-red-600">{errors.password}</p>
                            )}

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={close}
                                    className="flex-1 rounded-lg border border-zinc-300 py-2 text-[13px] font-medium text-zinc-700 hover:bg-zinc-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 rounded-lg bg-red-600 py-2 text-[13px] font-medium text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    {processing ? 'Deleting...' : 'Delete account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}