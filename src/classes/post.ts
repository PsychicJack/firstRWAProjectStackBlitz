import { createDivWithClass } from "../fequentlyUsedFunctions";
import { URL_POSTS, NUMBER_OF_CARDS_PER_LOAD } from "../services/config";
import { postCardClickEvent, postCardEventsInit } from "../events/postCardsEvents";
import { Observable } from "rxjs";
import { User } from "./user";
import { Tag } from "./tag";

export class Post {
    id: number;
    title: string;
    text: string;
    author: number;
    tags: number[];

    constructor(id: number, title: string, text: string, author: number, tags: number[] = []) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.author = author;
        this.tags = tags;
    }

    drawCard(host: HTMLDivElement): HTMLDivElement {
        const postCard: HTMLDivElement = createDivWithClass(host, "post-card");
        createDivWithClass(postCard, "post-card-title").innerHTML = this.title;
        const author: HTMLDivElement = createDivWithClass(postCard, "post-card-author");
        User.getUserById(this.author).then((user) => {
            author.innerHTML = `Written by: ${user.penName}`;
        });
        createDivWithClass(postCard, "post-card-page").innerHTML = this.text;
        const input: HTMLInputElement = postCard.appendChild(document.createElement("input"));
        input.type = "hidden";
        input.value = `${this.id}`;
        host.addEventListener("click", postCardClickEvent);
        return postCard;
    }

    draw(host: HTMLDivElement): HTMLDivElement {
        const post: HTMLDivElement = createDivWithClass(host, "post");
        createDivWithClass(post, "post-title").innerHTML = this.title;
        createDivWithClass(post, "post-page").innerHTML = this.text;
        return post;
    }

    async publish(): Promise<boolean> {
        if (this.title == "" || this.text == "" || this.author <= 0) return false;
        return new Promise((resolve) => {
            return resolve(
                fetch(`${URL_POSTS}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: this.title,
                        authorId: this.author,
                        text: this.text,
                        tags: this.tags,
                    }),
                })
                    .then(() => {
                        return true;
                    })
                    .catch((err) => {
                        console.log(err);
                        return false;
                    })
            );
        });
    }

    static getNextCards(
        setNumber: number,
        searchQuery: string = "",
        numberOfCards: number = NUMBER_OF_CARDS_PER_LOAD
    ): Promise<Post[]> {
        const type: string = searchQuery.slice(0, searchQuery.indexOf(":"));
        const search: string = searchQuery.slice(searchQuery.indexOf(":") + 2);

        if (search == "") {
            return Post.searchResultsForNon(setNumber, numberOfCards);
        } else {
            if (type == "Title") {
                return Post.serachResultsForTitle(setNumber, search, numberOfCards);
            } else if (type == "Author") {
                return Post.serachResultsForAuthor(setNumber, search, numberOfCards);
            } else if (type == "Tag") {
                return Post.serachResultsForTag(setNumber, search, numberOfCards);
            } else {
                return Post.serachResultsForAll(setNumber, search, numberOfCards);
            }
        }
    }

    private static searchResultsForNon(
        setNumber: number,
        numberOfCards: number = NUMBER_OF_CARDS_PER_LOAD
    ): Promise<Post[]> {
        return new Promise((resovle, reject) => {
            return resovle(
                fetch(URL_POSTS)
                    .then((result) => result.json())
                    .then((data) => {
                        return (JSON.parse(JSON.stringify(data)) as any[])
                            .slice((setNumber - 1) * numberOfCards, (setNumber - 1) * numberOfCards + numberOfCards)
                            .map((el) => new Post(el.id, el.title, el.text, el.authorId));
                    })
            );
        });
    }

    private static serachResultsForAll(
        setNumber: number,
        search: string = "",
        numberOfCards: number = NUMBER_OF_CARDS_PER_LOAD
    ): Promise<Post[]> {
        return Promise.all([
            Post.serachResultsForTitle(1, search, 1000),
            Post.serachResultsForAuthor(1, search, 1000),
            Post.serachResultsForTag(1, search, 1000),
        ]).then((arr) => {
            let posts: Post[] = [];

            arr.forEach((el) => (posts = posts.concat(el)));

            return posts
                .filter(
                    (value, index, self) =>
                        self
                            .map((el) => {
                                return `${el.id}${el.author}${el.tags}${el.text}${el.title}`;
                            })
                            .indexOf(`${value.id}${value.author}${value.tags}${value.text}${value.title}`) == index
                )
                .slice((setNumber - 1) * numberOfCards, (setNumber - 1) * numberOfCards + numberOfCards);
        });
    }

    private static serachResultsForAuthor(
        setNumber: number,
        search: string = "",
        numberOfCards: number = NUMBER_OF_CARDS_PER_LOAD
    ): Promise<Post[]> {
        return User.getUserIdsByBeginingOfPenName(search).then((ids) => {
            return Promise.all(ids.map((id) => Post.getPostsByAuthorId(id))).then((data) => {
                let arr: Post[] = [];
                data.forEach((el) => (arr = arr.concat(el)));
                return arr.slice((setNumber - 1) * numberOfCards, (setNumber - 1) * numberOfCards + numberOfCards);
            });
        });
    }
    private static serachResultsForTitle(
        setNumber: number,
        search: string = "",
        numberOfCards: number = NUMBER_OF_CARDS_PER_LOAD
    ): Promise<Post[]> {
        return Post.getPostsByBeginingOfTitle(search).then((posts) => {
            return posts.slice((setNumber - 1) * numberOfCards, (setNumber - 1) * numberOfCards + numberOfCards);
        });
    }
    private static serachResultsForTag(
        setNumber: number,
        search: string = "",
        numberOfCards: number = NUMBER_OF_CARDS_PER_LOAD
    ): Promise<Post[]> {
        return Tag.getTagIdsByBeginigOfTagName(search).then((ids) => {
            return Promise.all(ids.map((id) => Post.getPostsByTagId(id))).then((data) => {
                let arr: Post[] = [];
                data.forEach((el) => (arr = arr.concat(el)));
                return arr.slice((setNumber - 1) * numberOfCards, (setNumber - 1) * numberOfCards + numberOfCards);
            });
        });
    }

    static getPostById(id: number): Promise<any> {
        return new Promise((res, rej) => {
            return res(
                fetch(`${URL_POSTS}/${id}`)
                    .then((result) => result.json())
                    .then((data) => {
                        return data;
                    })
            );
        });
    }

    private static getPostsByCustomUrl(url: string): Promise<Post[]> {
        return new Promise((res, rej) => {
            return res(
                fetch(url)
                    .then((result) => result.json())
                    .then((data) => {
                        return JSON.parse(JSON.stringify(data)).map((el: any) => {
                            return new Post(el.id, el.title, el.text, el.authorId, el.tags);
                        });
                    })
            );
        });
    }

    private static getPostsByBeginingOfTitle(beginingOfTitle: string): Promise<Post[]> {
        return Post.getPostsByCustomUrl(`${URL_POSTS}?title_like=${beginingOfTitle}`).then((posts) => {
            return posts.filter((post) => post.title.toLowerCase().startsWith(beginingOfTitle.toLowerCase()));
        });
    }

    private static getAllPosts(): Promise<Post[]> {
        return Post.getPostsByCustomUrl(URL_POSTS);
    }

    static getStreamOfPostsByBeginingOfTitle(beginingOfTitle: string): any {
        return Observable.create((observer: any) => {
            Post.getAllPosts().then((data) => {
                JSON.parse(JSON.stringify(data))
                    .filter((el: any) => el.title.toLowerCase().startsWith(beginingOfTitle))
                    .forEach((element: any) => {
                        observer.next(element);
                    });
            });
        });
    }

    static getPostsByTagId(tagId: number): Promise<Post[]> {
        return Post.getPostsByCustomUrl(`${URL_POSTS}?tags_like=${tagId}`).then((el) => {
            console.log(el);
            return el.filter((x) => x.tags.includes(tagId));
        });
    }

    static getPostsByAuthorId(authorId: number): Promise<Post[]> {
        return Post.getPostsByCustomUrl(`${URL_POSTS}?authorId=${authorId}`).then((el) => {
            return el;
        });
    }

    static getNextCardsFromArray(setNumber: number, array: Post[], numberOfCards: number = NUMBER_OF_CARDS_PER_LOAD) {
        return array
            .slice((setNumber - 1) * numberOfCards, (setNumber - 1) * numberOfCards + numberOfCards)
            .map((el) => new Post(el.id, el.title, el.text, el.author, el.tags));
    }
}
