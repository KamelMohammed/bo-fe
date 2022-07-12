import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { KeyValue } from "../models/common.models";

declare module '@angular/forms' {
    interface AbstractControl {
        isValid(): boolean;
        clear(): void;
        getKeyValues(): { [id: string]: KeyValue[] }
    }
}
AbstractControl.prototype.isValid = function () {
    if (!this.valid) {
        this.markAllAsTouched();
    }
    return this.valid;
}

AbstractControl.prototype.clear = function () {
    let formArray = <FormArray>this;
    while (formArray.length > 0) {
        formArray.removeAt(0);
    }
}


AbstractControl.prototype.getKeyValues = function () {
    return get(this);
    function get(control: AbstractControl, parentPath: string = ''): { [id: string]: KeyValue[] } {
        let ret: { [id: string]: KeyValue[] } = {};
        if (parentPath.startsWith('.')) {
            parentPath = parentPath.substring(1);
        }
        if (control instanceof FormGroup) {
            Object.keys(control.controls).forEach(key => {
                ret = { ...ret, ...get(control.controls[key], `${parentPath}.${key}`) }
            });
        }
        if (control instanceof FormArray) {
            const arrayControl = <FormArray>control
            for (let i = 0; i < arrayControl.controls.length; i++) {
                ret = { ...ret, ...get(control.controls[i], `${parentPath}[${i}]`) };
            }
        }
        if (control instanceof FormControl) {
            const keyValues = control["keyValues"];
            if (keyValues != null && keyValues.any()) {
                ret[parentPath] = <KeyValue[]>keyValues;
            }
        }
        return ret;
    }
}