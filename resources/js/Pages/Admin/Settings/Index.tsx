import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEvent } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface Settings {
    business_name: string;
    whatsapp_number: string;
    business_description: string;
    contact_email: string;
    contact_phone: string;
    facebook_url: string;
    instagram_url: string;
    tiktok_url: string;
}

interface Props {
    settings: Settings;
}

export default function Index({ settings }: Props) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        business_name: settings.business_name || '',
        whatsapp_number: settings.whatsapp_number || '',
        business_description: settings.business_description || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        tiktok_url: settings.tiktok_url || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('admin.settings.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title={t('Settings')} />

            <div className="max-w-2xl space-y-5">
                <div>
                    <h1 className="text-lg font-semibold text-zinc-900">{t('Settings')}</h1>
                    <p className="mt-0.5 text-[12px] text-zinc-500">
                        {t('Business info and contact numbers used on the public website')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
                        <h2 className="text-sm font-semibold text-zinc-900">
                            {t('Business Information')}
                        </h2>

                        <div>
                            <label className="block text-[12px] font-medium text-zinc-700">
                                {t('Business Name')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.business_name}
                                onChange={(e) => setData('business_name', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                            />
                            {errors.business_name && (
                                <p className="mt-1 text-[12px] text-red-600">{errors.business_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-[12px] font-medium text-zinc-700">
                                {t('Business Description')}
                            </label>
                            <textarea
                                value={data.business_description}
                                onChange={(e) => setData('business_description', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    {/* Numbers — can be different */}
                    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
                        <div>
                            <h2 className="text-sm font-semibold text-zinc-900">
                                {t('Order contact numbers')}
                            </h2>
                            <p className="mt-0.5 text-[11px] text-zinc-500">
                                {t('WhatsApp and Call/SMS can use different numbers')}
                            </p>
                        </div>

                        <div>
                            <label className="block text-[12px] font-medium text-zinc-700">
                                {t('WhatsApp Number')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.whatsapp_number}
                                onChange={(e) => setData('whatsapp_number', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                                placeholder="255678861389"
                            />
                            <p className="mt-1 text-[11px] text-zinc-500">
                                {t('For WhatsApp orders only. Without + or spaces (e.g. 255678861389)')}
                            </p>
                            {errors.whatsapp_number && (
                                <p className="mt-1 text-[12px] text-red-600">{errors.whatsapp_number}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-[12px] font-medium text-zinc-700">
                                {t('Call / SMS Number')}
                            </label>
                            <input
                                type="text"
                                value={data.contact_phone}
                                onChange={(e) => setData('contact_phone', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                                placeholder="255712345678"
                            />
                            <p className="mt-1 text-[11px] text-zinc-500">
                                {t('For Call and SMS orders. Can be different from WhatsApp. Without + or spaces')}
                            </p>
                            {errors.contact_phone && (
                                <p className="mt-1 text-[12px] text-red-600">{errors.contact_phone}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
                        <h2 className="text-sm font-semibold text-zinc-900">
                            {t('Contact Details')}
                        </h2>
                        <div>
                            <label className="block text-[12px] font-medium text-zinc-700">
                                {t('Email')}
                            </label>
                            <input
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                            />
                            {errors.contact_email && (
                                <p className="mt-1 text-[12px] text-red-600">{errors.contact_email}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
                        <h2 className="text-sm font-semibold text-zinc-900">
                            {t('Social Media')}
                        </h2>
                        <div>
                            <label className="block text-[12px] font-medium text-zinc-700">
                                {t('Facebook URL')}
                            </label>
                            <input
                                type="url"
                                value={data.facebook_url}
                                onChange={(e) => setData('facebook_url', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                                placeholder="https://facebook.com/..."
                            />
                            {errors.facebook_url && (
                                <p className="mt-1 text-[12px] text-red-600">{errors.facebook_url}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-[12px] font-medium text-zinc-700">
                                {t('Instagram URL')}
                            </label>
                            <input
                                type="url"
                                value={data.instagram_url}
                                onChange={(e) => setData('instagram_url', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-[12px] font-medium text-zinc-700">
                                {t('TikTok URL')}
                            </label>
                            <input
                                type="url"
                                value={data.tiktok_url}
                                onChange={(e) => setData('tiktok_url', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                                placeholder="https://tiktok.com/@..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        {recentlySuccessful && (
                            <span className="text-[12px] font-medium text-emerald-600">
                                {t('Settings saved — website updated')}
                            </span>
                        )}
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-zinc-900 px-5 py-2 text-[13px] font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
                        >
                            {processing ? t('Saving...') : t('Save Settings')}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}