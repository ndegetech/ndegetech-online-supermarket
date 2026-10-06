import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useTranslation } from '@/hooks/useTranslation';

interface ProductImage {
    image: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    brand: string | null;
    price: number;
    old_price: number | null;
    primary_image: ProductImage | null;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    featuredProducts: Product[];
    categories: Category[];
    whatsappNumber?: string;
}

export default function Home({ featuredProducts = [], categories = [] }: Props) {
    const { t } = useTranslation();

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
        }).format(price);

    const loopProducts =
        featuredProducts.length > 0
            ? [...featuredProducts, ...featuredProducts, ...featuredProducts]
            : [];

    return (
        <PublicLayout>
            <Head title="Mwandege — Premium Electronics & Home" />

            {/* Hero */}
            <section className="relative overflow-hidden bg-zinc-950 text-white">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-1/2 top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent animate-beam" />
                </div>
                <div className="relative mx-auto max-w-6xl px-4 py-9 sm:py-12">
                    <div className="max-w-md">
                        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-amber-400/90">
                            {t('NdegeTech Online SuperMarket')}
                        </p>
                        <h1 className="mt-2 text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
                            {t('Carefully selected')}
                            <br />
                            <span className="text-amber-400">{t('electronics & home essentials')}</span>
                        </h1>
                        <p className="mt-2.5 text-[13px] leading-relaxed text-zinc-400">
                            {t('Quality products. Browse, choose, order via WhatsApp.')}
                        </p>
                        <div className="mt-5">
                            <Link
                                href="/shop"
                                className="inline-flex items-center rounded-lg bg-amber-500 px-4 py-2 text-[13px] font-medium text-zinc-950 transition hover:bg-amber-400"
                            >
                                {t('Browse products')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured marquee — hover zoom */}
            {featuredProducts.length > 0 && (
                <section className="overflow-hidden border-b border-zinc-100 bg-white py-4">
                    <div className="mx-auto mb-2.5 flex max-w-6xl items-center justify-between px-4">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                            {t('Featured products')}
                        </p>
                        <Link
                            href="/shop"
                            className="text-[12px] font-medium text-amber-600 hover:text-amber-700"
                        >
                            {t('View all →')}
                        </Link>
                    </div>
                    <div className="relative w-full overflow-hidden">
                        <div className="flex w-max gap-3 animate-marquee hover:[animation-play-state:paused]">
                            {loopProducts.map((product, i) => (
                                <Link
                                    key={`${product.id}-${i}`}
                                    href={`/products/${product.slug}`}
                                    className="group w-32 shrink-0 sm:w-36"
                                >
                                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50">
                                        {product.primary_image ? (
                                            <img
                                                src={`/storage/${product.primary_image.image}`}
                                                alt={product.name}
                                                className="h-full w-full object-contain p-1 transition-transform duration-500 ease-out group-hover:scale-125"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-zinc-300">
                                                <svg
                                                    className="h-7 w-7"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-1.5 px-0.5">
                                        <p className="truncate text-[10px] text-zinc-400">
                                            {product.brand || 'Mwandege'}
                                        </p>
                                        <p className="line-clamp-1 text-[12px] font-medium text-zinc-900 group-hover:text-amber-700">
                                            {product.name}
                                        </p>
                                        <p className="mt-0.5 text-[12px] font-semibold text-zinc-800">
                                            {formatPrice(product.price)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ALL categories */}
            <section className="bg-zinc-50/70 py-6 sm:py-7">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mb-3.5 flex items-end justify-between">
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                                {t('Categories')}
                            </p>
                            <h2 className="text-[15px] font-semibold text-zinc-900">
                                {t('Shop by category')}
                            </h2>
                        </div>
                        <Link
                            href="/shop"
                            className="text-[12px] font-medium text-amber-600 hover:text-amber-700"
                        >
                            {t('All products →')}
                        </Link>
                    </div>

                    {categories.length === 0 ? (
                        <p className="text-[13px] text-zinc-500">{t('No categories yet.')}</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                                    className="group flex flex-col items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-white p-3 text-center shadow-sm transition hover:border-amber-300 hover:shadow"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition group-hover:bg-amber-50 group-hover:text-amber-700">
                                        <svg
                                            className="h-3.5 w-3.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                            />
                                        </svg>
                                    </div>
                                    <span className="line-clamp-2 text-[11px] font-medium text-zinc-700">
                                        {cat.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Trust */}
            <section className="border-y border-zinc-100 py-5">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            { title: t('Curated selection'), desc: t('Only useful, quality items') },
                            { title: t('Clear pricing'), desc: t('No hidden costs') },
                            { title: t('Direct order'), desc: t('WhatsApp on product page') },
                            { title: t('Fast response'), desc: t('We reply quickly') },
                        ].map((item) => (
                            <div key={item.title} className="text-center sm:text-left">
                                <p className="text-[12px] font-semibold text-zinc-900">{item.title}</p>
                                <p className="mt-0.5 text-[11px] text-zinc-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-7">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="rounded-2xl bg-zinc-950 px-5 py-6 text-center">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-amber-400/90">
                            {t('Discover more')}
                        </p>
                        <h2 className="mt-1 text-[15px] font-semibold text-white">
                            {t('Explore the full catalogue')}
                        </h2>
                        <p className="mx-auto mt-1.5 max-w-sm text-[13px] text-zinc-400">
                            {t('Find what you need, open the product, and order via WhatsApp.')}
                        </p>
                        <div className="mt-4">
                            <Link
                                href="/shop"
                                className="inline-flex rounded-lg bg-amber-500 px-4 py-2 text-[13px] font-medium text-zinc-950 transition hover:bg-amber-400"
                            >
                                {t('Explore products')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes beam {
                    0% { transform: translateX(-30%) skewX(12deg); opacity: 0; }
                    15% { opacity: 1; }
                    85% { opacity: 1; }
                    100% { transform: translateX(230%) skewX(12deg); opacity: 0; }
                }
                .animate-beam { animation: beam 2.8s ease-in-out infinite; }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                .animate-marquee { animation: marquee 32s linear infinite; }
            `}</style>
        </PublicLayout>
    );
}