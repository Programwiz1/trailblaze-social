import { useState } from "react";
import { useParams } from "react-router-dom";
import { Bird, Fish, Mountain, Trees, AlertTriangle, Navigation, Footprints, Binoculars, Flame, CloudRain } from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for initial implementation
const trailsData = {
  "1": {
    name: "Emerald Lake Trail",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    difficulty: "moderate",
    rating: 4.8,
    distance: 3.2,
    time: "2h 30m",
    description: "A beautiful trail winding through diverse ecosystems, from wetlands to alpine meadows.",
    alerts: [
      {
        type: "warning",
        icon: AlertTriangle,
        title: "Nesting Season - Partial Closure",
        description: "Some sections of the trail are closed to protect nesting birds.",
        severity: "medium"
      }
    ],
    habitats: [
      {
        type: "Wetland",
        icon: Fish,
        description: "Home to threatened amphibians and unique aquatic species",
        species: ["Spotted Salamander", "American Bullfrog", "Wood Frog"],
        threats: ["Habitat loss due to climate change", "Water pollution"]
      },
      {
        type: "Alpine Meadow",
        icon: Mountain,
        description: "High-altitude flowering meadows supporting diverse wildlife",
        species: ["Mountain Goat", "Pika", "Alpine Butterflies"],
        threats: ["Rising temperatures", "Invasive plant species"]
      },
      {
        type: "Forest",
        icon: Trees,
        description: "Mixed coniferous forest with old-growth trees",
        species: ["Northern Spotted Owl", "Red Fox", "Black Bear"],
        threats: ["Deforestation", "Forest fires"]
      }
    ],
    recommendations: [
      {
        icon: Footprints,
        title: "Stay on Trail",
        description: "Protect sensitive habitats by staying on marked paths"
      },
      {
        icon: Binoculars,
        title: "Wildlife Viewing",
        description: "Maintain safe distances from wildlife and never feed animals"
      },
      {
        icon: Navigation,
        title: "Navigation",
        description: "Download offline maps and carry a compass"
      }
    ]
  },
  "2": {
    name: "Crystal Mountain Peak",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5",
    difficulty: "hard",
    rating: 4.9,
    distance: 5.6,
    time: "4h 15m",
    description: "Challenging alpine trail with spectacular mountain views.",
    alerts: [
      {
        type: "wildfire",
        icon: Flame,
        title: "Trail Closed - Wildfire Risk",
        description: "Trail closed due to extreme fire danger in the area.",
        severity: "high"
      }
    ],
    habitats: [
      {
        type: "Alpine",
        icon: Mountain,
        description: "Rugged alpine terrain with sparse vegetation",
        species: ["Ptarmigan", "Bighorn Sheep", "Snowshoe Hare"],
        threats: ["Climate change", "Overgrazing"]
      },
      {
        type: "Subalpine Forest",
        icon: Trees,
        description: "Dwarf trees and hardy shrubs adapted to high elevations",
        species: ["Clark's Nutcracker", "Pine Marten", "Gray Wolf"],
        threats: ["Deforestation", "Insects"]
      }
    ],
    recommendations: [
      {
        icon: Footprints,
        title: "Check Weather",
        description: "Alpine weather can change rapidly, check the forecast"
      },
      {
        icon: Binoculars,
        title: "Avalanche Safety",
        description: "Be aware of avalanche risks in winter"
      },
      {
        icon: Navigation,
        title: "Route Finding",
        description: "Carry a map and compass, trail can be hard to follow"
      }
    ]
  },
  "3": {
    name: "Riverside Nature Walk",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b",
    difficulty: "easy",
    rating: 4.5,
    distance: 1.8,
    time: "1h 15m",
    description: "Easy riverside trail perfect for nature observation.",
    alerts: [],
    habitats: [
      {
        type: "Riparian",
        icon: Fish,
        description: "Lush vegetation along the riverbank",
        species: ["River Otter", "Great Blue Heron", "Rainbow Trout"],
        threats: ["Pollution", "Habitat destruction"]
      },
      {
        type: "Grassland",
        icon: Mountain,
        description: "Open fields with wildflowers and grasses",
        species: ["Meadow Vole", "American Kestrel", "Monarch Butterfly"],
        threats: ["Development", "Agriculture"]
      }
    ],
    recommendations: [
      {
        icon: Footprints,
        title: "Stay on Trail",
        description: "Protect sensitive habitats by staying on marked paths"
      },
      {
        icon: Binoculars,
        title: "Bird Watching",
        description: "Bring binoculars to spot diverse bird species"
      },
      {
        icon: Navigation,
        title: "Easy Access",
        description: "Trail is well-maintained and easy to navigate"
      }
    ]
  }
};

const TrailDetail = () => {
  const { id } = useParams();
  const [activeHabitat, setActiveHabitat] = useState<number>(0);
  
  const trail = trailsData[id as keyof typeof trailsData];
  
  if (!trail) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <h1 className="text-2xl font-bold text-gray-900">Trail not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="relative h-96 rounded-xl overflow-hidden mb-8">
          <img
            src={trail.image}
            alt={trail.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-2">{trail.name}</h1>
            <div className="flex items-center space-x-4 text-white">
              <span>{trail.distance} miles</span>
              <span>•</span>
              <span>{trail.difficulty}</span>
              <span>•</span>
              <span>{trail.time}</span>
            </div>
          </div>
        </div>

        {trail.alerts && trail.alerts.length > 0 && (
          <div className="mb-8">
            {trail.alerts.map((alert, index) => (
              <Alert 
                key={index} 
                variant={alert.severity === "high" ? "destructive" : "default"}
                className="mb-4"
              >
                <alert.icon className="h-4 w-4" />
                <AlertTitle className="flex items-center gap-2">
                  {alert.title}
                </AlertTitle>
                <AlertDescription>
                  {alert.description}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Habitat Zones & Wildlife</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trail.habitats.map((habitat, index) => (
                    <div
                      key={habitat.type}
                      className={`p-4 rounded-lg transition-colors ${
                        index === activeHabitat
                          ? "bg-nature-50 border border-nature-200"
                          : "bg-white border border-gray-100 hover:bg-gray-50 cursor-pointer"
                      }`}
                      onClick={() => setActiveHabitat(index)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-nature-100 rounded-lg">
                          <habitat.icon className="w-6 h-6 text-nature-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">
                            {habitat.type}
                          </h3>
                          <p className="text-gray-600 mb-3">{habitat.description}</p>
                          
                          <div className="mb-3">
                            <h4 className="font-medium mb-2">Notable Species:</h4>
                            <div className="flex flex-wrap gap-2">
                              {habitat.species.map((species) => (
                                <span
                                  key={species}
                                  className="px-2 py-1 bg-nature-50 text-nature-700 rounded-full text-sm"
                                >
                                  {species}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2 flex items-center">
                              <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                              Climate Threats:
                            </h4>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              {habitat.threats.map((threat) => (
                                <li key={threat}>{threat}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Hiking Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trail.recommendations.map((rec) => (
                    <TooltipProvider key={rec.title}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="p-2 bg-nature-100 rounded-lg">
                              <rec.icon className="w-5 h-5 text-nature-600" />
                            </div>
                            <div className="text-left">
                              <h4 className="font-medium">{rec.title}</h4>
                              <p className="text-sm text-gray-600">
                                {rec.description}
                              </p>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click for more details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrailDetail;
