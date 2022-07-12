import { TranslateService } from '@ngx-translate/core';
import moment from 'moment'
import { SelectListitem } from '../models/common.models';

// @dynamic
export class DatetimeUtils {
    public static utcNow = (): string => {
        return moment.utc().toISOString();
    }

    public static toDate = (value: string, isUtc: boolean = true): string => {
        if (value) {
            if (isUtc) {
                return moment.utc(value).local().format('L');
            }
            else {
                return moment(value, "YYYY-MM-DD").format('L');
            }
        }
        return value;
    }

    public static toFullDate = (value: string, isUtc: boolean = true): string => {
        if (value) {
            if (isUtc) {
                return moment.utc(value).local().format('LL');
            }
            else {
                return moment(value, "YYYY-MM-DD").format('LL');
            }
        }
        return value;
    }

    public static toDateTime = (value: string): string => {
        if (value) {
            return moment.utc(value).local().format('L LTS');
        }
        return value;
    }

    public static toTime = (value: string): string => {
        if (value) {
            return moment.utc(value).local().format('LTS');
        }
        return value;
    }

    public static toSmallTime = (value: string): string => {
        if (value) {
            return moment.utc(value).local().format('LT');
        }
        return value;
    }

    public static dayNamesSelectListitems = (translateService: TranslateService): SelectListitem[] => {
        const ret: SelectListitem[] = [];
        for (let i = 0; i < 7; i++) {
            ret.push({ id: i, label: translateService.instant(`enums.Days.${i}`) });
        }
        return ret;
    }
}