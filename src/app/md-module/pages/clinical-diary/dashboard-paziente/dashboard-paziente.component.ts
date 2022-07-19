import { Component, OnInit } from '@angular/core';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import {catchError, map} from "rxjs/operators";
import {PersistenzaResponse} from "../../../../services/api/msd/model/PersistenzaResponse";
import {GetPatologiePazienteResponse} from "../../../../services/api/msd/model/getPatologiePazienteResponse";
import {dataParamVitali} from "../../../../services/api/msd/model/dataParamVitali";
import {responseClassicTable,} from "../../../../services/api/msd/model/responseClassicTable";
import {responseTable} from "../../../../services/api/msd/model/responseTable";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {of} from "rxjs";
import {DashboardPazienteControllerService} from "../../../../services/api/msd/api/dashboardPazienteController.service";
import {ProfileService} from "../../../../../infrastructure/fidcare/services/profile.service";
import {numberResponse} from "../../../../services/api/msd/model/numberResponse";
import {AbitudiniLineChart} from "../../../../services/api/msd/model/AbitudiniLineChart";

@Component({
  selector: 'app-dashboard-paziente',
  templateUrl: './dashboard-paziente.component.html',
  styleUrls: ['./dashboard-paziente.component.scss']
})
export class DashboardPazienteComponent implements OnInit {

  aderenzaPaziente:number=0;
  rilevazionePaziente:number=0;
  patologiePaziente:GetPatologiePazienteResponse[];
  parametriVitali:dataParamVitali[];
  persistenza:object[]=[];
  renderPersistenza:boolean=false;
  alert:responseClassicTable[];
  responseTable:responseTable[];
  isLoading = false;
  aderenzaName="aderenza"
  renderAderenza=false;
  renderPatologie=false;
  renderParametriVitali=false;
  renderAlert=false;
  renderTable=false;
  renderRilevazione=false;
  columns: number = 1;
  categories:string[]=[];
  annotations:object={};
  idPaziente:string="";



  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({ matches }) => {
        if (matches) {
          return [
            { title: 'Card 1', cols: 1, rows: 1 },
            { title: 'Card 2', cols: 1, rows: 1 },
            { title: 'Card 3', cols: 1, rows: 1 },
            { title: 'Card 4', cols: 1, rows: 1 },
            { title: 'Card 5', cols: 1, rows: 1 },
            { title: 'Card 6', cols: 1, rows: 1 },
            { title: 'Card 7', cols: 1, rows: 1 }
          ];
        }

        return [
          { title: 'PATOLOGIE', cols: 0.5, rows: 1 },
          { title: 'PERSISENZA ALLA TERAPIA', cols: 1, rows: 1 },
          { title: 'TABELLA', cols: 0.5, rows: 1 },
          { title: 'ADERENZA DEL PAZIENTE', cols: 1, rows: 1 },
          { title: 'PARAMETRI VITALI', cols: 1, rows: 1 },
          { title: 'NUMERO DI RILEVAZIONI SETTIMANALI', cols: 1, rows: 1 },
          { title: 'ALERT GENERATI', cols: 1, rows: 1 }
        ];
      })
  );

  constructor(private readonly pazienteService: DashboardPazienteControllerService, private breakpointObserver:BreakpointObserver,private profileService:ProfileService) {
    this.isLoading=true;

  }
  ngOnInit(): void {

    this.getProfile();

  }

  getAllData(){
    this.getAderenzaAndRilevazione();
    this.getPatologie();
    this.getParametriVitali()
    this.getAlert()
    this.getTable();
    this.getPersistenza();
  }

  getAderenzaAndRilevazione(){
    console.log(this.idPaziente)
    this.isLoading=true;
    this.pazienteService.getAderenzaUsingPost(this.idPaziente).pipe(
        catchError((err) => {
          console.error(err);
          this.isLoading = false;
          return of([]);
        })
    ).subscribe((res:numberResponse) =>{
      this.aderenzaPaziente=res.value;
      this.aderenzaName="aderenza"
      this.renderAderenza=true;
    });
    this.pazienteService.getRilevazioneUsingPost(this.idPaziente).pipe(
        catchError((err) => {
          console.error(err);
          this.isLoading = false;
          return of([]);
        })
    ).subscribe((res:numberResponse) =>{
      this.rilevazionePaziente=res.value;
      this.renderRilevazione=true;
    });
  }
  getPatologie(){
    this.isLoading=true;
    this.pazienteService.getPatologieUsingPost(this.idPaziente).pipe(
        catchError((err) => {
          console.error(err);
          this.isLoading = false;
          return of([]);
        })
    ).subscribe((res:GetPatologiePazienteResponse[]) =>{
      console.log(res)
      this.patologiePaziente=res;
      this.renderPatologie=true;
    });
  }
  getParametriVitali(){
    this.isLoading=true;
    this.pazienteService.getParametriVitaliUsingPost(this.idPaziente).pipe(
        catchError((err) => {
          console.error(err);
          this.isLoading = false;
          return of([]);
        })
    ).subscribe((res:AbitudiniLineChart) =>{
      console.log(res)
      this.parametriVitali=res.param;
      this.categories=res.categories;
      this.renderParametriVitali=true;
    });
  }
  getAlert(){
    this.isLoading=true;
    this.pazienteService.getAlertUsingPost(this.idPaziente).pipe(
        catchError((err) => {
          console.error(err);
          this.isLoading = false;
          return of([]);
        })
    ).subscribe((res:responseClassicTable[]) =>{
      this.alert=res;
      this.renderAlert=true;
    });
  }
  getTable(){
    this.isLoading=true;
    this.pazienteService.getTableUsingPost(this.idPaziente).pipe(
        catchError((err) => {
          console.error(err);
          this.isLoading = false;
          return of([]);
        })
    ).subscribe((res:responseTable[]) =>{
      this.responseTable=res;
      this.renderTable=true;
    });
  }
  getPersistenza(){
    this.isLoading=true;
    this.pazienteService.getPersistenzaUsingPost(this.idPaziente).pipe(
        catchError((err) => {
          console.error(err);
          this.isLoading = false;
          return of([]);
        })
    ).subscribe((res:PersistenzaResponse[]) =>{
      let xAxisTemp=[];
      for(var i=0;i<res.length;i++){
        this.persistenza.push({name:res[i].name,data:res[i].data});
        xAxisTemp.push({x: new Date(res[i].fineTerapia).getTime(),
          strokeDashArray: 0,
          borderColor: "#775DD0",
          label: {
            borderColor: "#775DD0",
            style: {
              color: "#fff",
              background: "#775DD0"
            },
            text: res[i].name
          }})
      }
      this.annotations={xaxis:xAxisTemp}
      this.renderPersistenza=true;

    });
  }
  getProfile() {
    this.profileService.loadUserProfile().pipe(
        catchError((err) => {
          console.error(err);
          this.isLoading = false;
          return of([]);
        })
    ).subscribe((res:Profile) => {
      this.idPaziente=res.userId;
      this.getAllData();

    });
  }

}
