export * from './activeAlertResource.service';
import { ActiveAlertResourceService } from './activeAlertResource.service';
export * from './medicalRecordAlertConfigResource.service';
import { MedicalRecordAlertConfigResourceService } from './medicalRecordAlertConfigResource.service';
export const APIS = [ActiveAlertResourceService, MedicalRecordAlertConfigResourceService];
