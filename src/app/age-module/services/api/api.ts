export * from './agendaSubmissions.service';
import { AgendaSubmissionsService } from './agendaSubmissions.service';
export * from './agendaTemplate.service';
import { AgendaTemplateService } from './agendaTemplate.service';
export * from './basicErrorController.service';
import { BasicErrorControllerService } from './basicErrorController.service';
export const APIS = [AgendaSubmissionsService, AgendaTemplateService, BasicErrorControllerService];
