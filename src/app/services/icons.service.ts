import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


const ICONS_PATH = '../../assets/icons/mat-icons';

const ICON_LIST = [
  { key: 'received_samples', fileName: 'campioni_ricevuti.svg' },
  { key: 'canceled_date', fileName: 'data_annullata.svg' },
  { key: 'assigned_date', fileName: 'data_assegnata.svg' },
  { key: 'comunication_error', fileName: 'errore_di_comunicazione.svg' },
  { key: 'performed_exam', fileName: 'esame_eseguito.svg' },
  { key: 'partial_exam', fileName: 'esame_parziale.svg' },
  { key: 'reported_exam', fileName: 'esame_eseguito.svg' },
  { key: 'send_request', fileName: 'invia_richiesta.svg' },
  { key: 'sampling_done', fileName: 'prelievo_effettuato.svg' },
  { key: 'annulled_request', fileName: 'richiesta_annullata.svg' },
  { key: 'canceled_request', fileName: 'richiesta_cancellata.svg' },
  { key: 'to_be_send_request', fileName: 'richiesta_da_inviare.svg' },
  { key: 'sent_request', fileName: 'richiesta_inviata.svg' },
  { key: 'received_request', fileName: 'richiesta_ricevuta.svg' },
  { key: 'print_label', fileName: 'stampa_etichetta.svg' },
  { key: 'more_actions', fileName: 'ulteriori_azioni.svg' },
  { key: 'show_report', fileName: 'visualizza_referto.svg' },
];

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { }

  registerIcons() {
    for (const icon of ICON_LIST) {
      this.matIconRegistry.addSvgIcon(
        icon.key,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`${ICONS_PATH}/${icon.fileName}`)
      );
    }
  }
}


