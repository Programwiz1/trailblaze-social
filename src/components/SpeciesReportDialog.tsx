
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SpeciesReport {
  image: File | null;
  location: string;
  notes: string;
  identifiedSpecies?: string;
  confidence?: number;
  conservationStatus?: {
    status: string;
    description: string;
    color: string;
  };
}

interface SpeciesReportDialogProps {
  speciesReport: SpeciesReport;
  isIdentifying: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLocationChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

export function SpeciesReportDialog({
  speciesReport,
  isIdentifying,
  onImageUpload,
  onSubmit,
  onLocationChange,
  onNotesChange,
}: SpeciesReportDialogProps) {
  return (
    <DialogContent className="bg-gradient-to-b from-nature-50 to-white">
      <DialogHeader>
        <DialogTitle className="text-nature-800">Report Wildlife Sighting</DialogTitle>
        <DialogDescription className="text-nature-600">
          Help us track and protect local wildlife by reporting your sightings.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-nature-700">Photo</Label>
          <div className="border-2 border-dashed border-nature-200 rounded-lg p-4 text-center bg-white">
            {speciesReport.image ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(speciesReport.image)}
                  alt="Species preview"
                  className="max-h-48 mx-auto rounded"
                />
                {speciesReport.identifiedSpecies && (
                  <div className={`mt-2 p-3 rounded-lg ${speciesReport.conservationStatus?.color || 'bg-nature-50'}`}>
                    <div className="text-sm font-medium text-nature-800">
                      Identified as: {speciesReport.identifiedSpecies}
                      <br />
                      Confidence: {(speciesReport.confidence! * 100).toFixed(1)}%
                    </div>
                    {speciesReport.conservationStatus && (
                      <div className="mt-2 text-sm">
                        <div className="font-medium text-nature-800">Conservation Status: {speciesReport.conservationStatus.status}</div>
                        <div className="text-nature-600">{speciesReport.conservationStatus.description}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-nature-500">
                <Camera className="w-8 h-8 mx-auto mb-2" />
                <p>Upload a photo for AI identification</p>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="mt-2 text-nature-600 file:bg-nature-100 file:text-nature-700 file:border-nature-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-nature-700">Location</Label>
          <Input
            placeholder="e.g., North Ridge Trail, mile marker 3"
            value={speciesReport.location}
            onChange={e => onLocationChange(e.target.value)}
            className="border-nature-200 focus:ring-nature-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-nature-700">Notes</Label>
          <Textarea
            placeholder="Add any additional observations..."
            value={speciesReport.notes}
            onChange={e => onNotesChange(e.target.value)}
            className="border-nature-200 focus:ring-nature-500"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-nature-600 hover:bg-nature-700 text-white" 
          disabled={isIdentifying}
        >
          {isIdentifying ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Identifying Species...
            </>
          ) : (
            "Submit Report"
          )}
        </Button>
      </form>
    </DialogContent>
  );
}
