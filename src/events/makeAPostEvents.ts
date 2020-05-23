import { Tag } from "../classes/tag";
import { Post } from "../classes/post";
import { URL_PAGE } from "../services/config";

export function initMakeAPostEvents(): void {
    const editor: HTMLDivElement = document.querySelector(".editor") as HTMLDivElement;
    editor.focus();
    initBoldClick(editor);
    initItalicClick(editor);
    initUnderLineClick(editor);
}

function initBoldClick(editor: HTMLDivElement) {
    (document.getElementById("bold") as HTMLButtonElement).onclick = () => {
        document.execCommand("bold", false, undefined);
        editor.focus();
    };
}

function initItalicClick(editor: HTMLDivElement) {
    (document.getElementById("italic") as HTMLButtonElement).onclick = () => {
        document.execCommand("italic", false, undefined);
        editor.focus();
    };
}

function initUnderLineClick(editor: HTMLDivElement) {
    (document.getElementById("underline") as HTMLButtonElement).onclick = () => {
        document.execCommand("underline", false, undefined);
        editor.focus();
    };
}

export function addTagClick(ev: Event): void {
    const tagsDiv: HTMLDivElement = document.querySelector(".tags-div") as HTMLDivElement;
    const selectTag: HTMLSelectElement = document.querySelector(".select-tag") as HTMLSelectElement;
    const tag: Tag = new Tag(
        +selectTag.value,
        selectTag.selectedOptions[0].innerHTML,
        selectTag.selectedOptions[0].getAttribute("colorholder") as string
    );
    if (
        Array.from(tagsDiv.querySelectorAll("input[type=hidden]")).find(
            (input: any) => input.value == selectTag.value
        ) == undefined
    ) {
        const tagDiv: HTMLDivElement = tag.draw(tagsDiv);
        tagDiv.onclick = () => {
            tagDiv.remove();
        };
    }
}

export function publishClick(ev: Event): void {
    if (localStorage.getItem("userId") != null) {
        new Post(
            0,
            (document.querySelector(".title-editor") as HTMLDivElement).innerHTML,
            (document.querySelector(".editor") as HTMLDivElement).innerHTML,
            +(localStorage.getItem("userId") as string),
            Array.from(document.querySelectorAll(".tag input[type=hidden]")).map((el: any) => el.value)
        )
            .publish()
            .then((ok) => {
                if (ok) window.location.href = `${URL_PAGE}index`;
            });
    }
}
