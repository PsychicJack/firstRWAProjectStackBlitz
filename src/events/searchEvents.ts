import { fromEvent, Observable, merge, zip, Subject, Subscription } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { Tag } from "../classes/tag";
import { User } from "../classes/user";
import { Post } from "../classes/post";
import { drawAutocompleteItem } from "../draw/indexDraw";

export function initSearchEvents() {
    const searchBar: HTMLInputElement = document.getElementById("search-bar") as HTMLInputElement;
    const autocomplete: HTMLDivElement = document.querySelector(".autocomplete") as HTMLDivElement;
    const sub = new Subject();
    let subscription: Subscription = Observable.create().subscribe(); // to stop the error: subscription is undefined
    autocompleteEvent().subscribe(sub); // to turn into hot observable
    searchBar.oninput = () => {
        (document.getElementById("search-by") as HTMLSelectElement).dispatchEvent(new Event("change"));
        autocomplete.innerHTML = "";
        subscription.unsubscribe();
        subscription = sub.subscribe((item: any) => {
            if (
                Array.from(document.getElementsByClassName("autocomplete-item"))
                    .map((el) => el.innerHTML)
                    .indexOf(`${item.type}: <span>${item.text}</span>`) == -1
            ) {
                const autocompleteItem: HTMLDivElement = drawAutocompleteItem(autocomplete, item);
                autocompleteItem.onclick = autocompleteItemOnClick;
            }
        });
    };
    (document.getElementById("search-button") as HTMLButtonElement).onclick = serachButtonClick;
    searchBar.addEventListener("keydown", (event) => {
        if (event.keyCode == 13) {
            event.preventDefault();
            serachButtonClick(event);
        }
    });
}

export function autocompleteEvent() {
    const searchBar$: Observable<Event> = fromEvent(document.getElementById("search-bar") as HTMLInputElement, "input");
    const filter$: Observable<Event> = fromEvent(document.getElementById("search-by") as HTMLSelectElement, "change");
    return zip(searchBar$, filter$).pipe(
        map(([searchBar, filter]) => {
            return {
                searchQuery: (searchBar.target as HTMLInputElement).value.toLocaleLowerCase(),
                filter: (filter.target as HTMLSelectElement).value,
            };
        }),
        switchMap((ev) => {
            if (ev.searchQuery != "") {
                if (ev.filter == "Tag") return tags(ev.searchQuery);
                else if (ev.filter == "Author") return users(ev.searchQuery);
                else if (ev.filter == "Title") return posts(ev.searchQuery);
                else return merge(posts(ev.searchQuery), tags(ev.searchQuery), users(ev.searchQuery));
            } else return Observable.create(); //to stop the error: Observable expected
        })
    );
}

function posts(searchQuery: string): any {
    return Post.getStreamOfPostsByBeginingOfTitle(searchQuery).pipe(
        map((post) => {
            return { type: "post", id: (post as Post).id, text: (post as Post).title };
        })
    );
}

function tags(searchQuery: string): any {
    return Tag.getStreamOfTagsThatStartWith(searchQuery).pipe(
        map((tag) => {
            return { type: "tag", id: (tag as Tag).id, text: (tag as Tag).name };
        })
    );
}

function users(searchQuery: string): any {
    return User.getStreamOfUsersByBeginigOfPenName(searchQuery).pipe(
        map((user) => {
            return { type: "user", id: (user as User).id, text: (user as User).penName };
        })
    );
}

function autocompleteItemOnClick(ev: Event): void {
    const searchBar = document.getElementById("search-bar") as HTMLInputElement;
    const query: string = ((ev.currentTarget as HTMLDivElement).querySelector("span") as HTMLSpanElement).innerHTML;
    searchBar.value = query.slice(0, query.indexOf("<br>") >= 0 ? query.indexOf("<br>") : query.length);
    searchBar.dispatchEvent(new Event("input"));
}

export function serachButtonClick(ev: Event): void {
    const search: string = (document.getElementById("search-bar") as HTMLInputElement).value;
    const by: string = (document.getElementById("search-by") as HTMLSelectElement).selectedOptions[0].innerHTML;
    const query: string = `${by}: ${search}`;
    addParamsToUrl(search, by);
    if (query != "") {
        (document.querySelector(".post-cards") as HTMLDivElement).innerHTML = "";
    }
    (document.getElementById("search-query-input") as HTMLInputElement).value = query;
    window.dispatchEvent(new Event("resetsetnumber"));
    window.dispatchEvent(new Event("scroll"));
}

function addParamsToUrl(search: string, by: string) {
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    urlParams.set("search", search);
    urlParams.set("by", by);
    window.history.pushState({ id: 100 }, "Page 2", `?${urlParams.toString()}`);
}
