"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";
import { DollarSign, ArrowRightLeft, Users, Archive } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { FilterControls } from "@/components/shared/FilterControls";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { NetMovementModal } from "@/components/modals/NetMovementModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Data for charts
const pieChartData = [
  { name: "Vehicles", value: 250, color: "hsl(var(--chart-1))" },
  { name: "Weapons", value: 480, color: "hsl(var(--chart-2))" },
  { name: "Ammunition", value: 1200, color: "hsl(var(--chart-3))" },
  { name: "Electronics", value: 320, color: "hsl(var(--chart-4))" },
  { name: "Rations", value: 800, color: "hsl(var(--chart-5))" },
  { name: "Medical Supplies", value: 150, color: "hsl(var(--destructive))" },
];

const activityLogData = [
  { date: "May 1", incoming: 120, outgoing: 80 },
  { date: "May 2", incoming: 150, outgoing: 100 },
  { date: "May 3", incoming: 90, outgoing: 60 },
  { date: "May 4", incoming: 200, outgoing: 120 },
  { date: "May 5", incoming: 180, outgoing: 150 },
  { date: "May 6", incoming: 130, outgoing: 90 },
  { date: "May 7", incoming: 160, outgoing: 110 },
];

const activityChartConfig = {
  incoming: { label: "Incoming", color: "hsl(var(--chart-2))" },
  outgoing: { label: "Outgoing", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;


const AssetDistributionChart = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-foreground">Asset Distribution</CardTitle>
    </CardHeader>
    <CardContent className="flex items-center justify-center pt-8">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {pieChartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
            />
            <Legend iconSize={12} />
          </PieChart>
        </ResponsiveContainer>
    </CardContent>
  </Card>
);

const ActivityLogChart = () => (
 <Card>
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-foreground">Recent Activity</CardTitle>
    </CardHeader>
    <CardContent className="pl-2">
      <ChartContainer config={activityChartConfig} className="h-[350px] w-full">
        <BarChart accessibilityLayer data={activityLogData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
           />
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Legend content={<ChartLegendContent />} />
          <Bar dataKey="incoming" fill="var(--color-incoming)" radius={4} />
          <Bar dataKey="outgoing" fill="var(--color-outgoing)" radius={4} />
        </BarChart>
      </ChartContainer>
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
