/** @file Welcome landing page shown when the user first opens the app. */

import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import { MobileShell } from "../../layout/mobile-shell";

/** Resolves a public-directory asset path with the Vite base URL. */
function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  const normalisedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalisedBase}${path.replace(/^\/+/, "")}`;
}

const LOGO_URL = publicUrl("images/wildside-logo.svg");
const HERO_BG_URL = publicUrl("images/hero-citymap.png");

function WildsideMark(): JSX.Element {
  return <img src={LOGO_URL} className="relative z-10 h-28 w-auto" alt="" aria-hidden />;
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
        <div className="relative h-full w-full">
          <img
            src={HERO_BG_URL}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-100" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(254,234,0,0.08),_transparent_60%)]" />
        </div>
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
