import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AddDrugNoteDialog, AdministrationTherapyDialog, EditDrugNoteDialog, MakeAdministrationDialog, MissingAdministrationDialog } from 'app/age-module/models/age.model';
import { CheckAicRequest, UpdateAdministrationRequest } from 'app/services/api/atm';
import { AdministrationService } from 'app/services/api/atm/api/administration.service';
import { AdministrationDoctorDto } from 'app/services/api/atm/model/administrationDoctorDto';
import { AdministrationsByDoctorDto } from 'app/services/api/atm/model/administrationsByDoctorDto';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { DataTableAction, DataTableColumn, ListTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { SnackBarService } from 'infrastructure/fidcare/services/snackbar.service';
import { SpinnerService } from 'infrastructure/fidcare/services/spinner.service';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { forkJoin, mergeMap, Observable, of, tap } from 'rxjs';
import { TherapyAddNoteComponent } from '../therapy-add-note/therapy-add-note.component';
import { TherapyAdministerComponent } from '../therapy-administer/therapy-administer.component';
import { TherapyMissingAdministrationComponent } from '../therapy-missing-administration/therapy-missing-administration.component';
import { TherapyShowNoteComponent } from '../therapy-show-note/therapy-show-note.component';


@Component({
    selector: 'therapy-sheet',
    templateUrl: './therapy-sheet.component.html',
})
export class TherapySheetComponent extends BaseComponent implements OnInit {
    public data: AdministrationsByDoctorDto = null;
    public tableColumns: DataTableColumn[] = [];
    public dataTableManager: ListTableManager;
    public tableActions: DataTableAction[] = [];
    public canUndo: boolean = false;
    public filterAIC: string;

    constructor(private _dialogService: DialogService, private _snackBarService: SnackBarService, private _administrationService: AdministrationService, private _spinnerService: SpinnerService, private _dialogRef: MatDialogRef<TherapySheetComponent>, @Inject(MAT_DIALOG_DATA) private _data: AdministrationTherapyDialog) {
        super();
    }

    ngOnInit(): void {
        this._spinnerService.show();
        this.dataTableManager = new ListTableManager("1", this.getDrugs)
        this.prepareTable();
        this.loadData();
    }

    private getDrugs = (): Observable<AdministrationDoctorDto[]> => {
        return of(this.data && this.data.administrations ? this.data.administrations : []);
    }

    private loadData = (): void => {
        this._administrationService.getAllAdministrationsByPatientAndDateUsingGET(new Date(this._data.date), this._data.patientId).subscribe(result => {
            this.data = result;
            this._spinnerService.hide();
            this.dataTableManager.startReload();
        });
    }

    private prepareTable = (): void => {
        let columns: DataTableColumn[] = [];
        columns.push(DataTableUtils.createStringColumn("drugName", "common.drug", false));
        columns.push(DataTableUtils.createIntColumn("quantity", "md.quantity", false));
        columns.push(DataTableUtils.createStringColumn("administrationRoute", "md.administrationRoute", false));
        columns.push(DataTableUtils.createEnumColumn("status", "common.status", "AdministrationStatus", false));
        this.tableColumns.push(...columns);

        this.tableActions.push(DataTableUtils.createAction("common.note", "note", this.notes));
        this.tableActions.push(DataTableUtils.createAction("age.missingAdministration", "close", this.missingAdministration, this.missingAdministrationEnabled));
        this.tableActions.push(DataTableUtils.createAction("age.administer", "done", this.administer, this.administerEnabled));
        this.tableActions.push(DataTableUtils.createAction("common.undo", "undo", this.undo, this.undoEnabled));
    }

    private missingAdministrationEnabled = (row: AdministrationDoctorDto): boolean => {
        return row.status == AdministrationDoctorDto.StatusEnum.TOPREPARE || row.status === AdministrationDoctorDto.StatusEnum.TOADMINISTER || row.status === AdministrationDoctorDto.StatusEnum.UNKNOWN;
    }
    private administerEnabled = (row: AdministrationDoctorDto): boolean => {
        return row.status === AdministrationDoctorDto.StatusEnum.TOADMINISTER && row.readingNoteStatus === AdministrationDoctorDto.ReadingNoteStatusEnum.READ;
    }
    private undoEnabled = (row: AdministrationDoctorDto): boolean => {
        return this.canUndo && row.status === AdministrationDoctorDto.StatusEnum.TOADMINISTER && row.readingNoteStatus === AdministrationDoctorDto.ReadingNoteStatusEnum.READ;
    }

    private missingAdministration = (row: AdministrationDoctorDto): void => {
        this._dialogService.show(TherapyMissingAdministrationComponent, {
            data: <MissingAdministrationDialog>{
                id: row.uuid,
                patientUUID: this.data.patientDto.id,
                status: row.readingNoteStatus
            },
            panelClass: 'modal-md',
            callback: result => {
                if (result) {
                    this.loadData();
                }
            }
        });
    }

    private administer = (row: AdministrationDoctorDto): void => {
        this._dialogService.show(TherapyAdministerComponent, {
            data: <MakeAdministrationDialog>{
                id: row.uuid,
                patientUUID: this.data.patientDto.id,
                status: row.readingNoteStatus
            },
            panelClass: 'modal-md',
            callback: result => {
                if (result) {
                    this.loadData();
                }
            }
        });
    }

    private undo = (row: AdministrationDoctorDto): void => {
        this._dialogService.showConfirm("age.cancelAdministrationTitle", "age.cancelAdministrationMessage", {
            callback: result => {
                if (result) {
                    this._spinnerService.show();
                    this._administrationService.cancelUsingPOST(row.uuid, row.readingNoteStatus).subscribe(() => {
                        this.loadData();
                        this._spinnerService.hide();
                    },
					(error) => {
						this._spinnerService.hide();
						this._snackBarService.info('Si è verificato un errore imprevisto');
					}
					);
                }
            }
        });
    }

    private notes = (row: AdministrationDoctorDto): void => {
        if (row.ptComponentNote != null) {
            this._dialogService.show(TherapyShowNoteComponent, {
                data: <EditDrugNoteDialog>{
                    id: row.uuid,
                    alreadyRead: row.readingNoteStatus === AdministrationDoctorDto.ReadingNoteStatusEnum.READ,
                    administrationNote: row.administrationNote,
                    drugNote: row.ptComponentNote
                },
                callback: result => {
                    if (result) {
                        this.loadData();
                    }
                }
            });
        }
        else {
            this._dialogService.show(TherapyAddNoteComponent, {
                data: <AddDrugNoteDialog>{
                    id: row.uuid
                },
                callback: result => {
                    // if (result) {
                    //     this.loadData();
                    // }
                }
            });
        }
    }

    public searchAicCode = (): void => {
        if (!this.filterAIC) {
            return;
        }
        this._spinnerService.show();
        this.getDrugs().pipe(mergeMap(result => {
            const data: CheckAicRequest = {
                cs: result.map(m => m.uuid),
                aic: this.filterAIC,
                userIdentifier: this._data.patientId
            };
            return forkJoin([of(result), this._administrationService.checkAIC(data)]);
        })).pipe(mergeMap(results => {
            if (results[1].status == 'OK') {
                const adm = results[0].find(x => x.uuid === results[1].cs);

                if (adm.status === AdministrationDoctorDto.StatusEnum.TOPREPARE
                    && (adm.readingNoteStatus === AdministrationDoctorDto.ReadingNoteStatusEnum.READ || adm.readingNoteStatus === AdministrationDoctorDto.ReadingNoteStatusEnum.NOTAVAILABLE)) {
                    this._snackBarService.success('Il farmaco è stato identificato');
                    const data: UpdateAdministrationRequest = {
                        cs: [adm.uuid],
                        messageTimestamp: new Date().getTime(),
                        newCsState: UpdateAdministrationRequest.NewCsStateEnum.TOADMINISTER,
                        userIdentifier: this._data.patientId
                    };
                    return this._administrationService.changeCsStateUsingPUT(data);
                }
                else {
                    this._snackBarService.info('Il farmaco non è da identificare. Leggi le note.');
                }
            }
            else {
                this._snackBarService.info('Il farmaco identificato non corrisponde ad alcun farmaco da somministrare');
            }
            return of(null);

        })).subscribe(result => {
            if (result) {
                this.canUndo = true;
                this.loadData();
            }
            else {
                this._spinnerService.hide();
            }
            this.filterAIC = null;
        },
		error => {
			this._spinnerService.hide();
			this._snackBarService.error("nessuna corrispondenza del codice con i farmaci da somministrare");
		}
		);
    }

    public close = (): void => {
        this._dialogRef.close(false);
    }
}

