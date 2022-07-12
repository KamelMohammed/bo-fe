import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from 'infrastructure/@fuse/animations/public-api';
import { DialogConfig } from 'infrastructure/fidcare/services/dialog.service';
import { BaseComponent } from './base.component';

@Component({
    selector: 'message-dialog',
    templateUrl: 'message-dialog.component.html',
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class MessageDialogComponent extends BaseComponent implements OnInit {
    public configuration: DialogConfig<any>
    constructor(public dialogRef: MatDialogRef<MessageDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        super()
    }

    ngOnInit(): void {

    }
    public close = (): void => {
        this.dialogRef.close();
    }
}