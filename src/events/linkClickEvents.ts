import { URL_PAGE } from "../services/config";

export function initHeaderClickEvents(): void {
    (document.getElementById("log-in") as HTMLDivElement).onclick = () => {
        if (localStorage.getItem("userId") == null) {
            window.location.href = `${URL_PAGE}login`;
        } else {
            localStorage.removeItem("userId");
            window.location.replace(`${URL_PAGE}index`);
        }
    };
    (document.getElementById("make-a-post") as HTMLDivElement).onclick = () => {
        window.location.href = `${URL_PAGE}make`;
    };
    (document.querySelector(".logo-text") as HTMLDivElement).onclick = () => {
        window.location.href = `${URL_PAGE}index`;
    };
}
