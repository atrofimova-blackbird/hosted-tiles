import {
  CustomElement,
  DefineCustomElement,
} from "../CustomElement";
import h from "../jsxdom"
import getPublicationComponent from "./PublicationComponent";
import { ContentEvents, PublicationsChangedEvent, ITranslations } from "./shared"

export let getPublicationSelectorComponent = (
  connectedCallback: () => void,


  TranslationElement: any,
  Publication: any,
  Content: any,

  translations: ITranslations,
  dbPublication: any,

  getDate: any,
  ValidityDatesComponent: any,
  BadgeComponent: any

  ) : any => {

  require("./style.css");

  const PublicationComponent = getPublicationComponent(
    TranslationElement,
    Publication,
    Content,
    translations,
    dbPublication,
    getDate,
    ValidityDatesComponent,
    BadgeComponent
  )

  @DefineCustomElement("flipp-publications")
  class PublicationSelectorComponent extends CustomElement {
    static get observedAttributes() {
      return ["publications", "title-key", "selected-publication"];
    }

    private defaultNoWeeklyAdsText: string = "no-weekly-ads";

    get publications(): number[] {
      const publications = this.getAttribute("publications");
      return publications
        ? publications.split(",").map((pub) => parseInt(pub, 10))
        : [];
    }

    set publications(publications: number[]) {
      this.setAttribute("publications", publications.join(","));
    }

    get selectedPublication(): number {
      const pubId = this.getAttribute("selected-publication") || "0";
      return parseInt(pubId, 10);
    }
    set selectedPublication(pubId: number) {
      this.setAttribute("selected-publication", pubId.toString());
    }

    get parentTag() {
      return this.getAttribute("parentTag") || "FLIPP-PUBLICATIONSELECTOR-PAGE";
    }

    constructor() {
      super();
    }

    public connectedCallback() {
      this.setHTML(this.render(this.publications));

      //at:todo
      connectedCallback();
      // ContentService.addEventListener<CustomEvent<PublicationsChangedEvent>>(
      //   ContentEvents.PUBLICATIONS_CHANGED,
      //   (e) => (this.publications = e.detail.publicationIds)
      // );
    }

    public attributeChangedCallback(
      attr: string,
      oldVal: string,
      newVal: string
    ) {
      if (
        attr === "publications" ||
        attr === "title-key" ||
        attr === "selected-publication"
      ) {
        this.setHTML(this.render(this.publications));
      }
    }

    protected get noPublicationsText(): string {
      return this.getAttribute("no-weekly-ads") || this.defaultNoWeeklyAdsText;
    }

    private setHTML(body: HTMLElement) {
      const oldElem = this.firstElementChild;
      if (oldElem) {
        this.replaceChild(body, oldElem);
      } else {
        this.appendChild(body);
      }
    }

    private render(publications?: number[]): HTMLElement {
      if (!publications) {
        return <div />;
      }

      if (publications.length === 0) {
        return (
          <span>
          {translations.noPublicationsText}
        </span>
          //at:todo
          // <Translation key={this.noPublicationsText} parent={this.parentTag} />
        );
      }
      const publicationElements = publications.map((pubId) => {
        return (
          <li>
            <PublicationComponent
              publication-id={pubId}
              is-selected={pubId === this.selectedPublication}
            />
            <div className="divider" />
          </li>
        );
      });

      const title = this.hasAttribute("title-key") ? (
        <h2 className="publication-selector-title">
          {/*//at:todo*/}
          {translations.publicationSelectorTitle}
          {/*<Translation*/}
            {/*key={this.getAttribute("title-key")!}*/}
            {/*parent={this.parentTag}*/}
          {/*/>*/}
        </h2>
      ) : null;

      return (
        <div>
          {title}
          <ul>{publicationElements}</ul>
        </div>
      );
    }
  }

  return PublicationSelectorComponent;
};

export default getPublicationSelectorComponent;