export * from './activePrinciple.service';
import { ActivePrincipleService } from './activePrinciple.service';
export * from './basicErrorController.service';
import { BasicErrorControllerService } from './basicErrorController.service';
export * from './drugs.service';
import { DrugsService } from './drugs.service';
export * from './imports.service';
import { ImportsService } from './imports.service';
export const APIS = [ActivePrincipleService, BasicErrorControllerService, DrugsService, ImportsService];
