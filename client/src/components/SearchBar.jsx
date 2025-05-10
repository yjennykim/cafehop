import { useState } from "react";
import { useSearch } from "../context/SearchContext";

const SearchBar = ({ small = false }) => {
  const { handleSearch } = useSearch();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch({ query, location });
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`flex items-center space-x-2 ${
        small ? "" : "px-6 py-4 bg-white shadow"
      }`}
    >
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`border p-1 rounded text-sm ${
          small ? "w-24 md:w-32" : "w-1/2"
        }`}
      />
      <input
        type="text"
        placeholder="Location..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className={`border p-1 rounded text-sm ${
          small ? "w-24 md:w-32" : "w-1/3"
        }`}
      />
      <button
        type="submit"
        className={`bg-blue-600 text-white px-3 py-1 rounded text-sm ${
          small ? "hover:bg-blue-700" : ""
        }`}
      >
        Go
      </button>
    </form>
  );
};

export default SearchBar;
