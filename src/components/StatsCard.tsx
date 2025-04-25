
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard = ({
  title,
  value,
  icon,
  className,
  trend,
}: StatsCardProps) => {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h4 className="text-2xl font-semibold mt-1">{value}</h4>
          {trend && (
            <p
              className={cn(
                "text-xs mt-1",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {trend.value}% rispetto al mese scorso
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-beauty-purple/10 rounded-full">{icon}</div>
        )}
      </div>
    </Card>
  );
};
