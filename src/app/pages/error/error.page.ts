import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';

@Component({
    selector: 'error',
    templateUrl: './error.page.html',
    styleUrls: ['./error.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorPage extends BaseComponent implements OnInit {
    public code: string = null;
    constructor(private _activatedRoute: ActivatedRoute) {
        super()
    }
    ngOnInit(): void {
        this.on(this._activatedRoute.paramMap.subscribe(params => {
            let code = +(params.get("code") || 500);
            switch (code) {
                case 404:
                case 403:
                    this.code = code.toString();
                    break;
                default:
                    this.code = "500";
                    break;
            }
        }));
    }
}
