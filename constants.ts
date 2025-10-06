
import { Product, Sale, Channel } from './types';

export const CHANNELS: Channel[] = [
    { id: 'website', name: 'Website' },
    { id: 'amazon', name: 'Amazon' },
    { id: 'ebay', name: 'eBay' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Classic Crewneck T-Shirt',
    category: 'Apparel',
    variants: [
      { sku: 'TS-BLK-S', size: 'S', color: 'Black', stock: 50, reorderLevel: 10 },
      { sku: 'TS-BLK-M', size: 'M', color: 'Black', stock: 30, reorderLevel: 10 },
      { sku: 'TS-BLK-L', size: 'L', color: 'Black', stock: 8, reorderLevel: 10 },
      { sku: 'TS-WHT-S', size: 'S', color: 'White', stock: 60, reorderLevel: 15 },
      { sku: 'TS-WHT-M', size: 'M', color: 'White', stock: 45, reorderLevel: 15 },
      { sku: 'TS-WHT-L', size: 'L', color: 'White', stock: 22, reorderLevel: 15 },
    ],
  },
  {
    id: 'prod-002',
    name: 'V-Neck Sweater',
    category: 'Apparel',
    variants: [
      { sku: 'SW-NVY-M', size: 'M', color: 'Navy', stock: 25, reorderLevel: 8 },
      { sku: 'SW-NVY-L', size: 'L', color: 'Navy', stock: 15, reorderLevel: 8 },
      { sku: 'SW-GRY-M', size: 'M', color: 'Gray', stock: 30, reorderLevel: 8 },
      { sku: 'SW-GRY-L', size: 'L', color: 'Gray', stock: 5, reorderLevel: 8 },
    ],
  },
  {
    id: 'prod-003',
    name: 'Leather Sneakers',
    category: 'Footwear',
    variants: [
      { sku: 'SNK-BRN-9', size: '9', color: 'Brown', stock: 12, reorderLevel: 5 },
      { sku: 'SNK-BRN-10', size: '10', color: 'Brown', stock: 18, reorderLevel: 5 },
      { sku: 'SNK-BRN-11', size: '11', color: 'Brown', stock: 4, reorderLevel: 5 },
      { sku: 'SNK-BLK-9', size: '9', color: 'Black', stock: 20, reorderLevel: 5 },
      { sku: 'SNK-BLK-10', size: '10', color: 'Black', stock: 14, reorderLevel: 5 },
    ],
  },
   {
    id: 'prod-004',
    name: 'Denim Jeans',
    category: 'Apparel',
    variants: [
      { sku: 'JN-BLU-30', size: '30', color: 'Blue', stock: 40, reorderLevel: 12 },
      { sku: 'JN-BLU-32', size: '32', color: 'Blue', stock: 9, reorderLevel: 12 },
      { sku: 'JN-BLU-34', size: '34', color: 'Blue', stock: 25, reorderLevel: 12 },
      { sku: 'JN-BLK-32', size: '32', color: 'Black', stock: 35, reorderLevel: 12 },
    ],
  },
];

export const INITIAL_SALES: Sale[] = [
    { id: 'sale-001', productId: 'prod-001', sku: 'TS-BLK-M', channelId: 'website', quantity: 2, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    { id: 'sale-002', productId: 'prod-003', sku: 'SNK-BRN-10', channelId: 'amazon', quantity: 1, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { id: 'sale-003', productId: 'prod-002', sku: 'SW-GRY-L', channelId: 'ebay', quantity: 1, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
    { id: 'sale-004', productId: 'prod-001', sku: 'TS-WHT-S', channelId: 'website', quantity: 5, timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) },
];
