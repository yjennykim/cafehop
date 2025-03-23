import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar"; 
import CafeCard from "./CafeCard";
import FilterButton from "./FilterButton";

const Feed = () => {
  const [cafes, setCafes] = useState([]); // all cafes from the API
  const [filteredCafes, setFilteredCafes] = useState([]);  // cafes after filtering based on search term
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/v1/get-cafes");
        const data = await response.json();
        setCafes(data); 
        setFilteredCafes(data);
      } catch (error) {
        console.error("Error fetching cafes:", error);
      }
    };

    fetchCafes();
  }, []);

  // filter cafes based on search term
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);

    const filtered = cafes.filter((cafe) =>
      cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cafe.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCafes(filtered);
  };

  return (
    <div className="container mx-auto">
      <SearchBar onSearch={handleSearch} />

      <div className="flex items-end py-5">
        <h1 className="text-4xl leading-none">Seattle Cafehop</h1>
        <p className="text-xs ml-2">[{filteredCafes.length}]</p>
      </div>

      <p>Discover the Best Cafes in Seattle for Work and Productivity - Beyond Just Coffee</p>
      <FilterButton />
      <hr className="mt-3"/>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {filteredCafes.length > 0 ? (
          filteredCafes.map((cafe) => (
            <CafeCard key={cafe.id} cafe={cafe} />
          ))
        ) : (
          <p className="text-center text-gray-500">No cafes found</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
