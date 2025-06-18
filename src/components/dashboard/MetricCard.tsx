import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import type { Metric } from "@/types";
import { cn } from "@/lib/utils";

export function MetricCard({ label, value, change, icon: Icon, clickable = false, action }: Metric) {
  const cardContent = (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {change && (
          <p className={cn(
            "text-xs text-muted-foreground mt-1",
            change.startsWith('+') ? 'text-green-600' : change.startsWith('-') ? 'text-red-600' : ''
          )}>
            {change}
          </p>
        )}
      </CardContent>
    </>
  );

  if (clickable && action) {
    return (
      <Card
        className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
        onClick={action}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') action(); }}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${label}`}
      >
        {cardContent}
      </Card>
    );
  }

  return <Card>{cardContent}</Card>;
}
