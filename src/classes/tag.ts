import { URL_TAGS } from "../services/config";
import { notSoRandomRandomColorGenerator, createDivWithClass } from "../fequentlyUsedFunctions";
import { Observable } from "rxjs";

export class Tag {
    id: number;
    name: string;
    color: string;

    constructor(id: number, name: string, color: string) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

    static getTagById(id: number): Promise<Tag> {
        return new Promise((resovle, reject) => {
            return resovle(
                fetch(`${URL_TAGS}/${id}`)
                    .then((response) => response.json())
                    .then((data) => {
                        return new Tag(data.id, data.name, notSoRandomRandomColorGenerator());
                    })
                /*.catch((x) => {
                        console.log("greska");
                        return new Tag(1, "s", "");
                    })*/
            );
        });
    }

    static getTagIdsByBeginigOfTagName(beginingOfTagName: string): Promise<number[]> {
        return new Promise((resolve, reject) => {
            return resolve(
                fetch(`${URL_TAGS}?name_like=${beginingOfTagName}`)
                    .then((response) => response.json())
                    .then((data) => {
                        return JSON.parse(JSON.stringify(data))
                            .filter((tag: any) => tag.name.toLowerCase().startsWith(beginingOfTagName.toLowerCase()))
                            .map((tag: any) => {
                                return tag.id;
                            });
                    })
            );
        });
    }

    private static getAllTagsFromDataBase(): Promise<Tag[]> {
        return new Promise((resolve, reject) => {
            return resolve(
                fetch(`${URL_TAGS}`)
                    .then((response) => response.json())
                    .then((data) => {
                        return JSON.parse(JSON.stringify(data)).map(
                            (tag: any) => new Tag(tag.id, tag.name, notSoRandomRandomColorGenerator())
                        );
                    })
            );
        });
    }

    draw(host: HTMLDivElement): HTMLDivElement {
        const tagDiv: HTMLDivElement = createDivWithClass(host, "tag");
        tagDiv.innerHTML = this.name;
        tagDiv.style.backgroundColor = this.color;
        const idInput = tagDiv.appendChild(document.createElement("input"));
        idInput.type = "hidden";
        idInput.value = this.id.toString();
        return tagDiv;
    }

    static getStreamOfTags(): any {
        return Observable.create((observer: any) => {
            Tag.getAllTagsFromDataBase().then((tags) => {
                tags.forEach((tag: Tag) => {
                    observer.next(tag);
                });
            });
        });
        //return from(Tag.getAllTagsFromDataBase();
    }

    static getStreamOfTagsThatStartWith(startsWith: string): any {
        return Observable.create((observer: any) => {
            Tag.getAllTagsFromDataBase().then((data) => {
                (data as Tag[])
                    .filter((el) => el.name.toLowerCase().startsWith(startsWith))
                    .forEach((tag: Tag) => observer.next(tag));
            });
        });
    }
}
