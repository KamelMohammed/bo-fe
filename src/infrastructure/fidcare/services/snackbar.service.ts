import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class SnackBarService {
    constructor(private _matSnackBar: MatSnackBar, private _translateService: TranslateService) {
    }

    public success = (message: string, params: Object = null): void => {
        this.show(message, params);
    }

    public operationSuccesfull = (): void => {
        this.show("common.operationSuccessfull", null);
    }
    public info = (message: string, params: Object = null): void => {
        this.show(message, params);
    }
    public error = (message: string, params: Object = null): void => {
        this.show(message, params, ["warn"]);
    }

    public show = (message: string, params: Object, panelClasses: string[] = ["green", "fuse-white-fg", "snack-text-color"]): void => {
		if (message) {
			let translatedMessage = this._translateService.instant(""+message, params)
			this._matSnackBar.open(translatedMessage, this._translateService.instant("common.close"), {
				verticalPosition: 'bottom',
				duration: 5000,
				panelClass: panelClasses
			});
		}
		else {
			console.warn("Warning. Requested to show a null message");
		}
		
		

    }
}