import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class TitleService {
    public title$: ReplaySubject<string> = new ReplaySubject<string>(null);

}