import { Injectable, NgZone } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { EventSourcePolyfill } from 'ng-event-source';
import { from, Observable, Observer, Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AlertDto } from './api/measurementrule';

@Injectable({
  providedIn: 'root'
})
export class MeasurementRuleService {

  alertConfigSubject = new Subject<AlertDto>();

  constructor(
    private readonly zone: NgZone,
    protected keycloak: KeycloakService
  ) { }

  getServerSentEvent(url: string) {
    return from(this.keycloak.getToken())
      .pipe(
        mergeMap(token => new Observable((observer: Observer<AlertDto>) => {
          const eventSource = new EventSourcePolyfill(url, { headers: { Authorization: `Bearer ${token}` } });
          eventSource.onmessage = (event: MessageEvent) => {
            this.zone.run(() => {
              observer.next(JSON.parse(event.data));
            });
          };
          eventSource.onerror = error => {
            this.zone.run(() => {
              observer.error(error);
            });
          };
        }))
      );
  }
}
