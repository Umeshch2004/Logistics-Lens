import { z } from "zod";
import { BASES, MOCK_ASSET_TYPES, SUPPLIERS, PERSONNEL_NAMES } from "./constants";

const baseNames = BASES;
const assetTypeNames = MOCK_ASSET_TYPES.map(at => at.name);
const supplierNames = SUPPLIERS;
const personnelNames = PERSONNEL_NAMES;


export const PurchaseFormSchema = z.object({
  date: z.date({
    required_error: "Purchase date is required.",
  }),
  assetTypeName: z.string().min(1, "Asset type is required.").refine(val => assetTypeNames.includes(val), {message: "Invalid asset type"}),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  unitPrice: z.coerce.number().min(0.01, "Unit price must be positive."),
  supplier: z.string().min(1, "Supplier is required.").refine(val => supplierNames.includes(val), {message: "Invalid supplier"}),
  baseName: z.string().min(1, "Base is required.").refine(val => baseNames.includes(val), {message: "Invalid base"}),
});

export type PurchaseFormValues = z.infer<typeof PurchaseFormSchema>;


export const TransferFormSchema = z.object({
  date: z.date({
    required_error: "Transfer date is required.",
  }),
  assetTypeName: z.string().min(1, "Asset type is required.").refine(val => assetTypeNames.includes(val), {message: "Invalid asset type"}),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  sourceBaseName: z.string().min(1, "Source base is required.").refine(val => baseNames.includes(val), {message: "Invalid source base"}),
  destinationBaseName: z.string().min(1, "Destination base is required.").refine(val => baseNames.includes(val), {message: "Invalid destination base"}),
}).refine(data => data.sourceBaseName !== data.destinationBaseName, {
  message: "Source and destination bases cannot be the same.",
  path: ["destinationBaseName"], // Or path: ["sourceBaseName"]
});

export type TransferFormValues = z.infer<typeof TransferFormSchema>;


export const AssignmentFormSchema = z.object({
  dateAssigned: z.date({
    required_error: "Assignment date is required.",
  }),
  assetTypeName: z.string().min(1, "Asset is required.").refine(val => assetTypeNames.includes(val), {message: "Invalid asset"}), // Simplified to asset type name
  quantityAssigned: z.coerce.number().min(1, "Quantity must be at least 1."),
  personnelName: z.string().min(1, "Personnel is required.").refine(val => personnelNames.includes(val), {message: "Invalid personnel name"}),
  baseName: z.string().min(1, "Base is required.").refine(val => baseNames.includes(val), {message: "Invalid base"}),
});

export type AssignmentFormValues = z.infer<typeof AssignmentFormSchema>;


export const ExpenditureFormSchema = z.object({
  date: z.date({
    required_error: "Expenditure date is required.",
  }),
  assetTypeName: z.string().min(1, "Asset is required.").refine(val => assetTypeNames.includes(val), {message: "Invalid asset"}), // Simplified to asset type name
  quantityUsed: z.coerce.number().min(1, "Quantity used must be at least 1."),
  reason: z.string().min(5, "Reason must be at least 5 characters long.").max(200, "Reason must be at most 200 characters."),
  personnelName: z.string().min(1, "Personnel is required.").refine(val => personnelNames.includes(val), {message: "Invalid personnel name"}),
});

export type ExpenditureFormValues = z.infer<typeof ExpenditureFormSchema>;
