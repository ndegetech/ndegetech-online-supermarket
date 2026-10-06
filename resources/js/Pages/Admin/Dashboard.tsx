import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface Stats {
    total_products: number;
    published_products: number;
    out_of_stock: number;
    categories: number;
    featured: number;
    drafts: number;
    product_views: number;
    visits_today: number;
    visits_week: number;
    visits_month: number;
    visits_total: number;
    whatsapp_clicks: number;
}

interface VisitPoint {
    date: string;
    count: number;
}

interface TopProduct {
    id: number;
    name: string;
    slug: string;
    views_count: number;
    price: number;
    status: string;
}

interface Props {
    stats: Stats;
    visitsChart: VisitPoint[];
    topProducts: TopProduct[];
}

type ConfirmAction =
    | { type: 'visits'; scope: 'all' | 'today' | 'week' | 'month' }
    | { type: 'product_views_all' }
    | { type: 'product_views_one'; productId: number; name: string };

export default function Dashboard({ stats, visitsChart = [], topProducts = [] }: Props) {
    const { t } = useTranslation();
    const [busy, setBusy] = useState(false);
    const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
        }).format(price);

    const maxVisit = Math.max(...visitsChart.map((v) => v.count), 1);

    const getConfirmMessage = () => {
        if (!confirmAction) return '';
        if (confirmAction.type === 'visits') {
            if (confirmAction.scope === 'all') return t('Clear ALL website visit history? This cannot be undone.');
            if (confirmAction.scope === 'today') return t("Clear today's visits?");
            if (confirmAction.scope === 'week') return t('Clear last 7 days visits?');
            if (confirmAction.scope === 'month') return t('Clear last 30 days visits?');
        }
        if (confirmAction.type === 'product_views_all') {
            return t('Reset views for ALL products to 0? This cannot be undone.');
        }
        if (confirmAction.type === 'product_views_one') {
            return `${t('Clear views for')} “${confirmAction.name}”?`;
        }
        return '';
    };

    const runConfirmed = () => {
        if (!confirmAction) return;
        setBusy(true);

        if (confirmAction.type === 'visits') {
            router.delete(route('admin.visits.clear'), {
                data: { scope: confirmAction.scope },
                preserveScroll: true,
                onFinish: () => {
                    setBusy(false);
                    setConfirmAction(null);
                },
            });
            return;
        }

        if (confirmAction.type === 'product_views_all') {
            router.delete(route('admin.product-views.clear'), {
                data: { scope: 'all' },
                preserveScroll: true,
                onFinish: () => {
                    setBusy(false);
                    setConfirmAction(null);
                },
            });
            return;
        }

        if (confirmAction.type === 'product_views_one') {
            router.delete(route('admin.product-views.clear'), {
                data: { scope: 'product', product_id: confirmAction.productId },
                preserveScroll: true,
                onFinish: () => {
                    setBusy(false);
                    setConfirmAction(null);
                },
            });
        }
    };

    const primaryCards = [
        { label: t('Visits today'), value: stats.visits_today, hint: t('Website hits') },
        { label: t('Visits (7 days)'), value: stats.visits_week, hint: t('Last week') },
        { label: t('Visits (30 days)'), value: stats.visits_month, hint: t('Last month') },
        { label: t('Total visits'), value: stats.visits_total, hint: t('All time') },
    ];

    const storeCards = [
        { label: t('Total products'), value: stats.total_products },
        { label: t('Published'), value: stats.published_products },
        { label: t('Out of stock'), value: stats.out_of_stock },
        { label: t('Categories'), value: stats.categories },
        { label: t('Featured'), value: stats.featured },
        { label: t('Drafts'), value: stats.drafts },
        { label: t('Product views'), value: stats.product_views },
        { label: t('WhatsApp clicks'), value: stats.whatsapp_clicks },
    ];

    return (
        <AdminLayout>
            <Head title={t('Dashboard')} />

            <div className="space-y-5">
                <section className="relative overflow-hidden rounded-xl bg-zinc-950 text-white">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -left-1/2 top-0 h-full w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent animate-beam-1" />
                        <div className="absolute -left-1/2 top-0 h-full w-1/4 skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-beam-2" />
                        <div className="absolute -left-1/2 top-0 h-full w-1/5 skew-x-12 bg-gradient-to-r from-transparent via-amber-300/10 to-transparent animate-beam-3" />
                    </div>
                    <div className="relative px-5 py-6 sm:px-6">
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-400/90">
                            {t('Business pulse')}
                        </p>
                        <h1 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">{t('Dashboard')}</h1>
                        <p className="mt-1 text-[12px] text-zinc-400">
                            {t('Traffic, catalogue health and product interest')}
                        </p>
                    </div>
                </section>

                {/* Traffic */}
                <div>
                    <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-[12px] font-semibold uppercase tracking-wider text-zinc-400">
                            {t('Website traffic')}
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                            <button
                                type="button"
                                disabled={busy || stats.visits_today === 0}
                                onClick={() => setConfirmAction({ type: 'visits', scope: 'today' })}
                                className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
                            >
                                {t('Clear today')}
                            </button>
                            <button
                                type="button"
                                disabled={busy || stats.visits_week === 0}
                                onClick={() => setConfirmAction({ type: 'visits', scope: 'week' })}
                                className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
                            >
                                {t('Clear 7 days')}
                            </button>
                            <button
                                type="button"
                                disabled={busy || stats.visits_month === 0}
                                onClick={() => setConfirmAction({ type: 'visits', scope: 'month' })}
                                className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
                            >
                                {t('Clear 30 days')}
                            </button>
                            <button
                                type="button"
                                disabled={busy || stats.visits_total === 0}
                                onClick={() => setConfirmAction({ type: 'visits', scope: 'all' })}
                                className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-100 disabled:opacity-40"
                            >
                                {t('Clear all visits')}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                        {primaryCards.map((card) => (
                            <div key={card.label} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                                <p className="text-[11px] font-medium text-zinc-500">{card.label}</p>
                                <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">
                                    {card.value.toLocaleString()}
                                </p>
                                <p className="mt-0.5 text-[10px] text-zinc-400">{card.hint}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {visitsChart.length > 0 && (
                    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-[13px] font-semibold text-zinc-900">{t('Visits — last 14 days')}</h2>
                            <span className="text-[11px] text-zinc-400">{t('Daily hits')}</span>
                        </div>
                        <div className="flex h-28 items-end gap-1">
                            {visitsChart.map((point) => (
                                <div
                                    key={point.date}
                                    className="flex min-w-0 flex-1 flex-col items-center gap-1"
                                    title={`${point.date}: ${point.count}`}
                                >
                                    <div
                                        className="mx-auto w-full max-w-[28px] rounded-t bg-amber-500/90"
                                        style={{ height: `${Math.max(4, (point.count / maxVisit) * 100)}%` }}
                                    />
                                    <span className="w-full truncate text-center text-[9px] text-zinc-400">
                                        {String(point.date).slice(5)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Catalogue */}
                <div>
                    <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-[12px] font-semibold uppercase tracking-wider text-zinc-400">
                            {t('Catalogue')}
                        </h2>
                        <button
                            type="button"
                            disabled={busy || stats.product_views === 0}
                            onClick={() => setConfirmAction({ type: 'product_views_all' })}
                            className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-100 disabled:opacity-40"
                        >
                            {t('Clear all product views')}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                        {storeCards.map((card) => (
                            <div key={card.label} className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm">
                                <p className="text-[11px] font-medium text-zinc-500">{card.label}</p>
                                <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-900">
                                    {card.value.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top products */}
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
                        <h2 className="text-[13px] font-semibold text-zinc-900">{t('Top products by views')}</h2>
                        <Link
                            href={route('admin.products.index')}
                            className="text-[12px] font-medium text-amber-600 hover:text-amber-700"
                        >
                            {t('Manage products')} →
                        </Link>
                    </div>
                    {topProducts.length === 0 ? (
                        <p className="px-4 py-8 text-center text-[12px] text-zinc-500">{t('No products yet')}</p>
                    ) : (
                        <ul className="divide-y divide-zinc-100">
                            {topProducts.map((p, i) => (
                                <li key={p.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50/80">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-[11px] font-semibold text-zinc-600">
                                        {i + 1}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[13px] font-medium text-zinc-900">{p.name}</p>
                                        <p className="text-[11px] text-zinc-400">
                                            {formatPrice(Number(p.price))} · {p.status}
                                        </p>
                                    </div>
                                    <span className="text-[12px] font-semibold tabular-nums text-zinc-700">
                                        {p.views_count.toLocaleString()} {t('views')}
                                    </span>
                                    {p.views_count > 0 && (
                                        <button
                                            type="button"
                                            disabled={busy}
                                            onClick={() =>
                                                setConfirmAction({
                                                    type: 'product_views_one',
                                                    productId: p.id,
                                                    name: p.name,
                                                })
                                            }
                                            className="rounded-md border border-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                                        >
                                            {t('Clear')}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    <Link
                        href={route('admin.products.create')}
                        className="inline-flex rounded-lg bg-zinc-900 px-3.5 py-2 text-[12px] font-medium text-white hover:bg-zinc-800"
                    >
                        {t('Add product')}
                    </Link>
                    <Link
                        href={route('admin.categories.index')}
                        className="inline-flex rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                        {t('Categories')}
                    </Link>
                    <Link
                        href={route('admin.settings.index')}
                        className="inline-flex rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                        {t('Settings')}
                    </Link>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                        {t('View website')} →
                    </a>
                </div>
            </div>

            {/* Confirm modal */}
            {confirmAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl">
                        <h3 className="text-sm font-semibold text-zinc-900">{t('Confirm action')}</h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">{getConfirmMessage()}</p>
                        <div className="mt-5 flex gap-2">
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => setConfirmAction(null)}
                                className="flex-1 rounded-lg border border-zinc-300 py-2 text-[13px] font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                            >
                                {t('Cancel')}
                            </button>
                            <button
                                type="button"
                                disabled={busy}
                                onClick={runConfirmed}
                                className="flex-1 rounded-lg bg-red-600 py-2 text-[13px] font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {busy ? t('Working...') : t('Yes, continue')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes beam-1 {
                    0% { transform: translateX(-40%) skewX(12deg); opacity: 0; }
                    12% { opacity: 1; }
                    88% { opacity: 1; }
                    100% { transform: translateX(240%) skewX(12deg); opacity: 0; }
                }
                @keyframes beam-2 {
                    0% { transform: translateX(-60%) skewX(12deg); opacity: 0; }
                    20% { opacity: 0.8; }
                    80% { opacity: 0.8; }
                    100% { transform: translateX(260%) skewX(12deg); opacity: 0; }
                }
                @keyframes beam-3 {
                    0% { transform: translateX(-20%) skewX(12deg); opacity: 0; }
                    25% { opacity: 0.6; }
                    75% { opacity: 0.6; }
                    100% { transform: translateX(220%) skewX(12deg); opacity: 0; }
                }
                .animate-beam-1 { animation: beam-1 2.6s ease-in-out infinite; }
                .animate-beam-2 { animation: beam-2 3.4s ease-in-out infinite 0.6s; }
                .animate-beam-3 { animation: beam-3 4s ease-in-out infinite 1.2s; }
            `}</style>
        </AdminLayout>
    );
}