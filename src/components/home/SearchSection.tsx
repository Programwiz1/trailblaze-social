
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SearchSectionProps {
  searchQuery: string;
  isSearching: boolean;
  isLoaded: boolean;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
}

const SearchSection = ({
  searchQuery,
  isSearching,
  isLoaded,
  onSearchQueryChange,
  onSearch
}: SearchSectionProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-nature-800">Find Your Perfect Trail</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-nature-500" />
            <Input
              placeholder="Enter any preferences"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={onSearch}
            disabled={isSearching || !searchQuery.trim() || !isLoaded}
            className="bg-nature-600 hover:bg-nature-700"
          >
            {isSearching ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </div>
            ) : (
              "Find Trails"
            )}
          </Button>
        </div>

        {isSearching && (
          <div className="mt-4 p-4 bg-nature-50 rounded-lg">
            <div className="flex items-center justify-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-nature-600" />
              <p className="text-nature-600">Searching for trails near you...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchSection;
