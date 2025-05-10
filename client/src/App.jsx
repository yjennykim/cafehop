import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import Feed from "./pages/Feed";
import CafeDetails from "./pages/CafeDetails";

const App = () => {
  return (
    <SearchProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/cafe/:id" element={<CafeDetails />} />
          </Routes>
        </div>
      </Router>
    </SearchProvider>
  );
};

export default App;
