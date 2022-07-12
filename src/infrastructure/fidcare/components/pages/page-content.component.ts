import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TitleService } from 'infrastructure/fidcare/services/title.service';
import { BaseComponent } from '../common/base.component';

@Component({
    selector: 'page-content',
    templateUrl: './page-content.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PageContentComponent extends BaseComponent implements OnInit {
    @Input() public contentMargin: number = 6;
    @Input() public contentClass: string = null;
    private _label: string = null;
	@Input() public set label(label:string) {
		this._label = label;
		this._titleService.title$.next(this.label);
	}
	public get label(): string {
		return this._label;
	}

    constructor(private _titleService: TitleService) {
        super()
    }
    ngOnInit(): void {
        this._titleService.title$.next(this._label);
    }

    public get contentCssClass(): string {
        let ret = `m-${this.contentMargin}`;
        if (this.contentClass) {
            ret = ret + " " + this.contentClass;
        }
        return ret;
    }
}
