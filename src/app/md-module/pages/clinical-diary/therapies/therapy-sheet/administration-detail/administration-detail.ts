import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AdministrationDetailsTOResponse } from 'app/services/api/atm';
import * as moment from 'moment';


@Component({
    selector: 'app-administration-detail-dialog',
    templateUrl: 'administration-detail.html',
})
export class AdministrationDetailDialogComponent {

    public state: String;
    public administrationDateTime: String;
    public detail: AdministrationDetailsTOResponse;
    constructor(private _translateService: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: { result: AdministrationDetailsTOResponse }
    ) {
        this.detail = data.result;
        this.state = this._translateService.instant("enums.AdministrationStatus." + this.detail.administration.state)
        this.administrationDateTime = this.state === 'Somministrato' ? 
                                        moment(this.detail.administration.actualDateAdministration).format('DD/MM/YYYY') + ' ' + 
                                        moment(this.detail.administration.actualTimeAdministration.toString(), [moment.ISO_8601, 'HH:mm']).format('HH:mm'): '';
    }
}