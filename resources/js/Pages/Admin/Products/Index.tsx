import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from '@/hooks/useTranslation';

interface Category {
    id: number;
    name: string;
}

interface PrimaryImage {
    id: number;
    image: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    brand: string | null;
    price: number;
    old_price: number | null;
    availability: 'available' | 'out_of_stock';
    status: 'draft' | 'published' | 'archived';
    featured: boolean;
    views_count: number;
    images_count: number;
    category: Category | null;
    primary_image: PrimaryImage | null;
    created_at: string;
}

interface Props {
    products: {
        data: Product[];
        links: any[];
        meta: any;
    };
}

export default function Index({ products }: Props) {
    const { t } = useTranslation();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
        }).format(price);

    const isLive = (status: string) => status === 'published';

    const toggleStatus = (product: Product) => {
        setTogglingId(product.id);
        router.patch(route('admin.products.toggle-status', product.id), {}, {
            preserveScroll: true,
            onFinish: () => setTogglingId(null),
        });
    };

    const confirmDelete = () => {
        if (!pendingDelete) return;
        setDeletingId(pendingDelete.id);
        router.delete(route('admin.products.destroy', pendingDelete.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeletingId(null);
                setPendingDelete(null);
            },
        });
    };

    const statusLabel = (status: string) => {
        if (status === 'published') return t('Published');
        if (status === 'archived') return t('Archived');
        return t('Draft');
    };

    return (
        <AdminLayout>
            <Head title={t('Products')} />

            <div className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-zinc-900">{t('Products')}</h1>
                        <p className="text-[12px] text-zinc-500">
                            {t('Manage catalogue · publish or unpublish without opening edit')}
                        </p>
                    </div>
                    <Link
                        href={route('admin.products.create')}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-zinc-800"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {t('Add Product')}
                    </Link>
                </div>

                {/* Desktop */}
                <div className="hidden overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm lg:block">
                    <table className="min-w-full divide-y divide-zinc-100">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                                    {t('Product')}
                                </th>
                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                                    {t('Category')}
                                </th>
                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                                    {t('Price')}
                                </th>
                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                                    {t('Visibility')}
                                </th>
                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                                    {t('Stock')}
                                </th>
                                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                                    {t('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {products.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-14 text-center text-[13px] text-zinc-500">
                                        {t('No products yet')}
                                    </td>
                                </tr>
                            ) : (
                                products.data.map((product) => (
                                    <tr key={product.id} className="hover:bg-zinc-50/80">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {product.primary_image ? (
                                                    <img
                                                        src={`/storage/${product.primary_image.image}`}
                                                        alt={product.name}
                                                        className="h-11 w-11 rounded-lg object-cover ring-1 ring-zinc-200"
                                                    />
                                                ) : (
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400">
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="truncate text-[13px] font-medium text-zinc-900">
                                                            {product.name}
                                                        </span>
                                                        {product.featured && (
                                                            <span className="rounded bg-amber-50 px-1 py-0.5 text-[9px] font-medium text-amber-700">
                                                                {t('FEATURED')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-zinc-400">
                                                        {product.brand || t('No brand')} · {product.images_count} {t('img')}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-[12px] text-zinc-600">
                                            {product.category?.name || '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-[13px] font-medium text-zinc-900">
                                                {formatPrice(product.price)}
                                            </p>
                                            {product.old_price && (
                                                <p className="text-[11px] text-zinc-400 line-through">
                                                    {formatPrice(product.old_price)}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                disabled={togglingId === product.id}
                                                onClick={() => toggleStatus(product)}
                                                className="inline-flex items-center gap-2 disabled:opacity-50"
                                                title={
                                                    isLive(product.status)
                                                        ? t('Click to unpublish (remove from storefront)')
                                                        : t('Click to publish (show on storefront)')
                                                }
                                            >
                                                <span
                                                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
                                                        isLive(product.status) ? 'bg-emerald-500' : 'bg-zinc-300'
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition ${
                                                            isLive(product.status) ? 'translate-x-4' : 'translate-x-1'
                                                        }`}
                                                    />
                                                </span>
                                                <span
                                                    className={`text-[11px] font-medium ${
                                                        isLive(product.status) ? 'text-emerald-700' : 'text-zinc-500'
                                                    }`}
                                                >
                                                    {togglingId === product.id ? '...' : statusLabel(product.status)}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                                    product.availability === 'available'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-red-50 text-red-700'
                                                }`}
                                            >
                                                {product.availability === 'available' ? t('In Stock') : t('Out')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={route('admin.products.edit', product.id)}
                                                    className="rounded-md px-2.5 py-1 text-[12px] font-medium text-zinc-600 hover:bg-zinc-100"
                                                >
                                                    {t('Edit')}
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => setPendingDelete(product)}
                                                    disabled={deletingId === product.id}
                                                    className="rounded-md px-2.5 py-1 text-[12px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    {deletingId === product.id ? '...' : t('Delete')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile */}
                <div className="space-y-2.5 lg:hidden">
                    {products.data.length === 0 ? (
                        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-[13px] text-zinc-500">
                            {t('No products yet')}
                        </div>
                    ) : (
                        products.data.map((product) => (
                            <div
                                key={product.id}
                                className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm"
                            >
                                <div className="flex gap-3">
                                    {product.primary_image ? (
                                        <img
                                            src={`/storage/${product.primary_image.image}`}
                                            alt={product.name}
                                            className="h-16 w-16 rounded-lg object-cover ring-1 ring-zinc-200"
                                        />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400">
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="line-clamp-2 text-[13px] font-semibold text-zinc-900">
                                            {product.name}
                                        </p>
                                        <p className="text-[11px] text-zinc-500">
                                            {product.category?.name || t('No category')}
                                        </p>
                                        <p className="mt-1 text-[13px] font-medium text-zinc-900">
                                            {formatPrice(product.price)}
                                        </p>

                                        <button
                                            type="button"
                                            disabled={togglingId === product.id}
                                            onClick={() => toggleStatus(product)}
                                            className="mt-2 inline-flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <span
                                                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
                                                    isLive(product.status) ? 'bg-emerald-500' : 'bg-zinc-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition ${
                                                        isLive(product.status) ? 'translate-x-4' : 'translate-x-1'
                                                    }`}
                                                />
                                            </span>
                                            <span
                                                className={`text-[11px] font-medium ${
                                                    isLive(product.status) ? 'text-emerald-700' : 'text-zinc-500'
                                                }`}
                                            >
                                                {togglingId === product.id ? '...' : statusLabel(product.status)}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <Link
                                        href={route('admin.products.edit', product.id)}
                                        className="flex-1 rounded-lg border border-zinc-200 py-2 text-center text-[12px] font-medium text-zinc-700 hover:bg-zinc-50"
                                    >
                                        {t('Edit')}
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setPendingDelete(product)}
                                        disabled={deletingId === product.id}
                                        className="flex-1 rounded-lg border border-red-100 py-2 text-center text-[12px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                                    >
                                        {deletingId === product.id ? '...' : t('Delete')}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {products.links && products.links.length > 3 && (
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {products.links.map((link: any, index: number) => (
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

            {pendingDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl">
                        <h3 className="text-sm font-semibold text-zinc-900">{t('Delete product')}</h3>
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