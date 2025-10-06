
export enum UserRole {
  ADMIN = 'Admin',
  STAFF = 'Staff',
}

export enum View {
    DASHBOARD = 'Dashboard',
    INVENTORY = 'Inventory',
    SALES = 'Sales',
    ANALYTICS = 'Analytics',
}

export interface Channel {
  id: string;
  name: string;
}

export interface ProductVariant {
  sku: string;
  size: string;
  color: string;
  stock: number;
  reorderLevel: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  variants: ProductVariant[];
}

export interface Sale {
  id: string;
  productId: string;
  sku: string;
  channelId: string;
  quantity: number;
  timestamp: Date;
}

export interface RestockRecommendation {
    sku: string;
    productName: string;
    currentStock: number;
    recommendation: string;
    suggestedRestockQuantity: number;
}
