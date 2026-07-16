/** @file Route for the walk customizer flow. */

import { createRoute } from "@tanstack/react-router";

import { CustomizeScreen } from "../../features/customize";
import { rootRoute } from "../root-route";

export const customizeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customize",
  component: CustomizeScreen,
});
