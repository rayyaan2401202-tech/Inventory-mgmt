
import React, { useMemo } from 'react';
import { Product, Sale, UserRole } from '../types';
import { CHANNELS } from '../constants';
import { exportSalesToCSV } from '../services/exportService';
import { DownloadIcon } from './icons';

interface SalesProps {
  sales: Sale[];
  products: Product[];
  userRole: UserRole;
}

const Sales: React.FC<SalesProps> = ({ sales, products, userRole }) => {
    const channelMap = new Map(CHANNELS.map(c => [c.id, c.name]));
    const productMap = useMemo(() => {
        const map = new Map<string, {name: string, variant: string}>();
        products.forEach(p => p.variants.forEach(v => map.set(v.sku, {name: p.name, variant: `${v.color}, ${v.size}`})));
        return map;
    }, [products]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Sales Log</h1>
        {userRole === UserRole.ADMIN && (
            <button
                onClick={() => exportSalesToCSV(sales, products)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Export CSV
            </button>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Timestamp</th>
                        <th scope="col" className="px-6 py-3">Product</th>
                        <th scope="col" className="px-6 py-3">SKU</th>
                        <th scope="col" className="px-6 py-3">Channel</th>
                        <th scope="col" className="px-6 py-3 text-right">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map(sale => {
                        const productInfo = productMap.get(sale.sku);
                        return (
                            <tr key={sale.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4">{sale.timestamp.toLocaleString()}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    <div>{productInfo?.name}</div>
                                    <div className="text-xs text-slate-500">{productInfo?.variant}</div>
                                </td>
                                <td className="px-6 py-4">{sale.sku}</td>
                                <td className="px-6 py-4">{channelMap.get(sale.channelId) || 'Unknown'}</td>
                                <td className="px-6 py-4 text-right font-semibold">{sale.quantity}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Sales;
