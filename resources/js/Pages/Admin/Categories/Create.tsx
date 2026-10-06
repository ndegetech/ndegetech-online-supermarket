import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEvent } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Create() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, progress } = useForm({
        name: '',
        description: '',
        image: null as File | null,
        status: true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.categories.store'), { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title={t('Create Category')} />

            <div className="max-w-2xl space-y-5">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.categories.index')}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-lg font-semibold text-zinc-900">{t('Create Category')}</h1>
                        <p className="text-[12px] text-zinc-500">{t('Add a new product category')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <div>
                        <label className="block text-[12px] font-medium text-zinc-700">
                            {t('Category Name')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                            placeholder={t('e.g. Phones & Tablets')}
                            autoFocus
                        />
                        {errors.name && <p className="mt-1 text-[12px] text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-[12px] font-medium text-zinc-700">{t('Description')}</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                            placeholder={t('Short description...')}
                        />
                        {errors.description && <p className="mt-1 text-[12px] text-red-600">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-[12px] font-medium text-zinc-700">{t('Category Image')}</label>
                        <label className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 transition hover:border-amber-400 hover:bg-amber-50/30">
                            <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="mt-2 text-[13px] font-medium text-zinc-600">{t('Click to upload')}</span>
                            <span className="mt-0.5 text-[11px] text-zinc-400">{t('PNG, JPG, WEBP up to 2MB')}</span>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                className="hidden"
                                onChange={(e) => setData('image', e.target.files?.[0] || null)}
                            />
                        </label>
                        {data.image && (
                            <p className="mt-1.5 text-[12px] text-amber-700">
                                {t('Selected')}: {data.image.name}
                            </p>
                        )}
                        {errors.image && <p className="mt-1 text-[12px] text-red-600">{errors.image}</p>}
                        {progress && (
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                                <div
                                    className="h-full rounded-full bg-amber-500 transition-all"
                                    style={{ width: `${progress.percentage}%` }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
                        <input
                            type="checkbox"
                            id="status"
                            checked={data.status}
                            onChange={(e) => setData('status', e.target.checked)}
                            className="h-3.5 w-3.5 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
                        />
                        <label htmlFor="status" className="text-[12px] font-medium text-zinc-700">
                            {t('Active (visible on website)')}
                        </label>
                    </div>

                    <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                        <Link
                            href={route('admin.categories.index')}
                            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-[13px] font-medium text-zinc-700 hover:bg-zinc-50"
                        >
                            {t('Cancel')}
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2 text-[13px] font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                        >
                            {processing ? t('Saving...') : t('Create Category')}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}