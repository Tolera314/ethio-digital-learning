import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Filter, BookOpen, Users, Video } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

export interface SearchFilters {
  categories: string[];
  contentTypes: string[];
  difficulty: string[];
}

const defaultFilters: SearchFilters = {
  categories: [],
  contentTypes: [],
  difficulty: [],
};

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search for books, courses, or content...",
  showFilters = true,
  className = "",
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const categories = ['Technology', 'Psychology', 'Business', 'Literature', 'Science', 'History'];
  const contentTypes = ['Books', 'Videos', 'Sessions', 'Documents'];
  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query, filters);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, filters, onSearch]);

  const handleFilterChange = (filterType: keyof SearchFilters, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked 
        ? [...prev[filterType], value]
        : prev[filterType].filter(item => item !== value)
    }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters = Object.values(filters).some(filterArray => filterArray.length > 0);

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="search"
            placeholder={placeholder}
            className="pl-10 pr-10 bg-card/50 border-border/50 backdrop-blur-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {showFilters && (
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`bg-card/50 border-border/50 backdrop-blur-sm ${hasActiveFilters ? 'bg-primary/20 border-primary' : ''}`}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear all
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Categories</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={filters.categories.includes(category)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('categories', category, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`category-${category}`}
                            className="text-sm cursor-pointer"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Content Type</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {contentTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={filters.contentTypes.includes(type)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('contentTypes', type, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`type-${type}`}
                            className="text-sm cursor-pointer flex items-center"
                          >
                            {type === 'Books' && <BookOpen className="w-3 h-3 mr-1" />}
                            {type === 'Videos' && <Video className="w-3 h-3 mr-1" />}
                            {type === 'Sessions' && <Users className="w-3 h-3 mr-1" />}
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Difficulty</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {difficultyLevels.map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={`difficulty-${level}`}
                            checked={filters.difficulty.includes(level)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('difficulty', level, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`difficulty-${level}`}
                            className="text-sm cursor-pointer"
                          >
                            {level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.categories.map(category => (
            <span key={category} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
              {category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('categories', category, false)}
              />
            </span>
          ))}
          {filters.contentTypes.map(type => (
            <span key={type} className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/20 text-secondary-foreground text-xs rounded-full">
              {type}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('contentTypes', type, false)}
              />
            </span>
          ))}
          {filters.difficulty.map(level => (
            <span key={level} className="inline-flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded-full">
              {level}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('difficulty', level, false)}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
};