import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from '@/hooks/useTranslation';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    status: boolean;
    products_count: number;
    created_at: string;
}

interface Props {
    categories: {
        data: Category[];
        links: any[];
        meta: any;
    };
}

export default function Index({ categories }: Props) {
    const { t } = useTranslation();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

    const confirmDelete = () => {
        if (!pendingDelete) return;
        setDeletingId(pendingDelete.id);
        router.delete(route('admin.categories.destroy', pendingDelete.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeletingId(null);
                setPendingDelete(null);
            },
        });
    };

    const toggleStatus = (category: Category) => {
        setTogglingId(category.id);
        router.patch(route('admin.categories.toggle-status', category.id), {}, {
            preserveScroll: true,
            onFinish: () => setTogglingId(null),
        });
    };

    return (
        <AdminLayout>
            <Head title={t('Categories')} />

            <div className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-zinc-900">{t('Categories')}</h1>
                        <p className="text-[12px] text-zinc-500">
                            {t('Manage product categories · toggle active without opening edit')}
                        </p>
                    </div>
                    <Link
                        href={route('admin.categories.create')}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-zinc-800"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {t('Add Category')}
                    </Link>
                </div>

                {/* Desktop table */}
                <div className="hidden overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm md:block">
                    <table className="min-w-full divide-y divide-zinc-100">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                                    {t('Category')}
                                </th>
                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                                    {t('Products')}
                                </th>
                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                                    {t('Status')}
                                </th>
                                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                                    {t('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {categories.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-14 text-center text-[13px] text-zinc-500">
                                        {t('No categories yet')}
                                    </td>
                                </tr>
                            ) : (
                                categories.data.map((category) => (
                                    <tr key={category.id} className="hover:bg-zinc-50/80">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {category.image ? (
                                                    <img
                                                        src={`/storage/${category.image}`}
                                                        alt={category.name}
                                                        className="h-10 w-10 rounded-lg object-cover ring-1 ring-zinc-200"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400">
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-[13px] font-medium text-zinc-900">{category.name}</p>
                                                    <p className="text-[11px] text-zinc-400">{category.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
                                                {category.products_count}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                disabled={togglingId === category.id}
                                                onClick={() => toggleStatus(category)}
                                                className="inline-flex items-center gap-2 disabled:opacity-50"
                                                title={category.status ? t('Click to deactivate') : t('Click to activate')}
                                            >
                                                <span
                                                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
                                                        category.status ? 'bg-emerald-500' : 'bg-zinc-300'
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition ${
                                                            category.status ? 'translate-x-4' : 'translate-x-1'
                                                        }`}
                                                    />
                                                </span>
                                                <span
                                                    className={`text-[11px] font-medium ${
                                                        category.status ? 'text-emerald-700' : 'text-zinc-500'
                                                    }`}
                                                >
                                                    {togglingId === category.id
                                                        ? '...'
                                                        : category.status
                                                          ? t('Active')
                                                          : t('Inactive')}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={route('admin.categories.edit', category.id)}
                                                    className="rounded-md px-2.5 py-1 text-[12px] font-medium text-zinc-600 hover:bg-zinc-100"
                                                >
                                                    {t('Edit')}
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => setPendingDelete(category)}
                                                    disabled={deletingId === category.id}
                                                    className="rounded-md px-2.5 py-1 text-[12px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    {deletingId === category.id ? t('Deleting...') : t('Delete')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile cards */}
                <div className="space-y-2.5 md:hidden">
                    {categories.data.length === 0 ? (
                        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-[13px] text-zinc-500">
                            {t('No categories yet')}
                        </div>
                    ) : (
                        categories.data.map((category) => (
                            <div
                                key={category.id}
                                className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    {category.image ? (
                                        <img
                                            src={`/storage/${category.image}`}
                                            alt={category.name}
                                            className="h-12 w-12 rounded-lg object-cover ring-1 ring-zinc-200"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[13px] font-semibold text-zinc-900">
                                            {category.name}
                                        </p>
                                        <p className="text-[11px] text-zinc-500">
                                            {category.products_count}{' '}
                                            {category.products_count !== 1 ? t('products') : t('product')}
                                        </p>

                                        <button
                                            type="button"
                                            disabled={togglingId === category.id}
                                            onClick={() => toggleStatus(category)}
                                            className="mt-2 inline-flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <span
                                                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
                                                    category.status ? 'bg-emerald-500' : 'bg-zinc-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition ${
                                                        category.status ? 'translate-x-4' : 'translate-x-1'
                                                    }`}
                                                />
                                            </span>
                                            <span
                                                className={`text-[11px] font-medium ${
                                                    category.status ? 'text-emerald-700' : 'text-zinc-500'
                                                }`}
                                            >
                                                {togglingId === category.id
                                                    ? '...'
                                                    : category.status
                                                      ? t('Active')
                                                      : t('Inactive')}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-3 flex gap-2">
                                    <Link
                                        href={route('admin.categories.edit', category.id)}
                                        className="flex-1 rounded-lg border border-zinc-200 py-2 text-center text-[12px] font-medium text-zinc-700 hover:bg-zinc-50"
                                    >
                                        {t('Edit')}
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setPendingDelete(category)}
                                        disabled={deletingId === category.id}
                                        className="flex-1 rounded-lg border border-red-100 py-2 text-center text-[12px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                                    >
                                        {deletingId === category.id ? t('Deleting...') : t('Delete')}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {categories.links && categories.links.length > 3 && (
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {categories.links.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`min-w-[32px] rounded-md px-2.5 py-1.5 text-[12px] font-medium ${
                                    link.active
                                        ? 'bg-zinc-900 text-white'
                                        : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                                } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Delete modal */}
            {pendingDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl">
                        <h3 className="text-sm font-semibold text-zinc-900">{t('Delete category')}</h3>
                        <p className="mt-2 text-[13px] text-zinc-600">
                            {t('Delete')} “{pendingDelete.name}”? {t('This cannot be undone.')}
                        </p>
                        <div className="mt-5 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setPendingDelete(null)}
                                className="flex-1 rounded-lg border border-zinc-300 py-2 text-[13px] font-medium text-zinc-700 hover:bg-zinc-50"
                            >
                                {t('Cancel')}
                            </button>
                            <button
                                type="button"
                                disabled={deletingId === pendingDelete.id}
                                onClick={confirmDelete}
                                className="flex-1 rounded-lg bg-red-600 py-2 text-[13px] font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {deletingId === pendingDelete.id ? t('Deleting...') : t('Delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}