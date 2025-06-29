import React, { useState } from 'react';
import ShopItemsListing from './components/ShopItemsListing';
import ItemDetail from './components/ItemDetail';
import CartPage from './components/CartPage';
import { CartProvider } from './contexts/CartContext';

function Items() {
  const [currentView, setCurrentView] = useState('listing');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setCurrentView('detail');
  };

  const handleBackToListing = () => {
    setCurrentView('listing');
    setSelectedItem(null);
  };

  const handleViewCart = () => {
    setCurrentView('cart');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'listing':
        return <ShopItemsListing onItemClick={handleItemClick} onViewCart={handleViewCart} />;
      case 'detail':
        return selectedItem && <ItemDetail item={selectedItem} onBack={handleBackToListing} />;
      case 'cart':
        return <CartPage onBack={handleBackToListing} />;
      default:
        return <ShopItemsListing onItemClick={handleItemClick} onViewCart={handleViewCart} />;
    }
  };

  return (
    <CartProvider>
      <div>
        {renderCurrentView()}
      </div>
    </CartProvider>
  );
}

export default Items;