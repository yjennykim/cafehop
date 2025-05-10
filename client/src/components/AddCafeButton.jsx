import { useState } from "react";
import React from "react";

const AddCafeButton = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen((prev) => !prev);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <div>
      <div className="flex">
        <button
          onClick={togglePanel}
          className="ml-auto text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Add New Cafe
        </button>
      </div>

      <div
        className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Filter Options</h2>
          <p>APPLIED FILTERS</p>

          <div>
            <label className="block text-sm mb-2">LOCATION</label>
          </div>
          <div>
            <label className="block text-sm mb-2">OUTLETS</label>
          </div>
          <div>
            <label className="block text-sm mb-2">SEATING</label>
          </div>
          <div>
            <label className="block text-sm mb-2">SPACIOUS</label>
          </div>

          <button
            onClick={closePanel}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCafeButton;
