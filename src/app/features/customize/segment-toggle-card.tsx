/** @file Semantic card wrapper for customise segment toggles. */

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import type { JSX } from "react";

interface CustomizeSegmentToggleProps
  extends Omit<ToggleGroup.ToggleGroupItemProps, "children" | "className"> {
  description: string;
  label: string;
  className?: string;
}

export function CustomizeSegmentToggle({
  description,
  label,
  className,
  ...itemProps
}: CustomizeSegmentToggleProps): JSX.Element {
  const composedClassName = className ? `customize-segment ${className}` : "customize-segment";

  return (
    <ToggleGroup.Item {...itemProps} className={composedClassName}>
      <p className="font-semibold">{label}</p>
      <p className="mt-1 text-xs opacity-70">{description}</p>
    </ToggleGroup.Item>
  );
}
