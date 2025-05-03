import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ query: searchTerm, location });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-3 bg-white p-3 rounded shadow"
      >
        {/* Main search */}
        <input
          type="text"
          placeholder="Search for cafes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {/* Divider */}
        <div className="h-6 border-l border-gray-300"></div>

        {/* Location filter */}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-48 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
