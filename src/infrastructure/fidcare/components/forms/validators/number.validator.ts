import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidatorMessagesUtils, ValidatorFunctions } from './validator-utils';
import { CustomValidationErrors } from './models';

// @dynamic
export class NumberValidators {
    public static isInteger(control: AbstractControl, isArray: boolean = false): CustomValidationErrors | null {
        if (control.value != null) {
            if (isArray) {
                for (let i = 0; i < control.value.length; i++) {
                    if (control.value[i] == null || !ValidatorFunctions.isInteger(control.value[i])) {
                        return ValidatorMessagesUtils.integer(true);
                    }
                }
            }
            else {
                if (!ValidatorFunctions.isInteger(control.value)) {
                    return ValidatorMessagesUtils.integer(false);
                }
            }
        }
        return null;
    };
    public static isDecimal = (isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || !ValidatorFunctions.isDecimal(control.value[i])) {
                            return ValidatorMessagesUtils.decimal(true);
                        }
                    }
                }
                else {
                    if (!ValidatorFunctions.isDecimal(control.value)) {
                        return ValidatorMessagesUtils.decimal(false);
                    }
                }
            }
            return null;
        };
    }

    public static numOfDecimals = (numOfDecimals: number, isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || !ValidatorFunctions.numOfDecimals(control.value[i], numOfDecimals)) {
                            return ValidatorMessagesUtils.decimalInvalidDigits(numOfDecimals, true);
                        }
                    }
                }
                else {
                    if (!ValidatorFunctions.numOfDecimals(control.value, numOfDecimals)) {
                        return ValidatorMessagesUtils.decimalInvalidDigits(numOfDecimals, false);
                    }
                }
            }
            return null;
        };
    }

    public static maximum = (num: number, isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || control.value[i] > num) {
                            return ValidatorMessagesUtils.maximum(num, true);
                        }
                    }
                }
                else {
                    if (control.value > num) {
                        return ValidatorMessagesUtils.maximum(num, false);
                    }
                }
            }
            return null;
        };
    }
    public static exclusiveMaximum = (num: number, isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || control.value[i] >= num) {
                            return ValidatorMessagesUtils.exclusiveMaximum(num, true);
                        }
                    }
                }
                else {
                    if (control.value >= num) {
                        return ValidatorMessagesUtils.exclusiveMaximum(num, false);
                    }
                }
            }
            return null;
        };
    }
    public static minimum = (num: number, isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || control.value[i] < num) {
                            return ValidatorMessagesUtils.minimum(num, true);
                        }
                    }
                }
                else {
                    if (control.value < num) {
                        return ValidatorMessagesUtils.minimum(num, false);
                    }
                }
            }
            return null;
        };
    }
    public static exclusiveMinimum = (num: number, isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || control.value[i] <= num) {
                            return ValidatorMessagesUtils.exclusiveMinimum(num, true);
                        }
                    }
                }
                else {
                    if (control.value <= num) {
                        return ValidatorMessagesUtils.exclusiveMinimum(num, false);
                    }
                }
            }
            return null;
        };
    }
}
