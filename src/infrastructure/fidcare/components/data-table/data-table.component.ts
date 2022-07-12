import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { DataTableColumn, DataTableAction, DataTableColumnAlignment, IDataTableManager } from './types';
import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { BaseComponent } from '../common/base.component';
import { Subscription } from 'rxjs';
import { fuseAnimations } from 'infrastructure/@fuse/animations/public-api';
import { CardItemTableDirective } from './card-item-table.directive';

@Component({
    selector: 'data-table',
    templateUrl: './data-table.component.html',
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./data-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DataTableComponent extends BaseComponent implements OnInit {
    constructor(private _sanitizer: DomSanitizer, private _changeDetectorRef: ChangeDetectorRef) {
        super();
    }

    private _manager: IDataTableManager<any> = null;
    private _managerSubscription: Subscription = null;
	@Input() public defaultActionsNumberToShow: number = 2;
    @Input() public bordered: boolean = true;
    @Input() public columns: DataTableColumn[] = []
    @Input() public actions: DataTableAction[] = []
    @Input() public allowedPageSizes: number[] = [5, 10, 20, 50, 100];
    @Input() public highlightText: string = null;
    @Input() public showList: boolean = true;
    @Input() public forPage: boolean = true;
	@Input() public deletedRow =  (data: any): boolean => { return false; }
    @Input() public get manager() {
        return this._manager;
    }
    @Output() public rowClick: EventEmitter<any> = new EventEmitter<any>();
    public set manager(value: IDataTableManager<any>) {
        this.destroySubscriptions();
        this._manager = value;
        if (value) {
            //Imposto i parametri
            this.pageIndex = this._manager.searchCriteria.page || 0;
            this.pageSize = this._manager.searchCriteria.size || 10;
            this.sortColumn = this._manager.searchCriteria.keySelector;
            this.defaultPager = this.manager.canChangeSize;
            if (this._manager.searchCriteria.ascending === false) {
                this.sortDirection = "desc"
            }
            this._managerSubscription = this.manager.data.subscribe(results => {
                this.items = [...results.data];
                this.totalCount = results.totalCount;
                this._changeDetectorRef.markForCheck();
            });
        }
    }

    public defaultPager: boolean = true;
    public totalCount: number = 10;
    public items: any[] = [];
    public pageIndex: number = 0;
    public pageSize: number = 2;
    public sortColumn: string = null;
    public sortDirection: SortDirection = '';
    public get columnNames() {
        let ret = this.columns.map(m => m.name);
        if (this.actions.length > 0) {
            ret.push("actions");
        }
        return ret;
    }

    @ContentChild(CardItemTableDirective, { read: TemplateRef }) public cardItemTableTemplate: any;

    ngOnInit(): void {
    }

    private search = (reloading: boolean): void => {
        this.manager.searchCallback(this.pageIndex, this.pageSize, reloading, this.sortColumn, this.sortDirection != 'desc');
    }

    public changePagination = (pageEvent: PageEvent): void => {
        this.pageIndex = pageEvent.pageIndex;
        this.pageSize = pageEvent.pageSize;
        this.search(true);
    }

    public changeSort = (sort: Sort): void => {

        this.sortColumn = sort.active;
        this.columns.forEach((v) => {

            if (v.name == sort.active && v.sortableFieldId ){
                console.log(v.sortableFieldId)
                this.sortColumn = v.sortableFieldId;
            }
        })
        this.sortDirection = sort.direction;
        this.search(true);
    }

    public getAlignment = (column: DataTableColumn, index: number): SafeStyle => {
        if (index == 0) {
            return this._sanitizer.bypassSecurityTrustStyle("justify-content:flex-start");
        }
        switch (column.alignment) {
            case DataTableColumnAlignment.CENTER:
                return this._sanitizer.bypassSecurityTrustStyle("justify-content:center");
            case DataTableColumnAlignment.RIGHT:
                return this._sanitizer.bypassSecurityTrustStyle("justify-content:flex-end");
            default:
                return this._sanitizer.bypassSecurityTrustStyle("justify-content:flex-start");
        }
    }

    public onRowClick = (data: any) => {
        this.rowClick.emit(data);
    }

    protected destroy = (): void => {
        this.destroySubscriptions();
    };

	
    private destroySubscriptions = (): void => {
        if (this._managerSubscription) {
            this._managerSubscription.unsubscribe();
            this._managerSubscription = null;
        }
    }

    public setShowList = (showList: boolean): void => {
        this.showList = showList;
    }

    public get firstActions() {
        if (this.actions) return this.actions.slice(0, this.defaultActionsNumberToShow);
        return null;
    }

    public get otherActions() {
        if (this.actions && this.actions.length > this.defaultActionsNumberToShow) return this.actions.slice(this.defaultActionsNumberToShow);
        return null;
    }
}
