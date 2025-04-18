import React from "react";

const CafeCard = ({ cafe }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      {/* <img
        src={cafe.yelp_url ? cafe.yelp_url : "https://via.placeholder.com/300"}
        alt={cafe.name}
        className="w-full h-48 object-cover"
      /> */}
      <div className="p-4">
        <h2 className="text-xl font-bold">{cafe.name}</h2>
        <p className="text-gray-600">{cafe.address}</p>
        <p className="text-yellow-500">Rating: {cafe.rating} ⭐</p>
        <p className="text-gray-500">{cafe.is_closed ? "Closed" : "Open"}</p>
        <p className="text-gray-700">Phone: {cafe.display_phone}</p>

        {cafe.cafe_hop_attributes && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Wifi: {cafe.cafe_hop_attributes.wifi ? "✅ Yes" : "❌ No"}
            </p>
            <p className="text-sm text-gray-500">
              Outlets: {cafe.cafe_hop_attributes.outlets ? "✅ Yes" : "❌ No"}
            </p>
            <p className="text-sm text-gray-500">
              Spaciousness: {cafe.cafe_hop_attributes.spacious_level}/5
            </p>
            <p className="text-sm text-gray-500">
              Comfort: {cafe.cafe_hop_attributes.comfort_level}/5
            </p>
            <p className="text-sm text-gray-500">
              Seating: {cafe.cafe_hop_attributes.seating_level}/5
            </p>
          </div>
        )}

        <a
          href={cafe.yelp_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-blue-500 hover:underline"
        >
          View on Yelp
        </a>
      </div>
    </div>
  );
};

export default CafeCard;
