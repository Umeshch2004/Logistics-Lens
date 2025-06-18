"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownCircle, ArrowUpCircle, ShoppingCart } from "lucide-react";

interface NetMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    purchases: number;
    transferIn: number;
    transferOut: number;
  };
}

export function NetMovementModal({ isOpen, onClose, data }: NetMovementModalProps) {
  const netMovement = data.purchases + data.transferIn - data.transferOut;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card shadow-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-headline text-foreground">Net Movement Breakdown</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Detailed view of asset movements contributing to the net change.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Movement Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium flex items-center">
                  <ShoppingCart className="mr-2 h-4 w-4 text-primary" /> Purchases
                </TableCell>
                <TableCell className="text-right text-green-600">+{data.purchases.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center">
                  <ArrowDownCircle className="mr-2 h-4 w-4 text-primary" /> Transfers In
                </TableCell>
                <TableCell className="text-right text-green-600">+{data.transferIn.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center">
                  <ArrowUpCircle className="mr-2 h-4 w-4 text-destructive" /> Transfers Out
                </TableCell>
                <TableCell className="text-right text-red-600">-{data.transferOut.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow className="border-t-2 border-primary">
                <TableCell className="font-bold text-foreground">Net Movement</TableCell>
                <TableCell className={`text-right font-bold ${netMovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netMovement >= 0 ? '+' : ''}{netMovement.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
