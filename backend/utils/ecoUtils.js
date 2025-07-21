const axios = require("axios");

const getCarbonFootprint = async (weightInGrams, shippingDistanceKm) => {
  const response = await axios.post(
    "https://www.carboninterface.com/api/v1/estimates",
    {
      type: "shipping",
      weight_value: weightInGrams,
      weight_unit: "g",
      distance_value: shippingDistanceKm,
      distance_unit: "km",
      transport_method: "truck",
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.CARBON_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.attributes.carbon_kg * 1000; // in grams
};

const computeEcoScore = ({ isEcoCertified, materialType, weightInGrams, shippingDistanceKm }) => {
  let score = 0;

  if (isEcoCertified) score += 25;

  const materialScores = {
    bamboo: 25,
    recycled: 20,
    cotton: 15,
    plastic: 5,
    default: 10,
  };
  score += materialScores[materialType?.toLowerCase()] || materialScores.default;

  if (weightInGrams <= 500) score += 20;
  else if (weightInGrams <= 1000) score += 10;

  if (shippingDistanceKm <= 1000) score += 20;
  else if (shippingDistanceKm <= 2000) score += 10;

  return Math.min(score, 100);
};

const calculateEcoMetrics = async ({ isEcoCertified, materialType, weightInGrams, shippingDistanceKm }) => {
  const traditionalFootprint = await getCarbonFootprint(weightInGrams, shippingDistanceKm);
  const ecoFootprint = isEcoCertified ? traditionalFootprint * 0.7 : traditionalFootprint;
  const carbonSaved = traditionalFootprint - ecoFootprint;
  const ecoScore = computeEcoScore({ isEcoCertified, materialType, weightInGrams, shippingDistanceKm });

  return { traditionalFootprint, ecoFootprint, carbonSaved, ecoScore };
};

module.exports = { calculateEcoMetrics };
