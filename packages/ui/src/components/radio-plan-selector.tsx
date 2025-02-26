import { Badge } from "@workspace/ui/components/badge";
import { Label } from "@workspace/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { useId } from "react";
import Link from "next/link";
import { Logs } from "lucide-react";

type RadioPlanSelectorProps = {
  onChange?: (value: string) => void;
};

export const RadioPlanSelector = ({ onChange }: RadioPlanSelectorProps) => {
  const id = useId();

  const items = [
    { value: "1", label: "Hobby", price: "Free" },
    { value: "2", label: "Pro", price: "$12/mo" },
    { value: "3", label: "Business", price: "$24/mo" },
  ];

  return (
    <fieldset className="space-y-4">
      <div className="flex items-center justify-between">
        <legend className="text-sm font-medium leading-none text-foreground">Choose plan</legend>
        <Link href="https://simplist.blog/pricing" className="flex text-xs font-medium text-accent-foreground hover:underline gap-1">
          <Logs className="w-4 h-4" />
          View pricing
        </Link>
      </div>

      <RadioGroup
        className="gap-0 -space-y-px rounded-lg shadow-sm shadow-black/5"
        defaultValue="1"
        onValueChange={onChange}
        name="plan-selector"
      >
        {items.map((item) => (
          <div
            key={`${id}-${item.value}`}
            className="relative flex flex-col gap-4 border border-input p-4 first:rounded-t-lg last:rounded-b-lg has-[[data-state=checked]]:z-10 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  id={`${id}-${item.value}`}
                  value={item.value}
                  className="after:absolute after:inset-0"
                  aria-describedby={`${`${id}-${item.value}`}-price`}
                />
                <Label className="inline-flex items-start" htmlFor={`${id}-${item.value}`}>
                  {item.label}
                  {item.value === "2" && <Badge className="-mt-1 ms-2">Popular</Badge>}
                </Label>
              </div>
              <div id={`${`${id}-${item.value}`}-price`} className="text-xs leading-[inherit] text-muted-foreground">
                {item.price}
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
