import {ChangeDetectorRef, Component, Inject, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {TableModalComponent} from "../table-modal/table-modal.component";
import {responseTable} from "../../../../services/api/msd/model/responseTable";




@Component({
  selector: 'app-nested-table',
  templateUrl: './nested-table.component.html',
  styleUrls: ['./nested-table.component.css']
})
export class NestedTableComponent implements OnInit {

  @Input()
  public series:responseTable[];


  columns = [
    {
      columnDef: 'name',
      header: 'Nome',
      cell: (element: responseTable) => `${element.name}`,
    },
    {
      columnDef: 'aderenza',
      header: 'Aderenza Terapia',
      cell: (element: responseTable) => `${element.value}`,
    }
  ];
  displayedColumns = this.columns.map(c => c.columnDef);


  constructor(public dialog:MatDialog) {

  }

  ngOnInit(): void {

  }

  openModal(informations,enterAnimationDuration, exitAnimationDuration): void {
    this.dialog.open(TableModalComponent,{
      width:'600px',
      height:'600px',
      data: informations
    })
  }

}


