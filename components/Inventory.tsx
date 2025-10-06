
import React, { useState } from 'react';
import { Product, UserRole } from '../types';
import { CHANNELS } from '../constants';
import { exportInventoryToCSV } from '../services/exportService';
import { DownloadIcon, PlusIcon, EditIcon, TrashIcon } from './icons';
import ProductFormModal from './ProductFormModal';

interface SaleModalProps {
    product: Product;
    variant: Product['variants'][0];
    onClose: () => void;
    onConfirm: (productId: string, sku: string, channelId: string, quantity: number) => void;
}

const SaleModal: React.FC<SaleModalProps> = ({ product, variant, onClose, onConfirm }) => {
    const [channel, setChannel] = useState(CHANNELS[0].id);
    const [quantity, setQuantity] = useState(1);

    const handleConfirm = () => {
        if (quantity > 0 && quantity <= variant.stock) {
            onConfirm(product.id, variant.sku, channel, quantity);
            onClose();
        } else {
            alert('Invalid quantity.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                <p className="text-slate-600 mb-4">{variant.color}, {variant.size} ({variant.sku})</p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="channel" className="block text-sm font-medium text-slate-700">Channel</label>
                        <select id="channel" value={channel} onChange={e => setChannel(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            {CHANNELS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">Quantity</label>
                        <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} min="1" max={variant.stock} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md"/>
                        <p className="text-xs text-slate-500 mt-1">In Stock: {variant.stock}</p>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                    <button onClick={handleConfirm} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Confirm Sale</button>
                </div>
            </div>
        </div>
    );
};


interface InventoryProps {
  products: Product[];
  onSale: (productId: string, sku: string, channelId: string, quantity: number) => void;
  userRole: UserRole;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onSale, userRole, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
    const [selectedVariantForSale, setSelectedVariantForSale] = useState<{product: Product, variant: Product['variants'][0]} | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsFormModalOpen(true);
    };

    const handleDelete = (productId: string, productName: string) => {
        if (window.confirm(`Are you sure you want to delete "${productName}" and all its variants? This action cannot be undone.`)) {
            onDeleteProduct(productId);
        }
    };
    
    const handleSaveProduct = (productData: Product | Omit<Product, 'id'>) => {
        if ('id' in productData && productData.id) {
             onUpdateProduct(productData as Product);
        } else {
            onAddProduct(productData);
        }
        setIsFormModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center gap-4 flex-wrap">
                <h1 className="text-3xl font-bold text-slate-800">Inventory</h1>
                {userRole === UserRole.ADMIN && (
                  <div className="flex items-center gap-4">
                    <button
                        onClick={() => exportInventoryToCSV(products)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                       <DownloadIcon className="w-5 h-5 mr-2" />
                        Export CSV
                    </button>
                     <button
                        onClick={handleOpenAddModal}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                       <PlusIcon className="w-5 h-5 mr-2" />
                        Add Product
                    </button>
                  </div>
                )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Product Name</th>
                                <th scope="col" className="px-6 py-3">SKU</th>
                                <th scope="col" className="px-6 py-3">Color</th>
                                <th scope="col" className="px-6 py-3">Size</th>
                                <th scope="col" className="px-6 py-3 text-center">Stock</th>
                                <th scope="col" className="px-6 py-3 text-center">Status</th>
                                <th scope="col" className="px-6 py-3 text-center">Sale Action</th>
                                {userRole === UserRole.ADMIN && <th scope="col" className="px-6 py-3 text-center">Manage</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? products.map(product => 
                                product.variants.map((variant, index) => (
                                    <tr key={variant.sku} className="bg-white border-b hover:bg-slate-50">
                                        {index === 0 && <td rowSpan={product.variants.length} className="px-6 py-4 font-medium text-slate-900 align-top border-l-4 border-indigo-500">{product.name}</td>}
                                        <td className="px-6 py-4">{variant.sku}</td>
                                        <td className="px-6 py-4">{variant.color}</td>
                                        <td className="px-6 py-4">{variant.size}</td>
                                        <td className="px-6 py-4 text-center font-semibold">{variant.stock}</td>
                                        <td className="px-6 py-4 text-center">
                                            {variant.stock > variant.reorderLevel && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>}
                                            {variant.stock <= variant.reorderLevel && variant.stock > 0 && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Low Stock</span>}
                                            {variant.stock === 0 && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Out of Stock</span>}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => setSelectedVariantForSale({product, variant})}
                                                disabled={variant.stock === 0}
                                                className="font-medium text-indigo-600 hover:text-indigo-900 disabled:text-slate-400 disabled:cursor-not-allowed">
                                                Simulate Sale
                                            </button>
                                        </td>
                                        {userRole === UserRole.ADMIN && index === 0 && (
                                            <td rowSpan={product.variants.length} className="px-6 py-4 text-center align-top">
                                                <div className="flex justify-center items-center h-full space-x-4">
                                                    <button onClick={() => handleOpenEditModal(product)} className="text-slate-500 hover:text-blue-600 transition-colors" aria-label={`Edit ${product.name}`}>
                                                        <EditIcon className="w-5 h-5"/>
                                                    </button>
                                                    <button onClick={() => handleDelete(product.id, product.name)} className="text-slate-500 hover:text-red-600 transition-colors" aria-label={`Delete ${product.name}`}>
                                                        <TrashIcon className="w-5 h-5"/>
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={userRole === UserRole.ADMIN ? 8 : 7} className="text-center py-10 text-slate-500">
                                        No products in inventory.
                                        {userRole === UserRole.ADMIN && " Click 'Add Product' to get started."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedVariantForSale && (
                <SaleModal 
                    product={selectedVariantForSale.product}
                    variant={selectedVariantForSale.variant}
                    onClose={() => setSelectedVariantForSale(null)}
                    onConfirm={onSale}
                />
            )}
             {isFormModalOpen && (
                <ProductFormModal
                    isOpen={isFormModalOpen}
                    onClose={() => {
                        setIsFormModalOpen(false);
                        setEditingProduct(null);
                    }}
                    onSave={handleSaveProduct}
                    initialProduct={editingProduct}
                />
            )}
        </div>
    );
};

export default Inventory;
