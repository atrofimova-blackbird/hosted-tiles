import { INestedKeys } from "./shared";
// import AppSettings from "../../services/AppSettings";
// import applyStylesToElement from "../../utils/applyStylesToElement";
// import getValue from "../../utils/getValue";

export const DefineCustomElement = (name: string) => (Element: any) =>
  window.customElements.get(name) ||
  window.customElements.define(name, Element);

export interface ICustomElementProps {
  shoppingListMode?: string | boolean;
  itemId?: number;
  itemImageUrl?: string;
  url?: string;
  text?: string;
  className?: string;
  presentation?: string;
}

export type ICustomElementConstructor<
  T extends CustomElement = CustomElement
> = new (props?: ICustomElementProps) => T;

export type ElementStylesCallback = (styles: INestedKeys) => void;

export type PathElement = {
  [path: string]:
    | HTMLElement
    | SVGElement
    | SVGPathElement
    | ElementStylesCallback;
};

export class CustomElement extends HTMLElement {
  public hasConnected: boolean;
  constructor(props?: any) {
    super();
    this.hasConnected = false;
  }
  public adoptedCallback(): void {
    return;
  }
  public connectedCallback(): void {
    if (!this.hasConnected) {
      this.firstConnect();
      this.hasConnected = true;
    }
    this.reConnect();
    return;
  }
  public disconnectedCallback(): void {
    this.disconnect();
    return;
  }
  public attributeChangedCallback(
    attrName?: string,
    oldVal?: string,
    newVal?: string
  ): void {
    return;
  }
  protected firstConnect() {
    return;
  }
  protected reConnect() {
    return;
  }
  protected disconnect() {
    return;
  }

  // protected applyCustomStyles(
  //   pathElement: PathElement,
  //   afterCallback?: () => void
  // ): void {
  //   if (!pathElement) {
  //     return;
  //   }
  //
  //   const styles = AppSettings.getCustomStyles();
  //   Object.entries(pathElement).forEach(([path, element]) => {
  //     if (!path || !element) {
  //       return;
  //     }
  //
  //     if (styles) {
  //       const configStyles = getValue(styles, path);
  //       if (typeof element === "function") {
  //         element(configStyles);
  //       } else {
  //         applyStylesToElement(element, configStyles);
  //         element.setAttribute("data-presentation", path);
  //       }
  //     }
  //   });
  //   if (afterCallback && typeof afterCallback === "function") {
  //     afterCallback();
  //   }
  // }
}
