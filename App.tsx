
import React, { useState, useMemo, useCallback } from 'react';
import { UserRole, Product, Sale, View } from './types';
import { INITIAL_PRODUCTS, INITIAL_SALES } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Analytics from './components/Analytics';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  const lowStockThreshold = 10;
  const lowStockItems = useMemo(() => {
    const items: { product: Product; variant: Product['variants'][0] }[] = [];
    products.forEach(p => {
      p.variants.forEach(v => {
        if (v.stock <= v.reorderLevel) {
          items.push({ product: p, variant: v });
        }
      });
    });
    return items;
  }, [products]);
  
  const handleSale = useCallback((productId: string, sku: string, channelId: string, quantity: number) => {
    setProducts(prevProducts => {
      const newProducts = prevProducts.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            variants: p.variants.map(v => {
              if (v.sku === sku && v.stock >= quantity) {
                return { ...v, stock: v.stock - quantity };
              }
              return v;
            })
          };
        }
        return p;
      });
      return newProducts;
    });

    setSales(prevSales => [
      {
        id: `sale-${Date.now()}`,
        productId,
        sku,
        channelId,
        quantity,
        timestamp: new Date()
      },
      ...prevSales
    ]);
  }, []);
  
  const handleAddProduct = useCallback((newProduct: Omit<Product, 'id'>) => {
    setProducts(prevProducts => [
      { ...newProduct, id: `prod-${Date.now()}` },
      ...prevProducts
    ]);
  }, []);

  const handleUpdateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  }, []);

  const handleDeleteProduct = useCallback((productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  }, []);


  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard products={products} sales={sales} lowStockItems={lowStockItems} />;
      case View.INVENTORY:
        return <Inventory 
                  products={products} 
                  onSale={handleSale} 
                  userRole={currentUserRole} 
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
               />;
      case View.SALES:
        return <Sales sales={sales} products={products} userRole={currentUserRole}/>;
      case View.ANALYTICS:
        if (currentUserRole !== UserRole.ADMIN) {
          return <div className="p-8 text-center text-red-500">Access Denied. Admins only.</div>;
        }
        return <Analytics sales={sales} products={products} />;
      default:
        return <Dashboard products={products} sales={sales} lowStockItems={lowStockItems} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} userRole={currentUserRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUserRole={currentUserRole} setCurrentUserRole={setCurrentUserRole} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-4 sm:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
