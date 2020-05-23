import { createDivWithClass } from "../fequentlyUsedFunctions";
import { Post } from "../classes/post";
import { Tag } from "../classes/tag";
import { take } from "rxjs/operators";
import { NUMBER_OF_TAGS_ON_INDEX, URL_PAGE } from "../services/config";

export function indexDraw(host: HTMLDivElement): void {
    presentationDraw(host);
    searchDraw(host);
    createDivWithClass(host, "post-cards");
}

function presentationDraw(host: HTMLDivElement): HTMLDivElement {
    const presentation: HTMLDivElement = createDivWithClass(host, "presentation");
    nameDraw(presentation);
    tagsContainerDraw(presentation);
    return presentation;
}

function nameDraw(host: HTMLDivElement): HTMLDivElement {
    const name: HTMLDivElement = createDivWithClass(host, "name");
    const bigWir: HTMLDivElement = createDivWithClass(name, "big-wir");
    bigWir.innerHTML = "WIR";
    const fullName: HTMLDivElement = createDivWithClass(name, "full-name");
    fullName.innerHTML = "write imagine read";
    return name;
}

function tagsContainerDraw(host: HTMLDivElement): HTMLDivElement {
    const tagsContainer: HTMLDivElement = createDivWithClass(host, "tags-container");
    const tags: HTMLDivElement = createDivWithClass(tagsContainer, "tags");
    Tag.getStreamOfTags()
        .pipe(take(NUMBER_OF_TAGS_ON_INDEX))
        .subscribe((tag: Tag) => {
            tag.draw(tags).onclick = () => {
                window.location.href = `${URL_PAGE}index&search=${tag.name}&by=Tag`;
            };
        });
    return tagsContainer;
}

function searchDraw(host: HTMLDivElement): HTMLDivElement {
    const search: HTMLDivElement = createDivWithClass(host, "search");
    /*createDivWithClass(search, "search-instructions").innerHTML = "Search by tags, titles and users";*/
    const searchBarDiv: HTMLDivElement = createDivWithClass(search, "search-bar-div");
    drawSearchBy(searchBarDiv);
    const searchBar: HTMLInputElement = searchBarDiv.appendChild(document.createElement("input"));
    searchBar.id = "search-bar";
    searchBar.placeholder = "Search by tags, titles and users";
    const serachButton: HTMLButtonElement = searchBarDiv.appendChild(document.createElement("button"));
    serachButton.innerHTML = "Serach";
    serachButton.id = "search-button";
    createDivWithClass(search, "autocomplete");
    const searchQueryInput: HTMLInputElement = search.appendChild(document.createElement("input"));
    searchQueryInput.id = "search-query-input";
    searchQueryInput.type = "hidden";
    return search;
}

export function postCardsDraw(host: HTMLDivElement, posts: Post[]): HTMLDivElement {
    posts.forEach((post) => {
        post.drawCard(host);
    });
    return host;
}

function drawSearchBy(host: HTMLDivElement): HTMLSelectElement {
    const searchBy: HTMLSelectElement = host.appendChild(document.createElement("select"));
    searchBy.id = "search-by";
    ["All", "Title", "Tag", "Author"].forEach((el) => {
        const option: HTMLOptionElement = searchBy.appendChild(document.createElement("option"));
        option.innerHTML = el;
        option.value = el;
    });
    return searchBy;
}

/*function drawAutocomplete(host: HTMLDivElement, items: any[]): HTMLDivElement {
    //items.forEach((item) => drawAutocompleteItem(autocomplete, item));
    return autocomplete;
}*/

export function drawAutocompleteItem(host: HTMLDivElement, item: any): HTMLDivElement {
    const autocompleteItem: HTMLDivElement = createDivWithClass(host, "autocomplete-item");
    const hiddenType = autocompleteItem.appendChild(document.createElement("input"));
    const hiddenId = autocompleteItem.appendChild(document.createElement("input"));
    hiddenType.type = hiddenId.type = "hidden";
    hiddenType.value = item.type;
    hiddenId.value = item.id;
    autocompleteItem.innerHTML = `${item.type}: <span>${item.text}</span>`;
    return autocompleteItem;
}
