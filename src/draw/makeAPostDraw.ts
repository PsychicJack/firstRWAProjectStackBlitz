import { createDivWithClass } from "../fequentlyUsedFunctions";
import { Tag } from "../classes/tag";
import { addTagClick, publishClick } from "../events/makeAPostEvents";

export function makeAPostDraw(host: HTMLDivElement): HTMLDivElement {
    const makeAPost: HTMLDivElement = createDivWithClass(host, "make-a-post");
    (toolBarDraw(makeAPost).querySelector(".publish") as HTMLButtonElement).onclick = publishClick;
    titleEditorDraw(makeAPost).addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            editor.focus();
        }
    });
    const editor: HTMLDivElement = editorDraw(makeAPost);
    (window.onresize = () => {
        editor.style.height = `${document.documentElement.clientHeight - 173}px`;
    })();
    tagsDraw(makeAPost);
    return makeAPost;
}

function toolBarDraw(host: HTMLDivElement): HTMLDivElement {
    const toolBar: HTMLDivElement = createDivWithClass(host, "toolbar");
    [
        {
            id: "bold",
            innerHTML: "<b>B</b>",
            class: "tool",
        },
        {
            id: "italic",
            innerHTML: "<i>I</i>",
            class: "tool",
        },
        {
            id: "underline",
            innerHTML: "<u>U</u>",
            class: "tool",
        },
        {
            id: "publish",
            innerHTML: "Publish",
            class: "publish",
        },
    ].forEach((el) => {
        const button = createDivWithClass(toolBar, el.class).appendChild(document.createElement("button"));
        button.id = el.id;
        button.innerHTML = el.innerHTML;
    });
    return toolBar;
}

function titleEditorDraw(host: HTMLDivElement): HTMLDivElement {
    const titleEditor: HTMLDivElement = createDivWithClass(host, "title-editor");
    titleEditor.contentEditable = "true";
    titleEditor.innerHTML = "Input title here";
    return titleEditor;
}

function editorDraw(host: HTMLDivElement): HTMLDivElement {
    const editor: HTMLDivElement = createDivWithClass(host, "editor");
    editor.contentEditable = "true";
    return editor;
}

function tagsDraw(host: HTMLDivElement): HTMLDivElement {
    const tagsDiv: HTMLDivElement = createDivWithClass(host, "tags-div");
    const selectTag: HTMLSelectElement = tagsDiv.appendChild(document.createElement("select"));
    selectTag.addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            button.click();
        }
    });
    selectTag.className = "select-tag";
    Tag.getStreamOfTags().subscribe((tag: Tag) => {
        const option = selectTag.appendChild(document.createElement("option"));
        option.innerHTML = tag.name;
        option.value = tag.id.toString();
        option.setAttribute("colorholder", tag.color);
        //option.style.backgroundColor = tag.color;
    });
    const button: HTMLButtonElement = tagsDiv.appendChild(document.createElement("button"));
    button.className = "add-button";
    button.innerHTML = "Add";
    button.onclick = addTagClick;
    return tagsDiv;
}
