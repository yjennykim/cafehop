import { createContext, useContext, useEffect, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [cafes, setCafes] = useState([]);
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [location, setLocation] = useState("Anywhere");

  const toTitleCase = (str) =>
    str.toLowerCase().replace(/\b(\w)/g, (match) => match.toUpperCase());

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/v1/get-cafes");
        const data = await response.json();
        setCafes(data);
        setFilteredCafes(data);
      } catch (err) {
        console.error("Failed to fetch cafes", err);
      }
    };
    fetchCafes();
  }, []);

  const handleSearch = ({ query, location }) => {
    setLocation(toTitleCase(location));

    const filtered = cafes.filter((cafe) => {
      const nameMatch = cafe.name.toLowerCase().includes(query.toLowerCase());
      const addressMatch = cafe.address
        .toLowerCase()
        .includes(location.toLowerCase());
      return nameMatch && addressMatch;
    });

    setFilteredCafes(filtered);
  };

  return (
    <SearchContext.Provider
      value={{
        cafes,
        filteredCafes,
        location,
        handleSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
