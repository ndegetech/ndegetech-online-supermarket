import { Link, usePage, router } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
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

export default function PublicLayout({ children }: PropsWithChildren) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const page = usePage();
    const { url } = page;
    const settings = (page.props as any).settings as Settings;
    const { t, locale } = useTranslation();

    const businessName = settings?.business_name || 'NDEGETECH';
    const whatsappNumber = (settings?.whatsapp_number || '255678861389').replace(/\D/g, '');

    const hasSocial =
        !!(settings?.facebook_url || settings?.instagram_url || settings?.tiktok_url);

    const navigation = [
        {
            name: t('Home'),
            href: '/',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            name: t('Shop'),
            href: '/shop',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
        },
    ];

    const isActive = (href: string) => {
        if (href === '/') return url === '/';
        return url.startsWith(href);
    };

    const switchLocale = (lang: string) => {
        router.post('/locale', { locale: lang }, { preserveScroll: true });
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col text-zinc-900">
            <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="relative flex items-center justify-between" style={{ height: '56px' }}>
                        
                        {/* Logo */}
                        <Link
                            href="/"
                            className="relative z-10 flex shrink-0 items-center"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <div className="overflow-hidden rounded-xl bg-zinc-950 p-1 shadow-sm ring-1 ring-zinc-200/80">
                                <img
                                    src="/images/logo.png"
                                    alt={businessName}
                                    className="h-8 w-auto max-w-[100px] object-contain sm:h-9 sm:max-w-[120px]"
                                />
                            </div>
                        </Link>

                        {/* Bango la animation — design ya kweli (charcoal + gold) */}
                        <div className="pointer-events-none absolute inset-x-0 flex justify-center px-14 sm:px-28 md:px-44">
                            <div className="banner-sign relative overflow-hidden max-w-[175px] sm:max-w-[220px] md:max-w-[260px]">
                                {/* outer frame */}
                                <div className="rounded-lg bg-gradient-to-b from-zinc-700 via-zinc-900 to-zinc-950 p-[1.5px] shadow-[0_2px_8px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]">
                                    <div className="relative overflow-hidden rounded-[6px] bg-zinc-950 px-3.5 py-1.5 sm:px-4 sm:py-2">
                                        {/* subtle gold top edge highlight */}
                                        <div className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                                        {/* soft inner glow */}
                                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.06)_0%,transparent_70%)]" />
                                        {/* edge fades */}
                                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-gradient-to-r from-zinc-950 to-transparent sm:w-6" />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-5 bg-gradient-to-l from-zinc-950 to-transparent sm:w-6" />

                                        <div className="animate-name-marquee relative whitespace-nowrap">
                                            <span className="text-[11px] sm:text-[12px] font-semibold tracking-[0.18em] text-amber-400 uppercase drop-shadow-[0_0_6px_rgba(251,191,36,0.25)]">
                                                {businessName}
                                            </span>
                                            <span className="mx-2.5 text-[10px] text-amber-500/50">◆</span>
                                            <span className="text-[11px] sm:text-[12px] font-semibold tracking-[0.18em] text-amber-400 uppercase drop-shadow-[0_0_6px_rgba(251,191,36,0.25)]">
                                                {businessName}
                                            </span>
                                            <span className="mx-2.5 text-[10px] text-amber-500/50">◆</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 flex items-center gap-2 shrink-0">
                            <nav className="hidden md:flex items-center gap-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${
                                            isActive(item.href)
                                                ? 'bg-zinc-100 text-zinc-900'
                                                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                                        }`}
                                    >
                                        <span className={isActive(item.href) ? 'text-amber-500' : 'text-zinc-400'}>
                                            {item.icon}
                                        </span>
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>

                            <div className="hidden md:flex items-center rounded-md border border-zinc-200 text-[11px] font-medium overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => switchLocale('en')}
                                    className={`px-2.5 py-1 transition ${
                                        locale === 'en'
                                            ? 'bg-zinc-900 text-amber-400'
                                            : 'text-zinc-600 hover:bg-zinc-50'
                                    }`}
                                >
                                    EN
                                </button>
                                <button
                                    type="button"
                                    onClick={() => switchLocale('sw')}
                                    className={`px-2.5 py-1 transition ${
                                        locale === 'sw'
                                            ? 'bg-zinc-900 text-amber-400'
                                            : 'text-zinc-600 hover:bg-zinc-50'
                                    }`}
                                >
                                    SW
                                </button>
                            </div>

                            <button
                                type="button"
                                className="md:hidden flex h-8 w-8 items-center justify-center rounded-md text-zinc-700 hover:bg-zinc-100 transition"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                            >
                                {mobileMenuOpen ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        mobileMenuOpen ? 'max-h-80 border-t border-zinc-100' : 'max-h-0'
                    }`}
                >
                    <div className="space-y-0.5 bg-white px-4 py-3">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                                    isActive(item.href)
                                        ? 'bg-zinc-100 text-zinc-900'
                                        : 'text-zinc-600 hover:bg-zinc-50'
                                }`}
                            >
                                <span className={isActive(item.href) ? 'text-amber-500' : 'text-zinc-400'}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        ))}

                        <div className="mt-1 border-t border-zinc-100 pt-2">
                            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                                Language / Lugha
                            </p>
                            <div className="flex gap-2 px-3">
                                <button
                                    type="button"
                                    onClick={() => switchLocale('en')}
                                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                                        locale === 'en'
                                            ? 'bg-zinc-900 text-amber-400'
                                            : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                                    }`}
                                >
                                    English
                                </button>
                                <button
                                    type="button"
                                    onClick={() => switchLocale('sw')}
                                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                                        locale === 'sw'
                                            ? 'bg-zinc-900 text-amber-400'
                                            : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                                    }`}
                                >
                                    Kiswahili
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-zinc-100 bg-zinc-50">
                <div className="mx-auto max-w-6xl px-4 py-7">
                    <div className="grid gap-6 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-4">
                        <div>
                            <div className="mb-2 flex items-center justify-center sm:justify-start">
                                <div className="overflow-hidden rounded-xl bg-zinc-950 p-1 ring-1 ring-zinc-200/80">
                                    <img
                                        src="/images/logo.png"
                                        alt={businessName}
                                        className="h-8 w-auto max-w-[90px] object-contain"
                                    />
                                </div>
                            </div>
                            <p className="text-[12px] leading-relaxed text-zinc-500">
                                {settings?.business_description || t('Electronics and digital services.')}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                {t('Other services')}
                            </p>
                            <ul className="space-y-1.5 text-[12px] text-zinc-600">
                                <li>
                                    <Link href="/shop" className="inline-flex items-center gap-2 transition hover:text-amber-600">
                                        <svg className="h-3.5 w-3.5 text-amber-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        {t('Electronics Shop')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="inline-flex items-center gap-2 transition hover:text-amber-600">
                                        <svg className="h-3.5 w-3.5 text-amber-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Graphic Design
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="inline-flex items-center gap-2 transition hover:text-amber-600">
                                        <svg className="h-3.5 w-3.5 text-amber-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                        System & Website Development
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                {t('Contact')}
                            </p>
                            <div className="space-y-1.5 text-[12px] text-zinc-600">
                                <a
                                    href={`https://wa.me/${whatsappNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 transition hover:text-amber-600"
                                >
                                    <svg className="h-3.5 w-3.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    +{whatsappNumber}
                                </a>
                                {settings?.contact_email && (
                                    <p className="flex items-center justify-center gap-2 text-zinc-500 sm:justify-start">
                                        {settings.contact_email}
                                    </p>
                                )}
                                {settings?.contact_phone && (
                                    <p className="flex items-center justify-center gap-2 text-zinc-500 sm:justify-start">
                                        {settings.contact_phone}
                                    </p>
                                )}
                            </div>
                        </div>

                        {hasSocial && (
                            <div>
                                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                    {t('Follow us')}
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                                    {settings.facebook_url && (
                                        <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-[12px] font-medium text-zinc-600 transition hover:text-amber-600">
                                            Facebook
                                        </a>
                                    )}
                                    {settings.instagram_url && (
                                        <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-[12px] font-medium text-zinc-600 transition hover:text-amber-600">
                                            Instagram
                                        </a>
                                    )}
                                    {settings.tiktok_url && (
                                        <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-[12px] font-medium text-zinc-600 transition hover:text-amber-600">
                                            TikTok
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-zinc-200 pt-4 sm:flex-row">
                        <p className="text-[11px] text-zinc-400">
                            © {new Date().getFullYear()} {businessName}
                        </p>
                        <Link href="/about" className="text-[11px] font-medium text-zinc-500 transition hover:text-amber-600">
                            {t('About us & services')} →
                        </Link>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes name-marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-name-marquee {
                    display: inline-block;
                    animation: name-marquee 16s linear infinite;
                }
                .banner-sign:hover .animate-name-marquee {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}