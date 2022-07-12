import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataTableColumn, DataTableAction, DataTableColumnAlignment, ListTableManager } from './types';
import { Sort, SortDirection } from '@angular/material/sort';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { BaseComponent } from '../common/base.component';
import { SubscriptionLike } from 'rxjs';
import { SortCriteria } from '../../models/common.models';
import { fuseAnimations } from 'infrastructure/@fuse/animations/public-api';

@Component({
    selector: 'list-table',
    templateUrl: './list-table.component.html',
    animations: fuseAnimations,
    styleUrls: ['./data-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTableComponent extends BaseComponent implements OnInit {
    constructor(private _sanitizer: DomSanitizer, private _changeDetectorRef: ChangeDetectorRef) {
        super();
    }
	@Input() public defaultActionsNumberToShow: number = 2;
    @Input() public bordered: boolean = true;
    @Input() public forPage: boolean = true;
    @Input() public columns: DataTableColumn[] = []
    @Input() public actions: DataTableAction[] = []
	@Input() public deletedRow =  (data: any): boolean => { return false; }
    @Input()
    public get manager() {
        return this._manager;
    }
    public set manager(value: ListTableManager) {
        this.destroSubscriptions();
        this._manager = value;
        this._managerSubscription = this._manager.data.subscribe(result => {
            this.items = [...result.data];
            this._changeDetectorRef.markForCheck();
        });
    }
    @Output() public rowClick: EventEmitter<any> = new EventEmitter<any>();

    public sortColumn: string = null;
    public sortDirection: SortDirection = '';
    public items: any[] = [];
    private _manager: ListTableManager = null;
    private _managerSubscription: SubscriptionLike = null;


    public get columnNames() {
        let ret = this.columns.map(m => m.name);
        if (this.actions.length > 0) {
            ret.push("actions");
        }
        return ret;
    }

    ngOnInit(): void {
        //Imposto i parametri
        this.sortColumn = this.manager.sortCriteria.keySelector;
        if (this.manager.sortCriteria.ascending === false) {
            this.sortDirection = "desc"
        }
    }

    public changeSort = (sort: Sort): void => {
        this.sortColumn = sort.active;
        this.sortDirection = sort.direction;
        let sortCriteria = new SortCriteria();
        sortCriteria.ascending = sort.direction == "asc";
        sortCriteria.keySelector = sort.active;
        this.manager.search(sortCriteria);
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

    private destroSubscriptions = (): void => {
        if (this._managerSubscription != null) {
            this.off(this._managerSubscription);
            this._managerSubscription = null;
        }
    }

    protected destroy = (): void => {
        this.destroSubscriptions();
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
