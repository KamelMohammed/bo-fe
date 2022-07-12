import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FuseNavigationService } from 'infrastructure/@fuse/components/navigation/navigation.service';
import { FuseNavigationItem } from 'infrastructure/@fuse/components/navigation/navigation.types';
import { FuseVerticalNavigationComponent } from 'infrastructure/@fuse/components/navigation/vertical/vertical.component';
import { FuseMediaWatcherService } from 'infrastructure/@fuse/services/media-watcher/media-watcher.service';
import { TitleService } from 'infrastructure/fidcare/services/title.service';
import { delay, filter, map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { pipe, Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { navigation } from 'app/navigation';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';

@Component({
    selector: 'classic-layout',
    templateUrl: './classic.component.html',
    styleUrls: ['./classic.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ClassicLayoutComponent implements OnInit, OnDestroy {
    public isScreenSmall: boolean;
    public navigationItems: FuseNavigationItem[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public title: string = null;
    private _userRoles: string[] = [];
    /**
     * Constructor
     */
    constructor(
        private _titleService: TitleService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _profileService: ProfileService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._profileService.profile$.pipe(takeUntil(this._unsubscribeAll)).subscribe(profile => {
            this._userRoles = profile.roles;
        });

        this._activatedRoute.data.pipe(takeUntil(this._unsubscribeAll)).subscribe(m => {
            this.navigationItems = this.getNavigationItems(navigation.get(m.name));
        });

        this._router.events.pipe(takeUntil(this._unsubscribeAll))
            .pipe(filter(f =>
                f instanceof NavigationEnd
            ))
            .pipe(mergeMap(m => this._activatedRoute.data))
            .subscribe(result => {
                this.navigationItems = this.getNavigationItems(navigation.get(result.name));
            })

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

        this._titleService.title$
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(delay(0), tap(result => {
                this.title = result;
            })).subscribe();

    }

    private getNavigationItems = (items: FuseNavigationItem[]): FuseNavigationItem[] => {
        const ret: FuseNavigationItem[] = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemRoles = item.roles || [];
			if (!items.any || (item.roles && item.roles.any && !itemRoles.innerJoin(this._userRoles, ir => ir, ur => ur, (ir, ur) => ir).any())) {
                continue;
            }
            const itemChildren = item.children || [];
            if ((itemChildren || []).any()) {
                item.children = this.getNavigationItems(item.children)
                if (!item.children.any()) {
                    continue;
                }
            }
            ret.push(item);
        }
        return ret;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
