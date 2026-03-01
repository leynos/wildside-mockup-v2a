/** @file Route binding for the bare map view with no overlay panels. */

import { createRoute } from "@tanstack/react-router";

import { MapScreen } from "../../features/map";
import { mapLayoutRoute } from "./layout-route";

export const mapIndexRoute = createRoute({
  getParentRoute: () => mapLayoutRoute,
  path: "/",
  component: MapScreen,
});
