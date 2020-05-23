import { headerDraw } from "./src/draw/headerDraw";
import { createDivWithClass } from "./src/fequentlyUsedFunctions";
import { indexDraw } from "./src/draw/indexDraw";
import { logInDraw, signUpDraw } from "./src/draw/logInAndSignUpDraw";
import { makeAPostDraw } from "./src/draw/makeAPostDraw";
import { readDraw } from "./src/draw/readDraw";
import { NotFound404Draw } from "./src/draw/NotFound404Draw";
import { initLogInEvents } from "./src/events/logInEvents";
import { initSignUpEvents } from "./src/events/singUpEvents";
import { postCardEventsInit } from "./src/events/postCardsEvents";
import { initSearchEvents, serachButtonClick } from "./src/events/searchEvents";
import { initMakeAPostEvents } from "./src/events/makeAPostEvents";

const main = createDivWithClass(document.body, "main");
const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
const page: string | undefined = urlParams.get("page")?.toLowerCase();
main.innerHTML = "";
if (page == "index" || page == "" || page == undefined) {
    headerDraw(main);
    indexDraw(main);
    cssSetHref("style/header.css", "style/index.css");
    const searchQuery: string | null = urlParams.get("search");
    const searchBy: string | null = urlParams.get("by");
    if (searchQuery != null && searchBy != null) {
        try {
            (document.getElementById("search-query-input") as HTMLInputElement).value = searchQuery;
            (document.getElementById("search-bar") as HTMLInputElement).value = searchQuery;
            (document.getElementById("search-by") as HTMLSelectElement).value = searchBy;
            serachButtonClick(new Event("searchfromurl"));
        } catch (err) {
            console.log(err);
        }
    }
    postCardEventsInit("a", document.querySelector(".post-cards") as HTMLDivElement);
    initSearchEvents();
} else if (page == "login") {
    logInDraw(main);
    cssSetHref("", "style/logIn.css");
    initLogInEvents();
} else if (page == "signup") {
    signUpDraw(main);
    cssSetHref("", "style/logIn.css");
    initSignUpEvents();
} else if (page == "makeapost" || page == "make" || page == "create" || page == "createapost") {
    headerDraw(main);
    makeAPostDraw(main);
    cssSetHref("style/header.css", "style/makeAPost.css");
    initMakeAPostEvents();
} else if (page == "read" || page == "readpost") {
    headerDraw(main);
    readDraw(main, +(urlParams.get("id") as string));
    cssSetHref("style/header.css", "style/read.css");
} else {
    headerDraw(main);
    NotFound404Draw(main);
    cssSetHref("style/header.css", "style/notFound404.css");
}

function cssSetHref(header: string, mainStyle: string): void {
    document.querySelector("#css-header")?.setAttribute("href", header);
    document.querySelector("#css")?.setAttribute("href", mainStyle);
}
