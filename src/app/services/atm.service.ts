import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DrugDto } from './api/atm';

@Injectable({
  providedIn: 'root'
})
export class AtmService {

  private selectedDrugInfoSource: BehaviorSubject<DrugDto> = new BehaviorSubject(null);
  selectedDrugInfo = this.selectedDrugInfoSource.asObservable();

  constructor(private http: HttpClient) { }

  updateSelectedDrugInfo(newDrugSelected: DrugDto) {
    this.selectedDrugInfoSource.next(newDrugSelected);
  }

  getDrugsInfos(): Observable<DrugDto[]> {
    return this.http.get<DrugDto[]>('assets/drugs.json');
  }

  getDrugInfosFiltered(field: string, criteria: string) {

    const getRequest = this.getDrugsInfos().pipe(
      map((data: DrugDto[]) => data.filter(dInfo => (dInfo[field] as string).startsWith(criteria.trim()))));
    return getRequest;
  }

  getDrugInfosFilterDescrOrAicCode(description: string, criteria: string) {

    const getRequest = this.getDrugsInfos().pipe(
      map((data: DrugDto[]) => {
        return data.filter(dInfo =>
          (dInfo[description] as string).toLowerCase().startsWith(criteria.toLowerCase().trim())
        );
      }));
    return getRequest;
  }


}
