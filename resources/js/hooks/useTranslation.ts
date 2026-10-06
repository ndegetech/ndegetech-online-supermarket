import { usePage } from '@inertiajs/react';

interface PageProps {
    translations: Record<string, string>;
    locale: string;
    [key: string]: any; // inaruhusu props nyingine (auth, settings, flash n.k.)
}

export function useTranslation() {
    const { translations, locale } = usePage().props as PageProps;

    const t = (key: string, fallback?: string): string => {
        return translations?.[key] ?? fallback ?? key;
    };

    return { t, locale };
}