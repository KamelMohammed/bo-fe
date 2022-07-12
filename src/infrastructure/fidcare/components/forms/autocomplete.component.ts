import { Component, Input, Optional, Host, SkipSelf, EventEmitter, Inject, OnDestroy, Output, forwardRef } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputComponent } from './base-input.component';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { debounceTime, catchError, tap, delay, mergeMap } from 'rxjs/operators';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    selector: 'autocomplete',
    templateUrl: './autocomplete.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AutocompleteComponent),
        multi: true,
    }],
    styleUrls: ["./autocomplete.component.scss"]
})

export class AutocompleteComponent extends BaseInputComponent implements OnDestroy {
    @Input() public loader: (value: string) => Observable<any[]>;
    @Input() public itemKey: string = "id";
    @Input() public itemLabel: string = "label";
    @Input() public minChars: number = 3;
    @Input() public actionItems: AutocompleteActionItem[] = [];
    @Input() public resetOnItemSelected: boolean = false;
    @Input() public set initialItem(value: any) {
        if (value != null) {
            this.initialText = value[this.itemLabel];
        }
    }
    @Output() public onSelectedItem: EventEmitter<any> = new EventEmitter<any>()

    public loading: boolean = false;
    public items: Observable<any[]>;
    public initialText: string = null;
    public changed: boolean = false;
    private textChanged: EventEmitter<string> = new EventEmitter<string>();
    private valueChangedSubscription: Subscription;
    public show$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

    public get visibleActionItems() {
        return this.actionItems.filter(f => f.visible == true);
    }


    constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents) {
        super(controlContainer, translateService, configuration);
        this.show$.next(true);
    }
    ngOnDestroy(): void {
        if (this.valueChangedSubscription) {
            this.valueChangedSubscription.unsubscribe();
            this.valueChangedSubscription = null;
        }
    }

    protected toInternalFormat(value: string): string {
        return value;
    }

    protected toExternalFormat(value: string): string {
        return value;
    }

    public onTextChange = (value: string): void => {
        this.changed = true;
        if (this.value != null) {
            this.value = null;
        }
        this.textChanged.emit(value);
    }

    protected initialize = (): void => {
        this.items = this.textChanged.pipe(
            debounceTime(300),
            mergeMap(value => {
                if (value.length >= this.minChars) {
                    this.loading = true;
                    return this.loader(value).pipe(tap(_ => {
                        this.loading = false;
                    }));
                }
                return of([]);
            }),
            catchError(err => {
                return of([]);
            })
        );
        if (this.control) {
            this.control.valueChanges.pipe(debounceTime(1), tap(value => {
                if (value == null) {
                    this.changed = true;
                }
            })).subscribe();
        }
    }

    public displayValue = (value: any): string => {
        if (this.changed) {
            return value != null ? value[this.itemLabel] : null;
        }
        return this.initialText;
    }

    public onSelect = (value: any): void => {
        this.value = value[this.itemKey];
        this.onSelectedItem.emit(value);
        if (this.resetOnItemSelected) {
            of(delay(1)).pipe(tap(() => {
                this.show$.next(false);
            })).pipe(delay(1)).pipe(tap(() => {
                this.show$.next(true);
            })).subscribe();
        }
    }
}

export class AutocompleteActionItem {
    public label: string = null;
    public callback: () => void = null;
    public visible: boolean = true;
}
