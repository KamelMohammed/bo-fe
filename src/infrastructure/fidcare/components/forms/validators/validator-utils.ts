import { CustomValidationErrors } from './models';
import moment from 'moment';

export class ValidatorMessagesUtils {
    public static required(isArray: boolean): CustomValidationErrors {
        if (isArray) {
            return { requiredArray: [] };
        }
        else {
            return { required: [] };
        }
    }
    public static integer(isArray: boolean): CustomValidationErrors {
        if (isArray) {
            return { integerArray: [] };
        }
        else {
            return { integer: [] };
        }
    }
    public static hours(isArray: boolean): CustomValidationErrors {
        if (isArray) {
            return { hoursArray: [] };
        }
        else {
            return { hours: [] };
        }
    }
    public static minutes(isArray: boolean): CustomValidationErrors {
        if (isArray) {
            return { minutesArray: [] };
        }
        else {
            return { minutes: [] };
        }
    }
    public static seconds(isArray: boolean): CustomValidationErrors {
        if (isArray) {
            return { secondsArray: [] };
        }
        else {
            return { seconds: [] };
        }
    }
    public static date(isArray: boolean): CustomValidationErrors {
        if (isArray) {
            return { dateArray: [] };
        }
        else {
            return { date: [] };
        }
    }
    public static decimal(isArray: boolean): CustomValidationErrors {
        if (isArray) {
            return { decimalArray: [] };
        }
        else {
            return { decimal: [] };
        }
    }
    public static decimalInvalidDigits(digits: number, isArray): CustomValidationErrors {
        if (isArray) {
            return { decimalInvalidDigitsArray: [digits] };
        }
        else {
            return { decimalInvalidDigits: [digits] };
        }
    }

    public static maximum(value: any, isArray): CustomValidationErrors {
        if (isArray) {
            return { maximumArray: [value] };
        }
        else {
            return { maximum: [value] };
        }
    }

    public static exclusiveMaximum(value: any, isArray): CustomValidationErrors {
        if (isArray) {
            return { exclusiveMaximumArray: [value] };
        }
        else {
            return { exclusiveMaximum: [value] };
        }
    }

    public static minimum(value: any, isArray): CustomValidationErrors {
        if (isArray) {
            return { minimumArray: [value] };
        }
        else {
            return { minimum: [value] };
        }
    }

    public static exclusiveMinimum(value: any, isArray): CustomValidationErrors {
        if (isArray) {
            return { exclusiveMinimumArray: [value] };
        }
        else {
            return { exclusiveMinimum: [value] };
        }
    }

    public static minLengthString(num: number, isArray): CustomValidationErrors {
        if (isArray) {
            return { minLengthStringArray: [num] };
        }
        else {
            return { minLengthString: [num] };
        }
    }


    public static maxLengthString(num: number, isArray): CustomValidationErrors {
        if (isArray) {
            return { maxLengthStringArray: [num] };
        }
        else {
            return { maxLengthString: [num] };
        }
    }

    public static mustBeTrue(): CustomValidationErrors {
        return { mustBeTrue: [] };
    }
    public static regex(isArray): CustomValidationErrors {
        if (isArray) {
            return { regexArray: [] };
        }
        else {
            return { regex: [] };
        }
    }


    public static mustMatch(label: string): CustomValidationErrors | null {
        return { mustMatch: [label] };
    }
}

export class ValidatorFunctions {
    public static regex(value: string, regex: string): boolean {
        const regexp = new RegExp(regex);
        if (!regexp.test(value)) {
            return false;
        }
        return true;
    }

    public static isInteger(value: any): boolean {
        if (isNaN(value)) {
            return false;
        }
        if (Math.trunc(value) != value) {
            return false;
        }
        return true;
    }

    public static isDecimal(value: any): boolean {
        if (isNaN(value)) {
            return false;
        }
        return true;
    }

    public static numOfDecimals(value: any, numOfDecimals: number): boolean {
        if (isNaN(value)) {
            return false;
        }
        if (value) {
            if (Math.trunc(value) != value) {
                if (value.toString().split('.')[1].length > numOfDecimals) {
                    return false;
                }
            }
        }
        return true;
    }
    public static isDate(value, isArray: boolean): CustomValidationErrors | null {
        if (value) {
            //Parse let hours
            let momentValue = moment.utc(value);
            if (!momentValue.isValid()) {
                if (!ValidatorFunctions.checkTimeParts((<string>value).substr(10, 4), "T", [":"], 23)) {
                    return ValidatorMessagesUtils.hours(isArray);
                }
                if (!ValidatorFunctions.checkTimeParts((<string>value).substr(14, 4), ":", [":"], 59)) {
                    return ValidatorMessagesUtils.minutes(isArray);
                }
                if (!ValidatorFunctions.checkTimeParts((<string>value).substr(14, 4), ":", [".", "+", "Z"], 59)) {
                    return ValidatorMessagesUtils.seconds(isArray);
                }
                return ValidatorMessagesUtils.date(isArray);
            }
        }
        return null;
    };

    private static checkTimeParts(value: string, startSeparator: string, endSeparators: string[], maxValue: number): boolean {
        if (value.startsWith(startSeparator) && endSeparators.indexOf(value.substr(3, 1)) >= 0) {
            let intValue = parseInt(value.substr(1, 2));
            if (!isNaN(intValue) && intValue >= 0 && intValue <= maxValue) {
                return true;
            }
        }
        return false;
    }

}