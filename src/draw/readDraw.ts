import { createDivWithClass } from "../fequentlyUsedFunctions";
import { Post } from "../classes/post";

export function readDraw(host: HTMLDivElement, id: number): void {
    Post.getPostById(id).then((post: Post) => {
        titleDraw(host, post.title);
        createDivWithClass(host, "read").innerHTML = post.text;
    });
}

function titleDraw(host: HTMLDivElement, title: string): HTMLDivElement {
    const titleDiv = createDivWithClass(host, "title");
    titleDiv.innerHTML = title;
    return titleDiv;
}

function pageSelectorDraw(host: HTMLDivElement): HTMLDivElement {
    const pageSelector: HTMLDivElement = createDivWithClass(host, "page-selector");
    [
        {
            innerHTML: "<",
            element: "button",
        },
        {
            innerHTML: "",
            element: "input",
        },
        {
            innerHTML: ">",
            element: "button",
        },
    ].forEach((el) => {
        const input = createDivWithClass(pageSelector, "page-selector-item").appendChild(
            document.createElement(el.element)
        );
        input.innerHTML = el.innerHTML;
    });

    return pageSelector;
}
