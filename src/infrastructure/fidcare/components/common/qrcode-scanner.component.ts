import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iconCameraSwitch, iconError, iconInfo } from 'infrastructure/fidcare/utils/icons.utils';
import { timer } from 'rxjs';
import { BaseComponent } from './base.component';

@Component({
    selector: 'fidcare-qrcode-scanner',
    templateUrl: './qrcode-scanner.component.html',
	styleUrls: ["./qrcode-scanner.component.scss"]
})
export class QRcodeScannerComponent extends BaseComponent {
	@Input() dataValidator: (data?: any) => {} = (data?: any) => {return true};
    @Input() delayAfterSuccess= 1000;
	@Output() public onDataRead: EventEmitter<any> = new EventEmitter();
	
	iconCamera = iconCameraSwitch;
	iconMessage = iconInfo;
	errorMessage = 'qrcodeScanner.initCamMessage';
	desiredDevice;
	devices = [];
	currentDevideIndex = 0;
	dataValidate = false;

	onScanQRCodeSuccess = ($event) => {
		if (!this.dataValidate && this.dataValidator && this.dataValidator($event)) {
			this.dataValidate = true;
			timer(this.delayAfterSuccess).subscribe(() => {
				this.onDataRead.emit($event);
			})
		}
	}

	public get showSwitchDevice() {
		return this.devices && this.devices.length > 1;
	}

	changeCam = () => {
		this.currentDevideIndex = (this.currentDevideIndex+1)%this.devices.length;
	}

	camerasFound = ($event) => {
		this.devices = $event;
		this.desiredDevice = this.devices[this.currentDevideIndex];
	}
	camerasNotFound = ($event) => {
		this.errorMessage = "qrcodeScanner.noCamFound";
		this.iconMessage = iconError;
	}
	scanComplete = false;
	onScanComplete = ($event) => {
		this.scanComplete = true;
		this.errorMessage = "";
	}
}
