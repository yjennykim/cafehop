import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "./components/Feed";
import CafeDetails from "./components/CafeDetails";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/cafe/:id" element={<CafeDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
