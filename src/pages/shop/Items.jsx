import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ShopItemsListing from './ShopItemsListing';
import ItemDetail from './ItemDetail';
import CartPage from './CartPage';
import { CartProvider } from './CartContext';

function Items() {
  const [currentView, setCurrentView] = useState('listing');
  const [selectedItem, setSelectedItem] = useState(null);
  const location = useLocation();
  const [initialReviewReq, setInitialReviewReq] = useState(null);

  useEffect(() => {
    if (location?.state?.openReviewForProductId) {
      setInitialReviewReq({ productId: location.state.openReviewForProductId });
    }
  }, [location]);

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
        return <ShopItemsListing onItemClick={handleItemClick} initialReviewRequest={initialReviewReq} />;
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