import React, { useState } from 'react';
import ShopItemsListing from './ShopItemsListing';
import ItemDetail from './ItemDetail';
import CartPage from './CartPage';
import { CartProvider } from './CartContext';

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

  // View cart handled by navigation bar; keeping internal cart view disabled here

  const renderCurrentView = () => {
    switch (currentView) {
      case 'listing':
        return <ShopItemsListing onItemClick={handleItemClick} />;
      case 'detail':
        return selectedItem && <ItemDetail item={selectedItem} onBack={handleBackToListing} />;
      case 'cart':
        return <CartPage onBack={handleBackToListing} />;
      default:
        return <ShopItemsListing onItemClick={handleItemClick} />;
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