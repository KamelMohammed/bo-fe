import { Input, Output, EventEmitter, OnInit, Component, Inject } from '@angular/core';
import { ControlValueAccessor, ControlContainer, AbstractControl } from '@angular/forms';
import '../../extensions-methods/string.extensions';
import { TranslateService } from '@ngx-translate/core';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    template: ''
})

export class BaseInputComponent<T = string, C = string> implements ControlValueAccessor, OnInit {
    private _value: C = null;
    private _onChange = (_: any) => { };
    private _onTouched = () => { };
    public id: string = null;
    public disabled: boolean = false;
    protected control: AbstractControl = null;
    @Input() public localize: boolean = true;
    @Input() public helpText: string = null;
    @Input() public helpTextLocalize: boolean = true;
    @Input() formControlName: string = null;
    @Output() onValueChanged: EventEmitter<T> = new EventEmitter<T>();
    @Input() showLabel: boolean = true;
    @Input() public label: string = null;
    @Input() public placeHolder: string = null;
    @Input() public icon: string = null;
    @Input() public updateOn: 'blur' | 'change' | 'submit' = 'change';
    @Input() public readonly: boolean = false;
    @Input() public appearance: string = this._configuration.appearance;
    @Input() public floatLabel: string = this._configuration.floatLabel;
	@Input() public required: boolean = false;
    public get correctPlaceHolder() {
        return this.placeHolder || this.label;
    }

    @Input()
    public get value(): C {
        return this._value;
    }
    public set value(value: C) {
        this._value = value;
        let valueToEmit: T = null;
        if (value == null) {
            this._onChange(null);
        }
        else {
            valueToEmit = this.toExternalFormat(value)
            this._onChange(valueToEmit);
        }
        this.onValueChanged.next(valueToEmit);
        this._onTouched();
    }

    constructor(private _controlContainer: ControlContainer, private _translateService: TranslateService, @Inject(FORM_COMPONENTS_TOKEN) private _configuration: IFormComponents) {
        this.id = Date.now().toString() + Math.floor(Math.random() * 99).toString();
    }


    writeValue(value: T): void {
        if (value == null) {
            this._value = null;
        }
        else {
            this._value = this.toInternalFormat(value);
        }
    }


    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public get valid(): boolean {
        return (!this.control || this.control.untouched || !this.control.invalid);
    }

    public get errorMessage(): string {
        if (!this.valid) {
            let fieldLabel = this.label ? this._translateService.instant(this.label) : "";
            for (let prop in this.control.errors) {
                let localizedMessage = this._translateService.instant('validation.' + prop);
				if (localizedMessage == 'validation.' + prop) localizedMessage =  this._translateService.instant(prop);
                localizedMessage = localizedMessage.replace("{fieldName}", fieldLabel);
                return localizedMessage.format(this.control.errors[prop]);
            }
        }
    }

    protected toInternalFormat(value: T): C {
        return null;
    };
    protected toExternalFormat(value: C): T {
        return null;
    };

    ngOnInit(): void {
        if (this._controlContainer && this.formControlName) {
            this.control = this._controlContainer.control.get(this.formControlName);
        }

        this.initialize();
    }

    protected initialize = (): void => { }

}