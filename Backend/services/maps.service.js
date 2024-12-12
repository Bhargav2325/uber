const axios = require("axios");
const fs = require("fs").promises;

// module.exports.getAddressCoordinate = async (address) => {
//   const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
//   const url = `https://maps.googleapis.com/maps/api/js?address=${encodeURIComponent(
//     address
//   )}&key=${apiKey}`;

//   try {
//     const response = await axios.get(url);
//     if (response.data.status === "OK") {
//       const location = response.data.results[0].geometry.location;
//       return {
//         ltd: location.lat,
//         lng: location.lng,
//       };
//     } else {
//       throw new Error("Unable to fetch Coordinate");
//     }
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

// module.exports.getDistanceTime = async (origin, destination) => {
//   if (!origin || !destination) {
//     throw new Error("Origin or destination are required");
//   }
//   const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
//   const url = `https://maps.googleapis.com/maps/api/js?units=metric&origins=${encodeURIComponent(
//     origin
//   )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

//   try {
//     const response = await axios.get(url);
//     if (response.data.status === "OK") {
//       if (response.data.rows[0].elements[0].status === "ZERO_RESULTS") {
//         throw new Error("No route found between the given locations");
//       }
//       return response.data.rows[0].elements[0];
//     } else {
//       throw new Error("Unable to fetch Distance and Time");
//     }
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

// Haversine formula to calculate distance between two points

module.exports.getAddressCoordinate = async (address) => {
  if (!address) {
    throw new Error("Address is required");
  }

  try {
    // Read the JSON file
    const data = await fs.readFile("place.json", "utf-8");
    const places = JSON.parse(data);

    // Find the address in the JSON data
    const place = places.find(
      (p) => p.place_name.toLowerCase() === address.toLowerCase()
    );

    if (!place) {
      throw new Error("Address not found in the JSON file");
    }

    // Return latitude and longitude
    return {
      lat: place.latitude,
      lng: place.longitude,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degree) => (degree * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin or destination are required");
  }

  try {
    // Read the JSON file containing place data
    const data = await fs.readFile("place.json", "utf-8");
    const places = JSON.parse(data);

    // Find origin and destination from the JSON data
    const originPlace = places.find((place) => place.place_name === origin);
    const destinationPlace = places.find(
      (place) => place.place_name === destination
    );

    if (!originPlace || !destinationPlace) {
      throw new Error("Origin or destination not found in the JSON file");
    }

    // Calculate distance using Haversine formula
    const distance = haversineDistance(
      originPlace.latitude,
      originPlace.longitude,
      destinationPlace.latitude,
      destinationPlace.longitude
    );

    // Estimate time based on an average speed (e.g., 60 km/h)
    const averageSpeed = 60; // in km/h
    const timeInHours = distance / averageSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);

    return {
      distance: {
        text: `${distance.toFixed(2)} km`,
        value: distance * 1000, // in meters
      },
      duration: {
        text: `${timeInMinutes} mins`,
        value: timeInMinutes * 60, // in seconds
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.getAutoCompleteSuggestion = async (input) => {
  if (!input) {
    throw new Error("Input is required");
  }

  try {
    // Read the JSON file
    const data = await fs.readFile("place.json", "utf-8");
    const places = JSON.parse(data);

    // Filter place names that include the input (case-insensitive)
    const suggestions = places
      .filter((place) =>
        place.place_name.toLowerCase().includes(input.toLowerCase())
      )
      .map((place) => ({
        place_name: place.place_name,
        latitude: place.latitude,
        longitude: place.longitude,
      }));

    return suggestions;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

// module.exports.getAutoCompleteSuggestion = async (input) => {
//   if (!input) {
//     throw new Error("Address is required");
//   }
//   const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
//   const url = `https://maps.googleapis.com/maps/api/js?input=${encodeURIComponent(
//     input
//   )}&types=(cities)&key=${apiKey}`;
//   try {
//     const response = await axios.get(url);
//     if (response.data.status === "OK") {
//       return response.data.predictions;
//     } else {
//       throw new Error("Unable to fetch Autocomplete Suggestion");
//     }
//   } catch (error) {
//     console.log(error.message);
//     throw error;
//   }
// };
