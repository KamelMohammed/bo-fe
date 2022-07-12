import { EventEmitter } from "@angular/core";
import { Injectable } from "@angular/core";

@Injectable()
export class SpinnerService {
    public toggle: EventEmitter<boolean> = new EventEmitter<boolean>();
    public show = (): void => {
        this.toggle.emit(true);
    }
    public hide = (): void => {
        this.toggle.emit(false);
    }
}

