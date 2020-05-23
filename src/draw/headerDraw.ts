import { createDivWithClass } from "../fequentlyUsedFunctions";
import { initHeaderClickEvents } from "../events/linkClickEvents";

export function headerDraw(host: HTMLDivElement): void {
    const header: HTMLDivElement = createDivWithClass(host, "header");
    const logo: HTMLDivElement = createDivWithClass(header, "logo");
    createDivWithClass(logo, "logo-text").innerHTML = "WIR";
    const menu: HTMLDivElement = createDivWithClass(header, "menu");
    [
        { title: "Make A Post", id: "make-a-post" },
        { title: localStorage.getItem("userId") == null ? "Log in" : "Log out", id: "log-in" },
    ].forEach((el) => {
        const menuItem: HTMLDivElement = createDivWithClass(menu, "menu-item");
        menuItem.innerHTML = el.title;
        menuItem.id = el.id;
    });
    initHeaderClickEvents();
}
