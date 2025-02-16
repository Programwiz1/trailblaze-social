
import { Car, Bus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CarbonCalculatorProps {
  distance: string;
  transportMode: string;
  onDistanceChange: (value: string) => void;
  onTransportModeChange: (value: string) => void;
}

const CarbonCalculator = ({
  distance,
  transportMode,
  onDistanceChange,
  onTransportModeChange
}: CarbonCalculatorProps) => {
  const calculateCarbonFootprint = (distance: string, mode: string) => {
    const dist = parseFloat(distance);
    if (isNaN(dist)) return 0;
    
    const factors = {
      car: 0.404,
      carpool: 0.202,
      bus: 0.14,
      train: 0.14
    };
    
    return (dist * (factors[mode as keyof typeof factors] || 0)).toFixed(2);
  };

  return (
    <Card className="mb-8 bg-gradient-to-r from-nature-50 to-white border-nature-200">
      <CardHeader>
        <CardTitle className="text-nature-800">Travel Impact Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distance to Trail (miles)
            </label>
            <input
              type="number"
              value={distance}
              onChange={(e) => onDistanceChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter distance"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transportation Mode
            </label>
            <Select onValueChange={onTransportModeChange} value={transportMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select transport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">
                  <span className="flex items-center">
                    <Car className="w-4 h-4 mr-2" />
                    Drive Alone
                  </span>
                </SelectItem>
                <SelectItem value="carpool">
                  <span className="flex items-center">
                    <Car className="w-4 h-4 mr-2" />
                    Carpool
                  </span>
                </SelectItem>
                <SelectItem value="bus">
                  <span className="flex items-center">
                    <Bus className="w-4 h-4 mr-2" />
                    Public Transit
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <div className="w-full">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Carbon Footprint
              </div>
              <div className="bg-gray-100 p-2 rounded-md">
                {distance && transportMode ? (
                  <span className="text-lg font-semibold">
                    {calculateCarbonFootprint(distance, transportMode)} kg CO2
                  </span>
                ) : (
                  <span className="text-gray-500">
                    Enter details to calculate
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarbonCalculator;
