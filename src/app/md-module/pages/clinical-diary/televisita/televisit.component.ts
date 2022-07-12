import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {TranslateService} from "@ngx-translate/core";
import {EventBusService} from "../../../../../infrastructure/fidcare/services/event-bus.service";
import {NotificationMessage} from "../../../../../infrastructure/fidcare/models/common.models";
import {MedicalRecord} from "../../../models/md.model";

@Component({
  selector: 'app-televisit',
  templateUrl: './televisit.component.html',
  styleUrls: ['./televisit.component.scss']
})
export class TelevisitComponent implements OnInit {

  selectedIndex = 0;

  @Input() medicalRecord: MedicalRecord;
  @Input() public canAddProposal: boolean =false;

  constructor(private _eventBusService: EventBusService
  ) { }


  code: string ="";
  ngOnInit() {
    if (this.medicalRecord && this.medicalRecord.patient)
      this.code = this.medicalRecord.patient.code;
  }

  onProposalUpdates = (event: any) => {
    let message: NotificationMessage = {
      code: "clinical-diary-update"
    }
    this._eventBusService.emit(message)
  }
}
