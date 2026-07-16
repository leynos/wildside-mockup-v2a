/**
 * @file Shared slider control for duration/distance selectors.
 *
 * Note: callers formatting the quick-walk duration messages
 * (`quick-walk-duration-*`) must always pass a numeric `count`
 * to the Fluent bundle so minute pluralization remains correct
 * across locales such as Italian.
 */

import * as Slider from "@radix-ui/react-slider";
import type { JSX } from "react";

import { Icon } from "./icon";

export interface SliderControlProps {
  id: string;
  label: string;
  iconToken: string;
  iconClassName?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (next: number) => void;
  valueFormatter?: (value: number) => string;
  markers?: string[];
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_VALUE_FORMATTER = (value: number) => value.toString();

export function SliderControl({
  ariaLabel,
  className,
  iconClassName = "text-accent",
  iconToken,
  id,
  label,
  markers,
  max,
  min,
  onValueChange,
  step,
  value,
  valueFormatter = DEFAULT_VALUE_FORMATTER,
}: SliderControlProps): JSX.Element {
  const displayValue = valueFormatter(value);

  return (
    <section className={`slider-control ${className ?? ""}`.trim()} data-slider-id={id}>
      <header className="slider-control__header">
        <h2 className="slider-control__title">
          <Icon token={iconToken} className={`slider-control__icon ${iconClassName}`} aria-hidden />
          {label}
        </h2>
        <span className="slider-control__value">{displayValue}</span>
      </header>
      <Slider.Root
        className="slider-control__root"
        value={[value]}
        min={min}
        max={max}
        step={step}
        aria-label={ariaLabel ?? label}
        onValueChange={(next) => {
          const [candidate] = next;
          onValueChange(
            typeof candidate === "number" && !Number.isNaN(candidate) ? candidate : value,
          );
        }}
      >
        <Slider.Track className="slider-control__track">
          <Slider.Range className="slider-control__range" />
        </Slider.Track>
        <Slider.Thumb
          className="slider-control__thumb"
          aria-label={ariaLabel ?? label}
          aria-valuetext={displayValue}
        />
      </Slider.Root>
      {markers && markers.length > 0 ? (
        <div className="slider-control__markers" aria-hidden="true">
          {markers.map((marker) => (
            <span key={marker} className="slider-control__marker">
              {marker}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
