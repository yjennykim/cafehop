import { useState, useEffect } from "react";
import React from "react";
import { useSearch } from "../context/SearchContext"; 
const FilterButton = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { handleSearch } = useSearch(); 

  const [hasOutlets, setHasOutlets] = useState(false);
  const [hasWifi, setHasWifi] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen((prev) => !prev);
  };

  const saveFilters = () => {
    const filters = {
      hasOutlets,
      hasWifi,
    };

    handleSearch(filters);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  useEffect(() => {
    console.log(`hasOutlets state updated: ${hasOutlets}`);
  }, [hasOutlets]);


  return (
    <div>
      <div className="flex">
        <button
          onClick={togglePanel}
          className="ml-auto 
          text-gray-900 

          font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Advanced Filters
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

          {/* Outlets Filter */}
          <div className="mt-4">
            <label className="block text-sm mb-2">OUTLETS</label>
            <input
              type="checkbox"
              checked={hasOutlets}
              onChange={() => {
                setHasOutlets(!hasOutlets)
              }}
              className="mr-2"
            />
            <span>Has Outlets</span>
          </div>

          {/* Seating Wifi */}
          <div className="mt-4">
            <label className="block text-sm mb-2">WIFI</label>
            <input
              type="checkbox"
              checked={hasWifi}
              onChange={() => setHasWifi(!hasWifi)}
              className="mr-2"
            />
            <span>Has Wifi</span>
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <button
              onClick={saveFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Filters
            </button>
          </div>

          {/* Close Panel Button */}
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

export default FilterButton;
