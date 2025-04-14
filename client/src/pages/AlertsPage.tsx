import { useEffect } from "react";

export default function AlertsPage() {
  // Update the page title
  useEffect(() => {
    document.title = "Alerts | CryptoMind";
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Price Alerts</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <p className="text-gray-600 dark:text-gray-300">
          This page will contain your cryptocurrency price alerts.
        </p>
      </div>
    </div>
  );
}
