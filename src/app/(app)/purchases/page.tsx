"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterControls } from "@/components/shared/FilterControls";
import { PurchaseForm } from "@/components/purchases/PurchaseForm";
import { PurchasesTable } from "@/components/purchases/PurchasesTable";
import type { Purchase } from "@/types";
import { BASES, MOCK_ASSET_TYPES, SUPPLIERS } from "@/lib/constants";
import { addDays, subDays } from "date-fns";

// Mock data generation
const generateMockPurchases = (count: number): Purchase[] => {
  const purchases: Purchase[] = [];
  for (let i = 0; i < count; i++) {
    const assetType = MOCK_ASSET_TYPES[Math.floor(Math.random() * MOCK_ASSET_TYPES.length)];
    const base = BASES[Math.floor(Math.random() * BASES.length)];
    const quantity = Math.floor(Math.random() * 100) + 1;
    const unitPrice = Math.floor(Math.random() * 500) + 50;
    const date = subDays(new Date(), Math.floor(Math.random() * 365));
    purchases.push({
      id: `purchase_${i + 1}`,
      date: date,
      assetTypeId: assetType.id,
      assetTypeName: assetType.name,
      quantity: quantity,
      unitPrice: unitPrice,
      supplier: SUPPLIERS[Math.floor(Math.random() * SUPPLIERS.length)],
      baseId: base, // In a real app, this would be base.id
      baseName: base,
    });
  }
  return purchases.sort((a,b) => b.date.getTime() - a.date.getTime());
};


export default function PurchasesPage() {
  const [purchases, setPurchases] = React.useState<Purchase[]>(() => generateMockPurchases(20));
  const [filteredPurchases, setFilteredPurchases] = React.useState<Purchase[]>(purchases);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({from: subDays(new Date(), 30), to: new Date()});
  const [selectedBase, setSelectedBase] = React.useState<string | undefined>("all");
  const [selectedAssetType, setSelectedAssetType] = React.useState<string | undefined>("all");

  const handleAddPurchase = (newPurchase: Purchase) => {
    const updatedPurchases = [newPurchase, ...purchases].sort((a,b) => b.date.getTime() - a.date.getTime());
    setPurchases(updatedPurchases);
  };
  
  React.useEffect(() => {
    let tempPurchases = [...purchases];

    if (dateRange?.from) {
      tempPurchases = tempPurchases.filter(p => 
        new Date(p.date) >= (dateRange.from as Date) && 
        new Date(p.date) <= (dateRange.to || addDays(dateRange.from as Date, 1)) // If no 'to', consider it a single day
      );
    }
    if (selectedBase && selectedBase !== "all") {
      tempPurchases = tempPurchases.filter(p => p.baseName === selectedBase);
    }
    if (selectedAssetType && selectedAssetType !== "all") {
      const assetCategory = MOCK_ASSET_TYPES.find(at => at.name === selectedAssetType)?.category;
      if (assetCategory) { // This is filtering by selected asset type name, not category directly from filter.
         // This logic needs to be aligned with how asset types are structured.
         // For now, if an assetType name is selected, filter by that. If "all", then no filter.
         // The filter control provides categories, the data has specific asset types.
         // This example will filter if the purchase's asset type belongs to the selected category.
         tempPurchases = tempPurchases.filter(p => {
            const itemAssetType = MOCK_ASSET_TYPES.find(at => at.name === p.assetTypeName);
            return itemAssetType?.category === selectedAssetType;
         });
      }
    }
    setFilteredPurchases(tempPurchases);
  }, [purchases, dateRange, selectedBase, selectedAssetType]);


  const handleClearFilters = () => {
    setDateRange({from: subDays(new Date(), 30), to: new Date()});
    setSelectedBase("all");
    setSelectedAssetType("all");
  };
  
  // RBAC simulation: const canCreatePurchase = userRole === 'LogisticsOfficer' || userRole === 'Admin';

  return (
    <>
      <AppHeader pageTitle="Purchases Management" />
      <main className="flex-1 p-6 space-y-6">
        <PageHeader 
          title="Record & View Purchases"
          description="Enter new asset purchases and browse historical procurement data."
        />
        
        {/* RBAC: Conditionally render form or make fields read-only based on role */}
        <PurchaseForm onSubmitSuccess={handleAddPurchase} />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Purchase History</h2>
          <FilterControls
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            selectedBase={selectedBase}
            onBaseChange={setSelectedBase}
            selectedAssetType={selectedAssetType} // This is actually asset category from filter
            onAssetTypeChange={setSelectedAssetType}
            onClearFilters={handleClearFilters}
          />
          <PurchasesTable purchases={filteredPurchases} />
        </div>
      </main>
    </>
  );
}
