import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { FormEvent, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface Category {
    id: number;
    name: string;
    slug: string;
    products_count: number;
}

interface PrimaryImage {
    image: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    brand: string | null;
    price: number;
    old_price: number | null;
    availability: string;
    featured: boolean;
    category: { id: number; name: string } | null;
    primary_image: PrimaryImage | null;
}

interface Filters {
    search: string;
    category: string;
    availability: string;
    sort: string;
    per_page: string;
}

interface Props {
    products: {
        data: Product[];
        links: any[];
        meta?: any;
        current_page?: number;
        last_page?: number;
        total?: number;
    };
    categories: Category[];
    filters: Filters;
}

function sanitizeClientSearch(value: string): string {
    return value
        .replace(/[<>']/g, '')
        .replace(/javascript\s*:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .slice(0, 100);
}

export default function Index({ products, categories = [], filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
        }).format(price);

    const applyFilters = (overrides: Partial<Filters> = {}) => {
        const params: Record<string, string> = {
            search: sanitizeClientSearch(overrides.search ?? search),
            category: overrides.category ?? filters.category ?? '',
            availability: overrides.availability ?? filters.availability ?? '',
            sort: overrides.sort ?? filters.sort ?? 'newest',
            per_page: overrides.per_page ?? filters.per_page ?? '20',
        };

        Object.keys(params).forEach((key) => {
            if (!params[key]) delete params[key];
        });

        router.get('/shop', params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        applyFilters({ search: sanitizeClientSearch(search) });
    };

    const clearFilters = () => {
        setSearch('');
        router.get('/shop', {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const hasActiveFilters =
        !!(filters.search || filters.category || filters.availability) ||
        (filters.sort && filters.sort !== 'newest');

    return (
        <PublicLayout>
            <Head title={`${t('Shop')} — Mwandege`} />

            {/* Header strip */}
            <section className="relative overflow-hidden bg-zinc-950 text-white">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-1/2 top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent animate-beam" />
                </div>
                <div className="relative mx-auto max-w-6xl px-4 py-5 sm:py-6">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-400/90">
                        {t('Catalogue')}
                    </p>
                    <h1 className="mt-1 text-lg font-semibold sm:text-xl">{t('Shop products')}</h1>
                    <p className="mt-1 text-[13px] text-zinc-400">
                        {t('Browse, filter, open a product, order via WhatsApp')}
                    </p>
                </div>
            </section>

            <div className="mx-auto max-w-6xl px-3 sm:px-4 py-4 sm:py-5 overflow-x-hidden">
                {/* Search + filters */}
                <div className="mb-4 sm:mb-5 space-y-3 rounded-xl border border-zinc-200 bg-white p-3 sm:p-3.5 shadow-sm">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(sanitizeClientSearch(e.target.value))}
                            placeholder={t('Search products, brand, model...')}
                            maxLength={100}
                            autoComplete="off"
                            className="block w-full min-w-0 rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                        />
                        <button
                            type="submit"
                            className="w-full sm:w-auto shrink-0 rounded-lg bg-zinc-900 px-4 py-2.5 sm:py-2 text-[13px] font-medium text-white hover:bg-zinc-800"
                        >
                            {t('Search')}
                        </button>
                    </form>

                    {/* Filters — grid kwenye mobile ili zifit */}
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                        <select
                            value={filters.category || ''}
                            onChange={(e) => applyFilters({ category: e.target.value })}
                            className="w-full min-w-0 rounded-lg border-zinc-300 text-[12px] focus:border-amber-500 focus:ring-amber-500 sm:w-auto"
                        >
                            <option value="">{t('All categories')}</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.slug}>
                                    {cat.name} ({cat.products_count})
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.sort || 'newest'}
                            onChange={(e) => applyFilters({ sort: e.target.value })}
                            className="w-full min-w-0 rounded-lg border-zinc-300 text-[12px] focus:border-amber-500 focus:ring-amber-500 sm:w-auto"
                        >
                            <option value="newest">{t('Newest')}</option>
                            <option value="price_low">{t('Price: Low to High')}</option>
                            <option value="price_high">{t('Price: High to Low')}</option>
                            <option value="featured">{t('Featured first')}</option>
                        </select>

                        <select
                            value={filters.availability || ''}
                            onChange={(e) => applyFilters({ availability: e.target.value })}
                            className="w-full min-w-0 rounded-lg border-zinc-300 text-[12px] focus:border-amber-500 focus:ring-amber-500 sm:w-auto"
                        >
                            <option value="">{t('Any stock')}</option>
                            <option value="available">{t('In stock only')}</option>
                        </select>

                        <select
                            value={filters.per_page || '20'}
                            onChange={(e) => applyFilters({ per_page: e.target.value })}
                            className="w-full min-w-0 rounded-lg border-zinc-300 text-[12px] focus:border-amber-500 focus:ring-amber-500 sm:w-auto"
                        >
                            {[10, 20, 30, 50, 70, 100].map((n) => (
                                <option key={n} value={String(n)}>
                                    {t('Show')} {n}
                                </option>
                            ))}
                        </select>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="col-span-2 sm:col-span-1 w-full sm:w-auto rounded-lg border border-zinc-200 px-2.5 py-2 text-[12px] font-medium text-zinc-600 hover:bg-zinc-50"
                            >
                                {t('Clear filters')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Results count */}
                <p className="mb-3 text-[12px] text-zinc-500">
                    {products.total ?? products.data.length}{' '}
                    {(products.total ?? products.data.length) !== 1 ? t('products') : t('product')}
                    {filters.search ? ` ${t('for')} “${filters.search}”` : ''}
                </p>

                {/* Product grid */}
                {products.data.length === 0 ? (
                    <div className="rounded-xl border border-zinc-200 bg-white py-12 sm:py-14 text-center px-4">
                        <p className="text-[14px] font-medium text-zinc-900">{t('No products found')}</p>
                        <p className="mt-1 text-[12px] text-zinc-500">{t('Try another search or filter')}</p>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-3 text-[13px] font-medium text-amber-600 hover:text-amber-700"
                            >
                                {t('Clear filters')}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2 sm:gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {products.data.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className="group min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-amber-300 hover:shadow"
                            >
                                <div className="aspect-square overflow-hidden bg-zinc-50">
                                    {product.primary_image ? (
                                        <img
                                            src={`/storage/${product.primary_image.image}`}
                                            alt={product.name}
                                            className="h-full w-full object-contain p-1.5 transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-zinc-300">
                                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 sm:p-2.5">
                                    <p className="truncate text-[10px] text-zinc-400">
                                        {product.brand || product.category?.name || 'Mwandege'}
                                    </p>
                                    <p className="line-clamp-2 text-[11px] sm:text-[12px] font-medium text-zinc-900 group-hover:text-amber-700">
                                        {product.name}
                                    </p>
                                    <div className="mt-1 flex flex-wrap items-baseline gap-1">
                                        <span className="text-[12px] sm:text-[13px] font-semibold text-zinc-900">
                                            {formatPrice(product.price)}
                                        </span>
                                        {product.old_price && (
                                            <span className="text-[10px] text-zinc-400 line-through">
                                                {formatPrice(product.old_price)}
                                            </span>
                                        )}
                                    </div>
                                    {product.availability === 'out_of_stock' && (
                                        <span className="mt-1 inline-block text-[10px] font-medium text-red-600">
                                            {t('Out of stock')}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {products.links && products.links.length > 3 && (
                    <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-1.5">
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
                                preserveScroll
                            />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes beam {
                    0% { transform: translateX(-30%) skewX(12deg); opacity: 0; }
                    15% { opacity: 1; }
                    85% { opacity: 1; }
                    100% { transform: translateX(230%) skewX(12deg); opacity: 0; }
                }
                .animate-beam { animation: beam 2.8s ease-in-out infinite; }
            `}</style>
        </PublicLayout>
    );
}