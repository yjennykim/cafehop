import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CafeDetails = () => {
  const { id } = useParams();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCafeDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/v1/get-cafe/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch cafe details");
        }
        const data = await response.json();
        setCafe(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCafeDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!cafe) return <p>Cafe not found</p>;

  return (
    <div className="container mx-auto">
      <div className="p-8">
        <h1 className="text-3xl font-bold">{cafe.name}</h1>
        <p className="text-gray-600">{cafe.address}</p>
        <p className="text-yellow-500">Rating: {cafe.rating} ⭐</p>
        <p className="text-gray-500">{cafe.is_closed ? "Closed" : "Open"}</p>
        <p className="text-gray-700">Phone: {cafe.display_phone}</p>

        {cafe.cafe_hop_attributes && (
          <div className="mt-4">
            <p>Wifi: {cafe.cafe_hop_attributes.wifi ? "✅ Yes" : "❌ No"}</p>
            <p>Outlets: {cafe.cafe_hop_attributes.outlets ? "✅ Yes" : "❌ No"}</p>
            <p>Spaciousness: {cafe.cafe_hop_attributes.spacious_level}/5</p>
            <p>Comfort: {cafe.cafe_hop_attributes.comfort_level}/5</p>
            <p>Seating: {cafe.cafe_hop_attributes.seating_level}/5</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CafeDetails;
