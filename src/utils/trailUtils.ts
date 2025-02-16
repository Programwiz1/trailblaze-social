
export const getWeatherIcon = (rank: number) => {
  if (rank >= 8) return "Excellent";
  if (rank >= 6) return "Good";
  if (rank >= 4) return "Fair";
  return "Poor";
};

export const getDifficulty = (popularityRank: number): "easy" | "moderate" | "hard" => {
  if (popularityRank >= 8) return "easy";
  if (popularityRank >= 5) return "moderate";
  return "hard";
};

export const formatDistance = (distance: number): string => {
  const hours = Math.floor(distance / 3);
  const minutes = Math.round((distance % 3) * 20);
  return `${hours}h ${minutes}m`;
};

export const transformServerData = (data: Array<[string, number, number, number]> | null) => {
  if (!data || !Array.isArray(data)) {
    console.warn('Invalid or missing data received from server');
    return [];
  }

  console.log('Transforming server data:', data); // Debug log

  const transformed = data.map((location, index) => {
    // Debug log for each location
    console.log('Processing location:', location);
    
    const [name, weatherRank, popularityRank, distanceValue] = location;
    
    return {
      id: `server-${index}`,
      name: name,
      image: `https://images.unsplash.com/photo-${1464822759023 + index}-fed622ff2c3b`,
      difficulty: getDifficulty(popularityRank),
      rating: Math.min(5, (popularityRank / 2) + 2.5), // Convert popularity to a 0-5 rating
      distance: distanceValue,
      time: formatDistance(distanceValue),
      status: weatherRank >= 6 ? "open" : weatherRank >= 4 ? "warning" : "closed",
      alert: weatherRank < 6 ? `Weather conditions: ${getWeatherIcon(weatherRank)}` : null
    };
  });

  console.log('Transformed data:', transformed); // Debug log
  return transformed;
};
