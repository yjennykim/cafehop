import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="max-w-lg">
      <form onSubmit={handleSearch} className="flex items-center p-2">
        <input
          type="text"
          placeholder="Search for cafes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border-none focus:outline-none"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 ml-2">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
