import { Directive, ViewContainerRef, Input, OnInit, ComponentFactoryResolver, OnDestroy, ComponentRef } from '@angular/core';
import { DataTableCellTemplateComponent } from '../components/data-table/data-table-cell-template.component';
import { DataTableColumn } from '../components/data-table/types';

// @dynamic
@Directive({
    selector: '[dataTableCellTemplate]',
})
export class DataTableCellTemplateDirective implements OnInit, OnDestroy {
    constructor(public viewContainerRef: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) {

    }
    @Input('dataTableCellTemplate') column: DataTableColumn;

    private _rowData: any = null;
    public get rowData(): any {
        return this._rowData;
    }
    @Input('dataTableCellTemplateRowData')
    public set rowData(value: any) {
        this._rowData = value;
        this.updateComponent();
    }

    private componentRef: ComponentRef<DataTableCellTemplateComponent> = null;;

    private updateComponent = (): void => {
        if (this.componentRef) {
            this.componentRef.instance.col = this.column;
            this.componentRef.instance.row = this.rowData;
            this.componentRef.instance.init();
        }
    }

    ngOnInit(): void {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.column.template);
        this.viewContainerRef.clear();
        this.componentRef = this.viewContainerRef.createComponent(componentFactory);
        this.updateComponent();
    }



    ngOnDestroy(): void {
        if (this.componentRef) {
            this.componentRef.destroy();
        }
    }
}
