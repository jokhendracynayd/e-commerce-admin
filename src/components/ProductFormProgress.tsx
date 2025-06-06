import { cn } from "@/lib/utils";
import { ProductDraftSection } from "@/lib/product-draft-utils";
import { CheckCircle2, Circle } from "lucide-react";
import { Tooltip } from "./ui/tooltip";

interface ProductFormProgressProps {
  completedSections: ProductDraftSection[];
  className?: string;
  showPercentage?: boolean;
}

export function ProductFormProgress({
  completedSections,
  className,
  showPercentage = true,
}: ProductFormProgressProps) {
  const totalSections = 7; // Update if adding more sections
  const completion = Math.round((completedSections.length / totalSections) * 100);
  
  const sections = [
    { id: 'basic' as const, label: 'Basic Info' },
    { id: 'pricing' as const, label: 'Pricing' },
    { id: 'category' as const, label: 'Categories' },
    { id: 'images' as const, label: 'Images' },
    { id: 'variants' as const, label: 'Variants' },
    { id: 'inventory' as const, label: 'Inventory' },
    { id: 'seo' as const, label: 'SEO' },
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-medium">Form Progress</h4>
        {showPercentage && (
          <span className="text-xs font-medium">
            {completion}% complete
          </span>
        )}
      </div>
      
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${completion}%` }}
        />
      </div>
      
      <div className="grid grid-cols-7 gap-1 pt-2">
        {sections.map((section) => {
          const isComplete = completedSections.includes(section.id);
          return (
            <Tooltip key={section.id} content={section.label}>
              <div className="flex flex-col items-center">
                {isComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-[10px] text-muted-foreground mt-1 hidden md:inline-block">
                  {section.label}
                </span>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
} 