import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEvent, useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedImg } from '@/utils/cropImage';
import { useTranslation } from '@/hooks/useTranslation';

interface Category {
    id: number;
    name: string;
}

interface ProductImage {
    id: number;
    image: string;
    is_primary: boolean;
    sort_order: number;
}

interface Product {
    id: number;
    name: string;
    category_id: number;
    brand: string | null;
    model: string | null;
    description: string | null;
    specifications: string | null;
    price: number;
    old_price: number | null;
    availability: string;
    status: string;
    featured: boolean;
    meta_title: string | null;
    meta_description: string | null;
    images: ProductImage[];
}

interface Props {
    product: Product;
    categories: Category[];
}

export default function Edit({ product, categories }: Props) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, progress } = useForm({
        name: product.name,
        category_id: product.category_id as number | string,
        brand: product.brand || '',
        model: product.model || '',
        description: product.description || '',
        specifications: product.specifications || '',
        price: product.price as number | string,
        old_price: (product.old_price ?? '') as number | string,
        availability: product.availability,
        status: product.status,
        featured: product.featured,
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        images: [] as File[],
        remove_images: [] as number[],
        primary_image_id: product.images.find((img) => img.is_primary)?.id || null,
        _method: 'PUT' as const,
    });

    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState(product.images);
    const [cropSrc, setCropSrc] = useState<string | null>(null);
    const [cropIndex, setCropIndex] = useState<number | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [pendingFileName, setPendingFileName] = useState('image.jpg');
    const [cropError, setCropError] = useState<string | null>(null);

    const onCropComplete = useCallback((_: Area, pixels: Area) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const combined = [...data.images, ...files].slice(0, 8);
        setData('images', combined);
        const newUrls = files.slice(0, 8 - data.images.length).map((f) => URL.createObjectURL(f));
        setPreviews((prev) => [...prev, ...newUrls].slice(0, 8));
        e.target.value = '';
    };

    const openCropForIndex = (index: number) => {
        const file = data.images[index];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setCropSrc(url);
        setCropIndex(index);
        setPendingFileName(file.name.replace(/\.[^.]+$/, '') + '.jpg');
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCropError(null);
    };

    const applyCrop = async () => {
        if (!cropSrc || !croppedAreaPixels || cropIndex === null) return;
        try {
            const croppedFile = await getCroppedImg(cropSrc, croppedAreaPixels, pendingFileName);
            const nextImages = [...data.images];
            nextImages[cropIndex] = croppedFile;
            setData('images', nextImages);
            URL.revokeObjectURL(previews[cropIndex]);
            const nextPreviews = [...previews];
            nextPreviews[cropIndex] = URL.createObjectURL(croppedFile);
            setPreviews(nextPreviews);
            URL.revokeObjectURL(cropSrc);
            setCropSrc(null);
            setCropIndex(null);
            setCroppedAreaPixels(null);
        } catch (err) {
            console.error(err);
            setCropError(t('Failed to crop. Try again.'));
        }
    };

    const cancelCrop = () => {
        if (cropSrc) URL.revokeObjectURL(cropSrc);
        setCropSrc(null);
        setCropIndex(null);
        setCroppedAreaPixels(null);
        setCropError(null);
    };

    const removeNewImage = (index: number) => {
        const newImages = [...data.images];
        newImages.splice(index, 1);
        setData('images', newImages);
        URL.revokeObjectURL(previews[index]);
        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const removeExistingImage = (id: number) => {
        setData('remove_images', [...data.remove_images, id]);
        setExistingImages(existingImages.filter((img) => img.id !== id));
        if (data.primary_image_id === id) setData('primary_image_id', null);
    };

    const setPrimary = (id: number) => setData('primary_image_id', id);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.products.update', product.id), { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title={`${t('Edit')} ${product.name}`} />

            <div className="max-w-3xl space-y-5">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.products.index')}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-lg font-semibold text-zinc-900">{t('Edit Product')}</h1>
                        <p className="truncate text-[12px] text-zinc-500">{product.name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
                        <h2 className="text-sm font-semibold text-zinc-900">{t('Basic Information')}</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="block text-[12px] font-medium text-zinc-700">
                                    {t('Product Name')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                                />
                                {errors.name && <p className="mt-1 text-[12px] text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-[12px] font-medium text-zinc-700">
                                    {t('Category')} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData('category_id', e.target.value ? Number(e.target.value) : '')
                                    }
                                    className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                                >
                                    <option value="">{t('Select category')}</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="mt-1 text-[12px] text-red-600">{errors.category_id}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-[12px] font-medium text-zinc-700">{t('Brand')}</label>
                                <input
                                    type="text"
                                    value={data.brand}
                                    onChange={(e) => setData('brand', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-[12px] font-medium text-zinc-700">{t('Model')}</label>
                                <input
                                    type="text"
                                    value={data.model}
                                    onChange={(e) => setData('model', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
                        <h2 className="text-sm font-semibold text-zinc-900">{t('Pricing & Status')}</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-[12px] font-medium text-zinc-700">
                                    {t('Price (TZS)')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData('price', e.target.value === '' ? '' : Number(e.target.value))
                                    }
                                    className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                                    min="0"
                                    step="any"
                                />
                                {errors.price && <p className="mt-1 text-[12px] text-red-600">{errors.price}</p>}
                            </div>
                            <div>
                                <label className="block text-[12px] font-medium text-zinc-700">{t('Old Price')}</label>
                                <input
                                    type="number"
                                    value={data.old_price}
                                    onChange={(e) =>
                                        setData('old_price', e.target.value === '' ? '' : Number(e.target.value))
                                    }
                                    className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                                    min="0"
                                    step="any"
                                />
                            </div>
                            <div>
                                <label className="block text-[12px] font-medium text-zinc-700">{t('Availability')}</label>
                                <select
                                    value={data.availability}
                                    onChange={(e) => setData('availability', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                                >
                                    <option value="available">{t('Available')}</option>
                                    <option value="out_of_stock">{t('Out of Stock')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[12px] font-medium text-zinc-700">{t('Status')}</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                                >
                                    <option value="published">{t('Published')}</option>
                                    <option value="draft">{t('Draft')}</option>
                                    <option value="archived">{t('Archived')}</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={data.featured}
                                onChange={(e) => setData('featured', e.target.checked)}
                                className="h-3.5 w-3.5 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
                            />
                            <label htmlFor="featured" className="text-[12px] font-medium text-zinc-700">
                                {t('Mark as Featured')}
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
                        <h2 className="text-sm font-semibold text-zinc-900">{t('Description & Specs')}</h2>
                        <div>
                            <label className="block text-[12px] font-medium text-zinc-700">{t('Description')}</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[12px] font-medium text-zinc-700">{t('Specifications')}</label>
                            <textarea
                                value={data.specifications}
                                onChange={(e) => setData('specifications', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
                        <h2 className="text-sm font-semibold text-zinc-900">{t('Current Images')}</h2>
                        {existingImages.length === 0 ? (
                            <p className="text-[12px] text-zinc-500">{t('No images yet.')}</p>
                        ) : (
                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                                {existingImages.map((img) => (
                                    <div key={img.id} className="group relative">
                                        <div
                                            className={`aspect-square overflow-hidden rounded-lg border-2 bg-zinc-50 ${
                                                data.primary_image_id === img.id
                                                    ? 'border-amber-500'
                                                    : 'border-zinc-200'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${img.image}`}
                                                alt=""
                                                className="h-full w-full object-contain p-1"
                                            />
                                        </div>
                                        {data.primary_image_id === img.id && (
                                            <span className="absolute left-1.5 top-1.5 rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-medium text-white">
                                                {t('Primary')}
                                            </span>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-lg bg-black/50 opacity-0 transition group-hover:opacity-100">
                                            {data.primary_image_id !== img.id && (
                                                <button
                                                    type="button"
                                                    onClick={() => setPrimary(img.id)}
                                                    className="rounded bg-white px-2 py-1 text-[10px] font-medium text-zinc-800"
                                                >
                                                    {t('Primary')}
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(img.id)}
                                                className="rounded bg-red-500 px-2 py-1 text-[10px] font-medium text-white"
                                            >
                                                {t('Remove')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
                        <div>
                            <h2 className="text-sm font-semibold text-zinc-900">{t('Add New Images')}</h2>
                            <p className="mt-0.5 text-[12px] text-zinc-500">
                                {t('Upload free · optional Edit to crop / zoom out')}
                            </p>
                        </div>
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 transition hover:border-amber-400 hover:bg-amber-50/30">
                            <span className="text-[13px] font-medium text-zinc-600">{t('Click to upload (multiple)')}</span>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                multiple
                                className="hidden"
                                onChange={handleImagesChange}
                            />
                        </label>

                        {previews.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                                {previews.map((src, index) => (
                                    <div key={index} className="group relative">
                                        <div className="aspect-square overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                                            <img src={src} alt="" className="h-full w-full object-contain p-0.5" />
                                        </div>
                                        <div className="absolute inset-x-1 bottom-1 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                                            <button
                                                type="button"
                                                onClick={() => openCropForIndex(index)}
                                                className="flex-1 rounded bg-zinc-900/90 py-1 text-[10px] font-medium text-white"
                                            >
                                                {t('Edit')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="rounded bg-red-500 px-2 py-1 text-[10px] font-medium text-white"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {progress && (
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                                <div
                                    className="h-full rounded-full bg-amber-500"
                                    style={{ width: `${progress.percentage}%` }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
                        <h2 className="text-sm font-semibold text-zinc-900">{t('SEO (Optional)')}</h2>
                        <div>
                            <label className="block text-[12px] font-medium text-zinc-700">{t('Meta Title')}</label>
                            <input
                                type="text"
                                value={data.meta_title}
                                onChange={(e) => setData('meta_title', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[12px] font-medium text-zinc-700">{t('Meta Description')}</label>
                            <textarea
                                value={data.meta_description}
                                onChange={(e) => setData('meta_description', e.target.value)}
                                rows={2}
                                className="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-amber-500 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Link
                            href={route('admin.products.index')}
                            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px] font-medium text-zinc-700 hover:bg-zinc-50"
                        >
                            {t('Cancel')}
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2 text-[13px] font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                        >
                            {processing ? t('Updating...') : t('Update Product')}
                        </button>
                    </div>
                </form>
            </div>

            {cropSrc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="border-b border-zinc-100 px-4 py-3">
                            <h3 className="text-sm font-semibold text-zinc-900">{t('Edit image')}</h3>
                            <p className="text-[11px] text-zinc-500">
                                {t('Zoom out (<1x) to shrink · zoom in to enlarge')}
                            </p>
                        </div>
                        <div className="relative h-72 bg-zinc-900">
                            <Cropper
                                image={cropSrc}
                                crop={crop}
                                zoom={zoom}
                                minZoom={0.4}
                                maxZoom={3}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                showGrid
                                restrictPosition={false}
                            />
                        </div>
                        <div className="space-y-3 px-4 py-4">
                            <div>
                                <label className="flex items-center justify-between text-[12px] text-zinc-600">
                                    <span>{t('Zoom')}</span>
                                    <span>{zoom.toFixed(2)}x</span>
                                </label>
                                <input
                                    type="range"
                                    min={0.4}
                                    max={3}
                                    step={0.05}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="mt-1 w-full accent-amber-500"
                                />
                            </div>
                            {cropError && <p className="text-[12px] text-red-600">{cropError}</p>}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={cancelCrop}
                                    className="flex-1 rounded-lg border border-zinc-300 py-2 text-[13px] font-medium text-zinc-700 hover:bg-zinc-50"
                                >
                                    {t('Cancel')}
                                </button>
                                <button
                                    type="button"
                                    onClick={applyCrop}
                                    className="flex-1 rounded-lg bg-zinc-900 py-2 text-[13px] font-medium text-white hover:bg-zinc-800"
                                >
                                    {t('Apply')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}