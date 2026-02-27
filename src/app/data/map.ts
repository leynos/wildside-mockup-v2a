/** @file Fixture data powering Stage 2 map experiences. */

import type { EntityLocalizations, ImageAsset } from "../domain/entities/localization";
import { metresFromMiles, secondsFromMinutes } from "../units/unit-format";
import { fillLocalizations, localizeAcrossLocales } from "./fixture-localization";
import type { DifficultyId } from "./registries/difficulties";
import type { TagId } from "./registries/tags";

export interface QuickWalkConfig {
  backgroundImageUrl: string;
  backgroundAlt: string;
  defaultDurationSeconds: number;
  durationRangeSeconds: { min: number; max: number; step: number };
  markerMidpointSeconds: number;
  interestIds: string[];
}

export interface WalkPointOfInterest {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly categoryId: TagId;
  readonly tagIds: readonly TagId[];
  readonly rating?: number;
  readonly image?: ImageAsset;
  readonly openHours?: { readonly opensAt: string; readonly closesAt: string };
}

export interface RouteNote {
  readonly id: string;
  readonly localizations: EntityLocalizations;
}

export interface WalkRouteSummary {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly coverImage: ImageAsset;
  readonly mapImage: ImageAsset;
  readonly distanceMetres: number;
  readonly durationSeconds: number;
  readonly stopsCount: number;
  readonly difficultyId: DifficultyId;
  readonly rating: number;
  readonly saves: number;
  readonly lastUpdatedAt: string;
  readonly highlightTagIds: readonly TagId[];
  readonly pointsOfInterest: readonly WalkPointOfInterest[];
  readonly notes: readonly RouteNote[];
}

export const quickWalkConfig: QuickWalkConfig = {
  backgroundImageUrl:
    "https://storage.googleapis.com/uxpilot-auth.appspot.com/ba98316c6a-339af7a71b2bf241cb90.png",
  backgroundAlt: "Satellite map view of the city used in the quick walk generator",
  defaultDurationSeconds: secondsFromMinutes(60),
  durationRangeSeconds: {
    min: secondsFromMinutes(15),
    max: secondsFromMinutes(180),
    step: secondsFromMinutes(5),
  },
  markerMidpointSeconds: secondsFromMinutes(90),
  interestIds: ["parks", "coffee", "street-art", "historic", "waterfront", "markets"],
};

export const waterfrontDiscoveryRoute: WalkRouteSummary = {
  id: "waterfront-discovery",
  localizations: fillLocalizations(
    localizeAcrossLocales(
      {
        name: "Waterfront Discovery Walk",
        description:
          "A relaxed harbour-side loop that blends coffee stops, tranquil parks, and vibrant street art with sweeping skyline views.",
      },
      {
        es: {
          name: "Paseo de descubrimiento del puerto",
          description:
            "Un circuito relajado junto al puerto con cafeterías, parques tranquilos y arte urbano vibrante con vistas al horizonte.",
        },
      },
    ),
    "en-GB",
    "route: waterfront-discovery",
  ),
  coverImage: {
    url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/26681e8543-4aea58234426af19b1c5.png",
    alt: "City riverfront with a pedestrian boardwalk at dusk.",
  },
  mapImage: {
    url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/1408b2a1ec-80b4836a18f461653773.png",
    alt: "Highlighted walking route weaving through parks, cafes, and waterfront landmarks",
  },
  distanceMetres: metresFromMiles(2.3),
  durationSeconds: secondsFromMinutes(45),
  stopsCount: 6,
  difficultyId: "easy",
  rating: 4.8,
  saves: 127,
  lastUpdatedAt: "2025-12-03T18:00:00Z",
  highlightTagIds: ["views", "coffee", "instagram"],
  pointsOfInterest: [
    {
      id: "blue-bottle-coffee",
      localizations: fillLocalizations(
        localizeAcrossLocales(
          {
            name: "Blue Bottle Coffee",
            description: "Pour-over specialists in a cosy warehouse setting.",
          },
          {
            es: {
              name: "Blue Bottle Coffee",
              description: "Especialistas en pour-over en un acogedor almacén.",
            },
          },
        ),
        "en-GB",
        "poi: blue-bottle-coffee",
      ),
      categoryId: "coffee",
      tagIds: ["coffee", "local"],
      rating: 4.7,
      image: {
        url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/03fdb8eff5-0706dc4eec4e2208ca2d.png",
        alt: "Barista pouring coffee beside pastries.",
      },
      openHours: { opensAt: "07:00", closesAt: "20:00" },
    },
    {
      id: "harbor-pier",
      localizations: fillLocalizations(
        localizeAcrossLocales(
          {
            name: "Harbour Pier Lookout",
            description: "Panoramic harbour vistas – perfect for golden hour snaps.",
          },
          {
            es: {
              name: "Mirador del muelle",
              description: "Vistas panorámicas del puerto, perfectas para la hora dorada.",
            },
          },
        ),
        "en-GB",
        "poi: harbor-pier",
      ),
      categoryId: "views",
      tagIds: ["views", "photos", "free"],
      rating: 4.9,
      image: {
        url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/7c8c56a54b-101578a06001bb190271.png",
        alt: "Pier overlooking a city skyline at sunset.",
      },
      openHours: { opensAt: "00:00", closesAt: "23:59" },
    },
    {
      id: "mural-alley",
      localizations: fillLocalizations(
        localizeAcrossLocales(
          {
            name: "Mural Alley",
            description: "Rotating gallery of local street art tucked behind the main drag.",
          },
          {
            es: {
              name: "Callejón de murales",
              description: "Galería cambiante de arte urbano local tras la calle principal.",
            },
          },
        ),
        "en-GB",
        "poi: mural-alley",
      ),
      categoryId: "instagram",
      tagIds: ["instagram", "photos", "free"],
      rating: 4.4,
      image: {
        url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/ad4258f4ad-817a02de971280a8ef8b.png",
        alt: "Colourful street art mural in a narrow alley.",
      },
      openHours: { opensAt: "10:00", closesAt: "19:00" },
    },
    {
      id: "riverside-garden",
      localizations: fillLocalizations(
        localizeAcrossLocales(
          {
            name: "Riverside Garden",
            description: "Lush boardwalk planted with native flora and shaded seating.",
          },
          {
            es: {
              name: "Jardín ribereño",
              description: "Pasarela con vegetación autóctona y zonas de sombra.",
            },
          },
        ),
        "en-GB",
        "poi: riverside-garden",
      ),
      categoryId: "nature",
      tagIds: ["nature", "rest-stop"],
      rating: 4.6,
      image: {
        url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/26681e8543-4aea58234426af19b1c5.png",
        alt: "Boardwalk framed by greenery beside the water.",
      },
      openHours: { opensAt: "06:00", closesAt: "21:00" },
    },
    {
      id: "lighthouse-market",
      localizations: fillLocalizations(
        localizeAcrossLocales(
          {
            name: "Lighthouse Market",
            description: "Weekly stalls with small batch bakers, makers, and live music.",
          },
          {
            es: {
              name: "Mercado del faro",
              description: "Puestos semanales de panaderos artesanos, artesanos y música en vivo.",
            },
          },
        ),
        "en-GB",
        "poi: lighthouse-market",
      ),
      categoryId: "market",
      tagIds: ["market", "local"],
      rating: 4.5,
      image: {
        url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/26681e8543-4aea58234426af19b1c5.png",
        alt: "Outdoor market with string lights and crowd.",
      },
      openHours: { opensAt: "08:00", closesAt: "14:00" },
    },
    {
      id: "skyline-bridge",
      localizations: fillLocalizations(
        localizeAcrossLocales(
          {
            name: "Skyline Bridge",
            description: "Suspended skywalk linking two cultural precincts over the water.",
          },
          {
            es: {
              name: "Puente Skyline",
              description:
                "Pasarela suspendida que conecta dos distritos culturales sobre el agua.",
            },
          },
        ),
        "en-GB",
        "poi: skyline-bridge",
      ),
      categoryId: "landmark",
      tagIds: ["architecture", "landmark", "views"],
      rating: 4.8,
      image: {
        url: "https://storage.googleapis.com/uxpilot-auth.appspot.com/1408b2a1ec-80b4836a18f461653773.png",
        alt: "Pedestrian bridge with skyline backdrop.",
      },
      openHours: { opensAt: "08:00", closesAt: "22:00" },
    },
  ],
  notes: [
    {
      id: "sunset",
      localizations: fillLocalizations(
        localizeAcrossLocales({
          name: "Allow extra time at the harbour lookout – it becomes busy around sunset.",
        }),
        "en-GB",
        "route-note: sunset",
      ),
    },
    {
      id: "timelapse",
      localizations: fillLocalizations(
        localizeAcrossLocales({
          name: "Keep the boardwalk section for last if you plan to record timelapses.",
        }),
        "en-GB",
        "route-note: timelapse",
      ),
    },
    {
      id: "markets",
      localizations: fillLocalizations(
        localizeAcrossLocales({
          name: "Weekend market times vary; check the community board for pop-up vendors.",
        }),
        "en-GB",
        "route-note: markets",
      ),
    },
  ],
};

export const savedRoutes: WalkRouteSummary[] = [waterfrontDiscoveryRoute];
