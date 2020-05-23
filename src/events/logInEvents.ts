import { User } from "../classes/user";
import { URL_PAGE } from "../services/config";

export function initLogInEvents(): void {
    const logInButton: HTMLButtonElement = document.getElementById("log-in-button") as HTMLButtonElement;
    logInButton.addEventListener("click", logInButtonClickEvent);

    (document.getElementById("log-in-pen-name") as HTMLInputElement).addEventListener("keydown", onEnter);
    (document.getElementById("log-in-password") as HTMLInputElement).addEventListener("keydown", onEnter);
    function onEnter(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            event.preventDefault();
            logInButton.click();
        }
    }
}

function logInButtonClickEvent(): void {
    const user: User = new User(
        (document.getElementById("log-in-pen-name") as HTMLInputElement).value,
        (document.getElementById("log-in-password") as HTMLInputElement).value
    );
    const message: HTMLDivElement = document.querySelector(".message") as HTMLDivElement;
    user.logIn().then((result) => {
        message.innerText = "";
        if (typeof result == "number" && result > 0) {
            localStorage.setItem("userId", result.toString());
            window.location.replace(`${URL_PAGE}index`);
        } else if (typeof result == "number" && result <= 0) {
            message.innerHTML = "Wrong pen name or password!";
        } else message.innerHTML = result;
    });
}

export function goToLogin(): void {
    window.location.href = `${URL_PAGE}login`;
}
