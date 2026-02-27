/** @file Welcome route binding the landing page into the router tree. */

import { createRoute } from "@tanstack/react-router";

import { WelcomeScreen } from "../../features/welcome";
import { rootRoute } from "../root-route";

export const welcomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/welcome",
  component: WelcomeScreen,
});
