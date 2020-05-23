import { User } from "../classes/user";
import { URL_PAGE } from "../services/config";
import { fromEvent, merge } from "rxjs";

export function initSignUpEvents(): void {
    const logInButton: HTMLButtonElement = document.getElementById("sign-up-button") as HTMLButtonElement;
    logInButton.addEventListener("click", signUpButtonClickEvent);
    checkIfPasswordsMatch();
    Array.from(document.querySelectorAll("input[type=password], input[type=text]")).forEach((input) => {
        input.addEventListener("keydown", (event: any) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                logInButton.click();
            }
        });
    });
}

function signUpButtonClickEvent(): void {
    const password: string = (document.getElementById("sign-up-password") as HTMLInputElement).value;
    const repeatPassword: string = (document.getElementById("sign-up-repeat-password") as HTMLInputElement).value;
    const message: HTMLDivElement = document.querySelector(".message") as HTMLDivElement;
    if (password != repeatPassword) {
        message.innerText = "Passwords do not match";
        return;
    }
    const inputArray = [
        ...Array.from(document.querySelectorAll("input[type=text]")),
        ...Array.from(document.querySelectorAll("input[type=password]")),
    ];
    User.signUp(
        inputArray.reduce(
            (acc: any, curr) => {
                const current: HTMLInputElement = curr as HTMLInputElement;
                acc[current.getAttribute("name") as string] = current.value;
                return acc;
            },
            {
                penName: "",
                password: "",
                repeat: "",
            }
        )
    ).then((signUpSuccessful) => {
        if (signUpSuccessful == "success") window.location.href = `${URL_PAGE}login`;
        else message.innerHTML = signUpSuccessful;
    });
}

function checkIfPasswordsMatch(): boolean | void {
    const password = document.getElementById("sign-up-password") as HTMLInputElement;
    const repeatPassword = document.getElementById("sign-up-repeat-password") as HTMLInputElement;
    const passwordObservable$ = fromEvent(password, "input");
    const repeatPasswordObservable$ = fromEvent(repeatPassword, "input");
    merge(passwordObservable$, repeatPasswordObservable$).subscribe((x) => {
        const target = x.target as HTMLInputElement;
        if (target.value != password.value || target.value != repeatPassword.value) {
            password.classList.add("password-missmatch");
            repeatPassword.classList.add("password-missmatch");
        } else {
            if (password.classList.contains("password-missmatch")) password.classList.remove("password-missmatch");
            if (repeatPassword.classList.contains("password-missmatch"))
                repeatPassword.classList.remove("password-missmatch");
        }
    });
}

export function goToSignUp() {
    window.location.href = `${URL_PAGE}signup`;
}
