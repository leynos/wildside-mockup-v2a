/** @file Presentational helpers for the customise route screen. */

import * as Slider from "@radix-ui/react-slider";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import { PreferenceToggleCard } from "../../components/preference-toggle-card";
import { SectionHeading } from "../../components/section-heading";
import { SliderControl } from "../../components/slider-control";
import type {
  AdvancedToggleOption,
  InterestMixSlice,
  ResolvedRoutePreviewOption,
  SegmentOption,
  SliderConfig,
  SurfaceOption,
} from "../../data/customize";
import type { LocalizedStringSet } from "../../domain/entities/localization";
import { useLocaleCode } from "../../i18n/use-locale-code";
import { resolveLocalization } from "../../lib/localization-runtime";
import { CustomizeSegmentToggle } from "./segment-toggle-card";

type SliderWithLocalization = SliderConfig & { localization: LocalizedStringSet };

interface SliderListProps {
  readonly sliders: readonly SliderWithLocalization[];
  readonly sliderValues: Record<string, number>;
  readonly onSliderChange: (id: string, value: number) => void;
  readonly formatSliderValue: (id: string, value: number) => string;
}

export const SliderList = ({
  sliders,
  sliderValues,
  onSliderChange,
  formatSliderValue,
}: SliderListProps): JSX.Element => (
  <>
    {sliders.map(({ id, iconToken, iconColorClass, markers, max, min, step, localization }) => {
      const currentValue = sliderValues[id] ?? min;
      const markerLabels = markers.map((marker) => formatSliderValue(id, marker));
      return (
        <SliderControl
          key={id}
          id={id}
          label={localization.name}
          iconToken={iconToken}
          iconClassName={iconColorClass}
          className="mb-8"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          valueFormatter={(value) => formatSliderValue(id, value)}
          markers={markerLabels}
          ariaLabel={localization.description ?? localization.name}
          onValueChange={(value) => onSliderChange(id, value)}
        />
      );
    })}
  </>
);

export interface SegmentPickerProps {
  id: string;
  label: string;
  iconToken: string;
  options: readonly SegmentOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentPicker({
  iconToken,
  id,
  label,
  onChange,
  options,
  value,
}: SegmentPickerProps): JSX.Element {
  const locale = useLocaleCode();

  const resolvedOptions = options.map((option) => {
    const localization = resolveLocalization(option.localizations, locale, option.id);
    return {
      ...option,
      label: localization.name,
      description: localization.description ?? "",
    };
  });

  return (
    <section className="mb-8" data-segment-id={id}>
      <SectionHeading iconToken={iconToken}>{label}</SectionHeading>
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={(next) => next && onChange(next)}
        aria-label={label}
        className="grid grid-cols-3 gap-3"
      >
        {resolvedOptions.map((option) => (
          <CustomizeSegmentToggle
            key={option.id}
            value={option.id}
            label={option.label}
            description={option.description}
          />
        ))}
      </ToggleGroup.Root>
    </section>
  );
}

export interface SurfacePickerProps {
  heading: string;
  ariaLabel: string;
  value: string;
  options: readonly SurfaceOption[];
  onChange: (value: string) => void;
  iconToken?: string;
}

export function SurfacePicker({
  ariaLabel,
  heading,
  iconToken = "{icon.category.paved}",
  onChange,
  options,
  value,
}: SurfacePickerProps): JSX.Element {
  const locale = useLocaleCode();
  const resolvedOptions = options.map((surface) => ({
    ...surface,
    label: resolveLocalization(surface.localizations, locale, surface.id).name,
  }));
  return (
    <section className="mb-8">
      <SectionHeading iconToken={iconToken}>{heading}</SectionHeading>
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={(next) => next && onChange(next)}
        aria-label={ariaLabel}
        className="grid grid-cols-2 gap-3"
      >
        {resolvedOptions.map((surface) => (
          <ToggleGroup.Item
            key={surface.id}
            value={surface.id}
            className="customize-surface__option"
          >
            <Icon token={surface.iconToken} className="text-base" aria-hidden />
            {surface.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </section>
  );
}

export interface InterestMixProps {
  slices: readonly InterestMixSlice[];
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
}

export function InterestMix({ onChange, slices, values }: InterestMixProps): JSX.Element {
  const { t } = useTranslation();
  const locale = useLocaleCode();
  const heading = t("customize-interest-heading", { defaultValue: "Interest Mix" });

  return (
    <section className="mb-8">
      <SectionHeading iconToken="{icon.action.like}">{heading}</SectionHeading>
      <div className="space-y-6">
        {slices.map((slice) => {
          const value = values[slice.id] ?? slice.allocation;
          const sliceLocalization = resolveLocalization(slice.localizations, locale, slice.id);
          const sliceLabel = sliceLocalization.shortLabel ?? sliceLocalization.name;
          return (
            <div key={slice.id}>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-base-content">
                  <Icon token={slice.iconToken} className={slice.iconColorClass} aria-hidden />
                  {sliceLabel}
                </span>
                <span className="text-sm font-semibold text-accent">{value}%</span>
              </div>
              <Slider.Root
                value={[value]}
                min={0}
                max={100}
                step={5}
                onValueChange={(next) => onChange(slice.id, next[0] ?? value)}
                className="interest-mix__slider"
              >
                <Slider.Track className="interest-mix__track">
                  <Slider.Range className="interest-mix__range" />
                </Slider.Track>
                <Slider.Thumb
                  className="interest-mix__thumb"
                  aria-label={t("customize-interest-thumb-aria", {
                    label: sliceLabel,
                    defaultValue: `${sliceLabel} allocation`,
                  })}
                />
              </Slider.Root>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export interface RoutePreviewProps {
  routes: readonly ResolvedRoutePreviewOption[];
  selected: string;
  onSelect: (id: string) => void;
  formatDistanceLabel: (metres: number) => string;
  formatDurationLabel: (seconds: number) => string;
}

export function RoutePreview({
  routes,
  formatDistanceLabel,
  formatDurationLabel,
  onSelect,
  selected,
}: RoutePreviewProps): JSX.Element {
  const { t } = useTranslation();
  const locale = useLocaleCode();
  const heading = t("customize-route-preview-heading", { defaultValue: "Route Preview" });
  const regenerateLabel = t("customize-route-preview-regenerate", { defaultValue: "Regenerate" });
  const startLabel = t("customize-route-preview-start", { defaultValue: "Start Route" });
  const resolvedRoutes = routes.map((preview) => ({
    ...preview,
    localization: resolveLocalization(preview.route.localizations, locale, preview.routeId),
  }));

  return (
    <section className="mb-8">
      <SectionHeading iconToken="{icon.action.preview}">{heading}</SectionHeading>
      <div className="grid grid-cols-3 gap-3">
        {resolvedRoutes.map((preview) => {
          const isActive = preview.id === selected;
          const distanceLabel = formatDistanceLabel(preview.route.distanceMetres);
          const durationLabel = formatDurationLabel(preview.route.durationSeconds);
          return (
            <button
              key={preview.id}
              type="button"
              onClick={() => onSelect(preview.id)}
              className={`rounded-lg border px-3 py-3 text-start text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                isActive
                  ? "border-accent bg-accent text-accent-content"
                  : "border-neutral bg-base-200 text-base-content/80"
              }`}
              aria-pressed={isActive}
            >
              <div
                className={`mb-2 flex h-16 items-center justify-center rounded bg-gradient-to-br ${preview.gradientClass}`}
              >
                <Icon
                  token="{icon.object.route}"
                  className={`text-xl ${preview.iconColorClass}`}
                  aria-hidden
                />
              </div>
              <p className="font-semibold">{preview.localization.name}</p>
              <p className="text-[11px] text-base-content/60">
                {distanceLabel} • {durationLabel}
              </p>
            </button>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button type="button" className="cta-button cta-button--secondary" disabled>
          <Icon token="{icon.action.regenerate}" aria-hidden className="me-2 inline" />
          {regenerateLabel}
        </button>
        <button type="button" className="cta-button" disabled>
          <Icon token="{icon.action.play}" aria-hidden className="me-2 inline" />
          {startLabel}
        </button>
      </div>
    </section>
  );
}

export interface AdvancedOptionsProps {
  options: readonly AdvancedToggleOption[];
  values: Record<string, boolean>;
  onToggle: (id: string, value: boolean) => void;
}

export function AdvancedOptions({ onToggle, options, values }: AdvancedOptionsProps): JSX.Element {
  const { t } = useTranslation();
  const locale = useLocaleCode();
  const heading = t("customize-advanced-heading", { defaultValue: "Advanced Options" });

  return (
    <section className="mb-8">
      <SectionHeading iconToken="{icon.action.settings}">{heading}</SectionHeading>
      <div className="space-y-3">
        {options.map((option) => {
          const checked = values[option.id] ?? option.defaultEnabled;
          const localization = resolveLocalization(option.localizations, locale, option.id);
          return (
            <PreferenceToggleCard
              key={option.id}
              id={`advanced-${option.id}`}
              iconToken={option.iconToken}
              title={localization.name}
              description={localization.description ?? ""}
              isChecked={checked}
              onCheckedChange={(next) => onToggle(option.id, next)}
            />
          );
        })}
      </div>
    </section>
  );
}
