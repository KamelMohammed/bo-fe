import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MedicalRecordService } from 'app/md-module/services/mrc';
import { ActivityControllerService, ActivityDTO } from 'app/services/api/dia';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { DatetimeUtils } from 'infrastructure/fidcare/utils/datetime.utils';
import moment from 'moment';

@Component({
  selector: 'app-close-medical-record-dialog',
  templateUrl: './close-medical-record-dialog.component.html',
  styleUrls: ['./close-medical-record-dialog.component.scss']
})
export class CloseMedicalRecordDialogComponent extends BaseComponent implements OnInit {
  notes = new FormControl('', Validators.required);
  private _profile: Profile;
  constructor(
    private dialogRef: MatDialogRef<CloseMedicalRecordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private readonly medicalRecordService: MedicalRecordService,
    private readonly profileService: ProfileService,
    private readonly diaservice: ActivityControllerService
  ) { super() }
  ngOnInit(): void {
    this.profileService.profile$.subscribe(result => this._profile = result);
  }

  close() {
    if (this.notes.valid) {

      this.medicalRecordService.update(this.data.id, 'CHIUSA', this.notes.value)
        .subscribe(async (val) => {
          await this.submit();
          this.dialogRef.close('SUCCESS');
        },
          () => this.dialogRef.close('ERROR')
        );

    }

  }

  async submit() {
    const activityDTO: ActivityDTO = {
      activity: this.notes.value,
      activityDate: moment.utc().toISOString(),
      activityInsert: moment.utc().toISOString(),
      createDate: moment.utc().toISOString(),
      createUserId: 2,
      medicalRecordUuid: this.data.id,
      operatorName: this._profile.firstName,
      operatorSurname: this._profile.lastName,
      operatorUuid: this._profile.userId,
      roleUuid: "e4b04428-6236-11eb-ae93-0242ac130002", // TODO: PRESO DA UN JSON MOCKATO
      therapy: 'cartella chiusa',
      updateDate: moment.utc().toISOString(),
      updateUserId: 2,
      userName: this._profile.email,
      userSurname: this._profile.lastName
    };


    // save
    this.diaservice.createDiaActivityUsingPOST(activityDTO)
      .subscribe((data) => {
        console.log(data);
      });
  }
}



