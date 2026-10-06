import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import { PageProps } from '@/types';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AdminLayout>
            <Head title="Profile" />

            <div className="mx-auto max-w-2xl space-y-5">
                <div>
                    <h1 className="text-lg font-semibold text-zinc-900">Profile</h1>
                    <p className="text-[12px] text-zinc-500">
                        Manage your account and password
                    </p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <UpdatePasswordForm />
                </div>
            </div>
        </AdminLayout>
    );
}