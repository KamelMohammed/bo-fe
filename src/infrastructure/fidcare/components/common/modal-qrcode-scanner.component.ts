import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'fidcare-modal-qrcode-scanner',
    templateUrl: './modal-qrcode-scanner.component.html'
})
export class ModalQRcodeScannerComponent implements OnInit{
	modalTitle = "qrcodeScanner.defaultModalMessage";
	dataValidator: (data?: any) => {} = (data?: any) => {return true};
	public config:any;
	
	constructor(private _dialogRef: MatDialogRef<ModalQRcodeScannerComponent>) {
	}

	ngOnInit(): void {
		if (this.config && this.config.data) {

			if (this.config.data.dataValidator)
				this.dataValidator = this.config.data.dataValidator
			if (this.config.data.modalTitle) 
				this.modalTitle = this.config.data.modalTitle;

		} 
	}
	onScanQRCodeSuccess = ($event) => {
		this._dialogRef.close($event);
	}
	close = () => {
		this._dialogRef.close(undefined);
	}
}
