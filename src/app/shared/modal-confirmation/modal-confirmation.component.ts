import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss']
})
export class ModalConfirmationComponent implements OnInit {
  title: string;
  message: string;

  ngOnInit() {
    const { title, message } = this.data;
    this.title = title;
    this.message = message;
  }

  constructor(
    public dialogRef: MatDialogRef<ModalConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onConfirm() {
    this.dialogRef.close({ confirmation: true });
  }

  onCancel() {
    this.dialogRef.close({ confirmation: false });
  }

}
