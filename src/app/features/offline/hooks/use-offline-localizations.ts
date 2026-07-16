/** @file Aggregates localization hooks for the offline screen. */

import { useOfflineDialogCopy } from "./use-offline-dialog-copy";
import { useOfflineDownloadsCopy } from "./use-offline-downloads-copy";
import { useOfflineNavigationCopy } from "./use-offline-navigation-copy";
import { useOfflineStorageCopy } from "./use-offline-storage-copy";
import { useOfflineSuggestionsCopy } from "./use-offline-suggestions-copy";

export type OfflineLocalisations = {
  readonly navigationCopy: ReturnType<typeof useOfflineNavigationCopy>;
  readonly storageCopy: ReturnType<typeof useOfflineStorageCopy>;
  readonly downloadsCopy: ReturnType<typeof useOfflineDownloadsCopy>["copy"];
  readonly suggestionsCopy: ReturnType<typeof useOfflineSuggestionsCopy>;
  readonly dialogCopy: ReturnType<typeof useOfflineDialogCopy>;
  readonly undoDescriptionDefault: string;
};

export type OfflineLocalisationOptions = {
  readonly storageUsedFormatted: string;
  readonly storageTotalFormatted: string;
  readonly storageAutoDeleteDays: number;
  readonly suggestionsLength: number;
  readonly dialogOpen: boolean;
};

export const useOfflineLocalisations = ({
  storageUsedFormatted,
  storageTotalFormatted,
  storageAutoDeleteDays,
  suggestionsLength,
  dialogOpen,
}: OfflineLocalisationOptions): OfflineLocalisations => {
  const navigationCopy = useOfflineNavigationCopy();
  const storageCopy = useOfflineStorageCopy(
    storageUsedFormatted,
    storageTotalFormatted,
    storageAutoDeleteDays,
  );
  const { copy: downloadsCopy, undoDescriptionDefault } = useOfflineDownloadsCopy();
  const suggestionsCopy = useOfflineSuggestionsCopy(suggestionsLength);
  const dialogCopy = useOfflineDialogCopy(dialogOpen);

  return {
    navigationCopy,
    storageCopy,
    downloadsCopy,
    suggestionsCopy,
    dialogCopy,
    undoDescriptionDefault,
  };
};
