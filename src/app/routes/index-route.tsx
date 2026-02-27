/** @file Redirects the root path to the Welcome landing page. */

import { createRoute, redirect } from "@tanstack/react-router";

import { rootRoute } from "./root-route";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => redirect({ to: "/welcome" }),
});
