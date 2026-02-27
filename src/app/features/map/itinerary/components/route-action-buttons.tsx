/** @file Favourite toggle and share dialog for a route. */

import * as Dialog from "@radix-ui/react-dialog";
import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../../../../components/button";
import { Icon } from "../../../../components/icon";
import { getRouteShareUrl } from "../../../../config/route-urls";

export type RouteActionButtonsProps = {
  readonly routeId: string;
};

export function RouteActionButtons({ routeId }: RouteActionButtonsProps): JSX.Element {
  const { t } = useTranslation();
  const [isFavourite, setIsFavourite] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const removeSavedLabel = t("route-action-remove-saved", {
    defaultValue: "Remove saved itinerary",
  });
  const saveLabel = t("route-action-save", { defaultValue: "Save this itinerary" });
  const shareLabel = t("route-action-share", { defaultValue: "Share" });
  const shareDialogTitle = t("route-share-dialog-title", { defaultValue: "Share this walk" });
  const shareDialogDescription = t("route-share-dialog-description", {
    defaultValue: "Copy the preview link or send it to friends once real sharing is wired up.",
  });
  const closeLabel = t("action-close", { defaultValue: "Close" });
  const comingSoonLabel = t("route-action-coming-soon", { defaultValue: "Coming soon" });

  return (
    <div className="flex justify-end gap-3">
      <Button
        variant="circle"
        active={isFavourite}
        aria-label={isFavourite ? removeSavedLabel : saveLabel}
        aria-pressed={isFavourite}
        onClick={() => setIsFavourite((prev) => !prev)}
      >
        <Icon token={isFavourite ? "{icon.action.like}" : "{icon.action.unlike}"} aria-hidden />
      </Button>
      <Dialog.Root open={shareOpen} onOpenChange={setShareOpen}>
        <Dialog.Trigger asChild>
          <Button className="route-share__trigger">
            <Icon token="{icon.action.share}" aria-hidden />
            {shareLabel}
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
          <Dialog.Content className="dialog-surface">
            <Dialog.Title className="font-display font-bold tracking-wider text-lg text-base-content">
              {shareDialogTitle}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-base-content/70">
              {shareDialogDescription}
            </Dialog.Description>
            <div className="route-share__preview">{getRouteShareUrl(routeId)}</div>
            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button variant="ghost" size="sm">
                  {closeLabel}
                </Button>
              </Dialog.Close>
              <Button variant="accent" size="sm" disabled>
                {comingSoonLabel}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
