
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterSidebarProps {
  genres: string[];
  selectedGenres: string[];
  onGenreChange: (genre: string, checked: boolean) => void;
  onSelectAll: () => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  genres,
  selectedGenres,
  onGenreChange,
  onSelectAll,
  onReset,
}) => {
  const allSelected = selectedGenres.length === 0;

  return (
    <Card className="bg-white/10 backdrop-blur-md border-2 border-white/20 sticky top-4">
      <CardHeader className="pb-4">
        <CardTitle className="text-white font-bold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Genres
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* All option */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="all-genres"
            checked={allSelected}
            onCheckedChange={() => onSelectAll()}
            className="border-white/50 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
          />
          <label
            htmlFor="all-genres"
            className="text-white font-semibold cursor-pointer"
          >
            All
          </label>
        </div>

        {/* Individual genres */}
        {genres.map((genre) => (
          <div key={genre} className="flex items-center space-x-2">
            <Checkbox
              id={`genre-${genre}`}
              checked={selectedGenres.includes(genre)}
              onCheckedChange={(checked) => onGenreChange(genre, checked as boolean)}
              className="border-white/50 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
            />
            <label
              htmlFor={`genre-${genre}`}
              className="text-white text-sm cursor-pointer"
            >
              {genre}
            </label>
          </div>
        ))}

        {/* Reset button */}
        <Button
          onClick={onReset}
          variant="outline"
          size="sm"
          className="w-full mt-4 bg-transparent border-white/50 text-white hover:bg-white/10"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </CardContent>
    </Card>
  );
};
