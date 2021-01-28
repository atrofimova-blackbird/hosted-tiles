import { DefineCustomElement } from "../../CustomElement";
import h from "../../jsxdom";
import { ITranslations } from "../shared"

export let getPublicationComponent = (
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

  @DefineCustomElement("flipp-publication")
  class PublicationComponent extends TranslationElement {
    static get observedAttributes() {
      return ["publication-id", "is-selected"];
    }

    private btn: HTMLElement;
    private thumbnail: HTMLElement | null;
    private header: HTMLElement | null;
    private dates: HTMLElement | null;
    private selectedLabel: HTMLElement | null;
    private pubEl: HTMLElement;
    private badgeWrapper: HTMLElement | null;
    private seeAddText: string = "";

    public constructor() {
      super();
      this.pubEl = this.render();
      this.btn = this.pubEl.querySelector(
        ".flipp-publication-button"
      ) as HTMLElement;
      this.thumbnail = this.pubEl.querySelector(".flipp-publication-thumbnail");
      this.header = this.pubEl.querySelector(".flipp-publication-header");
      this.dates = this.pubEl.querySelector("flipp-validity-dates");
      this.selectedLabel = this.pubEl.querySelector(".selected-label");
      this.badgeWrapper = this.pubEl.querySelector(
        ".flipp-drop-down-pub-badge-wrapper"
      );

      // this.applyCustomStyles({ "RightPanel.All.SeeAd": this.btn });
    }

    get publicationId(): number {
      const publicationId = this.getAttribute("publication-id") || "-1";
      return parseInt(publicationId, 10);
    }

    set publicationId(publicationId: number) {
      this.setAttribute("publication-id", publicationId.toString());
    }

    get isSelected(): boolean {
      return this.getAttribute("is-selected") === "true";
    }

    set isSelected(isSelected: boolean) {
      this.setAttribute("is-selected", isSelected.toString());
    }



    public async attributeChangedCallback(attr: string) {
      if (!this.seeAddText) {
        this.seeAddText = translations.seeAddText;
        // this.seeAddText = await I18n.t("see-ad", this.tagName);
      }

      if (attr === "publication-id") {
        const pub = dbPublication; //at:todo
        // const pub = await DB.getPublication(this.publicationId);
        let validDatesText;

        if (this.btn) {
          this.btn.setAttribute(
            "href",
            `#!/publication?publication-id=${pub.id}`
          );
        }
        if (this.thumbnail) {
          this.thumbnail.setAttribute("src", pub.firstPageThumbnail400hUrl);
        }
        if (this.header) {
          this.header.innerText = pub.name;
        }
        if (this.dates) {
          this.dates.setAttribute("start-date", `${pub.validFrom}`);
          this.dates.setAttribute("end-date", `${pub.validTo}`);

          const { from, to } = await getDate({
            fromDateValue: pub.validFrom.toDateString(),
            toDateValue: pub.validTo.toDateString(),
            startDateFormat: "day-and-month",
            endDateFormat: "day-and-month",
          });
          const validText = translations.validText;
          // const validText = await I18n.t("valid", this.tagName);
          validDatesText = `${validText} ${from} - ${to}`;
        }
        if (this.badgeWrapper) {
          this.renderBadgeComponent(this.badgeWrapper, pub);
        }
        this.pubEl.classList.remove("flipp-skeleton-publication");

        const ariaLabelText = `${this.seeAddText}, ${
        pub.name || ""
          }, ${validDatesText}`;
        this.btn.setAttribute("aria-label", ariaLabelText);
      } else if (attr === "is-selected") {
        if (this.isSelected) {
          this.pubEl.classList.add("selected-publication");
          if (this.btn && this.selectedLabel) {
            this.btn.remove();
            this.selectedLabel.classList.remove("hidden");
          }
        } else {
          this.pubEl.classList.remove("selected-publication");
          if (this.btn && this.selectedLabel) {
            this.selectedLabel.classList.add("hidden");
          }
        }
      }
    }

    protected firstConnect() {
      this.appendChild(this.pubEl);
    }

    protected reConnect() {
      if (this.btn) {
        this.btn.addEventListener("click", this.buttonClickHandler);
      }
      this.setLocaleHandlers();
    }

    protected disconnect() {
      if (this.btn) {
        this.btn.removeEventListener("click", this.buttonClickHandler);
      }
      this.unsetLocaleHandlers();
    }

    protected render(): HTMLElement {
      return (
        <div className="flipp-publication-container flipp-skeleton-publication">
          <div className="flipp-publication-image">
            <img className="flipp-publication-thumbnail" aria-hidden="true" />
            <div className="flipp-drop-down-pub-badge-wrapper" />
          </div>
          <div className="flipp-publication-details">
            <div className="flipp-publication-info">
              <h2 className="flipp-publication-header" />
              <span className="flipp-publication-dates">
              <ValidityDatesComponent start-date="" end-date="" />
            </span>
            </div>
            <a className="flipp-publication-button">
              {/*//at:todo*/}
              {translations.publicationButton}
              {/*<Translation key="see-ad" parent={this.tagName} />*/}
            </a>
            <p className="selected-label hidden">
              {/*//at:todo*/}
              {translations.selectLabel}
              {/*<Translation key="selected" parent={this.tagName} />*/}
            </p>
          </div>
        </div>
      );
    }

    private buttonClickHandler = (e: Event) => {
      if (this.btn && this.publicationId) {
        Content.setPublication(this.publicationId);
        e.preventDefault();
        e.stopPropagation();
      }
    };

    //at:todo typeof Publication??
    private renderBadgeComponent(badgeWrapper: HTMLElement, pub: typeof Publication) {
      badgeWrapper.appendChild(
        <BadgeComponent
          isPreview={pub.isPreview() || pub.isLeak()}
          isExpired={pub.isExpired()}
        />
      );
    }
  }
  return PublicationComponent;
};

export default getPublicationComponent;