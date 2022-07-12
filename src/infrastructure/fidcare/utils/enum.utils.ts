import moment from 'moment'
import { SelectListitem } from '../models/common.models';
import { TranslateService } from '@ngx-translate/core';

// @dynamic
export class EnumUtils {
    public static toSelectListitems = <T>(enumType: T, enumName: string, translateService: TranslateService): SelectListitem[] => {
        let ret = [];
        for (let prop in enumType) {
            ret.push(new SelectListitem(enumType[prop], translateService.instant(`enums.${enumName}.${prop}`)));
        }
        return ret;
    }

}