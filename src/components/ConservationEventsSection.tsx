
import { Calendar, ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const conservationEvents = [
  {
    title: "Wildlife Photography Workshop",
    date: "Next Saturday, 10 AM",
    location: "Visitor Center",
    description: "Learn how to photograph wildlife responsibly with professional nature photographer Sarah Johnson."
  },
  {
    title: "Native Plant Restoration",
    date: "Sunday, May 15, 9 AM",
    location: "East Ridge Trail",
    description: "Help us restore native plant species along the trail. Tools and guidance provided."
  },
  {
    title: "Bird Migration Webinar",
    date: "Thursday, 7 PM",
    location: "Online",
    description: "Join our expert panel discussing the impact of climate change on bird migration patterns."
  }
];

export function ConservationEventsSection() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-nature-700 mb-4">Conservation Events</h2>
      <div className="space-y-4">
        {conservationEvents.map((event, index) => (
          <Card key={index} className="text-left bg-gradient-to-r from-nature-50 to-white border-nature-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-nature-800">{event.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center space-x-2 mt-1 text-nature-600">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1 text-nature-600">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-nature-600 hover:text-nature-800 hover:bg-nature-100"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Register
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-nature-700">{event.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
