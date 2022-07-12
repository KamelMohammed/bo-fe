import { Pipe, PipeTransform } from '@angular/core';
import { DatetimeUtils } from '../utils/datetime.utils';

@Pipe({ name: 'date' })
export class DatePipe implements PipeTransform {
    transform(value: string): string {
        if (value) {
            return DatetimeUtils.toDate(value);
        }
        return null;
    }
}
@Pipe({ name: 'fulldate' })
export class FullDatePipe implements PipeTransform {
    transform(value: string): string {
        if (value) {
            return DatetimeUtils.toFullDate(value);
        }
        return null;
    }
}

@Pipe({ name: 'datetime' })
export class DateTimePipe implements PipeTransform {
    transform(value: string): string {
        if (value) {
            return DatetimeUtils.toDateTime(value);
        }
        return null;
    }
}

@Pipe({ name: 'time' })
export class TimePipe implements PipeTransform {
    transform(value: string): string {
        if (value) {
            return DatetimeUtils.toTime(value);
        }
        return null;
    }
}

@Pipe({ name: 'smalltime' })
export class SmallTimePipe implements PipeTransform {
    transform(value: string): string {
        if (value) {
            return DatetimeUtils.toSmallTime(value);
        }
        return null;
    }
}