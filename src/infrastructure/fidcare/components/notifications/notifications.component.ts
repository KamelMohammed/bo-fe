import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../common/base.component';

@Component({
    selector: 'notifications',
    templateUrl: './notifications.component.html'
})
export class NotificationsComponent extends BaseComponent {
    public unreadCount: number = 0;

	public constructor(private _router: Router) {
		super();
	}

	public goToNotification = () => {
 		this._router.navigateByUrl("/md/alert-dashboard");
		
	}
}
