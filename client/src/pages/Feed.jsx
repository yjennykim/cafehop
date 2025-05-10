import React from "react";
import { useSearch } from "../context/SearchContext";
import CafeCard from "../components/CafeCard";
import FilterButton from "../components/FilterButton";
import CafeMap from "../components/CafeMap";
import "../style/feed.css";

const Feed = () => {
  const { filteredCafes, location } = useSearch();

  return (
    <div className="container mx-auto my-5">
      <CafeMap cafes={filteredCafes} />

      <div className="flex items-end py-5">
        <h1 className="text-4xl leading-none">Cafehop [{location}]</h1>
        <p className="text-xs ml-2">[{filteredCafes.length}]</p>
      </div>

      <p>Discover the Best Cafes for Work and Productivity - Beyond Just Coffee</p>
      <hr className="mt-3" />
      <FilterButton />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {filteredCafes.length > 0 ? (
          filteredCafes.map((cafe, index) => (
            <CafeCard key={index} cafe={cafe} />
          ))
        ) : (
          <p className="text-center text-gray-500">No cafes found</p>
        )}
      </div>
    </div>
  );
};

export default Feed;