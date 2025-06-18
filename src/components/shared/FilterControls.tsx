"use client";

import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { BASES, ASSET_CATEGORIES } from "@/lib/constants"; // Using ASSET_CATEGORIES for broader filtering
import { X } from "lucide-react";

interface FilterControlsProps {
  dateRange?: DateRange;
  onDateRangeChange: (dateRange?: DateRange) => void;
  selectedBase?: string;
  onBaseChange: (base?: string) => void;
  selectedAssetType?: string;
  onAssetTypeChange: (assetType?: string) => void;
  onClearFilters: () => void;
  showBaseFilter?: boolean;
  showAssetTypeFilter?: boolean;
}

export function FilterControls({
  dateRange,
  onDateRangeChange,
  selectedBase,
  onBaseChange,
  selectedAssetType,
  onAssetTypeChange,
  onClearFilters,
  showBaseFilter = true,
  showAssetTypeFilter = true,
}: FilterControlsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:items-end xl:gap-3">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="date-range" className="mb-1 block text-sm font-medium text-muted-foreground">Date Range</label>
        <DateRangePicker date={dateRange} onDateChange={onDateRangeChange} />
      </div>

      {showBaseFilter && (
        <div className="flex-1 min-w-[180px]">
          <label htmlFor="base-filter" className="mb-1 block text-sm font-medium text-muted-foreground">Base</label>
          <Select value={selectedBase} onValueChange={onBaseChange}>
            <SelectTrigger id="base-filter">
              <SelectValue placeholder="All Bases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bases</SelectItem>
              {BASES.map((base) => (
                <SelectItem key={base} value={base}>
                  {base}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showAssetTypeFilter && (
         <div className="flex-1 min-w-[180px]">
          <label htmlFor="asset-type-filter" className="mb-1 block text-sm font-medium text-muted-foreground">Asset Category</label>
          <Select value={selectedAssetType} onValueChange={onAssetTypeChange}>
            <SelectTrigger id="asset-type-filter">
              <SelectValue placeholder="All Asset Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Asset Categories</SelectItem>
              {ASSET_CATEGORIES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
     
      <Button onClick={onClearFilters} variant="outline" className="xl:self-end h-10">
        <X className="mr-2 h-4 w-4" />
        Clear Filters
      </Button>
    </div>
  );
}
