import { AbstractControl } from '@angular/forms';

export declare type CustomValidationErrors = {
    [key: string]: any[];
};
export declare type CustomValidationErrorFunc = {
    (control: AbstractControl): CustomValidationErrors | null;
}