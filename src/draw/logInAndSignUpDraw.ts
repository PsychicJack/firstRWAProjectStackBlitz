import { createDivWithClass } from "../fequentlyUsedFunctions";
import { goToLogin } from "../events/logInEvents";
import { goToSignUp } from "../events/singUpEvents";

export function logInDraw(host: HTMLDivElement): HTMLDivElement {
    return logInAndSignUpDraw(
        host,
        [
            {
                id: "log-in-pen-name",
                element: "input",
                type: "text",
                class: "log-in-input",
                placeholder: "pen name",
                innerHTML: "Log in",
                name: "",
            },
            {
                id: "log-in-password",
                element: "input",
                type: "password",
                class: "log-in-input",
                placeholder: "password",
                innerHTML: "",
                name: "",
            },
            {
                id: "log-in-button",
                element: "button",
                type: "button",
                class: "log-in-button",
                placeholder: "",
                innerHTML: "Log in",
                name: "",
            },
        ],
        "Go to sign up",
        goToSignUp
    );
}

export function signUpDraw(host: HTMLDivElement): HTMLDivElement {
    return logInAndSignUpDraw(
        host,
        [
            {
                id: "sign-up-pen-name",
                element: "input",
                type: "text",
                class: "log-in-input",
                placeholder: "pen name",
                innerHTML: "Log in",
                name: "penName",
            },
            {
                id: "sign-up-password",
                element: "input",
                type: "password",
                class: "log-in-input",
                placeholder: "password",
                innerHTML: "",
                name: "password",
            },
            {
                id: "sign-up-repeat-password",
                element: "input",
                type: "password",
                class: "log-in-input",
                placeholder: "repeat password",
                innerHTML: "",
                name: "repeat",
            },
            {
                id: "sign-up-button",
                element: "button",
                type: "button",
                class: "log-in-button",
                placeholder: "",
                innerHTML: "Sign Up",
                name: "",
            },
        ],
        "Go to login",
        goToLogin
    );
}

function logInAndSignUpDraw(host: HTMLDivElement, inputs: any[], text: string, onClick: () => any): HTMLDivElement {
    const logIn = createDivWithClass(host, "log-in");
    inputs.forEach((el) => {
        const inputDiv = createDivWithClass(logIn, "input-div");
        const input = inputDiv.appendChild(document.createElement(el.element));
        input.setAttribute("type", el.type);
        input.className = el.class;
        input.setAttribute("placeholder", el.placeholder);
        input.innerHTML = el.innerHTML;
        input.id = el.id;
        input.name = el.name;
    });
    linkToAdifferentPage(host, text, onClick);
    createDivWithClass(host, "message");
    return logIn;
}

function linkToAdifferentPage(host: HTMLDivElement, text: string, onClick: () => any) {
    const goToText: HTMLDivElement = createDivWithClass(createDivWithClass(host, "go-to"), "go-to-text");
    goToText.innerHTML = text;
    goToText.onclick = onClick;
}
