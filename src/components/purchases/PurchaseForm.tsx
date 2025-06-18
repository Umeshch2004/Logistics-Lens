"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { CalendarIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { PurchaseFormSchema, type PurchaseFormValues } from "@/lib/schemas";
import { BASES, MOCK_ASSET_TYPES, SUPPLIERS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import type { Purchase } from "@/types";

interface PurchaseFormProps {
  onSubmitSuccess: (data: Purchase) => void;
  // This would be used to control editability based on role
  // canEdit?: boolean; 
}

export function PurchaseForm({ onSubmitSuccess }: PurchaseFormProps) {
  const { toast } = useToast();
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(PurchaseFormSchema),
    defaultValues: {
      date: new Date(),
      assetTypeName: "",
      quantity: 1,
      unitPrice: 0,
      supplier: "",
      baseName: "",
    },
  });

  function onSubmit(data: PurchaseFormValues) {
    // Placeholder for API call
    console.log("Purchase data submitted:", data);
    
    // Simulate API success and add to local state via callback
    const newPurchase: Purchase = {
      id: crypto.randomUUID(), // Temporary ID
      ...data,
      assetTypeId: MOCK_ASSET_TYPES.find(at => at.name === data.assetTypeName)?.id || 'unknown',
      baseId: BASES.find(b => b === data.baseName) || 'unknown', // This should be ID mapping in real app
      // Other fields might need to be derived or set by backend
    };
    onSubmitSuccess(newPurchase);

    toast({
      title: "Purchase Recorded",
      description: `Successfully recorded purchase of ${data.quantity} x ${data.assetTypeName}.`,
      variant: "default",
    });
    form.reset(); 
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 border rounded-lg shadow-sm bg-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Purchase Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assetTypeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MOCK_ASSET_TYPES.map((assetType) => (
                      <SelectItem key={assetType.id} value={assetType.name}>
                        {assetType.name} ({assetType.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter quantity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Enter unit price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUPPLIERS.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="baseName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receiving Base</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select base" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BASES.map((base) => (
                      <SelectItem key={base} value={base}>
                        {base}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full md:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Record Purchase
        </Button>
      </form>
    </Form>
  );
}
