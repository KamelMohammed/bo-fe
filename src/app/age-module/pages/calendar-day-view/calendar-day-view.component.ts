import { EditEvaluationPageComponent } from './../../../icp-module/pages/pai/edit-pai-page/evaluation-page/edit-evaluation-page/edit-evaluation-page.component';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { groupBy } from 'lodash';
import moment from 'moment';

import { AgendaFormComponent } from '../agenda-form/agenda-form.component';
import { Field, FieldType } from '../../components/components.model';
import { AdministrationTherapyDialog, AgendaFormTO } from '../../models/age.model';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { TherapySheetComponent } from '../therapy-sheet/therapy-sheet.component';
import { EventType } from 'app/icp-module/services/model/icp-age.model';
import { EvaluationType } from 'app/icp-module/services/model/pai.model';
import { ModalQRcodeScannerComponent } from 'infrastructure/fidcare/components/common/modal-qrcode-scanner.component';
import { ModalAgendaSessionPreviewComponent } from 'app/icp-module/pages/session/agenda-session-preview/agenda-session-preview.component';

@Component({
	selector: 'app-calendar-day-view',
	templateUrl: './calendar-day-view.component.html',
	styleUrls: ['./calendar-day-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDayViewComponent implements OnInit, OnChanges {
	@Input() selectedDate: Date;
	@Input() submissions: AgendaFormTO[];

	eventsMap: { [key: string]: AgendaFormTO[] };

	constructor(
		private readonly router: Router,
		private readonly dialog: MatDialog,
		private _dialogService: DialogService
	) { }

	dailyHours = new Array(24)
		.fill(0)
		.map((acc, index) => {
			return moment({ hour: index }).format('HH:mm');
		});

	ngOnInit() {

	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes && changes.submissions && changes.submissions.currentValue) {
			this.associateEventsToHours();
		}
	}

	associateEventsToHours() {
		const transf = this.submissions.map(e => ({ groupKey: moment(e.submissionDateTime).format('HH'), ...e }));
		this.eventsMap = Object.entries(groupBy(transf, 'groupKey'))
			.reduce((acc, [k, v]) => Object.assign(acc, { [k]: v }), {});
	}

	getEventsByHour(hour: string) {
		const key = hour.split(':')[0];

		return (this.eventsMap || {})[key] || [];
	}

	getBadgeField(submission: AgendaFormTO) {
		if (submission.atmAgendaDto) {
			const field: Field = {
				id: submission.atmAgendaDto.id,
				name: submission.atmAgendaDto.id,
				type: FieldType.BADGE,
				required: false,
				label: {
					label: submission.atmAgendaDto.label,
					hidden: false,
				},
				badge: {
					backgroundColor: '#CCCCCC',
					title: {
						color: '#000000',
						value: submission.atmAgendaDto.label || '',
					}
				},
				x: 0, y: 0, cols: 0, rows: 0,
			};

			return field;
		} else {
			if (submission.icpAgendaDto) {
				//TODO. perchè è necessario passare il campo name? rivedere insieme a Giuseppe
				const field: Field = {
					id: submission.icpAgendaDto.id,
					name: "Nome assistito.. da definire",
					type: FieldType.BADGE,
					required: false,
					label: {
						label: submission.icpAgendaDto.label,
						hidden: false,
					},
					badge: {
						backgroundColor: '#CCCCCC',
						title: {
							color: '#000000',
							value: submission.icpAgendaDto.label || '',
						}
					},
					x: 0, y: 0, cols: 0, rows: 0,
				};

				return field;
			} else {
				const fields: Field[] = submission.fields || [];
				const field = fields.find(f => f.type === FieldType.BADGE);

				return field;
			}
		}
	}

	onEventClick(submission: AgendaFormTO) {
		if (submission.atmAgendaDto) {
			this._dialogService.show(TherapySheetComponent, {
				data: <AdministrationTherapyDialog>{
					patientId: submission.atmAgendaDto.patientId,
					date: moment(submission.atmAgendaDto.localDateTime + "Z").toISOString()
				},
				panelClass: 'modal-xl'
			});
		}
		else if (submission.icpAgendaDto) {
			if (submission.icpAgendaDto.eventType == EventType.MIDTERM_EVALUATION) {
				this.router.navigate([`icp/pai/edit/${submission.icpAgendaDto.paiId}`]);
				// this._dialogService.show(EditEvaluationPageComponent, {
				// 	data: {
				// 		paiId: submission.icpAgendaDto.paiId,
				// 		evaluationId: submission.icpAgendaDto.itemId,
				// 		evaluationType: EvaluationType.midtermevaluation, //EvaluationType[EvaluationType.midtermevaluation],
				// 		caseMangerId: "",
				// 		history: false
				// 	},
				// 	panelClass: 'modal-xl'
				// });
			}
			else if (submission.icpAgendaDto.eventType == EventType.FINAL_EVALUATION) {
				this.router.navigate([`icp/pai/edit/${submission.icpAgendaDto.paiId}`]);
				// this._dialogService.show(EditEvaluationPageComponent, {
				// 	data: {
				// 		paiId: submission.icpAgendaDto.paiId,
				// 		evaluationId: submission.icpAgendaDto.itemId,
				// 		evaluationType: EvaluationType.finalevaluation, //EvaluationType[EvaluationType.finalevaluation],
				// 		caseMangerId: "",
				// 		history: false
				// 	},
				// 	panelClass: 'modal-xl'
				// });
			}else if (submission.icpAgendaDto.eventType==EventType.SESSION){

				

				let dataRead = (data) => {
					// console.log("Received ", data);
					
				}
				this._dialogService.show(ModalAgendaSessionPreviewComponent, {
					callback: dataRead,
					data: {
						modalTitle: "icp.sessions.scanCodeForStartSessionTitle",
						sessionId: submission.icpAgendaDto.itemId
					},
					panelClass: 'modal-md',
				})

				// let dataRead = (data) => {
				// 	console.log("Received ", data);
				// 	if (data != undefined) {
				// 		this.router.navigate([`icp/sessions/${submission.icpAgendaDto.itemId}/edit`]);
				// 	}
				// }
				// this._dialogService.show(ModalQRcodeScannerComponent, {
				// 	callback: dataRead,
				// 	data: {
				// 		modalTitle: "icp.sessions.scanCodeForStartSessionTitle",
				// 		dataValidator: (codeReaded) => {
				// 			console.log("Personal data validatorr. controllare qui se il codice è valido...");
				// 			//TODO Effettuare i controlli di validità del codice letto
				// 			return true;
				// 		}
				// 	},
				// 	panelClass: 'modal-md',
				// })
			}
		}
		else {
			
			this.dialog.open(AgendaFormComponent, {
				width: '80%',
				height: '80%',
				data: {
					submission
				},
			})
				.afterClosed()
				.subscribe(() => {

			});
		}
	}
}
