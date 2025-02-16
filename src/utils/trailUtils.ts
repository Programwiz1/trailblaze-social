
import { v4 as uuidv4 } from 'uuid';

export const getWeatherIcon = (rank: number) => {
  if (rank >= 8) return "Excellent";
  if (rank >= 6) return "Good";
  if (rank >= 4) return "Fair";
  return "Poor";
};

export const getDifficulty = (popularityRank: number): "easy" | "moderate" | "hard" => {
  if (popularityRank >= 0.9) return "easy";
  if (popularityRank >= 0.85) return "moderate";
  return "hard";
};

export const formatDistance = (distance: number): string => {
  const walkingSpeed = 4; // km/h
  const totalHours = distance / walkingSpeed;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  return `${hours}h ${minutes}m`;
};

type LocationTuple = [string, number, number, number];

export const transformServerData = (data: LocationTuple[] | null) => {
  if (!data || !Array.isArray(data)) {
    console.warn('Invalid or missing data received from server');
    return [];
  }

  console.log('Raw server data:', data);

  const natureImages = [
    "1464822759023-fed622ff2c3b",
    "1483728642387-6c3bdd6c93e5",
    "1501555088652-021faa106b9b",
    "1552083375-142875a901a1",
    "1586500036033-e5823505b726",
    "1493246507139-91e8fad9978e",
    "1540390769625-2fc3f8b1d50c",
    "1472213984618-c79aaec7fef0",
    "1444090542259-0af8fa96557e",
    "1505765050516-f72dcac9c60e",
    "1439853949127-fa647821eba0",
    "1545389336-cf090694435e",
    "1518021964703-4b2030f03085",
    "1504280390367-361c6d9f38f4",
    "1526772662000-3f88f10405ff"
  ];

  try {
    const transformed = data.map((item) => {
      const [name, weatherRank, popularityRank, distanceValue] = item;

      if (!name || typeof weatherRank !== 'number' || typeof popularityRank !== 'number' || typeof distanceValue !== 'number') {
        console.warn('Invalid data values:', { name, weatherRank, popularityRank, distanceValue });
        return null;
      }

      // Generate a fixed UUID based on the trail name to maintain consistency
      const nameBuffer = Buffer.from(name);
      const id = uuidv4({ random: nameBuffer });

      return {
        id,
        name,
        image: `https://images.unsplash.com/photo-${natureImages[nameBuffer[0] % natureImages.length]}`,
        difficulty: getDifficulty(popularityRank),
        rating: Math.min(5, popularityRank * 5),
        distance: Number(distanceValue.toFixed(1)),
        time: formatDistance(distanceValue),
        status: weatherRank >= 10 ? "open" : weatherRank >= 8 ? "warning" : "closed",
        alert: weatherRank < 10 ? `Weather conditions: ${getWeatherIcon(weatherRank)}` : null
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);

    console.log('Transformed data:', transformed);
    return transformed;
  } catch (error) {
    console.error('Error transforming server data:', error);
    return [];
  }
};
