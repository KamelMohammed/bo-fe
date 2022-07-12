import { DataTableStringCellTemplateComponent, DataTableDateCellTemplateComponent, DataTableDateTimeCellTemplateComponent, DataTableTimeCellTemplateComponent, DataTableBooleanCellTemplateComponent, DataTableIntCellTemplateComponent, DataTableNumberCellTemplateComponent, DataTableCurrencyCellTemplateComponent, DataTableEnumCellTemplateComponent, DataTableClickCellTemplateComponent, DataTableArrayCellTemplateComponent } from "../components/data-table/data-table-cell-template.component";
import { DataTableAction, DataTableColumn, DataTableColumnAlignment } from "../components/data-table/types";

// @dynamic
export class DataTableUtils {
    public static createAction(label: string, icon: string, funcToInvoke: (row: any) => void, enableFunc: (row: any) => boolean = null, showWhenDisabled: boolean = true) {
        let ret = new DataTableAction()
        ret.icon = icon;
        ret.label = label;
        if (funcToInvoke) {
            ret.funcToInvoke = funcToInvoke;
        }
        if (enableFunc) {
            ret.enableFunc = enableFunc;
            ret.alwaysVisible = showWhenDisabled;
        }
        else {
            ret.alwaysVisible = true;
        }
        return ret;
    }
    public static createStringColumn = (name: string, label: string, sortable: boolean = true, sortableFieldId?: string): DataTableColumn => {
        let ret = DataTableUtils.createDataTableColumn(name, label, sortable, DataTableColumnAlignment.LEFT, sortableFieldId);
        ret.template = DataTableStringCellTemplateComponent;
        return ret;
    }
    public static createActionColumn = (name: string, label: string, sortable: boolean = true, sortableFieldId?: string): DataTableColumn => {
        let ret = DataTableUtils.createDataTableColumn(name, label, sortable, DataTableColumnAlignment.CENTER, sortableFieldId);
        ret.template = DataTableDateCellTemplateComponent;
        return ret;
    }
    public static createDateColumn = (name: string, label: string, sortable: boolean = true, sortableFieldId?: string): DataTableColumn => {
        let ret = DataTableUtils.createDataTableColumn(name, label, sortable, DataTableColumnAlignment.CENTER, sortableFieldId);
        ret.template = DataTableDateCellTemplateComponent;
        return ret;
    }
    public static createDateTimeColumn = (name: string, label: string, sortable: boolean = true, sortableFieldId?: string): DataTableColumn => {
        let ret = DataTableUtils.createDataTableColumn(name, label, sortable, DataTableColumnAlignment.CENTER, sortableFieldId);
        ret.template = DataTableDateTimeCellTemplateComponent;
        return ret;
    }
    public static createTimeColumn = (name: string, label: string, sortable: boolean = true, sortableFieldId?: string): DataTableColumn => {
        let ret = DataTableUtils.createDataTableColumn(name, label, sortable, DataTableColumnAlignment.CENTER, sortableFieldId);
        ret.template = DataTableTimeCellTemplateComponent;
        return ret;
    }
    public static createBooleanColumn = (name: string, label: string, sortable: boolean = true, sortableFieldId?: string): DataTableColumn => {
        let ret = DataTableUtils.createDataTableColumn(name, label, sortable, DataTableColumnAlignment.CENTER, sortableFieldId);
        ret.template = DataTableBooleanCellTemplateComponent;
        return ret;
    }
    public static createIntColumn = (name: string, label: string, sortable: boolean = true, sortableFieldId?: string): DataTableColumn => {
        let ret = DataTableUtils.createDataTableColumn(name, label, sortable, DataTableColumnAlignment.RIGHT, sortableFieldId);
        ret.template = DataTableIntCellTemplateComponent;
        return ret;
    }
    public static createNumberColumn = (name: string, label: string, numOfDecimals: number = null, sortable: boolean = true, sortableFieldId?: string): DataTableColumn => {
        let ret = DataTableUtils.createDataTableColumn(name, label, sortable, DataTableColumnAlignment.RIGHT, sortableFieldId);
        ret.template = DataTableNumberCellTemplateComponent;
        ret.metadata.numOfDecimals = 0;
        return ret;
    }
    public static createCurrencyColumn = (name: string, label: string, sortable: boolean = true, sortableFieldId?: string): DataTableColumn => {
        let ret = DataTableUtils.createDataTableColumn(name, label, sortable, DataTableColumnAlignment.RIGHT, sortableFieldId);
        ret.template = DataTableCurrencyCellTemplateComponent;
        return ret;
    }
    public static createEnumColumn = (name: string, label: string, enumName: string, sortable: boolean = true, sortableFieldId?: string): DataTableColumn => {
        let ret = DataTableUtils.createDataTableColumn(name, label, sortable, DataTableColumnAlignment.LEFT, sortableFieldId);
        ret.template = DataTableEnumCellTemplateComponent;
        ret.metadata.enumName = enumName;
        return ret;
    }

    public static createLinkableColumn = (name: string, label: string, clickAction: (row) => void, sortable: boolean = true, sortableFieldId?: string): DataTableColumn => {
        let ret = DataTableUtils.createDataTableColumn(name, label, sortable, DataTableColumnAlignment.LEFT, sortableFieldId);
        ret.template = DataTableClickCellTemplateComponent;
        ret.metadata.clickAction = clickAction;
        return ret;
    }

	public static createArrayColumn = (name: string, label: string, fieldName: string, sortable: boolean = true, sortableFieldId?: string): DataTableColumn => {
        let ret = DataTableUtils.createDataTableColumn(name, label, sortable, DataTableColumnAlignment.LEFT, sortableFieldId);
        ret.template = DataTableArrayCellTemplateComponent;
		ret.metadata.fieldName = fieldName;
        return ret;
    }

    public static createDataTableColumn = (name: string, label: string, sortable: boolean = true, alignment: DataTableColumnAlignment = DataTableColumnAlignment.LEFT, sortableFieldId: string): DataTableColumn => {
        let ret = new DataTableColumn();
        ret.label = label;
        ret.name = name;
        ret.sortable = sortable;
        ret.alignment = alignment;
		ret.sortableFieldId = sortableFieldId;
        return ret;
    }
}