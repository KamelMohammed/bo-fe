import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidatorMessagesUtils, ValidatorFunctions } from './validator-utils';
import { CustomValidationErrors, CustomValidationErrorFunc } from './models';

// @dynamic
export class CommonValidators {
    public static required(control: AbstractControl): CustomValidationErrors | null {
        if (control.value == null || control.value.toString().trim() == '') {
            return ValidatorMessagesUtils.required(false);
        }
        return null;
    };

    public static requiredArray(control: AbstractControl): CustomValidationErrors | null {
        if (control.value != null) {
            for (let i = 0; i < control.value.length; i++) {
                if (control.value[i] == null || control.value[i].toString().trim() == '') {
                    return ValidatorMessagesUtils.required(true);
                }
            }
        }
        return null;
    };

    public static requiredIf(condition: () => boolean): CustomValidationErrorFunc | null {
        let func = (control: AbstractControl): CustomValidationErrors | null => {
            try {
                if (!condition()) {
                    return null;
                }
            }
            catch (ex) {
                return null;
            }
            return CommonValidators.required(control);
        }
        return func;
    }
    public static regex(regex: string, isArray: boolean = false): ValidatorFn {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        const value = control.value[i];
                        if (!ValidatorFunctions.regex(value, regex)) {
                            return ValidatorMessagesUtils.regex(true);
                        }
                    }
                }
                else {
                    if (!ValidatorFunctions.regex(control.value, regex)) {
                        return ValidatorMessagesUtils.regex(false);
                    }
                }
                return null;
            }
        };
    }

    public static mustMatch(otherControl: () => AbstractControl, label: string): CustomValidationErrorFunc | null {
        let func = (control: AbstractControl): CustomValidationErrors | null => {
            if (!control || !control.parent) {
                return null;
            }
            if (control.value != otherControl().value) {
                return ValidatorMessagesUtils.mustMatch(label);
            }
            return null;
        }
        return func;
    }
}
