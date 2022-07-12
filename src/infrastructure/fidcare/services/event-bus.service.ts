import { EventEmitter, Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { NotificationMessage } from "../models/common.models";

@Injectable()
export class EventBusService {
    private message$: EventEmitter<NotificationMessage> = new EventEmitter();
    public subscribe = <T extends NotificationMessage>(code: string, callback: (message: T) => void): Subscription => {
		return this.message$.pipe(
			filter((message) => {
				return message.code == code;
			})
        ).subscribe((message) => {
			callback(<any>message)
		});
    }

    public emit = (message: NotificationMessage): void => {
        this.message$.emit(message);
    }
}
