
import { Bird, TreePine, Leaf } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ecoFacts = [
  {
    title: "Climate Impact on Local Birds",
    description: "Rising temperatures are causing earlier spring migrations, affecting breeding patterns of local songbirds.",
    icon: Bird
  },
  {
    title: "Forest Ecosystem Changes",
    description: "Warmer winters are allowing pine beetles to survive longer, threatening our conifer forests.",
    icon: TreePine
  },
  {
    title: "Native Plant Adaptations",
    description: "Local wildflowers are blooming an average of 7 days earlier than they did 50 years ago.",
    icon: Leaf
  }
];

export function EcoFactsSection() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Today's Eco Facts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ecoFacts.map((fact, index) => (
          <Card key={index} className="bg-green-50">
            <CardHeader className="space-y-1">
              <div className="flex items-center space-x-2">
                <fact.icon className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg text-green-800">{fact.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700">{fact.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
