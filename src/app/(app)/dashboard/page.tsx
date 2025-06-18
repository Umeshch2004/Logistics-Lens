"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";
import { DollarSign, TrendingUp, Users, Archive, BarChart3, Package, ArrowRightLeft } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { FilterControls } from "@/components/shared/FilterControls";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { NetMovementModal } from "@/components/modals/NetMovementModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

// Placeholder data for charts
const AssetDistributionChart = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-foreground">Asset Distribution</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="aspect-[4/3] w-full bg-muted rounded-md flex items-center justify-center">
        <Image src="https://placehold.co/600x400.png" alt="Asset Distribution Chart Placeholder" data-ai-hint="pie chart" width={600} height={400} className="rounded-md" />
      </div>
      <p className="text-sm text-muted-foreground mt-2 text-center">Asset distribution by category (e.g., Vehicles, Weapons).</p>
    </CardContent>
  </Card>
);

const ActivityLogChart = () => (
 <Card>
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-foreground">Recent Activity</CardTitle>
    </CardHeader>
    <CardContent>
       <div className="aspect-[4/3] w-full bg-muted rounded-md flex items-center justify-center">
         <Image src="https://placehold.co/600x400.png" alt="Activity Log Chart Placeholder" data-ai-hint="line graph" width={600} height={400} className="rounded-md" />
      </div>
      <p className="text-sm text-muted-foreground mt-2 text-center">Trend of asset movements over the last 30 days.</p>
    </CardContent>
  </Card>
);


export default function DashboardPage() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [selectedBase, setSelectedBase] = React.useState<string | undefined>(undefined);
  const [selectedAssetType, setSelectedAssetType] = React.useState<string | undefined>(undefined);
  const [isNetMovementModalOpen, setIsNetMovementModalOpen] = React.useState(false);

  const handleClearFilters = () => {
    setDateRange(undefined);
    setSelectedBase(undefined);
    setSelectedAssetType(undefined);
    // Add logic to refetch data with cleared filters
  };

  // Placeholder data for metrics - replace with actual data fetching
  const metrics = {
    openingBalance: 1250000,
    closingBalance: 1575000,
    netMovement: 325000, // Purchases + Transfer In - Transfer Out
    assignedAssets: 450,
    expendedAssets: 120,
  };

  const netMovementDetails = {
    purchases: 200000,
    transferIn: 150000,
    transferOut: 25000,
  };

  return (
    <>
      <AppHeader pageTitle="Dashboard" />
      <main className="flex-1 p-6 space-y-6">
        <PageHeader 
          title="Overview"
          description="Key metrics and insights for asset management."
        />
        
        <FilterControls
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedBase={selectedBase}
          onBaseChange={setSelectedBase}
          selectedAssetType={selectedAssetType}
          onAssetTypeChange={setSelectedAssetType}
          onClearFilters={handleClearFilters}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <MetricCard 
            label="Opening Balance" 
            value={`$${metrics.openingBalance.toLocaleString()}`} 
            icon={DollarSign} 
          />
          <MetricCard 
            label="Closing Balance" 
            value={`$${metrics.closingBalance.toLocaleString()}`} 
            icon={DollarSign} 
            change={`+${(((metrics.closingBalance - metrics.openingBalance) / metrics.openingBalance) * 100).toFixed(1)}%`}
          />
          <MetricCard 
            label="Net Movement" 
            value={metrics.netMovement.toLocaleString()} 
            icon={ArrowRightLeft}
            clickable={true}
            action={() => setIsNetMovementModalOpen(true)}
          />
          <MetricCard 
            label="Assigned Assets" 
            value={metrics.assignedAssets.toLocaleString()} 
            icon={Users} 
          />
          <MetricCard 
            label="Expended Assets" 
            value={metrics.expendedAssets.toLocaleString()} 
            icon={Archive} 
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
           <AssetDistributionChart />
           <ActivityLogChart />
        </div>

        <NetMovementModal 
          isOpen={isNetMovementModalOpen}
          onClose={() => setIsNetMovementModalOpen(false)}
          data={netMovementDetails}
        />
      </main>
    </>
  );
}
