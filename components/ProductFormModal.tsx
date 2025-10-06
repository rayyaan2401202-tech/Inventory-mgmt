
import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product | Omit<Product, 'id'>) => void;
    initialProduct: Product | null;
}

const BLANK_VARIANT: ProductVariant = { sku: '', size: '', color: '', stock: 0, reorderLevel: 5 };
const BLANK_PRODUCT: Omit<Product, 'id'> = {
    name: '',
    category: '',
    variants: [BLANK_VARIANT]
};

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, initialProduct }) => {
    const [formData, setFormData] = useState<Product | Omit<Product, 'id'>>(initialProduct || BLANK_PRODUCT);

    useEffect(() => {
        setFormData(initialProduct || BLANK_PRODUCT);
    }, [initialProduct, isOpen]);
    
    if (!isOpen) return null;

    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const newVariants = [...formData.variants];
        const variantKey = name as keyof ProductVariant;
        newVariants[index] = {
            ...newVariants[index],
            [variantKey]: type === 'number' ? parseInt(value, 10) : value,
        };
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const addVariant = () => {
        setFormData(prev => ({...prev, variants: [...prev.variants, { ...BLANK_VARIANT, sku: `SKU-${Date.now()}`}] }));
    };
    
    const removeVariant = (index: number) => {
        if (formData.variants.length <= 1) {
            alert("A product must have at least one variant.");
            return;
        }
        const newVariants = formData.variants.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!formData.name || !formData.category) {
            alert('Product Name and Category are required.');
            return;
        }
        if (formData.variants.some(v => !v.sku || !v.size || !v.color)) {
            alert('All variant fields (SKU, Size, Color) are required.');
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start z-50 p-4 overflow-y-auto" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-slate-800">{initialProduct ? 'Edit Product' : 'Add New Product'}</h2>
                    </div>
                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleProductChange} required className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                            </div>
                             <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <input type="text" name="category" id="category" value={formData.category} onChange={handleProductChange} required className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-700 pt-4 border-t mt-4">Variants</h3>
                        <div className="space-y-4">
                            {formData.variants.map((variant, index) => (
                                <div key={index} className="p-4 rounded-md border border-slate-200 bg-slate-50 relative">
                                    {formData.variants.length > 1 && (
                                        <button type="button" onClick={() => removeVariant(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        <div>
                                            <label htmlFor={`sku-${index}`} className="block text-xs font-medium text-slate-600 mb-1">SKU</label>
                                            <input type="text" name="sku" id={`sku-${index}`} value={variant.sku} onChange={(e) => handleVariantChange(index, e)} required className="w-full border-slate-300 rounded-md shadow-sm text-sm"/>
                                        </div>
                                        <div>
                                            <label htmlFor={`color-${index}`} className="block text-xs font-medium text-slate-600 mb-1">Color</label>
                                            <input type="text" name="color" id={`color-${index}`} value={variant.color} onChange={(e) => handleVariantChange(index, e)} required className="w-full border-slate-300 rounded-md shadow-sm text-sm"/>
                                        </div>
                                        <div>
                                            <label htmlFor={`size-${index}`} className="block text-xs font-medium text-slate-600 mb-1">Size</label>
                                            <input type="text" name="size" id={`size-${index}`} value={variant.size} onChange={(e) => handleVariantChange(index, e)} required className="w-full border-slate-300 rounded-md shadow-sm text-sm"/>
                                        </div>
                                         <div>
                                            <label htmlFor={`stock-${index}`} className="block text-xs font-medium text-slate-600 mb-1">Stock</label>
                                            <input type="number" name="stock" id={`stock-${index}`} value={variant.stock} onChange={(e) => handleVariantChange(index, e)} required min="0" className="w-full border-slate-300 rounded-md shadow-sm text-sm"/>
                                        </div>
                                         <div>
                                            <label htmlFor={`reorderLevel-${index}`} className="block text-xs font-medium text-slate-600 mb-1">Reorder Level</label>
                                            <input type="number" name="reorderLevel" id={`reorderLevel-${index}`} value={variant.reorderLevel} onChange={(e) => handleVariantChange(index, e)} required min="0" className="w-full border-slate-300 rounded-md shadow-sm text-sm"/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addVariant} className="w-full mt-2 text-sm text-indigo-600 font-semibold hover:text-indigo-800 flex items-center justify-center p-2 border-2 border-dashed rounded-md hover:bg-indigo-50">
                            <PlusIcon className="w-5 h-5 mr-2" /> Add Another Variant
                        </button>
                    </div>

                    <div className="p-4 bg-slate-50 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;
