import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import * as moment from 'moment';
import { Observable, of, zip } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AgendaSubmissionsService, AgendaTemplateService, Submission, Template } from '../../services';
import { AdministrationService, AgendaDto } from '../../../services/api/atm';
import { AgendaFormComponent } from '../agenda-form/agenda-form.component';
import { AgendaFormTO } from '../../models/age.model';
import { EventsServiceService } from 'app/icp-module/services/api/events-service.service';
import { IcpAgeTemplate } from 'app/icp-module/services/model/icp-age.model';

import {DialogService} from "../../../../infrastructure/fidcare/services/dialog.service";

export enum ActionClassIconEnum {
  CREATED = 'created',
  STARTED = 'started',
  END = 'end',
  MISSED = 'missed'
}

export enum ActionIconEnum {
  CREATED = 'fiber_manual_record',
  STARTED = 'fiber_manual_record',
  END = 'fiber_manual_record',
  MISSED = 'fiber_manual_record'
}
class EditTelevistData {
  evento:boolean
}
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAgendaComponent implements OnInit {
  private _userId: string;
  constructor(
    private readonly _profileService: ProfileService,
    private readonly administrationService: AdministrationService,
    private readonly agendaSubmissionsService: AgendaSubmissionsService,
    private readonly agendaTemplateService: AgendaTemplateService,
    private readonly dialog: MatDialog,
    private readonly cd: ChangeDetectorRef,
    private readonly _icpEvents: EventsServiceService,
    private _dialogServide: DialogService

) {
    this._profileService.profile$.subscribe(result => {
      this.isDoctor = result.isDoctor;
      this._userId = result.userId;
    })
  }

  selectedDate = new Date();
  selectedFilter: string;
  viewList = ['week', 'day'];
  submissions?: AgendaFormTO[];
  formGroup = new FormGroup({
    viewController: new FormControl(this.viewList[1]),
    filterController: new FormControl(''),
    template: new FormControl(''),
  });
  get template() {
    return this.formGroup.controls.template;
  }
  get viewController() {
    return this.formGroup.controls.viewController;
  }
  get filterController() {
    return this.formGroup.controls.filterController;
  }
  tableFilter = new FormControl('');
  templates: Template[] = [];
  isDoctor: boolean;

  ngOnInit() {
    let t: Template={
      id: "c275dbb8-feeb-11ec-b939-0242ac120002",
      name:"Televisita",
      schema:"",
      dateReference:"",
      frontEndEnabled:true,

    }

    this.agendaTemplateService.findAllAgendaTemplateByFilter(true).subscribe(result => {
      this.templates = [...result];

    });
    this.getDailyEvent();
  }

  getDailyEvent() {
    const date = moment(this.selectedDate).startOf('day').format('yyyy-MM-DD');
    // console.log("date",date);
    const agendaDtoList$ = this.isDoctor
      ? this.administrationService.getDailyAdminsUsingGET(date)
      : this.administrationService.getDailyAdminitrationsUsingGET(date);
    const submissions$ = this.agendaSubmissionsService.findAgendaSubmissionsByUserAndDate(date, this._userId);
    const icpEvents$ = this._icpEvents.getEvents(moment(this.selectedDate).startOf('day').toISOString());
    zip(
      agendaDtoList$.pipe(catchError<AgendaDto[], Observable<AgendaDto[]>>(() => of([]))),
      submissions$.pipe(catchError<Submission[], Observable<Submission[]>>(() => of([]))),
      icpEvents$.pipe(catchError<IcpAgeTemplate[], Observable<IcpAgeTemplate[]>>(() => of([]))),
    )
      .subscribe(([agendaDtoList, submissions,icpEvents]) => {
        const agendaDtoListToSubmissions: AgendaFormTO[] = agendaDtoList.map(a => ({
          submissionDateTime: moment(a.localDateTime).toISOString(),
          atmAgendaDto: a,
        }));
        const icpAgendaDtoListToSubmissions = icpEvents.map(a=>({
          submissionDateTime: moment(a.localDateTime).toISOString(),
          icpAgendaDto: a,
        }));
        this.submissions = [...submissions.map(s => ({ ...s, fields: JSON.parse(s.schema) })), ...agendaDtoListToSubmissions, ...icpAgendaDtoListToSubmissions];
        this.cd.markForCheck();
      });
  }

  selectedChange(date: Date) {
    this.selectedDate = date;
    this.getDailyEvent();
  }

  addSubmission() {
    const template: Template = this.template.value;
    const submission: Submission = {
      template,
      schema: template.schema,
    };
// if(template ==="c275dbb8-feeb-11ec-b939-0242ac120002")
// {
//   console.log("ciaoo")
//   this._dialogServide.show(TelevisitAddComponent, {
//     data:<EditTelevistData>{
//     evento:true
//     },
//     panelClass: 'modal-xl',
//   });
//
// }
  this.dialog.open(AgendaFormComponent, {
      width: '80%',
      height: '80%',
      data: {
        submission,
      },
    })
      .afterClosed()
      .subscribe(response => {
        if (response) {
          this.getDailyEvent();
        }
      });
  }

}
