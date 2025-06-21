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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Assignment, Expenditure } from "@/types";
import { BASES, MOCK_ASSET_TYPES, PERSONNEL_NAMES } from "@/lib/constants";
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
import { Textarea } from "@/components/ui/textarea";
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
import { CalendarIcon, PlusCircle, CheckSquare, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AssignmentFormSchema, ExpenditureFormSchema, type AssignmentFormValues, type ExpenditureFormValues } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";


// Mock data generation
const generateMockAssignments = (count: number): Assignment[] => {
  const assignments: Assignment[] = [];
  const statuses: Assignment['status'][] = ['Assigned', 'Returned'];
  for (let i = 0; i < count; i++) {
    const assetType = MOCK_ASSET_TYPES[Math.floor(Math.random() * MOCK_ASSET_TYPES.length)];
    const base = BASES[Math.floor(Math.random() * BASES.length)];
    const personnel = PERSONNEL_NAMES[Math.floor(Math.random() * PERSONNEL_NAMES.length)];
    const dateAssigned = subDays(new Date(), Math.floor(Math.random() * 60));
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    assignments.push({
      id: `assign_${i + 1}`,
      dateAssigned,
      assetId: assetType.id, // In real app, might be specific asset serial
      assetName: assetType.name,
      quantityAssigned: Math.floor(Math.random() * 5) + 1,
      personnelId: personnel, // In real app, use ID
      personnelName: personnel,
      baseId: base, // In real app, use ID
      baseName: base,
      status,
      dateReturned: status === 'Returned' ? addDays(dateAssigned, Math.floor(Math.random() * 30) + 1) : undefined,
    });
  }
  return assignments.sort((a,b) => b.dateAssigned.getTime() - a.dateAssigned.getTime());
};

const generateMockExpenditures = (count: number): Expenditure[] => {
  const expenditures: Expenditure[] = [];
  for (let i = 0; i < count; i++) {
    const assetType = MOCK_ASSET_TYPES.filter(at => at.category === "Ammunition" || at.category === "Rations" || at.category === "Medical Supplies")[Math.floor(Math.random() * 3)];
    const base = BASES[Math.floor(Math.random() * BASES.length)];
    const personnel = PERSONNEL_NAMES[Math.floor(Math.random() * PERSONNEL_NAMES.length)];
    const date = subDays(new Date(), Math.floor(Math.random() * 30));
    expenditures.push({
      id: `expend_${i + 1}`,
      date,
      assetId: assetType.id,
      assetName: assetType.name,
      quantityUsed: Math.floor(Math.random() * 50) + 10,
      reason: "Training Exercise",
      personnelId: personnel,
      personnelName: personnel,
      baseId: base,
      baseName: base,
    });
  }
  return expenditures.sort((a,b) => b.date.getTime() - a.date.getTime());
};


const AssignmentFormComponent = ({ onSubmitSuccess, onCancel }: { onSubmitSuccess: (data: Assignment) => void, onCancel: () => void }) => {
  const { toast } = useToast();
  const form = useForm<AssignmentFormValues>({ resolver: zodResolver(AssignmentFormSchema), defaultValues: { dateAssigned: new Date(), quantityAssigned: 1 }});
  function onSubmit(data: AssignmentFormValues) {
    const newAssignment: Assignment = { id: crypto.randomUUID(), ...data, assetId: MOCK_ASSET_TYPES.find(at => at.name === data.assetTypeName)?.id || 'unknown', personnelId: data.personnelName, baseId: data.baseName, status: 'Assigned' };
    onSubmitSuccess(newAssignment);
    toast({ title: "Asset Assigned", description: `${data.assetTypeName} assigned to ${data.personnelName}.` });
    form.reset(); onCancel();
  }
  return (<Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField name="dateAssigned" control={form.control} render={({ field }) => (<FormItem><FormLabel>Date Assigned</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn(!field.value && "text-muted-foreground", "w-full justify-start")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
    <FormField name="assetTypeName" control={form.control} render={({ field }) => (<FormItem><FormLabel>Asset</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select asset" /></SelectTrigger></FormControl><SelectContent>{MOCK_ASSET_TYPES.map(at => <SelectItem key={at.id} value={at.name}>{at.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
    <FormField name="quantityAssigned" control={form.control} render={({ field }) => (<FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
    <FormField name="personnelName" control={form.control} render={({ field }) => (<FormItem><FormLabel>Personnel</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select personnel" /></SelectTrigger></FormControl><SelectContent>{PERSONNEL_NAMES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
    <FormField name="baseName" control={form.control} render={({ field }) => (<FormItem><FormLabel>Base</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select base" /></SelectTrigger></FormControl><SelectContent>{BASES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
    <DialogFooter><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit"><CheckSquare className="mr-2 h-4 w-4" />Assign Asset</Button></DialogFooter>
  </form></Form>);
};

const ExpenditureFormComponent = ({ onSubmitSuccess, onCancel }: { onSubmitSuccess: (data: Expenditure) => void, onCancel: () => void }) => {
  const { toast } = useToast();
  const form = useForm<ExpenditureFormValues>({ resolver: zodResolver(ExpenditureFormSchema), defaultValues: { date: new Date(), quantityUsed: 1 }});
  function onSubmit(data: ExpenditureFormValues) {
    const newExpenditure: Expenditure = { id: crypto.randomUUID(), ...data, assetId: MOCK_ASSET_TYPES.find(at => at.name === data.assetTypeName)?.id || 'unknown', personnelId: data.personnelName, baseId: BASES[0] /* Simplified */ };
    onSubmitSuccess(newExpenditure);
    toast({ title: "Asset Expended", description: `${data.quantityUsed} of ${data.assetTypeName} recorded as expended.` });
    form.reset(); onCancel();
  }
  return (<Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField name="date" control={form.control} render={({ field }) => (<FormItem><FormLabel>Date of Expenditure</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn(!field.value && "text-muted-foreground", "w-full justify-start")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
    <FormField name="assetTypeName" control={form.control} render={({ field }) => (<FormItem><FormLabel>Asset</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select asset" /></SelectTrigger></FormControl><SelectContent>{MOCK_ASSET_TYPES.filter(at => at.category === "Ammunition" || at.category === "Rations" || at.category === "Medical Supplies").map(at => <SelectItem key={at.id} value={at.name}>{at.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
    <FormField name="quantityUsed" control={form.control} render={({ field }) => (<FormItem><FormLabel>Quantity Used</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
    <FormField name="reason" control={form.control} render={({ field }) => (<FormItem><FormLabel>Reason</FormLabel><FormControl><Textarea placeholder="Reason for expenditure (e.g., training, operational use)" {...field} /></FormControl><FormMessage /></FormItem>)} />
    <FormField name="personnelName" control={form.control} render={({ field }) => (<FormItem><FormLabel>Personnel</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select personnel" /></SelectTrigger></FormControl><SelectContent>{PERSONNEL_NAMES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
    <DialogFooter><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit"><Trash2Icon className="mr-2 h-4 w-4" />Record Expenditure</Button></DialogFooter>
  </form></Form>);
};


export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = React.useState("assignments");
  const [assignments, setAssignments] = React.useState<Assignment[]>([]);
  const [expenditures, setExpenditures] = React.useState<Expenditure[]>([]);
  const [filteredAssignments, setFilteredAssignments] = React.useState<Assignment[]>([]);
  const [filteredExpenditures, setFilteredExpenditures] = React.useState<Expenditure[]>([]);

  const [isAssignmentFormOpen, setIsAssignmentFormOpen] = React.useState(false);
  const [isExpenditureFormOpen, setIsExpenditureFormOpen] = React.useState(false);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({from: subDays(new Date(), 30), to: new Date()});
  const [selectedBase, setSelectedBase] = React.useState<string | undefined>("all");
  const [selectedAssetType, setSelectedAssetType] = React.useState<string | undefined>("all");

  React.useEffect(() => {
    setAssignments(generateMockAssignments(10));
    setExpenditures(generateMockExpenditures(8));
  }, []);

  React.useEffect(() => {
    let tempAssignments = [...assignments];
    let tempExpenditures = [...expenditures];

    if (dateRange?.from) {
      tempAssignments = tempAssignments.filter(a => new Date(a.dateAssigned) >= (dateRange.from as Date) && new Date(a.dateAssigned) <= (dateRange.to || addDays(dateRange.from as Date,1)));
      tempExpenditures = tempExpenditures.filter(e => new Date(e.date) >= (dateRange.from as Date) && new Date(e.date) <= (dateRange.to || addDays(dateRange.from as Date, 1)));
    }
    if (selectedBase && selectedBase !== "all") {
      tempAssignments = tempAssignments.filter(a => a.baseName === selectedBase);
      tempExpenditures = tempExpenditures.filter(e => e.baseName === selectedBase);
    }
    if (selectedAssetType && selectedAssetType !== "all") {
        tempAssignments = tempAssignments.filter(a => {
            const itemAssetType = MOCK_ASSET_TYPES.find(at => at.name === a.assetName);
            return itemAssetType?.category === selectedAssetType;
        });
        tempExpenditures = tempExpenditures.filter(e => {
            const itemAssetType = MOCK_ASSET_TYPES.find(at => at.name === e.assetName);
            return itemAssetType?.category === selectedAssetType;
        });
    }
    setFilteredAssignments(tempAssignments);
    setFilteredExpenditures(tempExpenditures);
  }, [assignments, expenditures, dateRange, selectedBase, selectedAssetType]);

  const handleClearFilters = () => {
    setDateRange({from: subDays(new Date(), 30), to: new Date()});
    setSelectedBase("all");
    setSelectedAssetType("all");
  };

  const handleAddAssignment = (newAssignment: Assignment) => {
    const updated = [newAssignment, ...assignments].sort((a,b) => b.dateAssigned.getTime() - a.dateAssigned.getTime());
    setAssignments(updated);
  };
  const handleAddExpenditure = (newExpenditure: Expenditure) => {
    const updated = [newExpenditure, ...expenditures].sort((a,b) => b.date.getTime() - a.date.getTime());
    setExpenditures(updated);
  };

  // RBAC: const canManageAssignments = userRole === 'BaseCommander' || userRole === 'Admin';

  return (
    <>
      <AppHeader pageTitle="Assignments & Expenditures" />
      <main className="flex-1 p-6 space-y-6">
        <PageHeader 
          title="Track Asset Usage"
          description="Assign assets to personnel and record expenditures."
          actions={
            <div className="flex gap-2">
              <Dialog open={isAssignmentFormOpen} onOpenChange={setIsAssignmentFormOpen}>
                <DialogTrigger asChild><Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" />New Assignment</Button></DialogTrigger>
                <DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>Assign Asset</DialogTitle><DialogDescription>Assign an asset to personnel.</DialogDescription></DialogHeader><AssignmentFormComponent onSubmitSuccess={handleAddAssignment} onCancel={() => setIsAssignmentFormOpen(false)} /></DialogContent>
              </Dialog>
              <Dialog open={isExpenditureFormOpen} onOpenChange={setIsExpenditureFormOpen}>
                <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />Record Expenditure</Button></DialogTrigger>
                <DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>Record Asset Expenditure</DialogTitle><DialogDescription>Record the usage of consumable assets.</DialogDescription></DialogHeader><ExpenditureFormComponent onSubmitSuccess={handleAddExpenditure} onCancel={() => setIsExpenditureFormOpen(false)} /></DialogContent>
              </Dialog>
            </div>
          }
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="expenditures">Expenditures</TabsTrigger>
          </TabsList>
          <TabsContent value="assignments" className="mt-4">
            <ScrollArea className="rounded-md border bg-card shadow-sm">
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Asset</TableHead><TableHead className="text-right">Qty</TableHead><TableHead>Personnel</TableHead><TableHead>Base</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredAssignments.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No assignments found.</TableCell></TableRow> :
                  filteredAssignments.map(a => (<TableRow key={a.id}>
                    <TableCell>{format(new Date(a.dateAssigned), "PP")}</TableCell><TableCell>{a.assetName}</TableCell><TableCell className="text-right">{a.quantityAssigned}</TableCell><TableCell>{a.personnelName}</TableCell>
                    <TableCell><Badge variant="secondary" size="lg">{a.baseName}</Badge></TableCell><TableCell><Badge variant={a.status === 'Assigned' ? 'default' : 'outline'}>{a.status}</Badge></TableCell>
                  </TableRow>))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="expenditures" className="mt-4">
            <ScrollArea className="rounded-md border bg-card shadow-sm">
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Asset</TableHead><TableHead className="text-right">Qty Used</TableHead><TableHead>Reason</TableHead><TableHead>Personnel</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredExpenditures.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No expenditures found.</TableCell></TableRow> :
                  filteredExpenditures.map(e => (<TableRow key={e.id}>
                    <TableCell>{format(new Date(e.date), "PP")}</TableCell><TableCell>{e.assetName}</TableCell><TableCell className="text-right">{e.quantityUsed}</TableCell><TableCell>{e.reason}</TableCell><TableCell>{e.personnelName}</TableCell>
                  </TableRow>))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
