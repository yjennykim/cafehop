import React from "react";
import SearchBar from "./SearchBar";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-gray-800 mr-6 whitespace-nowrap">
          Cafehop
        </div>

        <div className="flex-1 mx-4">
          <SearchBar small />
        </div>

        <div className="flex items-center space-x-4 whitespace-nowrap">
          <button className="text-gray-700 hover:text-blue-600 transition">
            Create Review
          </button>
          <button className="text-gray-700 hover:text-blue-600 transition">
            Login
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
