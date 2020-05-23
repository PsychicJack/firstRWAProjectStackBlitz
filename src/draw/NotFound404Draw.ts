import { createDivWithClass } from "../fequentlyUsedFunctions";
import { of, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";

export function NotFound404Draw(host: HTMLDivElement): void {
    const fourOFour: HTMLDivElement = createDivWithClass(host, "four-o-four");
    const stop$ = new Subject();
    of(4, 0, 4, 0, 4, 0, 4)
        .pipe(
            map((item) => item.toString()),
            takeUntil(stop$)
        )
        .subscribe((num) => {
            fourOFour.innerHTML += num;
            if (fourOFour.innerHTML == "404") stop$.next("stop");
        });
    createDivWithClass(host, "not-found").innerHTML = "Not Found";
}
