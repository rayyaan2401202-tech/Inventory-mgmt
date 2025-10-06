
import React, { useMemo, useState, useCallback } from 'react';
import { Product, Sale, RestockRecommendation } from '../types';
import { CHANNELS } from '../constants';
import { getRestockRecommendations } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SparklesIcon, AlertTriangleIcon, CheckCircleIcon } from './icons';

interface AnalyticsProps {
  sales: Sale[];
  products: Product[];
}

const Analytics: React.FC<AnalyticsProps> = ({ sales, products }) => {
    const [recommendations, setRecommendations] = useState<RestockRecommendation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const salesByChannel = useMemo(() => {
        const channelSales: { [key: string]: number } = {};
        CHANNELS.forEach(c => channelSales[c.name] = 0);
        sales.forEach(s => {
            const channel = CHANNELS.find(c => c.id === s.channelId);
            if (channel) {
                channelSales[channel.name] = (channelSales[channel.name] || 0) + s.quantity;
            }
        });
        return Object.entries(channelSales).map(([name, sales]) => ({ name, sales }));
    }, [sales]);

    const salesByProduct = useMemo(() => {
        const productSales: { [key: string]: number } = {};
        sales.forEach(s => {
            const product = products.find(p => p.id === s.productId);
            if (product) {
                productSales[product.name] = (productSales[product.name] || 0) + s.quantity;
            }
        });
        return Object.entries(productSales)
            .map(([name, sales]) => ({ name, sales }))
            .sort((a,b) => b.sales - a.sales)
            .slice(0, 5); // Top 5 products
    }, [sales, products]);
    
    const handleFetchRecommendations = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setRecommendations([]);
        try {
            const result = await getRestockRecommendations(products, sales);
            setRecommendations(result);
        } catch (err) {
            setError('Failed to fetch recommendations. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [products, sales]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">Sales Analytics</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Sales by Channel</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesByChannel} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Top 5 Selling Products</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesByProduct} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={120}/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                    <h2 className="text-lg font-semibold flex items-center">
                        <SparklesIcon className="w-6 h-6 mr-2 text-indigo-500" />
                        AI-Powered Restock Recommendations
                    </h2>
                    <button 
                        onClick={handleFetchRecommendations}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Analyzing...' : 'Generate Recommendations'}
                    </button>
                </div>

                {isLoading && <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Analyzing your sales and inventory data...</p>
                </div>}
                
                {error && <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangleIcon className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>}

                {!isLoading && !error && recommendations.length > 0 && (
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Product</th>
                                    <th scope="col" className="px-6 py-3">Current Stock</th>
                                    <th scope="col" className="px-6 py-3">Recommendation</th>
                                    <th scope="col" className="px-6 py-3 text-center">Suggested Restock Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recommendations.map(rec => (
                                    <tr key={rec.sku} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            <div>{rec.productName}</div>
                                            <div className="text-xs text-slate-500">{rec.sku}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-red-600">{rec.currentStock}</td>
                                        <td className="px-6 py-4 max-w-sm">{rec.recommendation}</td>
                                        <td className="px-6 py-4 text-center font-bold text-lg text-indigo-600">{rec.suggestedRestockQuantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {!isLoading && !error && recommendations.length === 0 && (
                     <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <CheckCircleIcon className="mx-auto h-12 w-12 text-green-400" />
                        <h3 className="mt-2 text-sm font-medium text-slate-900">All Good!</h3>
                        <p className="mt-1 text-sm text-slate-500">No items currently require restocking, or you can generate recommendations for low-stock items.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
