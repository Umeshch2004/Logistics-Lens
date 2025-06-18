import { Target } from 'lucide-react';

export const Logo = ({ className }: { className?: string }) => (
  <div className={`flex items-center gap-2 text-primary-foreground ${className}`}>
    <Target className="h-8 w-8 text-sidebar-primary" />
    <span className="text-xl font-bold font-headline">Logistics Lens</span>
  </div>
);
