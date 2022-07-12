import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidatorFunctions, ValidatorMessagesUtils } from './validator-utils';
import { CustomValidationErrors } from './models';
import { DatetimeUtils } from '../../../utils/datetime.utils';
// @dynamic
export class DateValidators {
    public static isDate(control: AbstractControl, isArray: boolean = false): CustomValidationErrors | null {
        if (isArray) {
            for (let i = 0; i < control.value.length; i++) {
                let result = ValidatorFunctions.isDate(control.value[i], true);
                if (!result == null) {
                    return result;
                }
            }
            return null;
        }
        else {
            return ValidatorFunctions.isDate(control.value, false);
        }
    }


    public static maximumDate = (value: string, isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || control.value[i] > value) {
                            return ValidatorMessagesUtils.maximum(DatetimeUtils.toDate(value), true);
                        }
                    }
                }
                else {
                    if (control.value > value) {
                        return ValidatorMessagesUtils.maximum(DatetimeUtils.toDate(value), false);
                    }
                }
            }
            return null;
        };
    }
    public static exclusiveMaximumDate = (value: string, isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || control.value[i] >= value) {
                            return ValidatorMessagesUtils.exclusiveMaximum(DatetimeUtils.toDate(value), true);
                        }
                    }
                }
                else {
                    if (control.value >= value) {
                        return ValidatorMessagesUtils.exclusiveMaximum(DatetimeUtils.toDate(value), false);
                    }
                }
            }
            return null;
        };
    }
    public static minimumDate = (value: string, isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || control.value[i] < value) {
                            return ValidatorMessagesUtils.minimum(DatetimeUtils.toDate(value), true);
                        }
                    }
                }
                else {
                    if (control.value < value) {
                        return ValidatorMessagesUtils.minimum(DatetimeUtils.toDate(value), false);
                    }
                }
            }
            return null;
        };
    }
    public static exclusiveMinimumDate = (value: string, isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || control.value[i] <= value) {
                            return ValidatorMessagesUtils.exclusiveMinimum(DatetimeUtils.toDate(value), true);
                        }
                    }
                }
                else {
                    if (control.value <= value) {
                        return ValidatorMessagesUtils.exclusiveMinimum(DatetimeUtils.toDate(value), false);
                    }
                }
            }
            return null;
        };
    }




    public static maximumDateTime = (value: string, isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || control.value[i] > value) {
                            return ValidatorMessagesUtils.maximum(DatetimeUtils.toDateTime(value), true);
                        }
                    }
                }
                else {
                    if (control.value > value) {
                        return ValidatorMessagesUtils.maximum(DatetimeUtils.toDateTime(value), false);
                    }
                }
            }
            return null;
        };
    }
    public static exclusiveMaximumDateTime = (value: string, isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || control.value[i] >= value) {
                            return ValidatorMessagesUtils.exclusiveMaximum(DatetimeUtils.toDateTime(value), true);
                        }
                    }
                }
                else {
                    if (control.value >= value) {
                        return ValidatorMessagesUtils.exclusiveMaximum(DatetimeUtils.toDateTime(value), false);
                    }
                }
            }
            return null;
        };
    }
    public static minimumDateTime = (value: string, isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || control.value[i] < value) {
                            return ValidatorMessagesUtils.minimum(DatetimeUtils.toDateTime(value), true);
                        }
                    }
                }
                else {
                    if (control.value < value) {
                        return ValidatorMessagesUtils.minimum(DatetimeUtils.toDateTime(value), false);
                    }
                }
            }
            return null;
        };
    }
    public static exclusiveMinimumDateTime = (value: string, isArray: boolean = false): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null) {
                if (isArray) {
                    for (let i = 0; i < control.value.length; i++) {
                        if (control.value[i] == null || control.value[i] <= value) {
                            return ValidatorMessagesUtils.exclusiveMinimum(DatetimeUtils.toDateTime(value), true);
                        }
                    }
                }
                else {
                    if (control.value <= value) {
                        return ValidatorMessagesUtils.exclusiveMinimum(DatetimeUtils.toDateTime(value), false);
                    }
                }
            }
            return null;
        };
    }
}
