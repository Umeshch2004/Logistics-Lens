"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Purchase } from "@/types";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2 } from "lucide-react";

interface PurchasesTableProps {
  purchases: Purchase[];
  // onEdit: (purchase: Purchase) => void;
  // onDelete: (purchaseId: string) => void;
  // canEdit?: boolean;
}

export function PurchasesTable({ purchases }: PurchasesTableProps) {
  if (purchases.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No purchases found matching your criteria.</p>;
  }

  return (
    <ScrollArea className="rounded-md border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Asset Type</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total Price</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Base</TableHead>
            {/* <TableHead className="text-right">Actions</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell>{format(new Date(purchase.date), "MMM dd, yyyy")}</TableCell>
              <TableCell>{purchase.assetTypeName || purchase.assetTypeId}</TableCell>
              <TableCell className="text-right">{purchase.quantity.toLocaleString()}</TableCell>
              <TableCell className="text-right">${purchase.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell className="text-right">${(purchase.quantity * purchase.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell>{purchase.supplier}</TableCell>
              <TableCell>
                <Badge variant="secondary" size="lg">{purchase.baseName || purchase.baseId}</Badge>
              </TableCell>
              {/* <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(purchase)} aria-label="Edit purchase" disabled={!canEdit}>
                  <FilePenLine className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(purchase.id)} aria-label="Delete purchase" disabled={!canEdit} className="text-destructive hover:text-destructive/80">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
