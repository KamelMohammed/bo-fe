import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { filter } from 'rxjs/operators';

import { Breadcrumb } from './breadcrumb.model';
import { MatBreadcrumbService } from './mat-breadcrumb.service';

@Component({
  selector: 'app-mat-breadcrumb',
  templateUrl: './mat-breadcrumb.component.html',
  styleUrls: ['./mat-breadcrumb.component.css']
})
export class MatBreadcrumbComponent implements OnInit {

  breadcrumb: Breadcrumb[] = [];
  @Input() bgColor = '#eee';
  @Input() fontSize = '18px';
  @Input() fontColor = '#0275d8';
  @Input() lastLinkColor = '#000';
  @Input() symbol = ' / ';
  params: { [key: string]: any; };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ng7MatBreadcrumbService: MatBreadcrumbService
  ) {
    this.breadCrumbData();
  }

  ngOnInit() {
    this.ng7MatBreadcrumbService.breadcrumbLabels.subscribe((labelData) => {
      for (const label in labelData) {
        if (labelData.hasOwnProperty(label)) {
          this.breadcrumb.map((crumb) => {
            const labelParams = crumb.label.match(/[^{{]+(?=\}})/g);
            if (labelParams) {
              for (const labelParam of labelParams) {
                const dynamicData = labelData[label];
                if (labelParam === label) {
                  crumb.label = crumb.label.replace('{{' + labelParam + '}}', dynamicData);
                }
              }
            }
          });
        }
      }
    });

    this.ng7MatBreadcrumbService.newBreadcrumb.subscribe((breadcrumb: Breadcrumb[]) => {
      this.updateData(this.activatedRoute, breadcrumb);
    });
  }

  breadCrumbData(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(map((route) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }))
      .pipe(filter(route => route.outlet === PRIMARY_OUTLET))
      .subscribe(route => {
        this.params = route.snapshot.params;
        this.updateData(route, null);
      });
  }

  private updateData(route, newBreadcrumb): void {
    if (route.snapshot.data.breadcrumb || newBreadcrumb) {
      const data = route.snapshot.data.breadcrumb ? route.snapshot.data.breadcrumb : newBreadcrumb;
      const breadcrumb = (JSON.parse(JSON.stringify(data)));
      breadcrumb.map((crumb) => {

        const urlChunks = crumb.url.split('/');
        for (const chunk of urlChunks) {
          if (chunk.includes(':')) {
            const paramID = chunk.replace(':', '');
            // const routerParamID = route.snapshot.params[paramID];
            const routerParamID = this.params[paramID];
            crumb.url = crumb.url.replace(`:${paramID}`, routerParamID);
          }
        }

        const labelParams = crumb.label.match(/[^{{]+(?=\}})/g);
        if (labelParams) {
          for (const labelParam of labelParams) {
            // const routerParamID = route.snapshot.params[labelParam.trim()];
            const routerParamID = this.params[labelParam.trim()];
            if (routerParamID) {
              crumb.label = crumb.label.replace('{{' + labelParam + '}}', routerParamID);
            } else {
              // crumb.label = crumb.label.replace('{{' + labelParam + '}}', '');
            }
          }
        }

      });
      this.breadcrumb = breadcrumb;
    } else {
      this.breadcrumb = [];
    }
  }

  openLink(url: string) {
    this.router.navigate([url], { state: history.state });
  }
}
