import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface ModulePlaceholderProps {
  title: string;
  description: string;
  features: string[];
}

export default function ModulePlaceholder({ title, description, features }: ModulePlaceholderProps) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card className="p-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Construction className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">Module Under Development</h3>
        <p className="mb-6 text-muted-foreground">
          This forensic analysis module is currently being developed and will be available in a future update.
        </p>
        
        <div className="mx-auto max-w-md rounded-lg bg-muted p-4 text-left">
          <p className="mb-2 text-sm font-medium">Planned Features:</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
