import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidatorMessagesUtils } from './validator-utils';
import { CustomValidationErrors } from './models';

// @dynamic
export class ArrayValidators {
    public static minLength = (minLength: number): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null && control.value.length < minLength) {
                return { minLengthArray: [minLength] };
            }
            return null;
        };
    }
    public static maxLength = (maxLength: number): ValidatorFn => {
        return (control: AbstractControl): CustomValidationErrors | null => {
            if (control.value != null && control.value.length > maxLength) {
                return { maxLengthArray: [maxLength] };
            }
            return null;
        };
    }
}
