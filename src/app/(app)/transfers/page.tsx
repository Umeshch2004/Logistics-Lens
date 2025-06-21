"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterControls } from "@/components/shared/FilterControls";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Transfer } from "@/types";
import { BASES, MOCK_ASSET_TYPES } from "@/lib/constants";
import { format, subDays, addDays } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, PlusCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransferFormSchema, type TransferFormValues } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";


// Mock data generation for transfers
const generateMockTransfers = (count: number): Transfer[] => {
  const transfers: Transfer[] = [];
  const statuses: Transfer['status'][] = ['Pending', 'InTransit', 'Completed', 'Cancelled'];
  for (let i = 0; i < count; i++) {
    const assetType = MOCK_ASSET_TYPES[Math.floor(Math.random() * MOCK_ASSET_TYPES.length)];
    const sourceBase = BASES[Math.floor(Math.random() * BASES.length)];
    let destinationBase = BASES[Math.floor(Math.random() * BASES.length)];
    while (destinationBase === sourceBase) {
      destinationBase = BASES[Math.floor(Math.random() * BASES.length)];
    }
    const quantity = Math.floor(Math.random() * 20) + 1;
    const date = subDays(new Date(), Math.floor(Math.random() * 90));
    transfers.push({
      id: `transfer_${i + 1}`,
      date: date,
      assetTypeId: assetType.id,
      assetName: assetType.name,
      quantity: quantity,
      sourceBaseId: sourceBase, // In real app, use ID
      sourceBaseName: sourceBase,
      destinationBaseId: destinationBase, // In real app, use ID
      destinationBaseName: destinationBase,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }
  return transfers.sort((a,b) => b.date.getTime() - a.date.getTime());
};

const TransferForm = ({ onSubmitSuccess, onCancel }: { onSubmitSuccess: (data: Transfer) => void, onCancel: () => void }) => {
  const { toast } = useToast();
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(TransferFormSchema),
    defaultValues: {
      date: new Date(),
      assetTypeName: "",
      quantity: 1,
      sourceBaseName: "",
      destinationBaseName: "",
    },
  });

  function onSubmit(data: TransferFormValues) {
    console.log("Transfer data submitted:", data);
    const newTransfer: Transfer = {
      id: crypto.randomUUID(),
      ...data,
      assetTypeId: MOCK_ASSET_TYPES.find(at => at.name === data.assetTypeName)?.id || 'unknown',
      sourceBaseId: data.sourceBaseName,
      destinationBaseId: data.destinationBaseName,
      status: 'Pending',
    };
    onSubmitSuccess(newTransfer);
    toast({
      title: "Transfer Initiated",
      description: `Transfer of ${data.quantity} x ${data.assetTypeName} from ${data.sourceBaseName} to ${data.destinationBaseName} is pending.`,
    });
    form.reset();
    onCancel(); // Close dialog
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField name="date" control={form.control} render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Transfer Date</FormLabel>
            <Popover><PopoverTrigger asChild><FormControl>
              <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button></FormControl></PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
              </PopoverContent>
            </Popover><FormMessage />
          </FormItem>)}
        />
        <FormField name="assetTypeName" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Asset Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select asset type" /></SelectTrigger></FormControl>
              <SelectContent>{MOCK_ASSET_TYPES.map(at => <SelectItem key={at.id} value={at.name}>{at.name} ({at.category})</SelectItem>)}</SelectContent>
            </Select><FormMessage />
          </FormItem>)}
        />
        <FormField name="quantity" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <FormControl><Input type="number" placeholder="Enter quantity" {...field} /></FormControl>
            <FormMessage />
          </FormItem>)}
        />
        <FormField name="sourceBaseName" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Source Base</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select source base" /></SelectTrigger></FormControl>
              <SelectContent>{BASES.map(base => <SelectItem key={base} value={base}>{base}</SelectItem>)}</SelectContent>
            </Select><FormMessage />
          </FormItem>)}
        />
        <FormField name="destinationBaseName" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Destination Base</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select destination base" /></SelectTrigger></FormControl>
              <SelectContent>{BASES.map(base => <SelectItem key={base} value={base}>{base}</SelectItem>)}</SelectContent>
            </Select><FormMessage />
          </FormItem>)}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit"><Send className="mr-2 h-4 w-4" />Initiate Transfer</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}


export default function TransfersPage() {
  const [transfers, setTransfers] = React.useState<Transfer[]>([]);
  const [filteredTransfers, setFilteredTransfers] = React.useState<Transfer[]>([]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({from: subDays(new Date(), 30), to: new Date()});
  const [selectedBase, setSelectedBase] = React.useState<string | undefined>("all"); // This can filter by source or destination
  const [selectedAssetType, setSelectedAssetType] = React.useState<string | undefined>("all");

  const handleAddTransfer = (newTransfer: Transfer) => {
    const updatedTransfers = [newTransfer, ...transfers].sort((a,b) => b.date.getTime() - a.date.getTime());
    setTransfers(updatedTransfers);
  };

  React.useEffect(() => {
    setTransfers(generateMockTransfers(15));
  }, []);

  React.useEffect(() => {
    let tempTransfers = [...transfers];
    if (dateRange?.from) {
      tempTransfers = tempTransfers.filter(t => 
        new Date(t.date) >= (dateRange.from as Date) && 
        new Date(t.date) <= (dateRange.to || addDays(dateRange.from as Date, 1))
      );
    }
    if (selectedBase && selectedBase !== "all") {
      tempTransfers = tempTransfers.filter(t => t.sourceBaseName === selectedBase || t.destinationBaseName === selectedBase);
    }
    if (selectedAssetType && selectedAssetType !== "all") {
      tempTransfers = tempTransfers.filter(t => {
        const itemAssetType = MOCK_ASSET_TYPES.find(at => at.name === t.assetName);
        return itemAssetType?.category === selectedAssetType;
      });
    }
    setFilteredTransfers(tempTransfers);
  }, [transfers, dateRange, selectedBase, selectedAssetType]);

  const handleClearFilters = () => {
    setDateRange({from: subDays(new Date(), 30), to: new Date()});
    setSelectedBase("all");
    setSelectedAssetType("all");
  };
  
  // RBAC simulation: const canInitiateTransfer = userRole === 'LogisticsOfficer' || userRole === 'Admin';

  const getStatusBadgeVariant = (status: Transfer['status']): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'Completed': return 'default'; // Using primary for completed
      case 'InTransit': return 'secondary';
      case 'Pending': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'secondary';
    }
  };


  return (
    <>
      <AppHeader pageTitle="Transfers Management" />
      <main className="flex-1 p-6 space-y-6">
        <PageHeader 
          title="Manage Asset Transfers"
          description="Initiate new transfers and view historical transfer data across bases."
          actions={
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                {/* RBAC: disabled={!canInitiateTransfer} */}
                <Button><PlusCircle className="mr-2 h-4 w-4" />Initiate Transfer</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg bg-card shadow-xl rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-headline text-foreground">New Asset Transfer</DialogTitle>
                  <DialogDescription>Fill in the details to initiate a new asset transfer.</DialogDescription>
                </DialogHeader>
                <TransferForm onSubmitSuccess={handleAddTransfer} onCancel={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          }
        />
        
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Transfer History</h2>
          <FilterControls
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            selectedBase={selectedBase}
            onBaseChange={setSelectedBase}
            selectedAssetType={selectedAssetType}
            onAssetTypeChange={setSelectedAssetType}
            onClearFilters={handleClearFilters}
          />
          <ScrollArea className="rounded-md border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead>From Base</TableHead>
                  <TableHead>To Base</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No transfers found.</TableCell></TableRow>
                ) : (
                  filteredTransfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell>{format(new Date(transfer.date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{transfer.assetName}</TableCell>
                      <TableCell className="text-right">{transfer.quantity}</TableCell>
                      <TableCell><Badge variant="outline">{transfer.sourceBaseName}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{transfer.destinationBaseName}</Badge></TableCell>
                      <TableCell><Badge variant={getStatusBadgeVariant(transfer.status)}>{transfer.status}</Badge></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </main>
    </>
  );
}
