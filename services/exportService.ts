
import { Product, Sale } from '../types';

const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const exportInventoryToCSV = (products: Product[]) => {
    const headers = ['ProductName', 'Category', 'SKU', 'Size', 'Color', 'Stock', 'ReorderLevel'];
    const rows = products.flatMap(p => 
        p.variants.map(v => [
            `"${p.name}"`,
            `"${p.category}"`,
            v.sku,
            v.size,
            v.color,
            v.stock,
            v.reorderLevel
        ].join(','))
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    downloadCSV(csvContent, 'inventory.csv');
};


export const exportSalesToCSV = (sales: Sale[], products: Product[]) => {
    const productMap = new Map(products.map(p => [p.id, p]));

    const headers = ['SaleID', 'Timestamp', 'ProductName', 'SKU', 'Channel', 'Quantity'];
    const rows = sales.map(s => {
        const product = productMap.get(s.productId);
        return [
            s.id,
            s.timestamp.toISOString(),
            product ? `"${product.name}"` : 'N/A',
            s.sku,
            s.channelId,
            s.quantity
        ].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    downloadCSV(csvContent, 'sales.csv');
};
