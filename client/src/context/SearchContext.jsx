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

  const handleSearch = ({ query, location, hasWifi, hasOutlets, hasSeating, isSpacious }) => {
    const filtered = cafes.filter((cafe) => {
        console.table(cafe.cafe_hop_attributes);
      const nameMatch = query ? cafe.name.toLowerCase().includes(query.toLowerCase()) : true;
      const locationMatch = location ? cafe.address.toLowerCase().includes(location.toLowerCase()) : true;
        
      const cafe_attributes = cafe.cafe_hop_attributes
      const wifiMatch = hasWifi ? cafe_attributes.wifi === true : true;  
      const outletsMatch = hasOutlets ? cafe_attributes.outlets === true : true; 

      console.log(`
        nameMatch=${nameMatch},
        locationMatch=${locationMatch},
        wifiMatch=${wifiMatch},
        outletsMatch=${outletsMatch},
    `)
  
      return (
        nameMatch &&
        locationMatch &&
        wifiMatch &&
        outletsMatch
      );
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
