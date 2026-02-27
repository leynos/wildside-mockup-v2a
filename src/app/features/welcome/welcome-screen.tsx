/** @file Welcome landing page shown when the user first opens the app. */

import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import { MobileShell } from "../../layout/mobile-shell";

function WildsideMark(): JSX.Element {
  return (
    <svg
      viewBox="0 0 92.787613 139.96045"
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-10 h-28 w-20"
      aria-hidden
    >
      <title>Wildside</title>
      <g transform="translate(-98.193485,-34.001541)">
        <path
          d="m 108.69104,34.001542 a 10.497414,10.497414 0 0 0 -10.49755,10.497551 10.497414,10.497414 0 0 0 0,5.16e-4 v 51.617005 l 74.50295,74.387706 a 10.497414,10.497414 0 0 0 0.002,0.002 l 5.2e-4,5.2e-4 a 10.497414,10.497414 0 0 0 7.78454,3.45508 10.497414,10.497414 0 0 0 10.49755,-10.49755 10.497414,10.497414 0 0 0 0,-0.0124 V 44.511495 a 10.497414,10.497414 0 0 1 -0.045,0.674377 10.497414,10.497414 0 0 0 0.045,-0.686779 10.497414,10.497414 0 0 0 -10.49755,-10.497551 10.497414,10.497414 0 0 0 -5.2e-4,0 H 108.6915 a 10.497414,10.497414 0 0 1 -5.2e-4,0 z"
          fill="currentColor"
          className="text-base-content"
        />
        <path
          d="m 111.48467,37.613208 a 9.680407,9.680407 0 0 0 -9.68055,9.680546 v 47.600195 l 28.62254,28.578101 h 56.94382 V 47.305123 a 9.680407,9.680407 0 0 1 -0.0419,0.621667 9.680407,9.680407 0 0 0 0.0419,-0.633036 9.680407,9.680407 0 0 0 -9.68055,-9.680546 9.680407,9.680407 0 0 0 -5.2e-4,0 h -66.20423 a 9.680407,9.680407 0 0 1 -5.1e-4,0 z"
          fill="currentColor"
          className="text-accent"
        />
      </g>
    </svg>
  );
}

interface ValuePropProps {
  iconToken: string;
  heading: string;
  description: string;
}

function ValueProp({ iconToken, heading, description }: ValuePropProps): JSX.Element {
  return (
    <div className="flex items-start gap-4">
      <div className="welcome-prop__icon">
        <Icon token={iconToken} className="text-xl text-accent-content" aria-hidden />
      </div>
      <div>
        <h3 className="welcome-prop__heading">{heading}</h3>
        <p className="text-sm leading-relaxed text-base-content/70">{description}</p>
      </div>
    </div>
  );
}

export function WelcomeScreen(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <MobileShell
      tone="dark"
      background={
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(254,234,0,0.08),_transparent_60%),linear-gradient(180deg,_#000000_0%,_#1A1A1A_100%)]" />
      }
    >
      <div className="welcome-screen__content">
        <section className="welcome-hero">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="animate-scan absolute h-0.5 w-full bg-gradient-to-r from-transparent via-accent to-transparent" />
          </div>

          <div className="mb-8">
            <div className="relative inline-block">
              <div className="animate-pulse-ring absolute inset-0 rounded-full bg-accent opacity-20 blur-3xl" />
              <WildsideMark />
            </div>
          </div>

          <h1 className="welcome-hero__title">
            {t("welcome-title", { defaultValue: "WILDSIDE" })}
          </h1>

          <p className="welcome-hero__subtitle">
            {t("welcome-subtitle", { defaultValue: "URBAN EXPLORATION" })}
          </p>

          <div className="mb-6 h-0.5 w-16 bg-accent" />

          <p className="max-w-xs text-base leading-relaxed text-base-content/70">
            {t("welcome-tagline", {
              defaultValue:
                "Discover hidden routes through your city. Navigate with purpose. Walk with intention.",
            })}
          </p>
        </section>

        <section className="welcome-props">
          <ValueProp
            iconToken="{icon.object.route}"
            heading={t("welcome-prop-routes-heading", { defaultValue: "CUSTOM ROUTES" })}
            description={t("welcome-prop-routes-description", {
              defaultValue:
                "Generate personalised walking paths based on your preferences and exploration style.",
            })}
          />
          <ValueProp
            iconToken="{icon.safety.priority}"
            heading={t("welcome-prop-safety-heading", { defaultValue: "SAFE NAVIGATION" })}
            description={t("welcome-prop-safety-description", {
              defaultValue:
                "Built-in safety features and accessibility options for confident urban exploration.",
            })}
          />
          <ValueProp
            iconToken="{icon.action.download}"
            heading={t("welcome-prop-offline-heading", { defaultValue: "OFFLINE READY" })}
            description={t("welcome-prop-offline-description", {
              defaultValue:
                "Download maps and routes for seamless navigation without connectivity.",
            })}
          />
        </section>

        <section className="welcome-cta">
          <button
            type="button"
            className="cta-button"
            onClick={() => navigate({ to: "/discover" })}
          >
            <span className="inline-action-cluster">
              <Icon token="{icon.navigation.forward}" aria-hidden className="h-5 w-5" />
              {t("welcome-cta", { defaultValue: "GET STARTED" })}
            </span>
          </button>
          <p className="mt-4 text-center text-xs text-base-content/60">
            {t("welcome-hint", { defaultValue: "Tap to begin your urban adventure" })}
          </p>
        </section>
      </div>
    </MobileShell>
  );
}
