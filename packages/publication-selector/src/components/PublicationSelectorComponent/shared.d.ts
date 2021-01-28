export enum ContentEvents {
  PUBLICATIONS_CHANGED = "pub-changed"
}

export interface PublicationsChangedEvent {
  publicationIds: number[];
}

export interface ITranslations {
  publicationButton: string;
  selectLabel: string;
  seeAddText: string;
  validText: string;
  noPublicationsText: string;
  publicationSelectorTitle: string
}

