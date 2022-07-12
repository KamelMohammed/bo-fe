import { NgControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[disable]'
})
export class DisableFormControlDirective {
    private _disable:boolean = false;
    @Input() 
    set disable(condition: boolean) {
        this._disable = condition;
        this.setState();
    }
    get disable() {
        return this._disable;
    }
    
    private _disableValue:any = null;
    private _clearValue: boolean = false;
    @Input() 
    set disableValue(value:any) {
        this._disableValue = value;
        this._clearValue = true;
        this.setState();
    }
    get disableValue() {
        return this._disableValue;
    }

    constructor(private _ngControl: NgControl) {
    }


    private setState = ():void=>{
        if(this.disable) {
          this._ngControl.control.disable();
          if(this._clearValue){
              this._ngControl.control.setValue(this.disableValue);
          }
        }
        else {
            this._ngControl.control.enable();
        }
    }
}