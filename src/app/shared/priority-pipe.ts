import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'priorityPipe'
})
export class PriorityPipe implements PipeTransform {

  constructor(
    private readonly sanitizer: DomSanitizer
  ) { }

  transform(value: string) {
    return this.sanitizer.bypassSecurityTrustHtml(`<span class="dot ${this.getDotColorClass(value)}">${value}</span>`);
  }

  getDotColorClass(priority: string) {
    switch (priority) {
      case 'Ordinario':
      case 'Ordinaria':
        return 'green';
      case 'Non urgente':
        return 'yellow';
      case 'Urgente':
        return 'orange';
      case 'Alta':
        return 'red';
    }
  }
}
