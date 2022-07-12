export * from './basicErrorController.service';
import { BasicErrorControllerService } from './basicErrorController.service';
export * from './medicalRecord.service';
import { MedicalRecordService } from './medicalRecord.service';
export * from './operationHandler.service';
import { OperationHandlerService } from './operationHandler.service';
export * from './webMvcLinksHandler.service';
import { WebMvcLinksHandlerService } from './webMvcLinksHandler.service';
export const APIS = [BasicErrorControllerService, MedicalRecordService, OperationHandlerService, WebMvcLinksHandlerService];
