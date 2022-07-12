import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidatorMessagesUtils } from './validator-utils';
import { CustomValidationErrors, CustomValidationErrorFunc } from './models';

export class BooleanValidators {
    public static mustBeTrue(control: AbstractControl): CustomValidationErrors | null {
        if (control.value != null && control.value === false) {
            return ValidatorMessagesUtils.mustBeTrue();
        }
        return null;
    }
}
