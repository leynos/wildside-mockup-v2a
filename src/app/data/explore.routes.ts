/** @file Route fixtures for the Explore catalogue. */

import heroCoffeeCulture from "../../assets/explore/coffee_culture.jpg";
import heroHarborSunset from "../../assets/explore/harbor_sunset.jpg";
import heroHiddenGarden from "../../assets/explore/hidden_garden.jpg";
import heroMarket from "../../assets/explore/market.jpg";
import heroStreetArt from "../../assets/explore/street_art2.jpg";
import walkRouteMap2 from "../../assets/walks/walk-route-map-2.png";
import walkRouteMap3 from "../../assets/walks/walk-route-map-3.png";
import { metresFromKilometres, secondsFromMinutes } from "../units/unit-format";
import type {
  CommunityPick,
  Route,
  RouteCollection,
  TrendingRouteHighlight,
} from "./explore.models";
import {
  fillLocalizations,
  image,
  localizeAcrossLocales,
  unsafeBadgeId,
  unsafeRouteId,
} from "./explore-fixture-helpers";
import type { BadgeId } from "./registries/badges";

export const exploreRoutes: Route[] = [
  {
    id: unsafeRouteId("harbour-lights"),
    localizations: fillLocalizations(
      localizeAcrossLocales(
        {
          name: "Harbour Lights Promenade",
          description:
            "Golden hour stroll weaving past skyline overlooks, coffee pit stops, and art installations.",
        },
        {
          es: {
            name: "Paseo Luces del Puerto",
            description: "Paseo al atardecer con miradores, cafés acogedores y arte público.",
          },
        },
      ),
      "en-GB",
      "route: harbour-lights",
    ),
    heroImage: image(
      heroHarborSunset,
      "Sunset across the harbour viewed from a waterfront promenade.",
    ),
    distanceMetres: metresFromKilometres(3.6),
    durationSeconds: secondsFromMinutes(65),
    rating: 4.9,
    badges: [unsafeBadgeId("sunset-pick"), unsafeBadgeId("teal-line")],
    difficultyId: "moderate",
    interests: ["waterfront", "coffee", "street-art"],
  },
  {
    id: unsafeRouteId("coffee-culture-loop"),
    localizations: fillLocalizations(
      localizeAcrossLocales(
        {
          name: "Coffee Culture Circuit",
          description: "Roasters, latte art labs, and leafy courtyards to linger in.",
        },
        {
          es: {
            name: "Circuito Cultura del Café",
            description: "Tostadores, barras de latte art y patios verdes para disfrutar.",
          },
        },
      ),
      "en-GB",
      "route: coffee-culture-loop",
    ),
    heroImage: image(heroCoffeeCulture, "Barista pouring latte art inside a warm café interior."),
    distanceMetres: metresFromKilometres(2.4),
    durationSeconds: secondsFromMinutes(45),
    rating: 4.7,
    badges: [unsafeBadgeId("community-favourite")],
    difficultyId: "easy",
    interests: ["coffee", "markets"],
  },
  {
    id: unsafeRouteId("hidden-garden-lanes"),
    localizations: fillLocalizations(
      localizeAcrossLocales(
        {
          name: "Hidden Garden Lanes",
          description: "Secret courtyards, vertical gardens, and quiet cloisters.",
        },
        {
          es: {
            name: "Pasajes de Jardines Secretos",
            description: "Patios ocultos, jardines verticales y claustros tranquilos.",
          },
        },
      ),
      "en-GB",
      "route: hidden-garden-lanes",
    ),
    heroImage: image(
      heroHiddenGarden,
      "Secret courtyard garden with brick walls and dense spring greenery.",
    ),
    distanceMetres: metresFromKilometres(3),
    durationSeconds: secondsFromMinutes(55),
    rating: 4.8,
    badges: [unsafeBadgeId("teal-line")],
    difficultyId: "easy",
    interests: ["parks", "historic"],
  },
  {
    id: unsafeRouteId("street-art-sprint"),
    localizations: fillLocalizations(
      localizeAcrossLocales(
        {
          name: "Street Art Sprint",
          description: "Mural-lined backstreets with rotating installations.",
        },
        {
          es: {
            name: "Sprint de Arte Urbano",
            description: "Calles llenas de murales e instalaciones cambiantes.",
          },
        },
      ),
      "en-GB",
      "route: street-art-sprint",
    ),
    heroImage: image(heroStreetArt, "Bright street art mural with abstract shapes and characters."),
    distanceMetres: metresFromKilometres(4.2),
    durationSeconds: secondsFromMinutes(70),
    rating: 4.6,
    badges: [unsafeBadgeId("teal-line")],
    difficultyId: "moderate",
    interests: ["street-art", "coffee"],
  },
  {
    id: unsafeRouteId("market-hop-classic"),
    localizations: fillLocalizations(
      localizeAcrossLocales(
        {
          name: "Market Hop Classic",
          description: "Laneway markets with local makers and late-night bites.",
        },
        {
          es: {
            name: "Clásico de Mercados",
            description: "Mercados de callejones con artesanos locales y bocados nocturnos.",
          },
        },
      ),
      "en-GB",
      "route: market-hop-classic",
    ),
    heroImage: image(heroMarket, "Bustling indoor market with food stalls and hanging lights."),
    distanceMetres: metresFromKilometres(2.8),
    durationSeconds: secondsFromMinutes(50),
    rating: 4.5,
    badges: [unsafeBadgeId("community-favourite")],
    difficultyId: "easy",
    interests: ["markets", "coffee"],
  },
  {
    id: unsafeRouteId("cherry-blossom-trail"),
    localizations: fillLocalizations(
      localizeAcrossLocales(
        {
          name: "Cherry Blossom Trail",
          description: "Limited time bloom corridor with picnic lawns.",
        },
        {
          es: {
            name: "Ruta de los Cerezos en Flor",
            description: "Corredor de floración temporal con zonas de picnic.",
          },
        },
      ),
      "en-GB",
      "route: cherry-blossom-trail",
    ),
    heroImage: image(
      heroHiddenGarden,
      "Lush hidden garden tucked between historic brick buildings.",
    ),
    distanceMetres: metresFromKilometres(3),
    durationSeconds: secondsFromMinutes(60),
    rating: 4.8,
    badges: [unsafeBadgeId("sunset-pick")],
    difficultyId: "easy",
    interests: ["parks", "waterfront"],
  },
  {
    id: unsafeRouteId("food-truck-friday"),
    localizations: fillLocalizations(
      localizeAcrossLocales(
        {
          name: "Food Truck Friday",
          description: "Weekly street food crawl with live music breaks.",
        },
        {
          es: {
            name: "Viernes de Food Trucks",
            description: "Recorrido gastronómico semanal con música en vivo.",
          },
        },
      ),
      "en-GB",
      "route: food-truck-friday",
    ),
    heroImage: image(heroMarket, "Street food trucks lined up at dusk."),
    distanceMetres: metresFromKilometres(2.2),
    durationSeconds: secondsFromMinutes(40),
    rating: 4.5,
    badges: [unsafeBadgeId("community-favourite")],
    difficultyId: "easy",
    interests: ["markets", "food"],
  },
  {
    id: unsafeRouteId("rooftop-views-circuit"),
    localizations: fillLocalizations(
      localizeAcrossLocales(
        {
          name: "Rooftop Views Circuit",
          description: "Skyline terraces, glass skybridges, and elevator hops.",
        },
        {
          es: {
            name: "Circuito de Azoteas con Vistas",
            description: "Terrazas panorámicas y pasarelas de cristal entre torres.",
          },
        },
      ),
      "en-GB",
      "route: rooftop-views-circuit",
    ),
    heroImage: image(heroHarborSunset, "City skyline from a rooftop bar at golden hour."),
    distanceMetres: metresFromKilometres(4.5),
    durationSeconds: secondsFromMinutes(80),
    rating: 4.7,
    badges: [unsafeBadgeId("sunset-pick")],
    difficultyId: "moderate",
    interests: ["historic", "street-art", "waterfront"],
  },
];

export const curatedRouteMaps: Record<string, string> = {
  "coffee-loops": walkRouteMap2,
  "after-dark": walkRouteMap3,
};

export type { CommunityPick, Route, RouteCollection, TrendingRouteHighlight };
export type ExploreRouteBadgeId = BadgeId;
