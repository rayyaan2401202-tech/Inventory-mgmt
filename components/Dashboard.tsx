
import React, { useMemo } from 'react';
import { Product, Sale } from '../types';
import { InventoryIcon, SalesIcon, AlertTriangleIcon } from './icons';
import { CHANNELS } from '../constants';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  lowStockItems: { product: Product; variant: Product['variants'][0] }[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className={`w-12 h-12 flex items-center justify-center rounded-full ${color}`}>
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ products, sales, lowStockItems }) => {
    const totalStock = useMemo(() => products.reduce((sum, p) => sum + p.variants.reduce((vSum, v) => vSum + v.stock, 0), 0), [products]);
    const totalSKUs = useMemo(() => products.reduce((sum, p) => sum + p.variants.length, 0), [products]);
    const recentSales = sales.slice(0, 5);
    const channelMap = new Map(CHANNELS.map(c => [c.id, c.name]));
    const productMap = useMemo(() => {
        const map = new Map<string, {name: string, variant: string}>();
        products.forEach(p => p.variants.forEach(v => map.set(v.sku, {name: p.name, variant: `${v.color}, ${v.size}`})));
        return map;
    }, [products]);


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Inventory" value={totalStock.toLocaleString()} icon={<InventoryIcon className="w-6 h-6 text-white"/>} color="bg-blue-500" />
        <StatCard title="Total SKUs" value={totalSKUs} icon={<SalesIcon className="w-6 h-6 text-white"/>} color="bg-green-500" />
        <StatCard title="Low Stock Alerts" value={lowStockItems.length} icon={<AlertTriangleIcon className="w-6 h-6 text-white"/>} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-4 py-3">Product</th>
                            <th scope="col" className="px-4 py-3">Channel</th>
                            <th scope="col" className="px-4 py-3">Qty</th>
                            <th scope="col" className="px-4 py-3">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentSales.map(sale => {
                            const productInfo = productMap.get(sale.sku);
                            return (
                                <tr key={sale.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-900">
                                        <div>{productInfo?.name}</div>
                                        <div className="text-xs text-slate-500">{productInfo?.variant}</div>
                                    </td>
                                    <td className="px-4 py-3">{channelMap.get(sale.channelId) || 'Unknown'}</td>
                                    <td className="px-4 py-3">{sale.quantity}</td>
                                    <td className="px-4 py-3">{sale.timestamp.toLocaleTimeString()}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Restock Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                <AlertTriangleIcon className="w-5 h-5 mr-2"/>
                Restock Alerts
            </h2>
             <div className="overflow-y-auto max-h-80">
                <ul className="space-y-3">
                    {lowStockItems.length > 0 ? lowStockItems.map(({ product, variant }) => (
                        <li key={variant.sku} className="p-3 bg-red-50 border border-red-200 rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-slate-800">{product.name}</p>
                                <p className="text-sm text-slate-600">{variant.sku} - {variant.color}, {variant.size}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-red-600">{variant.stock} left</p>
                                <p className="text-xs text-slate-500">Min: {variant.reorderLevel}</p>
                            </div>
                        </li>
                    )) : (
                        <p className="text-slate-500 text-center py-10">No low stock items. Great job!</p>
                    )}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
