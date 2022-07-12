import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidatorMessagesUtils } from './validator-utils';
import { CustomValidationErrors } from './models';

// @dynamic
export class StringValidators {
    public static minLength = (minLength: number, isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || control.value[i].length < minLength) {
                            return ValidatorMessagesUtils.minLengthString(minLength, true);
                        }
                    }
                }
                else {
                    if (control.value.length < minLength) {
                        return ValidatorMessagesUtils.minLengthString(minLength, false);
                    }
                }
            }
            return null;
        };
    }
    public static maxLength = (maxLength: number, isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || control.value[i].length > maxLength) {
                            return ValidatorMessagesUtils.maxLengthString(maxLength, true);
                        }
                    }
                }
                else {
                    if (control.value.length > maxLength) {
                        return ValidatorMessagesUtils.maxLengthString(maxLength, false);
                    }
                }
            }
            return null;
        };
    }
}
