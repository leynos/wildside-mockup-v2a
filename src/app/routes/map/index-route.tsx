/** @file Route binding for the bare map view with no overlay panels. */

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { mapLayoutRoute } from "./layout-route";

export const mapIndexRoute = createRoute({
  getParentRoute: () => mapLayoutRoute,
  path: "/",
  component: lazyRouteComponent(() => import("../../features/map"), "MapScreen"),
});
