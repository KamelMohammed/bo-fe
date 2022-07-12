import { Component, OnDestroy } from '@angular/core';
import { SubscriptionLike } from 'rxjs';

@Component({
    template: ''
})
export class BaseComponent implements OnDestroy {
    private _subscriptions: SubscriptionLike[] = [];


    ngOnDestroy(): void {
        this.deleteSubscriptions();
        this.destroy();
    }

    protected deleteSubscriptions = (): void => {
        while (this._subscriptions.length > 0) {
            this._subscriptions[0].unsubscribe();
            this._subscriptions.shift();
        }
    }

    protected on = <T>(subscription: SubscriptionLike): SubscriptionLike => {
        this._subscriptions.push(subscription);
        return subscription;
    }

    protected off = <T>(subscription: SubscriptionLike): void => {
        this._subscriptions = this._subscriptions.filter(f => f != subscription);
        subscription.unsubscribe();
    }


    protected destroy = (): void => {

    };
}