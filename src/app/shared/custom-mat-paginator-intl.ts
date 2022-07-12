// import { Injectable } from '@angular/core';
// import { MatPaginatorIntl } from '@angular/material/paginator';
// import { TranslateService } from '@ngx-translate/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class CustomMatPaginatorIntl extends MatPaginatorIntl {

//   constructor(
//     private readonly translateService: TranslateService
//   ) {
//     super();
//     this.nextPageLabel = this.translateService.instant('NEXT_PAGE');
//     this.previousPageLabel = this.translateService.instant('PREVIOUS_PAGE');
//     this.itemsPerPageLabel = this.translateService.instant('RESULTS_PER_PAGE');
//     this.getRangeLabel = (page: number, pageSize: number, length: number) => {
//       if (length === 0 || pageSize === 0) {
//         return this.translateService.instant('PAGE_RANGE', { range: 0, totalItems: length });
//       }

//       length = Math.max(length, 0);

//       const startIndex = page * pageSize;

//       // If the start index exceeds the list length, do not try and fix the end index to the end.
//       const endIndex = startIndex < length
//         ? Math.min(startIndex + pageSize, length)
//         : startIndex + pageSize;

//       return this.translateService.instant('PAGE_RANGE', { range: `${startIndex + 1} - ${endIndex}`, totalItems: length });
//     };
//   }
// }
