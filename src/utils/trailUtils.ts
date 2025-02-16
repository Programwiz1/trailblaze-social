
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

export const transformServerData = (data: [string, number, number, number][]) => {
  return data.map((location, index) => ({
    id: `server-${index}`,
    name: location[0],
    image: `https://source.unsplash.com/featured/?nature,trail&sig=${index}`,
    difficulty: getDifficulty(location[2]),
    rating: location[2],
    distance: location[3],
    time: formatDistance(location[3]),
    status: location[1] >= 6 ? "open" : location[1] >= 4 ? "warning" : "closed",
    alert: location[1] < 6 ? `Weather conditions: ${getWeatherIcon(location[1])}` : null
  }));
};
