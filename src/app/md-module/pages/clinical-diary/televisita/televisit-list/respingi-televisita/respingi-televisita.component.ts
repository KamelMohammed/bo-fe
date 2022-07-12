import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RespingiRichiestaTelevisitaRequest, TelevisitaControllerService} from "../../../../../../services/api/mtc";
import {SnackBarService} from "../../../../../../../infrastructure/fidcare/services/snackbar.service";

class EditTelevistData {

  public id?:string;
}
@Component({
  selector: 'app-respingi-televisita',
  templateUrl: './respingi-televisita.component.html',
  styleUrls: ['./respingi-televisita.component.scss']
})

export class RespingiTelevisitaComponent implements OnInit {
  public motivazione: string;
  constructor(private _fb: FormBuilder, private _translateService: TranslateService,
              @Inject(MAT_DIALOG_DATA) private _data: EditTelevistData,
              private readonly _dialog: MatDialogRef<RespingiTelevisitaComponent>,
              private service: TelevisitaControllerService,private readonly snackBarService: SnackBarService) { }

  ngOnInit(): void {
  }

  save(){
    let request:RespingiRichiestaTelevisitaRequest={
      motivazione:this.motivazione
    }
    this.service.respingiTelevisitaConMotivazioneUsingPOST(this._data.id,request).subscribe(result => {
      this.snackBarService.info("Televisita respinta")
      // this.snackBar.open('Creazione avvenuta con successo.', 'CHIUDI', { duration: 7000 });
      this._dialog.close(result);
    }, () => {
      this.snackBarService.error("Qualcosa è andato storto")
      // this.snackBarService.open('Qualcosa è andato storto', 'CHIUDI', { duration: 000 })
    });
  }
  close(){
    this._dialog.close(null);
  }

}
