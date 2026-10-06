import { Link, usePage, router } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface Flash {
    success?: string;
    error?: string;
}

export default function AdminLayout({ children }: PropsWithChildren) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const page = usePage();
    const { url } = page;
    const flash = (page.props as any).flash as Flash | undefined;
    const user = (page.props as any).auth?.user;
    const settings = (page.props as any).settings;
    const { t, locale } = useTranslation();

    const businessName = settings?.business_name || 'NDEGETECH';

    const navigation = [
        {
            name: t('Dashboard'),
            href: '/admin',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            name: t('Categories'),
            href: '/admin/categories',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
        },
        {
            name: t('Products'),
            href: '/admin/products',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            name: t('Settings'),
            href: '/admin/settings',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            name: t('Profile'),
            href: '/profile',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
    ];

    const isActive = (href: string) => {
        if (href === '/admin') {
            return url === '/admin' || url === '/admin/';
        }
        return url === href || url.startsWith(href + '/');
    };

    const switchLocale = (lang: string) => {
        router.post('/locale', { locale: lang }, { preserveScroll: true });
    };

    const logout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand — logo rounded, si square kali */}
                <div className="flex h-14 items-center gap-2.5 border-b border-zinc-100 px-3">
                    <div className="overflow-hidden rounded-xl bg-zinc-950 p-1 shadow-sm ring-1 ring-zinc-200/80 shrink-0">
                        <img
                            src="/images/logo.png"
                            alt={businessName}
                            className="h-8 w-auto max-w-[72px] object-contain"
                        />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-[12px] font-semibold tracking-wide text-zinc-900 uppercase">
                            {businessName}
                        </p>
                        <p className="text-[10px] text-zinc-400">{t('Admin')}</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
                    {navigation.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition ${
                                    active
                                        ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-100'
                                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                                }`}
                            >
                                <span className={active ? 'text-amber-600' : 'text-zinc-400'}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-zinc-100 p-3 space-y-2">
                    {/* Language switch */}
                    <div className="flex items-center rounded-lg border border-zinc-200 text-[11px] font-medium overflow-hidden">
                        <button
                            type="button"
                            onClick={() => switchLocale('en')}
                            className={`flex-1 py-1.5 transition ${
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
                            className={`flex-1 py-1.5 transition ${
                                locale === 'sw'
                                    ? 'bg-zinc-900 text-amber-400'
                                    : 'text-zinc-600 hover:bg-zinc-50'
                            }`}
                        >
                            SW
                        </button>
                    </div>

                    {user && (
                        <p className="truncate px-1 text-[11px] text-zinc-400">{user.email}</p>
                    )}
                    <div className="flex gap-1.5">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 rounded-lg border border-zinc-200 py-1.5 text-center text-[11px] font-medium text-zinc-600 hover:bg-zinc-50"
                        >
                            {t('Website')}
                        </a>
                        <button
                            type="button"
                            onClick={logout}
                            className="flex-1 rounded-lg border border-zinc-200 py-1.5 text-[11px] font-medium text-zinc-600 hover:bg-zinc-50 hover:text-red-600"
                        >
                            {t('Logout')}
                        </button>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-56">
                <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b border-zinc-200 bg-white px-4 lg:h-14 lg:px-6">
                    <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open menu"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Mobile: logo ndogo + Admin */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <div className="overflow-hidden rounded-lg bg-zinc-950 p-0.5 ring-1 ring-zinc-200/80">
                            <img
                                src="/images/logo.png"
                                alt={businessName}
                                className="h-6 w-auto max-w-[48px] object-contain"
                            />
                        </div>
                        <p className="text-[13px] font-medium text-zinc-700">{t('Admin')}</p>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <div className="hidden sm:flex items-center rounded-md border border-zinc-200 text-[11px] font-medium overflow-hidden">
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
                        <div className="text-[12px] text-zinc-500">{user?.name || t('Admin')}</div>
                    </div>
                </header>

                {(flash?.success || flash?.error) && (
                    <div className="space-y-2 px-4 pt-4 lg:px-6">
                        {flash.success && (
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">
                                {flash.success}
                            </div>
                        )}
                        {flash.error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-800">
                                {flash.error}
                            </div>
                        )}
                    </div>
                )}

                <main className="p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}