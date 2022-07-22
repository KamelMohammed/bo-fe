import {Component, Input, OnInit} from '@angular/core';
import {responseClassicTable} from "../../../../services/api/msd/model/responseClassicTable";


@Component({
  selector: 'app-classic-table',
  templateUrl: './classic-table.component.html',
  styleUrls: ['./classic-table.component.scss']
})
export class ClassicTableComponent implements OnInit {

  @Input()
  public series:responseClassicTable[];


  columns = [
    {
      columnDef: 'name',
      header: 'Nome',
      cell: (element: responseClassicTable) => `${element.name}`,
    },
    {
      columnDef: 'date',
      header: 'Data',
      cell: (element: responseClassicTable) => `${element.date}`,
    }
  ];
  displayedColumns = this.columns.map(c => c.columnDef);


  constructor() {

  }

  ngOnInit(): void {

  }


}
