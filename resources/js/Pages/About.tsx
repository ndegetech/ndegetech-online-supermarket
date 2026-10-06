import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function About() {
    const { settings, locale } = usePage().props as any;
    const businessName = settings?.business_name || 'MWANDEGE';
    const whatsapp = (settings?.whatsapp_number || '255678861389').replace(/\D/g, '');
    const isSw = locale === 'sw';

    const services = [
        {
            title: isSw ? 'Duka la Electronics' : 'Electronics Store',
            desc: isSw
                ? 'Tunauza electronics, accessories na vifaa vya nyumbani.'
                : 'Electronics, accessories and home essentials.',
            href: '/shop',
            cta: isSw ? 'Angalia duka' : 'Browse shop',
            external: false,
        },
        {
            title: 'Graphic Design',
            desc: isSw
                ? 'Logo, posters, social media creatives na branding.'
                : 'Logos, posters, social creatives and branding.',
            href: `https://wa.me/${whatsapp}?text=${encodeURIComponent(
                isSw
                    ? `Habari ${businessName}, nina nia na Graphic Design.`
                    : `Hello ${businessName}, I'm interested in Graphic Design.`
            )}`,
            cta: isSw ? 'Wasiliana' : 'Get in touch',
            external: true,
        },
        {
            title: isSw ? 'System & Website Development' : 'System & Website Development',
            desc: isSw
                ? 'Websites, systems za biashara na admin panels.'
                : 'Websites, business systems and admin panels.',
            href: `https://wa.me/${whatsapp}?text=${encodeURIComponent(
                isSw
                    ? `Habari ${businessName}, nina nia na System / Website Development.`
                    : `Hello ${businessName}, I'm interested in System / Website Development.`
            )}`,
            cta: isSw ? 'Wasiliana' : 'Get in touch',
            external: true,
        },
    ];

    return (
        <PublicLayout>
            <Head title={`${isSw ? 'Kuhusu' : 'About'} — ${businessName}`} />

            <section className="relative overflow-hidden bg-zinc-950 text-white">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-1/2 top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent animate-beam" />
                </div>
                <div className="relative mx-auto max-w-6xl px-4 py-10">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-400/90">
                        {isSw ? 'Kuhusu sisi' : 'About us'}
                    </p>
                    <h1 className="mt-2 text-xl font-semibold sm:text-2xl">{businessName}</h1>
                    <p className="mt-2 max-w-lg text-[13px] text-zinc-400 leading-relaxed">
                        {settings?.business_description ||
                            (isSw
                                ? 'Tunachagua electronics na huduma za kidijitali kwa biashara na watu binafsi.'
                                : 'We select electronics and digital services for businesses and individuals.')}
                    </p>
                </div>
            </section>

            <section className="py-8">
                <div className="mx-auto max-w-6xl px-4">
                    <h2 className="text-[15px] font-semibold text-zinc-900 mb-1">
                        {isSw ? 'Huduma zetu' : 'Our services'}
                    </h2>
                    <p className="text-[12px] text-zinc-500 mb-4">
                        {isSw ? 'Zaidi ya duka — tunatoa pia:' : 'Beyond the shop — we also offer:'}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {services.map((s) =>
                            s.external ? (
                                <a
                                    key={s.title}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-xl border border-zinc-200 bg-white p-4 hover:border-amber-300 hover:shadow-sm transition"
                                >
                                    <h3 className="text-[13px] font-semibold text-zinc-900">{s.title}</h3>
                                    <p className="mt-1.5 text-[12px] text-zinc-500">{s.desc}</p>
                                    <span className="mt-3 inline-block text-[12px] font-medium text-amber-600">
                                        {s.cta} →
                                    </span>
                                </a>
                            ) : (
                                <Link
                                    key={s.title}
                                    href={s.href}
                                    className="rounded-xl border border-zinc-200 bg-white p-4 hover:border-amber-300 hover:shadow-sm transition"
                                >
                                    <h3 className="text-[13px] font-semibold text-zinc-900">{s.title}</h3>
                                    <p className="mt-1.5 text-[12px] text-zinc-500">{s.desc}</p>
                                    <span className="mt-3 inline-block text-[12px] font-medium text-amber-600">
                                        {s.cta} →
                                    </span>
                                </Link>
                            )
                        )}
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
            `}</style>
        </PublicLayout>
    );
}