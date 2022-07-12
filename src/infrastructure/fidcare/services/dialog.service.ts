import { TemplateRef } from "@angular/core";
import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { DialogOptions } from "../models/common.models";
import { ConfirmDialogComponent } from "../components/common/confirm-dialog.component";
import { MessageDialogComponent } from "../components/common/message-dialog.component";

@Injectable()
export class DialogService {
    constructor(private _dialog: MatDialog) {

    }

	public showMessage = (title: string, message: string, config: DialogOptions<any> = new DialogOptions<any>(), messageParams: string[] = []): void => {
        config.data = { title: title, message: message, messageParams: messageParams || [] };
        config.localize = config.localize !== false;
        const dialogRef = this._dialog.open(MessageDialogComponent, DialogConfig.fromOptions(config));
        dialogRef.componentInstance.configuration = config;

        const dialogRefSubscription = dialogRef.afterClosed().subscribe(result => {
            if (config.callback) {
                config.callback(result);
            }
            dialogRefSubscription.unsubscribe();
        });
    }
    public showConfirm = (title: string, message: string, config: DialogOptions<any> = new DialogOptions<any>(), messageParams: string[] = []): void => {
        config.data = { title: title, message: message, messageParams: messageParams || [] };
        config.localize = config.localize !== false;
        const dialogRef = this._dialog.open(ConfirmDialogComponent, DialogConfig.fromOptions(config));
        dialogRef.componentInstance.configuration = config;

        const dialogRefSubscription = dialogRef.afterClosed().subscribe(result => {
            if (config.callback) {
                config.callback(result);
            }
            dialogRefSubscription.unsubscribe();
        });
    }
    public show = <T = any>(dialogComponent: ComponentType<any> | TemplateRef<any>, config: DialogOptions<any> = new DialogOptions<any>()): void => {
        config.localize = config.localize !== false;
        const dialogRef = this._dialog.open(dialogComponent, DialogConfig.fromOptions(config))
        dialogRef.componentInstance.config = config;

        const dialogRefSubscription = dialogRef.afterClosed().subscribe((result: T) => {
            if (config.callback) {
                config.callback(result);
            }
            dialogRefSubscription.unsubscribe();
        });
    }

}

export class DialogConfig<T> extends MatDialogConfig<any>{
    constructor() {
        super()
        this.panelClass = "modal-md";
    }
    public localize?: boolean;
    public callback?: (data: T) => void;

    public static fromOptions<T>(options: DialogOptions<T>): DialogConfig<T> {
        const ret = new DialogConfig<T>();
        if (options.panelClass)
            ret.panelClass = options.panelClass;

        if (options.hasBackdrop)
            ret.hasBackdrop = options.hasBackdrop;

        if (options.backdropClass)
            ret.backdropClass = options.backdropClass;

        if (options.disableClose)
            ret.disableClose = options.disableClose;

        if (options.width)
            ret.width = options.width;

        if (options.height)
            ret.height = options.height;

        if (options.minWidth)
            ret.minWidth = options.minWidth;

        if (options.minHeight)
            ret.minHeight = options.minHeight;

        if (options.maxWidth)
            ret.maxWidth = options.maxWidth;

        if (options.data)
            ret.data = options.data;

        if (options.ariaDescribedBy)
            ret.ariaDescribedBy = options.ariaDescribedBy;

        if (options.ariaLabelledBy)
            ret.ariaLabelledBy = options.ariaLabelledBy;

        if (options.ariaLabel)
            ret.ariaLabel = options.ariaLabel;

        if (options.autoFocus)
            ret.autoFocus = options.autoFocus;

        if (options.localize)
            ret.localize = options.localize;

        if (options.callback)
            ret.callback = options.callback;

        return ret;
    }
}