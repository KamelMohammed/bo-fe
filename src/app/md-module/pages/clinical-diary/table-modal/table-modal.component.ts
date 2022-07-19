import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {responseTerapiaTable} from "../../../../services/api/msd/model/responseTerapiaTable";

@Component({
  selector: 'app-table-modal',
  templateUrl: './table-modal.component.html',
  styleUrls: ['./table-modal.component.scss']
})
export class TableModalComponent implements OnInit {


  columns = [
    {
      columnDef: 'name',
      header: 'Nome Farmaco',
      cell: (element: responseTerapiaTable) => `${element.farmaco}`,
    },
    {
      columnDef: 'aderenza',
      header: 'Aderenza Prescrizione',
      cell: (element: responseTerapiaTable) => `${element.aderenza}`,
    }
  ];

  displayedColumns = this.columns.map(c => c.columnDef);


  constructor(public dialogRef: MatDialogRef<TableModalComponent>,  @Inject(MAT_DIALOG_DATA) public dataSource: responseTerapiaTable[]
) {

  }

  ngOnInit(): void {
    console.log(this.dataSource)
  }

}
