import { OnInit, Component } from "@angular/core";
import { DataTableColumn } from './types';
import { DatetimeUtils } from '../../utils/datetime.utils';
import { TranslateService } from '@ngx-translate/core';
import { formatNumber } from '@angular/common';
import { CultureService } from '../../services/culture.service';

// @dynamic
@Component({
    template: ''
})
export class DataTableCellTemplateComponent implements OnInit {
    ngOnInit(): void {
        this.init()
    }
    public value: string = null;
    public col: DataTableColumn;
    public row: any;
    public getCellValue = (): any => {
        let ret = this.row;
        let parts = this.col.name.split('.');
        for (let i = 0; i < parts.length; i++) {
            if (ret == null) {
                break;
            }
            ret = ret[parts[i]];
        }
        return ret;
    }
    public init = (): void => { };
}

@Component({
    selector: 'data-table-cell',
    templateUrl: './data-table-cell-template.component.html',
})
export class DataTableStringCellTemplateComponent extends DataTableCellTemplateComponent {

    public init = (): void => {
        this.value = this.getCellValue();
    }
}

@Component({
    selector: 'data-table-cell',
    templateUrl: './data-table-cell-template.component.html',
})
export class DataTableDateCellTemplateComponent extends DataTableCellTemplateComponent {

    public init = (): void => {
        this.value = DatetimeUtils.toDate(this.getCellValue());
    }
}

@Component({
    selector: 'data-table-cell',
    templateUrl: './data-table-cell-template.component.html',
})
export class DataTableDateTimeCellTemplateComponent extends DataTableCellTemplateComponent {

    public init = (): void => {
        this.value = DatetimeUtils.toDateTime(this.getCellValue());
    }
}

@Component({
    selector: 'data-table-cell',
    templateUrl: './data-table-cell-template.component.html',
})
export class DataTableTimeCellTemplateComponent extends DataTableCellTemplateComponent {

    public init = (): void => {
        this.value = DatetimeUtils.toTime(this.getCellValue());
    }
}

@Component({
    selector: 'data-table-cell',
    templateUrl: './data-table-cell-template.component.html',
})
export class DataTableBooleanCellTemplateComponent extends DataTableCellTemplateComponent {
    constructor(private _translateService: TranslateService) {
        super()
    }
    public init = (): void => {
        const value = this.getCellValue();
        if (value != null) {
            this.value = value ? this._translateService.instant("common.yes") : this._translateService.instant("common.no");
        }
    }
}

@Component({
    selector: 'data-table-cell',
    templateUrl: './data-table-cell-template.component.html',
})
export class DataTableIntCellTemplateComponent extends DataTableCellTemplateComponent {
    public init = (): void => {
        if (this.getCellValue() != null) {
            this.value = Math.trunc(this.getCellValue()).toString();
        }
    }
}

@Component({
    selector: 'data-table-cell',
    templateUrl: './data-table-cell-template.component.html',
})
export class DataTableNumberCellTemplateComponent extends DataTableCellTemplateComponent {
    constructor(private _cultureService: CultureService) {
        super()
    }

    public init = (): void => {
        if (this.getCellValue() != null) {
            let numOfDecimals = this.col.metadata.numOfDecimals;
            let digitsInfo: string = `1.${numOfDecimals != null ? numOfDecimals : 0}-${numOfDecimals != null ? numOfDecimals : 999}`;
            this.value = formatNumber(this.getCellValue(), this._cultureService.getCurrentCulture(), digitsInfo);
        }
    }
}

@Component({
    selector: 'data-table-cell',
    templateUrl: './data-table-cell-template.component.html',
})
export class DataTableCurrencyCellTemplateComponent extends DataTableCellTemplateComponent {
    constructor(private _cultureService: CultureService) {
        super()
    }

    public init = (): void => {
        if (this.getCellValue() != null) {
            let digitsInfo: string = "1.2-2";
            this.value = formatNumber(this.getCellValue(), this._cultureService.getCurrentCulture(), digitsInfo);
        }
    }
}


@Component({
    selector: 'data-table-cell',
    templateUrl: './data-table-cell-template.component.html',
})
export class DataTableEnumCellTemplateComponent extends DataTableCellTemplateComponent {
    constructor(private _translateService: TranslateService) {
        super()
    }
    public init = (): void => {
        if (this.getCellValue()) {
            this.value = this._translateService.instant(`enums.${this.col.metadata.enumName}.${this.getCellValue()}`);
        }
    }
}


@Component({
    selector: 'data-table-click-cell',
    templateUrl: './data-table-click-cell-template.component.html',
    styleUrls: ['data-table-click-cell-template.component.scss']
})
export class DataTableClickCellTemplateComponent extends DataTableCellTemplateComponent {
    public clickAction: (row) => void;
    constructor() {
        super()
    }
    public init = (): void => {
        this.value = this.getCellValue();
        this.clickAction = this.col.metadata.clickAction;
    }
}


@Component({
    selector: 'data-table-icon-cell',
    templateUrl: './data-table-icon-cell-template.component.html'
})
export class DataTableIconCellTemplateComponent extends DataTableCellTemplateComponent {
    constructor() {
        super()
    }
    public init = (): void => {
        this.value = this.getCellValue();
    }
}


@Component({
    selector: 'data-table-icon-cell',
    templateUrl: './data-table-icon-cell-template.component.html'
})
export class DataTableIconNoPropertyCellTemplateComponent extends DataTableCellTemplateComponent {
    constructor() {
        super()
    }
    public init = (): void => {
        this.value = this.col.metadata.mapFunction(this.row);
    }
}


@Component({
    selector: 'data-table-list-cell',
    templateUrl: './data-table-list-cell-template.component.html',
    styles: [`
		.margin-right {
			margin-right: 5px;
		}		
  `]
})

export class DataTableArrayCellTemplateComponent extends DataTableCellTemplateComponent {
    public elementsValues = [];
    constructor() {
        super()
    }
    public init = (): void => {
        if (this.col.metadata.fieldName) {

            this.value = (<any[]>this.getCellValue()).map(v => v["" + this.col.metadata.fieldName]).join(", ");
            this.elementsValues = this.getCellValue().map(v => v["" + this.col.metadata.fieldName]);
        }
        else {
            this.value = (<any[]>this.getCellValue()).join(", ");
            this.elementsValues = this.getCellValue();
        }


    }
}