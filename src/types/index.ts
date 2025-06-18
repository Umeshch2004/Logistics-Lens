import type { LucideIcon } from 'lucide-react';

export type UserRole = 'Admin' | 'BaseCommander' | 'LogisticsOfficer';

export interface Base {
  id: string;
  name: string;
}

export interface AssetType {
  id: string;
  name: string;
  category: 'Vehicles' | 'Weapons' | 'Ammunition' | 'Electronics' | 'Rations' | 'Other';
}

export interface Asset {
  id: string;
  assetTypeId: string;
  serialNumber?: string;
  name: string;
  baseId: string;
  status: 'Available' | 'Assigned' | 'InMaintenance' | 'Decommissioned';
  quantity?: number; // For countable items like ammunition
}

export interface Purchase {
  id:string;
  date: Date;
  assetTypeId: string;
  assetTypeName?: string; // Denormalized for display
  quantity: number;
  unitPrice: number;
  supplier: string;
  baseId: string;
  baseName?: string; // Denormalized for display
}

export interface Transfer {
  id: string;
  date: Date;
  assetId?: string; // For specific serialized assets
  assetTypeId?: string; // For bulk assets
  assetName?: string; // Denormalized
  quantity: number;
  sourceBaseId: string;
  sourceBaseName?: string; // Denormalized
  destinationBaseId: string;
  destinationBaseName?: string; // Denormalized
  status: 'Pending' | 'InTransit' | 'Completed' | 'Cancelled';
}

export interface Assignment {
  id: string;
  dateAssigned: Date;
  assetId: string;
  assetName?: string; // Denormalized
  quantityAssigned: number;
  personnelId: string; // Could be name or actual ID
  personnelName?: string; // Denormalized
  baseId: string;
  baseName?: string; // Denormalized
  status: 'Assigned' | 'Returned';
  dateReturned?: Date;
}

export interface Expenditure {
  id: string;
  date: Date;
  assetId: string;
  assetName?: string; // Denormalized
  quantityUsed: number;
  reason: string;
  personnelId: string;
  personnelName?: string; // Denormalized
  baseId: string;
  baseName?: string; // Denormalized
}

export interface Metric {
  label: string;
  value: string | number;
  change?: string; // e.g., "+5%"
  icon?: LucideIcon;
  clickable?: boolean;
  action?: () => void;
}

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  label?: string;
  children?: NavItem[];
}

export interface FilterOptions {
  bases: string[];
  assetTypes: string[];
}
