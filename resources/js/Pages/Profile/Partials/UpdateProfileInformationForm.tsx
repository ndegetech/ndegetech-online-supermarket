import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { PageProps } from '@/types';

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage<PageProps>().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), { preserveScroll: true });
    };

    return (
        <section>
            <header>
                <h2 className="text-sm font-semibold text-zinc-900">Profile information</h2>
                <p className="mt-1 text-[12px] text-zinc-500">Update your name and email address.</p>
            </header>

            <form onSubmit={submit} className="mt-5 space-y-4">
                <div>
                    <label className="block text-[12px] font-medium text-zinc-700">Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                        required
                        autoComplete="name"
                    />
                    {errors.name && <p className="mt-1 text-[12px] text-red-600">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-[12px] font-medium text-zinc-700">Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                        required
                        autoComplete="username"
                    />
                    {errors.email && <p className="mt-1 text-[12px] text-red-600">{errors.email}</p>}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
                        Your email is unverified.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="font-medium underline"
                        >
                            Resend verification email
                        </Link>
                        {status === 'verification-link-sent' && (
                            <p className="mt-1 font-medium text-emerald-700">
                                A new verification link has been sent.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-zinc-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                    >
                        {processing ? 'Saving...' : 'Save'}
                    </button>
                    {recentlySuccessful && (
                        <span className="text-[12px] font-medium text-emerald-600">Saved.</span>
                    )}
                </div>
            </form>
        </section>
    );
}