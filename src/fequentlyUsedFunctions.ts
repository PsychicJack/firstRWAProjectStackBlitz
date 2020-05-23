import { COLORS_ARRAY } from "./services/config";

export function createDivWithClass(host: HTMLElement, className: string = ""): HTMLDivElement {
    const div: HTMLDivElement = host.appendChild(document.createElement("div"));
    div.className = className;
    return div;
}

export function notSoRandomRandomColorGenerator(): string {
    return COLORS_ARRAY[Math.floor(Math.random() * COLORS_ARRAY.length)];
}
