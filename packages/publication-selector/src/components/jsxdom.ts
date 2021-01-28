import { CustomElement } from "./CustomElement/index";

export default function createElement(
  tag: string | typeof CustomElement,
  props?: any,
  ...children: any[]
) {
  let el: HTMLElement;
  if (typeof tag === "string") {
    el = document.createElement(tag);
  } else if (typeof tag === "function") {
    // In theory we could support non-class functions, but it's outside of scope
    // for now
    el = new tag(props);
  } else {
    throw new TypeError();
  }

  const propKeys = props && typeof props === "object" ? Object.keys(props) : [];

  propKeys.forEach((i) => applyProperty(el, i, props[i]));

  children.forEach((i) => appendChild(el, i));

  return el;
}

function applyProperty(el: Element, key: any, value: any) {
  if (key === "children" && isChild(value)) {
    appendChild(el, value);
  } else if (key === "className") {
    el.className = value;
  } else {
    el.setAttribute(key, value);
  }
}

function isChild(value: any): boolean {
  const valueType = typeof value;
  switch (valueType) {
    case "string":
    case "number":
      return true;
    default:
      return (
        value instanceof HTMLElement ||
        (value instanceof Array && value.every((i) => isChild(i)))
      );
  }
}

function appendChild(
  parentNode: Node,
  value: string | number | HTMLElement | any[]
) {
  if (typeof value === "string") {
    parentNode.appendChild(document.createTextNode(value));
  } else if (typeof value === "number") {
    parentNode.appendChild(document.createTextNode(value.toString()));
  } else if (value instanceof HTMLElement) {
    parentNode.appendChild(value);
  } else if (Array.isArray(value)) {
    value.forEach((i) => appendChild(parentNode, i));
  }
}
