import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { usePage } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ProductImage {
    id: number;
    image: string;
    is_primary: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    brand: string | null;
    model: string | null;
    description: string | null;
    specifications: string | null;
    price: number;
    old_price: number | null;
    availability: string;
    featured: boolean;
    category: Category | null;
    images: ProductImage[];
}

interface RelatedProduct {
    id: number;
    name: string;
    slug: string;
    price: number;
    old_price: number | null;
    primary_image: { image: string } | null;
}

interface Props {
    product: Product;
    related: RelatedProduct[];
}

export default function Show({ product, related = [] }: Props) {
    const { t } = useTranslation();
    const page = usePage();
    const settings = (page.props as any).settings || {};

    const whatsappNumber = (settings.whatsapp_number || '255678861389').replace(/\D/g, '');
    const callNumber = (settings.contact_phone || settings.whatsapp_number || '255678861389').replace(/\D/g, '');

    const images =
        product.images?.length > 0
            ? product.images
            : product.images || [];

    const primaryIndex = Math.max(
        0,
        images.findIndex((img) => img.is_primary)
    );
    const [activeIndex, setActiveIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0,
        }).format(price);

    const productUrl =
        typeof window !== 'undefined'
            ? window.location.href
            : `/shop/${product.slug}`;

    const orderMessage = `Habari, naomba kuagiza:\n\n*${product.name}*\nBei: ${formatPrice(Number(product.price))}\nLink: ${productUrl}`;

    const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;
    const callHref = `tel:+${callNumber}`;
    const smsHref = `sms:+${callNumber}?body=${encodeURIComponent(
        `Habari, naomba kuagiza: ${product.name} - Bei: ${formatPrice(Number(product.price))} - ${productUrl}`
    )}`;

    const mainImage = images[activeIndex]?.image;

    return (
        <PublicLayout>
            <Head title={product.name} />

            <div className="mx-auto max-w-6xl px-4 py-5 sm:py-8 overflow-x-hidden">
                {/* Breadcrumb */}
                <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-[12px] text-zinc-500">
                    <Link href="/" className="hover:text-amber-600 transition">
                        {t('Home')}
                    </Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-amber-600 transition">
                        {t('Shop')}
                    </Link>
                    {product.category && (
                        <>
                            <span>/</span>
                            <Link
                                href={`/shop?category=${product.category.slug || product.category.id}`}
                                className="hover:text-amber-600 transition"
                            >
                                {product.category.name}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="truncate text-zinc-800 max-w-[140px] sm:max-w-none">
                        {product.name}
                    </span>
                </nav>

                <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
                    {/* Gallery */}
                    <div className="min-w-0">
                        <div className="aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                            {mainImage ? (
                                <img
                                    src={`/storage/${mainImage}`}
                                    alt={product.name}
                                    className="h-full w-full object-contain p-3"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-zinc-300 text-sm">
                                    —
                                </div>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                                {images.map((img, index) => (
                                    <button
                                        key={img.id || index}
                                        type="button"
                                        onClick={() => setActiveIndex(index)}
                                        className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-zinc-50 transition ${
                                            activeIndex === index
                                                ? 'border-amber-500'
                                                : 'border-zinc-200 hover:border-zinc-300'
                                        }`}
                                    >
                                        <img
                                            src={`/storage/${img.image}`}
                                            alt=""
                                            className="h-full w-full object-contain p-0.5"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 space-y-4">
                        <div>
                            {product.featured && (
                                <span className="mb-2 inline-block rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                                    {t('Featured')}
                                </span>
                            )}
                            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
                                {product.name}
                            </h1>
                            {(product.brand || product.model) && (
                                <p className="mt-1 text-[13px] text-zinc-500">
                                    {[product.brand, product.model].filter(Boolean).join(' · ')}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap items-baseline gap-2">
                            <p className="text-2xl font-semibold tabular-nums text-zinc-900">
                                {formatPrice(Number(product.price))}
                            </p>
                            {product.old_price && (
                                <p className="text-[14px] text-zinc-400 line-through tabular-nums">
                                    {formatPrice(Number(product.old_price))}
                                </p>
                            )}
                        </div>

                        <div>
                            <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                                    product.availability === 'available'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-red-50 text-red-700'
                                }`}
                            >
                                {product.availability === 'available'
                                    ? t('In stock')
                                    : t('Out of stock')}
                            </span>
                        </div>

                        {/* Order buttons */}
                        <div className="space-y-2.5 pt-1">
                            <p className="text-[12px] font-medium text-zinc-500">
                                {t('Order this product')}
                            </p>

                            {/* WhatsApp — primary */}
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#1ebe57]"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                {t('Order via WhatsApp')}
                            </a>

                            <div className="grid grid-cols-2 gap-2">
                                {/* Call */}
                                <a
                                    href={callHref}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-[13px] font-semibold text-zinc-800 shadow-sm transition hover:border-amber-300 hover:bg-amber-50/50"
                                >
                                    <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {t('Call to order')}
                                </a>

                                {/* SMS */}
                                <a
                                    href={smsHref}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-[13px] font-semibold text-zinc-800 shadow-sm transition hover:border-amber-300 hover:bg-amber-50/50"
                                >
                                    <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    {t('Order via SMS')}
                                </a>
                            </div>

                            <p className="text-[11px] text-zinc-400">
                                {t('Opens WhatsApp, phone dialer or SMS with product details ready.')}
                            </p>
                        </div>

                        {product.description && (
                            <div className="border-t border-zinc-100 pt-4">
                                <h2 className="text-[13px] font-semibold text-zinc-900">
                                    {t('Description')}
                                </h2>
                                <p className="mt-1.5 whitespace-pre-line text-[13px] leading-relaxed text-zinc-600">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {product.specifications && (
                            <div className="border-t border-zinc-100 pt-4">
                                <h2 className="text-[13px] font-semibold text-zinc-900">
                                    {t('Specifications')}
                                </h2>
                                <p className="mt-1.5 whitespace-pre-line text-[13px] leading-relaxed text-zinc-600">
                                    {product.specifications}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related */}
                {related.length > 0 && (
                    <section className="mt-10 border-t border-zinc-100 pt-8">
                        <h2 className="mb-4 text-[15px] font-semibold text-zinc-900">
                            {t('Related products')}
                        </h2>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {related.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/shop/${item.slug}`}
                                    className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:border-amber-200 hover:shadow-sm"
                                >
                                    <div className="aspect-square bg-zinc-50">
                                        {item.primary_image ? (
                                            <img
                                                src={`/storage/${item.primary_image.image}`}
                                                alt={item.name}
                                                className="h-full w-full object-contain p-2 transition group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-zinc-300">
                                                —
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2.5">
                                        <p className="line-clamp-2 text-[12px] font-medium text-zinc-900">
                                            {item.name}
                                        </p>
                                        <p className="mt-0.5 text-[12px] font-semibold text-zinc-800">
                                            {formatPrice(Number(item.price))}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </PublicLayout>
    );
}