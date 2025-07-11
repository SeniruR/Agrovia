import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationTest = () => {
  const navigate = useNavigate();

  const testNavigation = () => {
    console.log('Testing navigation to /crop/28');
    navigate('/crop/28');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Navigation Test</h1>
      <button 
        onClick={testNavigation}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Navigate to Crop 28
      </button>
      <div className="mt-4">
        <p>Current URL: {window.location.href}</p>
        <p>This button should navigate to /crop/28</p>
      </div>
    </div>
  );
};

export default NavigationTest;
