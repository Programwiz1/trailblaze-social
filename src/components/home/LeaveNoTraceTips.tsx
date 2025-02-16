
import { Footprints, Trash, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const tips = [
  {
    icon: Footprints,
    title: "Stay on Trail",
    description: "Protect fragile ecosystems by sticking to marked paths"
  },
  {
    icon: Trash,
    title: "Pack It Out",
    description: "Carry all trash with you, including biodegradable waste"
  },
  {
    icon: AlertTriangle,
    title: "Respect Wildlife",
    description: "Observe from a distance and never feed wild animals"
  }
];

const LeaveNoTraceTips = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {tips.map((tip) => (
        <Card key={tip.title} className="bg-nature-50 border-nature-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-nature-100 rounded-lg">
                <tip.icon className="w-6 h-6 text-nature-600" />
              </div>
              <div>
                <h3 className="font-semibold text-nature-800">{tip.title}</h3>
                <p className="text-nature-600 text-sm">{tip.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LeaveNoTraceTips;
